var Jc = Object.create, Yn = Object.defineProperty, Qc = Object.getOwnPropertyDescriptor, tl = Object.getOwnPropertyNames, el = Object.getPrototypeOf, nl = Object.prototype.hasOwnProperty, I = (n, t) => () => (t || (n((t = { exports: {} }).exports, t), n = null), t.exports), De = (n, t) => {
  let e = {};
  for (var s in n)
    Yn(e, s, {
      get: n[s],
      enumerable: !0
    });
  return Yn(e, Symbol.toStringTag, { value: "Module" }), e;
}, sl = (n, t, e, s) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (var i = tl(t), o = 0, r = i.length, a; o < r; o++)
      a = i[o], !nl.call(n, a) && a !== e && Yn(n, a, {
        get: ((c) => t[c]).bind(null, a),
        enumerable: !(s = Qc(t, a)) || s.enumerable
      });
  return n;
}, il = (n, t, e) => (e = n != null ? Jc(el(n)) : {}, sl(Yn(e, "default", {
  value: n,
  enumerable: !0
}), n));
const Js = {}, xr = [];
function $(n, t) {
  if (Array.isArray(n)) {
    for (const e of n) $(e, t);
    return;
  }
  if (typeof n == "object") {
    for (const e in n) $(e, n[e]);
    return;
  }
  _r(Object.getOwnPropertyNames(t)), Js[n] = Object.assign(Js[n] || {}, t);
}
function yt(n) {
  return Js[n] || {};
}
function ol() {
  return [...new Set(xr)];
}
function _r(n) {
  xr.push(...n);
}
var oe = /* @__PURE__ */ I((n, t) => {
  t.exports = function(e) {
    try {
      return !!e();
    } catch {
      return !0;
    }
  };
}), ls = /* @__PURE__ */ I((n, t) => {
  var e = oe();
  t.exports = !e(function() {
    var s = function() {
    }.bind();
    return typeof s != "function" || s.hasOwnProperty("prototype");
  });
}), ye = /* @__PURE__ */ I((n, t) => {
  var e = ls(), s = Function.prototype, i = s.call, o = e && s.bind.bind(i, i);
  t.exports = e ? o : function(r) {
    return function() {
      return i.apply(r, arguments);
    };
  };
}), Sr = /* @__PURE__ */ I((n, t) => {
  var e = ye();
  t.exports = e({}.isPrototypeOf);
}), $t = /* @__PURE__ */ I((n, t) => {
  var e = function(s) {
    return s && s.Math === Math && s;
  };
  t.exports = e(typeof globalThis == "object" && globalThis) || e(typeof window == "object" && window) || e(typeof self == "object" && self) || e(typeof global == "object" && global) || e(typeof n == "object" && n) || /* @__PURE__ */ function() {
    return this;
  }() || Function("return this")();
}), rl = /* @__PURE__ */ I((n, t) => {
  var e = ls(), s = Function.prototype, i = s.apply, o = s.call;
  t.exports = typeof Reflect == "object" && Reflect.apply || (e ? o.bind(i) : function() {
    return o.apply(i, arguments);
  });
}), hs = /* @__PURE__ */ I((n, t) => {
  var e = ye(), s = e({}.toString), i = e("".slice);
  t.exports = function(o) {
    return i(s(o), 8, -1);
  };
}), Cr = /* @__PURE__ */ I((n, t) => {
  var e = hs(), s = ye();
  t.exports = function(i) {
    if (e(i) === "Function") return s(i);
  };
}), re = /* @__PURE__ */ I((n, t) => {
  var e = typeof document == "object" && document.all;
  t.exports = typeof e > "u" && e !== void 0 ? function(s) {
    return typeof s == "function" || s === e;
  } : function(s) {
    return typeof s == "function";
  };
}), vn = /* @__PURE__ */ I((n, t) => {
  var e = oe();
  t.exports = !e(function() {
    return Object.defineProperty({}, 1, { get: function() {
      return 7;
    } })[1] !== 7;
  });
}), Ti = /* @__PURE__ */ I((n, t) => {
  var e = ls(), s = Function.prototype.call;
  t.exports = e ? s.bind(s) : function() {
    return s.apply(s, arguments);
  };
}), al = /* @__PURE__ */ I((n) => {
  var t = {}.propertyIsEnumerable, e = Object.getOwnPropertyDescriptor, s = e && !t.call({ 1: 2 }, 1);
  n.f = s ? function(o) {
    var r = e(this, o);
    return !!r && r.enumerable;
  } : t;
}), Er = /* @__PURE__ */ I((n, t) => {
  t.exports = function(e, s) {
    return {
      enumerable: !(e & 1),
      configurable: !(e & 2),
      writable: !(e & 4),
      value: s
    };
  };
}), cl = /* @__PURE__ */ I((n, t) => {
  var e = ye(), s = oe(), i = hs(), o = Object, r = e("".split);
  t.exports = s(function() {
    return !o("z").propertyIsEnumerable(0);
  }) ? function(a) {
    return i(a) === "String" ? r(a, "") : o(a);
  } : o;
}), Ar = /* @__PURE__ */ I((n, t) => {
  t.exports = function(e) {
    return e == null;
  };
}), Mi = /* @__PURE__ */ I((n, t) => {
  var e = Ar(), s = TypeError;
  t.exports = function(i) {
    if (e(i)) throw new s("Can't call method on " + i);
    return i;
  };
}), Tr = /* @__PURE__ */ I((n, t) => {
  var e = cl(), s = Mi();
  t.exports = function(i) {
    return e(s(i));
  };
}), wn = /* @__PURE__ */ I((n, t) => {
  var e = re();
  t.exports = function(s) {
    return typeof s == "object" ? s !== null : e(s);
  };
}), ki = /* @__PURE__ */ I((n, t) => {
  t.exports = {};
}), ll = /* @__PURE__ */ I((n, t) => {
  var e = ki(), s = $t(), i = re(), o = function(r) {
    return i(r) ? r : void 0;
  };
  t.exports = function(r, a) {
    return arguments.length < 2 ? o(e[r]) || o(s[r]) : e[r] && e[r][a] || s[r] && s[r][a];
  };
}), hl = /* @__PURE__ */ I((n, t) => {
  var e = $t().navigator, s = e && e.userAgent;
  t.exports = s ? String(s) : "";
}), dl = /* @__PURE__ */ I((n, t) => {
  var e = $t(), s = hl(), i = e.process, o = e.Deno, r = i && i.versions || o && o.version, a = r && r.v8, c, l;
  a && (c = a.split("."), l = c[0] > 0 && c[0] < 4 ? 1 : +(c[0] + c[1])), !l && s && (c = s.match(/Edge\/(\d+)/), (!c || c[1] >= 74) && (c = s.match(/Chrome\/(\d+)/), c && (l = +c[1]))), t.exports = l;
}), Mr = /* @__PURE__ */ I((n, t) => {
  var e = dl(), s = oe(), i = $t().String;
  t.exports = !!Object.getOwnPropertySymbols && !s(function() {
    var o = Symbol("symbol detection");
    return !i(o) || !(Object(o) instanceof Symbol) || !Symbol.sham && e && e < 41;
  });
}), kr = /* @__PURE__ */ I((n, t) => {
  var e = Mr();
  t.exports = e && !Symbol.sham && typeof Symbol.iterator == "symbol";
}), Nr = /* @__PURE__ */ I((n, t) => {
  var e = ll(), s = re(), i = Sr(), o = kr(), r = Object;
  t.exports = o ? function(a) {
    return typeof a == "symbol";
  } : function(a) {
    var c = e("Symbol");
    return s(c) && i(c.prototype, r(a));
  };
}), ul = /* @__PURE__ */ I((n, t) => {
  var e = String;
  t.exports = function(s) {
    try {
      return e(s);
    } catch {
      return "Object";
    }
  };
}), Rr = /* @__PURE__ */ I((n, t) => {
  var e = re(), s = ul(), i = TypeError;
  t.exports = function(o) {
    if (e(o)) return o;
    throw new i(s(o) + " is not a function");
  };
}), fl = /* @__PURE__ */ I((n, t) => {
  var e = Rr(), s = Ar();
  t.exports = function(i, o) {
    var r = i[o];
    return s(r) ? void 0 : e(r);
  };
}), pl = /* @__PURE__ */ I((n, t) => {
  var e = Ti(), s = re(), i = wn(), o = TypeError;
  t.exports = function(r, a) {
    var c, l;
    if (a === "string" && s(c = r.toString) && !i(l = e(c, r)) || s(c = r.valueOf) && !i(l = e(c, r)) || a !== "string" && s(c = r.toString) && !i(l = e(c, r))) return l;
    throw new o("Can't convert object to primitive value");
  };
}), ml = /* @__PURE__ */ I((n, t) => {
  t.exports = !0;
}), gl = /* @__PURE__ */ I((n, t) => {
  var e = $t(), s = Object.defineProperty;
  t.exports = function(i, o) {
    try {
      s(e, i, {
        value: o,
        configurable: !0,
        writable: !0
      });
    } catch {
      e[i] = o;
    }
    return o;
  };
}), Pr = /* @__PURE__ */ I((n, t) => {
  var e = ml(), s = $t(), i = gl(), o = "__core-js_shared__", r = t.exports = s[o] || i(o, {});
  (r.versions || (r.versions = [])).push({
    version: "3.49.0",
    mode: e ? "pure" : "global",
    copyright: "© 2013–2025 Denis Pushkarev (zloirock.ru), 2025–2026 CoreJS Company (core-js.io). All rights reserved.",
    license: "https://github.com/zloirock/core-js/blob/v3.49.0/LICENSE",
    source: "https://github.com/zloirock/core-js"
  });
}), yl = /* @__PURE__ */ I((n, t) => {
  var e = Pr();
  t.exports = function(s, i) {
    return e[s] || (e[s] = i || {});
  };
}), bl = /* @__PURE__ */ I((n, t) => {
  var e = Mi(), s = Object;
  t.exports = function(i) {
    return s(e(i));
  };
}), Ni = /* @__PURE__ */ I((n, t) => {
  var e = ye(), s = bl(), i = e({}.hasOwnProperty);
  t.exports = Object.hasOwn || function(r, a) {
    return i(s(r), a);
  };
}), vl = /* @__PURE__ */ I((n, t) => {
  var e = ye(), s = 0, i = Math.random(), o = e(1.1.toString);
  t.exports = function(r) {
    return "Symbol(" + (r === void 0 ? "" : r) + ")_" + o(++s + i, 36);
  };
}), xn = /* @__PURE__ */ I((n, t) => {
  var e = $t(), s = yl(), i = Ni(), o = vl(), r = Mr(), a = kr(), c = e.Symbol, l = s("wks"), h = a ? c.for || c : c && c.withoutSetter || o;
  t.exports = function(d) {
    return i(l, d) || (l[d] = r && i(c, d) ? c[d] : h("Symbol." + d)), l[d];
  };
}), wl = /* @__PURE__ */ I((n, t) => {
  var e = Ti(), s = wn(), i = Nr(), o = fl(), r = pl(), a = xn(), c = TypeError, l = a("toPrimitive");
  t.exports = function(h, d) {
    if (!s(h) || i(h)) return h;
    var u = o(h, l), f;
    if (u) {
      if (d === void 0 && (d = "default"), f = e(u, h, d), !s(f) || i(f)) return f;
      throw new c("Can't convert object to primitive value");
    }
    return d === void 0 && (d = "number"), r(h, d);
  };
}), Or = /* @__PURE__ */ I((n, t) => {
  var e = wl(), s = Nr();
  t.exports = function(i) {
    var o = e(i, "string");
    return s(o) ? o : o + "";
  };
}), xl = /* @__PURE__ */ I((n, t) => {
  var e = $t(), s = wn(), i = e.document, o = s(i) && s(i.createElement);
  t.exports = function(r) {
    return o ? i.createElement(r) : {};
  };
}), Ir = /* @__PURE__ */ I((n, t) => {
  var e = vn(), s = oe(), i = xl();
  t.exports = !e && !s(function() {
    return Object.defineProperty(i("div"), "a", { get: function() {
      return 7;
    } }).a !== 7;
  });
}), _l = /* @__PURE__ */ I((n) => {
  var t = vn(), e = Ti(), s = al(), i = Er(), o = Tr(), r = Or(), a = Ni(), c = Ir(), l = Object.getOwnPropertyDescriptor;
  n.f = t ? l : function(d, u) {
    if (d = o(d), u = r(u), c) try {
      return l(d, u);
    } catch {
    }
    if (a(d, u)) return i(!e(s.f, d, u), d[u]);
  };
}), Sl = /* @__PURE__ */ I((n, t) => {
  var e = oe(), s = re(), i = /#|\.prototype\./, o = function(h, d) {
    var u = a[r(h)];
    return u === l ? !0 : u === c ? !1 : s(d) ? e(d) : !!d;
  }, r = o.normalize = function(h) {
    return String(h).replace(i, ".").toLowerCase();
  }, a = o.data = {}, c = o.NATIVE = "N", l = o.POLYFILL = "P";
  t.exports = o;
}), Cl = /* @__PURE__ */ I((n, t) => {
  var e = Cr(), s = Rr(), i = ls(), o = e(e.bind);
  t.exports = function(r, a) {
    return s(r), a === void 0 ? r : i ? o(r, a) : function() {
      return r.apply(a, arguments);
    };
  };
}), El = /* @__PURE__ */ I((n, t) => {
  var e = vn(), s = oe();
  t.exports = e && s(function() {
    return Object.defineProperty(function() {
    }, "prototype", {
      value: 42,
      writable: !1
    }).prototype !== 42;
  });
}), Al = /* @__PURE__ */ I((n, t) => {
  var e = wn(), s = String, i = TypeError;
  t.exports = function(o) {
    if (e(o)) return o;
    throw new i(s(o) + " is not an object");
  };
}), Tl = /* @__PURE__ */ I((n) => {
  var t = vn(), e = Ir(), s = El(), i = Al(), o = Or(), r = TypeError, a = Object.defineProperty, c = Object.getOwnPropertyDescriptor, l = "enumerable", h = "configurable", d = "writable";
  n.f = t ? s ? function(f, p, m) {
    if (i(f), p = o(p), i(m), typeof f == "function" && p === "prototype" && "value" in m && d in m && !m[d]) {
      var g = c(f, p);
      g && g[d] && (f[p] = m.value, m = {
        configurable: h in m ? m[h] : g[h],
        enumerable: l in m ? m[l] : g[l],
        writable: !1
      });
    }
    return a(f, p, m);
  } : a : function(f, p, m) {
    if (i(f), p = o(p), i(m), e) try {
      return a(f, p, m);
    } catch {
    }
    if ("get" in m || "set" in m) throw new r("Accessors not supported");
    return "value" in m && (f[p] = m.value), f;
  };
}), Ml = /* @__PURE__ */ I((n, t) => {
  var e = vn(), s = Tl(), i = Er();
  t.exports = e ? function(o, r, a) {
    return s.f(o, r, i(1, a));
  } : function(o, r, a) {
    return o[r] = a, o;
  };
}), Dr = /* @__PURE__ */ I((n, t) => {
  var e = $t(), s = rl(), i = Cr(), o = re(), r = _l().f, a = Sl(), c = ki(), l = Cl(), h = Ml(), d = Ni();
  Pr();
  var u = function(f) {
    var p = function(m, g, y) {
      if (this instanceof p) {
        switch (arguments.length) {
          case 0:
            return new f();
          case 1:
            return new f(m);
          case 2:
            return new f(m, g);
        }
        return new f(m, g, y);
      }
      return s(f, this, arguments);
    };
    return p.prototype = f.prototype, p;
  };
  t.exports = function(f, p) {
    var m = f.target, g = f.global, y = f.stat, b = f.proto, x = g ? e : y ? e[m] : e[m] && e[m].prototype, C = g ? c : c[m] || h(c, m, {})[m], v = C.prototype, w, _, S, T, A, M, N, R, P;
    for (T in p)
      w = a(g ? T : m + (y ? "." : "#") + T, f.forced), _ = !w && x && d(x, T), M = C[T], _ && (f.dontCallGetSet ? (P = r(x, T), N = P && P.value) : N = x[T]), A = _ && N ? N : p[T], !(!w && !b && typeof M == typeof A) && (f.bind && _ ? R = l(A, e) : f.wrap && _ ? R = u(A) : b && o(A) ? R = i(A) : R = A, (f.sham || A && A.sham || M && M.sham) && h(R, "sham", !0), h(C, T, R), b && (S = m + "Prototype", d(c, S) || h(c, S, {}), h(c[S], T, A), f.real && v && (w || !v[T]) && h(v, T, A)));
  };
}), kl = /* @__PURE__ */ I((n, t) => {
  var e = Math.ceil, s = Math.floor;
  t.exports = Math.trunc || function(o) {
    var r = +o;
    return (r > 0 ? s : e)(r);
  };
}), Lr = /* @__PURE__ */ I((n, t) => {
  var e = kl();
  t.exports = function(s) {
    var i = +s;
    return i !== i || i === 0 ? 0 : e(i);
  };
}), Nl = /* @__PURE__ */ I((n, t) => {
  var e = Lr(), s = Math.max, i = Math.min;
  t.exports = function(o, r) {
    var a = e(o);
    return a < 0 ? s(a + r, 0) : i(a, r);
  };
}), Rl = /* @__PURE__ */ I((n, t) => {
  var e = Lr(), s = Math.min;
  t.exports = function(i) {
    var o = e(i);
    return o > 0 ? s(o, 9007199254740991) : 0;
  };
}), Pl = /* @__PURE__ */ I((n, t) => {
  var e = Rl();
  t.exports = function(s) {
    return e(s.length);
  };
}), Ol = /* @__PURE__ */ I((n, t) => {
  var e = Tr(), s = Nl(), i = Pl(), o = function(r) {
    return function(a, c, l) {
      var h = e(a), d = i(h);
      if (d === 0) return !r && -1;
      var u = s(l, d), f;
      if (r && c !== c) {
        for (; d > u; )
          if (f = h[u++], f !== f) return !0;
      } else for (; d > u; u++) if ((r || u in h) && h[u] === c) return r || u || 0;
      return !r && -1;
    };
  };
  t.exports = {
    includes: o(!0),
    indexOf: o(!1)
  };
}), Il = /* @__PURE__ */ I((n, t) => {
  t.exports = function() {
  };
}), Dl = /* @__PURE__ */ I(() => {
  var n = Dr(), t = Ol().includes, e = oe(), s = Il(), i = e(function() {
    return !Array(1).includes();
  }), o = e(function() {
    return [, 1].includes(void 0, 1);
  });
  n({
    target: "Array",
    proto: !0,
    forced: i || o
  }, { includes: function(a) {
    return t(this, a, arguments.length > 1 ? arguments[1] : void 0);
  } }), s("includes");
}), zr = /* @__PURE__ */ I((n, t) => {
  var e = $t(), s = ki();
  t.exports = function(i, o) {
    var r = s[i + "Prototype"], a = r && r[o];
    if (a) return a;
    var c = e[i], l = c && c.prototype;
    return l && l[o];
  };
}), Ll = /* @__PURE__ */ I((n, t) => {
  Dl();
  var e = zr();
  t.exports = e("Array", "includes");
}), zl = /* @__PURE__ */ I((n, t) => {
  var e = wn(), s = hs(), i = xn()("match");
  t.exports = function(o) {
    var r;
    return e(o) && ((r = o[i]) !== void 0 ? !!r : s(o) === "RegExp");
  };
}), Bl = /* @__PURE__ */ I((n, t) => {
  var e = zl(), s = TypeError;
  t.exports = function(i) {
    if (e(i)) throw new s("The method doesn't accept regular expressions");
    return i;
  };
}), Gl = /* @__PURE__ */ I((n, t) => {
  var e = xn()("toStringTag"), s = {};
  s[e] = "z", t.exports = String(s) === "[object z]";
}), $l = /* @__PURE__ */ I((n, t) => {
  var e = Gl(), s = re(), i = hs(), o = xn()("toStringTag"), r = Object, a = i(/* @__PURE__ */ function() {
    return arguments;
  }()) === "Arguments", c = function(l, h) {
    try {
      return l[h];
    } catch {
    }
  };
  t.exports = e ? i : function(l) {
    var h, d, u;
    return l === void 0 ? "Undefined" : l === null ? "Null" : typeof (d = c(h = r(l), o)) == "string" ? d : a ? i(h) : (u = i(h)) === "Object" && s(h.callee) ? "Arguments" : u;
  };
}), Hl = /* @__PURE__ */ I((n, t) => {
  var e = $l(), s = String;
  t.exports = function(i) {
    if (e(i) === "Symbol") throw new TypeError("Cannot convert a Symbol value to a string");
    return s(i);
  };
}), Fl = /* @__PURE__ */ I((n, t) => {
  var e = xn()("match");
  t.exports = function(s) {
    var i = /./;
    try {
      "/./"[s](i);
    } catch {
      try {
        return i[e] = !1, "/./"[s](i);
      } catch {
      }
    }
    return !1;
  };
}), Ul = /* @__PURE__ */ I(() => {
  var n = Dr(), t = ye(), e = Bl(), s = Mi(), i = Hl(), o = Fl(), r = t("".indexOf);
  n({
    target: "String",
    proto: !0,
    forced: !o("includes")
  }, { includes: function(c) {
    return !!~r(i(s(this)), i(e(c)), arguments.length > 1 ? arguments[1] : void 0);
  } });
}), jl = /* @__PURE__ */ I((n, t) => {
  Ul();
  var e = zr();
  t.exports = e("String", "includes");
}), Yl = /* @__PURE__ */ I((n, t) => {
  var e = Sr(), s = Ll(), i = jl(), o = Array.prototype, r = String.prototype;
  t.exports = function(a) {
    var c = a.includes;
    return a === o || e(o, a) && c === o.includes ? s : typeof a == "string" || a === r || e(r, a) && c === r.includes ? i : c;
  };
}), Xl = /* @__PURE__ */ I((n, t) => {
  var e = Yl();
  t.exports = e;
}), pe = /* @__PURE__ */ il(Xl());
function Ri(n, t) {
  let e;
  const s = n.length, i = [];
  for (e = 0; e < s; e++) i.push(t(n[e]));
  return i;
}
function Wl(n, t) {
  let e;
  const s = n.length, i = [];
  for (e = 0; e < s; e++) t(n[e]) && i.push(n[e]);
  return i;
}
function Ts(n) {
  return n % 360 * Math.PI / 180;
}
function Br(n) {
  return n.replace(/([A-Z])/g, function(t, e) {
    return "-" + e.toLowerCase();
  });
}
function Gr(n) {
  return n.charAt(0).toUpperCase() + n.slice(1);
}
function be(n, t, e, s) {
  return (t == null || e == null) && (s = s || n.bbox(), t == null ? t = s.width / s.height * e : e == null && (e = s.height / s.width * t)), {
    width: t,
    height: e
  };
}
function Qs(n, t) {
  const e = n.origin;
  let s = n.ox != null ? n.ox : n.originX != null ? n.originX : "center", i = n.oy != null ? n.oy : n.originY != null ? n.originY : "center";
  e != null && ([s, i] = Array.isArray(e) ? e : typeof e == "object" ? [e.x, e.y] : [e, e]);
  const o = typeof s == "string", r = typeof i == "string";
  if (o || r) {
    const { height: a, width: c, x: l, y: h } = t.bbox();
    o && (s = (0, pe.default)(s).call(s, "left") ? l : (0, pe.default)(s).call(s, "right") ? l + c : l + c / 2), r && (i = (0, pe.default)(i).call(i, "top") ? h : (0, pe.default)(i).call(i, "bottom") ? h + a : h + a / 2);
  }
  return [s, i];
}
const ql = /* @__PURE__ */ new Set([
  "desc",
  "metadata",
  "title"
]), ti = (n) => ql.has(n.nodeName), Zl = (n, t, e = {}) => {
  const s = { ...t };
  for (const i in s) s[i].valueOf() === e[i] && delete s[i];
  Object.keys(s).length ? n.node.setAttribute("data-svgjs", JSON.stringify(s)) : (n.node.removeAttribute("data-svgjs"), n.node.removeAttribute("svgjs:data"));
}, Pi = "http://www.w3.org/2000/svg", Vl = "http://www.w3.org/1999/xhtml", Ms = "http://www.w3.org/2000/xmlns/", _n = "http://www.w3.org/1999/xlink", H = {
  window: typeof window > "u" ? null : window,
  document: typeof document > "u" ? null : document
};
function Oi() {
  return H.window;
}
var Ii = class {
};
const ge = {}, Di = "___SYMBOL___ROOT___";
function an(n, t = Pi) {
  return H.document.createElementNS(t, n);
}
function ut(n, t = !1) {
  if (n instanceof Ii) return n;
  if (typeof n == "object") return ks(n);
  if (n == null) return new ge[Di]();
  if (typeof n == "string" && n.trim().charAt(0) !== "<") return ks(H.document.querySelector(n));
  const e = t ? H.document.createElement("div") : an("svg");
  return e.innerHTML = n.trim(), n = ks(e.firstElementChild), e.removeChild(e.firstElementChild), n;
}
function J(n, t) {
  return t && (t instanceof H.window.Node || t.ownerDocument && t instanceof t.ownerDocument.defaultView.Node) ? t : an(n);
}
function mt(n) {
  if (!n) return null;
  if (n.instance instanceof Ii) return n.instance;
  if (n.nodeName === "#document-fragment") return new ge.Fragment(n);
  let t = Gr(n.nodeName || "Dom");
  return t === "LinearGradient" || t === "RadialGradient" ? t = "Gradient" : ge[t] || (t = "Dom"), new ge[t](n);
}
let ks = mt;
function F(n, t = n.name, e = !1) {
  return ge[t] = n, e && (ge[Di] = n), _r(Object.getOwnPropertyNames(n.prototype)), n;
}
function Kl(n) {
  return ge[n];
}
let Jl = 1e3;
function $r(n) {
  return "Svgjs" + Gr(n) + Jl++;
}
function Hr(n) {
  for (let t = n.children.length - 1; t >= 0; t--) Hr(n.children[t]);
  return n.id && (n.id = $r(n.nodeName)), n;
}
function G(n, t) {
  let e, s;
  for (n = Array.isArray(n) ? n : [n], s = n.length - 1; s >= 0; s--) for (e in t) n[s].prototype[e] = t[e];
}
function K(n) {
  return function(...t) {
    const e = t[t.length - 1];
    return e && e.constructor === Object && !(e instanceof Array) ? n.apply(this, t.slice(0, -1)).attr(e) : n.apply(this, t);
  };
}
function Ql() {
  return this.parent().children();
}
function th() {
  return this.parent().index(this);
}
function eh() {
  return this.siblings()[this.position() + 1];
}
function nh() {
  return this.siblings()[this.position() - 1];
}
function sh() {
  const n = this.position();
  return this.parent().add(this.remove(), n + 1), this;
}
function ih() {
  const n = this.position();
  return this.parent().add(this.remove(), n ? n - 1 : 0), this;
}
function oh() {
  return this.parent().add(this.remove()), this;
}
function rh() {
  return this.parent().add(this.remove(), 0), this;
}
function ah(n) {
  n = ut(n), n.remove();
  const t = this.position();
  return this.parent().add(n, t), this;
}
function ch(n) {
  n = ut(n), n.remove();
  const t = this.position();
  return this.parent().add(n, t + 1), this;
}
function lh(n) {
  return n = ut(n), n.before(this), this;
}
function hh(n) {
  return n = ut(n), n.after(this), this;
}
$("Dom", {
  siblings: Ql,
  position: th,
  next: eh,
  prev: nh,
  forward: sh,
  backward: ih,
  front: oh,
  back: rh,
  before: ah,
  after: ch,
  insertBefore: lh,
  insertAfter: hh
});
const Fr = /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i, dh = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, uh = /rgb\((\d+),(\d+),(\d+)\)/, fh = /^(#[^\s]+)$/, ph = /\)\s*,?\s*/, mh = /\s/g, yo = /^#[a-f0-9]{3}$|^#[a-f0-9]{6}$/i, bo = /^rgb\(/, vo = /^(\s+)?$/, wo = /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, gh = /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i, Wt = /[\s,]+/, Li = /[MLHVCSQTAZ]/i;
function yh() {
  const n = this.attr("class");
  return n == null ? [] : n.trim().split(Wt);
}
function bh(n) {
  return this.classes().indexOf(n) !== -1;
}
function vh(n) {
  if (!this.hasClass(n)) {
    const t = this.classes();
    t.push(n), this.attr("class", t.join(" "));
  }
  return this;
}
function wh(n) {
  return this.hasClass(n) && this.attr("class", this.classes().filter(function(t) {
    return t !== n;
  }).join(" ")), this;
}
function xh(n) {
  return this.hasClass(n) ? this.removeClass(n) : this.addClass(n);
}
$("Dom", {
  classes: yh,
  hasClass: bh,
  addClass: vh,
  removeClass: wh,
  toggleClass: xh
});
const Mn = (n) => n.startsWith("--") ? n : Br(n);
function _h(n, t) {
  const e = {};
  if (arguments.length === 0) {
    const s = this.node.style;
    for (let i = 0; i < s.length; i++) {
      const o = s.item(i), r = s.getPropertyValue(o), a = s.getPropertyPriority(o);
      e[o] = a ? `${r} !${a}` : r;
    }
    return e;
  }
  if (arguments.length < 2) {
    if (Array.isArray(n)) {
      for (const s of n) {
        const i = Mn(s);
        e[s] = this.node.style.getPropertyValue(i);
      }
      return e;
    }
    if (typeof n == "string") return this.node.style.getPropertyValue(Mn(n));
    if (typeof n == "object") for (const s in n) this.node.style.setProperty(Mn(s), n[s] == null || vo.test(n[s]) ? "" : n[s]);
  }
  return arguments.length === 2 && this.node.style.setProperty(Mn(n), t == null || vo.test(t) ? "" : t), this;
}
function Sh() {
  return this.css("display", "");
}
function Ch() {
  return this.css("display", "none");
}
function Eh() {
  return this.css("display") !== "none";
}
$("Dom", {
  css: _h,
  show: Sh,
  hide: Ch,
  visible: Eh
});
function Ah(n, t, e) {
  if (n == null) return this.data(Ri(Wl(this.node.attributes, (s) => s.nodeName.indexOf("data-") === 0), (s) => s.nodeName.slice(5)));
  if (n instanceof Array) {
    const s = {};
    for (const i of n) s[i] = this.data(i);
    return s;
  } else if (typeof n == "object") for (t in n) this.data(t, n[t]);
  else if (arguments.length < 2) try {
    return JSON.parse(this.attr("data-" + n));
  } catch {
    return this.attr("data-" + n);
  }
  else this.attr("data-" + n, t === null ? null : e === !0 || typeof t == "string" || typeof t == "number" ? t : JSON.stringify(t));
  return this;
}
$("Dom", { data: Ah });
function Th(n, t) {
  if (typeof arguments[0] == "object") for (const e in n) this.remember(e, n[e]);
  else {
    if (arguments.length === 1) return this.memory()[n];
    this.memory()[n] = t;
  }
  return this;
}
function Mh() {
  if (arguments.length === 0) this._memory = {};
  else for (let n = arguments.length - 1; n >= 0; n--) delete this.memory()[arguments[n]];
  return this;
}
function kh() {
  return this._memory = this._memory || {};
}
$("Dom", {
  remember: Th,
  forget: Mh,
  memory: kh
});
function Nh(n) {
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
function Rh(n) {
  const t = Math.max(0, Math.min(255, Math.round(n))).toString(16);
  return t.length === 1 ? "0" + t : t;
}
function xe(n, t) {
  for (let e = t.length; e--; ) if (n[t[e]] == null) return !1;
  return !0;
}
function Ph(n, t) {
  const e = xe(n, "rgb") ? {
    _a: n.r,
    _b: n.g,
    _c: n.b,
    _d: 0,
    space: "rgb"
  } : xe(n, "xyz") ? {
    _a: n.x,
    _b: n.y,
    _c: n.z,
    _d: 0,
    space: "xyz"
  } : xe(n, "hsl") ? {
    _a: n.h,
    _b: n.s,
    _c: n.l,
    _d: 0,
    space: "hsl"
  } : xe(n, "lab") ? {
    _a: n.l,
    _b: n.a,
    _c: n.b,
    _d: 0,
    space: "lab"
  } : xe(n, "lch") ? {
    _a: n.l,
    _b: n.c,
    _c: n.h,
    _d: 0,
    space: "lch"
  } : xe(n, "cmyk") ? {
    _a: n.c,
    _b: n.m,
    _c: n.y,
    _d: n.k,
    space: "cmyk"
  } : {
    _a: 0,
    _b: 0,
    _c: 0,
    space: "rgb"
  };
  return e.space = t || e.space, e;
}
function Oh(n) {
  return n === "lab" || n === "xyz" || n === "lch";
}
function Ns(n, t, e) {
  return e < 0 && (e += 1), e > 1 && (e -= 1), e < 1 / 6 ? n + (t - n) * 6 * e : e < 1 / 2 ? t : e < 2 / 3 ? n + (t - n) * (2 / 3 - e) * 6 : n;
}
var Gt = class at {
  constructor(...t) {
    this.init(...t);
  }
  static isColor(t) {
    return t && (t instanceof at || this.isRgb(t) || this.test(t));
  }
  static isRgb(t) {
    return t && typeof t.r == "number" && typeof t.g == "number" && typeof t.b == "number";
  }
  static random(t = "vibrant", e) {
    const { random: s, round: i, sin: o, PI: r } = Math;
    if (t === "vibrant") {
      const a = 24 * s() + 57, c = 38 * s() + 45, l = 360 * s();
      return new at(a, c, l, "lch");
    } else if (t === "sine") {
      e = e ?? s();
      const a = i(80 * o(2 * r * e / 0.5 + 0.01) + 150), c = i(50 * o(2 * r * e / 0.5 + 4.6) + 200), l = i(100 * o(2 * r * e / 0.5 + 2.3) + 150);
      return new at(a, c, l);
    } else if (t === "pastel") {
      const a = 8 * s() + 86, c = 17 * s() + 9, l = 360 * s();
      return new at(a, c, l, "lch");
    } else if (t === "dark") {
      const a = 10 + 10 * s(), c = 50 * s() + 86, l = 360 * s();
      return new at(a, c, l, "lch");
    } else if (t === "rgb") {
      const a = 255 * s(), c = 255 * s(), l = 255 * s();
      return new at(a, c, l);
    } else if (t === "lab") {
      const a = 100 * s(), c = 256 * s() - 128, l = 256 * s() - 128;
      return new at(a, c, l, "lab");
    } else if (t === "grey") {
      const a = 255 * s();
      return new at(a, a, a);
    } else throw new Error("Unsupported random color mode");
  }
  static test(t) {
    return typeof t == "string" && (yo.test(t) || bo.test(t));
  }
  cmyk() {
    const { _a: t, _b: e, _c: s } = this.rgb(), [i, o, r] = [
      t,
      e,
      s
    ].map((d) => d / 255), a = Math.min(1 - i, 1 - o, 1 - r);
    if (a === 1) return new at(0, 0, 0, 1, "cmyk");
    const c = (1 - i - a) / (1 - a), l = (1 - o - a) / (1 - a), h = (1 - r - a) / (1 - a);
    return new at(c, l, h, a, "cmyk");
  }
  hsl() {
    const { _a: t, _b: e, _c: s } = this.rgb(), [i, o, r] = [
      t,
      e,
      s
    ].map((p) => p / 255), a = Math.max(i, o, r), c = Math.min(i, o, r), l = (a + c) / 2, h = a === c, d = a - c, u = h ? 0 : l > 0.5 ? d / (2 - a - c) : d / (a + c), f = h ? 0 : a === i ? ((o - r) / d + (o < r ? 6 : 0)) / 6 : a === o ? ((r - i) / d + 2) / 6 : a === r ? ((i - o) / d + 4) / 6 : 0;
    return new at(360 * f, 100 * u, 100 * l, "hsl");
  }
  init(t = 0, e = 0, s = 0, i = 0, o = "rgb") {
    if (t = t || 0, this.space) for (const d in this.space) delete this[this.space[d]];
    if (typeof t == "number")
      o = typeof i == "string" ? i : o, i = typeof i == "string" ? 0 : i, Object.assign(this, {
        _a: t,
        _b: e,
        _c: s,
        _d: i,
        space: o
      });
    else if (t instanceof Array)
      this.space = e || (typeof t[3] == "string" ? t[3] : t[4]) || "rgb", Object.assign(this, {
        _a: t[0],
        _b: t[1],
        _c: t[2],
        _d: t[3] || 0
      });
    else if (t instanceof Object) {
      const d = Ph(t, e);
      Object.assign(this, d);
    } else if (typeof t == "string") if (bo.test(t)) {
      const d = t.replace(mh, ""), [u, f, p] = uh.exec(d).slice(1, 4).map((m) => parseInt(m));
      Object.assign(this, {
        _a: u,
        _b: f,
        _c: p,
        _d: 0,
        space: "rgb"
      });
    } else if (yo.test(t)) {
      const d = (m) => parseInt(m, 16), [, u, f, p] = dh.exec(Nh(t)).map(d);
      Object.assign(this, {
        _a: u,
        _b: f,
        _c: p,
        _d: 0,
        space: "rgb"
      });
    } else throw Error("Unsupported string format, can't construct Color");
    const { _a: r, _b: a, _c: c, _d: l } = this, h = this.space === "rgb" ? {
      r,
      g: a,
      b: c
    } : this.space === "xyz" ? {
      x: r,
      y: a,
      z: c
    } : this.space === "hsl" ? {
      h: r,
      s: a,
      l: c
    } : this.space === "lab" ? {
      l: r,
      a,
      b: c
    } : this.space === "lch" ? {
      l: r,
      c: a,
      h: c
    } : this.space === "cmyk" ? {
      c: r,
      m: a,
      y: c,
      k: l
    } : {};
    Object.assign(this, h);
  }
  lab() {
    const { x: t, y: e, z: s } = this.xyz(), i = 116 * e - 16, o = 500 * (t - e), r = 200 * (e - s);
    return new at(i, o, r, "lab");
  }
  lch() {
    const { l: t, a: e, b: s } = this.lab(), i = Math.sqrt(e ** 2 + s ** 2);
    let o = 180 * Math.atan2(s, e) / Math.PI;
    return o < 0 && (o *= -1, o = 360 - o), new at(t, i, o, "lch");
  }
  rgb() {
    if (this.space === "rgb") return this;
    if (Oh(this.space)) {
      let { x: t, y: e, z: s } = this;
      if (this.space === "lab" || this.space === "lch") {
        let { l: u, a: f, b: p } = this;
        if (this.space === "lch") {
          const { c: v, h: w } = this, _ = Math.PI / 180;
          f = v * Math.cos(_ * w), p = v * Math.sin(_ * w);
        }
        const m = (u + 16) / 116, g = f / 500 + m, y = m - p / 200, b = 16 / 116, x = 8856e-6, C = 7.787;
        t = 0.95047 * (g ** 3 > x ? g ** 3 : (g - b) / C), e = 1 * (m ** 3 > x ? m ** 3 : (m - b) / C), s = 1.08883 * (y ** 3 > x ? y ** 3 : (y - b) / C);
      }
      const i = t * 3.2406 + e * -1.5372 + s * -0.4986, o = t * -0.9689 + e * 1.8758 + s * 0.0415, r = t * 0.0557 + e * -0.204 + s * 1.057, a = Math.pow, c = 31308e-7, l = i > c ? 1.055 * a(i, 1 / 2.4) - 0.055 : 12.92 * i, h = o > c ? 1.055 * a(o, 1 / 2.4) - 0.055 : 12.92 * o, d = r > c ? 1.055 * a(r, 1 / 2.4) - 0.055 : 12.92 * r;
      return new at(255 * l, 255 * h, 255 * d);
    } else if (this.space === "hsl") {
      let { h: t, s: e, l: s } = this;
      if (t /= 360, e /= 100, s /= 100, e === 0)
        return s *= 255, new at(s, s, s);
      const i = s < 0.5 ? s * (1 + e) : s + e - s * e, o = 2 * s - i, r = 255 * Ns(o, i, t + 1 / 3), a = 255 * Ns(o, i, t), c = 255 * Ns(o, i, t - 1 / 3);
      return new at(r, a, c);
    } else if (this.space === "cmyk") {
      const { c: t, m: e, y: s, k: i } = this, o = 255 * (1 - Math.min(1, t * (1 - i) + i)), r = 255 * (1 - Math.min(1, e * (1 - i) + i)), a = 255 * (1 - Math.min(1, s * (1 - i) + i));
      return new at(o, r, a);
    } else return this;
  }
  toArray() {
    const { _a: t, _b: e, _c: s, _d: i, space: o } = this;
    return [
      t,
      e,
      s,
      i,
      o
    ];
  }
  toHex() {
    const [t, e, s] = this._clamped().map(Rh);
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
    const { _a: t, _b: e, _c: s } = this.rgb(), [i, o, r] = [
      t,
      e,
      s
    ].map((g) => g / 255), a = i > 0.04045 ? Math.pow((i + 0.055) / 1.055, 2.4) : i / 12.92, c = o > 0.04045 ? Math.pow((o + 0.055) / 1.055, 2.4) : o / 12.92, l = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92, h = (a * 0.4124 + c * 0.3576 + l * 0.1805) / 0.95047, d = (a * 0.2126 + c * 0.7152 + l * 0.0722) / 1, u = (a * 0.0193 + c * 0.1192 + l * 0.9505) / 1.08883, f = h > 8856e-6 ? Math.pow(h, 1 / 3) : 7.787 * h + 16 / 116, p = d > 8856e-6 ? Math.pow(d, 1 / 3) : 7.787 * d + 16 / 116, m = u > 8856e-6 ? Math.pow(u, 1 / 3) : 7.787 * u + 16 / 116;
    return new at(f, p, m, "xyz");
  }
  _clamped() {
    const { _a: t, _b: e, _c: s } = this.rgb(), { max: i, min: o, round: r } = Math, a = (c) => i(0, o(r(c), 255));
    return [
      t,
      e,
      s
    ].map(a);
  }
}, st = class Ur {
  constructor(...t) {
    this.init(...t);
  }
  clone() {
    return new Ur(this);
  }
  init(t, e) {
    const s = {
      x: 0,
      y: 0
    }, i = Array.isArray(t) ? {
      x: t[0],
      y: t[1]
    } : typeof t == "object" ? {
      x: t.x,
      y: t.y
    } : {
      x: t,
      y: e
    };
    return this.x = i.x == null ? s.x : i.x, this.y = i.y == null ? s.y : i.y, this;
  }
  toArray() {
    return [this.x, this.y];
  }
  transform(t) {
    return this.clone().transformO(t);
  }
  transformO(t) {
    B.isMatrixLike(t) || (t = new B(t));
    const { x: e, y: s } = this;
    return this.x = t.a * e + t.c * s + t.e, this.y = t.b * e + t.d * s + t.f, this;
  }
};
function Ih(n, t) {
  return new st(n, t).transformO(this.screenCTM().inverseO());
}
function _e(n, t, e) {
  return Math.abs(t - n) < 1e-6;
}
var B = class ct {
  constructor(...t) {
    this.init(...t);
  }
  static formatTransforms(t) {
    const e = t.flip === "both" || t.flip === !0, s = t.flip && (e || t.flip === "x") ? -1 : 1, i = t.flip && (e || t.flip === "y") ? -1 : 1, o = t.skew && t.skew.length ? t.skew[0] : isFinite(t.skew) ? t.skew : isFinite(t.skewX) ? t.skewX : 0, r = t.skew && t.skew.length ? t.skew[1] : isFinite(t.skew) ? t.skew : isFinite(t.skewY) ? t.skewY : 0, a = t.scale && t.scale.length ? t.scale[0] * s : isFinite(t.scale) ? t.scale * s : isFinite(t.scaleX) ? t.scaleX * s : s, c = t.scale && t.scale.length ? t.scale[1] * i : isFinite(t.scale) ? t.scale * i : isFinite(t.scaleY) ? t.scaleY * i : i, l = t.shear || 0, h = t.rotate || t.theta || 0, d = new st(t.origin || t.around || t.ox || t.originX, t.oy || t.originY), u = d.x, f = d.y, p = new st(t.position ?? t.px ?? t.positionX ?? NaN, t.py ?? t.positionY ?? NaN), m = p.x, g = p.y, y = new st(t.translate || t.tx || t.translateX, t.ty || t.translateY), b = y.x, x = y.y, C = new st(t.relative || t.rx || t.relativeX, t.ry || t.relativeY);
    return {
      scaleX: a,
      scaleY: c,
      skewX: o,
      skewY: r,
      shear: l,
      theta: h,
      rx: C.x,
      ry: C.y,
      tx: b,
      ty: x,
      ox: u,
      oy: f,
      px: m,
      py: g
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
  static matrixMultiply(t, e, s) {
    const i = t.a * e.a + t.c * e.b, o = t.b * e.a + t.d * e.b, r = t.a * e.c + t.c * e.d, a = t.b * e.c + t.d * e.d, c = t.e + t.a * e.e + t.c * e.f, l = t.f + t.b * e.e + t.d * e.f;
    return s.a = i, s.b = o, s.c = r, s.d = a, s.e = c, s.f = l, s;
  }
  around(t, e, s) {
    return this.clone().aroundO(t, e, s);
  }
  aroundO(t, e, s) {
    const i = t || 0, o = e || 0;
    return this.translateO(-i, -o).lmultiplyO(s).translateO(i, o);
  }
  clone() {
    return new ct(this);
  }
  decompose(t = 0, e = 0) {
    const s = this.a, i = this.b, o = this.c, r = this.d, a = this.e, c = this.f, l = s * r - i * o, h = l > 0 ? 1 : -1, d = h * Math.sqrt(s * s + i * i), u = Math.atan2(h * i, h * s), f = 180 / Math.PI * u, p = (s * o + i * r) / l;
    return {
      scaleX: d,
      scaleY: o * d / (p * s - i) || r * d / (p * i + s),
      shear: p,
      rotate: f,
      translateX: a - t + t * s + e * o,
      translateY: c - e + t * i + e * r,
      originX: t,
      originY: e,
      a: this.a,
      b: this.b,
      c: this.c,
      d: this.d,
      e: this.e,
      f: this.f
    };
  }
  equals(t) {
    if (t === this) return !0;
    const e = new ct(t);
    return _e(this.a, e.a) && _e(this.b, e.b) && _e(this.c, e.c) && _e(this.d, e.d) && _e(this.e, e.e) && _e(this.f, e.f);
  }
  flip(t, e) {
    return this.clone().flipO(t, e);
  }
  flipO(t, e) {
    return t === "x" ? this.scaleO(-1, 1, e, 0) : t === "y" ? this.scaleO(1, -1, 0, e) : this.scaleO(-1, -1, t, e || t);
  }
  init(t) {
    const e = ct.fromArray([
      1,
      0,
      0,
      1,
      0,
      0
    ]);
    return t = t instanceof bt ? t.matrixify() : typeof t == "string" ? ct.fromArray(t.split(Wt).map(parseFloat)) : Array.isArray(t) ? ct.fromArray(t) : typeof t == "object" && ct.isMatrixLike(t) ? t : typeof t == "object" ? new ct().transform(t) : arguments.length === 6 ? ct.fromArray([].slice.call(arguments)) : e, this.a = t.a != null ? t.a : e.a, this.b = t.b != null ? t.b : e.b, this.c = t.c != null ? t.c : e.c, this.d = t.d != null ? t.d : e.d, this.e = t.e != null ? t.e : e.e, this.f = t.f != null ? t.f : e.f, this;
  }
  inverse() {
    return this.clone().inverseO();
  }
  inverseO() {
    const t = this.a, e = this.b, s = this.c, i = this.d, o = this.e, r = this.f, a = t * i - e * s;
    if (!a) throw new Error("Cannot invert " + this);
    const c = i / a, l = -e / a, h = -s / a, d = t / a, u = -(c * o + h * r), f = -(l * o + d * r);
    return this.a = c, this.b = l, this.c = h, this.d = d, this.e = u, this.f = f, this;
  }
  lmultiply(t) {
    return this.clone().lmultiplyO(t);
  }
  lmultiplyO(t) {
    const e = this, s = t instanceof ct ? t : new ct(t);
    return ct.matrixMultiply(s, e, this);
  }
  multiply(t) {
    return this.clone().multiplyO(t);
  }
  multiplyO(t) {
    const e = this, s = t instanceof ct ? t : new ct(t);
    return ct.matrixMultiply(e, s, this);
  }
  rotate(t, e, s) {
    return this.clone().rotateO(t, e, s);
  }
  rotateO(t, e = 0, s = 0) {
    t = Ts(t);
    const i = Math.cos(t), o = Math.sin(t), { a: r, b: a, c, d: l, e: h, f: d } = this;
    return this.a = r * i - a * o, this.b = a * i + r * o, this.c = c * i - l * o, this.d = l * i + c * o, this.e = h * i - d * o + s * o - e * i + e, this.f = d * i + h * o - e * o - s * i + s, this;
  }
  scale() {
    return this.clone().scaleO(...arguments);
  }
  scaleO(t, e = t, s = 0, i = 0) {
    arguments.length === 3 && (i = s, s = e, e = t);
    const { a: o, b: r, c: a, d: c, e: l, f: h } = this;
    return this.a = o * t, this.b = r * e, this.c = a * t, this.d = c * e, this.e = l * t - s * t + s, this.f = h * e - i * e + i, this;
  }
  shear(t, e, s) {
    return this.clone().shearO(t, e, s);
  }
  shearO(t, e = 0, s = 0) {
    const { a: i, b: o, c: r, d: a, e: c, f: l } = this;
    return this.a = i + o * t, this.c = r + a * t, this.e = c + l * t - s * t, this;
  }
  skew() {
    return this.clone().skewO(...arguments);
  }
  skewO(t, e = t, s = 0, i = 0) {
    arguments.length === 3 && (i = s, s = e, e = t), t = Ts(t), e = Ts(e);
    const o = Math.tan(t), r = Math.tan(e), { a, b: c, c: l, d: h, e: d, f: u } = this;
    return this.a = a + c * o, this.b = c + a * r, this.c = l + h * o, this.d = h + l * r, this.e = d + u * o - i * o, this.f = u + d * r - s * r, this;
  }
  skewX(t, e, s) {
    return this.skew(t, 0, e, s);
  }
  skewY(t, e, s) {
    return this.skew(0, t, e, s);
  }
  toArray() {
    return [
      this.a,
      this.b,
      this.c,
      this.d,
      this.e,
      this.f
    ];
  }
  toString() {
    return "matrix(" + this.a + "," + this.b + "," + this.c + "," + this.d + "," + this.e + "," + this.f + ")";
  }
  transform(t) {
    if (ct.isMatrixLike(t)) return new ct(t).multiplyO(this);
    const e = ct.formatTransforms(t), s = this, { x: i, y: o } = new st(e.ox, e.oy).transform(s), r = new ct().translateO(e.rx, e.ry).lmultiplyO(s).translateO(-i, -o).scaleO(e.scaleX, e.scaleY).skewO(e.skewX, e.skewY).shearO(e.shear).rotateO(e.theta).translateO(i, o);
    if (isFinite(e.px) || isFinite(e.py)) {
      const a = new st(i, o).transform(r), c = isFinite(e.px) ? e.px - a.x : 0, l = isFinite(e.py) ? e.py - a.y : 0;
      r.translateO(c, l);
    }
    return r.translateO(e.tx, e.ty), r;
  }
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
function Dh() {
  return new B(this.node.getCTM());
}
function Lh() {
  try {
    if (typeof this.isRoot == "function" && !this.isRoot()) {
      const n = this.rect(1, 1), t = n.node.getScreenCTM();
      return n.remove(), new B(t);
    }
    return new B(this.node.getScreenCTM());
  } catch {
    return console.warn(`Cannot get CTM from SVG node ${this.node.nodeName}. Is the element rendered?`), new B();
  }
}
F(B, "Matrix");
function Ft() {
  if (!Ft.nodes || Ft.nodes.svg.node.ownerDocument !== H.document) {
    const n = ut().size(2, 0);
    n.node.style.cssText = [
      "opacity: 0",
      "position: absolute",
      "left: -100%",
      "top: -100%",
      "overflow: hidden"
    ].join(";"), n.attr("focusable", "false"), n.attr("aria-hidden", "true"), Ft.nodes = {
      svg: n,
      path: n.path().node
    };
  }
  return Ft.nodes.svg.node.parentNode || Ft.nodes.svg.addTo(H.document.body || H.document.documentElement), Ft.nodes;
}
function jr(n) {
  return !n.width && !n.height && !n.x && !n.y;
}
function zh(n) {
  return n === H.document || (H.document.documentElement.contains || function(t) {
    for (; t.parentNode; ) t = t.parentNode;
    return t === H.document;
  }).call(H.document.documentElement, n);
}
var lt = class Fn {
  constructor(...t) {
    this.init(...t);
  }
  addOffset() {
    return this.x += H.window.pageXOffset, this.y += H.window.pageYOffset, new Fn(this);
  }
  init(t) {
    return t = typeof t == "string" ? t.split(Wt).map(parseFloat) : Array.isArray(t) ? t : typeof t == "object" ? [
      t.left != null ? t.left : t.x,
      t.top != null ? t.top : t.y,
      t.width,
      t.height
    ] : arguments.length === 4 ? [].slice.call(arguments) : [
      0,
      0,
      0,
      0
    ], this.x = t[0] || 0, this.y = t[1] || 0, this.width = this.w = t[2] || 0, this.height = this.h = t[3] || 0, this.x2 = this.x + this.w, this.y2 = this.y + this.h, this.cx = this.x + this.w / 2, this.cy = this.y + this.h / 2, this;
  }
  isNulled() {
    return jr(this);
  }
  merge(t) {
    const e = Math.min(this.x, t.x), s = Math.min(this.y, t.y), i = Math.max(this.x + this.width, t.x + t.width) - e, o = Math.max(this.y + this.height, t.y + t.height) - s;
    return new Fn(e, s, i, o);
  }
  toArray() {
    return [
      this.x,
      this.y,
      this.width,
      this.height
    ];
  }
  toString() {
    return this.x + " " + this.y + " " + this.width + " " + this.height;
  }
  transform(t) {
    t instanceof B || (t = new B(t));
    let e = 1 / 0, s = -1 / 0, i = 1 / 0, o = -1 / 0;
    return [
      new st(this.x, this.y),
      new st(this.x2, this.y),
      new st(this.x, this.y2),
      new st(this.x2, this.y2)
    ].forEach(function(r) {
      r = r.transform(t), e = Math.min(e, r.x), s = Math.max(s, r.x), i = Math.min(i, r.y), o = Math.max(o, r.y);
    }), new Fn(e, i, s - e, o - i);
  }
};
function Yr(n, t, e) {
  let s;
  try {
    if (s = t(n.node), jr(s) && !zh(n.node)) throw new Error("Element not in the dom");
  } catch {
    s = e(n);
  }
  return s;
}
function Bh() {
  const e = Yr(this, (s) => s.getBBox(), (s) => {
    try {
      const i = s.clone().addTo(Ft().svg).show(), o = i.node.getBBox();
      return i.remove(), o;
    } catch (i) {
      throw new Error(`Getting bbox of element "${s.node.nodeName}" is not possible: ${i.toString()}`);
    }
  });
  return new lt(e);
}
function Gh(n) {
  const s = Yr(this, (o) => o.getBoundingClientRect(), (o) => {
    throw new Error(`Getting rbox of element "${o.node.nodeName}" is not possible`);
  }), i = new lt(s);
  return n ? i.transform(n.screenCTM().inverseO()) : i.addOffset();
}
function $h(n, t) {
  const e = this.bbox();
  return n > e.x && t > e.y && n < e.x + e.width && t < e.y + e.height;
}
$({ viewbox: {
  viewbox(n, t, e, s) {
    return n == null ? new lt(this.attr("viewBox")) : this.attr("viewBox", new lt(n, t, e, s));
  },
  zoom(n, t) {
    let { width: e, height: s } = this.attr(["width", "height"]);
    if ((!e && !s || typeof e == "string" || typeof s == "string") && (e = this.node.clientWidth, s = this.node.clientHeight), !e || !s) throw new Error("Impossible to get absolute width and height. Please provide an absolute width and height attribute on the zooming element");
    const i = this.viewbox(), o = e / i.width, r = s / i.height, a = Math.min(o, r);
    if (n == null) return a;
    let c = a / n;
    c === 1 / 0 && (c = Number.MAX_SAFE_INTEGER / 100), t = t || new st(e / 2 / o + i.x, s / 2 / r + i.y);
    const l = new lt(i).transform(new B({
      scale: c,
      origin: t
    }));
    return this.viewbox(l);
  }
} });
F(lt, "Box");
var Yt = class extends Array {
  constructor(n = [], ...t) {
    if (super(n, ...t), typeof n == "number") return this;
    this.length = 0, this.push(...n);
  }
};
G([Yt], {
  each(n, ...t) {
    return typeof n == "function" ? this.map((e, s, i) => n.call(e, e, s, i)) : this.map((e) => e[n](...t));
  },
  toArray() {
    return Array.prototype.concat.apply([], this);
  }
});
const xo = [
  "toArray",
  "constructor",
  "each"
];
Yt.extend = function(n) {
  n = n.reduce((t, e) => ((0, pe.default)(xo).call(xo, e) || e[0] === "_" || (e in Array.prototype && (t["$" + e] = Array.prototype[e]), t[e] = function(...s) {
    return this.each(e, ...s);
  }), t), {}), G([Yt], n);
};
function ei(n) {
  let t = (n + "").trim();
  const e = t.match(/^url\((.*)\)$/i);
  if (e) {
    t = e[1].trim();
    const i = t[0];
    if (i === '"' || i === "'") {
      if (t[t.length - 1] !== i) return null;
      t = t.slice(1, -1);
    }
  }
  const s = t.match(fh);
  return s ? s[1].slice(1) : null;
}
function Xr(n, t) {
  const e = `#${H.window.CSS.escape(t)}`;
  return n.nodeType === 1 && n.matches(e) ? n : n.querySelector(e);
}
function Hh(n, t) {
  const e = ei(t);
  return e ? Xr(n.getRootNode(), e) : null;
}
function Sn(n, t, e = `[${t}]`) {
  const s = n.getAttribute("id"), i = n.getRootNode();
  if (!s || Xr(i, s) !== n) return new Yt();
  const o = [];
  i.nodeType === 1 && i.matches(e) && ei(i.getAttribute(t)) === s && o.push(mt(i));
  for (const r of i.querySelectorAll(e)) ei(r.getAttribute(t)) === s && o.push(mt(r));
  return new Yt(o);
}
function Fh(n, t) {
  return new Yt(Ri((t || H.document).querySelectorAll(n), function(e) {
    return mt(e);
  }));
}
function Uh(n) {
  return Fh(n, this.node);
}
function jh(n) {
  return mt(this.node.querySelector(n));
}
let Yh = 0;
const ni = /* @__PURE__ */ new WeakMap(), si = /* @__PURE__ */ new WeakMap(), ii = () => /* @__PURE__ */ Object.create(null);
function zi(n) {
  const t = n.getEventHolder();
  let e = ni.get(t);
  return e || (e = ii(), ni.set(t, e)), e;
}
function Bi(n) {
  return n.getEventTarget();
}
function Xh(n) {
  ni.delete(n.getEventHolder());
}
function xt(n, t, e, s, i) {
  const o = e.bind(s || n), r = i || !1, a = ut(n), c = zi(a), l = Bi(a);
  t = Array.isArray(t) ? t : t.split(Wt);
  let h = si.get(e);
  h || (h = ++Yh, si.set(e, h)), t.forEach(function(d) {
    const u = d.split(".")[0], f = d.split(".")[1] || "*";
    c[u] = c[u] || ii(), c[u][f] = c[u][f] || ii(), c[u][f][h] = c[u][f][h] || [], c[u][f][h].push({
      listener: o,
      options: r
    }), l.addEventListener(u, o, r);
  });
}
function rt(n, t, e, s) {
  const i = ut(n), o = zi(i), r = Bi(i);
  typeof e == "function" && (e = si.get(e), !e) || (t = Array.isArray(t) ? t : (t || "").split(Wt), t.forEach(function(a) {
    const c = a && a.split(".")[0], l = a && a.split(".")[1];
    let h, d;
    if (e) {
      if (o[c] && o[c][l || "*"]) {
        const u = o[c][l || "*"][e];
        if (!u) return;
        u.forEach(function(f) {
          r.removeEventListener(c, f.listener, f.options ?? s ?? !1);
        }), delete o[c][l || "*"][e];
      }
    } else if (c && l) {
      if (o[c] && o[c][l]) {
        for (d in o[c][l]) rt(r, [c, l].join("."), d);
        delete o[c][l];
      }
    } else if (l)
      for (a in o) for (h in o[a]) l === h && rt(r, [a, l].join("."));
    else if (c) {
      if (o[c]) {
        for (h in o[c]) rt(r, [c, h].join("."));
        delete o[c];
      }
    } else {
      for (a in o) rt(r, a);
      Xh(i);
    }
  }));
}
function Wh(n, t, e, s) {
  const i = Bi(n);
  return t instanceof H.window.Event || (t = new H.window.CustomEvent(t, {
    detail: e,
    cancelable: !0,
    ...s
  })), i.dispatchEvent(t), t;
}
var Cn = class extends Ii {
  addEventListener() {
  }
  dispatch(n, t, e) {
    return Wh(this, n, t, e);
  }
  dispatchEvent(n) {
    const t = zi(this)[n.type];
    if (!t) return !0;
    for (const e in t) for (const s in t[e]) t[e][s].forEach(function(i) {
      i.listener(n);
    });
    return !n.defaultPrevented;
  }
  fire(n, t, e) {
    return this.dispatch(n, t, e), this;
  }
  getEventHolder() {
    return this;
  }
  getEventTarget() {
    return this;
  }
  off(n, t, e) {
    return rt(this, n, t, e), this;
  }
  on(n, t, e, s) {
    return xt(this, n, t, e, s), this;
  }
  removeEventListener() {
  }
};
F(Cn, "EventTarget");
function _o() {
}
const qe = {
  duration: 400,
  ease: ">",
  delay: 0
}, qh = {
  "fill-opacity": 1,
  "stroke-opacity": 1,
  "stroke-width": 0,
  "stroke-linejoin": "miter",
  "stroke-linecap": "butt",
  fill: "#000000",
  stroke: "#000000",
  opacity: 1,
  x: 0,
  y: 0,
  cx: 0,
  cy: 0,
  width: 0,
  height: 0,
  r: 0,
  rx: 0,
  ry: 0,
  offset: 0,
  "stop-opacity": 1,
  "stop-color": "#000000",
  "text-anchor": "start"
};
var Ne = class extends Array {
  constructor(...n) {
    super(...n), this.init(...n);
  }
  clone() {
    return new this.constructor(this);
  }
  init(n) {
    return typeof n == "number" ? this : (this.length = 0, this.push(...this.parse(n)), this);
  }
  parse(n = []) {
    return n instanceof Array ? n : n.trim().split(Wt).map(parseFloat);
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
  valueOf() {
    const n = [];
    return n.push(...this), n;
  }
}, U = class Pt {
  constructor(...t) {
    this.init(...t);
  }
  convert(t) {
    return new Pt(this.value, t);
  }
  divide(t) {
    return t = new Pt(t), new Pt(this / t, this.unit || t.unit);
  }
  init(t, e) {
    return e = Array.isArray(t) ? t[1] : e, t = Array.isArray(t) ? t[0] : t, this.value = 0, this.unit = e || "", typeof t == "number" ? this.value = isNaN(t) ? 0 : isFinite(t) ? t : t < 0 ? -34e37 : 34e37 : typeof t == "string" ? (e = t.match(Fr), e && (this.value = parseFloat(e[1]), e[5] === "%" ? this.value /= 100 : e[5] === "s" && (this.value *= 1e3), this.unit = e[5])) : t instanceof Pt && (this.value = t.valueOf(), this.unit = t.unit), this;
  }
  minus(t) {
    return t = new Pt(t), new Pt(this - t, this.unit || t.unit);
  }
  plus(t) {
    return t = new Pt(t), new Pt(this + t, this.unit || t.unit);
  }
  times(t) {
    return t = new Pt(t), new Pt(this * t, this.unit || t.unit);
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
};
const Zh = /* @__PURE__ */ new Set([
  "fill",
  "stroke",
  "color",
  "bgcolor",
  "stop-color",
  "flood-color",
  "lighting-color"
]), Wr = [];
function Vh(n) {
  Wr.push(n);
}
function Kh(n, t, e) {
  if (n == null) {
    n = {}, t = this.node.attributes;
    for (const s of t) n[s.nodeName] = wo.test(s.nodeValue) ? parseFloat(s.nodeValue) : s.nodeValue;
    return n;
  } else {
    if (n instanceof Array) return n.reduce((s, i) => (s[i] = this.attr(i), s), {});
    if (typeof n == "object" && n.constructor === Object) for (t in n) this.attr(t, n[t]);
    else if (t === null) this.node.removeAttribute(n);
    else {
      if (t == null)
        return t = this.node.getAttribute(n), t == null ? qh[n] : wo.test(t) ? parseFloat(t) : t;
      t = Wr.reduce((s, i) => i(n, s, this), t), typeof t == "number" ? t = new U(t) : Zh.has(n) && Gt.isColor(t) ? t = new Gt(t) : t.constructor === Array && (t = new Ne(t)), n === "leading" ? this.leading && this.leading(t) : typeof e == "string" ? this.node.setAttributeNS(e, n, t.toString()) : this.node.setAttribute(n, t.toString()), this.rebuild && (n === "font-size" || n === "x") && this.rebuild();
    }
  }
  return this;
}
var Re = class qr extends Cn {
  constructor(t, e) {
    super(), this.node = t, this.type = t.nodeName, e && t !== e && this.attr(e);
  }
  add(t, e) {
    return t = ut(t), t.removeNamespace && this.node instanceof H.window.SVGElement && t.removeNamespace(), e == null ? this.node.appendChild(t.node) : t.node !== this.node.childNodes[e] && this.node.insertBefore(t.node, this.node.childNodes[e]), this;
  }
  addTo(t, e) {
    return ut(t).put(this, e);
  }
  children() {
    return new Yt(Ri(this.node.children, function(t) {
      return mt(t);
    }));
  }
  clear() {
    for (; this.node.hasChildNodes(); ) this.node.removeChild(this.node.lastChild);
    return this;
  }
  clone(t = !0, e = !0) {
    this.writeDataToDom();
    let s = this.node.cloneNode(t);
    return e && (s = Hr(s)), new this.constructor(s);
  }
  each(t, e) {
    const s = this.children();
    let i, o;
    for (i = 0, o = s.length; i < o; i++)
      t.apply(s[i], [i, s]), e && s[i].each(t, e);
    return this;
  }
  element(t, e) {
    return this.put(new qr(an(t), e));
  }
  first() {
    return mt(this.node.firstChild);
  }
  get(t) {
    return mt(this.node.childNodes[t]);
  }
  getEventHolder() {
    return this.node;
  }
  getEventTarget() {
    return this.node;
  }
  has(t) {
    return this.index(t) >= 0;
  }
  html(t, e) {
    return this.xml(t, e, Vl);
  }
  id(t) {
    return typeof t > "u" && !this.node.id && (this.node.id = $r(this.type)), this.attr("id", t);
  }
  index(t) {
    return [].slice.call(this.node.childNodes).indexOf(t.node);
  }
  last() {
    return mt(this.node.lastChild);
  }
  matches(t) {
    const e = this.node, s = e.matches || e.matchesSelector || e.msMatchesSelector || e.mozMatchesSelector || e.webkitMatchesSelector || e.oMatchesSelector || null;
    return s && s.call(e, t);
  }
  parent(t) {
    let e = this;
    if (!e.node.parentNode) return null;
    if (e = mt(e.node.parentNode), !t) return e;
    do
      if (typeof t == "string" ? e.matches(t) : e instanceof t) return e;
    while (e = mt(e.node.parentNode));
    return e;
  }
  put(t, e) {
    return t = ut(t), this.add(t, e), t;
  }
  putIn(t, e) {
    return ut(t).add(this, e);
  }
  remove() {
    return this.parent() && this.parent().removeElement(this), this;
  }
  removeElement(t) {
    return this.node.removeChild(t.node), this;
  }
  replace(t) {
    return t = ut(t), this.node.parentNode && this.node.parentNode.replaceChild(t.node, this.node), t;
  }
  round(t = 2, e = null) {
    const s = 10 ** t, i = this.attr(e);
    for (const o in i) typeof i[o] == "number" && (i[o] = Math.round(i[o] * s) / s);
    return this.attr(i), this;
  }
  svg(t, e) {
    return this.xml(t, e, Pi);
  }
  toString() {
    return this.id();
  }
  words(t) {
    return this.node.textContent = t, this;
  }
  wrap(t) {
    const e = this.parent();
    if (!e) return this.addTo(t);
    const s = e.index(this);
    return e.put(t, s).put(this);
  }
  writeDataToDom() {
    return this.each(function() {
      this.writeDataToDom();
    }), this;
  }
  xml(t, e, s) {
    if (typeof t == "boolean" && (s = e, e = t, t = null), t == null || typeof t == "function") {
      e = e ?? !0, this.writeDataToDom();
      let a = this;
      if (t != null) {
        if (a = mt(a.node.cloneNode(!0)), e) {
          const c = t(a);
          if (a = c || a, c === !1) return "";
        }
        a.each(function() {
          const c = t(this), l = c || this;
          c === !1 ? this.remove() : c && this !== l && this.replace(l);
        }, !0);
      }
      return e ? a.node.outerHTML : a.node.innerHTML;
    }
    e = e ?? !1;
    const i = an("wrapper", s), o = H.document.createDocumentFragment();
    i.innerHTML = t;
    for (let a = i.children.length; a--; ) o.appendChild(i.firstElementChild);
    const r = this.parent();
    return e ? this.replace(o) && r : this.add(o);
  }
};
G(Re, {
  attr: Kh,
  find: Uh,
  findOne: jh
});
F(Re, "Dom");
var bt = class extends Re {
  constructor(t, e) {
    super(t, e), this.dom = {}, this.node.instance = this, (t.hasAttribute("data-svgjs") || t.hasAttribute("svgjs:data")) && this.setData(JSON.parse(t.getAttribute("data-svgjs")) ?? JSON.parse(t.getAttribute("svgjs:data")) ?? {});
  }
  center(t, e) {
    return this.cx(t).cy(e);
  }
  cx(t) {
    return t == null ? this.x() + this.width() / 2 : this.x(t - this.width() / 2);
  }
  cy(t) {
    return t == null ? this.y() + this.height() / 2 : this.y(t - this.height() / 2);
  }
  defs() {
    const t = this.root();
    return t && t.defs();
  }
  dmove(t, e) {
    return this.dx(t).dy(e);
  }
  dx(t = 0) {
    return this.x(new U(t).plus(this.x()));
  }
  dy(t = 0) {
    return this.y(new U(t).plus(this.y()));
  }
  getEventHolder() {
    return this;
  }
  height(t) {
    return this.attr("height", t);
  }
  move(t, e) {
    return this.x(t).y(e);
  }
  parents(t = this.root()) {
    const e = typeof t == "string", s = this.root(), i = s && s.node;
    e || (t = t && ut(t).node);
    const o = new Yt();
    let r = this;
    for (; (r = r.parent()) && r.node !== H.document && r.node.nodeName !== "#document-fragment" && (o.push(r), !(!e && r.node === t || e && r.matches(t))); )
      if (i && r.node === i) return null;
    return o;
  }
  reference(t) {
    if (t = this.attr(t), !t) return null;
    const e = Hh(this.node, t);
    return e ? ut(e) : null;
  }
  root() {
    const t = this.parent(Kl(Di));
    return t && t.root();
  }
  setData(t) {
    return this.dom = t, this;
  }
  size(t, e) {
    const s = be(this, t, e);
    return this.width(new U(s.width)).height(new U(s.height));
  }
  width(t) {
    return this.attr("width", t);
  }
  writeDataToDom(t) {
    return Zl(this, this.dom, t), super.writeDataToDom();
  }
  x(t) {
    return this.attr("x", t);
  }
  y(t) {
    return this.attr("y", t);
  }
};
G(bt, {
  bbox: Bh,
  rbox: Gh,
  inside: $h,
  point: Ih,
  ctm: Dh,
  screenCTM: Lh
});
F(bt, "Element");
const $e = {
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
  fill: [
    "color",
    "opacity",
    "rule"
  ],
  prefix: function(n, t) {
    return t === "color" ? n : n + "-" + t;
  }
};
["fill", "stroke"].forEach(function(n) {
  const t = {};
  let e;
  t[n] = function(s) {
    if (typeof s > "u") return this.attr(n);
    if (typeof s == "string" || s instanceof Gt || Gt.isRgb(s) || s instanceof bt) this.attr(n, s);
    else for (e = $e[n].length - 1; e >= 0; e--) s[$e[n][e]] != null && this.attr($e.prefix(n, $e[n][e]), s[$e[n][e]]);
    return this;
  }, $(["Element", "Runner"], t);
});
$(["Element", "Runner"], {
  matrix: function(n, t, e, s, i, o) {
    return n == null ? new B(this) : this.attr("transform", new B(n, t, e, s, i, o));
  },
  rotate: function(n, t, e) {
    return this.transform({
      rotate: n,
      ox: t,
      oy: e
    }, !0);
  },
  skew: function(n, t, e, s) {
    return arguments.length === 1 || arguments.length === 3 ? this.transform({
      skew: n,
      ox: t,
      oy: e
    }, !0) : this.transform({
      skew: [n, t],
      ox: e,
      oy: s
    }, !0);
  },
  shear: function(n, t, e) {
    return this.transform({
      shear: n,
      ox: t,
      oy: e
    }, !0);
  },
  scale: function(n, t, e, s) {
    return arguments.length === 1 || arguments.length === 3 ? this.transform({
      scale: n,
      ox: t,
      oy: e
    }, !0) : this.transform({
      scale: [n, t],
      ox: e,
      oy: s
    }, !0);
  },
  translate: function(n, t) {
    return this.transform({ translate: [n, t] }, !0);
  },
  relative: function(n, t) {
    return this.transform({ relative: [n, t] }, !0);
  },
  flip: function(n = "both", t = "center") {
    return "xybothtrue".indexOf(n) === -1 && (t = n, n = "both"), this.transform({
      flip: n,
      origin: t
    }, !0);
  },
  opacity: function(n) {
    return this.attr("opacity", n);
  }
});
$("radius", { radius: function(n, t = n) {
  return (this._element || this).type === "radialGradient" ? this.attr("r", new U(n)) : this.rx(n).ry(t);
} });
$("Path", {
  length: function() {
    return this.node.getTotalLength();
  },
  pointAt: function(n) {
    return new st(this.node.getPointAtLength(n));
  }
});
$(["Element", "Runner"], { font: function(n, t) {
  if (typeof n == "object") {
    for (t in n) this.font(t, n[t]);
    return this;
  }
  return n === "leading" ? this.leading(t) : n === "anchor" ? this.attr("text-anchor", t) : n === "size" || n === "family" || n === "weight" || n === "stretch" || n === "variant" || n === "style" ? this.attr("font-" + n, t) : this.attr(n, t);
} });
$("Element", [
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
}, {}));
function Jh() {
  return this.attr("transform", null);
}
function Qh() {
  return (this.attr("transform") || "").split(ph).slice(0, -1).map(function(n) {
    const t = n.trim().split("(");
    return [t[0].trim(), t[1].split(Wt).map(function(e) {
      return parseFloat(e);
    })];
  }).reverse().reduce(function(n, t) {
    return t[0] === "matrix" ? n.lmultiply(B.fromArray(t[1])) : n[t[0]].apply(n, t[1]);
  }, new B());
}
function td(n, t) {
  if (this === n) return this;
  if (ti(this.node)) return this.addTo(n, t);
  const e = this.screenCTM(), s = n.screenCTM().inverse();
  return this.addTo(n, t).untransform().transform(s.multiply(e)), this;
}
function ed(n) {
  return this.toParent(this.root(), n);
}
function nd(n, t) {
  if (n == null || typeof n == "string") {
    const s = new B(this).decompose();
    return n == null ? s : s[n];
  }
  B.isMatrixLike(n) || (n = {
    ...n,
    origin: Qs(n, this)
  });
  const e = new B(t === !0 ? this : t || !1).transform(n);
  return this.attr("transform", e);
}
$("Element", {
  untransform: Jh,
  matrixify: Qh,
  toParent: td,
  toRoot: ed,
  transform: nd
});
var Nt = class Zr extends bt {
  flatten() {
    return this.each(function() {
      if (this instanceof Zr) return this.flatten().ungroup();
    }), this;
  }
  ungroup(t = this.parent(), e = t.index(this)) {
    return e = e === -1 ? t.children().length : e, this.each(function(s, i) {
      return i[i.length - s - 1].toParent(t, e);
    }), this.remove();
  }
};
F(Nt, "Container");
var Gi = class extends Nt {
  constructor(n, t = n) {
    super(J("defs", n), t);
  }
  flatten() {
    return this;
  }
  ungroup() {
    return this;
  }
};
F(Gi, "Defs");
var _t = class extends bt {
};
F(_t, "Shape");
var sd = /* @__PURE__ */ De({
  cx: () => Jr,
  cy: () => Qr,
  height: () => ea,
  rx: () => $i,
  ry: () => Hi,
  width: () => ta,
  x: () => Vr,
  y: () => Kr
});
function $i(n) {
  return this.attr("rx", n);
}
function Hi(n) {
  return this.attr("ry", n);
}
function Vr(n) {
  return n == null ? this.cx() - this.rx() : this.cx(n + this.rx());
}
function Kr(n) {
  return n == null ? this.cy() - this.ry() : this.cy(n + this.ry());
}
function Jr(n) {
  return this.attr("cx", n);
}
function Qr(n) {
  return this.attr("cy", n);
}
function ta(n) {
  return n == null ? this.rx() * 2 : this.rx(new U(n).divide(2));
}
function ea(n) {
  return n == null ? this.ry() * 2 : this.ry(new U(n).divide(2));
}
var En = class extends _t {
  constructor(n, t = n) {
    super(J("ellipse", n), t);
  }
  size(n, t) {
    const e = be(this, n, t);
    return this.rx(new U(e.width).divide(2)).ry(new U(e.height).divide(2));
  }
};
G(En, sd);
$("Container", { ellipse: K(function(n = 0, t = n) {
  return this.put(new En()).size(n, t).move(0, 0);
}) });
F(En, "Ellipse");
var na = class extends Re {
  constructor(n = H.document.createDocumentFragment()) {
    super(n);
  }
  xml(n, t, e) {
    if (typeof n == "boolean" && (e = t, t = n, n = null), n == null || typeof n == "function") {
      const s = new Re(an("wrapper", e));
      return s.add(this.node.cloneNode(!0)), s.xml(!1, e);
    }
    return super.xml(n, !1, e);
  }
};
F(na, "Fragment");
var id = /* @__PURE__ */ De({
  from: () => sa,
  to: () => ia
});
function sa(n, t) {
  return (this._element || this).type === "radialGradient" ? this.attr({
    fx: new U(n),
    fy: new U(t)
  }) : this.attr({
    x1: new U(n),
    y1: new U(t)
  });
}
function ia(n, t) {
  return (this._element || this).type === "radialGradient" ? this.attr({
    cx: new U(n),
    cy: new U(t)
  }) : this.attr({
    x2: new U(n),
    y2: new U(t)
  });
}
var An = class extends Nt {
  constructor(n, t) {
    super(J(n + "Gradient", typeof n == "string" ? null : n), t);
  }
  attr(n, t, e) {
    return n === "transform" && (n = "gradientTransform"), super.attr(n, t, e);
  }
  bbox() {
    return new lt();
  }
  targets() {
    return Sn(this.node, "fill");
  }
  toString() {
    return this.url();
  }
  update(n) {
    return this.clear(), typeof n == "function" && n.call(this, this), this;
  }
  url() {
    return "url(#" + this.id() + ")";
  }
};
G(An, id);
$({
  Container: { gradient(...n) {
    return this.defs().gradient(...n);
  } },
  Defs: { gradient: K(function(n, t) {
    return this.put(new An(n)).update(t);
  }) }
});
F(An, "Gradient");
var cn = class extends Nt {
  constructor(n, t = n) {
    super(J("pattern", n), t);
  }
  attr(n, t, e) {
    return n === "transform" && (n = "patternTransform"), super.attr(n, t, e);
  }
  bbox() {
    return new lt();
  }
  targets() {
    return Sn(this.node, "fill");
  }
  toString() {
    return this.url();
  }
  update(n) {
    return this.clear(), typeof n == "function" && n.call(this, this), this;
  }
  url() {
    return "url(#" + this.id() + ")";
  }
};
$({
  Container: { pattern(...n) {
    return this.defs().pattern(...n);
  } },
  Defs: { pattern: K(function(n, t, e) {
    return this.put(new cn()).update(e).attr({
      x: 0,
      y: 0,
      width: n,
      height: t,
      patternUnits: "userSpaceOnUse"
    });
  }) }
});
F(cn, "Pattern");
var ds = class extends _t {
  constructor(t, e = t) {
    super(J("image", t), e);
  }
  load(t, e) {
    if (!t) return this;
    const s = new H.window.Image();
    return xt(s, "load", function(i) {
      const o = this.parent(cn);
      this.width() === 0 && this.height() === 0 && this.size(s.width, s.height), o instanceof cn && o.width() === 0 && o.height() === 0 && o.size(this.width(), this.height()), typeof e == "function" && e.call(this, i);
    }, this), xt(s, "load error", function() {
      rt(s);
    }), this.attr("href", s.src = t, _n);
  }
};
Vh(function(n, t, e) {
  return (n === "fill" || n === "stroke") && gh.test(t) && (t = e.root().defs().image(t)), t instanceof ds && (t = e.root().defs().pattern(0, 0, (s) => {
    s.add(t);
  })), t;
});
$({ Container: { image: K(function(n, t) {
  return this.put(new ds()).size(0, 0).load(n, t);
}) } });
F(ds, "Image");
var ne = class extends Ne {
  bbox() {
    let n = -1 / 0, t = -1 / 0, e = 1 / 0, s = 1 / 0;
    return this.forEach(function(i) {
      n = Math.max(i[0], n), t = Math.max(i[1], t), e = Math.min(i[0], e), s = Math.min(i[1], s);
    }), new lt(e, s, n - e, t - s);
  }
  move(n, t) {
    const e = this.bbox();
    if (n -= e.x, t -= e.y, !isNaN(n) && !isNaN(t)) for (let s = this.length - 1; s >= 0; s--) this[s] = [this[s][0] + n, this[s][1] + t];
    return this;
  }
  parse(n = [0, 0]) {
    const t = [];
    n instanceof Array ? n = Array.prototype.concat.apply([], n) : n = n.trim().split(Wt).map(parseFloat), n.length % 2 !== 0 && n.pop();
    for (let e = 0, s = n.length; e < s; e = e + 2) t.push([n[e], n[e + 1]]);
    return t;
  }
  size(n, t) {
    let e;
    const s = this.bbox();
    for (e = this.length - 1; e >= 0; e--)
      s.width && (this[e][0] = (this[e][0] - s.x) * n / s.width + s.x), s.height && (this[e][1] = (this[e][1] - s.y) * t / s.height + s.y);
    return this;
  }
  toLine() {
    return {
      x1: this[0][0],
      y1: this[0][1],
      x2: this[1][0],
      y2: this[1][1]
    };
  }
  toString() {
    const n = [];
    for (let t = 0, e = this.length; t < e; t++) n.push(this[t].join(","));
    return n.join(" ");
  }
  transform(n) {
    return this.clone().transformO(n);
  }
  transformO(n) {
    B.isMatrixLike(n) || (n = new B(n));
    for (let t = this.length; t--; ) {
      const [e, s] = this[t];
      this[t][0] = n.a * e + n.c * s + n.e, this[t][1] = n.b * e + n.d * s + n.f;
    }
    return this;
  }
}, Fi = /* @__PURE__ */ De({
  MorphArray: () => od,
  height: () => ld,
  width: () => cd,
  x: () => rd,
  y: () => ad
});
const od = ne;
function rd(n) {
  return n == null ? this.bbox().x : this.move(n, this.bbox().y);
}
function ad(n) {
  return n == null ? this.bbox().y : this.move(this.bbox().x, n);
}
function cd(n) {
  const t = this.bbox();
  return n == null ? t.width : this.size(n, t.height);
}
function ld(n) {
  const t = this.bbox();
  return n == null ? t.height : this.size(t.width, n);
}
var Pe = class extends _t {
  constructor(n, t = n) {
    super(J("line", n), t);
  }
  array() {
    return new ne([[this.attr("x1"), this.attr("y1")], [this.attr("x2"), this.attr("y2")]]);
  }
  move(n, t) {
    return this.attr(this.array().move(n, t).toLine());
  }
  plot(n, t, e, s) {
    return n == null ? this.array() : (typeof t < "u" ? n = {
      x1: n,
      y1: t,
      x2: e,
      y2: s
    } : n = new ne(n).toLine(), this.attr(n));
  }
  size(n, t) {
    const e = be(this, n, t);
    return this.attr(this.array().size(e.width, e.height).toLine());
  }
};
G(Pe, Fi);
$({ Container: { line: K(function(...n) {
  return Pe.prototype.plot.apply(this.put(new Pe()), n[0] != null ? n : [
    0,
    0,
    0,
    0
  ]);
}) } });
F(Pe, "Line");
var Xn = class extends Nt {
  constructor(n, t = n) {
    super(J("marker", n), t);
  }
  height(n) {
    return this.attr("markerHeight", n);
  }
  orient(n) {
    return this.attr("orient", n);
  }
  ref(n, t) {
    return this.attr("refX", n).attr("refY", t);
  }
  toString() {
    return "url(#" + this.id() + ")";
  }
  update(n) {
    return this.clear(), typeof n == "function" && n.call(this, this), this;
  }
  width(n) {
    return this.attr("markerWidth", n);
  }
};
$({
  Container: { marker(...n) {
    return this.defs().marker(...n);
  } },
  Defs: { marker: K(function(n, t, e) {
    return this.put(new Xn()).size(n, t).ref(n / 2, t / 2).viewbox(0, 0, n, t).attr("orient", "auto").update(e);
  }) },
  marker: { marker(n, t, e, s) {
    let i = ["marker"];
    return n !== "all" && i.push(n), i = i.join("-"), n = arguments[1] instanceof Xn ? arguments[1] : this.defs().marker(t, e, s), this.attr(i, n);
  } }
});
F(Xn, "Marker");
function Ae(n, t) {
  return function(e) {
    return e == null ? this[n] : (this[n] = e, t && t.call(this), this);
  };
}
const hd = {
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
  steps: function(n, t = "end") {
    t = t.split("-").reverse()[0];
    let e = n;
    return t === "none" ? --e : t === "both" && ++e, (s, i = !1) => {
      let o = Math.floor(s * n);
      const r = s * o % 1 === 0;
      return (t === "start" || t === "both") && ++o, i && r && --o, s >= 0 && o < 0 && (o = 0), s <= 1 && o > e && (o = e), o / e;
    };
  }
};
var Ui = class {
  done() {
    return !1;
  }
}, oi = class extends Ui {
  constructor(n = qe.ease) {
    super(), this.ease = hd[n] || n;
  }
  step(n, t, e) {
    return typeof n != "number" ? e < 1 ? n : t : n + (t - n) * this.ease(e);
  }
}, Wn = class extends Ui {
  constructor(n) {
    super(), this.stepper = n;
  }
  done(n) {
    return n.done;
  }
  step(n, t, e, s) {
    return this.stepper(n, t, e, s);
  }
};
function So() {
  const n = (this._duration || 500) / 1e3, t = this._overshoot || 0, e = 1e-10, s = Math.PI, i = Math.log(t / 100 + e), o = -i / Math.sqrt(s * s + i * i), r = 3.9 / (o * n);
  this.d = 2 * o * r, this.k = r * r;
}
var dd = class extends Wn {
  constructor(n = 500, t = 0) {
    super(), this.duration(n).overshoot(t);
  }
  step(n, t, e, s) {
    if (typeof n == "string") return n;
    if (s.done = e === 1 / 0, e === 1 / 0) return t;
    if (e === 0) return n;
    e > 100 && (e = 16), e /= 1e3;
    const i = s.velocity || 0, o = -this.d * i - this.k * (n - t), r = n + i * e + o * e * e / 2;
    return s.velocity = i + o * e, s.done = Math.abs(t - r) + Math.abs(i) < 2e-3, s.done ? t : r;
  }
};
G(dd, {
  duration: Ae("_duration", So),
  overshoot: Ae("_overshoot", So)
});
var ud = class extends Wn {
  constructor(n = 0.1, t = 0.01, e = 0, s = 1e3) {
    super(), this.p(n).i(t).d(e).windup(s);
  }
  step(n, t, e, s) {
    if (typeof n == "string") return n;
    if (s.done = e === 1 / 0, e === 1 / 0) return t;
    if (e === 0) return n;
    const i = t - n;
    let o = (s.integral || 0) + i * e;
    const r = (i - (s.error || 0)) / e, a = this._windup;
    return a !== !1 && (o = Math.max(-a, Math.min(o, a))), s.error = i, s.integral = o, s.done = Math.abs(i) < 1e-3, s.done ? t : n + (this.P * i + this.I * o + this.D * r);
  }
};
G(ud, {
  windup: Ae("_windup"),
  p: Ae("P"),
  i: Ae("I"),
  d: Ae("D")
});
const fd = {
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
}, ri = {
  M: function(n, t, e) {
    return t.x = e.x = n[0], t.y = e.y = n[1], [
      "M",
      t.x,
      t.y
    ];
  },
  L: function(n, t) {
    return t.x = n[0], t.y = n[1], [
      "L",
      n[0],
      n[1]
    ];
  },
  H: function(n, t) {
    return t.x = n[0], ["H", n[0]];
  },
  V: function(n, t) {
    return t.y = n[0], ["V", n[0]];
  },
  C: function(n, t) {
    return t.x = n[4], t.y = n[5], [
      "C",
      n[0],
      n[1],
      n[2],
      n[3],
      n[4],
      n[5]
    ];
  },
  S: function(n, t) {
    return t.x = n[2], t.y = n[3], [
      "S",
      n[0],
      n[1],
      n[2],
      n[3]
    ];
  },
  Q: function(n, t) {
    return t.x = n[2], t.y = n[3], [
      "Q",
      n[0],
      n[1],
      n[2],
      n[3]
    ];
  },
  T: function(n, t) {
    return t.x = n[0], t.y = n[1], [
      "T",
      n[0],
      n[1]
    ];
  },
  Z: function(n, t, e) {
    return t.x = e.x, t.y = e.y, ["Z"];
  },
  A: function(n, t) {
    return t.x = n[5], t.y = n[6], [
      "A",
      n[0],
      n[1],
      n[2],
      n[3],
      n[4],
      n[5],
      n[6]
    ];
  }
}, Rs = "mlhvqtcsaz".split("");
for (let n = 0, t = Rs.length; n < t; ++n) ri[Rs[n]] = /* @__PURE__ */ function(e) {
  return function(s, i, o) {
    if (e === "H") s[0] = s[0] + i.x;
    else if (e === "V") s[0] = s[0] + i.y;
    else if (e === "A")
      s[5] = s[5] + i.x, s[6] = s[6] + i.y;
    else for (let r = 0, a = s.length; r < a; ++r) s[r] = s[r] + (r % 2 ? i.y : i.x);
    return ri[e](s, i, o);
  };
}(Rs[n].toUpperCase());
function pd(n) {
  return ri[n.segment[0]](n.segment.slice(1), n.p, n.p0);
}
function ai(n) {
  return n.segment.length && n.segment.length - 1 === fd[n.segment[0].toUpperCase()];
}
function md(n, t) {
  n.inNumber && de(n, !1);
  const e = Li.test(t);
  if (e) n.segment = [t];
  else {
    const s = n.lastCommand, i = s.toLowerCase();
    n.segment = [i === "m" ? s === i ? "l" : "L" : s];
  }
  return n.inSegment = !0, n.lastCommand = n.segment[0], e;
}
function de(n, t) {
  if (!n.inNumber) throw new Error("Parser Error");
  n.number && n.segment.push(parseFloat(n.number)), n.inNumber = t, n.number = "", n.pointSeen = !1, n.hasExponent = !1, ai(n) && ci(n);
}
function ci(n) {
  n.inSegment = !1, n.absolute && (n.segment = pd(n)), n.segments.push(n.segment);
}
function gd(n) {
  if (!n.segment.length) return !1;
  const t = n.segment[0].toUpperCase() === "A", e = n.segment.length;
  return t && (e === 4 || e === 5);
}
function yd(n) {
  return n.lastToken.toUpperCase() === "E";
}
const bd = /* @__PURE__ */ new Set([
  " ",
  ",",
  "	",
  `
`,
  "\r",
  "\f"
]);
function vd(n, t = !0) {
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
    p0: new st(),
    p: new st()
  };
  for (; i.lastToken = s, s = n.charAt(e++); )
    if (!(!i.inSegment && md(i, s))) {
      if (s === ".") {
        if (i.pointSeen || i.hasExponent) {
          de(i, !1), --e;
          continue;
        }
        i.inNumber = !0, i.pointSeen = !0, i.number += s;
        continue;
      }
      if (!isNaN(parseInt(s))) {
        if (i.number === "0" || gd(i)) {
          i.inNumber = !0, i.number = s, de(i, !0);
          continue;
        }
        i.inNumber = !0, i.number += s;
        continue;
      }
      if (bd.has(s)) {
        i.inNumber && de(i, !1);
        continue;
      }
      if (s === "-" || s === "+") {
        if (i.inNumber && !yd(i)) {
          de(i, !1), --e;
          continue;
        }
        i.number += s, i.inNumber = !0;
        continue;
      }
      if (s.toUpperCase() === "E") {
        i.number += s, i.hasExponent = !0;
        continue;
      }
      if (Li.test(s)) {
        if (i.inNumber) de(i, !1);
        else if (ai(i)) ci(i);
        else throw new Error("parser Error");
        --e;
      }
    }
  return i.inNumber && de(i, !1), i.inSegment && ai(i) && ci(i), i.segments;
}
function wd(n) {
  let t = "";
  for (let e = 0, s = n.length; e < s; e++)
    t += n[e][0], n[e][1] != null && (t += n[e][1], n[e][2] != null && (t += " ", t += n[e][2], n[e][3] != null && (t += " ", t += n[e][3], t += " ", t += n[e][4], n[e][5] != null && (t += " ", t += n[e][5], t += " ", t += n[e][6], n[e][7] != null && (t += " ", t += n[e][7])))));
  return t + " ";
}
var se = class extends Ne {
  bbox() {
    return Ft().path.setAttribute("d", this.toString()), new lt(Ft.nodes.path.getBBox());
  }
  move(n, t) {
    const e = this.bbox();
    if (n -= e.x, t -= e.y, !isNaN(n) && !isNaN(t)) for (let s, i = this.length - 1; i >= 0; i--)
      s = this[i][0], s === "M" || s === "L" || s === "T" ? (this[i][1] += n, this[i][2] += t) : s === "H" ? this[i][1] += n : s === "V" ? this[i][1] += t : s === "C" || s === "S" || s === "Q" ? (this[i][1] += n, this[i][2] += t, this[i][3] += n, this[i][4] += t, s === "C" && (this[i][5] += n, this[i][6] += t)) : s === "A" && (this[i][6] += n, this[i][7] += t);
    return this;
  }
  parse(n = "M0 0") {
    return Array.isArray(n) && (n = Array.prototype.concat.apply([], n).toString()), vd(n);
  }
  size(n, t) {
    const e = this.bbox();
    let s, i;
    for (e.width = e.width === 0 ? 1 : e.width, e.height = e.height === 0 ? 1 : e.height, s = this.length - 1; s >= 0; s--)
      i = this[s][0], i === "M" || i === "L" || i === "T" ? (this[s][1] = (this[s][1] - e.x) * n / e.width + e.x, this[s][2] = (this[s][2] - e.y) * t / e.height + e.y) : i === "H" ? this[s][1] = (this[s][1] - e.x) * n / e.width + e.x : i === "V" ? this[s][1] = (this[s][1] - e.y) * t / e.height + e.y : i === "C" || i === "S" || i === "Q" ? (this[s][1] = (this[s][1] - e.x) * n / e.width + e.x, this[s][2] = (this[s][2] - e.y) * t / e.height + e.y, this[s][3] = (this[s][3] - e.x) * n / e.width + e.x, this[s][4] = (this[s][4] - e.y) * t / e.height + e.y, i === "C" && (this[s][5] = (this[s][5] - e.x) * n / e.width + e.x, this[s][6] = (this[s][6] - e.y) * t / e.height + e.y)) : i === "A" && (this[s][1] = this[s][1] * n / e.width, this[s][2] = this[s][2] * t / e.height, this[s][6] = (this[s][6] - e.x) * n / e.width + e.x, this[s][7] = (this[s][7] - e.y) * t / e.height + e.y);
    return this;
  }
  toString() {
    return wd(this);
  }
};
const oa = (n) => {
  const t = typeof n;
  return t === "number" ? U : t === "string" ? Gt.isColor(n) ? Gt : Wt.test(n) ? Li.test(n) ? se : Ne : Fr.test(n) ? U : li : ji.indexOf(n.constructor) > -1 ? n.constructor : Array.isArray(n) ? Ne : t === "object" ? ln : li;
};
var Vt = class {
  constructor(n) {
    this._stepper = n || new oi("-"), this._from = null, this._to = null, this._type = null, this._context = null, this._morphObj = null;
  }
  at(n) {
    return this._morphObj.morph(this._from, this._to, n, this._stepper, this._context);
  }
  done() {
    return this._context.map(this._stepper.done).reduce(function(n, t) {
      return n && t;
    }, !0);
  }
  from(n) {
    return n == null ? this._from : (this._from = this._set(n), this);
  }
  stepper(n) {
    return n == null ? this._stepper : (this._stepper = n, this);
  }
  to(n) {
    return n == null ? this._to : (this._to = this._set(n), this);
  }
  type(n) {
    return n == null ? this._type : (this._type = n, this);
  }
  _set(n) {
    this._type || this.type(oa(n));
    let t = new this._type(n);
    return this._type === Gt && (t = this._to ? t[this._to[4]]() : this._from ? t[this._from[4]]() : t), this._type === ln && (t = this._to ? t.align(this._to) : this._from ? t.align(this._from) : t), t = t.toConsumable(), this._morphObj = this._morphObj || new this._type(), this._context = this._context || Array.apply(null, Array(t.length)).map(Object).map(function(e) {
      return e.done = !0, e;
    }), t;
  }
}, li = class {
  constructor(...n) {
    this.init(...n);
  }
  init(n) {
    return n = Array.isArray(n) ? n[0] : n, this.value = n, this;
  }
  toArray() {
    return [this.value];
  }
  valueOf() {
    return this.value;
  }
}, Qe = class ra {
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
    }), Object.assign(this, ra.defaults, t), this;
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
};
Qe.defaults = {
  scaleX: 1,
  scaleY: 1,
  shear: 0,
  rotate: 0,
  translateX: 0,
  translateY: 0,
  originX: 0,
  originY: 0
};
const xd = (n, t) => n[0] < t[0] ? -1 : n[0] > t[0] ? 1 : 0;
var ln = class {
  constructor(...n) {
    this.init(...n);
  }
  align(n) {
    const t = this.values;
    for (let e = 0, s = t.length; e < s; ++e) {
      if (t[e + 1] === n[e + 1]) {
        if (t[e + 1] === Gt && n[e + 7] !== t[e + 7]) {
          const r = n[e + 7], a = new Gt(this.values.splice(e + 3, 5))[r]().toArray();
          this.values.splice(e + 3, 0, ...a);
        }
        e += t[e + 2] + 2;
        continue;
      }
      if (!n[e + 1]) return this;
      const i = new n[e + 1]().toArray(), o = t[e + 2] + 3;
      t.splice(e, o, n[e], n[e + 1], n[e + 2], ...i), e += t[e + 2] + 2;
    }
    return this;
  }
  init(n) {
    if (this.values = [], Array.isArray(n)) {
      this.values = n.slice();
      return;
    }
    n = n || {};
    const t = [];
    for (const e in n) {
      const s = oa(n[e]), i = new s(n[e]).toArray();
      t.push([
        e,
        s,
        i.length,
        ...i
      ]);
    }
    return t.sort(xd), this.values = t.reduce((e, s) => e.concat(s), []), this;
  }
  toArray() {
    return this.values;
  }
  valueOf() {
    const n = {}, t = this.values;
    for (; t.length; ) {
      const e = t.shift(), s = t.shift(), i = t.shift();
      n[e] = new s(t.splice(0, i));
    }
    return n;
  }
};
const ji = [
  li,
  Qe,
  ln
];
function _d(n = []) {
  ji.push(...[].concat(n));
}
function Sd() {
  G(ji, {
    to(n) {
      return new Vt().type(this.constructor).from(this.toArray()).to(n);
    },
    fromArray(n) {
      return this.init(n), this;
    },
    toConsumable() {
      return this.toArray();
    },
    morph(n, t, e, s, i) {
      const o = function(r, a) {
        return s.step(r, t[a], e, i[a], i);
      };
      return this.fromArray(n.map(o));
    }
  });
}
var Le = class extends _t {
  constructor(n, t = n) {
    super(J("path", n), t);
  }
  array() {
    return this._array || (this._array = new se(this.attr("d")));
  }
  clear() {
    return delete this._array, this;
  }
  height(n) {
    return n == null ? this.bbox().height : this.size(this.bbox().width, n);
  }
  move(n, t) {
    return this.attr("d", this.array().move(n, t));
  }
  plot(n) {
    return n == null ? this.array() : this.clear().attr("d", typeof n == "string" ? n : this._array = new se(n));
  }
  size(n, t) {
    const e = be(this, n, t);
    return this.attr("d", this.array().size(e.width, e.height));
  }
  width(n) {
    return n == null ? this.bbox().width : this.size(n, this.bbox().height);
  }
  x(n) {
    return n == null ? this.bbox().x : this.move(n, this.bbox().y);
  }
  y(n) {
    return n == null ? this.bbox().y : this.move(this.bbox().x, n);
  }
};
Le.prototype.MorphArray = se;
$({ Container: { path: K(function(n) {
  return this.put(new Le()).plot(n || new se());
}) } });
F(Le, "Path");
var aa = /* @__PURE__ */ De({
  array: () => Cd,
  clear: () => Ed,
  move: () => Ad,
  plot: () => Td,
  size: () => Md
});
function Cd() {
  return this._array || (this._array = new ne(this.attr("points")));
}
function Ed() {
  return delete this._array, this;
}
function Ad(n, t) {
  return this.attr("points", this.array().move(n, t));
}
function Td(n) {
  return n == null ? this.array() : this.clear().attr("points", typeof n == "string" ? n : this._array = new ne(n));
}
function Md(n, t) {
  const e = be(this, n, t);
  return this.attr("points", this.array().size(e.width, e.height));
}
var ze = class extends _t {
  constructor(n, t = n) {
    super(J("polygon", n), t);
  }
};
$({ Container: { polygon: K(function(n) {
  return this.put(new ze()).plot(n || new ne());
}) } });
G(ze, Fi);
G(ze, aa);
F(ze, "Polygon");
var Be = class extends _t {
  constructor(n, t = n) {
    super(J("polyline", n), t);
  }
};
$({ Container: { polyline: K(function(n) {
  return this.put(new Be()).plot(n || new ne());
}) } });
G(Be, Fi);
G(Be, aa);
F(Be, "Polyline");
var Tn = class extends _t {
  constructor(n, t = n) {
    super(J("rect", n), t);
  }
};
G(Tn, {
  rx: $i,
  ry: Hi
});
$({ Container: { rect: K(function(n, t) {
  return this.put(new Tn()).size(n, t);
}) } });
F(Tn, "Rect");
var Ps = class {
  constructor() {
    this._first = null, this._last = null;
  }
  first() {
    return this._first && this._first.value;
  }
  last() {
    return this._last && this._last.value;
  }
  push(n) {
    const t = typeof n.next < "u" ? n : {
      value: n,
      next: null,
      prev: null
    };
    return this._last ? (t.prev = this._last, this._last.next = t, this._last = t) : (this._last = t, this._first = t), t;
  }
  remove(n) {
    n.prev && (n.prev.next = n.next), n.next && (n.next.prev = n.prev), n === this._last && (this._last = n.prev), n === this._first && (this._first = n.next), n.prev = null, n.next = null;
  }
  shift() {
    const n = this._first;
    return n ? (this._first = n.next, this._first && (this._first.prev = null), this._last = this._first ? this._last : null, n.value) : null;
  }
};
const j = {
  nextDraw: null,
  frames: new Ps(),
  timeouts: new Ps(),
  immediates: new Ps(),
  timer: () => H.window.performance || H.window.Date,
  frame(n) {
    const t = j.frames.push({ run: n });
    return j.nextDraw === null && (j.nextDraw = H.window.requestAnimationFrame(j._draw)), t;
  },
  timeout(n, t) {
    t = t || 0;
    const e = j.timer().now() + t, s = j.timeouts.push({
      run: n,
      time: e
    });
    return j.nextDraw === null && (j.nextDraw = H.window.requestAnimationFrame(j._draw)), s;
  },
  immediate(n) {
    const t = j.immediates.push(n);
    return j.nextDraw === null && (j.nextDraw = H.window.requestAnimationFrame(j._draw)), t;
  },
  cancelFrame(n) {
    n != null && j.frames.remove(n);
  },
  clearTimeout(n) {
    n != null && j.timeouts.remove(n);
  },
  cancelImmediate(n) {
    n != null && j.immediates.remove(n);
  },
  _draw(n) {
    try {
      let t = null;
      const e = j.timeouts.last();
      for (; (t = j.timeouts.shift()) && (n >= t.time ? t.run() : j.timeouts.push(t), t !== e); )
        ;
      let s = null;
      const i = j.frames.last();
      for (; s !== i && (s = j.frames.shift()); ) s.run(n);
      let o = null;
      for (; o = j.immediates.shift(); ) o();
    } finally {
      const t = j.timeouts.first() || j.frames.first() || j.immediates.first();
      j.nextDraw = t ? H.window.requestAnimationFrame(j._draw) : null;
    }
  }
}, kd = function(n) {
  const t = n.start, e = n.runner.duration();
  return {
    start: t,
    duration: e,
    end: t + e,
    runner: n.runner
  };
}, Nd = function() {
  const n = H.window;
  return (n.performance || n.Date).now();
};
var ca = class extends Cn {
  constructor(n = Nd) {
    super(), this._timeSource = n, this.terminate();
  }
  active() {
    return !!this._nextFrame;
  }
  finish() {
    this._finishing = !0;
    try {
      this.time(this.getEndTimeOfTimeline() + 1);
    } finally {
      this._finishing = !1;
    }
    return this.pause();
  }
  getEndTime() {
    const n = this.getLastRunnerInfo(), t = n ? n.runner.duration() : 0;
    return (n ? n.start : this._time) + t;
  }
  getEndTimeOfTimeline() {
    const n = this._runners.map((t) => t.start + t.runner.duration());
    return Math.max(0, ...n);
  }
  getLastRunnerInfo() {
    return this.getRunnerInfoById(this._lastRunnerId);
  }
  getRunnerInfoById(n) {
    return this._runners[this._runnerIds.indexOf(n)] || null;
  }
  pause() {
    return this._paused = !0, this._continue();
  }
  persist(n) {
    return n == null ? this._persist : (this._persist = n, this);
  }
  play() {
    return this._paused = !1, this.updateTime()._continue();
  }
  reverse(n) {
    const t = this.speed();
    if (n == null) return this.speed(-t);
    const e = Math.abs(t);
    return this.speed(n ? -e : e);
  }
  schedule(n, t, e) {
    if (n == null) return this._runners.map(kd);
    let s = 0;
    const i = this.getEndTime();
    if (t = t || 0, e == null || e === "last" || e === "after") s = i;
    else if (e === "absolute" || e === "start")
      s = t, t = 0;
    else if (e === "now") s = this._time;
    else if (e === "relative") {
      const a = this.getRunnerInfoById(n.id);
      a && (s = a.start + t, t = 0);
    } else if (e === "with-last") {
      const a = this.getLastRunnerInfo();
      s = a ? a.start : this._time;
    } else throw new Error('Invalid value for the "when" parameter');
    n.unschedule(), n.timeline(this), n._retired = !1;
    const o = n.persist(), r = {
      persist: o === null ? this._persist : o,
      start: s + t,
      runner: n
    };
    return this._lastRunnerId = n.id, n._runnerInfo = r, this._runners.push(r), this._runners.sort((a, c) => a.start - c.start), this._runnerIds = this._runners.map((a) => a.runner.id), this.updateTime()._continue(), this;
  }
  seek(n) {
    return this.time(this._time + n);
  }
  source(n) {
    return n == null ? this._timeSource : (this._timeSource = n, this);
  }
  speed(n) {
    return n == null ? this._speed : (this._speed = n, this);
  }
  stop() {
    return this.time(0), this.pause();
  }
  time(n) {
    return n == null ? this._time : (this._time = n, this._continue(!0));
  }
  unschedule(n) {
    const t = this._runnerIds.indexOf(n.id);
    return t < 0 ? this : (this._runners.splice(t, 1), this._runnerIds.splice(t, 1), n.timeline(null), n._runnerInfo = null, n._retired = !0, this);
  }
  updateTime() {
    return this.active() || (this._lastSourceTime = this._timeSource()), this;
  }
  _continue(n = !1) {
    return j.cancelFrame(this._nextFrame), this._nextFrame = null, n ? this._stepImmediate() : this._paused ? this : (this._nextFrame = j.frame(this._step), this);
  }
  _stepFn(n = !1) {
    const t = this._generation, e = this._timeSource();
    let s = e - this._lastSourceTime;
    n && (s = 0);
    const i = this._speed * s + (this._time - this._lastStepTime);
    this._lastSourceTime = e, n || (this._time += i, this._time = this._time < 0 ? 0 : this._time), this._lastStepTime = this._time, this.fire("time", this._time);
    const o = this._runners.slice();
    for (let a = o.length; a--; ) {
      const c = o[a];
      if (c.runner._runnerInfo !== c) continue;
      const l = c.runner;
      this._time - c.start < 0 && l.reset(!0);
    }
    let r = !1;
    for (const a of this._runners.slice()) {
      if (a.runner._runnerInfo !== a) continue;
      const c = a.runner;
      let l = i;
      const h = this._time - a.start;
      if (h < 0) {
        r = !0;
        continue;
      } else if (h === 0) {
        c.reset(), r = !0;
        continue;
      } else h < l && (l = h);
      if (!c.active()) continue;
      const d = (this._finishing && c._isDeclarative ? c.finish() : c.step(l)).done;
      c._runnerInfo === a && (d ? a.persist !== !0 && c.duration() - c.time() + this._time + a.persist <= this._time && c.unschedule() : r = !0);
    }
    return t !== this._generation ? this : (r || (r = this._runners.some(({ start: a, runner: c }) => a >= this._time || c.active() && !c.done)), r && !(this._speed < 0 && this._time === 0) || this._runnerIds.length && this._speed < 0 && this._time > 0 ? this._continue() : (this.pause(), this.fire("finished")), this);
  }
  terminate() {
    j.cancelFrame(this._nextFrame), this._generation = (this._generation || 0) + 1, this._startTime = 0, this._speed = 1, this._persist = 0;
    for (const { runner: n } of this._runners || [])
      n._retired = !0, n._runnerInfo = null;
    this._nextFrame = null, this._paused = !0, this._finishing = !1, this._runners = [], this._runnerIds = [], this._lastRunnerId = -1, this._time = 0, this._lastSourceTime = 0, this._lastStepTime = 0, this._step = this._stepFn.bind(this, !1), this._stepImmediate = this._stepFn.bind(this, !0);
  }
};
$({ Element: { timeline: function(n) {
  return n == null ? (this._timeline = this._timeline || new ca(), this._timeline) : (this._timeline = n, this);
} } });
var Xt = class Un extends Cn {
  constructor(t) {
    super(), this.id = Un.id++, t = t ?? qe.duration, t = typeof t == "function" ? new Wn(t) : t, this._element = null, this._timeline = null, this._runnerInfo = null, this.done = !1, this._queue = [], this._duration = typeof t == "number" && t, this._isDeclarative = t instanceof Wn, this._stepper = this._isDeclarative ? t : new oi(), this._history = {}, this.enabled = !0, this._time = 0, this._lastTime = 0, this._reseted = !0, this.transforms = new B(), this._isAbsoluteTransform = !1, this._hasTransform = !1, this._transformInitialised = !1, this._transformActive = !1, this._retired = !1, this._reverse = !1, this._swing = !1, this._wait = 0, this._times = 1, this._persist = this._isDeclarative ? !0 : null;
  }
  static sanitise(t, e, s) {
    let i = 1, o = !1, r = 0;
    return t = t ?? qe.duration, e = e ?? qe.delay, s = s || "last", typeof t == "object" && !(t instanceof Ui) && (e = t.delay ?? e, s = t.when ?? s, o = t.swing || o, i = t.times ?? i, r = t.wait ?? r, t = t.duration ?? qe.duration), {
      duration: t,
      delay: e,
      swing: o,
      times: i,
      wait: r,
      when: s
    };
  }
  active(t) {
    return t == null ? this.enabled : (this.enabled = t, this);
  }
  addTransform(t) {
    return this.transforms.lmultiplyO(t), this._transformInitialised = !0, this._transformActive = !0, this;
  }
  after(t) {
    return this.on("finished", t);
  }
  animate(t, e, s) {
    const i = Un.sanitise(t, e, s), o = new Un(i.duration);
    return this._timeline && o.timeline(this._timeline), this._element && o.element(this._element), o.loop(i).schedule(i.delay, i.when);
  }
  clearTransform() {
    return this.transforms = new B(), this;
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
    return this._stepper = new oi(t), this;
  }
  element(t) {
    return t == null ? this._element : (this._element = t, t._prepareRunner(), this);
  }
  finish() {
    if (!this._isDeclarative) return this.time(this.duration());
    const t = this._time;
    return this.step(1 / 0), this._time = t, this;
  }
  loop(t, e, s) {
    return typeof t == "object" && (e = t.swing, s = t.wait, t = t.times), this._times = t || 1 / 0, this._swing = e || !1, this._wait = s || 0, this._times === !0 && (this._times = 1 / 0), this;
  }
  loops(t) {
    const e = this._duration + this._wait;
    if (t == null) {
      const r = Math.floor(this._time / e), a = (this._time - r * e) / this._duration;
      return Math.min(r + a, this._times);
    }
    const s = Math.floor(t), i = t % 1, o = e * s + this._duration * i;
    return this.time(o);
  }
  persist(t) {
    return t == null ? this._persist : (this._persist = t, this);
  }
  position(t) {
    const e = this._time, s = this._duration, i = this._wait, o = this._times, r = this._swing, a = this._reverse;
    let c;
    if (t == null) {
      const d = function(f) {
        const p = r * Math.floor(f % (2 * (i + s)) / (i + s)), m = p && !a || !p && a, g = Math.pow(-1, m) * (f % (i + s)) / s + m;
        return Math.max(Math.min(g, 1), 0);
      }, u = o * (i + s) - i;
      return c = e <= 0 ? Math.round(d(1e-5)) : e < u ? d(e) : Math.round(d(u - 1e-5)), c;
    }
    const l = Math.floor(this.loops()), h = r && l % 2 === 0;
    return c = l + (h && !a || a && h ? t : 1 - t), this.loops(c);
  }
  progress(t) {
    return t == null ? Math.min(1, this._time / this.duration()) : this.time(t * this.duration());
  }
  queue(t, e, s, i) {
    return this._isDeclarative && (this.done = !1), this._queue.push({
      initialiser: t || _o,
      runner: e || _o,
      retarget: s,
      isTransform: i,
      initialised: !1,
      finished: !1
    }), this.timeline() && this.timeline()._continue(), this;
  }
  reset(t = !1) {
    if (this._reseted) {
      const e = !t && this._hasTransform && this.position() !== 0;
      return e && !this._transformInitialised ? (this.step(0), this._reseted = !0, this) : (e !== this._transformActive && (this._transformActive = e, this._element && this._element._addRunner(this)), this);
    }
    return this._reseted || (this.time(0), this._reseted = !0), t && this._transformActive && (this._transformActive = !1, this._element && this._element._addRunner(this)), this;
  }
  reverse(t) {
    return this._reverse = t ?? !this._reverse, this;
  }
  schedule(t, e, s) {
    if (t instanceof ca || (s = e, e = t, t = this.timeline()), !t) throw Error("Runner cannot be scheduled without timeline");
    return t.schedule(this, e, s), this;
  }
  step(t) {
    if (!this.enabled) return this;
    const e = this.done;
    t = t ?? 16, this._time += t;
    const s = this.position(), i = this._lastPosition !== s && this._time >= 0;
    this._lastPosition = s;
    const o = this.duration(), r = this._lastTime <= 0 && this._time > 0;
    this._lastTime = this._time, r && this.fire("start", this);
    const a = this._isDeclarative;
    this.done = !a && this._time >= o, this._reseted = !1;
    const c = this._hasTransform && (this._time > 0 || s !== 0);
    this._transformActive = c;
    let l = !1;
    return (i || a) && (this._initialise(i), this.transforms = new B(), l = this._run(a ? t : s), this._transformActive = c, this.fire("step", this)), this.done = this.done || l && a, this.done && !e && this.fire("finished", this), this;
  }
  time(t) {
    if (t == null) return this._time;
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
  _initialise(t) {
    if (!(!t && !this._isDeclarative))
      for (let e = 0, s = this._queue.length; e < s; ++e) {
        const i = this._queue[e], o = this._isDeclarative || !i.initialised && t;
        t = !i.finished, o && t && (i.initialiser.call(this), i.initialised = !0);
      }
  }
  _rememberMorpher(t, e) {
    if (this._history[t] = {
      morpher: e,
      caller: this._queue[this._queue.length - 1]
    }, this._isDeclarative) {
      const s = this.timeline();
      s && s.play();
    }
  }
  _run(t) {
    let e = !0;
    for (let s = 0, i = this._queue.length; s < i; ++s) {
      const o = this._queue[s];
      if (this._isDeclarative && o.finished && !o.isTransform) continue;
      const r = o.runner.call(this, t);
      o.finished = o.finished || r === !0, e = e && o.finished;
    }
    return e;
  }
  _tryRetarget(t, e, s) {
    if (this._history[t]) {
      if (!this._history[t].caller.initialised) {
        const o = this._queue.indexOf(this._history[t].caller);
        return this._queue.splice(o, 1), !1;
      }
      this._history[t].caller.retarget ? this._history[t].caller.retarget.call(this, e, s) : this._history[t].morpher.to(e), this._history[t].caller.finished = !1, this._isDeclarative && (this.done = !1);
      const i = this.timeline();
      return i && i.play(), !0;
    }
    return !1;
  }
};
Xt.id = 0;
var hi = class {
  constructor(n = new B(), t = -1, e = !0, s = !1) {
    this.transforms = n, this.id = t, this.done = e, this._isAbsoluteTransform = s, this._transformActive = !0, this._retired = !0;
  }
};
G([Xt, hi], { mergeWith(n) {
  return new hi(this._isAbsoluteTransform ? this.transforms : n.transforms.lmultiply(this.transforms), n.id, !0, n._isAbsoluteTransform || this._isAbsoluteTransform);
} });
const la = (n, t) => n.lmultiplyO(t), ha = (n) => n.transforms, Rd = (n) => n._transformActive;
function da(n) {
  const t = n.filter(Rd);
  let e = 0;
  for (let s = 0; s < t.length; ++s) t[s]._isAbsoluteTransform && (e = s);
  return t.slice(e);
}
function Pd() {
  const n = da(this._transformationRunners.runners).map(ha).reduce(la, new B());
  this.transform(n), this._transformationRunners.merge(), this._transformationRunners.length() === 1 && (this._frameId = null);
}
var Od = class {
  constructor() {
    this.runners = [];
  }
  add(n) {
    var t;
    if (!(0, pe.default)(t = this.runners).call(t, n))
      return this.runners.push(n), this;
  }
  edit(n, t) {
    const e = this.runners.findIndex((s) => s.id === n);
    return e >= 0 && this.runners.splice(e, 1, t), this;
  }
  getByID(n) {
    return this.runners.find((t) => t.id === n);
  }
  length() {
    return this.runners.length;
  }
  merge() {
    let n = null;
    for (let t = 0; t < this.runners.length; ++t) {
      const e = this.runners[t];
      if (n && e.done && n.done && e._retired && n._retired) {
        this.remove(e.id);
        const s = e.mergeWith(n);
        this.edit(n.id, s), n = s, --t;
      } else n = e;
    }
    return this;
  }
  remove(n) {
    const t = this.runners.findIndex((e) => e.id === n);
    return t >= 0 && this.runners.splice(t, 1), this;
  }
};
$({ Element: {
  animate(n, t, e) {
    const s = Xt.sanitise(n, t, e), i = this.timeline();
    return new Xt(s.duration).loop(s).element(this).timeline(i.play()).schedule(s.delay, s.when);
  },
  delay(n, t) {
    return this.animate(0, n, t);
  },
  _currentTransform(n) {
    const t = this._transformationRunners.runners, e = t.indexOf(n);
    return da(t.slice(0, e + 1)).map(ha).reduce(la, new B());
  },
  _addRunner(n) {
    this._transformationRunners.length() === 1 && this._transformationRunners.runners[0].id === -1 && (this._transformationRunners.runners[0].transforms = new B(this)), this._transformationRunners.add(n), j.cancelImmediate(this._frameId), this._frameId = j.immediate(Pd.bind(this));
  },
  _prepareRunner() {
    this._frameId == null && (this._transformationRunners = new Od().add(new hi(new B(this))));
  }
} });
const Id = (n, t) => n.filter((e) => !(0, pe.default)(t).call(t, e));
G(Xt, {
  attr(n, t) {
    return this.styleAttr("attr", n, t);
  },
  css(n, t) {
    return this.styleAttr("css", n, t);
  },
  styleAttr(n, t, e) {
    if (typeof t == "string") return this.styleAttr(n, { [t]: e });
    const s = t, i = this._history[n];
    if (i && !i.caller.initialised && i.caller.retarget)
      return i.caller.retarget.call(this, s), this;
    if (this._tryRetarget(n, s)) return this;
    let o = new Vt(this._stepper).to(s), r = Object.keys(s);
    return this.queue(function() {
      o = o.from(this.element()[n](r));
    }, function(a) {
      return this.element()[n](o.at(a).valueOf()), o.done();
    }, function(a) {
      const c = Id(Object.keys(a), r);
      if (c.length && o.from() != null) {
        const h = this.element()[n](c), d = new ln(o.from()).valueOf();
        Object.assign(d, h), o.from(d);
      }
      const l = new ln(o.to()).valueOf();
      Object.assign(l, a), o.to(l), r = Object.keys(l);
    }), this._rememberMorpher(n, o), this;
  },
  zoom(n, t) {
    if (this._tryRetarget("zoom", n, t)) return this;
    let e = new Vt(this._stepper).to(new U(n));
    return this.queue(function() {
      e = e.from(this.element().zoom());
    }, function(s) {
      return this.element().zoom(e.at(s), t), e.done();
    }, function(s, i) {
      t = i, e.to(s);
    }), this._rememberMorpher("zoom", e), this;
  },
  /**
  ** absolute transformations
  **/
  transform(n, t, e) {
    if (t = n.relative || t, this._hasTransform = !0, this._isAbsoluteTransform = this._isAbsoluteTransform || !t, this._isDeclarative && !t && this._tryRetarget("transform", n)) return this;
    const s = B.isMatrixLike(n);
    e = n.affine != null ? n.affine : e ?? !s;
    const i = new Vt(this._stepper).type(e ? Qe : B), o = e ? new Vt(this._stepper).type(B) : i;
    let r, a, c, l, h;
    function d() {
      a = a || this.element(), r = r || Qs(n, a), h = new B(t ? void 0 : a), a._addRunner(this);
    }
    function u(p) {
      t || this.clearTransform();
      const { x: m, y: g } = new st(r).transform(a._currentTransform(this)), y = {
        ...n,
        origin: [m, g]
      };
      y.relative === !0 && delete y.relative;
      let b = new B(y), x = this._isDeclarative && c ? c : h, C = i;
      if (e) {
        const w = b.decompose(m, g), _ = x.decompose(m, g);
        if (!new Qe(w).toArray().concat(new Qe(_).toArray()).every(Number.isFinite)) C = o;
        else {
          b = w, x = _;
          const S = b.rotate, T = x.rotate, A = [
            S - 360,
            S,
            S + 360
          ], M = A.map((P) => Math.abs(P - T)), N = Math.min(...M), R = M.indexOf(N);
          b.rotate = A[R];
        }
      }
      t && C === i && (s || (b.rotate = n.rotate || 0), this._isDeclarative && l && (x.rotate = l)), C.from(x), C.to(b);
      const v = C.at(p);
      return l = v.rotate, c = new B(v), this.addTransform(c), a._addRunner(this), C.done();
    }
    function f(p) {
      r = Qs(p, a), n = { ...p };
    }
    return this.queue(d, u, f, !0), this._isDeclarative && this._rememberMorpher("transform", i), this;
  },
  x(n) {
    return this._queueNumber("x", n);
  },
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
    if (t = new U(t), this._tryRetarget(n, t)) return this;
    const e = new Vt(this._stepper).to(t);
    let s = null;
    return this.queue(function() {
      s = this.element()[n](), e.from(s), e.to(s + t);
    }, function(i) {
      return this.element()[n](e.at(i)), e.done();
    }, function(i) {
      e.to(s + new U(i));
    }), this._rememberMorpher(n, e), this;
  },
  _queueObject(n, t) {
    if (this._tryRetarget(n, t)) return this;
    const e = new Vt(this._stepper).to(t);
    return this.queue(function() {
      e.from(this.element()[n]());
    }, function(s) {
      return this.element()[n](e.at(s)), e.done();
    }), this._rememberMorpher(n, e), this;
  },
  _queueNumber(n, t) {
    return this._queueObject(n, new U(t));
  },
  cx(n) {
    return this._queueNumber("cx", n);
  },
  cy(n) {
    return this._queueNumber("cy", n);
  },
  move(n, t) {
    return this.x(n).y(t);
  },
  amove(n, t) {
    return this.ax(n).ay(t);
  },
  center(n, t) {
    return this.cx(n).cy(t);
  },
  size(n, t) {
    const e = be(this._element, n, t);
    return this.width(e.width).height(e.height);
  },
  width(n) {
    return this._queueNumber("width", n);
  },
  height(n) {
    return this._queueNumber("height", n);
  },
  plot(n, t, e, s) {
    if (arguments.length === 4) return this.plot([
      n,
      t,
      e,
      s
    ]);
    if (this._tryRetarget("plot", n)) return this;
    const i = new Vt(this._stepper).type(this._element.MorphArray).to(n);
    return this.queue(function() {
      i.from(this._element.array());
    }, function(o) {
      return this._element.plot(i.at(o)), i.done();
    }), this._rememberMorpher("plot", i), this;
  },
  leading(n) {
    return this._queueNumber("leading", n);
  },
  viewbox(n, t, e, s) {
    return this._queueObject("viewbox", new lt(n, t, e, s));
  },
  update(n) {
    return typeof n != "object" ? this.update({
      offset: arguments[0],
      color: arguments[1],
      opacity: arguments[2]
    }) : (n.opacity != null && this.attr("stop-opacity", n.opacity), n.color != null && this.attr("stop-color", n.color), n.offset != null && this.attr("offset", n.offset), this);
  }
});
G(Xt, {
  rx: $i,
  ry: Hi,
  from: sa,
  to: ia
});
F(Xt, "Runner");
var us = class extends Nt {
  constructor(n, t = n) {
    super(J("svg", n), t), this.namespace();
  }
  defs() {
    return this.isRoot() ? mt(this.node.querySelector("defs")) || this.put(new Gi()) : this.root().defs();
  }
  isRoot() {
    return !this.node.parentNode || !(this.node.parentNode instanceof H.window.SVGElement) && this.node.parentNode.nodeName !== "#document-fragment";
  }
  namespace() {
    return this.isRoot() ? this.attr({
      xmlns: Pi,
      version: "1.1"
    }).attr("xmlns:xlink", _n, Ms) : this.root().namespace();
  }
  removeNamespace() {
    return this.attr({
      xmlns: null,
      version: null
    }).attr("xmlns:xlink", null, Ms).attr("xmlns:svgjs", null, Ms);
  }
  root() {
    return this.isRoot() ? this : super.root();
  }
};
$({ Container: { nested: K(function() {
  return this.put(new us());
}) } });
F(us, "Svg", !0);
var Yi = class extends Nt {
  constructor(n, t = n) {
    super(J("symbol", n), t);
  }
};
$({ Container: { symbol: K(function() {
  return this.put(new Yi());
}) } });
F(Yi, "Symbol");
var ua = /* @__PURE__ */ De({
  amove: () => Yd,
  ax: () => Ud,
  ay: () => jd,
  build: () => Xd,
  center: () => Fd,
  cx: () => $d,
  cy: () => Hd,
  length: () => Ld,
  move: () => Gd,
  plain: () => Dd,
  x: () => zd,
  y: () => Bd
});
function Dd(n) {
  return this._build === !1 && this.clear(), this.node.appendChild(H.document.createTextNode(n)), this;
}
function Ld() {
  return this.node.getComputedTextLength();
}
function zd(n, t = this.bbox()) {
  return n == null ? t.x : this.attr("x", this.attr("x") + n - t.x);
}
function Bd(n, t = this.bbox()) {
  return n == null ? t.y : this.attr("y", this.attr("y") + n - t.y);
}
function Gd(n, t, e = this.bbox()) {
  return this.x(n, e).y(t, e);
}
function $d(n, t = this.bbox()) {
  return n == null ? t.cx : this.attr("x", this.attr("x") + n - t.cx);
}
function Hd(n, t = this.bbox()) {
  return n == null ? t.cy : this.attr("y", this.attr("y") + n - t.cy);
}
function Fd(n, t, e = this.bbox()) {
  return this.cx(n, e).cy(t, e);
}
function Ud(n) {
  return this.attr("x", n);
}
function jd(n) {
  return this.attr("y", n);
}
function Yd(n, t) {
  return this.ax(n).ay(t);
}
function Xd(n) {
  return this._build = !!n, this;
}
var It = class extends _t {
  constructor(n, t = n) {
    super(J("text", n), t), this.dom.leading = this.dom.leading ?? new U(1.3), this._rebuild = !0, this._build = !1;
  }
  leading(n) {
    return n == null ? this.dom.leading : (this.dom.leading = new U(n), this.rebuild());
  }
  rebuild(n) {
    if (typeof n == "boolean" && (this._rebuild = n), this._rebuild) {
      const t = this;
      let e = 0;
      const s = this.dom.leading;
      this.each(function(i) {
        if (ti(this.node)) return;
        const o = H.window.getComputedStyle(this.node).getPropertyValue("font-size"), r = s * new U(o);
        this.dom.newLined && (this.attr("x", t.attr("x")), this.text() === `
` ? e += r : (this.attr("dy", i ? r + e : 0), e = 0));
      }), this.fire("rebuild");
    }
    return this;
  }
  setData(n) {
    return this.dom = n, this.dom.leading = new U(n.leading || 1.3), this;
  }
  writeDataToDom() {
    return super.writeDataToDom({ leading: 1.3 });
  }
  text(n) {
    if (n === void 0) {
      const t = this.node.childNodes;
      let e = 0;
      n = "";
      for (let s = 0, i = t.length; s < i; ++s) {
        if (t[s].nodeName === "textPath" || ti(t[s])) {
          s === 0 && (e = s + 1);
          continue;
        }
        s !== e && t[s].nodeType !== 3 && mt(t[s]).dom.newLined === !0 && (n += `
`), n += t[s].textContent;
      }
      return n;
    }
    if (this.clear().build(!0), typeof n == "function") n.call(this, this);
    else {
      n = (n + "").split(`
`);
      for (let t = 0, e = n.length; t < e; t++) this.newLine(n[t]);
    }
    return this.build(!1).rebuild();
  }
};
G(It, ua);
$({ Container: {
  text: K(function(n = "") {
    return this.put(new It()).text(n);
  }),
  plain: K(function(n = "") {
    return this.put(new It()).plain(n);
  })
} });
F(It, "Text");
var fs = class extends _t {
  constructor(n, t = n) {
    super(J("tspan", n), t), this._build = !1;
  }
  dx(n) {
    return this.attr("dx", n);
  }
  dy(n) {
    return this.attr("dy", n);
  }
  newLine() {
    this.dom.newLined = !0;
    const n = this.parent();
    if (!(n instanceof It)) return this;
    const t = n.index(this), e = H.window.getComputedStyle(this.node).getPropertyValue("font-size"), s = n.dom.leading * new U(e);
    return this.dy(t ? s : 0).attr("x", n.x());
  }
  text(n) {
    return n == null ? this.node.textContent + (this.dom.newLined ? `
` : "") : (typeof n == "function" ? (this.clear().build(!0), n.call(this, this), this.build(!1)) : this.plain(n), this);
  }
};
G(fs, ua);
$({
  Tspan: { tspan: K(function(n = "") {
    const t = new fs();
    return this._build || this.clear(), this.put(t).text(n);
  }) },
  Text: { newLine: function(n = "") {
    return this.tspan(n).newLine();
  } }
});
F(fs, "Tspan");
var ps = class extends _t {
  constructor(n, t = n) {
    super(J("circle", n), t);
  }
  radius(n) {
    return this.attr("r", n);
  }
  rx(n) {
    return this.attr("r", n);
  }
  ry(n) {
    return this.rx(n);
  }
  size(n) {
    return this.radius(new U(n).divide(2));
  }
};
G(ps, {
  x: Vr,
  y: Kr,
  cx: Jr,
  cy: Qr,
  width: ta,
  height: ea
});
$({ Container: { circle: K(function(n = 0) {
  return this.put(new ps()).size(n).move(0, 0);
}) } });
F(ps, "Circle");
var di = class extends Nt {
  constructor(n, t = n) {
    super(J("clipPath", n), t);
  }
  remove() {
    return this.targets().forEach(function(n) {
      n.unclip();
    }), super.remove();
  }
  targets() {
    return Sn(this.node, "clip-path");
  }
};
$({
  Container: { clip: K(function() {
    return this.defs().put(new di());
  }) },
  Element: {
    clipper() {
      return this.reference("clip-path");
    },
    clipWith(n) {
      const t = n instanceof di ? n : this.parent().clip().add(n);
      return this.attr("clip-path", "url(#" + t.id() + ")");
    },
    unclip() {
      return this.attr("clip-path", null);
    }
  }
});
F(di, "ClipPath");
var fa = class extends bt {
  constructor(n, t = n) {
    super(J("foreignObject", n), t);
  }
};
$({ Container: { foreignObject: K(function(n, t) {
  return this.put(new fa()).size(n, t);
}) } });
F(fa, "ForeignObject");
var pa = /* @__PURE__ */ De({
  dmove: () => Wd,
  dx: () => qd,
  dy: () => Zd,
  height: () => Vd,
  move: () => Kd,
  size: () => Jd,
  width: () => Qd,
  x: () => tu,
  y: () => eu
});
function Wd(n, t) {
  return this.children().forEach((e) => {
    let s;
    try {
      s = e.node instanceof Oi().SVGSVGElement ? new lt(e.attr([
        "x",
        "y",
        "width",
        "height"
      ])) : e.bbox();
    } catch {
      return;
    }
    const i = new B(e), o = i.translate(n, t).transform(i.inverse()), r = new st(s.x, s.y).transform(o);
    e.dmove(r.x - s.x, r.y - s.y);
  }), this;
}
function qd(n) {
  return this.dmove(n, 0);
}
function Zd(n) {
  return this.dmove(0, n);
}
function Vd(n, t = this.bbox()) {
  return n == null ? t.height : this.size(t.width, n, t);
}
function Kd(n = 0, t = 0, e = this.bbox()) {
  const s = n - e.x, i = t - e.y;
  return this.dmove(s, i);
}
function Jd(n, t, e = this.bbox()) {
  const s = be(this, n, t, e), i = s.width / e.width, o = s.height / e.height;
  return this.children().forEach((r) => {
    const a = new st(e).transform(new B(r).inverse());
    r.scale(i, o, a.x, a.y);
  }), this;
}
function Qd(n, t = this.bbox()) {
  return n == null ? t.width : this.size(n, t.height, t);
}
function tu(n, t = this.bbox()) {
  return n == null ? t.x : this.move(n, t.y, t);
}
function eu(n, t = this.bbox()) {
  return n == null ? t.y : this.move(t.x, n, t);
}
var Ge = class extends Nt {
  constructor(n, t = n) {
    super(J("g", n), t);
  }
};
G(Ge, pa);
$({ Container: { group: K(function() {
  return this.put(new Ge());
}) } });
F(Ge, "G");
var qn = class extends Nt {
  constructor(n, t = n) {
    super(J("a", n), t);
  }
  target(n) {
    return this.attr("target", n);
  }
  to(n) {
    return this.attr("href", n, _n);
  }
};
G(qn, pa);
$({
  Container: { link: K(function(n) {
    return this.put(new qn()).to(n);
  }) },
  Element: {
    unlink() {
      const n = this.linker();
      if (!n) return this;
      const t = n.parent();
      if (!t) return this.remove();
      const e = t.index(n);
      return t.add(this, e), n.remove(), this;
    },
    linkTo(n) {
      let t = this.linker();
      return t || (t = new qn(), this.wrap(t)), typeof n == "function" ? n.call(t, t) : t.to(n), this;
    },
    linker() {
      const n = this.parent();
      return n && n.node.nodeName.toLowerCase() === "a" ? n : null;
    }
  }
});
F(qn, "A");
var ui = class extends Nt {
  constructor(n, t = n) {
    super(J("mask", n), t);
  }
  remove() {
    return this.targets().forEach(function(n) {
      n.unmask();
    }), super.remove();
  }
  targets() {
    return Sn(this.node, "mask");
  }
};
$({
  Container: { mask: K(function() {
    return this.defs().put(new ui());
  }) },
  Element: {
    masker() {
      return this.reference("mask");
    },
    maskWith(n) {
      const t = n instanceof ui ? n : this.parent().mask().add(n);
      return this.attr("mask", "url(#" + t.id() + ")");
    },
    unmask() {
      return this.attr("mask", null);
    }
  }
});
F(ui, "Mask");
var ma = class extends bt {
  constructor(n, t = n) {
    super(J("stop", n), t);
  }
  update(n) {
    return (typeof n == "number" || n instanceof U) && (n = {
      offset: arguments[0],
      color: arguments[1],
      opacity: arguments[2]
    }), n.opacity != null && this.attr("stop-opacity", n.opacity), n.color != null && this.attr("stop-color", n.color), n.offset != null && this.attr("offset", new U(n.offset)), this;
  }
};
$({ Gradient: { stop: function(n, t, e) {
  return this.put(new ma()).update(n, t, e);
} } });
F(ma, "Stop");
function nu(n, t) {
  if (!n) return "";
  if (!t) return n;
  let e = n + "{";
  for (const s in t) e += Br(s) + ":" + t[s] + ";";
  return e += "}", e;
}
var fi = class extends bt {
  constructor(n, t = n) {
    super(J("style", n), t);
  }
  addText(n = "") {
    return this.node.textContent += n, this;
  }
  font(n, t, e = {}) {
    return this.rule("@font-face", {
      fontFamily: n,
      src: t,
      ...e
    });
  }
  rule(n, t) {
    return this.addText(nu(n, t));
  }
};
$("Dom", {
  style(n, t) {
    return this.put(new fi()).rule(n, t);
  },
  fontface(n, t, e) {
    return this.put(new fi()).font(n, t, e);
  }
});
F(fi, "Style");
var Xi = class extends It {
  constructor(n, t = n) {
    super(J("textPath", n), t);
  }
  array() {
    const n = this.track();
    return n ? n.array() : null;
  }
  plot(n) {
    const t = this.track();
    let e = null;
    return t && (e = t.plot(n)), n == null ? e : this;
  }
  track() {
    return this.reference("href");
  }
};
$({
  Container: { textPath: K(function(n, t) {
    return n instanceof It || (n = this.text(n)), n.path(t);
  }) },
  Text: {
    path: K(function(n, t = !0) {
      const e = new Xi();
      n instanceof Le || (n = this.defs().path(n)), e.attr("href", "#" + n, _n);
      let s;
      if (t) for (; s = this.node.firstChild; ) e.node.appendChild(s);
      return this.put(e);
    }),
    textPath() {
      return this.findOne("textPath");
    }
  },
  Path: {
    text: K(function(n) {
      return n instanceof It || (n = new It().addTo(this.parent()).text(n)), n.path(this);
    }),
    targets() {
      return Sn(this.node, "href", "textPath");
    }
  }
});
Xi.prototype.MorphArray = se;
F(Xi, "TextPath");
var ga = class extends _t {
  constructor(n, t = n) {
    super(J("use", n), t);
  }
  use(n, t) {
    return this.attr("href", (t || "") + "#" + n, _n);
  }
};
$({ Container: { use: K(function(n, t) {
  return this.put(new ga()).use(n, t);
}) } });
F(ga, "Use");
const ms = ut;
G([
  us,
  Yi,
  ds,
  cn,
  Xn
], yt("viewbox"));
G([
  Pe,
  Be,
  ze,
  Le
], yt("marker"));
G(It, yt("Text"));
G(Le, yt("Path"));
G(Gi, yt("Defs"));
G([It, fs], yt("Tspan"));
G([
  Tn,
  En,
  An,
  Xt
], yt("radius"));
G(Cn, yt("EventTarget"));
G(Re, yt("Dom"));
G(bt, yt("Element"));
G(_t, yt("Shape"));
G([Nt, na], yt("Container"));
G(An, yt("Gradient"));
G(Xt, yt("Runner"));
Yt.extend(ol());
_d([
  U,
  Gt,
  lt,
  B,
  Ne,
  ne,
  se,
  st
]);
Sd();
var Co = (n) => (n.changedTouches && (n = n.changedTouches[0]), {
  x: n.clientX,
  y: n.clientY
}), su = class {
  constructor(n) {
    n.remember("_draggable", this), this.el = n, this.drag = this.drag.bind(this), this.startDrag = this.startDrag.bind(this), this.endDrag = this.endDrag.bind(this);
  }
  init(n) {
    n ? (this.el.on("mousedown.drag", this.startDrag), this.el.on("touchstart.drag", this.startDrag, { passive: !1 })) : (this.el.off("mousedown.drag"), this.el.off("touchstart.drag"));
  }
  startDrag(n) {
    const t = !n.type.indexOf("mouse");
    if (t && n.which !== 1 && n.buttons !== 0 || this.el.dispatch("beforedrag", {
      event: n,
      handler: this
    }).defaultPrevented) return;
    n.preventDefault(), n.stopPropagation(), this.init(!1), this.box = this.el.bbox(), this.lastClick = this.el.point(Co(n));
    const e = (t ? "mousemove" : "touchmove") + ".drag", s = (t ? "mouseup" : "touchend") + ".drag";
    xt(window, e, this.drag, this, { passive: !1 }), xt(window, s, this.endDrag, this, { passive: !1 }), this.el.fire("dragstart", {
      event: n,
      handler: this,
      box: this.box
    });
  }
  drag(n) {
    const { box: t, lastClick: e } = this, s = this.el.point(Co(n)), i = s.x - e.x, o = s.y - e.y;
    if (!i && !o) return t;
    const r = t.x + i, a = t.y + o;
    this.box = new lt(r, a, t.w, t.h), this.lastClick = s, !this.el.dispatch("dragmove", {
      event: n,
      handler: this,
      box: this.box,
      dx: i,
      dy: o
    }).defaultPrevented && this.move(r, a);
  }
  move(n, t) {
    this.el.type === "svg" ? Ge.prototype.move.call(this.el, n, t) : this.el.move(n, t);
  }
  endDrag(n) {
    this.drag(n), this.el.fire("dragend", {
      event: n,
      handler: this,
      box: this.box
    }), rt(window, "mousemove.drag"), rt(window, "touchmove.drag"), rt(window, "mouseup.drag"), rt(window, "touchend.drag"), this.init(!0);
  }
};
G(bt, { draggable(n = !0) {
  return (this.remember("_draggable") || new su(this)).init(n), this;
} });
var He = (n) => n.touches || [{
  clientX: n.clientX,
  clientY: n.clientY
}];
G(us, { panZoom(n) {
  if (this.off(".panZoom"), n === !1) return this;
  n = n ?? {};
  const t = n.zoomFactor ?? 2, e = n.zoomMin ?? Number.MIN_VALUE, s = n.zoomMax ?? Number.MAX_VALUE, i = n.wheelZoom ?? !0, o = n.pinchZoom ?? !0, r = n.panning ?? !0, a = n.panButton ?? 0, c = n.oneFingerPan ?? !1, l = n.margins ?? !1, h = n.wheelZoomDeltaModeLinePixels ?? 17, d = n.wheelZoomDeltaModeScreenPixels ?? 53;
  let u, f, p = !1;
  const m = this.viewbox(), g = (S) => {
    if (!l) return S;
    const { top: T, left: A, bottom: M, right: N } = l, { width: R, height: P } = this.attr(["width", "height"]), E = this.node.preserveAspectRatio.baseVal;
    let k = 0, O = 0, L = 0, z = 0;
    if (E.align !== E.SVG_PRESERVEASPECTRATIO_NONE) {
      const Y = R / P, St = m.width / m.height;
      if (St !== Y) {
        const Rt = E.meetOrSlice !== E.SVG_MEETORSLICE_SLICE, V = Y > St ? "width" : "height", qt = V === "width", ae = Rt && qt || !Rt && !qt, ft = ae ? Y / St : St / Y, wt = S[V] - S[V] * ft;
        ae ? E.align === E.SVG_PRESERVEASPECTRATIO_XMIDYMIN || E.align === E.SVG_PRESERVEASPECTRATIO_XMIDYMID || E.align === E.SVG_PRESERVEASPECTRATIO_XMIDYMAX ? (k = wt / 2, O = -wt / 2) : E.align === E.SVG_PRESERVEASPECTRATIO_XMINYMIN || E.align === E.SVG_PRESERVEASPECTRATIO_XMINYMID || E.align === E.SVG_PRESERVEASPECTRATIO_XMINYMAX ? O = -wt : (E.align === E.SVG_PRESERVEASPECTRATIO_XMAXYMIN || E.align === E.SVG_PRESERVEASPECTRATIO_XMAXYMID || E.align === E.SVG_PRESERVEASPECTRATIO_XMAXYMAX) && (k = wt) : E.align === E.SVG_PRESERVEASPECTRATIO_XMINYMID || E.align === E.SVG_PRESERVEASPECTRATIO_XMIDYMID || E.align === E.SVG_PRESERVEASPECTRATIO_XMAXYMID ? (L = wt / 2, z = -wt / 2) : E.align === E.SVG_PRESERVEASPECTRATIO_XMINYMIN || E.align === E.SVG_PRESERVEASPECTRATIO_XMIDYMIN || E.align === E.SVG_PRESERVEASPECTRATIO_XMAXYMIN ? z = -wt : (E.align === E.SVG_PRESERVEASPECTRATIO_XMINYMAX || E.align === E.SVG_PRESERVEASPECTRATIO_XMIDYMAX || E.align === E.SVG_PRESERVEASPECTRATIO_XMAXYMAX) && (L = wt);
      }
    }
    const W = m.width + m.x - A - k, X = m.x + N - S.width - O, Z = m.height + m.y - T - L, vt = m.y + M - S.height - z;
    return S.x = Math.min(W, Math.max(X, S.x)), S.y = Math.min(Z, Math.max(vt, S.y)), S;
  }, y = function(S) {
    S.preventDefault();
    let T;
    switch (S.deltaMode) {
      case 1:
        T = S.deltaY * h;
        break;
      case 2:
        T = S.deltaY * d;
        break;
      default:
        T = S.deltaY;
    }
    let A = Math.pow(1 + t, -1 * T / 100) * this.zoom();
    const M = this.point(S.clientX, S.clientY);
    if (A > s && (A = s), A < e && (A = e), this.dispatch("zoom", {
      level: A,
      focus: M
    }).defaultPrevented) return this;
    if (this.zoom(A, M), l) {
      const N = g(this.viewbox());
      this.viewbox(N);
    }
    this.dispatch("afterZoom", {
      box: this.viewbox(),
      focus: M
    });
  }, b = function(S) {
    if (f = He(S), f.length < 2) {
      r && c && v.call(this, S);
      return;
    }
    r && c && w.call(this, S), S.preventDefault(), !this.dispatch("pinchZoomStart", { event: S }).defaultPrevented && (this.off("touchstart.panZoom", b), p = !0, xt(document, "touchmove.panZoom", C, this, { passive: !1 }), xt(document, "touchend.panZoom", x, this, { passive: !1 }));
  }, x = function(S) {
    S.preventDefault();
    const T = He(S);
    T.length > 1 || (p = !1, this.dispatch("pinchZoomEnd", { event: S }), rt(document, "touchmove.panZoom", C), rt(document, "touchend.panZoom", x), this.on("touchstart.panZoom", b), T.length && r && c && v.call(this, S));
  }, C = function(S) {
    S.preventDefault();
    const T = He(S), A = this.zoom();
    let M = Math.sqrt(Math.pow(f[0].clientX - f[1].clientX, 2) + Math.pow(f[0].clientY - f[1].clientY, 2)) / Math.sqrt(Math.pow(T[0].clientX - T[1].clientX, 2) + Math.pow(T[0].clientY - T[1].clientY, 2));
    (A < e && M > 1 || A > s && M < 1) && (M = 1);
    const N = {
      x: T[0].clientX + 0.5 * (T[1].clientX - T[0].clientX),
      y: T[0].clientY + 0.5 * (T[1].clientY - T[0].clientY)
    }, R = {
      x: f[0].clientX + 0.5 * (f[1].clientX - f[0].clientX),
      y: f[0].clientY + 0.5 * (f[1].clientY - f[0].clientY)
    }, P = this.point(N.x, N.y), E = this.point(2 * N.x - R.x, 2 * N.y - R.y), k = new lt(this.viewbox()).transform(new B().translate(-E.x, -E.y).scale(M, 0, 0).translate(P.x, P.y));
    g(k), this.viewbox(k), f = T, this.dispatch("zoom", {
      box: k,
      focus: E
    }), this.dispatch("afterZoom", {
      box: this.viewbox(),
      focus: E
    });
  }, v = function(S) {
    S.type.indexOf("mouse") > -1 && S.button !== a && S.which !== a + 1 || (f = He(S), !p && (this.dispatch("panStart", { event: S }).defaultPrevented || (S.preventDefault(), this.off("mousedown.panZoom", v), u = {
      x: f[0].clientX,
      y: f[0].clientY
    }, xt(document, "touchmove.panZoom mousemove.panZoom", _, this, { passive: !1 }), xt(document, "touchend.panZoom mouseup.panZoom", w, this, { passive: !1 }))));
  }, w = function(S) {
    S.preventDefault(), rt(document, "touchmove.panZoom mousemove.panZoom", _), rt(document, "touchend.panZoom mouseup.panZoom", w), this.on("mousedown.panZoom", v), this.dispatch("panEnd", { event: S });
  }, _ = function(S) {
    S.preventDefault();
    const T = He(S), A = {
      x: T[0].clientX,
      y: T[0].clientY
    }, M = this.point(A.x, A.y), N = this.point(u.x, u.y), R = [N.x - M.x, N.y - M.y];
    if (!R[0] && !R[1]) return;
    const P = new lt(this.viewbox()).transform(new B().translate(R[0], R[1]));
    u = A, g(P), !this.dispatch("panning", {
      box: P,
      event: S
    }).defaultPrevented && this.viewbox(P);
  };
  return i && this.on("wheel.panZoom", y, this, { passive: !1 }), o && this.on("touchstart.panZoom", b, this, { passive: !1 }), r && this.on("mousedown.panZoom", v, this, { passive: !1 }), this;
} });
function Te(n, t, e, s = null) {
  return function(i) {
    i.preventDefault(), i.stopPropagation();
    var o = i.pageX || i.touches[0].pageX, r = i.pageY || i.touches[0].pageY;
    t.fire(n, {
      x: o,
      y: r,
      event: i,
      index: s,
      points: e
    });
  };
}
function pi([n, t], { a: e, b: s, c: i, d: o, e: r, f: a }) {
  return [n * e + t * i + r, n * s + t * o + a];
}
var ya = class {
  constructor(n) {
    this.el = n, n.remember("_selectHandler", this), this.selection = new Ge(), this.order = [
      "lt",
      "t",
      "rt",
      "r",
      "rb",
      "b",
      "lb",
      "l",
      "rot"
    ], this.mutationHandler = this.mutationHandler.bind(this);
    const t = Oi();
    this.observer = new t.MutationObserver(this.mutationHandler);
  }
  init(n = {}) {
    this.createHandle = n.createHandle || this.createHandleFn, this.createRot = n.createRot || this.createRotFn, this.updateHandle = n.updateHandle || this.updateHandleFn, this.updateRot = n.updateRot || this.updateRotFn, this.handles = n.handles ? [...n.handles] : [...this.order], this.el.root().put(this.selection), this.updatePoints(), this.createSelection(), this.createResizeHandles(), this.updateResizeHandles(), this.createRotationHandle(), this.updateRotationHandle(), this.observer.observe(this.el.node, { attributes: !0 });
  }
  active(n, t) {
    if (!n) {
      this.selection.clear().remove(), this.observer.disconnect();
      return;
    }
    this.init(t);
  }
  createSelection() {
    this.selection.polygon(this.handlePoints).addClass("svg_select_shape");
  }
  updateSelection() {
    this.selection.get(0).plot(this.handlePoints);
  }
  createResizeHandles() {
    this.handlePoints.forEach((n, t, e) => {
      const s = this.order[t];
      this.handles.includes(s) && (this.createHandle.call(this, this.selection, n, t, e, s), this.selection.last().addClass("svg_select_handle svg_select_handle_" + s).on("mousedown.selection", Te(s, this.el, this.handlePoints, t)).on("touchstart.selection", Te(s, this.el, this.handlePoints, t), void 0, { passive: !1 }));
    });
  }
  createHandleFn(n) {
    n.polyline();
  }
  updateHandleFn(n, t, e, s) {
    const i = s.at(e - 1), o = s[(e + 1) % s.length], r = t, a = [r[0] - i[0], r[1] - i[1]], c = [r[0] - o[0], r[1] - o[1]], l = Math.sqrt(a[0] * a[0] + a[1] * a[1]), h = Math.sqrt(c[0] * c[0] + c[1] * c[1]), d = [a[0] / l, a[1] / l], u = [c[0] / h, c[1] / h], f = [r[0] - d[0] * 10, r[1] - d[1] * 10], p = [r[0] - u[0] * 10, r[1] - u[1] * 10];
    n.plot([
      f,
      r,
      p
    ]);
  }
  updateResizeHandles() {
    this.handlePoints.forEach((n, t, e) => {
      const s = this.order[t];
      if (!this.handles.includes(s)) return;
      const i = this.selection.findOne(".svg_select_handle_" + s);
      i && this.updateHandle.call(this, i, n, t, e, s);
    });
  }
  createRotFn(n) {
    n.line(), n.circle(5);
  }
  getPoint(n) {
    return this.handlePoints[this.order.indexOf(n)];
  }
  getPointHandle(n) {
    return this.selection.findOne(".svg_select_handle_" + n);
  }
  updateRotFn(n, t) {
    const e = this.getPoint("t");
    n.get(0).plot(e[0], e[1], t[0], t[1]), n.get(1).center(t[0], t[1]);
  }
  createRotationHandle() {
    if (!this.handles.includes("rot")) return;
    const n = this.selection.group().addClass("svg_select_handle_rot").on("mousedown.selection", Te("rot", this.el, this.handlePoints)).on("touchstart.selection", Te("rot", this.el, this.handlePoints), void 0, { passive: !1 });
    this.createRot.call(this, n);
  }
  updateRotationHandle() {
    if (!this.handles.includes("rot")) return;
    const n = this.selection.findOne("g.svg_select_handle_rot");
    n && this.updateRot(n, this.rotationPoint, this.handlePoints);
  }
  updatePoints() {
    const n = this.el.bbox(), t = this.el.root().screenCTM().inverseO().multiplyO(this.el.screenCTM());
    this.handlePoints = this.getHandlePoints(n).map((e) => pi(e, t)), this.rotationPoint = pi(this.getRotationPoint(n), t);
  }
  getHandlePoints({ x: n, x2: t, y: e, y2: s, cx: i, cy: o } = this.el.bbox()) {
    return [
      [n, e],
      [i, e],
      [t, e],
      [t, o],
      [t, s],
      [i, s],
      [n, s],
      [n, o]
    ];
  }
  getRotationPoint({ y: n, cx: t } = this.el.bbox()) {
    return [t, n - 20];
  }
  mutationHandler() {
    this.updatePoints(), this.updateSelection(), this.updateResizeHandles(), this.updateRotationHandle();
  }
}, iu = class {
  constructor(n) {
    this.el = n, n.remember("_pointSelectHandler", this), this.selection = new Ge(), this.order = [
      "lt",
      "t",
      "rt",
      "r",
      "rb",
      "b",
      "lb",
      "l",
      "rot"
    ], this.mutationHandler = this.mutationHandler.bind(this);
    const t = Oi();
    this.observer = new t.MutationObserver(this.mutationHandler);
  }
  init(n) {
    this.createHandle = n.createHandle || this.createHandleFn, this.updateHandle = n.updateHandle || this.updateHandleFn, this.el.root().put(this.selection), this.updatePoints(), this.createSelection(), this.createPointHandles(), this.updatePointHandles(), this.observer.observe(this.el.node, { attributes: !0 });
  }
  active(n, t) {
    if (!n) {
      this.selection.clear().remove(), this.observer.disconnect();
      return;
    }
    this.init(t);
  }
  createSelection() {
    this.selection.polygon(this.points).addClass("svg_select_shape_pointSelect");
  }
  updateSelection() {
    this.selection.get(0).plot(this.points);
  }
  createPointHandles() {
    this.points.forEach((n, t, e) => {
      this.createHandle.call(this, this.selection, n, t, e), this.selection.get(t + 1).addClass("svg_select_handle_point").on("mousedown.selection", Te("point", this.el, this.points, t)).on("touchstart.selection", Te("point", this.el, this.points, t), void 0, { passive: !1 });
    });
  }
  createHandleFn(n) {
    n.circle(5);
  }
  updateHandleFn(n, t) {
    n.center(t[0], t[1]);
  }
  updatePointHandles() {
    this.points.forEach((n, t, e) => {
      this.updateHandle.call(this, this.selection.get(t + 1), n, t, e);
    });
  }
  updatePoints() {
    const n = this.el.root().screenCTM().inverseO().multiplyO(this.el.screenCTM());
    this.points = this.el.array().map((t) => pi(t, n));
  }
  mutationHandler() {
    this.updatePoints(), this.updateSelection(), this.updatePointHandles();
  }
}, ba = (n) => function(t = !0, e = {}) {
  typeof t == "object" && (e = t, t = !0);
  let s = this.remember("_" + n.name);
  return s || (t.prototype instanceof ya ? (s = new t(this), t = !0) : s = new n(this), this.remember("_" + n.name, s)), s.active(t, e), this;
};
G(bt, { select: ba(ya) });
G([
  ze,
  Be,
  Pe
], { pointSelect: ba(iu) });
var kn = (n) => (n.changedTouches && (n = n.changedTouches[0]), {
  x: n.clientX,
  y: n.clientY
}), va = (n) => {
  let t = 1 / 0, e = 1 / 0, s = -1 / 0, i = -1 / 0;
  for (let o = 0; o < n.length; o++) {
    const r = n[o];
    t = Math.min(t, r[0]), e = Math.min(e, r[1]), s = Math.max(s, r[0]), i = Math.max(i, r[1]);
  }
  return new lt(t, e, s - t, i - e);
};
function ou(n, t, e) {
  const s = [
    [n.x, n.y],
    [n.x + n.width, n.y],
    [n.x + n.width, n.y + n.height],
    [n.x, n.y + n.height]
  ].map(([i, o]) => {
    const r = i - t[0], a = o - t[1], c = r * e, l = a * e;
    return [c + t[0], l + t[1]];
  });
  return va(s);
}
var Eo = class {
  constructor(n) {
    this.el = n, n.remember("_ResizeHandler", this), this.lastCoordinates = null, this.eventType = "", this.lastEvent = null, this.handleResize = this.handleResize.bind(this), this.resize = this.resize.bind(this), this.endResize = this.endResize.bind(this), this.rotate = this.rotate.bind(this), this.movePoint = this.movePoint.bind(this);
  }
  active(n, t) {
    this.preserveAspectRatio = t.preserveAspectRatio ?? !1, this.aroundCenter = t.aroundCenter ?? !1, this.grid = t.grid ?? 0, this.degree = t.degree ?? 0, this.el.off(".resize"), n && (this.el.on([
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
    ], this.handleResize), this.lastEvent && (this.eventType === "rot" ? this.rotate(this.lastEvent) : this.eventType === "point" ? this.movePoint(this.lastEvent) : this.resize(this.lastEvent)));
  }
  handleResize(n) {
    this.eventType = n.type;
    const { event: t, index: e, points: s } = n.detail, i = !t.type.indexOf("mouse");
    if (i && (t.which || t.buttons) !== 1 || this.el.dispatch("beforeresize", {
      event: n,
      handler: this
    }).defaultPrevented) return;
    this.box = this.el.bbox(), this.startPoint = this.el.point(kn(t)), this.index = e, this.points = s.slice();
    const o = (i ? "mousemove" : "touchmove") + ".resize", r = (i ? "mouseup" : "touchcancel.resize touchend") + ".resize";
    n.type === "point" ? xt(window, o, this.movePoint) : n.type === "rot" ? xt(window, o, this.rotate) : xt(window, o, this.resize), xt(window, r, this.endResize);
  }
  resize(n) {
    this.lastEvent = n;
    const t = this.snapToGrid(this.el.point(kn(n)));
    let e = t.x - this.startPoint.x, s = t.y - this.startPoint.y;
    this.preserveAspectRatio && this.aroundCenter && (e *= 2, s *= 2);
    const i = this.box.x + e, o = this.box.y + s, r = this.box.x2 + e, a = this.box.y2 + s;
    let c = new lt(this.box);
    if (this.eventType.includes("l") && (c.x = Math.min(i, this.box.x2), c.x2 = Math.max(i, this.box.x2)), this.eventType.includes("r") && (c.x = Math.min(r, this.box.x), c.x2 = Math.max(r, this.box.x)), this.eventType.includes("t") && (c.y = Math.min(o, this.box.y2), c.y2 = Math.max(o, this.box.y2)), this.eventType.includes("b") && (c.y = Math.min(a, this.box.y), c.y2 = Math.max(a, this.box.y)), c.width = c.x2 - c.x, c.height = c.y2 - c.y, this.preserveAspectRatio) {
      const l = this.box.width ? c.width / this.box.width : 1, h = this.box.height ? c.height / this.box.height : 1, d = [
        "lt",
        "t",
        "rt",
        "r",
        "rb",
        "b",
        "lb",
        "l"
      ], u = (d.indexOf(this.eventType) + 4) % d.length, f = this.aroundCenter ? [this.box.cx, this.box.cy] : this.points[u];
      let p = this.eventType.includes("t") || this.eventType.includes("b") ? h : l;
      p = this.eventType.length === 2 ? Math.max(l, h) : p, Number.isFinite(p) || (p = 1), c = ou(this.box, f, p);
    }
    this.el.dispatch("resize", {
      box: new lt(c),
      angle: 0,
      eventType: this.eventType,
      event: n,
      handler: this
    }).defaultPrevented || this.el.size(c.width, c.height).move(c.x, c.y);
  }
  movePoint(n) {
    this.lastEvent = n;
    const { x: t, y: e } = this.snapToGrid(this.el.point(kn(n))), s = this.el.array().slice();
    s[this.index] = [t, e], !this.el.dispatch("resize", {
      box: va(s),
      angle: 0,
      eventType: this.eventType,
      event: n,
      handler: this
    }).defaultPrevented && this.el.plot(s);
  }
  rotate(n) {
    this.lastEvent = n;
    const t = this.startPoint, e = this.el.point(kn(n)), { cx: s, cy: i } = this.box, o = t.x - s, r = t.y - i, a = e.x - s, c = e.y - i, l = Math.sqrt(o * o + r * r) * Math.sqrt(a * a + c * c);
    if (l === 0) return;
    let h = Math.acos((o * a + r * c) / l) / Math.PI * 180;
    if (!h) return;
    e.x < t.x && (h = -h);
    const d = new B(this.el), { x: u, y: f } = new st(s, i).transformO(d), { rotate: p } = d.decompose(), m = this.snapToAngle(p + h) - p;
    this.el.dispatch("resize", {
      box: this.box,
      angle: m,
      eventType: this.eventType,
      event: n,
      handler: this
    }).defaultPrevented || this.el.transform(d.rotateO(m, u, f));
  }
  endResize(n) {
    this.eventType !== "rot" && this.eventType !== "point" && this.resize(n), this.lastEvent = null, this.eventType = "", rt(window, "mousemove.resize touchmove.resize"), rt(window, "mouseup.resize touchend.resize");
  }
  snapToGrid(n) {
    return this.grid && (n.x = Math.round(n.x / this.grid) * this.grid, n.y = Math.round(n.y / this.grid) * this.grid), n;
  }
  snapToAngle(n) {
    return this.degree && (n = Math.round(n / this.degree) * this.degree), n;
  }
};
G(bt, { resize: function(n = !0, t = {}) {
  typeof n == "object" && (t = n, n = !0);
  let e = this.remember("_ResizeHandler");
  return e || (n.prototype instanceof Eo ? (e = new n(this), n = !0) : e = new Eo(this), this.remember("_resizeHandler", e)), e.active(n, t), this;
} });
function te(n, t, e) {
  try {
    const s = n.node.ownerSVGElement || n.node, i = n.node.getScreenCTM(), o = s.getScreenCTM();
    if (!i || !o)
      return [t, e];
    const r = i.a * t + i.c * e + i.e, a = i.b * t + i.d * e + i.f, c = o.a * o.d - o.b * o.c;
    if (Math.abs(c) < 1e-10)
      return [t, e];
    const l = o.d / c, h = -o.b / c, d = -o.c / c, u = o.a / c, f = (o.c * o.f - o.d * o.e) / c, p = (o.b * o.e - o.a * o.f) / c, m = l * r + d * a + f, g = h * r + u * a + p;
    return [m, g];
  } catch {
    return [t, e];
  }
}
function gs(n, t, e) {
  try {
    const s = n.node.ownerSVGElement || n.node, i = n.node.getScreenCTM(), o = s.getScreenCTM();
    if (!i || !o)
      return [t, e];
    const r = o.a * t + o.c * e + o.e, a = o.b * t + o.d * e + o.f, c = i.a * i.d - i.b * i.c;
    if (Math.abs(c) < 1e-10)
      return [t, e];
    const l = i.d / c, h = -i.b / c, d = -i.c / c, u = i.a / c, f = (i.c * i.f - i.d * i.e) / c, p = (i.b * i.e - i.a * i.f) / c, m = l * r + d * a + f, g = h * r + u * a + p;
    return [m, g];
  } catch {
    return [t, e];
  }
}
function hn(n) {
  const t = n.bbox();
  return te(n, t.cx, t.cy);
}
function ru(n) {
  const t = n.getScreenCTM && n.getScreenCTM();
  if (!t) return t;
  try {
    let e = n.parentNode;
    for (; e && e.nodeType === 1; ) {
      if (e.hasAttribute && e.hasAttribute("data-sb-animation-host")) {
        const s = e.getScreenCTM && e.getScreenCTM(), i = e.parentNode && e.parentNode.getScreenCTM && e.parentNode.getScreenCTM();
        return !s || !i ? t : i.multiply(s.inverse()).multiply(t);
      }
      if (e.tagName && e.tagName.toLowerCase() === "svg" && !e.ownerSVGElement) break;
      e = e.parentNode;
    }
  } catch {
  }
  return t;
}
function au(n, t) {
  try {
    const e = n && n.node;
    let s = e && e.querySelector && e.querySelector("path[data-shape-path]");
    if (!s && e && e.querySelectorAll) {
      let w = 0;
      e.querySelectorAll("svg path:not([data-node-background-path])").forEach((_) => {
        if (typeof _.getTotalLength == "function")
          try {
            const S = _.getBBox(), T = S.width * S.height;
            T > w && (w = T, s = _);
          } catch {
          }
      });
    }
    if (!s || typeof s.getTotalLength != "function") return null;
    const i = s.getTotalLength();
    if (!i || !isFinite(i)) return null;
    let o = s.ownerSVGElement;
    for (; o && o.ownerSVGElement; ) o = o.ownerSVGElement;
    const r = ru(s), a = o && o.getScreenCTM && o.getScreenCTM();
    if (!o || !r || !a) return null;
    const c = a.inverse(), l = o.createSVGPoint(), h = (w, _) => {
      l.x = w, l.y = _;
      const S = l.matrixTransform(r).matrixTransform(c);
      return [S.x, S.y];
    }, [d, u] = hn(n), f = t[0] - d, p = t[1] - u, m = Math.sqrt(f * f + p * p) || 1, g = f / m, y = p / m;
    let b = null, x = -1 / 0;
    const C = 96;
    let v = s.__outlineSamples;
    if (!v || s.__outlineLen !== i) {
      v = new Array(C);
      for (let w = 0; w < C; w++) {
        const _ = s.getPointAtLength(w / C * i);
        v[w] = [_.x, _.y];
      }
      s.__outlineSamples = v, s.__outlineLen = i;
    }
    for (let w = 0; w < v.length; w++) {
      const [_, S] = h(v[w][0], v[w][1]);
      if (!isFinite(_) || !isFinite(S)) continue;
      const T = _ - d, A = S - u, M = T * g + A * y, N = Math.abs(T * y - A * g), R = M - N * 1.5;
      R > x && (x = R, b = [_, S]);
    }
    return b;
  } catch {
    return null;
  }
}
function Zn(n, t) {
  const e = au(n, t);
  if (e && isFinite(e[0]) && isFinite(e[1])) {
    const g = n.bbox(), [y, b] = te(n, g.cx, g.cy), x = Math.max(g.width, g.height, 1) * 3;
    if (Math.hypot(e[0] - y, e[1] - b) <= x)
      return e;
  }
  const s = n.bbox(), [i, o] = gs(n, t[0], t[1]), r = s.cx, a = s.cy, c = i - r, l = o - a, h = Math.sqrt(c * c + l * l);
  if (h === 0)
    return te(n, r, a);
  const d = c / h, u = l / h;
  let f;
  if (n.type === "circle") {
    const g = parseFloat(n.attr("r")) || 0;
    f = [r + g * d, a + g * u];
  } else if (n.type === "ellipse") {
    const g = parseFloat(n.attr("rx")) || 0, y = parseFloat(n.attr("ry")) || 0, b = Math.atan2(u, d);
    f = [
      r + g * Math.cos(b),
      a + y * Math.sin(b)
    ];
  } else {
    const g = s.x, y = s.x + s.width, b = s.y, x = s.y + s.height, C = [];
    if (d !== 0) {
      const v = (g - r) / d, w = a + v * u;
      w >= b && w <= x && v > 0 && C.push([g, w, v]);
    }
    if (d !== 0) {
      const v = (y - r) / d, w = a + v * u;
      w >= b && w <= x && v > 0 && C.push([y, w, v]);
    }
    if (u !== 0) {
      const v = (b - a) / u, w = r + v * d;
      w >= g && w <= y && v > 0 && C.push([w, b, v]);
    }
    if (u !== 0) {
      const v = (x - a) / u, w = r + v * d;
      w >= g && w <= y && v > 0 && C.push([w, x, v]);
    }
    C.length > 0 ? (C.sort(function(v, w) {
      return v[2] - w[2];
    }), f = [C[0][0], C[0][1]]) : f = [r, a];
  }
  const [p, m] = te(n, f[0], f[1]);
  return isNaN(p) || isNaN(m) || !isFinite(p) || !isFinite(m) ? te(n, r, a) : [p, m];
}
function Ao(n, t) {
  const e = n.bbox(), s = e.x + (t.x != null ? t.x : 0.5) * e.width, i = e.y + (t.y != null ? t.y : 0.5) * e.height, [o, r] = te(n, s, i);
  return isNaN(o) || isNaN(r) || !isFinite(o) || !isFinite(r) ? hn(n) : [o, r];
}
function To(n, t) {
  try {
    const e = n.bbox();
    if (!e || !e.width || !e.height) return null;
    const [s, i] = gs(n, t[0], t[1]), o = (s - e.x) / e.width, r = (i - e.y) / e.height, a = o, c = 1 - o, l = r, h = 1 - r, d = Math.min(a, c, l, h);
    let u = 0, f = 0;
    d === a ? u = -1 : d === c ? u = 1 : d === l ? f = -1 : f = 1;
    const p = te(n, e.cx, e.cy), m = te(n, e.cx + u, e.cy + f), g = m[0] - p[0], y = m[1] - p[1], b = Math.hypot(g, y);
    return b > 1e-4 ? [g / b, y / b] : null;
  } catch {
    return null;
  }
}
function Wi(n) {
  const t = {};
  if (!n.source || !n.target)
    return [
      ["M", 0, 0],
      ["L", 50, 50]
    ];
  const e = hn(n.source), s = hn(n.target);
  n.sourceAnchor ? t.point1 = Ao(n.source, n.sourceAnchor) : n.sourceAttach === "center" ? t.point1 = e : t.point1 = Zn(n.source, s), n.targetAnchor ? t.point2 = Ao(n.target, n.targetAnchor) : n.targetAttach === "center" ? t.point2 = s : t.point2 = Zn(n.target, e);
  const i = t.point1, o = t.point2;
  let r;
  if (n.type === "curved") {
    const l = o[0] - i[0], h = o[1] - i[1], d = Math.sqrt(l * l + h * h);
    if (d < 1)
      return [["M", i[0], i[1]], ["L", o[0], o[1]]];
    const u = (x, C, v, w) => {
      const _ = Math.sqrt(x * x + C * C);
      if (_ > 1e-4) return [x / _, C / _];
      const S = Math.sqrt(v * v + w * w) || 1;
      return [v / S, w / S];
    }, f = n.sourceAnchor && To(n.source, i) || u(i[0] - e[0], i[1] - e[1], l, h), p = n.targetAnchor && To(n.target, o) || u(o[0] - s[0], o[1] - s[1], -l, -h), m = typeof n.lineCurviness == "number" ? n.lineCurviness : 0.3, g = Math.max(20, d * (0.12 + m * 0.55)), y = [i[0] + f[0] * g, i[1] + f[1] * g], b = [o[0] + p[0] * g, o[1] + p[1] * g];
    if (n.lineCurveType === "quadratic") {
      const x = [(y[0] + b[0]) / 2, (y[1] + b[1]) / 2];
      r = [
        ["M", i[0], i[1]],
        ["Q", x[0], x[1], o[0], o[1]]
      ];
    } else
      r = [
        ["M", i[0], i[1]],
        ["C", y[0], y[1], b[0], b[1], o[0], o[1]]
      ];
  } else if (n.type === "orthogonal") {
    const l = o[0] - i[0], h = o[1] - i[1], d = i[0] < e[0], u = i[1] < e[1], f = o[0] < s[0], p = o[1] < s[1];
    let m, g;
    const y = 32;
    if (Math.abs(l) <= y && Math.abs(h) > y) {
      const b = (i[0] + o[0]) / 2;
      r = [
        ["M", b, i[1]],
        ["L", b, o[1]]
      ];
    } else if (Math.abs(h) <= y && Math.abs(l) > y) {
      const b = (i[1] + o[1]) / 2;
      r = [
        ["M", i[0], b],
        ["L", o[0], b]
      ];
    } else if (Math.abs(l) > Math.abs(h))
      if (d && f || !d && !f) {
        const b = Math.max(n.curveRadius, Math.abs(h) / 2);
        g = i[1] + (h > 0 ? -b : b), r = [
          ["M", i[0], i[1]],
          ["L", i[0], g],
          ["L", o[0], g],
          ["L", o[0], o[1]]
        ];
      } else
        m = i[0] + l / 2, r = [
          ["M", i[0], i[1]],
          ["L", m, i[1]],
          ["L", m, o[1]],
          ["L", o[0], o[1]]
        ];
    else if (u && p || !u && !p) {
      const b = Math.max(n.curveRadius, Math.abs(l) / 2);
      m = i[0] + (l > 0 ? -b : b), r = [
        ["M", i[0], i[1]],
        ["L", m, i[1]],
        ["L", m, o[1]],
        ["L", o[0], o[1]]
      ];
    } else
      g = i[1] + h / 2, r = [
        ["M", i[0], i[1]],
        ["L", i[0], g],
        ["L", o[0], g],
        ["L", o[0], o[1]]
      ];
  } else
    r = [
      ["M", i[0], i[1]],
      ["L", o[0], o[1]]
    ];
  const a = n.markerSource && n.markerSource.size;
  if (a && r && r.length >= 2 && Math.hypot(o[0] - i[0], o[1] - i[1]) > a * 1.5) {
    const h = r[0], d = r[1], u = h[h.length - 2], f = h[h.length - 1];
    let p = d[1] - u, m = d[2] - f;
    const g = Math.hypot(p, m);
    g > 1e-3 && (p /= g, m /= g, h[h.length - 2] = u + p * a, h[h.length - 1] = f + m * a, (d[0] === "C" || d[0] === "Q") && (d[1] += p * a, d[2] += m * a));
  }
  const c = n.markerTarget && n.markerTarget.size;
  if (c && r && r.length >= 2 && Math.hypot(o[0] - i[0], o[1] - i[1]) > c * 1.5) {
    const h = r[r.length - 1], d = h[h.length - 2], u = h[h.length - 1];
    let f, p;
    if (h[0] === "C")
      f = h[3], p = h[4];
    else {
      const b = r[r.length - 2];
      f = b[b.length - 2], p = b[b.length - 1];
    }
    let m = d - f, g = u - p;
    const y = Math.hypot(m, g);
    y > 1e-3 && (m /= y, g /= y, h[h.length - 2] = d - m * c, h[h.length - 1] = u - g * c, h[0] === "C" && (h[3] -= m * c, h[4] -= g * c));
  }
  return r;
}
function Mo(n, t, e, s, i, o) {
  if (!n || n === "null") return null;
  const a = Math.max(12, s * 3 + 6), c = a, l = a * 0.8, h = (e ? "source-" : "target-") + "triangle-" + Math.random().toString(16).substr(2, 8), d = i.defs().marker(c, l);
  d.attr({
    id: h,
    viewBox: "0 0 " + c + " " + l,
    // Both ends are BASE-anchored. Geometry trims the drawn line by one marker
    // length, leaving the head to fill the gap to the node edge. The thin stroke
    // therefore never runs through the triangle or blunts its point.
    refX: e ? String(c) : "0",
    refY: l / 2,
    // Center vertically
    // userSpaceOnUse (was "strokeWidth"): with strokeWidth units the rendered
    // marker is markerWidth × strokeWidth, but markerSize ALREADY scales with
    // strokeWidth (strokeWidth*3+6) — so the arrowhead was double-scaled and grew
    // ~10× the line width (a huge triangle). In user space the arrowhead is a
    // sensible absolute size that still grows with thicker lines via markerSize,
    // matching Miro's slim proportional heads.
    markerUnits: "userSpaceOnUse",
    markerWidth: c,
    // absolute px (viewBox already 0..arrowWidth)
    markerHeight: l,
    orient: "auto"
  });
  const u = d.path(), f = l / 2;
  return e ? u.attr({
    d: "M 0 " + f + " L " + c + " 0 L " + c + " " + l + " z"
  }) : u.attr({
    d: "M 0 0 L 0 " + l + " L " + c + " " + f + " z"
  }), u.fill(o), {
    element: d,
    id: h,
    size: a
  };
}
function Vn(n, t, e, s) {
  return s && (n.markers = s), n.markerSourceType = t || "null", n.markerTargetType = e || "null", n.markerSource && (n.markerSource.element.remove(), n.connector.attr("marker-start", null)), n.markerTarget && (n.markerTarget.element.remove(), n.connector.attr("marker-end", null)), t && t !== "null" ? (n.markerSource = Mo(
    t,
    0,
    !0,
    n.strokeWidth,
    n.markers || s,
    n.color
  ), n.connector.attr("marker-start", "url(#" + n.markerSource.id + ")")) : n.markerSource = null, e && e !== "null" ? (n.markerTarget = Mo(
    e,
    0,
    !1,
    n.strokeWidth,
    n.markers || s,
    n.color
  ), n.connector.attr("marker-end", "url(#" + n.markerTarget.id + ")")) : n.markerTarget = null, n;
}
function cu(n, t, e) {
  return n.markerSourceType = t || "null", n.markerTargetType = e || "null", Vn(n, n.markerSourceType, n.markerTargetType), n;
}
function lu(n, t) {
  return n.strokeWidth = t || 2, n.connector.attr("stroke-width", n.strokeWidth), Vn(n, n.markerSourceType, n.markerTargetType), n;
}
function ko(n, t) {
  n.color = t, n.connector.stroke(t).attr("stroke-width", n.strokeWidth), n.markerSource && n.markerSource.element.children().forEach(function(e) {
    e.type === "path" && e.fill(t);
  }), n.markerTarget && n.markerTarget.element.children().forEach(function(e) {
    e.type === "path" && e.fill(t);
  });
}
const hu = 0.25, mi = 0.05, ee = (n) => Math.round(n * 1e4) / 1e4, Oe = (n) => Math.max(0, Math.min(1, n));
function ys(n, t) {
  if (!Number.isFinite(n) || !Number.isFinite(t)) return null;
  const e = Oe(n), s = Oe(t);
  return !(n < 0 || n > 1 || t < 0 || t > 1) && Math.min(e, 1 - e, s, 1 - s) >= hu ? null : dn({ x: e, y: s });
}
function dn(n) {
  const t = Oe(n.x), e = Oe(n.y), s = [t, 1 - t, e, 1 - e], i = Math.min(...s);
  return i === s[0] ? { x: 0, y: ee(e) } : i === s[1] ? { x: 1, y: ee(e) } : i === s[2] ? { x: ee(t), y: 0 } : { x: ee(t), y: 1 };
}
function du(n, t, e = mi) {
  const s = {
    ArrowLeft: [-e, 0],
    ArrowRight: [e, 0],
    ArrowUp: [0, -e],
    ArrowDown: [0, e]
  }, [i, o] = s[t] || [0, 0], r = dn(n), a = { x: Oe(ee(r.x + i)), y: Oe(ee(r.y + o)) };
  return a.x === 0 || a.x === 1 || a.y === 0 || a.y === 1 ? a : r;
}
function uu(n) {
  return { top: { x: 0.5, y: 0 }, right: { x: 1, y: 0.5 }, bottom: { x: 0.5, y: 1 }, left: { x: 0, y: 0.5 } }[n];
}
function wa(n, t, e) {
  if (!e) return { ...n };
  const s = e * Math.PI / 180, i = n.x - t.x, o = n.y - t.y;
  return { x: t.x + i * Math.cos(s) - o * Math.sin(s), y: t.y + i * Math.sin(s) + o * Math.cos(s) };
}
function un(n, t) {
  const e = { x: n.x + n.width / 2, y: n.y + n.height / 2 }, s = wa(t, e, -(n.rotation || 0));
  return { x: (s.x - n.x) / (n.width || 1), y: (s.y - n.y) / (n.height || 1) };
}
function xa(n, t) {
  const e = { x: n.x + n.width / 2, y: n.y + n.height / 2 }, s = wa({ x: n.x + t.x * n.width, y: n.y + t.y * n.height }, e, n.rotation || 0);
  return { x: ee(s.x), y: ee(s.y) };
}
function _a(n, t) {
  const e = un(n, t), s = (e.x - 0.5) * (n.width || 1), i = (e.y - 0.5) * (n.height || 1);
  if (Math.abs(s) < 1e-9 && Math.abs(i) < 1e-9) return { x: 0.5, y: 0 };
  const o = s !== 0 ? n.width / 2 / Math.abs(s) : 1 / 0, r = i !== 0 ? n.height / 2 / Math.abs(i) : 1 / 0, a = Math.min(o, r);
  return dn({ x: 0.5 + s * a / (n.width || 1), y: 0.5 + i * a / (n.height || 1) });
}
function Sa(n) {
  const t = { ...n };
  return t.showParentArrow = n.showChildArrow !== !1, t.showChildArrow = !!n.showParentArrow, t.sourceAnchor = n.targetAnchor ?? null, t.targetAnchor = null, t;
}
function Ca(n, t) {
  try {
    const [e, s] = gs(n, t[0], t[1]), i = n.bbox();
    return !i || !i.width || !i.height ? null : ys((e - i.x) / i.width, (s - i.y) / i.height);
  } catch {
    return null;
  }
}
function Kn(n, t) {
  const e = t ? n.source : n.target;
  return e && e._isPhantomRect ? "free" : (t ? n.sourceAnchor : n.targetAnchor) ? "pinned" : "follow";
}
function fn(n, t, e) {
  const s = t && t.glyph;
  if (!s) return;
  if (t.glyphState !== e) {
    s.clear();
    const r = n.handleStroke, a = (c, l) => {
      c().fill("none").stroke({ color: "#ffffff", width: l + 3, linejoin: "round" }), c().fill("none").stroke({ color: r, width: l, linejoin: "round" });
    };
    e === "pinned" ? s.rect(10, 10).center(0, 0).fill(r).stroke({ color: "#ffffff", width: 1.5 }) : a(e === "free" ? () => s.polygon("0,-8 8,0 0,8 -8,0") : () => s.circle(13).center(0, 0), 2.5), t.glyphState = e, s.attr("data-state", e);
  }
  const [i, o] = t.position || [0, 0];
  s.attr("transform", `translate(${i},${o})`);
}
function fu(n, t) {
  return n && typeof n[t] == "function";
}
function No(n, t, e) {
  if (!n.showHandles) return null;
  const s = n.handleContainer || n.container, i = t ? "source" : "target", o = s.group().addClass("connector-handle-glyph").attr({ "data-end": i, "pointer-events": "none", "aria-hidden": "true" }), r = s.circle(n.handleHitRadius * 2).attr({
    cx: e[0],
    cy: e[1],
    fill: "#ffffff",
    "fill-opacity": 1e-3,
    stroke: "none",
    "pointer-events": "all"
  }).addClass("connector-handle").addClass(t ? "connector-handle-source" : "connector-handle-target");
  try {
    r.node.style.cursor = "grab", r.node.style.touchAction = "none";
  } catch {
    r.node.setAttribute("style", "cursor: grab; touch-action: none");
  }
  const a = {
    element: r,
    glyph: o,
    glyphState: null,
    isSource: t,
    position: e,
    isDetached: !1,
    originalTarget: t ? n.source : n.target
  };
  return fn(n, a, Kn(n, t)), pu(n, a), a;
}
function Ro(n) {
  if (n) {
    try {
      n.element && n.element.remove();
    } catch {
    }
    try {
      n.glyph && n.glyph.remove();
    } catch {
    }
  }
}
function pu(n, t) {
  let e = null, s = !1;
  if (!fu(t.element, "draggable")) {
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
    t.element.front(), s = !1;
  }).on("dragmove", function(i) {
    s || (s = !0, mu(n, t));
    const o = [t.element.cx(), t.element.cy()];
    t.position = o;
    const r = i.detail.event;
    e = vu(n, r, t), wu(e), gu(n, t, o, e);
    let a = "free";
    e && (a = Ca(e, o) ? "pinned" : "follow"), fn(n, t, a);
  }).on("dragend", function(i) {
    try {
      t.element.node.style.cursor = "grab";
    } catch {
      t.element.node.setAttribute("style", "cursor: grab");
    }
    if (n.debugMode && Ea(n.container), !s) {
      e = null, typeof n.onLineClick == "function" && n.onLineClick();
      return;
    }
    if (s = !1, e)
      Oo(n, t, e), Aa();
    else {
      const o = [t.element.cx(), t.element.cy()], r = xu(n, o);
      t.isSource ? n._sourcePhantomRect = r : n._targetPhantomRect = r, Oo(n, t, r);
    }
    e = null;
  });
}
function mu(n, t) {
  t.isDetached = !0, t.originalTarget || (t.originalTarget = t.isSource ? n.source : n.target), t.originalType || (t.originalType = n.type);
  const e = t.isSource ? n.source : n.target;
  e && e._isPhantomRect && (e.remove(), t.isSource ? n._sourcePhantomRect = null : n._targetPhantomRect = null), t.isSource ? n.source = null : n.target = null;
}
function gu(n, t, e, s) {
  const i = t.originalType || n.type;
  let o = null, r = null;
  s && typeof s.bbox == "function" && !s._isPhantomRect && !(s.hasClass && s.hasClass("connector-handle")) && (r = Ca(s, e), o = s);
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
  }, c = n.source, l = n.target, h = n.type, d = n.sourceAnchor, u = n.targetAnchor;
  try {
    n.type = i, t.isSource ? (o ? (n.source = o, n.sourceAnchor = r) : (n.source = a, n.sourceAnchor = null), n.target || (n.target = {
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
    })) : (o ? (n.target = o, n.targetAnchor = r) : (n.target = a, n.targetAnchor = null), n.source || (n.source = {
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
    const f = Wi(n);
    n.connector.plot(f), n.hitArea.plot(f);
  } finally {
    n.source = c, n.target = l, n.type = h, n.sourceAnchor = d, n.targetAnchor = u;
  }
}
const yu = 10;
function Po(n, t, e = !1, s = 0) {
  try {
    const i = n.node.getCTM(), o = n.bbox();
    e && console.log("Hit test debug:", {
      element: n.type,
      point: t,
      bbox: o,
      ctm: i
    });
    const r = i.a * i.d - i.b * i.c;
    if (Math.abs(r) < 1e-10)
      return e && console.log("Using fallback bbox test due to singular matrix"), t[0] >= o.x && t[0] <= o.x + o.width && t[1] >= o.y && t[1] <= o.y + o.height;
    const a = i.d / r, c = -i.b / r, l = -i.c / r, h = i.a / r, d = (i.c * i.f - i.d * i.e) / r, u = (i.b * i.e - i.a * i.f) / r, f = a * t[0] + l * t[1] + d, p = c * t[0] + h * t[1] + u, m = s ? s / Math.sqrt(Math.abs(r) || 1) : 0;
    e && console.log("Local coordinates:", { localX: f, localY: p });
    let g = !1;
    if (n.type === "circle") {
      const y = parseFloat(n.attr("cx")) || o.cx, b = parseFloat(n.attr("cy")) || o.cy, x = parseFloat(n.attr("r")) || 0, C = f - y, v = p - b;
      g = C * C + v * v <= (x + m) * (x + m), e && console.log("Circle test:", {
        cx: y,
        cy: b,
        r: x,
        dx: C,
        dy: v,
        distance: Math.sqrt(C * C + v * v),
        result: g
      });
    } else if (n.type === "ellipse") {
      const y = parseFloat(n.attr("cx")) || o.cx, b = parseFloat(n.attr("cy")) || o.cy, x = parseFloat(n.attr("rx")) || 0, C = parseFloat(n.attr("ry")) || 0, v = f - y, w = p - b;
      g = v * v / ((x + m) * (x + m)) + w * w / ((C + m) * (C + m)) <= 1, e && console.log("Ellipse test:", { cx: y, cy: b, rx: x, ry: C, dx: v, dy: w, result: g });
    } else
      g = f >= o.x - m && f <= o.x + o.width + m && p >= o.y - m && p <= o.y + o.height + m, e && console.log("Rect test:", {
        localX: f,
        localY: p,
        bboxX: o.x,
        bboxY: o.y,
        bboxWidth: o.width,
        bboxHeight: o.height,
        result: g
      });
    return g;
  } catch (i) {
    e && console.log("Exception in hit test, using fallback:", i);
    const o = n.bbox();
    return t[0] >= o.x && t[0] <= o.x + o.width && t[1] >= o.y && t[1] <= o.y + o.height;
  }
}
function bu(n, t) {
  try {
    const e = n.bbox(), s = n.node.getCTM(), i = t.group().addClass("debug-hit-zone"), o = i.rect(e.width, e.height).attr({
      x: e.x,
      y: e.y,
      fill: "none",
      stroke: "#ffcccc",
      "stroke-width": 1,
      "stroke-dasharray": "2,2"
    });
    if (s) {
      const h = [
        [e.x, e.y],
        [e.x + e.width, e.y],
        [e.x + e.width, e.y + e.height],
        [e.x, e.y + e.height]
      ].map((d) => [
        s.a * d[0] + s.c * d[1] + s.e,
        s.b * d[0] + s.d * d[1] + s.f
      ]).map(
        (d, u) => (u === 0 ? "M" : "L") + d[0] + "," + d[1]
      ).join(" ") + " Z";
      i.path(h).attr({
        fill: "rgba(255, 0, 0, 0.1)",
        stroke: "#ff0000",
        "stroke-width": 2,
        "stroke-dasharray": "5,3"
      });
    }
    let r, a;
    try {
      r = s.a * e.cx + s.c * e.cy + s.e, a = s.b * e.cx + s.d * e.cy + s.f;
    } catch {
      r = e.cx, a = e.cy;
    }
    return i.circle(4).attr({
      cx: r,
      cy: a,
      fill: "#ff0000"
    }), i;
  } catch (e) {
    return console.warn("Error creating hit zone visualization:", e), null;
  }
}
function Ea(n) {
  try {
    n.find(".debug-hit-zone").forEach((e) => e.remove());
  } catch (t) {
    console.warn("Error clearing hit zone visualizations:", t);
  }
}
function vu(n, t, e) {
  const s = n.debugMode || !1;
  s && Ea(n.container);
  function i(p) {
    const m = [];
    function g(y) {
      o(y) && m.push(y), y.children && typeof y.children == "function" && y.children().forEach(g);
    }
    return g(p), m;
  }
  function o(p) {
    if (!["circle", "rect", "ellipse", "polygon", "path"].includes(p.type) || p.attr("connectortype") || p.hasClass && p.hasClass("connector-handle") || p._isPhantomRect || p.hasClass && p.hasClass("debug-hit-zone"))
      return !1;
    if (p.hasClass) {
      const w = p.node.classList;
      if (w && (w.contains("svg_select_boundingRect") || w.contains("svg_select_points") || w.contains("svg_select_selector") || w.contains("svg_resize_rotationPoint") || w.contains("svg_resize_handle") || w.contains("svg_resize_point") || w.contains("svg_draggable_handle") || w.contains("plugin-ui") || w.contains("ui-element")))
        return !1;
    }
    const g = p.bbox();
    if (g.width < 10 || g.height < 10)
      return !1;
    try {
      const _ = window.getComputedStyle(p.node).cursor;
      if (_ === "nw-resize" || _ === "ne-resize" || _ === "sw-resize" || _ === "se-resize" || _ === "ew-resize" || _ === "ns-resize" || _ === "crosshair")
        return !1;
    } catch {
    }
    const y = p.node.dataset;
    if (y && (y.svgjs || y.plugin || y.handle || y.ui))
      return !1;
    let b = p.parent();
    for (; b && b.type !== "svg"; ) {
      if (b.hasClass) {
        const _ = b.node.classList;
        if (_ && (_.contains("svg_select_group") || _.contains("svg_resize_group") || _.contains("plugin-ui-group")))
          return !1;
      }
      const w = b.attr("id");
      if (w && (w.includes("_select_") || w.includes("_resize_") || w.includes("plugin")))
        return !1;
      b = b.parent();
    }
    const x = p.attr("id");
    if (x && (x.includes("_select_") || x.includes("_resize_") || x.includes("_handle_") || x.includes("_rotation_") || x.includes("plugin") || x.startsWith("svg_")))
      return !1;
    const C = p.attr("fill"), v = p.attr("stroke");
    return !(!C && !v || (C === "transparent" || C === "none") && (!v || v === "none" || v === "transparent"));
  }
  const r = n.container.root(), a = r.node.getBoundingClientRect(), l = t && t.changedTouches && t.changedTouches[0] || t && t.touches && t.touches[0] || t;
  if (!l || !Number.isFinite(l.clientX) || !Number.isFinite(l.clientY)) return null;
  const h = l.clientX - a.left, d = l.clientY - a.top;
  s && console.log("Drop target search at:", { svgX: h, svgY: d });
  const u = i(r);
  s && (console.log("Found target shapes:", u.length), u.forEach((p, m) => {
    console.log(`Target shape ${m}:`, {
      type: p.type,
      id: p.attr("id"),
      classes: p.node.classList ? Array.from(p.node.classList) : [],
      fill: p.attr("fill"),
      stroke: p.attr("stroke"),
      bbox: p.bbox(),
      isValid: Nn(n, p, e)
    });
  }), u.forEach((p) => {
    Nn(n, p, e) && bu(p, n.container);
  }));
  const f = [];
  return u.forEach(function(p) {
    if (Nn(n, p, e))
      try {
        if (Po(p, [h, d], s)) {
          let g, y;
          try {
            const x = p.bbox(), C = p.node.getCTM();
            g = C.a * x.cx + C.c * x.cy + C.e, y = C.b * x.cx + C.d * x.cy + C.f;
          } catch {
            const C = p.bbox();
            g = C.cx, y = C.cy;
          }
          const b = Math.sqrt(
            Math.pow(h - g, 2) + Math.pow(d - y, 2)
          );
          s && console.log("Found candidate:", {
            element: p.type,
            distance: b
          }), f.push({ element: p, distance: b });
        }
      } catch (m) {
        console.warn("Error checking element for drop target:", m);
      }
  }), f.length === 0 && u.forEach(function(p) {
    if (Nn(n, p, e))
      try {
        if (!Po(p, [h, d], !1, yu)) return;
        const m = p.bbox(), g = p.node.getCTM(), y = g.a * m.cx + g.c * m.cy + g.e, b = g.b * m.cx + g.d * m.cy + g.f;
        f.push({ element: p, distance: Math.hypot(h - y, d - b) });
      } catch {
      }
  }), f.length > 0 ? (f.sort(function(p, m) {
    return p.distance - m.distance;
  }), s && console.log("Selected closest candidate:", f[0]), f[0].element) : (s && console.log("No drop target found"), null);
}
function Nn(n, t, e) {
  try {
    let i = t.node;
    for (; i && i.getAttribute && !i.getAttribute("data-node-id"); )
      i = i.parentNode;
    if (!(i && i.getAttribute && i.getAttribute("data-node-id")) || i.getAttribute("data-no-connect")) return !1;
  } catch {
    return !1;
  }
  if (t.attr("connectortype") || t.hasClass && t.hasClass("connector-handle") || t._isPhantomRect) return !1;
  const s = e.isSource ? n.target : n.source;
  return t !== s;
}
function Oo(n, t, e) {
  let s = null;
  try {
    s = { x: t.element.cx(), y: t.element.cy() };
  } catch {
  }
  const i = t.isSource ? n.source : n.target;
  if (i && i._isPhantomRect && (i.remove(), t.isSource ? n._sourcePhantomRect = null : n._targetPhantomRect = null), t.isSource ? n.source = e : n.target = e, t.isDetached = !1, !i || i !== e) {
    let o;
    t.isSource ? o = function(c) {
      n.update();
    } : o = function(c) {
      n.update();
    };
    const r = t.isSource ? "_sourceUpdateFunction" : "_targetUpdateFunction", a = n[r];
    if (a && i && (i.off("dragmove", a), i.off("beforedrag", a), i.off("dragstart", a), i.off("dragend", a), i.off("resize", a), i.off("rotate", a), i.off("transform", a)), t.isSource) {
      if (i && i.cons) {
        const c = i.cons.indexOf(n);
        c > -1 && i.cons.splice(c, 1);
      }
      e.cons = e.cons || [], e.cons.indexOf(n) === -1 && e.cons.push(n);
    } else {
      if (i && i.targetCons) {
        const c = i.targetCons.indexOf(n);
        c > -1 && i.targetCons.splice(c, 1);
      }
      e.targetCons = e.targetCons || [], e.targetCons.indexOf(n) === -1 && e.targetCons.push(n);
    }
    n[r] = o, e.on("dragmove", o), e.on("beforedrag", o), e.on("dragstart", o), e.on("dragend", o), e.on("resize", o), e.on("rotate", o), e.on("transform", o);
  }
  if (n.update(), n.source && n.target) {
    const o = Wi(n);
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
  if (fn(n, t, Kn(n, t.isSource)), typeof n.onEndpointChange == "function") {
    const o = !!e._isPhantomRect;
    let r = null;
    if (!o)
      try {
        let c = e.node || null;
        for (; c && c.getAttribute && !c.getAttribute("data-node-id"); )
          c = c.parentNode;
        r = c && c.getAttribute && c.getAttribute("data-node-id") || null;
      } catch {
      }
    let a = s;
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
let dt = null;
function wu(n) {
  if (n !== dt)
    if (Aa(), n) {
      dt = n, n._originalStroke = n.attr("stroke"), n._originalStrokeWidth = n.attr("stroke-width"), n._originalStrokeDasharray = n.attr("stroke-dasharray"), n._originalStrokeOpacity = n.attr("stroke-opacity"), n.attr({
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
      dt = null;
}
function Aa() {
  if (dt && dt._originalStroke !== void 0) {
    dt.attr({
      stroke: dt._originalStroke,
      "stroke-width": dt._originalStrokeWidth,
      "stroke-dasharray": dt._originalStrokeDasharray,
      "stroke-opacity": dt._originalStrokeOpacity
    });
    try {
      const n = dt.node.style;
      n.animation = "", n.strokeDashoffset = "";
    } catch {
    }
    delete dt._originalStroke, delete dt._originalStrokeWidth, delete dt._originalStrokeDasharray, delete dt._originalStrokeOpacity;
  }
  dt = null;
}
function Io(n, t) {
  if (!n.showHandles || !t || t.length < 2) {
    n.sourceHandle && (Ro(n.sourceHandle), n.sourceHandle = null), n.targetHandle && (Ro(n.targetHandle), n.targetHandle = null);
    return;
  }
  const e = [t[0][1], t[0][2]], s = t[t.length - 1], i = [s[s.length - 2], s[s.length - 1]];
  n.sourceHandle ? (n.sourceHandle.element.attr({
    cx: e[0],
    cy: e[1]
  }), n.sourceHandle.position = e) : n.sourceHandle = No(n, !0, e), fn(n, n.sourceHandle, Kn(n, !0)), n.targetHandle ? (n.targetHandle.element.attr({
    cx: i[0],
    cy: i[1]
  }), n.targetHandle.position = i) : n.targetHandle = No(n, !1, i), fn(n, n.targetHandle, Kn(n, !1));
}
function xu(n, t) {
  const e = n.container.rect(20, 20).attr({
    x: t[0] - 10,
    y: t[1] - 10,
    fill: "transparent",
    stroke: "none",
    "pointer-events": "none"
  }).addClass("connector-phantom-rect");
  return e._isPhantomRect = !0, e;
}
function Tt(n, t) {
  return n && typeof n[t] == "function";
}
function Ta(n, t) {
  t.current && t.current !== n && qi(t.current), t.current = n, n.isSelected = !0, n.showHandles = !0, n.update();
}
function qi(n) {
  n.isSelected = !1, n.showHandles = !1, n.update();
}
function _u(n, t) {
  n.isSelected ? (qi(n), t.current === n && (t.current = null)) : Ta(n, t);
}
function Su(n, t) {
  let e = null;
  const s = 5;
  function i(r) {
    e = { x: r.clientX, y: r.clientY };
  }
  function o(r) {
    if (!e) return;
    const a = r.clientX - e.x, c = r.clientY - e.y;
    Math.sqrt(a * a + c * c) < s && typeof n.onLineClick == "function" && n.onLineClick(r), e = null;
  }
  n.hitArea.on("mousedown", i), n.hitArea.on("mouseup", o), n.connector.on("mousedown", i), n.connector.on("mouseup", o);
}
function Cu(n, t, e) {
  n[t + "Attach"] = e, n.update();
}
function Eu(n, t) {
  return n.showHandles = t, n.update(), n;
}
function Au(n) {
  return {
    sourceHandle: n.sourceHandle,
    targetHandle: n.targetHandle
  };
}
function Tu(n, t) {
  return n.clickAreaWidth = Math.max(6, t || 12), n.hitArea.attr("stroke-width", n.clickAreaWidth), n;
}
function Mu(n, t) {
  t && (n.connector.remove(), t == "default" ? (n.connector = n.container.path().attr("connectortype", "default").fill("none").stroke("#000000").attr("stroke-width", 2), n.connector.stroke(n.color).attr("stroke-width", n.strokeWidth)) : n.connector = t, n.update());
}
function ku(n, t) {
  ["straight", "curved", "orthogonal"].indexOf(t) != -1 && n.type != t && (n.type = t, n.update());
}
function Ma(n, t) {
  return n.debugMode = t, n.hitArea.attr({
    stroke: n.debugMode ? "#ff0000" : "#000000",
    "stroke-opacity": n.debugMode ? 0.5 : 0.01
  }), n;
}
function Nu(n) {
  return Ma(n, !n.debugMode);
}
function ka(n, t) {
  return t = t || {}, Tt(n.source, "select") ? n.source.select(t) : console.warn(
    "svg.select.js plugin not available. Install @svgdotjs/svg.select.js to use selection features."
  ), Tt(n.target, "select") ? n.target.select(t) : console.warn(
    "svg.select.js plugin not available. Install @svgdotjs/svg.select.js to use selection features."
  ), n;
}
function Na(n, t) {
  return Tt(n.source, "draggable") ? n.source.draggable() : console.warn(
    "svg.draggable.js plugin not available. Install @svgdotjs/svg.draggable.js to use dragging features."
  ), Tt(n.target, "draggable") ? n.target.draggable() : console.warn(
    "svg.draggable.js plugin not available. Install @svgdotjs/svg.draggable.js to use dragging features."
  ), n;
}
function Ra(n, t) {
  return t = t || {}, Tt(n.source, "resize") ? n.source.resize(t) : console.warn(
    "svg.resize.js plugin not available. Install @svgdotjs/svg.resize.js to use resize features."
  ), Tt(n.target, "resize") ? n.target.resize(t) : console.warn(
    "svg.resize.js plugin not available. Install @svgdotjs/svg.resize.js to use resize features."
  ), n;
}
function Ru(n, t, e, s, i) {
  return t = t || {}, s = s || {}, Tt(n.source, "draggable") && Tt(n.target, "draggable"), Tt(n.source, "select") && Tt(n.target, "select"), Tt(n.source, "resize") && Tt(n.target, "resize"), Na(n), ka(n, t), Ra(n, s), n;
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
let ce = null, Os = null;
const Rn = { current: null };
function Pu(n, t) {
  const e = {};
  t === void 0 && (t = n, n = {}), ce = n.container || this.parent() || ce;
  const s = this;
  if (Os = n.markers || this.parent() || Os, e.container = ce, e.source = s, e.target = t, e.type = n.type || "straight", e.strokeWidth = n.strokeWidth || 2, e.color = n.color || "#000000", e.clickAreaWidth = n.clickAreaWidth || Math.max(12, e.strokeWidth * 3), e.debugMode = n.debugMode || !1, n.connector) {
    const a = ms.find(
      "#" + n.connector.node.getAttribute("href").slice(1)
    )[0];
    if (a && a.type == "path") {
      e.connector = n.connector;
      const c = a.array();
      if (!(c[1] && c[1][0] == "M") || !(c[2] && c[2][0] == "M")) {
        const l = a.bbox();
        c.splice(
          0,
          0,
          ["M", l.x + l.width / 2, l.y],
          ["M", l.x + l.width / 2, l.y + l.height]
        ), a.plot(c);
      }
      e.connector.target = a;
    }
  }
  e.connector || (e.connector = ce.path().attr("connectortype", "default").fill("none").stroke(e.color).attr("stroke-width", e.strokeWidth)), e.hitArea = ce.path().attr({
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
  e.hitArea.back(), e.sourceAttach = n.sourceAttach || "perifery", e.targetAttach = n.targetAttach || "perifery", e.sourceAnchor = n.sourceAnchor || null, e.targetAnchor = n.targetAnchor || null, e.curveRadius = n.curveRadius || 20, e.lineCurviness = typeof n.lineCurviness == "number" ? n.lineCurviness : 0.3, e.lineCurveType = n.lineCurveType || "cubic", e.markerSourceType = n.markerSource || "null", e.markerTargetType = n.markerTarget || n.marker || "default", e.showHandles = n.showHandles || !1, e.handleRadius = n.handleRadius || 6, e.handleHitRadius = n.handleHitRadius || 14, e.handleContainer = n.handleContainer || n.markers || null, e.handleStrokeWidth = n.handleStrokeWidth || 2, e.handleStroke = n.handleStroke || "#1f6feb", e.handleFill = n.handleFill || "none", e.isSelected = !1, e.computeConnectorCoordinates = function(a) {
    return Wi(a || e);
  }, s.cons = s.cons || [], s.cons.push(e), t.targetCons = t.targetCons || [], t.targetCons.push(e), e.update = function() {
    if (e.connector.attr("connectortype") == "default") {
      const a = e.computeConnectorCoordinates(e);
      let c = !0;
      for (let l = 0; l < a.length; l++)
        for (let h = 1; h < a[l].length; h++)
          (isNaN(a[l][h]) || !isFinite(a[l][h])) && (console.error(
            "Invalid coordinate in path data:",
            a[l][h],
            "at",
            [l, h]
          ), c = !1);
      c ? (e.connector.plot(a), e.hitArea.plot(a), Io(e, a), e.positionLabel && e.positionLabel()) : console.error("Skipping plot due to invalid path data");
    }
  }, Vn(e, e.markerSourceType, e.markerTargetType, Os), e.sourceHandle = null, e.targetHandle = null, e.setMarker = function(a, c, l) {
    return Vn(e, a, c, l);
  }, e.setMarkerSettings = function(a, c) {
    return cu(e, a, c);
  }, e.positionLabel = function() {
    if (!(!e.label || !e.connector || !e.connector.node))
      try {
        const a = e.connector.node.getTotalLength();
        if (!a || !isFinite(a)) return;
        const c = typeof e.labelAt == "number" && isFinite(e.labelAt) ? Math.min(0.95, Math.max(0.05, e.labelAt)) : 0.5, l = e.connector.node.getPointAtLength(a * c);
        if (e.label.center(l.x, l.y), e.labelBg) {
          const h = e.label.bbox();
          e.labelBg.size(h.width + 10, h.height + 4).center(l.x, l.y);
        }
      } catch {
      }
  }, e.setLabel = function(a) {
    if (e.labelText = a == null ? "" : String(a), !e.labelText) {
      e.label && (e.label.remove(), e.label = null), e.labelBg && (e.labelBg.remove(), e.labelBg = null);
      return;
    }
    e.label ? e.label.text(e.labelText) : (e.labelBg = ce.rect(0, 0).attr({ fill: "#ffffff", "fill-opacity": 0.85, "pointer-events": "none" }).radius(3), e.label = ce.text(e.labelText).attr({
      "font-size": 13,
      "font-family": "Arial, sans-serif",
      fill: "#333333",
      "text-anchor": "middle",
      "pointer-events": "none"
    })), e.positionLabel();
  }, e.setStrokeWidth = function(a) {
    return lu(e, a);
  }, e.setConnectorColor = function(a) {
    return ko(e, a), e;
  }, e.remove = function() {
    const a = (c) => {
      try {
        c && c.remove && c.remove();
      } catch {
      }
    };
    return a(e.connector), a(e.hitArea), a(e.sourceHandle && e.sourceHandle.element), a(e.sourceHandle && e.sourceHandle.glyph), a(e.targetHandle && e.targetHandle.element), a(e.targetHandle && e.targetHandle.glyph), a(e.markerSource && e.markerSource.element), a(e.markerTarget && e.markerTarget.element), e.markerSource = null, e.markerTarget = null, a(e._sourcePhantomRect), a(e._targetPhantomRect), a(e.label), a(e.labelBg), e;
  }, e.getCurrentAnchor = function(a) {
    const c = a === "source" ? e.source : e.target, l = a === "source" ? e.target : e.source;
    if (!c || !c.bbox || !l) return { x: 0.5, y: 0.5 };
    try {
      const h = hn(l), d = Zn(c, h), u = gs(c, d[0], d[1]), f = c.bbox();
      return !f.width || !f.height ? { x: 0.5, y: 0.5 } : {
        x: (u[0] - f.x) / f.width,
        y: (u[1] - f.y) / f.height
      };
    } catch {
      return { x: 0.5, y: 0.5 };
    }
  }, e.setAttachmentAnchor = function(a, c) {
    return a === "source" ? e.sourceAnchor = c || null : a === "target" && (e.targetAnchor = c || null), e.update(), e;
  }, e.updateHandles = function(a) {
    Io(e, a);
  }, e.selectConnector = function() {
    Ta(e, Rn);
  }, e.deselectConnector = function() {
    qi(e), Rn.current === e && (Rn.current = null);
  }, e.toggleSelection = function() {
    _u(e, Rn);
  }, e.setConnectorAttachment = function(a, c) {
    Cu(e, a, c);
  }, e.setHandleVisibility = function(a) {
    return Eu(e, a);
  }, e.getHandles = function() {
    return Au(e);
  }, e.setClickAreaWidth = function(a) {
    return Tu(e, a);
  }, e.setConnector = function(a) {
    Mu(e, a);
  }, e.setType = function(a) {
    ku(e, a);
  }, e.setDebugMode = function(a) {
    return Ma(e, a);
  }, e.toggleDebugMode = function() {
    return Nu(e);
  }, e.makeSelectable = function(a) {
    return ka(e, a);
  }, e.makeDraggable = function(a) {
    return Na(e);
  }, e.makeResizable = function(a) {
    return Ra(e, a);
  }, e.makeInteractive = function(a, c, l) {
    return Ru(e, a, c, l);
  }, Su(e), e.update();
  function i(a) {
    e.update();
  }
  function o(a) {
    e.update();
  }
  function r(a) {
    e.update();
  }
  return e._sourceUpdateFunction = o, e._targetUpdateFunction = r, s.on("dragmove", o), t.on("dragmove", r), s.on("beforedrag", o), s.on("dragstart", o), s.on("dragend", o), t.on("beforedrag", r), t.on("dragstart", r), t.on("dragend", r), s.on("resize", o), t.on("resize", r), s.on("rotate", o), t.on("rotate", r), s.on("transform", o), t.on("transform", r), e.updateConnector = i, ko(e, e.color), e;
}
G(bt, {
  connectable: Pu,
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
  makeConnectableAndInteractive: function(n, t, e, s) {
    const i = this.connectable(n, t);
    return i.makeInteractive(e, s), i;
  }
});
const Zi = 28, Jn = 44, bs = 20, tn = 15, Ou = 4, Iu = 24, Du = 48, Lu = 20, zu = 32, Bu = 15, gi = "M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8M21 3v5h-5", Is = "#2d6cdf", Do = "#1f56b8", Lo = "#c7ccd4", Gu = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="${gi}" stroke="#fff" stroke-width="5"/><path d="${gi}" stroke="#1b1f1d" stroke-width="2"/></svg>`, Vi = `url("data:image/svg+xml,${encodeURIComponent(Gu)}") 12 12, grab`;
function Me(n) {
  let t = n % 360;
  return t <= -180 && (t += 360), t > 180 && (t -= 360), t === 0 ? 0 : t;
}
function $u(n, t, e, s, i = {}) {
  const o = Math.atan2(e.y - t.y, e.x - t.x), r = Math.atan2(s.y - t.y, s.x - t.x);
  return Ki(n + (r - o) * 180 / Math.PI, i);
}
function Ki(n, t = {}) {
  let e = n;
  if (t.shift)
    e = Math.round(e / tn) * tn;
  else {
    const s = Math.round(e / 90) * 90;
    e = t.coarse && Math.abs(e - s) <= Ou ? s : Math.round(e);
  }
  return Me(e);
}
function Pa(n, t, e = bs, s = "right") {
  const i = n?.[0], o = n?.[2], r = n?.[4];
  if (!i || !o || !r) return null;
  const a = t > 0 && Number.isFinite(t) ? t : 1, c = (f, p) => {
    const m = f[0] - p[0], g = f[1] - p[1], y = Math.hypot(m, g);
    return y > 1e-9 ? [m / y, g / y] : [0, 0];
  };
  let l = c(o, i), h = c(o, r);
  !l[0] && !l[1] && (l = [1, 0]), !h[0] && !h[1] && (h = [-l[1], l[0]]);
  const d = e / a, u = s === "left" ? [i[0] + (h[0] - l[0]) * d, i[1] + (h[1] - l[1]) * d] : [o[0] + (l[0] + h[0]) * d, o[1] + (l[1] + h[1]) * d];
  return Number.isFinite(u[0]) && Number.isFinite(u[1]) ? u : null;
}
function Hu(n, t) {
  const e = n("right");
  return e >= t ? "right" : n("left") > e ? "left" : "right";
}
function Fu(n, t) {
  if (typeof document > "u" || typeof document.elementFromPoint != "function" || !t) return n.length;
  const e = window.innerWidth || 0, s = window.innerHeight || 0;
  let i = 0;
  for (const o of n) {
    if (!(o.x >= 0 && o.y >= 0 && o.x <= e && o.y <= s)) continue;
    const r = document.elementFromPoint(o.x, o.y);
    r && t.contains(r) && (i += 1);
  }
  return i;
}
function Uu(n, t = !1) {
  const e = Number.isFinite(n) ? n : 1 / 0;
  return e < Iu ? { visible: !1, size: 0, hit: 0, offset: 0 } : e < Du && !t ? { visible: !0, size: Lu, hit: zu, offset: Bu } : { visible: !0, size: Zi, hit: Jn, offset: bs };
}
function ju(n, t) {
  const e = n?.[0], s = n?.[2], i = n?.[4];
  if (!e || !s || !i) return 1 / 0;
  const o = t > 0 && Number.isFinite(t) ? t : 1;
  return Math.min(Math.hypot(s[0] - e[0], s[1] - e[1]), Math.hypot(i[0] - s[0], i[1] - s[1])) * o;
}
function Yu() {
  try {
    return typeof window < "u" && !!window.matchMedia?.("(pointer: coarse)").matches;
  } catch {
    return !1;
  }
}
function Xu(n) {
  try {
    const t = n?.el?.root?.()?.screenCTM?.(), e = t ? Math.hypot(t.a, t.b) : 1;
    return e > 0 && Number.isFinite(e) ? e : 1;
  } catch {
    return 1;
  }
}
function Oa(n) {
  n.rect(Jn, Jn).addClass("svg_select_handle_rot_hit").attr({
    fill: "#fff",
    "fill-opacity": 1e-3,
    stroke: "none",
    "pointer-events": "all"
  }), n.circle(Zi).addClass("svg_select_handle_rot_knob").attr({
    fill: "#fff",
    stroke: Lo,
    "stroke-width": 1,
    "pointer-events": "all"
  }), n.path(gi).addClass("svg_select_handle_rot_icon").attr({
    fill: "none",
    stroke: Is,
    "stroke-width": 2.6,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "pointer-events": "none"
  });
  const t = n.node;
  t.style.cursor = Vi, t.style.filter = "drop-shadow(0 1px 2px rgba(0,0,0,.28))", t.setAttribute("data-rotate-knob", ""), t.setAttribute("aria-label", "Rotate");
  const e = () => {
    const s = t.getAttribute("data-state"), i = t.querySelector("circle"), o = t.querySelector("path");
    i?.setAttribute("fill", s === "active" ? Do : s === "hover" ? Is : "#fff"), i?.setAttribute("stroke", s ? Do : Lo), o?.setAttribute("stroke", s ? "#fff" : Is);
  };
  t.__paintKnob = e, t.addEventListener("pointerenter", () => {
    t.getAttribute("data-state") !== "active" && t.setAttribute("data-state", "hover"), e(), n.__relayout?.();
  }), t.addEventListener("pointerleave", () => {
    t.getAttribute("data-state") !== "active" && t.removeAttribute("data-state"), e(), n.__relayout?.();
  });
}
function Ia(n, t, e) {
  Da(n, e, Xu(this));
  const s = () => Ia.call(this, n, t, e);
  n.__relayout = s, n.node.__relayout = s;
}
function Wu(n) {
  n?.querySelectorAll?.("[data-rotate-knob]").forEach((t) => {
    try {
      t.__relayout?.();
    } catch {
    }
  });
}
function Da(n, t, e) {
  const s = n.node, i = Uu(ju(t, e), Yu());
  if (!i.visible) {
    s.setAttribute("display", "none"), s.setAttribute("data-knob-size", "0");
    return;
  }
  s.removeAttribute("display"), s.setAttribute("data-knob-size", String(i.size));
  const o = s.getAttribute("data-state") === "active", r = o && s.getAttribute("data-knob-side") === "left" ? "left" : o ? "right" : qu(s, t, e, i);
  s.setAttribute("data-knob-side", r);
  const a = Pa(t, e, i.offset, r);
  if (!a) return;
  const [c, l] = a, h = s.getAttribute("data-state") ? 1.1 : 1, d = n.findOne?.("rect"), u = n.findOne?.("circle"), f = n.findOne?.("path"), p = i.hit / e;
  d?.attr({ x: c - p / 2, y: l - p / 2, width: p, height: p, rx: p / 2, ry: p / 2 }), u?.attr({ cx: c, cy: l, r: i.size * h / 2 / e, "stroke-width": 1 / e });
  const m = i.size * 4 / 7 * h / 24 / e;
  f?.attr({ transform: `translate(${c - 12 * m} ${l - 12 * m}) scale(${m})` });
}
function qu(n, t, e, s) {
  try {
    const i = n.getScreenCTM?.();
    let o = n.ownerSVGElement;
    for (; o?.ownerSVGElement; ) o = o.ownerSVGElement;
    if (!i || !o) return "right";
    const r = s.size / 2, a = (c) => {
      const l = Pa(t, e, s.offset, c);
      if (!l) return [];
      const h = i.a * l[0] + i.c * l[1] + i.e, d = i.b * l[0] + i.d * l[1] + i.f;
      return [{ x: h, y: d }, { x: h - r, y: d }, { x: h + r, y: d }, { x: h, y: d - r }, { x: h, y: d + r }];
    };
    return Hu((c) => Fu(a(c), o), 5);
  } catch {
    return "right";
  }
}
class La {
  constructor() {
    this.el = null;
  }
  /**
   * @param coarse - a finger: the pill goes above the touch point, where the hand
   *                 does not cover it (a mouse: below and to the right)
   */
  show(t, e, s, i = !1) {
    if (typeof document > "u") return;
    if (!this.el) {
      const d = document.createElement("div");
      d.className = "slatebox-rotate-readout", d.setAttribute("aria-hidden", "true"), d.style.cssText = "position:fixed;left:0;top:0;z-index:2147483000;pointer-events:none;padding:3px 8px;border-radius:999px;background:#1b1f1d;color:#fff;font:600 12px/16px system-ui,-apple-system,'Segoe UI',sans-serif;font-variant-numeric:tabular-nums;box-shadow:0 2px 6px rgba(0,0,0,.3);white-space:nowrap", document.body.appendChild(d), this.el = d;
    }
    this.el.textContent = `${Math.round(t)}°`;
    const o = this.el.offsetWidth || 40, r = this.el.offsetHeight || 22, a = window.innerWidth || 0, c = window.innerHeight || 0, l = Math.max(4, Math.min(i ? e - o / 2 : e + 24, a - o - 4)), h = Math.max(4, Math.min(i ? s - 56 - r : s + 24, c - r - 4));
    this.el.style.transform = `translate(${Math.round(l)}px, ${Math.round(h)}px)`;
  }
  hide() {
    this.el?.remove(), this.el = null;
  }
}
function yi(n) {
  const e = n?.touches?.[0] ?? n?.changedTouches?.[0] ?? n, s = e?.clientX, i = e?.clientY;
  return Number.isFinite(s) && Number.isFinite(i) ? { x: s, y: i } : null;
}
function Zu(n, t, e) {
  const s = n, i = [s[0] - t[0], s[1] - t[1]], o = [s[0] - e[0], s[1] - e[1]], r = Math.sqrt(i[0] * i[0] + i[1] * i[1]) || 1, a = Math.sqrt(o[0] * o[0] + o[1] * o[1]) || 1, c = [i[0] / r, i[1] / r], l = [o[0] / a, o[1] / a], h = [s[0] - 10 * c[0], s[1] - 10 * c[1]], d = [s[0] - 10 * l[0], s[1] - 10 * l[1]], u = [h, s, d];
  return u.every(
    (p) => Number.isFinite(p[0]) && Number.isFinite(p[1])
  ) ? u : null;
}
class za {
  /**
   * Creates resize/rotate handle management for a node.
   *
   * @param node    - The parent Node instance
   * @param options - Resize/rotate configuration
   */
  constructor(t, e = {}) {
    this.isActive = !1, this._interacting = !1, this._didRotate = !1, this._didResize = !1, this._readout = new La(), this._cancelled = !1, this._keyPending = !1, this.onGestureKey = (s) => {
      if (s.key !== "Escape" || !this._interacting || !this._rot) return;
      s.preventDefault(), s.stopImmediatePropagation();
      const i = this.node, o = this._rot.angle;
      this._cancelled = !0, this._didRotate = this._didResize = !1, i && (i.options.rotate?.rotationAngle ?? 0) !== o && (i.applyInteractionRotation(o), i.finalizeInteraction(), i.slate?.notifyNodeChanged(i)), this.finish(), i?.slate?.announce?.("Rotate cancelled");
    }, this.scheduleFinish = () => {
      this._cancelled && setTimeout(() => this._cancelled = !1, 0), this._interacting && (clearTimeout(this._endTimer), this._endTimer = setTimeout(() => this.finish(), 0));
    }, this.node = t, this.target = t.resizeTarget ?? t.backgroundRect, this.options = {
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
    if (this.isActive) return;
    if (this.target = this.node.resizeTarget ?? this.node.backgroundRect, !this.target) {
      console.warn(
        "RESIZE_ROTATE_DEBUG: Cannot enable — target (backgroundRect) not available on",
        this.node?.id
      );
      return;
    }
    const t = this.node.slate, e = t?.governanceOf?.(this.node) ? t.capabilitiesOf(this.node) : null, s = !!this.options.resizeEnabled && e?.canResize !== !1, i = !!this.options.rotateEnabled && e?.canRotate !== !1;
    try {
      const o = this.target;
      typeof o.select == "function" && (o.select({
        rotationPoint: e ? i : this.options.rotateEnabled,
        // svg.select.js' default updateHandle divides by the distance between
        // adjacent handle points; when a transient/degenerate bbox makes points
        // coincide (or the screenCTM collapses), that divide-by-zero plots
        // "NaN" polyline points and floods the console (notably on multi-select
        // via the keyboard). This replicates the default L-bracket exactly but
        // guards the division and never plots non-finite points.
        updateHandle: (r, a, c, l) => {
          const h = l[(c - 1 + l.length) % l.length], d = l[(c + 1) % l.length], u = Zu(a, h, d);
          u && r.plot(u);
        },
        // A screen-sized knob with a rotate icon outside the top-right corner,
        // in place of the plugin's 5-unit dot above top-centre.
        createRot: Oa,
        updateRot: Ia
      }), (e ? i : this.options.rotateEnabled) && this.wireKnobKeyboard()), (e ? s || i : this.options.resizeEnabled) && typeof o.resize == "function" && o.resize({
        preserveAspectRatio: this.options.preserveAspectRatio,
        aroundCenter: this.options.aroundCenter,
        grid: this.options.grid ?? 1,
        degree: this.options.degree ?? 0.1
      }), this.styleSelectionUi(), e && this.hideHandles(!s, !i), this.addEventListeners(), this.isActive = !0;
    } catch (o) {
      console.warn("Failed to enable resize/rotate:", o);
    }
  }
  /**
   * Keep svg.select.js' generated control layer non-obscuring and make the
   * L-shaped polyline handles easier to grab. These inline attributes are
   * intentional because consumers can use the built JS without loading CSS.
   */
  styleSelectionUi() {
    try {
      const t = this.target.node, e = t.ownerSVGElement || t;
      e.querySelectorAll(
        ".svg_select_shape, .svg_select_shape_pointSelect"
      ).forEach((o) => {
        o.classList.contains("svg_select_shape") && (o.setAttribute("stroke", "#4A90E2"), o.setAttribute("stroke-width", "1.5"), o.setAttribute("stroke-dasharray", "5 5"), o.setAttribute("stroke-opacity", "0.55")), o.setAttribute("fill", "none"), o.setAttribute("fill-opacity", "0"), o.setAttribute("pointer-events", "none"), o.style.fill = "none", o.style.fillOpacity = "0", o.style.pointerEvents = "none";
      }), e.querySelectorAll(".svg_select_handle").forEach((o) => {
        o.setAttribute("stroke-width", "6"), o.setAttribute("stroke", "#4A90E2"), o.style.pointerEvents = "all";
      });
    } catch (t) {
      console.warn(
        "RESIZE_ROTATE_DEBUG: Failed to widen handle hit areas:",
        t
      );
    }
  }
  /** The rotate knob's group in the overlay, if drawn. */
  knobElement() {
    try {
      return this.target?.remember?.("_selectHandler")?.selection?.node?.querySelector?.("g.svg_select_handle_rot") ?? null;
    } catch {
      return null;
    }
  }
  /**
   * The knob is a keyboard control too: Tab reaches it, arrows turn the note by 1°
   * (Shift: to the next 15°), Home puts it back to 0°. It handles its own keys so
   * the canvas's arrow-key nudge never sees them.
   */
  wireKnobKeyboard() {
    const t = this.knobElement();
    if (!t) return;
    t.setAttribute("tabindex", "-1"), t.setAttribute("role", "slider"), t.setAttribute("aria-label", "Rotate note"), t.setAttribute("aria-valuemin", "-180"), t.setAttribute("aria-valuemax", "180");
    const e = () => {
      const s = Me(this.node?.options.rotate?.rotationAngle ?? 0);
      t.setAttribute("aria-valuenow", String(Math.round(s))), t.setAttribute("aria-valuetext", `${Math.round(s)} degrees`);
    };
    e(), t.addEventListener("focus", () => {
      t.style.outline = "none", t.querySelector("circle")?.setAttribute("stroke", "#1f56b8"), t.querySelector("circle")?.setAttribute("stroke-width", String(2.5 / this.overlayScale()));
    }), t.addEventListener("blur", () => {
      this.commitKeyRotation(), t.__paintKnob?.(), t.querySelector("circle")?.setAttribute("stroke-width", String(1 / this.overlayScale()));
    }), t.addEventListener("keydown", (s) => {
      const i = this.node?.svgGroup?.node;
      if (s.key === "Tab" && !s.shiftKey) {
        i?.focus();
        return;
      }
      if (s.key === "Escape") {
        i?.focus();
        return;
      }
      if (s.key === "Tab") {
        s.preventDefault(), s.stopPropagation();
        const c = this.node?.connectionHandles?.left?.node;
        c?.isConnected && c.getBoundingClientRect().width > 0 ? (c.setAttribute("tabindex", "0"), c.focus()) : i?.focus();
        return;
      }
      const o = this.node?.options.rotate?.rotationAngle ?? 0;
      let r = null;
      const a = s.key === "ArrowRight" || s.key === "ArrowUp" ? 1 : s.key === "ArrowLeft" || s.key === "ArrowDown" ? -1 : 0;
      a ? r = s.shiftKey ? (a > 0 ? Math.floor(o / tn) + 1 : Math.ceil(o / tn) - 1) * tn : Math.round(o) + a : s.key === "Home" && (r = 0), r !== null && (s.preventDefault(), s.stopPropagation(), this.previewKeyRotation(r), e());
    }), t.addEventListener("keyup", (s) => {
      /^Arrow|^Home$/.test(s.key) && this.commitKeyRotation();
    });
  }
  /** Move keyboard focus to the rotate knob, if it is drawn and usable. */
  focusKnob() {
    const t = this.isActive ? this.knobElement() : null;
    return !t || t.style.display === "none" || !(t.getBoundingClientRect().width > 0) ? !1 : (t.focus(), document.activeElement === t);
  }
  /** Turn the note from the keyboard now; save it when the key is released or after a pause. */
  previewKeyRotation(t) {
    const e = this.node;
    e && (e.applyInteractionRotation(Me(t)), e.finalizeInteraction(), e.slate?.notifyNodeChanged(e), this._keyPending = !0, clearTimeout(this._keyCommitTimer), this._keyCommitTimer = setTimeout(() => this.commitKeyRotation(), 700));
  }
  /** Save the keyboard's pending turn as one step (broadcast + announce), if there is one. */
  commitKeyRotation() {
    if (clearTimeout(this._keyCommitTimer), !this._keyPending) return;
    this._keyPending = !1;
    const t = this.node;
    t && this.rotateTo(t.options.rotate?.rotationAngle ?? 0);
  }
  /** Turn the note to an absolute angle as one finished step (keyboard). */
  rotateTo(t) {
    const e = this.node;
    if (!e) return;
    const s = Me(t);
    e.applyInteractionRotation(s), e.finalizeInteraction();
    const { id: i, options: o, slate: r } = e;
    r?.broadcast?.("onNodeRotated", {
      id: i,
      rotate: o.rotate,
      width: o.width,
      height: o.height,
      x: o.x,
      y: o.y
    }), r?.notifyNodeChanged(e), r?.announce?.(`Rotated to ${Math.round(s)} degrees`);
  }
  overlayScale() {
    try {
      const t = this.target.root().screenCTM(), e = Math.hypot(t.a, t.b);
      return e > 0 && Number.isFinite(e) ? e : 1;
    } catch {
      return 1;
    }
  }
  /** A client point in the canvas's world coordinates (the note's options space). */
  toWorld(t) {
    try {
      const e = this.node.slate?.canvas?.node?.getScreenCTM?.();
      if (!e) return null;
      const s = new DOMPoint(t.x, t.y).matrixTransform(e.inverse());
      return Number.isFinite(s.x) && Number.isFinite(s.y) ? { x: s.x, y: s.y } : null;
    } catch {
      return null;
    }
  }
  /** Keep the selection outline but remove the handles a governed note may not use. */
  hideHandles(t, e) {
    const s = [
      t ? ".svg_select_handle:not(.svg_select_handle_rot)" : "",
      e ? ".svg_select_handle_rot" : ""
    ].filter(Boolean);
    if (s.length)
      try {
        const i = this.target.node;
        (i.ownerSVGElement || i).querySelectorAll(s.join(", ")).forEach((r) => {
          r.style.display = "none", r.style.pointerEvents = "none";
        });
      } catch {
      }
  }
  /** Disable resize and rotate handles on the node. */
  disable() {
    if (this.isActive) {
      this.commitKeyRotation();
      try {
        const t = this.target;
        typeof t.select == "function" && t.select(!1), typeof t.resize == "function" && t.resize(!1), this.removeEventListeners(), this.isActive = !1;
      } catch (t) {
        console.warn("Failed to disable resize/rotate:", t);
      }
    }
  }
  addEventListeners() {
    this.target.on("beforeresize.resizerotate", (t) => {
      this.finish(), this._cancelled = !1;
      const e = t.detail.handler, s = t.detail.event.detail.event;
      e.preserveAspectRatio = !!(this.options.preserveAspectRatio || s.shiftKey);
      const i = this.node.options, o = this.target.bbox();
      if (this._start = {
        x: i.x ?? 0,
        y: i.y ?? 0,
        width: i.width ?? 0,
        height: i.height ?? 0,
        angle: i.rotate?.rotationAngle ?? 0,
        localX: o.x,
        localY: o.y
      }, this._rot = void 0, t.detail.event?.type === "rot") {
        const a = yi(s), c = a && this.toWorld(a);
        c && (this._rot = {
          angle: i.rotate?.rotationAngle ?? 0,
          centre: { x: (i.x ?? 0) + (i.width ?? 0) / 2, y: (i.y ?? 0) + (i.height ?? 0) / 2 },
          grab: c
        }), document.documentElement.style.cursor = Vi, window.addEventListener("keydown", this.onGestureKey, !0), this.knobElement()?.setAttribute("data-state", "active"), this.knobElement()?.__paintKnob?.();
      }
      this._interacting = !0, this._didRotate = this._didResize = !1, this.node.disableConnectionHandles();
      const r = this.target.remember("_selectHandler")?.getHandlePoints(o);
      r && queueMicrotask(() => {
        e.points = r;
      });
    }), this.target.on("resize.resizerotate", (t) => {
      const { box: e, angle: s, eventType: i } = t.detail ?? {};
      if (this._cancelled) {
        t.preventDefault();
        return;
      }
      const o = this._start;
      if (!(!o || !e)) {
        if (t.preventDefault(), this.node.slate?.frameGestureStart?.("resize"), i === "rot") {
          const r = t.detail?.event, a = yi(r), c = a && this.toWorld(a);
          let l = null;
          if (this._rot && c ? l = $u(this._rot.angle, this._rot.centre, this._rot.grab, c, {
            shift: !!r?.shiftKey,
            coarse: typeof r?.type == "string" && r.type.startsWith("touch")
          }) : Number.isFinite(s) && s && (l = Ki((this.node.options.rotate?.rotationAngle ?? 0) + s)), l === null) return;
          this._didRotate = !0, l !== (this.node.options.rotate?.rotationAngle ?? 0) && this.node.applyInteractionRotation(l), a && this._readout.show(l, a.x, a.y, typeof r?.type == "string" && r.type.startsWith("touch")), this.options.onRotate?.(t);
        } else {
          this._didResize = !0, this.node.backgroundRect.move(e.x, e.y), this.node.resizeTarget?.move(e.x, e.y), this.node.setSize(e.width, e.height);
          const r = this.node.options.width ?? e.width, a = this.node.options.height ?? e.height, c = e.x - o.localX + (r - o.width) / 2, l = e.y - o.localY + (a - o.height) / 2, h = o.angle * Math.PI / 180;
          this.node.options.x = o.x + (o.width - r) / 2 + Math.cos(h) * c - Math.sin(h) * l, this.node.options.y = o.y + (o.height - a) / 2 + Math.sin(h) * c + Math.cos(h) * l, this.node.svgGroup.fire("transform");
        }
        this.syncOverlay(), this.options.onResize?.(t), this.node.slate?.notifyNodeChanged(this.node);
      }
    }), window.addEventListener("mouseup", this.scheduleFinish), window.addEventListener("touchend", this.scheduleFinish), window.addEventListener("touchcancel", this.scheduleFinish);
  }
  finish() {
    if (clearTimeout(this._endTimer), !this._interacting) return;
    this._interacting = !1, window.removeEventListener("keydown", this.onGestureKey, !0), this._start = void 0, this._rot = void 0, this._readout.hide(), typeof document < "u" && (document.documentElement.style.cursor = "");
    const t = this.knobElement();
    t?.getAttribute("data-state") === "active" && (t.removeAttribute("data-state"), t.__paintKnob?.());
    const { id: e, options: s, slate: i } = this.node;
    (this._didRotate || this._didResize) && (this.node.finalizeInteraction(), this._didRotate && i?.announce?.(`Rotated to ${Math.round(Me(s.rotate?.rotationAngle ?? 0))} degrees`), i?.broadcast?.(this._didRotate ? "onNodeRotated" : "onNodeResized", {
      id: e,
      rotate: s.rotate,
      width: s.width,
      height: s.height,
      x: s.x,
      y: s.y,
      ...!this._didRotate && { vectorPath: s.vectorPath }
    })), i?.getSelectedNodes().includes(this.node) && this.node.enableConnectionHandles(), this._didRotate = this._didResize = !1, i?.frameGestureEnd?.("resize");
  }
  removeEventListeners() {
    this.target.off(".resizerotate"), window.removeEventListener("mouseup", this.scheduleFinish), window.removeEventListener("touchend", this.scheduleFinish), window.removeEventListener("touchcancel", this.scheduleFinish), this.finish();
  }
  syncOverlay() {
    this.isActive && this.target.remember("_selectHandler")?.mutationHandler();
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
typeof window < "u" && (window.SVG = ms);
function Vu(n, t) {
  const e = Math.max(1, Number(t) || 1);
  return n === "dashed" ? `${e * 4} ${e * 3}` : n === "dotted" ? `0.1 ${e * 2.5}` : null;
}
class Ba {
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
      const s = e.connectionId || `${this.node.id}->${t.id}`;
      if (this.connections.has(s))
        return console.warn(
          "CONNECTOR_DEBUG: Connection already exists:",
          s
        ), this.connections.get(s);
      if (!this.node.svgGroup.connectable)
        return console.error(
          "CONNECTOR_DEBUG: svg.connectable.js not properly loaded or incompatible with SVG.js 3+"
        ), null;
      const i = e, o = {
        bezier: "curved",
        curved: "curved",
        orthogonal: "orthogonal",
        straight: "straight",
        linear: "straight"
      }, r = i.lineType ? o[i.lineType] || "curved" : this.options.type, a = i.showParentArrow != null ? i.showParentArrow ? this.options.markerSource || "arrow" : "null" : this.options.markerSource, c = i.showChildArrow != null ? i.showChildArrow ? this.options.markerTarget || "arrow" : "null" : this.options.markerTarget, l = this.node.svgGroup.connectable(
        {
          container: this.options.lineContainer,
          markers: this.options.markerContainer,
          type: r,
          color: i.lineColor || this.options.color,
          strokeWidth: i.lineWidth || this.options.strokeWidth,
          sourceAttach: this.options.sourceAttach,
          targetAttach: this.options.targetAttach,
          markerSource: a,
          markerTarget: c,
          showHandles: this.options.showHandles,
          curveRadius: this.options.curveRadius,
          lineCurviness: i.lineCurviness,
          lineCurveType: i.lineCurveType,
          // Edge-pin mode (optional): normalized local anchors {x,y} 0..1
          sourceAnchor: e.sourceAnchor,
          targetAnchor: e.targetAnchor
        },
        t.svgGroup
      );
      if (!l)
        return console.error("CONNECTOR_DEBUG: Failed to create connectable object"), null;
      l.connector?.attr?.({
        rel: `association-${this.node.id}-${t.id}`,
        "data-connection-id": s,
        "data-source-node-id": this.node.id,
        "data-target-node-id": t.id
      });
      const h = (u) => this.slate.governanceOf?.(u)?.capabilities?.canConnect === !1;
      h(this.node) && h(t) && (l.connector?.attr?.({ "pointer-events": "none", "data-governed": "line" }), l.hitArea?.attr?.({ "pointer-events": "none" }), l.hitArea?.node?.style && (l.hitArea.node.style.cursor = ""), l.setHandleVisibility?.(!1));
      const d = {
        id: s,
        source: this.node,
        target: t,
        connectable: l,
        lineColor: e.lineColor || this.options.defaultLineColor,
        lineWidth: e.lineWidth || this.options.defaultLineWidth,
        ...e
      };
      d.lineColor && l.setLineColor && l.setLineColor(d.lineColor), this.applyLineAppearance(l, d), l.labelAt = d.labelPosition, d.label && l.setLabel && l.setLabel(d.label), this.connections.set(s, d);
      try {
        this.slate.markersContainer?.front?.();
      } catch {
      }
      if (l.onEndpointChange = (u) => this.handleEndpointChange(d, u), t.connector) {
        const u = `${t.id}<-${s}`;
        t.connector.connections.set(u, d);
      }
      return console.log("CONNECTOR_DEBUG: Successfully connected", s), l.onLineClick = () => {
        this.node.slate?.isReadOnly?.() || this.showLineCog(d, l, t.id);
      }, this.wireHandleReveal(l), this.options.onConnect?.(d), d;
    } catch (s) {
      return console.error("CONNECTOR_DEBUG: Failed to create connection:", s), console.error(
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
  connectToPoint(t, e, s = {}) {
    this.isActive || this.enable();
    const i = this.options.lineContainer || this.slate.canvas;
    if (!i) return null;
    const o = i.rect(1, 1).move(t.x - 0.5, t.y - 0.5).fill("none").opacity(0);
    o._isPhantomRect = !0;
    const r = { id: e, svgGroup: o, _isFloating: !0 }, a = this.connectTo(r, s);
    return a && (a._phantom = o), a;
  }
  disconnectFrom(t) {
    const e = `${this.node.id}->${t.id}`, s = [...this.connections.entries()].filter(([, o]) => o.source === this.node && o.target?.id === t.id).map(([o]) => o);
    if (s.length === 0) return this.disconnectById(e);
    let i = !1;
    for (const o of s) i = this.disconnectById(o) || i;
    return i;
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
        const s = `${e.target.id}<-${t}`;
        e.target.connector.connections.delete(s);
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
    return this.connections.get(e) || [...this.connections.values()].find((s) => s.source === this.node && s.target?.id === t) || null;
  }
  updateConnection(t, e) {
    try {
      const s = this.connections.get(t);
      if (!s)
        return console.warn(
          "CONNECTOR_DEBUG: Connection not found for update:",
          t
        ), !1;
      Object.assign(s, e);
      const i = s.connectable;
      if (i) {
        if (e.lineColor != null && i.setConnectorColor && i.setConnectorColor(e.lineColor), e.lineWidth != null && i.setStrokeWidth && i.setStrokeWidth(e.lineWidth), this.applyLineAppearance(i, s), e.label != null && i.setLabel && i.setLabel(e.label), "labelPosition" in e && (i.labelAt = e.labelPosition, i.positionLabel && i.positionLabel()), e.lineType != null && i.setType) {
          const o = {
            bezier: "curved",
            curved: "curved",
            orthogonal: "orthogonal",
            straight: "straight",
            linear: "straight"
          };
          i.setType(o[e.lineType] || "curved");
        }
        if (e.lineCurviness != null && (i.lineCurviness = e.lineCurviness), e.lineCurveType != null && (i.lineCurveType = e.lineCurveType, i.update?.()), e.showParentArrow != null || e.showChildArrow != null) {
          const o = e.showParentArrow ?? s.showParentArrow ? "arrow" : "null", r = e.showChildArrow ?? s.showChildArrow ?? !0 ? "arrow" : "null";
          i.setMarker?.(o, r);
        }
        i.update?.();
      }
      return console.log("CONNECTOR_DEBUG: Updated connection", t), !0;
    } catch (s) {
      return console.error("CONNECTOR_DEBUG: Failed to update connection:", s), !1;
    }
  }
  /** Apply v1 line opacity/effect fields to the visible connector path. */
  applyLineAppearance(t, e) {
    const s = t?.connector;
    if (s?.attr && (s.attr(
      "stroke-dasharray",
      Vu(e.lineDash, e.lineWidth || this.options.strokeWidth || 3)
    ), s.attr("stroke-linecap", e.lineDash === "dotted" ? "round" : null), e.lineOpacity != null && s.attr("stroke-opacity", e.lineOpacity), e.lineEffect !== void 0)) {
      const i = {
        dropShadow: "drop-shadow(3px 3px 4px rgba(0,0,0,0.3))",
        postItNote: "drop-shadow(0 4px 2px rgba(0,0,0,0.5))",
        blur: "blur(2px)",
        pencil: "url(#sb-pencil-filter)"
      };
      s.attr("filter", i[e.lineEffect] || null);
    }
  }
  /**
   * Edge-pin mode: pin (or unpin with null) a connection's endpoint to a
   * normalized local anchor {x,y} in 0..1 on the source or target node.
   * A pinned endpoint stays on that point and rotates with the node; null
   * restores auto-flow (nearest-edge). Re-solves immediately.
   */
  setConnectionAnchor(t, e, s) {
    const i = this.getConnection(t);
    return i ? (e === "source" ? i.sourceAnchor = s : i.targetAnchor = s, i.connectable?.setAttachmentAnchor?.(e, s), !0) : !1;
  }
  // ─── A line's ends (see LineEnds.ts) ─────────────────────────────
  /** Whether an end of one of this note's lines follows its note, is pinned to a spot on its edge, or is free. */
  endState(t, e) {
    const s = this.connections.get(t), i = s?.connectable;
    return i ? (e === "source" ? i.source : i.target)?._isPhantomRect || e === "target" && s._phantom ? "free" : (e === "source" ? i.sourceAnchor : i.targetAnchor) ? "pinned" : "follow" : null;
  }
  /**
   * Where an end is on its note now, as an anchor: read from the line as drawn,
   * so pinning an end that follows keeps it exactly where it is. Null for a free end.
   */
  currentAnchor(t, e) {
    const s = this.connections.get(t);
    if (!s || this.endState(t, e) === "free") return null;
    const o = (e === "source" ? s.source : s.target)?.options || {}, r = e === "source" ? s.connectable?.sourceAnchor : s.connectable?.targetAnchor;
    if (r) return { x: r.x, y: r.y };
    try {
      const a = s.connectable?.connector?.node, c = a.getTotalLength(), l = a.getPointAtLength(e === "source" ? 0 : c), h = un(
        { x: o.x || 0, y: o.y || 0, width: o.width || 1, height: o.height || 1, rotation: o.rotate?.rotationAngle || 0 },
        { x: l.x, y: l.y }
      );
      return dn(h);
    } catch {
      return s.connectable?.getCurrentAnchor?.(e) ?? null;
    }
  }
  /**
   * Pin an end where it is now ("pinned"), at a given spot ({x, y}), or let it
   * follow its note ("follow"). Saved on the line, shared and undoable, like
   * every line property. False for a free end or a line this note does not hold.
   */
  setEnd(t, e, s) {
    const i = this.connections.get(t), o = i?.source;
    if (!i || o !== this.node || this.endState(t, e) === "free") return !1;
    const r = s === "follow" ? null : s === "pinned" ? this.currentAnchor(t, e) : dn(s), a = e === "source" ? "sourceAnchor" : "targetAnchor";
    return o.relationships?.applyLineProperty(i.id, a, r), this.slate.broadcast?.("onLinePropertiesChanged", { id: o.id, associationId: i.id, prop: a, val: r }), this.describeHandles(i), this.slate.scheduleSelectionFrame?.(), !0;
  }
  /**
   * An end was dropped (the vendored lib has already moved the VIEW). The model
   * follows: on another note the end moves there, pinned to the spot when dropped
   * near the note's edge and following the note when dropped on its middle; on
   * empty canvas the end stays where it was let go, free. A line whose starting
   * end is let go belongs to the note at its far end from then on (drawn the same
   * way). The line keeps its id. Deferred a tick so the lib's dragend finishes
   * before the connection is drawn again.
   */
  handleEndpointChange(t, e) {
    const { which: s, targetNodeId: i, isPhantom: o, point: r } = e;
    setTimeout(() => {
      try {
        this.applyEndDrop(t, s, o ? null : i, r);
      } catch (a) {
        console.warn("CONNECTOR_DEBUG: endpoint change → model failed:", a);
      }
    }, 0);
  }
  applyEndDrop(t, e, s, i) {
    const o = this.slate, r = t.source, a = r?.relationships, c = a?.getAssociations?.().find((x) => x.id === t.id);
    if (!a || !c) return;
    const l = c.id, h = s ? o.nodes?.one?.(s) : null, d = () => {
      a.redraw?.(l), this.reselect(r.id, l);
    }, u = (x) => {
      if (!i) return null;
      const C = x.options || {}, v = un(
        { x: C.x || 0, y: C.y || 0, width: C.width || 1, height: C.height || 1, rotation: C.rotate?.rotationAngle || 0 },
        i
      );
      return ys(v.x, v.y);
    };
    if (h && (o.capabilitiesOf?.(h)?.canConnect === !1 || !h.relationships)) return d();
    const f = !!c.targetPoint, { parent: p, child: m, ...g } = c;
    if (e === "target") {
      if (!h)
        return i ? (a.removeAssociation(l), a.addFloatingAssociation(
          { x: Math.round(i.x * 100) / 100, y: Math.round(i.y * 100) / 100 },
          { ...g, childId: f ? c.childId : void 0, targetAnchor: null }
        ), this.reselect(r.id, l)) : d();
      if (h.id === r.id) return d();
      const x = u(h);
      if (!f && h.id === c.childId)
        return a.applyLineProperty(l, "targetAnchor", x), o.broadcast?.("onLinePropertiesChanged", { id: r.id, associationId: l, prop: "targetAnchor", val: x }), d();
      const { targetPoint: C, ...v } = g;
      return a.removeAssociation(l), a.addAssociation(h, { ...v, childId: h.id, targetAnchor: x }), this.reselect(r.id, l);
    }
    if (!h) {
      if (!i || f) return d();
      const x = o.nodes?.one?.(c.childId);
      return x?.relationships ? (a.removeAssociation(l), x.relationships.addFloatingAssociation(
        { x: Math.round(i.x * 100) / 100, y: Math.round(i.y * 100) / 100 },
        { ...Sa(g), parentId: x.id, childId: void 0 }
      ), this.reselect(x.id, l)) : d();
    }
    if (!f && h.id === c.childId) return d();
    const y = u(h);
    if (h.id === r.id)
      return a.applyLineProperty(l, "sourceAnchor", y), o.broadcast?.("onLinePropertiesChanged", { id: r.id, associationId: l, prop: "sourceAnchor", val: y }), d();
    a.removeAssociation(l);
    const b = { ...g, parentId: h.id, sourceAnchor: y };
    if (f) h.relationships.addFloatingAssociation(c.targetPoint, b);
    else {
      const x = o.nodes?.one?.(c.childId);
      if (!x) return;
      h.relationships.addAssociation(x, b);
    }
    this.reselect(h.id, l);
  }
  /** Select a line again once it has been drawn anew (after its end moved). */
  reselect(t, e) {
    setTimeout(() => this.slate.selectLine?.(t, e), 0);
  }
  /** Select one of this note's lines, as clicking it does. */
  selectConnection(t) {
    const e = this.connections.get(t);
    return !e || e.source !== this.node ? !1 : (this.showLineCog(e, e.connectable, e.target?.id), !0);
  }
  /**
   * Name each end handle of a selected line for what it is and does (a button
   * in the tab order, with a tooltip), and handle its keys: Enter or Space pins
   * an end where it is or lets it follow again; the arrow keys slide a pinned
   * end round its note's edge; Delete removes the line; Escape leaves it.
   */
  describeHandles(t, e = !0) {
    const s = t.connectable, i = (o) => {
      const r = String(o?.options?.text ?? "").replace(/\s+/g, " ").trim();
      return r ? `“${r.length > 40 ? r.slice(0, 39) + "…" : r}”` : "its note";
    };
    for (const o of ["source", "target"]) {
      const a = (o === "source" ? s?.sourceHandle : s?.targetHandle)?.element?.node;
      if (!a) continue;
      const c = this.endState(t.id, o), l = o === "source" ? "Start of the line" : "End of the line", h = i(o === "source" ? t.source : t.target), d = c === "free" ? `${l}: free, on no note` : c === "pinned" ? `${l}: pinned to a spot on ${h}` : `${l}: follows ${h}`, u = c === "free" ? "Drag it onto a note to attach it there." : c === "pinned" ? "Arrow keys move it along the edge; Enter lets it follow the note again. Drag it onto a note's middle to follow, onto empty canvas to leave it free." : "Enter pins it where it is; the arrow keys pin it and move it along the edge. Drag it onto a note's edge to pin it there, or onto empty canvas to leave it free.";
      a.setAttribute("role", "button"), a.setAttribute("tabindex", e ? "0" : "-1"), a.setAttribute("aria-label", d);
      let f = a.querySelector("title");
      f || (f = document.createElementNS("http://www.w3.org/2000/svg", "title"), a.appendChild(f)), f.textContent = `${d}. ${u}`, !a._sbEndKeys && (a._sbEndKeys = !0, a.addEventListener("keydown", (p) => {
        const m = o, g = this.connections.get(t.id);
        if (!g) return;
        const y = p.key, b = this.endState(g.id, m);
        if (y === "Enter" || y === " ") {
          if (b === "free") return;
          this.setEnd(g.id, m, b === "pinned" ? "follow" : "pinned");
        } else if (y.startsWith("Arrow")) {
          if (b === "free") return;
          const x = this.currentAnchor(g.id, m);
          if (!x) return;
          this.setEnd(g.id, m, du(x, y, p.shiftKey ? mi / 5 : mi));
        } else if (y === "Delete" || y === "Backspace")
          this.slate.removeSelectedLine?.();
        else if (y === "Escape")
          this.slate.clearLineCog?.(), a.blur?.();
        else
          return;
        p.preventDefault(), p.stopPropagation();
      }));
    }
  }
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
      (r) => r && r.node
    ), s = () => [t.sourceHandle?.glyph, t.targetHandle?.glyph].filter((r) => r && r.node), i = (r) => {
      [...e(), ...s()].forEach((a) => {
        r ? a.node.classList.add("connector-handle--revealed") : !t._handlesPinned && !t._handlesDragging && a.node.classList.remove("connector-handle--revealed");
      });
    };
    t._revealHandles = i;
    const o = () => e().forEach((r) => {
      r._revealArmed || (r._revealArmed = !0, r.on?.("mouseenter", () => i(!0)), r.on?.("mouseleave", () => i(!1)), r.on?.("dragstart", () => {
        t._handlesDragging = !0, i(!0);
      }), r.on?.("dragend", () => {
        t._handlesDragging = !1, t._handlesPinned || i(!1);
      }));
    });
    [t.hitArea, t.connector].forEach((r) => {
      r?.on?.("mouseenter", () => {
        i(!0), o();
      }), r?.on?.("mouseleave", () => i(!1));
    });
  }
  showLineCog(t, e, s) {
    const i = this.slate;
    i.clearLineCog?.();
    const o = e?.connector;
    let r, a;
    try {
      const x = o.bbox();
      r = x.cx, a = x.cy;
    } catch {
      return;
    }
    const c = i.markersContainer || i.canvas;
    if (!c) return;
    if (i.hostDrawsToolbar?.()) {
      this.selectLineConnectable(e), i.setSelectedLine?.(this.node, t.id, s, e), this.describeHandles(t);
      return;
    }
    const l = 15, h = 6, d = "#5b6472", u = [
      {
        key: "delete",
        color: "#e5484d",
        onClick: () => {
          this.node.relationships?.removeAssociation?.(s), i.clearLineCog?.();
        }
      }
    ];
    typeof i.options?.events?.onLineMenuRequested == "function" && u.push({
      key: "cog",
      color: d,
      onClick: () => this.openLinePane(t, e, s)
    });
    const f = u.length, p = l * 2 + h, m = f * (l * 2) + (f - 1) * h, g = r - m / 2 + l, y = c.group().addClass("line-cog").addClass("line-toolbar");
    y.rect(m + 14, l * 2 + 10).radius((l * 2 + 10) / 2).center(r, a).fill("#ffffff").stroke({ color: "#e3e5ea", width: 1 });
    const b = this.node.constructor;
    u.forEach((x, C) => {
      const v = g + C * p, w = y.group().addClass(`line-tool-${x.key}`);
      w.circle(l * 2).center(v, a).fill("#ffffff").attr("fill-opacity", 1e-3), b.drawToolIcon?.(w, x.key, v, a, x.color), w.attr("pointer-events", "all");
      try {
        w.node.style.cursor = "pointer";
      } catch {
      }
      w.on("mousedown", (_) => _.stopPropagation?.()), w.on("click", (_) => {
        _.stopPropagation?.(), x.onClick();
      });
    }), y.attr("pointer-events", "all"), i._activeLineCog = y, this.selectLineConnectable(e), i.setSelectedLine?.(this.node, t.id, s, e), this.describeHandles(t);
  }
  /**
   * Select the connector so its endpoint handles show — this is what makes the
   * endpoints draggable (L1 snap-anywhere). Tracked on the slate so
   * clearLineCog() (canvas click / node select) deselects it — no stuck state.
   */
  selectLineConnectable(t) {
    const e = this.slate;
    try {
      t.selectConnector?.(), e._activeLineConnectable = t, t._handlesPinned = !0, t._revealHandles?.(!0);
    } catch {
    }
    try {
      e.markersContainer?.front?.();
    } catch {
    }
  }
  openLinePane(t, e, s) {
    const i = this.node.slate?.options?.events;
    if (!i?.onLineMenuRequested) return;
    const o = this.node.relationships, r = o?.associations?.find((a) => a.childId === s) ?? o?.getAssociation?.(s) ?? t;
    i.onLineMenuRequested(this.node, r, (a = {}) => {
      if (r?.id && this.node.relationships)
        for (const [c, l] of Object.entries(a))
          this.node.relationships.applyLineProperty(
            r.id,
            c,
            l
          );
    });
  }
  isEnabled() {
    return this.isActive;
  }
  updateOptions(t) {
    this.options = { ...this.options, ...t }, console.log("CONNECTOR_DEBUG: Updated options for node", this.node.id);
  }
}
function bi(n, t, e) {
  return {
    id: `${n}->${t}`,
    parentId: n,
    childId: t,
    lineColor: "#666666",
    lineOpacity: 1,
    lineEffect: "",
    lineType: "bezier",
    lineCurveType: "cubic",
    lineCurviness: 0.1,
    lineWidth: 3,
    isStraightLine: !1,
    showParentArrow: !1,
    showChildArrow: !0,
    ...e
  };
}
const Ku = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createDefaultAssociation: bi
}, Symbol.toStringTag, { value: "Module" }));
class Ga {
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
    const s = bi(this.node.id, t.id, e), i = this.node.slate;
    return i?.capabilitiesOf?.(this.node).canConnect === !1 || i?.capabilitiesOf?.(t).canConnect === !1 || (e?.id || (s.id = this.unusedId(s.id)), this.assocMap.set(s.id, s), this.renderAssociation(s, t), this.node.slate?.broadcast?.("addRelationship", { ...s }), console.log(
      "RELATIONSHIP_DEBUG: Added association",
      s.id,
      "from",
      this.node.id,
      "to",
      t.id
    )), s;
  }
  /**
   * Remove a specific association by child node ID.
   */
  removeAssociation(t) {
    const e = this.assocMap.get(t), s = e ? [e] : Array.from(this.assocMap.values()).filter(
      (i) => i.childId === t
    );
    if (s.length === 0)
      return console.warn(
        "RELATIONSHIP_DEBUG: Association not found:",
        t
      ), !1;
    for (const i of s)
      this.node.connector && this.node.connector.disconnectById(i.id), this.assocMap.delete(i.id), console.log("RELATIONSHIP_DEBUG: Removed association", i.id), this.node.slate?.broadcast?.("removeRelationship", {
        parentId: this.node.id,
        childId: i.childId,
        id: i.id
      });
    return !0;
  }
  /**
   * Remove all associations from this node.
   */
  removeAll() {
    const t = Array.from(this.assocMap.keys());
    for (const e of t)
      this.removeAssociation(e);
  }
  /**
   * Apply a single line property (from the line-properties pane) to one
   * association: update the stored record (so it serializes/persists) AND
   * re-render the connector. Used by the onLinePropertiesChanged apply path
   * (local invoke + remote collab), which is why line edits now sync + persist.
   */
  applyLineProperty(t, e, s) {
    let i = this.assocMap.get(t);
    if (!i) {
      for (const r of this.assocMap.values())
        if (r.id === t) {
          i = r;
          break;
        }
    }
    if (!i) return !1;
    const o = i.id;
    if (i[e] = s, e === "sourceAnchor" || e === "targetAnchor") {
      const r = e === "sourceAnchor" ? "source" : "target";
      this.node.connector?.getConnections?.().find((c) => c.id === o)?.connectable?.setAttachmentAnchor?.(r, s);
    } else
      this.node.connector?.updateConnection(o, { [e]: s });
    return !0;
  }
  /**
   * Update all associations with new options (e.g., line color change).
   */
  updateAssociationsWith(t) {
    for (const [e, s] of this.assocMap)
      Object.assign(s, t), this.node.connector && this.node.connector.updateConnection(s.id, {
        lineColor: s.lineColor,
        lineWidth: s.lineWidth,
        lineOpacity: s.lineOpacity,
        lineEffect: s.lineEffect,
        lineDash: s.lineDash
      });
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
        const i = `${this.node.id}->${e.childId}`;
        this.node.connector.updateConnection(i, {
          lineColor: e.lineColor,
          lineWidth: e.lineWidth,
          lineOpacity: e.lineOpacity,
          lineEffect: e.lineEffect,
          lineDash: e.lineDash
        });
      }
  }
  // ─── Query methods ───────────────────────────────────────────────
  /** Get all associations where this node is the parent */
  getAssociations() {
    return Array.from(this.assocMap.values());
  }
  /** Get a specific association by child ID (the canonical edge to that child) */
  getAssociation(t) {
    return this.assocMap.get(`${this.node.id}->${t}`);
  }
  /** True if an association with this exact id exists (parallel-edge aware). */
  hasAssociationId(t) {
    return this.assocMap.has(t);
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
  /**
   * `id`, or `id~N` when a line on the slate already has it. Ids are unique across
   * the slate, not only on this note: a line keeps its id when its starting end moves
   * to another note, so `A->B` may be held by B while A connects to B again.
   */
  unusedId(t) {
    const e = this.slate?.nodes?.allNodes || [], s = (o) => this.assocMap.has(o) || e.some((r) => r && r !== this.node && r.relationships !== this && r.relationships?.hasAssociationId?.(o));
    if (!s(t)) return t;
    let i = 2;
    for (; s(`${t}~${i}`); ) i++;
    return `${t}~${i}`;
  }
  renderAssociation(t, e) {
    if (!this.node.connector) return;
    this.node.connector.isEnabled() || this.node.connector.enable();
    const s = {
      // Drive the connection identity from the association id so parallel edges
      // (`parent->child~N`) render as separate connections instead of colliding
      // on the pair-based key.
      connectionId: t.id,
      lineColor: t.lineColor,
      lineWidth: t.lineWidth,
      lineOpacity: t.lineOpacity,
      lineEffect: t.lineEffect,
      lineDash: t.lineDash,
      lineType: t.lineType,
      lineCurviness: t.lineCurviness,
      lineCurveType: t.lineCurveType,
      showParentArrow: t.showParentArrow,
      showChildArrow: t.showChildArrow,
      sourceAnchor: t.sourceAnchor,
      targetAnchor: t.targetAnchor,
      label: t.label,
      labelPosition: t.labelPosition
    };
    if (t.targetPoint) {
      this.node.connector.connectToPoint(
        t.targetPoint,
        t.childId,
        s
      );
      return;
    }
    e && this.node.connector.connectTo(e, s);
  }
  /**
   * Draw one of this note's lines again from its record (no change to the
   * model, nothing sent): puts back a line whose end was dropped somewhere it
   * cannot go, and redraws one whose end was re-pinned on its own note.
   */
  redraw(t) {
    const e = this.assocMap.get(t);
    return !e || !this.node.connector ? !1 : (this.node.connector.disconnectById(e.id), this.renderAssociation(e, e.targetPoint ? null : this.slate.nodes.one(e.childId)), !0);
  }
  /**
   * Add a free-floating association whose target is a bare world point rather
   * than a node (L1b). Backed by a phantom endpoint; broadcasts + persists like
   * a normal association (targetPoint travels in the record).
   */
  addFloatingAssociation(t, e) {
    const s = e?.childId || `__free_${Math.random().toString(36).slice(2, 10)}`, i = bi(this.node.id, s, {
      ...e,
      parentId: this.node.id,
      childId: s,
      targetPoint: t,
      // A free end is on no note, so it is not pinned to one.
      targetAnchor: null
    });
    return e?.id || (i.id = this.unusedId(i.id)), this.assocMap.set(i.id, i), this.renderAssociation(i, null), this.node.slate?.broadcast?.("addRelationship", { ...i }), i;
  }
}
class $a {
  constructor(t) {
    this.patternElement = null, this.imageUrl = "", this.origWidth = 0, this.origHeight = 0, this.preserveAspectRatio = !0, this.node = t;
  }
  /**
   * Set an image fill on the node's background.
   *
   * Uses SVG pattern fills for proper scaling within the shape.
   */
  set(t, e, s, i = !0) {
    this.imageUrl = t, this.origWidth = e || this.node.options.width || 100, this.origHeight = s || this.node.options.height || 60, this.preserveAspectRatio = this.node.options.imageFit === "cover" ? !1 : i, this.node.options.image = t, this.node.options.imageOrigWidth = this.origWidth, this.node.options.imageOrigHeight = this.origHeight, this.render();
  }
  /**
   * Clear the image fill and restore the background color.
   */
  clear() {
    this.patternElement && (this.patternElement.remove(), this.patternElement = null), this.imageUrl = "", this.node.options.image = void 0;
    const t = this.node.contentPath ?? this.node.backgroundRect;
    t && t.fill(this.node.options.backgroundColor || "#f0f0f0");
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
    const t = this.node.contentPath ?? this.node.backgroundRect;
    if (!(!this.imageUrl || !t))
      try {
        this.patternElement && this.patternElement.remove();
        const e = this.origWidth || this.node.options.width || 100, s = this.origHeight || this.node.options.height || 60, i = this.node.svgGroup.root();
        if (!i) return;
        let o = i.defs();
        this.patternElement = o.pattern(e, s, (r) => {
          r.image(this.imageUrl).size(e, s).attr("preserveAspectRatio", this.preserveAspectRatio ? "xMidYMid meet" : "xMidYMid slice");
        }).attr("patternUnits", "objectBoundingBox").attr("viewBox", `0 0 ${e} ${s}`).attr("preserveAspectRatio", this.preserveAspectRatio ? "xMidYMid meet" : "xMidYMid slice").attr("width", "100%").attr("height", "100%"), t.fill(this.patternElement), console.log(
          "IMAGES_DEBUG: Set image fill for",
          this.node.id,
          "url:",
          this.imageUrl
        );
      } catch (e) {
        console.error("IMAGES_DEBUG: Failed to set image:", e);
      }
  }
}
const Ju = 10, Ds = (n) => {
  const t = n?.options || {};
  return { x: t.x || 0, y: t.y || 0, width: t.width || 1, height: t.height || 1, rotation: t.rotate?.rotationAngle || 0 };
};
function zo(n, t, e, s) {
  const o = document.elementFromPoint(t, e)?.closest?.("[data-node-id]")?.getAttribute("data-node-id");
  if (o) return n.nodes?.one?.(o) ?? null;
  for (const r of n.nodes?.allNodes || []) {
    if (!r || r.id === s) continue;
    const a = n.element?.querySelector?.(`[data-node-id="${CSS.escape(r.id)}"]`)?.getBoundingClientRect?.();
    if (a && t >= a.left && t <= a.right && e >= a.top && e <= a.bottom) return r;
  }
  return null;
}
function Qu(n, t) {
  n._lineTool?.cancel?.();
  const e = n.canvas;
  if (!e || !t?.relationships || n.isReadOnly?.() || n.isCommentOnly?.() || t.options?.isLocked || n.capabilitiesOf?.(t)?.canConnect === !1)
    return Promise.resolve({ result: "cancelled" });
  const s = n.markersContainer || e, i = s.path("M 0 0").fill("none").stroke({ color: "#1f6feb", width: 2.5, dasharray: "7,5", linecap: "round" }).addClass("line-tool-preview").attr("pointer-events", "none"), o = s.group().addClass("line-tool-tip").attr("pointer-events", "none");
  o.circle(20).center(0, 0).fill("#ffffff").attr("fill-opacity", 0.9), o.polygon("0,-8 8,0 0,8 -8,0").fill("#ffffff").stroke({ color: "#1f6feb", width: 2.5, linejoin: "round" }), o.hide();
  try {
    n.markersContainer?.front?.();
  } catch {
  }
  const r = n.element ?? e.node?.parentElement ?? null;
  r?.setAttribute?.("data-line-tool", "on");
  let a = null;
  const c = (l) => {
    if (a !== l) {
      try {
        a?.backgroundRect?.attr?.({ "stroke-dasharray": null });
      } catch {
      }
      a = l;
      try {
        l?.backgroundRect?.attr?.({ "stroke-dasharray": "8,4" });
      } catch {
      }
    }
  };
  return new Promise((l) => {
    let h = !1;
    const d = ["mousedown", "mouseup", "click", "pointerup", "touchstart", "touchend"];
    let u = !1, f = null;
    const p = () => {
      u = !1, f && clearTimeout(f), f = null, d.forEach((E) => window.removeEventListener(E, b, !0));
    }, m = (E) => {
      if (!h) {
        h = !0, c(null), window.removeEventListener("pointermove", C, !0), window.removeEventListener("pointerdown", T, !0), window.removeEventListener("pointerup", A, !0), window.removeEventListener("pointercancel", M, !0), window.removeEventListener("keydown", R, !0);
        try {
          i.remove(), o.remove();
        } catch {
        }
        r?.removeAttribute?.("data-line-tool"), n._lineTool === P && (n._lineTool = null), u || p(), l(E);
        try {
          E.associationId && E.nodeId && n.selectLine?.(E.nodeId, E.associationId), n.options?.events?.onLineToolChanged?.(!1);
        } catch (k) {
          console.warn("LINE_TOOL: after drawing", k);
        }
      }
    }, g = e.root?.()?.node ?? e.node ?? null, y = (E) => {
      const k = E.target;
      return !k || typeof k.nodeType != "number" ? !1 : !!g?.contains(k) || !!r?.contains(k);
    }, b = (E) => {
      u && (y(E) && (E.preventDefault(), E.stopPropagation(), E.stopImmediatePropagation?.()), E.type === "click" ? p() : (E.type === "pointerup" || E.type === "mouseup" || E.type === "touchend") && (f && clearTimeout(f), f = setTimeout(p, 350)));
    }, x = () => !n._destroyed && !t._removed && n.nodes?.one?.(t.id) === t, C = (E) => {
      if (!x()) return m({ result: "cancelled" });
      if (w && E.pointerId === w.id && Math.hypot(E.clientX - w.x, E.clientY - w.y) > Ju && (w = null), !y(E)) return;
      const k = e.point(E.clientX, E.clientY), O = zo(n, E.clientX, E.clientY, t.id), L = O && O.id !== t.id && n.capabilitiesOf?.(O)?.canConnect !== !1 ? O : null;
      c(L);
      const z = xa(Ds(t), _a(Ds(t), k));
      i.plot(`M ${z.x} ${z.y} L ${k.x} ${k.y}`), L ? o.hide() : o.show().attr("transform", `translate(${k.x},${k.y})`);
    }, v = /* @__PURE__ */ new Set();
    let w = null;
    const _ = (E) => E.pointerType === "touch" || E.pointerType === "pen", S = (E) => {
      try {
        if (!x()) return m({ result: "cancelled" });
        N(E);
      } catch (k) {
        console.warn("LINE_TOOL: press failed", k), m({ result: "cancelled" });
      }
    }, T = (E) => {
      if (!_(E)) return S(E);
      y(E) && (E.isPrimary && v.clear(), v.add(E.pointerId), w = v.size === 1 ? { id: E.pointerId, x: E.clientX, y: E.clientY } : null);
    }, A = (E) => {
      _(E) && (v.delete(E.pointerId), !(!w || w.id !== E.pointerId) && (w = null, S(E)));
    }, M = (E) => {
      v.delete(E.pointerId), w?.id === E.pointerId && (w = null);
    }, N = (E) => {
      if (!y(E) || E.button !== void 0 && E.button !== 0 && E.pointerType === "mouse") return;
      E.preventDefault(), E.stopPropagation(), E.stopImmediatePropagation(), u = !0, d.forEach((z) => window.addEventListener(z, b, !0));
      const k = e.point(E.clientX, E.clientY), O = zo(n, E.clientX, E.clientY, t.id);
      if (O && O.id === t.id) return m({ result: "cancelled" });
      if (O) {
        if (n.capabilitiesOf?.(O)?.canConnect === !1) return;
        const z = un(Ds(O), k), W = ys(z.x, z.y), X = t.relationships.addAssociation(O, W ? { targetAnchor: W } : void 0), Z = t.relationships.hasAssociationId?.(X?.id);
        return m(Z ? { result: "connected", associationId: X.id, nodeId: t.id } : { result: "cancelled" });
      }
      const L = t.relationships.addFloatingAssociation({ x: Math.round(k.x), y: Math.round(k.y) });
      m({ result: "free", associationId: L.id, nodeId: t.id });
    }, R = (E) => {
      E.key === "Escape" && (E.preventDefault(), E.stopPropagation(), m({ result: "cancelled" }));
    }, P = { nodeId: t.id, cancel: () => m({ result: "cancelled" }) };
    n._lineTool = P, window.addEventListener("pointermove", C, !0), window.addEventListener("pointerdown", T, !0), window.addEventListener("pointerup", A, !0), window.addEventListener("pointercancel", M, !0), window.addEventListener("keydown", R, !0), n.options?.events?.onLineToolChanged?.(!0);
  });
}
const en = 2 * Math.PI;
function gt(n, t) {
  return { x: n, y: t };
}
function Bt(n, t, e) {
  return gt(n.x + (t.x - n.x) * e, n.y + (t.y - n.y) * e);
}
function nn(n, t, e, s) {
  return { kind: "cubic", start: n, first: t, second: e, end: s };
}
function Ze(n, t) {
  return nn(n, n, t, t);
}
function tf(n, t, e, s, i, o, r) {
  if (e = Math.abs(e), s = Math.abs(s), !e || !s || n.x === t.x && n.y === t.y) return Ze(n, t);
  const a = i * Math.PI / 180, c = Math.cos(a), l = Math.sin(a), h = (n.x - t.x) / 2, d = (n.y - t.y) / 2;
  let u = (c * h + l * d) / e, f = (-l * h + c * d) / s;
  const p = Math.max(1, Math.hypot(u, f));
  e *= p, s *= p, u /= p, f /= p;
  const m = u * u + f * f, g = (o === r ? -1 : 1) * Math.sqrt(Math.max(0, (1 - m) / m)), y = g * f, b = -g * u, x = gt(e * c, e * l), C = gt(-s * l, s * c), v = gt(
    (n.x + t.x) / 2 + y * x.x + b * C.x,
    (n.y + t.y) / 2 + y * x.y + b * C.y
  ), w = Math.atan2(f - b, u - y);
  let _ = Math.atan2(-f - b, -u - y) - w;
  return r && _ < 0 && (_ += en), !r && _ > 0 && (_ -= en), { kind: "arc", start: n, end: t, center: v, axisX: x, axisY: C, angle: w, sweep: _ };
}
function Ha(n) {
  const t = [];
  let e = gt(0, 0), s = e, i, o;
  for (const r of new se(n)) {
    const a = r[0], c = r.slice(1), l = (u) => gt(c[u], c[u + 1]);
    let h, d;
    switch (a) {
      case "M":
        s = l(0), h = { kind: "move", end: s };
        break;
      case "H":
        h = Ze(e, gt(c[0], e.y));
        break;
      case "V":
        h = Ze(e, gt(e.x, c[0]));
        break;
      case "L":
        h = Ze(e, l(0));
        break;
      case "Z":
        h = Ze(e, s);
        break;
      case "C":
        h = nn(e, l(0), l(2), l(4));
        break;
      case "S":
        h = nn(e, i ? Bt(i, e, 2) : e, l(0), l(2));
        break;
      case "Q":
      case "T": {
        const u = l(a === "Q" ? 2 : 0);
        d = a === "Q" ? l(0) : o ? Bt(o, e, 2) : e, h = nn(e, Bt(e, d, 2 / 3), Bt(u, d, 2 / 3), u);
        break;
      }
      case "A":
        h = tf(e, l(5), c[0], c[1], c[2], c[3], c[4]);
        break;
      default:
        continue;
    }
    t.push(h), i = a === "C" || a === "S" ? h.second : void 0, o = d, e = h.end;
  }
  return t;
}
function Fa(n, t) {
  return gt(
    n.center.x + n.axisX.x * Math.cos(t) + n.axisY.x * Math.sin(t),
    n.center.y + n.axisX.y * Math.cos(t) + n.axisY.y * Math.sin(t)
  );
}
function Bo(n, t) {
  return gt(
    -n.axisX.x * Math.sin(t) + n.axisY.x * Math.cos(t),
    -n.axisX.y * Math.sin(t) + n.axisY.y * Math.cos(t)
  );
}
function ef(n, t, e, s) {
  const i = -n + 3 * t - 3 * e + s, o = 2 * (n - 2 * t + e), r = t - n;
  if (Math.abs(i) < Number.EPSILON * Math.max(1, Math.abs(o), Math.abs(r))) return o ? [-r / o] : [];
  const a = o * o - 4 * i * r;
  if (a < 0) return [];
  const c = Math.sqrt(a);
  return [(-o - c) / (2 * i), (-o + c) / (2 * i)];
}
function nf(n, t) {
  const e = Bt(n.start, n.first, t), s = Bt(n.first, n.second, t), i = Bt(n.second, n.end, t);
  return Bt(Bt(e, s, t), Bt(s, i, t), t);
}
function Ua(n) {
  let t = 1 / 0, e = 1 / 0, s = -1 / 0, i = -1 / 0;
  function o(r) {
    t = Math.min(t, r.x), s = Math.max(s, r.x), e = Math.min(e, r.y), i = Math.max(i, r.y);
  }
  n.length || o(gt(0, 0));
  for (const r of n)
    if (o(r.end), r.kind !== "move") {
      o(r.start);
      for (const a of ["x", "y"])
        if (r.kind === "cubic")
          for (const c of ef(r.start[a], r.first[a], r.second[a], r.end[a]))
            c > 0 && c < 1 && o(nf(r, c));
        else {
          const c = Math.atan2(r.axisY[a], r.axisX[a]);
          for (const l of [c, c + Math.PI])
            (Math.sign(r.sweep) * (l - r.angle) % en + en) % en <= Math.abs(r.sweep) && o(Fa(r, l));
        }
    }
  return { x: t, y: e, x2: s, y2: i, width: s - t, height: i - e, cx: (t + s) / 2, cy: (e + i) / 2 };
}
function vs(n) {
  return Ua(Ha(n));
}
function sf(n, t) {
  const e = new B();
  for (const [, s, i] of n.matchAll(/([trsm])([^trsm]*)/gi)) {
    const o = (i.match(/[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/gi) || []).map(Number), [r, a, c, l, h, d] = o;
    let u = new B();
    switch (s.toLowerCase()) {
      case "t":
        o.length === 2 && (u = u.translate(r, a));
        break;
      case "m":
        o.length === 6 && (u = new B(r, a, c, l, h, d));
        break;
      case "r":
        o.length === 1 && (u = u.rotate(r, t.x, t.y)), o.length === 3 && (u = u.rotate(r, a, c));
        break;
      case "s":
        (o.length === 1 || o.length === 2) && (u = u.scale(r, a ?? r, t.x, t.y)), o.length === 3 && (u = u.scale(r, r, a, c)), o.length === 4 && (u = u.scale(r, a, c, l));
        break;
    }
    e.multiplyO(u);
  }
  return e;
}
function of(n) {
  const t = Math.max(1, Math.ceil(Math.abs(n.sweep) / (Math.PI / 4))), e = n.sweep / t, s = 4 / 3 * Math.tan(e / 4);
  let i = n.start;
  return Array.from({ length: t }, (o, r) => {
    const a = n.angle + r * e, c = a + e, l = r === t - 1 ? n.end : Fa(n, c), h = Bo(n, a), d = Bo(n, c), u = nn(
      i,
      gt(i.x + s * h.x, i.y + s * h.y),
      gt(l.x - s * d.x, l.y - s * d.y),
      l
    );
    return i = l, u;
  });
}
function Ji(n, t) {
  const e = Ha(n), s = Ua(e), i = sf(t, gt(s.cx, s.cy)), o = (r) => new st(r.x, r.y).transform(i).toArray().join(",");
  return e.map((r) => r.kind === "move" ? "M" + o(r.end) : (r.kind === "arc" ? of(r) : [r]).map((c) => "C" + [c.first, c.second, c.end].map(o).join(",")).join("")).join("");
}
const ht = /* @__PURE__ */ new Map();
ht.set("rectangle", {
  path: "M 0 0 H 100 V 60 H 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
ht.set("roundedrectangle", {
  path: "M 10 0 H 90 Q 100 0 100 10 V 50 Q 100 60 90 60 H 10 Q 0 60 0 50 V 10 Q 0 0 10 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  hasRounding: !0,
  viewBox: "0 0 100 60"
});
ht.set("ellipse", {
  path: "M 50 0 A 50 30 0 1 1 50 60 A 50 30 0 1 1 50 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
ht.set("circle", {
  path: "M 50 0 A 50 50 0 1 1 50 100 A 50 50 0 1 1 50 0 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
ht.set("star", {
  path: "M 50 0 L 61.8 38.2 L 100 38.2 L 69.1 61.8 L 80.9 100 L 50 76.4 L 19.1 100 L 30.9 61.8 L 0 38.2 L 38.2 38.2 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
ht.set("triangle", {
  path: "M 50 0 L 100 87 L 0 87 Z",
  defaultWidth: 100,
  defaultHeight: 87,
  viewBox: "0 0 100 87"
});
ht.set("pentagon", {
  path: "M 50 0 L 97.6 34.5 L 79.4 90.5 L 20.6 90.5 L 2.4 34.5 Z",
  defaultWidth: 100,
  defaultHeight: 95,
  viewBox: "0 0 100 95"
});
ht.set("hexagon", {
  path: "M 25 0 L 75 0 L 100 43.3 L 75 86.6 L 25 86.6 L 0 43.3 Z",
  defaultWidth: 100,
  defaultHeight: 87,
  viewBox: "0 0 100 87"
});
ht.set("octagon", {
  path: "M 29.3 0 L 70.7 0 L 100 29.3 L 100 70.7 L 70.7 100 L 29.3 100 L 0 70.7 L 0 29.3 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
ht.set("trapezium", {
  path: "M 20 0 L 80 0 L 100 60 L 0 60 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
ht.set("parallelogram", {
  path: "M 20 0 L 100 0 L 80 60 L 0 60 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
ht.set("rarrow", {
  path: "M 0 15 L 70 15 L 70 0 L 100 30 L 70 60 L 70 45 L 0 45 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
ht.set("larrow", {
  path: "M 100 15 L 30 15 L 30 0 L 0 30 L 30 60 L 30 45 L 100 45 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
ht.set("diamond", {
  path: "M 50 0 L 100 50 L 50 100 L 0 50 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
ht.set("stickynote", {
  path: "M1 1l18 0.1l-0.1 17.8s-15.5 0.4-17.6-1c-0.4-2.1-0.3-16.9-0.3-16.9z",
  defaultWidth: 108,
  defaultHeight: 108,
  viewBox: "1 1 18 18"
});
function vi(n) {
  return ht.get(n.toLowerCase());
}
function rf(n) {
  return ht.has(n.toLowerCase());
}
function af(n, t) {
  ht.set(n.toLowerCase(), t);
}
function ja() {
  return Array.from(ht.keys());
}
function cf(n) {
  return ["rectangle", "circle", "ellipse"].includes(n.toLowerCase());
}
function Qn(n, t) {
  if (t) {
    const e = vi(t);
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
    const e = vi(n);
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
const lf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getShape: vi,
  getShapeNames: ja,
  hasShape: rf,
  isNativeShape: cf,
  registerShape: af,
  resolveShapePath: Qn
}, Symbol.toStringTag, { value: "Module" }));
class Ya {
  constructor(t, e = {}) {
    this.container = null, this.miniCanvas = null, this.viewportIndicator = null, this.nodeLayer = null, this.nodeShapes = /* @__PURE__ */ new Map(), this._enabled = !1, this.isDragging = !1, this.scale = 0.1, this.dragStartX = 0, this.dragStartY = 0, this.viewportStartX = 0, this.viewportStartY = 0, this.zoomControlsContainer = null, this.boundMouseMove = null, this.boundMouseUp = null, this.boundTouchMove = null, this.boundTouchEnd = null, this.refreshTimeoutId = null, this.pollIntervalId = null, this.zoomDisplayIntervalId = null, this.slate = t, this.options = {
      enabled: !1,
      position: "bottom-right",
      // Miro-style: bottom-right by default
      width: 200,
      height: 150,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      // Light enough that the notes and lanes under the rectangle read through it;
      // the border carries the outline.
      viewportColor: "rgba(66, 133, 244, 0.12)",
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
    this._enabled && (this._enabled = !1, this.removeEventListeners(), this.removeZoomControls(), this.container && this.container.parentNode && this.container.parentNode.removeChild(this.container), this.container = null, this.miniCanvas = null, this.nodeLayer = null, this.viewportIndicator = null, this.nodeShapes.clear(), console.log("BIRDSEYE_DEBUG: BirdsEye disabled"));
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
    const e = t.getZoom() || 1, s = t.getPan() || { x: 0, y: 0 }, i = this.options.width || 200, o = this.options.height || 150, r = this.calculateContentBounds(), a = Math.max(r.maxX - r.minX, 1), c = Math.max(r.maxY - r.minY, 1), l = 100, h = a + l * 2, d = c + l * 2;
    this.scale = Math.min(
      i / h,
      o / d
    );
    const u = (this.slate.options.viewPort?.originalWidth || 800) / e, f = (this.slate.options.viewPort?.originalHeight || 600) / e, p = (s.x - r.minX + l) * this.scale, m = (s.y - r.minY + l) * this.scale, g = u * this.scale, y = f * this.scale;
    this.viewportIndicator.move(p, m), this.viewportIndicator.size(Math.max(g, 10), Math.max(y, 10));
  }
  updateNodePosition(t) {
    if (!this._enabled) return;
    const e = this.nodeShapes.get(t.id);
    if (!e) return;
    const s = this.calculateContentBounds(), i = 100, o = (t.options.x - s.minX + i) * this.scale, r = (t.options.y - s.minY + i) * this.scale;
    this.animateShapeMove(e, o, r);
    const a = (t.options.width || 100) * this.scale, c = (t.options.height || 60) * this.scale;
    this.applyShapeRotation(e, t, o, r, a, c);
  }
  /**
   * Rotate a minimap shape to match the node's rotation, about its center.
   * Absolute (transform, not the relative .rotate()) so repeated updates don't
   * accumulate. Position (x/y attrs from move) is unaffected.
   */
  applyShapeRotation(t, e, s, i, o, r) {
    const a = e.options.rotate?.rotationAngle || 0;
    try {
      t.transform({ rotate: a, origin: [s + o / 2, i + r / 2] });
    } catch {
    }
  }
  /**
   * Q4: tween a minimap shape to (x,y) with a short easeInOutQuad rAF animation,
   * cancelling any in-flight tween so it retargets smoothly (e.g. during a drag).
   */
  animateShapeMove(t, e, s, i = 220) {
    if (typeof requestAnimationFrame > "u") {
      try {
        t.move(e, s);
      } catch {
      }
      return;
    }
    let o = e, r = s;
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
    let c = null;
    const l = (h) => {
      c === null && (c = h);
      const d = Math.min(1, (h - c) / i), u = a(d);
      try {
        t.move(o + (e - o) * u, r + (s - r) * u);
      } catch {
      }
      d < 1 ? t._beRaf = requestAnimationFrame(l) : t._beRaf = null;
    };
    t._beRaf = requestAnimationFrame(l);
  }
  /**
   * A note's silhouette in the minimap: a circle, the note's own outline for a
   * path shape (a star stays a star, here and in its connected copies), or the
   * box for a plain rectangle and anything without an outline.
   */
  drawShape(t, e, s, i, o, r) {
    if (e.options.shape === "circle") {
      const l = Math.min(o, r) / 2;
      return t.circle(l * 2).move(s, i);
    }
    const c = String(e.options.vectorPath || e.options.shape || "rectangle").toLowerCase() === "rectangle" || e.options.svgContent ? void 0 : Qn(e.options.shape, e.options.vectorPath);
    if (c)
      try {
        const l = vs(c.path);
        if (l.width > 0 && l.height > 0 && [l.x, l.y].every(Number.isFinite)) {
          const h = Ji(c.path, `m${o / l.width},0,0,${r / l.height},${s - l.x * o / l.width},${i - l.y * r / l.height}`);
          if (h) return t.path(h).attr("data-birdseye-outline", "1");
        }
      } catch {
      }
    return t.rect(o, r).move(s, i);
  }
  addNodeShape(t) {
    if (!this._enabled || !this.miniCanvas) return;
    const e = this.calculateContentBounds(), s = 100, i = (t.options.x - e.minX + s) * this.scale, o = (t.options.y - e.minY + s) * this.scale, r = (t.options.width || 100) * this.scale, a = (t.options.height || 60) * this.scale, c = this.nodeLayer ?? this.miniCanvas, l = this.drawShape(c, t, i, o, r, a);
    l.fill(t.options.backgroundColor || this.options.nodeColor), l.stroke({ width: 0 }), this.applyShapeRotation(l, t, i, o, r, a), this.nodeShapes.set(t.id, l);
    try {
      l.opacity(0), l.animate(220).opacity(1);
    } catch {
    }
    this.keepIndicatorOnTop();
  }
  /** The viewport rectangle is the last thing painted in the minimap. */
  keepIndicatorOnTop() {
    if (this.viewportIndicator)
      try {
        this.viewportIndicator.front();
      } catch {
      }
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
    this.container && (this.miniCanvas = ms().addTo(this.container).size(this.options.width, this.options.height), this.miniCanvas.css({ "touch-action": "none" }), this.miniCanvas.rect(this.options.width, this.options.height).fill("#f8f9fa"), this.nodeLayer = this.miniCanvas.group().attr({ class: "slateboxjs-birdseye-nodes", "pointer-events": "none" }));
  }
  renderNodes() {
    if (!this.miniCanvas) return;
    this.nodeShapes.forEach((l) => l.remove()), this.nodeShapes.clear();
    const t = this.calculateContentBounds(), e = 100, s = Math.max(t.maxX - t.minX, 1), i = Math.max(t.maxY - t.minY, 1), o = s + e * 2, r = i + e * 2;
    this.scale = Math.min(
      this.options.width / o,
      this.options.height / r
    );
    const a = this.nodeLayer ?? this.miniCanvas;
    this.slate.getAllNodes().forEach((l) => {
      const h = (l.options.x - t.minX + e) * this.scale, d = (l.options.y - t.minY + e) * this.scale, u = Math.max((l.options.width || 100) * this.scale, 2), f = Math.max((l.options.height || 60) * this.scale, 2), p = this.drawShape(a, l, h, d, u, f);
      p.fill(l.options.backgroundColor || this.options.nodeColor), p.stroke({ width: 0 });
      const m = l.options.rotate?.rotationAngle || 0;
      if (m !== 0) {
        const g = h + u / 2, y = d + f / 2;
        p.rotate(m, g, y);
      }
      this.nodeShapes.set(l.id, p);
    }), this.keepIndicatorOnTop();
  }
  createViewportIndicator() {
    this.miniCanvas && (this.viewportIndicator = this.miniCanvas.rect(50, 40).attr("class", "slateboxjs-birdseye-viewport").fill(this.options.viewportColor).stroke({ color: this.options.viewportBorderColor, width: 2 }).attr("pointer-events", "all").css({ cursor: "move" }), this.viewportIndicator.on("mousedown", (t) => {
      t.preventDefault(), t.stopPropagation();
      const e = t;
      this.beginDrag(e.clientX, e.clientY), this.boundMouseMove = this.handleMouseMove.bind(this), this.boundMouseUp = this.handleMouseUp.bind(this), document.addEventListener("mousemove", this.boundMouseMove), document.addEventListener("mouseup", this.boundMouseUp);
    }), this.viewportIndicator.on(
      "touchstart",
      (t) => {
        const e = t, s = e.touches?.[0];
        s && (e.preventDefault(), e.stopPropagation(), this.beginDrag(s.clientX, s.clientY), this.removeTouchDragListeners(), this.boundTouchMove = (i) => {
          const o = i.touches?.[0] ?? i.changedTouches?.[0];
          o && (i.cancelable && i.preventDefault(), this.handleMouseMove({ clientX: o.clientX, clientY: o.clientY }));
        }, this.boundTouchEnd = () => {
          this.isDragging = !1, this.removeTouchDragListeners();
        }, document.addEventListener("touchmove", this.boundTouchMove, { passive: !1 }), document.addEventListener("touchend", this.boundTouchEnd), document.addEventListener("touchcancel", this.boundTouchEnd));
      },
      void 0,
      { passive: !1 }
    ), this.miniCanvas.on("mousedown", (t) => {
      const e = t;
      this.jumpTo(e.clientX, e.clientY);
    }), this.miniCanvas.on(
      "touchstart",
      (t) => {
        const e = t.touches?.[0];
        e && (t.preventDefault(), this.jumpTo(e.clientX, e.clientY));
      },
      void 0,
      { passive: !1 }
    ));
  }
  beginDrag(t, e) {
    this.isDragging = !0, this.dragStartX = t, this.dragStartY = e;
    const s = this.viewportIndicator.bbox();
    this.viewportStartX = s.x, this.viewportStartY = s.y;
  }
  /** Center the view on a point of the minimap. */
  jumpTo(t, e) {
    try {
      const s = this.miniCanvas.point(t, e), i = this.viewportIndicator?.bbox().width || 50, o = this.viewportIndicator?.bbox().height || 40, r = this.calculateContentBounds(), a = 100, c = (s.x - i / 2) / this.scale + r.minX - a, l = (s.y - o / 2) / this.scale + r.minY - a;
      this.slate.panZoom?.pan({ x: c, y: l });
    } catch {
    }
  }
  removeTouchDragListeners() {
    this.boundTouchMove && (document.removeEventListener("touchmove", this.boundTouchMove), this.boundTouchMove = null), this.boundTouchEnd && (document.removeEventListener("touchend", this.boundTouchEnd), document.removeEventListener("touchcancel", this.boundTouchEnd), this.boundTouchEnd = null);
  }
  handleMouseMove(t) {
    if (!this.isDragging || !this.viewportIndicator) return;
    const e = t.clientX - this.dragStartX, s = t.clientY - this.dragStartY, i = this.viewportStartX + e, o = this.viewportStartY + s;
    this.viewportIndicator.move(i, o);
    const r = this.calculateContentBounds(), a = 100, c = i / this.scale + r.minX - a, l = o / this.scale + r.minY - a;
    this.slate.panZoom?.pan({ x: c, y: l });
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
    this.boundMouseMove && (document.removeEventListener("mousemove", this.boundMouseMove), this.boundMouseMove = null), this.boundMouseUp && (document.removeEventListener("mouseup", this.boundMouseUp), this.boundMouseUp = null), this.removeTouchDragListeners(), this.isDragging = !1, this.slate.canvas && this.slate.canvas.off?.(".birdseye"), this.refreshTimeoutId !== null && (window.clearTimeout(this.refreshTimeoutId), this.refreshTimeoutId = null), this.stopPolling();
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
    const s = document.createElement("button");
    s.textContent = "+", s.title = "Zoom In", s.style.cssText = this.getZoomButtonStyle(), s.addEventListener("click", () => this.slate.panZoom?.zoomIn()), this.zoomControlsContainer.appendChild(s), this.container.appendChild(this.zoomControlsContainer), this.startZoomDisplayUpdates();
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
    let e = 1 / 0, s = 1 / 0, i = -1 / 0, o = -1 / 0;
    return t.forEach((r) => {
      const a = r.options.x || 0, c = r.options.y || 0, l = r.options.width || 100, h = r.options.height || 60;
      e = Math.min(e, a), s = Math.min(s, c), i = Math.max(i, a + l), o = Math.max(o, c + h);
    }), { minX: e, minY: s, maxX: i, maxY: o };
  }
}
function ve(n) {
  const t = { ...n };
  return n.xPos !== void 0 && t.x === void 0 && (t.x = n.xPos, delete t.xPos), n.yPos !== void 0 && t.y === void 0 && (t.y = n.yPos, delete t.yPos), n.foregroundColor !== void 0 && t.fontColor === void 0 && (t.fontColor = n.foregroundColor, delete t.foregroundColor), n.shapeHint !== void 0 && t.shape === void 0 && (t.shape = hf(n.shapeHint), delete t.shapeHint), n.svgString !== void 0 && t.svgContent === void 0 && (t.svgContent = n.svgString, delete t.svgString), n.blnStraight !== void 0 && (t.isStraightLine = n.blnStraight, delete t.blnStraight), Qi(t), t;
}
function Xa(n) {
  if (!n || typeof n != "object") return !1;
  const t = n;
  return t.width !== void 0 || t.height !== void 0;
}
function Qi(n) {
  return n && Xa(n.textOffset) && (n.textOffset = { x: 0, y: 0 }), n;
}
function nt(n) {
  const t = { ...n };
  return t.xPos = n.x, t.yPos = n.y, t.foregroundColor = n.fontColor, n.shape && (t.shapeHint = n.shape), n.svgContent && (t.svgString = n.svgContent), t;
}
function to(n) {
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
function Wa(n) {
  return { ...n };
}
function eo(n) {
  return {
    id: n.id || `${n.parentId}->${n.childId}`,
    childId: n.childId,
    parentId: n.parentId,
    isStraightLine: n.isStraightLine ?? n.blnStraight ?? !1,
    lineColor: n.lineColor || "#666666",
    lineEffect: n.lineEffect || "",
    lineDash: n.lineDash === "dashed" || n.lineDash === "dotted" ? n.lineDash : "solid",
    lineOpacity: n.lineOpacity ?? 1,
    lineType: n.lineType || "bezier",
    lineCurveType: n.lineCurveType || "cubic",
    lineCurviness: n.lineCurviness ?? 0.1,
    lineWidth: n.lineWidth ?? 3,
    showParentArrow: n.showParentArrow ?? !1,
    showChildArrow: n.showChildArrow ?? !0,
    sourcePoint: n.sourcePoint ?? null,
    targetPoint: n.targetPoint ?? null,
    sourceAnchor: n.sourceAnchor ?? null,
    targetAnchor: n.targetAnchor ?? null,
    label: n.label ?? "",
    ...typeof n.labelPosition == "number" && { labelPosition: n.labelPosition }
  };
}
function no(n) {
  return {
    // Persist the association id so parallel edges (`A->B~2`) survive a save/reload
    // round-trip instead of collapsing back onto the canonical `A->B` and deduping.
    id: n.id,
    childId: n.childId,
    parentId: n.parentId,
    isStraightLine: n.isStraightLine,
    lineColor: n.lineColor,
    lineEffect: n.lineEffect,
    lineDash: n.lineDash ?? "solid",
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
    targetAnchor: n.targetAnchor ?? null,
    label: n.label ?? "",
    ...typeof n.labelPosition == "number" && { labelPosition: n.labelPosition }
  };
}
function hf(n) {
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
function df(n) {
  const t = {
    options: to(n.options || {}),
    nodes: [],
    shareId: n.shareId || ""
  };
  return Array.isArray(n.nodes) && (t.nodes = n.nodes.map((e) => {
    const s = ve(e.options || {}), i = { associations: [] };
    return e.relationships?.associations && (i.associations = e.relationships.associations.map(
      (o) => eo(o)
    )), {
      options: s,
      relationships: i
    };
  })), t;
}
function uf(n) {
  const t = {
    options: Wa(n.options || {}),
    nodes: [],
    shareId: n.shareId || ""
  };
  return Array.isArray(n.nodes) && (t.nodes = n.nodes.map((e) => {
    const s = nt(e.options || {}), i = { associations: [] };
    return e.relationships?.associations && (i.associations = e.relationships.associations.map(
      (o) => no(o)
    )), {
      options: s,
      relationships: i
    };
  })), t;
}
const ff = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  convertV1JsonToV2: df,
  convertV2JsonToV1: uf,
  isLegacyTextOffset: Xa,
  normalizeLegacyTextOffset: Qi,
  v1AssociationToV2: eo,
  v1NodeToV2: ve,
  v1SlateToV2: to,
  v2AssociationToV1: no,
  v2NodeToV1: nt,
  v2SlateToV1: Wa
}, Symbol.toStringTag, { value: "Module" }));
function ws(n, t, e) {
  const s = t || n.nodes.allNodes, o = (typeof n.isDerivedNode == "function" ? s.filter((r) => !n.isDerivedNode(r)) : s).map(
    (r) => qa(r)
  );
  return e && o.forEach((r, a) => {
    r.options._presentationIndex = a;
  }), {
    options: mf(n.options),
    nodes: o,
    shareId: n.options.shareId || ""
  };
}
async function xs(n, t, e = !1, s = !1) {
  const i = typeof n == "string" ? JSON.parse(n) : n, o = e ? null : t.takeInlineDraft?.() ?? null;
  t.beginRemoteApply?.();
  try {
    const r = pf(i, t, e, s);
    await (t.holdUntilLoaded?.(r) ?? r);
  } finally {
    t.endRemoteApply?.();
  }
  e || t.notifyNotesReplaced?.(), o && t.resumeInlineDraft?.(o);
}
async function pf(n, t, e, s) {
  if (n.options) {
    const o = n.options;
    Object.assign(t.options, o), !e && !("style" in n.options) && delete t.options.style, !e && !("styleOriginal" in n.options) && delete t.options.styleOriginal, n.shareId && (t.options.shareId = n.shareId), t.applyContainerStyle?.();
  }
  if (!e) {
    t.nodes.clear();
    try {
      t.linesContainer?.clear?.();
    } catch {
    }
  }
  const i = /* @__PURE__ */ new Map();
  if (Array.isArray(n.nodes)) {
    for (const r of n.nodes) {
      const a = Za(r.options), c = t.nodes.one(a.id);
      if (c)
        Object.assign(c.options, a), a.x !== void 0 && a.y !== void 0 && c.position(a.x, a.y), i.set(a.id, c);
      else {
        const l = t.addNode(a);
        l && i.set(l.id, l);
      }
    }
    const o = [];
    for (const r of i.values())
      r.ready && o.push(r.ready);
    o.length > 0 && await Promise.all(o);
    for (const r of n.nodes) {
      const a = r.options.id || r.options.xPos !== void 0 ? ve(r.options).id : r.options.id;
      if (!a) continue;
      const c = i.get(a) || t.nodes.one(a);
      if (!c) continue;
      const l = r.relationships?.associations;
      if (!(!Array.isArray(l) || l.length === 0))
        for (const h of l) {
          const d = eo(h);
          if (d.targetPoint && c?.relationships) {
            c.relationships.addFloatingAssociation(
              d.targetPoint,
              d
            );
            continue;
          }
          const u = i.get(d.childId) || t.nodes.one(d.childId);
          if (u && c)
            if (c.relationships)
              c.relationships.addAssociation(u, d);
            else
              try {
                c.connector.isEnabled() || c.connector.enable(), c.connector.connectTo(u, {
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
  if (!s && t.panZoom) {
    const o = () => {
      const a = t.nodes?.allNodes ?? [];
      if (!a.length) return null;
      let c = 1 / 0, l = -1 / 0;
      for (const h of a) {
        const d = h.options.x ?? 0, u = h.options.width ?? 100;
        c = Math.min(c, d), l = Math.max(l, d + u);
      }
      return (c + l) / 2;
    }, r = (a) => {
      if (t._destroyed) return;
      const c = t.element?.getBoundingClientRect?.(), l = !!c && c.width > 1 && c.height > 1, h = o();
      if (l && h !== null) {
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
function qa(n) {
  const t = nt(n.options);
  if (n.svgGroup)
    try {
      const s = n.svgGroup.bbox();
      t.xPos = n.options.x ?? s.x, t.yPos = n.options.y ?? s.y;
    } catch {
      t.xPos = n.options.x ?? 0, t.yPos = n.options.y ?? 0;
    }
  if (n.getRotation) {
    const s = n.getRotation();
    s !== 0 && (t.rotate = { rotationAngle: s });
  }
  const e = [];
  if (n.relationships && typeof n.relationships.serialize == "function") {
    const s = n.relationships.serialize();
    if (s?.associations) {
      const i = n.slate, o = (r) => typeof r == "string" && typeof i?.isDerivedNode == "function" && i.isDerivedNode(i.nodes?.one?.(r));
      e.push(
        ...s.associations.filter((r) => !o(r.childId)).map((r) => no(r))
      );
    }
  } else if (n.connector) {
    const s = n.connector.getConnections();
    for (const i of s)
      (i.source === n || i.source?.id === n.id) && e.push({
        childId: i.target?.id || i.target,
        parentId: n.id,
        isStraightLine: !1,
        lineColor: i.lineColor || "#666666",
        lineEffect: "",
        lineOpacity: 1,
        lineType: "bezier",
        lineCurviness: 0.1,
        lineCurveType: "cubic",
        lineWidth: i.lineWidth || 3
      });
  }
  return {
    options: t,
    relationships: {
      associations: e
    }
  };
}
function Za(n) {
  return ve(n);
}
function mf(n) {
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
    "allowCollaboration",
    "defaultLineColor",
    "style",
    // The slate as it was before it first wore a style (the host's "Revert to original").
    "styleOriginal",
    "layoutType",
    "disableAutoLayoutOfManuallyPositionedNodes",
    "nodeOrder",
    "huddleType",
    "huddleEnabled",
    "tags",
    "templateMarkdown",
    "templatePrompt",
    "ai",
    // Which whole-slate replacement (undo/redo) this document already holds, so a
    // client that loads it does not rebuild the slate from the room's copy (Collab.ts).
    "collabBaseline"
  ];
  for (const s of e)
    n[s] !== void 0 && (t[s] = n[s]);
  return n.viewPort && (t.viewPort = { ...n.viewPort }), n.containerStyle && (t.containerStyle = { ...n.containerStyle }), t;
}
function Va(n) {
  return ws(n);
}
const gf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  deserialize: xs,
  deserializeNodeOptions: Za,
  serialize: ws,
  serializeNode: qa,
  snapshot: Va
}, Symbol.toStringTag, { value: "Module" })), yf = /* @__PURE__ */ new Set(["collabBaseline", "viewPort"]), wi = (n, t) => n === t || JSON.stringify(n) === JSON.stringify(t), jn = (n) => n?.options?.id, ts = (n) => n.relationships?.associations ?? [];
function sn(n) {
  return n.id != null && n.id !== "" ? String(n.id) : `${n.parentId}->${n.childId}`;
}
function Go(n, t, e) {
  const s = {}, i = [];
  for (const o of Object.keys(t))
    e?.has(o) || (!(o in n) || !wi(n[o], t[o])) && (s[o] = t[o]);
  for (const o of Object.keys(n))
    e?.has(o) || o in t || i.push(o);
  return { set: s, unset: i };
}
const $o = (n) => Object.keys(n.set).length === 0 && n.unset.length === 0;
function Ho(n) {
  const t = /* @__PURE__ */ new Map();
  for (const e of n ?? []) {
    const s = jn(e);
    s != null && t.set(s, e);
  }
  return t;
}
function Pn(n, t) {
  const e = Go(n?.options ?? {}, t?.options ?? {}, yf), s = Ho(n?.nodes ?? []), i = Ho(t?.nodes ?? []), o = [], r = [], a = [];
  for (const [c, l] of i) {
    const h = s.get(c);
    if (!h) {
      o.push(l);
      continue;
    }
    if (wi(h, l)) continue;
    const d = Go(h.options ?? {}, l.options ?? {}), u = new Map(ts(h).map((m) => [sn(m), m])), f = new Map(ts(l).map((m) => [sn(m), m])), p = { set: [], removed: [] };
    for (const [m, g] of f) wi(u.get(m), g) || p.set.push(g);
    for (const m of u.keys()) f.has(m) || p.removed.push(m);
    $o(d) && p.set.length === 0 && p.removed.length === 0 || a.push({ id: c, ...d, links: p });
  }
  for (const c of s.keys()) i.has(c) || r.push(c);
  return $o(e) && o.length === 0 && r.length === 0 && a.length === 0 ? null : { options: e, added: o, removed: r, changed: a };
}
function bf(n, t) {
  const e = { ...n.options ?? {} };
  for (const [l, h] of Object.entries(t.options.set)) e[l] = h;
  for (const l of t.options.unset) delete e[l];
  const s = new Set(t.removed), i = new Map(t.changed.map((l) => [l.id, l])), o = new Map(t.added.map((l) => [jn(l), l])), r = [];
  for (const l of n.nodes ?? []) {
    const h = jn(l);
    if (h != null && s.has(h)) continue;
    if (h != null && o.has(h)) {
      r.push(o.get(h)), o.delete(h);
      continue;
    }
    const d = h != null ? i.get(h) : void 0;
    let u = l;
    if (d) {
      const f = { ...l.options ?? {} };
      for (const [m, g] of Object.entries(d.set)) f[m] = g;
      for (const m of d.unset) delete f[m];
      let p = ts(l);
      if (d.links.set.length || d.links.removed.length) {
        const m = new Set(d.links.removed), g = new Map(d.links.set.map((y) => [sn(y), y]));
        p = p.filter((y) => !m.has(sn(y))).map((y) => {
          const b = sn(y), x = g.get(b);
          return x ? (g.delete(b), x) : y;
        }), p.push(...g.values());
      }
      u = { ...l, options: f, relationships: { ...l.relationships ?? {}, associations: p } };
    }
    r.push(u);
  }
  r.push(...o.values());
  const a = new Set(r.map(jn)), c = r.map((l) => {
    const h = ts(l), d = h.filter((u) => u.targetPoint || u.childId == null || a.has(u.childId));
    return d.length === h.length ? l : { ...l, relationships: { ...l.relationships, associations: d } };
  });
  return { ...n, options: e, nodes: c };
}
const On = "Someone else changed that since, so there was nothing of yours to take back there.";
class Et {
  constructor(t, e = {}) {
    this.undoStack = [], this.redoStack = [], this.undoHost = [], this.redoHost = [], this.debounceTimer = null, this.isRestoring = !1, this.restoreQueue = Promise.resolve(), this.pendingRestores = 0, this.gestureRecordDue = !1, this.undoSteps = [], this.redoSteps = [], this.undoTouched = [], this.redoTouched = [], this.gestureDepth = 0, this.gestureChanged = !1, this.listeners = /* @__PURE__ */ new Set(), this.lastState = "", this.carried = /* @__PURE__ */ new WeakMap(), this.slate = t, this.options = {
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
      if (!this.gestureRecordDue) {
        if (this.gestureDepth > 0) {
          this.gestureChanged = !0, this.debounceTimer && (clearTimeout(this.debounceTimer), this.debounceTimer = null);
          return;
        }
        this.debounceTimer && clearTimeout(this.debounceTimer), this.debounceTimer = setTimeout(() => {
          this.debounceTimer = null, this.takeSnapshot();
        }, this.options.debounceMs);
      }
    }
  }
  /**
   * Record a step as soon as the current gesture has made all its changes,
   * without the pause that groups a burst of edits into one step.
   *
   * Deleting is one deliberate act: two notes deleted one after the other are
   * two steps, and undo brings back the last one only. (Several selected notes
   * deleted by one key press are still one step: their packages are all sent
   * before this record is taken.)
   */
  snapAfterGesture() {
    if (!(!this.options.enabled || this.isRestoring)) {
      if (this.debounceTimer && (clearTimeout(this.debounceTimer), this.debounceTimer = null), this.gestureDepth > 0) {
        this.gestureChanged = !0;
        return;
      }
      this.gestureRecordDue || (this.gestureRecordDue = !0, queueMicrotask(() => {
        this.gestureRecordDue && (this.gestureRecordDue = !1, !(!this.slate || this.isRestoring) && this.takeSnapshot());
      }));
    }
  }
  /**
   * Take an immediate snapshot, bypassing the debounce timer.
   * Useful for programmatic undo/redo sequences where you need
   * guaranteed snapshot state right now (e.g., tests, scripts).
   */
  forceSnapshot() {
    !this.options.enabled || this.isRestoring || (this.debounceTimer && (clearTimeout(this.debounceTimer), this.debounceTimer = null), this.gestureRecordDue = !1, this.gestureChanged = !1, this.takeSnapshot());
  }
  /** True while a change of this person's own waits to be recorded. */
  hasPending() {
    return !!(this.debounceTimer || this.gestureRecordDue || this.gestureChanged);
  }
  /**
   * Record a change still waiting for its pause (or its gesture) now, as a step of
   * its own. Nothing happens when nothing is waiting.
   */
  flushPending() {
    this.hasPending() && this.forceSnapshot();
  }
  /**
   * A pointer gesture began on the canvas (a drag, a resize, a rotation, a line drawn):
   * whatever it changes is one step, recorded by {@link endGesture}. An edit already
   * waiting for its pause is recorded first, as a step of its own.
   */
  beginGesture() {
    this.options.enabled && (this.gestureDepth === 0 && this.debounceTimer && this.forceSnapshot(), this.gestureDepth += 1);
  }
  /** True while a pointer gesture on the canvas is under way. */
  inGesture() {
    return this.gestureDepth > 0;
  }
  /** The gesture begun with {@link beginGesture} is over: its changes, if any, are one step. */
  endGesture() {
    this.gestureDepth !== 0 && (this.gestureDepth -= 1, !(this.gestureDepth > 0 || !this.gestureChanged) && (this.gestureChanged = !1, this.gestureRecordDue = !0, queueMicrotask(() => {
      this.gestureRecordDue && (this.gestureRecordDue = !1, !(!this.slate || this.isRestoring) && this.takeSnapshot());
    })));
  }
  /**
   * Record a step a host made in its own state (see {@link HostStep}) as the next step
   * of this person's history. A change of the drawing still waiting to be recorded is
   * recorded first, as a step of its own. Redo history is cleared, as by any new step.
   */
  recordHostStep(t) {
    !this.options.enabled || !this.slate || !t || typeof t.undo != "function" || typeof t.redo != "function" || (this.flushPending(), this.takeSnapshot(t));
  }
  /** Whether there is something to undo and to redo now. */
  state() {
    const t = this.undoSteps[this.undoStack.length - 1], e = this.redoSteps[this.redoStack.length - 1];
    return {
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      undoLabel: this.canUndo() ? t?.label ?? null : null,
      redoLabel: this.canRedo() ? e?.label ?? null : null
    };
  }
  /**
   * Hear whenever there comes to be something, or nothing, to undo or redo, and what each
   * undo or redo did. Called at once with the state as it is. Returns a function that stops it.
   */
  subscribe(t) {
    if (typeof t != "function") return () => {
    };
    this.listeners.add(t);
    const e = this.state();
    this.lastState = JSON.stringify(e);
    try {
      t(e);
    } catch (s) {
      console.warn("UNDOREDO_DEBUG: listener threw", s);
    }
    return () => {
      this.listeners.delete(t);
    };
  }
  notify(t) {
    const e = this.state(), s = JSON.stringify(e);
    if (!(!t && s === this.lastState)) {
      this.lastState = s;
      for (const i of [...this.listeners])
        try {
          i(e, t);
        } catch (o) {
          console.warn("UNDOREDO_DEBUG: listener threw", o);
        }
      try {
        this.slate?.options?.events?.onUndoRedoChanged?.(e, t);
      } catch (i) {
        console.warn("UNDOREDO_DEBUG: onUndoRedoChanged threw", i);
      }
    }
  }
  /** Bring what the host keeps with the current record up to date (see Slate.beginHostStep). */
  refreshHostState() {
    !this.options.enabled || !this.slate || !this.undoStack.length || (this.undoHost[this.undoStack.length - 1] = this.hostState());
  }
  /** True when going back from record `index` to the one before changes nothing (drawing and host state alike). */
  sameAsBefore(t) {
    if (t < 1) return !1;
    try {
      if (Pn(this.undoStack[t - 1], this.undoStack[t]) !== null) return !1;
    } catch {
      return !1;
    }
    return Et.sameHost(this.undoHost[t - 1], this.undoHost[t]);
  }
  /** True when redoing the top redo record changes nothing from the current record. */
  redoChangesNothing() {
    const t = this.redoStack[this.redoStack.length - 1], e = this.undoStack[this.undoStack.length - 1];
    if (!t || !e) return !1;
    try {
      if (Pn(e, t) !== null) return !1;
    } catch {
      return !1;
    }
    return Et.sameHost(this.undoHost[this.undoStack.length - 1], this.redoHost[this.redoStack.length - 1]);
  }
  /** Whether two records' host states (Map of policy to state) hold the same. */
  static sameHost(t, e) {
    const s = (i) => {
      try {
        return JSON.stringify(i instanceof Map ? [...i.values()] : i ?? null);
      } catch {
        return String(Math.random());
      }
    };
    return s(t) === s(e);
  }
  /**
   * Undo this person's last step. A step someone else has since changed so that going
   * back would change nothing is passed over (and listeners are told so); the step
   * before it is undone instead. Returns false when there was nothing to undo.
   */
  undo() {
    this.hasPending() && this.forceSnapshot();
    let t = 0;
    for (; this.undoStack.length > 1; ) {
      const e = this.undoStack.length - 1, s = this.undoSteps[e];
      if (!s && this.undoTouched[e] && this.sameAsBefore(e)) {
        this.undoStack.splice(e, 1), this.undoHost.splice(e, 1), this.undoSteps.splice(e, 1), this.undoTouched.splice(e, 1), t += 1;
        continue;
      }
      this.redoStack.push(this.undoStack.pop()), this.redoHost.push(this.undoHost.pop()), this.redoSteps.push(this.undoSteps.pop() ?? null), this.redoTouched.push(this.undoTouched.pop() ?? !1);
      const i = this.undoStack[this.undoStack.length - 1], o = this.leavesTheirs(this.redoStack[this.redoStack.length - 1], i);
      return this.restore(i, "undo", this.undoHost[this.undoStack.length - 1], s ?? null, t, o), this.notify(), !0;
    }
    return t && this.notify({ action: "undo", done: !1, skipped: t, message: On }), !1;
  }
  /**
   * Redo the last undone step. A step someone else has since changed so that redoing it
   * would change nothing is passed over. Returns false when there was nothing to redo.
   */
  redo() {
    let t = 0;
    for (; this.redoStack.length > 0; ) {
      const e = this.redoStack.length - 1, s = this.redoSteps[e];
      if (!s && this.redoTouched[e] && this.redoChangesNothing()) {
        this.redoStack.pop(), this.redoHost.pop(), this.redoSteps.pop(), this.redoTouched.pop(), t += 1;
        continue;
      }
      const i = this.leavesTheirs(this.undoStack[this.undoStack.length - 1], this.redoStack[e]), o = this.redoStack.pop(), r = this.redoHost.pop();
      this.redoSteps.pop();
      const a = this.redoTouched.pop() ?? !1;
      return this.undoStack.push(o), this.undoHost.push(r), this.undoSteps.push(s ?? null), this.undoTouched.push(a), this.restore(o, "redo", r, s ?? null, t, i), this.notify(), !0;
    }
    return t && this.notify({ action: "redo", done: !1, skipped: t, message: On }), !1;
  }
  /**
   * The slate as it is now, taken just before other people's changes are
   * applied to it; pass it to {@link absorbRemote} once they have been. Null
   * when this slate keeps no history.
   */
  beforeRemote() {
    if (!this.options.enabled || !this.slate) return null;
    try {
      return Et.capture(this.slate);
    } catch {
      return null;
    }
  }
  /**
   * Other people's changes were applied to the slate (ordinary edits, or a
   * whole-slate replacement from their undo or redo). Records are whole slates,
   * so going back to one would put back the slate as this person recorded it and
   * take away everything the others did since, however long ago this person's
   * own step was. Their change is therefore carried into every record, undo and
   * redo alike: an undo then takes back only this person's own step.
   *
   * @param before - the slate just before those changes (see {@link beforeRemote})
   */
  absorbRemote(t) {
    if (!this.options.enabled || !this.slate) return;
    let e;
    try {
      e = Et.capture(this.slate);
    } catch {
      return;
    }
    if (t && typeof t == "object") {
      const s = Pn(t, e);
      s && (this.undoStack = this.undoStack.map((i) => this.absorbInto(i, t, s)), this.redoStack = this.redoStack.map((i) => this.absorbInto(i, t, s)), this.undoTouched = this.undoTouched.map(() => !0), this.redoTouched = this.redoTouched.map(() => !0));
    }
    this.isRestoring || this.hasPending() || this.undoStack.length === 0 || (this.undoStack[this.undoStack.length - 1] = e, this.undoHost[this.undoStack.length - 1] = this.hostState());
  }
  absorbInto(t, e, s) {
    const i = /* @__PURE__ */ new Set();
    for (const l of s.changed) {
      i.add(l.id);
      for (const h of l.links.set) typeof h.childId == "string" && i.add(h.childId);
    }
    for (const l of s.removed) i.delete(l);
    const o = Et.noteIds(t), r = (e.nodes ?? []).filter((l) => i.has(l?.options?.id) && !o.has(l.options.id)), a = bf(r.length ? { ...t, nodes: [...t.nodes ?? [], ...JSON.parse(JSON.stringify(r))] } : t, s), c = /* @__PURE__ */ new Set([...this.carried.get(t) ?? [], ...r.map((l) => l.options.id)]);
    return c.size && this.carried.set(a, c), a;
  }
  leavesTheirs(t, e) {
    const s = e ? this.carried.get(e) : void 0;
    if (!s) return !1;
    const i = t && this.carried.get(t) || /* @__PURE__ */ new Set();
    return [...s].some((o) => !i.has(o));
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
    this.undoStack = [], this.redoStack = [], this.undoHost = [], this.redoHost = [], this.undoSteps = [], this.redoSteps = [], this.undoTouched = [], this.redoTouched = [], this.debounceTimer && (clearTimeout(this.debounceTimer), this.debounceTimer = null), this.gestureRecordDue = !1, this.gestureChanged = !1, this.notify();
  }
  /** Destroy the undo/redo system, clearing all history and references */
  destroy() {
    this.clear(), this.listeners.clear(), this.isRestoring = !1, this.gestureDepth = 0, this.slate = null;
  }
  // ─── Private ─────────────────────────────────────────────────────
  takeSnapshot(t = null) {
    let e;
    try {
      e = Et.capture(this.slate);
    } catch {
      return;
    }
    this.redoStack = [], this.redoHost = [], this.redoSteps = [], this.redoTouched = [], this.undoStack.push(e), this.undoHost.push(this.hostState()), this.undoSteps.push(t), this.undoTouched.push(!1), this.undoStack.length > this.options.maxHistory && (this.undoStack.shift(), this.undoHost.shift(), this.undoSteps.shift(), this.undoTouched.shift(), this.undoSteps[0] = null), this.notify();
  }
  /**
   * The slate as a record: plain data, copied all the way down. A serialized note can share
   * nested objects with the live note (its `rotate` while it is not rotated), and a later
   * change to the live note would otherwise change the record with it (undoing a first
   * rotation left the note rotated).
   */
  static capture(t) {
    return JSON.parse(JSON.stringify(ws(t)));
  }
  /** What the slate's host policies keep with a record taken now. */
  hostState() {
    try {
      return this.slate?.undoHostState?.() ?? null;
    } catch {
      return null;
    }
  }
  /** The ids of the ordinary notes a slate document holds. */
  static noteIds(t) {
    return new Set((t?.nodes ?? []).map((e) => e?.options?.id).filter((e) => typeof e == "string"));
  }
  /** A host step that did nothing is not offered the other way round. */
  dropStep(t, e) {
    const i = (e === "undo" ? this.redoSteps : this.undoSteps).lastIndexOf(t);
    if (!(i < 0))
      if (e === "undo") {
        if (i !== this.redoStack.length - 1) return;
        this.redoStack.pop(), this.redoHost.pop(), this.redoSteps.pop(), this.redoTouched.pop();
      } else {
        if (i !== this.undoStack.length - 1 || i < 1) return;
        this.undoStack.pop(), this.undoHost.pop(), this.undoSteps.pop(), this.undoTouched.pop();
      }
  }
  restore(t, e, s = null, i = null, o = 0, r = !1) {
    this.pendingRestores += 1, this.isRestoring = !0;
    let a = {
      action: e,
      done: !0,
      skipped: o,
      message: o || r ? On : null
    };
    this.restoreQueue = this.restoreQueue.then(async () => {
      await this.slate.collab?.whenApplied?.();
      let c = null;
      try {
        c = Et.capture(this.slate);
      } catch {
        c = null;
      }
      let l = !0;
      if (i && c)
        try {
          l = Pn(c, t) !== null;
        } catch {
          l = !0;
        }
      if (l) {
        await xs(JSON.stringify(t), this.slate, !1, !0);
        const h = Et.noteIds(c), d = Et.noteIds(t);
        this.slate.restoreUndoHostState?.(s, {
          added: [...d].filter((f) => !h.has(f)),
          removed: [...h].filter((f) => !d.has(f))
        });
        const u = JSON.stringify(t);
        this.slate.broadcast?.("onSlateReplaced", {
          action: e,
          snapshot: u
        }), this.slate.options.events?.onTakeSnapshot?.({
          action: e,
          slateId: this.slate.options.id,
          snapshot: u
        });
      }
      if (i) {
        let h;
        try {
          h = await (e === "undo" ? i.undo() : i.redo());
        } catch (f) {
          console.warn("UNDOREDO_DEBUG: host step failed", f), h = { ok: !1, message: null };
        }
        const d = h === void 0 || h === !0 || typeof h == "object" && h !== null && h.ok !== !1, u = typeof h == "object" && h !== null && typeof h.message == "string" ? h.message : null;
        d ? u && (a = { ...a, message: u }) : (this.dropStep(i, e), a = { action: e, done: l, skipped: o, message: u ?? (o ? On : null) });
      }
    }).catch(
      (c) => console.error("UNDOREDO_DEBUG: Restore failed", c)
    ).finally(() => {
      this.pendingRestores -= 1, this.pendingRestores === 0 && (this.isRestoring = !1), this.notify(a);
    });
  }
  /** Resolves once every undo and redo asked for so far has been carried out. */
  whenRestored() {
    return this.restoreQueue.then(() => {
    });
  }
}
const vf = ["youtube", "vimeo", "loom"], Ka = Object.freeze({
  youtube: "YouTube",
  vimeo: "Vimeo",
  loom: "Loom"
}), Ig = Object.freeze([
  "https://www.youtube-nocookie.com",
  "https://player.vimeo.com",
  "https://www.loom.com"
]), Ve = Object.freeze({ width: 320, height: 180 }), Mt = Object.freeze({ urlLength: 2e3, titleLength: 300, authorLength: 120, startSeconds: 86400 }), Ja = /^[A-Za-z0-9_-]{11}$/, xi = /^\d{1,12}$/, _i = /^[0-9a-f]{6,20}$/i, Qa = /^[0-9a-f]{32}$/i, wf = /* @__PURE__ */ new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "youtu.be", "www.youtube-nocookie.com", "youtube-nocookie.com"]), xf = /* @__PURE__ */ new Set(["vimeo.com", "www.vimeo.com", "player.vimeo.com"]), _f = /* @__PURE__ */ new Set(["loom.com", "www.loom.com"]);
function so(n) {
  if (!n) return;
  const t = String(n).trim().toLowerCase();
  let e;
  if (/^\d+$/.test(t)) e = Number(t);
  else {
    const s = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(t);
    if (!s || !s[0]) return;
    e = Number(s[1] || 0) * 3600 + Number(s[2] || 0) * 60 + Number(s[3] || 0);
  }
  return Number.isSafeInteger(e) && e > 0 && e <= Mt.startSeconds ? e : void 0;
}
function io(n) {
  return n.hostname.toLowerCase().replace(/\.$/, "");
}
function Sf(n) {
  const t = io(n), e = n.pathname.split("/").filter(Boolean);
  let s;
  if (t === "youtu.be" ? s = e[0] : e[0] === "watch" ? s = n.searchParams.get("v") ?? void 0 : ["shorts", "embed", "live", "v"].includes(e[0]) && (s = e[1]), !s || !Ja.test(s)) return null;
  const i = so(n.searchParams.get("t") ?? n.searchParams.get("start"));
  return { provider: "youtube", id: s, url: `https://www.youtube.com/watch?v=${s}`, ...i ? { start: i } : {} };
}
function Cf(n) {
  const t = io(n), e = n.pathname.split("/").filter(Boolean);
  let s, i;
  if (t === "player.vimeo.com") {
    if (e[0] !== "video") return null;
    s = e[1], i = n.searchParams.get("h") ?? void 0;
  } else {
    const r = e.findIndex((c) => xi.test(c));
    if (r < 0) return null;
    s = e[r];
    const a = e[r + 1];
    a && _i.test(a) && (i = a);
  }
  if (!s || !xi.test(s)) return null;
  i !== void 0 && !_i.test(i) && (i = void 0);
  const o = so((n.hash.match(/t=([0-9hms]+)/i) || [])[1]);
  return {
    provider: "vimeo",
    id: s,
    url: i ? `https://vimeo.com/${s}/${i}` : `https://vimeo.com/${s}`,
    ...i ? { hash: i } : {},
    ...o ? { start: o } : {}
  };
}
function Ef(n) {
  const t = n.pathname.split("/").filter(Boolean);
  if (!["share", "embed"].includes(t[0])) return null;
  const e = t[1] ? t[1].split("-").pop() : void 0;
  if (!e || !Qa.test(e)) return null;
  const s = e.toLowerCase(), i = so(n.searchParams.get("t"));
  return { provider: "loom", id: s, url: `https://www.loom.com/share/${s}`, ...i ? { start: i } : {} };
}
function _s(n) {
  if (typeof n != "string") return null;
  const t = n.trim();
  if (!t || t.length > Mt.urlLength || /\s/.test(t)) return null;
  let e;
  try {
    e = new URL(/^[a-z][a-z0-9+.-]*:/i.test(t) ? t : `https://${t}`);
  } catch {
    return null;
  }
  if (e.protocol !== "https:" && e.protocol !== "http:" || e.username || e.password || e.port) return null;
  const s = io(e);
  return wf.has(s) ? Sf(e) : xf.has(s) ? Cf(e) : _f.has(s) ? Ef(e) : null;
}
const Dg = (n) => _s(n) !== null;
function Af(n, { play: t = !1 } = {}) {
  const e = t ? "1" : "0";
  switch (n?.provider) {
    case "youtube": {
      if (!Ja.test(n.id)) return null;
      const s = new URLSearchParams({ autoplay: e, rel: "0", playsinline: "1", modestbranding: "1" });
      return n.start && s.set("start", String(n.start)), `https://www.youtube-nocookie.com/embed/${n.id}?${s}`;
    }
    case "vimeo": {
      if (!xi.test(n.id)) return null;
      const s = new URLSearchParams({ autoplay: e, dnt: "1" });
      return n.hash && _i.test(n.hash) && s.set("h", n.hash), `https://player.vimeo.com/video/${n.id}?${s}${n.start ? `#t=${n.start}s` : ""}`;
    }
    case "loom": {
      if (!Qa.test(n.id)) return null;
      const s = new URLSearchParams({ autoplay: e, hide_owner: "true", hideEmbedTopBar: "true" });
      return n.start && s.set("t", String(n.start)), `https://www.loom.com/embed/${n.id}?${s}`;
    }
    default:
      return null;
  }
}
const Tf = /^(?:https:\/\/[^\s"'<>]+|\/sbimages\/media-posters(?:\/|%2F)(?!.*(?:\.\.|%2e%2e))[^\s"'<>\\]*)$/i, Fo = (n, t) => typeof n != "string" ? void 0 : n.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, t) || void 0, Uo = (n) => typeof n == "number" && Number.isFinite(n) && n > 0 && n <= 1e4 ? Math.round(n) : void 0;
function tc(n) {
  if (!n || typeof n != "object" || Array.isArray(n)) return { ok: !1, message: "must be an object with the video's url." };
  const t = n, e = ["url", "provider", "id", "hash", "start", "title", "author", "poster", "posterWidth", "posterHeight"], s = Object.keys(t).filter((h) => !e.includes(h));
  if (s.length) return { ok: !1, message: `has fields it does not take: ${s.join(", ")}.` };
  const i = _s(t.url);
  if (!i) return { ok: !1, message: "url must be a YouTube, Vimeo or Loom video address." };
  if (t.provider !== void 0 && t.provider !== i.provider) return { ok: !1, message: "provider does not match the url." };
  if (t.id !== void 0 && t.id !== i.id) return { ok: !1, message: "id does not match the url." };
  if (t.poster !== void 0 && (typeof t.poster != "string" || t.poster.length > Mt.urlLength || !Tf.test(t.poster)))
    return { ok: !1, message: "poster must be an https address or a poster this app stored (/sbimages/media-posters/...)." };
  const o = t.start === void 0 ? i.start : Number.isSafeInteger(t.start) && t.start > 0 && t.start <= Mt.startSeconds ? t.start : NaN;
  if (Number.isNaN(o)) return { ok: !1, message: `start must be whole seconds from 1 to ${Mt.startSeconds}.` };
  const r = Fo(t.title, Mt.titleLength), a = Fo(t.author, Mt.authorLength), c = Uo(t.posterWidth), l = Uo(t.posterHeight);
  return {
    ok: !0,
    media: {
      ...i,
      ...o ? { start: o } : {},
      ...r ? { title: r } : {},
      ...a ? { author: a } : {},
      ...typeof t.poster == "string" ? { poster: t.poster } : {},
      ...c && l ? { posterWidth: c, posterHeight: l } : {}
    }
  };
}
function ec(n, t) {
  n.media = { ...t }, n.text = "", n.shape = "rectangle", n.vectorPath = "rectangle", n.shapeHint = "rectangle", n.imageFit = "cover", n.backgroundColor = "#111418", n.borderColor = "#111418", n.showTextTab = !1, t.poster ? (n.image = t.poster, n.imageOrigWidth = t.posterWidth || 480, n.imageOrigHeight = t.posterHeight || 360) : delete n.image;
}
function In(n) {
  if (!n || !vf.includes(n.provider)) return "Video";
  const t = Ka[n.provider];
  return n.title ? `Video: ${n.title} (${t})` : `${t} video`;
}
function ie(n = 10) {
  const t = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let e = "";
  for (let s = 0; s < n; s++)
    e += t.charAt(Math.floor(Math.random() * t.length));
  return e;
}
function oo(n) {
  function t(a) {
    return parseInt(a, 16) || 0;
  }
  function e(a) {
    const c = t(a) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }
  function s(a) {
    return 0.2126 * e(a.substr(1, 2)) + 0.7152 * e(a.substr(3, 2)) + 0.0722 * e(a.substr(-2));
  }
  function i(a, c) {
    const l = s(a), h = s(c);
    return (Math.max(l, h) + 0.05) / (Math.min(l, h) + 0.05);
  }
  const o = i(n || "#fff", "#ffffff"), r = i(n || "#fff", "#000000");
  return o > r ? "#ffffff" : "#000000";
}
function Mf(n, t = "normal 10pt Arial") {
  const e = String(n).split(`
`), s = t.split(" "), i = "normal", o = s?.[0]?.includes("pt") ? parseFloat(s?.[0]?.replace(/pt/gi, "")) : 10, r = s?.slice(1).join(" ").trim();
  if (typeof document > "u")
    return {
      width: Math.max(...e.map((d) => d.length)) * o * 0.6,
      height: e.length * o * 1.4 + 10
    };
  const a = document.createElement("canvas"), c = [], l = 0.98;
  if (e.forEach((d) => {
    const u = a.getContext("2d");
    if (!u) return;
    const f = o * l;
    u.font = `${i} ${f}pt ${r}`, c.push(u.measureText(d));
  }), a.remove(), c.length === 0)
    return {
      width: Math.max(...e.map((d) => d.length)) * o * 0.6,
      height: e.length * o * 1.4 + 10
    };
  let h = 0;
  return c.forEach((d) => {
    h += (d.actualBoundingBoxAscent || o) + (d.actualBoundingBoxDescent || o * 0.3) + 5;
  }), {
    width: Math.max(...c.map((d) => d.width)),
    height: h + 10
  };
}
function nc(n, t) {
  const e = (o) => {
    const r = (o || "").replace("#", "");
    if (r.length < 6) return 0;
    const a = (d) => {
      const u = d / 255;
      return u <= 0.03928 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4);
    }, c = a(parseInt(r.substr(0, 2), 16) || 0), l = a(parseInt(r.substr(2, 2), 16) || 0), h = a(parseInt(r.substr(4, 2), 16) || 0);
    return 0.2126 * c + 0.7152 * l + 0.0722 * h;
  }, s = e(n), i = e(t);
  return (Math.max(s, i) + 0.05) / (Math.min(s, i) + 0.05);
}
function kf(n) {
  return n?.path ? vs(n.path) : { x: 0, y: 0, x2: 100, y2: 100, width: 100, height: 100, cx: 50, cy: 50 };
}
function Nf(n, t) {
  return Ji(n, t);
}
function Rf(n, t) {
  const e = String(n).split(/ /g), i = String(n).split("").length / t, o = [];
  let r = [], a = 0;
  return e.forEach((c) => {
    a += c.length, a < i || o.length === t - 1 ? r.push(c) : (o.push(r.join(" ")), a = c.length, r = [c]);
  }), r.length > 0 && o.push(r.join(" ")), o.join(`
`);
}
function Pf(n, t) {
  return Math.floor(Math.random() * (t - n + 1)) + n;
}
function Of(n, t, e, s, i = !0) {
  if (!i)
    return { width: e, height: s };
  const o = Math.min(
    e / n,
    s / t
  );
  return {
    width: n * o,
    height: t * o
  };
}
function If(n) {
  return n.replace(/[^a-zA-Z0-9\s-]/g, "").replace(/\s+/g, "-").toLowerCase();
}
function Df(n) {
  return n instanceof HTMLElement || n instanceof SVGElement;
}
function Lf(n) {
  return typeof document > "u" ? null : document.getElementById(n);
}
function zf() {
  return typeof navigator > "u" ? !1 : /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
function Bf() {
  return typeof navigator > "u" ? !1 : /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}
function Gf(n) {
  n && (n.preventDefault(), n.stopPropagation());
}
function $f(n, t) {
  const e = [];
  for (let s = 0; s < n.length; s += t)
    e.push(n.slice(s, s + t));
  return e;
}
const Hf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  _transformPath: Nf,
  chunk: $f,
  contrastRatio: nc,
  createMultiLineText: Rf,
  el: Lf,
  getBBox: kf,
  getTextWidth: Mf,
  guid: ie,
  isElement: Df,
  isMobile: Bf,
  isSafari: zf,
  obtainProportionateWidthAndHeightForResizing: Of,
  randomInt: Pf,
  safeForUrls: If,
  stopEvent: Gf,
  whiteOrBlack: oo
}, Symbol.toStringTag, { value: "Module" })), Ff = ["text/uri-list", "text/plain"], Ls = /* @__PURE__ */ new Set();
let Fe = null;
function jo(n) {
  if (!n) return null;
  const t = String(n).split(/\r?\n/).map((e) => e.trim()).filter((e) => e && !e.startsWith("#"));
  return t.length !== 1 ? null : _s(t[0]) ? t[0] : null;
}
class sc {
  constructor(t, e = {}) {
    this.onPaste = null, this.onDragOver = null, this.onDrop = null, this.onPress = null, this.slate = t, this.options = { enabled: !0, ...e };
  }
  isEnabled() {
    return this.options.enabled && this.onPaste !== null;
  }
  updateOptions(t) {
    this.options = { ...this.options, ...t }, this.options.enabled ? this.enable() : this.disable();
  }
  /** Listen for pastes on the page and drops on this canvas. */
  enable() {
    if (this.options.enabled = !0, this.onPaste || typeof document > "u") return;
    this.onPaste = (e) => this.handlePaste(e), this.onDragOver = (e) => this.handleDragOver(e), this.onDrop = (e) => this.handleDrop(e), this.onPress = () => {
      Fe = this;
    }, document.addEventListener("paste", this.onPaste);
    const t = this.slate?.element;
    t?.addEventListener("dragover", this.onDragOver), t?.addEventListener("drop", this.onDrop), t?.addEventListener("pointerdown", this.onPress, !0), Ls.add(this);
  }
  disable() {
    this.options.enabled = !1, this.onPaste && document.removeEventListener("paste", this.onPaste);
    const t = this.slate?.element;
    this.onDragOver && t?.removeEventListener("dragover", this.onDragOver), this.onDrop && t?.removeEventListener("drop", this.onDrop), this.onPress && t?.removeEventListener("pointerdown", this.onPress, !0), this.onPaste = this.onDragOver = this.onDrop = null, this.onPress = null, Ls.delete(this), Fe === this && (Fe = null);
  }
  destroy() {
    this.disable(), this.slate = null;
  }
  /**
   * Make a media note for `url` with its centre at `at` (canvas coordinates; the
   * middle of the view when left out). False when the address is not a video a
   * note plays, or this viewer may not add notes.
   */
  add(t, e, s = "call") {
    const i = _s(t);
    if (!i || !this.canAdd()) return !1;
    const o = e ?? this.viewCentre(), r = { url: t, media: i, x: Math.round(o.x), y: Math.round(o.y), via: s }, a = this.slate.options?.events?.onMediaRequested;
    if (typeof a == "function")
      return a(r), !0;
    const c = {
      id: ie(),
      x: r.x - Ve.width / 2,
      y: r.y - Ve.height / 2,
      width: Ve.width,
      height: Ve.height
    };
    ec(c, i);
    const l = this.slate.addNode(c);
    try {
      this.slate.selectNodes?.([l], !1);
    } catch {
    }
    return !0;
  }
  // ─── Private ─────────────────────────────────────────────────────
  canAdd() {
    const t = this.slate;
    return !!t && t.options?.enabled !== !1 && !t.isReadOnly?.() && !t.isCommentOnly?.();
  }
  viewCentre() {
    const t = this.slate.element?.getBoundingClientRect?.();
    if (!t || !t.width) return { x: 0, y: 0 };
    try {
      return this.slate.clientToWorld({ x: t.left + t.width / 2, y: t.top + t.height / 2 });
    } catch {
      return { x: 0, y: 0 };
    }
  }
  /** A paste belongs to the canvas when focus is on the page itself or inside this canvas, never in a field. */
  ownsPaste(t) {
    const e = t;
    return !e || !this.slate?.element || e.tagName === "INPUT" || e.tagName === "TEXTAREA" || e.isContentEditable || e.closest?.('[role="dialog"], [aria-modal="true"]') ? !1 : this.slate.element.contains(e) ? !0 : e !== document.body && e !== document.documentElement ? !1 : Fe ? Fe === this : Ls.size === 1;
  }
  handlePaste(t) {
    if (!this.options.enabled || t.defaultPrevented || !this.ownsPaste(t.target) || this.slate.nodes?.allNodes?.some((s) => s?.editor?.isInlineEditing?.())) return;
    const e = jo(t.clipboardData?.getData("text/plain"));
    e && this.add(e, void 0, "paste") && t.preventDefault();
  }
  dropped(t) {
    const e = t.dataTransfer;
    if (!e) return null;
    for (const s of Ff) {
      const i = jo(e.getData(s));
      if (i) return i;
    }
    return null;
  }
  handleDragOver(t) {
    if (!this.options.enabled || !this.canAdd()) return;
    Array.from(t.dataTransfer?.types ?? []).includes("text/uri-list") && (t.preventDefault(), t.dataTransfer && (t.dataTransfer.dropEffect = "copy"));
  }
  handleDrop(t) {
    if (!this.options.enabled || t.defaultPrevented) return;
    const e = this.dropped(t);
    if (!e) return;
    let s;
    try {
      s = this.slate.clientToWorld({ x: t.clientX, y: t.clientY });
    } catch {
      s = void 0;
    }
    this.add(e, s, "drop") && (t.preventDefault(), t.stopPropagation());
  }
}
class ic {
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
    const e = t.target;
    if (e?.closest?.(".sb-inline-editor")) {
      this.close();
      return;
    }
    const i = e?.closest?.("[data-node-id]")?.getAttribute?.("data-node-id");
    if (!i) {
      this.close();
      return;
    }
    const o = this.slate.nodes?.one?.(i);
    if (!o) return;
    if (t.preventDefault(), this.slate.governanceOf?.(o)) {
      this.close(), this.slate.selectNodes?.([o], !1);
      return;
    }
    (this.slate.getSelectedNodes?.() || []).includes(o) || this.slate.selectNodes?.([o], !1), this.open(t.clientX, t.clientY);
  }
  open(t, e) {
    this.close();
    const s = document.createElement("div");
    s.className = "sb-context-menu", s.style.cssText = "position:fixed;z-index:100000;background:#fff;border:1px solid #e3e5ea;border-radius:8px;box-shadow:0 6px 24px rgba(0,0,0,0.18);padding:4px 0;min-width:180px;font:13px/1.4 system-ui,-apple-system,sans-serif;color:#222;user-select:none;", s.style.left = `${t}px`, s.style.top = `${e}px`, this.targetNodes = [...this.slate.getSelectedNodes?.() || []].filter(
      (a) => !this.slate.governanceOf?.(a)
    );
    const i = this.targetNodes.length, o = [
      { label: "Bring to front", act: () => this.forEachTarget((a) => a.toFront?.()) },
      { label: "Send to back", act: () => this.forEachTarget((a) => a.toBack?.()) },
      { label: "Duplicate", act: () => this.duplicateTargets() },
      { label: "Delete", act: () => this.deleteTargets(), danger: !0 }
    ];
    i >= 2 && o.push(
      { divider: !0 },
      { label: "Align left", act: () => this.slate.alignNodes?.("left", this.targetNodes) },
      { label: "Align center", act: () => this.slate.alignNodes?.("centerH", this.targetNodes) },
      { label: "Align right", act: () => this.slate.alignNodes?.("right", this.targetNodes) },
      { label: "Align top", act: () => this.slate.alignNodes?.("top", this.targetNodes) },
      { label: "Align middle", act: () => this.slate.alignNodes?.("middle", this.targetNodes) },
      { label: "Align bottom", act: () => this.slate.alignNodes?.("bottom", this.targetNodes) }
    ), i >= 3 && o.push(
      { label: "Distribute horizontally", act: () => this.slate.distributeNodes?.("horizontal", this.targetNodes) },
      { label: "Distribute vertically", act: () => this.slate.distributeNodes?.("vertical", this.targetNodes) }
    );
    for (const a of o) {
      if (a.divider) {
        const l = document.createElement("div");
        l.style.cssText = "height:1px;background:#e3e5ea;margin:4px 0;", s.appendChild(l);
        continue;
      }
      const c = document.createElement("div");
      c.textContent = a.label || "", c.style.cssText = "padding:7px 16px;cursor:pointer;white-space:nowrap;" + (a.danger ? "color:#d32f2f;" : ""), c.addEventListener("mouseenter", () => {
        c.style.background = a.danger ? "#fdecea" : "#f2f4f7";
      }), c.addEventListener("mouseleave", () => {
        c.style.background = "";
      }), c.addEventListener("click", (l) => {
        l.stopPropagation();
        try {
          a.act?.();
        } catch {
        }
        this.close();
      }), s.appendChild(c);
    }
    document.body.appendChild(s), this.el = s;
    const r = s.getBoundingClientRect();
    r.right > window.innerWidth && (s.style.left = `${Math.max(4, window.innerWidth - r.width - 8)}px`), r.bottom > window.innerHeight && (s.style.top = `${Math.max(4, window.innerHeight - r.height - 8)}px`), this.boundDismiss = (a) => {
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
  /** Duplicate these notes (offset +20,+20, connections between them kept) and select the copies. */
  duplicate(t) {
    this.targetNodes = [...t], this.duplicateTargets();
  }
  /** Duplicate the target nodes offset (+20,+20); addNode broadcasts → persists. */
  duplicateTargets() {
    if (this.slate.isReadOnly?.() || this.slate.isCommentOnly?.()) return;
    const t = [], e = /* @__PURE__ */ new Map(), s = new Set(this.targetNodes.map((o) => o.id));
    for (const o of this.targetNodes) {
      let r;
      try {
        r = JSON.parse(JSON.stringify(o.options || {}));
      } catch {
        r = { ...o.options || {} };
      }
      const a = r.id;
      r.id = ie(), r.x = (r.x || 0) + 20, r.y = (r.y || 0) + 20, delete r.parentArrowForChildren, delete r.noChildArrowForChildren, delete r.associations;
      try {
        const c = this.slate.addNode?.(r);
        c && (t.push(c), a && e.set(a, c));
      } catch {
      }
    }
    const i = [];
    for (const o of this.targetNodes) {
      const r = o.relationships?.assocMap;
      if (r) {
        for (const a of r.values())
          if (s.has(a.childId)) {
            let c = {};
            try {
              c = JSON.parse(JSON.stringify(a));
            } catch {
              c = { ...a };
            }
            delete c.id, delete c.childId, delete c.parentId, i.push({
              parentSrcId: o.id,
              childSrcId: a.childId,
              data: c
            });
          }
      }
    }
    if (t.length > 0) {
      const o = () => {
        this.slate.selectNodes?.(t, !1);
        for (const a of i) {
          const c = e.get(a.parentSrcId), l = e.get(a.childSrcId);
          if (c && l)
            try {
              c.relationships?.addAssociation?.(l, a.data);
            } catch {
            }
        }
      }, r = t.map((a) => a?.ready).filter(Boolean);
      r.length ? Promise.all(r).then(o).catch(o) : setTimeout(o, 120);
    }
  }
}
const rn = class rn {
  constructor(t, e = {}) {
    this.boundHandler = null, this.clipboard = [], this.clipboardEdges = [], this.pasteCount = 0, this.nudgeFrom = null, this.nudgeTimer = null, this.slate = t, this.options = {
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
    const s = rn.isTypingKey(t), i = t.ctrlKey || t.metaKey;
    if (!(e instanceof Element && e !== document.body && e !== document.documentElement && !this.slate.element.contains(e) && (!i || e.closest(rn.MODAL_SURFACES))) && !this.offerKeyToPolicy(t) && !(s && t.key !== "?" && this.typeIntoSelected(t))) {
      if (i && !t.altKey) {
        const r = /^[a-z]$/i.test(t.key) ? t.key.toLowerCase() : t.code === "KeyZ" ? "z" : t.code === "KeyY" ? "y" : "";
        if (r === "z") {
          t.shiftKey ? this.redo(t) : this.undo(t);
          return;
        }
        if (r === "y" && !t.shiftKey) {
          this.redo(t);
          return;
        }
      }
      switch (t.key) {
        case "Delete":
        case "Backspace":
          this.deleteSelected(t);
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
        case "g":
        case "G":
          i && (t.preventDefault(), t.shiftKey ? this.slate.ungroupNodes?.() : this.slate.groupNodes?.());
          break;
        case "]":
          i && this.bringToFront(t);
          break;
        case "[":
          i && this.sendToBack(t);
          break;
        case "Escape":
          if (this.stopPlayingMedia()) {
            t.preventDefault();
            break;
          }
          this.deselect(t);
          break;
        case "?":
          console.log(
            `SlateboxJS Keyboard Shortcuts:
  Delete/Backspace — remove selected
  Ctrl+Z — undo
  Ctrl+Shift+Z or Ctrl+Y — redo
  Ctrl+A — select all
  Ctrl+C / Ctrl+V — copy / paste
  Ctrl+D — duplicate
  Ctrl+] / Ctrl+[ — bring to front / send to back
  Escape — deselect
  Arrow keys — nudge selected (Shift = larger step)
  Tab — focus next node
  Enter/Space — select focused node
  ? — show this help`
          ), this.slate.announce?.("Keyboard shortcuts reference logged to console");
          break;
        case "F2":
          this.startInlineEditSelected(t);
          break;
        case "Enter":
          if (t.repeat && e.matches("[data-node-id]") || this.startInlineEditSelected(t)) break;
          this.selectFocused(t);
          break;
        case " ":
          this.selectFocused(t);
          break;
        case "Tab":
          if (!t.shiftKey) {
            const r = this.slate.getSelectedNodes()[0];
            r?.svgGroup.node === e && r.focusFirstConnectionHandle() && t.preventDefault();
          }
          break;
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
          this.handleArrowKey(t);
          break;
      }
    }
  }
  deleteSelected(t) {
    const e = this.slate.getSelectedNodes();
    if (e.length === 0 || this.slate.isReadOnly?.() || this.slate.isCommentOnly?.()) return;
    t.preventDefault();
    const s = [...e].filter((i) => this.caps(i).canDelete !== !1);
    if (s.length !== 0) {
      for (const i of s)
        i.options?.isComment && !this.slate.canRemoveComments?.() || this.slate.removeNode(i.id);
      this.slate.clearSelection();
    }
  }
  /** What may be done to `node` (everything, unless a host policy governs it). */
  caps(t) {
    return this.slate.capabilitiesOf?.(t) ?? {};
  }
  /** Whether a host policy governs `node`. */
  governed(t) {
    return !!this.slate.governanceOf?.(t);
  }
  /** Give a key to the policy of the single selected governed note. True when it handled the key. */
  offerKeyToPolicy(t) {
    const e = this.slate.getSelectedNodes?.() ?? [];
    if (e.length !== 1) return !1;
    const s = e[0], i = this.slate.governanceOf?.(s);
    if (!i?.policy?.onKeyDown || s.editor?.isInlineEditing?.()) return !1;
    const o = this.slate;
    if (o.options?.enabled === !1 || o.isReadOnly?.() || o.isCommentOnly?.()) return !1;
    try {
      return i.policy.onKeyDown(s, t) === !0;
    } catch (r) {
      return console.warn("DRAG_POLICY: onKeyDown threw", r), !1;
    }
  }
  undo(t) {
    t.preventDefault(), typeof this.slate.undo == "function" ? this.slate.undo() : this.slate.undoRedo?.undo();
  }
  redo(t) {
    t.preventDefault(), typeof this.slate.redo == "function" ? this.slate.redo() : this.slate.undoRedo?.redo();
  }
  selectAll(t) {
    t.preventDefault();
    const e = this.slate.nodes.allNodes;
    e.length > 0 && this.slate.selectNodes(e, !1);
  }
  /** Stop every video playing on the slate; true when one was. */
  stopPlayingMedia() {
    let t = !1;
    for (const e of this.slate.nodes?.allNodes ?? [])
      e?.media?.isPlaying?.() && (e.media.stop(), t = !0);
    return t;
  }
  deselect(t) {
    if (t.preventDefault(), this.slate.getEnteredGroupId?.()) {
      this.slate.exitGroup?.();
      return;
    }
    this.slate.clearSelection();
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
    const s = e.id;
    return delete e.id, delete e.parentArrowForChildren, delete e.noChildArrowForChildren, delete e.associations, delete e.relationships, s && (e.__srcId = s), e;
  }
  /**
   * Capture the connectors whose BOTH endpoints are within `nodes` — the internal
   * edges of a selection. Duplicating/pasting a connected group must recreate these
   * between the copies (Miro parity), or the copies come out disconnected.
   */
  internalEdges(t) {
    const e = new Set(t.map((i) => i.id)), s = [];
    for (const i of t) {
      const o = i.relationships?.assocMap;
      if (o) {
        for (const r of o.values())
          if (e.has(r.childId)) {
            let a = {};
            try {
              a = JSON.parse(JSON.stringify(r));
            } catch {
              a = { ...r };
            }
            delete a.id, delete a.childId, delete a.parentId, s.push({ parentSrcId: i.id, childSrcId: r.childId, data: a });
          }
      }
    }
    return s;
  }
  /** Ctrl/Cmd+C — copy the selected nodes to the internal clipboard. */
  copySelected(t) {
    const e = (this.slate.getSelectedNodes?.() || []).filter(
      (s) => this.caps(s).canDuplicate !== !1
    );
    e.length !== 0 && (t.preventDefault(), this.clipboard = e.map((s) => this.snapshotNode(s)), this.clipboardEdges = this.internalEdges(e), this.pasteCount = 0, this.slate.announce?.(`Copied ${this.clipboard.length} node(s)`));
  }
  /** Ctrl/Cmd+V — paste the clipboard nodes (offset), then select the copies. */
  pasteClipboard(t) {
    this.clipboard.length !== 0 && (t.preventDefault(), this.pasteCount++, this.createCopies(this.clipboard, 20 * this.pasteCount, this.clipboardEdges));
  }
  /** Ctrl/Cmd+] — bring the selected node(s) to the front of the z-order. */
  bringToFront(t) {
    const e = (this.slate.getSelectedNodes?.() || []).filter((s) => !this.governed(s));
    if (e.length !== 0) {
      t.preventDefault();
      for (const s of e) s.toFront?.();
    }
  }
  /** Ctrl/Cmd+[ — send the selected node(s) to the back of the z-order. */
  sendToBack(t) {
    const e = (this.slate.getSelectedNodes?.() || []).filter((s) => !this.governed(s));
    if (e.length !== 0) {
      t.preventDefault();
      for (const s of e) s.toBack?.();
    }
  }
  /** Ctrl/Cmd+D — duplicate the current selection in place (offset). */
  duplicateSelected(t) {
    const e = (this.slate.getSelectedNodes?.() || []).filter(
      (i) => this.caps(i).canDuplicate !== !1
    );
    if (e.length === 0) return;
    t.preventDefault();
    const s = e.map((i) => this.snapshotNode(i));
    this.createCopies(s, 20, this.internalEdges(e));
  }
  /**
   * Create fresh nodes from option snapshots, offset by (offset,offset) and each
   * given a new id, then select the new nodes. addNode() broadcasts onNodeAdded,
   * so copies persist + sync to collab peers like any other added node.
   */
  createCopies(t, e, s = []) {
    if (this.slate.isReadOnly?.() || this.slate.isCommentOnly?.()) return;
    const i = [], o = /* @__PURE__ */ new Map();
    for (const r of t) {
      const a = { ...r }, c = a.__srcId;
      delete a.__srcId, a.id = ie(), a.x = (a.x || 0) + e, a.y = (a.y || 0) + e;
      try {
        const l = this.slate.addNode(a);
        l && (i.push(l), c && o.set(c, l));
      } catch {
      }
    }
    if (i.length > 0) {
      const r = () => {
        this.slate.selectNodes?.(i, !1);
        for (const c of s) {
          const l = o.get(c.parentSrcId), h = o.get(c.childSrcId);
          if (l && h)
            try {
              l.relationships?.addAssociation?.(h, c.data);
            } catch {
            }
        }
      }, a = i.map((c) => c?.ready).filter(Boolean);
      a.length ? Promise.all(a).then(r).catch(r) : setTimeout(r, 120), this.slate.announce?.(`Pasted ${i.length} node(s)`);
    }
  }
  nudge(t, e, s) {
    const i = this.slate.getSelectedNodes().filter((o) => !this.governed(o));
    if (i.length === 0) {
      s.preventDefault();
      return;
    }
    s.preventDefault(), this.nudgeTimer || (this.nudgeFrom = new Map(i.map((o) => [o, { x: o.options.x || 0, y: o.options.y || 0 }])));
    for (const o of i) {
      const r = (o.options.x || 0) + t, a = (o.options.y || 0) + e;
      o.position(r, a);
    }
    this.nudgeTimer && clearTimeout(this.nudgeTimer), this.nudgeTimer = setTimeout(() => {
      this.nudgeTimer = null;
      const o = (this.slate.getSelectedNodes?.() || []).filter((c) => !this.governed(c)), r = this.nudgeFrom;
      this.nudgeFrom = null;
      const a = o.length === 1 ? r?.get(o[0]) : void 0;
      if (a) {
        const c = o[0], l = { x: (c.options.x || 0) + (c.options.width || 0) / 2, y: (c.options.y || 0) + (c.options.height || 0) / 2 }, h = this.slate.offerFreeDrop?.(c, l, a);
        if (h === "refused" && c.position(a.x, a.y, () => this.slate.updateSelectionResizeRotate?.()), h) return;
      }
      o.length > 0 && this.slate.broadcast?.("onNodesMove", {
        nodeOptions: o.map((c) => nt(c.options))
      });
    }, 250);
  }
  handleArrowKey(t) {
    if (this.slate.getSelectedNodes().length > 0) {
      const s = this.options.nudgeDistance, i = t.shiftKey ? s * 4 : s;
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
      const s = this.slate.getAllNodes().filter((a) => this.caps(a).canSelect !== !1);
      if (s.length === 0) return;
      const i = document.activeElement, o = s.findIndex((a) => a.svgGroup?.node === i);
      let r = o;
      t.key === "ArrowRight" || t.key === "ArrowDown" ? r = o < 0 ? 0 : Math.min(o + 1, s.length - 1) : r = o < 0 ? s.length - 1 : Math.max(o - 1, 0), r >= 0 && r < s.length && (t.preventDefault(), s[r].svgGroup?.node?.focus());
    }
  }
  selectFocused(t) {
    const e = document.activeElement, i = this.slate.getAllNodes().find((o) => o.svgGroup?.node === e);
    i && (t.preventDefault(), this.slate.selectNodes([i], !1));
  }
  /** A key press that produces one character of text, with no Ctrl/Cmd/Alt chord. */
  static isTypingKey(t) {
    return t.ctrlKey || t.metaKey || t.altKey || t.isComposing ? !1 : typeof t.key == "string" && Array.from(t.key).length === 1;
  }
  /**
   * Type-to-edit: with exactly one editable note selected and no editor open, a
   * character key opens the note's editor with the caret after its existing text and
   * types that character there. It appends; it never replaces what the note says.
   *
   * Returns false (leaving the key to its existing meaning) for read-only and
   * comment-only viewers, locked notes, comments, artwork and multi-selections, and
   * whenever keyboard focus is on some other control of the canvas.
   */
  typeIntoSelected(t) {
    if (t.defaultPrevented) return !1;
    const e = this.slate.getSelectedNodes?.() ?? this.slate.selectedNodes ?? [];
    if (e.length !== 1) return !1;
    const s = e[0];
    if (!s?.canEditTextInline?.() || s.editor?.isInlineEditing?.()) return !1;
    const i = t.target, o = s.svgGroup?.node, r = !!o && o.contains(i), a = i === document.body || i === document.documentElement || i === this.slate.element || i === this.slate.canvas?.node;
    return !r && !a || t.key === " " && !a ? !1 : (t.preventDefault(), s.editor.startInline({ caret: "end", insert: t.key, heldKey: t.key }) === !0);
  }
  /**
   * If exactly one node is selected, begin inline text editing on it.
   * Returns true when it started an edit (so callers can stop falling through).
   * Skips SVG-content nodes (they have no editable text).
   */
  startInlineEditSelected(t) {
    const e = this.slate.selectedNodes || [];
    if (e.length !== 1) return !1;
    const s = e[0];
    if (s?.media?.hasMedia?.())
      return t.preventDefault(), s.media.play(), !0;
    if (!s?.editor?.startInline || s.nestedSvg) return !1;
    const i = this.slate;
    return s.options?.isLocked || i?.capabilitiesOf?.(s).canEditText === !1 || i?.options?.enabled === !1 || i?.isReadOnly?.() || i?.isCommentOnly?.() && !s.options?.isComment ? !1 : (t.preventDefault(), s.editor.startInline(), !0);
  }
};
rn.MODAL_SURFACES = '[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"], [aria-modal="true"]';
let es = rn;
class oc {
  constructor(t) {
    this.steps = [], this.currentStep = -1, this.isActive = !1, this.zoomLevel = 1.5, this._animRaf = null, this.slate = t;
  }
  /**
   * The notes a presentation may stop at. Decoration a host draws behind or beside
   * its own notes (a drag policy's `canSelect: false`: a workshop's lane columns and
   * captions) is scenery, never a stop.
   */
  stops() {
    const t = this.slate.nodes?.allNodes || [];
    return typeof this.slate.capabilitiesOf != "function" ? [...t] : t.filter((e) => this.slate.capabilitiesOf(e).canSelect !== !1);
  }
  /**
   * Extract presentation layout from current nodes.
   * Orders nodes by their _presentationIndex or by position (top-to-bottom, left-to-right).
   */
  extractLayout(t) {
    let e = this.stops();
    if (t?.nodeIds) {
      const s = new Set(t.nodeIds);
      e = e.filter((i) => s.has(i.id));
    }
    return e.sort((s, i) => {
      const o = s.options._presentationIndex, r = i.options._presentationIndex;
      if (o !== void 0 && r !== void 0) return o - r;
      const a = (s.options.y || 0) - (i.options.y || 0);
      return Math.abs(a) > 30 ? a : (s.options.x || 0) - (i.options.x || 0);
    }), this.steps = e.map((s, i) => ({
      nodeId: s.id,
      index: i
    })), this.steps;
  }
  /**
   * Build the hierarchical presentation layout (preziData) — a tree of root
   * nodes → children with per-node metrics + descriptions. This is the structure
   * the AI consumes to decide the presentation ORDER (ported from v1
   * slate.extractPresentationLayout). Bbox is relative to `orientData`'s left/top
   * when the host gives it (as v1 did: the origin of the SVG export the host
   * plays the presentation over), otherwise to the stops' own top-left.
   */
  extractPresentationLayout(t = {}) {
    const e = this.stops().filter((m) => !m.options?.isCategory);
    let s = 1 / 0, i = 1 / 0, o = -1 / 0, r = -1 / 0;
    e.forEach((m) => {
      const g = m.options || {};
      s = Math.min(s, g.x || 0), i = Math.min(i, g.y || 0), o = Math.max(o, (g.x || 0) + (g.width || 0)), r = Math.max(r, (g.y || 0) + (g.height || 0));
    }), isFinite(s) || (s = 0, i = 0, o = 0, r = 0);
    const a = t?.orientData, c = {
      left: Number.isFinite(a?.left) ? a.left : s,
      top: Number.isFinite(a?.top) ? a.top : i,
      width: o - s,
      height: r - i
    }, l = new Map(e.map((m) => [m.id, m])), h = (m) => (m.relationships?.associations || []).map((g) => g.childId).filter((g) => l.has(g)), d = new Set(e.flatMap(h)), u = /* @__PURE__ */ new Set(), f = (m) => {
      if (u.has(m.id)) return null;
      u.add(m.id);
      const g = m.options || {}, y = h(m).map((b) => l.get(b)).filter(Boolean);
      return {
        nodeId: m.id,
        metrics: {
          rotation: Math.ceil(g.rotate?.rotationAngle || 0),
          bbox: {
            x: Number(((g.x || 0) - c.left).toFixed(2)),
            y: Number(((g.y || 0) - c.top).toFixed(2)),
            width: Number((g.width || 0).toFixed(2)),
            height: Number((g.height || 0).toFixed(2))
          }
        },
        description: g.text || g.description || "",
        image: g.image,
        numberOfChildrenNodes: y.length,
        childrenNodes: y.map(f).filter(Boolean)
      };
    }, p = e.filter((m) => !d.has(m.id)).map(f);
    for (const m of e)
      u.has(m.id) || p.push(f(m));
    return {
      presentationHeight: Math.ceil(c.height),
      presentationWidth: Math.ceil(c.width),
      nodes: p
    };
  }
  /**
   * Set the step order explicitly (e.g. from the AI's returned ordering). IDs
   * that don't exist are skipped; any nodes the AI omitted are appended in the
   * default layout order so nothing is lost.
   */
  setStepOrder(t) {
    const e = new Set(this.stops().map((o) => o.id)), s = /* @__PURE__ */ new Set(), i = [];
    return (t || []).forEach((o) => {
      e.has(o) && !s.has(o) && (s.add(o), i.push(o));
    }), this.extractLayout().forEach((o) => {
      s.has(o.nodeId) || (s.add(o.nodeId), i.push(o.nodeId));
    }), this.steps = i.map((o, r) => ({ nodeId: o, index: r })), this.currentStep = -1, this.steps;
  }
  /** Start presentation mode */
  start(t = 450) {
    this.steps.length === 0 && this.extractLayout(), this.isActive = !0, this.currentStep = -1, this.next(t);
  }
  /** Stop presentation mode */
  stop() {
    this.stopMedia(), this.isActive = !1, this.currentStep = -1, this._animRaf !== null && (cancelAnimationFrame(this._animRaf), this._animRaf = null);
  }
  /** Stop every video playing on the slate (media notes play only while their step shows). */
  stopMedia() {
    for (const t of this.slate.nodes?.allNodes ?? []) t?.media?.stop?.();
  }
  /** Go to next step */
  next(t = 450) {
    return this.currentStep >= this.steps.length - 1 ? !1 : (this.currentStep++, this.goToStep(this.currentStep, t), !0);
  }
  /** Go to previous step */
  previous(t = 450) {
    return this.currentStep <= 0 ? !1 : (this.currentStep--, this.goToStep(this.currentStep, t), !0);
  }
  /**
   * Go to a specific step, smoothly panning+zooming the viewport so the step's
   * node is centered (P3). Pass duration 0 for an instant jump.
   */
  goToStep(t, e = 450) {
    if (t < 0 || t >= this.steps.length) return;
    this.stopMedia(), this.currentStep = t;
    const s = this.steps[t], i = this.slate.nodes.one(s.nodeId);
    if (i)
      try {
        const o = i.options, r = o.width || 0, a = o.height || 0, c = (o.x || 0) + r / 2, l = (o.y || 0) + a / 2, d = this.slate.canvas.viewbox(), u = this.slate.panZoom.getViewportSize(), f = (o.rotate?.rotationAngle || 0) * Math.PI / 180, p = Math.abs(Math.cos(f)), m = Math.abs(Math.sin(f)), g = Math.max(1, r * p + a * m), y = Math.max(1, a * p + r * m), b = Math.min(
          this.zoomLevel > 0 ? this.zoomLevel : 1,
          0.9 * u.w / g,
          0.9 * u.h / y
        ), x = u.w / b, C = u.h / b, v = { x: c - x / 2, y: l - C / 2, width: x, height: C };
        this.animateViewbox(
          { x: d.x, y: d.y, width: d.width, height: d.height },
          v,
          e
        );
      } catch {
      }
  }
  /** Tween the canvas viewbox from → to over `duration` ms (easeInOutQuad). */
  animateViewbox(t, e, s) {
    const i = this.slate.canvas, o = (l, h, d, u) => {
      try {
        i.viewbox(l, h, d, u);
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
    if (!s || s <= 0 || typeof requestAnimationFrame > "u") {
      o(e.x, e.y, e.width, e.height);
      return;
    }
    const r = (l) => l < 0.5 ? 2 * l * l : 1 - Math.pow(-2 * l + 2, 2) / 2;
    let a = null;
    const c = (l) => {
      a === null && (a = l);
      const h = Math.min(1, (l - a) / s), d = r(h);
      o(
        t.x + (e.x - t.x) * d,
        t.y + (e.y - t.y) * d,
        t.width + (e.width - t.width) * d,
        t.height + (e.height - t.height) * d
      ), h < 1 ? this._animRaf = requestAnimationFrame(c) : this._animRaf = null;
    };
    this._animRaf = requestAnimationFrame(c);
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
const Lt = "http://www.w3.org/2000/svg", Yo = "http://www.w3.org/1999/xhtml", Dn = Object.freeze({
  overlay: "media-note-overlay",
  play: "media-note-play",
  player: "media-note-player",
  close: "media-note-close"
}), Uf = "allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox", jf = "autoplay; encrypted-media; picture-in-picture; fullscreen", Ln = (n, t, e) => Math.max(t, Math.min(e, n));
function Yf(n, t, e) {
  const s = Math.max(1, Math.floor(t / (e * 0.56)));
  return n.length <= s ? n : `${n.slice(0, Math.max(1, s - 1)).trimEnd()}…`;
}
class rc {
  constructor(t) {
    this.enabled = !0, this.overlay = null, this.playButton = null, this.player = null, this.closeButton = null, this.node = t;
  }
  // ─── Isolated class contract ─────────────────────────────────────
  enable() {
    this.enabled = !0;
  }
  /** Stops any playback; the poster stays drawn. */
  disable() {
    this.stop(), this.enabled = !1;
  }
  isEnabled() {
    return this.enabled;
  }
  /** Store a new video on the note and draw it. */
  updateOptions(t) {
    t ? this.node.options.media = { ...t } : delete this.node.options.media, this.render();
  }
  // ─── Reading ─────────────────────────────────────────────────────
  get() {
    const t = this.node?.options?.media;
    return t && typeof t == "object" && t.provider && t.id ? t : null;
  }
  hasMedia() {
    return this.get() !== null;
  }
  isPlaying() {
    return this.player !== null;
  }
  /**
   * Whether this note may play here. A host that draws a still picture of a slate
   * (a slate's card, a gallery tile, a draft, a presenter's overview) sets the
   * slate option `mediaPlayback: false`: the note shows its poster, play button
   * and caption, and pressing it does nothing (a press opens what the picture
   * stands for, as on any other note).
   */
  canPlay() {
    return this.enabled && this.node?.slate?.options?.mediaPlayback !== !1;
  }
  // ─── Drawing ─────────────────────────────────────────────────────
  /** Draw (or redraw, after a resize) the poster's play button and caption. */
  render() {
    this.removeOverlay();
    const t = this.get(), e = this.node?.svgGroup?.node;
    if (!t || !e) {
      this.player && this.stop();
      return;
    }
    const s = Number(this.node.options.width) || 0, i = Number(this.node.options.height) || 0;
    if (s <= 0 || i <= 0) return;
    const { x: o, y: r } = this.origin(), a = document.createElementNS(Lt, "g");
    a.setAttribute("class", Dn.overlay), a.setAttribute("data-media-provider", t.provider);
    const c = Ln(i * 0.075, 9, 18), l = Math.round(c * 0.8 * 10) / 10, h = Ln(s * 0.03, 6, 14), d = Math.round(c * 1.35 + l * 1.35 + h), u = i >= 70 && s >= 90;
    if (u) {
      const v = document.createElementNS(Lt, "rect");
      v.setAttribute("x", String(o)), v.setAttribute("y", String(r + i - d)), v.setAttribute("width", String(s)), v.setAttribute("height", String(d)), v.setAttribute("fill", "#000000"), v.setAttribute("fill-opacity", "0.58"), v.setAttribute("pointer-events", "none"), a.appendChild(v);
      const w = Ka[t.provider] || "Video", _ = [
        [t.title || `${w} video`, c, "700", "1"],
        [t.author ? `${w} · ${t.author}` : w, l, "500", "0.82"]
      ];
      let S = r + i - d + h / 2 + c;
      for (const [T, A, M, N] of _) {
        const R = document.createElementNS(Lt, "text");
        R.setAttribute("x", String(o + h)), R.setAttribute("y", String(Math.round(S * 10) / 10)), R.setAttribute("font-family", "Manrope, Arial, sans-serif"), R.setAttribute("font-size", String(A)), R.setAttribute("font-weight", M), R.setAttribute("fill", "#ffffff"), R.setAttribute("fill-opacity", N), R.setAttribute("pointer-events", "none"), R.textContent = Yf(T, s - h * 2, A), a.appendChild(R), S += A * 1.35;
      }
    }
    const f = Ln(Math.min(s, i) * 0.16, 12, 36), p = o + s / 2, m = r + (u ? (i - d) / 2 : i / 2), g = this.canPlay(), y = document.createElementNS(Lt, "g");
    y.setAttribute("class", Dn.play), g ? (y.setAttribute("role", "button"), y.setAttribute("tabindex", "0"), y.setAttribute("aria-label", `Play ${In(t)}`), y.setAttribute("style", "cursor:pointer")) : (y.setAttribute("aria-hidden", "true"), y.setAttribute("pointer-events", "none"));
    const b = document.createElementNS(Lt, "circle");
    b.setAttribute("cx", String(p)), b.setAttribute("cy", String(m)), b.setAttribute("r", String(f)), b.setAttribute("fill", "#000000"), b.setAttribute("fill-opacity", "0.62"), b.setAttribute("stroke", "#ffffff"), b.setAttribute("stroke-width", String(Ln(f * 0.09, 1.5, 3))), y.appendChild(b);
    const x = document.createElementNS(Lt, "path"), C = f * 0.42;
    x.setAttribute("d", `M ${p - C * 0.7} ${m - C} L ${p + C} ${m} L ${p - C * 0.7} ${m + C} Z`), x.setAttribute("fill", "#ffffff"), x.setAttribute("pointer-events", "none"), y.appendChild(x), a.appendChild(y), g && this.bindActivate(y, () => this.play()), e.appendChild(a), this.overlay = a, this.playButton = y, e.setAttribute("aria-label", In(t)), e.setAttribute("data-media-note", t.provider), this.player && (a.setAttribute("display", "none"), this.sizePlayer());
  }
  /** Redraw for a new size (Node.setSize calls this). */
  update() {
    this.hasMedia() && this.render();
  }
  // ─── Playing ─────────────────────────────────────────────────────
  /** Put the player over the poster and start it. Returns false when there is nothing to play. */
  play() {
    const t = this.get(), e = this.node?.svgGroup?.node;
    if (!this.canPlay() || !t || !e) return !1;
    if (this.player) return !0;
    const s = Af(t, { play: !0 });
    if (!s) return !1;
    const i = document.createElementNS(Lt, "foreignObject");
    i.setAttribute("class", Dn.player);
    const o = document.createElementNS(Yo, "div");
    o.setAttribute("style", "width:100%;height:100%;margin:0;padding:0;background:#000;overflow:hidden");
    const r = document.createElementNS(Yo, "iframe");
    r.setAttribute("src", s), r.setAttribute("title", In(t)), r.setAttribute("sandbox", Uf), r.setAttribute("allow", jf), r.setAttribute("allowfullscreen", ""), r.setAttribute("referrerpolicy", "strict-origin-when-cross-origin"), r.setAttribute("style", "width:100%;height:100%;border:0;display:block"), o.appendChild(r), i.appendChild(o), e.appendChild(i), this.player = i;
    const a = document.createElementNS(Lt, "g");
    a.setAttribute("class", Dn.close), a.setAttribute("role", "button"), a.setAttribute("tabindex", "0"), a.setAttribute("aria-label", "Stop the video"), a.setAttribute("style", "cursor:pointer");
    const c = document.createElementNS(Lt, "circle");
    c.setAttribute("r", "11"), c.setAttribute("fill", "#000000"), c.setAttribute("fill-opacity", "0.72"), c.setAttribute("stroke", "#ffffff"), c.setAttribute("stroke-width", "1.5"), a.appendChild(c);
    const l = document.createElementNS(Lt, "path");
    return l.setAttribute("d", "M -4 -4 L 4 4 M 4 -4 L -4 4"), l.setAttribute("stroke", "#ffffff"), l.setAttribute("stroke-width", "2"), l.setAttribute("stroke-linecap", "round"), l.setAttribute("pointer-events", "none"), a.appendChild(l), e.appendChild(a), this.closeButton = a, this.bindActivate(a, () => this.stop()), this.overlay && this.overlay.setAttribute("display", "none"), this.sizePlayer(), this.node.slate?.announce?.(`Playing ${In(t)}`), !0;
  }
  /** Take the player away and show the poster again. */
  stop() {
    const t = this.player !== null;
    if (this.player?.remove(), this.player = null, this.closeButton?.remove(), this.closeButton = null, this.overlay && this.overlay.removeAttribute("display"), t)
      try {
        this.playButton?.focus?.({ preventScroll: !0 });
      } catch {
      }
  }
  toggle() {
    this.player ? this.stop() : this.play();
  }
  destroy() {
    this.stop(), this.removeOverlay(), this.node = null;
  }
  // ─── Private ─────────────────────────────────────────────────────
  /** Where the note's box starts inside its group (the background shape's corner). */
  origin() {
    const t = this.node.backgroundRect, e = Number(t?.x?.()) || 0, s = Number(t?.y?.()) || 0;
    return { x: e, y: s };
  }
  sizePlayer() {
    if (!this.player) return;
    const t = Number(this.node.options.width) || 0, e = Number(this.node.options.height) || 0, { x: s, y: i } = this.origin();
    this.player.setAttribute("x", String(s)), this.player.setAttribute("y", String(i)), this.player.setAttribute("width", String(t)), this.player.setAttribute("height", String(e)), this.closeButton?.setAttribute("transform", `translate(${s + t - 15} ${i + 15})`);
  }
  removeOverlay() {
    this.overlay?.remove(), this.overlay = null, this.playButton = null;
  }
  /**
   * A button on the note: a press never starts a drag of the note, and the action
   * runs on pointerup (the drag machinery captures the pointer, so no native click
   * follows), on a synthetic click, and on Enter or Space when it has focus.
   */
  bindActivate(t, e) {
    let s = -1 / 0;
    const i = (o) => {
      o.stopPropagation(), o.preventDefault?.();
      const r = typeof performance < "u" ? performance.now() : Date.now();
      r - s < 350 || (s = r, e());
    };
    t.addEventListener("pointerdown", (o) => o.stopPropagation()), t.addEventListener("pointerup", i), t.addEventListener("click", i), t.addEventListener("keydown", (o) => {
      const r = o.key;
      (r === "Enter" || r === " ") && i(o);
    });
  }
}
const Xf = { startLineTool: Qu }, Wf = { BirdsEye: Ya }, qf = { UndoRedo: Et }, Zf = { MediaInput: sc }, Vf = { ContextMenu: ic }, Kf = { Keyboard: es }, Jf = { Presentation: oc }, ac = { MediaNote: rc }, Qf = () => Xf, tp = () => Wf, ep = () => qf, np = () => Zf, sp = () => Vf, ip = () => Kf, op = () => Jf, rp = () => ac, ap = async () => ac, Ke = /* @__PURE__ */ new Set(), Se = /* @__PURE__ */ new Map(), cp = /* @__PURE__ */ new Set([
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
function lp(n) {
  const t = typeof document < "u" ? document.fonts : null;
  if (!t || typeof t.forEach != "function" || typeof t.load != "function") return !1;
  const e = n.toLowerCase();
  let s = !1;
  try {
    t.forEach((i) => {
      String(i?.family ?? "").replace(/['"]/g, "").trim().toLowerCase() === e && (s = !0);
    });
  } catch {
    return !1;
  }
  return s;
}
function ro(n) {
  const t = n.trim(), e = t.toLowerCase();
  if (cp.has(e) || Ke.has(e))
    return Promise.resolve();
  if (Se.has(e))
    return Se.get(e);
  const s = new Promise((i, o) => {
    if (typeof document > "u") {
      i();
      return;
    }
    const r = t.split(",")[0].trim().replace(/['"]/g, "");
    try {
      if (document.fonts?.check?.(`12px "${r}"`)) {
        Ke.add(e), i();
        return;
      }
    } catch {
    }
    if (lp(r)) {
      Promise.resolve(document.fonts.load(`12px "${r}"`)).catch(() => {
      }).then(() => {
        Ke.add(e), Se.delete(e), i();
      });
      return;
    }
    const a = document.createElement("link");
    a.rel = "stylesheet", a.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      r
    )}:wght@300;400;500;600;700&display=swap`, a.onload = () => {
      Ke.add(e), Se.delete(e), console.log("FONT_DEBUG: Loaded font:", r), i();
    }, a.onerror = () => {
      Se.delete(e), console.warn("FONT_DEBUG: Failed to load font:", r), i();
    }, document.head.appendChild(a);
  });
  return Se.set(e, s), s;
}
async function cc(n) {
  const t = /* @__PURE__ */ new Set(), e = n.nodes?.allNodes || [];
  for (const i of e)
    i.options?.fontFamily && t.add(i.options.fontFamily);
  const s = Array.from(t).map((i) => ro(i));
  await Promise.all(s), console.log("FONT_DEBUG: All fonts loaded:", Array.from(t));
}
function hp(n) {
  return Ke.has(n.toLowerCase().trim());
}
const dp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  isFontLoaded: hp,
  loadAllFonts: cc,
  loadFont: ro
}, Symbol.toStringTag, { value: "Module" }));
function up(n) {
  const t = n.textXAlign === "left" ? "left" : n.textXAlign === "right" ? "right" : "center", e = n.textYAlign === "top" ? "flex-start" : n.textYAlign === "bottom" ? "flex-end" : "center";
  return [
    "display:flex",
    `justify-content:${t === "left" ? "flex-start" : t === "right" ? "flex-end" : "center"}`,
    `align-items:${e}`,
    `text-align:${t}`
  ];
}
class lc {
  constructor(t) {
    this._inlineEditing = !1, this._inlineFO = null, this._inlineDiv = null, this._returnFocus = !1, this.node = t;
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
   * The edit in progress, or null. A load that replaces the slate's notes (an
   * undo or redo by someone else on the slate) destroys this note and its open
   * editor; the slate takes the draft first and opens it again on the note's new
   * copy (Slate.takeInlineDraft), so what the person was typing is not lost.
   */
  draft() {
    const t = this._inlineDiv;
    if (!this._inlineEditing || !t) return null;
    let e = null;
    try {
      const s = window.getSelection();
      if (s && s.rangeCount && t.contains(s.anchorNode)) {
        const i = s.getRangeAt(0), o = i.cloneRange();
        o.selectNodeContents(t), o.setEnd(i.startContainer, i.startOffset);
        const r = o.toString().length;
        e = { start: r, end: r + i.toString().length };
      }
    } catch {
    }
    return { text: (t.innerText || t.textContent || "").replace(/\n+$/, ""), selection: e, returnFocus: this._returnFocus };
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
   *
   * Opening the editor is local only: nothing is broadcast until a commit changes
   * the text. Returns true when an editor was opened by this call.
   */
  startInline(t = {}) {
    const e = this.node;
    if (this._inlineEditing || !e || e.nestedSvg || e.slate?.capabilitiesOf?.(e).canEditText === !1) return !1;
    const s = e.svgGroup?.node;
    if (!s) return !1;
    const i = t.returnFocus ?? document.activeElement === s, o = e.options.width || 100, r = e.options.height || 60, c = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "foreignObject"
    );
    c.setAttribute("x", "0"), c.setAttribute("y", "0"), c.setAttribute("width", String(o)), c.setAttribute("height", String(r)), c.style.overflow = "visible";
    const l = document.createElement("div");
    l.setAttribute("contenteditable", "true"), l.className = "sb-inline-editor", l.textContent = t.text ?? (e.options.text || "") + (t.insert ?? ""), l.style.cssText = [
      `width:${o}px`,
      `height:${r}px`,
      "box-sizing:border-box",
      // The box sits where the note draws its text, so typing never jumps to the centre.
      ...up(e.options),
      "outline:none",
      "padding:4px",
      "cursor:text",
      "word-break:break-word",
      "overflow:hidden",
      "white-space:pre-wrap",
      `font-family:${e.options.fontFamily || "Arial, sans-serif"}`,
      `font-size:${e.options.fontSize || 14}px`,
      `font-weight:${e.options.fontWeight === "bold" ? "bold" : "normal"}`,
      `color:${e.options.fontColor || "#000000"}`
    ].join(";"), c.appendChild(l), s.appendChild(c), this._inlineFO = c, this._inlineDiv = l, this._returnFocus = i, this._inlineEditing = !0, e.textElement?.hide?.();
    const h = (f, p = !1) => {
      if (!this._inlineEditing) return;
      this._inlineEditing = !1;
      const m = (l.innerText || "").replace(/\n+$/, ""), g = p && i && document.activeElement === l;
      try {
        c.remove();
      } catch {
      }
      if (this._inlineFO = null, this._inlineDiv = null, e.textElement?.show?.(), g)
        try {
          s.focus({ preventScroll: !0 });
        } catch {
        }
      const y = e.slate?.governanceOf?.(e);
      if (y) {
        const b = e.options.text || "";
        if (!f || m === b) return;
        let x;
        try {
          x = y.policy.onTextCommit?.(e, m, b);
        } catch (v) {
          console.warn("DRAG_POLICY: onTextCommit threw; keeping the old text", v), x = !1;
        }
        if (x === !1) return;
        const C = typeof x == "string" ? x : m;
        (e.options.text || "") !== C && e.setText?.(C);
        return;
      }
      if (f && m !== (e.options.text || "")) {
        const b = {
          type: "onNodeTextChanged",
          data: { id: e.id, text: m }
        }, x = e.slate, C = x?.collab;
        C?.invoke ? (C.invoke(b), typeof x.broadcast == "function" ? x.broadcast("onNodeTextChanged", b.data) : C.send?.(b)) : e.setText?.(m), x?.offerFreeTextCommit?.(e);
      }
    }, d = new Set(t.heldKey ? [t.heldKey] : []);
    l.addEventListener("keydown", (f) => {
      if (f.stopPropagation(), f.repeat && !d.has(f.key)) {
        f.preventDefault();
        return;
      }
      d.add(f.key), f.key === "Enter" && !f.shiftKey ? (f.preventDefault(), h(!0, !0)) : f.key === "Escape" && (f.preventDefault(), h(!1, !0));
    }), l.addEventListener("keyup", (f) => d.delete(f.key)), l.addEventListener("blur", () => h(!0));
    for (const f of ["pointerdown", "mousedown", "touchstart"])
      l.addEventListener(f, (p) => p.stopPropagation());
    const u = () => {
      try {
        if (!l.isConnected) return;
        l.focus(t.preventScroll ? { preventScroll: !0 } : void 0);
        const f = document.createRange();
        f.selectNodeContents(l);
        const p = l.firstChild;
        if (t.selection && p && p.nodeType === 3) {
          const g = (p.textContent || "").length;
          f.setStart(p, Math.min(t.selection.start, g)), f.setEnd(p, Math.min(Math.max(t.selection.end, t.selection.start), g));
        } else (t.selection || t.caret === "end") && f.collapse(!1);
        const m = window.getSelection();
        m?.removeAllRanges(), m?.addRange(f);
      } catch {
      }
    };
    return u(), setTimeout(() => {
      this._inlineEditing && this._inlineFO === c && document.activeElement !== l && u();
    }, 0), !0;
  }
  /** Cancel an in-progress inline edit without saving. */
  cancelInline() {
    if (this._inlineEditing) {
      this._inlineEditing = !1;
      try {
        this._inlineFO?.remove();
      } catch {
      }
      this._inlineFO = null, this._inlineDiv = null, this.node?.textElement?.show?.();
    }
  }
  /**
   * Set text content and properties on the node.
   * This is the primary method used by collaboration events
   * and the text editing pane.
   */
  async set(t, e, s, i, o, r, a) {
    t !== void 0 && (this.node.options.text = t), e !== void 0 && (this.node.options.fontSize = e), i !== void 0 && (this.node.options.fontColor = i), o !== void 0 && (this.node.options.textOpacity = o), r !== void 0 && (this.node.options.textXAlign = r), a !== void 0 && (this.node.options.textYAlign = a), s !== void 0 && s !== this.node.options.fontFamily && (this.node.options.fontFamily = s, await ro(s)), this.applyText();
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
      const t = this.node.textElement.bbox(), e = this.node.options.width || 100, s = this.node.options.height || 60;
      return {
        x: (e - t.width) / 2,
        y: (s - t.height) / 2
      };
    } catch {
      return { x: 0, y: 0 };
    }
  }
  // ─── Private ─────────────────────────────────────────────────────
  applyText() {
    if (!this.node.textElement) return;
    const { text: t, fontSize: e, fontFamily: s, fontColor: i, textOpacity: o } = this.node.options;
    this.node.textElement.text(t || ""), this.node.textElement.font({
      family: s || "Arial, sans-serif",
      size: e || 14,
      fill: i || "#000000",
      opacity: o ?? 1
    }), this.node.textElement.attr?.("font-weight", this.node.options.fontWeight === "bold" ? "bold" : null), typeof this.node.centerText == "function" && this.node.centerText(), this.node.slate?.options?.autoResizeNodesBasedOnText && this.autoResize();
  }
  autoResize() {
    if (this.node.textElement)
      try {
        const t = this.node.textElement.bbox(), e = 20, s = t.width + e * 2, i = t.height + e * 2, o = this.node.options.width || 100, r = this.node.options.height || 60;
        if (s > o || i > r) {
          const a = Math.max(o, s), c = Math.max(r, i);
          this.node.setSize(a, c);
        }
      } catch {
      }
  }
}
class hc {
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
const le = "0.6s cubic-bezier(0.4, 0, 0.2, 1) both", Ss = {
  mystery: {
    id: "sb-mystery",
    types: ["text", "vect"],
    display: "Mystery",
    description: "Gentle fade in with a subtle zoom",
    css: `.sb-animation-mystery{animation:sb-mystery ${le}}@keyframes sb-mystery{0%{opacity:0;transform:scale(1.2)}50%{opacity:.5;transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}`
  },
  fadeSlideUp: {
    id: "sb-fade-slide-up",
    types: ["text", "vect"],
    display: "Fade up",
    description: "Smooth upward entrance",
    css: `.sb-animation-fadeSlideUp{animation:sb-fade-slide-up ${le}}@keyframes sb-fade-slide-up{0%{opacity:0;transform:translateY(100%) rotateX(40deg)}100%{opacity:1;transform:translateY(0) rotateX(0)}}`
  },
  fadeSlideDown: {
    id: "sb-fade-slide-down",
    types: ["text", "vect"],
    display: "Fade down",
    description: "Smooth downward entrance",
    css: `.sb-animation-fadeSlideDown{animation:sb-fade-slide-down ${le}}@keyframes sb-fade-slide-down{0%{opacity:0;transform:translateY(-100%) rotateX(-40deg)}100%{opacity:1;transform:translateY(0) rotateX(0)}}`
  },
  bumpUpIn: {
    id: "sb-bump-up-in",
    types: ["text", "vect"],
    display: "Bump up",
    description: "Playful bounce from below",
    css: `.sb-animation-bumpUpIn{animation:sb-bump-up-in ${le}}@keyframes sb-bump-up-in{0%{opacity:0;transform:scale(.8) rotate(-3deg) translateY(100%)}55%{opacity:.8;transform:scale(1.1) rotate(2deg) translateY(-20%)}100%{opacity:1;transform:scale(1) translateY(0)}}`
  },
  bumpDownIn: {
    id: "sb-bump-down-in",
    types: ["text", "vect"],
    display: "Bump down",
    description: "Playful bounce from above",
    css: `.sb-animation-bumpDownIn{animation:sb-bump-down-in ${le}}@keyframes sb-bump-down-in{0%{opacity:0;transform:scale(.8) rotate(3deg) translateY(-100%)}55%{opacity:.8;transform:scale(1.1) rotate(-2deg) translateY(20%)}100%{opacity:1;transform:scale(1) translateY(0)}}`
  },
  impactSlide: {
    id: "sb-impact-slide",
    types: ["text", "vect"],
    display: "Impact slide",
    description: "Fast slide with a firm landing",
    css: ".sb-animation-impactSlide{animation:sb-impact-slide .6s cubic-bezier(.18,.89,.32,1.28) both}@keyframes sb-impact-slide{0%{opacity:0;transform:translateX(-200%) scale(2) skew(-25deg)}45%{opacity:1;transform:translateX(8%) scale(1.15) skew(8deg)}100%{opacity:1;transform:translateX(0) scale(1) skew(0)}}"
  },
  powerSmash: {
    id: "sb-power-smash",
    types: ["text", "vect"],
    display: "Power smash",
    description: "Dramatic drop with a spring finish",
    css: ".sb-animation-powerSmash{animation:sb-power-smash .6s cubic-bezier(.68,-.6,.32,1.6) both}@keyframes sb-power-smash{0%{opacity:0;transform:translateY(-150%) scale(.2)}25%{opacity:1;transform:translateY(0) scale(1.5)}55%{transform:scale(.8) rotate(-3deg)}100%{opacity:1;transform:scale(1) rotate(0)}}"
  },
  torqueWarp: {
    id: "sb-torque-warp",
    types: ["text", "vect"],
    display: "Torque warp",
    description: "Elastic horizontal twist",
    css: ".sb-animation-torqueWarp{animation:sb-torque-warp .6s cubic-bezier(.7,-.3,.1,1.3) both}@keyframes sb-torque-warp{0%{opacity:0;transform:translateX(-100%) scaleX(.1) skew(45deg)}45%{opacity:1;transform:translateX(10%) scaleX(1.3) skew(-12deg)}100%{opacity:1;transform:translateX(0) scaleX(1) skew(0)}}"
  },
  unroll: {
    id: "sb-unroll",
    types: ["text", "vect"],
    display: "Unroll",
    description: "Unfurls from the top",
    css: ".sb-animation-unroll{transform-origin:top;animation:sb-unroll .6s cubic-bezier(.33,1,.68,1) both}@keyframes sb-unroll{0%{opacity:0;transform:rotateX(-180deg) scaleY(.1)}60%{opacity:.8;transform:rotateX(-35deg) scaleY(.8)}100%{opacity:1;transform:rotateX(0) scaleY(1)}}"
  },
  smoke: {
    id: "sb-smoke",
    types: ["text", "vect"],
    display: "Smoke",
    description: "Soft blurred emergence",
    css: `.sb-animation-smoke{animation:sb-smoke ${le}}@keyframes sb-smoke{0%{opacity:0;transform:scale(1.5) rotate(5deg);filter:blur(10px)}55%{opacity:.75;transform:scale(1.1) rotate(-2deg);filter:blur(3px)}100%{opacity:1;transform:scale(1);filter:blur(0)}}`
  },
  fractured: {
    id: "sb-fractured",
    types: ["text", "vect"],
    display: "Fractured",
    description: "Sharp geometric reveal",
    css: `.sb-animation-fractured{animation:sb-fractured ${le}}@keyframes sb-fractured{0%{opacity:0;clip-path:polygon(50% 50%,50% 50%,50% 50%);transform:rotate(45deg) scale(.3)}55%{opacity:.7;clip-path:polygon(10% 0,90% 0,100% 100%,0 100%);transform:rotate(-8deg) scale(1.1)}100%{opacity:1;clip-path:polygon(0 0,100% 0,100% 100%,0 100%);transform:rotate(0) scale(1)}}`
  },
  flux: {
    id: "sb-flux",
    types: ["text", "vect"],
    display: "Flux",
    description: "Spinning elastic entrance",
    css: ".sb-animation-flux{animation:sb-flux .6s cubic-bezier(.68,-.6,.32,1.6) both}@keyframes sb-flux{0%{opacity:0;transform:scale(.1) rotate(180deg)}55%{opacity:.7;transform:scale(1.3) rotate(-25deg)}100%{opacity:1;transform:scale(1) rotate(0)}}"
  },
  springy: {
    id: "sb-springy",
    types: ["text", "vect"],
    display: "Springy",
    description: "Bouncy diagonal entrance",
    css: ".sb-animation-springy{animation:sb-springy .7s cubic-bezier(.37,0,.63,1) both}@keyframes sb-springy{0%{opacity:0;transform:scale(1.8) translate(80px,-80px)}35%{opacity:.5;transform:scale(.8) translate(-20px,20px)}70%{opacity:.8;transform:scale(1.1) translate(6px,-6px)}100%{opacity:1;transform:scale(1) translate(0,0)}}"
  },
  breathe: {
    id: "sb-breathe-slow",
    types: ["vect"],
    display: "Breathe",
    description: "Subtle continuous breathing",
    isInfinite: !0,
    css: ".sb-animation-breathe{animation:sb-breathe 4s ease-in-out infinite}@keyframes sb-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}"
  },
  pulse: {
    id: "sb-pulse",
    types: ["vect"],
    display: "Pulse",
    description: "Strong continuous pulse",
    isInfinite: !0,
    css: ".sb-animation-pulse{animation:sb-pulse .7s ease-in-out infinite}@keyframes sb-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.09)}}"
  },
  rotate: {
    id: "sb-rotate",
    types: ["vect"],
    display: "Rotate",
    description: "Smooth continuous rotation",
    isInfinite: !0,
    css: ".sb-animation-rotate{animation:sb-rotate 8s linear infinite}@keyframes sb-rotate{to{transform:rotate(360deg)}}"
  }
}, fp = ".sb-node-animation{transform-box:fill-box;transform-origin:center}", ao = "data-sb-animation-host", pp = "http://www.w3.org/2000/svg";
function mp(n, t) {
  return t.css + `svg.${ho(n)}{animation:none}`;
}
function dc(n) {
  return !!n && n.tagName?.toLowerCase() === "svg" && !!n.ownerSVGElement;
}
function co(n) {
  const e = (n?.node ?? n)?.parentNode;
  return e && e.nodeType === 1 && e.hasAttribute?.(ao) ? e : null;
}
function gp(n) {
  const t = co(n);
  if (t) return t;
  const e = n.ownerDocument.createElementNS(pp, "g");
  return e.setAttribute(ao, "1"), n.parentNode.insertBefore(e, n), e.appendChild(n), e;
}
function yp(n) {
  const t = co(n);
  !t || !t.parentNode || (t.parentNode.insertBefore(n, t), t.remove());
}
function bp(n) {
  const t = co(n);
  n?.remove?.(), t?.remove();
}
function vp(n) {
  if (!n || typeof n.getScreenCTM != "function") return null;
  const t = n.getScreenCTM();
  if (!t) return null;
  try {
    let e = n;
    for (; e && e.nodeType === 1; ) {
      if (e.hasAttribute?.(ao)) {
        const s = e, i = s.getScreenCTM(), o = s.parentNode?.getScreenCTM?.();
        return !i || !o ? t : o.multiply(i.inverse()).multiply(t);
      }
      if (e.tagName?.toLowerCase() === "svg" && !e.ownerSVGElement) break;
      e = e.parentNode;
    }
    if (n.classList?.contains("sb-node-animation") && !dc(n)) {
      const s = n.parentNode?.getScreenCTM?.();
      if (!s) return t;
      const i = n.transform?.baseVal?.consolidate?.()?.matrix;
      return i ? s.multiply(DOMMatrix.fromMatrix(i)) : s;
    }
  } catch {
  }
  return t;
}
function lo() {
  return { ...Ss };
}
function ho(n) {
  return `sb-animation-${n}`;
}
function wp(n) {
  const e = n?.root?.()?.defs?.();
  if (!e || e.findOne?.("#sb-node-animation-styles")) return;
  const s = e.element("style").id("sb-node-animation-styles");
  s.attr("type", "text/css"), s.node.textContent = fp + Object.entries(Ss).map(([i, o]) => mp(i, o)).join("");
}
function xp(n, t) {
  if (!n || !Ss[t]) return !1;
  wp(n), uc(n);
  const e = n.node;
  if (e) {
    const s = ["sb-node-animation", ho(t)];
    if (dc(e) && e.parentNode) {
      const i = gp(e);
      i.getBBox?.(), i.classList.add(...s);
    } else
      e.getBBox?.();
    e.classList.add(...s);
  }
  return !0;
}
function uc(n) {
  const t = n?.node;
  if (t) {
    for (const e of Object.keys(Ss)) t.classList.remove(ho(e));
    t.classList.remove("sb-node-animation"), yp(t);
  }
}
const kt = /* @__PURE__ */ new Map();
kt.set("dropShadow", {
  name: "dropShadow",
  types: ["text", "vect", "image", "line"],
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
kt.set("blur", {
  name: "blur",
  types: ["text", "vect", "image", "line"],
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
kt.set("outline", {
  name: "outline",
  types: ["text", "vect"],
  apply: (n) => {
    try {
      const t = n.attr("stroke"), e = n.attr("stroke-width");
      n.data("original-stroke", t || "#333"), n.data("original-stroke-width", e || 2);
      const s = n.attr("fill"), i = typeof s == "string" && /^#[0-9a-fA-F]{3,6}$/.test(s) ? oo(s) : "#ffffff";
      n.stroke({ color: i, width: 3 }), n.type === "text" && n.attr("paint-order", "stroke");
    } catch {
    }
  },
  remove: (n) => {
    try {
      n.stroke({
        color: n.data("original-stroke") || "#333",
        width: n.data("original-stroke-width") || 2
      }), n.attr("paint-order", null);
    } catch {
    }
  }
});
kt.set("postItNote", {
  name: "postItNote",
  types: ["text", "vect", "image", "line"],
  apply: (n) => {
    try {
      n.attr("filter", "drop-shadow(0 4px 2px rgba(0,0,0,0.5))");
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
kt.set("pencil", {
  name: "pencil",
  types: ["text", "vect", "image"],
  apply: (n) => {
    try {
      const e = n.root?.()?.defs?.();
      if (e && !e.findOne?.("#sb-pencil-filter")) {
        const s = e.element("filter").id("sb-pencil-filter");
        s.attr({
          x: "-10%",
          y: "-10%",
          width: "120%",
          height: "120%"
        }), s.node.innerHTML = '<feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="1" result="noise"/><feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="3" in="SourceGraphic" in2="noise"/>';
      }
      n.attr("filter", "url(#sb-pencil-filter)");
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
class fc {
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
    const s = kt.get(t);
    if (!s) {
      console.warn("FILTERS_DEBUG: Unknown filter:", t);
      return;
    }
    (e === "vect" || e === "both") && this.node.backgroundRect && s.apply(this.node.backgroundRect), (e === "text" || e === "both") && this.node.textElement && s.apply(this.node.textElement), this.activeFilters.add(t), this.node.options.filters || (this.node.options.filters = {}), (e === "vect" || e === "both") && (this.node.options.filters.vect = t), (e === "text" || e === "both") && (this.node.options.filters.text = t), console.log(
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
    const e = kt.get(t);
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
  /** Apply one exclusive animation to a node element. */
  applyAnimation(t, e) {
    const s = e === "text" ? this.node.textElement : this.node.backgroundRect;
    return xp(s, t) ? (this.node.options.animations || (this.node.options.animations = {}), this.node.options.animations[e] = t, !0) : !1;
  }
  /** Clear the animation from a node element without affecting filter effects. */
  removeAnimation(t) {
    const e = t === "text" ? this.node.textElement : this.node.backgroundRect;
    uc(e), this.node.options.animations && (this.node.options.animations[t] = void 0);
  }
  /**
   * Toggle filter visibility (hide/show without removing).
   */
  toggleVisibility(t) {
    if (this.hidden = t, t)
      for (const e of this.activeFilters) {
        const s = kt.get(e);
        s && (this.node.backgroundRect && s.remove(this.node.backgroundRect), this.node.textElement && s.remove(this.node.textElement));
      }
    else
      for (const e of this.activeFilters) {
        const s = kt.get(e);
        s && (this.node.backgroundRect && s.apply(this.node.backgroundRect), this.node.textElement && s.apply(this.node.textElement));
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
function Lg(n) {
  kt.set(n.name, n);
}
function zg() {
  return Array.from(kt.keys());
}
function pc() {
  const n = {};
  for (const [t, e] of kt)
    n[t] = { types: e.types || ["text", "vect"] };
  return n;
}
class mc {
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
const _p = (n) => typeof n == "string" && /^\s*[Mm]/.test(n);
function Si(n) {
  if (!_p(n)) return !1;
  try {
    const t = vs(n);
    if (![t.x, t.y, t.width, t.height].every(Number.isFinite)) return !1;
    const e = Math.max(t.width, t.height, 1);
    return Math.abs(t.x) > e || Math.abs(t.y) > e;
  } catch {
    return !1;
  }
}
function Xo(n) {
  if (!Si(n)) return n;
  try {
    const t = vs(n);
    return Ji(n, `T${-t.x},${-t.y}`) || n;
  } catch {
    return n;
  }
}
function Wo(n) {
  return n && (Si(n.vectorPath) && (n.vectorPath = Xo(n.vectorPath)), Si(n.shape) && (n.shape = Xo(n.shape)), n);
}
const tt = Object.freeze({
  /** Raw input characters. */
  maxInput: 8e3,
  /** Normalised output characters. */
  maxNormalized: 6e3,
  maxSegments: 300,
  maxParts: 24,
  maxMagnitude: 1e4,
  /** A sub-path whose end is this close to its start (of the larger side) is closed for you. */
  closeTolerance: 0.02,
  /** A side shorter than this fraction of the other is a line, not a shape. */
  minSideRatio: 0.05,
  /** The filled area must cover at least this much of the bounds. */
  minFill: 0.08,
  /** Text never touches an edge. */
  textBoxCap: 0.92,
  /** A smaller best box than this (each side) means text will not fit well. */
  minTextBox: 0.15,
  maxName: 60,
  /**
   * Flattened outline points, all parts together. Curves and arcs are drawn
   * with fewer steps when a path would go over it, so a check costs about the
   * same for every path the grammar allows.
   */
  maxPoints: 2400
}), ns = {
  empty: "The shape has no path.",
  bad_character: "The shape path may hold only path commands and plain numbers.",
  bad_syntax: "The shape path could not be read.",
  too_long: `The shape path is too long (at most ${tt.maxInput} characters).`,
  too_many_segments: `The shape has too many segments (at most ${tt.maxSegments}).`,
  too_many_parts: `The shape has too many parts (at most ${tt.maxParts}).`,
  bad_number: `The shape path has a number out of range (at most ${tt.maxMagnitude} either way).`,
  not_closed: "Every part of the shape must be closed.",
  degenerate: "The shape is too flat to hold a note.",
  too_thin: "The shape is too thin to hold a note.",
  bad_fill_rule: "The fill rule must be nonzero or evenodd.",
  bad_name: `The shape needs a name of 1 to ${tt.maxName} characters.`
}, Ue = (n) => ({ ok: !1, code: n, message: ns[n] });
class et extends Error {
  constructor(t) {
    super(ns[t]), this.code = t;
  }
}
const Sp = /^[MmLlHhVvCcSsQqTtAaZz0-9.,\s+-]*$/, Cp = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };
function Ep(n) {
  const t = [], e = /([MmLlHhVvCcSsQqTtAaZz])|([+-]?(?:\d+\.?\d*|\.\d+))|([\s,]+)/y;
  let s = 0;
  for (; s < n.length; ) {
    e.lastIndex = s;
    const i = e.exec(n);
    if (!i || i[0].length === 0) throw new et("bad_syntax");
    i[1] ? t.push(i[1]) : i[2] && t.push(i[2]), s = e.lastIndex;
  }
  return t;
}
function ss(n) {
  if (typeof n != "string" || !n.trim()) throw new et("empty");
  if (n.length > tt.maxInput) throw new et("too_long");
  if (!Sp.test(n)) throw new et("bad_character");
  const t = Ep(n), e = [];
  let s = null, i = 0, o = 0, r = 0, a = 0, c = null, l = null, h = 0, d = "", u = 0;
  const f = (y) => typeof y == "string" && /^[A-Za-z]$/.test(y), p = () => {
    const y = t[h];
    if (y === void 0 || f(y)) throw new et("bad_syntax");
    h++;
    const b = Number(y);
    if (!Number.isFinite(b)) throw new et("bad_syntax");
    if (Math.abs(b) > tt.maxMagnitude) throw new et("bad_number");
    return b;
  }, m = () => {
    const y = t[h];
    if (typeof y != "string" || f(y)) throw new et("bad_syntax");
    const b = y.replace(/^\+/, "")[0];
    if (b !== "0" && b !== "1") throw new et("bad_syntax");
    const x = y.replace(/^\+/, "").slice(1);
    return x ? t[h] = x : h++, b === "1" ? 1 : 0;
  }, g = (y) => {
    if (!s) throw new et("bad_syntax");
    if (s.push(y), ++u > tt.maxSegments) throw new et("too_many_segments");
  };
  for (; h < t.length; ) {
    const y = t[h];
    if (f(y))
      d = y, h++;
    else if (!d)
      throw new et("bad_syntax");
    const b = d === d.toLowerCase(), x = d.toUpperCase(), C = Cp[x];
    if (x === "Z") {
      g({ c: "Z" }), i = r, o = a, c = l = null, d = "";
      continue;
    }
    if (h >= t.length || f(t[h])) throw new et("bad_syntax");
    let v = !0;
    for (; h < t.length && !f(t[h]); ) {
      const w = b ? i : 0, _ = b ? o : 0;
      switch (x) {
        case "M": {
          const S = p() + w, T = p() + _;
          if (v) {
            if (e.length >= tt.maxParts) throw new et("too_many_parts");
            s = [], e.push(s), g({ c: "M", x: S, y: T }), r = S, a = T;
          } else
            g({ c: "L", x: S, y: T });
          i = S, o = T, c = l = null;
          break;
        }
        case "L": {
          const S = p() + w, T = p() + _;
          g({ c: "L", x: S, y: T }), i = S, o = T, c = l = null;
          break;
        }
        case "H": {
          const S = p() + w;
          g({ c: "L", x: S, y: o }), i = S, c = l = null;
          break;
        }
        case "V": {
          const S = p() + _;
          g({ c: "L", x: i, y: S }), o = S, c = l = null;
          break;
        }
        case "C": {
          const S = p() + w, T = p() + _, A = p() + w, M = p() + _, N = p() + w, R = p() + _;
          g({ c: "C", x1: S, y1: T, x2: A, y2: M, x: N, y: R }), c = { x: A, y: M }, l = null, i = N, o = R;
          break;
        }
        case "S": {
          const S = c ? 2 * i - c.x : i, T = c ? 2 * o - c.y : o, A = p() + w, M = p() + _, N = p() + w, R = p() + _;
          g({ c: "C", x1: S, y1: T, x2: A, y2: M, x: N, y: R }), c = { x: A, y: M }, l = null, i = N, o = R;
          break;
        }
        case "Q": {
          const S = p() + w, T = p() + _, A = p() + w, M = p() + _;
          g({ c: "Q", x1: S, y1: T, x: A, y: M }), l = { x: S, y: T }, c = null, i = A, o = M;
          break;
        }
        case "T": {
          const S = l ? 2 * i - l.x : i, T = l ? 2 * o - l.y : o, A = p() + w, M = p() + _;
          g({ c: "Q", x1: S, y1: T, x: A, y: M }), l = { x: S, y: T }, c = null, i = A, o = M;
          break;
        }
        case "A": {
          const S = Math.abs(p()), T = Math.abs(p()), A = p(), M = m(), N = m(), R = p() + w, P = p() + _;
          g({ c: "A", rx: S, ry: T, rot: A, large: M, sweep: N, x: R, y: P }), i = R, o = P, c = l = null;
          break;
        }
        default:
          throw new et("bad_syntax");
      }
      if (v = !1, C === 0) break;
    }
  }
  if (!e.length) throw new et("bad_syntax");
  return e;
}
function Ap(n, t, e, s = 12) {
  let { rx: i, ry: o } = e;
  const { x: r, y: a } = e;
  if (i === 0 || o === 0 || n === r && t === a) return [[r, a]];
  const c = e.rot * Math.PI / 180, l = Math.cos(c), h = Math.sin(c), d = (n - r) / 2, u = (t - a) / 2, f = l * d + h * u, p = -h * d + l * u, m = f * f / (i * i) + p * p / (o * o);
  if (m > 1) {
    const N = Math.sqrt(m);
    i *= N, o *= N;
  }
  const g = i * i * o * o - i * i * p * p - o * o * f * f, y = i * i * p * p + o * o * f * f;
  let b = Math.sqrt(Math.max(0, g / y));
  e.large === e.sweep && (b = -b);
  const x = b * i * p / o, C = -b * o * f / i, v = l * x - h * C + (n + r) / 2, w = h * x + l * C + (t + a) / 2, _ = (N, R, P, E) => Math.atan2(N * E - R * P, N * P + R * E), S = _(1, 0, (f - x) / i, (p - C) / o);
  let T = _((f - x) / i, (p - C) / o, (-f - x) / i, (-p - C) / o);
  !e.sweep && T > 0 && (T -= 2 * Math.PI), e.sweep && T < 0 && (T += 2 * Math.PI);
  const A = Math.max(2, Math.ceil(Math.abs(T) / (Math.PI / 2) * s)), M = [];
  for (let N = 1; N <= A; N++) {
    const R = S + T * N / A, P = i * Math.cos(R), E = o * Math.sin(R);
    M.push([l * P - h * E + v, h * P + l * E + w]);
  }
  return M[M.length - 1] = [r, a], M;
}
function is(n) {
  let t = 0, e = 0, s = 0;
  for (const h of n) for (const d of h)
    d.c === "C" || d.c === "Q" ? t++ : d.c === "A" ? e++ : d.c !== "Z" && s++;
  const i = s + t * 16 + e * 48, o = i > tt.maxPoints ? Math.max(0, tt.maxPoints - s) / Math.max(1, i - s) : 1, r = Math.max(2, Math.floor(16 * o)), a = Math.max(2, Math.floor(12 * o)), c = Math.max(0.5, 12 * o), l = [];
  for (const h of n) {
    const d = [];
    let u = 0, f = 0;
    for (const p of h) {
      switch (p.c) {
        case "M":
        case "L":
          d.push([p.x, p.y]);
          break;
        case "C":
          for (let m = 1; m <= r; m++) {
            const g = m / r, y = 1 - g;
            d.push([
              y * y * y * u + 3 * y * y * g * p.x1 + 3 * y * g * g * p.x2 + g * g * g * p.x,
              y * y * y * f + 3 * y * y * g * p.y1 + 3 * y * g * g * p.y2 + g * g * g * p.y
            ]);
          }
          break;
        case "Q":
          for (let m = 1; m <= a; m++) {
            const g = m / a, y = 1 - g;
            d.push([y * y * u + 2 * y * g * p.x1 + g * g * p.x, y * y * f + 2 * y * g * p.y1 + g * g * p.y]);
          }
          break;
        case "A":
          d.push(...Ap(u, f, p, c));
          break;
      }
      p.c !== "Z" ? (u = p.x, f = p.y) : d.length && ([u, f] = d[0]);
    }
    d.length && l.push(d);
  }
  return l;
}
function pn(n) {
  let t = 1 / 0, e = 1 / 0, s = -1 / 0, i = -1 / 0;
  for (const o of n)
    for (const [r, a] of o)
      r < t && (t = r), a < e && (e = a), r > s && (s = r), a > i && (i = a);
  return { x: t, y: e, w: s - t, h: i - e };
}
const Q = 48;
function Ci(n, t, e, s) {
  const i = [];
  for (const l of n)
    for (let h = 0, d = l.length; h < d; h++) {
      const [u, f] = l[h], [p, m] = l[(h + 1) % d];
      let g = 0;
      f <= t ? m > t && (g = 1) : m <= t && (g = -1), g && i.push([u + (t - f) * (p - u) / (m - f), g]);
    }
  i.sort((l, h) => l[0] - h[0]);
  const o = new Array(e.length);
  let r = 0, a = 0, c = i.length - 1;
  for (let l = e.length - 1; l >= 0; l--) {
    for (; c >= 0 && i[c][0] > e[l]; )
      r += i[c][1], a++, c--;
    o[l] = s === "evenodd" ? a % 2 === 1 : r !== 0;
  }
  return o;
}
function Tp(n, t) {
  const e = pn(n), s = (c) => Math.min(c, 0.99999) || 1e-5, i = Array.from({ length: Q + 1 }, (c, l) => e.x + s(l / Q) * e.w), o = Array.from({ length: Q }, (c, l) => e.x + (l + 0.5) / Q * e.w), r = [];
  for (let c = 0; c <= Q; c++) r[c] = Ci(n, e.y + s(c / Q) * e.h, i, t);
  const a = [];
  for (let c = 0; c < Q; c++) {
    const l = Ci(n, e.y + (c + 0.5) / Q * e.h, o, t);
    a[c] = [];
    for (let h = 0; h < Q; h++)
      a[c][h] = r[c][h] && r[c][h + 1] && r[c + 1][h] && r[c + 1][h + 1] && l[h];
  }
  return a;
}
function Mp(n, t) {
  const e = pn(n), s = Array.from({ length: Q }, (o, r) => e.x + (r + 0.5) / Q * e.w);
  let i = 0;
  for (let o = 0; o < Q; o++)
    for (const r of Ci(n, e.y + (o + 0.5) / Q * e.h, s, t)) r && i++;
  return i / (Q * Q);
}
const qo = (n) => n === "nonzero" || n === "evenodd";
function gc(n, t) {
  for (const e of n) {
    const s = e[e.length - 1];
    if (s.c === "Z") continue;
    const i = e[0], o = s;
    if (Math.hypot(o.x - i.x, o.y - i.y) > tt.closeTolerance * t) return !1;
    e.push({ c: "Z" });
  }
  return !0;
}
function kp(n, t = {}) {
  if (t.fillRule !== void 0 && !qo(t.fillRule)) return Ue("bad_fill_rule");
  const e = qo(t.fillRule) ? t.fillRule : "nonzero";
  let s;
  try {
    s = ss(n);
  } catch (r) {
    return Ue(r instanceof et ? r.code : "bad_syntax");
  }
  const i = is(s), o = pn(i);
  return !(o.w > 0) || !(o.h > 0) || Math.min(o.w, o.h) < tt.minSideRatio * Math.max(o.w, o.h) ? Ue("degenerate") : gc(s, Math.max(o.w, o.h)) ? Mp(i, e) < tt.minFill ? Ue("too_thin") : { ok: !0 } : Ue("not_closed");
}
const Np = (n) => {
  const t = Math.round(n * 10) / 10;
  return Object.is(t, -0) ? 0 : t;
}, je = (n) => String(Np(n));
function Rp(n, t, e) {
  let s = "";
  const i = (o, r) => {
    const [a, c] = t(o, r);
    return `${je(a)} ${je(c)}`;
  };
  for (const o of n)
    for (const r of o)
      switch (r.c) {
        case "M":
        case "L":
          s += `${r.c}${i(r.x, r.y)}`;
          break;
        case "C":
          s += `C${i(r.x1, r.y1)} ${i(r.x2, r.y2)} ${i(r.x, r.y)}`;
          break;
        case "Q":
          s += `Q${i(r.x1, r.y1)} ${i(r.x, r.y)}`;
          break;
        case "A":
          s += `A${je(r.rx * e)} ${je(r.ry * e)} ${je(r.rot)} ${r.large} ${r.sweep} ${i(r.x, r.y)}`;
          break;
        case "Z":
          s += "Z";
          break;
      }
  return s;
}
function Pp(n) {
  const t = ss(n), e = is(t), s = pn(e);
  if (!(s.w > 0) || !(s.h > 0)) throw new et("degenerate");
  if (!gc(t, Math.max(s.w, s.h))) throw new et("not_closed");
  const i = Math.max(s.w, s.h), o = Math.abs(s.x) <= 0.15 && Math.abs(s.y) <= 0.15 && Math.abs(i - 100) <= 0.3, r = o ? 1 : 100 / i, c = Rp(t, o ? (h, d) => [h, d] : (h, d) => [(h - s.x) * r, (d - s.y) * r], r);
  if (c.length > tt.maxNormalized) throw new et("too_long");
  const l = pn(is(ss(c)));
  if (!(l.w > 0) || !(l.h > 0) || l.w * l.h < s.w * r * (s.h * r) * 0.25) throw new et("degenerate");
  return { d: c, aspect: s.w / s.h };
}
function yc(n, t = "nonzero") {
  let e;
  try {
    e = is(ss(n));
  } catch {
    return null;
  }
  const i = Tp(e, t === "evenodd" ? "evenodd" : "nonzero"), o = new Array(Q).fill(0);
  let r = null;
  for (let f = 0; f < Q; f++) {
    for (let p = 0; p < Q; p++) o[p] = i[f][p] ? o[p] + 1 : 0;
    for (let p = 0; p < Q; p++) {
      let m = 1 / 0;
      for (let g = p; g < Q && o[g] > 0; g++) {
        m = Math.min(m, o[g]);
        const y = (g - p + 1) / Q, b = m / Q, x = y * b * Math.min(1, y / b);
        (!r || x > r.score) && (r = { score: x, x: p / Q, y: (f - m + 1) / Q, w: y, h: b });
      }
    }
  }
  if (!r || r.w < tt.minTextBox || r.h < tt.minTextBox) return null;
  const a = tt.textBoxCap;
  let { x: c, y: l, w: h, h: d } = r;
  h > a && (c += (h - a) / 2, h = a), d > a && (l += (d - a) / 2, d = a);
  const u = (f) => Math.round(f * 1e3) / 1e3;
  return { x: u(c), y: u(l), w: u(h), h: u(d) };
}
function zs(n) {
  if (typeof n != "string") return null;
  const t = n.replace(/[<>"'`\\\u0000-\u001f]/g, "").replace(/\s+/g, " ").trim();
  return t && t.length <= tt.maxName ? t : null;
}
const Ye = /* @__PURE__ */ new Map(), Op = 32;
function uo(n) {
  let t = null;
  try {
    t = JSON.stringify([n?.name ?? null, n?.d ?? null, n?.fillRule ?? null, n?.ref ?? null]);
  } catch {
    t = null;
  }
  if (t !== null && t.length <= tt.maxInput * 2 + 400) {
    const e = Ye.get(t);
    if (e) return Zo(e);
    const s = Vo(n);
    return Ye.size >= Op && Ye.delete(Ye.keys().next().value), Ye.set(t, s), Zo(s);
  }
  return Vo(n);
}
function Zo(n) {
  if (!n.ok) return { ...n };
  const { shape: t } = n;
  return {
    ok: !0,
    shape: { ...t, textBox: t.textBox ? { ...t.textBox } : null, ...t.ref ? { ref: { ...t.ref } } : {} }
  };
}
function Vo(n) {
  const t = zs(n?.name ?? "custom");
  if (!t) return { ok: !1, code: "bad_name", message: ns.bad_name };
  const e = kp(n?.d, { fillRule: n?.fillRule });
  if (!e.ok) return e;
  const s = n.fillRule === "evenodd" ? "evenodd" : "nonzero";
  let i;
  try {
    i = Pp(n.d);
  } catch (r) {
    const a = r instanceof et ? r.code : "bad_syntax";
    return { ok: !1, code: a, message: ns[a] };
  }
  const o = n.ref && typeof n.ref == "object" && typeof n.ref.id == "string" && /^[A-Za-z0-9_-]{1,64}$/.test(n.ref.id) ? { id: n.ref.id, ...zs(n.ref.name) ? { name: zs(n.ref.name) } : {} } : void 0;
  return {
    ok: !0,
    shape: {
      name: t,
      d: i.d,
      fillRule: s,
      aspect: Math.round(i.aspect * 1e3) / 1e3,
      textBox: yc(i.d, s),
      ...o ? { ref: o } : {}
    }
  };
}
function Ip(n, t) {
  n.shape = "custom", n.shapeHint = "custom", n.vectorPath = t.d, n.fillRule = t.fillRule, n.textBox = t.textBox, n.shapeRef = { ...t.ref || {}, name: t.name }, t.ref || delete n.shapeRef.id;
}
const Ko = Object.freeze({
  canMove: !0,
  canResize: !0,
  canRotate: !0,
  canDelete: !0,
  canDuplicate: !0,
  canConnect: !0,
  canEditText: !0,
  canSelect: !0,
  persist: !0,
  exportable: !0
}), Jo = Object.freeze({
  canMove: !0,
  canResize: !1,
  canRotate: !1,
  canDelete: !1,
  canDuplicate: !1,
  canConnect: !1,
  canEditText: !1,
  canSelect: !0,
  persist: !1,
  exportable: !0
});
function Bs() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
function Dp(n, t) {
  for (const e of n) {
    let s;
    try {
      s = e.governs(t);
    } catch (i) {
      console.warn("DRAG_POLICY: governs() threw; treating the note as governed", i), s = !0;
    }
    if (s)
      return {
        policy: e,
        capabilities: s === !0 ? Jo : { ...Jo, ...s }
      };
  }
  return null;
}
function Lp(n, t, e = 0) {
  let s = null;
  for (const i of t) {
    const o = i?.options;
    if (!o) continue;
    const r = o.width || 0, a = o.height || 0, c = (o.x || 0) + r / 2, l = (o.y || 0) + a / 2;
    let h = n.x - c, d = n.y - l;
    const u = o.rotate?.rotationAngle || 0;
    if (u) {
      const f = -u * Math.PI / 180, p = h * Math.cos(f) - d * Math.sin(f), m = h * Math.sin(f) + d * Math.cos(f);
      h = p, d = m;
    }
    Math.abs(h) > r / 2 + e || Math.abs(d) > a / 2 + e || (!s || zp(i, s)) && (s = i);
  }
  return s;
}
function zp(n, t) {
  const e = n.svgGroup?.node, s = t.svgGroup?.node;
  return !e || !s || typeof s.compareDocumentPosition != "function" ? !0 : (s.compareDocumentPosition(e) & 4) !== 0;
}
const Ce = Object.freeze({
  fontSize: 14,
  fontFamily: "Arial, sans-serif",
  fontColor: "#000000",
  borderColor: "#cccccc",
  borderWidth: 1,
  backgroundColor: "#f0f0f0"
}), Bp = Object.freeze({
  text: Object.freeze({
    shape: "rectangle",
    width: 270,
    height: 40,
    style: Object.freeze({
      opacity: 0,
      borderOpacity: 0,
      textOpacity: 1,
      backgroundColor: "#ffffff",
      foregroundColor: "#000000",
      fontSize: 20
    })
  }),
  sticky: Object.freeze({
    shape: "roundedrectangle",
    width: 160,
    height: 68,
    style: Object.freeze({
      borderOpacity: 0,
      borderWidth: 0,
      effect: "postItNote",
      backgroundColor: "#fdeea6",
      foregroundColor: "#1b1f1d"
    })
  })
}), Qo = 0.3, Gp = 0.5, $p = /(?<=[/.\-_?&=#])(?=.)/u;
function Hp(n, t, e) {
  if (!n) return { text: n, lines: [], scale: 1 };
  const s = Math.max(1, t), i = s / Qo, o = (d) => {
    const u = [];
    let f = "";
    for (const p of d)
      f && e(f + p) > s ? (u.push(f), f = p) : f += p;
    return f && u.push(f), u;
  }, r = String(n).split(`
`).map((d) => {
    const u = [];
    for (const f of d.split(/\s+/).filter(Boolean)) {
      if (e(f) <= s / Gp) {
        u.push({ text: f, joined: !1 });
        continue;
      }
      const m = f.split($p).filter(Boolean);
      (m.length > 1 ? m : [f]).forEach((y, b) => {
        (e(y) <= i ? [y] : o(y)).forEach(
          (C, v) => u.push({ text: C, joined: b > 0 || v > 0 })
        );
      });
    }
    return u;
  }), a = Math.max(
    0,
    ...r.flat().map((d) => e(d.text))
  ), c = Math.min(Math.max(s, a), i), l = Math.max(Qo, Math.min(1, s / c)), h = [];
  for (const d of r) {
    if (!d.length) {
      h.push("");
      continue;
    }
    let u = "";
    for (const f of d) {
      const p = u ? f.joined ? u + f.text : `${u} ${f.text}` : f.text;
      u && e(p) > c ? (h.push(u), u = f.text) : u = p;
    }
    u && h.push(u);
  }
  return { text: h.join(`
`), lines: h, scale: l };
}
const Gs = /* @__PURE__ */ new Map(), Fp = 4, Up = 56, jp = 900, zn = ["top", "right", "bottom", "left"], Yp = {
  top: "Add connected note above",
  right: "Add connected note to the right",
  bottom: "Add connected note below",
  left: "Add connected note to the left"
};
function Xp(n, t, e = 8) {
  const { x: s, y: i, width: o, height: r } = n, a = [s, s + o / 2, s + o], c = [i, i + r / 2, i + r];
  let l = s, h = i, d = e, u = e;
  for (const f of t) {
    const p = [f.x, f.x + f.width / 2, f.x + f.width], m = [f.y, f.y + f.height / 2, f.y + f.height];
    for (const g of a)
      for (const y of p) {
        const b = Math.abs(g - y);
        b < d && (d = b, l = s + (y - g));
      }
    for (const g of c)
      for (const y of m) {
        const b = Math.abs(g - y);
        b < u && (u = b, h = i + (y - g));
      }
  }
  return { x: l, y: h };
}
function tr(n) {
  return n === "bold" ? "bold" : null;
}
function Wp(n) {
  const t = String(n ?? "").trim().toLowerCase();
  let e = typeof n == "number" ? n : parseFloat(t);
  return typeof n != "number" && t.endsWith("pt") && (e = e * 4 / 3), (Number.isFinite(e) && e > 0 ? e : 14) * 1.3;
}
class Cs {
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
    this.connectionHandles = {}, this.connectionHandlesVisible = !1, this._connHandleHideTimer = null, this._connHandlesPinned = !1, this.isDragging = !1, this.wasSelectedBeforeDrag = !1, this.preDragTransform = null, this.preDragPosition = null, this._dragStartPointer = null, this._handlesHiddenForDrag = !1, this._groupDragSiblings = [], this._governed = null, this._governanceApplied = !1, this._glide = null, this._lastClickTime = 0, this._initFailed = !1, this._destroyed = !1, this._removed = !1, this.announcedByCreator = !1, this._svgViewboxTimeoutId = null, this._dragEndTimeoutId = null, this._previewViewboxTimeoutId = null, this.id = t.id || this.generateId(), this.slate = e, console.log("NODE_DEBUG: Constructor called", { id: this.id, options: t }), this.options = {
      x: 50,
      y: 50,
      width: 100,
      height: 60,
      text: "Node",
      fontSize: Ce.fontSize,
      fontFamily: Ce.fontFamily,
      fontColor: Ce.fontColor,
      textOpacity: 1,
      textXAlign: "center",
      textYAlign: "middle",
      backgroundColor: Ce.backgroundColor,
      borderColor: Ce.borderColor,
      borderWidth: Ce.borderWidth,
      allowDrag: !0,
      isLocked: !1,
      shape: "rectangle",
      isCategory: !1,
      // The style bar leaves a control off a note whose flag is false.
      showMenu: !0,
      showColorTab: !0,
      showTextTab: !0,
      showAITab: !0,
      showShapeTab: !0,
      showImageTab: !0,
      showEffectTab: !0,
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
    }, Wo(this.options), this.ready = new Promise((s, i) => {
      this._resolveReady = s, this._rejectReady = i;
    }), console.log("NODE_DEBUG: Calling createAsync for", this.id), this.createAsync();
  }
  /** True once the note has been taken off its slate (deleted, or replaced by undo, redo or a load). */
  get isRemoved() {
    return this._removed;
  }
  generateId() {
    return "node_" + Math.random().toString(36).substr(2, 9);
  }
  async createAsync() {
    console.log("NODE_DEBUG: createAsync started for", this.id);
    try {
      const t = await this.slate.getViewportAsync();
      if (console.log("NODE_DEBUG: Got viewport for", this.id, t), this._removed) {
        this._resolveReady();
        return;
      }
      this.svgGroup = t.group(), this.svgGroup.attr("data-node-id", this.id), this.svgGroup.node.setAttribute("tabindex", "0"), this.svgGroup.node.setAttribute("role", "button"), this.svgGroup.node.style && (this.svgGroup.node.style.cursor = "move"), this.wireConnectionHandleHover(), console.log("NODE_DEBUG: Created svgGroup for", this.id, this.svgGroup), this.finishCreate();
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
      const i = this.options.width, o = this.options.height, r = this.backgroundRect.x?.() ?? 0, a = this.backgroundRect.y?.() ?? 0;
      this.nestedSvg = this.svgGroup.nested().size(i, o).move(r, a), this.nestedSvg.svg(this.options.svgContent), this._svgViewboxTimeoutId = setTimeout(() => {
        if (this._destroyed || !this.nestedSvg) return;
        const c = this.nestedSvg.children()[0];
        if (c) {
          let l = c.bbox();
          console.log("NODE_DEBUG: Delayed bbox:", l, "Node size:", i, o), (l.width <= 0 || l.height <= 0) && (l = this.calculatePathBounds(this.options.svgContent, i, o), console.log("NODE_DEBUG: Calculated bounds:", l)), l.width > 0 && l.height > 0 ? (this.nestedSvg.viewbox(l.x, l.y, l.width, l.height), this.nestedSvg.node.setAttribute("preserveAspectRatio", "none"), console.log(
            `NODE_DEBUG: Set viewbox(${l.x}, ${l.y}, ${l.width}, ${l.height}) with preserveAspectRatio="none"`
          )) : (console.log("NODE_DEBUG: Invalid bounds, trying default viewbox approach"), this.nestedSvg.viewbox(0, 0, 24, 24), this.nestedSvg.node.setAttribute("preserveAspectRatio", "none"));
        }
      }, 10);
    }
    const e = { ...this.options.resizeRotate };
    this.options.shape === "circle" && (e.preserveAspectRatio = !0), this.resizeRotate = new za(this, e), this.connector = new Ba(this, this.options.connector), this.relationships = new Ga(this), this.images = new $a(this);
    const s = rp();
    this.media = new s.MediaNote(this), this.editor = new lc(this), this.links = new hc(this), this.filters = new fc(this), this.menu = new mc(this), this.options.image && this.images.set(
      this.options.image,
      this.options.imageOrigWidth,
      this.options.imageOrigHeight
    ), this.options.filters?.vect && this.filters.apply(this.options.filters.vect, "vect"), this.options.filters?.text && this.filters.apply(this.options.filters.text, "text"), this.options.animations?.vect && this.filters.applyAnimation(this.options.animations.vect, "vect"), this.options.animations?.text && this.filters.applyAnimation(this.options.animations.text, "text"), this.options.allowDrag && !this.options.isLocked && this.makeDraggable(), this.setupSelectionBehavior(), typeof this.options.customRender == "function" && this.options.customRender(this.svgGroup, this.options), t || this.centerTextInitial(), this.options.rotate?.rotationAngle && this.applyPositionAndRotation(), console.log("NODE_DEBUG: finishCreate continuing for", this.id), this.svgGroup.node.setAttribute("aria-label", this.options.text || "Unnamed node");
    try {
      this.slate.markersContainer?.front?.();
    } catch {
    }
    this.updateLinkIndicator(), this.options.media && (this.media ? this.media.render() : ap().then((i) => {
      this._destroyed || this.media || (this.media = new i.MediaNote(this), this.options.media && this.media.render());
    }).catch((i) => console.warn("NODE: the video note could not load", i))), this.applyGovernance(), this._resolveReady();
  }
  updateLinkIndicator() {
    try {
      this._linkBadge && (this._linkBadge.remove(), this._linkBadge = void 0);
      const t = this.options.link;
      if (!t?.show || !t.data) return;
      const e = this.options.width || 0, s = this.options.height || 0, i = 11;
      let o = e - i - 3, r = i + 3;
      const a = this.options.shape;
      this.contentPath || this.nestedSvg ? (o = e * 0.72, r = s * 0.28) : (a === "circle" || a === "ellipse") && (o = e * 0.85, r = s * 0.15);
      const c = this.svgGroup.group();
      c.node.setAttribute("class", "node-link-badge"), c.node.setAttribute("style", "cursor:pointer"), c.circle(i * 2).move(o - i, r - i).fill("#2d6cdf").stroke({ color: "#fff", width: 1.5 });
      const h = document.createElementNS("http://www.w3.org/2000/svg", "text");
      h.setAttribute("x", String(o)), h.setAttribute("y", String(r)), h.setAttribute("text-anchor", "middle"), h.setAttribute("dominant-baseline", "central"), h.setAttribute("font-family", "sans-serif"), h.setAttribute("font-size", "15"), h.setAttribute("font-weight", "bold"), h.setAttribute("fill", "#fff"), h.setAttribute("pointer-events", "none"), h.textContent = "↗", c.node.appendChild(h);
      let d = 0;
      const u = (f) => {
        f.stopPropagation(), f.preventDefault?.();
        const p = typeof performance < "u" ? performance.now() : Date.now();
        p - d < 350 || (d = p, this.links?.navigate());
      };
      c.on("pointerdown", (f) => {
        f.stopPropagation();
      }), c.on("pointerup", u), c.on("click", u), this._linkBadge = c;
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
      backgroundColor: s,
      borderColor: i,
      borderWidth: o,
      borderStyle: r,
      borderOpacity: a,
      shape: c,
      vectorPath: l,
      opacity: h
    } = this.options, d = { color: i, width: o }, u = this.borderDashArray();
    u !== "none" && (d.dasharray = u), a !== void 0 && (d.opacity = a);
    const f = Qn(c, l);
    if (f) {
      const p = this.svgGroup.nested().size(t, e);
      String(l || c || "").toLowerCase() !== "circle" && p.node.setAttribute("preserveAspectRatio", "none");
      const g = p.path(f.path).fill(s).stroke(d);
      if (this.isCustomShape())
        try {
          g.node.setAttribute("fill-rule", this.options.fillRule === "evenodd" ? "evenodd" : "nonzero"), g.node.setAttribute("vector-effect", "non-scaling-stroke"), p.node.setAttribute("overflow", "visible");
        } catch {
        }
      try {
        const y = g.bbox();
        y.width > 0 && y.height > 0 ? p.viewbox(y.x, y.y, y.width, y.height) : p.viewbox(f.viewBox);
      } catch {
        p.viewbox(f.viewBox);
      }
      h !== void 0 && g.opacity(h), this.backgroundRect = p, this.contentPath = g;
      try {
        g.node.setAttribute("data-node-background-path", "1"), this.options.svgContent || g.node.setAttribute("data-shape-path", "1");
      } catch {
      }
      try {
        this.resizeTarget = this.svgGroup.rect(t, e).fill({ color: "#000", opacity: 0 }).stroke({ width: 0 }).move(0, 0), this.resizeTarget.node.setAttribute("data-resize-proxy", "1"), this.resizeTarget.node.style.pointerEvents = "none";
      } catch {
      }
    } else {
      switch (this.contentPath = void 0, c) {
        case "circle": {
          const p = Math.min(t, e) / 2;
          this.backgroundRect = this.svgGroup.circle(p * 2).fill(s).stroke(d);
          break;
        }
        case "ellipse":
          this.backgroundRect = this.svgGroup.ellipse(t, e).fill(s).stroke(d);
          break;
        default:
          this.backgroundRect = this.svgGroup.rect(t, e).fill(s).stroke(d).radius(4);
          break;
      }
      h !== void 0 && this.backgroundRect.opacity(h);
    }
    s && String(s).includes("-") && this.applyShapeFill(this.contentPath ?? this.backgroundRect, s), console.log(
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
    const s = !!this.resizeRotate && this.resizeRotate.isEnabled();
    try {
      s && this.resizeRotate.disable();
    } catch {
    }
    try {
      bp(this.backgroundRect);
    } catch {
    }
    this.backgroundRect = void 0, this.contentPath = void 0;
    try {
      this.resizeTarget?.remove?.();
    } catch {
    }
    this.resizeTarget = void 0, this.options.shape = t, this.options.vectorPath = e ?? t, Wo(this.options), t !== "custom" && (delete this.options.fillRule, delete this.options.textBox, delete this.options.shapeRef), this.createBackground();
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
      s && this.slate?.updateSelectionResizeRotate?.();
    } catch {
    }
  }
  createText() {
    console.log("NODE_DEBUG: createText called for", this.id);
    const { text: t, fontSize: e, fontFamily: s, fontColor: i, fontStyle: o, textOpacity: r } = this.options;
    this.textElement = this.svgGroup.text(this.wrapTextToWidth(t)).font({
      family: s,
      size: e,
      fill: i,
      opacity: r
    }), this.textElement.attr({
      "text-anchor": "middle",
      "dominant-baseline": "central",
      "font-style": o || null,
      "font-weight": tr(this.options.fontWeight)
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
    const { fontSize: t, fontFamily: e, fontColor: s, fontStyle: i, textOpacity: o } = this.options;
    this.textElement.font({
      family: e,
      size: t,
      fill: s,
      opacity: o
    }), this.textElement.attr("font-style", i || null), this.textElement.attr("font-weight", tr(this.options.fontWeight)), this.options.text && this.textElement.text(this.wrapTextToWidth(this.options.text)), this.centerText();
  }
  /**
   * "Snap to neighbors" (Miro smart-align): nudge (x, y) so one of this node's
   * edges or center lines up with a nearby node's matching edge/center. Gated by
   * the caller on viewPort.snapToObjects.
   */
  snapToNeighbors(t, e) {
    const s = {
      x: t,
      y: e,
      width: this.options.width || 0,
      height: this.options.height || 0
    }, i = this.slate.nodes.allNodes.filter((o) => o !== this).map((o) => ({
      x: o.options.x || 0,
      y: o.options.y || 0,
      width: o.options.width || 0,
      height: o.options.height || 0
    }));
    return Xp(s, i);
  }
  /**
   * Word-wrap `text` to the node's inner width, returning it with newlines
   * inserted at break points (SVG.js renders one tspan per line). Explicit
   * newlines are preserved; a single word longer than the width stays on its own
   * line rather than being split mid-word. Falls back to a character estimate
   * when canvas measurement isn't available.
   */
  /**
   * Fraction of the bounding box usable for text, by shape. Tapering shapes
   * (diamond, triangle, star) have a much smaller INSCRIBED area than their
   * bounding box, so text laid out to the full width spills past the angled
   * edges (e.g. a diamond's usable width is roughly half its bbox). Rectangles
   * use the full box. Applied to BOTH wrap width and fit scale so text wraps +
   * shrinks to stay inside the actual shape, not just its bounding rect.
   */
  /**
   * A custom outline (a shape from slateboxjs/shapes): `shape: "custom"` with
   * a raw path and at least one of the options every writer stores with it
   * (fillRule, textBox, shapeRef). Older raw-path notes (quick-add shapes,
   * theme outlines, icons, comments, v1 "custom" icon notes) carry none of
   * them and keep their old behaviour: grow to fit text, the inset text box,
   * the scaled border.
   */
  isCustomShape() {
    const t = this.options;
    return t.shape !== "custom" || !/^[Mm]/.test(String(t.vectorPath || "").trim()) ? !1 : t.fillRule === "evenodd" || t.fillRule === "nonzero" || t.textBox !== void 0 || !!t.shapeRef;
  }
  /**
   * Where text sits, in node pixels. A custom outline uses its stored text box
   * (or one measured once from its path); a named shape keeps its centred
   * inset; anything else gets the full box.
   */
  textArea() {
    const t = this.options.width || 100, e = this.options.height || 60;
    if (this.isCustomShape()) {
      let i = this.options.textBox;
      if (i === void 0) {
        const r = String(this.options.vectorPath || this.options.shape || "");
        Gs.has(r) || Gs.set(r, yc(r, this.options.fillRule || "nonzero")), i = Gs.get(r);
      }
      const o = i && [i.x, i.y, i.w, i.h].every((r) => typeof r == "number" && Number.isFinite(r)) ? i : { x: 0.25, y: 0.25, w: 0.5, h: 0.5 };
      return this.insetArea({ x: o.x * t, y: o.y * e, w: o.w * t, h: o.h * e, custom: !0 });
    }
    const s = this.shapeTextInset();
    return this.insetArea({ x: t * (1 - s) / 2, y: e * (1 - s) / 2, w: t * s, h: e * s, custom: !1 });
  }
  /**
   * The box text is placed in: a custom outline's text area, otherwise the
   * whole box; either one narrowed by options.textInset.
   */
  placeArea() {
    const t = this.textArea();
    return t.custom ? t : this.insetArea({ x: 0, y: 0, w: this.options.width || 100, h: this.options.height || 60, custom: !1 });
  }
  /** An area narrowed by the note's text inset (each side a share of the area). */
  insetArea(t) {
    const e = this.textInsetSides(), s = 1 - e.left - e.right, i = 1 - e.top - e.bottom;
    return { ...t, x: t.x + t.w * e.left, y: t.y + t.h * e.top, w: t.w * s, h: t.h * i };
  }
  /** The note's text inset (options.textInset), each side clamped to 0-0.45. */
  textInsetSides() {
    const t = this.options.textInset || {}, e = (s) => {
      const i = Number(s);
      return Number.isFinite(i) ? Math.min(0.45, Math.max(0, i)) : 0;
    };
    return { left: e(t.left), right: e(t.right), top: e(t.top), bottom: e(t.bottom) };
  }
  shapeTextInset() {
    const t = String(this.options.shape || "rectangle").toLowerCase();
    return t.includes("diamond") ? 0.6 : t.includes("triangle") ? 0.55 : t.includes("star") ? 0.5 : t.includes("ellipse") || t.includes("circle") ? 0.82 : 1;
  }
  wrapTextToWidth(t) {
    if (this._textFitScale = 1, !t) return t;
    const e = Math.max(24, this.textArea().w - 14), s = this.options.fontSize || 14, i = this.options.fontFamily || "sans-serif";
    let o = null;
    try {
      o = (this._measureCanvas || (this._measureCanvas = document.createElement("canvas"))).getContext("2d"), o && (o.font = `${this.options.fontWeight === "bold" ? "bold " : ""}${s}px ${i}`);
    } catch {
      o = null;
    }
    const a = Hp(t, e, (c) => o ? o.measureText(c).width : c.length * s * 0.55);
    return this._textFitScale = a.scale, a.text;
  }
  /**
   * Grow the node's height so wrapped text fits inside it (Miro-style: nodes
   * grow to fit typed content). Only ever grows — never shrinks — to avoid
   * jumpiness when text is removed. Derived from the text, so it's re-applied on
   * load without needing to be persisted separately. No-op in headless tests
   * where getBBox is unavailable.
   */
  fitHeightToText() {
    if (!this.textElement || this.nestedSvg || this.isCustomShape()) return;
    let t = 0;
    try {
      t = this.textElement.node.getBBox?.()?.height || 0;
    } catch {
      return;
    }
    if (!t) return;
    const e = Math.min(1, Math.max(0.3, Number(this._textFitScale) || 1)), s = Math.ceil(t * e) + 14;
    s > (this.options.height || 0) + 1 && this.setSize(this.options.width || 100, s);
  }
  /** Position the text element within the background shape based on alignment settings. */
  centerText() {
    if (!this.textElement) return;
    Qi(this.options);
    const { width: t, height: e, textXAlign: s, textYAlign: i, textOffset: o } = this.options, r = this.backgroundRect.x?.() ?? 0, a = this.backgroundRect.y?.() ?? 0, c = this.placeArea(), l = r + c.x, h = a + c.y, d = c.w, u = c.h;
    let f = l + d / 2 + (o?.x || 0), p = h + u / 2 + (o?.y || 0);
    switch (s) {
      case "left":
        f = l + 5 + (o?.x || 0), this.textElement.attr("text-anchor", "start");
        break;
      case "right":
        f = l + d - 5 + (o?.x || 0), this.textElement.attr("text-anchor", "end");
        break;
      default:
        this.textElement.attr("text-anchor", "middle");
        break;
    }
    switch (i) {
      case "top":
        p = h + 5 + (o?.y || 0), this.textElement.attr("dominant-baseline", "hanging");
        break;
      case "bottom":
        p = h + u - 5 + (o?.y || 0), this.textElement.attr("dominant-baseline", "auto");
        break;
      default:
        this.textElement.attr("dominant-baseline", "central");
        break;
    }
    const m = this.textElement.node.querySelectorAll?.("tspan")?.length || 1;
    if (m > 1 && i !== "top") {
      const g = (m - 1) * Wp(this.options.fontSize);
      p -= i === "bottom" ? g : g / 2;
    }
    this.textElement.attr({ x: f, y: p }), this.fitTextToNode();
  }
  /**
   * Shrink the rendered text to fit within the node bounds (Miro shape behavior).
   * Applies a uniform scale transform about the text's aligned edge; never grows
   * beyond 1 (the set size) and never shrinks below a readable floor.
   */
  fitTextToNode() {
    if (!this.textElement || this.nestedSvg) return;
    const t = this.textElement;
    try {
      t.attr("transform", null);
    } catch {
      return;
    }
    let e;
    try {
      e = t.node.getBBox();
    } catch {
      return;
    }
    if (!e || e.width <= 0 || e.height <= 0) return;
    const s = this.textArea(), i = s.w - 12, o = s.h - 10;
    if (i <= 0 || o <= 0) return;
    let r = Math.min(i / e.width, o / e.height);
    if (r >= 0.999) return;
    r = Math.max(r, 0.3);
    const { textXAlign: a, textYAlign: c } = this.options, l = a === "left" ? e.x : a === "right" ? e.x + e.width : e.x + e.width / 2, h = c === "top" ? e.y : c === "bottom" ? e.y + e.height : e.y + e.height / 2;
    try {
      t.attr(
        "transform",
        `translate(${l} ${h}) scale(${r.toFixed(
          4
        )}) translate(${-l} ${-h})`
      );
    } catch {
    }
  }
  makeDraggable() {
    this.svgGroup.draggable(), this.svgGroup.on("beforedrag.node", (t) => {
      const e = this.slate.governanceOf?.(this);
      if (!e) return;
      const s = this.slate;
      if (!e.capabilities.canMove || s.options?.enabled === !1 || s.isReadOnly?.() || s.isCommentOnly?.()) {
        t.preventDefault?.();
        const i = t.detail?.event;
        i?.type === "mousedown" && !this.editor?.isInlineEditing?.() && i.preventDefault?.();
      }
    }), this.svgGroup.on("dragstart.node", (t) => {
      console.log("DRAG_DEBUG: Drag started on", this.id), this.toFront(!1);
      const e = this.slate.getSelectedNodes().includes(this), s = t.detail?.event || t, i = s?.ctrlKey || s?.metaKey || s?.shiftKey;
      e ? console.log(
        "SELECTION_DEBUG: Drag started on already selected node",
        this.id
      ) : (console.log(
        "SELECTION_DEBUG: Drag started on unselected node",
        this.id,
        "- selecting it, addToSelection:",
        i
      ), this.slate.selectNodes([this], i)), this.isDragging = !0, this.wasSelectedBeforeDrag = !0, this._handlesHiddenForDrag = !1;
      const o = this.svgGroup.transform();
      this.preDragTransform = {
        translateX: o.translateX || 0,
        translateY: o.translateY || 0
      }, this.preDragPosition = {
        x: this.options.x ?? 0,
        y: this.options.y ?? 0
      }, this._dragStartPointer = this.pointerFromDragEvent(t), this._groupDragSiblings = [];
      const r = this.slate.governanceOf?.(this);
      if (r) this.beginGovernedDrag(r.policy, t);
      else try {
        const a = this.slate.getSelectedNodes?.() || [];
        if (a.length > 1 && a.includes(this))
          for (const c of a)
            c !== this && this._groupDragSiblings.push({
              node: c,
              x: c.options.x ?? 0,
              y: c.options.y ?? 0
            });
      } catch {
      }
      console.log("DRAG_DEBUG: Stored pre-drag transform:", this.preDragTransform, "position:", this.preDragPosition), this.hideNodeCog();
    }), this.svgGroup.on("dragend.node", (t) => {
      if (console.log("DRAG_DEBUG: Drag ended on", this.id), this._governed) {
        const d = this._governed, u = this.pointerFromDragEvent(t), f = u ? this.slate.clientToWorld(u) : d.last?.point ?? d.startWorld, p = {
          clientX: u?.x ?? d.last?.gesture.clientX ?? d.startClient.x,
          clientY: u?.y ?? d.last?.gesture.clientY ?? d.startClient.y,
          pointerType: d.pointerType
        };
        this.finishGovernedDrag(d, { point: f, gesture: p });
        return;
      }
      const e = this.pointerFromDragEvent(t);
      if (e && this._dragStartPointer && this.preDragPosition) {
        const d = this.slate.getZoom?.() || 1, u = (e.x - this._dragStartPointer.x) / d, f = (e.y - this._dragStartPointer.y) / d;
        this.options.x = this.preDragPosition.x + u, this.options.y = this.preDragPosition.y + f;
        let p = u, m = f;
        const g = this.slate.grid?.snapPoint?.(
          this.options.x,
          this.options.y
        );
        if (g && (this.options.x = g.x, this.options.y = g.y, p = g.x - this.preDragPosition.x, m = g.y - this.preDragPosition.y), this.slate.options.viewPort?.snapToObjects) {
          const y = this.snapToNeighbors(this.options.x, this.options.y);
          this.options.x = y.x, this.options.y = y.y, p = this.options.x - this.preDragPosition.x, m = this.options.y - this.preDragPosition.y;
        }
        for (const y of this._groupDragSiblings)
          y.node.options.x = y.x + p, y.node.options.y = y.y + m, y.node.applyPositionAndRotation();
      }
      const s = this._groupDragSiblings;
      if (this._groupDragSiblings = [], !s.length && this.preDragPosition && e) {
        const d = { ...this.preDragPosition }, f = Math.abs((this.options.x ?? 0) - d.x) > 0.5 || Math.abs((this.options.y ?? 0) - d.y) > 0.5 ? this.slate.offerFreeDrop?.(this, this.slate.clientToWorld(e), d) : null;
        if (f) {
          this.preDragTransform = null, this.preDragPosition = null, this._dragStartPointer = null, f === "refused" && this.position(d.x, d.y, () => this.reframeAfterGlide(), void 0, Bs() ? 0 : 180), this.isOnSlate() ? this.settleAfterDrag() : this.isDragging = !1;
          return;
        }
      }
      if (s.length && this.preDragPosition && e) {
        const d = { ...this.preDragPosition }, u = Math.abs((this.options.x ?? 0) - d.x) > 0.5 || Math.abs((this.options.y ?? 0) - d.y) > 0.5, f = [d, ...s.map((m) => ({ x: m.x, y: m.y }))], p = u ? this.slate.offerFreeGroupDrop?.([this, ...s.map((m) => m.node)], this.slate.clientToWorld(e), f) : null;
        if (p) {
          if (this.preDragTransform = null, this.preDragPosition = null, this._dragStartPointer = null, p === "refused") {
            const m = Bs() ? 0 : 180;
            this.position(d.x, d.y, () => this.reframeAfterGlide(), void 0, m);
            for (const g of s) g.node.isOnSlate() && g.node.position(g.x, g.y, void 0, void 0, m);
          }
          this.isOnSlate() ? this.settleAfterDrag() : this.isDragging = !1;
          return;
        }
      }
      const i = this.preDragPosition, o = 0.5, r = this.options.x ?? 0, a = this.options.y ?? 0, c = !i || Math.abs(r - i.x) > o || Math.abs(a - i.y) > o, l = s.some(
        (d) => Math.abs((d.node.options.x ?? 0) - d.x) > o || Math.abs((d.node.options.y ?? 0) - d.y) > o
      ), h = c || l;
      this.preDragTransform = null, this.preDragPosition = null, this._dragStartPointer = null, this.applyPositionAndRotation(), h && this.slate.broadcast?.("onNodesMove", {
        nodeOptions: [
          nt(this.options),
          ...s.map((d) => nt(d.node.options))
        ]
      }), this.settleAfterDrag();
    }), this.svgGroup.on("dragmove.node", (t) => {
      if (this.isDragging = !0, this.hideHandlesForDrag(), this._governed) {
        t.preventDefault?.();
        return;
      }
      const e = this.pointerFromDragEvent(t);
      if (e && this._dragStartPointer && this.preDragPosition) {
        t.preventDefault?.();
        const s = this.slate.getZoom?.() || 1, i = (e.x - this._dragStartPointer.x) / s, o = (e.y - this._dragStartPointer.y) / s;
        this.options.x = this.preDragPosition.x + i, this.options.y = this.preDragPosition.y + o;
        let r = i, a = o;
        const c = this.slate.grid?.snapPoint?.(
          this.options.x,
          this.options.y
        );
        if (c && (this.options.x = c.x, this.options.y = c.y, r = c.x - this.preDragPosition.x, a = c.y - this.preDragPosition.y), this.slate.options.viewPort?.snapToObjects) {
          const l = this.snapToNeighbors(this.options.x, this.options.y);
          this.options.x = l.x, this.options.y = l.y, r = this.options.x - this.preDragPosition.x, a = this.options.y - this.preDragPosition.y;
        }
        this.applyPositionAndRotation(), this._groupDragSiblings.length || this.slate.offerFreeMove?.(this, this.slate.clientToWorld(e));
        for (const l of this._groupDragSiblings)
          l.node.options.x = l.x + r, l.node.options.y = l.y + a, l.node.applyPositionAndRotation();
        try {
          this.slate.markersContainer?.front?.();
        } catch {
        }
      }
    });
  }
  /**
   * After any drag (ordinary or governed) ends: tell a drag from a click, keep the
   * note selected, and put its handles back at the new position.
   */
  /**
   * A selected note glided back to where its drag began (a host refused the drop): its outline,
   * handles and plugs are drawn again round where it now is.
   */
  reframeAfterGlide() {
    this._destroyed || !this.isOnSlate() || this.slate.getSelectedNodes().includes(this) && (this.slate.updateSelectionResizeRotate?.(), this._connHandlesPinned && this.showConnectionHandles());
  }
  settleAfterDrag(t = !1) {
    {
      const e = this.slate.getSelectedNodes().slice();
      this._dragEndTimeoutId = setTimeout(() => {
        if (this.slate?.frameGestureEnd?.("drag"), this._destroyed || t && !this.isOnSlate()) return;
        this.isDragging = !1;
        const s = this.slate.getSelectedNodes();
        if ((s.length !== e.length || s.some((r, a) => r !== e[a])) && !s.includes(this)) {
          this.slate.notifyNodeChanged(this);
          return;
        }
        this.slate.getSelectedNodes().includes(this) ? (console.log(
          "SELECTION_DEBUG: Drag ended on selected node",
          this.id,
          "- re-enabling resize/rotate"
        ), this.slate.updateSelectionResizeRotate()) : (console.log(
          "SELECTION_DEBUG: Drag ended on unselected node",
          this.id,
          "- selecting it"
        ), this.slate.selectNodes([this], !1)), this.slate.notifyNodeChanged(this), this._connHandlesPinned && this.showConnectionHandles();
      }, 10);
    }
  }
  // ─── Governed drags (host drag policy) ─────────────────────────────
  /** Whether this note is still one of the slate's notes (remove() does not mark it destroyed). */
  isOnSlate() {
    return this.slate?.nodes?.one?.(this.id) === this;
  }
  /**
   * Show what a host policy allows on this note: a grab cursor on a note that may
   * be dragged, a plain one on a note that may not, and no pointer input, focus or
   * accessibility role at all on decoration. Ordinary notes are left untouched.
   */
  applyGovernance() {
    const t = this.svgGroup?.node;
    if (!t?.setAttribute) return;
    const e = this.slate?.governanceOf?.(this) ?? null;
    if (!e) {
      if (!this._governanceApplied) return;
      this._governanceApplied = !1, t.removeAttribute("data-governed"), t.removeAttribute("data-no-connect"), t.removeAttribute("aria-hidden"), t.setAttribute("tabindex", "0"), t.setAttribute("role", "button"), t.style && (t.style.cursor = "move", t.style.pointerEvents = "");
      return;
    }
    this._governanceApplied = !0;
    const s = e.capabilities;
    t.setAttribute(
      "data-governed",
      s.canSelect ? s.canMove ? "movable" : "fixed" : "decoration"
    ), s.canConnect ? t.removeAttribute("data-no-connect") : t.setAttribute("data-no-connect", "1"), s.canSelect ? (t.removeAttribute("aria-hidden"), t.setAttribute("tabindex", "0"), t.setAttribute("role", "button")) : (t.setAttribute("aria-hidden", "true"), t.removeAttribute("tabindex"), t.removeAttribute("role")), t.style && (t.style.cursor = s.canSelect ? s.canMove ? s.cursor ?? "grab" : "default" : "", t.style.pointerEvents = s.canSelect ? "" : "none"), s.canConnect || this.hideConnectionHandles();
  }
  /** The press that may become a governed drag. Nothing is asked of the policy yet. */
  beginGovernedDrag(t, e) {
    const s = e?.detail?.event ?? e, i = this.pointerFromDragEvent(e) ?? { x: 0, y: 0 }, o = typeof s?.type == "string" && s.type.indexOf("touch") === 0 ? "touch" : "mouse", r = (f) => this.cancelGovernedDrag(f), a = (f) => {
      f.key === "Escape" && this._governed?.started && (f.preventDefault(), f.stopPropagation(), r("escape"));
    }, c = () => r("pointercancel"), l = () => r("touchcancel"), h = () => r("blur"), d = (f) => {
      this._governed && this.moveGovernedDrag(this._governed, f);
    }, u = o === "touch" ? "touchmove" : "mousemove";
    window.addEventListener(u, d, !0), window.addEventListener("keydown", a, !0), window.addEventListener("blur", h), o === "touch" ? window.addEventListener("touchcancel", l, !0) : window.addEventListener("pointercancel", c, !0), this._governed = {
      policy: t,
      origin: { x: this.options.x ?? 0, y: this.options.y ?? 0 },
      grabbed: { x: this.options.x ?? 0, y: this.options.y ?? 0 },
      startClient: i,
      startWorld: this.slate.clientToWorld(i),
      pointerType: o,
      started: !1,
      refused: !1,
      frame: 0,
      pan: 0,
      last: null,
      stopListening: () => {
        window.removeEventListener(u, d, !0), window.removeEventListener("keydown", a, !0), window.removeEventListener("blur", h), window.removeEventListener("touchcancel", l, !0), window.removeEventListener("pointercancel", c, !0);
      }
    }, this.slate._governedDragNode = this;
  }
  moveGovernedDrag(t, e) {
    const s = this.pointerFromDragEvent(e);
    if (!s || t.refused) return;
    const i = { clientX: s.x, clientY: s.y, pointerType: t.pointerType };
    if (!t.started) {
      if (Math.hypot(s.x - t.startClient.x, s.y - t.startClient.y) < Fp) return;
      let r = !0;
      try {
        r = t.policy.onStart?.(this, t.startWorld, i) !== !1;
      } catch (c) {
        console.warn("DRAG_POLICY: onStart threw; refusing the drag", c), r = !1;
      }
      if (!r) {
        t.refused = !0;
        return;
      }
      t.started = !0;
      const a = this._glide;
      t.grabbed = { x: this.options.x ?? 0, y: this.options.y ?? 0 }, a ? (a.cancelled = !0, this._glide = null, t.origin = { x: a.x, y: a.y }) : t.origin = { ...t.grabbed }, this.svgGroup.node.style && (this.svgGroup.node.style.cursor = "grabbing");
    }
    this.followGovernedPointer(t, i), this.panWhileHeldNearEdge(t);
  }
  /** Put the held note under the pointer and let the policy know where it is. */
  followGovernedPointer(t, e) {
    const s = this.slate.clientToWorld({ x: e.clientX, y: e.clientY });
    this.options.x = t.grabbed.x + (s.x - t.startWorld.x), this.options.y = t.grabbed.y + (s.y - t.startWorld.y), this.applyPositionAndRotation();
    try {
      this.slate.markersContainer?.front?.();
    } catch {
    }
    t.last = { point: s, gesture: e }, !t.frame && typeof t.policy.onMove == "function" && (t.frame = requestAnimationFrame(() => {
      if (t.frame = 0, !(this._governed !== t || !t.last))
        try {
          t.policy.onMove(this, t.last.point, t.last.gesture);
        } catch (i) {
          console.warn("DRAG_POLICY: onMove threw", i);
        }
    }));
  }
  /**
   * How fast the canvas should pan (CSS pixels a second, each axis) for a note held
   * at `gesture`: nothing in the middle of the visible canvas, faster the nearer the
   * pointer is to an edge. An edge only pulls once the pointer has travelled toward
   * it, so a note that starts beside an edge can be carried away from it in peace.
   */
  edgePanVelocity(t, e) {
    const s = this.slate.element?.getBoundingClientRect?.();
    if (!s || typeof window > "u") return { x: 0, y: 0 };
    const i = Math.max(s.left, 0), o = Math.max(s.top, 0), r = Math.min(s.right, window.innerWidth || s.right), a = Math.min(s.bottom, window.innerHeight || s.bottom), c = Math.min(Up, (r - i) / 4, (a - o) / 4);
    if (!(c > 0)) return { x: 0, y: 0 };
    const l = (u) => {
      if (u >= c) return 0;
      const f = Math.min(1, (c - u) / c);
      return f * f * jp;
    }, h = e.clientX - t.startClient.x, d = e.clientY - t.startClient.y;
    return {
      x: (h > 0 ? l(r - e.clientX) : 0) - (h < 0 ? l(e.clientX - i) : 0),
      y: (d > 0 ? l(a - e.clientY) : 0) - (d < 0 ? l(e.clientY - o) : 0)
    };
  }
  /**
   * While a governed note is held near an edge of the visible canvas, pan the canvas
   * toward that edge so the note can be carried to a place that started off screen.
   * The note stays under the pointer and the policy hears each step as a move.
   */
  panWhileHeldNearEdge(t) {
    if (t.pan || !t.started || !t.last || typeof requestAnimationFrame > "u" || this.slate?.capabilitiesOf?.(this)?.edgePan === !1) return;
    const e = this.edgePanVelocity(t, t.last.gesture);
    if (!e.x && !e.y) return;
    let s = performance.now();
    const i = () => {
      if (t.pan = 0, this._governed !== t || !t.started || !t.last || this._destroyed) return;
      const o = performance.now(), r = Math.min(64, o - s) / 1e3;
      s = o;
      const a = this.edgePanVelocity(t, t.last.gesture);
      if (!a.x && !a.y) return;
      const c = this.slate.getZoom?.() || 1;
      this.slate.panBy({ x: a.x * r / c, y: a.y * r / c }), this.followGovernedPointer(t, t.last.gesture), t.pan = requestAnimationFrame(i);
    };
    t.pan = requestAnimationFrame(i);
  }
  /**
   * End a governed drag. With `release` the policy rules on the drop; without it
   * the drag was cancelled, which is a refusal. Either way nothing is broadcast:
   * the host persists what it accepted.
   */
  finishGovernedDrag(t, e, s = "host") {
    this._governed = null, this.slate._governedDragNode === this && (this.slate._governedDragNode = null), t.stopListening(), t.frame && typeof cancelAnimationFrame < "u" && cancelAnimationFrame(t.frame), t.frame = 0, t.pan && typeof cancelAnimationFrame < "u" && cancelAnimationFrame(t.pan), t.pan = 0, this.preDragTransform = null, this.preDragPosition = null, this._dragStartPointer = null;
    let i = !1;
    const o = () => {
      i || this._destroyed || (i = !0, this.isOnSlate() && (this.svgGroup?.node?.style && this._governanceApplied && (this.svgGroup.node.style.cursor = this.slate?.governanceOf?.(this)?.capabilities.cursor ?? "grab"), this.settleAfterDrag(!0)));
    }, r = Bs();
    if (t.started) {
      let a = { accept: !1 };
      if (e)
        try {
          a = t.policy.onEnd(this, e.point, e.gesture) ?? { accept: !1 };
        } catch (c) {
          console.warn("DRAG_POLICY: onEnd threw; refusing the drop", c);
        }
      else
        try {
          t.policy.onCancel?.(this, s);
        } catch (c) {
          console.warn("DRAG_POLICY: onCancel threw", c);
        }
      !this._destroyed && this.slate.nodes?.one?.(this.id) === this && (a.accept ? a.settle ? this.position(a.settle.x, a.settle.y, o, void 0, r ? 0 : 160) : o() : this.position(t.origin.x, t.origin.y, o, void 0, r ? 0 : 180), setTimeout(o, 400));
    } else
      o();
  }
  /**
   * Abandon the governed drag in progress on this note, as a refusal: the note
   * glides back to where it started and the policy's onCancel runs.
   */
  cancelGovernedDrag(t = "host") {
    const e = this._governed;
    if (!e) return !1;
    try {
      rt(window, "mousemove.drag"), rt(window, "touchmove.drag"), rt(window, "mouseup.drag"), rt(window, "touchend.drag"), this.svgGroup.remember?.("_draggable")?.init(!0);
    } catch {
    }
    return this.finishGovernedDrag(e, null, t), !0;
  }
  /**
   * Extract the pointer position in client coordinates from an svg.draggable
   * event (or a raw DOM event). svg.draggable exposes the source event at
   * event.detail.event; touch events carry it under touches/changedTouches.
   */
  pointerFromDragEvent(t) {
    const e = t?.detail?.event ?? t;
    if (!e) return null;
    const s = e.touches?.[0] ?? e.changedTouches?.[0] ?? e;
    return typeof s.clientX == "number" && typeof s.clientY == "number" ? { x: s.clientX, y: s.clientY } : null;
  }
  position(t, e, s, i, o) {
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
      const l = { x: t, y: e, cancelled: !1 };
      this._glide = l;
      const h = performance.now(), d = () => {
        if (this._destroyed || !this.svgGroup || l.cancelled) return;
        const u = Math.min(1, (performance.now() - h) / o), f = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
        this.options.x = r + (t - r) * f, this.options.y = a + (e - a) * f, this.applyPositionAndRotation(), u < 1 ? (this.isSelected() && this.resizeRotate?.syncOverlay?.(), requestAnimationFrame(d)) : (this.options.x = t, this.options.y = e, this.applyPositionAndRotation(), this._glide === l && (this._glide = null), s && s(), this.refreshSelectionDecorations());
      };
      requestAnimationFrame(d);
    } else
      this.applyPositionAndRotation(), s && s(), this.refreshSelectionDecorations();
  }
  /** Whether this note is part of its slate's selection. */
  isSelected() {
    return !!this.slate?.selectedNodes?.includes?.(this);
  }
  /** Bring the node to the front of the SVG z-order. */
  /**
   * Raise this node to the top of the SVG z-order. When `persist` is true
   * (deliberate "bring to front"), it broadcasts + records an undo step. Pass
   * false for the transient raise on pointer-down/drag-start so a plain click
   * doesn't persist a z-order change or pollute the undo stack.
   */
  toFront(t = !0) {
    this.svgGroup.front(), t && (this.slate.nodes?.reorder?.(this.id, "front"), this.slate.broadcast?.("onNodeToFront", { id: this.id }));
  }
  /** Send the node to the back of the SVG z-order. */
  toBack(t = !0) {
    this.svgGroup.back(), t && (this.slate.nodes?.reorder?.(this.id, "back"), this.slate.broadcast?.("onNodeToBack", { id: this.id }));
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
    const s = this.options.width || 100, i = this.options.height || 100, o = 11;
    let r = s - 2, a = 2;
    const c = String(
      this.options.vectorPath || this.options.shape || "rectangle"
    ).toLowerCase();
    this.nestedSvg ? (r = s * 0.72, a = i * 0.28) : c === "circle" || c === "ellipse" ? (r = s * 0.85, a = i * 0.15) : this.contentPath && c !== "rectangle" && c !== "roundedrectangle" && (r = s * 0.72, a = i * 0.28);
    const l = e === "resolved" ? "#2e7d32" : e === "empty" ? "#6b7280" : "#e5484d", h = this.svgGroup.group().addClass("comment-badge");
    h.circle(o * 2).center(r, a).fill(l).stroke({
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
    try {
      this.slate?._lineTool?.nodeId === this.id && this.slate.cancelLineTool?.();
    } catch {
    }
    this.connectionHandles.container && (this.connectionHandles.container.remove(), this.connectionHandles.container = void 0), this.connectionPreview?.container && (this.connectionPreview.container.remove(), this.connectionPreview.container = void 0), this.hideNodeCog(), this._removed = !0, this.svgGroup?.remove();
  }
  /**
   * Destroy the node completely, cleaning up all timers, event handlers,
   * and owned sub-modules. Pattern matches PanZoom.ts.
   */
  destroy() {
    this._destroyed = !0, this._svgViewboxTimeoutId !== null && (clearTimeout(this._svgViewboxTimeoutId), this._svgViewboxTimeoutId = null), this._dragEndTimeoutId !== null && (clearTimeout(this._dragEndTimeoutId), this._dragEndTimeoutId = null), this._previewViewboxTimeoutId !== null && (clearTimeout(this._previewViewboxTimeoutId), this._previewViewboxTimeoutId = null), this.resizeRotate && this.resizeRotate.isEnabled() && this.resizeRotate.disable(), this.connector && this.connector.isActive && this.connector.disable(), this.relationships && (this.relationships.disable(), this.relationships.removeAll()), this.connectionHandles.container && (this.connectionHandles.container.remove(), this.connectionHandles.container = void 0), this.connectionPreview?.container && (this.connectionPreview.container.remove(), this.connectionPreview.container = void 0), this.media?.destroy(), this.svgGroup.remove(), this.isDragging = !1;
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
    if (!this.svgGroup && !this._removed) {
      const s = this.options.text !== t;
      this.options.text = t, s && this.slate.broadcast?.("onNodeTextChanged", { id: this.id, text: t });
      return;
    }
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
    if (this.queueGeometryNotice(), this.options.shape === "circle") {
      const i = Math.min(t, e);
      t = i, e = i;
    }
    if (this.options.width = t, this.options.height = e, this.backgroundRect instanceof Tn)
      this.backgroundRect.size(t, e);
    else if (this.backgroundRect instanceof ps) {
      const i = Math.min(t, e);
      this.backgroundRect.size(i, i), this.options.width = i, this.options.height = i;
    } else if (this.backgroundRect instanceof En)
      this.backgroundRect.size(t, e);
    else
      try {
        this.backgroundRect.size?.(t, e);
      } catch (i) {
        console.warn("NODE_DEBUG: Failed to resize custom shape backgroundRect:", i);
      }
    if (this.nestedSvg) {
      const i = this.backgroundRect.x?.() ?? 0, o = this.backgroundRect.y?.() ?? 0;
      this.nestedSvg.size(t, e).move(i, o);
    }
    if (this.resizeTarget)
      try {
        this.resizeTarget.size(t, e);
      } catch {
      }
    this.textElement && this.options.text && this.textElement.text(this.wrapTextToWidth(this.options.text)), this.centerText(), this._linkBadge && this.updateLinkIndicator(), this.media?.update();
    const s = this._commentBadgeState;
    s && this.setCommentBadge(s.count, s.kind);
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
    const s = String(e).split("-").filter(Boolean);
    if (s.length >= 2)
      try {
        const i = this.svgGroup.gradient("linear", (o) => {
          o.stop(0, s[0]), o.stop(1, s[s.length - 1]);
        });
        t.fill(i);
        return;
      } catch {
      }
    t.fill(s[0] || e);
  }
  setColors(t, e) {
    const s = this.contentPath ?? this.backgroundRect;
    if (t) {
      this.options.backgroundColor = t, this.applyShapeFill(s, t);
      const i = String(this.options.fontColor || "").toLowerCase(), o = [
        "",
        "#fff",
        "#ffffff",
        "#000",
        "#000000",
        "white",
        "black"
      ].includes(i), r = this.options.fontColor || "#000000";
      if (o && this.textElement && t.startsWith("#") && nc(r, t) < 3) {
        const a = oo(t);
        this.options.fontColor = a;
        try {
          this.textElement.font({ fill: a });
        } catch {
        }
      }
    }
    e && (this.options.borderColor = e, s.stroke({ color: e })), (t || e) && this.slate.broadcast?.("onNodeColorChanged", {
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
    const { borderColor: e, borderWidth: s, borderOpacity: i } = this.options, o = { dasharray: this.borderDashArray() };
    e && (o.color = e), s !== void 0 && (o.width = s), i !== void 0 && (o.opacity = i), t.stroke(o);
  }
  /**
   * SVG stroke-dasharray for the current borderStyle, scaled by border width.
   * Accepts the app's symbols ('-', '.', '--.') and words ('dashed', 'dotted').
   * Returns "none" for solid. Shared by createBackground (load path) and
   * applyBorder (edit path) so border style survives a reload.
   */
  borderDashArray() {
    const { borderStyle: t, borderWidth: e } = this.options, s = e || 1, i = {
      "-": [3, 1],
      dashed: [3, 1],
      ".": [1, 1],
      dotted: [1, 1],
      "--.": [8, 3, 1, 3],
      combo: [8, 3, 1, 3]
    };
    return t && i[t] ? i[t].map((o) => o * s).join(",") : "none";
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
    const s = this.options.rotate.rotationAngle || 0;
    if (!!e && e > 0 && typeof requestAnimationFrame < "u" && typeof performance < "u" && s !== t) {
      const o = t - s, r = performance.now(), a = () => {
        if (this._destroyed || !this.svgGroup || !this.options.rotate) return;
        const c = Math.min(1, (performance.now() - r) / e), l = c < 0.5 ? 2 * c * c : 1 - Math.pow(-2 * c + 2, 2) / 2;
        this.options.rotate.rotationAngle = s + o * l, this.applyPositionAndRotation(), c < 1 ? requestAnimationFrame(a) : (this.options.rotate.rotationAngle = t, this.applyPositionAndRotation(), this.refreshSelectionDecorations());
      };
      requestAnimationFrame(a);
    } else
      this.options.rotate.rotationAngle = t, this.applyPositionAndRotation(), this.refreshSelectionDecorations();
  }
  /**
   * The selection ring + plug-dots are positioned from the selected shape's
   * axis-aligned box, and their MutationObserver watches the shape elements —
   * but position and rotation live on the PARENT group transform, which those
   * observers never see. Interactive drags refresh via finalizeInteraction; this
   * call covers the non-drag paths (position(), setRotation, collab
   * onNodeRotated, group rotate, SlateOperations, host API) where nothing else
   * re-positions the decorations and they would strand at the old box.
   */
  refreshSelectionDecorations() {
    const t = this.slate;
    !t || this._destroyed || t.selectedNodes?.includes?.(this) && t.queueSelectionDecorationRefresh?.();
  }
  /**
   * Set the group's transform to translate(options.x, options.y) followed by a
   * rotation around the node's visual center. The shape/text are drawn at the
   * group's local origin, so position is a pure translate and rotation must be
   * COMPOSED on top of it — replacing the matrix (as an origin:'center' rotate
   * alone does) would drop the translate and fling the node far off-screen on
   * reload. Single source of truth for the group transform.
   */
  /** Tell the slate this note's place or size changed (for a host bar over the selection). */
  queueGeometryNotice() {
    try {
      this.slate?.nodeGeometryChanged?.(this);
    } catch {
    }
  }
  applyPositionAndRotation(t = !0) {
    if (this.queueGeometryNotice(), !this.svgGroup) return;
    const e = this.options.x || 0, s = this.options.y || 0, i = this.options.width || 0, o = this.options.height || 0, r = this.options.rotate?.rotationAngle || 0;
    if (t && typeof this.svgGroup.node?.removeAttribute == "function" && typeof this.svgGroup.bbox == "function")
      try {
        this.svgGroup.node.removeAttribute("transform");
        const c = this.resizeTarget ?? this.backgroundRect, l = c ? { x: c.x(), y: c.y() } : this.svgGroup.bbox();
        l && (Math.abs(l.x) > 0.01 || Math.abs(l.y) > 0.01) && this.svgGroup.children().forEach((h) => {
          typeof h?.dmove == "function" && h.dmove(-l.x, -l.y);
        });
      } catch (c) {
        console.warn("NODE_DEBUG: child normalization failed:", c);
      }
    try {
      const c = (h) => {
        if (!h?.node?.removeAttribute) return !1;
        const d = typeof h.transform == "function" ? h.transform() : null;
        return d && Math.abs(d.rotate || 0) > 0.01 ? (h.node.removeAttribute("transform"), !0) : !1;
      }, l = c(this.textElement);
      c(this.nestedSvg), l && typeof this.centerText == "function" && this.centerText();
    } catch {
    }
    const a = r ? `translate(${e} ${s}) rotate(${r} ${i / 2} ${o / 2})` : `translate(${e} ${s})`;
    this.svgGroup.node.setAttribute("transform", a);
    try {
      this.svgGroup.fire?.("transform");
    } catch {
    }
    try {
      this.slate._activeLineCog && this.slate.clearLineCog?.();
    } catch {
    }
  }
  /** Rotate the parent once. Text, image fills, custom paths and badges all follow. */
  applyInteractionRotation(t) {
    this.options.rotate = { ...this.options.rotate, rotationAngle: t }, this.applyPositionAndRotation(!1);
  }
  /** Normalize the plugin's local resize offset after its last mouse/touch frame. */
  finalizeInteraction() {
    this.applyPositionAndRotation(), this.textElement && this.centerText(), this.slate?.getSelectedNodes().includes(this) && (this.resizeRotate?.syncOverlay(), this.updateConnectionHandlePositions(), this.showNodeCog());
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
          const s = e.connectable({}, e);
          s && typeof s.makeInteractive == "function" ? (console.log(
            "NODE_DEBUG: makeInteractive method available, enabling connection handles for",
            this.id
          ), this.enableConnectionHandles(), s.makeInteractive(), s.connector && s.connector.remove && s.connector.remove()) : console.log(
            "NODE_DEBUG: makeInteractive method not available for",
            this.id
          );
        } catch (s) {
          console.warn(
            "NODE_DEBUG: Error testing svg.connectable.js makeInteractive:",
            s
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
  calculatePathBounds(t, e, s) {
    const i = t.match(/viewBox=["']([^"']+)["']/);
    if (i) {
      const a = i[1].split(/\s+/).map(Number);
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
      const a = parseInt(o[1]), c = parseInt(r[1]);
      if (!isNaN(a) && !isNaN(c))
        return { x: 0, y: 0, width: a, height: c };
    }
    return { x: 0, y: 0, width: 24, height: 24 };
  }
  // Selection Management
  setupSelectionBehavior() {
    this.svgGroup.on("dblclick", (s) => {
      this.isResizeRotateHandle(s.target) || this.handleDoubleClickEdit();
    });
    let t = null;
    const e = 5;
    this.svgGroup.on("pointerdown", (s) => {
      if (this.isResizeRotateHandle(s.target)) {
        console.log(
          "SELECTION_DEBUG: Clicked on resize/rotate handle, skipping selection logic"
        );
        return;
      }
      t = {
        x: s.clientX || s.detail?.x || 0,
        y: s.clientY || s.detail?.y || 0
      };
    }), this.svgGroup.on("pointerup", (s) => {
      if (this.isResizeRotateHandle(s.target)) {
        console.log(
          "SELECTION_DEBUG: Clicked on resize/rotate handle, skipping selection logic"
        ), t = null;
        return;
      }
      if (t) {
        const i = {
          x: s.clientX || s.detail?.x || 0,
          y: s.clientY || s.detail?.y || 0
        };
        if (Math.sqrt(
          Math.pow(i.x - t.x, 2) + Math.pow(i.y - t.y, 2)
        ) <= e)
          if (console.log(
            "SELECTION_DEBUG: Node clicked (position-based detection)",
            this.id
          ), this.media?.hasMedia() && this.slate.isReadOnly?.())
            this.media.play();
          else if (this.links?.hasLink?.() && this.slate.isReadOnly?.())
            this.links.navigate();
          else {
            const r = s.ctrlKey || s.metaKey || s.shiftKey;
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
    t?.onTextPaneRequested && (this.slate.isReadOnly?.() || this.slate.isCommentOnly?.() || this.options.isLocked || this.slate.governanceOf?.(this) || t.onTextPaneRequested(this, (e = {}) => {
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
    if (this.media?.hasMedia()) {
      this.media.play();
      return;
    }
    const t = this.slate, e = this.options.groupId;
    if (e && typeof t?.enterGroup == "function" && t.getEnteredGroupId?.() !== e) {
      t.enterGroup(e, this);
      return;
    }
    t?.capabilitiesOf?.(this).canEditText !== !1 && (!this.options.isComment && !this.nestedSvg && !this.options.isLocked && !this.slate.isReadOnly?.() && !this.slate.isCommentOnly?.() && typeof this.editor?.startInline == "function" ? this.editor.startInline() : this.requestTextPane());
  }
  /**
   * Whether this note's text may be edited on the canvas right now. The same rules a
   * double-click follows: comments and artwork have no inline text, and locked notes,
   * read-only or comment-only viewers and disabled slates never open an editor.
   */
  canEditTextInline() {
    const t = this.slate;
    return !this._destroyed && !!this.svgGroup && !this.options.isComment && !this.media?.hasMedia() && !this.nestedSvg && !this.options.isLocked && t?.options?.enabled !== !1 && !t?.isReadOnly?.() && !t?.isCommentOnly?.() && t?.capabilitiesOf?.(this).canEditText !== !1 && typeof this.editor?.startInline == "function";
  }
  /**
   * The person just created `newNode` from one of this note's connectors. Select it
   * and open its editor so the next thing they type is its name; with nothing typed,
   * Escape or clicking away leaves it blank.
   *
   * Only the three creation gestures call this. Notes that arrive any other way (the
   * API, loaded JSON, collaborators, paste, duplicate, undo/redo) never open an editor.
   *
   * @param gesture "plug": a click or tap on a connector. "keyboard": a direction
   *   button activated from the keyboard, so focus must stay on the canvas. "drop": a
   *   connector dragged into open space; the note is under the pointer, so the view
   *   is left where it is.
   */
  beginNamingCreatedNode(t, e) {
    const s = this.slate, i = () => s.announce?.(`Node added: ${t.options.text || "(unnamed)"}`), o = t.canEditTextInline();
    if (!o && e === "plug") return i();
    if (e !== "drop") {
      const l = s.canvas.viewbox(), h = t.resizeTarget;
      let d;
      if (h?.rbox)
        d = h.rbox(s.canvas);
      else {
        const { x: m = 0, y: g = 0, width: y = 0, height: b = 0 } = t.options;
        d = t.getRotation() ? t.svgGroup.rbox(s.canvas) : { x: m, y: g, x2: m + y, y2: g + b };
      }
      const u = (m, g, y, b) => {
        const x = Math.min(24, Math.max(0, (b - (g - m)) / 2));
        return g - m > b ? (m + g) / 2 - b / 2 : m - x < y ? m - x : g + x > y + b ? g + x - b : y;
      }, f = u(d.x, d.x2, l.x, l.width), p = u(d.y, d.y2, l.y, l.height);
      (f !== l.x || p !== l.y) && s.pan({ x: f, y: p });
    }
    const r = () => s.selectNodes([t]);
    typeof s.withoutAnnouncements == "function" ? s.withoutAnnouncements(r) : r();
    const a = s.getSelectedNodes?.() ?? [], c = a.length === 1 && a[0] === t;
    if (o && c && t.editor.startInline({
      caret: "end",
      preventScroll: !0,
      returnFocus: e === "keyboard"
    })) {
      s.announce?.("Connected note added. Type its name, then press Enter.");
      return;
    }
    e === "keyboard" && t.svgGroup.node.focus({ preventScroll: !0 }), i();
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
    for (const s of e)
      if (t.classList.contains(s))
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
   *
   * Delete and plug are the engine's own. The cog only asks the host to open its
   * note settings (events.onMenuRequested), so it is drawn only when the host
   * supplied that callback: a button that could do nothing is not shown.
   */
  showNodeCog() {
    if (this.options.allowMenu === !1) return;
    this.hideNodeCog();
    const t = this.slate;
    if (t.hostDrawsToolbar?.()) return;
    const e = t.markersContainer || t.canvas;
    if (!e || !this.svgGroup) return;
    let s, i;
    try {
      const y = this.svgGroup.rbox(t.canvas);
      s = y.x + y.width / 2, i = y.y;
    } catch {
      s = (this.options.x || 0) + (this.options.width || 0) / 2, i = this.options.y || 0;
    }
    const o = 15, r = 6, a = "#5b6472", c = t.capabilitiesOf?.(this), l = !!t.governanceOf?.(this);
    if (l && c?.canDelete === !1) return;
    const h = [];
    if (c?.canDelete !== !1 && h.push({ key: "delete", color: "#e5484d", onClick: () => this.slate.removeNode(this.id) }), c?.canConnect !== !1 && h.push({ key: "plug", color: a, onPress: (y) => this.startConnectDrag(y) }), !l && typeof t.options?.events?.onMenuRequested == "function" && h.push({ key: "cog", color: a, onClick: () => this.menu?.open?.() }), !h.length) return;
    const d = h.length, u = o * 2 + r, f = d * (o * 2) + (d - 1) * r, p = s - f / 2 + o, m = i - (o + 28 + 36), g = e.group().addClass("node-cog").addClass("node-toolbar");
    g.rect(f + 14, o * 2 + 10).radius((o * 2 + 10) / 2).center(s, m).fill("#ffffff").stroke({ color: "#e3e5ea", width: 1 }), h.forEach((y, b) => {
      const x = p + b * u, C = g.group().addClass(`node-tool-${y.key}`);
      C.circle(o * 2).center(x, m).fill("#ffffff").attr("fill-opacity", 1e-3), Cs.drawToolIcon(C, y.key, x, m, y.color), C.attr("pointer-events", "all");
      try {
        C.node.style.cursor = "pointer";
      } catch {
      }
      C.on("mousedown", (v) => {
        v.stopPropagation?.(), y.onPress && y.onPress(v);
      }), C.on("click", (v) => {
        v.stopPropagation?.(), y.onClick?.();
      });
    }), g.attr("pointer-events", "all"), this._nodeCog = g;
    try {
      t.markersContainer?.front?.();
    } catch {
    }
  }
  /** Draw a crisp monochrome line-icon (delete/plug/cog) centered at (cx,cy). */
  static drawToolIcon(t, e, s, i, o) {
    const r = { color: o, width: 1.6, linecap: "round", linejoin: "round" };
    e === "delete" ? (t.line(s - 6, i - 5, s + 6, i - 5).stroke(r), t.line(s - 2.5, i - 5, s - 2, i - 7.5).stroke(r), t.line(s + 2.5, i - 5, s + 2, i - 7.5).stroke(r), t.line(s - 2, i - 7.5, s + 2, i - 7.5).stroke(r), t.path(`M ${s - 4.5} ${i - 4} L ${s - 3.8} ${i + 6.5} L ${s + 3.8} ${i + 6.5} L ${s + 4.5} ${i - 4}`).fill("none").stroke(r), t.line(s - 1.3, i - 2, s - 1.3, i + 4).stroke({ color: o, width: 1.1, linecap: "round" }), t.line(s + 1.3, i - 2, s + 1.3, i + 4).stroke({ color: o, width: 1.1, linecap: "round" })) : e === "plug" ? (t.line(s - 4, i + 4, s + 4, i - 4).stroke(r), t.circle(4.4).center(s - 4.5, i + 4.5).fill(o), t.circle(4.4).center(s + 4.5, i - 4.5).fill("#ffffff").stroke(r)) : t.text("⚙").font({ size: 17, anchor: "middle", family: "sans-serif" }).fill(o).center(s, i).attr("dy", "0.05em");
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
    const e = this.slate, s = e.canvas;
    if (!s || e.capabilitiesOf?.(this).canConnect === !1 || this._connectDragging) return;
    this._connectDragging = !0;
    const i = e.markersContainer || s;
    let o, r;
    try {
      const b = this.svgGroup.rbox(s);
      o = b.cx, r = b.cy;
    } catch {
      o = (this.options.x || 0) + (this.options.width || 0) / 2, r = (this.options.y || 0) + (this.options.height || 0) / 2;
    }
    const a = i.path(`M ${o} ${r} L ${o} ${r}`).fill("none").stroke({ color: "#007cff", width: 2, dasharray: "6,4", linecap: "round" }).addClass("connect-drag-line");
    a.attr("pointer-events", "none");
    let c = null;
    try {
      c = i.marker(7, 7, (b) => {
        b.path("M0,0 L7,3.5 L0,7 z").fill("#007cff").attr("pointer-events", "none");
      }), c.ref(6, 3.5), c.attr("pointer-events", "none"), a.marker("end", c);
    } catch {
    }
    try {
      e.markersContainer?.front?.();
    } catch {
    }
    const l = (b, x, C, v) => {
      const w = Math.hypot(b, x);
      if (w > 1e-4) return [b / w, x / w];
      const _ = Math.hypot(C, v) || 1;
      return [C / _, v / _];
    }, h = (b, x, C) => {
      const v = (b.x || 0) + (b.width || 0) / 2, w = (b.y || 0) + (b.height || 0) / 2, _ = x - v, S = C - w;
      if (Math.abs(_) < 1e-3 && Math.abs(S) < 1e-3) return { x: v, y: w };
      const T = _ !== 0 ? (b.width || 0) / 2 / Math.abs(_) : 1 / 0, A = S !== 0 ? (b.height || 0) / 2 / Math.abs(S) : 1 / 0, M = Math.min(T, A);
      return { x: v + _ * M, y: w + S * M };
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
    }, f = (b, x) => {
      try {
        return s.point(b, x);
      } catch {
        return { x: o, y: r };
      }
    }, p = (b, x) => {
      let C;
      try {
        C = a.node.style.display, a.node.style.display = "none";
      } catch {
      }
      const v = document.elementFromPoint(b, x);
      try {
        C !== void 0 && (a.node.style.display = C);
      } catch {
      }
      const _ = v?.closest?.("[data-node-id]")?.getAttribute?.("data-node-id");
      if (_ && _ !== this.id) return e.nodes?.one?.(_) || null;
      try {
        const S = e.nodes?.allNodes || [];
        for (const T of S) {
          if (!T || T.id === this.id) continue;
          const A = document.querySelector(`#slateCanvas [data-node-id="${T.id}"]`)?.getBoundingClientRect?.(), M = 14;
          if (A && b >= A.left - M && b <= A.right + M && x >= A.top - M && x <= A.bottom + M)
            return T;
        }
      } catch {
      }
      return null;
    }, m = (b) => !!b && e.capabilitiesOf?.(b).canConnect === !1, g = (b) => {
      if (t.pointerId != null && b.pointerId !== t.pointerId) return;
      const x = f(b.clientX, b.clientY), C = p(b.clientX, b.clientY), v = m(C) ? null : C;
      if (v && v.options) {
        const w = v.options, _ = (w.x || 0) + (w.width || 0) / 2, S = (w.y || 0) + (w.height || 0) / 2, T = (Z, vt, Y, St) => {
          try {
            const Rt = Z && Z.svgGroup;
            if (Rt) {
              const V = Zn(Rt, [Y, St]);
              if (V && isFinite(V[0]) && isFinite(V[1]))
                return { x: V[0], y: V[1] };
            }
          } catch {
          }
          return h(vt, Y, St);
        }, A = T(v, w, o, r), M = T(this, this.options, _, S), N = A.x - M.x, R = A.y - M.y, P = Math.hypot(N, R) || 1, E = l(M.x - o, M.y - r, N, R), k = l(A.x - _, A.y - S, -N, -R), O = Math.max(30, Math.min(P * 0.45, 90)), L = M.x + E[0] * O, z = M.y + E[1] * O, W = A.x + k[0] * O, X = A.y + k[1] * O;
        a.plot(
          `M ${M.x} ${M.y} C ${L} ${z} ${W} ${X} ${A.x} ${A.y}`
        );
      } else
        a.plot(`M ${o} ${r} L ${x.x} ${x.y}`);
      if (v !== (d?.node || null) && (u(), v && v.backgroundRect)) {
        const w = v.backgroundRect;
        d = { node: v, _preHiStroke: w.attr("stroke") };
        try {
          w.attr({ stroke: "#007cff", "stroke-dasharray": "8,4", "stroke-opacity": 0.9 });
        } catch {
        }
      }
    }, y = (b) => {
      if (t.pointerId != null && b.pointerId !== t.pointerId) return;
      window.removeEventListener("pointercancel", y, !0), window.removeEventListener("pointermove", g, !0), window.removeEventListener("pointerup", y, !0), this._connectDragging = !1;
      try {
        a.remove(), c?.remove?.(), s.node.querySelectorAll(
          ".connect-drag-line"
        ).forEach((v) => v.remove());
      } catch {
      }
      if (u(), b.type === "pointercancel") return;
      const x = p(b.clientX, b.clientY);
      if (!m(x)) {
        if (x && x.id !== this.id)
          try {
            let C;
            try {
              const v = f(b.clientX, b.clientY), w = x.options || {}, _ = un(
                { x: w.x || 0, y: w.y || 0, width: w.width || 1, height: w.height || 1, rotation: w.rotate?.rotationAngle || 0 },
                v
              ), S = ys(_.x, _.y);
              S && (C = { targetAnchor: S });
            } catch {
            }
            this.relationships.addAssociation(x, C);
          } catch {
          }
        else if (!x)
          try {
            const C = f(b.clientX, b.clientY), v = this.options, w = 16, _ = C.x >= (v.x || 0) - w && C.x <= (v.x || 0) + (v.width || 0) + w && C.y >= (v.y || 0) - w && C.y <= (v.y || 0) + (v.height || 0) + w;
            if (!e.isReadOnly?.() && !_) {
              const A = e.addNode({
                x: Math.round(C.x - 60),
                y: Math.round(C.y - 35),
                width: 120,
                height: 70,
                text: ""
              });
              if (A) {
                A.announcedByCreator = !0;
                const M = () => {
                  try {
                    this.relationships.addAssociation(A);
                  } catch {
                  }
                  try {
                    e.nodes?.one?.(A.id) === A && this.beginNamingCreatedNode(A, "drop");
                  } catch {
                  }
                };
                A.ready?.then ? A.ready.then(M) : M();
              }
            }
          } catch {
          }
      }
    };
    window.addEventListener("pointermove", g, !0), window.addEventListener("pointerup", y, !0), window.addEventListener("pointercancel", y, !0);
  }
  /** Called by the Slate when this node is deselected. */
  onDeselected() {
    console.log("SELECTION_DEBUG: Node deselected", this.id);
  }
  canUseConnectionHandles() {
    return this.slate.options.enabled !== !1 && !this.slate.isReadOnly() && !this.slate.isCommentOnly() && !this.options.isLocked && this.slate.capabilitiesOf?.(this).canConnect !== !1;
  }
  /** The plugs live outside the node group so their geometry does not affect the note. */
  focusFirstConnectionHandle() {
    return !this._connHandlesPinned || !this.connectionHandlesVisible || !this.canUseConnectionHandles() ? !1 : (this.connectionHandles.top?.node.focus(), !0);
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
    const t = this.connectionHandles.container.attr("tabindex", -1);
    t.on("focusin", () => {
      for (const r of zn) this.connectionHandles[r]?.attr("tabindex", 0);
    }), t.on("focusout", (r) => {
      if (!t.node.contains(r.relatedTarget))
        for (const a of zn) this.connectionHandles[a]?.attr("tabindex", -1);
    });
    const e = 8, s = "#007cff", i = "#ffffff", o = 2;
    zn.forEach((r) => {
      if (!this.connectionHandles.container) return;
      const a = this.connectionHandles.container.circle(e * 2).fill(s).stroke({ color: i, width: o }).attr({ role: "button", tabindex: -1, "aria-label": Yp[r] }).addClass(`connection-handle connection-handle-${r}`);
      a.node.style.cursor = "pointer", this.connectionHandles[r] = a, a.on(
        "mouseenter",
        () => this.showConnectionPreview(r)
      ), a.on("mouseleave", () => this.hideConnectionPreview()), a.on("keydown", (c) => {
        if (c.key === "Tab" && c.shiftKey && r === "top") {
          c.preventDefault(), this.svgGroup.node.focus();
          return;
        }
        if (c.key === "Tab" && !c.shiftKey && r === "left") {
          if (this.resizeRotate?.focusKnob()) {
            c.preventDefault();
            return;
          }
          this.svgGroup.node.focus();
          return;
        }
        if (c.key === "Escape") {
          this.svgGroup.node.focus();
          return;
        }
        c.key !== "Enter" && c.key !== " " || (c.preventDefault(), c.stopPropagation(), !(c.repeat || !this._connHandlesPinned || !this.canUseConnectionHandles()) && this.createConnectedNode(r, !0));
      }), a.on("click", (c) => {
        c.stopPropagation(), !(this.draggedPlug === a || !this.canUseConnectionHandles()) && (console.log(
          `CONNECTION_HANDLES_DEBUG: ${r} handle clicked on`,
          this.id
        ), this.createConnectedNode(r, c.detail === 0 && this._connHandlesPinned));
      }), a.node.style.touchAction = "none", a.on("pointerdown", (c) => {
        this.beginPlugGesture(c, a, c.pointerType === "touch" ? () => this.createConnectedNode(r) : void 0);
      });
    }), this.connectionHandles.container && this.connectionHandles.container.hide(), this.updateConnectionHandlePositions();
  }
  /** A touch on empty canvas can start at most 14 displayed CSS pixels from a selected plug. */
  beginNearbyTouchConnection(t) {
    if (!this.connectionHandlesVisible || !this.canUseConnectionHandles()) return !1;
    let e, s = 14;
    for (const r of zn) {
      const a = this.connectionHandles[r];
      if (!a) continue;
      const c = a.node.getBoundingClientRect(), l = Math.hypot(t.clientX - c.left - c.width / 2, t.clientY - c.top - c.height / 2);
      c.width && l <= s && (e = { direction: r, handle: a }, s = l);
    }
    if (!e) return !1;
    const { direction: i, handle: o } = e;
    return this.beginPlugGesture(t, o, () => this.createConnectedNode(i)), !0;
  }
  beginPlugGesture(t, e, s) {
    if (this.slate.isReadOnly()) return;
    t.stopPropagation(), this.draggedPlug = void 0;
    const i = this.slate.canvas.node, o = (h) => h.preventDefault();
    s && i.addEventListener("touchstart", o, { capture: !0, passive: !1, once: !0 });
    const r = () => {
      i.removeEventListener("touchstart", o, !0), window.removeEventListener("pointermove", l, !0), window.removeEventListener("pointerup", c, !0), window.removeEventListener("pointercancel", a, !0);
    }, a = (h) => {
      h.pointerId === t.pointerId && r();
    }, c = (h) => {
      h.pointerId === t.pointerId && (r(), s?.());
    }, l = (h) => {
      h.pointerId !== t.pointerId || Math.hypot(h.clientX - t.clientX, h.clientY - t.clientY) <= 5 || (r(), this.draggedPlug = e, this.startConnectDrag(t));
    };
    window.addEventListener("pointermove", l, !0), window.addEventListener("pointerup", c, !0), window.addEventListener("pointercancel", a, !0);
  }
  updateConnectionHandlePositions() {
    if (!this.connectionHandles.container || !this.connectionHandlesVisible)
      return;
    const t = this.resizeTarget ?? this.backgroundRect;
    if (!t?.root?.()) return;
    const e = t.bbox(), { matrix: s } = this.restingGeometry(t), i = ([h, d], { a: u, b: f, c: p, d: m, e: g, f: y }) => [h * u + d * p + g, h * f + d * m + y], o = e.x + e.width / 2, r = e.y + e.height / 2, a = 35, c = 20, l = {
      top: [o, e.y - a],
      right: [e.x + e.width + c, r],
      bottom: [o, e.y + e.height + c],
      left: [e.x - c, r]
    };
    Object.entries(l).forEach(([h, d]) => {
      const u = this.connectionHandles[h];
      if (u) {
        const [f, p] = i(d, s);
        u.center(f, p);
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
    this.canUseConnectionHandles() && (this.isDragging || (this._connHandleHideTimer && (clearTimeout(this._connHandleHideTimer), this._connHandleHideTimer = null), this.connectionHandlesVisible || this.showConnectionHandles()));
  }
  scheduleConnHandlesHide() {
    this._connHandlesPinned || (this._connHandleHideTimer && clearTimeout(this._connHandleHideTimer), this._connHandleHideTimer = setTimeout(() => {
      this._connHandleHideTimer = null, !(this._connHandlesPinned || this._connectDragging) && this.hideConnectionHandles();
    }, 220));
  }
  /**
   * Put resize/rotate away and hide the drag-to-connect plug handles for the
   * rest of a drag that has begun to move. The handles live in a global canvas
   * group (not this node's group), so they don't follow the node while it moves,
   * leaving "ghost" dots behind at the old position. Force-hide past the
   * selection pin; drag-end re-anchors them.
   */
  hideHandlesForDrag() {
    this._handlesHiddenForDrag || (this._handlesHiddenForDrag = !0, this.slate.frameGestureStart?.("drag"), this.slate.disableNodeResizeRotate(this), this.hideConnectionHandles(), this.slate.getSelectedNodes?.().forEach((t) => {
      t !== this && t.hideConnectionHandles?.();
    }));
  }
  showConnectionHandles() {
    this._removed || (this.connectionHandles.container || this.createConnectionHandles(), console.log(
      "CONNECTION_HANDLES_DEBUG: Showing connection handles for",
      this.id
    ), this.connectionHandlesVisible = !0, this.connectionHandles.container?.attr("aria-hidden", !this._connHandlesPinned), this.connectionHandles.container && this.connectionHandles.container.show(), this.updateConnectionHandlePositions());
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
    const s = this.options.width, i = this.options.height, o = 75, r = this.getRotation(), a = this.resizeTarget ?? this.backgroundRect, { matrix: c, cx: l, cy: h } = this.restingGeometry(a), d = this.connectionHandles[t];
    if (!d) {
      console.warn("CONNECTION_HANDLES_DEBUG: Handle not found for direction", t);
      return;
    }
    const u = d.bbox(), f = {
      x: u.x + u.width / 2,
      y: u.y + u.height / 2
    }, p = f.x - l, m = f.y - h, g = Math.sqrt(p * p + m * m), y = p / g, b = m / g, x = a.bbox(), C = x.x + x.width / 2, v = x.y + x.height / 2, w = c.inverse(), _ = y * w.a + b * w.c, S = y * w.b + b * w.d;
    let T, A;
    const M = Math.abs(_);
    Math.abs(S) > M ? S < 0 ? (T = C, A = x.y) : (T = C, A = x.y + x.height) : _ < 0 ? (T = x.x, A = v) : (T = x.x + x.width, A = v);
    const R = ([Rt, V], { a: qt, b: ae, c: ft, d: wt, e: we, f: Dt }) => [Rt * qt + V * ft + we, Rt * ae + V * wt + Dt], [P, E] = R([T, A], c), k = Math.sqrt(
      Math.pow(P - l, 2) + Math.pow(E - h, 2)
    ), O = k, L = k + o + O, z = l + y * L, W = h + b * L, X = z - s / 2, Z = W - i / 2;
    if (!this.connectionPreview.container) {
      console.warn("CONNECTION_HANDLES_DEBUG: Preview container not found");
      return;
    }
    this.connectionPreview.node = this.createPreviewShape(
      this.connectionPreview.container,
      X,
      Z,
      s,
      i,
      r
      // Pass rotation angle to preview
    );
    const Y = k + o - g, St = {
      x: f.x + y * Y,
      y: f.y + b * Y
    };
    this.connectionPreview.connector = this.connectionPreview.container.line(f.x, f.y, St.x, St.y).stroke({ color: "#007cff", width: 2, opacity: 0.7 }).attr("pointer-events", "none"), this.addArrowheadToConnector(
      this.connectionPreview.container,
      f,
      St
    );
  }
  /**
   * The note's box at rest, in canvas coordinates: the matrix from `geo`'s own
   * units to the canvas, and the box's centre. A running or finished node
   * animation moves the drawn shape (a rectangle note is animated directly), so
   * the plug dots, the sibling preview and the sibling are placed from the
   * resting matrix (core/Animations.ts restingScreenCTM), never the frame.
   */
  restingGeometry(t) {
    const e = t.bbox(), s = t.root().screenCTM();
    let i;
    const o = vp(t.node);
    if (o) {
      const c = new B(o);
      i = s.inverseO().multiplyO(c);
    } else
      i = s.inverseO().multiplyO(t.screenCTM());
    const r = e.x + e.width / 2, a = e.y + e.height / 2;
    return { matrix: i, cx: r * i.a + a * i.c + i.e, cy: r * i.b + a * i.d + i.f };
  }
  /** The outline the plug preview draws: any path shape but the plain rectangle (kept as the rounded ghost). */
  previewOutline() {
    if (String(this.options.vectorPath || this.options.shape || "rectangle").toLowerCase() !== "rectangle")
      return Qn(this.options.shape, this.options.vectorPath);
  }
  createPreviewShape(t, e, s, i, o, r = 0) {
    let a;
    const c = this.options.backgroundColor || "#007cff", l = "#ffffff", h = 2, d = 0.6, u = e + i / 2, f = s + o / 2;
    switch (this.options.shape) {
      case "circle":
        const p = Math.min(i, o) / 2;
        a = t.circle(p * 2).center(u, f).fill(c).stroke({ color: l, width: h }).opacity(d), r !== 0 && a.rotate(r, u, f);
        break;
      case "ellipse":
        a = t.ellipse(i, o).center(u, f).fill(c).stroke({ color: l, width: h }).opacity(d), r !== 0 && a.rotate(r, u, f);
        break;
      default:
        if (this.options.svgContent) {
          a = t.rect(i, o).move(e, s).fill("none").stroke({ color: l, width: h }).opacity(d).radius(4);
          const m = t.nested().size(i, o).move(e, s);
          m.svg(this.options.svgContent), this._previewViewboxTimeoutId = setTimeout(() => {
            if (this._destroyed) return;
            const g = m.children()[0];
            if (g) {
              let y = g.bbox();
              (y.width <= 0 || y.height <= 0) && (y = this.calculatePathBounds(
                this.options.svgContent,
                i,
                o
              )), y.width > 0 && y.height > 0 && (m.viewbox(y.x, y.y, y.width, y.height), m.node.setAttribute("preserveAspectRatio", "none")), g.fill(c).opacity(d);
            }
          }, 1), m.attr("pointer-events", "none"), r !== 0 && (a.rotate(r, u, f), m.rotate(r, u, f));
        } else if (this.previewOutline()) {
          const m = this.previewOutline();
          a = t.nested().size(i, o).move(e, s);
          const g = a.path(m.path).fill(c).stroke({ color: l, width: h }).attr("vector-effect", "non-scaling-stroke");
          this.isCustomShape() && g.attr("fill-rule", this.options.fillRule === "evenodd" ? "evenodd" : "nonzero");
          try {
            const y = g.bbox();
            a.viewbox(y.width > 0 && y.height > 0 ? `${y.x} ${y.y} ${y.width} ${y.height}` : m.viewBox);
          } catch {
            a.viewbox(m.viewBox);
          }
          if (String(this.options.vectorPath || this.options.shape || "").toLowerCase() !== "circle" && a.attr("preserveAspectRatio", "none"), a.attr({ overflow: "visible", opacity: d }).attr("data-preview-shape", "path"), r !== 0) {
            const y = t.group();
            y.add(a), y.rotate(r, u, f);
          }
        } else
          a = t.rect(i, o).move(e, s).fill(c).stroke({ color: l, width: h }).opacity(d).radius(4), r !== 0 && a.rotate(r, u, f);
        break;
    }
    return a.attr("pointer-events", "none");
  }
  addArrowheadToConnector(t, e, s) {
    const i = s.x - e.x, o = s.y - e.y, r = Math.sqrt(i * i + o * o);
    if (r === 0) return;
    const a = i / r, c = o / r, l = 12, h = 6, d = s.x, u = s.y, f = d - a * l, p = u - c * l, m = -c * h, g = a * h, y = [
      [d, u],
      [f + m, p + g],
      [f - m, p - g],
      [d, u]
    ];
    t.polygon(y).fill("#007cff").opacity(0.8).attr("pointer-events", "none");
  }
  hideConnectionPreview() {
    this.connectionPreview?.container && (this.connectionPreview.container.remove(), this.connectionPreview = void 0);
  }
  /** Show connection handles (4 blue dots) on this node for creating connected siblings. */
  enableConnectionHandles() {
    this.canUseConnectionHandles() && (console.log(
      "CONNECTION_HANDLES_DEBUG: enableConnectionHandles called for",
      this.id
    ), this._connHandlesPinned = !0, this._connHandleHideTimer && (clearTimeout(this._connHandleHideTimer), this._connHandleHideTimer = null), !(this.isDragging && this._handlesHiddenForDrag) && this.showConnectionHandles());
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
    const s = t.x + t.width / 2, i = t.y + t.height / 2;
    switch (e) {
      case "top":
        return { x: s, y: t.y };
      case "right":
        return { x: t.x + t.width, y: i };
      case "bottom":
        return { x: s, y: t.y + t.height };
      case "left":
        return { x: t.x, y: i };
    }
  }
  /** @param focusChild the gesture came from the keyboard (or assistive technology) */
  createConnectedNode(t, e = !1) {
    console.log(
      "CONNECTION_HANDLES_DEBUG: Creating connected node in direction",
      t,
      "from",
      this.id
    );
    try {
      const s = this.options.width, i = this.options.height, o = 75, r = this.getRotation(), a = r * Math.PI / 180;
      let c = 0, l = 0;
      switch (t) {
        case "top":
          c = 0, l = -1;
          break;
        case "right":
          c = 1, l = 0;
          break;
        case "bottom":
          c = 0, l = 1;
          break;
        case "left":
          c = -1, l = 0;
          break;
      }
      const h = c * Math.cos(a) - l * Math.sin(a), d = c * Math.sin(a) + l * Math.cos(a), u = this.resizeTarget ?? this.backgroundRect, { matrix: f, cx: p, cy: m } = this.restingGeometry(u), g = u.bbox(), y = g.x + g.width / 2, b = g.y + g.height / 2;
      let x, C;
      switch (t) {
        case "top":
          x = y, C = g.y;
          break;
        case "right":
          x = g.x + g.width, C = b;
          break;
        case "bottom":
          x = y, C = g.y + g.height;
          break;
        case "left":
          x = g.x, C = b;
          break;
      }
      const v = ([O, L], { a: z, b: W, c: X, d: Z, e: vt, f: Y }) => [O * z + L * X + vt, O * W + L * Z + Y], [w, _] = v([x, C], f), S = Math.sqrt(
        Math.pow(w - p, 2) + Math.pow(_ - m, 2)
      ), T = S, A = S + o + T, M = p + h * A, N = m + d * A, R = M - s / 2, P = N - i / 2, E = this.cloneNodeOptions(R, P, r), k = this.slate.addNode(E);
      if (!k) {
        console.error("CONNECTION_HANDLES_DEBUG: Failed to create new node");
        return;
      }
      console.log(
        "CONNECTION_HANDLES_DEBUG: Created new node",
        k.id,
        "at",
        R,
        P
      ), this.hideConnectionPreview(), k.announcedByCreator = !0, k.ready.then(() => {
        this._destroyed || this.slate.getNode(this.id) !== this || this.slate.getNode(k.id) !== k || (this.connectToNode(k), this.canUseConnectionHandles() ? this.beginNamingCreatedNode(k, e ? "keyboard" : "plug") : this.slate.announce(`Node added: ${k.options.text || "(unnamed)"}`));
      }).catch((O) => console.error("Could not connect the new note", O));
    } catch (s) {
      console.error(
        "CONNECTION_HANDLES_DEBUG: Error creating connected node:",
        s
      );
    }
  }
  cloneNodeOptions(t, e, s) {
    const i = "node_" + Math.random().toString(36).substr(2, 9);
    return {
      ...this.options,
      id: i,
      x: t,
      y: e,
      text: "",
      // Inherit the source node's rotation angle so the new node MATCHES the drag preview,
      // but give it its OWN independent rotate object — a fresh object, NOT the shared
      // reference the `...this.options` spread would leave. That shared reference was the
      // bug: rotating the source LATER also rotated the new node (both pointed at the same
      // object, applied on the new node's next drag). A fresh copy makes each node rotate
      // independently from then on.
      rotate: {
        rotationAngle: (s !== void 0 ? s : this.options.rotate?.rotationAngle) || 0
      }
    };
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
function qp(n, t) {
  if (!n) return !1;
  const e = (s) => s ? `${s.x},${s.y}` : "";
  return n.childId === t.childId && e(n.targetPoint) === e(t.targetPoint);
}
class Zp {
  constructor(t) {
    this.nodes = /* @__PURE__ */ new Map(), this.unbuilt = /* @__PURE__ */ new Set(), this.slate = t;
  }
  add(t = {}) {
    if (t.id || (t.id = this.generateId()), this.nodes.has(t.id))
      return console.warn(`Node with id "${t.id}" already exists`), this.nodes.get(t.id);
    const e = new Cs(t, this.slate);
    this.nodes.set(e.id, e);
    const s = e.ready, i = () => {
      this.nodes.get(e.id) === e && this.slate.nodeAdded?.(e);
    };
    if (s && typeof s.then == "function") {
      this.unbuilt.add(s);
      const o = () => {
        this.unbuilt.delete(s);
      };
      s.then(o, o), s.then(i, () => {
      });
    } else
      i();
    return e;
  }
  /** The notes still being drawn, as promises that settle when each is ready. */
  building() {
    return Array.from(this.unbuilt);
  }
  /** Give up on notes that never finished drawing (see Slate.whenBuilt). */
  stopWaitingFor(t) {
    t.forEach((e) => this.unbuilt.delete(e));
  }
  remove(t) {
    const e = this.nodes.get(t);
    if (e) {
      try {
        e.relationships?.removeAll?.();
      } catch {
      }
      this.allNodes.forEach((i) => {
        if (i.id !== t)
          try {
            const o = i.relationships;
            ((o?.getAssociations?.() || []).some((a) => a.childId === t) || o?.getAssociation?.(t)) && o.removeAssociation(t);
          } catch {
          }
      });
      const s = this.slate;
      return s?.getSelectedNodes?.()?.includes?.(e) && s.deselectNode?.(e), e.remove(), this.nodes.delete(t), !0;
    }
    return !1;
  }
  one(t) {
    return this.nodes.get(t);
  }
  get allNodes() {
    return Array.from(this.nodes.values());
  }
  /**
   * Move a note to the front (the end of the list, drawn last) or the back
   * (the start). The list is the order notes are saved and loaded in, so a
   * reload keeps the z-order a person or an agent chose.
   */
  reorder(t, e) {
    const s = this.nodes.get(t);
    if (s) {
      if (this.nodes.delete(t), e === "front") {
        this.nodes.set(t, s);
        return;
      }
      this.nodes = new Map([[t, s], ...this.nodes]);
    }
  }
  /**
   * Take a z-order result from the room: the notes `order` names go, in that
   * order, into the places those notes hold now; a note it does not name (one
   * added after the order was sent) keeps its place. Then the drawing follows
   * the list, the last note on top.
   */
  applyOrder(t) {
    const e = Array.from(this.nodes.keys()), s = t.filter((a, c) => this.nodes.has(a) && t.indexOf(a) === c), i = new Set(s);
    let o = 0;
    const r = e.map((a) => i.has(a) ? s[o++] : a);
    this.nodes = new Map(r.map((a) => [a, this.nodes.get(a)])), this.nodes.forEach((a) => a.svgGroup?.front?.());
  }
  /**
   * Take every note off the slate (a whole-slate replace: load, undo/redo, a style worn,
   * switched, removed or reverted, a replace from the room; or the slate going away). Each note
   * leaves as remove() lets one go, less the per-line bookkeeping (every note is going): its lines
   * are taken down with everything they drew outside the note, the end handles and arrowheads in
   * the slate's shared markers layer too (removing the note's group alone left those behind, one
   * more set of orphan end dots per replace), and it leaves the selection, so no outline, plug or
   * cog stays round empty canvas. Nothing is broadcast or recorded: the replace is the change.
   */
  clear() {
    const t = this.slate, e = this.allNodes;
    e.length && t?.clearLineCog?.(), e.forEach((s) => {
      try {
        t?.getSelectedNodes?.()?.includes?.(s) && t.deselectNode?.(s);
      } catch {
      }
      try {
        s.connector?.disconnectAll?.();
      } catch {
      }
      s.remove();
    }), this.nodes.clear();
  }
  /** Destroy the nodes manager, clearing all nodes */
  destroy() {
    this.clear(), this.slate = null;
  }
  /**
   * Move nodes from a collab package. Accepts BOTH shapes:
   *  - v2: `data.nodes: [{id, x, y}]`
   *  - v1: `data.nodeOptions: [{id, xPos, yPos, groupId, isLocked}]`
   *    (drag, arrangement, grouping, and group-lock broadcasts)
   */
  moveNodes(t, e = {}) {
    const s = t?.data ?? t ?? {}, i = e.animate === !1 || s.dur === 0 ? 0 : s.dur ?? 400, o = [];
    Array.isArray(s.nodes) && s.nodes.forEach(
      (r) => o.push({
        id: r.id,
        x: r.x,
        y: r.y,
        groupId: r.groupId,
        hasGroupId: Object.prototype.hasOwnProperty.call(r, "groupId"),
        isLocked: r.isLocked
      })
    ), Array.isArray(s.nodeOptions) && s.nodeOptions.forEach(
      (r) => o.push({
        id: r.id,
        x: r.xPos ?? r.x,
        y: r.yPos ?? r.y,
        groupId: r.groupId,
        hasGroupId: Object.prototype.hasOwnProperty.call(r, "groupId"),
        isLocked: r.isLocked
      })
    ), o.forEach((r) => {
      const a = this.one(r.id);
      a && (typeof r.x == "number" && typeof r.y == "number" && a.position(r.x, r.y, void 0, void 0, i), r.hasGroupId && (a.options.groupId = r.groupId || void 0), r.isLocked === !0 && !a.options.isLocked ? a.lock() : r.isLocked === !1 && a.options.isLocked && a.unlock());
    });
  }
  /** Create an association from a collab package: `{parentId, childId, ...opts}` */
  addRelationship(t, e = !1) {
    const { parentId: s, childId: i, targetPoint: o } = t || {}, r = s ? this.one(s) : void 0;
    if (!r) {
      console.warn("NODESMANAGER_DEBUG: addRelationship missing parent", s);
      return;
    }
    const a = [r].filter((h) => !h.relationships && h.ready);
    if (a.length && !e) {
      Promise.all(a.map((h) => h.ready)).then(() => this.addRelationship(t, !0)).catch((h) => console.warn("NODESMANAGER_DEBUG: addRelationship after ready failed", h));
      return;
    }
    const c = t.id;
    if (c) {
      const h = this.allNodes.find((d) => d.relationships?.hasAssociationId?.(c));
      if (h) {
        const d = h.relationships.getAssociations?.().find((u) => u.id === c);
        if (h === r && qp(d, t)) return;
        h.relationships.removeAssociation(c);
      }
    } else if (r.relationships?.getAssociation?.(i))
      return;
    if (o) {
      r.relationships?.addFloatingAssociation(
        o,
        t
      );
      return;
    }
    const l = i ? this.one(i) : void 0;
    if (!l) {
      console.warn(
        "NODESMANAGER_DEBUG: addRelationship missing child",
        s,
        i
      );
      return;
    }
    r.relationships?.addAssociation(l, t);
  }
  /** Remove an association from a collab package: `{parentId, childId, id?}` */
  removeRelationship(t) {
    const { parentId: e, childId: s, id: i } = t || {}, o = e ? this.one(e) : void 0;
    !o || !s && !i || o.relationships?.removeAssociation(i || s);
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
function ot(n) {
  return !!n && typeof n == "object" && !Array.isArray(n);
}
const Vp = /^(#[0-9a-f]{3,8}|(rgb|rgba|hsl|hsla)\([\d\s.,%+-]{1,60}\)|[a-z]{3,30}|transparent)$/i, Kp = /^https?:\/\/[^\s]+$/i, bc = 2e3, Jp = /^[A-Za-z0-9_-]{1,64}$/;
function os(n, t) {
  if (typeof t != "string") return;
  const e = t.trim().toLowerCase();
  return n.find((s) => s.toLowerCase() === e);
}
function it(n, t, e) {
  switch (n.type) {
    case "string":
      return t === null && n.nullable ? null : typeof t != "string" ? `${e} must be a string.` : t.length > n.maxLength ? `${e} must be at most ${n.maxLength} characters.` : n.minLength && t.trim().length < n.minLength ? `${e} must not be empty.` : null;
    case "number":
      return typeof t != "number" || !Number.isFinite(t) || t < n.min || t > n.max ? `${e} must be a number from ${n.min} to ${n.max}.` : null;
    case "boolean":
      return typeof t == "boolean" ? null : `${e} must be true or false.`;
    case "enum":
      return t === null && n.nullable || (n.caseless ? os(n.values, t) : n.values.find((i) => i === t)) !== void 0 ? null : `${e} must be one of: ${n.values.join(", ")}.`;
    case "shape": {
      if (t && typeof t == "object" && !Array.isArray(t)) {
        const s = uo(t);
        return s.ok ? null : `${e} is not a usable custom shape: ${s.message}`;
      }
      return os(n.values, t) !== void 0 ? null : `${e} must be one of: ${n.values.join(", ")} (or a custom shape {name, d, fillRule}).`;
    }
    case "list":
      return Array.isArray(t) && t.every((s) => typeof s == "string" && n.values.includes(s)) && new Set(t).size === t.length ? null : `${e} must be a list of different values from: ${n.values.join(", ")} (or an empty list).`;
    case "color":
      return typeof t == "string" && Vp.test(t.trim()) ? null : `${e} must be a colour such as #336699 or rgb(51, 102, 153).`;
    case "point":
      return ot(t) && Object.keys(t).every((s) => s === "x" || s === "y") && [t.x, t.y].every((s) => typeof s == "number" && Number.isFinite(s) && Math.abs(s) <= 1e6) ? null : `${e} must be a point {x, y} with numbers from -1000000 to 1000000.`;
    case "object":
      return ot(t) ? null : `${e} must be an object.`;
    case "url":
      return t === null && n.nullable || typeof t == "string" && t.length <= bc && Kp.test(t.trim()) ? null : `${e} must be an http or https address${n.nullable ? ", or null to remove it" : ""}.`;
    case "id":
      return t === null && n.nullable || typeof t == "string" && Jp.test(t) ? null : `${e} must be 1 to 64 letters, digits, _ or -${n.nullable ? ", or null" : ""}.`;
  }
}
function Ut(n) {
  switch (n.type) {
    case "string":
      return { type: n.nullable ? ["string", "null"] : "string", maxLength: n.maxLength, ...n.minLength ? { minLength: n.minLength } : {} };
    case "number":
      return { type: "number", minimum: n.min, maximum: n.max };
    case "boolean":
      return { type: "boolean" };
    case "enum":
      return n.nullable ? { type: ["string", "null"], enum: [...n.values, null] } : { type: "string", enum: [...n.values] };
    case "shape":
      return { oneOf: [{ type: "string", enum: [...n.values] }, Qp()] };
    case "list":
      return { type: "array", items: { type: "string", enum: [...n.values] } };
    case "color":
      return { type: "string", maxLength: 64, description: "A CSS colour, such as #336699." };
    case "point":
      return {
        type: "object",
        additionalProperties: !1,
        required: ["x", "y"],
        properties: { x: { type: "number" }, y: { type: "number" } }
      };
    case "object":
      return { type: "object" };
    case "url":
      return {
        type: n.nullable ? ["string", "null"] : "string",
        maxLength: bc,
        pattern: "^https?://\\S+$",
        description: "An http or https address."
      };
    case "id":
      return { type: n.nullable ? ["string", "null"] : "string", pattern: "^[A-Za-z0-9_-]{1,64}$" };
  }
}
function Qp() {
  return {
    type: "object",
    additionalProperties: !1,
    required: ["name", "d"],
    description: "A custom shape: one SVG path (several closed parts and holes allowed, no markup), as shapes.generate or shapes.list return it.",
    properties: {
      name: { type: "string", minLength: 1, maxLength: tt.maxName },
      d: { type: "string", minLength: 1, maxLength: tt.maxInput, description: "Path data: commands and plain numbers only." },
      fillRule: { type: "string", enum: ["nonzero", "evenodd"], description: "evenodd when the shape has holes." },
      ref: {
        type: "object",
        additionalProperties: !1,
        required: ["id"],
        description: "The shape library entry it came from.",
        properties: { id: { type: "string", pattern: "^[A-Za-z0-9_-]{1,64}$" }, name: { type: "string", maxLength: tt.maxName } }
      }
    }
  };
}
function tm(n) {
  return Array.isArray(n.oneOf) && n.oneOf[0]?.type === "string" && n.oneOf[0]?.enum ? { ...n.oneOf[0], ...Object.fromEntries(Object.entries(n).filter(([t]) => t !== "oneOf")) } : n;
}
const Ct = (n) => ({
  store: (t, e) => {
    t[n] = e;
  },
  read: (t) => t[n]
}), em = ["solid", "dashed", "dotted", "combo"], nm = Object.freeze(["dropShadow", "blur", "outline", "postItNote", "pencil"]), sm = ["front", "back"], im = ["left", "middle", "right"], om = ["top", "middle", "bottom"], mn = Object.freeze({
  color: "showColorTab",
  text: "showTextTab",
  shape: "showShapeTab",
  picture: "showImageTab",
  effects: "showEffectTab",
  ask: "showAITab"
}), er = Object.keys(mn), q = {
  text: { spec: () => ({ type: "string", maxLength: 1e4 }), description: "The note's text.", ...Ct("text") },
  shape: {
    spec: (n) => ({ type: "shape", values: n.shapes }),
    description: "A shape registered with the engine (custom shapes read back as custom:<name>).",
    store: (n, t, e) => {
      if (t && typeof t == "object") {
        const i = uo(t);
        i.ok && Ip(n, i.shape);
        return;
      }
      const s = os(e.shapes, t);
      n.shape = s, n.vectorPath = s, n.shapeHint = s, delete n.fillRule, delete n.textBox, delete n.shapeRef;
    },
    // A custom outline reads as its name, never its (long) path.
    // A named shape (or a shapeHint like "rect") reads as itself, even when
    // the note also stores its drawn path.
    read: (n) => {
      const t = String(n.shape || n.shapeHint || n.vectorPath || "rectangle");
      if (t === "custom" || /^[Mm]/.test(t.trim())) {
        const e = n.shapeRef?.name;
        return typeof e == "string" && e ? `custom:${e}` : "custom";
      }
      return t;
    }
  },
  x: {
    spec: () => ({ type: "number", min: -1e6, max: 1e6 }),
    description: "Left edge on the canvas.",
    store: (n, t) => {
      n.xPos = t, delete n.x;
    },
    read: (n) => Number(n.xPos ?? n.x ?? 0)
  },
  y: {
    spec: () => ({ type: "number", min: -1e6, max: 1e6 }),
    description: "Top edge on the canvas.",
    store: (n, t) => {
      n.yPos = t, delete n.y;
    },
    read: (n) => Number(n.yPos ?? n.y ?? 0)
  },
  width: { spec: () => ({ type: "number", min: 20, max: 5e3 }), description: "Width in canvas units.", ...Ct("width") },
  height: { spec: () => ({ type: "number", min: 20, max: 5e3 }), description: "Height in canvas units.", ...Ct("height") },
  rotationAngle: {
    spec: () => ({ type: "number", min: -360, max: 360 }),
    description: "Rotation in degrees.",
    store: (n, t) => {
      n.rotate = { ...n.rotate || {}, rotationAngle: t }, delete n.rotationAngle;
    },
    read: (n) => Number(n.rotate?.rotationAngle ?? 0)
  },
  backgroundColor: { spec: () => ({ type: "color" }), description: "Fill colour.", ...Ct("backgroundColor") },
  foregroundColor: {
    spec: () => ({ type: "color" }),
    description: "Text colour.",
    store: (n, t) => {
      n.foregroundColor = t, n.fontColor = t;
    },
    read: (n) => n.fontColor ?? n.foregroundColor
  },
  borderColor: { spec: () => ({ type: "color" }), description: "Border colour.", ...Ct("borderColor") },
  borderWidth: { spec: () => ({ type: "number", min: 0, max: 100 }), description: "Border width.", ...Ct("borderWidth") },
  borderOpacity: { spec: () => ({ type: "number", min: 0, max: 1 }), description: "Border opacity from 0 to 1.", ...Ct("borderOpacity") },
  borderStyle: {
    spec: () => ({ type: "enum", values: em }),
    description: "Border line style.",
    ...Ct("borderStyle")
  },
  opacity: { spec: () => ({ type: "number", min: 0, max: 1 }), description: "Note opacity from 0 to 1.", ...Ct("opacity") },
  fontFamily: {
    spec: (n) => ({ type: "enum", values: n.fonts, caseless: !0 }),
    description: "A font this instance offers.",
    store: (n, t, e) => {
      n.fontFamily = os(e.fonts, t);
    },
    read: (n) => n.fontFamily
  },
  fontSize: { spec: () => ({ type: "number", min: 1, max: 500 }), description: "Font size.", ...Ct("fontSize") },
  textXAlign: { spec: () => ({ type: "enum", values: im }), description: "Horizontal text alignment.", ...Ct("textXAlign") },
  textYAlign: { spec: () => ({ type: "enum", values: om }), description: "Vertical text alignment.", ...Ct("textYAlign") },
  animation: {
    spec: (n) => ({ type: "enum", values: n.animations, nullable: !0 }),
    description: "An entrance or looping animation, or null for none.",
    store: (n, t) => {
      n.animations = { ...n.animations || {}, vect: t ?? null };
    },
    read: (n) => n.animations?.vect ?? null
  },
  textOpacity: {
    spec: () => ({ type: "number", min: 0, max: 1 }),
    description: "Text opacity from 0 to 1.",
    store: (n, t) => {
      n.textOpacity = t;
    },
    // A note with none stored draws its text fully opaque (Node's default).
    read: (n) => n.textOpacity ?? 1
  },
  link: {
    spec: () => ({ type: "url", nullable: !0 }),
    description: "A web address the note opens (http or https), or null to remove it.",
    store: (n, t) => {
      t === null ? delete n.link : n.link = { show: !0, type: "url", data: `${t}`.trim() };
    },
    read: (n) => n.link?.show && n.link.type === "url" ? n.link.data : null
  },
  effect: {
    spec: (n) => ({ type: "enum", values: n.effects, nullable: !0 }),
    description: "A note effect such as dropShadow or postItNote, or null for none.",
    store: (n, t) => {
      n.filters = { ...n.filters || {}, vect: t ?? null };
    },
    read: (n) => n.filters?.vect ?? null
  },
  groupId: {
    spec: () => ({ type: "id", nullable: !0 }),
    description: "Notes sharing a groupId select and move as one group; null takes the note out of its group.",
    store: (n, t) => {
      t === null ? delete n.groupId : n.groupId = t;
    },
    read: (n) => n.groupId ?? null
  },
  templateCategory: {
    spec: () => ({ type: "string", minLength: 1, maxLength: 200, nullable: !0 }),
    description: "Only when asked to make a note a template's category heading: names the bucket the template's AI conversation files notes under, and presentations skip the note. Not for grouping or labelling notes by theme (use groupId or text). null makes it an ordinary note.",
    store: (n, t) => {
      t === null ? (n.isCategory = !1, delete n.categoryName) : (n.isCategory = !0, n.categoryName = `${t}`.trim());
    },
    // Read the way the template conversation reads it: a category has a name.
    read: (n) => n.isCategory === !0 && n.categoryName ? n.categoryName : null
  },
  hiddenControls: {
    spec: () => ({ type: "list", values: er }),
    description: "Controls left off this note's style bar: color (fill and border), text (text colour, size, alignment, font), shape, picture, effects, ask. The list replaces the note's whole list, so to hide one more, send the ones already hidden (the summary lists them) plus it. An empty list shows them all. Chat and exec can still change the note.",
    store: (n, t) => {
      for (const [e, s] of Object.entries(mn)) n[s] = !t.includes(e);
    },
    read: (n) => er.filter((t) => n[mn[t]] === !1)
  },
  locked: {
    spec: () => ({ type: "boolean" }),
    description: "A locked note cannot be moved, changed or deleted until it is unlocked.",
    store: (n, t) => {
      n.isLocked = t;
    },
    read: (n) => n.isLocked === !0
  }
}, Es = {
  order: {
    spec: { type: "enum", values: sm },
    description: "Bring the note to the front or send it to the back."
  }
}, rm = [...Object.keys(q), ...Object.keys(Es)], am = /* @__PURE__ */ new Set(["text", "shape", "x", "y", "width", "height"]), vc = Object.keys(q).filter((n) => !am.has(n)), nr = (n) => typeof n == "boolean", cm = {
  isCategory: nr,
  categoryName: (n) => typeof n == "string" && n.trim().length > 0 && n.length <= 200,
  ...Object.fromEntries(Object.values(mn).map((n) => [n, nr]))
};
class lm {
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
    const e = this.slate.nodes.one(t.data.id), s = t.data?.link;
    e?.links && s && e.links.set(s, !1);
  }
  onNodeUnlocked(t) {
    const e = this.slate.nodes.one(t.data.id);
    e && e.unlock();
  }
  onNodeLocked(t) {
    const e = this.slate.nodes.one(t.data.id);
    e && e.lock();
  }
  /**
   * A note's plain data, set by chat and exec (operations keys templateCategory and
   * hiddenControls): only these keys ride on the package; null removes one.
   */
  onNodeOptionsChanged(t) {
    const e = this.slate.nodes.one(t.data.id);
    if (e)
      for (const [s, i] of Object.entries(t.data.options || {})) {
        const o = cm[s];
        o && (i == null ? delete e.options[s] : o(i) && (e.options[s] = i));
      }
  }
  onNodeToBack(t) {
    this.reorder(t, "back");
  }
  onNodeToFront(t) {
    this.reorder(t, "front");
  }
  /**
   * A package from the room carries the list order the change left
   * (Collab.send adds it); the order is applied as a whole, so a replay cannot
   * lift a note above notes added later. A host's own request to move one
   * note carries no order.
   */
  reorder(t, e) {
    if (Array.isArray(t.data?.order)) {
      this.slate.nodes.applyOrder?.(t.data.order);
      return;
    }
    const s = this.slate.nodes.one(t.data.id);
    s && (e === "front" ? s.toFront() : s.toBack());
  }
  onNodeShapeChanged(t) {
    const e = this.slate.nodes.one(t.data.id);
    if (!e) return;
    const s = { ...t.data };
    delete s.svgContent, delete s.svgString;
    for (const o of ["shape", "vectorPath"]) {
      const r = s[o];
      if (r != null && !dm(r)) {
        console.warn("[slatebox] ignored a shape change with an unreadable path");
        return;
      }
    }
    s.fillRule !== void 0 && s.fillRule !== "evenodd" && s.fillRule !== "nonzero" && delete s.fillRule;
    const i = s.shape ?? s.vectorPath;
    Object.assign(e.options, s), i && e.setShape(i, s.vectorPath);
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
      Array.isArray(e) || (e = [e]), e.filter(Boolean).forEach((s) => {
        this.slate.nodes.one(s.id) || this.slate.nodes.add(ve(s));
      });
    }
  }
  onNodeImageChanged(t) {
    const e = this.slate.nodes.one(t.data.id);
    if (!e?.images) return;
    const s = t.data.img ?? t.data.image;
    s ? e.images.set(s, t.data.w, t.data.h) : e.images.clear();
  }
  onNodeDeleted(t) {
    this.slate.nodes.remove(t.data.id);
  }
  onNodeResized(t) {
    const e = this.slate.nodes.one(t.data.id);
    e && (Object.assign(e.options, t.data), e.setSize(t.data.width, t.data.height), Number.isFinite(t.data.x) && Number.isFinite(t.data.y) && e.position(t.data.x, t.data.y));
  }
  onNodeRotated(t) {
    const e = this.slate.nodes.one(t.data.id);
    if (e) {
      t.data.textOffset !== void 0 && (e.options.textOffset = t.data.textOffset);
      const s = t.data.rotate?.rotationAngle ?? t.data.rotationAngle;
      typeof s == "number" && e.setRotation(s, 400), t.data.width && t.data.height && e.setSize(t.data.width, t.data.height);
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
    e && (t.data.fontSize !== void 0 && (e.options.fontSize = t.data.fontSize), t.data.fontFamily !== void 0 && (e.options.fontFamily = t.data.fontFamily), t.data.fontWeight !== void 0 && (e.options.fontWeight = t.data.fontWeight), t.data.fontColor !== void 0 && (e.options.fontColor = t.data.fontColor), t.data.textOpacity !== void 0 && (e.options.textOpacity = t.data.textOpacity), t.data.textXAlign !== void 0 && (e.options.textXAlign = t.data.textXAlign), t.data.textYAlign !== void 0 && (e.options.textYAlign = t.data.textYAlign), t.data.text !== void 0 && e.setText(t.data.text), e.applyTextStyle());
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
    const s = t.data.filter;
    if (!s) return;
    const i = s.apply === "text" ? "text" : "vect", o = i === "text" ? "text" : "vect";
    if (s.isAnimation) {
      e.filters.removeAnimation(i), s.id && s.id !== "None" && s.id !== "none" && e.filters.applyAnimation(s.id, i);
      return;
    }
    const r = e.options.filters?.[o];
    r && e.filters.remove(r), s.id ? e.filters.apply(s.id, i) : e.options.filters && (e.options.filters[o] = void 0);
  }
  onNodeBorderPropertiesChanged(t) {
    const e = this.slate.nodes.one(t.data.id);
    if (!e) return;
    const { prop: s, val: i } = t.data;
    s !== void 0 ? e.options[s] = i : (t.data.borderColor !== void 0 && (e.options.borderColor = t.data.borderColor), t.data.borderWidth !== void 0 && (e.options.borderWidth = t.data.borderWidth)), e.applyBorder();
  }
  onLinePropertiesChanged(t) {
    (Array.isArray(t.data) ? t.data : [t.data]).forEach((s) => {
      const i = this.slate.nodes.one(s.id);
      i && (s.associationId && s.prop !== void 0 && i.relationships ? i.relationships.applyLineProperty(s.associationId, s.prop, s.val) : s.options && Object.assign(i.options, s.options));
    });
  }
  onFollowMeChanged(t) {
    this.slate.options.followMe = t.data?.followMe;
  }
  onCanvasMove(t) {
    if (this.slate.options.followMe) {
      const { left: e, top: s } = t.data || {};
      typeof e == "number" && typeof s == "number" && this.slate.pan({ x: e, y: s });
    }
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
    this.slate.options.defaultLineColor = t.data.color, (this.slate.freeNodes?.() ?? this.slate.nodes.allNodes).forEach((e) => {
      e.options.lineColor = t.data.color, e.relationships?.updateAssociationsWith?.({ lineColor: t.data.color });
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
  /** Apply an authoritative full-document baseline (undo/redo collaboration). */
  async onSlateReplaced(t) {
    const e = t.data?.snapshot;
    e && await xs(e, this.slate, !1, !0);
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
const hm = /^[MmLlHhVvCcSsQqTtAaZz0-9.,\s+eE-]*$/;
function dm(n) {
  if (typeof n != "string" || n.length > 2e5) return !1;
  const t = n.trim();
  return /^[Mm]/.test(t) ? hm.test(t) : /^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(t);
}
class wc {
  /**
   * Creates the pan/zoom handler. Enables panning and zooming on the canvas.
   *
   * @param slate   - The parent Slate instance
   * @param options - Pan/zoom configuration (zoom factor, min/max, controls, etc.)
   */
  constructor(t, e = {}) {
    this.isEnabled = !1, this.controlsContainer = null, this._wheelHandler = null, this._touchPan = null, this.slate = t, this.canvas = t.canvas, this.options = {
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
      }), this.attachWheelHandler(), this.attachTouchPan(), this.isEnabled = !0, this.options.onPanStart && this.canvas.on("panStart", this.options.onPanStart), this.options.onPan && this.canvas.on("panning", this.options.onPan), this.options.onPanEnd && this.canvas.on("panEnd", this.options.onPanEnd), this.options.onZoom && this.canvas.on("zoom", this.options.onZoom), this.options.showControls && this.createZoomControls(), console.log("PanZoom initialized successfully with svg.panzoom.js");
    } catch (t) {
      console.warn("Failed to initialize pan/zoom:", t);
    }
  }
  /** Whether a finger on empty canvas pans it (so it does not start a selection rectangle). */
  pansByTouch() {
    return this.isEnabled && this.options.panning !== !1;
  }
  /**
   * One finger on empty canvas pans it, as a finger scrolls any page: on a phone
   * that is how a person reaches what is below the screen. Two fingers still pinch
   * and pan (the plugin), a finger on a note still moves the note, and a mouse on
   * empty canvas still draws the selection rectangle. Hosts hear the same
   * panStart / panning / panEnd events a mouse pan sends.
   */
  attachTouchPan() {
    const t = this.canvas.node;
    if (!t || typeof t.addEventListener != "function" || this._touchPan) return;
    let e = null, s = !1;
    const i = (a) => {
      e && (e = null, s && (s = !1, this.canvas.dispatch("panEnd", { event: a })));
    }, o = (a) => {
      if (!this.pansByTouch() || a.touches.length !== 1 || a.target !== t || a.defaultPrevented) {
        i(a);
        return;
      }
      const c = a.touches[0];
      e = { id: c.identifier, x: c.clientX, y: c.clientY }, s = !1;
    }, r = (a) => {
      if (!e) return;
      const c = a.touches.length === 1 && a.touches[0].identifier === e.id ? a.touches[0] : null;
      if (!c) {
        i(a);
        return;
      }
      const l = c.clientX - e.x, h = c.clientY - e.y;
      if (!s && Math.hypot(l, h) < 6) return;
      a.cancelable && a.preventDefault(), s || (s = !0, this.canvas.dispatch("panStart", { event: a }));
      const d = this.canvas.viewbox(), u = t.getBoundingClientRect(), f = d.width / (u.width || d.width), p = { x: d.x - l * f, y: d.y - h * f, width: d.width, height: d.height };
      e.x = c.clientX, e.y = c.clientY, this.canvas.dispatch("panning", { box: p, event: a }).defaultPrevented || this.canvas.viewbox(p.x, p.y, p.width, p.height);
    };
    t.addEventListener("touchstart", o, { passive: !0 }), document.addEventListener("touchmove", r, { passive: !1 }), document.addEventListener("touchend", i), document.addEventListener("touchcancel", i), this._touchPan = { start: o, move: r, end: i };
  }
  detachTouchPan() {
    this._touchPan && (this.canvas.node?.removeEventListener?.("touchstart", this._touchPan.start), document.removeEventListener("touchmove", this._touchPan.move), document.removeEventListener("touchend", this._touchPan.end), document.removeEventListener("touchcancel", this._touchPan.end), this._touchPan = null);
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
      const s = this.canvas.viewbox(), i = t.getBoundingClientRect(), o = i.width || s.width, r = s.width / o;
      if (e.ctrlKey || e.metaKey) {
        const a = Math.exp(-e.deltaY * 25e-4), c = this.options.zoomMin ?? 0.1, l = this.options.zoomMax ?? 10;
        let d = o / s.width * a;
        d = Math.max(c, Math.min(l, d));
        const u = o / d, f = s.height / s.width * u, p = e.clientX - i.left, m = e.clientY - i.top, g = s.x + p * r, y = s.y + m * (s.height / i.height || r), b = g - p / o * u, x = y - m / (i.height || o) * f;
        this.canvas.viewbox(b, x, u, f);
      } else
        this.canvas.viewbox(
          s.x + e.deltaX * r,
          s.y + e.deltaY * r,
          s.width,
          s.height
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
    const s = document.createElement("button");
    s.textContent = "−", s.title = "Zoom Out", s.addEventListener("click", () => this.zoomOut()), this.controlsContainer.appendChild(s);
    const i = document.createElement("button");
    i.textContent = "⟲", i.title = "Reset View", i.addEventListener("click", () => this.reset()), this.controlsContainer.appendChild(i), this.slate.element.appendChild(this.controlsContainer);
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
    const t = this.getViewportSize(), e = this.canvas.viewbox() || { x: 0, y: 0, width: t.w, height: t.h }, s = (e.x || 0) + (e.width || t.w) / 2, i = (e.y || 0) + (e.height || t.h) / 2;
    this.canvas.viewbox(s - t.w / 2, i - t.h / 2, t.w, t.h), this.fit();
  }
  /** Container pixel size (the infinite canvas fills its element). */
  getViewportSize() {
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
    let e = 1 / 0, s = 1 / 0, i = -1 / 0, o = -1 / 0;
    for (const v of t) {
      const w = v.options.x ?? 0, _ = v.options.y ?? 0, S = v.options.width ?? 100, T = v.options.height ?? 60;
      e = Math.min(e, w), s = Math.min(s, _), i = Math.max(i, w + S), o = Math.max(o, _ + T);
    }
    if (!isFinite(e)) return;
    const r = 50, a = this.getViewportSize(), c = a.w / a.h, l = this.slate?.boardChromes instanceof Set ? [...this.slate.boardChromes] : [];
    let h = e, d = s, u = i, f = o, p = 0, m = 0, g = 0, y = 0, b = 1;
    for (let v = 0; v < (l.length ? 4 : 1); v++) {
      h = e, d = s, u = i, f = o;
      for (const A of l) {
        let M = null;
        try {
          M = A.box(b);
        } catch {
          M = null;
        }
        !M || ![M.x, M.y, M.width, M.height].every(Number.isFinite) || (h = Math.min(h, M.x), d = Math.min(d, M.y), u = Math.max(u, M.x + M.width), f = Math.max(f, M.y + M.height));
      }
      g = u - h, y = f - d;
      const w = g + r * 2, _ = y + r * 2, S = w / _;
      p = w, m = _, S > c ? m = p / c : p = m * c, p < a.w && (p = a.w, m = a.h);
      const T = a.w / p;
      if (Math.abs(T - b) < 5e-3) break;
      b = T;
    }
    const x = h + g / 2, C = d + y / 2;
    this.canvas.viewbox(
      x - p / 2,
      C - m / 2,
      p,
      m
    );
  }
  /**
   * Show a region of the world at the largest scale at which its whole width is
   * visible, up to `maxZoom` (100% unless the host allows more, as a phone does to
   * fill its width with one lane), with `padding` world units of room at each side.
   * A region shorter than the canvas is centred in it; a taller one starts at the
   * top and the rest is reached by panning.
   */
  fitWidth(t, e = 16, s = 1) {
    if (!this.isEnabled) return;
    const i = this.getViewportSize(), o = Math.min(s > 0 ? s : 1, this.options.zoomMax ?? 10), r = Math.max(i.w / o, t.width + e * 2), a = i.h / i.w * r, c = t.x + t.width / 2 - r / 2, l = t.height + e * 2 <= a ? t.y + t.height / 2 - a / 2 : t.y - e;
    this.canvas.viewbox(c, l, r, a);
  }
  center() {
    if (!this.isEnabled) return;
    const t = this.slate?.nodes?.allNodes, e = this.canvas.viewbox();
    if (!t || t.length === 0) return;
    let s = 1 / 0, i = 1 / 0, o = -1 / 0, r = -1 / 0;
    for (const l of t) {
      const h = l.options.x ?? 0, d = l.options.y ?? 0, u = l.options.width ?? 100, f = l.options.height ?? 60;
      s = Math.min(s, h), i = Math.min(i, d), o = Math.max(o, h + u), r = Math.max(r, d + f);
    }
    if (!isFinite(s)) return;
    const a = (s + o) / 2, c = (i + r) / 2;
    this.canvas.viewbox(a - e.width / 2, c - e.height / 2, e.width, e.height);
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
    this._wheelHandler && this.canvas.node?.removeEventListener && (this.canvas.node.removeEventListener("wheel", this._wheelHandler), this._wheelHandler = null), this.detachTouchPan(), this.isEnabled && (this.canvas.panZoom(!1), this.canvas.off("panStart"), this.canvas.off("panning"), this.canvas.off("panEnd"), this.canvas.off("zoom"), this.removeZoomControls(), this.isEnabled = !1);
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
class xc {
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
      const s = e.target;
      if (!(s === t.node || s?.tagName === "svg") || e.pointerType === "touch" && this.slate.panZoom?.pansByTouch?.()) return;
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
    const s = Math.min(this.startPoint.x, e.x), i = Math.min(this.startPoint.y, e.y), o = Math.abs(e.x - this.startPoint.x), r = Math.abs(e.y - this.startPoint.y);
    this.selectionRect.move(s, i).size(o, r);
  }
  onSelectUp(t) {
    if (this.detachWindowHandlers(), !this.isSelecting || !this.startPoint) {
      this.cancelSelection();
      return;
    }
    const e = this.getSvgPoint(t);
    if (e) {
      const s = Math.min(this.startPoint.x, e.x), i = Math.min(this.startPoint.y, e.y), o = Math.abs(e.x - this.startPoint.x), r = Math.abs(e.y - this.startPoint.y);
      o > 5 && r > 5 && this.selectNodesInRect(s, i, o, r, t.shiftKey);
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
  selectNodesInRect(t, e, s, i, o) {
    const r = [], a = this.slate.nodes.allNodes;
    for (const c of a)
      try {
        const l = c.options, h = l.x ?? 0, d = l.y ?? 0, u = l.width ?? 0, f = l.height ?? 0;
        h < t + s && h + u > t && d < e + i && d + f > e && r.push(c);
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
      const s = this.slate.canvas.node, i = s.createSVGPoint();
      i.x = t.clientX, i.y = t.clientY;
      const o = i.matrixTransform(s.getScreenCTM().inverse());
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
    const s = this.slate.getSelectedNodes().filter(
      (i) => !this.slate.governanceOf?.(i)
    );
    for (const i of s) {
      const o = (i.options.x || 0) + t, r = (i.options.y || 0) + e;
      i.position(o, r);
    }
  }
}
class _c {
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
    const s = this.options.gridSize;
    return {
      x: Math.round(t / s) * s,
      y: Math.round(e / s) * s
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
    const t = this.slate.canvas, e = t.viewbox(), s = this.options.gridSize, i = this.options.gridColor, o = this.options.gridOpacity, r = Math.floor(e.x / s) * s - s * 5, a = Math.floor(e.y / s) * s - s * 5, c = e.x + e.width + s * 5, l = e.y + e.height + s * 5;
    this.gridGroup = t.group().attr("pointer-events", "none");
    for (let h = r; h <= c; h += s)
      this.gridGroup.line(h, a, h, l).stroke({ color: i, width: 0.5, opacity: o });
    for (let h = a; h <= l; h += s)
      this.gridGroup.line(r, h, c, h).stroke({ color: i, width: 0.5, opacity: o });
    this.gridGroup.back();
  }
}
const Bn = "http://www.w3.org/2000/svg", sr = /^(#[0-9a-f]{3,8}|[a-z]{3,20}|(rgb|hsl)a?\([\d\s.,%]+\))$/i;
function um(n, t) {
  const e = String(t?.backgroundColor || "").trim();
  if (!sr.test(e) || /^(#fff(fff)?|white|transparent)$/i.test(e) || t?.backgroundImage) return;
  const s = (n.getAttribute("viewBox") || "").split(/[\s,]+/).map(Number);
  if (s.length !== 4 || !s.every(Number.isFinite)) return;
  n.querySelector("rect[data-background]")?.remove();
  const i = n.ownerDocument, o = i.createElementNS(Bn, "rect");
  o.setAttribute("data-background", ""), o.setAttribute("x", String(s[0])), o.setAttribute("y", String(s[1])), o.setAttribute("width", String(s[2])), o.setAttribute("height", String(s[3])), o.setAttribute("fill", e);
  let r = null;
  const a = Array.isArray(t?.backgroundGradientColors) ? t.backgroundGradientColors.filter((c) => sr.test(String(c))) : [];
  if (t?.backgroundColorAsGradient && a.length > 1) {
    const c = t.backgroundGradientType === "radial", l = i.createElementNS(Bn, c ? "radialGradient" : "linearGradient");
    if (l.setAttribute("id", "sb-export-background"), !c) {
      const h = t.backgroundGradientStrategy;
      l.setAttribute("x2", h === "vertical" ? "0" : "1"), l.setAttribute("y2", h === "horizontal" ? "0" : "1");
    }
    a.forEach((h, d) => {
      const u = i.createElementNS(Bn, "stop");
      u.setAttribute("offset", String(d / (a.length - 1))), u.setAttribute("stop-color", h), l.appendChild(u);
    }), r = i.createElementNS(Bn, "defs"), r.appendChild(l), n.insertBefore(r, n.firstChild), o.setAttribute("fill", "url(#sb-export-background)");
  }
  n.insertBefore(o, r ? r.nextSibling : n.firstChild);
}
const $s = "data-export-omit", fm = "data-export-never";
function pm(n) {
  const t = n.nodes?.allNodes ?? [];
  if (typeof n.governanceOf != "function" || t.length === 0) return [];
  const e = /* @__PURE__ */ new Set();
  for (const o of t)
    n.governanceOf(o)?.capabilities?.exportable === !1 && e.add(o.id);
  if (e.size === 0) return [];
  const s = [], i = (o) => {
    o && typeof o.setAttribute == "function" && s.push(o);
  };
  for (const o of t) {
    e.has(o.id) && i(o.svgGroup?.node);
    for (const r of o.connector?.getConnections?.() ?? []) {
      if (!e.has(o.id) && !e.has(r?.target?.id)) continue;
      const a = r.connectable;
      i(a?.connector?.node), i(a?.hitArea?.node), i(a?.label?.node), i(a?.labelBg?.node);
    }
  }
  return s;
}
function mm(n, t, e) {
  const s = Array.from(t.querySelectorAll("g[data-board-chrome]"));
  if (!s.length) return [];
  const i = n?.boardChromes instanceof Set ? Array.from(n.boardChromes) : [], o = [];
  for (const r of s) {
    if (r.hasAttribute("data-board-badges")) continue;
    const a = r.getAttribute("data-board-scope") ?? "main", c = s.find((h) => h.hasAttribute("data-board-badges") && (h.getAttribute("data-board-scope") ?? "main") === a) ?? null, l = i.find((h) => h.scope === a && !h.draft);
    if (e || !l || r.hasAttribute("data-workshop-draft")) {
      r.remove(), c?.remove();
      continue;
    }
    try {
      l.paintPlain(r, c);
      const h = l.plainBox();
      h && [h.x, h.y, h.width, h.height].every(Number.isFinite) && o.push(h);
    } catch {
      r.remove(), c?.remove();
    }
  }
  return o;
}
function fo(n, t = {}, e) {
  const s = n.canvas;
  if (!s) {
    const o = "";
    return e?.(o), o;
  }
  const i = pm(n);
  try {
    for (const u of i) u.setAttribute($s, "");
    let o;
    try {
      o = s.node.cloneNode(!0);
    } finally {
      for (const u of i) u.removeAttribute($s);
    }
    const r = [
      // All svg.select.js overlays (handles, rotate handle, bounding rect,
      // selection shape) — matched by prefix so none are missed.
      '[class*="svg_select"]',
      ".connection-handle",
      // node drag-to-connect plugs
      ".connector-handle",
      // line endpoint drag handles (distinct class!)
      ".connector-handle-glyph",
      // the marks on those handles (follows / pinned / free)
      ".line-tool-preview",
      // the line tool's line while drawing
      ".line-tool-tip",
      // UI chrome that shouldn't appear in an exported diagram:
      ".comment-badge",
      // comment-count badges (rendered in the node group)
      ".node-link-badge",
      // link indicator badge (also in the node group)
      // A playing video's player and its close button: a picture shows the poster
      // with its play button and caption (kept: they are the media note's look).
      ".media-note-player",
      ".media-note-close",
      ".node-cog",
      // selection toolbar (delete/connect/cog pill)
      ".node-toolbar",
      ".line-cog",
      // line selection pill (delete/cog) — parallel to the node cog
      ".line-toolbar",
      "#slate-coordinates",
      // Connector hit areas: invisible wide paths used only for click detection
      // (attribute-tagged, so the class selectors above miss them). Not visible
      // content — strip them so the export has no near-invisible cruft / bbox skew.
      '[connectortype="hitarea"]',
      // Layers drawn for the view and never part of the slate: the agents at work, their pointers (and edge markers) and
      // the ghosts of what they suggest. Nothing an agent has not had kept is part of the slate, so no picture shows it.
      // They are named by this one attribute, not by their own, so the canvas entry names nothing of the agents' drawing
      // (that stays in slateboxjs/presence).
      `[${fm}]`,
      // Notes left out of exports by their host, and their lines.
      `[${$s}]`
    ];
    for (const u of r)
      o.querySelectorAll(u).forEach((p) => p.remove());
    const a = mm(n, o, !!(t.backgroundOnly || t.nodes));
    if (t.noBackground) {
      const u = o.querySelector("rect[data-background]");
      u && u.remove();
    }
    if (t.backgroundOnly)
      o.querySelectorAll("[data-node-id]").forEach((f) => f.remove());
    else if (t.nodes) {
      const u = new Set(
        t.nodes.map((p) => typeof p == "string" ? p : p.id)
      );
      o.querySelectorAll("[data-node-id]").forEach((p) => {
        const m = p.getAttribute("data-node-id");
        m && !u.has(m) && p.remove();
      });
    }
    const c = t.frame, l = !!(c && [c.x, c.y, c.width, c.height].every(Number.isFinite) && c.width > 0 && c.height > 0);
    if (l) {
      o.setAttribute("viewBox", `${c.x} ${c.y} ${c.width} ${c.height}`);
      const u = t.size && /^\d+(?:\.\d+)?(?:in|cm|mm|pt|px)?$/.test(t.size.width) && /^\d+(?:\.\d+)?(?:in|cm|mm|pt|px)?$/.test(t.size.height) ? t.size : null;
      o.setAttribute("width", u ? u.width : String(c.width)), o.setAttribute("height", u ? u.height : String(c.height)), o.setAttribute("preserveAspectRatio", "xMidYMid meet");
    }
    if (!l) try {
      const u = o.querySelectorAll("[data-node-id]");
      if (u.length > 0) {
        let p = 1 / 0, m = 1 / 0, g = -1 / 0, y = -1 / 0;
        for (const b of Array.from(u)) {
          const x = b.getAttribute("data-node-id"), v = n.nodes?.one?.(x)?.options;
          if (!v) continue;
          const w = v.x || 0, _ = v.y || 0, S = v.width || 0, T = v.height || 0, A = Number(
            typeof v.rotate == "object" ? v.rotate?.rotationAngle : v.rotate
          ) || 0;
          if (A) {
            const M = w + S / 2, N = _ + T / 2, R = A * Math.PI / 180, P = Math.cos(R), E = Math.sin(R);
            for (const [k, O] of [
              [w, _],
              [w + S, _],
              [w + S, _ + T],
              [w, _ + T]
            ]) {
              const L = k - M, z = O - N, W = M + L * P - z * E, X = N + L * E + z * P;
              p = Math.min(p, W), m = Math.min(m, X), g = Math.max(g, W), y = Math.max(y, X);
            }
          } else
            p = Math.min(p, w), m = Math.min(m, _), g = Math.max(g, w + S), y = Math.max(y, _ + T);
        }
        for (const b of a)
          p = Math.min(p, b.x), m = Math.min(m, b.y), g = Math.max(g, b.x + b.width), y = Math.max(y, b.y + b.height);
        if (isFinite(p) && g > p) {
          const b = g - p + 80, x = y - m + 40 * 2;
          o.setAttribute(
            "viewBox",
            `${p - 40} ${m - 40} ${b} ${x}`
          ), o.setAttribute("width", String(Math.round(b))), o.setAttribute("height", String(Math.round(x))), o.setAttribute("preserveAspectRatio", "xMidYMid meet");
        }
      }
    } catch {
    }
    t.noBackground || um(o, n.options?.containerStyle);
    let d = new XMLSerializer().serializeToString(o);
    return d = `<?xml version="1.0" encoding="UTF-8"?>
` + d, e?.(d), d;
  } catch (o) {
    console.error("EXPORT_DEBUG: SVG export failed:", o);
    const r = "";
    return e?.(r), r;
  }
}
const Hs = Object.freeze({ pictures: 40, bytes: 8 * 1024 * 1024, timeoutMs: 5e3 });
function Sc(n) {
  return /<image\b[^>]*?\s(?:xlink:)?href="(?!data:)[^"]+"/.test(n);
}
async function Cc(n, t = globalThis.fetch) {
  if (!t || typeof FileReader > "u") return n;
  const e = /(<image\b[^>]*?\s(?:xlink:)?href=")([^"]+)(")/g, s = /* @__PURE__ */ new Set();
  for (const a of n.matchAll(e)) {
    const c = a[2].replace(/&amp;/g, "&");
    !/^data:/i.test(c) && s.size < Hs.pictures && s.add(c);
  }
  if (!s.size) return n;
  const i = typeof document < "u" ? document.baseURI : void 0, o = async (a) => {
    let c;
    try {
      c = new URL(a, i);
    } catch {
      return null;
    }
    if (c.protocol !== "https:" && c.protocol !== "http:") return null;
    const l = typeof AbortController < "u" ? new AbortController() : null, h = setTimeout(() => l?.abort(), Hs.timeoutMs);
    try {
      const d = await t(c.href, { mode: "cors", credentials: "omit", signal: l?.signal });
      if (!d.ok) return null;
      const u = await d.blob();
      return !u.size || u.size > Hs.bytes || !/^image\//.test(u.type) ? null : await new Promise((f) => {
        const p = new FileReader();
        p.onload = () => f(typeof p.result == "string" ? p.result : null), p.onerror = () => f(null), p.readAsDataURL(u);
      });
    } catch {
      return null;
    } finally {
      clearTimeout(h);
    }
  }, r = /* @__PURE__ */ new Map();
  return await Promise.all([...s].map(async (a) => {
    const c = await o(a);
    c && r.set(a, c);
  })), r.size ? n.replace(e, (a, c, l, h) => {
    const d = r.get(l.replace(/&amp;/g, "&"));
    return d ? `${c}${d}${h}` : a;
  }) : n;
}
async function Ec(n, t = {}, e) {
  const s = fo(n, { ...t, size: void 0 }), i = s && Sc(s) ? await Cc(s) : s;
  if (!i) {
    const r = t.asBinary ? new Blob() : "";
    return e?.(r), r;
  }
  const o = t.scale || 2;
  try {
    const r = n.canvas;
    let a, c;
    const l = i.match(
      /viewBox="[\d.\-]+\s+[\d.\-]+\s+([\d.\-]+)\s+([\d.\-]+)"/
    );
    if (l)
      a = parseFloat(l[1]), c = parseFloat(l[2]);
    else {
      const y = r.viewbox();
      a = y.width, c = y.height;
    }
    const h = a * o, d = c * o, u = document.createElement("canvas");
    u.width = h, u.height = d;
    const f = u.getContext("2d");
    t.alpha || (f.fillStyle = n.options.containerStyle?.backgroundColor || "#ffffff", f.fillRect(0, 0, h, d));
    const p = new Image(), m = new Blob([i], {
      type: "image/svg+xml;charset=utf-8"
    }), g = URL.createObjectURL(m);
    return new Promise((y, b) => {
      p.onload = () => {
        if (f.drawImage(p, 0, 0, h, d), URL.revokeObjectURL(g), t.asBinary)
          u.toBlob(
            (x) => {
              const C = x || new Blob();
              e?.(C), y(C);
            },
            "image/png"
          );
        else {
          const x = u.toDataURL("image/png"), C = t.base64 ? x.split(",")[1] : x;
          e?.(C), y(C);
        }
      }, p.onerror = (x) => {
        URL.revokeObjectURL(g), console.error("EXPORT_DEBUG: PNG rendering failed:", x);
        const C = t.asBinary ? new Blob() : "";
        e?.(C), y(C);
      }, p.src = g;
    });
  } catch (r) {
    console.error("EXPORT_DEBUG: PNG export failed:", r);
    const a = t.asBinary ? new Blob() : "";
    return e?.(a), a;
  }
}
const gm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  exportPNG: Ec,
  exportSVG: fo,
  hasOutsidePictures: Sc,
  inlinePictures: Cc
}, Symbol.toStringTag, { value: "Module" }));
function ue(n, t) {
  if (n.t !== t.t) return n.t - t.t;
  if (n.c !== t.c) return n.c - t.c;
  const e = n.k ?? "", s = t.k ?? "";
  return e < s ? -1 : e > s ? 1 : 0;
}
const Kt = "onSlateReplaced", ir = /* @__PURE__ */ new Set([
  "onZoom",
  "onCanvasMove",
  "onFollowMeChanged",
  "onSlateFollowMeChanged",
  "onSlateHuddleChanged",
  "onCursorMoved",
  "onPresenceChanged",
  "onMouseMoved"
]);
function on(n, t) {
  return {
    t: typeof t.timestamp == "number" ? t.timestamp : 0,
    c: typeof t.clientID == "number" ? t.clientID : 0,
    k: n
  };
}
function or(n) {
  if (n.type !== "addRelationship" && n.type !== "removeRelationship") return null;
  const t = n.data?.id;
  return typeof t == "string" && t ? t : null;
}
const rr = (n, t) => ue(on(n.key, n.pkg), on(t.key, t.pkg)), Jt = "onNoteTraded", ym = 5e3, Fs = (n) => "trade:" + n;
function Gn(n, t) {
  if (!n || n.type === Kt || n.type === Jt) return n;
  const e = n.data;
  if (!e || typeof e != "object") return n;
  if (Array.isArray(e)) {
    const r = e.filter((a) => a?.id !== t);
    return r.length === e.length ? n : r.length ? { ...n, data: r } : null;
  }
  const s = n.type === "onNodeAdded" && e.options && !e.nodeOptions;
  if (e.id === t && !s) return null;
  let i = e;
  for (const r of ["nodeOptions", "nodes"]) {
    const a = i[r];
    if (Array.isArray(a)) {
      const c = a.filter((l) => l?.id !== t);
      c.length !== a.length && (i = { ...i, [r]: c });
    } else a && typeof a == "object" && a.id === t && (i = { ...i, [r]: [] });
  }
  return i === e ? n : ["nodeOptions", "nodes"].every((r) => !Array.isArray(i[r]) || i[r].length === 0) && !s ? null : { ...n, data: i };
}
function bm(n) {
  const t = globalThis.WebSocket;
  return typeof t != "function" ? null : class extends t {
    set onmessage(s) {
      super.onmessage = s ? (i) => typeof i.data == "string" ? n(i.data) : s.call(this, i) : null;
    }
    get onmessage() {
      return super.onmessage;
    }
  };
}
const Us = /* @__PURE__ */ new Set(["onNodeToFront", "onNodeToBack"]), ar = "node-order";
class Ac {
  constructor(t, e = {}) {
    this.doc = null, this.provider = null, this.collabMap = null, this.awareness = null, this.isConnected = !1, this.clientID = 0, this.cursorElements = /* @__PURE__ */ new Map(), this._cursorMoveHandler = null, this._cursorTrackingNode = null, this._cursorSweepTimer = null, this._cursorLastSeen = /* @__PURE__ */ new Map(), this.clock = 0, this.baseline = null, this.applying = null, this.synced = !1, this.trades = /* @__PURE__ */ new Map(), this.tradeTruth = /* @__PURE__ */ new Map(), this.tradesThrough = 0, this.tradeLines = /* @__PURE__ */ new Map(), this.tradeFixTimer = null, this.ownTrades = /* @__PURE__ */ new Map(), this.fromRecord = /* @__PURE__ */ new Set(), this.lineStamps = /* @__PURE__ */ new Map(), this.hostChangeAt = 0, this._relayRefusedSaid = !1, this.slate = t, this.options = {
      wsUrl: "ws://localhost:1234",
      roomName: "default-slate",
      userName: "",
      // empty = no label rendered (see renderCursor); hosts pass real names via onInitCollaboration
      userColor: "#" + Math.floor(Math.random() * 16777215).toString(16),
      ...e
    };
  }
  /**
   * The relay answered with words instead of a Yjs message. It does so only when it
   * refuses the connection ("Unauthenticated": the room's sign-in was missing, wrong
   * or too old), and it then never syncs this socket. Say so once, stop this provider
   * from waiting on (or reconnecting to) a socket that will never sync, and report
   * the status, instead of the collaboration library throwing "Unexpected end of
   * array" for every such frame.
   */
  relayRefused(t) {
    if (/unauthenticated/i.test(t)) {
      this._relayRefusedSaid || (this._relayRefusedSaid = !0, console.warn(
        "COLLAB: the collaboration relay refused this connection (" + t.slice(0, 40) + "). Live editing with others is off until the page is opened again."
      ));
      try {
        this.provider?.disconnect();
      } catch {
      }
    }
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
      ), s = this.options.WebsocketProvider || (await import(
        /* @vite-ignore */
        "y-websocket"
      )).WebsocketProvider;
      if (!this.slate?.options) return;
      this.doc = new e.Doc(), this.clientID = this.doc.clientID;
      let i;
      const o = this.slate.options.events?.onInitCollaboration;
      if (o)
        try {
          i = await o(this.clientID.toString()) || void 0;
        } catch (c) {
          console.warn(
            "COLLAB_DEBUG: onInitCollaboration threw; using static options",
            c
          );
        }
      if (!this.slate?.options) {
        this.doc?.destroy?.(), this.doc = null;
        return;
      }
      i && (this.userBaseData = i, i.websocketUrl && (this.options.wsUrl = i.websocketUrl), i.websocketParams && (this.options.wsParams = i.websocketParams), i.userName && (this.options.userName = i.userName), i.color && (this.options.userColor = i.color), i.personKey && (this.options.personKey = String(i.personKey))), this.collabMap = this.doc.getMap("collabPackages"), this.collabMap.observe((c) => {
        c.transaction.local || this.applyRemoteChanges(c.keysChanged);
      });
      const r = bm((c) => this.relayRefused(c));
      this.provider = new s(
        this.options.wsUrl,
        this.options.roomName,
        this.doc,
        {
          connect: !0,
          params: this.options.wsParams || {},
          ...r ? { WebSocketPolyfill: r } : {}
        }
      ), this.awareness = this.provider.awareness, this.awareness.setLocalStateField("user", {
        name: this.options.userName,
        color: this.options.userColor,
        ...this.options.personKey ? { key: this.options.personKey } : {}
      });
      const a = () => {
        const c = this.getCollabUsers();
        this.options.onAwarenessChange?.(c), this.slate.options.events?.onCollaborationUsersChanged?.(c), this.renderRemoteCursors(c);
      };
      this.awareness.on("change", a), this.awareness.on(
        "update",
        ({
          added: c,
          updated: l,
          removed: h
        }) => {
          const d = Date.now();
          for (const u of c) this._cursorLastSeen.set(u, d);
          for (const u of l) this._cursorLastSeen.set(u, d);
          for (const u of h) this._cursorLastSeen.delete(u);
        }
      ), this.setupCursorTracking(), this.getCollabUsers().length > 0 && a(), this.provider.on("status", (c) => {
        this.isConnected = c.status === "connected", c.status !== "connected" && (this.synced = !1), c.status !== "connected" && this.clearRemoteCursors(), this.options.onStatusChange?.(c.status);
      }), this.provider.on("sync", (c) => this.roomSynced(c)), this.provider.synced && this.roomSynced(!0), this._cursorSweepTimer = setInterval(() => {
        this.slate?.canvas && this.awareness && this.renderRemoteCursors(this.getCollabUsers());
      }, 4e3), console.log(
        "COLLAB_DEBUG: Initialized collaboration for room",
        this.options.roomName,
        "clientID:",
        this.clientID
      );
    } catch (e) {
      const s = e;
      s.code === "MODULE_NOT_FOUND" || s.message?.includes("Cannot find module") ? console.warn(
        "COLLAB_DEBUG: yjs/y-websocket not installed. Collaboration disabled.",
        "Install with: npm install yjs y-websocket"
      ) : console.error("COLLAB_DEBUG: Failed to initialize collaboration:", s);
    }
  }
  /**
   * Execute collab packages locally (from Invoker).
   */
  invoke(t) {
    const e = Array.isArray(t) ? t : [t];
    for (const s of e)
      this.slate.screenGovernedPackage?.(s.type, s.data) !== null && (this.exe(s), this.slate.recordUndoFor?.(s.type));
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
    const e = (Array.isArray(t) ? t : [t]).flatMap((s) => {
      const i = this.slate.screenGovernedPackage?.(s.type, s.data);
      if (i === null) return [];
      const o = i === void 0 || i === s.data ? s : { ...s, data: i };
      if (Us.has(o.type) && !Array.isArray(o.data?.order)) {
        const r = (this.slate.nodes?.allNodes || []).map((a) => a.id ?? a.options?.id);
        return [{ ...o, data: { ...o.data, order: r } }];
      }
      return [o];
    });
    if (this.collabMap)
      for (const s of e) {
        for (const a of this.fromRecord) Gn(s, a) !== s && this.fromRecord.delete(a);
        for (const a of this.staleTradesIn(s)) this.tellRoomOfTrade(a);
        const i = `${s.type}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        if (s.type === Kt) {
          const a = this.tick(), c = [...this.ownTrades.keys()], l = c.length && s.data && typeof s.data == "object" ? { ...s.data, held: c } : s.data, h = { ...s, data: l, clientID: this.clientID, timestamp: a }, d = () => {
            this.pruneBeforeSlateReplacement(), this.collabMap.set(i, h);
          };
          this.doc ? this.doc.transact(d) : d(), this.adoptBaseline({ t: a, c: this.clientID, k: i }), this.run(async () => {
            const u = this.beforeRemote();
            await this.dropRoomCards(new Set(c)), this.afterRemote(u);
          });
          continue;
        }
        s.type === "onLinePropertiesChanged" && this.pruneSupersededLineProperty(s.data);
        const o = { ...s, clientID: this.clientID, timestamp: this.tick() }, r = or(s);
        if (r && this.lineStamps.set(r, { t: o.timestamp, c: this.clientID, k: i }), s.type === "onNodeTextChanged" && typeof s.data?.text == "string" ? this.storeNodeText(i, o) : Us.has(s.type) ? this.storeNodeOrder(o) : this.collabMap.set(i, o), s.type === "onNodeDeleted") {
          const a = s.data?.id;
          a != null && this.pruneNodePackages(a);
        }
      }
    else
      console.log(
        "COLLAB_DEBUG: send() before collab init — emitting locally only"
      );
    for (const s of e)
      this.slate.emitSlateChange?.(s.type, s.data);
  }
  /**
   * Packages arrived from the room: one edit from a person on the slate, or the
   * whole room when this client joins.
   *
   * They are applied in the order they were written, one after the other, each
   * waiting until the notes before it are drawn. Yjs hands them over grouped by
   * the client that wrote them, not by time, and a note is built a moment after
   * it is added: applied as they came, in one go, a rename reached a note that
   * was not drawn yet and was lost, and a replacement written by one client
   * could land on top of later work by another.
   */
  applyRemoteChanges(t) {
    const e = [], s = /* @__PURE__ */ new Set();
    let i = !1;
    for (const a of t) {
      const c = this.collabMap.get(a);
      if (c) {
        if (this.sawTime(c.timestamp), c.type === Kt) {
          i = !0;
          continue;
        }
        c.type !== Jt && (e.push({ key: a, pkg: c }), c.type === "onNodeTextChanged" && typeof c.data?.text == "string" && s.add(c.data.id));
      }
    }
    if (i) {
      const a = this.newestReplacement(), c = this.knownBaseline();
      if (a && (!c || ue(a.stamp, c) > 0)) {
        this.run(() => this.rebuildFrom(a));
        return;
      }
      this.dropOlderReplacements(a);
    }
    if (e.length === 0) {
      this.scheduleTradeFix();
      return;
    }
    e.sort(rr);
    const o = this.latestLabels(s), r = e.some(({ pkg: a }) => !ir.has(a.type));
    this.run(() => {
      const a = r ? this.beforeRemote() : null, c = this.applyInOrder(e, o), l = () => {
        this.scheduleTradeFix(), r && this.afterRemote(a);
      };
      if (c) return c.then(l);
      l();
    });
  }
  // Old clients gave every label edit a separate key. Even an untouched
  // pre-upgrade room must replay its latest stored label on a late join.
  latestLabels(t) {
    const e = /* @__PURE__ */ new Map();
    return t.size && this.collabMap.forEach((s, i) => {
      if (s.type !== "onNodeTextChanged" || typeof s.data?.text != "string" || !t.has(s.data.id)) return;
      const o = e.get(s.data.id), r = s.timestamp ?? 0;
      (!o || r > o.timestamp || r === o.timestamp && i > o.key) && e.set(s.data.id, { key: i, timestamp: r });
    }), new Map([...e].map(([s, i]) => [s, i.key]));
  }
  /**
   * Apply packages in the given order. Returns nothing when all of them could be
   * applied at once, or a promise when one had to wait for notes to be drawn or
   * for a document load to finish.
   */
  applyInOrder(t, e, s = 0, i = -1) {
    for (let o = s; o < t.length; o++) {
      if (!this.collabMap || !this.slate) return;
      const r = i === o ? null : this.slate.whenBuilt?.();
      if (r) return r.then(() => this.applyInOrder(t, e, o, o));
      const { key: a } = t[o];
      let { pkg: c } = t[o];
      const l = this.screenTraded(c);
      if (!l || this.staleLineChange(a, l)) continue;
      if (c = l, c.type === "onNodeTextChanged" && typeof c.data?.text == "string" && e.get(c.data.id) !== a) {
        const { text: d, ...u } = c.data;
        if (!Object.keys(u).some((f) => f !== "id")) continue;
        c = { ...c, data: u };
      }
      let h;
      try {
        h = this.applyRoomPackage(c);
      } catch (d) {
        console.warn("COLLAB_DEBUG: A package from the room could not be applied:", c.type, d);
      }
      if (h && typeof h.then == "function")
        return h.then(
          () => this.applyInOrder(t, e, o + 1),
          () => this.applyInOrder(t, e, o + 1)
        );
    }
  }
  /**
   * Rebuild the slate from a whole-slate replacement in the room, then apply
   * everything else the room holds, in the order it was written. Those packages
   * were written by people who had not seen the replacement yet, or after it, so
   * they belong on top of it: this client may have applied some of them before,
   * and the replacement has just removed what they did.
   */
  async rebuildFrom(t) {
    if (!this.collabMap || !this.slate || (await this.slate.whenBuilt?.(), !this.collabMap || !this.slate)) return;
    const e = this.knownBaseline();
    if (e && ue(t.stamp, e) <= 0) return;
    const s = !!this.baseline && this.baseline.c === this.clientID && this.clientID !== 0, i = this.hostChangeAt > 0 && Date.now() - this.hostChangeAt < ym, o = this.beforeRemote(), r = Array.isArray(t.pkg.data?.held) ? t.pkg.data.held : [], a = /* @__PURE__ */ new Map();
    for (const h of [...r, ...this.ownTrades.keys()]) {
      if (typeof h != "string" || a.has(h)) continue;
      const d = this.slate.nodes?.one?.(h);
      a.set(h, d ? nt(d.options) : null);
    }
    this.adoptBaseline(t.stamp), this.lineStamps.clear();
    try {
      await this.handleRemotePackage(t.pkg);
    } catch (h) {
      console.warn("COLLAB_DEBUG: The room's replacement could not be applied:", h);
    }
    if (!this.collabMap || !this.slate) return;
    this.adoptBaseline(t.stamp), this.dropOlderReplacements(t);
    for (const [h, d] of a) {
      const u = this.slate.nodes?.one?.(h);
      try {
        d && !u ? await this.handleRemotePackage({ type: "onNodeAdded", data: { id: h, nodeOptions: [{ ...d, id: h }] } }) : !d && u && await this.handleRemotePackage({ type: "onNodeDeleted", data: { id: h, isComment: !1 } });
      } catch (f) {
        console.warn("COLLAB_DEBUG: A note whose trade is on its way could not be kept:", f);
      }
    }
    await this.dropRoomCards(new Set(a.keys()));
    const c = [], l = /* @__PURE__ */ new Set();
    this.collabMap.forEach((h, d) => {
      !h || h.type === Kt || h.type === Jt || (c.push({ key: d, pkg: h }), h.type === "onNodeTextChanged" && typeof h.data?.text == "string" && l.add(h.data.id));
    }), c.sort(rr), await this.applyInOrder(c, this.latestLabels(l)), await this.enforceStaleTrades(), this.afterRemote(o), this.scheduleTradeFix(), (s || i) && this.slate && this.slate.emitSlateChange?.(Kt, { action: "superseded" });
  }
  /** Run a batch now if nothing from the room is still being applied, else after it. */
  run(t) {
    const e = () => {
      try {
        return t();
      } catch (o) {
        console.warn("COLLAB_DEBUG: Applying packages from the room failed:", o);
      }
    }, s = this.applying ? this.applying.then(e) : e();
    if (!s) return;
    const i = s.catch((o) => console.warn("COLLAB_DEBUG: Applying packages from the room failed:", o)).then(() => {
      this.applying === i && (this.applying = null);
    });
    this.applying = i;
  }
  /** Resolves when every package received from the room so far has been applied. */
  whenApplied() {
    return this.applying ?? Promise.resolve();
  }
  /** The slate just before packages from the room are applied, for the undo history (see afterRemote). */
  beforeRemote() {
    try {
      return this.slate?.undoRedo?.beforeRemote?.() ?? null;
    } catch {
      return null;
    }
  }
  /**
   * Packages from the room have been applied. The person's undo history takes
   * them in, so a later undo of their own work does not also take away what
   * other people did, before or after that work (see UndoRedo.absorbRemote).
   */
  afterRemote(t) {
    try {
      this.slate?.undoRedo?.absorbRemote?.(t);
    } catch (e) {
      console.warn("COLLAB_DEBUG: Undo history could not take in the room's changes:", e);
    }
  }
  // ─── Trades the server decided ───────────────────────────────────
  /**
   * The host tells of the trades its server has stored (the newest per note) and the workshop
   * revision they are complete through. A trade not heard of before is drawn here at once (the
   * note leaves the canvas, or arrives as the server saved it), as a change from someone else;
   * and when the room has not been told of it (the page that made it went away first), this
   * client tells it a moment later, unless someone else has by then.
   */
  settleTrades(t, e) {
    this.absorbLoadedTrades(), this.learnTrades(t, e, !1);
  }
  /** The workshop revision this screen has every trade drawn through: what its drawing save holds. */
  tradesSettledThrough() {
    return this.absorbLoadedTrades(), this.tradesThrough;
  }
  /**
   * This person's own copy of a traded note was taken away (someone else made the same trade
   * first): the note is drawn again as the server has it, when the server's trade says it is one.
   */
  keepTrade(t) {
    this.tradeTruth.has(t) && this.run(async () => {
      await this.enforceTrade(t);
    });
  }
  /**
   * The page that made a trade heard the server took it: the room is told now. Returns false when
   * the host has told of no trade of this note, so the caller sends its packages as before.
   */
  tellRoomOfTrade(t) {
    return this.absorbLoadedTrades(), this.trades.has(t) ? (this.staleTrade(t) && this.writeTrades([t]), !0) : !1;
  }
  /**
   * A trade of this person's own, of note `id`, is on its way to the server until `answered`
   * settles. Until then this screen's copy of the note is the newest there is: an older trade the
   * server tells of meanwhile is not drawn over it, and the room is not told from it.
   */
  holdTrade(t, e) {
    this.ownTrades.set(t, (this.ownTrades.get(t) ?? 0) + 1);
    const s = () => {
      const i = (this.ownTrades.get(t) ?? 1) - 1;
      i > 0 ? this.ownTrades.set(t, i) : this.ownTrades.delete(t), this.scheduleTradeFix();
    };
    e.then(s, s);
  }
  /**
   * The slate handed its host a change (onSlateChanged), which the host saves. A whole-slate
   * replacement from someone else that this client rebuilds from soon after was not in that save:
   * the host is then handed the slate again, as rebuilt (see rebuildFrom).
   */
  noteHostChange(t) {
    ir.has(t) || (this.hostChangeAt = Date.now());
  }
  /** The room has been synced with (or lost). */
  roomSynced(t) {
    this.synced = t, t && this.scheduleTradeFix();
  }
  /**
   * The trades the loaded document records (options.collabTrades), once it is drawn: what that
   * document holds of each traded note is what the note is until the room is told.
   */
  absorbLoadedTrades(t = !1) {
    const e = this.slate?.options, s = e?.collabTrades;
    !s || typeof s != "object" || !t && this.slate.isLoading?.() || (delete e.collabTrades, this.learnTrades(s.trades, s.through, !0));
  }
  learnTrades(t, e, s) {
    if (typeof e == "number" && e > this.tradesThrough && (this.tradesThrough = e), !t || typeof t != "object") return;
    const i = [];
    for (const [o, r] of Object.entries(t)) {
      if (!r || typeof r.r != "number" || r.as !== "card" && r.as !== "note") continue;
      const a = typeof r.id == "string" && r.id ? r.id : o, c = this.trades.get(a);
      if (!(c && c.r >= r.r))
        if (this.trades.set(a, r), this.tradeLines.set(a, r.as === "note" && Array.isArray(r.lines) ? r.lines.filter((l) => l && typeof l.id == "string") : []), s) {
          const l = this.slate?.nodes?.one?.(a);
          this.tradeTruth.set(a, l ? nt(l.options) : null), l && this.fromRecord.add(a);
        } else {
          const l = r.as === "note" ? r.note?.options : null;
          this.tradeTruth.set(a, l ? { ...l, id: a } : null), i.push(a);
        }
    }
    i.length && this.run(() => {
      const o = this.beforeRemote();
      return Promise.all(i.map((r) => this.enforceTrade(r))).then(() => this.afterRemote(o));
    }), this.scheduleTradeFix();
  }
  /** The newest trade of `id` the host told of is later than the one the room was told of. */
  staleTrade(t) {
    const e = this.trades.get(t);
    if (!e || !this.collabMap) return !1;
    const s = this.collabMap.get(Fs(t));
    return (s?.type === Jt && typeof s.data?.r == "number" ? s.data.r : 0) < e.r;
  }
  staleTradesIn(t) {
    if (this.absorbLoadedTrades(), !this.trades.size || t?.type === Jt || t?.type === Kt) return [];
    const e = [];
    for (const s of this.trades.keys())
      Gn(t, s) !== t && this.staleTrade(s) && e.push(s);
    return e;
  }
  /** The package less what it says about notes whose trade the room has not been told of. */
  screenTraded(t) {
    if (this.absorbLoadedTrades(), !this.trades.size || !t) return t;
    let e = t;
    for (const s of this.trades.keys()) {
      if (!e) break;
      const i = Gn(e, s);
      i !== e && this.staleTrade(s) && (e = i);
    }
    return e;
  }
  /**
   * A package from the room. The room's half of a trade (an arrival marked `traded`) is the note as
   * the trader had it when the room was told: a screen that drew the note from the server's record
   * (which holds it as the play saved it) takes the half's copy instead, so a move or an edit the
   * trader made before its answer came back is not lost there. Anything else is applied as it is.
   */
  applyRoomPackage(t) {
    const e = t.data;
    if (t.type === "onNodeAdded" && typeof e?.traded == "number" && typeof e.id == "string") {
      const s = e.id, i = this.fromRecord.has(s) && !this.ownTrades.has(s) && !!this.slate?.nodes?.one?.(s);
      if (this.fromRecord.delete(s), i) {
        const o = this.handleRemotePackage({ type: "onNodeDeleted", data: { id: s, isComment: !1 } });
        if (o && typeof o.then == "function")
          return o.then(() => this.handleRemotePackage(t));
      }
    } else t.type === "onNodeDeleted" && typeof e?.traded == "number" && typeof e.id == "string" && this.fromRecord.delete(e.id);
    return this.handleRemotePackage(t);
  }
  /**
   * Take off every note the room's trade records say became a card, unless a newer trade of it is
   * known here, or its trade is on its way (`skip`, and this person's own). A whole-slate
   * replacement is drawn from someone's undo history, which can be older than the trade: the room
   * never brings back a note the server's trade record says is a card.
   */
  async dropRoomCards(t) {
    if (!this.collabMap || !this.slate) return;
    const e = [];
    this.collabMap.forEach((s) => {
      if (s?.type !== Jt) return;
      const { trade: i, r: o } = s.data ?? {};
      if (typeof i != "string" || typeof o != "number" || t.has(i) || this.ownTrades.has(i)) return;
      const r = this.trades.get(i);
      if (r && r.r > o) return;
      (s.data.as ?? (r && r.r === o ? r.as : void 0)) === "card" && this.slate.nodes?.one?.(i) && e.push(i);
    });
    for (const s of e)
      try {
        await this.handleRemotePackage({ type: "onNodeDeleted", data: { id: s, isComment: !1 } });
      } catch (i) {
        console.warn("COLLAB_DEBUG: A note the room's trade record says is a card could not be taken off:", i);
      }
  }
  /** Draw note `id` as its trade says, when it is not: take it off, or put it on. */
  enforceTrade(t) {
    if (!this.slate || !this.tradeTruth.has(t) || this.ownTrades.has(t)) return;
    const e = this.tradeTruth.get(t), s = this.slate.nodes?.one?.(t);
    try {
      if (e === null && s) return this.handleRemotePackage({ type: "onNodeDeleted", data: { id: t, isComment: !1 } });
      if (e && !s) {
        this.fromRecord.add(t);
        const i = this.handleRemotePackage({ type: "onNodeAdded", data: { id: t, nodeOptions: [{ ...e, id: t }] } }), o = () => this.joinTradeLines(t);
        return i && typeof i.then == "function" ? i.then(o) : o();
      }
    } catch (i) {
      console.warn("COLLAB_DEBUG: A traded note could not be drawn as the server has it:", i);
    }
  }
  /** Draw the lines the server's record of a trade to a note joined it with (those both of whose notes are here). */
  joinTradeLines(t) {
    const e = [];
    for (const s of this.tradeLines.get(t) ?? [])
      try {
        const i = this.handleRemotePackage({ type: "addRelationship", data: { ...s } });
        i && typeof i.then == "function" && e.push(i);
      } catch (i) {
        console.warn("COLLAB_DEBUG: A traded note's line could not be drawn:", i);
      }
    if (e.length) return Promise.all(e);
  }
  async enforceStaleTrades() {
    for (const t of this.trades.keys())
      this.staleTrade(t) && await this.enforceTrade(t);
  }
  /**
   * Some trade the room has not been told of: tell it in a moment (a second or two, so the page
   * that made the trade, or another screen, usually does first). Only once this client has the
   * room: before that it cannot know what the room was told.
   */
  scheduleTradeFix() {
    this.tradeFixTimer || !this.synced || !this.collabMap || !this.trades.size || [...this.trades.keys()].some((t) => this.staleTrade(t) && !this.ownTrades.has(t)) && (this.tradeFixTimer = setTimeout(() => {
      this.tradeFixTimer = null, !(!this.synced || !this.collabMap) && this.run(async () => {
        await this.enforceStaleTrades();
        const t = [...this.trades.keys()].filter((e) => this.staleTrade(e) && !this.ownTrades.has(e));
        t.length && this.writeTrades(t);
      });
    }, 1e3 + Math.floor(Math.random() * 1e3)));
  }
  /**
   * Tell the room of the trades of these notes, in one step: every package about each note goes,
   * then the note as this screen draws it (its arrival, or its removal), then the record that the
   * room has been told. A client that joins after replays the note from there on.
   */
  writeTrades(t) {
    if (!this.collabMap || !this.synced || !t.length) return;
    const e = () => {
      for (const s of t) {
        const i = this.trades.get(s);
        if (!i) continue;
        const o = [];
        this.collabMap.forEach((d, u) => {
          if (u === Fs(s)) return;
          const f = Gn(d, s);
          f !== d && o.push([u, f]);
        });
        for (const [d, u] of o)
          u ? this.collabMap.set(d, u) : this.collabMap.delete(d);
        const r = i.as === "card" ? null : this.slate?.nodes?.one?.(s), a = i.as === "card" ? null : this.tradeTruth.get(s), c = r ? nt(r.options) : a, l = c ? { type: "onNodeAdded", data: { id: s, nodeOptions: { ...c, id: s }, traded: i.r } } : { type: "onNodeDeleted", data: { id: s, isComment: !1, traded: i.r } };
        this.fromRecord.delete(s);
        const h = `${l.type}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        if (this.collabMap.set(h, { ...l, clientID: this.clientID, timestamp: this.tick() }), c)
          for (const d of this.tradeLines.get(s) ?? []) {
            const u = `addRelationship_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
            this.collabMap.set(u, { type: "addRelationship", data: { ...d }, clientID: this.clientID, timestamp: this.tick() });
          }
        this.collabMap.set(Fs(s), {
          type: Jt,
          data: { trade: s, r: i.r, as: i.as },
          clientID: this.clientID,
          timestamp: this.tick()
        });
      }
    };
    try {
      this.doc ? this.doc.transact(e) : e();
    } catch (s) {
      console.warn("COLLAB_DEBUG: The room could not be told of a trade:", s);
    }
  }
  /**
   * An add or remove of a line from the room that is older than the latest one this
   * screen has made or applied for that line: someone else's move of the line's end
   * that lost to a later one. True means skip it; otherwise it becomes the latest.
   */
  staleLineChange(t, e) {
    const s = or(e);
    if (!s) return !1;
    const i = on(t, e), o = this.lineStamps.get(s);
    return o && ue(i, o) < 0 ? !0 : (this.lineStamps.set(s, i), !1);
  }
  /** Stamp for a package this client is about to write: later than all it has seen. */
  tick() {
    return this.knownBaseline(), this.clock = Math.max(Date.now(), this.clock + 1), this.clock;
  }
  sawTime(t) {
    typeof t == "number" && t > this.clock && (this.clock = t);
  }
  /**
   * The replacement this slate is built on: the one this client last applied or
   * wrote, or the one the loaded document says it already holds, whichever is
   * later. A document stored after an undo carries that undo's stamp, so the
   * client that loads it keeps the stored document and applies only what the
   * room holds beside the replacement, instead of rebuilding the slate from the
   * room's copy.
   */
  knownBaseline() {
    const t = this.slate?.options?.collabBaseline, e = t && typeof t.t == "number" && t.id === this.slate.options.id ? { t: t.t, c: typeof t.c == "number" ? t.c : 0, k: t.k } : null;
    return e && this.sawTime(e.t), this.baseline ? e ? ue(e, this.baseline) > 0 ? e : this.baseline : this.baseline : e;
  }
  /**
   * The host loaded a document into this slate (loadJSON). If the slate already
   * holds a later replacement than that document says it does (an older version
   * put back by the host), the slate keeps saying so: the next stored document
   * must not send the clients that load it back to the room's copy.
   */
  documentLoaded() {
    this.baseline && this.knownBaseline() === this.baseline && this.adoptBaseline(this.baseline), this.absorbLoadedTrades(!0);
  }
  adoptBaseline(t) {
    this.baseline = t, this.sawTime(t.t);
    const e = this.slate?.options;
    e && (e.collabBaseline = { id: e.id, t: t.t, c: t.c, k: t.k });
  }
  /** The latest whole-slate replacement the room holds. */
  newestReplacement() {
    let t = null;
    return this.collabMap?.forEach((e, s) => {
      if (e?.type !== Kt) return;
      const i = on(s, e);
      (!t || ue(i, t.stamp) > 0) && (t = { key: s, pkg: e, stamp: i });
    }), t;
  }
  /** Take replacements that lost to a later one out of the room. */
  dropOlderReplacements(t) {
    if (!this.collabMap) return;
    const e = this.knownBaseline(), s = [];
    if (this.collabMap.forEach((o, r) => {
      o?.type !== Kt || r === t?.key || e && ue(on(r, o), e) < 0 && s.push(r);
    }), s.length === 0) return;
    const i = () => s.forEach((o) => this.collabMap.delete(o));
    try {
      this.doc ? this.doc.transact(i) : i();
    } catch {
    }
  }
  // The room is replayed on every reload, in no fixed order, on top of the
  // stored slate. "Bring note x to front" replayed after notes were added would
  // lift x above them, and the next autosave would keep that. So the room keeps
  // one z-order entry, the whole list order of the latest change; applying it
  // (NodesManager.applyOrder) leaves notes added since in their places.
  storeNodeOrder(t) {
    const e = () => {
      this.collabMap.forEach((s, i) => {
        i !== ar && Us.has(s.type) && this.collabMap.delete(i);
      }), this.collabMap.set(ar, t);
    };
    this.doc ? this.doc.transact(e) : e();
  }
  // Y.Map chooses one convergent label per node, including simultaneous
  // edits. Random keys retain every old label and replay them in varying order.
  storeNodeText(t, e) {
    const { id: s, text: i, ...o } = e.data, r = "node-text:" + s, a = () => {
      this.collabMap.forEach((c, l) => {
        if (l === r || c.type !== "onNodeTextChanged" || c.data?.id !== s || c.data.text === void 0) return;
        const { text: h, ...d } = c.data;
        Object.keys(d).some((u) => u !== "id") ? this.collabMap.set(l, { ...c, data: d }) : this.collabMap.delete(l);
      }), Object.keys(o).length && this.collabMap.set(t, { ...e, data: { id: s, ...o } }), this.collabMap.set(r, { ...e, data: { id: s, text: i } });
    };
    this.doc ? this.doc.transact(a) : a();
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
        this.collabMap.forEach((s, i) => {
          const o = s?.data;
          (o && !Array.isArray(o) ? o.id : void 0) === t && s?.type !== "onNodeDeleted" && e.push(i);
        });
        for (const s of e) this.collabMap.delete(s);
      } catch {
      }
  }
  /** Remove the mutation replay log before installing a full-state baseline. */
  pruneBeforeSlateReplacement() {
    if (this.collabMap)
      try {
        const t = [];
        this.collabMap.forEach((e, s) => {
          e?.type !== Jt && t.push(s);
        });
        for (const e of t) this.collabMap.delete(e);
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
    const { id: e, associationId: s, prop: i } = t;
    if (i != null)
      try {
        const o = [];
        this.collabMap.forEach((r, a) => {
          if (r?.type !== "onLinePropertiesChanged") return;
          const c = r?.data;
          !c || Array.isArray(c) || c.id === e && c.associationId === s && c.prop === i && o.push(a);
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
    let s;
    const i = t.type, o = this.slate.screenGovernedPackage?.(t.type, t.data);
    if (o !== null) {
      if (o !== void 0 && o !== t.data && (t = { ...t, data: o }), typeof e[i] == "function") {
        this.slate.beginRemoteApply?.();
        try {
          const r = e[i](t);
          r && typeof r.then == "function" && (s = r.catch(
            (a) => console.warn("COLLAB_DEBUG: Async invoker failed:", i, a)
          ));
        } finally {
          this.slate.endRemoteApply?.();
        }
      } else
        console.warn("COLLAB_DEBUG: Unknown collab type:", i);
      return this.slate.options.events?.onCollaboration?.(t), s;
    }
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
    this._cursorMoveHandler = (s) => {
      const i = typeof performance < "u" ? performance.now() : +/* @__PURE__ */ new Date();
      if (!(i - e < 40)) {
        e = i;
        try {
          const o = this.slate.canvas.point(s.clientX, s.clientY);
          this.updateCursor(o.x, o.y);
        } catch {
        }
      }
    }, t.addEventListener("pointermove", this._cursorMoveHandler), this._cursorTrackingNode = t;
  }
  /** Remove every rendered remote cursor (drops/reconnects, disconnect). */
  clearRemoteCursors() {
    for (const [, t] of this.cursorElements)
      try {
        t.remove();
      } catch {
      }
    this.cursorElements.clear();
  }
  /**
   * Render (or update) remote collaborators' cursors and remove cursors for
   * clients that have left. Called on every awareness change.
   */
  renderRemoteCursors(t) {
    if (!this.slate.canvas) return;
    const e = this.options.cursorStaleMs ?? 45e3, s = Date.now(), i = t.filter((r) => {
      if (!r.cursor) return !1;
      const a = this._cursorLastSeen.get(r.clientID);
      return a === void 0 ? (this._cursorLastSeen.set(r.clientID, s), !0) : s - a <= e;
    }), o = new Set(i.map((r) => r.clientID));
    for (const [r, a] of this.cursorElements)
      if (!o.has(r)) {
        try {
          a.remove();
        } catch {
        }
        this.cursorElements.delete(r), this._cursorLastSeen.delete(r);
      }
    for (const r of i)
      this.renderCursor(r);
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
      const s = t.userName && t.userName !== "Anonymous" ? t.userName : "";
      if (s) {
        const i = e.group(), o = i.text(s).font({ size: 12, family: "Roboto, Helvetica, Arial, sans-serif" }).fill(t.color);
        let r = 60, a = 16;
        try {
          const d = o.bbox();
          d && d.width && (r = d.width, a = d.height);
        } catch {
        }
        const c = 8, l = 4;
        i.rect(r + c * 2, a + l * 2).radius(6).fill("#fff").stroke({ color: t.color, width: 1 }).back(), o.move(c, l), i.transform({ translateX: 16, translateY: 6 });
      }
      e.attr("pointer-events", "none"), this.cursorElements.set(t.clientID, e);
    }
    e.transform({ translateX: t.cursor.x, translateY: t.cursor.y });
  }
  /**
   * Get all connected collaboration users.
   */
  getCollabUsers() {
    if (!this.awareness) return [];
    const t = [];
    return this.awareness.getStates().forEach((s, i) => {
      i !== this.clientID && t.push({
        clientID: i,
        userName: s.user?.name || "",
        color: s.user?.color || "#999",
        key: typeof s.user?.key == "string" ? s.user.key : void 0,
        cursor: s.cursor
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
    this._cursorMoveHandler = null, this._cursorTrackingNode = null, this._cursorSweepTimer && (clearInterval(this._cursorSweepTimer), this._cursorSweepTimer = null);
    for (const [, t] of this.cursorElements)
      t.remove();
    this.cursorElements.clear(), this.provider && (this.provider.disconnect(), this.provider = null), this.doc && (this.doc.destroy(), this.doc = null), this.collabMap = null, this.awareness = null, this.isConnected = !1, this.synced = !1, this.tradeFixTimer && clearTimeout(this.tradeFixTimer), this.tradeFixTimer = null, this.applying = null, console.log("COLLAB_DEBUG: Disconnected");
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
    console.log("COLLAB_DEBUG: Received remote package:", t.type);
    const e = this.exe(t);
    return this.options.onReceive?.(t), e;
  }
}
function Tc(n) {
  const { x: t, y: e, width: s, height: i } = n, o = n.rotationAngle || 0;
  if (!o) return { minX: t, minY: e, maxX: t + s, maxY: e + i };
  const r = t + s / 2, a = e + i / 2, c = o * Math.PI / 180, l = Math.cos(c), h = Math.sin(c);
  let d = 1 / 0, u = 1 / 0, f = -1 / 0, p = -1 / 0;
  for (const [g, y] of [[t, e], [t + s, e], [t + s, e + i], [t, e + i]]) {
    const b = g - r, x = y - a, C = r + b * l - x * h, v = a + b * h + x * l;
    d = Math.min(d, C), u = Math.min(u, v), f = Math.max(f, C), p = Math.max(p, v);
  }
  const m = (g) => Math.round(g * 1e6) / 1e6;
  return { minX: m(d), minY: m(u), maxX: m(f), maxY: m(p) };
}
function Mc(n, t) {
  if (t.length < 2) return [];
  const e = t.map(Tc), s = Math.min(...e.map((l) => l.minX)), i = Math.max(...e.map((l) => l.maxX)), o = Math.min(...e.map((l) => l.minY)), r = Math.max(...e.map((l) => l.maxY)), a = (s + i) / 2, c = (o + r) / 2;
  return t.map((l, h) => {
    const d = e[h];
    let { x: u, y: f } = l;
    return n === "left" ? u += s - d.minX : n === "right" ? u += i - d.maxX : n === "centerH" ? u += a - (d.minX + d.maxX) / 2 : n === "top" ? f += o - d.minY : n === "bottom" ? f += r - d.maxY : n === "middle" && (f += c - (d.minY + d.maxY) / 2), { id: l.id, x: u, y: f };
  });
}
function kc(n, t) {
  if (t.length < 3) return [];
  const e = t.map((u, f) => ({ box: u, index: f, b: Tc(u) })), s = n === "horizontal", i = (u) => s ? u.b.minX : u.b.minY, o = (u) => s ? u.b.maxX - u.b.minX : u.b.maxY - u.b.minY, r = [...e].sort((u, f) => i(u) - i(f) || u.index - f.index), a = i(r[0]), l = (r.reduce((u, f) => Math.max(u, i(f) + o(f)), -1 / 0) - a - r.reduce((u, f) => u + o(f), 0)) / (r.length - 1), h = /* @__PURE__ */ new Map();
  let d = a;
  for (const u of r) {
    const f = d - i(u);
    h.set(u.index, {
      id: u.box.id,
      x: s ? u.box.x + f : u.box.x,
      y: s ? u.box.y : u.box.y + f
    }), d += o(u) + l;
  }
  return e.map((u) => h.get(u.index));
}
function rs(n, t, e) {
  const s = Math.min(n.x + n.width + e - t.x, t.x + t.width + e - n.x), i = Math.min(n.y + n.height + e - t.y, t.y + t.height + e - n.y);
  return s > 0 && i > 0 ? { x: s, y: i } : null;
}
const vm = 4e6;
function Nc(n, t, { gap: e = 20 } = {}) {
  const s = n.map((h) => ({ ...h })), i = t.map((h) => ({ ...h })), o = (h, d, u, f, p) => {
    const m = h.x + h.width / 2 - (d.x + d.width / 2), g = h.y + h.height / 2 - (d.y + d.height / 2);
    u.y <= u.x ? h.y += (g > 0 || g === 0 && p > 0 ? 1 : -1) * u.y * f : h.x += (m > 0 || m === 0 && p > 0 ? 1 : -1) * u.x * f;
  }, r = Math.max(1, s.length * (i.length + s.length / 2)), a = Math.max(1, Math.min(1e3, Math.floor(vm / r)));
  let c = !1;
  for (let h = 0; h < a; h += 1) {
    let d = !1;
    for (let u = 0; u < s.length; u += 1) {
      for (const f of i) {
        const p = rs(s[u], f, e);
        p && (o(s[u], f, p, 1, 1), d = !0);
      }
      for (let f = u + 1; f < s.length; f += 1) {
        const p = rs(s[u], s[f], e);
        p && (o(s[u], s[f], p, 0.5, -1), o(s[f], s[u], p, 0.5, 1), d = !0);
      }
    }
    if (!d) {
      c = !0;
      break;
    }
  }
  const l = (h) => Math.round(h * 100) / 100;
  for (const h of s)
    h.x = l(h.x), h.y = l(h.y);
  return c || wm(s, i, e), s.map(({ id: h, x: d, y: u }) => ({ id: h, x: d, y: u }));
}
function wm(n, t, e) {
  const s = [...t], i = [];
  for (const f of n)
    s.some((p) => rs(f, p, e)) ? i.push(f) : s.push(f);
  if (!i.length) return;
  const o = Math.min(...n.map((f) => f.x)), r = s.length ? Math.max(...s.map((f) => f.y + f.height)) + e : Math.min(...n.map((f) => f.y)), a = s.length ? Math.max(...s.map((f) => f.x + f.width)) : o, c = i.reduce((f, p) => f + (p.width + e) * (p.height + e), 0), l = Math.max(a - o, Math.sqrt(c) * 1.5, ...i.map((f) => f.width));
  let h = o, d = r, u = 0;
  for (const f of i)
    h > o && h + f.width > o + l && (h = o, d += u + e, u = 0), f.x = h, f.y = d, h += f.width + e, u = Math.max(u, f.height);
}
function xm(n, t, { gap: e = 48, obstacles: s = [] } = {}) {
  if (!n.length) return [];
  const i = new Map(n.map((v) => [v.id, v])), o = new Map(n.map((v) => [v.id, []])), r = new Map(n.map((v) => [v.id, 0]));
  for (const [v, w] of t)
    !i.has(v) || !i.has(w) || v === w || (o.get(v).push(w), r.set(w, r.get(w) + 1));
  const a = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), l = [], h = (v) => {
    l.push(v), c.set(v, 0), a.set(v, []);
    const w = [v];
    for (; w.length; ) {
      const _ = w.shift();
      for (const S of o.get(_))
        c.has(S) || (c.set(S, c.get(_) + 1), a.set(S, []), a.get(_).push(S), w.push(S));
    }
  };
  for (const v of n) r.get(v.id) === 0 && !c.has(v.id) && h(v.id);
  for (const v of n) c.has(v.id) || h(v.id);
  const d = [];
  for (const v of n) {
    const w = c.get(v.id);
    d[w] = Math.max(d[w] ?? 0, v.height);
  }
  const u = Math.min(...n.map((v) => v.x)), f = Math.min(...n.map((v) => v.y)), p = [];
  d.forEach((v, w) => {
    p[w] = w === 0 ? f : p[w - 1] + d[w - 1] + e;
  });
  const m = /* @__PURE__ */ new Map(), g = (v) => {
    const w = a.get(v), _ = w.reduce((T, A) => T + g(A), 0) + e * Math.max(0, w.length - 1), S = Math.max(i.get(v).width, _);
    return m.set(v, S), S;
  }, y = /* @__PURE__ */ new Map(), b = (v, w) => {
    const _ = i.get(v), S = a.get(v), T = m.get(v), A = p[c.get(v)];
    if (!S.length) {
      y.set(v, { id: v, x: w + (T - _.width) / 2, y: A });
      return;
    }
    const M = S.reduce((O, L) => O + m.get(L), 0) + e * (S.length - 1);
    let N = w + (T - M) / 2;
    for (const O of S)
      b(O, N), N += m.get(O) + e;
    const R = y.get(S[0]), P = y.get(S[S.length - 1]), E = (R.x + i.get(S[0]).width / 2 + P.x + i.get(S[S.length - 1]).width / 2) / 2, k = Math.min(Math.max(E - _.width / 2, w), w + T - _.width);
    y.set(v, { id: v, x: k, y: A });
  };
  let x = u;
  for (const v of l) {
    const w = g(v);
    b(v, x), x += w + e;
  }
  const C = n.map((v) => y.get(v.id));
  return _m(n, C, s, e);
}
function _m(n, t, e, s) {
  if (!e.length) return t;
  let i = 0;
  for (let o = 0; o <= e.length; o += 1) {
    let r = 0;
    if (t.forEach((a, c) => {
      const l = { ...n[c], x: a.x, y: a.y + i };
      for (const h of e)
        rs(l, h, s) && (r = Math.max(r, h.y + h.height + s - l.y));
    }), !r) break;
    i += r;
  }
  return i ? t.map((o) => ({ ...o, y: o.y + i })) : t;
}
function Rc(n, t = 20) {
  const e = n.nodes.allNodes, i = (n.freeNodes?.() ?? e).filter((l) => !l.options.isLocked);
  if (i.length < 1 || e.length < 2) return;
  const o = (l) => ({
    id: l.id ?? l.options.id,
    x: l.options.x || 0,
    y: l.options.y || 0,
    width: l.options.width || 100,
    height: l.options.height || 60
  }), r = new Set(i), c = Nc(i.map(o), e.filter((l) => !r.has(l)).map(o), { gap: t }).filter((l, h) => {
    const d = i[h];
    return l.x !== (d.options.x || 0) || l.y !== (d.options.y || 0);
  });
  c.length && (c.forEach((l) => {
    i.find((d) => (d.id ?? d.options.id) === l.id).position(l.x, l.y);
  }), n.broadcast?.("onNodesMove", { nodes: c }));
}
function Pc(n, t, e, s = !1) {
  const i = s ? 0 : 500;
  let o = 0;
  for (const r of t) {
    const a = n.nodes.one(r.id);
    a && !n.governanceOf?.(a) ? a.position(r.x, r.y, () => {
      o++, o >= t.length && e && e();
    }, void 0, i) : o++;
  }
  t.length === 0 && e && e();
}
function Oc(n) {
  return (n.freeNodes?.() ?? n.nodes.allNodes).map((t) => ({
    id: t.id,
    x: t.options.x || 0,
    y: t.options.y || 0
  }));
}
const Sm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  applyLayout: Pc,
  packageLayout: Oc,
  removeLayoutOverlaps: Rc
}, Symbol.toStringTag, { value: "Module" }));
class Ic {
  constructor(t, e = {}) {
    this.container = null, this.slider = null, this.label = null, this._viewObserver = null, this._sizeObserver = null, this.fitButton = null, this.zoomInButton = null, this.zoomOutButton = null, this.rule = null, this.compact = null, this.slate = t, this.options = {
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
    this._viewObserver?.disconnect(), this._viewObserver = null, this._sizeObserver?.disconnect(), this._sizeObserver = null, this.container && (this.container.remove(), this.container = null, this.slider = null, this.label = null);
  }
  /** Update the slider to reflect current zoom level */
  update() {
    if (!this.slider || !this.label) return;
    const t = this.slate.getZoom?.() || 1;
    this.slider.value = String(t), this.label.textContent = `${Math.round(t * 100)}%`;
  }
  // ─── Private ─────────────────────────────────────────────────────
  /** Lay the control out for the canvas's width now: a slim column on a phone, a short pill on a wider screen. */
  arrange() {
    const t = this.container;
    if (!t || !this.slider || !this.label || !this.rule || !this.fitButton || !this.zoomInButton || !this.zoomOutButton) return;
    const s = (this.slate.element?.clientWidth || (typeof innerWidth == "number" ? innerWidth : 1024)) < 600;
    if (s === this.compact) return;
    this.compact = s, t.toggleAttribute("data-compact", s);
    const i = this.options.position.startsWith("top"), o = s ? 12 : 16, r = s || this.options.position === "top-right" ? `right: ${o}px;` : `left: ${o}px;`, a = t.style.display === "none" ? "none" : "flex";
    t.style.cssText = `
      position: absolute;
      ${i ? "top" : "bottom"}: calc(var(--slatebox-zoom-offset, 0px) + ${o}px); ${r}
      display: ${a};
      flex-direction: ${s ? "column" : "row"};
      align-items: center;
      gap: ${s ? 0 : 2}px;
      background: var(--slatebox-zoom-bg, rgba(255, 255, 255, 0.94));
      color: var(--slatebox-zoom-ink, #1f3d33);
      border: 1px solid var(--slatebox-zoom-line, #d9ddcf);
      box-shadow: 0 2px 10px rgba(20, 40, 30, 0.10);
      padding: ${s ? "4px 0" : "2px 6px"};
      border-radius: ${s ? 14 : 999}px;
      z-index: 1000;
      font-family: var(--slatebox-board-font, system-ui, sans-serif);
      font-size: 12px;
      font-variant-numeric: tabular-nums;
      user-select: none;
    `;
    for (const l of [this.fitButton, this.zoomOutButton, this.zoomInButton])
      l.style.cssText = `background:none;border:none;color:inherit;cursor:pointer;font-size:${s ? 20 : 16}px;line-height:1;width:${s ? 40 : 28}px;height:${s ? 40 : 28}px;border-radius:999px;display:grid;place-items:center;padding:0;font-family:inherit;`;
    this.slider.style.cssText = s ? "display:none" : "width: 72px; cursor: pointer; accent-color: var(--slatebox-zoom-ink, #1f3d33);", this.label.style.cssText = s ? "font-size:11px;font-weight:600;padding:2px 0;opacity:.85" : "min-width: 38px; text-align: right; font-weight: 600; padding-right: 4px;", this.rule.style.cssText = s ? "width:20px;height:1px;background:var(--slatebox-zoom-line,#d9ddcf);margin:2px 0" : "width:1px;height:16px;background:var(--slatebox-zoom-line,#d9ddcf);margin:0 2px";
    const c = s ? [this.zoomInButton, this.label, this.zoomOutButton, this.rule, this.fitButton] : [this.fitButton, this.rule, this.zoomOutButton, this.slider, this.zoomInButton, this.label];
    for (const l of c) t.appendChild(l);
    s && this.slider.remove();
  }
  create() {
    if (!this.slate.element) return;
    this.slate.element.style.position = this.slate.element.style.position || "relative", this.container = document.createElement("div"), this.container.className = "slatebox-zoom-slider";
    const t = (s, i, o) => {
      const r = document.createElement("button");
      return r.type = "button", r.textContent = s, r.title = i, r.setAttribute("aria-label", i), r.onclick = o, r;
    };
    this.fitButton = t("⤢", "Fit to content", () => this.slate.fitToContent?.()), this.fitButton.setAttribute("aria-label", "fitToContent"), this.zoomOutButton = t("−", "Zoom out", () => this.slate.zoomOut?.()), this.zoomInButton = t("+", "Zoom in", () => this.slate.zoomIn?.()), this.slider = document.createElement("input"), this.slider.type = "range", this.slider.min = String(this.options.minZoom), this.slider.max = String(this.options.maxZoom), this.slider.step = "0.1", this.slider.value = "1", this.slider.setAttribute("aria-label", "Zoom"), this.slider.oninput = () => {
      const s = parseFloat(this.slider.value);
      this.slate.zoom?.(s), this.update();
    }, this.label = document.createElement("span"), this.label.className = "slatebox-zoom-label", this.label.textContent = "100%", this.rule = document.createElement("div"), this.rule.setAttribute("aria-hidden", "true"), this.arrange(), typeof ResizeObserver < "u" && (this._sizeObserver = new ResizeObserver(() => this.arrange()), this._sizeObserver.observe(this.slate.element)), this.slate.element.appendChild(this.container), this.update();
    const e = this.slate.canvas?.node;
    e && typeof MutationObserver < "u" && (this._viewObserver = new MutationObserver(() => this.update()), this._viewObserver.observe(e, { attributes: !0, attributeFilter: ["viewBox"] }));
  }
}
const Cm = (n) => n < 0.5 ? 4 * n * n * n : 1 - Math.pow(-2 * n + 2, 3) / 2, Dc = (n) => Math.min(1, Math.max(0, n));
function Em(n, t, e = {}) {
  const s = Math.max(1, n.width), i = Math.max(1, n.height), o = e.top ?? 0, r = e.bottom ?? 0, a = e.fill ?? 0.9, c = Math.max(1, t.h - o - r), l = Math.abs(e.roll ?? 0) * Math.PI / 180, h = Math.abs(Math.cos(l)), d = Math.abs(Math.sin(l)), u = e.cover ? s : s * h + i * d, f = e.cover ? i : s * d + i * h;
  let p = e.cover ? Math.max(t.w / s, t.h / i) : Math.min(t.w * a / u, c * a / f);
  return e.maxScale && p > e.maxScale && (p = e.maxScale), {
    cx: n.x + n.width / 2,
    cy: n.y + n.height / 2,
    scale: p,
    roll: e.roll ?? 0,
    dy: e.cover ? 0 : (o - r) / 2
  };
}
function Am(n, t, e, s, i = "prezi", o = Cm) {
  if (e >= 1 || i === "cut") return { ...t };
  if (e <= 0) return { ...n };
  const r = o(e), a = Math.log(n.scale), c = Math.log(t.scale);
  let l = a + (c - a) * r, h = r;
  if (i === "prezi") {
    const d = Math.hypot(t.cx - n.cx, t.cy - n.cy) * Math.min(n.scale, t.scale) / Math.max(1, Math.min(s.w, s.h)), u = Math.min(2.2, 0.9 * Math.log(1 + d + Math.abs(c - a) * 0.4));
    l -= u * Math.sin(Math.PI * r), h = o(Dc((e - 0.12) / 0.76));
  }
  return {
    cx: n.cx + (t.cx - n.cx) * h,
    cy: n.cy + (t.cy - n.cy) * h,
    scale: Math.exp(l),
    roll: n.roll + (t.roll - n.roll) * r,
    dy: n.dy + (t.dy - n.dy) * r
  };
}
function Tm(n, t, e) {
  const s = -n.roll * Math.PI / 180, i = -Math.sin(s) * n.dy, o = Math.cos(s) * n.dy, r = (e ?? t.w) / n.scale, a = (e ?? t.h) / n.scale, c = n.cx - i / n.scale, l = n.cy - o / n.scale;
  return { x: c - r / 2, y: l - a / 2, width: r, height: a };
}
function Mm(n, t, e) {
  const s = Math.hypot(t.cx - n.cx, t.cy - n.cy) * Math.min(n.scale, t.scale) / Math.max(1, Math.min(e.w, e.h)), i = Math.abs(Math.log(t.scale / n.scale));
  return Math.round(Math.min(2e3, 900 + s * 260 + i * 180));
}
const js = () => {
  const n = new Error("The camera flight was aborted.");
  return n.name = "AbortError", n;
};
class km {
  constructor(t) {
    this.state = null, this.rollHost = null, this.viewportFn = null, this.raf = null, this.cancelCurrent = null, this.slate = t;
  }
  /**
   * Where the camera looks from: `viewport` is the visible stage's size (it
   * defaults to the canvas element's), `rollHost` the element rotated for roll,
   * and `hostSide` the canvas's side when it sits in a square roll host.
   */
  configure(t) {
    t.viewport && (this.viewportFn = t.viewport), t.rollHost !== void 0 && (this.rollHost = t.rollHost), t.hostSide !== void 0 && (this.hostSide = t.hostSide);
  }
  setRollHost(t, e) {
    this.configure({ rollHost: t, hostSide: e });
  }
  viewport() {
    if (this.viewportFn) return this.viewportFn();
    const t = this.slate?.panZoom?.getViewportSize?.();
    return t ? { w: t.w, h: t.h } : { w: 800, h: 600 };
  }
  /** The camera now: the last one set, else read from the viewbox. */
  current() {
    if (this.state) return { ...this.state };
    const t = this.slate?.canvas?.viewbox?.();
    if (!t?.width) return null;
    const e = this.viewport();
    return { cx: t.x + t.width / 2, cy: t.y + t.height / 2, scale: (this.hostSide ?? e.w) / t.width, roll: 0, dy: 0 };
  }
  /** The box the given notes cover, from their options. */
  boxOf(t) {
    let e = 1 / 0, s = 1 / 0, i = -1 / 0, o = -1 / 0;
    for (const r of t) {
      const c = this.slate?.nodes?.one?.(r)?.options;
      c && (e = Math.min(e, c.x ?? 0), s = Math.min(s, c.y ?? 0), i = Math.max(i, (c.x ?? 0) + (c.width ?? 0)), o = Math.max(o, (c.y ?? 0) + (c.height ?? 0)));
    }
    return Number.isFinite(e) ? { x: e, y: s, width: i - e, height: o - s } : null;
  }
  /** The camera that frames `target`, or null when it frames nothing. */
  resolve(t, e = !1) {
    const s = e ? 0 : t.roll ?? 0;
    if (t.state)
      return { cx: 0, cy: 0, scale: 1, dy: 0, ...this.current(), ...t.state, roll: e ? 0 : t.state.roll ?? s };
    const i = t.bbox ?? (t.nodeIds ? this.boxOf(t.nodeIds) : null);
    return i ? Em(i, this.viewport(), { ...t, roll: s }) : null;
  }
  /** Show `cam` at once. */
  apply(t) {
    const e = Tm(t, this.viewport(), this.hostSide);
    try {
      this.slate.canvas.viewbox(e.x, e.y, e.width, e.height);
    } catch {
    }
    this.rollHost && (this.rollHost.style.transform = `rotate(${Math.round(t.roll * 100) / 100}deg)`), this.state = { ...t };
  }
  /** Stop the flight in progress (its promise rejects with an AbortError). */
  stop() {
    this.cancelCurrent?.();
  }
  /**
   * Fly to `target`. Resolves when the camera lands; rejects with an AbortError
   * when `signal` aborts or a newer flight starts.
   */
  flyTo(t, e = {}) {
    this.stop();
    const s = !!e.reduced, i = this.resolve(t, s);
    if (!i) return Promise.resolve(this.current());
    const o = this.current(), r = s || !o ? "cut" : e.arc ?? "prezi", a = this.viewport(), c = e.duration ?? (o ? Mm(o, i, a) : 0);
    if (r === "cut" || c <= 0 || typeof requestAnimationFrame > "u")
      return e.signal?.aborted ? Promise.reject(js()) : (this.apply(i), e.onFrame?.(i, 1), Promise.resolve({ ...i }));
    const l = new Promise((h, d) => {
      let u = null, f = !1;
      const p = (y) => {
        if (!f) {
          if (f = !0, this.raf != null)
            try {
              cancelAnimationFrame(this.raf);
            } catch {
            }
          this.raf = null, this.cancelCurrent = null, e.signal?.removeEventListener?.("abort", m), y ? d(y) : h({ ...i });
        }
      }, m = () => p(js());
      if (e.signal?.aborted) {
        p(js());
        return;
      }
      e.signal?.addEventListener?.("abort", m), this.cancelCurrent = m;
      const g = (y) => {
        if (f) return;
        u === null && (u = y);
        const b = Dc((y - u) / c), x = Am(o, i, b, a, r, e.ease);
        this.apply(x), e.onFrame?.(x, b), b < 1 ? this.raf = requestAnimationFrame(g) : p();
      };
      this.raf = requestAnimationFrame(g);
    });
    return l.catch(() => {
    }), l;
  }
  destroy() {
    this.stop(), this.rollHost = null, this.slate = null;
  }
}
const cr = bs + Jn / 2 + 4;
function Nm(n) {
  return { left: n.left, top: n.top, right: n.right, bottom: n.bottom, width: n.right - n.left, height: n.bottom - n.top };
}
const cs = class cs {
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
   * import { Slate } from 'slateboxjs';
   * const slate = new Slate('#canvas', {
   *   viewPort: { originalWidth: 1200, originalHeight: 800 },
   *   panZoom: { enabled: true }
   * });
   * ```
   */
  constructor(t, e = {}) {
    if (this._undoListenersWaiting = /* @__PURE__ */ new Map(), this._lineTool = null, this.selectedNodes = [], this.groupResizeRotate = null, this.enteredGroupId = null, this._coordinateIntervalId = null, this._lastPointerDown = null, this._windowPointerDownHandler = null, this._othersChange = 0, this._undoPointers = /* @__PURE__ */ new Set(), this._undoGestureHandlers = [], this._destroyed = !1, this._applyingRemote = 0, this._onlyHere = 0, this._held = /* @__PURE__ */ new Set(), this._loadsInFlight = /* @__PURE__ */ new Set(), this._hadGroupSelection = !1, this._emitDeferred = !1, this._emitQueue = [], this._birdsEyeTimeoutId = null, this._coordDisplayTimeoutId = null, this._nodeNotifyTimeoutId = null, this._liveRegion = null, this._announcementsHeld = 0, this._resizeObserver = null, this._dragPolicies = [], this._selectionListeners = [], this._selectionNoticeQueued = !1, this._selectedLine = null, this._frameGestures = /* @__PURE__ */ new Set(), this._frameMovingSent = !1, this._frameQueued = !1, this._frameLastKey = "", this._frameViewTimer = null, this._frameSettleTimer = null, this._frameRecheck = null, this._policyAuthority = 0, this._governedDragNode = null, this._viewSizeW = 0, this._viewSizeH = 0, this._decoRefreshQueued = !1, typeof t == "string") {
      const s = document.querySelector(t);
      if (!s)
        throw new Error(`Element with selector "${t}" not found`);
      this.element = s;
    } else
      this.element = t;
    if (typeof window < "u") {
      const s = window;
      s.__slateboxInstances = s.__slateboxInstances || [], s.__slateboxInstances.push(this);
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
    return {
      availableFilters: pc(),
      availableAnimations: lo()
    };
  }
  init() {
    this.canvas = ms().addTo(this.element), this.canvas.node.setAttribute("role", this.options.enabled === !1 ? "img" : "group"), this.canvas.node.setAttribute("aria-label", this.options.name || "Diagram canvas"), this.canvas.node.setAttribute("tabindex", "0"), this._liveRegion = document.createElement("div"), this._liveRegion.setAttribute("aria-live", "polite"), this._liveRegion.setAttribute("aria-atomic", "true"), this._liveRegion.style.cssText = "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;", this.element.appendChild(this._liveRegion), this.element.style.overflow = this.element.style.overflow || "hidden", getComputedStyle(this.element).position === "static" && (this.element.style.position = "relative");
    const t = this.canvas.node;
    t?.style && (t.style.width = "100%", t.style.height = "100%", t.style.display = "block"), t?.removeAttribute?.("width"), t?.removeAttribute?.("height"), t?.setAttribute?.("preserveAspectRatio", "xMidYMid slice");
    const e = this.element.getBoundingClientRect();
    this.options.viewPort = this.options.viewPort || {};
    const s = this.options.viewPort.originalWidth || Math.round(e.width) || 800, i = this.options.viewPort.originalHeight || Math.round(e.height) || 600;
    this.options.viewPort.originalWidth = s, this.options.viewPort.originalHeight = i;
    const o = this.options.viewPort.left ?? 0, r = this.options.viewPort.top ?? 0;
    this.canvas.viewbox(o, r, s, i), this._setupResizeObserver(), this.nodes = new Zp(this), this.invoker = new lm(this), this.applyContainerStyle(), this.setupSelectionHandling(), this.options.viewPort?.showCoordinates && this.setupCoordinateCallbacks(), this.setupFrameCallbacks(), this.panZoom = new wc(this, this.options.panZoom);
    const a = tp();
    a && (this.birdsEye = new a.BirdsEye(this, this.options.birdsEye)), this.options.birdsEye?.enabled && (this._birdsEyeTimeoutId = setTimeout(() => {
      this._destroyed || this.birdsEye.enable();
    }, 200));
    const c = (b) => {
      this.undoRedo = new b.UndoRedo(this, {
        enabled: this.options.showUndoRedo !== !1
      });
      for (const [x, C] of this._undoListenersWaiting) C(this.undoRedo.subscribe?.(x) ?? (() => {
      }));
      this._undoListenersWaiting.clear(), this.undoRedo.snap?.(!0);
    }, l = ep();
    c(l), this.setupUndoGestures(), this.multiSelection = new xc(this, {
      enabled: this.options.showMultiSelect !== !1
    }), this.grid = new _c(this, {
      enabled: this.options.viewPort?.showGrid || !1,
      gridSize: this.options.viewPort?.gridSize || 20,
      // Re-apply the persisted snap-to-grid setting so it survives reload.
      snapToGrid: this.options.viewPort?.snapToGrid || !1
    }), this.options.viewPort?.showGrid && this.grid.show();
    const h = (b) => {
      this.keyboard = new b.Keyboard(this), this.options.enabled !== !1 && this.keyboard.bindGlobal();
    }, d = ip();
    h(d);
    const u = (b) => {
      this.mediaInput = new b.MediaInput(this), this.options.enabled !== !1 && this.mediaInput.enable();
    }, f = np();
    u(f);
    const p = (b) => {
      this.contextMenu = new b.ContextMenu(this), this.options.enabled !== !1 && this.contextMenu.enable();
    }, m = sp();
    p(m), this.collab = new Ac(this), this.zoomSlider = new Ic(this, {
      enabled: this.options.showZoom || !1
    });
    const g = (b) => {
      this.presentation = new b.Presentation(this);
    }, y = op();
    g(y), this.camera = new km(this), this.makeResponsive(), this.options.viewPort?.showCoordinates && (this._coordDisplayTimeoutId = setTimeout(() => {
      this._destroyed || this.addCoordinateDisplay();
    }, 150));
  }
  /**
   * Destroy the Slate, cleaning up all sub-modules, timers, and event listeners.
   * Follows the PanZoom.ts pattern: clear timers → remove listeners → chain to owned objects.
   */
  destroy() {
    try {
      this._lineTool?.cancel();
    } catch {
    }
    if (this._destroyed = !0, this._dragPolicies = [], this._governedDragNode = null, this._frameViewTimer && clearTimeout(this._frameViewTimer), this._frameSettleTimer && clearTimeout(this._frameSettleTimer), this._frameRecheck !== null && typeof cancelAnimationFrame < "u" && cancelAnimationFrame(this._frameRecheck), this._selectedLine = null, this._resizeObserver && (this._resizeObserver.disconnect(), this._resizeObserver = null), typeof window < "u") {
      const e = window;
      Array.isArray(e.__slateboxInstances) && (e.__slateboxInstances = e.__slateboxInstances.filter(
        (s) => s !== this
      ));
    }
    this._birdsEyeTimeoutId !== null && (clearTimeout(this._birdsEyeTimeoutId), this._birdsEyeTimeoutId = null), this._coordDisplayTimeoutId !== null && (clearTimeout(this._coordDisplayTimeoutId), this._coordDisplayTimeoutId = null), this._nodeNotifyTimeoutId !== null && (clearTimeout(this._nodeNotifyTimeoutId), this._nodeNotifyTimeoutId = null), this._coordinateIntervalId !== null && (clearInterval(this._coordinateIntervalId), this._coordinateIntervalId = null);
    const t = this.element.querySelector("#slate-coordinates");
    t && t.remove(), this.canvas.off("click"), this._windowPointerDownHandler && (window.removeEventListener("pointerdown", this._windowPointerDownHandler, !0), this._windowPointerDownHandler = null), this._lastPointerDown = null, this.panZoom && this.panZoom.destroy(), this.birdsEye && this.birdsEye.disable(), this.zoomSlider && this.zoomSlider.destroy(), this.keyboard && this.keyboard.unbindGlobal(), this.mediaInput && this.mediaInput.destroy(), this.contextMenu && this.contextMenu.disable(), this.multiSelection && this.multiSelection.disable();
    for (const [e, s, i] of this._undoGestureHandlers) i.removeEventListener(e, s, !0);
    this._undoGestureHandlers = [], this._undoPointers.clear(), this.undoRedo && this.undoRedo.clear(), this.collab && this.collab.disconnect(), this.camera?.destroy(), this.presentation && this.presentation.stop(), this.grid && this.grid.hide(), this.nodes && this.nodes.clear(), this.canvas && this.canvas.remove(), this._liveRegion && (this._liveRegion.remove(), this._liveRegion = null);
  }
  /**
   * Announce a message to screen readers via the hidden aria-live region.
   * Used for state changes: node add/remove, selection changes, zoom changes.
   */
  announce(t) {
    this._announcementsHeld > 0 || this._liveRegion && (this._liveRegion.textContent = "", setTimeout(() => {
      this._liveRegion && (this._liveRegion.textContent = t);
    }, 50));
  }
  /**
   * Run `fn` without live-region announcements, for a caller that will describe the
   * whole action in one announcement of its own.
   */
  withoutAnnouncements(t) {
    this._announcementsHeld++;
    try {
      return t();
    } finally {
      this._announcementsHeld--;
    }
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
    if (this._applyingRemote > 0 || this._onlyHere > 0 || this._destroyed) return;
    const s = this.options.events?.onSlateChanged;
    if (!s) return;
    const i = { type: t, data: e };
    if (this.options.instance && (i.instanceId = this.options.instance), this._emitDeferred) {
      this._emitQueue.push(i);
      return;
    }
    this.collab?.noteHostChange?.(t);
    let o = [];
    try {
      o = this.collab?.getCollabUsers?.() ?? [];
    } catch {
    }
    try {
      s(i, o)?.catch?.(
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
    if (!(this._applyingRemote > 0 || this._onlyHere > 0 || this._destroyed)) {
      if (this._dragPolicies.length) {
        if (this._policyAuthority > 0) return;
        this.offerGovernedLine(t, e);
        const s = this.screenGovernedPackage(t, e);
        if (s === null) return;
        s !== void 0 && (e = s);
      }
      typeof this.collab?.send == "function" ? this.collab.send({ type: t, data: e }) : this.emitSlateChange(t, e), this.recordUndoFor(t);
    }
  }
  /**
   * Make a change on this screen only: nothing it broadcasts reaches collaborators or the
   * host's save, and nothing is recorded for undo (a host step records itself, see
   * {@link beginHostStep}). A host uses it for a step that only its own save makes real (a
   * note and a card trading places): the person sees it at once, and the host sends it with
   * {@link sendHeld} once saved. Until then nobody else, and no one who joins, has seen it.
   */
  onlyHere(t) {
    this._onlyHere++;
    try {
      return t();
    } finally {
      this._onlyHere--;
    }
  }
  /**
   * Send packages for a change made with {@link onlyHere}, once the host has saved it: to
   * collaborators (and so to the host's save), or to the host alone without collaboration.
   * Sent even while a package from the room is being applied: it is this person's own change.
   */
  sendHeld(t) {
    if (this._destroyed || !t.length) return;
    const e = t.filter((i) => {
      const o = i.data?.id;
      return (i.type === "onNodeAdded" || i.type === "onNodeDeleted") && typeof o == "string" && this.collab?.tellRoomOfTrade?.(o) === !0;
    });
    for (const i of e) this.emitSlateChange(i.type, i.data);
    const s = t.filter((i) => !e.includes(i));
    if (s.length)
      if (typeof this.collab?.send == "function")
        this.collab.send(s);
      else
        for (const i of s) this.emitSlateChange(i.type, i.data);
  }
  /**
   * The note and card trades the host's server has stored (the newest trade of each note) and
   * the workshop revision they are complete through. A trade this screen has not drawn is drawn
   * now, and the room is told of any it has not been (see Collab.settleTrades). Call it before
   * telling the slate a trade of this person's own was saved.
   */
  settleTrades(t, e) {
    this._destroyed || this.collab?.settleTrades?.(t, e);
  }
  /** The workshop revision through which this screen draws every trade: for the drawing save. */
  tradesThrough() {
    return this.collab?.tradesSettledThrough?.() ?? 0;
  }
  /**
   * A trade of this person's own, of note `id`, waits for the host's answer: until then a trade the
   * server tells of is not drawn over this screen's copy of the note (see Collab.holdTrade).
   */
  holdTrade(t, e) {
    this._destroyed || !e || typeof e.then != "function" || this.collab?.holdTrade?.(t, e);
  }
  /** Draw a traded note as the server's trade has it again (this person's own copy was taken away). */
  keepTrade(t) {
    this._destroyed || this.collab?.keepTrade?.(t);
  }
  /**
   * A host step made with {@link onlyHere} waits for `saved`, the host's own save of it. The
   * host's drawing save can wait for every such step with {@link whenHeldSettled}, so it never
   * stores a step its own save has not made real.
   */
  holdUntil(t) {
    const e = t.then(
      () => {
      },
      () => {
      }
    );
    this._held.add(e), e.then(() => this._held.delete(e));
  }
  /** True while a host step made on this screen waits for its save. */
  hasHeldChanges() {
    return this._held.size > 0;
  }
  /** Resolves once no host step waits for its save (saved, refused or failed). */
  async whenHeldSettled() {
    for (; this._held.size; ) await Promise.all([...this._held]);
  }
  /** Record a debounced undo checkpoint for a document-mutating package. */
  recordUndoFor(t) {
    this._othersChange > 0 || this.undoRedo && !cs.NON_UNDOABLE.has(t) && (t === "onNodeDeleted" && typeof this.undoRedo.snapAfterGesture == "function" ? this.undoRedo.snapAfterGesture() : t === "onNodeTextChanged" && this.undoRedo.inGesture?.() ? this.undoRedo.forceSnapshot?.() : this.undoRedo.snap?.());
  }
  /**
   * A press on this canvas (a drag, a resize, a rotation, a line drawn, a marquee) is one
   * undo step, whatever it changes and however many packages it sends: the step is
   * recorded when the last pointer pressed on the canvas is let go.
   */
  setupUndoGestures() {
    if (typeof window > "u" || !this.element) return;
    const t = (a) => {
      if (a !== void 0) {
        if (!this._undoPointers.delete(a) || this._undoPointers.size) return;
      } else {
        if (!this._undoPointers.size) return;
        this._undoPointers.clear();
      }
      this.undoRedo?.endGesture?.();
    }, e = (a) => {
      const c = a.target;
      !c || !this.element?.contains(c) || this._undoPointers.has(a.pointerId) || (this._undoPointers.size || this.undoRedo?.beginGesture?.(), this._undoPointers.add(a.pointerId));
    }, s = (a) => t(a.pointerId), r = [
      ["pointerdown", e, window],
      ["pointerup", s, window],
      ["pointercancel", s, window],
      ["blur", () => t(), window],
      ["visibilitychange", () => {
        document.visibilityState === "hidden" && t();
      }, document]
    ];
    for (const [a, c, l] of r) l.addEventListener(a, c, !0);
    this._undoGestureHandlers = r;
  }
  /** Undo this person's last step on this slate. False when there was nothing to undo. */
  undo() {
    return this._destroyed || this.isReadOnly?.() ? !1 : this.undoRedo?.undo?.() ?? !1;
  }
  /** Redo the step this person last undid. False when there was nothing to redo. */
  redo() {
    return this._destroyed || this.isReadOnly?.() ? !1 : this.undoRedo?.redo?.() ?? !1;
  }
  /** Whether this person has a step to undo. */
  canUndo() {
    return !!this.undoRedo?.canUndo?.();
  }
  /** Whether this person has an undone step to redo. */
  canRedo() {
    return !!this.undoRedo?.canRedo?.();
  }
  /** Whether there is something to undo and to redo, with the steps' names when their hosts gave them. */
  undoRedoState() {
    return this.undoRedo?.state?.() ?? { canUndo: !1, canRedo: !1, undoLabel: null, redoLabel: null };
  }
  /**
   * Hear whenever there comes to be something, or nothing, to undo or redo, and what each
   * undo or redo did (for a host's Undo and Redo controls). Returns a function that stops it.
   */
  onUndoRedo(t) {
    if (!this.undoRedo) {
      let e = null;
      const s = (i) => {
        e = i;
      };
      return this._undoListenersWaiting.set(t, s), () => {
        this._undoListenersWaiting.delete(t), e?.();
      };
    }
    return this.undoRedo.subscribe?.(t) ?? (() => {
    });
  }
  /**
   * Record a step the host made in its own state (a board's cards on its server) as the next
   * step of this person's undo history, undone and redone by the host (see HostStep).
   */
  recordHostStep(t) {
    this._destroyed || this.undoRedo?.recordHostStep?.(t);
  }
  /**
   * Draw a change someone else made (an agent's saved run, another page's import) on this
   * canvas: it is not a step of this person's own, and their undo history takes it in so
   * that no undo of theirs takes it away (see UndoRedo.absorbRemote). `change` may return
   * a promise: the history takes it in once it has settled.
   */
  async othersChange(t) {
    const e = this.undoRedo?.beforeRemote?.() ?? null;
    this._othersChange++;
    let s;
    try {
      s = await t();
    } finally {
      this._othersChange--, this.undoRedo?.absorbRemote?.(e);
    }
    return s;
  }
  /**
   * Draw a change of this person's own that their server already holds (a Keep in Ask
   * Slatebox, an import into this slate) as one step of their undo history: everything it
   * draws is recorded together once it has settled. Changes drawn one after another this
   * way, with no pause between them, are one step.
   */
  async ownStep(t) {
    this.undoRedo?.flushPending?.(), this._othersChange++;
    let e;
    try {
      e = await t();
    } finally {
      this._othersChange--, this.undoRedo?.snap?.();
    }
    return e;
  }
  /** True while {@link othersChange} draws someone else's change: nothing it sends is this person's step. */
  drawingOthersChange() {
    return this._othersChange > 0;
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
      const s = t.backgroundGradientColors.join(", ");
      e.style.backgroundImage = t.backgroundGradientType === "radial" ? `radial-gradient(circle, ${s})` : `linear-gradient(${s})`;
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
  /**
   * Suppress emitSlateChange while applying a remote package (v1 echo semantics).
   * Calls nest: a package that loads a whole document holds its own begin until
   * the load has finished, long after the caller that applied the package ended
   * its own. Emission resumes when every begin has ended.
   */
  beginRemoteApply() {
    this._applyingRemote++;
  }
  /** Re-enable emitSlateChange after a remote package has been applied. */
  endRemoteApply() {
    this._applyingRemote > 0 && this._applyingRemote--;
  }
  /** True while a document load is in flight (see holdUntilLoaded). */
  isLoading() {
    return this._loadsInFlight.size > 0;
  }
  /** A document load started: nothing from the room is applied until it has finished. */
  holdUntilLoaded(t) {
    const e = t.then(
      () => {
      },
      () => {
      }
    );
    return this._loadsInFlight.add(e), e.then(() => this._loadsInFlight.delete(e)), t;
  }
  /**
   * Resolves once every note is drawn and no document load is in flight, or
   * `null` when that is already so. A note is built a moment after it is added,
   * and a whole document takes longer: a package applied before then (a name for
   * a note not yet drawn, a second replacement of a slate still loading) is lost
   * or lands on the wrong notes. Collab waits on this between packages.
   */
  whenBuilt() {
    const t = [
      ...this._loadsInFlight,
      ...this.nodes?.building?.() ?? []
    ];
    if (t.length === 0) return null;
    let e;
    const s = new Promise((o) => {
      e = setTimeout(() => {
        t.forEach((r) => this._loadsInFlight.delete(r)), this.nodes?.stopWaitingFor?.(t), o();
      }, 5e3);
    }), i = Promise.allSettled(t).then(() => clearTimeout(e));
    return Promise.race([i, s]);
  }
  /** Tell a host's bar over the selection when the view pans or zooms. */
  setupFrameCallbacks() {
    this.options.panZoom || (this.options.panZoom = {});
    const t = this.options.panZoom, e = t.onPan, s = t.onZoom;
    t.onPan = (i) => {
      this.frameViewChanged(), e?.(i);
    }, t.onZoom = (i) => {
      this.frameViewChanged(), s?.(i);
    };
  }
  setupCoordinateCallbacks() {
    const t = this.options.panZoom?.onPan, e = this.options.panZoom?.onZoom;
    this.options.panZoom || (this.options.panZoom = {}), this.options.panZoom.onPan = (i) => {
      this.updateCoordinateDisplay(), t && t(i);
    }, this.options.panZoom.onZoom = (i) => {
      this.updateCoordinateDisplay(), e && e(i);
    };
    const s = this.options.panZoom.onPanEnd;
    this.options.panZoom.onPanEnd = (i) => {
      s && s(i);
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
      let e = { x: 0, y: 0 }, s = 1;
      if (this.panZoom && this.panZoom.isInitialized())
        e = this.getPan(), s = this.getZoom(), console.log(
          "COORD_DEBUG: Got values from panZoom - pan:",
          e,
          "zoom:",
          s
        );
      else {
        const o = this.canvas.viewbox();
        e = { x: o.x, y: o.y }, s = (this.element.getBoundingClientRect().width || o.width) / o.width || 1, console.log(
          "COORD_DEBUG: Got fallback values from viewBox - pan:",
          e,
          "zoom:",
          s
        );
      }
      const i = `x: ${Math.round(e.x)}, y: ${Math.round(
        e.y
      )}, zoom: ${s.toFixed(2)}`;
      t.textContent = i, Math.random() < 0.1 && console.log("COORD_DEBUG: Updated coordinates to:", i);
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
      this._destroyed || this.notifyNodeChanged(), e.announcedByCreator || this.announce(`Node added: ${e.options.text || "(unnamed)"}`);
    }, 100), this.broadcast("onNodeAdded", {
      id: e.id,
      nodeOptions: nt(e.options)
    }), e;
  }
  /** Remove a node by ID. */
  removeNode(t) {
    const e = this.nodes.one(t);
    if (e && !this.capabilitiesOf(e).canDelete) return !1;
    const s = e?.options?.text || "(unnamed)", i = !!e?.options?.isComment;
    if (e && this.selectedNodes.some((r) => r.id === t)) {
      try {
        e.resizeRotate?.disable();
      } catch {
      }
      this.selectedNodes = this.selectedNodes.filter((r) => r.id !== t), this.selectionChanged();
    }
    const o = this.nodes.remove(t);
    return this.notifyNodeChanged(), this.announce(`Node removed: ${s}`), o && this.broadcast("onNodeDeleted", { id: t, isComment: i }), o;
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
    this.panZoom.pan(t), this.frameViewChanged();
  }
  /**
   * Pan by a relative delta.
   * @param delta - { dx, dy } distance to pan
   */
  panBy(t) {
    this.panZoom.panBy(t), this.frameViewChanged();
  }
  /**
   * Set the zoom level.
   * @param level - Zoom factor (1 = 100%)
   */
  zoom(t) {
    this.panZoom.zoom(t), this.frameViewChanged(), this.announce(`Zoom: ${Math.round(t * 100)}%`), this.broadcast("onZoom", { zoomLevel: t });
  }
  /**
   * Zoom by a relative factor.
   * @param factor - Multiplier applied to current zoom
   */
  zoomBy(t) {
    this.panZoom.zoomBy(t), this.frameViewChanged();
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
  /**
   * Show a region of the world (a workshop's `bounds`, say) as large as its width
   * allows, up to `maxZoom`. Taller than the canvas, it starts at the top and the
   * rest is reached by panning: the fit for a board on a phone.
   *
   * @param region  world coordinates
   * @param padding room left at each side, in world units
   * @param maxZoom the largest scale to use (1 = 100%, the default)
   */
  fitToWidth(t, e = 16, s = 1) {
    this.panZoom.fitWidth(t, e, s);
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
  /**
   * Notify pan/zoom that the viewport was resized: the view box takes the element's size now,
   * keeping the zoom and the view's centre, as the ResizeObserver would on its next turn. A host
   * that changes the canvas's size itself (a panel beside or under it opening or closing) calls
   * this in the same task, so nothing reads or paints a view box shaped for the old size: with
   * preserveAspectRatio "slice", a taller element would otherwise crop the view's sides.
   */
  resizePanZoom() {
    this.panZoom.resize(), this._syncViewBoxToElement();
  }
  /**
   * Keep the viewBox 1:1 with the container pixel size across resizes so the
   * infinite canvas always fills its element and never distorts. Preserves
   * the current zoom level and the world-point at the viewBox center.
   */
  _setupResizeObserver() {
    typeof ResizeObserver > "u" || (this._resizeObserver = new ResizeObserver(() => this._syncViewBoxToElement()), this._resizeObserver.observe(this.element));
  }
  /**
   * Shape the view box to the element's pixel size, keeping the zoom and the world point at the
   * view's centre. Does nothing when the size is the one already taken. Shared by the
   * ResizeObserver and resizePanZoom, so a size taken by one is not taken again by the other.
   */
  _syncViewBoxToElement() {
    if (this._destroyed || !this.element?.getBoundingClientRect) return;
    const t = this.element.getBoundingClientRect(), e = Math.max(1, Math.round(t.width)), s = Math.max(1, Math.round(t.height));
    if (e === this._viewSizeW && s === this._viewSizeH) return;
    const i = this.canvas.viewbox();
    if (!i || ![i.x, i.y, i.width, i.height].every(Number.isFinite)) return;
    const o = i.width / (this._viewSizeW || e);
    this._viewSizeW = e, this._viewSizeH = s;
    const r = i.x + i.width / 2, a = i.y + i.height / 2, c = e * o, l = s * o;
    this.canvas.viewbox(r - c / 2, a - l / 2, c, l), this.options.viewPort = this.options.viewPort || {}, this.options.viewPort.originalWidth = e, this.options.viewPort.originalHeight = s, this.frameViewChanged();
  }
  /**
   * Bounding-box orientation of the current content (v1 contract):
   * `{orientation, width, height, left, top}` computed over all nodes with
   * 10px padding, falling back to the viewport dimensions when empty.
   */
  getOrientation() {
    const t = this.nodes?.allNodes ?? [], e = this.options.viewPort || {};
    let s = e.width ?? e.originalWidth ?? 800, i = e.height ?? e.originalHeight ?? 600, o = 0, r = 0, a = "landscape";
    if (t.length > 0) {
      let l = 1 / 0, h = 1 / 0, d = -1 / 0, u = -1 / 0;
      t.forEach((p) => {
        const m = p.options.x ?? 0, g = p.options.y ?? 0, y = p.options.width ?? 0, b = p.options.height ?? 0;
        l = Math.min(l, m - 10), h = Math.min(h, g - 10), d = Math.max(d, m + y + 10), u = Math.max(u, g + b + 10);
      });
      const f = this.boardChromes instanceof Set ? Array.from(this.boardChromes) : [];
      for (const p of f) {
        if (p.draft) continue;
        let m = null;
        try {
          m = p.plainBox();
        } catch {
          m = null;
        }
        !m || ![m.x, m.y, m.width, m.height].every(Number.isFinite) || (l = Math.min(l, m.x - 10), h = Math.min(h, m.y - 10), d = Math.max(d, m.x + m.width + 10), u = Math.max(u, m.y + m.height + 10));
      }
      o = Math.abs(l), r = Math.abs(h), s = d - l, i = u - h, i > s && (a = "portrait");
    }
    return { orientation: a, width: s, height: i, left: o, top: r };
  }
  // Selection Management
  setupSelectionHandling() {
    const t = (e) => {
      const s = e.target, i = document.activeElement;
      if (s && this.element?.contains(s) && i && i !== document.body && !this.element.contains(i)) i.blur?.();
      else if (s && i && i instanceof SVGElement && i !== this.canvas?.node && this.element?.contains(i)) {
        const o = s.closest?.("[data-node-id]");
        o && !o.contains(i) && i.blur?.();
      }
      e.pointerType === "touch" && e.isPrimary && s === this.canvas.node && this.selectedNodes.length === 1 && this.selectedNodes[0].beginNearbyTouchConnection(e) || (this._lastPointerDown = {
        x: e.clientX,
        y: e.clientY,
        onCanvas: !!s && (s === this.canvas.node || s.tagName?.toLowerCase() === "svg"),
        time: Date.now()
      });
    };
    window.addEventListener("pointerdown", t, !0), this._windowPointerDownHandler = t, this.canvas.on("click", (e) => {
      console.log(
        "SELECTION_DEBUG: Canvas click detected",
        e.target,
        "vs",
        this.canvas.node
      );
      const s = e.target === this.canvas.node || e.target && e.target.tagName === "svg";
      if (Date.now() - (this._rubberBandSelectedAt || 0) < 400) {
        this._rubberBandSelectedAt = 0;
        return;
      }
      const o = this._lastPointerDown, r = !!o && (!o.onCanvas || Math.hypot(
        (e.clientX ?? 0) - o.x,
        (e.clientY ?? 0) - o.y
      ) > 6);
      if (s && r) {
        console.log(
          "SELECTION_DEBUG: Drag-tail click (started on a handle/node or travelled) - not deselecting"
        );
        return;
      }
      s ? (console.log("SELECTION_DEBUG: Canvas clicked - deselecting all"), this.enteredGroupId = null, this.clearSelection(), this.clearLineCog(), this.options.events?.onCanvasClicked?.(e)) : console.log(
        "SELECTION_DEBUG: Click on non-canvas element, not deselecting"
      );
    }), this.canvas.on("dblclick", (e) => {
      if ((e.target === this.canvas.node || e.target && e.target.tagName === "svg") && !this.isReadOnly?.())
        try {
          const i = this.canvas.point(e.clientX, e.clientY), o = 120, r = 70, a = this.addNode({
            x: Math.round(i.x - o / 2),
            y: Math.round(i.y - r / 2),
            width: o,
            height: r,
            text: ""
          });
          this.selectNodes?.([a]);
        } catch {
        }
    });
  }
  /**
   * Select one or more nodes on the slate.
   *
   * This is the SINGLE ORCHESTRATOR for selection. It:
   * 1. Clears current selection unless addToSelection is true
   * 2. Adds the specified nodes to the selection set
   * 3. Calls updateSelectionResizeRotate() to enable handles on selected nodes
   * 4. Tells onSelectionChange listeners and the host's events.onSelectionFrame
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
    if (console.log(
      "SELECTION_DEBUG: Selecting nodes",
      t.map((i) => i.id),
      "addToSelection:",
      e
    ), this.clearLineCog(), t.some((i) => i?.isRemoved) && (t = t.filter((i) => !i.isRemoved), t.length === 0 && e))
      return;
    if (this._dragPolicies.length) {
      const i = this.screenSelection(t, e);
      t = i.nodes, e = i.addToSelection;
    }
    if (t.length === 1) {
      const i = this.getGroupIdOf(t[0]);
      if (this.enteredGroupId && i !== this.enteredGroupId && (this.enteredGroupId = null), i && i !== this.enteredGroupId) {
        const o = this.getGroupMembers(i);
        o.length > 1 && (t = o);
      }
    }
    e || this.clearSelection(), t.forEach((i) => {
      this.selectedNodes.includes(i) || (this.selectedNodes.push(i), i.onSelected());
    }), this.updateSelectionResizeRotate(), this.selectionChanged();
    const s = this.selectedNodes.length;
    s === 0 ? this.announce("No nodes selected") : s === 1 ? this.announce(`Node selected: ${this.selectedNodes[0].options.text || "(unnamed)"}`) : this.announce(`${s} nodes selected`), s > 1 && (this._hadGroupSelection = !0, this.options.events?.onGroupSelection?.(this.selectedNodes.slice()));
  }
  /**
   * Coalesce decoration-refresh storms (group rotate, collab bursts, paste +
   * rotate) into ONE overlay rebuild per animation frame. Idempotent and
   * cheap: the rebuild disables/re-enables handles for the whole selection,
   * so per-node calls must not each trigger a full pipeline pass.
   */
  queueSelectionDecorationRefresh() {
    if (this._decoRefreshQueued) return;
    this._decoRefreshQueued = !0;
    const t = () => {
      this._decoRefreshQueued = !1, this.updateSelectionResizeRotate();
    };
    typeof requestAnimationFrame < "u" ? requestAnimationFrame(t) : t();
  }
  updateSelectionResizeRotate() {
    if (console.log(
      "SELECTION_DEBUG: Updating resize/rotate for",
      this.selectedNodes.length,
      "selected nodes"
    ), this.nodes.allNodes.forEach((t) => {
      t.resizeRotate?.isEnabled?.() && (t.resizeRotate.disable(), console.log("SELECTION_DEBUG: Disabled resize/rotate on", t.id)), t.isConnectionHandlesEnabled?.() && (t.disableConnectionHandles(), console.log("SELECTION_DEBUG: Disabled connection handles on", t.id)), t.hideNodeCog?.();
    }), this.disableGroupResizeRotate(), this.selectedNodes.length === 0) {
      console.log(
        "SELECTION_DEBUG: No nodes selected - all resize/rotate disabled"
      );
      return;
    }
    if (this.selectedNodes.length === 1) {
      const t = this.selectedNodes[0];
      t.resizeRotate?.enable?.(), t.enableConnectionHandles?.(), t.showNodeCog?.(), console.log(
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
    ), t.resizeRotate?.isEnabled?.() && t.resizeRotate?.disable?.(), t.isConnectionHandlesEnabled() && t.disableConnectionHandles();
  }
  disableGroupResizeRotate() {
    console.log("SELECTION_DEBUG: Disabling group resize/rotate"), this.selectedNodes.forEach((t) => {
      t.disableResizeRotate();
    }), this.groupResizeRotate && (this.groupResizeRotate.remove(), this.groupResizeRotate = null);
  }
  createGroupResizeRotate() {
    console.log("SELECTION_DEBUG: Creating group resize/rotate controller"), this.groupResizeRotate && this.groupResizeRotate.remove();
    const t = this.calculateGroupBoundingBox();
    if (![t.x, t.y, t.width, t.height].every(
      Number.isFinite
    ) || t.width <= 0 || t.height <= 0)
      return;
    this.groupResizeRotate = this.canvas.group(), this.groupResizeRotate.rect(t.width, t.height).move(t.x, t.y).fill("transparent").stroke({ color: "#4a90e2", width: 2, dasharray: "5,5" }).attr("pointer-events", "none"), this.selectedNodes.some((s) => s.options.isLocked) || this.addGroupRotateHandle(t);
  }
  /**
   * Attach an interactive rotate knob to the group-selection outline. Dragging it
   * rotates every selected node about the group centre: each member's centre is
   * revolved around the group centre and the same delta is added to the member's
   * own rotationAngle, so the whole selection turns rigidly (Miro group rotate).
   *
   * Angle math is done in SCREEN space (invariant to the uniform viewBox zoom/pan),
   * then the delta is applied in world space to positions + per-node angles.
   */
  addGroupRotateHandle(t) {
    const e = this.groupResizeRotate;
    if (e)
      try {
        const s = t.x + t.width / 2, i = t.y + t.height / 2, o = e.group().addClass("slatebox-group-rotate");
        Oa(o);
        const r = o.node;
        r.setAttribute("aria-label", "Rotate selection"), r.style.touchAction = "none";
        const { x: a, y: c, width: l, height: h } = t, d = [
          [a, c],
          [s, c],
          [a + l, c],
          [a + l, i],
          [a + l, c + h],
          [s, c + h],
          [a, c + h],
          [a, i]
        ], u = () => {
          const A = e.node.getScreenCTM?.(), M = A ? Math.hypot(A.a, A.b) : 1;
          return M > 0 && Number.isFinite(M) ? M : 1;
        }, f = () => Da(o, d, u());
        o.__relayout = f, r.__relayout = f, f();
        const p = new La();
        let m = !1, g = 0, y = { x: 0, y: 0 }, b = [];
        const x = () => {
          const A = e.node.getScreenCTM();
          return A ? { x: A.a * s + A.c * i + A.e, y: A.b * s + A.d * i + A.f } : { x: 0, y: 0 };
        }, C = (A) => {
          const M = A * Math.PI / 180, N = Math.cos(M), R = Math.sin(M);
          b.forEach((P) => {
            const E = P.cx - s, k = P.cy - i, O = s + E * N - k * R, L = i + E * R + k * N, z = P.node.options.width || 0, W = P.node.options.height || 0, X = P.node.options.rotate = P.node.options.rotate || {};
            X.rotationAngle = A ? Me(P.angle + A) : P.angle, P.node.position(O - z / 2, L - W / 2);
          });
        };
        let v = 0;
        const w = (A) => {
          if (!m) return;
          this.frameGestureStart("group-rotate");
          const M = Math.atan2(A.clientY - y.y, A.clientX - y.x), N = A.pointerType === "touch";
          v = Ki((M - g) * 180 / Math.PI, { shift: A.shiftKey, coarse: N }), C(v);
          const R = yi(A);
          R && p.show(v, R.x, R.y, N);
        }, _ = () => {
          m = !1, p.hide(), document.documentElement.style.cursor = "", r.removeAttribute("data-state"), r.__paintKnob?.(), window.removeEventListener("pointermove", w), window.removeEventListener("pointerup", S), window.removeEventListener("pointercancel", S), window.removeEventListener("keydown", T, !0);
        }, S = () => {
          m && (_(), this.broadcast("onNodesMove", {
            nodeOptions: this.selectedNodes.map((A) => nt(A.options))
          }), this.announce(`Rotated the selection by ${Math.round(v)} degrees`), this.updateSelectionResizeRotate(), this.frameGestureEnd("group-rotate"));
        }, T = (A) => {
          A.key !== "Escape" || !m || (A.preventDefault(), A.stopImmediatePropagation(), _(), C(0), this.announce("Rotate cancelled"), this.updateSelectionResizeRotate(), this.frameGestureEnd("group-rotate"));
        };
        o.on("pointerdown", (A) => {
          A.preventDefault?.(), A.stopPropagation?.(), m = !0, v = 0, y = x(), g = Math.atan2(A.clientY - y.y, A.clientX - y.x), b = this.selectedNodes.map((M) => ({
            node: M,
            cx: (M.options.x || 0) + (M.options.width || 0) / 2,
            cy: (M.options.y || 0) + (M.options.height || 0) / 2,
            angle: M.options.rotate?.rotationAngle || 0
          })), r.setAttribute("data-state", "active"), r.__paintKnob?.(), f(), document.documentElement.style.cursor = Vi, window.addEventListener("pointermove", w), window.addEventListener("pointerup", S), window.addEventListener("pointercancel", S), window.addEventListener("keydown", T, !0);
        });
      } catch {
      }
  }
  calculateGroupBoundingBox() {
    if (this.selectedNodes.length === 0)
      return { x: 0, y: 0, width: 100, height: 100 };
    let t = 1 / 0, e = 1 / 0, s = -1 / 0, i = -1 / 0;
    return this.selectedNodes.forEach((o) => {
      const r = this.rotatedBounds(o);
      t = Math.min(t, r.minX), e = Math.min(e, r.minY), s = Math.max(s, r.maxX), i = Math.max(i, r.maxY);
    }), {
      x: t,
      y: e,
      width: s - t,
      height: i - e
    };
  }
  createGroupHandle(t, e, s, i) {
    t.circle(8).fill("#4a90e2").stroke("#ffffff").attr("stroke-width", 2);
  }
  updateGroupHandle(t, e, s, i) {
    t.center(e[0], e[1]);
  }
  handleGroupResize(t) {
    console.log("SELECTION_DEBUG: Group resize event", t);
    const { box: e } = t.detail, s = this.calculateGroupBoundingBox(), i = e.width / s.width, o = e.height / s.height;
    this.selectedNodes.forEach((r) => {
      const a = r.svgGroup.bbox(), c = (a.x - s.x) * i, l = (a.y - s.y) * o, h = a.width * i, d = a.height * o;
      r.setSize(h, d), r.position(e.x + c, e.y + l);
    });
  }
  handleGroupRotate(t) {
    console.log("SELECTION_DEBUG: Group rotate event", t);
    const { angle: e } = t.detail, s = this.calculateGroupBoundingBox();
    s.x + s.width / 2, s.y + s.height / 2, this.selectedNodes.forEach((i) => {
      const o = i.getRotation();
      i.setRotation(o + e);
    });
  }
  /** Select a single node (convenience wrapper for selectNodes). */
  selectNode(t) {
    this.selectNodes([t], !1);
  }
  /**
   * Hear about changes to the selection. The listener is called with the notes now
   * selected, once per turn of the event loop in which the selection changed (a
   * click that replaces one selection with another is one call, not two). Returns a
   * function that stops listening.
   */
  onSelectionChange(t) {
    return this._selectionListeners.push(t), () => {
      this._selectionListeners = this._selectionListeners.filter((e) => e !== t);
    };
  }
  /** The selection changed; tell the listeners once the change has settled. */
  selectionChanged() {
    this.scheduleSelectionFrame(), !(this._selectionNoticeQueued || this._selectionListeners.length === 0) && (this._selectionNoticeQueued = !0, queueMicrotask(() => {
      if (this._selectionNoticeQueued = !1, this._destroyed) return;
      const t = this.selectedNodes.slice();
      for (const e of this._selectionListeners.slice())
        try {
          e(t);
        } catch (s) {
          console.warn("SELECTION: a selection listener threw", s);
        }
    }));
  }
  // ─── Selection frame (for a host's own context toolbar) ─────────────
  /**
   * Delete the selected notes, as the Delete key does: not for a viewer, not a
   * note the host governs, and a comment only where comments may be removed.
   */
  deleteSelection() {
    const t = this.getSelectedNodes().slice();
    if (!(!t.length || this.isReadOnly() || this.isCommentOnly())) {
      for (const e of t)
        this.capabilitiesOf(e).canDelete !== !1 && (e.options?.isComment && !this.canRemoveComments() || this.removeNode(e.id));
      this.clearSelection();
    }
  }
  /** Duplicate the selected notes, as the right-click menu does, and select the copies. */
  duplicateSelection() {
    const t = this.getSelectedNodes().filter((e) => this.capabilitiesOf(e).canDuplicate !== !1);
    !t.length || this.isReadOnly() || this.isCommentOnly() || this.contextMenu?.duplicate?.(t);
  }
  /** True when the host draws the context toolbar and the engine draws no pill. */
  hostDrawsToolbar() {
    return this.options.contextToolbar === "host";
  }
  /**
   * What is selected and where it is on screen now (see `onSelectionFrame`).
   * `moving` is true while a drag, resize, rotate, pan or zoom is under way.
   */
  getSelectionFrame() {
    const t = this._frameGestures.size > 0 || this._frameViewTimer !== null, e = this.selectedNodes.filter((i) => !i.isRemoved);
    if (e.length) {
      const i = this.screenRectOfNodes(e);
      return {
        kind: e.length === 1 ? "node" : "nodes",
        ids: e.map((o) => o.id),
        rect: i,
        topClearance: i ? this.measureTopClearance(e, i) : 0,
        moving: t
      };
    }
    const s = this._selectedLine;
    if (s) {
      let i = null;
      try {
        const o = s.connectable?.connector?.node;
        o?.isConnected && (i = Nm(o.getBoundingClientRect()));
      } catch {
        i = null;
      }
      if (i)
        return {
          kind: "line",
          avoid: [s.node, this.getNode?.(s.childId)].filter(Boolean).map((a) => this.screenRectOfNodes([a])).filter((a) => !!a),
          ids: [s.associationId],
          rect: i,
          // The endpoint handles stand a little proud of the line.
          topClearance: 10,
          moving: t,
          line: { nodeId: s.node.id, associationId: s.associationId, childId: s.childId }
        };
    }
    return { kind: "none", ids: [], rect: null, topClearance: 0, moving: !1 };
  }
  /** The line selected on the canvas, with its association, or null. */
  getSelectedLine() {
    const t = this._selectedLine;
    if (!t) return null;
    const e = t.node.relationships, s = e?.associations?.find((i) => i.id === t.associationId) ?? e?.getAssociation?.(t.childId) ?? null;
    return !s || t.node.isRemoved ? null : { node: t.node, association: s };
  }
  /**
   * Remove the selected line, the same way the engine's own pill does (the change
   * is broadcast, saved and undoable like any removed connection). False when no
   * line is selected or the line may not be removed.
   */
  removeSelectedLine() {
    const t = this._selectedLine;
    if (!t || this.isReadOnly()) return !1;
    const s = t.node.relationships?.removeAssociation?.(t.associationId);
    return this.clearLineCog(), s !== !1;
  }
  /**
   * Select a line, as clicking it does: its end handles show (each marking
   * whether it follows its note, is pinned or is free) and the host hears of it
   * through onSelectionFrame. False when the note holds no such line.
   */
  selectLine(t, e) {
    return !!this.nodes.one(t)?.connector?.selectConnection?.(e);
  }
  /**
   * Where an end of a line is on its note now, as a normalized anchor {x, y}
   * (pinning it there keeps it exactly where it is), or null for a free end.
   */
  lineEndAnchor(t, e, s) {
    return this.nodes.one(t)?.connector?.currentAnchor?.(e, s) ?? null;
  }
  /** Whether an end of a line follows its note, is pinned to a spot on its edge, or is free. */
  lineEndState(t, e, s) {
    return this.nodes.one(t)?.connector?.endState?.(e, s) ?? null;
  }
  /**
   * Pin an end of a line where it is now ("pinned"), at a spot on its note's
   * edge ({x, y}), or let it follow its note ("follow"). Saved, shared and
   * undoable. False for a free end, or when the slate cannot be edited.
   */
  setLineEnd(t, e, s, i) {
    return this.isReadOnly() || this.isCommentOnly() ? !1 : !!this.nodes.one(t)?.connector?.setEnd?.(e, s, i);
  }
  /**
   * The line tool: a line follows the pointer from the note; a click or tap on
   * another note connects to it, on empty canvas leaves its end free there;
   * Escape cancels. Resolves with what happened (see LineTool.ts).
   */
  startLineFrom(t) {
    const e = typeof t == "string" ? this.nodes.one(t) : t;
    return Qf().startLineTool(this, e);
  }
  /** Stop the line tool, if it is drawing. */
  cancelLineTool() {
    this._lineTool?.cancel();
  }
  /** True while the line tool is drawing a line. */
  isDrawingLine() {
    return !!this._lineTool;
  }
  /** Called by the connector when a line is selected on the canvas. */
  setSelectedLine(t, e, s, i) {
    this.selectedNodes.length && this.clearSelection(), this._selectedLine = { node: t, associationId: e, childId: s, connectable: i }, this.scheduleSelectionFrame();
  }
  /** A gesture of the selection started (drag, resize, rotate, pan). See onSelectionFrame. */
  frameGestureStart(t) {
    this._frameGestures.has(t) || (this._frameGestures.add(t), this._frameSettleTimer && (clearTimeout(this._frameSettleTimer), this._frameSettleTimer = null), this.sendMovingFrame());
  }
  /** That gesture ended: once nothing else is moving, the frame is sent again, still. */
  frameGestureEnd(t) {
    this._frameGestures.delete(t) && this.settleFrameSoon();
  }
  /**
   * The view changed (a pan or zoom step, or the canvas was resized). Each step
   * restarts a short wait; the frame is still again once the steps stop.
   */
  frameViewChanged() {
    this._destroyed || (Wu(this.element), this._frameViewTimer && clearTimeout(this._frameViewTimer), this._frameViewTimer = setTimeout(() => {
      this._frameViewTimer = null, this.settleFrameSoon();
    }, 180), this.sendMovingFrame());
  }
  /** A note's place or size changed outside a gesture: the frame may have moved. */
  nodeGeometryChanged(t) {
    if (this._frameGestures.size || this._frameViewTimer) return;
    const e = this._selectedLine;
    (this.selectedNodes.includes(t) || e && (e.node === t || e.childId === t.id)) && this.scheduleSelectionFrame();
  }
  sendMovingFrame() {
    if (this._frameMovingSent || this._destroyed) return;
    const t = this.getSelectionFrame();
    t.kind !== "none" && (this._frameMovingSent = !0, this.emitSelectionFrame({ ...t, moving: !0 }));
  }
  settleFrameSoon() {
    this._frameSettleTimer && clearTimeout(this._frameSettleTimer), this._frameSettleTimer = setTimeout(() => {
      this._frameSettleTimer = null, !(this._destroyed || this._frameGestures.size || this._frameViewTimer) && (this._frameMovingSent && (this._frameLastKey = ""), this._frameMovingSent = !1, this.emitSelectionFrame(this.getSelectionFrame()));
    }, 60);
  }
  /** Send the frame once the current change has settled (coalesced, and only when it changed). */
  scheduleSelectionFrame() {
    this._frameQueued || this._destroyed || (this._frameQueued = !0, queueMicrotask(() => {
      this._frameQueued = !1, !this._destroyed && (this._frameGestures.size || this._frameViewTimer || this._frameSettleTimer || (this.emitSelectionFrame(this.getSelectionFrame()), typeof requestAnimationFrame < "u" && this._frameRecheck === null && (this._frameRecheck = requestAnimationFrame(() => {
        this._frameRecheck = null, !(this._destroyed || this._frameGestures.size || this._frameViewTimer) && this.emitSelectionFrame(this.getSelectionFrame());
      }))));
    }));
  }
  emitSelectionFrame(t) {
    const e = t.rect, s = [
      t.kind,
      t.ids.join(","),
      t.moving,
      e ? [e.left, e.top, e.width, e.height].map((i) => Math.round(i)).join(",") : "-",
      Math.round(t.topClearance)
    ].join("|");
    if (s !== this._frameLastKey) {
      this._frameLastKey = s;
      try {
        this.options.events?.onSelectionFrame?.(t);
      } catch (i) {
        console.warn("SELECTION: onSelectionFrame threw", i);
      }
    }
  }
  /** The notes' (rotated) boxes, together, on screen. */
  screenRectOfNodes(t) {
    let e = 1 / 0, s = 1 / 0, i = -1 / 0, o = -1 / 0;
    for (const r of t) {
      const a = this.rotatedBounds(r);
      for (const [c, l] of [
        [a.minX, a.minY],
        [a.maxX, a.minY],
        [a.maxX, a.maxY],
        [a.minX, a.maxY]
      ]) {
        const h = this.worldToClient({ x: c, y: l });
        e = Math.min(e, h.x), s = Math.min(s, h.y), i = Math.max(i, h.x), o = Math.max(o, h.y);
      }
    }
    return [e, s, i, o].every(Number.isFinite) ? { left: e, top: s, right: i, bottom: o, width: i - e, height: o - s } : null;
  }
  /**
   * Room above the frame taken by the engine's handles: the top connect dot and
   * the rotate handle of one note, or the group's rotate knob. Read from what is
   * drawn when it is there, otherwise from the handles' known offsets.
   */
  measureTopClearance(t, e) {
    const s = this.getZoom?.() || 1;
    let i = 1 / 0;
    const o = (r) => {
      if (!r || !r.isConnected) return;
      const a = r.getBoundingClientRect();
      a.width > 0 && a.height > 0 && (a.right < e.left - cr || a.left > e.right + cr || a.top < e.top - 120 * Math.max(1, s) || a.top > e.bottom || (i = Math.min(i, a.top)));
    };
    if (t.length === 1) {
      const r = t[0];
      o(r.connectionHandles?.top?.node), this.element?.querySelectorAll?.(".svg_select_handle_rot").forEach((a) => o(a));
    } else if (this.groupResizeRotate)
      try {
        this.groupResizeRotate.node.querySelectorAll("circle").forEach((r) => o(r));
      } catch {
      }
    return Number.isFinite(i) && i < e.top ? Math.ceil(e.top - i) : t.length === 1 ? Math.ceil(35 * s + 9) : bs + Zi / 2 + 4;
  }
  /** Deselect a single node. */
  deselectNode(t) {
    this.selectedNodes.includes(t) && (console.log("SELECTION_DEBUG: Deselecting node", t.id), this.selectedNodes = this.selectedNodes.filter((e) => e !== t), t.onDeselected(), this.putAwaySelectionUi(t), this.selectionChanged(), this.selectedNodes.length === 0 ? this.disableGroupResizeRotate() : this.updateSelectionResizeRotate());
  }
  /**
   * A note's outline, handles, plugs and cog live outside the note, in an overlay
   * the selection pass reaches only through the notes still on the slate. A note
   * leaving the selection (deselected, removed, or replaced by an undo) puts them
   * away itself, or they stay round empty canvas.
   */
  putAwaySelectionUi(t) {
    try {
      t.resizeRotate?.isEnabled?.() && t.resizeRotate.disable(), t.isConnectionHandlesEnabled?.() && t.disableConnectionHandles(), t.hideNodeCog?.();
    } catch {
    }
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
    this._selectedLine && (this._selectedLine = null, this.scheduleSelectionFrame());
  }
  clearSelection() {
    console.log("SELECTION_DEBUG: Clearing selection"), this.selectedNodes.forEach((t) => {
      t.onDeselected();
    }), this.selectedNodes.length && this.selectionChanged(), this.selectedNodes = [], this.updateSelectionResizeRotate(), this._hadGroupSelection && (this._hadGroupSelection = !1, this.options.events?.onGroupSelection?.([]));
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
  /**
   * Axis-aligned bounding box of a node in WORLD coords, accounting for its
   * rotation (the four corners rotated about the node's center). Un-rotated → the
   * option box; rotated → the tight box enclosing the visually-rotated shape. This
   * is what alignment, distribution and the group-selection outline must use so
   * rotated nodes line up by what you SEE, not by their un-rotated option box.
   */
  rotatedBounds(t) {
    const e = t.options, s = e.x || 0, i = e.y || 0, o = e.width || 0, r = e.height || 0, a = e.rotate?.rotationAngle || 0;
    if (!a) return { minX: s, minY: i, maxX: s + o, maxY: i + r };
    const c = s + o / 2, l = i + r / 2, h = a * Math.PI / 180, d = Math.cos(h), u = Math.sin(h);
    let f = 1 / 0, p = 1 / 0, m = -1 / 0, g = -1 / 0;
    const y = [
      [s, i],
      [s + o, i],
      [s + o, i + r],
      [s, i + r]
    ];
    for (const [b, x] of y) {
      const C = b - c, v = x - l, w = c + C * d - v * u, _ = l + C * u + v * d;
      f = Math.min(f, w), p = Math.min(p, _), m = Math.max(m, w), g = Math.max(g, _);
    }
    return { minX: f, minY: p, maxX: m, maxY: g };
  }
  alignNodes(t, e) {
    const s = this.freeNodes(e || this.getSelectedNodes());
    !s || s.length < 2 || ["left", "right", "centerH", "top", "bottom", "middle"].includes(t) && this.moveToPositions(s, Mc(t, s.map((i) => this.layoutBoxOf(i))));
  }
  /**
   * Evenly distribute the selected (or given) nodes along an axis so the gaps
   * between them are equal; the outermost two stay put. axis: horizontal |
   * vertical. Broadcasts onNodesMove. No-op for < 3 nodes.
   */
  distributeNodes(t, e) {
    const s = this.freeNodes(e || this.getSelectedNodes());
    !s || s.length < 3 || t !== "horizontal" && t !== "vertical" || this.moveToPositions(s, kc(t, s.map((i) => this.layoutBoxOf(i))));
  }
  layoutBoxOf(t) {
    const e = t.options;
    return { id: t.id, x: e.x || 0, y: e.y || 0, width: e.width || 0, height: e.height || 0, rotationAngle: e.rotate?.rotationAngle || 0 };
  }
  moveToPositions(t, e) {
    e.forEach((s, i) => t[i].position(s.x, s.y)), this.broadcast("onNodesMove", {
      nodeOptions: t.map((s) => nt(s.options))
    }), this.updateSelectionResizeRotate();
  }
  // ─── Grouping (Miro-style) ──────────────────────────────────────────
  //
  // A group is simply a set of nodes sharing a `groupId`. There is NO reparenting:
  // nodes stay in the canvas, so connectors/serialization are untouched. Group
  // behaviour is layered on the existing multi-selection machinery — selecting a
  // member selects all members, and drag/rotate/lock then act on the whole set.
  /** All nodes belonging to the given groupId (empty if none/falsy). */
  getGroupMembers(t) {
    return t ? this.nodes.allNodes.filter(
      (e) => e.options.groupId === t
    ) : [];
  }
  /** The groupId of a node, or null if it isn't grouped. */
  getGroupIdOf(t) {
    return t?.options?.groupId || null;
  }
  /** True if the node is a member of any group. */
  isGrouped(t) {
    return !!this.getGroupIdOf(t);
  }
  /** The groupId currently entered for member editing, or null. */
  getEnteredGroupId() {
    return this.enteredGroupId;
  }
  /**
   * Expand a node list to include every group-mate of any grouped node in it
   * (deduped, order-stable). Used so lock/rotate/etc. apply to whole groups.
   */
  expandToGroups(t) {
    const e = /* @__PURE__ */ new Map();
    return t.forEach((s) => {
      e.set(s.id, s);
      const i = this.getGroupIdOf(s);
      i && this.getGroupMembers(i).forEach((o) => e.set(o.id, o));
    }), [...e.values()];
  }
  /**
   * Group the selected (or given) nodes into ONE group so they select/move/rotate/
   * lock as a unit. Assigns a fresh groupId to every member (flattening any prior
   * groups in the selection into the new one, Miro-style). Persists via onNodesMove
   * and re-selects the whole new group. No-op for < 2 nodes.
   * @returns the new groupId, or null if nothing was grouped.
   */
  groupNodes(t) {
    const e = this.freeNodes(t || this.getSelectedNodes()).slice();
    if (e.length < 2) return null;
    const s = "grp-" + ie(8);
    return e.forEach((i) => {
      i.options.groupId = s;
    }), this.enteredGroupId = null, this.broadcast("onNodesMove", {
      nodeOptions: e.map((i) => nt(i.options))
    }), this.selectNodes(e), s;
  }
  /**
   * Ungroup: dissolve every group represented in the selected (or given) nodes by
   * clearing each member's groupId. Persists and keeps the nodes multi-selected.
   */
  ungroupNodes(t) {
    const e = this.freeNodes(t || this.getSelectedNodes()), s = /* @__PURE__ */ new Set();
    if (e.forEach((o) => {
      const r = this.getGroupIdOf(o);
      r && s.add(r);
    }), !s.size) return;
    const i = [];
    s.forEach((o) => {
      this.getGroupMembers(o).forEach((r) => {
        r.options.groupId = void 0, i.push(r);
      });
    }), this.enteredGroupId = null, this.broadcast("onNodesMove", {
      // Use an explicit null tombstone in the collaboration package. JSON/Yjs
      // transports may omit `undefined`, which would leave peers in the old
      // group forever instead of clearing it.
      nodeOptions: i.map((o) => ({
        ...nt(o.options),
        groupId: null
      }))
    }), this.selectNodes(i);
  }
  /**
   * Lock the selected (or given) nodes — and, for any grouped node, its whole
   * group — disabling drag/resize. Persists via onNodesMove.
   */
  lockNodes(t) {
    const e = this.freeNodes(this.expandToGroups(t || this.getSelectedNodes()));
    e.length && (e.forEach((s) => s.lock()), this.broadcast("onNodesMove", {
      nodeOptions: e.map((s) => nt(s.options))
    }), this.updateSelectionResizeRotate());
  }
  /** Unlock the selected (or given) nodes and their groups. */
  unlockNodes(t) {
    const e = this.freeNodes(this.expandToGroups(t || this.getSelectedNodes()));
    e.length && (e.forEach((s) => s.unlock()), this.broadcast("onNodesMove", {
      nodeOptions: e.map((s) => nt(s.options))
    }), this.updateSelectionResizeRotate());
  }
  /** True if every given (or selected) node is locked. */
  isSelectionLocked(t) {
    const e = t || this.getSelectedNodes();
    return e.length > 0 && e.every((s) => !!s.options.isLocked);
  }
  /**
   * Enter a group for individual-member editing (Miro double-click-into-group).
   * Selects `member` if given, else the first member. While entered, clicking a
   * member selects just that member instead of the whole group.
   */
  enterGroup(t, e) {
    const s = this.getGroupMembers(t);
    s.length && (this.enteredGroupId = t, this.selectNodes([e && s.includes(e) ? e : s[0]]));
  }
  /** Exit the currently-entered group and re-select it as a whole. */
  exitGroup() {
    const t = this.enteredGroupId;
    if (this.enteredGroupId = null, !t) return;
    const e = this.getGroupMembers(t);
    e.length && this.selectNodes(e);
  }
  // ─── Governed notes (host drag policies) ─────────────────────────────
  /**
   * Register a host policy for some notes (see {@link DragPolicy}). The policy says
   * which notes it governs and what a person may do to each; it is asked before a
   * governed note is dragged, while it moves, and when it is released.
   *
   * @returns a function that removes the policy and returns its notes to ordinary behaviour.
   */
  setDragPolicy(t) {
    if (!t || typeof t.governs != "function" || typeof t.onEnd != "function")
      throw new Error("A drag policy needs governs() and onEnd().");
    this._dragPolicies.includes(t) || this._dragPolicies.push(t), this.refreshGovernance();
    let e = !1;
    return () => {
      e || (e = !0, this._governedDragNode && this.governanceOf(this._governedDragNode)?.policy === t && this.cancelGovernedDrag("host"), this._dragPolicies = this._dragPolicies.filter((s) => s !== t), this.refreshGovernance());
    };
  }
  /** The policy governing `node` and the note's capabilities, or null for an ordinary note. */
  governanceOf(t) {
    return !t || this._dragPolicies.length === 0 ? null : Dp(this._dragPolicies, t);
  }
  /**
   * What may be done to `node` right now. Ordinary notes can do everything; so can
   * governed notes while their host is changing them (withPolicyAuthority).
   */
  capabilitiesOf(t) {
    return this._dragPolicies.length === 0 || this._policyAuthority > 0 ? Ko : this.governanceOf(t)?.capabilities ?? Ko;
  }
  /** True for a governed note that is a drawing of host state (left out of saves and undo). */
  isDerivedNode(t) {
    const e = this.governanceOf(t);
    return !!e && !e.capabilities.persist;
  }
  /** The notes among `nodes` (default: all) that no policy governs. */
  freeNodes(t) {
    const e = t ?? this.nodes.allNodes;
    return this._dragPolicies.length === 0 ? e : e.filter((s) => !this.governanceOf(s));
  }
  /**
   * Run `fn` as the host that owns the governed notes: capability checks pass
   * (the host may remove or connect its own notes) and nothing is broadcast.
   */
  withPolicyAuthority(t) {
    this._policyAuthority++;
    try {
      return t();
    } finally {
      this._policyAuthority--;
    }
  }
  /** End a governed drag in progress as a refusal. Returns whether there was one. */
  cancelGovernedDrag(t = "host") {
    const e = this._governedDragNode;
    return !e || typeof e.cancelGovernedDrag != "function" ? !1 : e.cancelGovernedDrag(t);
  }
  /**
   * Re-apply what governance shows on each note (cursor, focusability, pointer
   * input). Call it after a policy starts or stops claiming notes.
   */
  refreshGovernance() {
    this.nodes?.allNodes.forEach((e) => e.applyGovernance?.());
    const t = this.selectedNodes.filter((e) => this.capabilitiesOf(e).canSelect);
    t.length !== this.selectedNodes.length && this.selectionChanged(), this.selectedNodes = t, this.selectedNodes.length && this.updateSelectionResizeRotate();
  }
  /**
   * Take the inline edit in progress, if any, before a load replaces every note
   * (loadJSON, or an undo or redo, this person's or someone else's): the load
   * destroys the note being edited and its editor with it. Give the result to
   * {@link resumeInlineDraft} once the load has finished.
   */
  takeInlineDraft() {
    for (const t of this.nodes?.allNodes ?? []) {
      const e = t.editor?.draft?.();
      if (e) return { id: t.id, draft: e };
    }
    return null;
  }
  /**
   * Open the edit taken by {@link takeInlineDraft} again on the note's new copy,
   * with the text typed so far and the caret where it was, so the person goes on
   * typing as if nothing had happened. Nothing is opened when the note is gone,
   * or when an edit is already open elsewhere.
   */
  resumeInlineDraft(t) {
    if (!t || this._destroyed) return !1;
    const e = this.nodes?.one?.(t.id);
    if (!e?.editor || e.editor.isInlineEditing?.() || this.nodes.allNodes.some((r) => r.editor?.isInlineEditing?.())) return !1;
    const { text: s, selection: i, returnFocus: o } = t.draft;
    return e.editor.startInline({ text: s, selection: i ?? { start: s.length, end: s.length }, returnFocus: o, preventScroll: !0 }) === !0;
  }
  /**
   * Show the policies an ordinary note on the move (see DragPolicy.onFreeMove). Only a
   * single ordinary note is offered; a group drag and a governed note are not.
   */
  offerFreeMove(t, e) {
    if (!(!this._dragPolicies.length || this.governanceOf(t)))
      for (const s of this._dragPolicies.slice())
        try {
          s.onFreeMove?.(t, e);
        } catch (i) {
          console.warn("DRAG_POLICY: onFreeMove threw", i);
        }
  }
  /**
   * Offer a dropped ordinary note to the policies (see DragPolicy.onFreeDrop). The first
   * that takes or refuses it decides; with none, the drop is an ordinary move.
   */
  offerFreeDrop(t, e, s) {
    if (!this._dragPolicies.length || this.governanceOf(t)) return null;
    for (const i of this._dragPolicies.slice()) {
      let o;
      try {
        o = i.onFreeDrop?.(t, e, s);
      } catch (r) {
        console.warn("DRAG_POLICY: onFreeDrop threw; the drop stays an ordinary move", r);
      }
      if (o === "taken" || o === "refused") return o;
    }
    return null;
  }
  /**
   * Offer several ordinary notes dropped together to the policies (see
   * DragPolicy.onFreeGroupDrop). The first that takes or refuses them decides; with none,
   * the drop is an ordinary move.
   */
  offerFreeGroupDrop(t, e, s) {
    if (!this._dragPolicies.length || t.some((i) => this.governanceOf(i))) return null;
    for (const i of this._dragPolicies.slice()) {
      let o;
      try {
        o = i.onFreeGroupDrop?.(t, e, s);
      } catch (r) {
        console.warn("DRAG_POLICY: onFreeGroupDrop threw; the drop stays an ordinary move", r);
      }
      if (o === "taken" || o === "refused") return o;
    }
    return null;
  }
  /** Tell the policies an ordinary note's words were committed (see DragPolicy.onFreeTextCommit). */
  offerFreeTextCommit(t) {
    if (!(!this._dragPolicies.length || this.governanceOf(t)))
      for (const e of this._dragPolicies.slice())
        try {
          e.onFreeTextCommit?.(t);
        } catch (s) {
          console.warn("DRAG_POLICY: onFreeTextCommit threw", s);
        }
  }
  /** What each policy keeps with an undo record (see DragPolicy.undoState). Null when none keeps anything. */
  undoHostState() {
    const t = /* @__PURE__ */ new Map();
    for (const e of this._dragPolicies)
      if (typeof e.undoState == "function")
        try {
          t.set(e, e.undoState());
        } catch (s) {
          console.warn("DRAG_POLICY: undoState threw", s);
        }
    return t.size ? t : null;
  }
  /** This person's undo or redo went back to a record: hand each policy what it kept with it. */
  restoreUndoHostState(t, e) {
    const s = t instanceof Map ? t : null;
    for (const i of this._dragPolicies.slice())
      if (typeof i.onUndoRestore == "function")
        try {
          i.onUndoRestore(s?.get(i), e);
        } catch (o) {
          console.warn("DRAG_POLICY: onUndoRestore threw", o);
        }
  }
  /**
   * A host is about to change its own state and the drawing together as one step (a
   * note becoming one of its governed notes, or the other way round). Records any edit
   * still waiting to be recorded as its own step, and brings what the host keeps with
   * the current record up to date, so an undo goes back to exactly this moment.
   */
  beginHostStep() {
    this.undoRedo?.flushPending?.(), this.undoRedo?.refreshHostState?.();
  }
  /** Record the step begun with {@link beginHostStep} once its changes are made. */
  endHostStep() {
    this.undoRedo?.snapAfterGesture?.();
  }
  /** Tell each policy that loadJSON / undo / redo replaced the slate's notes. */
  notifyNotesReplaced() {
    if (this._dragPolicies.length === 0) {
      this.dropReplacedFromSelection();
      return;
    }
    const t = this.selectedNodes.filter(
      (e) => this.nodes.one(e.id) !== e && !!this.governanceOf(e)
    );
    for (const e of this._dragPolicies.slice())
      try {
        e.onNotesReplaced?.();
      } catch (s) {
        console.warn("DRAG_POLICY: onNotesReplaced threw", s);
      }
    if (t.length && this.selectedNodes.some((e) => t.includes(e))) {
      this.selectedNodes = this.selectedNodes.filter((e) => !t.includes(e)), this.selectionChanged();
      for (const e of t) {
        try {
          e.onDeselected();
        } catch {
        }
        this.putAwaySelectionUi(e);
      }
      try {
        this.updateSelectionResizeRotate();
      } catch {
      }
    }
    this.dropReplacedFromSelection();
  }
  /**
   * loadJSON, undo and redo replace every note by a new one, even where the id
   * stays the same. A selection kept across that holds notes that are no longer
   * on the slate: nothing shows as selected, yet Delete still acts on them, and
   * the next selection change tries to draw connectors for a note that is gone
   * ("Cannot read properties of null (reading 'screenCTM')"). Notes that were
   * replaced leave the selection.
   */
  dropReplacedFromSelection() {
    const t = this.selectedNodes.filter((e) => this.nodes.one(e.id) === e);
    if (t.length !== this.selectedNodes.length) {
      for (const e of this.selectedNodes) t.includes(e) || this.putAwaySelectionUi(e);
      this.selectedNodes = t, this.selectionChanged();
      try {
        this.updateSelectionResizeRotate();
      } catch {
      }
      this._hadGroupSelection && t.length < 2 && (this._hadGroupSelection = !1, this.options.events?.onGroupSelection?.([]));
    }
  }
  /**
   * Remove governed notes from a change package, or return null when nothing is
   * left of it. Used for packages leaving this slate (broadcast) and arriving from
   * collaborators, so a governed note is changed only by its host.
   */
  screenGovernedPackage(t, e) {
    if (!e) return;
    if (this._dragPolicies.length === 0) return e;
    const s = (o) => typeof o == "string" && !!this.governanceOf(this.nodes.one(o));
    if (Array.isArray(e)) {
      const o = e.filter((r) => !s(r?.id));
      return o.length ? o.length === e.length ? e : o : null;
    }
    if (t === "addRelationship" || t === "removeRelationship")
      return s(e.parentId) || s(e.childId) ? null : e;
    let i = e;
    for (const o of ["nodeOptions", "nodes"]) {
      const r = i[o];
      if (Array.isArray(r)) {
        const a = r.filter((c) => !s(c?.id));
        if (a.length === r.length) continue;
        if (!a.length) return null;
        i = { ...i, [o]: a };
      } else if (r && typeof r == "object" && s(r.id))
        return null;
    }
    return /^onNode|^onLine/.test(t) && s(i.id) ? null : i;
  }
  /** A note arrived and is drawn: each policy hears of it (DragPolicy.onNodeAdded). */
  nodeAdded(t) {
    if (!this._destroyed) {
      for (const e of this._dragPolicies.slice())
        if (typeof e.onNodeAdded == "function")
          try {
            e.onNodeAdded(t);
          } catch (s) {
            console.warn("DRAG_POLICY: onNodeAdded threw", s);
          }
    }
  }
  /** Hand a line change that touches a governed note to the policy that governs it (once per policy). */
  offerGovernedLine(t, e) {
    if (t !== "addRelationship" && t !== "removeRelationship" && t !== "onLinePropertiesChanged") return;
    const s = t === "onLinePropertiesChanged" ? (Array.isArray(e) ? e : [e]).map((o) => o?.id) : [e?.parentId, e?.childId], i = /* @__PURE__ */ new Set();
    for (const o of s) {
      const r = typeof o == "string" ? this.governanceOf(this.nodes.one(o)) : null;
      if (!(!r || i.has(r.policy))) {
        i.add(r.policy);
        try {
          r.policy.onLine?.(t, e);
        } catch (a) {
          console.warn("DRAG_POLICY: onLine threw", a);
        }
      }
    }
  }
  /** Keep governed and decoration notes out of selections they may not join. */
  screenSelection(t, e) {
    if (t = t.filter((i) => this.capabilitiesOf(i).canSelect), this._policyAuthority > 0) return { nodes: t, addToSelection: e };
    const s = (i) => !!this.governanceOf(i);
    return t.length > 1 ? t = t.filter((i) => !s(i)) : t.length === 1 && s(t[0]) && (e = !1), e && this.selectedNodes.some(s) && (e = !1), { nodes: t, addToSelection: e };
  }
  // ─── Coordinates and hit testing ────────────────────────────────────
  /** Convert a point on screen (clientX/clientY) to world coordinates. */
  clientToWorld(t) {
    const e = this.canvas.point(t.x, t.y);
    return { x: e.x, y: e.y };
  }
  /** Convert a world point to screen (client) coordinates, through the current pan and zoom. */
  worldToClient(t) {
    const s = this.canvas.node.getScreenCTM?.();
    return s ? {
      x: s.a * t.x + s.c * t.y + s.e,
      y: s.b * t.x + s.d * t.y + s.f
    } : { x: t.x, y: t.y };
  }
  /**
   * The topmost note under a world point, by each note's (rotated) box.
   *
   * @param point  world coordinates (see clientToWorld)
   * @param nodes  the notes to consider; defaults to every note on the slate
   * @param options.padding  extra world units around each box that still count
   * @param options.exclude  a note to ignore (for example the one being dragged)
   */
  hitTestNodes(t, e, s = {}) {
    const i = (e ?? this.nodes.allNodes).filter((o) => o && o !== s.exclude);
    return Lp(t, i, s.padding ?? 0);
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
    const s = ws(this, t, e);
    return JSON.stringify(s);
  }
  /**
   * Load a v1-compatible JSON string or object into this slate.
   *
   * @param json - JSON string or SlateJSON object
   * @param preserve - If true, merge with existing nodes instead of replacing
   * @param skipZoom - If true, don't adjust zoom/pan after load
   * @param useMainCanvas - Reserved for future use
   */
  async loadJSON(t, e = !1, s = !1, i) {
    await xs(t, this, e, s), this.collab?.documentLoaded?.(), this.undoRedo?.clear?.(), this.undoRedo?.snap?.(!0);
  }
  /**
   * Take a snapshot of the current slate state.
   * Used by undo/redo system.
   *
   * @returns SlateJSON object (not stringified)
   */
  snapshot() {
    return Va(this);
  }
  // ─── Export API ─────────────────────────────────────────────────
  /**
   * Export the slate as an SVG string.
   */
  svg(t, e) {
    return fo(this, t, e);
  }
  /**
   * Export the slate as a PNG (async).
   */
  async png(t, e) {
    return Ec(this, t, e);
  }
  /**
   * Synchronous-style PNG export (returns a Promise).
   * Alias for png() for v1 compatibility.
   */
  pngSync(t) {
    return this.png(t);
  }
  // ─── Layout API ─────────────────────────────────────────────────
  /** Remove overlapping nodes by pushing them apart */
  /** Optimize Layout: the shared tidy layout over the slate's notes, saved as one move. */
  removeLayoutOverlaps(t) {
    Rc(this, t);
  }
  /** Apply pre-computed layout moves */
  applyLayout(t, e, s) {
    Pc(this, t, e, s);
  }
  /** Package current node positions for layout transfer */
  packageLayout() {
    return Oc(this);
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
    await cc(this);
  }
};
cs.NON_UNDOABLE = /* @__PURE__ */ new Set([
  "onZoom",
  "onCanvasMove",
  "onFollowMeChanged",
  "onSlateFollowMeChanged",
  "onSlateHuddleChanged",
  "onCursorMoved",
  "onPresenceChanged",
  "onSlateChanged",
  // UndoRedo already moved the history pointer before broadcasting this
  // authoritative state; recording it again would create a duplicate step.
  "onSlateReplaced"
]);
let gn = cs;
function Rm(n, t) {
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
    showMenu: !1,
    allowResize: !0,
    // Author/timestamp must be part of the node at creation so they're carried
    // by the onNodeAdded broadcast + the save. Setting them AFTER addNode left
    // them out of the persisted state, so they were lost on reload.
    commentAuthor: t.author,
    commentTimestamp: t.timestamp || Date.now()
  });
}
function Pm(n, t) {
  const e = n.nodes.one(t);
  return !e || !e.options.isComment ? !1 : n.removeNode(t);
}
function Om(n) {
  return n.nodes.allNodes.filter(
    (t) => t.options.isComment === !0
  );
}
const Im = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createComment: Rm,
  getComments: Om,
  removeComment: Pm
}, Symbol.toStringTag, { value: "Module" })), po = [
  "add_nodes",
  "update_nodes",
  "delete_nodes",
  "duplicate_nodes",
  "connect_nodes",
  "disconnect_nodes",
  "update_connections",
  "arrange_nodes",
  "update_slate"
], Lc = {
  add_nodes: ["kind", "count", "shape", "preset", "text", "ids", "x", "y", "width", "height", "placement", "style", "media"],
  update_nodes: ["kind", "target", "changes"],
  delete_nodes: ["kind", "target"],
  duplicate_nodes: ["kind", "target", "offset", "ids"],
  connect_nodes: ["kind", "from", "to", "ids", "style"],
  disconnect_nodes: ["kind", "from", "to", "connectionIds"],
  update_connections: ["kind", "from", "to", "connectionIds", "changes"],
  arrange_nodes: ["kind", "target", "layout", "gap"],
  update_slate: ["kind", "changes"]
}, zc = ["left", "right", "above", "below", "center"], Bc = ["row", "column", "grid"], Dm = ["align-left", "align-center", "align-right", "align-top", "align-middle", "align-bottom"], Lm = ["distribute-horizontal", "distribute-vertical"], Gc = ["row", "column", "grid", "circle", ...Dm, ...Lm, "tidy", "tree"], $c = ["text", "sticky"], zm = 75, Bm = Object.freeze({ x: 20, y: 20 }), Gm = Object.freeze({
  operationsPerPlan: 50,
  notesPerAdd: 20,
  notesPerSlate: 1e3,
  connectorsPerOperation: 400,
  connectorsPerSlate: 5e3
}), lr = /^(?!__free_)[A-Za-z0-9_-]{1,64}$/, hr = 200, $m = Object.freeze([
  "Manrope",
  "Arial",
  "Times New Roman",
  "Georgia",
  "Courier Prime",
  "Indie Flower",
  "Abril Fatface",
  "Bangers",
  "Caveat",
  "EB Garamond",
  "Fredoka One",
  "Graduate",
  "Gravitas One",
  "IBM Plex Mono",
  "IBM Plex Sans",
  "IBM Plex Serif",
  "Lemon",
  "Lora",
  "Nixie One",
  "Noto Sans",
  "Open Sans",
  "Poppins",
  "PT Sans",
  "PT Sans Narrow",
  "PT Serif",
  "Permanent Marker",
  "Rammetto One",
  "Roboto",
  "Roboto Condensed",
  "Roboto Mono",
  "Roboto Slab",
  "Rubik",
  "Titan One",
  "Urbanist",
  // The presentation styles' faces (a slate that wears a style draws its notes in them).
  "Anton",
  "Space Grotesk",
  "Fraunces",
  "Inter"
]);
function mo(n = {}) {
  return {
    shapes: [...n.shapes ?? ja()],
    fonts: [...n.fonts ?? $m],
    animations: Object.keys(lo()),
    effects: [...nm]
  };
}
function go(n = {}) {
  return { ...Gm, ...n.limits || {} };
}
class pt extends Error {
  constructor(t, e, s, i) {
    super(s), this.name = "OperationPlanError", this.code = t, this.status = e, i && (this.details = i);
  }
}
const Hm = ["bezier", "orthogonal", "straight", "linear", "curved"], Fm = ["cubic", "quadratic"], Um = ["solid", "dashed", "dotted"], jm = ["follow", "pinned"], dr = ["follow", "pinned", "top", "right", "bottom", "left"], Ie = {
  label: { spec: { type: "string", maxLength: 500 }, description: "Text shown on the connector." },
  lineColor: { spec: { type: "color" }, description: "Line colour." },
  lineWidth: { spec: { type: "number", min: 0.1, max: 100 }, description: "Line width." },
  lineOpacity: { spec: { type: "number", min: 0, max: 1 }, description: "Line opacity from 0 to 1." },
  lineType: { spec: { type: "enum", values: Hm }, description: "Path style." },
  lineCurveType: { spec: { type: "enum", values: Fm }, description: "Curve type." },
  lineCurviness: { spec: { type: "number", min: 0, max: 1 }, description: "How much the line bends." },
  lineDash: { spec: { type: "enum", values: Um }, description: "Solid, dashed or dotted line." },
  labelPosition: {
    spec: { type: "number", min: 0.05, max: 0.95 },
    description: "Where the label sits along the line, from near its start (0.05) to near its end (0.95); the middle (0.5) when unset."
  },
  showParentArrow: { spec: { type: "boolean" }, description: "Arrowhead at the starting note." },
  showChildArrow: { spec: { type: "boolean" }, description: "Arrowhead at the far end." },
  ends: {
    spec: { type: "enum", values: jm },
    description: "Both ends that are on notes: follow (each end takes the shortest way round its note as things move) or pinned (each end stays at the spot on its note's edge that faces the line's other end, where a following end sits)."
  },
  fromEnd: {
    spec: { type: "enum", values: dr },
    description: "The starting end: follow, pinned (at the spot on the note's edge facing the line's other end), or pinned to the middle of the note's top, right, bottom or left side."
  },
  toEnd: {
    spec: { type: "enum", values: dr },
    description: "The far end: follow, pinned (at the spot on the note's edge facing the line's other end), or pinned to the middle of the note's top, right, bottom or left side. Not for a free end."
  },
  toNote: {
    spec: { type: "string", minLength: 1, maxLength: 200 },
    description: "Reconnect the far end to this note (its id). A free end is attached to it. The connector keeps its id."
  },
  fromNote: {
    spec: { type: "string", minLength: 1, maxLength: 200 },
    description: "Reconnect the starting end to this note (its id); the connector then belongs to that note and keeps its id."
  },
  toPoint: {
    spec: { type: "point" },
    description: "Leave the far end free at this point on the canvas (a saved point that stays put). Detaches it from its note if it is on one; moves it if it is already free.",
    field: "targetPoint"
  },
  fromPoint: {
    spec: { type: "point" },
    description: "Leave the starting end free at this point. The connector then belongs to the note at its far end, its arrows kept as drawn. A connector keeps at least one end on a note."
  }
}, Hc = ["ends", "fromEnd", "toEnd", "toNote", "fromNote", "toPoint", "fromPoint"], Fc = Object.keys(Ie).filter((n) => !Hc.includes(n)), Ys = { lineColor: "#333333", lineWidth: 3, lineType: "bezier" }, yn = "__free_", Uc = ["linear", "radial"], jc = ["horizontal", "vertical", "diagonal"], $n = (n) => ({
  store: (t, e) => {
    t.options[n] = e;
  }
}), ur = (n) => ({
  store: (t, e) => {
    t.options.viewPort = { ...t.options.viewPort || {}, [n]: e };
  }
}), bn = {
  name: { spec: { type: "string", minLength: 1, maxLength: 200 }, description: "The slate's name.", ...$n("name") },
  description: { spec: { type: "string", maxLength: 5e3 }, description: "The slate's description.", ...$n("description") },
  background: {
    spec: { type: "object" },
    description: "Canvas background: {color, gradient?: {type, colors, direction?}}.",
    store: (n, t) => {
      const e = { ...n.options.containerStyle || {}, ...Yc(t) };
      delete e.backgroundImage, delete e.backgroundEffect, n.options.containerStyle = e;
    }
  },
  style: {
    spec: { type: "object" },
    description: "The style the slate wears, as a record: {id, overrides?: {bg?, palette?, fonts?: {display?, body?}}, v?}, or null to take it off. The look itself lives in the slate's background, its notes and its style art (real notes the app writes with the style); sent alone, the app wears the whole style.",
    store: (n, t) => {
      t === null ? delete n.options.style : n.options.style = t;
    }
  },
  mindMapMode: {
    spec: { type: "boolean" },
    description: "Mind map mode: the slate's style colors notes by their depth in the connected tree.",
    ...$n("mindMapMode")
  },
  autoResizeNodesBasedOnText: {
    spec: { type: "boolean" },
    description: "Notes grow to fit their text while it is typed.",
    ...$n("autoResizeNodesBasedOnText")
  },
  showGrid: { spec: { type: "boolean" }, description: "Show the grid behind the canvas.", ...ur("showGrid") },
  snapToObjects: { spec: { type: "boolean" }, description: "A dragged note snaps to the edges of its neighbours.", ...ur("snapToObjects") },
  defaultLineColor: {
    spec: { type: "color" },
    description: "The slate's line colour: every connector and every note's line colour takes it, as the Colours panel does.",
    store: (n, t) => {
      n.options.defaultLineColor = t;
      for (const e of n.nodes) {
        e.options.lineColor = t;
        for (const s of e.relationships.associations) s.lineColor = t;
      }
    }
  }
};
function Ym(n, t) {
  if (!ot(n)) return [`${t} must be an object {color, gradient?}.`];
  const e = [];
  for (const i of Object.keys(n))
    i !== "color" && i !== "gradient" && e.push(`${t} has an unknown field: ${i}.`);
  const s = it({ type: "color" }, n.color, `${t}.color`);
  if (s && e.push(s), n.gradient !== void 0) {
    const i = n.gradient;
    if (!ot(i)) return [...e, `${t}.gradient must be an object {type, colors, direction?}.`];
    for (const r of Object.keys(i))
      ["type", "colors", "direction"].includes(r) || e.push(`${t}.gradient has an unknown field: ${r}.`);
    const o = it({ type: "enum", values: Uc }, i.type, `${t}.gradient.type`);
    if (o && e.push(o), i.direction !== void 0) {
      const r = it({ type: "enum", values: jc }, i.direction, `${t}.gradient.direction`);
      r && e.push(r);
    }
    !Array.isArray(i.colors) || i.colors.length < 2 || i.colors.length > 8 ? e.push(`${t}.gradient.colors must list 2 to 8 colours.`) : i.colors.forEach((r, a) => {
      const c = it({ type: "color" }, r, `${t}.gradient.colors[${a}]`);
      c && e.push(c);
    });
  }
  return e;
}
const Xm = /^[a-z][a-z-]{0,39}$/, Wm = ["bg", "palette", "fonts"];
function qm(n, t, e) {
  if (n === null) return [];
  if (!ot(n)) return [`${t} must be an object {id, overrides?, v?} or null.`];
  const s = [];
  for (const o of Object.keys(n))
    ["id", "overrides", "v"].includes(o) || s.push(`${t} has an unknown field: ${o}.`);
  (typeof n.id != "string" || !Xm.test(n.id)) && s.push(`${t}.id must be a style name (lowercase letters and hyphens, at most 40).`), n.v !== void 0 && (typeof n.v != "number" || !Number.isInteger(n.v) || n.v < 1 || n.v > 1e3) && s.push(`${t}.v must be a whole number from 1 to 1000.`);
  const i = n.overrides;
  if (i === void 0) return s;
  if (!ot(i)) return [...s, `${t}.overrides must be an object.`];
  for (const o of Object.keys(i))
    Wm.includes(o) || s.push(`${t}.overrides has an unknown field: ${o}.`);
  if (i.bg !== void 0) {
    const o = it({ type: "color" }, i.bg, `${t}.overrides.bg`);
    o && s.push(o);
  }
  if (i.palette !== void 0 && (!Array.isArray(i.palette) || i.palette.length < 1 || i.palette.length > 12 ? s.push(`${t}.overrides.palette must list 1 to 12 colors.`) : i.palette.forEach((o, r) => {
    const a = typeof o == "string" ? o.split("-") : [o];
    a.length > 2 && s.push(`${t}.overrides.palette[${r}] must be a color or a "from-to" pair.`);
    for (const c of a) {
      const l = it({ type: "color" }, c, `${t}.overrides.palette[${r}]`);
      if (l) {
        s.push(l);
        break;
      }
    }
  })), i.fonts !== void 0)
    if (!ot(i.fonts)) s.push(`${t}.overrides.fonts must be an object {display?, body?}.`);
    else
      for (const [o, r] of Object.entries(i.fonts))
        o !== "display" && o !== "body" ? s.push(`${t}.overrides.fonts has an unknown field: ${o}.`) : (typeof r != "string" || !e.some((a) => a.toLowerCase() === r.toLowerCase())) && s.push(`${t}.overrides.fonts.${o} must be a font this instance offers.`);
  return s;
}
function Yc(n) {
  return {
    backgroundColor: n.color,
    backgroundColorAsGradient: !!n.gradient,
    backgroundGradientType: n.gradient?.type ?? "linear",
    backgroundGradientColors: n.gradient?.colors ?? [],
    backgroundGradientStrategy: n.gradient?.direction ?? "horizontal"
  };
}
function Zm() {
  return {
    type: ["object", "null"],
    additionalProperties: !1,
    required: ["id"],
    properties: {
      id: { type: "string", pattern: "^[a-z][a-z-]{0,39}$" },
      v: { type: "integer", minimum: 1, maximum: 1e3 },
      overrides: {
        type: "object",
        additionalProperties: !1,
        properties: {
          bg: Ut({ type: "color" }),
          palette: { type: "array", minItems: 1, maxItems: 12, items: { type: "string", maxLength: 64 } },
          fonts: { type: "object", additionalProperties: !1, properties: { display: { type: "string" }, body: { type: "string" } } }
        }
      }
    }
  };
}
function Vm() {
  return {
    type: "object",
    additionalProperties: !1,
    required: ["color"],
    properties: {
      color: Ut({ type: "color" }),
      gradient: {
        type: "object",
        additionalProperties: !1,
        required: ["type", "colors"],
        properties: {
          type: { type: "string", enum: [...Uc] },
          colors: { type: "array", minItems: 2, maxItems: 8, items: Ut({ type: "color" }) },
          direction: { type: "string", enum: [...jc] }
        }
      }
    }
  };
}
const Km = ["ids", "text", "match", "all", "within", "groupId"], Jm = ["ids", "text", "within", "groupId"];
function Xe(n, t) {
  if (!ot(n)) return [`${t} must be a selector such as {ids: [...]}, {text}, {within}, {groupId} or {all: true}.`];
  const e = [];
  for (const i of Object.keys(n))
    Km.includes(i) || e.push(`${t} has an unknown field: ${i}.`);
  const s = Jm.filter((i) => n[i] !== void 0);
  if (s.length > 1 && e.push(`${t} must name notes one way, not by ${s.join(" and ")}.`), !s.length && n.all !== !0 && e.push(`${t} must name notes by ids, text, within, groupId or all: true.`), n.ids !== void 0 && (!Array.isArray(n.ids) || !n.ids.length || n.ids.some((i) => typeof i != "string" || !i)) && e.push(`${t}.ids must be a list of note ids.`), n.text !== void 0 && (typeof n.text != "string" || !n.text.trim()) && e.push(`${t}.text must be the text of a note.`), n.match !== void 0) {
    n.text === void 0 && e.push(`${t}.match goes with text.`);
    const i = it({ type: "enum", values: ["exact", "contains"] }, n.match, `${t}.match`);
    i && e.push(i);
  }
  if (n.all !== void 0 && n.all !== !0 && e.push(`${t}.all must be true when given.`), n.groupId !== void 0 && (typeof n.groupId != "string" || !n.groupId) && e.push(`${t}.groupId must be a group id.`), n.within !== void 0) {
    const i = n.within;
    ot(i) && Object.keys(i).every((r) => ["x", "y", "width", "height"].includes(r)) && ["x", "y", "width", "height"].every((r) => typeof i[r] == "number" && Number.isFinite(i[r])) && i.width > 0 && i.height > 0 || e.push(`${t}.within must be {x, y, width, height} with a positive width and height.`);
  }
  return e;
}
function Qm() {
  return {
    type: "object",
    additionalProperties: !1,
    description: 'Name notes one way: ids, text (the whole text, ignoring case and extra spaces; match: "contains" to search), within a rectangle, groupId, or all: true. A text selector matching several notes also needs all: true.',
    properties: {
      ids: { type: "array", minItems: 1, items: { type: "string" } },
      text: { type: "string" },
      match: { type: "string", enum: ["exact", "contains"] },
      all: { type: "boolean", enum: [!0] },
      within: {
        type: "object",
        additionalProperties: !1,
        required: ["x", "y", "width", "height"],
        properties: { x: { type: "number" }, y: { type: "number" }, width: { type: "number" }, height: { type: "number" } }
      },
      groupId: { type: "string" }
    }
  };
}
const tg = /\b(theme|background|canvas|palette|gradient|recolor|colour|color scheme)\b/i, Xc = /\b(clear|replace|reset|start over|delete all|remove all)\b/i;
function We(n, t, e, s, i, { required: o = !0, plural: r = `${s}s` } = {}) {
  const a = [];
  if (n === void 0 && !o) return a;
  if (!ot(n) || o && !Object.keys(n).length)
    return [o ? `${e} requires at least one ${s}.` : `${e} ${r} must be an object.`];
  const c = Object.keys(n).filter((l) => !t.includes(l));
  c.length && a.push(`${e} contains unsupported ${r}: ${c.join(", ")}.`);
  for (const [l, h] of Object.entries(n))
    t.includes(l) && i(l, h, a);
  return a;
}
function fr(n, t) {
  return (e, s, i) => {
    const o = Es[e]?.spec ?? q[e].spec(n), r = it(o, s, `${t} ${e}`);
    r && i.push(r);
  };
}
function pr(n) {
  return (t, e, s) => {
    const i = it(Ie[t].spec, e, `${n} ${t}`);
    i && s.push(i);
  };
}
function zt(n) {
  return Array.isArray(n) && n.length > 0 && n.every((t) => typeof t == "string" && t.length > 0);
}
function eg(n, t = {}) {
  const e = mo(t), s = go(t), i = t.userMessage || "";
  if (!ot(n)) return { valid: !1, errors: ["The operation plan must be an object."] };
  const o = [];
  for (const d of Object.keys(n))
    d !== "message" && d !== "operations" && o.push(`The plan has an unknown field: ${d}.`);
  (typeof n.message != "string" || !n.message.trim()) && o.push("A natural completion message is required."), !Array.isArray(n.operations) || n.operations.length === 0 ? o.push("At least one slate operation is required.") : n.operations.length > s.operationsPerPlan && o.push(`A plan cannot contain more than ${s.operationsPerPlan} operations.`);
  const r = !!t.existingNodeIds?.length, a = new Set((t.existingNodeIds || []).filter(Boolean)), c = !!t.existingConnectionIds?.length, l = new Set((t.existingConnectionIds || []).filter(Boolean)), h = (d, u) => {
    r && ot(d) && Array.isArray(d.ids) && d.ids.some((f) => !a.has(f)) && o.push(`${u} references notes that are not in the slate.`);
  };
  return (Array.isArray(n.operations) ? n.operations : []).forEach((d, u) => {
    const f = `Operation ${u + 1}`;
    if (!ot(d) || !po.includes(d.kind)) {
      o.push(`${f} has an unsupported kind.`);
      return;
    }
    const p = Lc[d.kind], m = Object.keys(d).filter((g) => !p.includes(g));
    for (const g of m) o.push(`${f} has an unknown field: ${g}.`);
    switch (d.kind) {
      case "add_nodes": {
        if ((!Number.isInteger(d.count) || d.count < 1 || d.count > s.notesPerAdd) && o.push(`${f} count must be an integer from 1 to ${s.notesPerAdd}.`), d.preset !== void 0) {
          const x = it({ type: "enum", values: $c }, d.preset, `${f} preset`);
          x && o.push(x);
        }
        const g = ot(d.placement) && d.placement.connect === !0, y = d.media !== void 0;
        if (y) {
          const x = tc(d.media);
          x.ok || o.push(`${f} media ${x.message}`), d.count !== 1 && o.push(`${f} adds one media note at a time (count 1).`);
          for (const C of ["shape", "preset", "text"])
            d[C] !== void 0 && o.push(`${f} is a media note, so it takes no ${C}.`);
          g && o.push(`${f} is a media note, so it cannot copy and connect from another note.`);
        }
        if (!y && (d.shape !== void 0 || d.preset === void 0 && !g)) {
          const x = it(q.shape.spec(e), d.shape, `${f} shape`);
          x && o.push(x);
        }
        for (const x of ["text", "width", "height"]) {
          if (d[x] === void 0) continue;
          const C = it(q[x].spec(e), d[x], `${f} ${x}`);
          C && o.push(C);
        }
        d.x === void 0 != (d.y === void 0) && o.push(`${f} needs both x and y, or neither.`);
        for (const x of ["x", "y"]) {
          if (d[x] === void 0) continue;
          const C = it(q[x].spec(e), d[x], `${f} ${x}`);
          C && o.push(C);
        }
        d.ids !== void 0 && (!zt(d.ids) || new Set(d.ids).size !== d.ids.length ? o.push(`${f} ids must be a list of different note ids.`) : d.ids.some((x) => !lr.test(x)) ? o.push(`${f} ids must be 1 to 64 letters, digits, _ or -, and must not start with __free_.`) : Number.isInteger(d.count) && d.ids.length > d.count && o.push(`${f} has more ids than notes to add.`));
        const b = d.placement;
        if (b !== void 0)
          if (!ot(b))
            o.push(`${f} placement must be an object.`);
          else {
            const x = d.x !== void 0 ? ["arrangement", "gap", ...b.connect === !0 ? ["relativeTo", "connect"] : []] : ["relativeTo", "direction", "arrangement", "gap", "connect"];
            for (const C of Object.keys(b))
              x.includes(C) || o.push(
                d.x !== void 0 && ["relativeTo", "direction", "connect"].includes(C) ? `${f} gives x and y, so placement cannot also give ${C}.` : `${f} placement has an unknown field: ${C}.`
              );
            b.connect !== void 0 && (typeof b.connect != "boolean" ? o.push(`${f} placement.connect must be true or false.`) : b.connect && (b.relativeTo === void 0 && o.push(`${f} placement.connect needs relativeTo, the note to copy and connect from.`), b.direction === "center" && o.push(`${f} cannot connect a note placed at the centre of another; choose left, right, above or below.`))), b.relativeTo !== void 0 && typeof b.relativeTo != "string" ? o.push(`${f} placement.relativeTo must be a note id.`) : b.relativeTo && r && !a.has(b.relativeTo) && o.push(`${f} references a note that is not in the slate.`);
            for (const [C, v] of [["direction", zc], ["arrangement", Bc]]) {
              if (b[C] === void 0) continue;
              const w = it({ type: "enum", values: v }, b[C], `${f} placement.${C}`);
              w && o.push(w);
            }
            if (b.gap !== void 0) {
              const C = it({ type: "number", min: 0, max: 2e3 }, b.gap, `${f} placement.gap`);
              C && o.push(C);
            }
          }
        o.push(...We(d.style, vc, f, "node style", fr(e, f), { required: !1 })), zt(d.ids) && d.ids.forEach((x) => a.add(x));
        return;
      }
      case "update_nodes":
      case "delete_nodes":
      case "arrange_nodes": {
        const g = Xe(d.target, `${f} target`);
        if (o.push(...g), g.length || h(d.target, f), d.kind === "update_nodes" && o.push(...We(d.changes, rm, f, "node change", fr(e, f), { plural: "changes" })), d.kind === "delete_nodes" && ot(d.target) && d.target.all === !0 && Object.keys(d.target).length === 1 && !Xc.test(i) && o.push(`${f} cannot delete every note without an explicit request.`), d.kind === "arrange_nodes") {
          const y = it({ type: "enum", values: Gc }, d.layout, `${f} layout`);
          if (y && o.push(y), d.gap !== void 0) {
            const b = it({ type: "number", min: 0, max: 2e3 }, d.gap, `${f} gap`);
            b && o.push(b);
          }
        }
        return;
      }
      case "duplicate_nodes": {
        const g = Xe(d.target, `${f} target`);
        if (o.push(...g), g.length || h(d.target, f), d.offset !== void 0) {
          const y = it({ type: "point" }, d.offset, `${f} offset`);
          y && o.push(y);
        }
        d.ids !== void 0 && (!zt(d.ids) || new Set(d.ids).size !== d.ids.length ? o.push(`${f} ids must be a list of different note ids.`) : d.ids.some((y) => !lr.test(y)) ? o.push(`${f} ids must be 1 to 64 letters, digits, _ or -, and must not start with __free_.`) : ot(d.target) && zt(d.target.ids) && d.ids.length > d.target.ids.length && o.push(`${f} has more ids than notes to copy.`)), zt(d.ids) && d.ids.forEach((y) => a.add(y));
        return;
      }
      case "connect_nodes": {
        const g = Xe(d.from, `${f} from`);
        if (o.push(...g), g.length || h(d.from, f), ot(d.to) && d.to.point !== void 0) {
          Object.keys(d.to).length !== 1 && o.push(`${f} to must be a note selector or {point}, not both.`);
          const x = it({ type: "point" }, d.to.point, `${f} to.point`);
          x && o.push(x);
        } else {
          const x = Xe(d.to, `${f} to`);
          o.push(...x), x.length || h(d.to, f);
        }
        d.ids !== void 0 && (!zt(d.ids) || new Set(d.ids).size !== d.ids.length ? o.push(`${f} ids must be a list of different connector ids.`) : d.ids.some((x) => x.length > hr) && o.push(`${f} connector ids can be at most ${hr} characters.`)), o.push(...We(d.style, Fc, f, "connection style", pr(f), { required: !1 })), zt(d.ids) && d.ids.forEach((x) => l.add(x));
        const y = d.from?.ids, b = d.to?.ids;
        zt(y) && zt(b) && y.forEach((x) => b.forEach((C) => l.add(`${x}->${C}`)));
        return;
      }
      case "disconnect_nodes":
      case "update_connections": {
        const g = d.connectionIds !== void 0, y = d.from !== void 0 || d.to !== void 0;
        if (g && y && o.push(`${f} names connectors by connectionIds or by from and to, not both.`), !g && !y && o.push(`${f} requires connectionIds or both from and to note selectors.`), g && (zt(d.connectionIds) ? c && d.connectionIds.some((b) => !l.has(b)) && o.push(`${f} references connectors that are not in the slate.`) : o.push(`${f} connectionIds must be a list of connector ids.`)), y)
          for (const b of ["from", "to"]) {
            const x = Xe(d[b], `${f} ${b}`);
            o.push(...x), x.length || h(d[b], f);
          }
        if (d.kind === "update_connections") {
          o.push(...We(d.changes, Object.keys(Ie), f, "connection change", pr(f)));
          const b = ot(d.changes) ? d.changes : {};
          b.toNote !== void 0 && b.toPoint !== void 0 && o.push(`${f} moves the far end with toNote or toPoint, not both.`), b.fromNote !== void 0 && b.fromPoint !== void 0 && o.push(`${f} moves the starting end with fromNote or fromPoint, not both.`), b.ends !== void 0 && (b.fromEnd !== void 0 || b.toEnd !== void 0) && o.push(`${f} sets ends, or fromEnd and toEnd, not both.`), b.toPoint !== void 0 && b.toEnd !== void 0 && o.push(`${f} cannot pin a far end it leaves free (toPoint with toEnd).`), b.fromPoint !== void 0 && (b.toPoint !== void 0 || b.fromEnd !== void 0) && o.push(`${f} keeps one end on a note: fromPoint goes with neither toPoint nor fromEnd.`);
        }
        return;
      }
      case "update_slate": {
        o.push(
          ...We(d.changes, Object.keys(bn), f, "slate change", (g, y, b) => {
            if (g === "background") {
              b.push(...Ym(y, `${f} background`));
              return;
            }
            if (g === "style") {
              b.push(...qm(y, `${f} style`, e.fonts));
              return;
            }
            const x = it(bn[g].spec, y, `${f} ${g}`);
            x && b.push(x);
          })
        ), ot(d.changes) && d.changes.background !== void 0 && !tg.test(i) && o.push(`${f} cannot change the canvas background unless the user explicitly asks for it.`);
        return;
      }
    }
  }), { valid: o.length === 0, errors: o };
}
const D = (n) => n.options.id, At = (n, t) => q[t].read(n.options), Ot = (n) => ({
  x: At(n, "x"),
  y: At(n, "y"),
  width: Number(n.options.width ?? 120),
  height: Number(n.options.height ?? 80)
}), ke = (n) => !!n.targetPoint || `${n.childId || ""}`.startsWith(yn), Je = (n, t) => `${n}->${t}`;
function as(n) {
  return JSON.parse(JSON.stringify(n ?? null));
}
function Wc(n) {
  const t = n?.nodes && !Array.isArray(n.nodes), e = t ? n.v2 ?? n : null, s = t ? {
    options: as(e.options || {}),
    nodes: (e.freeNodes?.() ?? e.nodes.allNodes ?? []).map((i) => ng(i?.v2 ?? i))
  } : as(n || {});
  return s.options || (s.options = {}), s.nodes = (Array.isArray(s.nodes) ? s.nodes : []).map((i) => {
    const o = i?.options ? i : { options: { ...i || {} }, relationships: i?.relationships };
    return o.options.relationships && delete o.options.relationships, o.relationships = { ...o.relationships || {}, associations: [...o.relationships?.associations || []] }, o.relationships.associations.forEach((r) => {
      r.parentId || (r.parentId = o.options.id), r.id || (r.id = Je(r.parentId, r.childId));
    }), o;
  }), s;
}
function ng(n) {
  const t = as(n.options || {});
  t.x !== void 0 && (t.xPos = t.x, delete t.x), t.y !== void 0 && (t.yPos = t.y, delete t.y), t.fontColor !== void 0 && t.foregroundColor === void 0 && (t.foregroundColor = t.fontColor);
  const e = typeof n.getRotation == "function" ? n.getRotation() : void 0;
  typeof e == "number" && (t.rotate = { ...t.rotate || {}, rotationAngle: e });
  const s = n.relationships, i = typeof s?.getAssociations == "function" ? s.getAssociations() : Array.from(s?.associations || []);
  return {
    options: t,
    relationships: {
      associations: i.map(({ parent: o, child: r, ...a }) => as(a))
    }
  };
}
function he(n) {
  const t = /* @__PURE__ */ new Set(), e = [];
  for (const s of n.nodes)
    for (const i of s.relationships.associations)
      t.has(i.id) || (t.add(i.id), e.push({ node: s, association: i }));
  return e;
}
const Xs = (n) => `${n ?? ""}`.replace(/\s+/g, " ").trim().toLowerCase();
function Zt(n, t, e) {
  const s = n.nodes;
  if (t.ids)
    return t.ids.map((i) => s.find((o) => D(o) === i)).filter(Boolean);
  if (t.text !== void 0) {
    const i = Xs(t.text), o = s.filter(
      (r) => t.match === "contains" ? Xs(r.options.text).includes(i) : Xs(r.options.text) === i
    );
    if (o.length > 1 && t.all !== !0)
      throw new pt(
        "ambiguous_selector",
        400,
        `${e} "${t.text}" matches ${o.length} notes (${o.map(D).join(", ")}). Name them by ids, or add all: true to change every one.`,
        { candidates: o.map((r) => ({ id: D(r), text: r.options.text ?? "" })) }
      );
    return o;
  }
  if (t.within) {
    const i = t.within;
    return s.filter((o) => {
      const r = Ot(o);
      return r.x >= i.x && r.y >= i.y && r.x + r.width <= i.x + i.width && r.y + r.height <= i.y + i.height;
    });
  }
  return t.groupId !== void 0 ? s.filter((i) => i.options.groupId === t.groupId) : t.all === !0 ? [...s] : [];
}
const Ws = (n) => ({ ...Ot(n), rotation: Number(At(n, "rotationAngle")) || 0 }), sg = (n) => ({ x: n.x + n.width / 2, y: n.y + n.height / 2 });
function ig(n, t, e, s, i, o) {
  const r = (f) => n.nodes.find((p) => D(p) === f), a = (f) => {
    throw new pt("invalid_operation_plan", 400, `${i} ${f}`);
  }, c = (f) => {
    throw new pt("no_match", 409, `${i} names no note ${JSON.stringify(f)} on the slate.`);
  }, l = (f, p) => {
    f !== p && (f.relationships.associations = f.relationships.associations.filter((m) => m !== e), p.relationships.associations.push(e));
  };
  let h = t;
  if (s.toNote !== void 0) {
    const f = r(s.toNote) ?? c(s.toNote);
    e.childId = D(f), delete e.targetPoint, e.targetAnchor = null;
  } else s.toPoint !== void 0 && (ke(e) || (e.childId = `${yn}${o()}`), e.targetPoint = { x: s.toPoint.x, y: s.toPoint.y }, e.targetAnchor = null);
  if (s.fromNote !== void 0) {
    const f = r(s.fromNote) ?? c(s.fromNote);
    e.parentId = D(f), e.sourceAnchor = null, l(h, f), h = f;
  } else if (s.fromPoint !== void 0) {
    ke(e) && a(`keeps one end on a note: the far end of ${e.id} is already free.`);
    const f = r(e.childId) ?? c(e.childId), p = Sa(e);
    for (const m of Object.keys(e)) delete e[m];
    Object.assign(e, p, {
      parentId: D(f),
      childId: `${yn}${o()}`,
      targetPoint: { x: s.fromPoint.x, y: s.fromPoint.y }
    }), l(h, f), h = f;
  }
  e.parentId === e.childId && a(`cannot connect ${e.id} from a note to itself.`);
  const d = (f) => {
    if (f === "target" && ke(e)) return e.targetPoint;
    const p = r(f === "source" ? e.parentId : e.childId);
    if (!p) return null;
    const m = f === "source" ? e.sourceAnchor : e.targetAnchor;
    return m ? xa(Ws(p), m) : sg(Ws(p));
  }, u = (f, p, m) => {
    if (f === "target" && ke(e)) {
      m && a(`cannot pin or follow the far end of ${e.id}: it is free, on no note.`);
      return;
    }
    const g = f === "source" ? "sourceAnchor" : "targetAnchor";
    if (p === "follow") e[g] = null;
    else if (p !== "pinned") e[g] = uu(p);
    else if (!e[g]) {
      const y = r(f === "source" ? e.parentId : e.childId), b = d(f === "source" ? "target" : "source");
      y && b && (e[g] = _a(Ws(y), b));
    }
  };
  return s.ends !== void 0 && (u("source", s.ends, !1), u("target", s.ends, !1)), s.fromEnd !== void 0 && u("source", s.fromEnd, !0), s.toEnd !== void 0 && u("target", s.toEnd, !0), h;
}
function og() {
  const n = "abcdefghijklmnopqrstuvwxyz0123456789";
  let t = "";
  for (let e = 0; e < 12; e += 1) t += n[Math.floor(Math.random() * n.length)];
  return t;
}
function rg(n) {
  const t = (o) => {
    const r = (parseInt(o, 16) || 0) / 255;
    return r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  }, e = (o) => 0.2126 * t(o.substr(1, 2)) + 0.7152 * t(o.substr(3, 2)) + 0.0722 * t(o.substr(-2)), s = (o, r) => {
    const [a, c] = [e(o), e(r)];
    return (Math.max(a, c) + 0.05) / (Math.min(a, c) + 0.05);
  }, i = /^#[0-9a-f]{6}$/i.test(n) ? n : "#7aa2c8";
  return s(i, "#ffffff") > s(i, "#000000") ? "#ffffff" : "#000000";
}
function ag(n, t, e) {
  return n.x < t.x + t.width + e && n.x + n.width + e > t.x && n.y < t.y + t.height + e && n.y + n.height + e > t.y;
}
function cg(n, t, e, s, i, o) {
  let r = n;
  for (let a = 0; a <= t.length; a += 1) {
    const c = t.filter((d) => r.some((u) => ag({ ...u, width: e, height: s }, d, o)));
    if (!c.length) return r;
    let l = 0, h = 0;
    i === "left" ? l = Math.min(...c.map((d) => d.x - o)) - Math.max(...r.map((d) => d.x + e)) : i === "above" ? h = Math.min(...c.map((d) => d.y - o)) - Math.max(...r.map((d) => d.y + s)) : i === "below" || i === "center" ? h = Math.max(...c.map((d) => d.y + d.height + o)) - Math.min(...r.map((d) => d.y)) : l = Math.max(...c.map((d) => d.x + d.width + o)) - Math.min(...r.map((d) => d.x)), r = r.map((d) => ({ x: d.x + l, y: d.y + h }));
  }
  return r;
}
function qc(n, t) {
  if (t) {
    const e = n.nodes.find((i) => D(i) === t);
    if (e) return e;
    const s = n.nodes.filter((i) => `${i.options.text ?? ""}`.trim().toLowerCase() === t.trim().toLowerCase());
    if (s.length === 1) return s[0];
  }
  return [...n.nodes].sort((e, s) => Ot(s).x + Ot(s).width - (Ot(e).x + Ot(e).width))[0];
}
function Ei(n, t) {
  const e = t === "grid" ? Math.ceil(Math.sqrt(n)) : n;
  return Array.from({ length: n }, (s, i) => ({
    row: t === "column" ? i : t === "grid" ? Math.floor(i / e) : 0,
    column: t === "column" ? 0 : t === "grid" ? i % e : i
  }));
}
function lg(n, t, e, s) {
  const i = t.count, o = t.placement || {}, r = o.gap ?? (o.connect ? zm : 48);
  if (t.x !== void 0 && t.y !== void 0) {
    const u = o.arrangement || "row";
    return { points: Ei(i, u).map(({ row: p, column: m }) => ({
      x: t.x + m * (e + r),
      y: t.y + p * (s + r)
    })), arrangement: u, gap: r };
  }
  const a = qc(n, o.relativeTo), c = a ? Ot(a) : { x: 0, y: 0, width: 160, height: 100 }, l = o.direction || "right", h = o.arrangement || (["left", "right"].includes(l) ? "column" : "row"), d = Ei(i, h).map(({ row: u, column: f }) => {
    let p = c.x + f * (e + r), m = c.y + u * (s + r);
    return l === "right" && (p += c.width + r), l === "left" && (p -= e + r), l === "below" && (m += c.height + r), l === "above" && (m -= s + r), { x: p, y: m };
  });
  return { points: cg(d, n.nodes.map(Ot), e, s, l, r), arrangement: h, gap: r };
}
function hg(n, t) {
  if (!n) return { childId: `${yn}${t()}` };
  const e = n.match(/->(__free_.+)$/);
  return { id: n, childId: e ? e[1] : `${yn}${n.replace(/[^A-Za-z0-9_-]/g, "_")}` };
}
function qs(n, t) {
  if (!n.has(t)) return t;
  let e = 2;
  for (; n.has(`${t}~${e}`); ) e += 1;
  return `${t}~${e}`;
}
const Zs = (n, t) => JSON.stringify([n, t]);
function Vs(n, t, e) {
  return new pt(
    "id_taken",
    409,
    `${n} names ${t} ids already in use: ${e.join(", ")}. Choose new ids, or name the existing ${t}s in a later operation.`,
    { ids: e }
  );
}
const mr = (n, t) => JSON.stringify(n) === JSON.stringify(t), dg = ["id", "name", "text", "xPos", "yPos", "x", "y", "isLocked"], Ks = (n) => JSON.parse(JSON.stringify(n)), Hn = 1e6, gr = {
  "align-left": "left",
  "align-center": "centerH",
  "align-right": "right",
  "align-top": "top",
  "align-middle": "middle",
  "align-bottom": "bottom"
}, Ee = (n) => ({ id: D(n), ...Ot(n), rotationAngle: At(n, "rotationAngle") });
function yr(n, t, e = {}) {
  const s = mo(e), i = go(e), o = e.idFactory || og, r = Wc(n), a = eg(t, {
    ...e,
    existingNodeIds: r.nodes.map(D),
    existingConnectionIds: he(r).map(({ association: u }) => u.id)
  });
  if (!a.valid)
    throw new pt("invalid_operation_plan", 400, a.errors.join(" "), { errors: a.errors });
  const c = JSON.stringify(r), l = r.nodes.length, h = [], d = {
    created: [],
    updated: [],
    deleted: [],
    connected: [],
    disconnected: [],
    connectionsUpdated: [],
    operations: [],
    skipped: [],
    warnings: [],
    unchanged: !1
  };
  if (t.operations.forEach((u, f) => {
    const p = f + 1, m = `Operation ${p}`, g = { operation: p, kind: u.kind, matched: [], changed: [] };
    d.operations.push(g);
    const y = () => d.warnings.push(`${m} matched no notes.`), b = (v) => {
      d.skipped.push({ operation: p, id: D(v), reason: "locked" });
    }, x = (v) => {
      const w = r.nodes.length + v;
      if (v > 0 && w > i.notesPerSlate && w > l)
        throw new pt(
          "note_limit",
          422,
          `${m} would leave ${w} notes; a slate can hold at most ${i.notesPerSlate} notes.`,
          { limit: i.notesPerSlate, operation: p }
        );
    }, C = (v, w) => {
      if (w > 0 && v > i.connectorsPerSlate)
        throw new pt(
          "connector_limit",
          422,
          `${m} would leave ${v} connectors; a slate can hold at most ${i.connectorsPerSlate} connectors.`,
          { limit: i.connectorsPerSlate, operation: p }
        );
    };
    switch (u.kind) {
      case "add_nodes": {
        const v = u.preset ? Bp[u.preset] : void 0, w = u.placement?.connect === !0, _ = w ? r.nodes.find((V) => D(V) === u.placement.relativeTo) : void 0;
        if (w && !_)
          throw new pt("no_match", 409, `${m} placement.relativeTo names no note on the slate to connect from.`, { operation: p });
        if (_ && _.options.isLocked === !0) {
          b(_);
          return;
        }
        const S = u.shape ?? v?.shape, T = _ ? Ot(_) : void 0, A = typeof S == "string" && S.toLowerCase() === "triangle", M = S && typeof S == "object" ? Zc(S) : 0, N = u.media !== void 0 ? tc(u.media) : null;
        if (N && !N.ok) throw new pt("invalid_operation_plan", 400, `${m} media ${N.message}`, { operation: p });
        const R = N ? Ve : void 0, P = u.width ?? R?.width ?? v?.width ?? T?.width ?? (A ? 150 : M ? Math.round(M >= 1 ? 180 : 180 * M) : 180), E = u.height ?? R?.height ?? v?.height ?? T?.height ?? (A ? 130 : M ? Math.round(M >= 1 ? 180 / M : 180) : 110), k = _ ?? qc(r, u.placement?.relativeTo), O = u.style?.backgroundColor || v?.style?.backgroundColor || k?.options.backgroundColor || "#7aa2c8", { points: L, arrangement: z, gap: W } = lg(r, u, P, E), X = new Set(he(r).map(({ association: V }) => V.id)), Z = new Set(r.nodes.map(D)), vt = (u.ids || []).filter((V) => Z.has(V));
        if (vt.length && !e.replay) throw Vs(m, "note", vt);
        const Y = L.map((V, qt) => u.ids?.[qt] || o());
        x(Y.filter((V) => !Z.has(V)).length), _ && C(X.size + Y.filter((V) => !Z.has(V)).length, Y.length), L.forEach(({ x: V, y: qt }, ae) => {
          const ft = Y[ae];
          if (g.matched.push(ft), Z.has(ft)) return;
          const wt = u.text ? u.count > 1 ? u.text.replace(/\{n\}/g, `${ae + 1}`) : u.text : "", we = _ ? Ks(_.options) : void 0;
          if (we) for (const Ht of dg) delete we[Ht];
          const Dt = we ? { ...we, id: ft, name: ft, text: wt, width: P, height: E } : {
            id: ft,
            name: ft,
            text: wt,
            defaultShaped: !0,
            width: P,
            height: E,
            backgroundColor: O,
            borderColor: "#333333",
            borderWidth: 1,
            borderOpacity: 1,
            borderStyle: "solid",
            opacity: 1,
            fontFamily: "Manrope",
            fontSize: 20,
            textXAlign: "middle",
            textYAlign: "middle",
            lineColor: "#333333",
            lineWidth: 3,
            filters: { vect: null, text: null },
            animations: { vect: null, text: null }
          };
          S && q.shape.store(Dt, S, s), q.x.store(Dt, V, s), q.y.store(Dt, qt, s), _ || q.foregroundColor.store(Dt, rg(O), s);
          for (const [Ht, As] of Object.entries(v?.style || {})) q[Ht].store(Dt, As, s);
          for (const [Ht, As] of Object.entries(u.style || {})) q[Ht].store(Dt, As, s);
          if (N?.ok && ec(Dt, N.media), r.nodes.push({ options: Dt, relationships: { associations: [] } }), g.changed.push(ft), d.created.push(ft), _) {
            const Ht = qs(X, Je(D(_), ft));
            X.add(Ht), _.relationships.associations.push({ id: Ht, parentId: D(_), childId: ft, ...Ys }), d.connected.push(Ht);
          }
        });
        const { placement: St, ...Rt } = u;
        h.push({
          ...Rt,
          ids: Y,
          x: L[0].x,
          y: L[0].y,
          placement: { arrangement: z, gap: W, ..._ ? { relativeTo: D(_), connect: !0 } : {} }
        });
        return;
      }
      case "update_nodes": {
        const v = Zt(r, u.target, `${m} target`);
        g.matched = v.map(D), v.length || y();
        const w = [];
        for (const _ of v) {
          if (_.options.isLocked === !0 && u.changes.locked !== !1) {
            b(_);
            continue;
          }
          const S = JSON.stringify(_.options);
          for (const [T, A] of Object.entries(u.changes))
            Es[T] || q[T].store(_.options, A, s);
          ug(_.options, u.changes), w.push(D(_)), JSON.stringify(_.options) !== S && g.changed.push(D(_));
        }
        if (u.changes.order && w.length) {
          const _ = new Set(w), S = r.nodes.map(D), T = r.nodes.filter((M) => _.has(D(M))), A = r.nodes.filter((M) => !_.has(D(M)));
          r.nodes = u.changes.order === "front" ? [...A, ...T] : [...T, ...A], r.nodes.forEach((M, N) => {
            const R = D(M);
            _.has(R) && S[N] !== R && !g.changed.includes(R) && g.changed.push(R);
          });
        }
        d.updated.push(...w), w.length && h.push({ kind: "update_nodes", target: { ids: w }, changes: u.changes });
        return;
      }
      case "delete_nodes": {
        const v = Zt(r, u.target, `${m} target`);
        if (g.matched = v.map(D), v.length || y(), !u.target.ids && r.nodes.length > 1 && v.length === r.nodes.length && !Xc.test(e.userMessage || ""))
          throw new pt("invalid_operation_plan", 400, `${m} cannot delete every note without an explicit request.`);
        const _ = /* @__PURE__ */ new Set();
        for (const S of v)
          S.options.isLocked === !0 ? b(S) : _.add(D(S));
        r.nodes = r.nodes.filter((S) => !_.has(D(S)));
        for (const S of r.nodes)
          S.relationships.associations = S.relationships.associations.filter(
            (T) => !_.has(T.parentId) && !_.has(T.childId)
          );
        g.changed = [..._], d.deleted.push(..._), _.size && h.push({ kind: "delete_nodes", target: { ids: [..._] } });
        return;
      }
      case "duplicate_nodes": {
        const v = Zt(r, u.target, `${m} target`);
        g.matched = v.map(D), v.length || y();
        const w = u.offset ?? Bm, _ = new Set(r.nodes.map(D)), S = (u.ids || []).filter((P) => _.has(P));
        if (S.length && !e.replay) throw Vs(m, "note", S);
        const T = v.map((P, E) => u.ids?.[E] || o());
        x(T.filter((P) => !_.has(P)).length);
        for (const P of v) {
          const E = At(P, "x") + w.x, k = At(P, "y") + w.y;
          if (Math.abs(E) > Hn || Math.abs(k) > Hn)
            throw new pt(
              "invalid_operation_plan",
              400,
              `${m} would put the copy of ${D(P)} at ${E}, ${k}; a note's position must be from -${Hn} to ${Hn}.`
            );
        }
        const A = new Map(v.map((P, E) => [D(P), T[E]])), M = /* @__PURE__ */ new Map();
        v.forEach((P, E) => {
          const k = T[E];
          if (_.has(k)) return;
          const O = { options: { ...Ks(P.options), id: k, name: k }, relationships: { associations: [] } };
          q.x.store(O.options, At(P, "x") + w.x, s), q.y.store(O.options, At(P, "y") + w.y, s), r.nodes.push(O), M.set(k, O), g.changed.push(k), d.created.push(k);
        });
        const N = new Set(he(r).map(({ association: P }) => P.id));
        let R = 0;
        for (const P of v) {
          const E = M.get(A.get(D(P)));
          if (E)
            for (const k of P.relationships.associations) {
              const O = A.get(k.childId);
              if (!O || ke(k)) continue;
              const L = qs(N, Je(D(E), O));
              N.add(L), E.relationships.associations.push({ ...Ks(k), id: L, parentId: D(E), childId: O }), d.connected.push(L), R += 1;
            }
        }
        C(N.size, R), v.length && h.push({ kind: "duplicate_nodes", target: { ids: v.map(D) }, ids: T, offset: { ...w } });
        return;
      }
      case "connect_nodes": {
        const v = Zt(r, u.from, `${m} from`), w = u.to?.point, _ = w ? [] : Zt(r, u.to, `${m} to`);
        (!v.length || !w && !_.length) && y();
        const S = v.length * (w ? 1 : _.length);
        if (S > i.connectorsPerOperation)
          throw new pt(
            "connector_limit",
            422,
            `${m} would join ${S} pairs of notes; one operation may join at most ${i.connectorsPerOperation}.`,
            { limit: i.connectorsPerOperation }
          );
        const T = /* @__PURE__ */ new Set(), A = /* @__PURE__ */ new Map();
        for (const { association: E } of he(r)) {
          T.add(E.id);
          const k = Zs(E.parentId, E.childId);
          A.has(k) || A.set(k, E.id);
        }
        const M = [], N = [], R = [];
        let P = 0;
        for (const E of v) {
          const k = D(E), O = w ? [null] : _.filter((L) => D(L) !== k);
          if (E.options.isLocked === !0) {
            O.length && b(E), P += O.length;
            continue;
          }
          O.length && R.push(k);
          for (const L of O) {
            const z = u.ids?.[P];
            if (P += 1, !L) {
              const vt = hg(z, o), Y = vt.id ?? Je(k, vt.childId);
              if (T.has(Y)) {
                e.replay || M.push(Y), N.push(Y), g.matched.push(Y);
                continue;
              }
              E.relationships.associations.push({ id: Y, parentId: k, childId: vt.childId, targetPoint: { ...w }, ...Ys, ...u.style || {} }), T.add(Y), N.push(Y), g.matched.push(Y), g.changed.push(Y), d.connected.push(Y);
              continue;
            }
            const W = D(L), X = A.get(Zs(k, W));
            if (X) {
              N.push(X), g.matched.push(X);
              continue;
            }
            if (z && T.has(z)) {
              e.replay || M.push(z), N.push(z), g.matched.push(z);
              continue;
            }
            const Z = z || qs(T, Je(k, W));
            E.relationships.associations.push({ id: Z, parentId: k, childId: W, ...Ys, ...u.style || {} }), T.add(Z), A.set(Zs(k, W), Z), N.push(Z), g.matched.push(Z), g.changed.push(Z), d.connected.push(Z);
          }
        }
        if (M.length) throw Vs(m, "connector", M);
        if (T.size > i.connectorsPerSlate && g.changed.length)
          throw new pt(
            "connector_limit",
            422,
            `A slate can hold at most ${i.connectorsPerSlate} connectors; this plan would leave ${T.size}.`,
            { limit: i.connectorsPerSlate }
          );
        g.changed.length && h.push({
          kind: "connect_nodes",
          from: { ids: R },
          to: w ? { point: { ...w } } : { ids: _.map(D) },
          ids: N,
          ...u.style ? { style: u.style } : {}
        });
        return;
      }
      case "disconnect_nodes":
      case "update_connections": {
        let v;
        if (u.connectionIds) {
          const w = new Set(u.connectionIds);
          v = he(r).filter(({ association: _ }) => w.has(_.id));
        } else {
          const w = new Set(Zt(r, u.from, `${m} from`).map(D)), _ = new Set(Zt(r, u.to, `${m} to`).map(D));
          v = he(r).filter(
            ({ association: S }) => w.has(S.parentId) && _.has(S.childId) || _.has(S.parentId) && w.has(S.childId)
          );
        }
        if (g.matched = v.map(({ association: w }) => w.id), v.length || d.warnings.push(`${m} matched no connectors.`), u.kind === "disconnect_nodes") {
          for (const { node: w, association: _ } of v)
            w.relationships.associations = w.relationships.associations.filter((S) => S !== _);
          g.changed = [...g.matched], d.disconnected.push(...g.matched), v.length && h.push({ kind: "disconnect_nodes", connectionIds: g.matched });
          return;
        }
        for (const { node: w, association: _ } of v) {
          const S = JSON.stringify([D(w), _]), T = Object.entries(u.changes).filter(([M]) => !Hc.includes(M));
          for (const [M, N] of T) _[Ie[M].field || M] = N;
          const A = ig(r, w, _, u.changes, m, o);
          JSON.stringify([D(A), _]) !== S && g.changed.push(_.id);
        }
        d.connectionsUpdated.push(...g.matched), v.length && h.push({ kind: "update_connections", connectionIds: g.matched, changes: u.changes });
        return;
      }
      case "arrange_nodes": {
        const v = Zt(r, u.target, `${m} target`);
        g.matched = v.map(D), v.length || y();
        const w = v.filter((k) => k.options.isLocked !== !0 ? !0 : (b(k), !1));
        if (!w.length) return;
        const _ = u.layout;
        let S;
        if (gr[_]) S = Mc(gr[_], w.map(Ee));
        else if (_ === "distribute-horizontal" || _ === "distribute-vertical")
          S = kc(_ === "distribute-horizontal" ? "horizontal" : "vertical", w.map(Ee));
        else if (_ === "tidy") {
          const k = new Set(w.map(D)), O = r.nodes.filter((L) => !k.has(D(L))).map(Ee);
          S = Nc(w.map(Ee), O, { gap: u.gap ?? 20 });
        } else if (_ === "tree") {
          const k = he(r).filter(({ association: z }) => !ke(z)).map(({ association: z }) => [z.parentId, z.childId]), O = new Set(w.map(D)), L = r.nodes.filter((z) => !O.has(D(z))).map(Ee);
          S = xm(w.map(Ee), k, { gap: u.gap ?? 48, obstacles: L });
        }
        if (S) {
          const k = new Map(w.map((O) => [D(O), O]));
          for (const O of S) {
            const L = k.get(O.id), z = [At(L, "x"), At(L, "y")];
            q.x.store(L.options, O.x, s), q.y.store(L.options, O.y, s), mr(z, [O.x, O.y]) || g.changed.push(O.id);
          }
          d.updated.push(...w.map(D)), h.push({ kind: "arrange_nodes", target: { ids: w.map(D) }, layout: u.layout, ...u.gap !== void 0 ? { gap: u.gap } : {} });
          return;
        }
        const T = w.map(Ot), A = u.gap ?? 48, M = Math.min(...T.map((k) => k.x)), N = Math.min(...T.map((k) => k.y)), R = Math.max(...T.map((k) => k.width), 120), P = Math.max(...T.map((k) => k.height), 80), E = Ei(w.length, u.layout === "circle" ? "row" : u.layout);
        w.forEach((k, O) => {
          const L = [At(k, "x"), At(k, "y")];
          let z, W;
          if (u.layout === "circle") {
            const X = Math.max(180, w.length * 35), Z = Math.PI * 2 * O / w.length;
            z = M + X + Math.cos(Z) * X, W = N + X + Math.sin(Z) * X;
          } else
            z = M + E[O].column * (R + A), W = N + E[O].row * (P + A);
          q.x.store(k.options, z, s), q.y.store(k.options, W, s), mr(L, [z, W]) || g.changed.push(D(k));
        }), d.updated.push(...w.map(D)), h.push({ kind: "arrange_nodes", target: { ids: w.map(D) }, layout: u.layout, ...u.gap !== void 0 ? { gap: A } : {} });
        return;
      }
      case "update_slate": {
        const v = u.changes, w = JSON.stringify(r);
        for (const [_, S] of Object.entries(bn))
          v[_] !== void 0 && S.store(r, v[_]);
        JSON.stringify(r) !== w && g.changed.push("slate"), h.push({ kind: "update_slate", changes: v });
        return;
      }
    }
  }), e.requireMatches && d.warnings.length) {
    const u = d.warnings[0];
    throw new pt("no_match", 409, u, { operation: Number(u.match(/^Operation (\d+)/)?.[1]) });
  }
  return d.unchanged = JSON.stringify(r) === c, { slate: r, materializedPlan: { message: t.message.trim(), operations: h }, report: d };
}
function ug(n, t) {
  const e = t.shape;
  if (!e || typeof e != "object" || n.shape !== "custom" || t.width !== void 0 && t.height !== void 0) return;
  const s = Zc(e);
  if (!s) return;
  const i = (o) => Math.round(Math.min(5e3, Math.max(20, o)));
  t.height !== void 0 ? n.width = i(Number(n.height) * s) : n.height = i(Number(n.width || 180) / s);
}
function Zc(n) {
  const t = uo(n);
  return t.ok && t.shape.aspect > 0 ? Math.min(10, Math.max(0.1, t.shape.aspect)) : 0;
}
[...Object.keys(q)];
function fg(n = {}, t = {}) {
  const e = mo(n), s = go(n), i = (d) => {
    const u = Ut(q[d].spec(e));
    return t.modelTool ? tm(u) : u;
  }, o = (d) => Object.fromEntries(d.map((u) => [u, i(u)])), r = (d) => Object.fromEntries(d.map((u) => [u, { ...i(u), description: q[u].description }])), a = (d) => Object.fromEntries(d.map((u) => [u, Ut(Ie[u].spec)])), c = Qm(), l = { type: "array", items: { type: "string" } }, h = Vc();
  return {
    type: "object",
    additionalProperties: !1,
    required: ["message", "operations"],
    properties: {
      message: {
        type: "string",
        description: "A concise, natural response describing exactly what will change. Do not claim an operation that is absent from operations."
      },
      operations: {
        type: "array",
        minItems: 1,
        maxItems: s.operationsPerPlan,
        // On the array as well as its items: a renderer that reads property descriptions only
        // (the exec declarations) still shows which fields each kind takes, and that add_nodes needs count.
        description: pg(s.notesPerAdd),
        items: {
          type: "object",
          additionalProperties: !1,
          required: ["kind"],
          description: `Fields by kind (any other field is refused). ${h}. add_nodes requires count.`,
          properties: {
            kind: { type: "string", enum: [...po], description: "Which operation this is; it decides the fields the operation may carry." },
            count: {
              type: "integer",
              minimum: 1,
              maximum: s.notesPerAdd,
              description: `add_nodes only, and required there: how many notes it adds, 1 to ${s.notesPerAdd}. With ids, count is normally ids.length (never fewer). Other kinds take no count.`
            },
            ...o(["shape", "text", "x", "y", "width", "height"]),
            preset: {
              type: "string",
              enum: [...$c],
              description: "add_nodes: text (no fill or border) or sticky (a sticky note), as the note toolbar makes them. Gives the shape when none is given."
            },
            ids: { ...l, description: "add_nodes and duplicate_nodes: new note ids (1 to 64 letters, digits, _ or -), which later operations in the plan may name. connect_nodes: ids for the new connectors, one per pair. An id already in use is refused." },
            connectionIds: {
              ...l,
              description: "disconnect_nodes and update_connections only: ids of connectors already on the slate. connect_nodes names its new connectors with ids, never connectionIds."
            },
            gap: { type: "number", minimum: 0, maximum: 2e3 },
            offset: { ...Ut({ type: "point" }), description: "duplicate_nodes: how far the copies sit from the notes copied; 20, 20 when left out." },
            placement: {
              type: "object",
              additionalProperties: !1,
              description: "add_nodes: where to put the notes. With x and y, only arrangement and gap apply. connect: true with relativeTo makes notes that copy that note's look and are joined to it, 75 from its edge, as the canvas's connection handles do.",
              properties: {
                relativeTo: { type: "string" },
                direction: { type: "string", enum: [...zc] },
                arrangement: { type: "string", enum: [...Bc] },
                gap: { type: "number", minimum: 0, maximum: 2e3 },
                connect: { type: "boolean" }
              }
            },
            // Not in a model's tool: a model asks the host's add-media action, which fetches and stores the poster.
            ...t.modelTool ? {} : { media: {
              type: "object",
              additionalProperties: !1,
              required: ["url"],
              description: "add_nodes, count 1, no shape, preset or text: a media note, a video from YouTube, Vimeo or Loom drawn as its poster with a play button; it plays where it sits when someone presses play, never on its own. Hosts add videos through their own add-media action, which fetches the title and stores the poster.",
              properties: {
                url: { type: "string", maxLength: Mt.urlLength, description: "The video's address." },
                title: { type: "string", maxLength: Mt.titleLength },
                author: { type: "string", maxLength: Mt.authorLength },
                start: { type: "integer", minimum: 1, maximum: Mt.startSeconds, description: "Where to start, in seconds." },
                poster: { type: "string", maxLength: Mt.urlLength, pattern: "^(https://\\S+|/[^/\\\\\\s]\\S*)$", description: "The poster picture: an https address, or a path on this app (/...)." },
                posterWidth: { type: "number", minimum: 1, maximum: 1e4 },
                posterHeight: { type: "number", minimum: 1, maximum: 1e4 }
              }
            } },
            style: {
              type: "object",
              additionalProperties: !1,
              description: "add_nodes: note keys for the new notes. connect_nodes: connector keys for the new connectors.",
              properties: { ...o(vc), ...a(Fc) }
            },
            target: c,
            from: c,
            to: {
              ...c,
              description: `${c.description} connect_nodes may instead give {point: {x, y}} for a connector with a free end.`,
              properties: { ...c.properties, point: Ut({ type: "point" }) }
            },
            layout: {
              type: "string",
              enum: [...Gc],
              description: "arrange_nodes: row, column, grid, circle; align-* and distribute-* as the canvas aligns by what you see; tidy moves notes apart until none overlaps; tree lays connected notes out in layers under their root."
            },
            changes: {
              type: "object",
              additionalProperties: !1,
              minProperties: 1,
              description: `update_nodes: note keys (and order: front or back). update_connections: connector keys. update_slate: ${Object.keys(bn).join(", ")}.`,
              properties: {
                ...r(Object.keys(q)),
                ...Object.fromEntries(Object.entries(Es).map(([d, u]) => [d, Ut(u.spec)])),
                ...a(Object.keys(Ie)),
                ...Object.fromEntries(
                  Object.entries(bn).map(([d, u]) => [d, d === "background" ? Vm() : d === "style" ? Zm() : Ut(u.spec)])
                )
              }
            }
          }
        }
      }
    }
  };
}
function Vc() {
  return po.map((n) => `${n}: ${Lc[n].filter((t) => t !== "kind").join(", ")}`).join("; ");
}
function pg(n = 20) {
  return [
    `The operations, applied in order. Each operation's kind decides which fields it may carry; any other field is refused. Fields by kind: ${Vc()}.`,
    `add_nodes requires count (1 to ${n}): one add_nodes may add several notes (count 3, ids ["a","b","c"]) or one (count 1, ids ["a"]).`,
    "connect_nodes names its new connectors with ids (one per pair); connectionIds is only for disconnect_nodes and update_connections.",
    'Examples: {"kind":"add_nodes","count":1,"ids":["title"],"shape":"rectangle","text":"Title","x":0,"y":0,"width":240,"height":80}; {"kind":"add_nodes","count":2,"ids":["a","b"],"shape":"rectangle","text":"Step","placement":{"relativeTo":"title","direction":"below","arrangement":"row"}}; {"kind":"connect_nodes","from":{"ids":["title"]},"to":{"ids":["a"]},"ids":["title-a"]}; {"kind":"update_nodes","target":{"ids":["a"]},"changes":{"text":"First step"}}.'
  ].join(" ");
}
Object.freeze({
  name: "applySlateOperations",
  description: "Edit the existing slate without starting a new slate, replacing its content, or changing its theme unless the user explicitly asked for that. Always include a natural completion message.",
  parameters: fg({}, { modelTool: !0 })
});
function br(n) {
  return new Map(n.nodes.map((t) => [t.options.id, t]));
}
function vr(n) {
  const t = /* @__PURE__ */ new Map();
  return n.nodes.forEach((e) => e.relationships.associations.forEach((s) => t.set(s.id, s))), t;
}
function mg(n, t, e) {
  const s = (a) => q[a].read(e), i = (...a) => a.some((c) => t[c] !== void 0), o = [];
  if (i("shape")) {
    const a = e.shape === "custom";
    o.push({
      type: "onNodeShapeChanged",
      data: a ? { id: n, shape: "custom", vectorPath: e.vectorPath, fillRule: e.fillRule, textBox: e.textBox ?? null, shapeRef: e.shapeRef } : { id: n, shape: s("shape"), vectorPath: e.vectorPath }
    });
  }
  i("backgroundColor", "opacity") && o.push({ type: "onNodeColorChanged", data: { id: n, color: e.backgroundColor, opacity: e.opacity, borderColor: e.borderColor } }), i("text", "fontFamily", "fontSize", "foregroundColor", "textOpacity", "textXAlign", "textYAlign") && o.push({
    type: "onNodeTextChanged",
    data: {
      id: n,
      ...i("text") ? { text: s("text") } : {},
      ...i("fontFamily") ? { fontFamily: s("fontFamily") } : {},
      ...i("fontSize") ? { fontSize: s("fontSize") } : {},
      ...i("foregroundColor") ? { fontColor: s("foregroundColor") } : {},
      ...i("textOpacity") ? { textOpacity: s("textOpacity") } : {},
      ...i("textXAlign") ? { textXAlign: s("textXAlign") } : {},
      ...i("textYAlign") ? { textYAlign: s("textYAlign") } : {}
    }
  });
  for (const a of ["borderColor", "borderWidth", "borderOpacity", "borderStyle"])
    i(a) && o.push({ type: "onNodeBorderPropertiesChanged", data: { id: n, prop: a, val: e[a] } });
  const r = i("shape") && t.shape && typeof t.shape == "object";
  if ((i("width", "height") || r) && o.push({ type: "onNodeResized", data: { id: n, width: e.width, height: e.height } }), i("x", "y") && o.push({ type: "onNodesMove", data: { dur: 350, nodes: [{ id: n, x: s("x"), y: s("y") }] } }), i("rotationAngle") && o.push({ type: "onNodeRotated", data: { id: n, rotationAngle: s("rotationAngle") } }), i("locked") && o.push({ type: s("locked") ? "onNodeLocked" : "onNodeUnlocked", data: { id: n } }), i("templateCategory", "hiddenControls")) {
    const a = {};
    if (i("templateCategory") && Object.assign(a, { isCategory: e.isCategory === !0, categoryName: e.categoryName ?? null }), i("hiddenControls")) for (const c of Object.values(mn)) a[c] = e[c] !== !1;
    o.push({ type: "onNodeOptionsChanged", data: { id: n, options: a } });
  }
  return i("animation") && o.push({ type: "onNodeEffectChanged", data: { id: n, filter: { apply: "vect", id: s("animation"), isAnimation: !0 } } }), i("effect") && o.push({ type: "onNodeEffectChanged", data: { id: n, filter: { apply: "vect", id: s("effect") } } }), i("link") && o.push(e.link ? { type: "onNodeLinkAdded", data: { id: n, link: { ...e.link } } } : { type: "onNodeLinkRemoved", data: { id: n } }), i("groupId") && o.push({ type: "onNodesMove", data: { dur: 0, nodes: [{ id: n, groupId: s("groupId") }] } }), o;
}
function Kc(n, t, e) {
  const s = br(t), i = br(e), o = vr(t), r = vr(e);
  switch (n.kind) {
    case "add_nodes":
    case "duplicate_nodes": {
      const a = (n.ids || []).filter((h) => !s.has(h) && i.has(h)), c = new Set(a), l = [...r.values()].filter((h) => !o.has(h.id) && c.has(h.childId));
      return [
        ...a.map((h) => ({ type: "onNodeAdded", data: { nodeOptions: { ...i.get(h).options } } })),
        ...l.map((h) => ({ type: "addRelationship", data: { ...h } }))
      ];
    }
    case "update_nodes": {
      const a = (n.target?.ids || []).filter((h) => i.has(h)), c = a.flatMap((h) => mg(h, n.changes || {}, i.get(h).options)), l = n.changes?.order;
      return l && a.length && c.push({ type: l === "front" ? "onNodeToFront" : "onNodeToBack", data: { id: a[0], order: e.nodes.map((h) => h.options.id) } }), c;
    }
    case "delete_nodes":
      return (n.target?.ids || []).map((a) => ({ type: "onNodeDeleted", data: { id: a } }));
    case "connect_nodes":
      return (n.ids || []).filter((a) => !o.has(a) && r.has(a)).map((a) => ({ type: "addRelationship", data: { ...r.get(a) } }));
    case "disconnect_nodes":
      return (n.connectionIds || []).flatMap((a) => {
        const c = o.get(a);
        return c ? [{ type: "removeRelationship", data: { id: a, parentId: c.parentId, childId: c.childId } }] : [];
      });
    case "update_connections":
      return (n.connectionIds || []).flatMap((a) => {
        const c = r.get(a), l = o.get(a);
        if (!c) return [];
        const h = n.changes || {};
        if (["toNote", "fromNote", "toPoint", "fromPoint"].some((f) => h[f] !== void 0) && l)
          return [
            { type: "removeRelationship", data: { id: a, parentId: l.parentId, childId: l.childId } },
            { type: "addRelationship", data: { ...c } }
          ];
        const u = Object.keys(h).flatMap(
          (f) => f === "ends" ? ["sourceAnchor", "targetAnchor"] : f === "fromEnd" ? ["sourceAnchor"] : f === "toEnd" ? ["targetAnchor"] : [f]
        );
        return [...new Set(u)].map((f) => ({
          type: "onLinePropertiesChanged",
          data: { id: c.parentId, associationId: a, prop: f, val: c[f] ?? null }
        }));
      });
    case "arrange_nodes": {
      const a = (n.target?.ids || []).flatMap((c) => {
        const l = i.get(c);
        return l ? [{ id: c, x: q.x.read(l.options), y: q.y.read(l.options) }] : [];
      });
      return a.length ? [{ type: "onNodesMove", data: { dur: 450, nodes: a } }] : [];
    }
    case "update_slate": {
      const a = n.changes || {}, c = [], l = e.options;
      if (a.name !== void 0 && c.push({ type: "onSlateNameChanged", data: { name: e.options.name } }), a.description !== void 0 && c.push({ type: "onSlateDescriptionChanged", data: { description: e.options.description } }), a.background !== void 0) {
        const h = Yc(a.background);
        c.push({
          type: "onSlateBackgroundColorChanged",
          data: {
            color: h.backgroundColor,
            asGradient: h.backgroundColorAsGradient,
            gradientType: h.backgroundGradientType,
            gradientColors: h.backgroundGradientColors,
            gradientStrategy: h.backgroundGradientStrategy
          }
        });
      }
      return a.mindMapMode !== void 0 && c.push({ type: "onSlateMindMapModeChanged", data: { mindMapMode: l.mindMapMode } }), a.autoResizeNodesBasedOnText !== void 0 && c.push({ type: "onSlateAutoResizeNodesBasedOnTextChanged", data: { autoResizeNodesBasedOnText: l.autoResizeNodesBasedOnText } }), a.showGrid !== void 0 && c.push({ type: "onSlateShowGridChanged", data: { showGrid: l.viewPort.showGrid } }), a.snapToObjects !== void 0 && c.push({ type: "onSlateSnapToObjectsChanged", data: { snapToObjects: l.viewPort.snapToObjects } }), a.defaultLineColor !== void 0 && c.push({ type: "onLineColorChanged", data: { color: l.defaultLineColor } }), c;
    }
  }
  return [];
}
function gg(n, t, {
  userMessage: e = "",
  replay: s = !1,
  send: i = !0,
  as: o,
  ...r
} = {}) {
  let a = Wc(n);
  const c = yr(a, t, { userMessage: e, replay: s, ...r }), l = [];
  for (const y of c.materializedPlan.operations) {
    const b = yr(a, { message: t.message, operations: [y] }, { userMessage: e, replay: !0, ...r }).slate, x = Kc(y, a, b), C = new Set(a.nodes.map((v) => v.options.id));
    l.push({ packages: x, created: b.nodes.map((v) => v.options.id).filter((v) => !C.has(v)) }), a = b;
  }
  const h = n.v2 ?? n, d = (y) => y.map((b) => h.nodes?.one?.(b)).filter((b) => b?.ready && !b.relationships), u = (y) => {
    y.packages.length && n.collab.invoke(y.packages);
    const b = d(y.created);
    return b.length ? Promise.all(b.map((x) => x.ready)) : null;
  }, f = () => {
    let y = null;
    for (const b of l)
      y ? y = y.then(() => u(b)) : y = u(b);
    return (y ?? Promise.resolve()).then(() => {
    });
  }, p = o ?? (i ? null : "others");
  let m;
  p === "others" && typeof h.othersChange == "function" ? m = h.othersChange(f) : p === "own" && typeof h.ownStep == "function" ? m = h.ownStep(f) : m = f();
  const g = l.flatMap((y) => y.packages);
  return i && g.length && n.collab.send(g), {
    message: c.materializedPlan.message,
    report: c.report,
    materializedPlan: c.materializedPlan,
    applied: m
  };
}
const Gg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  applySlateOperations: gg,
  packagesForOperation: Kc
}, Symbol.toStringTag, { value: "Module" }));
class me {
  constructor(t = {}) {
    this.optionState = { id: ie(), ...t }, this.options = new Proxy(this.optionState, {
      get: (e, s, i) => {
        if (typeof s != "string" || !this.v2)
          return Reflect.get(e, s, i);
        const o = nt(this.v2.options || {});
        return Object.prototype.hasOwnProperty.call(o, s) ? o[s] : Reflect.get(e, s, i);
      },
      set: (e, s, i, o) => {
        const r = Reflect.set(e, s, i, o);
        return r && typeof s == "string" && this.v2 && Object.assign(this.v2.options, ve({ [s]: i })), r;
      },
      deleteProperty: (e, s) => {
        const i = Reflect.deleteProperty(e, s);
        if (i && typeof s == "string" && this.v2) {
          const o = {
            xPos: "x",
            yPos: "y",
            foregroundColor: "fontColor",
            shapeHint: "shape",
            svgString: "svgContent"
          }[s] || s;
          delete this.v2.options[o];
        }
        return i;
      },
      ownKeys: (e) => {
        if (!this.v2) return Reflect.ownKeys(e);
        const s = Reflect.ownKeys(nt(this.v2.options || {}));
        return Array.from(/* @__PURE__ */ new Set([...Reflect.ownKeys(e), ...s]));
      },
      getOwnPropertyDescriptor: (e, s) => {
        const i = Reflect.getOwnPropertyDescriptor(e, s);
        if (i || !this.v2 || typeof s != "string")
          return i;
        const o = nt(this.v2.options || {});
        if (Object.prototype.hasOwnProperty.call(o, s))
          return { configurable: !0, enumerable: !0, writable: !0 };
      }
    }), this.resize = new yg(this), this.relationships = new bg(this);
  }
  /**
   * v1: `node.png(withNodes?, cb)` — export this node (or the given group of
   * node ids) as a transparent-background PNG blob.
   */
  png(t, e) {
    const s = typeof t == "function" ? t : e, i = Array.isArray(t) ? t : void 0, o = this.v2;
    if (!o || !s) return;
    const r = i && i.length > 0 ? i : [o.id];
    o.slate.png(
      { nodes: r, noBackground: !0, asBinary: !0 },
      (a) => s(a)
    );
  }
  /** v1: `node.svg(withNodes?, cb)` — same as png but returns the SVG string. */
  svg(t, e) {
    const s = typeof t == "function" ? t : e, i = Array.isArray(t) ? t : void 0, o = this.v2;
    if (!o || !s) return;
    const r = i && i.length > 0 ? i : [o.id];
    o.slate.svg(
      { nodes: r, noBackground: !0 },
      (a) => s(a)
    );
  }
  /**
   * v1 API: position the node. `position('center')` centers it in the current
   * viewport (used right after adding a node from the shape palette);
   * `position({x, y})` / `position(x, y)` sets an explicit position. Before the
   * node is added (no v2 yet) this just stashes coordinates on options.
   */
  position(t, e) {
    const s = this.v2, i = t && typeof t == "object" ? { x: t.x, y: t.y } : typeof t == "number" ? { x: t, y: e } : null;
    if (!s)
      return i && (this.options.x = i.x, this.options.y = i.y), this;
    if (i && i.x != null && i.y != null)
      return s.position(i.x, i.y), this;
    try {
      const r = s.slate?.canvas?.node?.getAttribute?.("viewBox");
      if (r) {
        const a = String(r).split(/[\s,]+/).map(Number);
        if (a.length === 4 && a.every((c) => !isNaN(c))) {
          const c = a[0] + a[2] / 2, l = a[1] + a[3] / 2, h = s.options.width || 0, d = s.options.height || 0;
          s.position(c - h / 2, l - d / 2);
        }
      }
    } catch {
    }
    return this;
  }
}
class yg {
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
class bg {
  constructor(t) {
    this.owner = t;
  }
  /** v1: `node.relationships.addAssociation(childNode, data?)` */
  addAssociation(t, e) {
    if (!this.owner.v2)
      throw new Error(
        "SLATEBOX_COMPAT: add the node to a slate before creating associations"
      );
    const s = t instanceof me ? t.v2 : t;
    if (!s)
      throw new Error(
        "SLATEBOX_COMPAT: child node must be added to the slate first"
      );
    return this.owner.v2.relationships?.addAssociation(s, e);
  }
  /** v1: `.associations` — array with live parent/child wrapper references */
  get associations() {
    const t = this.owner.v2, e = this.owner.slate;
    return !t || !e ? [] : (t.relationships?.getAssociations?.() ?? []).map((i) => ({
      ...i,
      parent: e.nodes.one(i.parentId),
      child: e.nodes.one(i.childId)
    }));
  }
}
class vg {
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
    const e = t instanceof me ? t : new me(t), s = ve(e.options), i = this.v2Slate.addNode(s);
    return e.v2 = i, e.slate = this.owner, this.wrappers.set(i.id, e), e;
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
    const e = this.v2Slate.nodes.allNodes, s = [], i = {}, o = {};
    return e.forEach((r) => {
      const a = r.options || {}, c = nt(a);
      (r.relationships?.getAssociations?.() ?? []).forEach((h) => {
        s.push({
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
      }), i[r.id] || (i[r.id] = {
        width: +(a.width || 0),
        height: +(a.height || 0),
        shape: c.shapeHint || a.shape || "rect",
        color: a.backgroundColor,
        textColor: c.foregroundColor ?? a.fontColor,
        text: a.text,
        groupId: a.groupId ?? null
      });
      const l = String(a.groupId ?? "null");
      o[l] || (o[l] = []), o[l].push(r.id);
    }), {
      layoutType: this.owner.options.layoutType,
      associations: s,
      nodes: i,
      uniqueIds: Object.keys(i),
      subgraphs: o
    };
  }
  /**
   * v1: `slate.nodes.applyLayout(layout, cbOrOpts?)` — layout is the server
   * response `{exportNodes: {id: {x, y}}}` with stringly coordinates.
   */
  applyLayout(t, e) {
    const s = this.v2Slate, i = t?.exportNodes || {}, o = typeof e == "function" ? e : void 0, r = typeof e == "object" ? e : {}, a = Object.keys(i).filter((c) => s.nodes.one(c)).map((c) => ({
      id: c,
      x: parseFloat(i[c].x),
      y: parseFloat(i[c].y)
    }));
    s.applyLayout(a, o), r.skipCenter || s.centerContent();
  }
  /**
   * v1: `slate.nodes.nodeMovePackage({dur, moves: [{id, x: dx, y: dy}]})` —
   * moves are RELATIVE deltas; the returned package carries the resulting
   * ABSOLUTE positions in v1 shape, ready for `collab.exe({type:'onNodesMove'})`.
   */
  nodeMovePackage(t = {}) {
    const e = this.v2Slate, s = new Map((t.moves || []).map((o) => [o.id, o])), i = t.nodes ? t.nodes.map((o) => o instanceof me ? o.v2 : o).filter(Boolean) : t.moves ? t.moves.map((o) => e.nodes.one(o.id)).filter(Boolean) : e.nodes.allNodes;
    return {
      dur: t.dur ?? 300,
      easing: t.easing ?? ">",
      textPositions: i.map((o) => ({
        id: o.id,
        textPosition: { x: 0, y: 0, transform: "" }
      })),
      nodeOptions: i.map((o) => {
        const r = s.get(o.id), a = nt(o.options || {});
        return {
          id: o.id,
          vectorPath: a.vectorPath,
          xPos: (a.xPos ?? 0) + (r?.x ?? 0),
          yPos: (a.yPos ?? 0) + (r?.y ?? 0)
        };
      }),
      associations: i.flatMap(
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
    return e || (e = new me({ ...t.options }), e.options.id = t.id, this.wrappers.set(t.id, e)), e.v2 = t, e.slate = this.owner, e;
  }
}
class wg {
  constructor(t = {}, e = {}) {
    this.savingTemplateImage = !1, this.options = {
      ...t,
      id: t.id || ie()
    }, this.events = e || {}, this._shareId = this.options.shareId || ie(), this.nodes = new vg(this), this.controller = {
      scaleToFitAndCenter: (s) => {
        this.assertReady(), this.v2.fitToContent(), s?.();
      }
    }, this.canvas = {
      hideBg: () => {
        this.assertReady();
        const s = this.v2.element;
        s && (s.style.backgroundColor = "transparent", s.style.backgroundImage = "none");
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
  /** The eased camera (Prezi flights, roll, cuts) of the live slate. */
  get camera() {
    return this.v2?.camera;
  }
  /** Resolve v1 `options.container` (id string or element) to an HTMLElement. */
  resolveContainer() {
    const t = this.options.container;
    if (t && typeof t != "string")
      return t;
    if (typeof t == "string" && t.length > 0) {
      const e = document.getElementById(t);
      if (e) return e;
      const s = document.querySelector(t);
      if (s) return s;
      throw new Error(
        `SLATEBOX_COMPAT: container "${t}" not found in document`
      );
    }
    throw new Error("SLATEBOX_COMPAT: options.container is required");
  }
  /** v1: async init resolving to the slate itself. */
  async init() {
    const t = this.resolveContainer(), e = to(this.options);
    delete e.container, this.options.shareId === void 0 && (e.shareId = this._shareId), e.events = this.events, this.v2 = new gn(t, e), await this.v2.getViewportAsync(), this.options.viewPort || (this.options.viewPort = {});
    const s = {
      ...this.options.viewPort.zoom || {}
    };
    if (Object.defineProperty(s, "r", {
      enumerable: !0,
      get: () => {
        try {
          return this.v2?.getZoom() || 1;
        } catch {
          return 1;
        }
      }
    }), this.options.viewPort.zoom = s, (this.options.allowCollaboration ?? !0) && this.events.onInitCollaboration) {
      const i = this.v2;
      i.deferEmits?.(), setTimeout(() => {
        (i?.collab?.init({ roomName: this.options.id }) ?? Promise.resolve()).catch(
          (r) => console.warn("SLATEBOX_COMPAT: collab init failed", r)
        ).finally(() => i?.flushEmits?.());
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
    const e = this.v2?.options;
    if (e) {
      const s = this.options.viewPort;
      this.options = { ...this.options, ...e }, s && (this.options.viewPort = s);
    }
  }
  /**
   * Lifecycle: `slate.destroy()` — tears down the slate. Delegates to the v2
   * Slate's destroy(), which deregisters from `window.__slateboxInstances`,
   * disconnects the ResizeObserver, clears all timers/intervals, removes the
   * canvas handler, and chains destroy to sub-modules (panZoom/zoomSlider/…).
   *
   * The host app MUST call this when unmounting a canvas (React unmount / route
   * change) — otherwise every navigation LEAKS a Slate: its timers, observers,
   * and `__slateboxInstances` entry persist (the array grows unbounded across
   * navigations). Best-effort: safe to call more than once and before ready.
   */
  destroy() {
    try {
      this.v2?.destroy();
    } catch {
    }
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
      availableFilters: pc(),
      availableAnimations: lo()
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
   * Undo and redo of this person's own steps, on the engine's history (Slate.undo and the
   * rest): the same methods on this facade as on the engine's slate, so a host can use either.
   */
  undo() {
    return this.assertReady(), this.v2.undo?.() ?? !1;
  }
  redo() {
    return this.assertReady(), this.v2.redo?.() ?? !1;
  }
  canUndo() {
    return this.assertReady(), !!this.v2.canUndo?.();
  }
  canRedo() {
    return this.assertReady(), !!this.v2.canRedo?.();
  }
  undoRedoState() {
    return this.assertReady(), this.v2.undoRedoState?.() ?? { canUndo: !1, canRedo: !1, undoLabel: null, redoLabel: null };
  }
  onUndoRedo(t) {
    return this.assertReady(), this.v2.onUndoRedo?.(t) ?? (() => {
    });
  }
  recordHostStep(t) {
    this.assertReady(), this.v2.recordHostStep?.(t);
  }
  othersChange(t) {
    this.assertReady();
    const e = this.v2;
    return typeof e.othersChange == "function" ? e.othersChange(t) : Promise.resolve(t());
  }
  ownStep(t) {
    this.assertReady();
    const e = this.v2;
    return typeof e.ownStep == "function" ? e.ownStep(t) : Promise.resolve(t());
  }
  /**
   * Grouping/locking controls used by the canonical app. These deliberately
   * live on the facade so hosts never need to discover the active engine via
   * the internal `window.__slateboxInstances` lifecycle registry.
   *
   * Event callbacks such as `onGroupSelection` carry live v2 nodes, while
   * older integrations may pass facade node wrappers. Accept both shapes and
   * delegate the actual mutation to the engine so persistence, collaboration,
   * and undo continue through the normal `onNodesMove` path.
   */
  groupNodes(t) {
    return this.assertReady(), this.v2.groupNodes(this.unwrapNodes(t));
  }
  ungroupNodes(t) {
    this.assertReady(), this.v2.ungroupNodes(this.unwrapNodes(t));
  }
  lockNodes(t) {
    this.assertReady(), this.v2.lockNodes(this.unwrapNodes(t));
  }
  unlockNodes(t) {
    this.assertReady(), this.v2.unlockNodes(this.unwrapNodes(t));
  }
  isSelectionLocked(t) {
    return this.assertReady(), this.v2.isSelectionLocked(this.unwrapNodes(t));
  }
  /**
   * Multi-node arrangement (F2, Nov 16): expose align/distribute on the v1
   * facade so app-level selection toolbars can drive the same rotation-aware
   * engine path the v2 context menu uses (undo/persist/collab via the normal
   * onNodesMove flow). `nodes` accepts facade wrappers or live v2 nodes.
   */
  alignNodes(t, e) {
    this.assertReady(), this.v2.alignNodes(t, this.unwrapNodes(e));
  }
  distributeNodes(t, e) {
    this.assertReady(), this.v2.distributeNodes(t, this.unwrapNodes(e));
  }
  /**
   * Optimize Layout: the engine's tidy layout over every note, saved as one
   * move. The app's Settings button and AI layout call this on the facade.
   */
  removeLayoutOverlaps(t) {
    this.assertReady(), this.v2.removeLayoutOverlaps(t);
  }
  /**
   * For a host that draws its own context toolbar (`contextToolbar: 'host'`,
   * events.onSelectionFrame): what is selected and where it is on screen now.
   * The same answer as the v2 engine's `getSelectionFrame()`.
   */
  getSelectionFrame() {
    return this.assertReady(), this.v2.getSelectionFrame();
  }
  /** The line selected on the canvas (owning note and its association), or null. */
  getSelectedLine() {
    return this.assertReady(), this.v2.getSelectedLine();
  }
  /** Delete the selected notes, as the Delete key does. */
  deleteSelection() {
    this.assertReady(), this.v2.deleteSelection();
  }
  /** Duplicate the selected notes, as the right-click menu does. */
  duplicateSelection() {
    this.assertReady(), this.v2.duplicateSelection();
  }
  /** Remove the line selected on the canvas, as the engine's own pill would. */
  removeSelectedLine() {
    return this.assertReady(), this.v2.removeSelectedLine();
  }
  unwrapNodes(t) {
    if (t)
      return t.map(
        (e) => e instanceof me ? e.v2 : e
      ).filter((e) => !!e);
  }
  /**
   * v1: `slate.disable(exemptSlate?, exemptNodes?, full?)` — freeze
   * interactions (used when the app opens read-only/embedded views).
   */
  disable(t, e, s) {
    this.assertReady();
    const i = this.v2;
    e || i.nodes.allNodes.forEach((o) => o.lock?.()), t || (this.options.enabled = !1, this.options.allowDrag = !1, i.disablePanZoom?.(), s && (i.birdsEye?.disable?.(), i.zoomSlider?.disable?.()));
  }
  /** v1: `slate.enable(exemptSlate?, exemptNodes?)` — reverse of disable() */
  enable(t, e) {
    this.assertReady();
    const s = this.v2;
    e || s.nodes.allNodes.forEach((i) => {
      i.options?.isLocked || i.unlock?.();
    }), t || (this.options.enabled = !0, this.options.allowDrag = !0, s.enablePanZoom?.());
  }
  /** v1: `slate.png({base64: true}, cb)` — thumbnail export */
  png(t, e) {
    return this.assertReady(), this.v2.png(t, e);
  }
  assertReady() {
    if (!this.v2)
      throw new Error("SLATEBOX_COMPAT: slate.init() must complete before use");
  }
}
const Qt = class Qt {
  constructor(t) {
    this.registerPlugins(t);
  }
  registerPlugins(t) {
    const e = this.constructor.name, s = Qt.availablePlugins[e];
    s && s.forEach(({ name: i, plugin: o }) => {
      this.plugins || (this.plugins = {}), this.plugins[i] = new o(t);
    });
  }
  static registerPlugin(t) {
    if (!t?.name || !t?.plugin)
      throw new Error(
        "Plugins must provide a name and a plugin (class definition)"
      );
    const e = Object.getPrototypeOf(t.plugin).name;
    Qt.availablePlugins[e] || (Qt.availablePlugins[e] = []), Qt.availablePlugins[e] = [...Qt.availablePlugins[e], t];
  }
};
Qt.availablePlugins = {};
let Ai = Qt;
const xg = {
  slate: wg,
  node: me,
  base: Ai,
  utils: Hf
}, _g = 3e3;
function Sg(n) {
  return n.origin === "invited" && n.invitedBy ? "added by " + jt(n.invitedBy) : n.origin === "visiting" && n.via ? "via " + jt(n.via) : "";
}
function $g(n, t = 56) {
  const e = jt(n.label), s = Sg(n), i = n.origin === "visiting" && n.via && e.endsWith("· " + jt(n.via));
  return Mg(s && !i && !e.includes(s) ? e + " · " + s : e, t);
}
function Hg(n) {
  if (typeof n != "string" || n.length > 2e5) return null;
  if (/^data:image\/(png|jpeg|gif|webp);base64,[A-Za-z0-9+/=]+$/.test(n)) return n;
  try {
    const t = new URL(n);
    return t.protocol === "https:" ? t.href : null;
  } catch {
    return null;
  }
}
function Fg(n, t) {
  const e = jt(n.say ?? ""), s = fe(n.sayAt ?? null);
  return !e || s === null || t < s || t >= s + _g ? null : e;
}
const Ug = Object.freeze(["#6d28d9", "#0f766e", "#a16207", "#be185d", "#1d4ed8", "#4d7c0f"]), Cg = 6e3, Eg = 600, Ag = 6, Tg = { todo: "○", doing: "◌", done: "✓", skipped: "–", stopped: "■" };
function fe(n) {
  if (n == null) return null;
  const t = n instanceof Date ? n.getTime() : typeof n == "number" ? n : Date.parse(n);
  return Number.isFinite(t) ? t : null;
}
const Mg = (n, t) => n.length > t ? n.slice(0, t - 1).trimEnd() + "…" : n, jt = (n) => String(n ?? "").replace(/[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u180e\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g, "").replace(/\s+/g, " ").trim(), kg = (n) => (n.targets ?? []).some((t) => typeof t == "string" && t.startsWith("ghost-")), wr = "Suggesting…", Ng = "Waiting for you";
function jg(n, { landing: t = !1 } = {}) {
  const e = n.plan?.steps ?? [], s = e.findIndex((o) => o.status === "stopped");
  if (s >= 0) return "Stopped: " + jt(e[s].text);
  if (t) return wr;
  if (n.waiting) return Ng;
  if (n.status === "live" && fe(n.endedAt ?? null) === null && kg(n)) return wr;
  if (e.length) {
    const o = e.findIndex((a) => a.status === "doing");
    if (e.every((a) => a.status === "done" || a.status === "skipped")) return "Done";
    const r = o >= 0 ? o : Math.min(Math.max(n.plan.current ?? 0, 0), e.length - 1);
    return jt(e[r].text);
  }
  return jt(n.message ?? "") || null;
}
function Yg(n) {
  return (n.plan?.steps ?? []).map((t) => Tg[t.status] + " " + (t.status === "stopped" ? "Stopped: " : "") + jt(t.text));
}
function Xg(n, t, { holdMs: e = Cg, fadeMs: s = Eg, max: i = Ag } = {}) {
  const o = [];
  for (const r of n) {
    if (!r || typeof r.agentKey != "string") continue;
    const a = fe(r.expiresAt), c = fe(r.endedAt);
    if (r.status === "live" && c === null) {
      if (a === null || t >= a) continue;
      o.push({ record: r, opacity: 1, until: a });
      continue;
    }
    const h = (c ?? fe(r.updatedAt) ?? t) + e;
    t >= h + s || o.push({ record: r, opacity: t <= h ? 1 : 1 - (t - h) / s, until: h + s });
  }
  return o.sort((r, a) => (fe(a.record.updatedAt) ?? 0) - (fe(r.record.updatedAt) ?? 0)), o.slice(0, i);
}
function Rg(n, t = {}) {
  return new gn(n, t);
}
typeof window < "u" && (window.SlateboxJS = Rg, window.Slate = gn, window.Node = Cs, window.PanZoom = wc, window.ResizeRotate = za, window.BirdsEye = Ya, window.Connector = Ba, window.Serialization = gf, window.ShapeRegistry = lf, window.Relationship = Ku, window.Relationships = Ga, window.FontLoader = dp, window.Images = $a, window.Editor = lc, window.UndoRedo = Et, window.MultiSelection = xc, window.Grid = _c, window.Menu = mc, window.Keyboard = es, window.ContextMenu = ic, window.Filters = fc, window.Links = hc, window.MediaNote = rc, window.MediaInput = sc, window.Export = gm, window.Collab = Ac, window.Layout = Sm, window.ZoomSlider = Ic, window.Comments = Im, window.Presentation = oc, window.Slatebox = Object.assign({}, xg, { compat: ff }));
export {
  Ug as AGENT_PALETTE,
  _g as AGENT_SAY_MS,
  Ya as BirdsEye,
  km as Camera,
  Ac as Collab,
  Im as Comments,
  Ba as Connector,
  ic as ContextMenu,
  Ce as DEFAULT_NOTE_STYLE,
  lc as Editor,
  gm as ExportModule,
  Ko as FREE_NODE,
  fc as Filters,
  dp as FontLoader,
  Jo as GOVERNED_NODE,
  _c as Grid,
  $a as Images,
  lm as Invoker,
  es as Keyboard,
  Sm as Layout,
  hc as Links,
  Ig as MEDIA_FRAME_ORIGINS,
  Ve as MEDIA_NOTE_SIZE,
  vf as MEDIA_PROVIDERS,
  sc as MediaInput,
  rc as MediaNote,
  mc as Menu,
  xc as MultiSelection,
  Cs as Node,
  Zp as NodesManager,
  wc as PanZoom,
  oc as Presentation,
  Ku as Relationship,
  Ga as Relationships,
  za as ResizeRotate,
  gf as Serialization,
  lf as ShapeRegistry,
  gn as Slate,
  Gg as SlateOperations,
  xg as Slatebox,
  Rg as SlateboxJS,
  Et as UndoRedo,
  Ic as ZoomSlider,
  Yg as agentChecklist,
  $g as agentName,
  Sg as agentOrigin,
  Fg as agentSaying,
  jg as agentStepText,
  Am as cameraBetween,
  Em as cameraFor,
  ff as compat,
  Rg as default,
  Mm as flightDuration,
  zg as getFilterNames,
  Lp as hitTestNodeBoxes,
  Dg as isMediaUrl,
  Af as mediaEmbedUrl,
  In as mediaLabel,
  _s as parseMediaUrl,
  Lg as registerFilter,
  Hg as safeIconUrl,
  Hf as utils,
  Tm as viewboxFor,
  Xg as visibleAgents
};
//# sourceMappingURL=slateboxjs.mjs.map
