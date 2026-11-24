var lr = Object.create, Je = Object.defineProperty, cr = Object.getOwnPropertyDescriptor, hr = Object.getOwnPropertyNames, dr = Object.getPrototypeOf, ur = Object.prototype.hasOwnProperty, T = (n, t) => () => (t || (n((t = { exports: {} }).exports, t), n = null), t.exports), le = (n, t) => {
  let e = {};
  for (var i in n)
    Je(e, i, {
      get: n[i],
      enumerable: !0
    });
  return Je(e, Symbol.toStringTag, { value: "Module" }), e;
}, fr = (n, t, e, i) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (var s = hr(t), o = 0, r = s.length, a; o < r; o++)
      a = s[o], !ur.call(n, a) && a !== e && Je(n, a, {
        get: ((l) => t[l]).bind(null, a),
        enumerable: !(i = cr(t, a)) || i.enumerable
      });
  return n;
}, pr = (n, t, e) => (e = n != null ? lr(dr(n)) : {}, fr(Je(e, "default", {
  value: n,
  enumerable: !0
}), n));
const Hn = {}, Rs = [];
function I(n, t) {
  if (Array.isArray(n)) {
    for (const e of n) I(e, t);
    return;
  }
  if (typeof n == "object") {
    for (const e in n) I(e, n[e]);
    return;
  }
  ks(Object.getOwnPropertyNames(t)), Hn[n] = Object.assign(Hn[n] || {}, t);
}
function rt(n) {
  return Hn[n] || {};
}
function mr() {
  return [...new Set(Rs)];
}
function ks(n) {
  Rs.push(...n);
}
var Bt = /* @__PURE__ */ T((n, t) => {
  t.exports = function(e) {
    try {
      return !!e();
    } catch {
      return !0;
    }
  };
}), pn = /* @__PURE__ */ T((n, t) => {
  var e = Bt();
  t.exports = !e(function() {
    var i = function() {
    }.bind();
    return typeof i != "function" || i.hasOwnProperty("prototype");
  });
}), qt = /* @__PURE__ */ T((n, t) => {
  var e = pn(), i = Function.prototype, s = i.call, o = e && i.bind.bind(s, s);
  t.exports = e ? o : function(r) {
    return function() {
      return s.apply(r, arguments);
    };
  };
}), Ns = /* @__PURE__ */ T((n, t) => {
  var e = qt();
  t.exports = e({}.isPrototypeOf);
}), Ct = /* @__PURE__ */ T((n, t) => {
  var e = function(i) {
    return i && i.Math === Math && i;
  };
  t.exports = e(typeof globalThis == "object" && globalThis) || e(typeof window == "object" && window) || e(typeof self == "object" && self) || e(typeof global == "object" && global) || e(typeof n == "object" && n) || /* @__PURE__ */ function() {
    return this;
  }() || Function("return this")();
}), gr = /* @__PURE__ */ T((n, t) => {
  var e = pn(), i = Function.prototype, s = i.apply, o = i.call;
  t.exports = typeof Reflect == "object" && Reflect.apply || (e ? o.bind(s) : function() {
    return o.apply(s, arguments);
  });
}), mn = /* @__PURE__ */ T((n, t) => {
  var e = qt(), i = e({}.toString), s = e("".slice);
  t.exports = function(o) {
    return s(i(o), 8, -1);
  };
}), Ps = /* @__PURE__ */ T((n, t) => {
  var e = mn(), i = qt();
  t.exports = function(s) {
    if (e(s) === "Function") return i(s);
  };
}), Ht = /* @__PURE__ */ T((n, t) => {
  var e = typeof document == "object" && document.all;
  t.exports = typeof e > "u" && e !== void 0 ? function(i) {
    return typeof i == "function" || i === e;
  } : function(i) {
    return typeof i == "function";
  };
}), Pe = /* @__PURE__ */ T((n, t) => {
  var e = Bt();
  t.exports = !e(function() {
    return Object.defineProperty({}, 1, { get: function() {
      return 7;
    } })[1] !== 7;
  });
}), ci = /* @__PURE__ */ T((n, t) => {
  var e = pn(), i = Function.prototype.call;
  t.exports = e ? i.bind(i) : function() {
    return i.apply(i, arguments);
  };
}), yr = /* @__PURE__ */ T((n) => {
  var t = {}.propertyIsEnumerable, e = Object.getOwnPropertyDescriptor, i = e && !t.call({ 1: 2 }, 1);
  n.f = i ? function(o) {
    var r = e(this, o);
    return !!r && r.enumerable;
  } : t;
}), Ds = /* @__PURE__ */ T((n, t) => {
  t.exports = function(e, i) {
    return {
      enumerable: !(e & 1),
      configurable: !(e & 2),
      writable: !(e & 4),
      value: i
    };
  };
}), br = /* @__PURE__ */ T((n, t) => {
  var e = qt(), i = Bt(), s = mn(), o = Object, r = e("".split);
  t.exports = i(function() {
    return !o("z").propertyIsEnumerable(0);
  }) ? function(a) {
    return s(a) === "String" ? r(a, "") : o(a);
  } : o;
}), Os = /* @__PURE__ */ T((n, t) => {
  t.exports = function(e) {
    return e == null;
  };
}), hi = /* @__PURE__ */ T((n, t) => {
  var e = Os(), i = TypeError;
  t.exports = function(s) {
    if (e(s)) throw new i("Can't call method on " + s);
    return s;
  };
}), Is = /* @__PURE__ */ T((n, t) => {
  var e = br(), i = hi();
  t.exports = function(s) {
    return e(i(s));
  };
}), De = /* @__PURE__ */ T((n, t) => {
  var e = Ht();
  t.exports = function(i) {
    return typeof i == "object" ? i !== null : e(i);
  };
}), di = /* @__PURE__ */ T((n, t) => {
  t.exports = {};
}), vr = /* @__PURE__ */ T((n, t) => {
  var e = di(), i = Ct(), s = Ht(), o = function(r) {
    return s(r) ? r : void 0;
  };
  t.exports = function(r, a) {
    return arguments.length < 2 ? o(e[r]) || o(i[r]) : e[r] && e[r][a] || i[r] && i[r][a];
  };
}), wr = /* @__PURE__ */ T((n, t) => {
  var e = Ct().navigator, i = e && e.userAgent;
  t.exports = i ? String(i) : "";
}), xr = /* @__PURE__ */ T((n, t) => {
  var e = Ct(), i = wr(), s = e.process, o = e.Deno, r = s && s.versions || o && o.version, a = r && r.v8, l, c;
  a && (l = a.split("."), c = l[0] > 0 && l[0] < 4 ? 1 : +(l[0] + l[1])), !c && i && (l = i.match(/Edge\/(\d+)/), (!l || l[1] >= 74) && (l = i.match(/Chrome\/(\d+)/), l && (c = +l[1]))), t.exports = c;
}), Ls = /* @__PURE__ */ T((n, t) => {
  var e = xr(), i = Bt(), s = Ct().String;
  t.exports = !!Object.getOwnPropertySymbols && !i(function() {
    var o = Symbol("symbol detection");
    return !s(o) || !(Object(o) instanceof Symbol) || !Symbol.sham && e && e < 41;
  });
}), zs = /* @__PURE__ */ T((n, t) => {
  var e = Ls();
  t.exports = e && !Symbol.sham && typeof Symbol.iterator == "symbol";
}), Gs = /* @__PURE__ */ T((n, t) => {
  var e = vr(), i = Ht(), s = Ns(), o = zs(), r = Object;
  t.exports = o ? function(a) {
    return typeof a == "symbol";
  } : function(a) {
    var l = e("Symbol");
    return i(l) && s(l.prototype, r(a));
  };
}), _r = /* @__PURE__ */ T((n, t) => {
  var e = String;
  t.exports = function(i) {
    try {
      return e(i);
    } catch {
      return "Object";
    }
  };
}), Bs = /* @__PURE__ */ T((n, t) => {
  var e = Ht(), i = _r(), s = TypeError;
  t.exports = function(o) {
    if (e(o)) return o;
    throw new s(i(o) + " is not a function");
  };
}), Cr = /* @__PURE__ */ T((n, t) => {
  var e = Bs(), i = Os();
  t.exports = function(s, o) {
    var r = s[o];
    return i(r) ? void 0 : e(r);
  };
}), Er = /* @__PURE__ */ T((n, t) => {
  var e = ci(), i = Ht(), s = De(), o = TypeError;
  t.exports = function(r, a) {
    var l, c;
    if (a === "string" && i(l = r.toString) && !s(c = e(l, r)) || i(l = r.valueOf) && !s(c = e(l, r)) || a !== "string" && i(l = r.toString) && !s(c = e(l, r))) return c;
    throw new o("Can't convert object to primitive value");
  };
}), Sr = /* @__PURE__ */ T((n, t) => {
  t.exports = !0;
}), Ar = /* @__PURE__ */ T((n, t) => {
  var e = Ct(), i = Object.defineProperty;
  t.exports = function(s, o) {
    try {
      i(e, s, {
        value: o,
        configurable: !0,
        writable: !0
      });
    } catch {
      e[s] = o;
    }
    return o;
  };
}), Hs = /* @__PURE__ */ T((n, t) => {
  var e = Sr(), i = Ct(), s = Ar(), o = "__core-js_shared__", r = t.exports = i[o] || s(o, {});
  (r.versions || (r.versions = [])).push({
    version: "3.49.0",
    mode: e ? "pure" : "global",
    copyright: "© 2013–2025 Denis Pushkarev (zloirock.ru), 2025–2026 CoreJS Company (core-js.io). All rights reserved.",
    license: "https://github.com/zloirock/core-js/blob/v3.49.0/LICENSE",
    source: "https://github.com/zloirock/core-js"
  });
}), Mr = /* @__PURE__ */ T((n, t) => {
  var e = Hs();
  t.exports = function(i, s) {
    return e[i] || (e[i] = s || {});
  };
}), Tr = /* @__PURE__ */ T((n, t) => {
  var e = hi(), i = Object;
  t.exports = function(s) {
    return i(e(s));
  };
}), ui = /* @__PURE__ */ T((n, t) => {
  var e = qt(), i = Tr(), s = e({}.hasOwnProperty);
  t.exports = Object.hasOwn || function(r, a) {
    return s(i(r), a);
  };
}), Rr = /* @__PURE__ */ T((n, t) => {
  var e = qt(), i = 0, s = Math.random(), o = e(1.1.toString);
  t.exports = function(r) {
    return "Symbol(" + (r === void 0 ? "" : r) + ")_" + o(++i + s, 36);
  };
}), Oe = /* @__PURE__ */ T((n, t) => {
  var e = Ct(), i = Mr(), s = ui(), o = Rr(), r = Ls(), a = zs(), l = e.Symbol, c = i("wks"), h = a ? l.for || l : l && l.withoutSetter || o;
  t.exports = function(d) {
    return s(c, d) || (c[d] = r && s(l, d) ? l[d] : h("Symbol." + d)), c[d];
  };
}), kr = /* @__PURE__ */ T((n, t) => {
  var e = ci(), i = De(), s = Gs(), o = Cr(), r = Er(), a = Oe(), l = TypeError, c = a("toPrimitive");
  t.exports = function(h, d) {
    if (!i(h) || s(h)) return h;
    var f = o(h, c), u;
    if (f) {
      if (d === void 0 && (d = "default"), u = e(f, h, d), !i(u) || s(u)) return u;
      throw new l("Can't convert object to primitive value");
    }
    return d === void 0 && (d = "number"), r(h, d);
  };
}), Fs = /* @__PURE__ */ T((n, t) => {
  var e = kr(), i = Gs();
  t.exports = function(s) {
    var o = e(s, "string");
    return i(o) ? o : o + "";
  };
}), Nr = /* @__PURE__ */ T((n, t) => {
  var e = Ct(), i = De(), s = e.document, o = i(s) && i(s.createElement);
  t.exports = function(r) {
    return o ? s.createElement(r) : {};
  };
}), Us = /* @__PURE__ */ T((n, t) => {
  var e = Pe(), i = Bt(), s = Nr();
  t.exports = !e && !i(function() {
    return Object.defineProperty(s("div"), "a", { get: function() {
      return 7;
    } }).a !== 7;
  });
}), Pr = /* @__PURE__ */ T((n) => {
  var t = Pe(), e = ci(), i = yr(), s = Ds(), o = Is(), r = Fs(), a = ui(), l = Us(), c = Object.getOwnPropertyDescriptor;
  n.f = t ? c : function(d, f) {
    if (d = o(d), f = r(f), l) try {
      return c(d, f);
    } catch {
    }
    if (a(d, f)) return s(!e(i.f, d, f), d[f]);
  };
}), Dr = /* @__PURE__ */ T((n, t) => {
  var e = Bt(), i = Ht(), s = /#|\.prototype\./, o = function(h, d) {
    var f = a[r(h)];
    return f === c ? !0 : f === l ? !1 : i(d) ? e(d) : !!d;
  }, r = o.normalize = function(h) {
    return String(h).replace(s, ".").toLowerCase();
  }, a = o.data = {}, l = o.NATIVE = "N", c = o.POLYFILL = "P";
  t.exports = o;
}), Or = /* @__PURE__ */ T((n, t) => {
  var e = Ps(), i = Bs(), s = pn(), o = e(e.bind);
  t.exports = function(r, a) {
    return i(r), a === void 0 ? r : s ? o(r, a) : function() {
      return r.apply(a, arguments);
    };
  };
}), Ir = /* @__PURE__ */ T((n, t) => {
  var e = Pe(), i = Bt();
  t.exports = e && i(function() {
    return Object.defineProperty(function() {
    }, "prototype", {
      value: 42,
      writable: !1
    }).prototype !== 42;
  });
}), Lr = /* @__PURE__ */ T((n, t) => {
  var e = De(), i = String, s = TypeError;
  t.exports = function(o) {
    if (e(o)) return o;
    throw new s(i(o) + " is not an object");
  };
}), zr = /* @__PURE__ */ T((n) => {
  var t = Pe(), e = Us(), i = Ir(), s = Lr(), o = Fs(), r = TypeError, a = Object.defineProperty, l = Object.getOwnPropertyDescriptor, c = "enumerable", h = "configurable", d = "writable";
  n.f = t ? i ? function(u, p, m) {
    if (s(u), p = o(p), s(m), typeof u == "function" && p === "prototype" && "value" in m && d in m && !m[d]) {
      var g = l(u, p);
      g && g[d] && (u[p] = m.value, m = {
        configurable: h in m ? m[h] : g[h],
        enumerable: c in m ? m[c] : g[c],
        writable: !1
      });
    }
    return a(u, p, m);
  } : a : function(u, p, m) {
    if (s(u), p = o(p), s(m), e) try {
      return a(u, p, m);
    } catch {
    }
    if ("get" in m || "set" in m) throw new r("Accessors not supported");
    return "value" in m && (u[p] = m.value), u;
  };
}), Gr = /* @__PURE__ */ T((n, t) => {
  var e = Pe(), i = zr(), s = Ds();
  t.exports = e ? function(o, r, a) {
    return i.f(o, r, s(1, a));
  } : function(o, r, a) {
    return o[r] = a, o;
  };
}), Ys = /* @__PURE__ */ T((n, t) => {
  var e = Ct(), i = gr(), s = Ps(), o = Ht(), r = Pr().f, a = Dr(), l = di(), c = Or(), h = Gr(), d = ui();
  Hs();
  var f = function(u) {
    var p = function(m, g, y) {
      if (this instanceof p) {
        switch (arguments.length) {
          case 0:
            return new u();
          case 1:
            return new u(m);
          case 2:
            return new u(m, g);
        }
        return new u(m, g, y);
      }
      return i(u, this, arguments);
    };
    return p.prototype = u.prototype, p;
  };
  t.exports = function(u, p) {
    var m = u.target, g = u.global, y = u.stat, b = u.proto, v = g ? e : y ? e[m] : e[m] && e[m].prototype, w = g ? l : l[m] || h(l, m, {})[m], _ = w.prototype, x, S, C, A, E, M, k, N, O;
    for (A in p)
      x = a(g ? A : m + (y ? "." : "#") + A, u.forced), S = !x && v && d(v, A), M = w[A], S && (u.dontCallGetSet ? (O = r(v, A), k = O && O.value) : k = v[A]), E = S && k ? k : p[A], !(!x && !b && typeof M == typeof E) && (u.bind && S ? N = c(E, e) : u.wrap && S ? N = f(E) : b && o(E) ? N = s(E) : N = E, (u.sham || E && E.sham || M && M.sham) && h(N, "sham", !0), h(w, A, N), b && (C = m + "Prototype", d(l, C) || h(l, C, {}), h(l[C], A, E), u.real && _ && (x || !_[A]) && h(_, A, E)));
  };
}), Br = /* @__PURE__ */ T((n, t) => {
  var e = Math.ceil, i = Math.floor;
  t.exports = Math.trunc || function(o) {
    var r = +o;
    return (r > 0 ? i : e)(r);
  };
}), $s = /* @__PURE__ */ T((n, t) => {
  var e = Br();
  t.exports = function(i) {
    var s = +i;
    return s !== s || s === 0 ? 0 : e(s);
  };
}), Hr = /* @__PURE__ */ T((n, t) => {
  var e = $s(), i = Math.max, s = Math.min;
  t.exports = function(o, r) {
    var a = e(o);
    return a < 0 ? i(a + r, 0) : s(a, r);
  };
}), Fr = /* @__PURE__ */ T((n, t) => {
  var e = $s(), i = Math.min;
  t.exports = function(s) {
    var o = e(s);
    return o > 0 ? i(o, 9007199254740991) : 0;
  };
}), Ur = /* @__PURE__ */ T((n, t) => {
  var e = Fr();
  t.exports = function(i) {
    return e(i.length);
  };
}), Yr = /* @__PURE__ */ T((n, t) => {
  var e = Is(), i = Hr(), s = Ur(), o = function(r) {
    return function(a, l, c) {
      var h = e(a), d = s(h);
      if (d === 0) return !r && -1;
      var f = i(c, d), u;
      if (r && l !== l) {
        for (; d > f; )
          if (u = h[f++], u !== u) return !0;
      } else for (; d > f; f++) if ((r || f in h) && h[f] === l) return r || f || 0;
      return !r && -1;
    };
  };
  t.exports = {
    includes: o(!0),
    indexOf: o(!1)
  };
}), $r = /* @__PURE__ */ T((n, t) => {
  t.exports = function() {
  };
}), Xr = /* @__PURE__ */ T(() => {
  var n = Ys(), t = Yr().includes, e = Bt(), i = $r(), s = e(function() {
    return !Array(1).includes();
  }), o = e(function() {
    return [, 1].includes(void 0, 1);
  });
  n({
    target: "Array",
    proto: !0,
    forced: s || o
  }, { includes: function(a) {
    return t(this, a, arguments.length > 1 ? arguments[1] : void 0);
  } }), i("includes");
}), Xs = /* @__PURE__ */ T((n, t) => {
  var e = Ct(), i = di();
  t.exports = function(s, o) {
    var r = i[s + "Prototype"], a = r && r[o];
    if (a) return a;
    var l = e[s], c = l && l.prototype;
    return c && c[o];
  };
}), Wr = /* @__PURE__ */ T((n, t) => {
  Xr();
  var e = Xs();
  t.exports = e("Array", "includes");
}), qr = /* @__PURE__ */ T((n, t) => {
  var e = De(), i = mn(), s = Oe()("match");
  t.exports = function(o) {
    var r;
    return e(o) && ((r = o[s]) !== void 0 ? !!r : i(o) === "RegExp");
  };
}), Zr = /* @__PURE__ */ T((n, t) => {
  var e = qr(), i = TypeError;
  t.exports = function(s) {
    if (e(s)) throw new i("The method doesn't accept regular expressions");
    return s;
  };
}), Vr = /* @__PURE__ */ T((n, t) => {
  var e = Oe()("toStringTag"), i = {};
  i[e] = "z", t.exports = String(i) === "[object z]";
}), jr = /* @__PURE__ */ T((n, t) => {
  var e = Vr(), i = Ht(), s = mn(), o = Oe()("toStringTag"), r = Object, a = s(/* @__PURE__ */ function() {
    return arguments;
  }()) === "Arguments", l = function(c, h) {
    try {
      return c[h];
    } catch {
    }
  };
  t.exports = e ? s : function(c) {
    var h, d, f;
    return c === void 0 ? "Undefined" : c === null ? "Null" : typeof (d = l(h = r(c), o)) == "string" ? d : a ? s(h) : (f = s(h)) === "Object" && i(h.callee) ? "Arguments" : f;
  };
}), Kr = /* @__PURE__ */ T((n, t) => {
  var e = jr(), i = String;
  t.exports = function(s) {
    if (e(s) === "Symbol") throw new TypeError("Cannot convert a Symbol value to a string");
    return i(s);
  };
}), Qr = /* @__PURE__ */ T((n, t) => {
  var e = Oe()("match");
  t.exports = function(i) {
    var s = /./;
    try {
      "/./"[i](s);
    } catch {
      try {
        return s[e] = !1, "/./"[i](s);
      } catch {
      }
    }
    return !1;
  };
}), Jr = /* @__PURE__ */ T(() => {
  var n = Ys(), t = qt(), e = Zr(), i = hi(), s = Kr(), o = Qr(), r = t("".indexOf);
  n({
    target: "String",
    proto: !0,
    forced: !o("includes")
  }, { includes: function(l) {
    return !!~r(s(i(this)), s(e(l)), arguments.length > 1 ? arguments[1] : void 0);
  } });
}), ta = /* @__PURE__ */ T((n, t) => {
  Jr();
  var e = Xs();
  t.exports = e("String", "includes");
}), ea = /* @__PURE__ */ T((n, t) => {
  var e = Ns(), i = Wr(), s = ta(), o = Array.prototype, r = String.prototype;
  t.exports = function(a) {
    var l = a.includes;
    return a === o || e(o, a) && l === o.includes ? i : typeof a == "string" || a === r || e(r, a) && l === r.includes ? s : l;
  };
}), na = /* @__PURE__ */ T((n, t) => {
  var e = ea();
  t.exports = e;
}), Xt = /* @__PURE__ */ pr(na());
function fi(n, t) {
  let e;
  const i = n.length, s = [];
  for (e = 0; e < i; e++) s.push(t(n[e]));
  return s;
}
function ia(n, t) {
  let e;
  const i = n.length, s = [];
  for (e = 0; e < i; e++) t(n[e]) && s.push(n[e]);
  return s;
}
function En(n) {
  return n % 360 * Math.PI / 180;
}
function Ws(n) {
  return n.replace(/([A-Z])/g, function(t, e) {
    return "-" + e.toLowerCase();
  });
}
function qs(n) {
  return n.charAt(0).toUpperCase() + n.slice(1);
}
function Zt(n, t, e, i) {
  return (t == null || e == null) && (i = i || n.bbox(), t == null ? t = i.width / i.height * e : e == null && (e = i.height / i.width * t)), {
    width: t,
    height: e
  };
}
function Fn(n, t) {
  const e = n.origin;
  let i = n.ox != null ? n.ox : n.originX != null ? n.originX : "center", s = n.oy != null ? n.oy : n.originY != null ? n.originY : "center";
  e != null && ([i, s] = Array.isArray(e) ? e : typeof e == "object" ? [e.x, e.y] : [e, e]);
  const o = typeof i == "string", r = typeof s == "string";
  if (o || r) {
    const { height: a, width: l, x: c, y: h } = t.bbox();
    o && (i = (0, Xt.default)(i).call(i, "left") ? c : (0, Xt.default)(i).call(i, "right") ? c + l : c + l / 2), r && (s = (0, Xt.default)(s).call(s, "top") ? h : (0, Xt.default)(s).call(s, "bottom") ? h + a : h + a / 2);
  }
  return [i, s];
}
const sa = /* @__PURE__ */ new Set([
  "desc",
  "metadata",
  "title"
]), Un = (n) => sa.has(n.nodeName), oa = (n, t, e = {}) => {
  const i = { ...t };
  for (const s in i) i[s].valueOf() === e[s] && delete i[s];
  Object.keys(i).length ? n.node.setAttribute("data-svgjs", JSON.stringify(i)) : (n.node.removeAttribute("data-svgjs"), n.node.removeAttribute("svgjs:data"));
}, pi = "http://www.w3.org/2000/svg", ra = "http://www.w3.org/1999/xhtml", Sn = "http://www.w3.org/2000/xmlns/", Ie = "http://www.w3.org/1999/xlink", L = {
  window: typeof window > "u" ? null : window,
  document: typeof document > "u" ? null : document
};
function mi() {
  return L.window;
}
var gi = class {
};
const Wt = {}, yi = "___SYMBOL___ROOT___";
function Se(n, t = pi) {
  return L.document.createElementNS(t, n);
}
function nt(n, t = !1) {
  if (n instanceof gi) return n;
  if (typeof n == "object") return An(n);
  if (n == null) return new Wt[yi]();
  if (typeof n == "string" && n.trim().charAt(0) !== "<") return An(L.document.querySelector(n));
  const e = t ? L.document.createElement("div") : Se("svg");
  return e.innerHTML = n.trim(), n = An(e.firstElementChild), e.removeChild(e.firstElementChild), n;
}
function U(n, t) {
  return t && (t instanceof L.window.Node || t.ownerDocument && t instanceof t.ownerDocument.defaultView.Node) ? t : Se(n);
}
function st(n) {
  if (!n) return null;
  if (n.instance instanceof gi) return n.instance;
  if (n.nodeName === "#document-fragment") return new Wt.Fragment(n);
  let t = qs(n.nodeName || "Dom");
  return t === "LinearGradient" || t === "RadialGradient" ? t = "Gradient" : Wt[t] || (t = "Dom"), new Wt[t](n);
}
let An = st;
function z(n, t = n.name, e = !1) {
  return Wt[t] = n, e && (Wt[yi] = n), ks(Object.getOwnPropertyNames(n.prototype)), n;
}
function aa(n) {
  return Wt[n];
}
let la = 1e3;
function Zs(n) {
  return "Svgjs" + qs(n) + la++;
}
function Vs(n) {
  for (let t = n.children.length - 1; t >= 0; t--) Vs(n.children[t]);
  return n.id && (n.id = Zs(n.nodeName)), n;
}
function D(n, t) {
  let e, i;
  for (n = Array.isArray(n) ? n : [n], i = n.length - 1; i >= 0; i--) for (e in t) n[i].prototype[e] = t[e];
}
function F(n) {
  return function(...t) {
    const e = t[t.length - 1];
    return e && e.constructor === Object && !(e instanceof Array) ? n.apply(this, t.slice(0, -1)).attr(e) : n.apply(this, t);
  };
}
function ca() {
  return this.parent().children();
}
function ha() {
  return this.parent().index(this);
}
function da() {
  return this.siblings()[this.position() + 1];
}
function ua() {
  return this.siblings()[this.position() - 1];
}
function fa() {
  const n = this.position();
  return this.parent().add(this.remove(), n + 1), this;
}
function pa() {
  const n = this.position();
  return this.parent().add(this.remove(), n ? n - 1 : 0), this;
}
function ma() {
  return this.parent().add(this.remove()), this;
}
function ga() {
  return this.parent().add(this.remove(), 0), this;
}
function ya(n) {
  n = nt(n), n.remove();
  const t = this.position();
  return this.parent().add(n, t), this;
}
function ba(n) {
  n = nt(n), n.remove();
  const t = this.position();
  return this.parent().add(n, t + 1), this;
}
function va(n) {
  return n = nt(n), n.before(this), this;
}
function wa(n) {
  return n = nt(n), n.after(this), this;
}
I("Dom", {
  siblings: ca,
  position: ha,
  next: da,
  prev: ua,
  forward: fa,
  backward: pa,
  front: ma,
  back: ga,
  before: ya,
  after: ba,
  insertBefore: va,
  insertAfter: wa
});
const js = /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i, xa = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, _a = /rgb\((\d+),(\d+),(\d+)\)/, Ca = /^(#[^\s]+)$/, Ea = /\)\s*,?\s*/, Sa = /\s/g, Fi = /^#[a-f0-9]{3}$|^#[a-f0-9]{6}$/i, Ui = /^rgb\(/, Yi = /^(\s+)?$/, $i = /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, Aa = /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i, kt = /[\s,]+/, bi = /[MLHVCSQTAZ]/i;
function Ma() {
  const n = this.attr("class");
  return n == null ? [] : n.trim().split(kt);
}
function Ta(n) {
  return this.classes().indexOf(n) !== -1;
}
function Ra(n) {
  if (!this.hasClass(n)) {
    const t = this.classes();
    t.push(n), this.attr("class", t.join(" "));
  }
  return this;
}
function ka(n) {
  return this.hasClass(n) && this.attr("class", this.classes().filter(function(t) {
    return t !== n;
  }).join(" ")), this;
}
function Na(n) {
  return this.hasClass(n) ? this.removeClass(n) : this.addClass(n);
}
I("Dom", {
  classes: Ma,
  hasClass: Ta,
  addClass: Ra,
  removeClass: ka,
  toggleClass: Na
});
const Ye = (n) => n.startsWith("--") ? n : Ws(n);
function Pa(n, t) {
  const e = {};
  if (arguments.length === 0) {
    const i = this.node.style;
    for (let s = 0; s < i.length; s++) {
      const o = i.item(s), r = i.getPropertyValue(o), a = i.getPropertyPriority(o);
      e[o] = a ? `${r} !${a}` : r;
    }
    return e;
  }
  if (arguments.length < 2) {
    if (Array.isArray(n)) {
      for (const i of n) {
        const s = Ye(i);
        e[i] = this.node.style.getPropertyValue(s);
      }
      return e;
    }
    if (typeof n == "string") return this.node.style.getPropertyValue(Ye(n));
    if (typeof n == "object") for (const i in n) this.node.style.setProperty(Ye(i), n[i] == null || Yi.test(n[i]) ? "" : n[i]);
  }
  return arguments.length === 2 && this.node.style.setProperty(Ye(n), t == null || Yi.test(t) ? "" : t), this;
}
function Da() {
  return this.css("display", "");
}
function Oa() {
  return this.css("display", "none");
}
function Ia() {
  return this.css("display") !== "none";
}
I("Dom", {
  css: Pa,
  show: Da,
  hide: Oa,
  visible: Ia
});
function La(n, t, e) {
  if (n == null) return this.data(fi(ia(this.node.attributes, (i) => i.nodeName.indexOf("data-") === 0), (i) => i.nodeName.slice(5)));
  if (n instanceof Array) {
    const i = {};
    for (const s of n) i[s] = this.data(s);
    return i;
  } else if (typeof n == "object") for (t in n) this.data(t, n[t]);
  else if (arguments.length < 2) try {
    return JSON.parse(this.attr("data-" + n));
  } catch {
    return this.attr("data-" + n);
  }
  else this.attr("data-" + n, t === null ? null : e === !0 || typeof t == "string" || typeof t == "number" ? t : JSON.stringify(t));
  return this;
}
I("Dom", { data: La });
function za(n, t) {
  if (typeof arguments[0] == "object") for (const e in n) this.remember(e, n[e]);
  else {
    if (arguments.length === 1) return this.memory()[n];
    this.memory()[n] = t;
  }
  return this;
}
function Ga() {
  if (arguments.length === 0) this._memory = {};
  else for (let n = arguments.length - 1; n >= 0; n--) delete this.memory()[arguments[n]];
  return this;
}
function Ba() {
  return this._memory = this._memory || {};
}
I("Dom", {
  remember: za,
  forget: Ga,
  memory: Ba
});
function Ha(n) {
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
function Fa(n) {
  const t = Math.max(0, Math.min(255, Math.round(n))).toString(16);
  return t.length === 1 ? "0" + t : t;
}
function jt(n, t) {
  for (let e = t.length; e--; ) if (n[t[e]] == null) return !1;
  return !0;
}
function Ua(n, t) {
  const e = jt(n, "rgb") ? {
    _a: n.r,
    _b: n.g,
    _c: n.b,
    _d: 0,
    space: "rgb"
  } : jt(n, "xyz") ? {
    _a: n.x,
    _b: n.y,
    _c: n.z,
    _d: 0,
    space: "xyz"
  } : jt(n, "hsl") ? {
    _a: n.h,
    _b: n.s,
    _c: n.l,
    _d: 0,
    space: "hsl"
  } : jt(n, "lab") ? {
    _a: n.l,
    _b: n.a,
    _c: n.b,
    _d: 0,
    space: "lab"
  } : jt(n, "lch") ? {
    _a: n.l,
    _b: n.c,
    _c: n.h,
    _d: 0,
    space: "lch"
  } : jt(n, "cmyk") ? {
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
function Ya(n) {
  return n === "lab" || n === "xyz" || n === "lch";
}
function Mn(n, t, e) {
  return e < 0 && (e += 1), e > 1 && (e -= 1), e < 1 / 6 ? n + (t - n) * 6 * e : e < 1 / 2 ? t : e < 2 / 3 ? n + (t - n) * (2 / 3 - e) * 6 : n;
}
var _t = class j {
  constructor(...t) {
    this.init(...t);
  }
  static isColor(t) {
    return t && (t instanceof j || this.isRgb(t) || this.test(t));
  }
  static isRgb(t) {
    return t && typeof t.r == "number" && typeof t.g == "number" && typeof t.b == "number";
  }
  static random(t = "vibrant", e) {
    const { random: i, round: s, sin: o, PI: r } = Math;
    if (t === "vibrant") {
      const a = 24 * i() + 57, l = 38 * i() + 45, c = 360 * i();
      return new j(a, l, c, "lch");
    } else if (t === "sine") {
      e = e ?? i();
      const a = s(80 * o(2 * r * e / 0.5 + 0.01) + 150), l = s(50 * o(2 * r * e / 0.5 + 4.6) + 200), c = s(100 * o(2 * r * e / 0.5 + 2.3) + 150);
      return new j(a, l, c);
    } else if (t === "pastel") {
      const a = 8 * i() + 86, l = 17 * i() + 9, c = 360 * i();
      return new j(a, l, c, "lch");
    } else if (t === "dark") {
      const a = 10 + 10 * i(), l = 50 * i() + 86, c = 360 * i();
      return new j(a, l, c, "lch");
    } else if (t === "rgb") {
      const a = 255 * i(), l = 255 * i(), c = 255 * i();
      return new j(a, l, c);
    } else if (t === "lab") {
      const a = 100 * i(), l = 256 * i() - 128, c = 256 * i() - 128;
      return new j(a, l, c, "lab");
    } else if (t === "grey") {
      const a = 255 * i();
      return new j(a, a, a);
    } else throw new Error("Unsupported random color mode");
  }
  static test(t) {
    return typeof t == "string" && (Fi.test(t) || Ui.test(t));
  }
  cmyk() {
    const { _a: t, _b: e, _c: i } = this.rgb(), [s, o, r] = [
      t,
      e,
      i
    ].map((d) => d / 255), a = Math.min(1 - s, 1 - o, 1 - r);
    if (a === 1) return new j(0, 0, 0, 1, "cmyk");
    const l = (1 - s - a) / (1 - a), c = (1 - o - a) / (1 - a), h = (1 - r - a) / (1 - a);
    return new j(l, c, h, a, "cmyk");
  }
  hsl() {
    const { _a: t, _b: e, _c: i } = this.rgb(), [s, o, r] = [
      t,
      e,
      i
    ].map((p) => p / 255), a = Math.max(s, o, r), l = Math.min(s, o, r), c = (a + l) / 2, h = a === l, d = a - l, f = h ? 0 : c > 0.5 ? d / (2 - a - l) : d / (a + l), u = h ? 0 : a === s ? ((o - r) / d + (o < r ? 6 : 0)) / 6 : a === o ? ((r - s) / d + 2) / 6 : a === r ? ((s - o) / d + 4) / 6 : 0;
    return new j(360 * u, 100 * f, 100 * c, "hsl");
  }
  init(t = 0, e = 0, i = 0, s = 0, o = "rgb") {
    if (t = t || 0, this.space) for (const d in this.space) delete this[this.space[d]];
    if (typeof t == "number")
      o = typeof s == "string" ? s : o, s = typeof s == "string" ? 0 : s, Object.assign(this, {
        _a: t,
        _b: e,
        _c: i,
        _d: s,
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
      const d = Ua(t, e);
      Object.assign(this, d);
    } else if (typeof t == "string") if (Ui.test(t)) {
      const d = t.replace(Sa, ""), [f, u, p] = _a.exec(d).slice(1, 4).map((m) => parseInt(m));
      Object.assign(this, {
        _a: f,
        _b: u,
        _c: p,
        _d: 0,
        space: "rgb"
      });
    } else if (Fi.test(t)) {
      const d = (m) => parseInt(m, 16), [, f, u, p] = xa.exec(Ha(t)).map(d);
      Object.assign(this, {
        _a: f,
        _b: u,
        _c: p,
        _d: 0,
        space: "rgb"
      });
    } else throw Error("Unsupported string format, can't construct Color");
    const { _a: r, _b: a, _c: l, _d: c } = this, h = this.space === "rgb" ? {
      r,
      g: a,
      b: l
    } : this.space === "xyz" ? {
      x: r,
      y: a,
      z: l
    } : this.space === "hsl" ? {
      h: r,
      s: a,
      l
    } : this.space === "lab" ? {
      l: r,
      a,
      b: l
    } : this.space === "lch" ? {
      l: r,
      c: a,
      h: l
    } : this.space === "cmyk" ? {
      c: r,
      m: a,
      y: l,
      k: c
    } : {};
    Object.assign(this, h);
  }
  lab() {
    const { x: t, y: e, z: i } = this.xyz(), s = 116 * e - 16, o = 500 * (t - e), r = 200 * (e - i);
    return new j(s, o, r, "lab");
  }
  lch() {
    const { l: t, a: e, b: i } = this.lab(), s = Math.sqrt(e ** 2 + i ** 2);
    let o = 180 * Math.atan2(i, e) / Math.PI;
    return o < 0 && (o *= -1, o = 360 - o), new j(t, s, o, "lch");
  }
  rgb() {
    if (this.space === "rgb") return this;
    if (Ya(this.space)) {
      let { x: t, y: e, z: i } = this;
      if (this.space === "lab" || this.space === "lch") {
        let { l: f, a: u, b: p } = this;
        if (this.space === "lch") {
          const { c: _, h: x } = this, S = Math.PI / 180;
          u = _ * Math.cos(S * x), p = _ * Math.sin(S * x);
        }
        const m = (f + 16) / 116, g = u / 500 + m, y = m - p / 200, b = 16 / 116, v = 8856e-6, w = 7.787;
        t = 0.95047 * (g ** 3 > v ? g ** 3 : (g - b) / w), e = 1 * (m ** 3 > v ? m ** 3 : (m - b) / w), i = 1.08883 * (y ** 3 > v ? y ** 3 : (y - b) / w);
      }
      const s = t * 3.2406 + e * -1.5372 + i * -0.4986, o = t * -0.9689 + e * 1.8758 + i * 0.0415, r = t * 0.0557 + e * -0.204 + i * 1.057, a = Math.pow, l = 31308e-7, c = s > l ? 1.055 * a(s, 1 / 2.4) - 0.055 : 12.92 * s, h = o > l ? 1.055 * a(o, 1 / 2.4) - 0.055 : 12.92 * o, d = r > l ? 1.055 * a(r, 1 / 2.4) - 0.055 : 12.92 * r;
      return new j(255 * c, 255 * h, 255 * d);
    } else if (this.space === "hsl") {
      let { h: t, s: e, l: i } = this;
      if (t /= 360, e /= 100, i /= 100, e === 0)
        return i *= 255, new j(i, i, i);
      const s = i < 0.5 ? i * (1 + e) : i + e - i * e, o = 2 * i - s, r = 255 * Mn(o, s, t + 1 / 3), a = 255 * Mn(o, s, t), l = 255 * Mn(o, s, t - 1 / 3);
      return new j(r, a, l);
    } else if (this.space === "cmyk") {
      const { c: t, m: e, y: i, k: s } = this, o = 255 * (1 - Math.min(1, t * (1 - s) + s)), r = 255 * (1 - Math.min(1, e * (1 - s) + s)), a = 255 * (1 - Math.min(1, i * (1 - s) + s));
      return new j(o, r, a);
    } else return this;
  }
  toArray() {
    const { _a: t, _b: e, _c: i, _d: s, space: o } = this;
    return [
      t,
      e,
      i,
      s,
      o
    ];
  }
  toHex() {
    const [t, e, i] = this._clamped().map(Fa);
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
    const { _a: t, _b: e, _c: i } = this.rgb(), [s, o, r] = [
      t,
      e,
      i
    ].map((g) => g / 255), a = s > 0.04045 ? Math.pow((s + 0.055) / 1.055, 2.4) : s / 12.92, l = o > 0.04045 ? Math.pow((o + 0.055) / 1.055, 2.4) : o / 12.92, c = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92, h = (a * 0.4124 + l * 0.3576 + c * 0.1805) / 0.95047, d = (a * 0.2126 + l * 0.7152 + c * 0.0722) / 1, f = (a * 0.0193 + l * 0.1192 + c * 0.9505) / 1.08883, u = h > 8856e-6 ? Math.pow(h, 1 / 3) : 7.787 * h + 16 / 116, p = d > 8856e-6 ? Math.pow(d, 1 / 3) : 7.787 * d + 16 / 116, m = f > 8856e-6 ? Math.pow(f, 1 / 3) : 7.787 * f + 16 / 116;
    return new j(u, p, m, "xyz");
  }
  _clamped() {
    const { _a: t, _b: e, _c: i } = this.rgb(), { max: s, min: o, round: r } = Math, a = (l) => s(0, o(r(l), 255));
    return [
      t,
      e,
      i
    ].map(a);
  }
}, W = class Ks {
  constructor(...t) {
    this.init(...t);
  }
  clone() {
    return new Ks(this);
  }
  init(t, e) {
    const i = {
      x: 0,
      y: 0
    }, s = Array.isArray(t) ? {
      x: t[0],
      y: t[1]
    } : typeof t == "object" ? {
      x: t.x,
      y: t.y
    } : {
      x: t,
      y: e
    };
    return this.x = s.x == null ? i.x : s.x, this.y = s.y == null ? i.y : s.y, this;
  }
  toArray() {
    return [this.x, this.y];
  }
  transform(t) {
    return this.clone().transformO(t);
  }
  transformO(t) {
    P.isMatrixLike(t) || (t = new P(t));
    const { x: e, y: i } = this;
    return this.x = t.a * e + t.c * i + t.e, this.y = t.b * e + t.d * i + t.f, this;
  }
};
function $a(n, t) {
  return new W(n, t).transformO(this.screenCTM().inverseO());
}
function Kt(n, t, e) {
  return Math.abs(t - n) < 1e-6;
}
var P = class K {
  constructor(...t) {
    this.init(...t);
  }
  static formatTransforms(t) {
    const e = t.flip === "both" || t.flip === !0, i = t.flip && (e || t.flip === "x") ? -1 : 1, s = t.flip && (e || t.flip === "y") ? -1 : 1, o = t.skew && t.skew.length ? t.skew[0] : isFinite(t.skew) ? t.skew : isFinite(t.skewX) ? t.skewX : 0, r = t.skew && t.skew.length ? t.skew[1] : isFinite(t.skew) ? t.skew : isFinite(t.skewY) ? t.skewY : 0, a = t.scale && t.scale.length ? t.scale[0] * i : isFinite(t.scale) ? t.scale * i : isFinite(t.scaleX) ? t.scaleX * i : i, l = t.scale && t.scale.length ? t.scale[1] * s : isFinite(t.scale) ? t.scale * s : isFinite(t.scaleY) ? t.scaleY * s : s, c = t.shear || 0, h = t.rotate || t.theta || 0, d = new W(t.origin || t.around || t.ox || t.originX, t.oy || t.originY), f = d.x, u = d.y, p = new W(t.position ?? t.px ?? t.positionX ?? NaN, t.py ?? t.positionY ?? NaN), m = p.x, g = p.y, y = new W(t.translate || t.tx || t.translateX, t.ty || t.translateY), b = y.x, v = y.y, w = new W(t.relative || t.rx || t.relativeX, t.ry || t.relativeY);
    return {
      scaleX: a,
      scaleY: l,
      skewX: o,
      skewY: r,
      shear: c,
      theta: h,
      rx: w.x,
      ry: w.y,
      tx: b,
      ty: v,
      ox: f,
      oy: u,
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
  static matrixMultiply(t, e, i) {
    const s = t.a * e.a + t.c * e.b, o = t.b * e.a + t.d * e.b, r = t.a * e.c + t.c * e.d, a = t.b * e.c + t.d * e.d, l = t.e + t.a * e.e + t.c * e.f, c = t.f + t.b * e.e + t.d * e.f;
    return i.a = s, i.b = o, i.c = r, i.d = a, i.e = l, i.f = c, i;
  }
  around(t, e, i) {
    return this.clone().aroundO(t, e, i);
  }
  aroundO(t, e, i) {
    const s = t || 0, o = e || 0;
    return this.translateO(-s, -o).lmultiplyO(i).translateO(s, o);
  }
  clone() {
    return new K(this);
  }
  decompose(t = 0, e = 0) {
    const i = this.a, s = this.b, o = this.c, r = this.d, a = this.e, l = this.f, c = i * r - s * o, h = c > 0 ? 1 : -1, d = h * Math.sqrt(i * i + s * s), f = Math.atan2(h * s, h * i), u = 180 / Math.PI * f, p = (i * o + s * r) / c;
    return {
      scaleX: d,
      scaleY: o * d / (p * i - s) || r * d / (p * s + i),
      shear: p,
      rotate: u,
      translateX: a - t + t * i + e * o,
      translateY: l - e + t * s + e * r,
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
    const e = new K(t);
    return Kt(this.a, e.a) && Kt(this.b, e.b) && Kt(this.c, e.c) && Kt(this.d, e.d) && Kt(this.e, e.e) && Kt(this.f, e.f);
  }
  flip(t, e) {
    return this.clone().flipO(t, e);
  }
  flipO(t, e) {
    return t === "x" ? this.scaleO(-1, 1, e, 0) : t === "y" ? this.scaleO(1, -1, 0, e) : this.scaleO(-1, -1, t, e || t);
  }
  init(t) {
    const e = K.fromArray([
      1,
      0,
      0,
      1,
      0,
      0
    ]);
    return t = t instanceof at ? t.matrixify() : typeof t == "string" ? K.fromArray(t.split(kt).map(parseFloat)) : Array.isArray(t) ? K.fromArray(t) : typeof t == "object" && K.isMatrixLike(t) ? t : typeof t == "object" ? new K().transform(t) : arguments.length === 6 ? K.fromArray([].slice.call(arguments)) : e, this.a = t.a != null ? t.a : e.a, this.b = t.b != null ? t.b : e.b, this.c = t.c != null ? t.c : e.c, this.d = t.d != null ? t.d : e.d, this.e = t.e != null ? t.e : e.e, this.f = t.f != null ? t.f : e.f, this;
  }
  inverse() {
    return this.clone().inverseO();
  }
  inverseO() {
    const t = this.a, e = this.b, i = this.c, s = this.d, o = this.e, r = this.f, a = t * s - e * i;
    if (!a) throw new Error("Cannot invert " + this);
    const l = s / a, c = -e / a, h = -i / a, d = t / a, f = -(l * o + h * r), u = -(c * o + d * r);
    return this.a = l, this.b = c, this.c = h, this.d = d, this.e = f, this.f = u, this;
  }
  lmultiply(t) {
    return this.clone().lmultiplyO(t);
  }
  lmultiplyO(t) {
    const e = this, i = t instanceof K ? t : new K(t);
    return K.matrixMultiply(i, e, this);
  }
  multiply(t) {
    return this.clone().multiplyO(t);
  }
  multiplyO(t) {
    const e = this, i = t instanceof K ? t : new K(t);
    return K.matrixMultiply(e, i, this);
  }
  rotate(t, e, i) {
    return this.clone().rotateO(t, e, i);
  }
  rotateO(t, e = 0, i = 0) {
    t = En(t);
    const s = Math.cos(t), o = Math.sin(t), { a: r, b: a, c: l, d: c, e: h, f: d } = this;
    return this.a = r * s - a * o, this.b = a * s + r * o, this.c = l * s - c * o, this.d = c * s + l * o, this.e = h * s - d * o + i * o - e * s + e, this.f = d * s + h * o - e * o - i * s + i, this;
  }
  scale() {
    return this.clone().scaleO(...arguments);
  }
  scaleO(t, e = t, i = 0, s = 0) {
    arguments.length === 3 && (s = i, i = e, e = t);
    const { a: o, b: r, c: a, d: l, e: c, f: h } = this;
    return this.a = o * t, this.b = r * e, this.c = a * t, this.d = l * e, this.e = c * t - i * t + i, this.f = h * e - s * e + s, this;
  }
  shear(t, e, i) {
    return this.clone().shearO(t, e, i);
  }
  shearO(t, e = 0, i = 0) {
    const { a: s, b: o, c: r, d: a, e: l, f: c } = this;
    return this.a = s + o * t, this.c = r + a * t, this.e = l + c * t - i * t, this;
  }
  skew() {
    return this.clone().skewO(...arguments);
  }
  skewO(t, e = t, i = 0, s = 0) {
    arguments.length === 3 && (s = i, i = e, e = t), t = En(t), e = En(e);
    const o = Math.tan(t), r = Math.tan(e), { a, b: l, c, d: h, e: d, f } = this;
    return this.a = a + l * o, this.b = l + a * r, this.c = c + h * o, this.d = h + c * r, this.e = d + f * o - s * o, this.f = f + d * r - i * r, this;
  }
  skewX(t, e, i) {
    return this.skew(t, 0, e, i);
  }
  skewY(t, e, i) {
    return this.skew(0, t, e, i);
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
    if (K.isMatrixLike(t)) return new K(t).multiplyO(this);
    const e = K.formatTransforms(t), i = this, { x: s, y: o } = new W(e.ox, e.oy).transform(i), r = new K().translateO(e.rx, e.ry).lmultiplyO(i).translateO(-s, -o).scaleO(e.scaleX, e.scaleY).skewO(e.skewX, e.skewY).shearO(e.shear).rotateO(e.theta).translateO(s, o);
    if (isFinite(e.px) || isFinite(e.py)) {
      const a = new W(s, o).transform(r), l = isFinite(e.px) ? e.px - a.x : 0, c = isFinite(e.py) ? e.py - a.y : 0;
      r.translateO(l, c);
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
function Xa() {
  return new P(this.node.getCTM());
}
function Wa() {
  try {
    if (typeof this.isRoot == "function" && !this.isRoot()) {
      const n = this.rect(1, 1), t = n.node.getScreenCTM();
      return n.remove(), new P(t);
    }
    return new P(this.node.getScreenCTM());
  } catch {
    return console.warn(`Cannot get CTM from SVG node ${this.node.nodeName}. Is the element rendered?`), new P();
  }
}
z(P, "Matrix");
function Mt() {
  if (!Mt.nodes || Mt.nodes.svg.node.ownerDocument !== L.document) {
    const n = nt().size(2, 0);
    n.node.style.cssText = [
      "opacity: 0",
      "position: absolute",
      "left: -100%",
      "top: -100%",
      "overflow: hidden"
    ].join(";"), n.attr("focusable", "false"), n.attr("aria-hidden", "true"), Mt.nodes = {
      svg: n,
      path: n.path().node
    };
  }
  return Mt.nodes.svg.node.parentNode || Mt.nodes.svg.addTo(L.document.body || L.document.documentElement), Mt.nodes;
}
function Qs(n) {
  return !n.width && !n.height && !n.x && !n.y;
}
function qa(n) {
  return n === L.document || (L.document.documentElement.contains || function(t) {
    for (; t.parentNode; ) t = t.parentNode;
    return t === L.document;
  }).call(L.document.documentElement, n);
}
var Q = class je {
  constructor(...t) {
    this.init(...t);
  }
  addOffset() {
    return this.x += L.window.pageXOffset, this.y += L.window.pageYOffset, new je(this);
  }
  init(t) {
    return t = typeof t == "string" ? t.split(kt).map(parseFloat) : Array.isArray(t) ? t : typeof t == "object" ? [
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
    return Qs(this);
  }
  merge(t) {
    const e = Math.min(this.x, t.x), i = Math.min(this.y, t.y), s = Math.max(this.x + this.width, t.x + t.width) - e, o = Math.max(this.y + this.height, t.y + t.height) - i;
    return new je(e, i, s, o);
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
    t instanceof P || (t = new P(t));
    let e = 1 / 0, i = -1 / 0, s = 1 / 0, o = -1 / 0;
    return [
      new W(this.x, this.y),
      new W(this.x2, this.y),
      new W(this.x, this.y2),
      new W(this.x2, this.y2)
    ].forEach(function(r) {
      r = r.transform(t), e = Math.min(e, r.x), i = Math.max(i, r.x), s = Math.min(s, r.y), o = Math.max(o, r.y);
    }), new je(e, s, i - e, o - s);
  }
};
function Js(n, t, e) {
  let i;
  try {
    if (i = t(n.node), Qs(i) && !qa(n.node)) throw new Error("Element not in the dom");
  } catch {
    i = e(n);
  }
  return i;
}
function Za() {
  const e = Js(this, (i) => i.getBBox(), (i) => {
    try {
      const s = i.clone().addTo(Mt().svg).show(), o = s.node.getBBox();
      return s.remove(), o;
    } catch (s) {
      throw new Error(`Getting bbox of element "${i.node.nodeName}" is not possible: ${s.toString()}`);
    }
  });
  return new Q(e);
}
function Va(n) {
  const i = Js(this, (o) => o.getBoundingClientRect(), (o) => {
    throw new Error(`Getting rbox of element "${o.node.nodeName}" is not possible`);
  }), s = new Q(i);
  return n ? s.transform(n.screenCTM().inverseO()) : s.addOffset();
}
function ja(n, t) {
  const e = this.bbox();
  return n > e.x && t > e.y && n < e.x + e.width && t < e.y + e.height;
}
I({ viewbox: {
  viewbox(n, t, e, i) {
    return n == null ? new Q(this.attr("viewBox")) : this.attr("viewBox", new Q(n, t, e, i));
  },
  zoom(n, t) {
    let { width: e, height: i } = this.attr(["width", "height"]);
    if ((!e && !i || typeof e == "string" || typeof i == "string") && (e = this.node.clientWidth, i = this.node.clientHeight), !e || !i) throw new Error("Impossible to get absolute width and height. Please provide an absolute width and height attribute on the zooming element");
    const s = this.viewbox(), o = e / s.width, r = i / s.height, a = Math.min(o, r);
    if (n == null) return a;
    let l = a / n;
    l === 1 / 0 && (l = Number.MAX_SAFE_INTEGER / 100), t = t || new W(e / 2 / o + s.x, i / 2 / r + s.y);
    const c = new Q(s).transform(new P({
      scale: l,
      origin: t
    }));
    return this.viewbox(c);
  }
} });
z(Q, "Box");
var Tt = class extends Array {
  constructor(n = [], ...t) {
    if (super(n, ...t), typeof n == "number") return this;
    this.length = 0, this.push(...n);
  }
};
D([Tt], {
  each(n, ...t) {
    return typeof n == "function" ? this.map((e, i, s) => n.call(e, e, i, s)) : this.map((e) => e[n](...t));
  },
  toArray() {
    return Array.prototype.concat.apply([], this);
  }
});
const Xi = [
  "toArray",
  "constructor",
  "each"
];
Tt.extend = function(n) {
  n = n.reduce((t, e) => ((0, Xt.default)(Xi).call(Xi, e) || e[0] === "_" || (e in Array.prototype && (t["$" + e] = Array.prototype[e]), t[e] = function(...i) {
    return this.each(e, ...i);
  }), t), {}), D([Tt], n);
};
function Yn(n) {
  let t = (n + "").trim();
  const e = t.match(/^url\((.*)\)$/i);
  if (e) {
    t = e[1].trim();
    const s = t[0];
    if (s === '"' || s === "'") {
      if (t[t.length - 1] !== s) return null;
      t = t.slice(1, -1);
    }
  }
  const i = t.match(Ca);
  return i ? i[1].slice(1) : null;
}
function to(n, t) {
  const e = `#${L.window.CSS.escape(t)}`;
  return n.nodeType === 1 && n.matches(e) ? n : n.querySelector(e);
}
function Ka(n, t) {
  const e = Yn(t);
  return e ? to(n.getRootNode(), e) : null;
}
function Le(n, t, e = `[${t}]`) {
  const i = n.getAttribute("id"), s = n.getRootNode();
  if (!i || to(s, i) !== n) return new Tt();
  const o = [];
  s.nodeType === 1 && s.matches(e) && Yn(s.getAttribute(t)) === i && o.push(st(s));
  for (const r of s.querySelectorAll(e)) Yn(r.getAttribute(t)) === i && o.push(st(r));
  return new Tt(o);
}
function Qa(n, t) {
  return new Tt(fi((t || L.document).querySelectorAll(n), function(e) {
    return st(e);
  }));
}
function Ja(n) {
  return Qa(n, this.node);
}
function tl(n) {
  return st(this.node.querySelector(n));
}
let el = 0;
const $n = /* @__PURE__ */ new WeakMap(), Xn = /* @__PURE__ */ new WeakMap(), Wn = () => /* @__PURE__ */ Object.create(null);
function vi(n) {
  const t = n.getEventHolder();
  let e = $n.get(t);
  return e || (e = Wn(), $n.set(t, e)), e;
}
function wi(n) {
  return n.getEventTarget();
}
function nl(n) {
  $n.delete(n.getEventHolder());
}
function ct(n, t, e, i, s) {
  const o = e.bind(i || n), r = s || !1, a = nt(n), l = vi(a), c = wi(a);
  t = Array.isArray(t) ? t : t.split(kt);
  let h = Xn.get(e);
  h || (h = ++el, Xn.set(e, h)), t.forEach(function(d) {
    const f = d.split(".")[0], u = d.split(".")[1] || "*";
    l[f] = l[f] || Wn(), l[f][u] = l[f][u] || Wn(), l[f][u][h] = l[f][u][h] || [], l[f][u][h].push({
      listener: o,
      options: r
    }), c.addEventListener(f, o, r);
  });
}
function V(n, t, e, i) {
  const s = nt(n), o = vi(s), r = wi(s);
  typeof e == "function" && (e = Xn.get(e), !e) || (t = Array.isArray(t) ? t : (t || "").split(kt), t.forEach(function(a) {
    const l = a && a.split(".")[0], c = a && a.split(".")[1];
    let h, d;
    if (e) {
      if (o[l] && o[l][c || "*"]) {
        const f = o[l][c || "*"][e];
        if (!f) return;
        f.forEach(function(u) {
          r.removeEventListener(l, u.listener, u.options ?? i ?? !1);
        }), delete o[l][c || "*"][e];
      }
    } else if (l && c) {
      if (o[l] && o[l][c]) {
        for (d in o[l][c]) V(r, [l, c].join("."), d);
        delete o[l][c];
      }
    } else if (c)
      for (a in o) for (h in o[a]) c === h && V(r, [a, c].join("."));
    else if (l) {
      if (o[l]) {
        for (h in o[l]) V(r, [l, h].join("."));
        delete o[l];
      }
    } else {
      for (a in o) V(r, a);
      nl(s);
    }
  }));
}
function il(n, t, e, i) {
  const s = wi(n);
  return t instanceof L.window.Event || (t = new L.window.CustomEvent(t, {
    detail: e,
    cancelable: !0,
    ...i
  })), s.dispatchEvent(t), t;
}
var ze = class extends gi {
  addEventListener() {
  }
  dispatch(n, t, e) {
    return il(this, n, t, e);
  }
  dispatchEvent(n) {
    const t = vi(this)[n.type];
    if (!t) return !0;
    for (const e in t) for (const i in t[e]) t[e][i].forEach(function(s) {
      s.listener(n);
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
    return V(this, n, t, e), this;
  }
  on(n, t, e, i) {
    return ct(this, n, t, e, i), this;
  }
  removeEventListener() {
  }
};
z(ze, "EventTarget");
function Wi() {
}
const be = {
  duration: 400,
  ease: ">",
  delay: 0
}, sl = {
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
var se = class extends Array {
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
    return n instanceof Array ? n : n.trim().split(kt).map(parseFloat);
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
}, G = class yt {
  constructor(...t) {
    this.init(...t);
  }
  convert(t) {
    return new yt(this.value, t);
  }
  divide(t) {
    return t = new yt(t), new yt(this / t, this.unit || t.unit);
  }
  init(t, e) {
    return e = Array.isArray(t) ? t[1] : e, t = Array.isArray(t) ? t[0] : t, this.value = 0, this.unit = e || "", typeof t == "number" ? this.value = isNaN(t) ? 0 : isFinite(t) ? t : t < 0 ? -34e37 : 34e37 : typeof t == "string" ? (e = t.match(js), e && (this.value = parseFloat(e[1]), e[5] === "%" ? this.value /= 100 : e[5] === "s" && (this.value *= 1e3), this.unit = e[5])) : t instanceof yt && (this.value = t.valueOf(), this.unit = t.unit), this;
  }
  minus(t) {
    return t = new yt(t), new yt(this - t, this.unit || t.unit);
  }
  plus(t) {
    return t = new yt(t), new yt(this + t, this.unit || t.unit);
  }
  times(t) {
    return t = new yt(t), new yt(this * t, this.unit || t.unit);
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
const ol = /* @__PURE__ */ new Set([
  "fill",
  "stroke",
  "color",
  "bgcolor",
  "stop-color",
  "flood-color",
  "lighting-color"
]), eo = [];
function rl(n) {
  eo.push(n);
}
function al(n, t, e) {
  if (n == null) {
    n = {}, t = this.node.attributes;
    for (const i of t) n[i.nodeName] = $i.test(i.nodeValue) ? parseFloat(i.nodeValue) : i.nodeValue;
    return n;
  } else {
    if (n instanceof Array) return n.reduce((i, s) => (i[s] = this.attr(s), i), {});
    if (typeof n == "object" && n.constructor === Object) for (t in n) this.attr(t, n[t]);
    else if (t === null) this.node.removeAttribute(n);
    else {
      if (t == null)
        return t = this.node.getAttribute(n), t == null ? sl[n] : $i.test(t) ? parseFloat(t) : t;
      t = eo.reduce((i, s) => s(n, i, this), t), typeof t == "number" ? t = new G(t) : ol.has(n) && _t.isColor(t) ? t = new _t(t) : t.constructor === Array && (t = new se(t)), n === "leading" ? this.leading && this.leading(t) : typeof e == "string" ? this.node.setAttributeNS(e, n, t.toString()) : this.node.setAttribute(n, t.toString()), this.rebuild && (n === "font-size" || n === "x") && this.rebuild();
    }
  }
  return this;
}
var oe = class no extends ze {
  constructor(t, e) {
    super(), this.node = t, this.type = t.nodeName, e && t !== e && this.attr(e);
  }
  add(t, e) {
    return t = nt(t), t.removeNamespace && this.node instanceof L.window.SVGElement && t.removeNamespace(), e == null ? this.node.appendChild(t.node) : t.node !== this.node.childNodes[e] && this.node.insertBefore(t.node, this.node.childNodes[e]), this;
  }
  addTo(t, e) {
    return nt(t).put(this, e);
  }
  children() {
    return new Tt(fi(this.node.children, function(t) {
      return st(t);
    }));
  }
  clear() {
    for (; this.node.hasChildNodes(); ) this.node.removeChild(this.node.lastChild);
    return this;
  }
  clone(t = !0, e = !0) {
    this.writeDataToDom();
    let i = this.node.cloneNode(t);
    return e && (i = Vs(i)), new this.constructor(i);
  }
  each(t, e) {
    const i = this.children();
    let s, o;
    for (s = 0, o = i.length; s < o; s++)
      t.apply(i[s], [s, i]), e && i[s].each(t, e);
    return this;
  }
  element(t, e) {
    return this.put(new no(Se(t), e));
  }
  first() {
    return st(this.node.firstChild);
  }
  get(t) {
    return st(this.node.childNodes[t]);
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
    return this.xml(t, e, ra);
  }
  id(t) {
    return typeof t > "u" && !this.node.id && (this.node.id = Zs(this.type)), this.attr("id", t);
  }
  index(t) {
    return [].slice.call(this.node.childNodes).indexOf(t.node);
  }
  last() {
    return st(this.node.lastChild);
  }
  matches(t) {
    const e = this.node, i = e.matches || e.matchesSelector || e.msMatchesSelector || e.mozMatchesSelector || e.webkitMatchesSelector || e.oMatchesSelector || null;
    return i && i.call(e, t);
  }
  parent(t) {
    let e = this;
    if (!e.node.parentNode) return null;
    if (e = st(e.node.parentNode), !t) return e;
    do
      if (typeof t == "string" ? e.matches(t) : e instanceof t) return e;
    while (e = st(e.node.parentNode));
    return e;
  }
  put(t, e) {
    return t = nt(t), this.add(t, e), t;
  }
  putIn(t, e) {
    return nt(t).add(this, e);
  }
  remove() {
    return this.parent() && this.parent().removeElement(this), this;
  }
  removeElement(t) {
    return this.node.removeChild(t.node), this;
  }
  replace(t) {
    return t = nt(t), this.node.parentNode && this.node.parentNode.replaceChild(t.node, this.node), t;
  }
  round(t = 2, e = null) {
    const i = 10 ** t, s = this.attr(e);
    for (const o in s) typeof s[o] == "number" && (s[o] = Math.round(s[o] * i) / i);
    return this.attr(s), this;
  }
  svg(t, e) {
    return this.xml(t, e, pi);
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
    const i = e.index(this);
    return e.put(t, i).put(this);
  }
  writeDataToDom() {
    return this.each(function() {
      this.writeDataToDom();
    }), this;
  }
  xml(t, e, i) {
    if (typeof t == "boolean" && (i = e, e = t, t = null), t == null || typeof t == "function") {
      e = e ?? !0, this.writeDataToDom();
      let a = this;
      if (t != null) {
        if (a = st(a.node.cloneNode(!0)), e) {
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
    const s = Se("wrapper", i), o = L.document.createDocumentFragment();
    s.innerHTML = t;
    for (let a = s.children.length; a--; ) o.appendChild(s.firstElementChild);
    const r = this.parent();
    return e ? this.replace(o) && r : this.add(o);
  }
};
D(oe, {
  attr: al,
  find: Ja,
  findOne: tl
});
z(oe, "Dom");
var at = class extends oe {
  constructor(n, t) {
    super(n, t), this.dom = {}, this.node.instance = this, (n.hasAttribute("data-svgjs") || n.hasAttribute("svgjs:data")) && this.setData(JSON.parse(n.getAttribute("data-svgjs")) ?? JSON.parse(n.getAttribute("svgjs:data")) ?? {});
  }
  center(n, t) {
    return this.cx(n).cy(t);
  }
  cx(n) {
    return n == null ? this.x() + this.width() / 2 : this.x(n - this.width() / 2);
  }
  cy(n) {
    return n == null ? this.y() + this.height() / 2 : this.y(n - this.height() / 2);
  }
  defs() {
    const n = this.root();
    return n && n.defs();
  }
  dmove(n, t) {
    return this.dx(n).dy(t);
  }
  dx(n = 0) {
    return this.x(new G(n).plus(this.x()));
  }
  dy(n = 0) {
    return this.y(new G(n).plus(this.y()));
  }
  getEventHolder() {
    return this;
  }
  height(n) {
    return this.attr("height", n);
  }
  move(n, t) {
    return this.x(n).y(t);
  }
  parents(n = this.root()) {
    const t = typeof n == "string", e = this.root(), i = e && e.node;
    t || (n = n && nt(n).node);
    const s = new Tt();
    let o = this;
    for (; (o = o.parent()) && o.node !== L.document && o.node.nodeName !== "#document-fragment" && (s.push(o), !(!t && o.node === n || t && o.matches(n))); )
      if (i && o.node === i) return null;
    return s;
  }
  reference(n) {
    if (n = this.attr(n), !n) return null;
    const t = Ka(this.node, n);
    return t ? nt(t) : null;
  }
  root() {
    const n = this.parent(aa(yi));
    return n && n.root();
  }
  setData(n) {
    return this.dom = n, this;
  }
  size(n, t) {
    const e = Zt(this, n, t);
    return this.width(new G(e.width)).height(new G(e.height));
  }
  width(n) {
    return this.attr("width", n);
  }
  writeDataToDom(n) {
    return oa(this, this.dom, n), super.writeDataToDom();
  }
  x(n) {
    return this.attr("x", n);
  }
  y(n) {
    return this.attr("y", n);
  }
};
D(at, {
  bbox: Za,
  rbox: Va,
  inside: ja,
  point: $a,
  ctm: Xa,
  screenCTM: Wa
});
z(at, "Element");
const fe = {
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
  t[n] = function(i) {
    if (typeof i > "u") return this.attr(n);
    if (typeof i == "string" || i instanceof _t || _t.isRgb(i) || i instanceof at) this.attr(n, i);
    else for (e = fe[n].length - 1; e >= 0; e--) i[fe[n][e]] != null && this.attr(fe.prefix(n, fe[n][e]), i[fe[n][e]]);
    return this;
  }, I(["Element", "Runner"], t);
});
I(["Element", "Runner"], {
  matrix: function(n, t, e, i, s, o) {
    return n == null ? new P(this) : this.attr("transform", new P(n, t, e, i, s, o));
  },
  rotate: function(n, t, e) {
    return this.transform({
      rotate: n,
      ox: t,
      oy: e
    }, !0);
  },
  skew: function(n, t, e, i) {
    return arguments.length === 1 || arguments.length === 3 ? this.transform({
      skew: n,
      ox: t,
      oy: e
    }, !0) : this.transform({
      skew: [n, t],
      ox: e,
      oy: i
    }, !0);
  },
  shear: function(n, t, e) {
    return this.transform({
      shear: n,
      ox: t,
      oy: e
    }, !0);
  },
  scale: function(n, t, e, i) {
    return arguments.length === 1 || arguments.length === 3 ? this.transform({
      scale: n,
      ox: t,
      oy: e
    }, !0) : this.transform({
      scale: [n, t],
      ox: e,
      oy: i
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
I("radius", { radius: function(n, t = n) {
  return (this._element || this).type === "radialGradient" ? this.attr("r", new G(n)) : this.rx(n).ry(t);
} });
I("Path", {
  length: function() {
    return this.node.getTotalLength();
  },
  pointAt: function(n) {
    return new W(this.node.getPointAtLength(n));
  }
});
I(["Element", "Runner"], { font: function(n, t) {
  if (typeof n == "object") {
    for (t in n) this.font(t, n[t]);
    return this;
  }
  return n === "leading" ? this.leading(t) : n === "anchor" ? this.attr("text-anchor", t) : n === "size" || n === "family" || n === "weight" || n === "stretch" || n === "variant" || n === "style" ? this.attr("font-" + n, t) : this.attr(n, t);
} });
I("Element", [
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
}, {}));
function ll() {
  return this.attr("transform", null);
}
function cl() {
  return (this.attr("transform") || "").split(Ea).slice(0, -1).map(function(n) {
    const t = n.trim().split("(");
    return [t[0].trim(), t[1].split(kt).map(function(e) {
      return parseFloat(e);
    })];
  }).reverse().reduce(function(n, t) {
    return t[0] === "matrix" ? n.lmultiply(P.fromArray(t[1])) : n[t[0]].apply(n, t[1]);
  }, new P());
}
function hl(n, t) {
  if (this === n) return this;
  if (Un(this.node)) return this.addTo(n, t);
  const e = this.screenCTM(), i = n.screenCTM().inverse();
  return this.addTo(n, t).untransform().transform(i.multiply(e)), this;
}
function dl(n) {
  return this.toParent(this.root(), n);
}
function ul(n, t) {
  if (n == null || typeof n == "string") {
    const i = new P(this).decompose();
    return n == null ? i : i[n];
  }
  P.isMatrixLike(n) || (n = {
    ...n,
    origin: Fn(n, this)
  });
  const e = new P(t === !0 ? this : t || !1).transform(n);
  return this.attr("transform", e);
}
I("Element", {
  untransform: ll,
  matrixify: cl,
  toParent: hl,
  toRoot: dl,
  transform: ul
});
var mt = class io extends at {
  flatten() {
    return this.each(function() {
      if (this instanceof io) return this.flatten().ungroup();
    }), this;
  }
  ungroup(t = this.parent(), e = t.index(this)) {
    return e = e === -1 ? t.children().length : e, this.each(function(i, s) {
      return s[s.length - i - 1].toParent(t, e);
    }), this.remove();
  }
};
z(mt, "Container");
var xi = class extends mt {
  constructor(n, t = n) {
    super(U("defs", n), t);
  }
  flatten() {
    return this;
  }
  ungroup() {
    return this;
  }
};
z(xi, "Defs");
var ht = class extends at {
};
z(ht, "Shape");
var fl = /* @__PURE__ */ le({
  cx: () => ro,
  cy: () => ao,
  height: () => co,
  rx: () => _i,
  ry: () => Ci,
  width: () => lo,
  x: () => so,
  y: () => oo
});
function _i(n) {
  return this.attr("rx", n);
}
function Ci(n) {
  return this.attr("ry", n);
}
function so(n) {
  return n == null ? this.cx() - this.rx() : this.cx(n + this.rx());
}
function oo(n) {
  return n == null ? this.cy() - this.ry() : this.cy(n + this.ry());
}
function ro(n) {
  return this.attr("cx", n);
}
function ao(n) {
  return this.attr("cy", n);
}
function lo(n) {
  return n == null ? this.rx() * 2 : this.rx(new G(n).divide(2));
}
function co(n) {
  return n == null ? this.ry() * 2 : this.ry(new G(n).divide(2));
}
var Ge = class extends ht {
  constructor(n, t = n) {
    super(U("ellipse", n), t);
  }
  size(n, t) {
    const e = Zt(this, n, t);
    return this.rx(new G(e.width).divide(2)).ry(new G(e.height).divide(2));
  }
};
D(Ge, fl);
I("Container", { ellipse: F(function(n = 0, t = n) {
  return this.put(new Ge()).size(n, t).move(0, 0);
}) });
z(Ge, "Ellipse");
var ho = class extends oe {
  constructor(n = L.document.createDocumentFragment()) {
    super(n);
  }
  xml(n, t, e) {
    if (typeof n == "boolean" && (e = t, t = n, n = null), n == null || typeof n == "function") {
      const i = new oe(Se("wrapper", e));
      return i.add(this.node.cloneNode(!0)), i.xml(!1, e);
    }
    return super.xml(n, !1, e);
  }
};
z(ho, "Fragment");
var pl = /* @__PURE__ */ le({
  from: () => uo,
  to: () => fo
});
function uo(n, t) {
  return (this._element || this).type === "radialGradient" ? this.attr({
    fx: new G(n),
    fy: new G(t)
  }) : this.attr({
    x1: new G(n),
    y1: new G(t)
  });
}
function fo(n, t) {
  return (this._element || this).type === "radialGradient" ? this.attr({
    cx: new G(n),
    cy: new G(t)
  }) : this.attr({
    x2: new G(n),
    y2: new G(t)
  });
}
var Be = class extends mt {
  constructor(n, t) {
    super(U(n + "Gradient", typeof n == "string" ? null : n), t);
  }
  attr(n, t, e) {
    return n === "transform" && (n = "gradientTransform"), super.attr(n, t, e);
  }
  bbox() {
    return new Q();
  }
  targets() {
    return Le(this.node, "fill");
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
D(Be, pl);
I({
  Container: { gradient(...n) {
    return this.defs().gradient(...n);
  } },
  Defs: { gradient: F(function(n, t) {
    return this.put(new Be(n)).update(t);
  }) }
});
z(Be, "Gradient");
var Ae = class extends mt {
  constructor(n, t = n) {
    super(U("pattern", n), t);
  }
  attr(n, t, e) {
    return n === "transform" && (n = "patternTransform"), super.attr(n, t, e);
  }
  bbox() {
    return new Q();
  }
  targets() {
    return Le(this.node, "fill");
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
I({
  Container: { pattern(...n) {
    return this.defs().pattern(...n);
  } },
  Defs: { pattern: F(function(n, t, e) {
    return this.put(new Ae()).update(e).attr({
      x: 0,
      y: 0,
      width: n,
      height: t,
      patternUnits: "userSpaceOnUse"
    });
  }) }
});
z(Ae, "Pattern");
var gn = class extends ht {
  constructor(t, e = t) {
    super(U("image", t), e);
  }
  load(t, e) {
    if (!t) return this;
    const i = new L.window.Image();
    return ct(i, "load", function(s) {
      const o = this.parent(Ae);
      this.width() === 0 && this.height() === 0 && this.size(i.width, i.height), o instanceof Ae && o.width() === 0 && o.height() === 0 && o.size(this.width(), this.height()), typeof e == "function" && e.call(this, s);
    }, this), ct(i, "load error", function() {
      V(i);
    }), this.attr("href", i.src = t, Ie);
  }
};
rl(function(n, t, e) {
  return (n === "fill" || n === "stroke") && Aa.test(t) && (t = e.root().defs().image(t)), t instanceof gn && (t = e.root().defs().pattern(0, 0, (i) => {
    i.add(t);
  })), t;
});
I({ Container: { image: F(function(n, t) {
  return this.put(new gn()).size(0, 0).load(n, t);
}) } });
z(gn, "Image");
var zt = class extends se {
  bbox() {
    let n = -1 / 0, t = -1 / 0, e = 1 / 0, i = 1 / 0;
    return this.forEach(function(s) {
      n = Math.max(s[0], n), t = Math.max(s[1], t), e = Math.min(s[0], e), i = Math.min(s[1], i);
    }), new Q(e, i, n - e, t - i);
  }
  move(n, t) {
    const e = this.bbox();
    if (n -= e.x, t -= e.y, !isNaN(n) && !isNaN(t)) for (let i = this.length - 1; i >= 0; i--) this[i] = [this[i][0] + n, this[i][1] + t];
    return this;
  }
  parse(n = [0, 0]) {
    const t = [];
    n instanceof Array ? n = Array.prototype.concat.apply([], n) : n = n.trim().split(kt).map(parseFloat), n.length % 2 !== 0 && n.pop();
    for (let e = 0, i = n.length; e < i; e = e + 2) t.push([n[e], n[e + 1]]);
    return t;
  }
  size(n, t) {
    let e;
    const i = this.bbox();
    for (e = this.length - 1; e >= 0; e--)
      i.width && (this[e][0] = (this[e][0] - i.x) * n / i.width + i.x), i.height && (this[e][1] = (this[e][1] - i.y) * t / i.height + i.y);
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
    P.isMatrixLike(n) || (n = new P(n));
    for (let t = this.length; t--; ) {
      const [e, i] = this[t];
      this[t][0] = n.a * e + n.c * i + n.e, this[t][1] = n.b * e + n.d * i + n.f;
    }
    return this;
  }
}, Ei = /* @__PURE__ */ le({
  MorphArray: () => ml,
  height: () => vl,
  width: () => bl,
  x: () => gl,
  y: () => yl
});
const ml = zt;
function gl(n) {
  return n == null ? this.bbox().x : this.move(n, this.bbox().y);
}
function yl(n) {
  return n == null ? this.bbox().y : this.move(this.bbox().x, n);
}
function bl(n) {
  const t = this.bbox();
  return n == null ? t.width : this.size(n, t.height);
}
function vl(n) {
  const t = this.bbox();
  return n == null ? t.height : this.size(t.width, n);
}
var re = class extends ht {
  constructor(n, t = n) {
    super(U("line", n), t);
  }
  array() {
    return new zt([[this.attr("x1"), this.attr("y1")], [this.attr("x2"), this.attr("y2")]]);
  }
  move(n, t) {
    return this.attr(this.array().move(n, t).toLine());
  }
  plot(n, t, e, i) {
    return n == null ? this.array() : (typeof t < "u" ? n = {
      x1: n,
      y1: t,
      x2: e,
      y2: i
    } : n = new zt(n).toLine(), this.attr(n));
  }
  size(n, t) {
    const e = Zt(this, n, t);
    return this.attr(this.array().size(e.width, e.height).toLine());
  }
};
D(re, Ei);
I({ Container: { line: F(function(...n) {
  return re.prototype.plot.apply(this.put(new re()), n[0] != null ? n : [
    0,
    0,
    0,
    0
  ]);
}) } });
z(re, "Line");
var tn = class extends mt {
  constructor(n, t = n) {
    super(U("marker", n), t);
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
I({
  Container: { marker(...n) {
    return this.defs().marker(...n);
  } },
  Defs: { marker: F(function(n, t, e) {
    return this.put(new tn()).size(n, t).ref(n / 2, t / 2).viewbox(0, 0, n, t).attr("orient", "auto").update(e);
  }) },
  marker: { marker(n, t, e, i) {
    let s = ["marker"];
    return n !== "all" && s.push(n), s = s.join("-"), n = arguments[1] instanceof tn ? arguments[1] : this.defs().marker(t, e, i), this.attr(s, n);
  } }
});
z(tn, "Marker");
function ee(n, t) {
  return function(e) {
    return e == null ? this[n] : (this[n] = e, t && t.call(this), this);
  };
}
const wl = {
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
var Si = class {
  done() {
    return !1;
  }
}, qn = class extends Si {
  constructor(n = be.ease) {
    super(), this.ease = wl[n] || n;
  }
  step(n, t, e) {
    return typeof n != "number" ? e < 1 ? n : t : n + (t - n) * this.ease(e);
  }
}, en = class extends Si {
  constructor(n) {
    super(), this.stepper = n;
  }
  done(n) {
    return n.done;
  }
  step(n, t, e, i) {
    return this.stepper(n, t, e, i);
  }
};
function qi() {
  const n = (this._duration || 500) / 1e3, t = this._overshoot || 0, e = 1e-10, i = Math.PI, s = Math.log(t / 100 + e), o = -s / Math.sqrt(i * i + s * s), r = 3.9 / (o * n);
  this.d = 2 * o * r, this.k = r * r;
}
var xl = class extends en {
  constructor(n = 500, t = 0) {
    super(), this.duration(n).overshoot(t);
  }
  step(n, t, e, i) {
    if (typeof n == "string") return n;
    if (i.done = e === 1 / 0, e === 1 / 0) return t;
    if (e === 0) return n;
    e > 100 && (e = 16), e /= 1e3;
    const s = i.velocity || 0, o = -this.d * s - this.k * (n - t), r = n + s * e + o * e * e / 2;
    return i.velocity = s + o * e, i.done = Math.abs(t - r) + Math.abs(s) < 2e-3, i.done ? t : r;
  }
};
D(xl, {
  duration: ee("_duration", qi),
  overshoot: ee("_overshoot", qi)
});
var _l = class extends en {
  constructor(n = 0.1, t = 0.01, e = 0, i = 1e3) {
    super(), this.p(n).i(t).d(e).windup(i);
  }
  step(n, t, e, i) {
    if (typeof n == "string") return n;
    if (i.done = e === 1 / 0, e === 1 / 0) return t;
    if (e === 0) return n;
    const s = t - n;
    let o = (i.integral || 0) + s * e;
    const r = (s - (i.error || 0)) / e, a = this._windup;
    return a !== !1 && (o = Math.max(-a, Math.min(o, a))), i.error = s, i.integral = o, i.done = Math.abs(s) < 1e-3, i.done ? t : n + (this.P * s + this.I * o + this.D * r);
  }
};
D(_l, {
  windup: ee("_windup"),
  p: ee("P"),
  i: ee("I"),
  d: ee("D")
});
const Cl = {
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
}, Zn = {
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
}, Tn = "mlhvqtcsaz".split("");
for (let n = 0, t = Tn.length; n < t; ++n) Zn[Tn[n]] = /* @__PURE__ */ function(e) {
  return function(i, s, o) {
    if (e === "H") i[0] = i[0] + s.x;
    else if (e === "V") i[0] = i[0] + s.y;
    else if (e === "A")
      i[5] = i[5] + s.x, i[6] = i[6] + s.y;
    else for (let r = 0, a = i.length; r < a; ++r) i[r] = i[r] + (r % 2 ? s.y : s.x);
    return Zn[e](i, s, o);
  };
}(Tn[n].toUpperCase());
function El(n) {
  return Zn[n.segment[0]](n.segment.slice(1), n.p, n.p0);
}
function Vn(n) {
  return n.segment.length && n.segment.length - 1 === Cl[n.segment[0].toUpperCase()];
}
function Sl(n, t) {
  n.inNumber && Yt(n, !1);
  const e = bi.test(t);
  if (e) n.segment = [t];
  else {
    const i = n.lastCommand, s = i.toLowerCase();
    n.segment = [s === "m" ? i === s ? "l" : "L" : i];
  }
  return n.inSegment = !0, n.lastCommand = n.segment[0], e;
}
function Yt(n, t) {
  if (!n.inNumber) throw new Error("Parser Error");
  n.number && n.segment.push(parseFloat(n.number)), n.inNumber = t, n.number = "", n.pointSeen = !1, n.hasExponent = !1, Vn(n) && jn(n);
}
function jn(n) {
  n.inSegment = !1, n.absolute && (n.segment = El(n)), n.segments.push(n.segment);
}
function Al(n) {
  if (!n.segment.length) return !1;
  const t = n.segment[0].toUpperCase() === "A", e = n.segment.length;
  return t && (e === 4 || e === 5);
}
function Ml(n) {
  return n.lastToken.toUpperCase() === "E";
}
const Tl = /* @__PURE__ */ new Set([
  " ",
  ",",
  "	",
  `
`,
  "\r",
  "\f"
]);
function Rl(n, t = !0) {
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
    p0: new W(),
    p: new W()
  };
  for (; s.lastToken = i, i = n.charAt(e++); )
    if (!(!s.inSegment && Sl(s, i))) {
      if (i === ".") {
        if (s.pointSeen || s.hasExponent) {
          Yt(s, !1), --e;
          continue;
        }
        s.inNumber = !0, s.pointSeen = !0, s.number += i;
        continue;
      }
      if (!isNaN(parseInt(i))) {
        if (s.number === "0" || Al(s)) {
          s.inNumber = !0, s.number = i, Yt(s, !0);
          continue;
        }
        s.inNumber = !0, s.number += i;
        continue;
      }
      if (Tl.has(i)) {
        s.inNumber && Yt(s, !1);
        continue;
      }
      if (i === "-" || i === "+") {
        if (s.inNumber && !Ml(s)) {
          Yt(s, !1), --e;
          continue;
        }
        s.number += i, s.inNumber = !0;
        continue;
      }
      if (i.toUpperCase() === "E") {
        s.number += i, s.hasExponent = !0;
        continue;
      }
      if (bi.test(i)) {
        if (s.inNumber) Yt(s, !1);
        else if (Vn(s)) jn(s);
        else throw new Error("parser Error");
        --e;
      }
    }
  return s.inNumber && Yt(s, !1), s.inSegment && Vn(s) && jn(s), s.segments;
}
function kl(n) {
  let t = "";
  for (let e = 0, i = n.length; e < i; e++)
    t += n[e][0], n[e][1] != null && (t += n[e][1], n[e][2] != null && (t += " ", t += n[e][2], n[e][3] != null && (t += " ", t += n[e][3], t += " ", t += n[e][4], n[e][5] != null && (t += " ", t += n[e][5], t += " ", t += n[e][6], n[e][7] != null && (t += " ", t += n[e][7])))));
  return t + " ";
}
var Gt = class extends se {
  bbox() {
    return Mt().path.setAttribute("d", this.toString()), new Q(Mt.nodes.path.getBBox());
  }
  move(n, t) {
    const e = this.bbox();
    if (n -= e.x, t -= e.y, !isNaN(n) && !isNaN(t)) for (let i, s = this.length - 1; s >= 0; s--)
      i = this[s][0], i === "M" || i === "L" || i === "T" ? (this[s][1] += n, this[s][2] += t) : i === "H" ? this[s][1] += n : i === "V" ? this[s][1] += t : i === "C" || i === "S" || i === "Q" ? (this[s][1] += n, this[s][2] += t, this[s][3] += n, this[s][4] += t, i === "C" && (this[s][5] += n, this[s][6] += t)) : i === "A" && (this[s][6] += n, this[s][7] += t);
    return this;
  }
  parse(n = "M0 0") {
    return Array.isArray(n) && (n = Array.prototype.concat.apply([], n).toString()), Rl(n);
  }
  size(n, t) {
    const e = this.bbox();
    let i, s;
    for (e.width = e.width === 0 ? 1 : e.width, e.height = e.height === 0 ? 1 : e.height, i = this.length - 1; i >= 0; i--)
      s = this[i][0], s === "M" || s === "L" || s === "T" ? (this[i][1] = (this[i][1] - e.x) * n / e.width + e.x, this[i][2] = (this[i][2] - e.y) * t / e.height + e.y) : s === "H" ? this[i][1] = (this[i][1] - e.x) * n / e.width + e.x : s === "V" ? this[i][1] = (this[i][1] - e.y) * t / e.height + e.y : s === "C" || s === "S" || s === "Q" ? (this[i][1] = (this[i][1] - e.x) * n / e.width + e.x, this[i][2] = (this[i][2] - e.y) * t / e.height + e.y, this[i][3] = (this[i][3] - e.x) * n / e.width + e.x, this[i][4] = (this[i][4] - e.y) * t / e.height + e.y, s === "C" && (this[i][5] = (this[i][5] - e.x) * n / e.width + e.x, this[i][6] = (this[i][6] - e.y) * t / e.height + e.y)) : s === "A" && (this[i][1] = this[i][1] * n / e.width, this[i][2] = this[i][2] * t / e.height, this[i][6] = (this[i][6] - e.x) * n / e.width + e.x, this[i][7] = (this[i][7] - e.y) * t / e.height + e.y);
    return this;
  }
  toString() {
    return kl(this);
  }
};
const po = (n) => {
  const t = typeof n;
  return t === "number" ? G : t === "string" ? _t.isColor(n) ? _t : kt.test(n) ? bi.test(n) ? Gt : se : js.test(n) ? G : Kn : Ai.indexOf(n.constructor) > -1 ? n.constructor : Array.isArray(n) ? se : t === "object" ? Me : Kn;
};
var Pt = class {
  constructor(n) {
    this._stepper = n || new qn("-"), this._from = null, this._to = null, this._type = null, this._context = null, this._morphObj = null;
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
    this._type || this.type(po(n));
    let t = new this._type(n);
    return this._type === _t && (t = this._to ? t[this._to[4]]() : this._from ? t[this._from[4]]() : t), this._type === Me && (t = this._to ? t.align(this._to) : this._from ? t.align(this._from) : t), t = t.toConsumable(), this._morphObj = this._morphObj || new this._type(), this._context = this._context || Array.apply(null, Array(t.length)).map(Object).map(function(e) {
      return e.done = !0, e;
    }), t;
  }
}, Kn = class {
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
}, we = class mo {
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
    }), Object.assign(this, mo.defaults, t), this;
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
we.defaults = {
  scaleX: 1,
  scaleY: 1,
  shear: 0,
  rotate: 0,
  translateX: 0,
  translateY: 0,
  originX: 0,
  originY: 0
};
const Nl = (n, t) => n[0] < t[0] ? -1 : n[0] > t[0] ? 1 : 0;
var Me = class {
  constructor(...n) {
    this.init(...n);
  }
  align(n) {
    const t = this.values;
    for (let e = 0, i = t.length; e < i; ++e) {
      if (t[e + 1] === n[e + 1]) {
        if (t[e + 1] === _t && n[e + 7] !== t[e + 7]) {
          const r = n[e + 7], a = new _t(this.values.splice(e + 3, 5))[r]().toArray();
          this.values.splice(e + 3, 0, ...a);
        }
        e += t[e + 2] + 2;
        continue;
      }
      if (!n[e + 1]) return this;
      const s = new n[e + 1]().toArray(), o = t[e + 2] + 3;
      t.splice(e, o, n[e], n[e + 1], n[e + 2], ...s), e += t[e + 2] + 2;
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
      const i = po(n[e]), s = new i(n[e]).toArray();
      t.push([
        e,
        i,
        s.length,
        ...s
      ]);
    }
    return t.sort(Nl), this.values = t.reduce((e, i) => e.concat(i), []), this;
  }
  toArray() {
    return this.values;
  }
  valueOf() {
    const n = {}, t = this.values;
    for (; t.length; ) {
      const e = t.shift(), i = t.shift(), s = t.shift();
      n[e] = new i(t.splice(0, s));
    }
    return n;
  }
};
const Ai = [
  Kn,
  we,
  Me
];
function Pl(n = []) {
  Ai.push(...[].concat(n));
}
function Dl() {
  D(Ai, {
    to(n) {
      return new Pt().type(this.constructor).from(this.toArray()).to(n);
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
var ce = class extends ht {
  constructor(n, t = n) {
    super(U("path", n), t);
  }
  array() {
    return this._array || (this._array = new Gt(this.attr("d")));
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
    return n == null ? this.array() : this.clear().attr("d", typeof n == "string" ? n : this._array = new Gt(n));
  }
  size(n, t) {
    const e = Zt(this, n, t);
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
ce.prototype.MorphArray = Gt;
I({ Container: { path: F(function(n) {
  return this.put(new ce()).plot(n || new Gt());
}) } });
z(ce, "Path");
var go = /* @__PURE__ */ le({
  array: () => Ol,
  clear: () => Il,
  move: () => Ll,
  plot: () => zl,
  size: () => Gl
});
function Ol() {
  return this._array || (this._array = new zt(this.attr("points")));
}
function Il() {
  return delete this._array, this;
}
function Ll(n, t) {
  return this.attr("points", this.array().move(n, t));
}
function zl(n) {
  return n == null ? this.array() : this.clear().attr("points", typeof n == "string" ? n : this._array = new zt(n));
}
function Gl(n, t) {
  const e = Zt(this, n, t);
  return this.attr("points", this.array().size(e.width, e.height));
}
var he = class extends ht {
  constructor(n, t = n) {
    super(U("polygon", n), t);
  }
};
I({ Container: { polygon: F(function(n) {
  return this.put(new he()).plot(n || new zt());
}) } });
D(he, Ei);
D(he, go);
z(he, "Polygon");
var de = class extends ht {
  constructor(n, t = n) {
    super(U("polyline", n), t);
  }
};
I({ Container: { polyline: F(function(n) {
  return this.put(new de()).plot(n || new zt());
}) } });
D(de, Ei);
D(de, go);
z(de, "Polyline");
var He = class extends ht {
  constructor(n, t = n) {
    super(U("rect", n), t);
  }
};
D(He, {
  rx: _i,
  ry: Ci
});
I({ Container: { rect: F(function(n, t) {
  return this.put(new He()).size(n, t);
}) } });
z(He, "Rect");
var Rn = class {
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
const B = {
  nextDraw: null,
  frames: new Rn(),
  timeouts: new Rn(),
  immediates: new Rn(),
  timer: () => L.window.performance || L.window.Date,
  frame(n) {
    const t = B.frames.push({ run: n });
    return B.nextDraw === null && (B.nextDraw = L.window.requestAnimationFrame(B._draw)), t;
  },
  timeout(n, t) {
    t = t || 0;
    const e = B.timer().now() + t, i = B.timeouts.push({
      run: n,
      time: e
    });
    return B.nextDraw === null && (B.nextDraw = L.window.requestAnimationFrame(B._draw)), i;
  },
  immediate(n) {
    const t = B.immediates.push(n);
    return B.nextDraw === null && (B.nextDraw = L.window.requestAnimationFrame(B._draw)), t;
  },
  cancelFrame(n) {
    n != null && B.frames.remove(n);
  },
  clearTimeout(n) {
    n != null && B.timeouts.remove(n);
  },
  cancelImmediate(n) {
    n != null && B.immediates.remove(n);
  },
  _draw(n) {
    try {
      let t = null;
      const e = B.timeouts.last();
      for (; (t = B.timeouts.shift()) && (n >= t.time ? t.run() : B.timeouts.push(t), t !== e); )
        ;
      let i = null;
      const s = B.frames.last();
      for (; i !== s && (i = B.frames.shift()); ) i.run(n);
      let o = null;
      for (; o = B.immediates.shift(); ) o();
    } finally {
      const t = B.timeouts.first() || B.frames.first() || B.immediates.first();
      B.nextDraw = t ? L.window.requestAnimationFrame(B._draw) : null;
    }
  }
}, Bl = function(n) {
  const t = n.start, e = n.runner.duration();
  return {
    start: t,
    duration: e,
    end: t + e,
    runner: n.runner
  };
}, Hl = function() {
  const n = L.window;
  return (n.performance || n.Date).now();
};
var yo = class extends ze {
  constructor(n = Hl) {
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
    if (n == null) return this._runners.map(Bl);
    let i = 0;
    const s = this.getEndTime();
    if (t = t || 0, e == null || e === "last" || e === "after") i = s;
    else if (e === "absolute" || e === "start")
      i = t, t = 0;
    else if (e === "now") i = this._time;
    else if (e === "relative") {
      const a = this.getRunnerInfoById(n.id);
      a && (i = a.start + t, t = 0);
    } else if (e === "with-last") {
      const a = this.getLastRunnerInfo();
      i = a ? a.start : this._time;
    } else throw new Error('Invalid value for the "when" parameter');
    n.unschedule(), n.timeline(this), n._retired = !1;
    const o = n.persist(), r = {
      persist: o === null ? this._persist : o,
      start: i + t,
      runner: n
    };
    return this._lastRunnerId = n.id, n._runnerInfo = r, this._runners.push(r), this._runners.sort((a, l) => a.start - l.start), this._runnerIds = this._runners.map((a) => a.runner.id), this.updateTime()._continue(), this;
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
    return B.cancelFrame(this._nextFrame), this._nextFrame = null, n ? this._stepImmediate() : this._paused ? this : (this._nextFrame = B.frame(this._step), this);
  }
  _stepFn(n = !1) {
    const t = this._generation, e = this._timeSource();
    let i = e - this._lastSourceTime;
    n && (i = 0);
    const s = this._speed * i + (this._time - this._lastStepTime);
    this._lastSourceTime = e, n || (this._time += s, this._time = this._time < 0 ? 0 : this._time), this._lastStepTime = this._time, this.fire("time", this._time);
    const o = this._runners.slice();
    for (let a = o.length; a--; ) {
      const l = o[a];
      if (l.runner._runnerInfo !== l) continue;
      const c = l.runner;
      this._time - l.start < 0 && c.reset(!0);
    }
    let r = !1;
    for (const a of this._runners.slice()) {
      if (a.runner._runnerInfo !== a) continue;
      const l = a.runner;
      let c = s;
      const h = this._time - a.start;
      if (h < 0) {
        r = !0;
        continue;
      } else if (h === 0) {
        l.reset(), r = !0;
        continue;
      } else h < c && (c = h);
      if (!l.active()) continue;
      const d = (this._finishing && l._isDeclarative ? l.finish() : l.step(c)).done;
      l._runnerInfo === a && (d ? a.persist !== !0 && l.duration() - l.time() + this._time + a.persist <= this._time && l.unschedule() : r = !0);
    }
    return t !== this._generation ? this : (r || (r = this._runners.some(({ start: a, runner: l }) => a >= this._time || l.active() && !l.done)), r && !(this._speed < 0 && this._time === 0) || this._runnerIds.length && this._speed < 0 && this._time > 0 ? this._continue() : (this.pause(), this.fire("finished")), this);
  }
  terminate() {
    B.cancelFrame(this._nextFrame), this._generation = (this._generation || 0) + 1, this._startTime = 0, this._speed = 1, this._persist = 0;
    for (const { runner: n } of this._runners || [])
      n._retired = !0, n._runnerInfo = null;
    this._nextFrame = null, this._paused = !0, this._finishing = !1, this._runners = [], this._runnerIds = [], this._lastRunnerId = -1, this._time = 0, this._lastSourceTime = 0, this._lastStepTime = 0, this._step = this._stepFn.bind(this, !1), this._stepImmediate = this._stepFn.bind(this, !0);
  }
};
I({ Element: { timeline: function(n) {
  return n == null ? (this._timeline = this._timeline || new yo(), this._timeline) : (this._timeline = n, this);
} } });
var Rt = class Ke extends ze {
  constructor(t) {
    super(), this.id = Ke.id++, t = t ?? be.duration, t = typeof t == "function" ? new en(t) : t, this._element = null, this._timeline = null, this._runnerInfo = null, this.done = !1, this._queue = [], this._duration = typeof t == "number" && t, this._isDeclarative = t instanceof en, this._stepper = this._isDeclarative ? t : new qn(), this._history = {}, this.enabled = !0, this._time = 0, this._lastTime = 0, this._reseted = !0, this.transforms = new P(), this._isAbsoluteTransform = !1, this._hasTransform = !1, this._transformInitialised = !1, this._transformActive = !1, this._retired = !1, this._reverse = !1, this._swing = !1, this._wait = 0, this._times = 1, this._persist = this._isDeclarative ? !0 : null;
  }
  static sanitise(t, e, i) {
    let s = 1, o = !1, r = 0;
    return t = t ?? be.duration, e = e ?? be.delay, i = i || "last", typeof t == "object" && !(t instanceof Si) && (e = t.delay ?? e, i = t.when ?? i, o = t.swing || o, s = t.times ?? s, r = t.wait ?? r, t = t.duration ?? be.duration), {
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
  addTransform(t) {
    return this.transforms.lmultiplyO(t), this._transformInitialised = !0, this._transformActive = !0, this;
  }
  after(t) {
    return this.on("finished", t);
  }
  animate(t, e, i) {
    const s = Ke.sanitise(t, e, i), o = new Ke(s.duration);
    return this._timeline && o.timeline(this._timeline), this._element && o.element(this._element), o.loop(s).schedule(s.delay, s.when);
  }
  clearTransform() {
    return this.transforms = new P(), this;
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
    return this._stepper = new qn(t), this;
  }
  element(t) {
    return t == null ? this._element : (this._element = t, t._prepareRunner(), this);
  }
  finish() {
    if (!this._isDeclarative) return this.time(this.duration());
    const t = this._time;
    return this.step(1 / 0), this._time = t, this;
  }
  loop(t, e, i) {
    return typeof t == "object" && (e = t.swing, i = t.wait, t = t.times), this._times = t || 1 / 0, this._swing = e || !1, this._wait = i || 0, this._times === !0 && (this._times = 1 / 0), this;
  }
  loops(t) {
    const e = this._duration + this._wait;
    if (t == null) {
      const r = Math.floor(this._time / e), a = (this._time - r * e) / this._duration;
      return Math.min(r + a, this._times);
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
      const d = function(u) {
        const p = r * Math.floor(u % (2 * (s + i)) / (s + i)), m = p && !a || !p && a, g = Math.pow(-1, m) * (u % (s + i)) / i + m;
        return Math.max(Math.min(g, 1), 0);
      }, f = o * (s + i) - s;
      return l = e <= 0 ? Math.round(d(1e-5)) : e < f ? d(e) : Math.round(d(f - 1e-5)), l;
    }
    const c = Math.floor(this.loops()), h = r && c % 2 === 0;
    return l = c + (h && !a || a && h ? t : 1 - t), this.loops(l);
  }
  progress(t) {
    return t == null ? Math.min(1, this._time / this.duration()) : this.time(t * this.duration());
  }
  queue(t, e, i, s) {
    return this._isDeclarative && (this.done = !1), this._queue.push({
      initialiser: t || Wi,
      runner: e || Wi,
      retarget: i,
      isTransform: s,
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
  schedule(t, e, i) {
    if (t instanceof yo || (i = e, e = t, t = this.timeline()), !t) throw Error("Runner cannot be scheduled without timeline");
    return t.schedule(this, e, i), this;
  }
  step(t) {
    if (!this.enabled) return this;
    const e = this.done;
    t = t ?? 16, this._time += t;
    const i = this.position(), s = this._lastPosition !== i && this._time >= 0;
    this._lastPosition = i;
    const o = this.duration(), r = this._lastTime <= 0 && this._time > 0;
    this._lastTime = this._time, r && this.fire("start", this);
    const a = this._isDeclarative;
    this.done = !a && this._time >= o, this._reseted = !1;
    const l = this._hasTransform && (this._time > 0 || i !== 0);
    this._transformActive = l;
    let c = !1;
    return (s || a) && (this._initialise(s), this.transforms = new P(), c = this._run(a ? t : i), this._transformActive = l, this.fire("step", this)), this.done = this.done || c && a, this.done && !e && this.fire("finished", this), this;
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
      for (let e = 0, i = this._queue.length; e < i; ++e) {
        const s = this._queue[e], o = this._isDeclarative || !s.initialised && t;
        t = !s.finished, o && t && (s.initialiser.call(this), s.initialised = !0);
      }
  }
  _rememberMorpher(t, e) {
    if (this._history[t] = {
      morpher: e,
      caller: this._queue[this._queue.length - 1]
    }, this._isDeclarative) {
      const i = this.timeline();
      i && i.play();
    }
  }
  _run(t) {
    let e = !0;
    for (let i = 0, s = this._queue.length; i < s; ++i) {
      const o = this._queue[i];
      if (this._isDeclarative && o.finished && !o.isTransform) continue;
      const r = o.runner.call(this, t);
      o.finished = o.finished || r === !0, e = e && o.finished;
    }
    return e;
  }
  _tryRetarget(t, e, i) {
    if (this._history[t]) {
      if (!this._history[t].caller.initialised) {
        const o = this._queue.indexOf(this._history[t].caller);
        return this._queue.splice(o, 1), !1;
      }
      this._history[t].caller.retarget ? this._history[t].caller.retarget.call(this, e, i) : this._history[t].morpher.to(e), this._history[t].caller.finished = !1, this._isDeclarative && (this.done = !1);
      const s = this.timeline();
      return s && s.play(), !0;
    }
    return !1;
  }
};
Rt.id = 0;
var Qn = class {
  constructor(n = new P(), t = -1, e = !0, i = !1) {
    this.transforms = n, this.id = t, this.done = e, this._isAbsoluteTransform = i, this._transformActive = !0, this._retired = !0;
  }
};
D([Rt, Qn], { mergeWith(n) {
  return new Qn(this._isAbsoluteTransform ? this.transforms : n.transforms.lmultiply(this.transforms), n.id, !0, n._isAbsoluteTransform || this._isAbsoluteTransform);
} });
const bo = (n, t) => n.lmultiplyO(t), vo = (n) => n.transforms, Fl = (n) => n._transformActive;
function wo(n) {
  const t = n.filter(Fl);
  let e = 0;
  for (let i = 0; i < t.length; ++i) t[i]._isAbsoluteTransform && (e = i);
  return t.slice(e);
}
function Ul() {
  const n = wo(this._transformationRunners.runners).map(vo).reduce(bo, new P());
  this.transform(n), this._transformationRunners.merge(), this._transformationRunners.length() === 1 && (this._frameId = null);
}
var Yl = class {
  constructor() {
    this.runners = [];
  }
  add(n) {
    var t;
    if (!(0, Xt.default)(t = this.runners).call(t, n))
      return this.runners.push(n), this;
  }
  edit(n, t) {
    const e = this.runners.findIndex((i) => i.id === n);
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
        const i = e.mergeWith(n);
        this.edit(n.id, i), n = i, --t;
      } else n = e;
    }
    return this;
  }
  remove(n) {
    const t = this.runners.findIndex((e) => e.id === n);
    return t >= 0 && this.runners.splice(t, 1), this;
  }
};
I({ Element: {
  animate(n, t, e) {
    const i = Rt.sanitise(n, t, e), s = this.timeline();
    return new Rt(i.duration).loop(i).element(this).timeline(s.play()).schedule(i.delay, i.when);
  },
  delay(n, t) {
    return this.animate(0, n, t);
  },
  _currentTransform(n) {
    const t = this._transformationRunners.runners, e = t.indexOf(n);
    return wo(t.slice(0, e + 1)).map(vo).reduce(bo, new P());
  },
  _addRunner(n) {
    this._transformationRunners.length() === 1 && this._transformationRunners.runners[0].id === -1 && (this._transformationRunners.runners[0].transforms = new P(this)), this._transformationRunners.add(n), B.cancelImmediate(this._frameId), this._frameId = B.immediate(Ul.bind(this));
  },
  _prepareRunner() {
    this._frameId == null && (this._transformationRunners = new Yl().add(new Qn(new P(this))));
  }
} });
const $l = (n, t) => n.filter((e) => !(0, Xt.default)(t).call(t, e));
D(Rt, {
  attr(n, t) {
    return this.styleAttr("attr", n, t);
  },
  css(n, t) {
    return this.styleAttr("css", n, t);
  },
  styleAttr(n, t, e) {
    if (typeof t == "string") return this.styleAttr(n, { [t]: e });
    const i = t, s = this._history[n];
    if (s && !s.caller.initialised && s.caller.retarget)
      return s.caller.retarget.call(this, i), this;
    if (this._tryRetarget(n, i)) return this;
    let o = new Pt(this._stepper).to(i), r = Object.keys(i);
    return this.queue(function() {
      o = o.from(this.element()[n](r));
    }, function(a) {
      return this.element()[n](o.at(a).valueOf()), o.done();
    }, function(a) {
      const l = $l(Object.keys(a), r);
      if (l.length && o.from() != null) {
        const h = this.element()[n](l), d = new Me(o.from()).valueOf();
        Object.assign(d, h), o.from(d);
      }
      const c = new Me(o.to()).valueOf();
      Object.assign(c, a), o.to(c), r = Object.keys(c);
    }), this._rememberMorpher(n, o), this;
  },
  zoom(n, t) {
    if (this._tryRetarget("zoom", n, t)) return this;
    let e = new Pt(this._stepper).to(new G(n));
    return this.queue(function() {
      e = e.from(this.element().zoom());
    }, function(i) {
      return this.element().zoom(e.at(i), t), e.done();
    }, function(i, s) {
      t = s, e.to(i);
    }), this._rememberMorpher("zoom", e), this;
  },
  /**
  ** absolute transformations
  **/
  transform(n, t, e) {
    if (t = n.relative || t, this._hasTransform = !0, this._isAbsoluteTransform = this._isAbsoluteTransform || !t, this._isDeclarative && !t && this._tryRetarget("transform", n)) return this;
    const i = P.isMatrixLike(n);
    e = n.affine != null ? n.affine : e ?? !i;
    const s = new Pt(this._stepper).type(e ? we : P), o = e ? new Pt(this._stepper).type(P) : s;
    let r, a, l, c, h;
    function d() {
      a = a || this.element(), r = r || Fn(n, a), h = new P(t ? void 0 : a), a._addRunner(this);
    }
    function f(p) {
      t || this.clearTransform();
      const { x: m, y: g } = new W(r).transform(a._currentTransform(this)), y = {
        ...n,
        origin: [m, g]
      };
      y.relative === !0 && delete y.relative;
      let b = new P(y), v = this._isDeclarative && l ? l : h, w = s;
      if (e) {
        const x = b.decompose(m, g), S = v.decompose(m, g);
        if (!new we(x).toArray().concat(new we(S).toArray()).every(Number.isFinite)) w = o;
        else {
          b = x, v = S;
          const C = b.rotate, A = v.rotate, E = [
            C - 360,
            C,
            C + 360
          ], M = E.map((O) => Math.abs(O - A)), k = Math.min(...M), N = M.indexOf(k);
          b.rotate = E[N];
        }
      }
      t && w === s && (i || (b.rotate = n.rotate || 0), this._isDeclarative && c && (v.rotate = c)), w.from(v), w.to(b);
      const _ = w.at(p);
      return c = _.rotate, l = new P(_), this.addTransform(l), a._addRunner(this), w.done();
    }
    function u(p) {
      r = Fn(p, a), n = { ...p };
    }
    return this.queue(d, f, u, !0), this._isDeclarative && this._rememberMorpher("transform", s), this;
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
    if (t = new G(t), this._tryRetarget(n, t)) return this;
    const e = new Pt(this._stepper).to(t);
    let i = null;
    return this.queue(function() {
      i = this.element()[n](), e.from(i), e.to(i + t);
    }, function(s) {
      return this.element()[n](e.at(s)), e.done();
    }, function(s) {
      e.to(i + new G(s));
    }), this._rememberMorpher(n, e), this;
  },
  _queueObject(n, t) {
    if (this._tryRetarget(n, t)) return this;
    const e = new Pt(this._stepper).to(t);
    return this.queue(function() {
      e.from(this.element()[n]());
    }, function(i) {
      return this.element()[n](e.at(i)), e.done();
    }), this._rememberMorpher(n, e), this;
  },
  _queueNumber(n, t) {
    return this._queueObject(n, new G(t));
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
    const e = Zt(this._element, n, t);
    return this.width(e.width).height(e.height);
  },
  width(n) {
    return this._queueNumber("width", n);
  },
  height(n) {
    return this._queueNumber("height", n);
  },
  plot(n, t, e, i) {
    if (arguments.length === 4) return this.plot([
      n,
      t,
      e,
      i
    ]);
    if (this._tryRetarget("plot", n)) return this;
    const s = new Pt(this._stepper).type(this._element.MorphArray).to(n);
    return this.queue(function() {
      s.from(this._element.array());
    }, function(o) {
      return this._element.plot(s.at(o)), s.done();
    }), this._rememberMorpher("plot", s), this;
  },
  leading(n) {
    return this._queueNumber("leading", n);
  },
  viewbox(n, t, e, i) {
    return this._queueObject("viewbox", new Q(n, t, e, i));
  },
  update(n) {
    return typeof n != "object" ? this.update({
      offset: arguments[0],
      color: arguments[1],
      opacity: arguments[2]
    }) : (n.opacity != null && this.attr("stop-opacity", n.opacity), n.color != null && this.attr("stop-color", n.color), n.offset != null && this.attr("offset", n.offset), this);
  }
});
D(Rt, {
  rx: _i,
  ry: Ci,
  from: uo,
  to: fo
});
z(Rt, "Runner");
var yn = class extends mt {
  constructor(n, t = n) {
    super(U("svg", n), t), this.namespace();
  }
  defs() {
    return this.isRoot() ? st(this.node.querySelector("defs")) || this.put(new xi()) : this.root().defs();
  }
  isRoot() {
    return !this.node.parentNode || !(this.node.parentNode instanceof L.window.SVGElement) && this.node.parentNode.nodeName !== "#document-fragment";
  }
  namespace() {
    return this.isRoot() ? this.attr({
      xmlns: pi,
      version: "1.1"
    }).attr("xmlns:xlink", Ie, Sn) : this.root().namespace();
  }
  removeNamespace() {
    return this.attr({
      xmlns: null,
      version: null
    }).attr("xmlns:xlink", null, Sn).attr("xmlns:svgjs", null, Sn);
  }
  root() {
    return this.isRoot() ? this : super.root();
  }
};
I({ Container: { nested: F(function() {
  return this.put(new yn());
}) } });
z(yn, "Svg", !0);
var Mi = class extends mt {
  constructor(n, t = n) {
    super(U("symbol", n), t);
  }
};
I({ Container: { symbol: F(function() {
  return this.put(new Mi());
}) } });
z(Mi, "Symbol");
var xo = /* @__PURE__ */ le({
  amove: () => ec,
  ax: () => Jl,
  ay: () => tc,
  build: () => nc,
  center: () => Ql,
  cx: () => jl,
  cy: () => Kl,
  length: () => Wl,
  move: () => Vl,
  plain: () => Xl,
  x: () => ql,
  y: () => Zl
});
function Xl(n) {
  return this._build === !1 && this.clear(), this.node.appendChild(L.document.createTextNode(n)), this;
}
function Wl() {
  return this.node.getComputedTextLength();
}
function ql(n, t = this.bbox()) {
  return n == null ? t.x : this.attr("x", this.attr("x") + n - t.x);
}
function Zl(n, t = this.bbox()) {
  return n == null ? t.y : this.attr("y", this.attr("y") + n - t.y);
}
function Vl(n, t, e = this.bbox()) {
  return this.x(n, e).y(t, e);
}
function jl(n, t = this.bbox()) {
  return n == null ? t.cx : this.attr("x", this.attr("x") + n - t.cx);
}
function Kl(n, t = this.bbox()) {
  return n == null ? t.cy : this.attr("y", this.attr("y") + n - t.cy);
}
function Ql(n, t, e = this.bbox()) {
  return this.cx(n, e).cy(t, e);
}
function Jl(n) {
  return this.attr("x", n);
}
function tc(n) {
  return this.attr("y", n);
}
function ec(n, t) {
  return this.ax(n).ay(t);
}
function nc(n) {
  return this._build = !!n, this;
}
var bt = class extends ht {
  constructor(n, t = n) {
    super(U("text", n), t), this.dom.leading = this.dom.leading ?? new G(1.3), this._rebuild = !0, this._build = !1;
  }
  leading(n) {
    return n == null ? this.dom.leading : (this.dom.leading = new G(n), this.rebuild());
  }
  rebuild(n) {
    if (typeof n == "boolean" && (this._rebuild = n), this._rebuild) {
      const t = this;
      let e = 0;
      const i = this.dom.leading;
      this.each(function(s) {
        if (Un(this.node)) return;
        const o = L.window.getComputedStyle(this.node).getPropertyValue("font-size"), r = i * new G(o);
        this.dom.newLined && (this.attr("x", t.attr("x")), this.text() === `
` ? e += r : (this.attr("dy", s ? r + e : 0), e = 0));
      }), this.fire("rebuild");
    }
    return this;
  }
  setData(n) {
    return this.dom = n, this.dom.leading = new G(n.leading || 1.3), this;
  }
  writeDataToDom() {
    return super.writeDataToDom({ leading: 1.3 });
  }
  text(n) {
    if (n === void 0) {
      const t = this.node.childNodes;
      let e = 0;
      n = "";
      for (let i = 0, s = t.length; i < s; ++i) {
        if (t[i].nodeName === "textPath" || Un(t[i])) {
          i === 0 && (e = i + 1);
          continue;
        }
        i !== e && t[i].nodeType !== 3 && st(t[i]).dom.newLined === !0 && (n += `
`), n += t[i].textContent;
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
D(bt, xo);
I({ Container: {
  text: F(function(n = "") {
    return this.put(new bt()).text(n);
  }),
  plain: F(function(n = "") {
    return this.put(new bt()).plain(n);
  })
} });
z(bt, "Text");
var bn = class extends ht {
  constructor(n, t = n) {
    super(U("tspan", n), t), this._build = !1;
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
    if (!(n instanceof bt)) return this;
    const t = n.index(this), e = L.window.getComputedStyle(this.node).getPropertyValue("font-size"), i = n.dom.leading * new G(e);
    return this.dy(t ? i : 0).attr("x", n.x());
  }
  text(n) {
    return n == null ? this.node.textContent + (this.dom.newLined ? `
` : "") : (typeof n == "function" ? (this.clear().build(!0), n.call(this, this), this.build(!1)) : this.plain(n), this);
  }
};
D(bn, xo);
I({
  Tspan: { tspan: F(function(n = "") {
    const t = new bn();
    return this._build || this.clear(), this.put(t).text(n);
  }) },
  Text: { newLine: function(n = "") {
    return this.tspan(n).newLine();
  } }
});
z(bn, "Tspan");
var vn = class extends ht {
  constructor(n, t = n) {
    super(U("circle", n), t);
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
    return this.radius(new G(n).divide(2));
  }
};
D(vn, {
  x: so,
  y: oo,
  cx: ro,
  cy: ao,
  width: lo,
  height: co
});
I({ Container: { circle: F(function(n = 0) {
  return this.put(new vn()).size(n).move(0, 0);
}) } });
z(vn, "Circle");
var Jn = class extends mt {
  constructor(n, t = n) {
    super(U("clipPath", n), t);
  }
  remove() {
    return this.targets().forEach(function(n) {
      n.unclip();
    }), super.remove();
  }
  targets() {
    return Le(this.node, "clip-path");
  }
};
I({
  Container: { clip: F(function() {
    return this.defs().put(new Jn());
  }) },
  Element: {
    clipper() {
      return this.reference("clip-path");
    },
    clipWith(n) {
      const t = n instanceof Jn ? n : this.parent().clip().add(n);
      return this.attr("clip-path", "url(#" + t.id() + ")");
    },
    unclip() {
      return this.attr("clip-path", null);
    }
  }
});
z(Jn, "ClipPath");
var _o = class extends at {
  constructor(n, t = n) {
    super(U("foreignObject", n), t);
  }
};
I({ Container: { foreignObject: F(function(n, t) {
  return this.put(new _o()).size(n, t);
}) } });
z(_o, "ForeignObject");
var Co = /* @__PURE__ */ le({
  dmove: () => ic,
  dx: () => sc,
  dy: () => oc,
  height: () => rc,
  move: () => ac,
  size: () => lc,
  width: () => cc,
  x: () => hc,
  y: () => dc
});
function ic(n, t) {
  return this.children().forEach((e) => {
    let i;
    try {
      i = e.node instanceof mi().SVGSVGElement ? new Q(e.attr([
        "x",
        "y",
        "width",
        "height"
      ])) : e.bbox();
    } catch {
      return;
    }
    const s = new P(e), o = s.translate(n, t).transform(s.inverse()), r = new W(i.x, i.y).transform(o);
    e.dmove(r.x - i.x, r.y - i.y);
  }), this;
}
function sc(n) {
  return this.dmove(n, 0);
}
function oc(n) {
  return this.dmove(0, n);
}
function rc(n, t = this.bbox()) {
  return n == null ? t.height : this.size(t.width, n, t);
}
function ac(n = 0, t = 0, e = this.bbox()) {
  const i = n - e.x, s = t - e.y;
  return this.dmove(i, s);
}
function lc(n, t, e = this.bbox()) {
  const i = Zt(this, n, t, e), s = i.width / e.width, o = i.height / e.height;
  return this.children().forEach((r) => {
    const a = new W(e).transform(new P(r).inverse());
    r.scale(s, o, a.x, a.y);
  }), this;
}
function cc(n, t = this.bbox()) {
  return n == null ? t.width : this.size(n, t.height, t);
}
function hc(n, t = this.bbox()) {
  return n == null ? t.x : this.move(n, t.y, t);
}
function dc(n, t = this.bbox()) {
  return n == null ? t.y : this.move(t.x, n, t);
}
var ue = class extends mt {
  constructor(n, t = n) {
    super(U("g", n), t);
  }
};
D(ue, Co);
I({ Container: { group: F(function() {
  return this.put(new ue());
}) } });
z(ue, "G");
var nn = class extends mt {
  constructor(n, t = n) {
    super(U("a", n), t);
  }
  target(n) {
    return this.attr("target", n);
  }
  to(n) {
    return this.attr("href", n, Ie);
  }
};
D(nn, Co);
I({
  Container: { link: F(function(n) {
    return this.put(new nn()).to(n);
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
      return t || (t = new nn(), this.wrap(t)), typeof n == "function" ? n.call(t, t) : t.to(n), this;
    },
    linker() {
      const n = this.parent();
      return n && n.node.nodeName.toLowerCase() === "a" ? n : null;
    }
  }
});
z(nn, "A");
var ti = class extends mt {
  constructor(n, t = n) {
    super(U("mask", n), t);
  }
  remove() {
    return this.targets().forEach(function(n) {
      n.unmask();
    }), super.remove();
  }
  targets() {
    return Le(this.node, "mask");
  }
};
I({
  Container: { mask: F(function() {
    return this.defs().put(new ti());
  }) },
  Element: {
    masker() {
      return this.reference("mask");
    },
    maskWith(n) {
      const t = n instanceof ti ? n : this.parent().mask().add(n);
      return this.attr("mask", "url(#" + t.id() + ")");
    },
    unmask() {
      return this.attr("mask", null);
    }
  }
});
z(ti, "Mask");
var Eo = class extends at {
  constructor(n, t = n) {
    super(U("stop", n), t);
  }
  update(n) {
    return (typeof n == "number" || n instanceof G) && (n = {
      offset: arguments[0],
      color: arguments[1],
      opacity: arguments[2]
    }), n.opacity != null && this.attr("stop-opacity", n.opacity), n.color != null && this.attr("stop-color", n.color), n.offset != null && this.attr("offset", new G(n.offset)), this;
  }
};
I({ Gradient: { stop: function(n, t, e) {
  return this.put(new Eo()).update(n, t, e);
} } });
z(Eo, "Stop");
function uc(n, t) {
  if (!n) return "";
  if (!t) return n;
  let e = n + "{";
  for (const i in t) e += Ws(i) + ":" + t[i] + ";";
  return e += "}", e;
}
var ei = class extends at {
  constructor(n, t = n) {
    super(U("style", n), t);
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
    return this.addText(uc(n, t));
  }
};
I("Dom", {
  style(n, t) {
    return this.put(new ei()).rule(n, t);
  },
  fontface(n, t, e) {
    return this.put(new ei()).font(n, t, e);
  }
});
z(ei, "Style");
var Ti = class extends bt {
  constructor(n, t = n) {
    super(U("textPath", n), t);
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
I({
  Container: { textPath: F(function(n, t) {
    return n instanceof bt || (n = this.text(n)), n.path(t);
  }) },
  Text: {
    path: F(function(n, t = !0) {
      const e = new Ti();
      n instanceof ce || (n = this.defs().path(n)), e.attr("href", "#" + n, Ie);
      let i;
      if (t) for (; i = this.node.firstChild; ) e.node.appendChild(i);
      return this.put(e);
    }),
    textPath() {
      return this.findOne("textPath");
    }
  },
  Path: {
    text: F(function(n) {
      return n instanceof bt || (n = new bt().addTo(this.parent()).text(n)), n.path(this);
    }),
    targets() {
      return Le(this.node, "href", "textPath");
    }
  }
});
Ti.prototype.MorphArray = Gt;
z(Ti, "TextPath");
var So = class extends ht {
  constructor(n, t = n) {
    super(U("use", n), t);
  }
  use(n, t) {
    return this.attr("href", (t || "") + "#" + n, Ie);
  }
};
I({ Container: { use: F(function(n, t) {
  return this.put(new So()).use(n, t);
}) } });
z(So, "Use");
const Ri = nt;
D([
  yn,
  Mi,
  gn,
  Ae,
  tn
], rt("viewbox"));
D([
  re,
  de,
  he,
  ce
], rt("marker"));
D(bt, rt("Text"));
D(ce, rt("Path"));
D(xi, rt("Defs"));
D([bt, bn], rt("Tspan"));
D([
  He,
  Ge,
  Be,
  Rt
], rt("radius"));
D(ze, rt("EventTarget"));
D(oe, rt("Dom"));
D(at, rt("Element"));
D(ht, rt("Shape"));
D([mt, ho], rt("Container"));
D(Be, rt("Gradient"));
D(Rt, rt("Runner"));
Tt.extend(mr());
Pl([
  G,
  _t,
  Q,
  P,
  se,
  zt,
  Gt,
  W
]);
Dl();
var Zi = (n) => (n.changedTouches && (n = n.changedTouches[0]), {
  x: n.clientX,
  y: n.clientY
}), fc = class {
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
    n.preventDefault(), n.stopPropagation(), this.init(!1), this.box = this.el.bbox(), this.lastClick = this.el.point(Zi(n));
    const e = (t ? "mousemove" : "touchmove") + ".drag", i = (t ? "mouseup" : "touchend") + ".drag";
    ct(window, e, this.drag, this, { passive: !1 }), ct(window, i, this.endDrag, this, { passive: !1 }), this.el.fire("dragstart", {
      event: n,
      handler: this,
      box: this.box
    });
  }
  drag(n) {
    const { box: t, lastClick: e } = this, i = this.el.point(Zi(n)), s = i.x - e.x, o = i.y - e.y;
    if (!s && !o) return t;
    const r = t.x + s, a = t.y + o;
    this.box = new Q(r, a, t.w, t.h), this.lastClick = i, !this.el.dispatch("dragmove", {
      event: n,
      handler: this,
      box: this.box,
      dx: s,
      dy: o
    }).defaultPrevented && this.move(r, a);
  }
  move(n, t) {
    this.el.type === "svg" ? ue.prototype.move.call(this.el, n, t) : this.el.move(n, t);
  }
  endDrag(n) {
    this.drag(n), this.el.fire("dragend", {
      event: n,
      handler: this,
      box: this.box
    }), V(window, "mousemove.drag"), V(window, "touchmove.drag"), V(window, "mouseup.drag"), V(window, "touchend.drag"), this.init(!0);
  }
};
D(at, { draggable(n = !0) {
  return (this.remember("_draggable") || new fc(this)).init(n), this;
} });
var pe = (n) => n.touches || [{
  clientX: n.clientX,
  clientY: n.clientY
}];
D(yn, { panZoom(n) {
  if (this.off(".panZoom"), n === !1) return this;
  n = n ?? {};
  const t = n.zoomFactor ?? 2, e = n.zoomMin ?? Number.MIN_VALUE, i = n.zoomMax ?? Number.MAX_VALUE, s = n.wheelZoom ?? !0, o = n.pinchZoom ?? !0, r = n.panning ?? !0, a = n.panButton ?? 0, l = n.oneFingerPan ?? !1, c = n.margins ?? !1, h = n.wheelZoomDeltaModeLinePixels ?? 17, d = n.wheelZoomDeltaModeScreenPixels ?? 53;
  let f, u, p = !1;
  const m = this.viewbox(), g = (C) => {
    if (!c) return C;
    const { top: A, left: E, bottom: M, right: k } = c, { width: N, height: O } = this.attr(["width", "height"]), R = this.node.preserveAspectRatio.baseVal;
    let H = 0, q = 0, J = 0, it = 0;
    if (R.align !== R.SVG_PRESERVEASPECTRATIO_NONE) {
      const dt = N / O, gt = m.width / m.height;
      if (gt !== dt) {
        const At = R.meetOrSlice !== R.SVG_MEETORSLICE_SLICE, ut = dt > gt ? "width" : "height", Fe = ut === "width", Ue = At && Fe || !At && !Fe, Cn = Ue ? dt / gt : gt / dt, vt = C[ut] - C[ut] * Cn;
        Ue ? R.align === R.SVG_PRESERVEASPECTRATIO_XMIDYMIN || R.align === R.SVG_PRESERVEASPECTRATIO_XMIDYMID || R.align === R.SVG_PRESERVEASPECTRATIO_XMIDYMAX ? (H = vt / 2, q = -vt / 2) : R.align === R.SVG_PRESERVEASPECTRATIO_XMINYMIN || R.align === R.SVG_PRESERVEASPECTRATIO_XMINYMID || R.align === R.SVG_PRESERVEASPECTRATIO_XMINYMAX ? q = -vt : (R.align === R.SVG_PRESERVEASPECTRATIO_XMAXYMIN || R.align === R.SVG_PRESERVEASPECTRATIO_XMAXYMID || R.align === R.SVG_PRESERVEASPECTRATIO_XMAXYMAX) && (H = vt) : R.align === R.SVG_PRESERVEASPECTRATIO_XMINYMID || R.align === R.SVG_PRESERVEASPECTRATIO_XMIDYMID || R.align === R.SVG_PRESERVEASPECTRATIO_XMAXYMID ? (J = vt / 2, it = -vt / 2) : R.align === R.SVG_PRESERVEASPECTRATIO_XMINYMIN || R.align === R.SVG_PRESERVEASPECTRATIO_XMIDYMIN || R.align === R.SVG_PRESERVEASPECTRATIO_XMAXYMIN ? it = -vt : (R.align === R.SVG_PRESERVEASPECTRATIO_XMINYMAX || R.align === R.SVG_PRESERVEASPECTRATIO_XMIDYMAX || R.align === R.SVG_PRESERVEASPECTRATIO_XMAXYMAX) && (J = vt);
      }
    }
    const Et = m.width + m.x - E - H, St = m.x + k - C.width - q, Nt = m.height + m.y - A - J, Vt = m.y + M - C.height - it;
    return C.x = Math.min(Et, Math.max(St, C.x)), C.y = Math.min(Nt, Math.max(Vt, C.y)), C;
  }, y = function(C) {
    C.preventDefault();
    let A;
    switch (C.deltaMode) {
      case 1:
        A = C.deltaY * h;
        break;
      case 2:
        A = C.deltaY * d;
        break;
      default:
        A = C.deltaY;
    }
    let E = Math.pow(1 + t, -1 * A / 100) * this.zoom();
    const M = this.point(C.clientX, C.clientY);
    if (E > i && (E = i), E < e && (E = e), this.dispatch("zoom", {
      level: E,
      focus: M
    }).defaultPrevented) return this;
    if (this.zoom(E, M), c) {
      const k = g(this.viewbox());
      this.viewbox(k);
    }
    this.dispatch("afterZoom", {
      box: this.viewbox(),
      focus: M
    });
  }, b = function(C) {
    if (u = pe(C), u.length < 2) {
      r && l && _.call(this, C);
      return;
    }
    r && l && x.call(this, C), C.preventDefault(), !this.dispatch("pinchZoomStart", { event: C }).defaultPrevented && (this.off("touchstart.panZoom", b), p = !0, ct(document, "touchmove.panZoom", w, this, { passive: !1 }), ct(document, "touchend.panZoom", v, this, { passive: !1 }));
  }, v = function(C) {
    C.preventDefault();
    const A = pe(C);
    A.length > 1 || (p = !1, this.dispatch("pinchZoomEnd", { event: C }), V(document, "touchmove.panZoom", w), V(document, "touchend.panZoom", v), this.on("touchstart.panZoom", b), A.length && r && l && _.call(this, C));
  }, w = function(C) {
    C.preventDefault();
    const A = pe(C), E = this.zoom();
    let M = Math.sqrt(Math.pow(u[0].clientX - u[1].clientX, 2) + Math.pow(u[0].clientY - u[1].clientY, 2)) / Math.sqrt(Math.pow(A[0].clientX - A[1].clientX, 2) + Math.pow(A[0].clientY - A[1].clientY, 2));
    (E < e && M > 1 || E > i && M < 1) && (M = 1);
    const k = {
      x: A[0].clientX + 0.5 * (A[1].clientX - A[0].clientX),
      y: A[0].clientY + 0.5 * (A[1].clientY - A[0].clientY)
    }, N = {
      x: u[0].clientX + 0.5 * (u[1].clientX - u[0].clientX),
      y: u[0].clientY + 0.5 * (u[1].clientY - u[0].clientY)
    }, O = this.point(k.x, k.y), R = this.point(2 * k.x - N.x, 2 * k.y - N.y), H = new Q(this.viewbox()).transform(new P().translate(-R.x, -R.y).scale(M, 0, 0).translate(O.x, O.y));
    g(H), this.viewbox(H), u = A, this.dispatch("zoom", {
      box: H,
      focus: R
    }), this.dispatch("afterZoom", {
      box: this.viewbox(),
      focus: R
    });
  }, _ = function(C) {
    C.type.indexOf("mouse") > -1 && C.button !== a && C.which !== a + 1 || (u = pe(C), !p && (this.dispatch("panStart", { event: C }).defaultPrevented || (C.preventDefault(), this.off("mousedown.panZoom", _), f = {
      x: u[0].clientX,
      y: u[0].clientY
    }, ct(document, "touchmove.panZoom mousemove.panZoom", S, this, { passive: !1 }), ct(document, "touchend.panZoom mouseup.panZoom", x, this, { passive: !1 }))));
  }, x = function(C) {
    C.preventDefault(), V(document, "touchmove.panZoom mousemove.panZoom", S), V(document, "touchend.panZoom mouseup.panZoom", x), this.on("mousedown.panZoom", _), this.dispatch("panEnd", { event: C });
  }, S = function(C) {
    C.preventDefault();
    const A = pe(C), E = {
      x: A[0].clientX,
      y: A[0].clientY
    }, M = this.point(E.x, E.y), k = this.point(f.x, f.y), N = [k.x - M.x, k.y - M.y];
    if (!N[0] && !N[1]) return;
    const O = new Q(this.viewbox()).transform(new P().translate(N[0], N[1]));
    f = E, g(O), !this.dispatch("panning", {
      box: O,
      event: C
    }).defaultPrevented && this.viewbox(O);
  };
  return s && this.on("wheel.panZoom", y, this, { passive: !1 }), o && this.on("touchstart.panZoom", b, this, { passive: !1 }), r && this.on("mousedown.panZoom", _, this, { passive: !1 }), this;
} });
function ne(n, t, e, i = null) {
  return function(s) {
    s.preventDefault(), s.stopPropagation();
    var o = s.pageX || s.touches[0].pageX, r = s.pageY || s.touches[0].pageY;
    t.fire(n, {
      x: o,
      y: r,
      event: s,
      index: i,
      points: e
    });
  };
}
function ni([n, t], { a: e, b: i, c: s, d: o, e: r, f: a }) {
  return [n * e + t * s + r, n * i + t * o + a];
}
var Ao = class {
  constructor(n) {
    this.el = n, n.remember("_selectHandler", this), this.selection = new ue(), this.order = [
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
    const t = mi();
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
      const i = this.order[t];
      this.handles.includes(i) && (this.createHandle.call(this, this.selection, n, t, e, i), this.selection.last().addClass("svg_select_handle svg_select_handle_" + i).on("mousedown.selection", ne(i, this.el, this.handlePoints, t)).on("touchstart.selection", ne(i, this.el, this.handlePoints, t), void 0, { passive: !1 }));
    });
  }
  createHandleFn(n) {
    n.polyline();
  }
  updateHandleFn(n, t, e, i) {
    const s = i.at(e - 1), o = i[(e + 1) % i.length], r = t, a = [r[0] - s[0], r[1] - s[1]], l = [r[0] - o[0], r[1] - o[1]], c = Math.sqrt(a[0] * a[0] + a[1] * a[1]), h = Math.sqrt(l[0] * l[0] + l[1] * l[1]), d = [a[0] / c, a[1] / c], f = [l[0] / h, l[1] / h], u = [r[0] - d[0] * 10, r[1] - d[1] * 10], p = [r[0] - f[0] * 10, r[1] - f[1] * 10];
    n.plot([
      u,
      r,
      p
    ]);
  }
  updateResizeHandles() {
    this.handlePoints.forEach((n, t, e) => {
      const i = this.order[t];
      if (!this.handles.includes(i)) return;
      const s = this.selection.findOne(".svg_select_handle_" + i);
      s && this.updateHandle.call(this, s, n, t, e, i);
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
    const n = this.selection.group().addClass("svg_select_handle_rot").on("mousedown.selection", ne("rot", this.el, this.handlePoints)).on("touchstart.selection", ne("rot", this.el, this.handlePoints), void 0, { passive: !1 });
    this.createRot.call(this, n);
  }
  updateRotationHandle() {
    if (!this.handles.includes("rot")) return;
    const n = this.selection.findOne("g.svg_select_handle_rot");
    n && this.updateRot(n, this.rotationPoint, this.handlePoints);
  }
  updatePoints() {
    const n = this.el.bbox(), t = this.el.root().screenCTM().inverseO().multiplyO(this.el.screenCTM());
    this.handlePoints = this.getHandlePoints(n).map((e) => ni(e, t)), this.rotationPoint = ni(this.getRotationPoint(n), t);
  }
  getHandlePoints({ x: n, x2: t, y: e, y2: i, cx: s, cy: o } = this.el.bbox()) {
    return [
      [n, e],
      [s, e],
      [t, e],
      [t, o],
      [t, i],
      [s, i],
      [n, i],
      [n, o]
    ];
  }
  getRotationPoint({ y: n, cx: t } = this.el.bbox()) {
    return [t, n - 20];
  }
  mutationHandler() {
    this.updatePoints(), this.updateSelection(), this.updateResizeHandles(), this.updateRotationHandle();
  }
}, pc = class {
  constructor(n) {
    this.el = n, n.remember("_pointSelectHandler", this), this.selection = new ue(), this.order = [
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
    const t = mi();
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
      this.createHandle.call(this, this.selection, n, t, e), this.selection.get(t + 1).addClass("svg_select_handle_point").on("mousedown.selection", ne("point", this.el, this.points, t)).on("touchstart.selection", ne("point", this.el, this.points, t), void 0, { passive: !1 });
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
    this.points = this.el.array().map((t) => ni(t, n));
  }
  mutationHandler() {
    this.updatePoints(), this.updateSelection(), this.updatePointHandles();
  }
}, Mo = (n) => function(t = !0, e = {}) {
  typeof t == "object" && (e = t, t = !0);
  let i = this.remember("_" + n.name);
  return i || (t.prototype instanceof Ao ? (i = new t(this), t = !0) : i = new n(this), this.remember("_" + n.name, i)), i.active(t, e), this;
};
D(at, { select: Mo(Ao) });
D([
  he,
  de,
  re
], { pointSelect: Mo(pc) });
var $e = (n) => (n.changedTouches && (n = n.changedTouches[0]), {
  x: n.clientX,
  y: n.clientY
}), To = (n) => {
  let t = 1 / 0, e = 1 / 0, i = -1 / 0, s = -1 / 0;
  for (let o = 0; o < n.length; o++) {
    const r = n[o];
    t = Math.min(t, r[0]), e = Math.min(e, r[1]), i = Math.max(i, r[0]), s = Math.max(s, r[1]);
  }
  return new Q(t, e, i - t, s - e);
};
function mc(n, t, e) {
  const i = [
    [n.x, n.y],
    [n.x + n.width, n.y],
    [n.x + n.width, n.y + n.height],
    [n.x, n.y + n.height]
  ].map(([s, o]) => {
    const r = s - t[0], a = o - t[1], l = r * e, c = a * e;
    return [l + t[0], c + t[1]];
  });
  return To(i);
}
var Vi = class {
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
    const { event: t, index: e, points: i } = n.detail, s = !t.type.indexOf("mouse");
    if (s && (t.which || t.buttons) !== 1 || this.el.dispatch("beforeresize", {
      event: n,
      handler: this
    }).defaultPrevented) return;
    this.box = this.el.bbox(), this.startPoint = this.el.point($e(t)), this.index = e, this.points = i.slice();
    const o = (s ? "mousemove" : "touchmove") + ".resize", r = (s ? "mouseup" : "touchcancel.resize touchend") + ".resize";
    n.type === "point" ? ct(window, o, this.movePoint) : n.type === "rot" ? ct(window, o, this.rotate) : ct(window, o, this.resize), ct(window, r, this.endResize);
  }
  resize(n) {
    this.lastEvent = n;
    const t = this.snapToGrid(this.el.point($e(n)));
    let e = t.x - this.startPoint.x, i = t.y - this.startPoint.y;
    this.preserveAspectRatio && this.aroundCenter && (e *= 2, i *= 2);
    const s = this.box.x + e, o = this.box.y + i, r = this.box.x2 + e, a = this.box.y2 + i;
    let l = new Q(this.box);
    if (this.eventType.includes("l") && (l.x = Math.min(s, this.box.x2), l.x2 = Math.max(s, this.box.x2)), this.eventType.includes("r") && (l.x = Math.min(r, this.box.x), l.x2 = Math.max(r, this.box.x)), this.eventType.includes("t") && (l.y = Math.min(o, this.box.y2), l.y2 = Math.max(o, this.box.y2)), this.eventType.includes("b") && (l.y = Math.min(a, this.box.y), l.y2 = Math.max(a, this.box.y)), l.width = l.x2 - l.x, l.height = l.y2 - l.y, this.preserveAspectRatio) {
      const c = this.box.width ? l.width / this.box.width : 1, h = this.box.height ? l.height / this.box.height : 1, d = [
        "lt",
        "t",
        "rt",
        "r",
        "rb",
        "b",
        "lb",
        "l"
      ], f = (d.indexOf(this.eventType) + 4) % d.length, u = this.aroundCenter ? [this.box.cx, this.box.cy] : this.points[f];
      let p = this.eventType.includes("t") || this.eventType.includes("b") ? h : c;
      p = this.eventType.length === 2 ? Math.max(c, h) : p, Number.isFinite(p) || (p = 1), l = mc(this.box, u, p);
    }
    this.el.dispatch("resize", {
      box: new Q(l),
      angle: 0,
      eventType: this.eventType,
      event: n,
      handler: this
    }).defaultPrevented || this.el.size(l.width, l.height).move(l.x, l.y);
  }
  movePoint(n) {
    this.lastEvent = n;
    const { x: t, y: e } = this.snapToGrid(this.el.point($e(n))), i = this.el.array().slice();
    i[this.index] = [t, e], !this.el.dispatch("resize", {
      box: To(i),
      angle: 0,
      eventType: this.eventType,
      event: n,
      handler: this
    }).defaultPrevented && this.el.plot(i);
  }
  rotate(n) {
    this.lastEvent = n;
    const t = this.startPoint, e = this.el.point($e(n)), { cx: i, cy: s } = this.box, o = t.x - i, r = t.y - s, a = e.x - i, l = e.y - s, c = Math.sqrt(o * o + r * r) * Math.sqrt(a * a + l * l);
    if (c === 0) return;
    let h = Math.acos((o * a + r * l) / c) / Math.PI * 180;
    if (!h) return;
    e.x < t.x && (h = -h);
    const d = new P(this.el), { x: f, y: u } = new W(i, s).transformO(d), { rotate: p } = d.decompose(), m = this.snapToAngle(p + h) - p;
    this.el.dispatch("resize", {
      box: this.box,
      angle: m,
      eventType: this.eventType,
      event: n,
      handler: this
    }).defaultPrevented || this.el.transform(d.rotateO(m, f, u));
  }
  endResize(n) {
    this.eventType !== "rot" && this.eventType !== "point" && this.resize(n), this.lastEvent = null, this.eventType = "", V(window, "mousemove.resize touchmove.resize"), V(window, "mouseup.resize touchend.resize");
  }
  snapToGrid(n) {
    return this.grid && (n.x = Math.round(n.x / this.grid) * this.grid, n.y = Math.round(n.y / this.grid) * this.grid), n;
  }
  snapToAngle(n) {
    return this.degree && (n = Math.round(n / this.degree) * this.degree), n;
  }
};
D(at, { resize: function(n = !0, t = {}) {
  typeof n == "object" && (t = n, n = !0);
  let e = this.remember("_ResizeHandler");
  return e || (n.prototype instanceof Vi ? (e = new n(this), n = !0) : e = new Vi(this), this.remember("_resizeHandler", e)), e.active(n, t), this;
} });
function It(n, t, e) {
  try {
    const i = n.node.ownerSVGElement || n.node, s = n.node.getScreenCTM(), o = i.getScreenCTM();
    if (!s || !o)
      return [t, e];
    const r = s.a * t + s.c * e + s.e, a = s.b * t + s.d * e + s.f, l = o.a * o.d - o.b * o.c;
    if (Math.abs(l) < 1e-10)
      return [t, e];
    const c = o.d / l, h = -o.b / l, d = -o.c / l, f = o.a / l, u = (o.c * o.f - o.d * o.e) / l, p = (o.b * o.e - o.a * o.f) / l, m = c * r + d * a + u, g = h * r + f * a + p;
    return [m, g];
  } catch {
    return [t, e];
  }
}
function wn(n, t, e) {
  try {
    const i = n.node.ownerSVGElement || n.node, s = n.node.getScreenCTM(), o = i.getScreenCTM();
    if (!s || !o)
      return [t, e];
    const r = o.a * t + o.c * e + o.e, a = o.b * t + o.d * e + o.f, l = s.a * s.d - s.b * s.c;
    if (Math.abs(l) < 1e-10)
      return [t, e];
    const c = s.d / l, h = -s.b / l, d = -s.c / l, f = s.a / l, u = (s.c * s.f - s.d * s.e) / l, p = (s.b * s.e - s.a * s.f) / l, m = c * r + d * a + u, g = h * r + f * a + p;
    return [m, g];
  } catch {
    return [t, e];
  }
}
function Te(n) {
  const t = n.bbox();
  return It(n, t.cx, t.cy);
}
function gc(n) {
  const t = n.getScreenCTM && n.getScreenCTM();
  if (!t) return t;
  try {
    let e = n.parentNode;
    for (; e && e.nodeType === 1; ) {
      if (e.hasAttribute && e.hasAttribute("data-sb-animation-host")) {
        const i = e.getScreenCTM && e.getScreenCTM(), s = e.parentNode && e.parentNode.getScreenCTM && e.parentNode.getScreenCTM();
        return !i || !s ? t : s.multiply(i.inverse()).multiply(t);
      }
      if (e.tagName && e.tagName.toLowerCase() === "svg" && !e.ownerSVGElement) break;
      e = e.parentNode;
    }
  } catch {
  }
  return t;
}
function yc(n, t) {
  try {
    const e = n && n.node;
    let i = e && e.querySelector && e.querySelector("path[data-shape-path]");
    if (!i && e && e.querySelectorAll) {
      let x = 0;
      e.querySelectorAll("svg path:not([data-node-background-path])").forEach((S) => {
        if (typeof S.getTotalLength == "function")
          try {
            const C = S.getBBox(), A = C.width * C.height;
            A > x && (x = A, i = S);
          } catch {
          }
      });
    }
    if (!i || typeof i.getTotalLength != "function") return null;
    const s = i.getTotalLength();
    if (!s || !isFinite(s)) return null;
    let o = i.ownerSVGElement;
    for (; o && o.ownerSVGElement; ) o = o.ownerSVGElement;
    const r = gc(i), a = o && o.getScreenCTM && o.getScreenCTM();
    if (!o || !r || !a) return null;
    const l = a.inverse(), c = o.createSVGPoint(), h = (x, S) => {
      c.x = x, c.y = S;
      const C = c.matrixTransform(r).matrixTransform(l);
      return [C.x, C.y];
    }, [d, f] = Te(n), u = t[0] - d, p = t[1] - f, m = Math.sqrt(u * u + p * p) || 1, g = u / m, y = p / m;
    let b = null, v = -1 / 0;
    const w = 96;
    let _ = i.__outlineSamples;
    if (!_ || i.__outlineLen !== s) {
      _ = new Array(w);
      for (let x = 0; x < w; x++) {
        const S = i.getPointAtLength(x / w * s);
        _[x] = [S.x, S.y];
      }
      i.__outlineSamples = _, i.__outlineLen = s;
    }
    for (let x = 0; x < _.length; x++) {
      const [S, C] = h(_[x][0], _[x][1]);
      if (!isFinite(S) || !isFinite(C)) continue;
      const A = S - d, E = C - f, M = A * g + E * y, k = Math.abs(A * y - E * g), N = M - k * 1.5;
      N > v && (v = N, b = [S, C]);
    }
    return b;
  } catch {
    return null;
  }
}
function sn(n, t) {
  const e = yc(n, t);
  if (e && isFinite(e[0]) && isFinite(e[1])) {
    const g = n.bbox(), [y, b] = It(n, g.cx, g.cy), v = Math.max(g.width, g.height, 1) * 3;
    if (Math.hypot(e[0] - y, e[1] - b) <= v)
      return e;
  }
  const i = n.bbox(), [s, o] = wn(n, t[0], t[1]), r = i.cx, a = i.cy, l = s - r, c = o - a, h = Math.sqrt(l * l + c * c);
  if (h === 0)
    return It(n, r, a);
  const d = l / h, f = c / h;
  let u;
  if (n.type === "circle") {
    const g = parseFloat(n.attr("r")) || 0;
    u = [r + g * d, a + g * f];
  } else if (n.type === "ellipse") {
    const g = parseFloat(n.attr("rx")) || 0, y = parseFloat(n.attr("ry")) || 0, b = Math.atan2(f, d);
    u = [
      r + g * Math.cos(b),
      a + y * Math.sin(b)
    ];
  } else {
    const g = i.x, y = i.x + i.width, b = i.y, v = i.y + i.height, w = [];
    if (d !== 0) {
      const _ = (g - r) / d, x = a + _ * f;
      x >= b && x <= v && _ > 0 && w.push([g, x, _]);
    }
    if (d !== 0) {
      const _ = (y - r) / d, x = a + _ * f;
      x >= b && x <= v && _ > 0 && w.push([y, x, _]);
    }
    if (f !== 0) {
      const _ = (b - a) / f, x = r + _ * d;
      x >= g && x <= y && _ > 0 && w.push([x, b, _]);
    }
    if (f !== 0) {
      const _ = (v - a) / f, x = r + _ * d;
      x >= g && x <= y && _ > 0 && w.push([x, v, _]);
    }
    w.length > 0 ? (w.sort(function(_, x) {
      return _[2] - x[2];
    }), u = [w[0][0], w[0][1]]) : u = [r, a];
  }
  const [p, m] = It(n, u[0], u[1]);
  return isNaN(p) || isNaN(m) || !isFinite(p) || !isFinite(m) ? It(n, r, a) : [p, m];
}
function ji(n, t) {
  const e = n.bbox(), i = e.x + (t.x != null ? t.x : 0.5) * e.width, s = e.y + (t.y != null ? t.y : 0.5) * e.height, [o, r] = It(n, i, s);
  return isNaN(o) || isNaN(r) || !isFinite(o) || !isFinite(r) ? Te(n) : [o, r];
}
function Ki(n, t) {
  try {
    const e = n.bbox();
    if (!e || !e.width || !e.height) return null;
    const [i, s] = wn(n, t[0], t[1]), o = (i - e.x) / e.width, r = (s - e.y) / e.height, a = o, l = 1 - o, c = r, h = 1 - r, d = Math.min(a, l, c, h);
    let f = 0, u = 0;
    d === a ? f = -1 : d === l ? f = 1 : d === c ? u = -1 : u = 1;
    const p = It(n, e.cx, e.cy), m = It(n, e.cx + f, e.cy + u), g = m[0] - p[0], y = m[1] - p[1], b = Math.hypot(g, y);
    return b > 1e-4 ? [g / b, y / b] : null;
  } catch {
    return null;
  }
}
function ki(n) {
  const t = {};
  if (!n.source || !n.target)
    return [
      ["M", 0, 0],
      ["L", 50, 50]
    ];
  const e = Te(n.source), i = Te(n.target);
  n.sourceAnchor ? t.point1 = ji(n.source, n.sourceAnchor) : n.sourceAttach === "center" ? t.point1 = e : t.point1 = sn(n.source, i), n.targetAnchor ? t.point2 = ji(n.target, n.targetAnchor) : n.targetAttach === "center" ? t.point2 = i : t.point2 = sn(n.target, e);
  const s = t.point1, o = t.point2;
  let r;
  if (n.type === "curved") {
    const c = o[0] - s[0], h = o[1] - s[1], d = Math.sqrt(c * c + h * h);
    if (d < 1)
      return [["M", s[0], s[1]], ["L", o[0], o[1]]];
    const f = (v, w, _, x) => {
      const S = Math.sqrt(v * v + w * w);
      if (S > 1e-4) return [v / S, w / S];
      const C = Math.sqrt(_ * _ + x * x) || 1;
      return [_ / C, x / C];
    }, u = n.sourceAnchor && Ki(n.source, s) || f(s[0] - e[0], s[1] - e[1], c, h), p = n.targetAnchor && Ki(n.target, o) || f(o[0] - i[0], o[1] - i[1], -c, -h), m = typeof n.lineCurviness == "number" ? n.lineCurviness : 0.3, g = Math.max(20, d * (0.12 + m * 0.55)), y = [s[0] + u[0] * g, s[1] + u[1] * g], b = [o[0] + p[0] * g, o[1] + p[1] * g];
    if (n.lineCurveType === "quadratic") {
      const v = [(y[0] + b[0]) / 2, (y[1] + b[1]) / 2];
      r = [
        ["M", s[0], s[1]],
        ["Q", v[0], v[1], o[0], o[1]]
      ];
    } else
      r = [
        ["M", s[0], s[1]],
        ["C", y[0], y[1], b[0], b[1], o[0], o[1]]
      ];
  } else if (n.type === "orthogonal") {
    const c = o[0] - s[0], h = o[1] - s[1], d = s[0] < e[0], f = s[1] < e[1], u = o[0] < i[0], p = o[1] < i[1];
    let m, g;
    const y = 32;
    if (Math.abs(c) <= y && Math.abs(h) > y) {
      const b = (s[0] + o[0]) / 2;
      r = [
        ["M", b, s[1]],
        ["L", b, o[1]]
      ];
    } else if (Math.abs(h) <= y && Math.abs(c) > y) {
      const b = (s[1] + o[1]) / 2;
      r = [
        ["M", s[0], b],
        ["L", o[0], b]
      ];
    } else if (Math.abs(c) > Math.abs(h))
      if (d && u || !d && !u) {
        const b = Math.max(n.curveRadius, Math.abs(h) / 2);
        g = s[1] + (h > 0 ? -b : b), r = [
          ["M", s[0], s[1]],
          ["L", s[0], g],
          ["L", o[0], g],
          ["L", o[0], o[1]]
        ];
      } else
        m = s[0] + c / 2, r = [
          ["M", s[0], s[1]],
          ["L", m, s[1]],
          ["L", m, o[1]],
          ["L", o[0], o[1]]
        ];
    else if (f && p || !f && !p) {
      const b = Math.max(n.curveRadius, Math.abs(c) / 2);
      m = s[0] + (c > 0 ? -b : b), r = [
        ["M", s[0], s[1]],
        ["L", m, s[1]],
        ["L", m, o[1]],
        ["L", o[0], o[1]]
      ];
    } else
      g = s[1] + h / 2, r = [
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
  const a = n.markerSource && n.markerSource.size;
  if (a && r && r.length >= 2 && Math.hypot(o[0] - s[0], o[1] - s[1]) > a * 1.5) {
    const h = r[0], d = r[1], f = h[h.length - 2], u = h[h.length - 1];
    let p = d[1] - f, m = d[2] - u;
    const g = Math.hypot(p, m);
    g > 1e-3 && (p /= g, m /= g, h[h.length - 2] = f + p * a, h[h.length - 1] = u + m * a, (d[0] === "C" || d[0] === "Q") && (d[1] += p * a, d[2] += m * a));
  }
  const l = n.markerTarget && n.markerTarget.size;
  if (l && r && r.length >= 2 && Math.hypot(o[0] - s[0], o[1] - s[1]) > l * 1.5) {
    const h = r[r.length - 1], d = h[h.length - 2], f = h[h.length - 1];
    let u, p;
    if (h[0] === "C")
      u = h[3], p = h[4];
    else {
      const b = r[r.length - 2];
      u = b[b.length - 2], p = b[b.length - 1];
    }
    let m = d - u, g = f - p;
    const y = Math.hypot(m, g);
    y > 1e-3 && (m /= y, g /= y, h[h.length - 2] = d - m * l, h[h.length - 1] = f - g * l, h[0] === "C" && (h[3] -= m * l, h[4] -= g * l));
  }
  return r;
}
function Qi(n, t, e, i, s, o) {
  if (!n || n === "null") return null;
  const a = Math.max(12, i * 3 + 6), l = a, c = a * 0.8, h = (e ? "source-" : "target-") + "triangle-" + Math.random().toString(16).substr(2, 8), d = s.defs().marker(l, c);
  d.attr({
    id: h,
    viewBox: "0 0 " + l + " " + c,
    // Both ends are BASE-anchored. Geometry trims the drawn line by one marker
    // length, leaving the head to fill the gap to the node edge. The thin stroke
    // therefore never runs through the triangle or blunts its point.
    refX: e ? String(l) : "0",
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
  const f = d.path(), u = c / 2;
  return e ? f.attr({
    d: "M 0 " + u + " L " + l + " 0 L " + l + " " + c + " z"
  }) : f.attr({
    d: "M 0 0 L 0 " + c + " L " + l + " " + u + " z"
  }), f.fill(o), {
    element: d,
    id: h,
    size: a
  };
}
function on(n, t, e, i) {
  return i && (n.markers = i), n.markerSourceType = t || "null", n.markerTargetType = e || "null", n.markerSource && (n.markerSource.element.remove(), n.connector.attr("marker-start", null)), n.markerTarget && (n.markerTarget.element.remove(), n.connector.attr("marker-end", null)), t && t !== "null" ? (n.markerSource = Qi(
    t,
    0,
    !0,
    n.strokeWidth,
    n.markers || i,
    n.color
  ), n.connector.attr("marker-start", "url(#" + n.markerSource.id + ")")) : n.markerSource = null, e && e !== "null" ? (n.markerTarget = Qi(
    e,
    0,
    !1,
    n.strokeWidth,
    n.markers || i,
    n.color
  ), n.connector.attr("marker-end", "url(#" + n.markerTarget.id + ")")) : n.markerTarget = null, n;
}
function bc(n, t, e) {
  return n.markerSourceType = t || "null", n.markerTargetType = e || "null", on(n, n.markerSourceType, n.markerTargetType), n;
}
function vc(n, t) {
  return n.strokeWidth = t || 2, n.connector.attr("stroke-width", n.strokeWidth), on(n, n.markerSourceType, n.markerTargetType), n;
}
function Ji(n, t) {
  n.color = t, n.connector.stroke(t).attr("stroke-width", n.strokeWidth), n.markerSource && n.markerSource.element.children().forEach(function(e) {
    e.type === "path" && e.fill(t);
  }), n.markerTarget && n.markerTarget.element.children().forEach(function(e) {
    e.type === "path" && e.fill(t);
  });
}
const wc = 0.25, ii = 0.05, Lt = (n) => Math.round(n * 1e4) / 1e4, ae = (n) => Math.max(0, Math.min(1, n));
function Ni(n, t) {
  if (!Number.isFinite(n) || !Number.isFinite(t)) return null;
  const e = ae(n), i = ae(t);
  return !(n < 0 || n > 1 || t < 0 || t > 1) && Math.min(e, 1 - e, i, 1 - i) >= wc ? null : Re({ x: e, y: i });
}
function Re(n) {
  const t = ae(n.x), e = ae(n.y), i = [t, 1 - t, e, 1 - e], s = Math.min(...i);
  return s === i[0] ? { x: 0, y: Lt(e) } : s === i[1] ? { x: 1, y: Lt(e) } : s === i[2] ? { x: Lt(t), y: 0 } : { x: Lt(t), y: 1 };
}
function xc(n, t, e = ii) {
  const i = {
    ArrowLeft: [-e, 0],
    ArrowRight: [e, 0],
    ArrowUp: [0, -e],
    ArrowDown: [0, e]
  }, [s, o] = i[t] || [0, 0], r = Re(n), a = { x: ae(Lt(r.x + s)), y: ae(Lt(r.y + o)) };
  return a.x === 0 || a.x === 1 || a.y === 0 || a.y === 1 ? a : r;
}
function Ro(n, t, e) {
  if (!e) return { ...n };
  const i = e * Math.PI / 180, s = n.x - t.x, o = n.y - t.y;
  return { x: t.x + s * Math.cos(i) - o * Math.sin(i), y: t.y + s * Math.sin(i) + o * Math.cos(i) };
}
function rn(n, t) {
  const e = { x: n.x + n.width / 2, y: n.y + n.height / 2 }, i = Ro(t, e, -(n.rotation || 0));
  return { x: (i.x - n.x) / (n.width || 1), y: (i.y - n.y) / (n.height || 1) };
}
function Ru(n, t) {
  const e = { x: n.x + n.width / 2, y: n.y + n.height / 2 }, i = Ro({ x: n.x + t.x * n.width, y: n.y + t.y * n.height }, e, n.rotation || 0);
  return { x: Lt(i.x), y: Lt(i.y) };
}
function ku(n, t) {
  const e = rn(n, t), i = (e.x - 0.5) * n.width, s = (e.y - 0.5) * n.height;
  if (Math.abs(i) < 1e-9 && Math.abs(s) < 1e-9) return { x: 0.5, y: 0 };
  const o = i !== 0 ? n.width / 2 / Math.abs(i) : 1 / 0, r = s !== 0 ? n.height / 2 / Math.abs(s) : 1 / 0, a = Math.min(o, r);
  return Re({ x: 0.5 + i * a / n.width, y: 0.5 + s * a / n.height });
}
function _c(n) {
  const t = { ...n };
  return t.showParentArrow = n.showChildArrow !== !1, t.showChildArrow = !!n.showParentArrow, t.sourceAnchor = n.targetAnchor ?? null, t.targetAnchor = null, t;
}
function ko(n, t) {
  try {
    const [e, i] = wn(n, t[0], t[1]), s = n.bbox();
    return !s || !s.width || !s.height ? null : Ni((e - s.x) / s.width, (i - s.y) / s.height);
  } catch {
    return null;
  }
}
function an(n, t) {
  const e = t ? n.source : n.target;
  return e && e._isPhantomRect ? "free" : (t ? n.sourceAnchor : n.targetAnchor) ? "pinned" : "follow";
}
function ke(n, t, e) {
  const i = t && t.glyph;
  if (!i) return;
  if (t.glyphState !== e) {
    i.clear();
    const r = n.handleStroke, a = (l, c) => {
      l().fill("none").stroke({ color: "#ffffff", width: c + 3, linejoin: "round" }), l().fill("none").stroke({ color: r, width: c, linejoin: "round" });
    };
    e === "pinned" ? i.rect(10, 10).center(0, 0).fill(r).stroke({ color: "#ffffff", width: 1.5 }) : a(e === "free" ? () => i.polygon("0,-8 8,0 0,8 -8,0") : () => i.circle(13).center(0, 0), 2.5), t.glyphState = e, i.attr("data-state", e);
  }
  const [s, o] = t.position || [0, 0];
  i.attr("transform", `translate(${s},${o})`);
}
function Cc(n, t) {
  return n && typeof n[t] == "function";
}
function ts(n, t, e) {
  if (!n.showHandles) return null;
  const i = n.handleContainer || n.container, s = t ? "source" : "target", o = i.group().addClass("connector-handle-glyph").attr({ "data-end": s, "pointer-events": "none", "aria-hidden": "true" }), r = i.circle(n.handleHitRadius * 2).attr({
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
  return ke(n, a, an(n, t)), Ec(n, a), a;
}
function es(n) {
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
function Ec(n, t) {
  let e = null, i = !1;
  if (!Cc(t.element, "draggable")) {
    console.warn(
      "svg.draggable.js plugin not available for connector handles. Install @svgdotjs/svg.draggable.js for proper drag functionality."
    );
    return;
  }
  t.element.draggable(), t.element.on("beforedrag", function(s) {
    t.element.cx(), t.element.cy();
    try {
      t.element.node.style.cursor = "grabbing";
    } catch {
      t.element.node.setAttribute("style", "cursor: grabbing");
    }
    t.element.front(), i = !1;
  }).on("dragmove", function(s) {
    i || (i = !0, Sc(n, t));
    const o = [t.element.cx(), t.element.cy()];
    t.position = o;
    const r = s.detail.event;
    e = Rc(n, r, t), kc(e), Ac(n, t, o, e);
    let a = "free";
    e && (a = ko(e, o) ? "pinned" : "follow"), ke(n, t, a);
  }).on("dragend", function(s) {
    try {
      t.element.node.style.cursor = "grab";
    } catch {
      t.element.node.setAttribute("style", "cursor: grab");
    }
    if (n.debugMode && No(n.container), !i) {
      e = null, typeof n.onLineClick == "function" && n.onLineClick();
      return;
    }
    if (i = !1, e)
      is(n, t, e), Po();
    else {
      const o = [t.element.cx(), t.element.cy()], r = Nc(n, o);
      t.isSource ? n._sourcePhantomRect = r : n._targetPhantomRect = r, is(n, t, r);
    }
    e = null;
  });
}
function Sc(n, t) {
  t.isDetached = !0, t.originalTarget || (t.originalTarget = t.isSource ? n.source : n.target), t.originalType || (t.originalType = n.type);
  const e = t.isSource ? n.source : n.target;
  e && e._isPhantomRect && (e.remove(), t.isSource ? n._sourcePhantomRect = null : n._targetPhantomRect = null), t.isSource ? n.source = null : n.target = null;
}
function Ac(n, t, e, i) {
  const s = t.originalType || n.type;
  let o = null, r = null;
  i && typeof i.bbox == "function" && !i._isPhantomRect && !(i.hasClass && i.hasClass("connector-handle")) && (r = ko(i, e), o = i);
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
  }, l = n.source, c = n.target, h = n.type, d = n.sourceAnchor, f = n.targetAnchor;
  try {
    n.type = s, t.isSource ? (o ? (n.source = o, n.sourceAnchor = r) : (n.source = a, n.sourceAnchor = null), n.target || (n.target = {
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
    const u = ki(n);
    n.connector.plot(u), n.hitArea.plot(u);
  } finally {
    n.source = l, n.target = c, n.type = h, n.sourceAnchor = d, n.targetAnchor = f;
  }
}
const Mc = 10;
function ns(n, t, e = !1, i = 0) {
  try {
    const s = n.node.getCTM(), o = n.bbox();
    e && console.log("Hit test debug:", {
      element: n.type,
      point: t,
      bbox: o,
      ctm: s
    });
    const r = s.a * s.d - s.b * s.c;
    if (Math.abs(r) < 1e-10)
      return e && console.log("Using fallback bbox test due to singular matrix"), t[0] >= o.x && t[0] <= o.x + o.width && t[1] >= o.y && t[1] <= o.y + o.height;
    const a = s.d / r, l = -s.b / r, c = -s.c / r, h = s.a / r, d = (s.c * s.f - s.d * s.e) / r, f = (s.b * s.e - s.a * s.f) / r, u = a * t[0] + c * t[1] + d, p = l * t[0] + h * t[1] + f, m = i ? i / Math.sqrt(Math.abs(r) || 1) : 0;
    e && console.log("Local coordinates:", { localX: u, localY: p });
    let g = !1;
    if (n.type === "circle") {
      const y = parseFloat(n.attr("cx")) || o.cx, b = parseFloat(n.attr("cy")) || o.cy, v = parseFloat(n.attr("r")) || 0, w = u - y, _ = p - b;
      g = w * w + _ * _ <= (v + m) * (v + m), e && console.log("Circle test:", {
        cx: y,
        cy: b,
        r: v,
        dx: w,
        dy: _,
        distance: Math.sqrt(w * w + _ * _),
        result: g
      });
    } else if (n.type === "ellipse") {
      const y = parseFloat(n.attr("cx")) || o.cx, b = parseFloat(n.attr("cy")) || o.cy, v = parseFloat(n.attr("rx")) || 0, w = parseFloat(n.attr("ry")) || 0, _ = u - y, x = p - b;
      g = _ * _ / ((v + m) * (v + m)) + x * x / ((w + m) * (w + m)) <= 1, e && console.log("Ellipse test:", { cx: y, cy: b, rx: v, ry: w, dx: _, dy: x, result: g });
    } else
      g = u >= o.x - m && u <= o.x + o.width + m && p >= o.y - m && p <= o.y + o.height + m, e && console.log("Rect test:", {
        localX: u,
        localY: p,
        bboxX: o.x,
        bboxY: o.y,
        bboxWidth: o.width,
        bboxHeight: o.height,
        result: g
      });
    return g;
  } catch (s) {
    e && console.log("Exception in hit test, using fallback:", s);
    const o = n.bbox();
    return t[0] >= o.x && t[0] <= o.x + o.width && t[1] >= o.y && t[1] <= o.y + o.height;
  }
}
function Tc(n, t) {
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
        (d, f) => (f === 0 ? "M" : "L") + d[0] + "," + d[1]
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
function No(n) {
  try {
    n.find(".debug-hit-zone").forEach((e) => e.remove());
  } catch (t) {
    console.warn("Error clearing hit zone visualizations:", t);
  }
}
function Rc(n, t, e) {
  const i = n.debugMode || !1;
  i && No(n.container);
  function s(p) {
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
      const x = p.node.classList;
      if (x && (x.contains("svg_select_boundingRect") || x.contains("svg_select_points") || x.contains("svg_select_selector") || x.contains("svg_resize_rotationPoint") || x.contains("svg_resize_handle") || x.contains("svg_resize_point") || x.contains("svg_draggable_handle") || x.contains("plugin-ui") || x.contains("ui-element")))
        return !1;
    }
    const g = p.bbox();
    if (g.width < 10 || g.height < 10)
      return !1;
    try {
      const S = window.getComputedStyle(p.node).cursor;
      if (S === "nw-resize" || S === "ne-resize" || S === "sw-resize" || S === "se-resize" || S === "ew-resize" || S === "ns-resize" || S === "crosshair")
        return !1;
    } catch {
    }
    const y = p.node.dataset;
    if (y && (y.svgjs || y.plugin || y.handle || y.ui))
      return !1;
    let b = p.parent();
    for (; b && b.type !== "svg"; ) {
      if (b.hasClass) {
        const S = b.node.classList;
        if (S && (S.contains("svg_select_group") || S.contains("svg_resize_group") || S.contains("plugin-ui-group")))
          return !1;
      }
      const x = b.attr("id");
      if (x && (x.includes("_select_") || x.includes("_resize_") || x.includes("plugin")))
        return !1;
      b = b.parent();
    }
    const v = p.attr("id");
    if (v && (v.includes("_select_") || v.includes("_resize_") || v.includes("_handle_") || v.includes("_rotation_") || v.includes("plugin") || v.startsWith("svg_")))
      return !1;
    const w = p.attr("fill"), _ = p.attr("stroke");
    return !(!w && !_ || (w === "transparent" || w === "none") && (!_ || _ === "none" || _ === "transparent"));
  }
  const r = n.container.root(), a = r.node.getBoundingClientRect(), c = t && t.changedTouches && t.changedTouches[0] || t && t.touches && t.touches[0] || t;
  if (!c || !Number.isFinite(c.clientX) || !Number.isFinite(c.clientY)) return null;
  const h = c.clientX - a.left, d = c.clientY - a.top;
  i && console.log("Drop target search at:", { svgX: h, svgY: d });
  const f = s(r);
  i && (console.log("Found target shapes:", f.length), f.forEach((p, m) => {
    console.log(`Target shape ${m}:`, {
      type: p.type,
      id: p.attr("id"),
      classes: p.node.classList ? Array.from(p.node.classList) : [],
      fill: p.attr("fill"),
      stroke: p.attr("stroke"),
      bbox: p.bbox(),
      isValid: Xe(n, p, e)
    });
  }), f.forEach((p) => {
    Xe(n, p, e) && Tc(p, n.container);
  }));
  const u = [];
  return f.forEach(function(p) {
    if (Xe(n, p, e))
      try {
        if (ns(p, [h, d], i)) {
          let g, y;
          try {
            const v = p.bbox(), w = p.node.getCTM();
            g = w.a * v.cx + w.c * v.cy + w.e, y = w.b * v.cx + w.d * v.cy + w.f;
          } catch {
            const w = p.bbox();
            g = w.cx, y = w.cy;
          }
          const b = Math.sqrt(
            Math.pow(h - g, 2) + Math.pow(d - y, 2)
          );
          i && console.log("Found candidate:", {
            element: p.type,
            distance: b
          }), u.push({ element: p, distance: b });
        }
      } catch (m) {
        console.warn("Error checking element for drop target:", m);
      }
  }), u.length === 0 && f.forEach(function(p) {
    if (Xe(n, p, e))
      try {
        if (!ns(p, [h, d], !1, Mc)) return;
        const m = p.bbox(), g = p.node.getCTM(), y = g.a * m.cx + g.c * m.cy + g.e, b = g.b * m.cx + g.d * m.cy + g.f;
        u.push({ element: p, distance: Math.hypot(h - y, d - b) });
      } catch {
      }
  }), u.length > 0 ? (u.sort(function(p, m) {
    return p.distance - m.distance;
  }), i && console.log("Selected closest candidate:", u[0]), u[0].element) : (i && console.log("No drop target found"), null);
}
function Xe(n, t, e) {
  try {
    let s = t.node;
    for (; s && s.getAttribute && !s.getAttribute("data-node-id"); )
      s = s.parentNode;
    if (!(s && s.getAttribute && s.getAttribute("data-node-id")) || s.getAttribute("data-no-connect")) return !1;
  } catch {
    return !1;
  }
  if (t.attr("connectortype") || t.hasClass && t.hasClass("connector-handle") || t._isPhantomRect) return !1;
  const i = e.isSource ? n.target : n.source;
  return t !== i;
}
function is(n, t, e) {
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
    const o = ki(n);
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
  if (ke(n, t, an(n, t.isSource)), typeof n.onEndpointChange == "function") {
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
let tt = null;
function kc(n) {
  if (n !== tt)
    if (Po(), n) {
      tt = n, n._originalStroke = n.attr("stroke"), n._originalStrokeWidth = n.attr("stroke-width"), n._originalStrokeDasharray = n.attr("stroke-dasharray"), n._originalStrokeOpacity = n.attr("stroke-opacity"), n.attr({
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
      tt = null;
}
function Po() {
  if (tt && tt._originalStroke !== void 0) {
    tt.attr({
      stroke: tt._originalStroke,
      "stroke-width": tt._originalStrokeWidth,
      "stroke-dasharray": tt._originalStrokeDasharray,
      "stroke-opacity": tt._originalStrokeOpacity
    });
    try {
      const n = tt.node.style;
      n.animation = "", n.strokeDashoffset = "";
    } catch {
    }
    delete tt._originalStroke, delete tt._originalStrokeWidth, delete tt._originalStrokeDasharray, delete tt._originalStrokeOpacity;
  }
  tt = null;
}
function ss(n, t) {
  if (!n.showHandles || !t || t.length < 2) {
    n.sourceHandle && (es(n.sourceHandle), n.sourceHandle = null), n.targetHandle && (es(n.targetHandle), n.targetHandle = null);
    return;
  }
  const e = [t[0][1], t[0][2]], i = t[t.length - 1], s = [i[i.length - 2], i[i.length - 1]];
  n.sourceHandle ? (n.sourceHandle.element.attr({
    cx: e[0],
    cy: e[1]
  }), n.sourceHandle.position = e) : n.sourceHandle = ts(n, !0, e), ke(n, n.sourceHandle, an(n, !0)), n.targetHandle ? (n.targetHandle.element.attr({
    cx: s[0],
    cy: s[1]
  }), n.targetHandle.position = s) : n.targetHandle = ts(n, !1, s), ke(n, n.targetHandle, an(n, !1));
}
function Nc(n, t) {
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
function Do(n, t) {
  t.current && t.current !== n && Pi(t.current), t.current = n, n.isSelected = !0, n.showHandles = !0, n.update();
}
function Pi(n) {
  n.isSelected = !1, n.showHandles = !1, n.update();
}
function Pc(n, t) {
  n.isSelected ? (Pi(n), t.current === n && (t.current = null)) : Do(n, t);
}
function Dc(n, t) {
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
function Oc(n, t, e) {
  n[t + "Attach"] = e, n.update();
}
function Ic(n, t) {
  return n.showHandles = t, n.update(), n;
}
function Lc(n) {
  return {
    sourceHandle: n.sourceHandle,
    targetHandle: n.targetHandle
  };
}
function zc(n, t) {
  return n.clickAreaWidth = Math.max(6, t || 12), n.hitArea.attr("stroke-width", n.clickAreaWidth), n;
}
function Gc(n, t) {
  t && (n.connector.remove(), t == "default" ? (n.connector = n.container.path().attr("connectortype", "default").fill("none").stroke("#000000").attr("stroke-width", 2), n.connector.stroke(n.color).attr("stroke-width", n.strokeWidth)) : n.connector = t, n.update());
}
function Bc(n, t) {
  ["straight", "curved", "orthogonal"].indexOf(t) != -1 && n.type != t && (n.type = t, n.update());
}
function Oo(n, t) {
  return n.debugMode = t, n.hitArea.attr({
    stroke: n.debugMode ? "#ff0000" : "#000000",
    "stroke-opacity": n.debugMode ? 0.5 : 0.01
  }), n;
}
function Hc(n) {
  return Oo(n, !n.debugMode);
}
function Io(n, t) {
  return t = t || {}, pt(n.source, "select") ? n.source.select(t) : console.warn(
    "svg.select.js plugin not available. Install @svgdotjs/svg.select.js to use selection features."
  ), pt(n.target, "select") ? n.target.select(t) : console.warn(
    "svg.select.js plugin not available. Install @svgdotjs/svg.select.js to use selection features."
  ), n;
}
function Lo(n, t) {
  return pt(n.source, "draggable") ? n.source.draggable() : console.warn(
    "svg.draggable.js plugin not available. Install @svgdotjs/svg.draggable.js to use dragging features."
  ), pt(n.target, "draggable") ? n.target.draggable() : console.warn(
    "svg.draggable.js plugin not available. Install @svgdotjs/svg.draggable.js to use dragging features."
  ), n;
}
function zo(n, t) {
  return t = t || {}, pt(n.source, "resize") ? n.source.resize(t) : console.warn(
    "svg.resize.js plugin not available. Install @svgdotjs/svg.resize.js to use resize features."
  ), pt(n.target, "resize") ? n.target.resize(t) : console.warn(
    "svg.resize.js plugin not available. Install @svgdotjs/svg.resize.js to use resize features."
  ), n;
}
function Fc(n, t, e, i, s) {
  return t = t || {}, i = i || {}, pt(n.source, "draggable") && pt(n.target, "draggable"), pt(n.source, "select") && pt(n.target, "select"), pt(n.source, "resize") && pt(n.target, "resize"), Lo(n), Io(n, t), zo(n, i), n;
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
let Ft = null, kn = null;
const We = { current: null };
function Uc(n, t) {
  const e = {};
  t === void 0 && (t = n, n = {}), Ft = n.container || this.parent() || Ft;
  const i = this;
  if (kn = n.markers || this.parent() || kn, e.container = Ft, e.source = i, e.target = t, e.type = n.type || "straight", e.strokeWidth = n.strokeWidth || 2, e.color = n.color || "#000000", e.clickAreaWidth = n.clickAreaWidth || Math.max(12, e.strokeWidth * 3), e.debugMode = n.debugMode || !1, n.connector) {
    const a = Ri.find(
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
  e.connector || (e.connector = Ft.path().attr("connectortype", "default").fill("none").stroke(e.color).attr("stroke-width", e.strokeWidth)), e.hitArea = Ft.path().attr({
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
    return ki(a || e);
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
      l ? (e.connector.plot(a), e.hitArea.plot(a), ss(e, a), e.positionLabel && e.positionLabel()) : console.error("Skipping plot due to invalid path data");
    }
  }, on(e, e.markerSourceType, e.markerTargetType, kn), e.sourceHandle = null, e.targetHandle = null, e.setMarker = function(a, l, c) {
    return on(e, a, l, c);
  }, e.setMarkerSettings = function(a, l) {
    return bc(e, a, l);
  }, e.positionLabel = function() {
    if (!(!e.label || !e.connector || !e.connector.node))
      try {
        const a = e.connector.node.getTotalLength();
        if (!a || !isFinite(a)) return;
        const l = typeof e.labelAt == "number" && isFinite(e.labelAt) ? Math.min(0.95, Math.max(0.05, e.labelAt)) : 0.5, c = e.connector.node.getPointAtLength(a * l);
        if (e.label.center(c.x, c.y), e.labelBg) {
          const h = e.label.bbox();
          e.labelBg.size(h.width + 10, h.height + 4).center(c.x, c.y);
        }
      } catch {
      }
  }, e.setLabel = function(a) {
    if (e.labelText = a == null ? "" : String(a), !e.labelText) {
      e.label && (e.label.remove(), e.label = null), e.labelBg && (e.labelBg.remove(), e.labelBg = null);
      return;
    }
    e.label ? e.label.text(e.labelText) : (e.labelBg = Ft.rect(0, 0).attr({ fill: "#ffffff", "fill-opacity": 0.85, "pointer-events": "none" }).radius(3), e.label = Ft.text(e.labelText).attr({
      "font-size": 13,
      "font-family": "Arial, sans-serif",
      fill: "#333333",
      "text-anchor": "middle",
      "pointer-events": "none"
    })), e.positionLabel();
  }, e.setStrokeWidth = function(a) {
    return vc(e, a);
  }, e.setConnectorColor = function(a) {
    return Ji(e, a), e;
  }, e.remove = function() {
    const a = (l) => {
      try {
        l && l.remove && l.remove();
      } catch {
      }
    };
    return a(e.connector), a(e.hitArea), a(e.sourceHandle && e.sourceHandle.element), a(e.sourceHandle && e.sourceHandle.glyph), a(e.targetHandle && e.targetHandle.element), a(e.targetHandle && e.targetHandle.glyph), a(e.markerSource), a(e.markerTarget), a(e._sourcePhantomRect), a(e._targetPhantomRect), a(e.label), a(e.labelBg), e;
  }, e.getCurrentAnchor = function(a) {
    const l = a === "source" ? e.source : e.target, c = a === "source" ? e.target : e.source;
    if (!l || !l.bbox || !c) return { x: 0.5, y: 0.5 };
    try {
      const h = Te(c), d = sn(l, h), f = wn(l, d[0], d[1]), u = l.bbox();
      return !u.width || !u.height ? { x: 0.5, y: 0.5 } : {
        x: (f[0] - u.x) / u.width,
        y: (f[1] - u.y) / u.height
      };
    } catch {
      return { x: 0.5, y: 0.5 };
    }
  }, e.setAttachmentAnchor = function(a, l) {
    return a === "source" ? e.sourceAnchor = l || null : a === "target" && (e.targetAnchor = l || null), e.update(), e;
  }, e.updateHandles = function(a) {
    ss(e, a);
  }, e.selectConnector = function() {
    Do(e, We);
  }, e.deselectConnector = function() {
    Pi(e), We.current === e && (We.current = null);
  }, e.toggleSelection = function() {
    Pc(e, We);
  }, e.setConnectorAttachment = function(a, l) {
    Oc(e, a, l);
  }, e.setHandleVisibility = function(a) {
    return Ic(e, a);
  }, e.getHandles = function() {
    return Lc(e);
  }, e.setClickAreaWidth = function(a) {
    return zc(e, a);
  }, e.setConnector = function(a) {
    Gc(e, a);
  }, e.setType = function(a) {
    Bc(e, a);
  }, e.setDebugMode = function(a) {
    return Oo(e, a);
  }, e.toggleDebugMode = function() {
    return Hc(e);
  }, e.makeSelectable = function(a) {
    return Io(e, a);
  }, e.makeDraggable = function(a) {
    return Lo(e);
  }, e.makeResizable = function(a) {
    return zo(e, a);
  }, e.makeInteractive = function(a, l, c) {
    return Fc(e, a, l, c);
  }, Dc(e), e.update();
  function s(a) {
    e.update();
  }
  function o(a) {
    e.update();
  }
  function r(a) {
    e.update();
  }
  return e._sourceUpdateFunction = o, e._targetUpdateFunction = r, i.on("dragmove", o), t.on("dragmove", r), i.on("beforedrag", o), i.on("dragstart", o), i.on("dragend", o), t.on("beforedrag", r), t.on("dragstart", r), t.on("dragend", r), i.on("resize", o), t.on("resize", r), i.on("rotate", o), t.on("rotate", r), i.on("transform", o), t.on("transform", r), e.updateConnector = s, Ji(e, e.color), e;
}
D(at, {
  connectable: Uc,
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
const Di = 28, ln = 44, xn = 20, xe = 15, Yc = 4, $c = 24, Xc = 48, Wc = 20, qc = 32, Zc = 15, si = "M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8M21 3v5h-5", Nn = "#2d6cdf", os = "#1f56b8", rs = "#c7ccd4", Vc = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="${si}" stroke="#fff" stroke-width="5"/><path d="${si}" stroke="#1b1f1d" stroke-width="2"/></svg>`, Oi = `url("data:image/svg+xml,${encodeURIComponent(Vc)}") 12 12, grab`;
function ie(n) {
  let t = n % 360;
  return t <= -180 && (t += 360), t > 180 && (t -= 360), t === 0 ? 0 : t;
}
function jc(n, t, e, i, s = {}) {
  const o = Math.atan2(e.y - t.y, e.x - t.x), r = Math.atan2(i.y - t.y, i.x - t.x);
  return Ii(n + (r - o) * 180 / Math.PI, s);
}
function Ii(n, t = {}) {
  let e = n;
  if (t.shift)
    e = Math.round(e / xe) * xe;
  else {
    const i = Math.round(e / 90) * 90;
    e = t.coarse && Math.abs(e - i) <= Yc ? i : Math.round(e);
  }
  return ie(e);
}
function Go(n, t, e = xn, i = "right") {
  const s = n?.[0], o = n?.[2], r = n?.[4];
  if (!s || !o || !r) return null;
  const a = t > 0 && Number.isFinite(t) ? t : 1, l = (u, p) => {
    const m = u[0] - p[0], g = u[1] - p[1], y = Math.hypot(m, g);
    return y > 1e-9 ? [m / y, g / y] : [0, 0];
  };
  let c = l(o, s), h = l(o, r);
  !c[0] && !c[1] && (c = [1, 0]), !h[0] && !h[1] && (h = [-c[1], c[0]]);
  const d = e / a, f = i === "left" ? [s[0] + (h[0] - c[0]) * d, s[1] + (h[1] - c[1]) * d] : [o[0] + (c[0] + h[0]) * d, o[1] + (c[1] + h[1]) * d];
  return Number.isFinite(f[0]) && Number.isFinite(f[1]) ? f : null;
}
function Kc(n, t) {
  const e = n("right");
  return e >= t ? "right" : n("left") > e ? "left" : "right";
}
function Qc(n, t) {
  if (typeof document > "u" || typeof document.elementFromPoint != "function" || !t) return n.length;
  const e = window.innerWidth || 0, i = window.innerHeight || 0;
  let s = 0;
  for (const o of n) {
    if (!(o.x >= 0 && o.y >= 0 && o.x <= e && o.y <= i)) continue;
    const r = document.elementFromPoint(o.x, o.y);
    r && t.contains(r) && (s += 1);
  }
  return s;
}
function Jc(n, t = !1) {
  const e = Number.isFinite(n) ? n : 1 / 0;
  return e < $c ? { visible: !1, size: 0, hit: 0, offset: 0 } : e < Xc && !t ? { visible: !0, size: Wc, hit: qc, offset: Zc } : { visible: !0, size: Di, hit: ln, offset: xn };
}
function th(n, t) {
  const e = n?.[0], i = n?.[2], s = n?.[4];
  if (!e || !i || !s) return 1 / 0;
  const o = t > 0 && Number.isFinite(t) ? t : 1;
  return Math.min(Math.hypot(i[0] - e[0], i[1] - e[1]), Math.hypot(s[0] - i[0], s[1] - i[1])) * o;
}
function eh() {
  try {
    return typeof window < "u" && !!window.matchMedia?.("(pointer: coarse)").matches;
  } catch {
    return !1;
  }
}
function nh(n) {
  try {
    const t = n?.el?.root?.()?.screenCTM?.(), e = t ? Math.hypot(t.a, t.b) : 1;
    return e > 0 && Number.isFinite(e) ? e : 1;
  } catch {
    return 1;
  }
}
function Bo(n) {
  n.rect(ln, ln).addClass("svg_select_handle_rot_hit").attr({
    fill: "#fff",
    "fill-opacity": 1e-3,
    stroke: "none",
    "pointer-events": "all"
  }), n.circle(Di).addClass("svg_select_handle_rot_knob").attr({
    fill: "#fff",
    stroke: rs,
    "stroke-width": 1,
    "pointer-events": "all"
  }), n.path(si).addClass("svg_select_handle_rot_icon").attr({
    fill: "none",
    stroke: Nn,
    "stroke-width": 2.6,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "pointer-events": "none"
  });
  const t = n.node;
  t.style.cursor = Oi, t.style.filter = "drop-shadow(0 1px 2px rgba(0,0,0,.28))", t.setAttribute("data-rotate-knob", ""), t.setAttribute("aria-label", "Rotate");
  const e = () => {
    const i = t.getAttribute("data-state"), s = t.querySelector("circle"), o = t.querySelector("path");
    s?.setAttribute("fill", i === "active" ? os : i === "hover" ? Nn : "#fff"), s?.setAttribute("stroke", i ? os : rs), o?.setAttribute("stroke", i ? "#fff" : Nn);
  };
  t.__paintKnob = e, t.addEventListener("pointerenter", () => {
    t.getAttribute("data-state") !== "active" && t.setAttribute("data-state", "hover"), e(), n.__relayout?.();
  }), t.addEventListener("pointerleave", () => {
    t.getAttribute("data-state") !== "active" && t.removeAttribute("data-state"), e(), n.__relayout?.();
  });
}
function Ho(n, t, e) {
  Fo(n, e, nh(this));
  const i = () => Ho.call(this, n, t, e);
  n.__relayout = i, n.node.__relayout = i;
}
function ih(n) {
  n?.querySelectorAll?.("[data-rotate-knob]").forEach((t) => {
    try {
      t.__relayout?.();
    } catch {
    }
  });
}
function Fo(n, t, e) {
  const i = n.node, s = Jc(th(t, e), eh());
  if (!s.visible) {
    i.setAttribute("display", "none"), i.setAttribute("data-knob-size", "0");
    return;
  }
  i.removeAttribute("display"), i.setAttribute("data-knob-size", String(s.size));
  const o = i.getAttribute("data-state") === "active", r = o && i.getAttribute("data-knob-side") === "left" ? "left" : o ? "right" : sh(i, t, e, s);
  i.setAttribute("data-knob-side", r);
  const a = Go(t, e, s.offset, r);
  if (!a) return;
  const [l, c] = a, h = i.getAttribute("data-state") ? 1.1 : 1, d = n.findOne?.("rect"), f = n.findOne?.("circle"), u = n.findOne?.("path"), p = s.hit / e;
  d?.attr({ x: l - p / 2, y: c - p / 2, width: p, height: p, rx: p / 2, ry: p / 2 }), f?.attr({ cx: l, cy: c, r: s.size * h / 2 / e, "stroke-width": 1 / e });
  const m = s.size * 4 / 7 * h / 24 / e;
  u?.attr({ transform: `translate(${l - 12 * m} ${c - 12 * m}) scale(${m})` });
}
function sh(n, t, e, i) {
  try {
    const s = n.getScreenCTM?.();
    let o = n.ownerSVGElement;
    for (; o?.ownerSVGElement; ) o = o.ownerSVGElement;
    if (!s || !o) return "right";
    const r = i.size / 2, a = (l) => {
      const c = Go(t, e, i.offset, l);
      if (!c) return [];
      const h = s.a * c[0] + s.c * c[1] + s.e, d = s.b * c[0] + s.d * c[1] + s.f;
      return [{ x: h, y: d }, { x: h - r, y: d }, { x: h + r, y: d }, { x: h, y: d - r }, { x: h, y: d + r }];
    };
    return Kc((l) => Qc(a(l), o), 5);
  } catch {
    return "right";
  }
}
class Uo {
  constructor() {
    this.el = null;
  }
  /**
   * @param coarse - a finger: the pill goes above the touch point, where the hand
   *                 does not cover it (a mouse: below and to the right)
   */
  show(t, e, i, s = !1) {
    if (typeof document > "u") return;
    if (!this.el) {
      const d = document.createElement("div");
      d.className = "slatebox-rotate-readout", d.setAttribute("aria-hidden", "true"), d.style.cssText = "position:fixed;left:0;top:0;z-index:2147483000;pointer-events:none;padding:3px 8px;border-radius:999px;background:#1b1f1d;color:#fff;font:600 12px/16px system-ui,-apple-system,'Segoe UI',sans-serif;font-variant-numeric:tabular-nums;box-shadow:0 2px 6px rgba(0,0,0,.3);white-space:nowrap", document.body.appendChild(d), this.el = d;
    }
    this.el.textContent = `${Math.round(t)}°`;
    const o = this.el.offsetWidth || 40, r = this.el.offsetHeight || 22, a = window.innerWidth || 0, l = window.innerHeight || 0, c = Math.max(4, Math.min(s ? e - o / 2 : e + 24, a - o - 4)), h = Math.max(4, Math.min(s ? i - 56 - r : i + 24, l - r - 4));
    this.el.style.transform = `translate(${Math.round(c)}px, ${Math.round(h)}px)`;
  }
  hide() {
    this.el?.remove(), this.el = null;
  }
}
function oi(n) {
  const e = n?.touches?.[0] ?? n?.changedTouches?.[0] ?? n, i = e?.clientX, s = e?.clientY;
  return Number.isFinite(i) && Number.isFinite(s) ? { x: i, y: s } : null;
}
function oh(n, t, e) {
  const i = n, s = [i[0] - t[0], i[1] - t[1]], o = [i[0] - e[0], i[1] - e[1]], r = Math.sqrt(s[0] * s[0] + s[1] * s[1]) || 1, a = Math.sqrt(o[0] * o[0] + o[1] * o[1]) || 1, l = [s[0] / r, s[1] / r], c = [o[0] / a, o[1] / a], h = [i[0] - 10 * l[0], i[1] - 10 * l[1]], d = [i[0] - 10 * c[0], i[1] - 10 * c[1]], f = [h, i, d];
  return f.every(
    (p) => Number.isFinite(p[0]) && Number.isFinite(p[1])
  ) ? f : null;
}
class rh {
  /**
   * Creates resize/rotate handle management for a node.
   *
   * @param node    - The parent Node instance
   * @param options - Resize/rotate configuration
   */
  constructor(t, e = {}) {
    this.isActive = !1, this._interacting = !1, this._didRotate = !1, this._didResize = !1, this._readout = new Uo(), this._cancelled = !1, this._keyPending = !1, this.onGestureKey = (i) => {
      if (i.key !== "Escape" || !this._interacting || !this._rot) return;
      i.preventDefault(), i.stopImmediatePropagation();
      const s = this.node, o = this._rot.angle;
      this._cancelled = !0, this._didRotate = this._didResize = !1, s && (s.options.rotate?.rotationAngle ?? 0) !== o && (s.applyInteractionRotation(o), s.finalizeInteraction(), s.slate?.notifyNodeChanged(s)), this.finish(), s?.slate?.announce?.("Rotate cancelled");
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
    const t = this.node.slate, e = t?.governanceOf?.(this.node) ? t.capabilitiesOf(this.node) : null, i = !!this.options.resizeEnabled && e?.canResize !== !1, s = !!this.options.rotateEnabled && e?.canRotate !== !1;
    try {
      const o = this.target;
      typeof o.select == "function" && (o.select({
        rotationPoint: e ? s : this.options.rotateEnabled,
        // svg.select.js' default updateHandle divides by the distance between
        // adjacent handle points; when a transient/degenerate bbox makes points
        // coincide (or the screenCTM collapses), that divide-by-zero plots
        // "NaN" polyline points and floods the console (notably on multi-select
        // via the keyboard). This replicates the default L-bracket exactly but
        // guards the division and never plots non-finite points.
        updateHandle: (r, a, l, c) => {
          const h = c[(l - 1 + c.length) % c.length], d = c[(l + 1) % c.length], f = oh(a, h, d);
          f && r.plot(f);
        },
        // A screen-sized knob with a rotate icon outside the top-right corner,
        // in place of the plugin's 5-unit dot above top-centre.
        createRot: Bo,
        updateRot: Ho
      }), (e ? s : this.options.rotateEnabled) && this.wireKnobKeyboard()), (e ? i || s : this.options.resizeEnabled) && typeof o.resize == "function" && o.resize({
        preserveAspectRatio: this.options.preserveAspectRatio,
        aroundCenter: this.options.aroundCenter,
        grid: this.options.grid ?? 1,
        degree: this.options.degree ?? 0.1
      }), this.styleSelectionUi(), e && this.hideHandles(!i, !s), this.addEventListeners(), this.isActive = !0;
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
      const i = ie(this.node?.options.rotate?.rotationAngle ?? 0);
      t.setAttribute("aria-valuenow", String(Math.round(i))), t.setAttribute("aria-valuetext", `${Math.round(i)} degrees`);
    };
    e(), t.addEventListener("focus", () => {
      t.style.outline = "none", t.querySelector("circle")?.setAttribute("stroke", "#1f56b8"), t.querySelector("circle")?.setAttribute("stroke-width", String(2.5 / this.overlayScale()));
    }), t.addEventListener("blur", () => {
      this.commitKeyRotation(), t.__paintKnob?.(), t.querySelector("circle")?.setAttribute("stroke-width", String(1 / this.overlayScale()));
    }), t.addEventListener("keydown", (i) => {
      const s = this.node?.svgGroup?.node;
      if (i.key === "Tab" && !i.shiftKey) {
        s?.focus();
        return;
      }
      if (i.key === "Escape") {
        s?.focus();
        return;
      }
      if (i.key === "Tab") {
        i.preventDefault(), i.stopPropagation();
        const l = this.node?.connectionHandles?.left?.node;
        l?.isConnected && l.getBoundingClientRect().width > 0 ? (l.setAttribute("tabindex", "0"), l.focus()) : s?.focus();
        return;
      }
      const o = this.node?.options.rotate?.rotationAngle ?? 0;
      let r = null;
      const a = i.key === "ArrowRight" || i.key === "ArrowUp" ? 1 : i.key === "ArrowLeft" || i.key === "ArrowDown" ? -1 : 0;
      a ? r = i.shiftKey ? (a > 0 ? Math.floor(o / xe) + 1 : Math.ceil(o / xe) - 1) * xe : Math.round(o) + a : i.key === "Home" && (r = 0), r !== null && (i.preventDefault(), i.stopPropagation(), this.previewKeyRotation(r), e());
    }), t.addEventListener("keyup", (i) => {
      /^Arrow|^Home$/.test(i.key) && this.commitKeyRotation();
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
    e && (e.applyInteractionRotation(ie(t)), e.finalizeInteraction(), e.slate?.notifyNodeChanged(e), this._keyPending = !0, clearTimeout(this._keyCommitTimer), this._keyCommitTimer = setTimeout(() => this.commitKeyRotation(), 700));
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
    const i = ie(t);
    e.applyInteractionRotation(i), e.finalizeInteraction();
    const { id: s, options: o, slate: r } = e;
    r?.broadcast?.("onNodeRotated", {
      id: s,
      rotate: o.rotate,
      width: o.width,
      height: o.height,
      x: o.x,
      y: o.y
    }), r?.notifyNodeChanged(e), r?.announce?.(`Rotated to ${Math.round(i)} degrees`);
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
      const i = new DOMPoint(t.x, t.y).matrixTransform(e.inverse());
      return Number.isFinite(i.x) && Number.isFinite(i.y) ? { x: i.x, y: i.y } : null;
    } catch {
      return null;
    }
  }
  /** Keep the selection outline but remove the handles a governed note may not use. */
  hideHandles(t, e) {
    const i = [
      t ? ".svg_select_handle:not(.svg_select_handle_rot)" : "",
      e ? ".svg_select_handle_rot" : ""
    ].filter(Boolean);
    if (i.length)
      try {
        const s = this.target.node;
        (s.ownerSVGElement || s).querySelectorAll(i.join(", ")).forEach((r) => {
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
      const e = t.detail.handler, i = t.detail.event.detail.event;
      e.preserveAspectRatio = !!(this.options.preserveAspectRatio || i.shiftKey);
      const s = this.node.options, o = this.target.bbox();
      if (this._start = {
        x: s.x ?? 0,
        y: s.y ?? 0,
        width: s.width ?? 0,
        height: s.height ?? 0,
        angle: s.rotate?.rotationAngle ?? 0,
        localX: o.x,
        localY: o.y
      }, this._rot = void 0, t.detail.event?.type === "rot") {
        const a = oi(i), l = a && this.toWorld(a);
        l && (this._rot = {
          angle: s.rotate?.rotationAngle ?? 0,
          centre: { x: (s.x ?? 0) + (s.width ?? 0) / 2, y: (s.y ?? 0) + (s.height ?? 0) / 2 },
          grab: l
        }), document.documentElement.style.cursor = Oi, window.addEventListener("keydown", this.onGestureKey, !0), this.knobElement()?.setAttribute("data-state", "active"), this.knobElement()?.__paintKnob?.();
      }
      this._interacting = !0, this._didRotate = this._didResize = !1, this.node.disableConnectionHandles();
      const r = this.target.remember("_selectHandler")?.getHandlePoints(o);
      r && queueMicrotask(() => {
        e.points = r;
      });
    }), this.target.on("resize.resizerotate", (t) => {
      const { box: e, angle: i, eventType: s } = t.detail ?? {};
      if (this._cancelled) {
        t.preventDefault();
        return;
      }
      const o = this._start;
      if (!(!o || !e)) {
        if (t.preventDefault(), this.node.slate?.frameGestureStart?.("resize"), s === "rot") {
          const r = t.detail?.event, a = oi(r), l = a && this.toWorld(a);
          let c = null;
          if (this._rot && l ? c = jc(this._rot.angle, this._rot.centre, this._rot.grab, l, {
            shift: !!r?.shiftKey,
            coarse: typeof r?.type == "string" && r.type.startsWith("touch")
          }) : Number.isFinite(i) && i && (c = Ii((this.node.options.rotate?.rotationAngle ?? 0) + i)), c === null) return;
          this._didRotate = !0, c !== (this.node.options.rotate?.rotationAngle ?? 0) && this.node.applyInteractionRotation(c), a && this._readout.show(c, a.x, a.y, typeof r?.type == "string" && r.type.startsWith("touch")), this.options.onRotate?.(t);
        } else {
          this._didResize = !0, this.node.backgroundRect.move(e.x, e.y), this.node.resizeTarget?.move(e.x, e.y), this.node.setSize(e.width, e.height);
          const r = this.node.options.width ?? e.width, a = this.node.options.height ?? e.height, l = e.x - o.localX + (r - o.width) / 2, c = e.y - o.localY + (a - o.height) / 2, h = o.angle * Math.PI / 180;
          this.node.options.x = o.x + (o.width - r) / 2 + Math.cos(h) * l - Math.sin(h) * c, this.node.options.y = o.y + (o.height - a) / 2 + Math.sin(h) * l + Math.cos(h) * c, this.node.svgGroup.fire("transform");
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
    const { id: e, options: i, slate: s } = this.node;
    (this._didRotate || this._didResize) && (this.node.finalizeInteraction(), this._didRotate && s?.announce?.(`Rotated to ${Math.round(ie(i.rotate?.rotationAngle ?? 0))} degrees`), s?.broadcast?.(this._didRotate ? "onNodeRotated" : "onNodeResized", {
      id: e,
      rotate: i.rotate,
      width: i.width,
      height: i.height,
      x: i.x,
      y: i.y,
      ...!this._didRotate && { vectorPath: i.vectorPath }
    })), s?.getSelectedNodes().includes(this.node) && this.node.enableConnectionHandles(), this._didRotate = this._didResize = !1, s?.frameGestureEnd?.("resize");
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
typeof window < "u" && (window.SVG = Ri);
function ah(n, t) {
  const e = Math.max(1, Number(t) || 1);
  return n === "dashed" ? `${e * 4} ${e * 3}` : n === "dotted" ? `0.1 ${e * 2.5}` : null;
}
class lh {
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
      const i = e.connectionId || `${this.node.id}->${t.id}`;
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
          lineCurveType: s.lineCurveType,
          // Edge-pin mode (optional): normalized local anchors {x,y} 0..1
          sourceAnchor: e.sourceAnchor,
          targetAnchor: e.targetAnchor
        },
        t.svgGroup
      );
      if (!c)
        return console.error("CONNECTOR_DEBUG: Failed to create connectable object"), null;
      c.connector?.attr?.({
        rel: `association-${this.node.id}-${t.id}`,
        "data-connection-id": i,
        "data-source-node-id": this.node.id,
        "data-target-node-id": t.id
      });
      const h = (f) => this.slate.governanceOf?.(f)?.capabilities?.canConnect === !1;
      h(this.node) && h(t) && (c.connector?.attr?.({ "pointer-events": "none", "data-governed": "line" }), c.hitArea?.attr?.({ "pointer-events": "none" }), c.hitArea?.node?.style && (c.hitArea.node.style.cursor = ""), c.setHandleVisibility?.(!1));
      const d = {
        id: i,
        source: this.node,
        target: t,
        connectable: c,
        lineColor: e.lineColor || this.options.defaultLineColor,
        lineWidth: e.lineWidth || this.options.defaultLineWidth,
        ...e
      };
      d.lineColor && c.setLineColor && c.setLineColor(d.lineColor), this.applyLineAppearance(c, d), c.labelAt = d.labelPosition, d.label && c.setLabel && c.setLabel(d.label), this.connections.set(i, d);
      try {
        this.slate.markersContainer?.front?.();
      } catch {
      }
      if (c.onEndpointChange = (f) => this.handleEndpointChange(d, f), t.connector) {
        const f = `${t.id}<-${i}`;
        t.connector.connections.set(f, d);
      }
      return console.log("CONNECTOR_DEBUG: Successfully connected", i), c.onLineClick = () => {
        this.node.slate?.isReadOnly?.() || this.showLineCog(d, c, t.id);
      }, this.wireHandleReveal(c), this.options.onConnect?.(d), d;
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
    const e = `${this.node.id}->${t.id}`, i = [...this.connections.entries()].filter(([, o]) => o.source === this.node && o.target?.id === t.id).map(([o]) => o);
    if (i.length === 0) return this.disconnectById(e);
    let s = !1;
    for (const o of i) s = this.disconnectById(o) || s;
    return s;
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
        const i = `${e.target.id}<-${t}`;
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
    return this.connections.get(e) || [...this.connections.values()].find((i) => i.source === this.node && i.target?.id === t) || null;
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
        if (e.lineColor != null && s.setConnectorColor && s.setConnectorColor(e.lineColor), e.lineWidth != null && s.setStrokeWidth && s.setStrokeWidth(e.lineWidth), this.applyLineAppearance(s, i), e.label != null && s.setLabel && s.setLabel(e.label), "labelPosition" in e && (s.labelAt = e.labelPosition, s.positionLabel && s.positionLabel()), e.lineType != null && s.setType) {
          const o = {
            bezier: "curved",
            curved: "curved",
            orthogonal: "orthogonal",
            straight: "straight",
            linear: "straight"
          };
          s.setType(o[e.lineType] || "curved");
        }
        if (e.lineCurviness != null && (s.lineCurviness = e.lineCurviness), e.lineCurveType != null && (s.lineCurveType = e.lineCurveType, s.update?.()), e.showParentArrow != null || e.showChildArrow != null) {
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
  /** Apply v1 line opacity/effect fields to the visible connector path. */
  applyLineAppearance(t, e) {
    const i = t?.connector;
    if (i?.attr && (i.attr(
      "stroke-dasharray",
      ah(e.lineDash, e.lineWidth || this.options.strokeWidth || 3)
    ), i.attr("stroke-linecap", e.lineDash === "dotted" ? "round" : null), e.lineOpacity != null && i.attr("stroke-opacity", e.lineOpacity), e.lineEffect !== void 0)) {
      const s = {
        dropShadow: "drop-shadow(3px 3px 4px rgba(0,0,0,0.3))",
        postItNote: "drop-shadow(0 4px 2px rgba(0,0,0,0.5))",
        blur: "blur(2px)",
        pencil: "url(#sb-pencil-filter)"
      };
      i.attr("filter", s[e.lineEffect] || null);
    }
  }
  /**
   * Edge-pin mode: pin (or unpin with null) a connection's endpoint to a
   * normalized local anchor {x,y} in 0..1 on the source or target node.
   * A pinned endpoint stays on that point and rotates with the node; null
   * restores auto-flow (nearest-edge). Re-solves immediately.
   */
  setConnectionAnchor(t, e, i) {
    const s = this.getConnection(t);
    return s ? (e === "source" ? s.sourceAnchor = i : s.targetAnchor = i, s.connectable?.setAttachmentAnchor?.(e, i), !0) : !1;
  }
  // ─── A line's ends (see LineEnds.ts) ─────────────────────────────
  /** Whether an end of one of this note's lines follows its note, is pinned to a spot on its edge, or is free. */
  endState(t, e) {
    const i = this.connections.get(t), s = i?.connectable;
    return s ? (e === "source" ? s.source : s.target)?._isPhantomRect || e === "target" && i._phantom ? "free" : (e === "source" ? s.sourceAnchor : s.targetAnchor) ? "pinned" : "follow" : null;
  }
  /**
   * Where an end is on its note now, as an anchor: read from the line as drawn,
   * so pinning an end that follows keeps it exactly where it is. Null for a free end.
   */
  currentAnchor(t, e) {
    const i = this.connections.get(t);
    if (!i || this.endState(t, e) === "free") return null;
    const o = (e === "source" ? i.source : i.target)?.options || {}, r = e === "source" ? i.connectable?.sourceAnchor : i.connectable?.targetAnchor;
    if (r) return { x: r.x, y: r.y };
    try {
      const a = i.connectable?.connector?.node, l = a.getTotalLength(), c = a.getPointAtLength(e === "source" ? 0 : l), h = rn(
        { x: o.x || 0, y: o.y || 0, width: o.width || 1, height: o.height || 1, rotation: o.rotate?.rotationAngle || 0 },
        { x: c.x, y: c.y }
      );
      return Re(h);
    } catch {
      return i.connectable?.getCurrentAnchor?.(e) ?? null;
    }
  }
  /**
   * Pin an end where it is now ("pinned"), at a given spot ({x, y}), or let it
   * follow its note ("follow"). Saved on the line, shared and undoable, like
   * every line property. False for a free end or a line this note does not hold.
   */
  setEnd(t, e, i) {
    const s = this.connections.get(t), o = s?.source;
    if (!s || o !== this.node || this.endState(t, e) === "free") return !1;
    const r = i === "follow" ? null : i === "pinned" ? this.currentAnchor(t, e) : Re(i), a = e === "source" ? "sourceAnchor" : "targetAnchor";
    return o.relationships?.applyLineProperty(s.id, a, r), this.slate.broadcast?.("onLinePropertiesChanged", { id: o.id, associationId: s.id, prop: a, val: r }), this.describeHandles(s), this.slate.scheduleSelectionFrame?.(), !0;
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
    const { which: i, targetNodeId: s, isPhantom: o, point: r } = e;
    setTimeout(() => {
      try {
        this.applyEndDrop(t, i, o ? null : s, r);
      } catch (a) {
        console.warn("CONNECTOR_DEBUG: endpoint change → model failed:", a);
      }
    }, 0);
  }
  applyEndDrop(t, e, i, s) {
    const o = this.slate, r = t.source, a = r?.relationships, l = a?.getAssociations?.().find((v) => v.id === t.id);
    if (!a || !l) return;
    const c = l.id, h = i ? o.nodes?.one?.(i) : null, d = () => {
      a.redraw?.(c), this.reselect(r.id, c);
    }, f = (v) => {
      if (!s) return null;
      const w = v.options || {}, _ = rn(
        { x: w.x || 0, y: w.y || 0, width: w.width || 1, height: w.height || 1, rotation: w.rotate?.rotationAngle || 0 },
        s
      );
      return Ni(_.x, _.y);
    };
    if (h && (o.capabilitiesOf?.(h)?.canConnect === !1 || !h.relationships)) return d();
    const u = !!l.targetPoint, { parent: p, child: m, ...g } = l;
    if (e === "target") {
      if (!h)
        return s ? (a.removeAssociation(c), a.addFloatingAssociation(
          { x: Math.round(s.x * 100) / 100, y: Math.round(s.y * 100) / 100 },
          { ...g, childId: u ? l.childId : void 0, targetAnchor: null }
        ), this.reselect(r.id, c)) : d();
      if (h.id === r.id) return d();
      const v = f(h);
      if (!u && h.id === l.childId)
        return a.applyLineProperty(c, "targetAnchor", v), o.broadcast?.("onLinePropertiesChanged", { id: r.id, associationId: c, prop: "targetAnchor", val: v }), d();
      const { targetPoint: w, ..._ } = g;
      return a.removeAssociation(c), a.addAssociation(h, { ..._, childId: h.id, targetAnchor: v }), this.reselect(r.id, c);
    }
    if (!h) {
      if (!s || u) return d();
      const v = o.nodes?.one?.(l.childId);
      return v?.relationships ? (a.removeAssociation(c), v.relationships.addFloatingAssociation(
        { x: Math.round(s.x * 100) / 100, y: Math.round(s.y * 100) / 100 },
        { ..._c(g), parentId: v.id, childId: void 0 }
      ), this.reselect(v.id, c)) : d();
    }
    if (!u && h.id === l.childId) return d();
    const y = f(h);
    if (h.id === r.id)
      return a.applyLineProperty(c, "sourceAnchor", y), o.broadcast?.("onLinePropertiesChanged", { id: r.id, associationId: c, prop: "sourceAnchor", val: y }), d();
    a.removeAssociation(c);
    const b = { ...g, parentId: h.id, sourceAnchor: y };
    if (u) h.relationships.addFloatingAssociation(l.targetPoint, b);
    else {
      const v = o.nodes?.one?.(l.childId);
      if (!v) return;
      h.relationships.addAssociation(v, b);
    }
    this.reselect(h.id, c);
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
    const i = t.connectable, s = (o) => {
      const r = String(o?.options?.text ?? "").replace(/\s+/g, " ").trim();
      return r ? `“${r.length > 40 ? r.slice(0, 39) + "…" : r}”` : "its note";
    };
    for (const o of ["source", "target"]) {
      const a = (o === "source" ? i?.sourceHandle : i?.targetHandle)?.element?.node;
      if (!a) continue;
      const l = this.endState(t.id, o), c = o === "source" ? "Start of the line" : "End of the line", h = s(o === "source" ? t.source : t.target), d = l === "free" ? `${c}: free, on no note` : l === "pinned" ? `${c}: pinned to a spot on ${h}` : `${c}: follows ${h}`, f = l === "free" ? "Drag it onto a note to attach it there." : l === "pinned" ? "Arrow keys move it along the edge; Enter lets it follow the note again. Drag it onto a note's middle to follow, onto empty canvas to leave it free." : "Enter pins it where it is; the arrow keys pin it and move it along the edge. Drag it onto a note's edge to pin it there, or onto empty canvas to leave it free.";
      a.setAttribute("role", "button"), a.setAttribute("tabindex", e ? "0" : "-1"), a.setAttribute("aria-label", d);
      let u = a.querySelector("title");
      u || (u = document.createElementNS("http://www.w3.org/2000/svg", "title"), a.appendChild(u)), u.textContent = `${d}. ${f}`, !a._sbEndKeys && (a._sbEndKeys = !0, a.addEventListener("keydown", (p) => {
        const m = o, g = this.connections.get(t.id);
        if (!g) return;
        const y = p.key, b = this.endState(g.id, m);
        if (y === "Enter" || y === " ") {
          if (b === "free") return;
          this.setEnd(g.id, m, b === "pinned" ? "follow" : "pinned");
        } else if (y.startsWith("Arrow")) {
          if (b === "free") return;
          const v = this.currentAnchor(g.id, m);
          if (!v) return;
          this.setEnd(g.id, m, xc(v, y, p.shiftKey ? ii / 5 : ii));
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
    ), i = () => [t.sourceHandle?.glyph, t.targetHandle?.glyph].filter((r) => r && r.node), s = (r) => {
      [...e(), ...i()].forEach((a) => {
        r ? a.node.classList.add("connector-handle--revealed") : !t._handlesPinned && !t._handlesDragging && a.node.classList.remove("connector-handle--revealed");
      });
    };
    t._revealHandles = s;
    const o = () => e().forEach((r) => {
      r._revealArmed || (r._revealArmed = !0, r.on?.("mouseenter", () => s(!0)), r.on?.("mouseleave", () => s(!1)), r.on?.("dragstart", () => {
        t._handlesDragging = !0, s(!0);
      }), r.on?.("dragend", () => {
        t._handlesDragging = !1, t._handlesPinned || s(!1);
      }));
    });
    [t.hitArea, t.connector].forEach((r) => {
      r?.on?.("mouseenter", () => {
        s(!0), o();
      }), r?.on?.("mouseleave", () => s(!1));
    });
  }
  showLineCog(t, e, i) {
    const s = this.slate;
    s.clearLineCog?.();
    const o = e?.connector;
    let r, a;
    try {
      const v = o.bbox();
      r = v.cx, a = v.cy;
    } catch {
      return;
    }
    const l = s.markersContainer || s.canvas;
    if (!l) return;
    if (s.hostDrawsToolbar?.()) {
      this.selectLineConnectable(e), s.setSelectedLine?.(this.node, t.id, i, e), this.describeHandles(t);
      return;
    }
    const c = 15, h = 6, d = "#5b6472", f = [
      {
        key: "delete",
        color: "#e5484d",
        onClick: () => {
          this.node.relationships?.removeAssociation?.(i), s.clearLineCog?.();
        }
      }
    ];
    typeof s.options?.events?.onLineMenuRequested == "function" && f.push({
      key: "cog",
      color: d,
      onClick: () => this.openLinePane(t, e, i)
    });
    const u = f.length, p = c * 2 + h, m = u * (c * 2) + (u - 1) * h, g = r - m / 2 + c, y = l.group().addClass("line-cog").addClass("line-toolbar");
    y.rect(m + 14, c * 2 + 10).radius((c * 2 + 10) / 2).center(r, a).fill("#ffffff").stroke({ color: "#e3e5ea", width: 1 });
    const b = this.node.constructor;
    f.forEach((v, w) => {
      const _ = g + w * p, x = y.group().addClass(`line-tool-${v.key}`);
      x.circle(c * 2).center(_, a).fill("#ffffff").attr("fill-opacity", 1e-3), b.drawToolIcon?.(x, v.key, _, a, v.color), x.attr("pointer-events", "all");
      try {
        x.node.style.cursor = "pointer";
      } catch {
      }
      x.on("mousedown", (S) => S.stopPropagation?.()), x.on("click", (S) => {
        S.stopPropagation?.(), v.onClick();
      });
    }), y.attr("pointer-events", "all"), s._activeLineCog = y, this.selectLineConnectable(e), s.setSelectedLine?.(this.node, t.id, i, e), this.describeHandles(t);
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
  isEnabled() {
    return this.isActive;
  }
  updateOptions(t) {
    this.options = { ...this.options, ...t }, console.log("CONNECTOR_DEBUG: Updated options for node", this.node.id);
  }
}
function as(n, t, e) {
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
class ch {
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
    const i = as(this.node.id, t.id, e), s = this.node.slate;
    return s?.capabilitiesOf?.(this.node).canConnect === !1 || s?.capabilitiesOf?.(t).canConnect === !1 || (e?.id || (i.id = this.unusedId(i.id)), this.assocMap.set(i.id, i), this.renderAssociation(i, t), this.node.slate?.broadcast?.("addRelationship", { ...i }), console.log(
      "RELATIONSHIP_DEBUG: Added association",
      i.id,
      "from",
      this.node.id,
      "to",
      t.id
    )), i;
  }
  /**
   * Remove a specific association by child node ID.
   */
  removeAssociation(t) {
    const e = this.assocMap.get(t), i = e ? [e] : Array.from(this.assocMap.values()).filter(
      (s) => s.childId === t
    );
    if (i.length === 0)
      return console.warn(
        "RELATIONSHIP_DEBUG: Association not found:",
        t
      ), !1;
    for (const s of i)
      this.node.connector && this.node.connector.disconnectById(s.id), this.assocMap.delete(s.id), console.log("RELATIONSHIP_DEBUG: Removed association", s.id), this.node.slate?.broadcast?.("removeRelationship", {
        parentId: this.node.id,
        childId: s.childId,
        id: s.id
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
    const o = s.id;
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
      Object.assign(i, t), this.node.connector && this.node.connector.updateConnection(i.id, {
        lineColor: i.lineColor,
        lineWidth: i.lineWidth,
        lineOpacity: i.lineOpacity,
        lineEffect: i.lineEffect,
        lineDash: i.lineDash
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
        const s = `${this.node.id}->${e.childId}`;
        this.node.connector.updateConnection(s, {
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
    const e = this.slate?.nodes?.allNodes || [], i = (o) => this.assocMap.has(o) || e.some((r) => r && r !== this.node && r.relationships !== this && r.relationships?.hasAssociationId?.(o));
    if (!i(t)) return t;
    let s = 2;
    for (; i(`${t}~${s}`); ) s++;
    return `${t}~${s}`;
  }
  renderAssociation(t, e) {
    if (!this.node.connector) return;
    this.node.connector.isEnabled() || this.node.connector.enable();
    const i = {
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
        i
      );
      return;
    }
    e && this.node.connector.connectTo(e, i);
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
    const i = e?.childId || `__free_${Math.random().toString(36).slice(2, 10)}`, s = as(this.node.id, i, {
      ...e,
      parentId: this.node.id,
      childId: i,
      targetPoint: t,
      // A free end is on no note, so it is not pinned to one.
      targetAnchor: null
    });
    return e?.id || (s.id = this.unusedId(s.id)), this.assocMap.set(s.id, s), this.renderAssociation(s, null), this.node.slate?.broadcast?.("addRelationship", { ...s }), s;
  }
}
class hh {
  constructor(t) {
    this.patternElement = null, this.imageUrl = "", this.origWidth = 0, this.origHeight = 0, this.preserveAspectRatio = !0, this.node = t;
  }
  /**
   * Set an image fill on the node's background.
   *
   * Uses SVG pattern fills for proper scaling within the shape.
   */
  set(t, e, i, s = !0) {
    this.imageUrl = t, this.origWidth = e || this.node.options.width || 100, this.origHeight = i || this.node.options.height || 60, this.preserveAspectRatio = this.node.options.imageFit === "cover" ? !1 : s, this.node.options.image = t, this.node.options.imageOrigWidth = this.origWidth, this.node.options.imageOrigHeight = this.origHeight, this.render();
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
        const e = this.origWidth || this.node.options.width || 100, i = this.origHeight || this.node.options.height || 60, s = this.node.svgGroup.root();
        if (!s) return;
        let o = s.defs();
        this.patternElement = o.pattern(e, i, (r) => {
          r.image(this.imageUrl).size(e, i).attr("preserveAspectRatio", this.preserveAspectRatio ? "xMidYMid meet" : "xMidYMid slice");
        }).attr("patternUnits", "objectBoundingBox").attr("viewBox", `0 0 ${e} ${i}`).attr("preserveAspectRatio", this.preserveAspectRatio ? "xMidYMid meet" : "xMidYMid slice").attr("width", "100%").attr("height", "100%"), t.fill(this.patternElement), console.log(
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
const $ = {}, dh = () => $.lineTool ?? null, uh = async () => $.lineTool ?? ($.lineTool = await import("./canvas-LineTool-DiWO1YD6.mjs")), fh = () => $.birdsEye ?? null, ph = async () => $.birdsEye ?? ($.birdsEye = await import("./canvas-BirdsEye-G2WYD4MH.mjs")), mh = () => $.undoRedo ?? null, gh = async () => $.undoRedo ?? ($.undoRedo = await import("./canvas-UndoRedo-VHoS1qqT.mjs")), yh = () => $.mediaInput ?? null, bh = async () => $.mediaInput ?? ($.mediaInput = await import("./canvas-MediaInput-8st8IJ3Z.mjs")), vh = () => $.contextMenu ?? null, wh = async () => $.contextMenu ?? ($.contextMenu = await import("./canvas-ContextMenu-CEvygDTT.mjs")), xh = () => $.keyboard ?? null, _h = async () => $.keyboard ?? ($.keyboard = await import("./canvas-Keyboard-CQwsARZ5.mjs")), Ch = () => $.presentation ?? null, Eh = async () => $.presentation ?? ($.presentation = await import("./canvas-Presentation-ydUBNUZh.mjs")), Sh = () => $.mediaNote ?? null, Ah = async () => $.mediaNote ?? ($.mediaNote = await import("./canvas-MediaNote-afRCQoQe.mjs")), qe = /* @__PURE__ */ new Set(), Qt = /* @__PURE__ */ new Map(), Mh = /* @__PURE__ */ new Set([
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
function Th(n) {
  const t = typeof document < "u" ? document.fonts : null;
  if (!t || typeof t.forEach != "function" || typeof t.load != "function") return !1;
  const e = n.toLowerCase();
  let i = !1;
  try {
    t.forEach((s) => {
      String(s?.family ?? "").replace(/['"]/g, "").trim().toLowerCase() === e && (i = !0);
    });
  } catch {
    return !1;
  }
  return i;
}
function Yo(n) {
  const t = n.trim(), e = t.toLowerCase();
  if (Mh.has(e) || qe.has(e))
    return Promise.resolve();
  if (Qt.has(e))
    return Qt.get(e);
  const i = new Promise((s, o) => {
    if (typeof document > "u") {
      s();
      return;
    }
    const r = t.split(",")[0].trim().replace(/['"]/g, "");
    try {
      if (document.fonts?.check?.(`12px "${r}"`)) {
        qe.add(e), s();
        return;
      }
    } catch {
    }
    if (Th(r)) {
      Promise.resolve(document.fonts.load(`12px "${r}"`)).catch(() => {
      }).then(() => {
        qe.add(e), Qt.delete(e), s();
      });
      return;
    }
    const a = document.createElement("link");
    a.rel = "stylesheet", a.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      r
    )}:wght@300;400;500;600;700&display=swap`, a.onload = () => {
      qe.add(e), Qt.delete(e), console.log("FONT_DEBUG: Loaded font:", r), s();
    }, a.onerror = () => {
      Qt.delete(e), console.warn("FONT_DEBUG: Failed to load font:", r), s();
    }, document.head.appendChild(a);
  });
  return Qt.set(e, i), i;
}
async function Rh(n) {
  const t = /* @__PURE__ */ new Set(), e = n.nodes?.allNodes || [];
  for (const s of e)
    s.options?.fontFamily && t.add(s.options.fontFamily);
  const i = Array.from(t).map((s) => Yo(s));
  await Promise.all(i), console.log("FONT_DEBUG: All fonts loaded:", Array.from(t));
}
function kh(n) {
  const t = n.textXAlign === "left" ? "left" : n.textXAlign === "right" ? "right" : "center", e = n.textYAlign === "top" ? "flex-start" : n.textYAlign === "bottom" ? "flex-end" : "center";
  return [
    "display:flex",
    `justify-content:${t === "left" ? "flex-start" : t === "right" ? "flex-end" : "center"}`,
    `align-items:${e}`,
    `text-align:${t}`
  ];
}
class Nh {
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
      const i = window.getSelection();
      if (i && i.rangeCount && t.contains(i.anchorNode)) {
        const s = i.getRangeAt(0), o = s.cloneRange();
        o.selectNodeContents(t), o.setEnd(s.startContainer, s.startOffset);
        const r = o.toString().length;
        e = { start: r, end: r + s.toString().length };
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
    const i = e.svgGroup?.node;
    if (!i) return !1;
    const s = t.returnFocus ?? document.activeElement === i, o = e.options.width || 100, r = e.options.height || 60, l = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "foreignObject"
    );
    l.setAttribute("x", "0"), l.setAttribute("y", "0"), l.setAttribute("width", String(o)), l.setAttribute("height", String(r)), l.style.overflow = "visible";
    const c = document.createElement("div");
    c.setAttribute("contenteditable", "true"), c.className = "sb-inline-editor", c.textContent = t.text ?? (e.options.text || "") + (t.insert ?? ""), c.style.cssText = [
      `width:${o}px`,
      `height:${r}px`,
      "box-sizing:border-box",
      // The box sits where the note draws its text, so typing never jumps to the centre.
      ...kh(e.options),
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
    ].join(";"), l.appendChild(c), i.appendChild(l), this._inlineFO = l, this._inlineDiv = c, this._returnFocus = s, this._inlineEditing = !0, e.textElement?.hide?.();
    const h = (u, p = !1) => {
      if (!this._inlineEditing) return;
      this._inlineEditing = !1;
      const m = (c.innerText || "").replace(/\n+$/, ""), g = p && s && document.activeElement === c;
      try {
        l.remove();
      } catch {
      }
      if (this._inlineFO = null, this._inlineDiv = null, e.textElement?.show?.(), g)
        try {
          i.focus({ preventScroll: !0 });
        } catch {
        }
      const y = e.slate?.governanceOf?.(e);
      if (y) {
        const b = e.options.text || "";
        if (!u || m === b) return;
        let v;
        try {
          v = y.policy.onTextCommit?.(e, m, b);
        } catch (_) {
          console.warn("DRAG_POLICY: onTextCommit threw; keeping the old text", _), v = !1;
        }
        if (v === !1) return;
        const w = typeof v == "string" ? v : m;
        (e.options.text || "") !== w && e.setText?.(w);
        return;
      }
      if (u && m !== (e.options.text || "")) {
        const b = {
          type: "onNodeTextChanged",
          data: { id: e.id, text: m }
        }, v = e.slate, w = v?.collab;
        w?.invoke ? (w.invoke(b), typeof v.broadcast == "function" ? v.broadcast("onNodeTextChanged", b.data) : w.send?.(b)) : e.setText?.(m), v?.offerFreeTextCommit?.(e);
      }
    }, d = new Set(t.heldKey ? [t.heldKey] : []);
    c.addEventListener("keydown", (u) => {
      if (u.stopPropagation(), u.repeat && !d.has(u.key)) {
        u.preventDefault();
        return;
      }
      d.add(u.key), u.key === "Enter" && !u.shiftKey ? (u.preventDefault(), h(!0, !0)) : u.key === "Escape" && (u.preventDefault(), h(!1, !0));
    }), c.addEventListener("keyup", (u) => d.delete(u.key)), c.addEventListener("blur", () => h(!0));
    for (const u of ["pointerdown", "mousedown", "touchstart"])
      c.addEventListener(u, (p) => p.stopPropagation());
    const f = () => {
      try {
        if (!c.isConnected) return;
        c.focus(t.preventScroll ? { preventScroll: !0 } : void 0);
        const u = document.createRange();
        u.selectNodeContents(c);
        const p = c.firstChild;
        if (t.selection && p && p.nodeType === 3) {
          const g = (p.textContent || "").length;
          u.setStart(p, Math.min(t.selection.start, g)), u.setEnd(p, Math.min(Math.max(t.selection.end, t.selection.start), g));
        } else (t.selection || t.caret === "end") && u.collapse(!1);
        const m = window.getSelection();
        m?.removeAllRanges(), m?.addRange(u);
      } catch {
      }
    };
    return f(), setTimeout(() => {
      this._inlineEditing && this._inlineFO === l && document.activeElement !== c && f();
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
  async set(t, e, i, s, o, r, a) {
    t !== void 0 && (this.node.options.text = t), e !== void 0 && (this.node.options.fontSize = e), s !== void 0 && (this.node.options.fontColor = s), o !== void 0 && (this.node.options.textOpacity = o), r !== void 0 && (this.node.options.textXAlign = r), a !== void 0 && (this.node.options.textYAlign = a), i !== void 0 && i !== this.node.options.fontFamily && (this.node.options.fontFamily = i, await Yo(i)), this.applyText();
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
    }), this.node.textElement.attr?.("font-weight", this.node.options.fontWeight === "bold" ? "bold" : null), typeof this.node.centerText == "function" && this.node.centerText(), this.node.slate?.options?.autoResizeNodesBasedOnText && this.autoResize();
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
class Ph {
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
function Dh(n, t, e = !1, i = !1) {
  if (!t) return;
  t._id && (n.options.themeId = t._id), e && (n.options.syncWithTheme = !0), t.containerStyle && Object.keys(t.containerStyle).length > 0 && (n.options.containerStyle = { ...t.containerStyle }, n.applyContainerStyle?.()), t.defaultLineColor && (n.options.defaultLineColor = t.defaultLineColor, (n.freeNodes?.() ?? n.nodes?.allNodes)?.forEach((r) => {
    r.relationships?.updateAssociationsWith?.({
      lineColor: t.defaultLineColor
    });
  }));
  const s = n.freeNodes?.() ?? n.nodes.allNodes;
  if (!s || s.length === 0 || !t.styles) return;
  const o = Oh(n, s);
  s.forEach((r, a) => {
    const l = o ? o.get(r.options.id) ?? 0 : a, c = Ih(t, l);
    c && Lh(r, c);
  }), console.log("THEME_DEBUG: Applied theme", t.name || t._id);
}
function Oh(n, t) {
  if (!n?.options?.mindMapMode) return null;
  const e = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Map();
  let s = !1;
  for (const a of t) {
    const l = a.relationships?.assocMap, c = l ? Array.from(l.values()).map((h) => h.childId || h.child?.id).filter(Boolean) : [];
    c.length && (s = !0), i.set(a.options.id, c), c.forEach((h) => e.add(h));
  }
  if (!s) return null;
  const o = /* @__PURE__ */ new Map(), r = [];
  for (const a of t)
    e.has(a.options.id) || r.push([a.options.id, 0]);
  for (; r.length; ) {
    const [a, l] = r.shift();
    if (!o.has(a)) {
      o.set(a, l);
      for (const c of i.get(a) || []) r.push([c, l + 1]);
    }
  }
  for (const a of t)
    o.has(a.options.id) || o.set(a.options.id, 0);
  return o;
}
function Ih(n, t) {
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
function Lh(n, t) {
  const e = t, i = t.backgroundColor ?? e.nodeColor, s = t.fontColor ?? e.foregroundColor, o = [
    "opacity",
    "borderOpacity",
    "borderColor",
    "borderStyle",
    "borderWidth",
    "fontFamily",
    "fontSize",
    "fontStyle",
    "textOpacity",
    "lineColor",
    "lineOpacity",
    "lineEffect",
    "lineWidth"
  ];
  for (const l of o)
    Object.prototype.hasOwnProperty.call(t, l) && (n.options[l] = t[l]);
  if (i && (n.options.backgroundColor = i), s && (n.options.fontColor = s), !!(t.vectorPath || t.shape)) {
    n.filters?.removeAll?.(), n.images?.clear?.();
    const l = !!t.vectorPath && /^[Mm]/.test(String(t.vectorPath).trim()) && (!!t.fillRule || t.textBox !== void 0), c = t.shape || (l ? "custom" : t.vectorPath);
    c === "custom" && (t.fillRule && (n.options.fillRule = t.fillRule), t.textBox !== void 0 && (n.options.textBox = t.textBox)), n.setShape?.(c, t.vectorPath);
  }
  n.setColors?.(i, t.borderColor), n.applyBorder?.(), n.applyOpacity?.(), (s || t.fontSize !== void 0 || t.fontFamily || t.textOpacity !== void 0 || t.fontStyle) && n.applyTextStyle?.(), Object.prototype.hasOwnProperty.call(t, "image") && (t.image ? n.images?.set?.(t.image) : n.images?.clear?.()), t.filters && (n.filters?.removeAll?.(), n.options.filters = {}, t.filters.vect && n.filters?.apply?.(t.filters.vect, "vect"), t.filters.text && n.filters?.apply?.(t.filters.text, "text"));
  const a = {};
  for (const l of [
    "lineColor",
    "lineOpacity",
    "lineEffect",
    "lineWidth"
  ])
    Object.prototype.hasOwnProperty.call(t, l) && (a[l] = t[l]);
  Object.keys(a).length && n.relationships?.updateAssociationsWith?.(a);
}
const _e = 2 * Math.PI;
function ot(n, t) {
  return { x: n, y: t };
}
function wt(n, t, e) {
  return ot(n.x + (t.x - n.x) * e, n.y + (t.y - n.y) * e);
}
function Ce(n, t, e, i) {
  return { kind: "cubic", start: n, first: t, second: e, end: i };
}
function ve(n, t) {
  return Ce(n, n, t, t);
}
function zh(n, t, e, i, s, o, r) {
  if (e = Math.abs(e), i = Math.abs(i), !e || !i || n.x === t.x && n.y === t.y) return ve(n, t);
  const a = s * Math.PI / 180, l = Math.cos(a), c = Math.sin(a), h = (n.x - t.x) / 2, d = (n.y - t.y) / 2;
  let f = (l * h + c * d) / e, u = (-c * h + l * d) / i;
  const p = Math.max(1, Math.hypot(f, u));
  e *= p, i *= p, f /= p, u /= p;
  const m = f * f + u * u, g = (o === r ? -1 : 1) * Math.sqrt(Math.max(0, (1 - m) / m)), y = g * u, b = -g * f, v = ot(e * l, e * c), w = ot(-i * c, i * l), _ = ot(
    (n.x + t.x) / 2 + y * v.x + b * w.x,
    (n.y + t.y) / 2 + y * v.y + b * w.y
  ), x = Math.atan2(u - b, f - y);
  let S = Math.atan2(-u - b, -f - y) - x;
  return r && S < 0 && (S += _e), !r && S > 0 && (S -= _e), { kind: "arc", start: n, end: t, center: _, axisX: v, axisY: w, angle: x, sweep: S };
}
function $o(n) {
  const t = [];
  let e = ot(0, 0), i = e, s, o;
  for (const r of new Gt(n)) {
    const a = r[0], l = r.slice(1), c = (f) => ot(l[f], l[f + 1]);
    let h, d;
    switch (a) {
      case "M":
        i = c(0), h = { kind: "move", end: i };
        break;
      case "H":
        h = ve(e, ot(l[0], e.y));
        break;
      case "V":
        h = ve(e, ot(e.x, l[0]));
        break;
      case "L":
        h = ve(e, c(0));
        break;
      case "Z":
        h = ve(e, i);
        break;
      case "C":
        h = Ce(e, c(0), c(2), c(4));
        break;
      case "S":
        h = Ce(e, s ? wt(s, e, 2) : e, c(0), c(2));
        break;
      case "Q":
      case "T": {
        const f = c(a === "Q" ? 2 : 0);
        d = a === "Q" ? c(0) : o ? wt(o, e, 2) : e, h = Ce(e, wt(e, d, 2 / 3), wt(f, d, 2 / 3), f);
        break;
      }
      case "A":
        h = zh(e, c(5), l[0], l[1], l[2], l[3], l[4]);
        break;
      default:
        continue;
    }
    t.push(h), s = a === "C" || a === "S" ? h.second : void 0, o = d, e = h.end;
  }
  return t;
}
function Xo(n, t) {
  return ot(
    n.center.x + n.axisX.x * Math.cos(t) + n.axisY.x * Math.sin(t),
    n.center.y + n.axisX.y * Math.cos(t) + n.axisY.y * Math.sin(t)
  );
}
function ls(n, t) {
  return ot(
    -n.axisX.x * Math.sin(t) + n.axisY.x * Math.cos(t),
    -n.axisX.y * Math.sin(t) + n.axisY.y * Math.cos(t)
  );
}
function Gh(n, t, e, i) {
  const s = -n + 3 * t - 3 * e + i, o = 2 * (n - 2 * t + e), r = t - n;
  if (Math.abs(s) < Number.EPSILON * Math.max(1, Math.abs(o), Math.abs(r))) return o ? [-r / o] : [];
  const a = o * o - 4 * s * r;
  if (a < 0) return [];
  const l = Math.sqrt(a);
  return [(-o - l) / (2 * s), (-o + l) / (2 * s)];
}
function Bh(n, t) {
  const e = wt(n.start, n.first, t), i = wt(n.first, n.second, t), s = wt(n.second, n.end, t);
  return wt(wt(e, i, t), wt(i, s, t), t);
}
function Wo(n) {
  let t = 1 / 0, e = 1 / 0, i = -1 / 0, s = -1 / 0;
  function o(r) {
    t = Math.min(t, r.x), i = Math.max(i, r.x), e = Math.min(e, r.y), s = Math.max(s, r.y);
  }
  n.length || o(ot(0, 0));
  for (const r of n)
    if (o(r.end), r.kind !== "move") {
      o(r.start);
      for (const a of ["x", "y"])
        if (r.kind === "cubic")
          for (const l of Gh(r.start[a], r.first[a], r.second[a], r.end[a]))
            l > 0 && l < 1 && o(Bh(r, l));
        else {
          const l = Math.atan2(r.axisY[a], r.axisX[a]);
          for (const c of [l, l + Math.PI])
            (Math.sign(r.sweep) * (c - r.angle) % _e + _e) % _e <= Math.abs(r.sweep) && o(Xo(r, c));
        }
    }
  return { x: t, y: e, x2: i, y2: s, width: i - t, height: s - e, cx: (t + i) / 2, cy: (e + s) / 2 };
}
function qo(n) {
  return Wo($o(n));
}
function Hh(n, t) {
  const e = new P();
  for (const [, i, s] of n.matchAll(/([trsm])([^trsm]*)/gi)) {
    const o = (s.match(/[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/gi) || []).map(Number), [r, a, l, c, h, d] = o;
    let f = new P();
    switch (i.toLowerCase()) {
      case "t":
        o.length === 2 && (f = f.translate(r, a));
        break;
      case "m":
        o.length === 6 && (f = new P(r, a, l, c, h, d));
        break;
      case "r":
        o.length === 1 && (f = f.rotate(r, t.x, t.y)), o.length === 3 && (f = f.rotate(r, a, l));
        break;
      case "s":
        (o.length === 1 || o.length === 2) && (f = f.scale(r, a ?? r, t.x, t.y)), o.length === 3 && (f = f.scale(r, r, a, l)), o.length === 4 && (f = f.scale(r, a, l, c));
        break;
    }
    e.multiplyO(f);
  }
  return e;
}
function Fh(n) {
  const t = Math.max(1, Math.ceil(Math.abs(n.sweep) / (Math.PI / 4))), e = n.sweep / t, i = 4 / 3 * Math.tan(e / 4);
  let s = n.start;
  return Array.from({ length: t }, (o, r) => {
    const a = n.angle + r * e, l = a + e, c = r === t - 1 ? n.end : Xo(n, l), h = ls(n, a), d = ls(n, l), f = Ce(
      s,
      ot(s.x + i * h.x, s.y + i * h.y),
      ot(c.x - i * d.x, c.y - i * d.y),
      c
    );
    return s = c, f;
  });
}
function Uh(n, t) {
  const e = $o(n), i = Wo(e), s = Hh(t, ot(i.cx, i.cy)), o = (r) => new W(r.x, r.y).transform(s).toArray().join(",");
  return e.map((r) => r.kind === "move" ? "M" + o(r.end) : (r.kind === "arc" ? Fh(r) : [r]).map((l) => "C" + [l.first, l.second, l.end].map(o).join(",")).join("")).join("");
}
function Yh(n = 10) {
  const t = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let e = "";
  for (let i = 0; i < n; i++)
    e += t.charAt(Math.floor(Math.random() * t.length));
  return e;
}
function Zo(n) {
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
function $h(n, t) {
  const e = (o) => {
    const r = (o || "").replace("#", "");
    if (r.length < 6) return 0;
    const a = (d) => {
      const f = d / 255;
      return f <= 0.03928 ? f / 12.92 : Math.pow((f + 0.055) / 1.055, 2.4);
    }, l = a(parseInt(r.substr(0, 2), 16) || 0), c = a(parseInt(r.substr(2, 2), 16) || 0), h = a(parseInt(r.substr(4, 2), 16) || 0);
    return 0.2126 * l + 0.7152 * c + 0.0722 * h;
  }, i = e(n), s = e(t);
  return (Math.max(i, s) + 0.05) / (Math.min(i, s) + 0.05);
}
const Ut = "0.6s cubic-bezier(0.4, 0, 0.2, 1) both", _n = {
  mystery: {
    id: "sb-mystery",
    types: ["text", "vect"],
    display: "Mystery",
    description: "Gentle fade in with a subtle zoom",
    css: `.sb-animation-mystery{animation:sb-mystery ${Ut}}@keyframes sb-mystery{0%{opacity:0;transform:scale(1.2)}50%{opacity:.5;transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}`
  },
  fadeSlideUp: {
    id: "sb-fade-slide-up",
    types: ["text", "vect"],
    display: "Fade up",
    description: "Smooth upward entrance",
    css: `.sb-animation-fadeSlideUp{animation:sb-fade-slide-up ${Ut}}@keyframes sb-fade-slide-up{0%{opacity:0;transform:translateY(100%) rotateX(40deg)}100%{opacity:1;transform:translateY(0) rotateX(0)}}`
  },
  fadeSlideDown: {
    id: "sb-fade-slide-down",
    types: ["text", "vect"],
    display: "Fade down",
    description: "Smooth downward entrance",
    css: `.sb-animation-fadeSlideDown{animation:sb-fade-slide-down ${Ut}}@keyframes sb-fade-slide-down{0%{opacity:0;transform:translateY(-100%) rotateX(-40deg)}100%{opacity:1;transform:translateY(0) rotateX(0)}}`
  },
  bumpUpIn: {
    id: "sb-bump-up-in",
    types: ["text", "vect"],
    display: "Bump up",
    description: "Playful bounce from below",
    css: `.sb-animation-bumpUpIn{animation:sb-bump-up-in ${Ut}}@keyframes sb-bump-up-in{0%{opacity:0;transform:scale(.8) rotate(-3deg) translateY(100%)}55%{opacity:.8;transform:scale(1.1) rotate(2deg) translateY(-20%)}100%{opacity:1;transform:scale(1) translateY(0)}}`
  },
  bumpDownIn: {
    id: "sb-bump-down-in",
    types: ["text", "vect"],
    display: "Bump down",
    description: "Playful bounce from above",
    css: `.sb-animation-bumpDownIn{animation:sb-bump-down-in ${Ut}}@keyframes sb-bump-down-in{0%{opacity:0;transform:scale(.8) rotate(3deg) translateY(-100%)}55%{opacity:.8;transform:scale(1.1) rotate(-2deg) translateY(20%)}100%{opacity:1;transform:scale(1) translateY(0)}}`
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
    css: `.sb-animation-smoke{animation:sb-smoke ${Ut}}@keyframes sb-smoke{0%{opacity:0;transform:scale(1.5) rotate(5deg);filter:blur(10px)}55%{opacity:.75;transform:scale(1.1) rotate(-2deg);filter:blur(3px)}100%{opacity:1;transform:scale(1);filter:blur(0)}}`
  },
  fractured: {
    id: "sb-fractured",
    types: ["text", "vect"],
    display: "Fractured",
    description: "Sharp geometric reveal",
    css: `.sb-animation-fractured{animation:sb-fractured ${Ut}}@keyframes sb-fractured{0%{opacity:0;clip-path:polygon(50% 50%,50% 50%,50% 50%);transform:rotate(45deg) scale(.3)}55%{opacity:.7;clip-path:polygon(10% 0,90% 0,100% 100%,0 100%);transform:rotate(-8deg) scale(1.1)}100%{opacity:1;clip-path:polygon(0 0,100% 0,100% 100%,0 100%);transform:rotate(0) scale(1)}}`
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
}, Xh = ".sb-node-animation{transform-box:fill-box;transform-origin:center}", Li = "data-sb-animation-host", Wh = "http://www.w3.org/2000/svg";
function qh(n, t) {
  return t.css + `svg.${Gi(n)}{animation:none}`;
}
function Vo(n) {
  return !!n && n.tagName?.toLowerCase() === "svg" && !!n.ownerSVGElement;
}
function zi(n) {
  const e = (n?.node ?? n)?.parentNode;
  return e && e.nodeType === 1 && e.hasAttribute?.(Li) ? e : null;
}
function Zh(n) {
  const t = zi(n);
  if (t) return t;
  const e = n.ownerDocument.createElementNS(Wh, "g");
  return e.setAttribute(Li, "1"), n.parentNode.insertBefore(e, n), e.appendChild(n), e;
}
function Vh(n) {
  const t = zi(n);
  !t || !t.parentNode || (t.parentNode.insertBefore(n, t), t.remove());
}
function jh(n) {
  const t = zi(n);
  n?.remove?.(), t?.remove();
}
function Kh(n) {
  if (!n || typeof n.getScreenCTM != "function") return null;
  const t = n.getScreenCTM();
  if (!t) return null;
  try {
    let e = n;
    for (; e && e.nodeType === 1; ) {
      if (e.hasAttribute?.(Li)) {
        const i = e, s = i.getScreenCTM(), o = i.parentNode?.getScreenCTM?.();
        return !s || !o ? t : o.multiply(s.inverse()).multiply(t);
      }
      if (e.tagName?.toLowerCase() === "svg" && !e.ownerSVGElement) break;
      e = e.parentNode;
    }
    if (n.classList?.contains("sb-node-animation") && !Vo(n)) {
      const i = n.parentNode?.getScreenCTM?.();
      if (!i) return t;
      const s = n.transform?.baseVal?.consolidate?.()?.matrix;
      return s ? i.multiply(DOMMatrix.fromMatrix(s)) : i;
    }
  } catch {
  }
  return t;
}
function Qh() {
  return { ..._n };
}
function Gi(n) {
  return `sb-animation-${n}`;
}
function Jh(n) {
  const e = n?.root?.()?.defs?.();
  if (!e || e.findOne?.("#sb-node-animation-styles")) return;
  const i = e.element("style").id("sb-node-animation-styles");
  i.attr("type", "text/css"), i.node.textContent = Xh + Object.entries(_n).map(([s, o]) => qh(s, o)).join("");
}
function td(n, t) {
  if (!n || !_n[t]) return !1;
  Jh(n), jo(n);
  const e = n.node;
  if (e) {
    const i = ["sb-node-animation", Gi(t)];
    if (Vo(e) && e.parentNode) {
      const s = Zh(e);
      s.getBBox?.(), s.classList.add(...i);
    } else
      e.getBBox?.();
    e.classList.add(...i);
  }
  return !0;
}
function jo(n) {
  const t = n?.node;
  if (t) {
    for (const e of Object.keys(_n)) t.classList.remove(Gi(e));
    t.classList.remove("sb-node-animation"), Vh(t);
  }
}
const xt = /* @__PURE__ */ new Map();
xt.set("dropShadow", {
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
xt.set("blur", {
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
xt.set("outline", {
  name: "outline",
  types: ["text", "vect"],
  apply: (n) => {
    try {
      const t = n.attr("stroke"), e = n.attr("stroke-width");
      n.data("original-stroke", t || "#333"), n.data("original-stroke-width", e || 2);
      const i = n.attr("fill"), s = typeof i == "string" && /^#[0-9a-fA-F]{3,6}$/.test(i) ? Zo(i) : "#ffffff";
      n.stroke({ color: s, width: 3 }), n.type === "text" && n.attr("paint-order", "stroke");
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
xt.set("postItNote", {
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
xt.set("pencil", {
  name: "pencil",
  types: ["text", "vect", "image"],
  apply: (n) => {
    try {
      const e = n.root?.()?.defs?.();
      if (e && !e.findOne?.("#sb-pencil-filter")) {
        const i = e.element("filter").id("sb-pencil-filter");
        i.attr({
          x: "-10%",
          y: "-10%",
          width: "120%",
          height: "120%"
        }), i.node.innerHTML = '<feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="1" result="noise"/><feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="3" in="SourceGraphic" in2="noise"/>';
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
class ed {
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
    const i = xt.get(t);
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
    const e = xt.get(t);
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
    const i = e === "text" ? this.node.textElement : this.node.backgroundRect;
    return td(i, t) ? (this.node.options.animations || (this.node.options.animations = {}), this.node.options.animations[e] = t, !0) : !1;
  }
  /** Clear the animation from a node element without affecting filter effects. */
  removeAnimation(t) {
    const e = t === "text" ? this.node.textElement : this.node.backgroundRect;
    jo(e), this.node.options.animations && (this.node.options.animations[t] = void 0);
  }
  /**
   * Toggle filter visibility (hide/show without removing).
   */
  toggleVisibility(t) {
    if (this.hidden = t, t)
      for (const e of this.activeFilters) {
        const i = xt.get(e);
        i && (this.node.backgroundRect && i.remove(this.node.backgroundRect), this.node.textElement && i.remove(this.node.textElement));
      }
    else
      for (const e of this.activeFilters) {
        const i = xt.get(e);
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
function nd() {
  const n = {};
  for (const [t, e] of xt)
    n[t] = { types: e.types || ["text", "vect"] };
  return n;
}
class id {
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
const et = /* @__PURE__ */ new Map();
et.set("rectangle", {
  path: "M 0 0 H 100 V 60 H 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
et.set("roundedrectangle", {
  path: "M 10 0 H 90 Q 100 0 100 10 V 50 Q 100 60 90 60 H 10 Q 0 60 0 50 V 10 Q 0 0 10 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  hasRounding: !0,
  viewBox: "0 0 100 60"
});
et.set("ellipse", {
  path: "M 50 0 A 50 30 0 1 1 50 60 A 50 30 0 1 1 50 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
et.set("circle", {
  path: "M 50 0 A 50 50 0 1 1 50 100 A 50 50 0 1 1 50 0 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
et.set("star", {
  path: "M 50 0 L 61.8 38.2 L 100 38.2 L 69.1 61.8 L 80.9 100 L 50 76.4 L 19.1 100 L 30.9 61.8 L 0 38.2 L 38.2 38.2 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
et.set("triangle", {
  path: "M 50 0 L 100 87 L 0 87 Z",
  defaultWidth: 100,
  defaultHeight: 87,
  viewBox: "0 0 100 87"
});
et.set("pentagon", {
  path: "M 50 0 L 97.6 34.5 L 79.4 90.5 L 20.6 90.5 L 2.4 34.5 Z",
  defaultWidth: 100,
  defaultHeight: 95,
  viewBox: "0 0 100 95"
});
et.set("hexagon", {
  path: "M 25 0 L 75 0 L 100 43.3 L 75 86.6 L 25 86.6 L 0 43.3 Z",
  defaultWidth: 100,
  defaultHeight: 87,
  viewBox: "0 0 100 87"
});
et.set("octagon", {
  path: "M 29.3 0 L 70.7 0 L 100 29.3 L 100 70.7 L 70.7 100 L 29.3 100 L 0 70.7 L 0 29.3 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
et.set("trapezium", {
  path: "M 20 0 L 80 0 L 100 60 L 0 60 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
et.set("parallelogram", {
  path: "M 20 0 L 100 0 L 80 60 L 0 60 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
et.set("rarrow", {
  path: "M 0 15 L 70 15 L 70 0 L 100 30 L 70 60 L 70 45 L 0 45 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
et.set("larrow", {
  path: "M 100 15 L 30 15 L 30 0 L 0 30 L 30 60 L 30 45 L 100 45 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
et.set("diamond", {
  path: "M 50 0 L 100 50 L 50 100 L 0 50 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
et.set("stickynote", {
  path: "M1 1l18 0.1l-0.1 17.8s-15.5 0.4-17.6-1c-0.4-2.1-0.3-16.9-0.3-16.9z",
  defaultWidth: 108,
  defaultHeight: 108,
  viewBox: "1 1 18 18"
});
function cs(n) {
  return et.get(n.toLowerCase());
}
function hs(n, t) {
  if (t) {
    const e = cs(t);
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
    const e = cs(n);
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
const sd = (n) => typeof n == "string" && /^\s*[Mm]/.test(n);
function ri(n) {
  if (!sd(n)) return !1;
  try {
    const t = qo(n);
    if (![t.x, t.y, t.width, t.height].every(Number.isFinite)) return !1;
    const e = Math.max(t.width, t.height, 1);
    return Math.abs(t.x) > e || Math.abs(t.y) > e;
  } catch {
    return !1;
  }
}
function ds(n) {
  if (!ri(n)) return n;
  try {
    const t = qo(n);
    return Uh(n, `T${-t.x},${-t.y}`) || n;
  } catch {
    return n;
  }
}
function us(n) {
  return n && (ri(n.vectorPath) && (n.vectorPath = ds(n.vectorPath)), ri(n.shape) && (n.shape = ds(n.shape)), n);
}
const Z = Object.freeze({
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
}), cn = {
  empty: "The shape has no path.",
  bad_character: "The shape path may hold only path commands and plain numbers.",
  bad_syntax: "The shape path could not be read.",
  too_long: `The shape path is too long (at most ${Z.maxInput} characters).`,
  too_many_segments: `The shape has too many segments (at most ${Z.maxSegments}).`,
  too_many_parts: `The shape has too many parts (at most ${Z.maxParts}).`,
  bad_number: `The shape path has a number out of range (at most ${Z.maxMagnitude} either way).`,
  not_closed: "Every part of the shape must be closed.",
  degenerate: "The shape is too flat to hold a note.",
  too_thin: "The shape is too thin to hold a note.",
  bad_fill_rule: "The fill rule must be nonzero or evenodd.",
  bad_name: `The shape needs a name of 1 to ${Z.maxName} characters.`
}, me = (n) => ({ ok: !1, code: n, message: cn[n] });
class X extends Error {
  constructor(t) {
    super(cn[t]), this.code = t;
  }
}
const od = /^[MmLlHhVvCcSsQqTtAaZz0-9.,\s+-]*$/, rd = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };
function ad(n) {
  const t = [], e = /([MmLlHhVvCcSsQqTtAaZz])|([+-]?(?:\d+\.?\d*|\.\d+))|([\s,]+)/y;
  let i = 0;
  for (; i < n.length; ) {
    e.lastIndex = i;
    const s = e.exec(n);
    if (!s || s[0].length === 0) throw new X("bad_syntax");
    s[1] ? t.push(s[1]) : s[2] && t.push(s[2]), i = e.lastIndex;
  }
  return t;
}
function hn(n) {
  if (typeof n != "string" || !n.trim()) throw new X("empty");
  if (n.length > Z.maxInput) throw new X("too_long");
  if (!od.test(n)) throw new X("bad_character");
  const t = ad(n), e = [];
  let i = null, s = 0, o = 0, r = 0, a = 0, l = null, c = null, h = 0, d = "", f = 0;
  const u = (y) => typeof y == "string" && /^[A-Za-z]$/.test(y), p = () => {
    const y = t[h];
    if (y === void 0 || u(y)) throw new X("bad_syntax");
    h++;
    const b = Number(y);
    if (!Number.isFinite(b)) throw new X("bad_syntax");
    if (Math.abs(b) > Z.maxMagnitude) throw new X("bad_number");
    return b;
  }, m = () => {
    const y = t[h];
    if (typeof y != "string" || u(y)) throw new X("bad_syntax");
    const b = y.replace(/^\+/, "")[0];
    if (b !== "0" && b !== "1") throw new X("bad_syntax");
    const v = y.replace(/^\+/, "").slice(1);
    return v ? t[h] = v : h++, b === "1" ? 1 : 0;
  }, g = (y) => {
    if (!i) throw new X("bad_syntax");
    if (i.push(y), ++f > Z.maxSegments) throw new X("too_many_segments");
  };
  for (; h < t.length; ) {
    const y = t[h];
    if (u(y))
      d = y, h++;
    else if (!d)
      throw new X("bad_syntax");
    const b = d === d.toLowerCase(), v = d.toUpperCase(), w = rd[v];
    if (v === "Z") {
      g({ c: "Z" }), s = r, o = a, l = c = null, d = "";
      continue;
    }
    if (h >= t.length || u(t[h])) throw new X("bad_syntax");
    let _ = !0;
    for (; h < t.length && !u(t[h]); ) {
      const x = b ? s : 0, S = b ? o : 0;
      switch (v) {
        case "M": {
          const C = p() + x, A = p() + S;
          if (_) {
            if (e.length >= Z.maxParts) throw new X("too_many_parts");
            i = [], e.push(i), g({ c: "M", x: C, y: A }), r = C, a = A;
          } else
            g({ c: "L", x: C, y: A });
          s = C, o = A, l = c = null;
          break;
        }
        case "L": {
          const C = p() + x, A = p() + S;
          g({ c: "L", x: C, y: A }), s = C, o = A, l = c = null;
          break;
        }
        case "H": {
          const C = p() + x;
          g({ c: "L", x: C, y: o }), s = C, l = c = null;
          break;
        }
        case "V": {
          const C = p() + S;
          g({ c: "L", x: s, y: C }), o = C, l = c = null;
          break;
        }
        case "C": {
          const C = p() + x, A = p() + S, E = p() + x, M = p() + S, k = p() + x, N = p() + S;
          g({ c: "C", x1: C, y1: A, x2: E, y2: M, x: k, y: N }), l = { x: E, y: M }, c = null, s = k, o = N;
          break;
        }
        case "S": {
          const C = l ? 2 * s - l.x : s, A = l ? 2 * o - l.y : o, E = p() + x, M = p() + S, k = p() + x, N = p() + S;
          g({ c: "C", x1: C, y1: A, x2: E, y2: M, x: k, y: N }), l = { x: E, y: M }, c = null, s = k, o = N;
          break;
        }
        case "Q": {
          const C = p() + x, A = p() + S, E = p() + x, M = p() + S;
          g({ c: "Q", x1: C, y1: A, x: E, y: M }), c = { x: C, y: A }, l = null, s = E, o = M;
          break;
        }
        case "T": {
          const C = c ? 2 * s - c.x : s, A = c ? 2 * o - c.y : o, E = p() + x, M = p() + S;
          g({ c: "Q", x1: C, y1: A, x: E, y: M }), c = { x: C, y: A }, l = null, s = E, o = M;
          break;
        }
        case "A": {
          const C = Math.abs(p()), A = Math.abs(p()), E = p(), M = m(), k = m(), N = p() + x, O = p() + S;
          g({ c: "A", rx: C, ry: A, rot: E, large: M, sweep: k, x: N, y: O }), s = N, o = O, l = c = null;
          break;
        }
        default:
          throw new X("bad_syntax");
      }
      if (_ = !1, w === 0) break;
    }
  }
  if (!e.length) throw new X("bad_syntax");
  return e;
}
function ld(n, t, e, i = 12) {
  let { rx: s, ry: o } = e;
  const { x: r, y: a } = e;
  if (s === 0 || o === 0 || n === r && t === a) return [[r, a]];
  const l = e.rot * Math.PI / 180, c = Math.cos(l), h = Math.sin(l), d = (n - r) / 2, f = (t - a) / 2, u = c * d + h * f, p = -h * d + c * f, m = u * u / (s * s) + p * p / (o * o);
  if (m > 1) {
    const k = Math.sqrt(m);
    s *= k, o *= k;
  }
  const g = s * s * o * o - s * s * p * p - o * o * u * u, y = s * s * p * p + o * o * u * u;
  let b = Math.sqrt(Math.max(0, g / y));
  e.large === e.sweep && (b = -b);
  const v = b * s * p / o, w = -b * o * u / s, _ = c * v - h * w + (n + r) / 2, x = h * v + c * w + (t + a) / 2, S = (k, N, O, R) => Math.atan2(k * R - N * O, k * O + N * R), C = S(1, 0, (u - v) / s, (p - w) / o);
  let A = S((u - v) / s, (p - w) / o, (-u - v) / s, (-p - w) / o);
  !e.sweep && A > 0 && (A -= 2 * Math.PI), e.sweep && A < 0 && (A += 2 * Math.PI);
  const E = Math.max(2, Math.ceil(Math.abs(A) / (Math.PI / 2) * i)), M = [];
  for (let k = 1; k <= E; k++) {
    const N = C + A * k / E, O = s * Math.cos(N), R = o * Math.sin(N);
    M.push([c * O - h * R + _, h * O + c * R + x]);
  }
  return M[M.length - 1] = [r, a], M;
}
function dn(n) {
  let t = 0, e = 0, i = 0;
  for (const h of n) for (const d of h)
    d.c === "C" || d.c === "Q" ? t++ : d.c === "A" ? e++ : d.c !== "Z" && i++;
  const s = i + t * 16 + e * 48, o = s > Z.maxPoints ? Math.max(0, Z.maxPoints - i) / Math.max(1, s - i) : 1, r = Math.max(2, Math.floor(16 * o)), a = Math.max(2, Math.floor(12 * o)), l = Math.max(0.5, 12 * o), c = [];
  for (const h of n) {
    const d = [];
    let f = 0, u = 0;
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
              y * y * y * f + 3 * y * y * g * p.x1 + 3 * y * g * g * p.x2 + g * g * g * p.x,
              y * y * y * u + 3 * y * y * g * p.y1 + 3 * y * g * g * p.y2 + g * g * g * p.y
            ]);
          }
          break;
        case "Q":
          for (let m = 1; m <= a; m++) {
            const g = m / a, y = 1 - g;
            d.push([y * y * f + 2 * y * g * p.x1 + g * g * p.x, y * y * u + 2 * y * g * p.y1 + g * g * p.y]);
          }
          break;
        case "A":
          d.push(...ld(f, u, p, l));
          break;
      }
      p.c !== "Z" ? (f = p.x, u = p.y) : d.length && ([f, u] = d[0]);
    }
    d.length && c.push(d);
  }
  return c;
}
function Ne(n) {
  let t = 1 / 0, e = 1 / 0, i = -1 / 0, s = -1 / 0;
  for (const o of n)
    for (const [r, a] of o)
      r < t && (t = r), a < e && (e = a), r > i && (i = r), a > s && (s = a);
  return { x: t, y: e, w: i - t, h: s - e };
}
const Y = 48;
function ai(n, t, e, i) {
  const s = [];
  for (const c of n)
    for (let h = 0, d = c.length; h < d; h++) {
      const [f, u] = c[h], [p, m] = c[(h + 1) % d];
      let g = 0;
      u <= t ? m > t && (g = 1) : m <= t && (g = -1), g && s.push([f + (t - u) * (p - f) / (m - u), g]);
    }
  s.sort((c, h) => c[0] - h[0]);
  const o = new Array(e.length);
  let r = 0, a = 0, l = s.length - 1;
  for (let c = e.length - 1; c >= 0; c--) {
    for (; l >= 0 && s[l][0] > e[c]; )
      r += s[l][1], a++, l--;
    o[c] = i === "evenodd" ? a % 2 === 1 : r !== 0;
  }
  return o;
}
function cd(n, t) {
  const e = Ne(n), i = (l) => Math.min(l, 0.99999) || 1e-5, s = Array.from({ length: Y + 1 }, (l, c) => e.x + i(c / Y) * e.w), o = Array.from({ length: Y }, (l, c) => e.x + (c + 0.5) / Y * e.w), r = [];
  for (let l = 0; l <= Y; l++) r[l] = ai(n, e.y + i(l / Y) * e.h, s, t);
  const a = [];
  for (let l = 0; l < Y; l++) {
    const c = ai(n, e.y + (l + 0.5) / Y * e.h, o, t);
    a[l] = [];
    for (let h = 0; h < Y; h++)
      a[l][h] = r[l][h] && r[l][h + 1] && r[l + 1][h] && r[l + 1][h + 1] && c[h];
  }
  return a;
}
function hd(n, t) {
  const e = Ne(n), i = Array.from({ length: Y }, (o, r) => e.x + (r + 0.5) / Y * e.w);
  let s = 0;
  for (let o = 0; o < Y; o++)
    for (const r of ai(n, e.y + (o + 0.5) / Y * e.h, i, t)) r && s++;
  return s / (Y * Y);
}
const fs = (n) => n === "nonzero" || n === "evenodd";
function Ko(n, t) {
  for (const e of n) {
    const i = e[e.length - 1];
    if (i.c === "Z") continue;
    const s = e[0], o = i;
    if (Math.hypot(o.x - s.x, o.y - s.y) > Z.closeTolerance * t) return !1;
    e.push({ c: "Z" });
  }
  return !0;
}
function dd(n, t = {}) {
  if (t.fillRule !== void 0 && !fs(t.fillRule)) return me("bad_fill_rule");
  const e = fs(t.fillRule) ? t.fillRule : "nonzero";
  let i;
  try {
    i = hn(n);
  } catch (r) {
    return me(r instanceof X ? r.code : "bad_syntax");
  }
  const s = dn(i), o = Ne(s);
  return !(o.w > 0) || !(o.h > 0) || Math.min(o.w, o.h) < Z.minSideRatio * Math.max(o.w, o.h) ? me("degenerate") : Ko(i, Math.max(o.w, o.h)) ? hd(s, e) < Z.minFill ? me("too_thin") : { ok: !0 } : me("not_closed");
}
const ud = (n) => {
  const t = Math.round(n * 10) / 10;
  return Object.is(t, -0) ? 0 : t;
}, ge = (n) => String(ud(n));
function fd(n, t, e) {
  let i = "";
  const s = (o, r) => {
    const [a, l] = t(o, r);
    return `${ge(a)} ${ge(l)}`;
  };
  for (const o of n)
    for (const r of o)
      switch (r.c) {
        case "M":
        case "L":
          i += `${r.c}${s(r.x, r.y)}`;
          break;
        case "C":
          i += `C${s(r.x1, r.y1)} ${s(r.x2, r.y2)} ${s(r.x, r.y)}`;
          break;
        case "Q":
          i += `Q${s(r.x1, r.y1)} ${s(r.x, r.y)}`;
          break;
        case "A":
          i += `A${ge(r.rx * e)} ${ge(r.ry * e)} ${ge(r.rot)} ${r.large} ${r.sweep} ${s(r.x, r.y)}`;
          break;
        case "Z":
          i += "Z";
          break;
      }
  return i;
}
function pd(n) {
  const t = hn(n), e = dn(t), i = Ne(e);
  if (!(i.w > 0) || !(i.h > 0)) throw new X("degenerate");
  if (!Ko(t, Math.max(i.w, i.h))) throw new X("not_closed");
  const s = Math.max(i.w, i.h), o = Math.abs(i.x) <= 0.15 && Math.abs(i.y) <= 0.15 && Math.abs(s - 100) <= 0.3, r = o ? 1 : 100 / s, l = fd(t, o ? (h, d) => [h, d] : (h, d) => [(h - i.x) * r, (d - i.y) * r], r);
  if (l.length > Z.maxNormalized) throw new X("too_long");
  const c = Ne(dn(hn(l)));
  if (!(c.w > 0) || !(c.h > 0) || c.w * c.h < i.w * r * (i.h * r) * 0.25) throw new X("degenerate");
  return { d: l, aspect: i.w / i.h };
}
function Qo(n, t = "nonzero") {
  let e;
  try {
    e = dn(hn(n));
  } catch {
    return null;
  }
  const s = cd(e, t === "evenodd" ? "evenodd" : "nonzero"), o = new Array(Y).fill(0);
  let r = null;
  for (let u = 0; u < Y; u++) {
    for (let p = 0; p < Y; p++) o[p] = s[u][p] ? o[p] + 1 : 0;
    for (let p = 0; p < Y; p++) {
      let m = 1 / 0;
      for (let g = p; g < Y && o[g] > 0; g++) {
        m = Math.min(m, o[g]);
        const y = (g - p + 1) / Y, b = m / Y, v = y * b * Math.min(1, y / b);
        (!r || v > r.score) && (r = { score: v, x: p / Y, y: (u - m + 1) / Y, w: y, h: b });
      }
    }
  }
  if (!r || r.w < Z.minTextBox || r.h < Z.minTextBox) return null;
  const a = Z.textBoxCap;
  let { x: l, y: c, w: h, h: d } = r;
  h > a && (l += (h - a) / 2, h = a), d > a && (c += (d - a) / 2, d = a);
  const f = (u) => Math.round(u * 1e3) / 1e3;
  return { x: f(l), y: f(c), w: f(h), h: f(d) };
}
function Pn(n) {
  if (typeof n != "string") return null;
  const t = n.replace(/[<>"'`\\\u0000-\u001f]/g, "").replace(/\s+/g, " ").trim();
  return t && t.length <= Z.maxName ? t : null;
}
const ye = /* @__PURE__ */ new Map(), md = 32;
function gd(n) {
  let t = null;
  try {
    t = JSON.stringify([n?.name ?? null, n?.d ?? null, n?.fillRule ?? null, n?.ref ?? null]);
  } catch {
    t = null;
  }
  if (t !== null && t.length <= Z.maxInput * 2 + 400) {
    const e = ye.get(t);
    if (e) return ps(e);
    const i = ms(n);
    return ye.size >= md && ye.delete(ye.keys().next().value), ye.set(t, i), ps(i);
  }
  return ms(n);
}
function ps(n) {
  if (!n.ok) return { ...n };
  const { shape: t } = n;
  return {
    ok: !0,
    shape: { ...t, textBox: t.textBox ? { ...t.textBox } : null, ...t.ref ? { ref: { ...t.ref } } : {} }
  };
}
function ms(n) {
  const t = Pn(n?.name ?? "custom");
  if (!t) return { ok: !1, code: "bad_name", message: cn.bad_name };
  const e = dd(n?.d, { fillRule: n?.fillRule });
  if (!e.ok) return e;
  const i = n.fillRule === "evenodd" ? "evenodd" : "nonzero";
  let s;
  try {
    s = pd(n.d);
  } catch (r) {
    const a = r instanceof X ? r.code : "bad_syntax";
    return { ok: !1, code: a, message: cn[a] };
  }
  const o = n.ref && typeof n.ref == "object" && typeof n.ref.id == "string" && /^[A-Za-z0-9_-]{1,64}$/.test(n.ref.id) ? { id: n.ref.id, ...Pn(n.ref.name) ? { name: Pn(n.ref.name) } : {} } : void 0;
  return {
    ok: !0,
    shape: {
      name: t,
      d: s.d,
      fillRule: i,
      aspect: Math.round(s.aspect * 1e3) / 1e3,
      textBox: Qo(s.d, i),
      ...o ? { ref: o } : {}
    }
  };
}
function yd(n, t) {
  n.shape = "custom", n.shapeHint = "custom", n.vectorPath = t.d, n.fillRule = t.fillRule, n.textBox = t.textBox, n.shapeRef = { ...t.ref || {}, name: t.name }, t.ref || delete n.shapeRef.id;
}
function Bi(n) {
  const t = { ...n };
  return n.xPos !== void 0 && t.x === void 0 && (t.x = n.xPos, delete t.xPos), n.yPos !== void 0 && t.y === void 0 && (t.y = n.yPos, delete t.yPos), n.foregroundColor !== void 0 && t.fontColor === void 0 && (t.fontColor = n.foregroundColor, delete t.foregroundColor), n.shapeHint !== void 0 && t.shape === void 0 && (t.shape = xd(n.shapeHint), delete t.shapeHint), n.svgString !== void 0 && t.svgContent === void 0 && (t.svgContent = n.svgString, delete t.svgString), n.blnStraight !== void 0 && (t.isStraightLine = n.blnStraight, delete t.blnStraight), Jo(t), t;
}
function bd(n) {
  if (!n || typeof n != "object") return !1;
  const t = n;
  return t.width !== void 0 || t.height !== void 0;
}
function Jo(n) {
  return n && bd(n.textOffset) && (n.textOffset = { x: 0, y: 0 }), n;
}
function lt(n) {
  const t = { ...n };
  return t.xPos = n.x, t.yPos = n.y, t.foregroundColor = n.fontColor, n.shape && (t.shapeHint = n.shape), n.svgContent && (t.svgString = n.svgContent), t;
}
function vd(n) {
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
function wd(n) {
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
function xd(n) {
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
const gs = Object.freeze({
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
}), ys = Object.freeze({
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
function Dn() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
function _d(n, t) {
  for (const e of n) {
    let i;
    try {
      i = e.governs(t);
    } catch (s) {
      console.warn("DRAG_POLICY: governs() threw; treating the note as governed", s), i = !0;
    }
    if (i)
      return {
        policy: e,
        capabilities: i === !0 ? ys : { ...ys, ...i }
      };
  }
  return null;
}
function Cd(n, t, e = 0) {
  let i = null;
  for (const s of t) {
    const o = s?.options;
    if (!o) continue;
    const r = o.width || 0, a = o.height || 0, l = (o.x || 0) + r / 2, c = (o.y || 0) + a / 2;
    let h = n.x - l, d = n.y - c;
    const f = o.rotate?.rotationAngle || 0;
    if (f) {
      const u = -f * Math.PI / 180, p = h * Math.cos(u) - d * Math.sin(u), m = h * Math.sin(u) + d * Math.cos(u);
      h = p, d = m;
    }
    Math.abs(h) > r / 2 + e || Math.abs(d) > a / 2 + e || (!i || Ed(s, i)) && (i = s);
  }
  return i;
}
function Ed(n, t) {
  const e = n.svgGroup?.node, i = t.svgGroup?.node;
  return !e || !i || typeof i.compareDocumentPosition != "function" ? !0 : (i.compareDocumentPosition(e) & 4) !== 0;
}
const Jt = Object.freeze({
  fontSize: 14,
  fontFamily: "Arial, sans-serif",
  fontColor: "#000000",
  borderColor: "#cccccc",
  borderWidth: 1,
  backgroundColor: "#f0f0f0"
}), On = /* @__PURE__ */ new Map(), Sd = 4, Ad = 56, Md = 900, Ze = ["top", "right", "bottom", "left"], Td = {
  top: "Add connected note above",
  right: "Add connected note to the right",
  bottom: "Add connected note below",
  left: "Add connected note to the left"
};
function Rd(n, t, e = 8) {
  const { x: i, y: s, width: o, height: r } = n, a = [i, i + o / 2, i + o], l = [s, s + r / 2, s + r];
  let c = i, h = s, d = e, f = e;
  for (const u of t) {
    const p = [u.x, u.x + u.width / 2, u.x + u.width], m = [u.y, u.y + u.height / 2, u.y + u.height];
    for (const g of a)
      for (const y of p) {
        const b = Math.abs(g - y);
        b < d && (d = b, c = i + (y - g));
      }
    for (const g of l)
      for (const y of m) {
        const b = Math.abs(g - y);
        b < f && (f = b, h = s + (y - g));
      }
  }
  return { x: c, y: h };
}
function bs(n) {
  return n === "bold" ? "bold" : null;
}
function kd(n) {
  const t = String(n ?? "").trim().toLowerCase();
  let e = typeof n == "number" ? n : parseFloat(t);
  return typeof n != "number" && t.endsWith("pt") && (e = e * 4 / 3), (Number.isFinite(e) && e > 0 ? e : 14) * 1.3;
}
class Hi {
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
      fontSize: Jt.fontSize,
      fontFamily: Jt.fontFamily,
      fontColor: Jt.fontColor,
      textOpacity: 1,
      textXAlign: "center",
      textYAlign: "middle",
      backgroundColor: Jt.backgroundColor,
      borderColor: Jt.borderColor,
      borderWidth: Jt.borderWidth,
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
    }, us(this.options), this.ready = new Promise((i, s) => {
      this._resolveReady = i, this._rejectReady = s;
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
      const s = this.options.width, o = this.options.height, r = this.backgroundRect.x?.() ?? 0, a = this.backgroundRect.y?.() ?? 0;
      this.nestedSvg = this.svgGroup.nested().size(s, o).move(r, a), this.nestedSvg.svg(this.options.svgContent), this._svgViewboxTimeoutId = setTimeout(() => {
        if (this._destroyed || !this.nestedSvg) return;
        const l = this.nestedSvg.children()[0];
        if (l) {
          let c = l.bbox();
          console.log("NODE_DEBUG: Delayed bbox:", c, "Node size:", s, o), (c.width <= 0 || c.height <= 0) && (c = this.calculatePathBounds(this.options.svgContent, s, o), console.log("NODE_DEBUG: Calculated bounds:", c)), c.width > 0 && c.height > 0 ? (this.nestedSvg.viewbox(c.x, c.y, c.width, c.height), this.nestedSvg.node.setAttribute("preserveAspectRatio", "none"), console.log(
            `NODE_DEBUG: Set viewbox(${c.x}, ${c.y}, ${c.width}, ${c.height}) with preserveAspectRatio="none"`
          )) : (console.log("NODE_DEBUG: Invalid bounds, trying default viewbox approach"), this.nestedSvg.viewbox(0, 0, 24, 24), this.nestedSvg.node.setAttribute("preserveAspectRatio", "none"));
        }
      }, 10);
    }
    const e = { ...this.options.resizeRotate };
    this.options.shape === "circle" && (e.preserveAspectRatio = !0), this.resizeRotate = new rh(this, e), this.connector = new lh(this, this.options.connector), this.relationships = new ch(this), this.images = new hh(this);
    const i = Sh();
    i && (this.media = new i.MediaNote(this)), this.editor = new Nh(this), this.links = new Ph(this), this.filters = new ed(this), this.menu = new id(this), this.options.image && this.images.set(
      this.options.image,
      this.options.imageOrigWidth,
      this.options.imageOrigHeight
    ), this.options.filters?.vect && this.filters.apply(this.options.filters.vect, "vect"), this.options.filters?.text && this.filters.apply(this.options.filters.text, "text"), this.options.animations?.vect && this.filters.applyAnimation(this.options.animations.vect, "vect"), this.options.animations?.text && this.filters.applyAnimation(this.options.animations.text, "text"), this.options.allowDrag && !this.options.isLocked && this.makeDraggable(), this.setupSelectionBehavior(), typeof this.options.customRender == "function" && this.options.customRender(this.svgGroup, this.options), t || this.centerTextInitial(), this.options.rotate?.rotationAngle && this.applyPositionAndRotation(), console.log("NODE_DEBUG: finishCreate continuing for", this.id), this.svgGroup.node.setAttribute("aria-label", this.options.text || "Unnamed node");
    try {
      this.slate.markersContainer?.front?.();
    } catch {
    }
    this.updateLinkIndicator(), this.options.media && (this.media ? this.media.render() : Ah().then((s) => {
      this._destroyed || this.media || (this.media = new s.MediaNote(this), this.options.media && this.media.render());
    }).catch((s) => console.warn("NODE: the video note could not load", s))), this.applyGovernance(), this._resolveReady();
  }
  updateLinkIndicator() {
    try {
      this._linkBadge && (this._linkBadge.remove(), this._linkBadge = void 0);
      const t = this.options.link;
      if (!t?.show || !t.data) return;
      const e = this.options.width || 0, i = this.options.height || 0, s = 11;
      let o = e - s - 3, r = s + 3;
      const a = this.options.shape;
      this.contentPath || this.nestedSvg ? (o = e * 0.72, r = i * 0.28) : (a === "circle" || a === "ellipse") && (o = e * 0.85, r = i * 0.15);
      const l = this.svgGroup.group();
      l.node.setAttribute("class", "node-link-badge"), l.node.setAttribute("style", "cursor:pointer"), l.circle(s * 2).move(o - s, r - s).fill("#2d6cdf").stroke({ color: "#fff", width: 1.5 });
      const h = document.createElementNS("http://www.w3.org/2000/svg", "text");
      h.setAttribute("x", String(o)), h.setAttribute("y", String(r)), h.setAttribute("text-anchor", "middle"), h.setAttribute("dominant-baseline", "central"), h.setAttribute("font-family", "sans-serif"), h.setAttribute("font-size", "15"), h.setAttribute("font-weight", "bold"), h.setAttribute("fill", "#fff"), h.setAttribute("pointer-events", "none"), h.textContent = "↗", l.node.appendChild(h);
      let d = 0;
      const f = (u) => {
        u.stopPropagation(), u.preventDefault?.();
        const p = typeof performance < "u" ? performance.now() : Date.now();
        p - d < 350 || (d = p, this.links?.navigate());
      };
      l.on("pointerdown", (u) => {
        u.stopPropagation();
      }), l.on("pointerup", f), l.on("click", f), this._linkBadge = l;
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
    } = this.options, d = { color: s, width: o }, f = this.borderDashArray();
    f !== "none" && (d.dasharray = f), a !== void 0 && (d.opacity = a);
    const u = hs(l, c);
    if (u) {
      const p = this.svgGroup.nested().size(t, e);
      String(c || l || "").toLowerCase() !== "circle" && p.node.setAttribute("preserveAspectRatio", "none");
      const g = p.path(u.path).fill(i).stroke(d);
      if (this.isCustomShape())
        try {
          g.node.setAttribute("fill-rule", this.options.fillRule === "evenodd" ? "evenodd" : "nonzero"), g.node.setAttribute("vector-effect", "non-scaling-stroke"), p.node.setAttribute("overflow", "visible");
        } catch {
        }
      try {
        const y = g.bbox();
        y.width > 0 && y.height > 0 ? p.viewbox(y.x, y.y, y.width, y.height) : p.viewbox(u.viewBox);
      } catch {
        p.viewbox(u.viewBox);
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
      switch (this.contentPath = void 0, l) {
        case "circle": {
          const p = Math.min(t, e) / 2;
          this.backgroundRect = this.svgGroup.circle(p * 2).fill(i).stroke(d);
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
    i && String(i).includes("-") && this.applyShapeFill(this.contentPath ?? this.backgroundRect, i), console.log(
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
      jh(this.backgroundRect);
    } catch {
    }
    this.backgroundRect = void 0, this.contentPath = void 0;
    try {
      this.resizeTarget?.remove?.();
    } catch {
    }
    this.resizeTarget = void 0, this.options.shape = t, this.options.vectorPath = e ?? t, us(this.options), t !== "custom" && (delete this.options.fillRule, delete this.options.textBox, delete this.options.shapeRef), this.createBackground();
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
    const { text: t, fontSize: e, fontFamily: i, fontColor: s, fontStyle: o, textOpacity: r } = this.options;
    this.textElement = this.svgGroup.text(this.wrapTextToWidth(t)).font({
      family: i,
      size: e,
      fill: s,
      opacity: r
    }), this.textElement.attr({
      "text-anchor": "middle",
      "dominant-baseline": "central",
      "font-style": o || null,
      "font-weight": bs(this.options.fontWeight)
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
    const { fontSize: t, fontFamily: e, fontColor: i, fontStyle: s, textOpacity: o } = this.options;
    this.textElement.font({
      family: e,
      size: t,
      fill: i,
      opacity: o
    }), this.textElement.attr("font-style", s || null), this.textElement.attr("font-weight", bs(this.options.fontWeight)), this.options.text && this.textElement.text(this.wrapTextToWidth(this.options.text)), this.centerText();
  }
  /**
   * "Snap to neighbors" (Miro smart-align): nudge (x, y) so one of this node's
   * edges or center lines up with a nearby node's matching edge/center. Gated by
   * the caller on viewPort.snapToObjects.
   */
  snapToNeighbors(t, e) {
    const i = {
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
    return Rd(i, s);
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
      let s = this.options.textBox;
      if (s === void 0) {
        const r = String(this.options.vectorPath || this.options.shape || "");
        On.has(r) || On.set(r, Qo(r, this.options.fillRule || "nonzero")), s = On.get(r);
      }
      const o = s && [s.x, s.y, s.w, s.h].every((r) => typeof r == "number" && Number.isFinite(r)) ? s : { x: 0.25, y: 0.25, w: 0.5, h: 0.5 };
      return this.insetArea({ x: o.x * t, y: o.y * e, w: o.w * t, h: o.h * e, custom: !0 });
    }
    const i = this.shapeTextInset();
    return this.insetArea({ x: t * (1 - i) / 2, y: e * (1 - i) / 2, w: t * i, h: e * i, custom: !1 });
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
    const e = this.textInsetSides(), i = 1 - e.left - e.right, s = 1 - e.top - e.bottom;
    return { ...t, x: t.x + t.w * e.left, y: t.y + t.h * e.top, w: t.w * i, h: t.h * s };
  }
  /** The note's text inset (options.textInset), each side clamped to 0-0.45. */
  textInsetSides() {
    const t = this.options.textInset || {}, e = (i) => {
      const s = Number(i);
      return Number.isFinite(s) ? Math.min(0.45, Math.max(0, s)) : 0;
    };
    return { left: e(t.left), right: e(t.right), top: e(t.top), bottom: e(t.bottom) };
  }
  shapeTextInset() {
    const t = String(this.options.shape || "rectangle").toLowerCase();
    return t.includes("diamond") ? 0.6 : t.includes("triangle") ? 0.55 : t.includes("star") ? 0.5 : t.includes("ellipse") || t.includes("circle") ? 0.82 : 1;
  }
  wrapTextToWidth(t) {
    if (!t) return t;
    const e = Math.max(24, this.textArea().w - 14), i = this.options.fontSize || 14, s = this.options.fontFamily || "sans-serif";
    let o = null;
    try {
      o = (this._measureCanvas || (this._measureCanvas = document.createElement("canvas"))).getContext("2d"), o && (o.font = `${this.options.fontWeight === "bold" ? "bold " : ""}${i}px ${s}`);
    } catch {
      o = null;
    }
    const r = (l) => o ? o.measureText(l).width : l.length * i * 0.55, a = [];
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
          let u = "";
          for (const p of d)
            u && r(u + p) > e ? (a.push(u), u = p) : u += p;
          h = u;
          continue;
        }
        const f = h ? `${h} ${d}` : d;
        h && r(f) > e ? (a.push(h), h = d) : h = f;
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
    if (!this.textElement || this.nestedSvg || this.isCustomShape()) return;
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
    Jo(this.options);
    const { width: t, height: e, textXAlign: i, textYAlign: s, textOffset: o } = this.options, r = this.backgroundRect.x?.() ?? 0, a = this.backgroundRect.y?.() ?? 0, l = this.placeArea(), c = r + l.x, h = a + l.y, d = l.w, f = l.h;
    let u = c + d / 2 + (o?.x || 0), p = h + f / 2 + (o?.y || 0);
    switch (i) {
      case "left":
        u = c + 5 + (o?.x || 0), this.textElement.attr("text-anchor", "start");
        break;
      case "right":
        u = c + d - 5 + (o?.x || 0), this.textElement.attr("text-anchor", "end");
        break;
      default:
        this.textElement.attr("text-anchor", "middle");
        break;
    }
    switch (s) {
      case "top":
        p = h + 5 + (o?.y || 0), this.textElement.attr("dominant-baseline", "hanging");
        break;
      case "bottom":
        p = h + f - 5 + (o?.y || 0), this.textElement.attr("dominant-baseline", "auto");
        break;
      default:
        this.textElement.attr("dominant-baseline", "central");
        break;
    }
    const m = this.textElement.node.querySelectorAll?.("tspan")?.length || 1;
    if (m > 1 && s !== "top") {
      const g = (m - 1) * kd(this.options.fontSize);
      p -= s === "bottom" ? g : g / 2;
    }
    this.textElement.attr({ x: u, y: p }), this.fitTextToNode();
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
    const i = this.textArea(), s = i.w - 12, o = i.h - 10;
    if (s <= 0 || o <= 0) return;
    let r = Math.min(s / e.width, o / e.height);
    if (r >= 0.999) return;
    r = Math.max(r, 0.3);
    const { textXAlign: a, textYAlign: l } = this.options, c = a === "left" ? e.x : a === "right" ? e.x + e.width : e.x + e.width / 2, h = l === "top" ? e.y : l === "bottom" ? e.y + e.height : e.y + e.height / 2;
    try {
      t.attr(
        "transform",
        `translate(${c} ${h}) scale(${r.toFixed(
          4
        )}) translate(${-c} ${-h})`
      );
    } catch {
    }
  }
  makeDraggable() {
    this.svgGroup.draggable(), this.svgGroup.on("beforedrag.node", (t) => {
      const e = this.slate.governanceOf?.(this);
      if (!e) return;
      const i = this.slate;
      if (!e.capabilities.canMove || i.options?.enabled === !1 || i.isReadOnly?.() || i.isCommentOnly?.()) {
        t.preventDefault?.();
        const s = t.detail?.event;
        s?.type === "mousedown" && !this.editor?.isInlineEditing?.() && s.preventDefault?.();
      }
    }), this.svgGroup.on("dragstart.node", (t) => {
      console.log("DRAG_DEBUG: Drag started on", this.id), this.toFront(!1);
      const e = this.slate.getSelectedNodes().includes(this), i = t.detail?.event || t, s = i?.ctrlKey || i?.metaKey || i?.shiftKey;
      e ? console.log(
        "SELECTION_DEBUG: Drag started on already selected node",
        this.id
      ) : (console.log(
        "SELECTION_DEBUG: Drag started on unselected node",
        this.id,
        "- selecting it, addToSelection:",
        s
      ), this.slate.selectNodes([this], s)), this.isDragging = !0, this.wasSelectedBeforeDrag = !0, this._handlesHiddenForDrag = !1;
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
          for (const l of a)
            l !== this && this._groupDragSiblings.push({
              node: l,
              x: l.options.x ?? 0,
              y: l.options.y ?? 0
            });
      } catch {
      }
      console.log("DRAG_DEBUG: Stored pre-drag transform:", this.preDragTransform, "position:", this.preDragPosition), this.hideNodeCog();
    }), this.svgGroup.on("dragend.node", (t) => {
      if (console.log("DRAG_DEBUG: Drag ended on", this.id), this._governed) {
        const d = this._governed, f = this.pointerFromDragEvent(t), u = f ? this.slate.clientToWorld(f) : d.last?.point ?? d.startWorld, p = {
          clientX: f?.x ?? d.last?.gesture.clientX ?? d.startClient.x,
          clientY: f?.y ?? d.last?.gesture.clientY ?? d.startClient.y,
          pointerType: d.pointerType
        };
        this.finishGovernedDrag(d, { point: u, gesture: p });
        return;
      }
      const e = this.pointerFromDragEvent(t);
      if (e && this._dragStartPointer && this.preDragPosition) {
        const d = this.slate.getZoom?.() || 1, f = (e.x - this._dragStartPointer.x) / d, u = (e.y - this._dragStartPointer.y) / d;
        this.options.x = this.preDragPosition.x + f, this.options.y = this.preDragPosition.y + u;
        let p = f, m = u;
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
      const i = this._groupDragSiblings;
      if (this._groupDragSiblings = [], !i.length && this.preDragPosition && e) {
        const d = { ...this.preDragPosition }, u = Math.abs((this.options.x ?? 0) - d.x) > 0.5 || Math.abs((this.options.y ?? 0) - d.y) > 0.5 ? this.slate.offerFreeDrop?.(this, this.slate.clientToWorld(e), d) : null;
        if (u) {
          this.preDragTransform = null, this.preDragPosition = null, this._dragStartPointer = null, u === "refused" && this.position(d.x, d.y, () => this.reframeAfterGlide(), void 0, Dn() ? 0 : 180), this.isOnSlate() ? this.settleAfterDrag() : this.isDragging = !1;
          return;
        }
      }
      if (i.length && this.preDragPosition && e) {
        const d = { ...this.preDragPosition }, f = Math.abs((this.options.x ?? 0) - d.x) > 0.5 || Math.abs((this.options.y ?? 0) - d.y) > 0.5, u = [d, ...i.map((m) => ({ x: m.x, y: m.y }))], p = f ? this.slate.offerFreeGroupDrop?.([this, ...i.map((m) => m.node)], this.slate.clientToWorld(e), u) : null;
        if (p) {
          if (this.preDragTransform = null, this.preDragPosition = null, this._dragStartPointer = null, p === "refused") {
            const m = Dn() ? 0 : 180;
            this.position(d.x, d.y, () => this.reframeAfterGlide(), void 0, m);
            for (const g of i) g.node.isOnSlate() && g.node.position(g.x, g.y, void 0, void 0, m);
          }
          this.isOnSlate() ? this.settleAfterDrag() : this.isDragging = !1;
          return;
        }
      }
      const s = this.preDragPosition, o = 0.5, r = this.options.x ?? 0, a = this.options.y ?? 0, l = !s || Math.abs(r - s.x) > o || Math.abs(a - s.y) > o, c = i.some(
        (d) => Math.abs((d.node.options.x ?? 0) - d.x) > o || Math.abs((d.node.options.y ?? 0) - d.y) > o
      ), h = l || c;
      this.preDragTransform = null, this.preDragPosition = null, this._dragStartPointer = null, this.applyPositionAndRotation(), h && this.slate.broadcast?.("onNodesMove", {
        nodeOptions: [
          lt(this.options),
          ...i.map((d) => lt(d.node.options))
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
        const i = this.slate.getZoom?.() || 1, s = (e.x - this._dragStartPointer.x) / i, o = (e.y - this._dragStartPointer.y) / i;
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
        this.applyPositionAndRotation(), this._groupDragSiblings.length || this.slate.offerFreeMove?.(this, this.slate.clientToWorld(e));
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
        const i = this.slate.getSelectedNodes();
        if ((i.length !== e.length || i.some((r, a) => r !== e[a])) && !i.includes(this)) {
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
    const i = e.capabilities;
    t.setAttribute(
      "data-governed",
      i.canSelect ? i.canMove ? "movable" : "fixed" : "decoration"
    ), i.canConnect ? t.removeAttribute("data-no-connect") : t.setAttribute("data-no-connect", "1"), i.canSelect ? (t.removeAttribute("aria-hidden"), t.setAttribute("tabindex", "0"), t.setAttribute("role", "button")) : (t.setAttribute("aria-hidden", "true"), t.removeAttribute("tabindex"), t.removeAttribute("role")), t.style && (t.style.cursor = i.canSelect ? i.canMove ? i.cursor ?? "grab" : "default" : "", t.style.pointerEvents = i.canSelect ? "" : "none"), i.canConnect || this.hideConnectionHandles();
  }
  /** The press that may become a governed drag. Nothing is asked of the policy yet. */
  beginGovernedDrag(t, e) {
    const i = e?.detail?.event ?? e, s = this.pointerFromDragEvent(e) ?? { x: 0, y: 0 }, o = typeof i?.type == "string" && i.type.indexOf("touch") === 0 ? "touch" : "mouse", r = (u) => this.cancelGovernedDrag(u), a = (u) => {
      u.key === "Escape" && this._governed?.started && (u.preventDefault(), u.stopPropagation(), r("escape"));
    }, l = () => r("pointercancel"), c = () => r("touchcancel"), h = () => r("blur"), d = (u) => {
      this._governed && this.moveGovernedDrag(this._governed, u);
    }, f = o === "touch" ? "touchmove" : "mousemove";
    window.addEventListener(f, d, !0), window.addEventListener("keydown", a, !0), window.addEventListener("blur", h), o === "touch" ? window.addEventListener("touchcancel", c, !0) : window.addEventListener("pointercancel", l, !0), this._governed = {
      policy: t,
      origin: { x: this.options.x ?? 0, y: this.options.y ?? 0 },
      grabbed: { x: this.options.x ?? 0, y: this.options.y ?? 0 },
      startClient: s,
      startWorld: this.slate.clientToWorld(s),
      pointerType: o,
      started: !1,
      refused: !1,
      frame: 0,
      pan: 0,
      last: null,
      stopListening: () => {
        window.removeEventListener(f, d, !0), window.removeEventListener("keydown", a, !0), window.removeEventListener("blur", h), window.removeEventListener("touchcancel", c, !0), window.removeEventListener("pointercancel", l, !0);
      }
    }, this.slate._governedDragNode = this;
  }
  moveGovernedDrag(t, e) {
    const i = this.pointerFromDragEvent(e);
    if (!i || t.refused) return;
    const s = { clientX: i.x, clientY: i.y, pointerType: t.pointerType };
    if (!t.started) {
      if (Math.hypot(i.x - t.startClient.x, i.y - t.startClient.y) < Sd) return;
      let r = !0;
      try {
        r = t.policy.onStart?.(this, t.startWorld, s) !== !1;
      } catch (l) {
        console.warn("DRAG_POLICY: onStart threw; refusing the drag", l), r = !1;
      }
      if (!r) {
        t.refused = !0;
        return;
      }
      t.started = !0;
      const a = this._glide;
      t.grabbed = { x: this.options.x ?? 0, y: this.options.y ?? 0 }, a ? (a.cancelled = !0, this._glide = null, t.origin = { x: a.x, y: a.y }) : t.origin = { ...t.grabbed }, this.svgGroup.node.style && (this.svgGroup.node.style.cursor = "grabbing");
    }
    this.followGovernedPointer(t, s), this.panWhileHeldNearEdge(t);
  }
  /** Put the held note under the pointer and let the policy know where it is. */
  followGovernedPointer(t, e) {
    const i = this.slate.clientToWorld({ x: e.clientX, y: e.clientY });
    this.options.x = t.grabbed.x + (i.x - t.startWorld.x), this.options.y = t.grabbed.y + (i.y - t.startWorld.y), this.applyPositionAndRotation();
    try {
      this.slate.markersContainer?.front?.();
    } catch {
    }
    t.last = { point: i, gesture: e }, !t.frame && typeof t.policy.onMove == "function" && (t.frame = requestAnimationFrame(() => {
      if (t.frame = 0, !(this._governed !== t || !t.last))
        try {
          t.policy.onMove(this, t.last.point, t.last.gesture);
        } catch (s) {
          console.warn("DRAG_POLICY: onMove threw", s);
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
    const i = this.slate.element?.getBoundingClientRect?.();
    if (!i || typeof window > "u") return { x: 0, y: 0 };
    const s = Math.max(i.left, 0), o = Math.max(i.top, 0), r = Math.min(i.right, window.innerWidth || i.right), a = Math.min(i.bottom, window.innerHeight || i.bottom), l = Math.min(Ad, (r - s) / 4, (a - o) / 4);
    if (!(l > 0)) return { x: 0, y: 0 };
    const c = (f) => {
      if (f >= l) return 0;
      const u = Math.min(1, (l - f) / l);
      return u * u * Md;
    }, h = e.clientX - t.startClient.x, d = e.clientY - t.startClient.y;
    return {
      x: (h > 0 ? c(r - e.clientX) : 0) - (h < 0 ? c(e.clientX - s) : 0),
      y: (d > 0 ? c(a - e.clientY) : 0) - (d < 0 ? c(e.clientY - o) : 0)
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
    let i = performance.now();
    const s = () => {
      if (t.pan = 0, this._governed !== t || !t.started || !t.last || this._destroyed) return;
      const o = performance.now(), r = Math.min(64, o - i) / 1e3;
      i = o;
      const a = this.edgePanVelocity(t, t.last.gesture);
      if (!a.x && !a.y) return;
      const l = this.slate.getZoom?.() || 1;
      this.slate.panBy({ x: a.x * r / l, y: a.y * r / l }), this.followGovernedPointer(t, t.last.gesture), t.pan = requestAnimationFrame(s);
    };
    t.pan = requestAnimationFrame(s);
  }
  /**
   * End a governed drag. With `release` the policy rules on the drop; without it
   * the drag was cancelled, which is a refusal. Either way nothing is broadcast:
   * the host persists what it accepted.
   */
  finishGovernedDrag(t, e, i = "host") {
    this._governed = null, this.slate._governedDragNode === this && (this.slate._governedDragNode = null), t.stopListening(), t.frame && typeof cancelAnimationFrame < "u" && cancelAnimationFrame(t.frame), t.frame = 0, t.pan && typeof cancelAnimationFrame < "u" && cancelAnimationFrame(t.pan), t.pan = 0, this.preDragTransform = null, this.preDragPosition = null, this._dragStartPointer = null;
    let s = !1;
    const o = () => {
      s || this._destroyed || (s = !0, this.isOnSlate() && (this.svgGroup?.node?.style && this._governanceApplied && (this.svgGroup.node.style.cursor = this.slate?.governanceOf?.(this)?.capabilities.cursor ?? "grab"), this.settleAfterDrag(!0)));
    }, r = Dn();
    if (t.started) {
      let a = { accept: !1 };
      if (e)
        try {
          a = t.policy.onEnd(this, e.point, e.gesture) ?? { accept: !1 };
        } catch (l) {
          console.warn("DRAG_POLICY: onEnd threw; refusing the drop", l);
        }
      else
        try {
          t.policy.onCancel?.(this, i);
        } catch (l) {
          console.warn("DRAG_POLICY: onCancel threw", l);
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
      V(window, "mousemove.drag"), V(window, "touchmove.drag"), V(window, "mouseup.drag"), V(window, "touchend.drag"), this.svgGroup.remember?.("_draggable")?.init(!0);
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
      const c = { x: t, y: e, cancelled: !1 };
      this._glide = c;
      const h = performance.now(), d = () => {
        if (this._destroyed || !this.svgGroup || c.cancelled) return;
        const f = Math.min(1, (performance.now() - h) / o), u = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
        this.options.x = r + (t - r) * u, this.options.y = a + (e - a) * u, this.applyPositionAndRotation(), f < 1 ? (this.isSelected() && this.resizeRotate?.syncOverlay?.(), requestAnimationFrame(d)) : (this.options.x = t, this.options.y = e, this.applyPositionAndRotation(), this._glide === c && (this._glide = null), i && i(), this.refreshSelectionDecorations());
      };
      requestAnimationFrame(d);
    } else
      this.applyPositionAndRotation(), i && i(), this.refreshSelectionDecorations();
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
    const i = this.options.width || 100, s = this.options.height || 100, o = 11;
    let r = i - 2, a = 2;
    const l = String(
      this.options.vectorPath || this.options.shape || "rectangle"
    ).toLowerCase();
    this.nestedSvg ? (r = i * 0.72, a = s * 0.28) : l === "circle" || l === "ellipse" ? (r = i * 0.85, a = s * 0.15) : this.contentPath && l !== "rectangle" && l !== "roundedrectangle" && (r = i * 0.72, a = s * 0.28);
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
      const i = this.options.text !== t;
      this.options.text = t, i && this.slate.broadcast?.("onNodeTextChanged", { id: this.id, text: t });
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
      const s = Math.min(t, e);
      t = s, e = s;
    }
    if (this.options.width = t, this.options.height = e, this.backgroundRect instanceof He)
      this.backgroundRect.size(t, e);
    else if (this.backgroundRect instanceof vn) {
      const s = Math.min(t, e);
      this.backgroundRect.size(s, s), this.options.width = s, this.options.height = s;
    } else if (this.backgroundRect instanceof Ge)
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
    if (this.resizeTarget)
      try {
        this.resizeTarget.size(t, e);
      } catch {
      }
    this.textElement && this.options.text && this.textElement.text(this.wrapTextToWidth(this.options.text)), this.centerText(), this._linkBadge && this.updateLinkIndicator(), this.media?.update();
    const i = this._commentBadgeState;
    i && this.setCommentBadge(i.count, i.kind);
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
    const i = String(e).split("-").filter(Boolean);
    if (i.length >= 2)
      try {
        const s = this.svgGroup.gradient("linear", (o) => {
          o.stop(0, i[0]), o.stop(1, i[i.length - 1]);
        });
        t.fill(s);
        return;
      } catch {
      }
    t.fill(i[0] || e);
  }
  setColors(t, e) {
    const i = this.contentPath ?? this.backgroundRect;
    if (t) {
      this.options.backgroundColor = t, this.applyShapeFill(i, t);
      const s = String(this.options.fontColor || "").toLowerCase(), o = [
        "",
        "#fff",
        "#ffffff",
        "#000",
        "#000000",
        "white",
        "black"
      ].includes(s), r = this.options.fontColor || "#000000";
      if (o && this.textElement && t.startsWith("#") && $h(r, t) < 3) {
        const a = Zo(t);
        this.options.fontColor = a;
        try {
          this.textElement.font({ fill: a });
        } catch {
        }
      }
    }
    e && (this.options.borderColor = e, i.stroke({ color: e })), (t || e) && this.slate.broadcast?.("onNodeColorChanged", {
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
        this.options.rotate.rotationAngle = i + o * c, this.applyPositionAndRotation(), l < 1 ? requestAnimationFrame(a) : (this.options.rotate.rotationAngle = t, this.applyPositionAndRotation(), this.refreshSelectionDecorations());
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
    const e = this.options.x || 0, i = this.options.y || 0, s = this.options.width || 0, o = this.options.height || 0, r = this.options.rotate?.rotationAngle || 0;
    if (t && typeof this.svgGroup.node?.removeAttribute == "function" && typeof this.svgGroup.bbox == "function")
      try {
        this.svgGroup.node.removeAttribute("transform");
        const l = this.resizeTarget ?? this.backgroundRect, c = l ? { x: l.x(), y: l.y() } : this.svgGroup.bbox();
        c && (Math.abs(c.x) > 0.01 || Math.abs(c.y) > 0.01) && this.svgGroup.children().forEach((h) => {
          typeof h?.dmove == "function" && h.dmove(-c.x, -c.y);
        });
      } catch (l) {
        console.warn("NODE_DEBUG: child normalization failed:", l);
      }
    try {
      const l = (h) => {
        if (!h?.node?.removeAttribute) return !1;
        const d = typeof h.transform == "function" ? h.transform() : null;
        return d && Math.abs(d.rotate || 0) > 0.01 ? (h.node.removeAttribute("transform"), !0) : !1;
      }, c = l(this.textElement);
      l(this.nestedSvg), c && typeof this.centerText == "function" && this.centerText();
    } catch {
    }
    const a = r ? `translate(${e} ${i}) rotate(${r} ${s / 2} ${o / 2})` : `translate(${e} ${i})`;
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
      this.isResizeRotateHandle(i.target) || this.handleDoubleClickEdit();
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
          ), this.media?.hasMedia() && this.slate.isReadOnly?.())
            this.media.play();
          else if (this.links?.hasLink?.() && this.slate.isReadOnly?.())
            this.links.navigate();
          else {
            const r = i.ctrlKey || i.metaKey || i.shiftKey;
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
    const i = this.slate, s = () => i.announce?.(`Node added: ${t.options.text || "(unnamed)"}`), o = t.canEditTextInline();
    if (!o && e === "plug") return s();
    if (e !== "drop") {
      const c = i.canvas.viewbox(), h = t.resizeTarget;
      let d;
      if (h?.rbox)
        d = h.rbox(i.canvas);
      else {
        const { x: m = 0, y: g = 0, width: y = 0, height: b = 0 } = t.options;
        d = t.getRotation() ? t.svgGroup.rbox(i.canvas) : { x: m, y: g, x2: m + y, y2: g + b };
      }
      const f = (m, g, y, b) => {
        const v = Math.min(24, Math.max(0, (b - (g - m)) / 2));
        return g - m > b ? (m + g) / 2 - b / 2 : m - v < y ? m - v : g + v > y + b ? g + v - b : y;
      }, u = f(d.x, d.x2, c.x, c.width), p = f(d.y, d.y2, c.y, c.height);
      (u !== c.x || p !== c.y) && i.pan({ x: u, y: p });
    }
    const r = () => i.selectNodes([t]);
    typeof i.withoutAnnouncements == "function" ? i.withoutAnnouncements(r) : r();
    const a = i.getSelectedNodes?.() ?? [], l = a.length === 1 && a[0] === t;
    if (o && l && t.editor.startInline({
      caret: "end",
      preventScroll: !0,
      returnFocus: e === "keyboard"
    })) {
      i.announce?.("Connected note added. Type its name, then press Enter.");
      return;
    }
    e === "keyboard" && t.svgGroup.node.focus({ preventScroll: !0 }), s();
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
    let i, s;
    try {
      const y = this.svgGroup.rbox(t.canvas);
      i = y.x + y.width / 2, s = y.y;
    } catch {
      i = (this.options.x || 0) + (this.options.width || 0) / 2, s = this.options.y || 0;
    }
    const o = 15, r = 6, a = "#5b6472", l = t.capabilitiesOf?.(this), c = !!t.governanceOf?.(this);
    if (c && l?.canDelete === !1) return;
    const h = [];
    if (l?.canDelete !== !1 && h.push({ key: "delete", color: "#e5484d", onClick: () => this.slate.removeNode(this.id) }), l?.canConnect !== !1 && h.push({ key: "plug", color: a, onPress: (y) => this.startConnectDrag(y) }), !c && typeof t.options?.events?.onMenuRequested == "function" && h.push({ key: "cog", color: a, onClick: () => this.menu?.open?.() }), !h.length) return;
    const d = h.length, f = o * 2 + r, u = d * (o * 2) + (d - 1) * r, p = i - u / 2 + o, m = s - (o + 28 + 36), g = e.group().addClass("node-cog").addClass("node-toolbar");
    g.rect(u + 14, o * 2 + 10).radius((o * 2 + 10) / 2).center(i, m).fill("#ffffff").stroke({ color: "#e3e5ea", width: 1 }), h.forEach((y, b) => {
      const v = p + b * f, w = g.group().addClass(`node-tool-${y.key}`);
      w.circle(o * 2).center(v, m).fill("#ffffff").attr("fill-opacity", 1e-3), Hi.drawToolIcon(w, y.key, v, m, y.color), w.attr("pointer-events", "all");
      try {
        w.node.style.cursor = "pointer";
      } catch {
      }
      w.on("mousedown", (_) => {
        _.stopPropagation?.(), y.onPress && y.onPress(_);
      }), w.on("click", (_) => {
        _.stopPropagation?.(), y.onClick?.();
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
    if (!i || e.capabilitiesOf?.(this).canConnect === !1 || this._connectDragging) return;
    this._connectDragging = !0;
    const s = e.markersContainer || i;
    let o, r;
    try {
      const b = this.svgGroup.rbox(i);
      o = b.cx, r = b.cy;
    } catch {
      o = (this.options.x || 0) + (this.options.width || 0) / 2, r = (this.options.y || 0) + (this.options.height || 0) / 2;
    }
    const a = s.path(`M ${o} ${r} L ${o} ${r}`).fill("none").stroke({ color: "#007cff", width: 2, dasharray: "6,4", linecap: "round" }).addClass("connect-drag-line");
    a.attr("pointer-events", "none");
    let l = null;
    try {
      l = s.marker(7, 7, (b) => {
        b.path("M0,0 L7,3.5 L0,7 z").fill("#007cff").attr("pointer-events", "none");
      }), l.ref(6, 3.5), l.attr("pointer-events", "none"), a.marker("end", l);
    } catch {
    }
    try {
      e.markersContainer?.front?.();
    } catch {
    }
    const c = (b, v, w, _) => {
      const x = Math.hypot(b, v);
      if (x > 1e-4) return [b / x, v / x];
      const S = Math.hypot(w, _) || 1;
      return [w / S, _ / S];
    }, h = (b, v, w) => {
      const _ = (b.x || 0) + (b.width || 0) / 2, x = (b.y || 0) + (b.height || 0) / 2, S = v - _, C = w - x;
      if (Math.abs(S) < 1e-3 && Math.abs(C) < 1e-3) return { x: _, y: x };
      const A = S !== 0 ? (b.width || 0) / 2 / Math.abs(S) : 1 / 0, E = C !== 0 ? (b.height || 0) / 2 / Math.abs(C) : 1 / 0, M = Math.min(A, E);
      return { x: _ + S * M, y: x + C * M };
    };
    let d = null;
    const f = () => {
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
    }, u = (b, v) => {
      try {
        return i.point(b, v);
      } catch {
        return { x: o, y: r };
      }
    }, p = (b, v) => {
      let w;
      try {
        w = a.node.style.display, a.node.style.display = "none";
      } catch {
      }
      const _ = document.elementFromPoint(b, v);
      try {
        w !== void 0 && (a.node.style.display = w);
      } catch {
      }
      const S = _?.closest?.("[data-node-id]")?.getAttribute?.("data-node-id");
      if (S && S !== this.id) return e.nodes?.one?.(S) || null;
      try {
        const C = e.nodes?.allNodes || [];
        for (const A of C) {
          if (!A || A.id === this.id) continue;
          const E = document.querySelector(`#slateCanvas [data-node-id="${A.id}"]`)?.getBoundingClientRect?.(), M = 14;
          if (E && b >= E.left - M && b <= E.right + M && v >= E.top - M && v <= E.bottom + M)
            return A;
        }
      } catch {
      }
      return null;
    }, m = (b) => !!b && e.capabilitiesOf?.(b).canConnect === !1, g = (b) => {
      if (t.pointerId != null && b.pointerId !== t.pointerId) return;
      const v = u(b.clientX, b.clientY), w = p(b.clientX, b.clientY), _ = m(w) ? null : w;
      if (_ && _.options) {
        const x = _.options, S = (x.x || 0) + (x.width || 0) / 2, C = (x.y || 0) + (x.height || 0) / 2, A = (Nt, Vt, dt, gt) => {
          try {
            const At = Nt && Nt.svgGroup;
            if (At) {
              const ut = sn(At, [dt, gt]);
              if (ut && isFinite(ut[0]) && isFinite(ut[1]))
                return { x: ut[0], y: ut[1] };
            }
          } catch {
          }
          return h(Vt, dt, gt);
        }, E = A(_, x, o, r), M = A(this, this.options, S, C), k = E.x - M.x, N = E.y - M.y, O = Math.hypot(k, N) || 1, R = c(M.x - o, M.y - r, k, N), H = c(E.x - S, E.y - C, -k, -N), q = Math.max(30, Math.min(O * 0.45, 90)), J = M.x + R[0] * q, it = M.y + R[1] * q, Et = E.x + H[0] * q, St = E.y + H[1] * q;
        a.plot(
          `M ${M.x} ${M.y} C ${J} ${it} ${Et} ${St} ${E.x} ${E.y}`
        );
      } else
        a.plot(`M ${o} ${r} L ${v.x} ${v.y}`);
      if (_ !== (d?.node || null) && (f(), _ && _.backgroundRect)) {
        const x = _.backgroundRect;
        d = { node: _, _preHiStroke: x.attr("stroke") };
        try {
          x.attr({ stroke: "#007cff", "stroke-dasharray": "8,4", "stroke-opacity": 0.9 });
        } catch {
        }
      }
    }, y = (b) => {
      if (t.pointerId != null && b.pointerId !== t.pointerId) return;
      window.removeEventListener("pointercancel", y, !0), window.removeEventListener("pointermove", g, !0), window.removeEventListener("pointerup", y, !0), this._connectDragging = !1;
      try {
        a.remove(), l?.remove?.(), i.node.querySelectorAll(
          ".connect-drag-line"
        ).forEach((_) => _.remove());
      } catch {
      }
      if (f(), b.type === "pointercancel") return;
      const v = p(b.clientX, b.clientY);
      if (!m(v)) {
        if (v && v.id !== this.id)
          try {
            let w;
            try {
              const _ = u(b.clientX, b.clientY), x = v.options || {}, S = rn(
                { x: x.x || 0, y: x.y || 0, width: x.width || 1, height: x.height || 1, rotation: x.rotate?.rotationAngle || 0 },
                _
              ), C = Ni(S.x, S.y);
              C && (w = { targetAnchor: C });
            } catch {
            }
            this.relationships.addAssociation(v, w);
          } catch {
          }
        else if (!v)
          try {
            const w = u(b.clientX, b.clientY), _ = this.options, x = 16, S = w.x >= (_.x || 0) - x && w.x <= (_.x || 0) + (_.width || 0) + x && w.y >= (_.y || 0) - x && w.y <= (_.y || 0) + (_.height || 0) + x;
            if (!e.isReadOnly?.() && !S) {
              const E = e.addNode({
                x: Math.round(w.x - 60),
                y: Math.round(w.y - 35),
                width: 120,
                height: 70,
                text: ""
              });
              if (E) {
                E.announcedByCreator = !0;
                const M = () => {
                  try {
                    this.relationships.addAssociation(E);
                  } catch {
                  }
                  try {
                    e.nodes?.one?.(E.id) === E && this.beginNamingCreatedNode(E, "drop");
                  } catch {
                  }
                };
                E.ready?.then ? E.ready.then(M) : M();
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
      for (const r of Ze) this.connectionHandles[r]?.attr("tabindex", 0);
    }), t.on("focusout", (r) => {
      if (!t.node.contains(r.relatedTarget))
        for (const a of Ze) this.connectionHandles[a]?.attr("tabindex", -1);
    });
    const e = 8, i = "#007cff", s = "#ffffff", o = 2;
    Ze.forEach((r) => {
      if (!this.connectionHandles.container) return;
      const a = this.connectionHandles.container.circle(e * 2).fill(i).stroke({ color: s, width: o }).attr({ role: "button", tabindex: -1, "aria-label": Td[r] }).addClass(`connection-handle connection-handle-${r}`);
      a.node.style.cursor = "pointer", this.connectionHandles[r] = a, a.on(
        "mouseenter",
        () => this.showConnectionPreview(r)
      ), a.on("mouseleave", () => this.hideConnectionPreview()), a.on("keydown", (l) => {
        if (l.key === "Tab" && l.shiftKey && r === "top") {
          l.preventDefault(), this.svgGroup.node.focus();
          return;
        }
        if (l.key === "Tab" && !l.shiftKey && r === "left") {
          if (this.resizeRotate?.focusKnob()) {
            l.preventDefault();
            return;
          }
          this.svgGroup.node.focus();
          return;
        }
        if (l.key === "Escape") {
          this.svgGroup.node.focus();
          return;
        }
        l.key !== "Enter" && l.key !== " " || (l.preventDefault(), l.stopPropagation(), !(l.repeat || !this._connHandlesPinned || !this.canUseConnectionHandles()) && this.createConnectedNode(r, !0));
      }), a.on("click", (l) => {
        l.stopPropagation(), !(this.draggedPlug === a || !this.canUseConnectionHandles()) && (console.log(
          `CONNECTION_HANDLES_DEBUG: ${r} handle clicked on`,
          this.id
        ), this.createConnectedNode(r, l.detail === 0 && this._connHandlesPinned));
      }), a.node.style.touchAction = "none", a.on("pointerdown", (l) => {
        this.beginPlugGesture(l, a, l.pointerType === "touch" ? () => this.createConnectedNode(r) : void 0);
      });
    }), this.connectionHandles.container && this.connectionHandles.container.hide(), this.updateConnectionHandlePositions();
  }
  /** A touch on empty canvas can start at most 14 displayed CSS pixels from a selected plug. */
  beginNearbyTouchConnection(t) {
    if (!this.connectionHandlesVisible || !this.canUseConnectionHandles()) return !1;
    let e, i = 14;
    for (const r of Ze) {
      const a = this.connectionHandles[r];
      if (!a) continue;
      const l = a.node.getBoundingClientRect(), c = Math.hypot(t.clientX - l.left - l.width / 2, t.clientY - l.top - l.height / 2);
      l.width && c <= i && (e = { direction: r, handle: a }, i = c);
    }
    if (!e) return !1;
    const { direction: s, handle: o } = e;
    return this.beginPlugGesture(t, o, () => this.createConnectedNode(s)), !0;
  }
  beginPlugGesture(t, e, i) {
    if (this.slate.isReadOnly()) return;
    t.stopPropagation(), this.draggedPlug = void 0;
    const s = this.slate.canvas.node, o = (h) => h.preventDefault();
    i && s.addEventListener("touchstart", o, { capture: !0, passive: !1, once: !0 });
    const r = () => {
      s.removeEventListener("touchstart", o, !0), window.removeEventListener("pointermove", c, !0), window.removeEventListener("pointerup", l, !0), window.removeEventListener("pointercancel", a, !0);
    }, a = (h) => {
      h.pointerId === t.pointerId && r();
    }, l = (h) => {
      h.pointerId === t.pointerId && (r(), i?.());
    }, c = (h) => {
      h.pointerId !== t.pointerId || Math.hypot(h.clientX - t.clientX, h.clientY - t.clientY) <= 5 || (r(), this.draggedPlug = e, this.startConnectDrag(t));
    };
    window.addEventListener("pointermove", c, !0), window.addEventListener("pointerup", l, !0), window.addEventListener("pointercancel", a, !0);
  }
  updateConnectionHandlePositions() {
    if (!this.connectionHandles.container || !this.connectionHandlesVisible)
      return;
    const t = this.resizeTarget ?? this.backgroundRect;
    if (!t?.root?.()) return;
    const e = t.bbox(), { matrix: i } = this.restingGeometry(t), s = ([h, d], { a: f, b: u, c: p, d: m, e: g, f: y }) => [h * f + d * p + g, h * u + d * m + y], o = e.x + e.width / 2, r = e.y + e.height / 2, a = 35, l = 20, c = {
      top: [o, e.y - a],
      right: [e.x + e.width + l, r],
      bottom: [o, e.y + e.height + l],
      left: [e.x - l, r]
    };
    Object.entries(c).forEach(([h, d]) => {
      const f = this.connectionHandles[h];
      if (f) {
        const [u, p] = s(d, i);
        f.center(u, p);
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
    const i = this.options.width, s = this.options.height, o = 75, r = this.getRotation(), a = this.resizeTarget ?? this.backgroundRect, { matrix: l, cx: c, cy: h } = this.restingGeometry(a), d = this.connectionHandles[t];
    if (!d) {
      console.warn("CONNECTION_HANDLES_DEBUG: Handle not found for direction", t);
      return;
    }
    const f = d.bbox(), u = {
      x: f.x + f.width / 2,
      y: f.y + f.height / 2
    }, p = u.x - c, m = u.y - h, g = Math.sqrt(p * p + m * m), y = p / g, b = m / g, v = a.bbox(), w = v.x + v.width / 2, _ = v.y + v.height / 2, x = l.inverse(), S = y * x.a + b * x.c, C = y * x.b + b * x.d;
    let A, E;
    const M = Math.abs(S);
    Math.abs(C) > M ? C < 0 ? (A = w, E = v.y) : (A = w, E = v.y + v.height) : S < 0 ? (A = v.x, E = _) : (A = v.x + v.width, E = _);
    const N = ([At, ut], { a: Fe, b: Ue, c: Cn, d: vt, e: rr, f: ar }) => [At * Fe + ut * Cn + rr, At * Ue + ut * vt + ar], [O, R] = N([A, E], l), H = Math.sqrt(
      Math.pow(O - c, 2) + Math.pow(R - h, 2)
    ), q = H, J = H + o + q, it = c + y * J, Et = h + b * J, St = it - i / 2, Nt = Et - s / 2;
    if (!this.connectionPreview.container) {
      console.warn("CONNECTION_HANDLES_DEBUG: Preview container not found");
      return;
    }
    this.connectionPreview.node = this.createPreviewShape(
      this.connectionPreview.container,
      St,
      Nt,
      i,
      s,
      r
      // Pass rotation angle to preview
    );
    const dt = H + o - g, gt = {
      x: u.x + y * dt,
      y: u.y + b * dt
    };
    this.connectionPreview.connector = this.connectionPreview.container.line(u.x, u.y, gt.x, gt.y).stroke({ color: "#007cff", width: 2, opacity: 0.7 }).attr("pointer-events", "none"), this.addArrowheadToConnector(
      this.connectionPreview.container,
      u,
      gt
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
    const e = t.bbox(), i = t.root().screenCTM();
    let s;
    const o = Kh(t.node);
    if (o) {
      const l = new P(o);
      s = i.inverseO().multiplyO(l);
    } else
      s = i.inverseO().multiplyO(t.screenCTM());
    const r = e.x + e.width / 2, a = e.y + e.height / 2;
    return { matrix: s, cx: r * s.a + a * s.c + s.e, cy: r * s.b + a * s.d + s.f };
  }
  /** The outline the plug preview draws: any path shape but the plain rectangle (kept as the rounded ghost). */
  previewOutline() {
    if (String(this.options.vectorPath || this.options.shape || "rectangle").toLowerCase() !== "rectangle")
      return hs(this.options.shape, this.options.vectorPath);
  }
  createPreviewShape(t, e, i, s, o, r = 0) {
    let a;
    const l = this.options.backgroundColor || "#007cff", c = "#ffffff", h = 2, d = 0.6, f = e + s / 2, u = i + o / 2;
    switch (this.options.shape) {
      case "circle":
        const p = Math.min(s, o) / 2;
        a = t.circle(p * 2).center(f, u).fill(l).stroke({ color: c, width: h }).opacity(d), r !== 0 && a.rotate(r, f, u);
        break;
      case "ellipse":
        a = t.ellipse(s, o).center(f, u).fill(l).stroke({ color: c, width: h }).opacity(d), r !== 0 && a.rotate(r, f, u);
        break;
      default:
        if (this.options.svgContent) {
          a = t.rect(s, o).move(e, i).fill("none").stroke({ color: c, width: h }).opacity(d).radius(4);
          const m = t.nested().size(s, o).move(e, i);
          m.svg(this.options.svgContent), this._previewViewboxTimeoutId = setTimeout(() => {
            if (this._destroyed) return;
            const g = m.children()[0];
            if (g) {
              let y = g.bbox();
              (y.width <= 0 || y.height <= 0) && (y = this.calculatePathBounds(
                this.options.svgContent,
                s,
                o
              )), y.width > 0 && y.height > 0 && (m.viewbox(y.x, y.y, y.width, y.height), m.node.setAttribute("preserveAspectRatio", "none")), g.fill(l).opacity(d);
            }
          }, 1), m.attr("pointer-events", "none"), r !== 0 && (a.rotate(r, f, u), m.rotate(r, f, u));
        } else if (this.previewOutline()) {
          const m = this.previewOutline();
          a = t.nested().size(s, o).move(e, i);
          const g = a.path(m.path).fill(l).stroke({ color: c, width: h }).attr("vector-effect", "non-scaling-stroke");
          this.isCustomShape() && g.attr("fill-rule", this.options.fillRule === "evenodd" ? "evenodd" : "nonzero");
          try {
            const y = g.bbox();
            a.viewbox(y.width > 0 && y.height > 0 ? `${y.x} ${y.y} ${y.width} ${y.height}` : m.viewBox);
          } catch {
            a.viewbox(m.viewBox);
          }
          if (String(this.options.vectorPath || this.options.shape || "").toLowerCase() !== "circle" && a.attr("preserveAspectRatio", "none"), a.attr({ overflow: "visible", opacity: d }).attr("data-preview-shape", "path"), r !== 0) {
            const y = t.group();
            y.add(a), y.rotate(r, f, u);
          }
        } else
          a = t.rect(s, o).move(e, i).fill(l).stroke({ color: c, width: h }).opacity(d).radius(4), r !== 0 && a.rotate(r, f, u);
        break;
    }
    return a.attr("pointer-events", "none");
  }
  addArrowheadToConnector(t, e, i) {
    const s = i.x - e.x, o = i.y - e.y, r = Math.sqrt(s * s + o * o);
    if (r === 0) return;
    const a = s / r, l = o / r, c = 12, h = 6, d = i.x, f = i.y, u = d - a * c, p = f - l * c, m = -l * h, g = a * h, y = [
      [d, f],
      [u + m, p + g],
      [u - m, p - g],
      [d, f]
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
  /** @param focusChild the gesture came from the keyboard (or assistive technology) */
  createConnectedNode(t, e = !1) {
    console.log(
      "CONNECTION_HANDLES_DEBUG: Creating connected node in direction",
      t,
      "from",
      this.id
    );
    try {
      const i = this.options.width, s = this.options.height, o = 75, r = this.getRotation(), a = r * Math.PI / 180;
      let l = 0, c = 0;
      switch (t) {
        case "top":
          l = 0, c = -1;
          break;
        case "right":
          l = 1, c = 0;
          break;
        case "bottom":
          l = 0, c = 1;
          break;
        case "left":
          l = -1, c = 0;
          break;
      }
      const h = l * Math.cos(a) - c * Math.sin(a), d = l * Math.sin(a) + c * Math.cos(a), f = this.resizeTarget ?? this.backgroundRect, { matrix: u, cx: p, cy: m } = this.restingGeometry(f), g = f.bbox(), y = g.x + g.width / 2, b = g.y + g.height / 2;
      let v, w;
      switch (t) {
        case "top":
          v = y, w = g.y;
          break;
        case "right":
          v = g.x + g.width, w = b;
          break;
        case "bottom":
          v = y, w = g.y + g.height;
          break;
        case "left":
          v = g.x, w = b;
          break;
      }
      const _ = ([q, J], { a: it, b: Et, c: St, d: Nt, e: Vt, f: dt }) => [q * it + J * St + Vt, q * Et + J * Nt + dt], [x, S] = _([v, w], u), C = Math.sqrt(
        Math.pow(x - p, 2) + Math.pow(S - m, 2)
      ), A = C, E = C + o + A, M = p + h * E, k = m + d * E, N = M - i / 2, O = k - s / 2, R = this.cloneNodeOptions(N, O, r), H = this.slate.addNode(R);
      if (!H) {
        console.error("CONNECTION_HANDLES_DEBUG: Failed to create new node");
        return;
      }
      console.log(
        "CONNECTION_HANDLES_DEBUG: Created new node",
        H.id,
        "at",
        N,
        O
      ), this.hideConnectionPreview(), H.announcedByCreator = !0, H.ready.then(() => {
        this._destroyed || this.slate.getNode(this.id) !== this || this.slate.getNode(H.id) !== H || (this.connectToNode(H), this.canUseConnectionHandles() ? this.beginNamingCreatedNode(H, e ? "keyboard" : "plug") : this.slate.announce(`Node added: ${H.options.text || "(unnamed)"}`));
      }).catch((q) => console.error("Could not connect the new note", q));
    } catch (i) {
      console.error(
        "CONNECTION_HANDLES_DEBUG: Error creating connected node:",
        i
      );
    }
  }
  cloneNodeOptions(t, e, i) {
    const s = "node_" + Math.random().toString(36).substr(2, 9);
    return {
      ...this.options,
      id: s,
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
        rotationAngle: (i !== void 0 ? i : this.options.rotate?.rotationAngle) || 0
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
function Nd(n, t) {
  if (!n) return !1;
  const e = (i) => i ? `${i.x},${i.y}` : "";
  return n.childId === t.childId && e(n.targetPoint) === e(t.targetPoint);
}
class Pd {
  constructor(t) {
    this.nodes = /* @__PURE__ */ new Map(), this.unbuilt = /* @__PURE__ */ new Set(), this.slate = t;
  }
  add(t = {}) {
    if (t.id || (t.id = this.generateId()), this.nodes.has(t.id))
      return console.warn(`Node with id "${t.id}" already exists`), this.nodes.get(t.id);
    const e = new Hi(t, this.slate);
    this.nodes.set(e.id, e);
    const i = e.ready, s = () => {
      this.nodes.get(e.id) === e && this.slate.nodeAdded?.(e);
    };
    if (i && typeof i.then == "function") {
      this.unbuilt.add(i);
      const o = () => {
        this.unbuilt.delete(i);
      };
      i.then(o, o), i.then(s, () => {
      });
    } else
      s();
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
      this.allNodes.forEach((s) => {
        if (s.id !== t)
          try {
            const o = s.relationships;
            ((o?.getAssociations?.() || []).some((a) => a.childId === t) || o?.getAssociation?.(t)) && o.removeAssociation(t);
          } catch {
          }
      });
      const i = this.slate;
      return i?.getSelectedNodes?.()?.includes?.(e) && i.deselectNode?.(e), e.remove(), this.nodes.delete(t), !0;
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
    const i = this.nodes.get(t);
    if (i) {
      if (this.nodes.delete(t), e === "front") {
        this.nodes.set(t, i);
        return;
      }
      this.nodes = new Map([[t, i], ...this.nodes]);
    }
  }
  /**
   * Take a z-order result from the room: the notes `order` names go, in that
   * order, into the places those notes hold now; a note it does not name (one
   * added after the order was sent) keeps its place. Then the drawing follows
   * the list, the last note on top.
   */
  applyOrder(t) {
    const e = Array.from(this.nodes.keys()), i = t.filter((a, l) => this.nodes.has(a) && t.indexOf(a) === l), s = new Set(i);
    let o = 0;
    const r = e.map((a) => s.has(a) ? i[o++] : a);
    this.nodes = new Map(r.map((a) => [a, this.nodes.get(a)])), this.nodes.forEach((a) => a.svgGroup?.front?.());
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
   *  - v1: `data.nodeOptions: [{id, xPos, yPos, groupId, isLocked}]`
   *    (drag, arrangement, grouping, and group-lock broadcasts)
   */
  moveNodes(t, e = {}) {
    const i = t?.data ?? t ?? {}, s = e.animate === !1 || i.dur === 0 ? 0 : i.dur ?? 400, o = [];
    Array.isArray(i.nodes) && i.nodes.forEach(
      (r) => o.push({
        id: r.id,
        x: r.x,
        y: r.y,
        groupId: r.groupId,
        hasGroupId: Object.prototype.hasOwnProperty.call(r, "groupId"),
        isLocked: r.isLocked
      })
    ), Array.isArray(i.nodeOptions) && i.nodeOptions.forEach(
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
      a && (typeof r.x == "number" && typeof r.y == "number" && a.position(r.x, r.y, void 0, void 0, s), r.hasGroupId && (a.options.groupId = r.groupId || void 0), r.isLocked === !0 && !a.options.isLocked ? a.lock() : r.isLocked === !1 && a.options.isLocked && a.unlock());
    });
  }
  /** Create an association from a collab package: `{parentId, childId, ...opts}` */
  addRelationship(t, e = !1) {
    const { parentId: i, childId: s, targetPoint: o } = t || {}, r = i ? this.one(i) : void 0;
    if (!r) {
      console.warn("NODESMANAGER_DEBUG: addRelationship missing parent", i);
      return;
    }
    const a = [r].filter((h) => !h.relationships && h.ready);
    if (a.length && !e) {
      Promise.all(a.map((h) => h.ready)).then(() => this.addRelationship(t, !0)).catch((h) => console.warn("NODESMANAGER_DEBUG: addRelationship after ready failed", h));
      return;
    }
    const l = t.id;
    if (l) {
      const h = this.allNodes.find((d) => d.relationships?.hasAssociationId?.(l));
      if (h) {
        const d = h.relationships.getAssociations?.().find((f) => f.id === l);
        if (h === r && Nd(d, t)) return;
        h.relationships.removeAssociation(l);
      }
    } else if (r.relationships?.getAssociation?.(s))
      return;
    if (o) {
      r.relationships?.addFloatingAssociation(
        o,
        t
      );
      return;
    }
    const c = s ? this.one(s) : void 0;
    if (!c) {
      console.warn(
        "NODESMANAGER_DEBUG: addRelationship missing child",
        i,
        s
      );
      return;
    }
    r.relationships?.addAssociation(c, t);
  }
  /** Remove an association from a collab package: `{parentId, childId, id?}` */
  removeRelationship(t) {
    const { parentId: e, childId: i, id: s } = t || {}, o = e ? this.one(e) : void 0;
    !o || !i && !s || o.relationships?.removeAssociation(s || i);
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
function tr(n, t, e) {
  const i = t || n.nodes.allNodes, o = (typeof n.isDerivedNode == "function" ? i.filter((r) => !n.isDerivedNode(r)) : i).map(
    (r) => Od(r)
  );
  return e && o.forEach((r, a) => {
    r.options._presentationIndex = a;
  }), {
    options: Ld(n.options),
    nodes: o,
    shareId: n.options.shareId || ""
  };
}
async function er(n, t, e = !1, i = !1) {
  const s = typeof n == "string" ? JSON.parse(n) : n, o = e ? null : t.takeInlineDraft?.() ?? null;
  t.beginRemoteApply?.();
  try {
    const r = Dd(s, t, e, i);
    await (t.holdUntilLoaded?.(r) ?? r);
  } finally {
    t.endRemoteApply?.();
  }
  e || t.notifyNotesReplaced?.(), o && t.resumeInlineDraft?.(o);
}
async function Dd(n, t, e, i) {
  if (n.options) {
    const o = n.options;
    Object.assign(t.options, o), n.shareId && (t.options.shareId = n.shareId), t.applyContainerStyle?.();
  }
  if (!e) {
    t.nodes.clear();
    try {
      t.linesContainer?.clear?.();
    } catch {
    }
  }
  const s = /* @__PURE__ */ new Map();
  if (Array.isArray(n.nodes)) {
    for (const r of n.nodes) {
      const a = Id(r.options), l = t.nodes.one(a.id);
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
      const a = r.options.id || r.options.xPos !== void 0 ? Bi(r.options).id : r.options.id;
      if (!a) continue;
      const l = s.get(a) || t.nodes.one(a);
      if (!l) continue;
      const c = r.relationships?.associations;
      if (!(!Array.isArray(c) || c.length === 0))
        for (const h of c) {
          const d = vd(h);
          if (d.targetPoint && l?.relationships) {
            l.relationships.addFloatingAssociation(
              d.targetPoint,
              d
            );
            continue;
          }
          const f = s.get(d.childId) || t.nodes.one(d.childId);
          if (f && l)
            if (l.relationships)
              l.relationships.addAssociation(f, d);
            else
              try {
                l.connector.isEnabled() || l.connector.enable(), l.connector.connectTo(f, {
                  lineColor: d.lineColor,
                  lineWidth: d.lineWidth
                });
              } catch (u) {
                console.warn(
                  "SERIALIZATION_DEBUG: Failed to create connection",
                  d.parentId,
                  "->",
                  d.childId,
                  u
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
        const d = h.options.x ?? 0, f = h.options.width ?? 100;
        l = Math.min(l, d), c = Math.max(c, d + f);
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
function Od(n) {
  const t = lt(n.options);
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
    if (i?.associations) {
      const s = n.slate, o = (r) => typeof r == "string" && typeof s?.isDerivedNode == "function" && s.isDerivedNode(s.nodes?.one?.(r));
      e.push(
        ...i.associations.filter((r) => !o(r.childId)).map((r) => wd(r))
      );
    }
  } else if (n.connector) {
    const i = n.connector.getConnections();
    for (const s of i)
      (s.source === n || s.source?.id === n.id) && e.push({
        childId: s.target?.id || s.target,
        parentId: n.id,
        isStraightLine: !1,
        lineColor: s.lineColor || "#666666",
        lineEffect: "",
        lineOpacity: 1,
        lineType: "bezier",
        lineCurviness: 0.1,
        lineCurveType: "cubic",
        lineWidth: s.lineWidth || 3
      });
  }
  return {
    options: t,
    relationships: {
      associations: e
    }
  };
}
function Id(n) {
  return Bi(n);
}
function Ld(n) {
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
    "ai",
    // Which whole-slate replacement (undo/redo) this document already holds, so a
    // client that loads it does not rebuild the slate from the room's copy (Collab.ts).
    "collabBaseline"
  ];
  for (const i of e)
    n[i] !== void 0 && (t[i] = n[i]);
  return n.viewPort && (t.viewPort = { ...n.viewPort }), n.containerStyle && (t.containerStyle = { ...n.containerStyle }), t;
}
function zd(n) {
  return tr(n);
}
function vs(n, t) {
  if (typeof t != "string") return;
  const e = t.trim().toLowerCase();
  return n.find((i) => i.toLowerCase() === e);
}
const ft = (n) => ({
  store: (t, e) => {
    t[n] = e;
  },
  read: (t) => t[n]
}), Gd = ["solid", "dashed", "dotted", "combo"], Bd = ["front", "back"], Hd = ["left", "middle", "right"], Fd = ["top", "middle", "bottom"], un = Object.freeze({
  color: "showColorTab",
  text: "showTextTab",
  shape: "showShapeTab",
  picture: "showImageTab",
  effects: "showEffectTab",
  ask: "showAITab"
}), ws = Object.keys(un), nr = {
  text: { spec: () => ({ type: "string", maxLength: 1e4 }), description: "The note's text.", ...ft("text") },
  shape: {
    spec: (n) => ({ type: "shape", values: n.shapes }),
    description: "A shape registered with the engine (custom shapes read back as custom:<name>).",
    store: (n, t, e) => {
      if (t && typeof t == "object") {
        const s = gd(t);
        s.ok && yd(n, s.shape);
        return;
      }
      const i = vs(e.shapes, t);
      n.shape = i, n.vectorPath = i, n.shapeHint = i, delete n.fillRule, delete n.textBox, delete n.shapeRef;
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
  width: { spec: () => ({ type: "number", min: 20, max: 5e3 }), description: "Width in canvas units.", ...ft("width") },
  height: { spec: () => ({ type: "number", min: 20, max: 5e3 }), description: "Height in canvas units.", ...ft("height") },
  rotationAngle: {
    spec: () => ({ type: "number", min: -360, max: 360 }),
    description: "Rotation in degrees.",
    store: (n, t) => {
      n.rotate = { ...n.rotate || {}, rotationAngle: t }, delete n.rotationAngle;
    },
    read: (n) => Number(n.rotate?.rotationAngle ?? 0)
  },
  backgroundColor: { spec: () => ({ type: "color" }), description: "Fill colour.", ...ft("backgroundColor") },
  foregroundColor: {
    spec: () => ({ type: "color" }),
    description: "Text colour.",
    store: (n, t) => {
      n.foregroundColor = t, n.fontColor = t;
    },
    read: (n) => n.fontColor ?? n.foregroundColor
  },
  borderColor: { spec: () => ({ type: "color" }), description: "Border colour.", ...ft("borderColor") },
  borderWidth: { spec: () => ({ type: "number", min: 0, max: 100 }), description: "Border width.", ...ft("borderWidth") },
  borderOpacity: { spec: () => ({ type: "number", min: 0, max: 1 }), description: "Border opacity from 0 to 1.", ...ft("borderOpacity") },
  borderStyle: {
    spec: () => ({ type: "enum", values: Gd }),
    description: "Border line style.",
    ...ft("borderStyle")
  },
  opacity: { spec: () => ({ type: "number", min: 0, max: 1 }), description: "Note opacity from 0 to 1.", ...ft("opacity") },
  fontFamily: {
    spec: (n) => ({ type: "enum", values: n.fonts, caseless: !0 }),
    description: "A font this instance offers.",
    store: (n, t, e) => {
      n.fontFamily = vs(e.fonts, t);
    },
    read: (n) => n.fontFamily
  },
  fontSize: { spec: () => ({ type: "number", min: 1, max: 500 }), description: "Font size.", ...ft("fontSize") },
  textXAlign: { spec: () => ({ type: "enum", values: Hd }), description: "Horizontal text alignment.", ...ft("textXAlign") },
  textYAlign: { spec: () => ({ type: "enum", values: Fd }), description: "Vertical text alignment.", ...ft("textYAlign") },
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
    spec: () => ({ type: "list", values: ws }),
    description: "Controls left off this note's style bar: color (fill and border), text (text colour, size, alignment, font), shape, picture, effects, ask. The list replaces the note's whole list, so to hide one more, send the ones already hidden (the summary lists them) plus it. An empty list shows them all. Chat and exec can still change the note.",
    store: (n, t) => {
      for (const [e, i] of Object.entries(un)) n[i] = !t.includes(e);
    },
    read: (n) => ws.filter((t) => n[un[t]] === !1)
  },
  locked: {
    spec: () => ({ type: "boolean" }),
    description: "A locked note cannot be moved, changed or deleted until it is unlocked.",
    store: (n, t) => {
      n.isLocked = t;
    },
    read: (n) => n.isLocked === !0
  }
}, Ud = {
  order: {
    spec: { type: "enum", values: Bd },
    description: "Bring the note to the front or send it to the back."
  }
};
[...Object.keys(nr), ...Object.keys(Ud)];
const Yd = /* @__PURE__ */ new Set(["text", "shape", "x", "y", "width", "height"]);
Object.keys(nr).filter((n) => !Yd.has(n));
const xs = (n) => typeof n == "boolean", $d = {
  isCategory: xs,
  categoryName: (n) => typeof n == "string" && n.trim().length > 0 && n.length <= 200,
  ...Object.fromEntries(Object.values(un).map((n) => [n, xs]))
};
class Xd {
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
  /**
   * A note's plain data, set by chat and exec (operations keys templateCategory and
   * hiddenControls): only these keys ride on the package; null removes one.
   */
  onNodeOptionsChanged(t) {
    const e = this.slate.nodes.one(t.data.id);
    if (e)
      for (const [i, s] of Object.entries(t.data.options || {})) {
        const o = $d[i];
        o && (s == null ? delete e.options[i] : o(s) && (e.options[i] = s));
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
    const i = this.slate.nodes.one(t.data.id);
    i && (e === "front" ? i.toFront() : i.toBack());
  }
  onNodeShapeChanged(t) {
    const e = this.slate.nodes.one(t.data.id);
    if (!e) return;
    const i = { ...t.data };
    delete i.svgContent, delete i.svgString;
    for (const o of ["shape", "vectorPath"]) {
      const r = i[o];
      if (r != null && !qd(r)) {
        console.warn("[slatebox] ignored a shape change with an unreadable path");
        return;
      }
    }
    i.fillRule !== void 0 && i.fillRule !== "evenodd" && i.fillRule !== "nonzero" && delete i.fillRule;
    const s = i.shape ?? i.vectorPath;
    Object.assign(e.options, i), s && e.setShape(s, i.vectorPath);
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
        this.slate.nodes.one(i.id) || this.slate.nodes.add(Bi(i));
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
    e && (Object.assign(e.options, t.data), e.setSize(t.data.width, t.data.height), Number.isFinite(t.data.x) && Number.isFinite(t.data.y) && e.position(t.data.x, t.data.y));
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
    const i = t.data.filter;
    if (!i) return;
    const s = i.apply === "text" ? "text" : "vect", o = s === "text" ? "text" : "vect";
    if (i.isAnimation) {
      e.filters.removeAnimation(s), i.id && i.id !== "None" && i.id !== "none" && e.filters.applyAnimation(i.id, s);
      return;
    }
    const r = e.options.filters?.[o];
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
    e && await er(e, this.slate, !1, !0);
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
const Wd = /^[MmLlHhVvCcSsQqTtAaZz0-9.,\s+eE-]*$/;
function qd(n) {
  if (typeof n != "string" || n.length > 2e5) return !1;
  const t = n.trim();
  return /^[Mm]/.test(t) ? Wd.test(t) : /^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(t);
}
class Zd {
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
    let e = null, i = !1;
    const s = (a) => {
      e && (e = null, i && (i = !1, this.canvas.dispatch("panEnd", { event: a })));
    }, o = (a) => {
      if (!this.pansByTouch() || a.touches.length !== 1 || a.target !== t || a.defaultPrevented) {
        s(a);
        return;
      }
      const l = a.touches[0];
      e = { id: l.identifier, x: l.clientX, y: l.clientY }, i = !1;
    }, r = (a) => {
      if (!e) return;
      const l = a.touches.length === 1 && a.touches[0].identifier === e.id ? a.touches[0] : null;
      if (!l) {
        s(a);
        return;
      }
      const c = l.clientX - e.x, h = l.clientY - e.y;
      if (!i && Math.hypot(c, h) < 6) return;
      a.cancelable && a.preventDefault(), i || (i = !0, this.canvas.dispatch("panStart", { event: a }));
      const d = this.canvas.viewbox(), f = t.getBoundingClientRect(), u = d.width / (f.width || d.width), p = { x: d.x - c * u, y: d.y - h * u, width: d.width, height: d.height };
      e.x = l.clientX, e.y = l.clientY, this.canvas.dispatch("panning", { box: p, event: a }).defaultPrevented || this.canvas.viewbox(p.x, p.y, p.width, p.height);
    };
    t.addEventListener("touchstart", o, { passive: !0 }), document.addEventListener("touchmove", r, { passive: !1 }), document.addEventListener("touchend", s), document.addEventListener("touchcancel", s), this._touchPan = { start: o, move: r, end: s };
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
      const i = this.canvas.viewbox(), s = t.getBoundingClientRect(), o = s.width || i.width, r = i.width / o;
      if (e.ctrlKey || e.metaKey) {
        const a = Math.exp(-e.deltaY * 25e-4), l = this.options.zoomMin ?? 0.1, c = this.options.zoomMax ?? 10;
        let d = o / i.width * a;
        d = Math.max(l, Math.min(c, d));
        const f = o / d, u = i.height / i.width * f, p = e.clientX - s.left, m = e.clientY - s.top, g = i.x + p * r, y = i.y + m * (i.height / s.height || r), b = g - p / o * f, v = y - m / (s.height || o) * u;
        this.canvas.viewbox(b, v, f, u);
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
    const t = this.getViewportSize(), e = this.canvas.viewbox() || { x: 0, y: 0, width: t.w, height: t.h }, i = (e.x || 0) + (e.width || t.w) / 2, s = (e.y || 0) + (e.height || t.h) / 2;
    this.canvas.viewbox(i - t.w / 2, s - t.h / 2, t.w, t.h), this.fit();
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
    let e = 1 / 0, i = 1 / 0, s = -1 / 0, o = -1 / 0;
    for (const _ of t) {
      const x = _.options.x ?? 0, S = _.options.y ?? 0, C = _.options.width ?? 100, A = _.options.height ?? 60;
      e = Math.min(e, x), i = Math.min(i, S), s = Math.max(s, x + C), o = Math.max(o, S + A);
    }
    if (!isFinite(e)) return;
    const r = 50, a = this.getViewportSize(), l = a.w / a.h, c = this.slate?.boardChromes instanceof Set ? [...this.slate.boardChromes] : [];
    let h = e, d = i, f = s, u = o, p = 0, m = 0, g = 0, y = 0, b = 1;
    for (let _ = 0; _ < (c.length ? 4 : 1); _++) {
      h = e, d = i, f = s, u = o;
      for (const E of c) {
        let M = null;
        try {
          M = E.box(b);
        } catch {
          M = null;
        }
        !M || ![M.x, M.y, M.width, M.height].every(Number.isFinite) || (h = Math.min(h, M.x), d = Math.min(d, M.y), f = Math.max(f, M.x + M.width), u = Math.max(u, M.y + M.height));
      }
      g = f - h, y = u - d;
      const x = g + r * 2, S = y + r * 2, C = x / S;
      p = x, m = S, C > l ? m = p / l : p = m * l, p < a.w && (p = a.w, m = a.h);
      const A = a.w / p;
      if (Math.abs(A - b) < 5e-3) break;
      b = A;
    }
    const v = h + g / 2, w = d + y / 2;
    this.canvas.viewbox(
      v - p / 2,
      w - m / 2,
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
  fitWidth(t, e = 16, i = 1) {
    if (!this.isEnabled) return;
    const s = this.getViewportSize(), o = Math.min(i > 0 ? i : 1, this.options.zoomMax ?? 10), r = Math.max(s.w / o, t.width + e * 2), a = s.h / s.w * r, l = t.x + t.width / 2 - r / 2, c = t.height + e * 2 <= a ? t.y + t.height / 2 - a / 2 : t.y - e;
    this.canvas.viewbox(l, c, r, a);
  }
  center() {
    if (!this.isEnabled) return;
    const t = this.slate?.nodes?.allNodes, e = this.canvas.viewbox();
    if (!t || t.length === 0) return;
    let i = 1 / 0, s = 1 / 0, o = -1 / 0, r = -1 / 0;
    for (const c of t) {
      const h = c.options.x ?? 0, d = c.options.y ?? 0, f = c.options.width ?? 100, u = c.options.height ?? 60;
      i = Math.min(i, h), s = Math.min(s, d), o = Math.max(o, h + f), r = Math.max(r, d + u);
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
class Vd {
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
      if (!(i === t.node || i?.tagName === "svg") || e.pointerType === "touch" && this.slate.panZoom?.pansByTouch?.()) return;
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
        const c = l.options, h = c.x ?? 0, d = c.y ?? 0, f = c.width ?? 0, u = c.height ?? 0;
        h < t + i && h + f > t && d < e + s && d + u > e && r.push(l);
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
    const i = this.slate.getSelectedNodes().filter(
      (s) => !this.slate.governanceOf?.(s)
    );
    for (const s of i) {
      const o = (s.options.x || 0) + t, r = (s.options.y || 0) + e;
      s.position(o, r);
    }
  }
}
class jd {
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
const In = "data-export-omit", Kd = "data-export-never";
function Qd(n) {
  const t = n.nodes?.allNodes ?? [];
  if (typeof n.governanceOf != "function" || t.length === 0) return [];
  const e = /* @__PURE__ */ new Set();
  for (const o of t)
    n.governanceOf(o)?.capabilities?.exportable === !1 && e.add(o.id);
  if (e.size === 0) return [];
  const i = [], s = (o) => {
    o && typeof o.setAttribute == "function" && i.push(o);
  };
  for (const o of t) {
    e.has(o.id) && s(o.svgGroup?.node);
    for (const r of o.connector?.getConnections?.() ?? []) {
      if (!e.has(o.id) && !e.has(r?.target?.id)) continue;
      const a = r.connectable;
      s(a?.connector?.node), s(a?.hitArea?.node), s(a?.label?.node), s(a?.labelBg?.node);
    }
  }
  return i;
}
function Jd(n, t, e) {
  const i = Array.from(t.querySelectorAll("g[data-board-chrome]"));
  if (!i.length) return [];
  const s = n?.boardChromes instanceof Set ? Array.from(n.boardChromes) : [], o = [];
  for (const r of i) {
    if (r.hasAttribute("data-board-badges")) continue;
    const a = r.getAttribute("data-board-scope") ?? "main", l = i.find((h) => h.hasAttribute("data-board-badges") && (h.getAttribute("data-board-scope") ?? "main") === a) ?? null, c = s.find((h) => h.scope === a && !h.draft);
    if (e || !c || r.hasAttribute("data-workshop-draft")) {
      r.remove(), l?.remove();
      continue;
    }
    try {
      c.paintPlain(r, l);
      const h = c.plainBox();
      h && [h.x, h.y, h.width, h.height].every(Number.isFinite) && o.push(h);
    } catch {
      r.remove(), l?.remove();
    }
  }
  return o;
}
function ir(n, t = {}, e) {
  const i = n.canvas;
  if (!i) {
    const o = "";
    return e?.(o), o;
  }
  const s = Qd(n);
  try {
    for (const h of s) h.setAttribute(In, "");
    let o;
    try {
      o = i.node.cloneNode(!0);
    } finally {
      for (const h of s) h.removeAttribute(In);
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
      `[${Kd}]`,
      // Notes left out of exports by their host, and their lines.
      `[${In}]`
    ];
    for (const h of r)
      o.querySelectorAll(h).forEach((f) => f.remove());
    const a = Jd(n, o, !!(t.backgroundOnly || t.nodes));
    if (t.noBackground) {
      const h = o.querySelector("rect[data-background]");
      h && h.remove();
    }
    if (t.backgroundOnly)
      o.querySelectorAll("[data-node-id]").forEach((d) => d.remove());
    else if (t.nodes) {
      const h = new Set(
        t.nodes.map((f) => typeof f == "string" ? f : f.id)
      );
      o.querySelectorAll("[data-node-id]").forEach((f) => {
        const u = f.getAttribute("data-node-id");
        u && !h.has(u) && f.remove();
      });
    }
    try {
      const h = o.querySelectorAll("[data-node-id]");
      if (h.length > 0) {
        let f = 1 / 0, u = 1 / 0, p = -1 / 0, m = -1 / 0;
        for (const g of Array.from(h)) {
          const y = g.getAttribute("data-node-id"), v = n.nodes?.one?.(y)?.options;
          if (!v) continue;
          const w = v.x || 0, _ = v.y || 0, x = v.width || 0, S = v.height || 0, C = Number(
            typeof v.rotate == "object" ? v.rotate?.rotationAngle : v.rotate
          ) || 0;
          if (C) {
            const A = w + x / 2, E = _ + S / 2, M = C * Math.PI / 180, k = Math.cos(M), N = Math.sin(M);
            for (const [O, R] of [
              [w, _],
              [w + x, _],
              [w + x, _ + S],
              [w, _ + S]
            ]) {
              const H = O - A, q = R - E, J = A + H * k - q * N, it = E + H * N + q * k;
              f = Math.min(f, J), u = Math.min(u, it), p = Math.max(p, J), m = Math.max(m, it);
            }
          } else
            f = Math.min(f, w), u = Math.min(u, _), p = Math.max(p, w + x), m = Math.max(m, _ + S);
        }
        for (const g of a)
          f = Math.min(f, g.x), u = Math.min(u, g.y), p = Math.max(p, g.x + g.width), m = Math.max(m, g.y + g.height);
        if (isFinite(f) && p > f) {
          const g = p - f + 80, y = m - u + 40 * 2;
          o.setAttribute(
            "viewBox",
            `${f - 40} ${u - 40} ${g} ${y}`
          ), o.setAttribute("width", String(Math.round(g))), o.setAttribute("height", String(Math.round(y))), o.setAttribute("preserveAspectRatio", "xMidYMid meet");
        }
      }
    } catch {
    }
    let c = new XMLSerializer().serializeToString(o);
    return c = `<?xml version="1.0" encoding="UTF-8"?>
` + c, e?.(c), c;
  } catch (o) {
    console.error("EXPORT_DEBUG: SVG export failed:", o);
    const r = "";
    return e?.(r), r;
  }
}
const Ln = Object.freeze({ pictures: 40, bytes: 8 * 1024 * 1024, timeoutMs: 5e3 });
function tu(n) {
  return /<image\b[^>]*?\s(?:xlink:)?href="(?!data:)[^"]+"/.test(n);
}
async function eu(n, t = globalThis.fetch) {
  if (!t || typeof FileReader > "u") return n;
  const e = /(<image\b[^>]*?\s(?:xlink:)?href=")([^"]+)(")/g, i = /* @__PURE__ */ new Set();
  for (const a of n.matchAll(e)) {
    const l = a[2].replace(/&amp;/g, "&");
    !/^data:/i.test(l) && i.size < Ln.pictures && i.add(l);
  }
  if (!i.size) return n;
  const s = typeof document < "u" ? document.baseURI : void 0, o = async (a) => {
    let l;
    try {
      l = new URL(a, s);
    } catch {
      return null;
    }
    if (l.protocol !== "https:" && l.protocol !== "http:") return null;
    const c = typeof AbortController < "u" ? new AbortController() : null, h = setTimeout(() => c?.abort(), Ln.timeoutMs);
    try {
      const d = await t(l.href, { mode: "cors", credentials: "omit", signal: c?.signal });
      if (!d.ok) return null;
      const f = await d.blob();
      return !f.size || f.size > Ln.bytes || !/^image\//.test(f.type) ? null : await new Promise((u) => {
        const p = new FileReader();
        p.onload = () => u(typeof p.result == "string" ? p.result : null), p.onerror = () => u(null), p.readAsDataURL(f);
      });
    } catch {
      return null;
    } finally {
      clearTimeout(h);
    }
  }, r = /* @__PURE__ */ new Map();
  return await Promise.all([...i].map(async (a) => {
    const l = await o(a);
    l && r.set(a, l);
  })), r.size ? n.replace(e, (a, l, c, h) => {
    const d = r.get(c.replace(/&amp;/g, "&"));
    return d ? `${l}${d}${h}` : a;
  }) : n;
}
async function nu(n, t = {}, e) {
  const i = ir(n, t), s = i && tu(i) ? await eu(i) : i;
  if (!s) {
    const r = t.asBinary ? new Blob() : "";
    return e?.(r), r;
  }
  const o = t.scale || 2;
  try {
    const r = n.canvas;
    let a, l;
    const c = s.match(
      /viewBox="[\d.\-]+\s+[\d.\-]+\s+([\d.\-]+)\s+([\d.\-]+)"/
    );
    if (c)
      a = parseFloat(c[1]), l = parseFloat(c[2]);
    else {
      const y = r.viewbox();
      a = y.width, l = y.height;
    }
    const h = a * o, d = l * o, f = document.createElement("canvas");
    f.width = h, f.height = d;
    const u = f.getContext("2d");
    t.alpha || (u.fillStyle = n.options.containerStyle?.backgroundColor || "#ffffff", u.fillRect(0, 0, h, d));
    const p = new Image(), m = new Blob([s], {
      type: "image/svg+xml;charset=utf-8"
    }), g = URL.createObjectURL(m);
    return new Promise((y, b) => {
      p.onload = () => {
        if (u.drawImage(p, 0, 0, h, d), URL.revokeObjectURL(g), t.asBinary)
          f.toBlob(
            (v) => {
              const w = v || new Blob();
              e?.(w), y(w);
            },
            "image/png"
          );
        else {
          const v = f.toDataURL("image/png"), w = t.base64 ? v.split(",")[1] : v;
          e?.(w), y(w);
        }
      }, p.onerror = (v) => {
        URL.revokeObjectURL(g), console.error("EXPORT_DEBUG: PNG rendering failed:", v);
        const w = t.asBinary ? new Blob() : "";
        e?.(w), y(w);
      }, p.src = g;
    });
  } catch (r) {
    console.error("EXPORT_DEBUG: PNG export failed:", r);
    const a = t.asBinary ? new Blob() : "";
    return e?.(a), a;
  }
}
function $t(n, t) {
  if (n.t !== t.t) return n.t - t.t;
  if (n.c !== t.c) return n.c - t.c;
  const e = n.k ?? "", i = t.k ?? "";
  return e < i ? -1 : e > i ? 1 : 0;
}
const Dt = "onSlateReplaced", _s = /* @__PURE__ */ new Set([
  "onZoom",
  "onCanvasMove",
  "onFollowMeChanged",
  "onSlateFollowMeChanged",
  "onSlateHuddleChanged",
  "onCursorMoved",
  "onPresenceChanged",
  "onMouseMoved"
]);
function Ee(n, t) {
  return {
    t: typeof t.timestamp == "number" ? t.timestamp : 0,
    c: typeof t.clientID == "number" ? t.clientID : 0,
    k: n
  };
}
function Cs(n) {
  if (n.type !== "addRelationship" && n.type !== "removeRelationship") return null;
  const t = n.data?.id;
  return typeof t == "string" && t ? t : null;
}
const Es = (n, t) => $t(Ee(n.key, n.pkg), Ee(t.key, t.pkg)), Ot = "onNoteTraded", iu = 5e3, zn = (n) => "trade:" + n;
function Ve(n, t) {
  if (!n || n.type === Dt || n.type === Ot) return n;
  const e = n.data;
  if (!e || typeof e != "object") return n;
  if (Array.isArray(e)) {
    const r = e.filter((a) => a?.id !== t);
    return r.length === e.length ? n : r.length ? { ...n, data: r } : null;
  }
  const i = n.type === "onNodeAdded" && e.options && !e.nodeOptions;
  if (e.id === t && !i) return null;
  let s = e;
  for (const r of ["nodeOptions", "nodes"]) {
    const a = s[r];
    if (Array.isArray(a)) {
      const l = a.filter((c) => c?.id !== t);
      l.length !== a.length && (s = { ...s, [r]: l });
    } else a && typeof a == "object" && a.id === t && (s = { ...s, [r]: [] });
  }
  return s === e ? n : ["nodeOptions", "nodes"].every((r) => !Array.isArray(s[r]) || s[r].length === 0) && !i ? null : { ...n, data: s };
}
function su(n) {
  const t = globalThis.WebSocket;
  return typeof t != "function" ? null : class extends t {
    set onmessage(i) {
      super.onmessage = i ? (s) => typeof s.data == "string" ? n(s.data) : i.call(this, s) : null;
    }
    get onmessage() {
      return super.onmessage;
    }
  };
}
const Gn = /* @__PURE__ */ new Set(["onNodeToFront", "onNodeToBack"]), Ss = "node-order";
class ou {
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
        } catch (l) {
          console.warn(
            "COLLAB_DEBUG: onInitCollaboration threw; using static options",
            l
          );
        }
      s && (this.userBaseData = s, s.websocketUrl && (this.options.wsUrl = s.websocketUrl), s.websocketParams && (this.options.wsParams = s.websocketParams), s.userName && (this.options.userName = s.userName), s.color && (this.options.userColor = s.color), s.personKey && (this.options.personKey = String(s.personKey))), this.collabMap = this.doc.getMap("collabPackages"), this.collabMap.observe((l) => {
        l.transaction.local || this.applyRemoteChanges(l.keysChanged);
      });
      const r = su((l) => this.relayRefused(l));
      this.provider = new i(
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
        const l = this.getCollabUsers();
        this.options.onAwarenessChange?.(l), this.slate.options.events?.onCollaborationUsersChanged?.(l), this.renderRemoteCursors(l);
      };
      this.awareness.on("change", a), this.awareness.on(
        "update",
        ({
          added: l,
          updated: c,
          removed: h
        }) => {
          const d = Date.now();
          for (const f of l) this._cursorLastSeen.set(f, d);
          for (const f of c) this._cursorLastSeen.set(f, d);
          for (const f of h) this._cursorLastSeen.delete(f);
        }
      ), this.setupCursorTracking(), this.getCollabUsers().length > 0 && a(), this.provider.on("status", (l) => {
        this.isConnected = l.status === "connected", l.status !== "connected" && (this.synced = !1), l.status !== "connected" && this.clearRemoteCursors(), this.options.onStatusChange?.(l.status);
      }), this.provider.on("sync", (l) => this.roomSynced(l)), this.provider.synced && this.roomSynced(!0), this._cursorSweepTimer = setInterval(() => {
        this.slate?.canvas && this.awareness && this.renderRemoteCursors(this.getCollabUsers());
      }, 4e3), console.log(
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
      this.slate.screenGovernedPackage?.(i.type, i.data) !== null && (this.exe(i), this.slate.recordUndoFor?.(i.type));
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
    const e = (Array.isArray(t) ? t : [t]).flatMap((i) => {
      const s = this.slate.screenGovernedPackage?.(i.type, i.data);
      if (s === null) return [];
      const o = s === void 0 || s === i.data ? i : { ...i, data: s };
      if (Gn.has(o.type) && !Array.isArray(o.data?.order)) {
        const r = (this.slate.nodes?.allNodes || []).map((a) => a.id ?? a.options?.id);
        return [{ ...o, data: { ...o.data, order: r } }];
      }
      return [o];
    });
    if (this.collabMap)
      for (const i of e) {
        for (const a of this.fromRecord) Ve(i, a) !== i && this.fromRecord.delete(a);
        for (const a of this.staleTradesIn(i)) this.tellRoomOfTrade(a);
        const s = `${i.type}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        if (i.type === Dt) {
          const a = this.tick(), l = [...this.ownTrades.keys()], c = l.length && i.data && typeof i.data == "object" ? { ...i.data, held: l } : i.data, h = { ...i, data: c, clientID: this.clientID, timestamp: a }, d = () => {
            this.pruneBeforeSlateReplacement(), this.collabMap.set(s, h);
          };
          this.doc ? this.doc.transact(d) : d(), this.adoptBaseline({ t: a, c: this.clientID, k: s }), this.run(async () => {
            const f = this.beforeRemote();
            await this.dropRoomCards(new Set(l)), this.afterRemote(f);
          });
          continue;
        }
        i.type === "onLinePropertiesChanged" && this.pruneSupersededLineProperty(i.data);
        const o = { ...i, clientID: this.clientID, timestamp: this.tick() }, r = Cs(i);
        if (r && this.lineStamps.set(r, { t: o.timestamp, c: this.clientID, k: s }), i.type === "onNodeTextChanged" && typeof i.data?.text == "string" ? this.storeNodeText(s, o) : Gn.has(i.type) ? this.storeNodeOrder(o) : this.collabMap.set(s, o), i.type === "onNodeDeleted") {
          const a = i.data?.id;
          a != null && this.pruneNodePackages(a);
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
    const e = [], i = /* @__PURE__ */ new Set();
    let s = !1;
    for (const a of t) {
      const l = this.collabMap.get(a);
      if (l) {
        if (this.sawTime(l.timestamp), l.type === Dt) {
          s = !0;
          continue;
        }
        l.type !== Ot && (e.push({ key: a, pkg: l }), l.type === "onNodeTextChanged" && typeof l.data?.text == "string" && i.add(l.data.id));
      }
    }
    if (s) {
      const a = this.newestReplacement(), l = this.knownBaseline();
      if (a && (!l || $t(a.stamp, l) > 0)) {
        this.run(() => this.rebuildFrom(a));
        return;
      }
      this.dropOlderReplacements(a);
    }
    if (e.length === 0) {
      this.scheduleTradeFix();
      return;
    }
    e.sort(Es);
    const o = this.latestLabels(i), r = e.some(({ pkg: a }) => !_s.has(a.type));
    this.run(() => {
      const a = r ? this.beforeRemote() : null, l = this.applyInOrder(e, o), c = () => {
        this.scheduleTradeFix(), r && this.afterRemote(a);
      };
      if (l) return l.then(c);
      c();
    });
  }
  // Old clients gave every label edit a separate key. Even an untouched
  // pre-upgrade room must replay its latest stored label on a late join.
  latestLabels(t) {
    const e = /* @__PURE__ */ new Map();
    return t.size && this.collabMap.forEach((i, s) => {
      if (i.type !== "onNodeTextChanged" || typeof i.data?.text != "string" || !t.has(i.data.id)) return;
      const o = e.get(i.data.id), r = i.timestamp ?? 0;
      (!o || r > o.timestamp || r === o.timestamp && s > o.key) && e.set(i.data.id, { key: s, timestamp: r });
    }), new Map([...e].map(([i, s]) => [i, s.key]));
  }
  /**
   * Apply packages in the given order. Returns nothing when all of them could be
   * applied at once, or a promise when one had to wait for notes to be drawn or
   * for a document load to finish.
   */
  applyInOrder(t, e, i = 0, s = -1) {
    for (let o = i; o < t.length; o++) {
      if (!this.collabMap || !this.slate) return;
      const r = s === o ? null : this.slate.whenBuilt?.();
      if (r) return r.then(() => this.applyInOrder(t, e, o, o));
      const { key: a } = t[o];
      let { pkg: l } = t[o];
      const c = this.screenTraded(l);
      if (!c || this.staleLineChange(a, c)) continue;
      if (l = c, l.type === "onNodeTextChanged" && typeof l.data?.text == "string" && e.get(l.data.id) !== a) {
        const { text: d, ...f } = l.data;
        if (!Object.keys(f).some((u) => u !== "id")) continue;
        l = { ...l, data: f };
      }
      let h;
      try {
        h = this.applyRoomPackage(l);
      } catch (d) {
        console.warn("COLLAB_DEBUG: A package from the room could not be applied:", l.type, d);
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
    if (e && $t(t.stamp, e) <= 0) return;
    const i = !!this.baseline && this.baseline.c === this.clientID && this.clientID !== 0, s = this.hostChangeAt > 0 && Date.now() - this.hostChangeAt < iu, o = this.beforeRemote(), r = Array.isArray(t.pkg.data?.held) ? t.pkg.data.held : [], a = /* @__PURE__ */ new Map();
    for (const h of [...r, ...this.ownTrades.keys()]) {
      if (typeof h != "string" || a.has(h)) continue;
      const d = this.slate.nodes?.one?.(h);
      a.set(h, d ? lt(d.options) : null);
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
      const f = this.slate.nodes?.one?.(h);
      try {
        d && !f ? await this.handleRemotePackage({ type: "onNodeAdded", data: { id: h, nodeOptions: [{ ...d, id: h }] } }) : !d && f && await this.handleRemotePackage({ type: "onNodeDeleted", data: { id: h, isComment: !1 } });
      } catch (u) {
        console.warn("COLLAB_DEBUG: A note whose trade is on its way could not be kept:", u);
      }
    }
    await this.dropRoomCards(new Set(a.keys()));
    const l = [], c = /* @__PURE__ */ new Set();
    this.collabMap.forEach((h, d) => {
      !h || h.type === Dt || h.type === Ot || (l.push({ key: d, pkg: h }), h.type === "onNodeTextChanged" && typeof h.data?.text == "string" && c.add(h.data.id));
    }), l.sort(Es), await this.applyInOrder(l, this.latestLabels(c)), await this.enforceStaleTrades(), this.afterRemote(o), this.scheduleTradeFix(), (i || s) && this.slate && this.slate.emitSlateChange?.(Dt, { action: "superseded" });
  }
  /** Run a batch now if nothing from the room is still being applied, else after it. */
  run(t) {
    const e = () => {
      try {
        return t();
      } catch (o) {
        console.warn("COLLAB_DEBUG: Applying packages from the room failed:", o);
      }
    }, i = this.applying ? this.applying.then(e) : e();
    if (!i) return;
    const s = i.catch((o) => console.warn("COLLAB_DEBUG: Applying packages from the room failed:", o)).then(() => {
      this.applying === s && (this.applying = null);
    });
    this.applying = s;
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
    const i = () => {
      const s = (this.ownTrades.get(t) ?? 1) - 1;
      s > 0 ? this.ownTrades.set(t, s) : this.ownTrades.delete(t), this.scheduleTradeFix();
    };
    e.then(i, i);
  }
  /**
   * The slate handed its host a change (onSlateChanged), which the host saves. A whole-slate
   * replacement from someone else that this client rebuilds from soon after was not in that save:
   * the host is then handed the slate again, as rebuilt (see rebuildFrom).
   */
  noteHostChange(t) {
    _s.has(t) || (this.hostChangeAt = Date.now());
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
    const e = this.slate?.options, i = e?.collabTrades;
    !i || typeof i != "object" || !t && this.slate.isLoading?.() || (delete e.collabTrades, this.learnTrades(i.trades, i.through, !0));
  }
  learnTrades(t, e, i) {
    if (typeof e == "number" && e > this.tradesThrough && (this.tradesThrough = e), !t || typeof t != "object") return;
    const s = [];
    for (const [o, r] of Object.entries(t)) {
      if (!r || typeof r.r != "number" || r.as !== "card" && r.as !== "note") continue;
      const a = typeof r.id == "string" && r.id ? r.id : o, l = this.trades.get(a);
      if (!(l && l.r >= r.r))
        if (this.trades.set(a, r), this.tradeLines.set(a, r.as === "note" && Array.isArray(r.lines) ? r.lines.filter((c) => c && typeof c.id == "string") : []), i) {
          const c = this.slate?.nodes?.one?.(a);
          this.tradeTruth.set(a, c ? lt(c.options) : null), c && this.fromRecord.add(a);
        } else {
          const c = r.as === "note" ? r.note?.options : null;
          this.tradeTruth.set(a, c ? { ...c, id: a } : null), s.push(a);
        }
    }
    s.length && this.run(() => {
      const o = this.beforeRemote();
      return Promise.all(s.map((r) => this.enforceTrade(r))).then(() => this.afterRemote(o));
    }), this.scheduleTradeFix();
  }
  /** The newest trade of `id` the host told of is later than the one the room was told of. */
  staleTrade(t) {
    const e = this.trades.get(t);
    if (!e || !this.collabMap) return !1;
    const i = this.collabMap.get(zn(t));
    return (i?.type === Ot && typeof i.data?.r == "number" ? i.data.r : 0) < e.r;
  }
  staleTradesIn(t) {
    if (this.absorbLoadedTrades(), !this.trades.size || t?.type === Ot || t?.type === Dt) return [];
    const e = [];
    for (const i of this.trades.keys())
      Ve(t, i) !== t && this.staleTrade(i) && e.push(i);
    return e;
  }
  /** The package less what it says about notes whose trade the room has not been told of. */
  screenTraded(t) {
    if (this.absorbLoadedTrades(), !this.trades.size || !t) return t;
    let e = t;
    for (const i of this.trades.keys()) {
      if (!e) break;
      const s = Ve(e, i);
      s !== e && this.staleTrade(i) && (e = s);
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
      const i = e.id, s = this.fromRecord.has(i) && !this.ownTrades.has(i) && !!this.slate?.nodes?.one?.(i);
      if (this.fromRecord.delete(i), s) {
        const o = this.handleRemotePackage({ type: "onNodeDeleted", data: { id: i, isComment: !1 } });
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
    this.collabMap.forEach((i) => {
      if (i?.type !== Ot) return;
      const { trade: s, r: o } = i.data ?? {};
      if (typeof s != "string" || typeof o != "number" || t.has(s) || this.ownTrades.has(s)) return;
      const r = this.trades.get(s);
      if (r && r.r > o) return;
      (i.data.as ?? (r && r.r === o ? r.as : void 0)) === "card" && this.slate.nodes?.one?.(s) && e.push(s);
    });
    for (const i of e)
      try {
        await this.handleRemotePackage({ type: "onNodeDeleted", data: { id: i, isComment: !1 } });
      } catch (s) {
        console.warn("COLLAB_DEBUG: A note the room's trade record says is a card could not be taken off:", s);
      }
  }
  /** Draw note `id` as its trade says, when it is not: take it off, or put it on. */
  enforceTrade(t) {
    if (!this.slate || !this.tradeTruth.has(t) || this.ownTrades.has(t)) return;
    const e = this.tradeTruth.get(t), i = this.slate.nodes?.one?.(t);
    try {
      if (e === null && i) return this.handleRemotePackage({ type: "onNodeDeleted", data: { id: t, isComment: !1 } });
      if (e && !i) {
        this.fromRecord.add(t);
        const s = this.handleRemotePackage({ type: "onNodeAdded", data: { id: t, nodeOptions: [{ ...e, id: t }] } }), o = () => this.joinTradeLines(t);
        return s && typeof s.then == "function" ? s.then(o) : o();
      }
    } catch (s) {
      console.warn("COLLAB_DEBUG: A traded note could not be drawn as the server has it:", s);
    }
  }
  /** Draw the lines the server's record of a trade to a note joined it with (those both of whose notes are here). */
  joinTradeLines(t) {
    const e = [];
    for (const i of this.tradeLines.get(t) ?? [])
      try {
        const s = this.handleRemotePackage({ type: "addRelationship", data: { ...i } });
        s && typeof s.then == "function" && e.push(s);
      } catch (s) {
        console.warn("COLLAB_DEBUG: A traded note's line could not be drawn:", s);
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
      for (const i of t) {
        const s = this.trades.get(i);
        if (!s) continue;
        const o = [];
        this.collabMap.forEach((d, f) => {
          if (f === zn(i)) return;
          const u = Ve(d, i);
          u !== d && o.push([f, u]);
        });
        for (const [d, f] of o)
          f ? this.collabMap.set(d, f) : this.collabMap.delete(d);
        const r = s.as === "card" ? null : this.slate?.nodes?.one?.(i), a = s.as === "card" ? null : this.tradeTruth.get(i), l = r ? lt(r.options) : a, c = l ? { type: "onNodeAdded", data: { id: i, nodeOptions: { ...l, id: i }, traded: s.r } } : { type: "onNodeDeleted", data: { id: i, isComment: !1, traded: s.r } };
        this.fromRecord.delete(i);
        const h = `${c.type}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        if (this.collabMap.set(h, { ...c, clientID: this.clientID, timestamp: this.tick() }), l)
          for (const d of this.tradeLines.get(i) ?? []) {
            const f = `addRelationship_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
            this.collabMap.set(f, { type: "addRelationship", data: { ...d }, clientID: this.clientID, timestamp: this.tick() });
          }
        this.collabMap.set(zn(i), {
          type: Ot,
          data: { trade: i, r: s.r, as: s.as },
          clientID: this.clientID,
          timestamp: this.tick()
        });
      }
    };
    try {
      this.doc ? this.doc.transact(e) : e();
    } catch (i) {
      console.warn("COLLAB_DEBUG: The room could not be told of a trade:", i);
    }
  }
  /**
   * An add or remove of a line from the room that is older than the latest one this
   * screen has made or applied for that line: someone else's move of the line's end
   * that lost to a later one. True means skip it; otherwise it becomes the latest.
   */
  staleLineChange(t, e) {
    const i = Cs(e);
    if (!i) return !1;
    const s = Ee(t, e), o = this.lineStamps.get(i);
    return o && $t(s, o) < 0 ? !0 : (this.lineStamps.set(i, s), !1);
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
    return e && this.sawTime(e.t), this.baseline ? e ? $t(e, this.baseline) > 0 ? e : this.baseline : this.baseline : e;
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
    return this.collabMap?.forEach((e, i) => {
      if (e?.type !== Dt) return;
      const s = Ee(i, e);
      (!t || $t(s, t.stamp) > 0) && (t = { key: i, pkg: e, stamp: s });
    }), t;
  }
  /** Take replacements that lost to a later one out of the room. */
  dropOlderReplacements(t) {
    if (!this.collabMap) return;
    const e = this.knownBaseline(), i = [];
    if (this.collabMap.forEach((o, r) => {
      o?.type !== Dt || r === t?.key || e && $t(Ee(r, o), e) < 0 && i.push(r);
    }), i.length === 0) return;
    const s = () => i.forEach((o) => this.collabMap.delete(o));
    try {
      this.doc ? this.doc.transact(s) : s();
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
      this.collabMap.forEach((i, s) => {
        s !== Ss && Gn.has(i.type) && this.collabMap.delete(s);
      }), this.collabMap.set(Ss, t);
    };
    this.doc ? this.doc.transact(e) : e();
  }
  // Y.Map chooses one convergent label per node, including simultaneous
  // edits. Random keys retain every old label and replay them in varying order.
  storeNodeText(t, e) {
    const { id: i, text: s, ...o } = e.data, r = "node-text:" + i, a = () => {
      this.collabMap.forEach((l, c) => {
        if (c === r || l.type !== "onNodeTextChanged" || l.data?.id !== i || l.data.text === void 0) return;
        const { text: h, ...d } = l.data;
        Object.keys(d).some((f) => f !== "id") ? this.collabMap.set(c, { ...l, data: d }) : this.collabMap.delete(c);
      }), Object.keys(o).length && this.collabMap.set(t, { ...e, data: { id: i, ...o } }), this.collabMap.set(r, { ...e, data: { id: i, text: s } });
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
        this.collabMap.forEach((i, s) => {
          const o = i?.data;
          (o && !Array.isArray(o) ? o.id : void 0) === t && i?.type !== "onNodeDeleted" && e.push(s);
        });
        for (const i of e) this.collabMap.delete(i);
      } catch {
      }
  }
  /** Remove the mutation replay log before installing a full-state baseline. */
  pruneBeforeSlateReplacement() {
    if (this.collabMap)
      try {
        const t = [];
        this.collabMap.forEach((e, i) => {
          e?.type !== Ot && t.push(i);
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
    let i;
    const s = t.type, o = this.slate.screenGovernedPackage?.(t.type, t.data);
    if (o !== null) {
      if (o !== void 0 && o !== t.data && (t = { ...t, data: o }), typeof e[s] == "function") {
        this.slate.beginRemoteApply?.();
        try {
          const r = e[s](t);
          r && typeof r.then == "function" && (i = r.catch(
            (a) => console.warn("COLLAB_DEBUG: Async invoker failed:", s, a)
          ));
        } finally {
          this.slate.endRemoteApply?.();
        }
      } else
        console.warn("COLLAB_DEBUG: Unknown collab type:", s);
      return this.slate.options.events?.onCollaboration?.(t), i;
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
    const e = this.options.cursorStaleMs ?? 45e3, i = Date.now(), s = t.filter((r) => {
      if (!r.cursor) return !1;
      const a = this._cursorLastSeen.get(r.clientID);
      return a === void 0 ? (this._cursorLastSeen.set(r.clientID, i), !0) : i - a <= e;
    }), o = new Set(s.map((r) => r.clientID));
    for (const [r, a] of this.cursorElements)
      if (!o.has(r)) {
        try {
          a.remove();
        } catch {
        }
        this.cursorElements.delete(r), this._cursorLastSeen.delete(r);
      }
    for (const r of s)
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
      const i = t.userName && t.userName !== "Anonymous" ? t.userName : "";
      if (i) {
        const s = e.group(), o = s.text(i).font({ size: 12, family: "Roboto, Helvetica, Arial, sans-serif" }).fill(t.color);
        let r = 60, a = 16;
        try {
          const d = o.bbox();
          d && d.width && (r = d.width, a = d.height);
        } catch {
        }
        const l = 8, c = 4;
        s.rect(r + l * 2, a + c * 2).radius(6).fill("#fff").stroke({ color: t.color, width: 1 }).back(), o.move(l, c), s.transform({ translateX: 16, translateY: 6 });
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
    return this.awareness.getStates().forEach((i, s) => {
      s !== this.clientID && t.push({
        clientID: s,
        userName: i.user?.name || "",
        color: i.user?.color || "#999",
        key: typeof i.user?.key == "string" ? i.user.key : void 0,
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
function sr(n) {
  const { x: t, y: e, width: i, height: s } = n, o = n.rotationAngle || 0;
  if (!o) return { minX: t, minY: e, maxX: t + i, maxY: e + s };
  const r = t + i / 2, a = e + s / 2, l = o * Math.PI / 180, c = Math.cos(l), h = Math.sin(l);
  let d = 1 / 0, f = 1 / 0, u = -1 / 0, p = -1 / 0;
  for (const [g, y] of [[t, e], [t + i, e], [t + i, e + s], [t, e + s]]) {
    const b = g - r, v = y - a, w = r + b * c - v * h, _ = a + b * h + v * c;
    d = Math.min(d, w), f = Math.min(f, _), u = Math.max(u, w), p = Math.max(p, _);
  }
  const m = (g) => Math.round(g * 1e6) / 1e6;
  return { minX: m(d), minY: m(f), maxX: m(u), maxY: m(p) };
}
function ru(n, t) {
  if (t.length < 2) return [];
  const e = t.map(sr), i = Math.min(...e.map((c) => c.minX)), s = Math.max(...e.map((c) => c.maxX)), o = Math.min(...e.map((c) => c.minY)), r = Math.max(...e.map((c) => c.maxY)), a = (i + s) / 2, l = (o + r) / 2;
  return t.map((c, h) => {
    const d = e[h];
    let { x: f, y: u } = c;
    return n === "left" ? f += i - d.minX : n === "right" ? f += s - d.maxX : n === "centerH" ? f += a - (d.minX + d.maxX) / 2 : n === "top" ? u += o - d.minY : n === "bottom" ? u += r - d.maxY : n === "middle" && (u += l - (d.minY + d.maxY) / 2), { id: c.id, x: f, y: u };
  });
}
function au(n, t) {
  if (t.length < 3) return [];
  const e = t.map((f, u) => ({ box: f, index: u, b: sr(f) })), i = n === "horizontal", s = (f) => i ? f.b.minX : f.b.minY, o = (f) => i ? f.b.maxX - f.b.minX : f.b.maxY - f.b.minY, r = [...e].sort((f, u) => s(f) - s(u) || f.index - u.index), a = s(r[0]), c = (r.reduce((f, u) => Math.max(f, s(u) + o(u)), -1 / 0) - a - r.reduce((f, u) => f + o(u), 0)) / (r.length - 1), h = /* @__PURE__ */ new Map();
  let d = a;
  for (const f of r) {
    const u = d - s(f);
    h.set(f.index, {
      id: f.box.id,
      x: i ? f.box.x + u : f.box.x,
      y: i ? f.box.y : f.box.y + u
    }), d += o(f) + c;
  }
  return e.map((f) => h.get(f.index));
}
function li(n, t, e) {
  const i = Math.min(n.x + n.width + e - t.x, t.x + t.width + e - n.x), s = Math.min(n.y + n.height + e - t.y, t.y + t.height + e - n.y);
  return i > 0 && s > 0 ? { x: i, y: s } : null;
}
const lu = 4e6;
function cu(n, t, { gap: e = 20 } = {}) {
  const i = n.map((h) => ({ ...h })), s = t.map((h) => ({ ...h })), o = (h, d, f, u, p) => {
    const m = h.x + h.width / 2 - (d.x + d.width / 2), g = h.y + h.height / 2 - (d.y + d.height / 2);
    f.y <= f.x ? h.y += (g > 0 || g === 0 && p > 0 ? 1 : -1) * f.y * u : h.x += (m > 0 || m === 0 && p > 0 ? 1 : -1) * f.x * u;
  }, r = Math.max(1, i.length * (s.length + i.length / 2)), a = Math.max(1, Math.min(1e3, Math.floor(lu / r)));
  let l = !1;
  for (let h = 0; h < a; h += 1) {
    let d = !1;
    for (let f = 0; f < i.length; f += 1) {
      for (const u of s) {
        const p = li(i[f], u, e);
        p && (o(i[f], u, p, 1, 1), d = !0);
      }
      for (let u = f + 1; u < i.length; u += 1) {
        const p = li(i[f], i[u], e);
        p && (o(i[f], i[u], p, 0.5, -1), o(i[u], i[f], p, 0.5, 1), d = !0);
      }
    }
    if (!d) {
      l = !0;
      break;
    }
  }
  const c = (h) => Math.round(h * 100) / 100;
  for (const h of i)
    h.x = c(h.x), h.y = c(h.y);
  return l || hu(i, s, e), i.map(({ id: h, x: d, y: f }) => ({ id: h, x: d, y: f }));
}
function hu(n, t, e) {
  const i = [...t], s = [];
  for (const u of n)
    i.some((p) => li(u, p, e)) ? s.push(u) : i.push(u);
  if (!s.length) return;
  const o = Math.min(...n.map((u) => u.x)), r = i.length ? Math.max(...i.map((u) => u.y + u.height)) + e : Math.min(...n.map((u) => u.y)), a = i.length ? Math.max(...i.map((u) => u.x + u.width)) : o, l = s.reduce((u, p) => u + (p.width + e) * (p.height + e), 0), c = Math.max(a - o, Math.sqrt(l) * 1.5, ...s.map((u) => u.width));
  let h = o, d = r, f = 0;
  for (const u of s)
    h > o && h + u.width > o + c && (h = o, d += f + e, f = 0), u.x = h, u.y = d, h += u.width + e, f = Math.max(f, u.height);
}
function du(n, t = 20) {
  const e = n.nodes.allNodes, s = (n.freeNodes?.() ?? e).filter((c) => !c.options.isLocked);
  if (s.length < 1 || e.length < 2) return;
  const o = (c) => ({
    id: c.id ?? c.options.id,
    x: c.options.x || 0,
    y: c.options.y || 0,
    width: c.options.width || 100,
    height: c.options.height || 60
  }), r = new Set(s), l = cu(s.map(o), e.filter((c) => !r.has(c)).map(o), { gap: t }).filter((c, h) => {
    const d = s[h];
    return c.x !== (d.options.x || 0) || c.y !== (d.options.y || 0);
  });
  l.length && (l.forEach((c) => {
    s.find((d) => (d.id ?? d.options.id) === c.id).position(c.x, c.y);
  }), n.broadcast?.("onNodesMove", { nodes: l }));
}
function uu(n, t, e, i = !1) {
  const s = i ? 0 : 500;
  let o = 0;
  for (const r of t) {
    const a = n.nodes.one(r.id);
    a && !n.governanceOf?.(a) ? a.position(r.x, r.y, () => {
      o++, o >= t.length && e && e();
    }, void 0, s) : o++;
  }
  t.length === 0 && e && e();
}
function fu(n) {
  return (n.freeNodes?.() ?? n.nodes.allNodes).map((t) => ({
    id: t.id,
    x: t.options.x || 0,
    y: t.options.y || 0
  }));
}
class pu {
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
    const i = (this.slate.element?.clientWidth || (typeof innerWidth == "number" ? innerWidth : 1024)) < 600;
    if (i === this.compact) return;
    this.compact = i, t.toggleAttribute("data-compact", i);
    const s = this.options.position.startsWith("top"), o = i ? 12 : 16, r = i || this.options.position === "top-right" ? `right: ${o}px;` : `left: ${o}px;`, a = t.style.display === "none" ? "none" : "flex";
    t.style.cssText = `
      position: absolute;
      ${s ? "top" : "bottom"}: calc(var(--slatebox-zoom-offset, 0px) + ${o}px); ${r}
      display: ${a};
      flex-direction: ${i ? "column" : "row"};
      align-items: center;
      gap: ${i ? 0 : 2}px;
      background: var(--slatebox-zoom-bg, rgba(255, 255, 255, 0.94));
      color: var(--slatebox-zoom-ink, #1f3d33);
      border: 1px solid var(--slatebox-zoom-line, #d9ddcf);
      box-shadow: 0 2px 10px rgba(20, 40, 30, 0.10);
      padding: ${i ? "4px 0" : "2px 6px"};
      border-radius: ${i ? 14 : 999}px;
      z-index: 1000;
      font-family: var(--slatebox-board-font, system-ui, sans-serif);
      font-size: 12px;
      font-variant-numeric: tabular-nums;
      user-select: none;
    `;
    for (const c of [this.fitButton, this.zoomOutButton, this.zoomInButton])
      c.style.cssText = `background:none;border:none;color:inherit;cursor:pointer;font-size:${i ? 20 : 16}px;line-height:1;width:${i ? 40 : 28}px;height:${i ? 40 : 28}px;border-radius:999px;display:grid;place-items:center;padding:0;font-family:inherit;`;
    this.slider.style.cssText = i ? "display:none" : "width: 72px; cursor: pointer; accent-color: var(--slatebox-zoom-ink, #1f3d33);", this.label.style.cssText = i ? "font-size:11px;font-weight:600;padding:2px 0;opacity:.85" : "min-width: 38px; text-align: right; font-weight: 600; padding-right: 4px;", this.rule.style.cssText = i ? "width:20px;height:1px;background:var(--slatebox-zoom-line,#d9ddcf);margin:2px 0" : "width:1px;height:16px;background:var(--slatebox-zoom-line,#d9ddcf);margin:0 2px";
    const l = i ? [this.zoomInButton, this.label, this.zoomOutButton, this.rule, this.fitButton] : [this.fitButton, this.rule, this.zoomOutButton, this.slider, this.zoomInButton, this.label];
    for (const c of l) t.appendChild(c);
    i && this.slider.remove();
  }
  create() {
    if (!this.slate.element) return;
    this.slate.element.style.position = this.slate.element.style.position || "relative", this.container = document.createElement("div"), this.container.className = "slatebox-zoom-slider";
    const t = (i, s, o) => {
      const r = document.createElement("button");
      return r.type = "button", r.textContent = i, r.title = s, r.setAttribute("aria-label", s), r.onclick = o, r;
    };
    this.fitButton = t("⤢", "Fit to content", () => this.slate.fitToContent?.()), this.fitButton.setAttribute("aria-label", "fitToContent"), this.zoomOutButton = t("−", "Zoom out", () => this.slate.zoomOut?.()), this.zoomInButton = t("+", "Zoom in", () => this.slate.zoomIn?.()), this.slider = document.createElement("input"), this.slider.type = "range", this.slider.min = String(this.options.minZoom), this.slider.max = String(this.options.maxZoom), this.slider.step = "0.1", this.slider.value = "1", this.slider.setAttribute("aria-label", "Zoom"), this.slider.oninput = () => {
      const i = parseFloat(this.slider.value);
      this.slate.zoom?.(i), this.update();
    }, this.label = document.createElement("span"), this.label.className = "slatebox-zoom-label", this.label.textContent = "100%", this.rule = document.createElement("div"), this.rule.setAttribute("aria-hidden", "true"), this.arrange(), typeof ResizeObserver < "u" && (this._sizeObserver = new ResizeObserver(() => this.arrange()), this._sizeObserver.observe(this.slate.element)), this.slate.element.appendChild(this.container), this.update();
    const e = this.slate.canvas?.node;
    e && typeof MutationObserver < "u" && (this._viewObserver = new MutationObserver(() => this.update()), this._viewObserver.observe(e, { attributes: !0, attributeFilter: ["viewBox"] }));
  }
}
const mu = (n) => n < 0.5 ? 4 * n * n * n : 1 - Math.pow(-2 * n + 2, 3) / 2, or = (n) => Math.min(1, Math.max(0, n));
function gu(n, t, e = {}) {
  const i = Math.max(1, n.width), s = Math.max(1, n.height), o = e.top ?? 0, r = e.bottom ?? 0, a = e.fill ?? 0.9, l = Math.max(1, t.h - o - r), c = Math.abs(e.roll ?? 0) * Math.PI / 180, h = Math.abs(Math.cos(c)), d = Math.abs(Math.sin(c)), f = e.cover ? i : i * h + s * d, u = e.cover ? s : i * d + s * h;
  let p = e.cover ? Math.max(t.w / i, t.h / s) : Math.min(t.w * a / f, l * a / u);
  return e.maxScale && p > e.maxScale && (p = e.maxScale), {
    cx: n.x + n.width / 2,
    cy: n.y + n.height / 2,
    scale: p,
    roll: e.roll ?? 0,
    dy: e.cover ? 0 : (o - r) / 2
  };
}
function yu(n, t, e, i, s = "prezi", o = mu) {
  if (e >= 1 || s === "cut") return { ...t };
  if (e <= 0) return { ...n };
  const r = o(e), a = Math.log(n.scale), l = Math.log(t.scale);
  let c = a + (l - a) * r, h = r;
  if (s === "prezi") {
    const d = Math.hypot(t.cx - n.cx, t.cy - n.cy) * Math.min(n.scale, t.scale) / Math.max(1, Math.min(i.w, i.h)), f = Math.min(2.2, 0.9 * Math.log(1 + d + Math.abs(l - a) * 0.4));
    c -= f * Math.sin(Math.PI * r), h = o(or((e - 0.12) / 0.76));
  }
  return {
    cx: n.cx + (t.cx - n.cx) * h,
    cy: n.cy + (t.cy - n.cy) * h,
    scale: Math.exp(c),
    roll: n.roll + (t.roll - n.roll) * r,
    dy: n.dy + (t.dy - n.dy) * r
  };
}
function bu(n, t, e) {
  const i = -n.roll * Math.PI / 180, s = -Math.sin(i) * n.dy, o = Math.cos(i) * n.dy, r = (e ?? t.w) / n.scale, a = (e ?? t.h) / n.scale, l = n.cx - s / n.scale, c = n.cy - o / n.scale;
  return { x: l - r / 2, y: c - a / 2, width: r, height: a };
}
function vu(n, t, e) {
  const i = Math.hypot(t.cx - n.cx, t.cy - n.cy) * Math.min(n.scale, t.scale) / Math.max(1, Math.min(e.w, e.h)), s = Math.abs(Math.log(t.scale / n.scale));
  return Math.round(Math.min(2e3, 900 + i * 260 + s * 180));
}
const Bn = () => {
  const n = new Error("The camera flight was aborted.");
  return n.name = "AbortError", n;
};
class wu {
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
    let e = 1 / 0, i = 1 / 0, s = -1 / 0, o = -1 / 0;
    for (const r of t) {
      const l = this.slate?.nodes?.one?.(r)?.options;
      l && (e = Math.min(e, l.x ?? 0), i = Math.min(i, l.y ?? 0), s = Math.max(s, (l.x ?? 0) + (l.width ?? 0)), o = Math.max(o, (l.y ?? 0) + (l.height ?? 0)));
    }
    return Number.isFinite(e) ? { x: e, y: i, width: s - e, height: o - i } : null;
  }
  /** The camera that frames `target`, or null when it frames nothing. */
  resolve(t, e = !1) {
    const i = e ? 0 : t.roll ?? 0;
    if (t.state)
      return { cx: 0, cy: 0, scale: 1, dy: 0, ...this.current(), ...t.state, roll: e ? 0 : t.state.roll ?? i };
    const s = t.bbox ?? (t.nodeIds ? this.boxOf(t.nodeIds) : null);
    return s ? gu(s, this.viewport(), { ...t, roll: i }) : null;
  }
  /** Show `cam` at once. */
  apply(t) {
    const e = bu(t, this.viewport(), this.hostSide);
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
    const i = !!e.reduced, s = this.resolve(t, i);
    if (!s) return Promise.resolve(this.current());
    const o = this.current(), r = i || !o ? "cut" : e.arc ?? "prezi", a = this.viewport(), l = e.duration ?? (o ? vu(o, s, a) : 0);
    if (r === "cut" || l <= 0 || typeof requestAnimationFrame > "u")
      return e.signal?.aborted ? Promise.reject(Bn()) : (this.apply(s), e.onFrame?.(s, 1), Promise.resolve({ ...s }));
    const c = new Promise((h, d) => {
      let f = null, u = !1;
      const p = (y) => {
        if (!u) {
          if (u = !0, this.raf != null)
            try {
              cancelAnimationFrame(this.raf);
            } catch {
            }
          this.raf = null, this.cancelCurrent = null, e.signal?.removeEventListener?.("abort", m), y ? d(y) : h({ ...s });
        }
      }, m = () => p(Bn());
      if (e.signal?.aborted) {
        p(Bn());
        return;
      }
      e.signal?.addEventListener?.("abort", m), this.cancelCurrent = m;
      const g = (y) => {
        if (u) return;
        f === null && (f = y);
        const b = or((y - f) / l), v = yu(o, s, b, a, r, e.ease);
        this.apply(v), e.onFrame?.(v, b), b < 1 ? this.raf = requestAnimationFrame(g) : p();
      };
      this.raf = requestAnimationFrame(g);
    });
    return c.catch(() => {
    }), c;
  }
  destroy() {
    this.stop(), this.rollHost = null, this.slate = null;
  }
}
const As = xn + ln / 2 + 4;
function xu(n) {
  return { left: n.left, top: n.top, right: n.right, bottom: n.bottom, width: n.right - n.left, height: n.bottom - n.top };
}
const fn = class fn {
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
    return {
      availableFilters: nd(),
      availableAnimations: Qh()
    };
  }
  init() {
    this.canvas = Ri().addTo(this.element), this.canvas.node.setAttribute("role", this.options.enabled === !1 ? "img" : "group"), this.canvas.node.setAttribute("aria-label", this.options.name || "Diagram canvas"), this.canvas.node.setAttribute("tabindex", "0"), this._liveRegion = document.createElement("div"), this._liveRegion.setAttribute("aria-live", "polite"), this._liveRegion.setAttribute("aria-atomic", "true"), this._liveRegion.style.cssText = "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;", this.element.appendChild(this._liveRegion), this.element.style.overflow = this.element.style.overflow || "hidden", getComputedStyle(this.element).position === "static" && (this.element.style.position = "relative");
    const t = this.canvas.node;
    t?.style && (t.style.width = "100%", t.style.height = "100%", t.style.display = "block"), t?.removeAttribute?.("width"), t?.removeAttribute?.("height"), t?.setAttribute?.("preserveAspectRatio", "xMidYMid slice");
    const e = this.element.getBoundingClientRect();
    this.options.viewPort = this.options.viewPort || {};
    const i = this.options.viewPort.originalWidth || Math.round(e.width) || 800, s = this.options.viewPort.originalHeight || Math.round(e.height) || 600;
    this.options.viewPort.originalWidth = i, this.options.viewPort.originalHeight = s;
    const o = this.options.viewPort.left ?? 0, r = this.options.viewPort.top ?? 0;
    this.canvas.viewbox(o, r, i, s), this._setupResizeObserver(), this.nodes = new Pd(this), this.invoker = new Xd(this), this.applyContainerStyle(), this.setupSelectionHandling(), this.options.viewPort?.showCoordinates && this.setupCoordinateCallbacks(), this.setupFrameCallbacks(), this.panZoom = new Zd(this, this.options.panZoom);
    const a = fh();
    if (a && (this.birdsEye = new a.BirdsEye(this, this.options.birdsEye)), this.options.birdsEye?.enabled) {
      const b = () => {
        this._birdsEyeTimeoutId = setTimeout(() => {
          this._destroyed || this.birdsEye.enable();
        }, 200);
      };
      this.birdsEye ? b() : ph().then((v) => {
        this._destroyed || (this.birdsEye = new v.BirdsEye(this, this.options.birdsEye), b());
      }).catch((v) => console.warn("SLATE: the bird's-eye view could not load", v));
    }
    const l = (b) => {
      this.undoRedo = new b.UndoRedo(this, {
        enabled: this.options.showUndoRedo !== !1
      });
      for (const [v, w] of this._undoListenersWaiting) w(this.undoRedo.subscribe?.(v) ?? (() => {
      }));
      this._undoListenersWaiting.clear(), this.undoRedo.snap?.(!0);
    }, c = mh();
    c ? l(c) : gh().then((b) => {
      this._destroyed || l(b);
    }).catch((b) => console.warn("SLATE: the undo history could not load", b)), this.setupUndoGestures(), this.multiSelection = new Vd(this, {
      enabled: this.options.showMultiSelect !== !1
    }), this.grid = new jd(this, {
      enabled: this.options.viewPort?.showGrid || !1,
      gridSize: this.options.viewPort?.gridSize || 20,
      // Re-apply the persisted snap-to-grid setting so it survives reload.
      snapToGrid: this.options.viewPort?.snapToGrid || !1
    }), this.options.viewPort?.showGrid && this.grid.show();
    const h = (b) => {
      this.keyboard = new b.Keyboard(this), this.options.enabled !== !1 && this.keyboard.bindGlobal();
    }, d = xh();
    d ? h(d) : _h().then((b) => {
      !this._destroyed && !this.keyboard && h(b);
    }).catch((b) => console.warn("SLATE: the keyboard could not load", b));
    const f = (b) => {
      this.mediaInput = new b.MediaInput(this), this.options.enabled !== !1 && this.mediaInput.enable();
    }, u = yh();
    u ? f(u) : this.options.enabled !== !1 && bh().then((b) => {
      !this._destroyed && !this.mediaInput && f(b);
    }).catch((b) => console.warn("SLATE: the video-address paste could not load", b));
    const p = (b) => {
      this.contextMenu = new b.ContextMenu(this), this.options.enabled !== !1 && this.contextMenu.enable();
    }, m = vh();
    m ? p(m) : this.options.enabled !== !1 && wh().then((b) => {
      !this._destroyed && !this.contextMenu && p(b);
    }).catch((b) => console.warn("SLATE: the right-click menu could not load", b)), this.collab = new ou(this), this.zoomSlider = new pu(this, {
      enabled: this.options.showZoom || !1
    });
    const g = (b) => {
      this.presentation = new b.Presentation(this);
    }, y = Ch();
    y ? g(y) : Eh().then((b) => {
      !this._destroyed && !this.presentation && g(b);
    }).catch((b) => console.warn("SLATE: the presentation mode could not load", b)), this.camera = new wu(this), this.makeResponsive(), this.options.viewPort?.showCoordinates && (this._coordDisplayTimeoutId = setTimeout(() => {
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
        (i) => i !== this
      ));
    }
    this._birdsEyeTimeoutId !== null && (clearTimeout(this._birdsEyeTimeoutId), this._birdsEyeTimeoutId = null), this._coordDisplayTimeoutId !== null && (clearTimeout(this._coordDisplayTimeoutId), this._coordDisplayTimeoutId = null), this._nodeNotifyTimeoutId !== null && (clearTimeout(this._nodeNotifyTimeoutId), this._nodeNotifyTimeoutId = null), this._coordinateIntervalId !== null && (clearInterval(this._coordinateIntervalId), this._coordinateIntervalId = null);
    const t = this.element.querySelector("#slate-coordinates");
    t && t.remove(), this.canvas.off("click"), this._windowPointerDownHandler && (window.removeEventListener("pointerdown", this._windowPointerDownHandler, !0), this._windowPointerDownHandler = null), this._lastPointerDown = null, this.panZoom && this.panZoom.destroy(), this.birdsEye && this.birdsEye.disable(), this.zoomSlider && this.zoomSlider.destroy(), this.keyboard && this.keyboard.unbindGlobal(), this.mediaInput && this.mediaInput.destroy(), this.contextMenu && this.contextMenu.disable(), this.multiSelection && this.multiSelection.disable();
    for (const [e, i, s] of this._undoGestureHandlers) s.removeEventListener(e, i, !0);
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
    const i = this.options.events?.onSlateChanged;
    if (!i) return;
    const s = { type: t, data: e };
    if (this.options.instance && (s.instanceId = this.options.instance), this._emitDeferred) {
      this._emitQueue.push(s);
      return;
    }
    this.collab?.noteHostChange?.(t);
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
    if (!(this._applyingRemote > 0 || this._onlyHere > 0 || this._destroyed)) {
      if (this._dragPolicies.length) {
        if (this._policyAuthority > 0) return;
        this.offerGovernedLine(t, e);
        const i = this.screenGovernedPackage(t, e);
        if (i === null) return;
        i !== void 0 && (e = i);
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
    const e = t.filter((s) => {
      const o = s.data?.id;
      return (s.type === "onNodeAdded" || s.type === "onNodeDeleted") && typeof o == "string" && this.collab?.tellRoomOfTrade?.(o) === !0;
    });
    for (const s of e) this.emitSlateChange(s.type, s.data);
    const i = t.filter((s) => !e.includes(s));
    if (i.length)
      if (typeof this.collab?.send == "function")
        this.collab.send(i);
      else
        for (const s of i) this.emitSlateChange(s.type, s.data);
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
    this._othersChange > 0 || this.undoRedo && !fn.NON_UNDOABLE.has(t) && (t === "onNodeDeleted" && typeof this.undoRedo.snapAfterGesture == "function" ? this.undoRedo.snapAfterGesture() : t === "onNodeTextChanged" && this.undoRedo.inGesture?.() ? this.undoRedo.forceSnapshot?.() : this.undoRedo.snap?.());
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
      const l = a.target;
      !l || !this.element?.contains(l) || this._undoPointers.has(a.pointerId) || (this._undoPointers.size || this.undoRedo?.beginGesture?.(), this._undoPointers.add(a.pointerId));
    }, i = (a) => t(a.pointerId), r = [
      ["pointerdown", e, window],
      ["pointerup", i, window],
      ["pointercancel", i, window],
      ["blur", () => t(), window],
      ["visibilitychange", () => {
        document.visibilityState === "hidden" && t();
      }, document]
    ];
    for (const [a, l, c] of r) c.addEventListener(a, l, !0);
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
      const i = (s) => {
        e = s;
      };
      return this._undoListenersWaiting.set(t, i), () => {
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
    let i;
    try {
      i = await t();
    } finally {
      this._othersChange--, this.undoRedo?.absorbRemote?.(e);
    }
    return i;
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
    const i = new Promise((o) => {
      e = setTimeout(() => {
        t.forEach((r) => this._loadsInFlight.delete(r)), this.nodes?.stopWaitingFor?.(t), o();
      }, 5e3);
    }), s = Promise.allSettled(t).then(() => clearTimeout(e));
    return Promise.race([s, i]);
  }
  /** Tell a host's bar over the selection when the view pans or zooms. */
  setupFrameCallbacks() {
    this.options.panZoom || (this.options.panZoom = {});
    const t = this.options.panZoom, e = t.onPan, i = t.onZoom;
    t.onPan = (s) => {
      this.frameViewChanged(), e?.(s);
    }, t.onZoom = (s) => {
      this.frameViewChanged(), i?.(s);
    };
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
      this._destroyed || this.notifyNodeChanged(), e.announcedByCreator || this.announce(`Node added: ${e.options.text || "(unnamed)"}`);
    }, 100), this.broadcast("onNodeAdded", {
      id: e.id,
      nodeOptions: lt(e.options)
    }), e;
  }
  /** Remove a node by ID. */
  removeNode(t) {
    const e = this.nodes.one(t);
    if (e && !this.capabilitiesOf(e).canDelete) return !1;
    const i = e?.options?.text || "(unnamed)", s = !!e?.options?.isComment;
    if (e && this.selectedNodes.some((r) => r.id === t)) {
      try {
        e.resizeRotate?.disable();
      } catch {
      }
      this.selectedNodes = this.selectedNodes.filter((r) => r.id !== t), this.selectionChanged();
    }
    const o = this.nodes.remove(t);
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
  fitToWidth(t, e = 16, i = 1) {
    this.panZoom.fitWidth(t, e, i);
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
    const t = this.element.getBoundingClientRect(), e = Math.max(1, Math.round(t.width)), i = Math.max(1, Math.round(t.height));
    if (e === this._viewSizeW && i === this._viewSizeH) return;
    const s = this.canvas.viewbox();
    if (!s || ![s.x, s.y, s.width, s.height].every(Number.isFinite)) return;
    const o = s.width / (this._viewSizeW || e);
    this._viewSizeW = e, this._viewSizeH = i;
    const r = s.x + s.width / 2, a = s.y + s.height / 2, l = e * o, c = i * o;
    this.canvas.viewbox(r - l / 2, a - c / 2, l, c), this.options.viewPort = this.options.viewPort || {}, this.options.viewPort.originalWidth = e, this.options.viewPort.originalHeight = i, this.frameViewChanged();
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
      let c = 1 / 0, h = 1 / 0, d = -1 / 0, f = -1 / 0;
      t.forEach((p) => {
        const m = p.options.x ?? 0, g = p.options.y ?? 0, y = p.options.width ?? 0, b = p.options.height ?? 0;
        c = Math.min(c, m - 10), h = Math.min(h, g - 10), d = Math.max(d, m + y + 10), f = Math.max(f, g + b + 10);
      });
      const u = this.boardChromes instanceof Set ? Array.from(this.boardChromes) : [];
      for (const p of u) {
        if (p.draft) continue;
        let m = null;
        try {
          m = p.plainBox();
        } catch {
          m = null;
        }
        !m || ![m.x, m.y, m.width, m.height].every(Number.isFinite) || (c = Math.min(c, m.x - 10), h = Math.min(h, m.y - 10), d = Math.max(d, m.x + m.width + 10), f = Math.max(f, m.y + m.height + 10));
      }
      o = Math.abs(c), r = Math.abs(h), i = d - c, s = f - h, s > i && (a = "portrait");
    }
    return { orientation: a, width: i, height: s, left: o, top: r };
  }
  // Selection Management
  setupSelectionHandling() {
    const t = (e) => {
      const i = e.target, s = document.activeElement;
      if (i && this.element?.contains(i) && s && s !== document.body && !this.element.contains(s)) s.blur?.();
      else if (i && s && s instanceof SVGElement && s !== this.canvas?.node && this.element?.contains(s)) {
        const o = i.closest?.("[data-node-id]");
        o && !o.contains(s) && s.blur?.();
      }
      e.pointerType === "touch" && e.isPrimary && i === this.canvas.node && this.selectedNodes.length === 1 && this.selectedNodes[0].beginNearbyTouchConnection(e) || (this._lastPointerDown = {
        x: e.clientX,
        y: e.clientY,
        onCanvas: !!i && (i === this.canvas.node || i.tagName?.toLowerCase() === "svg"),
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
      const i = e.target === this.canvas.node || e.target && e.target.tagName === "svg";
      if (Date.now() - (this._rubberBandSelectedAt || 0) < 400) {
        this._rubberBandSelectedAt = 0;
        return;
      }
      const o = this._lastPointerDown, r = !!o && (!o.onCanvas || Math.hypot(
        (e.clientX ?? 0) - o.x,
        (e.clientY ?? 0) - o.y
      ) > 6);
      if (i && r) {
        console.log(
          "SELECTION_DEBUG: Drag-tail click (started on a handle/node or travelled) - not deselecting"
        );
        return;
      }
      i ? (console.log("SELECTION_DEBUG: Canvas clicked - deselecting all"), this.enteredGroupId = null, this.clearSelection(), this.clearLineCog(), this.options.events?.onCanvasClicked?.(e)) : console.log(
        "SELECTION_DEBUG: Click on non-canvas element, not deselecting"
      );
    }), this.canvas.on("dblclick", (e) => {
      if ((e.target === this.canvas.node || e.target && e.target.tagName === "svg") && !this.isReadOnly?.())
        try {
          const s = this.canvas.point(e.clientX, e.clientY), o = 120, r = 70, a = this.addNode({
            x: Math.round(s.x - o / 2),
            y: Math.round(s.y - r / 2),
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
      t.map((s) => s.id),
      "addToSelection:",
      e
    ), this.clearLineCog(), t.some((s) => s?.isRemoved) && (t = t.filter((s) => !s.isRemoved), t.length === 0 && e))
      return;
    if (this._dragPolicies.length) {
      const s = this.screenSelection(t, e);
      t = s.nodes, e = s.addToSelection;
    }
    if (t.length === 1) {
      const s = this.getGroupIdOf(t[0]);
      if (this.enteredGroupId && s !== this.enteredGroupId && (this.enteredGroupId = null), s && s !== this.enteredGroupId) {
        const o = this.getGroupMembers(s);
        o.length > 1 && (t = o);
      }
    }
    e || this.clearSelection(), t.forEach((s) => {
      this.selectedNodes.includes(s) || (this.selectedNodes.push(s), s.onSelected());
    }), this.updateSelectionResizeRotate(), this.selectionChanged();
    const i = this.selectedNodes.length;
    i === 0 ? this.announce("No nodes selected") : i === 1 ? this.announce(`Node selected: ${this.selectedNodes[0].options.text || "(unnamed)"}`) : this.announce(`${i} nodes selected`), i > 1 && (this._hadGroupSelection = !0, this.options.events?.onGroupSelection?.(this.selectedNodes.slice()));
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
    this.groupResizeRotate = this.canvas.group(), this.groupResizeRotate.rect(t.width, t.height).move(t.x, t.y).fill("transparent").stroke({ color: "#4a90e2", width: 2, dasharray: "5,5" }).attr("pointer-events", "none"), this.selectedNodes.some((i) => i.options.isLocked) || this.addGroupRotateHandle(t);
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
        const i = t.x + t.width / 2, s = t.y + t.height / 2, o = e.group().addClass("slatebox-group-rotate");
        Bo(o);
        const r = o.node;
        r.setAttribute("aria-label", "Rotate selection"), r.style.touchAction = "none";
        const { x: a, y: l, width: c, height: h } = t, d = [
          [a, l],
          [i, l],
          [a + c, l],
          [a + c, s],
          [a + c, l + h],
          [i, l + h],
          [a, l + h],
          [a, s]
        ], f = () => {
          const E = e.node.getScreenCTM?.(), M = E ? Math.hypot(E.a, E.b) : 1;
          return M > 0 && Number.isFinite(M) ? M : 1;
        }, u = () => Fo(o, d, f());
        o.__relayout = u, r.__relayout = u, u();
        const p = new Uo();
        let m = !1, g = 0, y = { x: 0, y: 0 }, b = [];
        const v = () => {
          const E = e.node.getScreenCTM();
          return E ? { x: E.a * i + E.c * s + E.e, y: E.b * i + E.d * s + E.f } : { x: 0, y: 0 };
        }, w = (E) => {
          const M = E * Math.PI / 180, k = Math.cos(M), N = Math.sin(M);
          b.forEach((O) => {
            const R = O.cx - i, H = O.cy - s, q = i + R * k - H * N, J = s + R * N + H * k, it = O.node.options.width || 0, Et = O.node.options.height || 0, St = O.node.options.rotate = O.node.options.rotate || {};
            St.rotationAngle = E ? ie(O.angle + E) : O.angle, O.node.position(q - it / 2, J - Et / 2);
          });
        };
        let _ = 0;
        const x = (E) => {
          if (!m) return;
          this.frameGestureStart("group-rotate");
          const M = Math.atan2(E.clientY - y.y, E.clientX - y.x), k = E.pointerType === "touch";
          _ = Ii((M - g) * 180 / Math.PI, { shift: E.shiftKey, coarse: k }), w(_);
          const N = oi(E);
          N && p.show(_, N.x, N.y, k);
        }, S = () => {
          m = !1, p.hide(), document.documentElement.style.cursor = "", r.removeAttribute("data-state"), r.__paintKnob?.(), window.removeEventListener("pointermove", x), window.removeEventListener("pointerup", C), window.removeEventListener("pointercancel", C), window.removeEventListener("keydown", A, !0);
        }, C = () => {
          m && (S(), this.broadcast("onNodesMove", {
            nodeOptions: this.selectedNodes.map((E) => lt(E.options))
          }), this.announce(`Rotated the selection by ${Math.round(_)} degrees`), this.updateSelectionResizeRotate(), this.frameGestureEnd("group-rotate"));
        }, A = (E) => {
          E.key !== "Escape" || !m || (E.preventDefault(), E.stopImmediatePropagation(), S(), w(0), this.announce("Rotate cancelled"), this.updateSelectionResizeRotate(), this.frameGestureEnd("group-rotate"));
        };
        o.on("pointerdown", (E) => {
          E.preventDefault?.(), E.stopPropagation?.(), m = !0, _ = 0, y = v(), g = Math.atan2(E.clientY - y.y, E.clientX - y.x), b = this.selectedNodes.map((M) => ({
            node: M,
            cx: (M.options.x || 0) + (M.options.width || 0) / 2,
            cy: (M.options.y || 0) + (M.options.height || 0) / 2,
            angle: M.options.rotate?.rotationAngle || 0
          })), r.setAttribute("data-state", "active"), r.__paintKnob?.(), u(), document.documentElement.style.cursor = Oi, window.addEventListener("pointermove", x), window.addEventListener("pointerup", C), window.addEventListener("pointercancel", C), window.addEventListener("keydown", A, !0);
        });
      } catch {
      }
  }
  calculateGroupBoundingBox() {
    if (this.selectedNodes.length === 0)
      return { x: 0, y: 0, width: 100, height: 100 };
    let t = 1 / 0, e = 1 / 0, i = -1 / 0, s = -1 / 0;
    return this.selectedNodes.forEach((o) => {
      const r = this.rotatedBounds(o);
      t = Math.min(t, r.minX), e = Math.min(e, r.minY), i = Math.max(i, r.maxX), s = Math.max(s, r.maxY);
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
        } catch (i) {
          console.warn("SELECTION: a selection listener threw", i);
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
    const t = this._frameGestures.size > 0 || this._frameViewTimer !== null, e = this.selectedNodes.filter((s) => !s.isRemoved);
    if (e.length) {
      const s = this.screenRectOfNodes(e);
      return {
        kind: e.length === 1 ? "node" : "nodes",
        ids: e.map((o) => o.id),
        rect: s,
        topClearance: s ? this.measureTopClearance(e, s) : 0,
        moving: t
      };
    }
    const i = this._selectedLine;
    if (i) {
      let s = null;
      try {
        const o = i.connectable?.connector?.node;
        o?.isConnected && (s = xu(o.getBoundingClientRect()));
      } catch {
        s = null;
      }
      if (s)
        return {
          kind: "line",
          avoid: [i.node, this.getNode?.(i.childId)].filter(Boolean).map((a) => this.screenRectOfNodes([a])).filter((a) => !!a),
          ids: [i.associationId],
          rect: s,
          // The endpoint handles stand a little proud of the line.
          topClearance: 10,
          moving: t,
          line: { nodeId: i.node.id, associationId: i.associationId, childId: i.childId }
        };
    }
    return { kind: "none", ids: [], rect: null, topClearance: 0, moving: !1 };
  }
  /** The line selected on the canvas, with its association, or null. */
  getSelectedLine() {
    const t = this._selectedLine;
    if (!t) return null;
    const e = t.node.relationships, i = e?.associations?.find((s) => s.id === t.associationId) ?? e?.getAssociation?.(t.childId) ?? null;
    return !i || t.node.isRemoved ? null : { node: t.node, association: i };
  }
  /**
   * Remove the selected line, the same way the engine's own pill does (the change
   * is broadcast, saved and undoable like any removed connection). False when no
   * line is selected or the line may not be removed.
   */
  removeSelectedLine() {
    const t = this._selectedLine;
    if (!t || this.isReadOnly()) return !1;
    const i = t.node.relationships?.removeAssociation?.(t.associationId);
    return this.clearLineCog(), i !== !1;
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
  lineEndAnchor(t, e, i) {
    return this.nodes.one(t)?.connector?.currentAnchor?.(e, i) ?? null;
  }
  /** Whether an end of a line follows its note, is pinned to a spot on its edge, or is free. */
  lineEndState(t, e, i) {
    return this.nodes.one(t)?.connector?.endState?.(e, i) ?? null;
  }
  /**
   * Pin an end of a line where it is now ("pinned"), at a spot on its note's
   * edge ({x, y}), or let it follow its note ("follow"). Saved, shared and
   * undoable. False for a free end, or when the slate cannot be edited.
   */
  setLineEnd(t, e, i, s) {
    return this.isReadOnly() || this.isCommentOnly() ? !1 : !!this.nodes.one(t)?.connector?.setEnd?.(e, i, s);
  }
  /**
   * The line tool: a line follows the pointer from the note; a click or tap on
   * another note connects to it, on empty canvas leaves its end free there;
   * Escape cancels. Resolves with what happened (see LineTool.ts).
   */
  startLineFrom(t) {
    const e = typeof t == "string" ? this.nodes.one(t) : t, i = dh();
    return i ? i.startLineTool(this, e) : uh().then((s) => s.startLineTool(this, e));
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
  setSelectedLine(t, e, i, s) {
    this.selectedNodes.length && this.clearSelection(), this._selectedLine = { node: t, associationId: e, childId: i, connectable: s }, this.scheduleSelectionFrame();
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
    this._destroyed || (ih(this.element), this._frameViewTimer && clearTimeout(this._frameViewTimer), this._frameViewTimer = setTimeout(() => {
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
    const e = t.rect, i = [
      t.kind,
      t.ids.join(","),
      t.moving,
      e ? [e.left, e.top, e.width, e.height].map((s) => Math.round(s)).join(",") : "-",
      Math.round(t.topClearance)
    ].join("|");
    if (i !== this._frameLastKey) {
      this._frameLastKey = i;
      try {
        this.options.events?.onSelectionFrame?.(t);
      } catch (s) {
        console.warn("SELECTION: onSelectionFrame threw", s);
      }
    }
  }
  /** The notes' (rotated) boxes, together, on screen. */
  screenRectOfNodes(t) {
    let e = 1 / 0, i = 1 / 0, s = -1 / 0, o = -1 / 0;
    for (const r of t) {
      const a = this.rotatedBounds(r);
      for (const [l, c] of [
        [a.minX, a.minY],
        [a.maxX, a.minY],
        [a.maxX, a.maxY],
        [a.minX, a.maxY]
      ]) {
        const h = this.worldToClient({ x: l, y: c });
        e = Math.min(e, h.x), i = Math.min(i, h.y), s = Math.max(s, h.x), o = Math.max(o, h.y);
      }
    }
    return [e, i, s, o].every(Number.isFinite) ? { left: e, top: i, right: s, bottom: o, width: s - e, height: o - i } : null;
  }
  /**
   * Room above the frame taken by the engine's handles: the top connect dot and
   * the rotate handle of one note, or the group's rotate knob. Read from what is
   * drawn when it is there, otherwise from the handles' known offsets.
   */
  measureTopClearance(t, e) {
    const i = this.getZoom?.() || 1;
    let s = 1 / 0;
    const o = (r) => {
      if (!r || !r.isConnected) return;
      const a = r.getBoundingClientRect();
      a.width > 0 && a.height > 0 && (a.right < e.left - As || a.left > e.right + As || a.top < e.top - 120 * Math.max(1, i) || a.top > e.bottom || (s = Math.min(s, a.top)));
    };
    if (t.length === 1) {
      const r = t[0];
      o(r.connectionHandles?.top?.node), this.element?.querySelectorAll?.(".svg_select_handle_rot").forEach((a) => o(a));
    } else if (this.groupResizeRotate)
      try {
        this.groupResizeRotate.node.querySelectorAll("circle").forEach((r) => o(r));
      } catch {
      }
    return Number.isFinite(s) && s < e.top ? Math.ceil(e.top - s) : t.length === 1 ? Math.ceil(35 * i + 9) : xn + Di / 2 + 4;
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
    const e = t.options, i = e.x || 0, s = e.y || 0, o = e.width || 0, r = e.height || 0, a = e.rotate?.rotationAngle || 0;
    if (!a) return { minX: i, minY: s, maxX: i + o, maxY: s + r };
    const l = i + o / 2, c = s + r / 2, h = a * Math.PI / 180, d = Math.cos(h), f = Math.sin(h);
    let u = 1 / 0, p = 1 / 0, m = -1 / 0, g = -1 / 0;
    const y = [
      [i, s],
      [i + o, s],
      [i + o, s + r],
      [i, s + r]
    ];
    for (const [b, v] of y) {
      const w = b - l, _ = v - c, x = l + w * d - _ * f, S = c + w * f + _ * d;
      u = Math.min(u, x), p = Math.min(p, S), m = Math.max(m, x), g = Math.max(g, S);
    }
    return { minX: u, minY: p, maxX: m, maxY: g };
  }
  alignNodes(t, e) {
    const i = this.freeNodes(e || this.getSelectedNodes());
    !i || i.length < 2 || ["left", "right", "centerH", "top", "bottom", "middle"].includes(t) && this.moveToPositions(i, ru(t, i.map((s) => this.layoutBoxOf(s))));
  }
  /**
   * Evenly distribute the selected (or given) nodes along an axis so the gaps
   * between them are equal; the outermost two stay put. axis: horizontal |
   * vertical. Broadcasts onNodesMove. No-op for < 3 nodes.
   */
  distributeNodes(t, e) {
    const i = this.freeNodes(e || this.getSelectedNodes());
    !i || i.length < 3 || t !== "horizontal" && t !== "vertical" || this.moveToPositions(i, au(t, i.map((s) => this.layoutBoxOf(s))));
  }
  layoutBoxOf(t) {
    const e = t.options;
    return { id: t.id, x: e.x || 0, y: e.y || 0, width: e.width || 0, height: e.height || 0, rotationAngle: e.rotate?.rotationAngle || 0 };
  }
  moveToPositions(t, e) {
    e.forEach((i, s) => t[s].position(i.x, i.y)), this.broadcast("onNodesMove", {
      nodeOptions: t.map((i) => lt(i.options))
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
    return t.forEach((i) => {
      e.set(i.id, i);
      const s = this.getGroupIdOf(i);
      s && this.getGroupMembers(s).forEach((o) => e.set(o.id, o));
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
    const i = "grp-" + Yh(8);
    return e.forEach((s) => {
      s.options.groupId = i;
    }), this.enteredGroupId = null, this.broadcast("onNodesMove", {
      nodeOptions: e.map((s) => lt(s.options))
    }), this.selectNodes(e), i;
  }
  /**
   * Ungroup: dissolve every group represented in the selected (or given) nodes by
   * clearing each member's groupId. Persists and keeps the nodes multi-selected.
   */
  ungroupNodes(t) {
    const e = this.freeNodes(t || this.getSelectedNodes()), i = /* @__PURE__ */ new Set();
    if (e.forEach((o) => {
      const r = this.getGroupIdOf(o);
      r && i.add(r);
    }), !i.size) return;
    const s = [];
    i.forEach((o) => {
      this.getGroupMembers(o).forEach((r) => {
        r.options.groupId = void 0, s.push(r);
      });
    }), this.enteredGroupId = null, this.broadcast("onNodesMove", {
      // Use an explicit null tombstone in the collaboration package. JSON/Yjs
      // transports may omit `undefined`, which would leave peers in the old
      // group forever instead of clearing it.
      nodeOptions: s.map((o) => ({
        ...lt(o.options),
        groupId: null
      }))
    }), this.selectNodes(s);
  }
  /**
   * Lock the selected (or given) nodes — and, for any grouped node, its whole
   * group — disabling drag/resize. Persists via onNodesMove.
   */
  lockNodes(t) {
    const e = this.freeNodes(this.expandToGroups(t || this.getSelectedNodes()));
    e.length && (e.forEach((i) => i.lock()), this.broadcast("onNodesMove", {
      nodeOptions: e.map((i) => lt(i.options))
    }), this.updateSelectionResizeRotate());
  }
  /** Unlock the selected (or given) nodes and their groups. */
  unlockNodes(t) {
    const e = this.freeNodes(this.expandToGroups(t || this.getSelectedNodes()));
    e.length && (e.forEach((i) => i.unlock()), this.broadcast("onNodesMove", {
      nodeOptions: e.map((i) => lt(i.options))
    }), this.updateSelectionResizeRotate());
  }
  /** True if every given (or selected) node is locked. */
  isSelectionLocked(t) {
    const e = t || this.getSelectedNodes();
    return e.length > 0 && e.every((i) => !!i.options.isLocked);
  }
  /**
   * Enter a group for individual-member editing (Miro double-click-into-group).
   * Selects `member` if given, else the first member. While entered, clicking a
   * member selects just that member instead of the whole group.
   */
  enterGroup(t, e) {
    const i = this.getGroupMembers(t);
    i.length && (this.enteredGroupId = t, this.selectNodes([e && i.includes(e) ? e : i[0]]));
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
      e || (e = !0, this._governedDragNode && this.governanceOf(this._governedDragNode)?.policy === t && this.cancelGovernedDrag("host"), this._dragPolicies = this._dragPolicies.filter((i) => i !== t), this.refreshGovernance());
    };
  }
  /** The policy governing `node` and the note's capabilities, or null for an ordinary note. */
  governanceOf(t) {
    return !t || this._dragPolicies.length === 0 ? null : _d(this._dragPolicies, t);
  }
  /**
   * What may be done to `node` right now. Ordinary notes can do everything; so can
   * governed notes while their host is changing them (withPolicyAuthority).
   */
  capabilitiesOf(t) {
    return this._dragPolicies.length === 0 || this._policyAuthority > 0 ? gs : this.governanceOf(t)?.capabilities ?? gs;
  }
  /** True for a governed note that is a drawing of host state (left out of saves and undo). */
  isDerivedNode(t) {
    const e = this.governanceOf(t);
    return !!e && !e.capabilities.persist;
  }
  /** The notes among `nodes` (default: all) that no policy governs. */
  freeNodes(t) {
    const e = t ?? this.nodes.allNodes;
    return this._dragPolicies.length === 0 ? e : e.filter((i) => !this.governanceOf(i));
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
    const { text: i, selection: s, returnFocus: o } = t.draft;
    return e.editor.startInline({ text: i, selection: s ?? { start: i.length, end: i.length }, returnFocus: o, preventScroll: !0 }) === !0;
  }
  /**
   * Show the policies an ordinary note on the move (see DragPolicy.onFreeMove). Only a
   * single ordinary note is offered; a group drag and a governed note are not.
   */
  offerFreeMove(t, e) {
    if (!(!this._dragPolicies.length || this.governanceOf(t)))
      for (const i of this._dragPolicies.slice())
        try {
          i.onFreeMove?.(t, e);
        } catch (s) {
          console.warn("DRAG_POLICY: onFreeMove threw", s);
        }
  }
  /**
   * Offer a dropped ordinary note to the policies (see DragPolicy.onFreeDrop). The first
   * that takes or refuses it decides; with none, the drop is an ordinary move.
   */
  offerFreeDrop(t, e, i) {
    if (!this._dragPolicies.length || this.governanceOf(t)) return null;
    for (const s of this._dragPolicies.slice()) {
      let o;
      try {
        o = s.onFreeDrop?.(t, e, i);
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
  offerFreeGroupDrop(t, e, i) {
    if (!this._dragPolicies.length || t.some((s) => this.governanceOf(s))) return null;
    for (const s of this._dragPolicies.slice()) {
      let o;
      try {
        o = s.onFreeGroupDrop?.(t, e, i);
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
        } catch (i) {
          console.warn("DRAG_POLICY: onFreeTextCommit threw", i);
        }
  }
  /** What each policy keeps with an undo record (see DragPolicy.undoState). Null when none keeps anything. */
  undoHostState() {
    const t = /* @__PURE__ */ new Map();
    for (const e of this._dragPolicies)
      if (typeof e.undoState == "function")
        try {
          t.set(e, e.undoState());
        } catch (i) {
          console.warn("DRAG_POLICY: undoState threw", i);
        }
    return t.size ? t : null;
  }
  /** This person's undo or redo went back to a record: hand each policy what it kept with it. */
  restoreUndoHostState(t, e) {
    const i = t instanceof Map ? t : null;
    for (const s of this._dragPolicies.slice())
      if (typeof s.onUndoRestore == "function")
        try {
          s.onUndoRestore(i?.get(s), e);
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
      } catch (i) {
        console.warn("DRAG_POLICY: onNotesReplaced threw", i);
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
    const i = (o) => typeof o == "string" && !!this.governanceOf(this.nodes.one(o));
    if (Array.isArray(e)) {
      const o = e.filter((r) => !i(r?.id));
      return o.length ? o.length === e.length ? e : o : null;
    }
    if (t === "addRelationship" || t === "removeRelationship")
      return i(e.parentId) || i(e.childId) ? null : e;
    let s = e;
    for (const o of ["nodeOptions", "nodes"]) {
      const r = s[o];
      if (Array.isArray(r)) {
        const a = r.filter((l) => !i(l?.id));
        if (a.length === r.length) continue;
        if (!a.length) return null;
        s = { ...s, [o]: a };
      } else if (r && typeof r == "object" && i(r.id))
        return null;
    }
    return /^onNode|^onLine/.test(t) && i(s.id) ? null : s;
  }
  /** A note arrived and is drawn: each policy hears of it (DragPolicy.onNodeAdded). */
  nodeAdded(t) {
    if (!this._destroyed) {
      for (const e of this._dragPolicies.slice())
        if (typeof e.onNodeAdded == "function")
          try {
            e.onNodeAdded(t);
          } catch (i) {
            console.warn("DRAG_POLICY: onNodeAdded threw", i);
          }
    }
  }
  /** Hand a line change that touches a governed note to the policy that governs it (once per policy). */
  offerGovernedLine(t, e) {
    if (t !== "addRelationship" && t !== "removeRelationship" && t !== "onLinePropertiesChanged") return;
    const i = t === "onLinePropertiesChanged" ? (Array.isArray(e) ? e : [e]).map((o) => o?.id) : [e?.parentId, e?.childId], s = /* @__PURE__ */ new Set();
    for (const o of i) {
      const r = typeof o == "string" ? this.governanceOf(this.nodes.one(o)) : null;
      if (!(!r || s.has(r.policy))) {
        s.add(r.policy);
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
    if (t = t.filter((s) => this.capabilitiesOf(s).canSelect), this._policyAuthority > 0) return { nodes: t, addToSelection: e };
    const i = (s) => !!this.governanceOf(s);
    return t.length > 1 ? t = t.filter((s) => !i(s)) : t.length === 1 && i(t[0]) && (e = !1), e && this.selectedNodes.some(i) && (e = !1), { nodes: t, addToSelection: e };
  }
  // ─── Coordinates and hit testing ────────────────────────────────────
  /** Convert a point on screen (clientX/clientY) to world coordinates. */
  clientToWorld(t) {
    const e = this.canvas.point(t.x, t.y);
    return { x: e.x, y: e.y };
  }
  /** Convert a world point to screen (client) coordinates, through the current pan and zoom. */
  worldToClient(t) {
    const i = this.canvas.node.getScreenCTM?.();
    return i ? {
      x: i.a * t.x + i.c * t.y + i.e,
      y: i.b * t.x + i.d * t.y + i.f
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
  hitTestNodes(t, e, i = {}) {
    const s = (e ?? this.nodes.allNodes).filter((o) => o && o !== i.exclude);
    return Cd(t, s, i.padding ?? 0);
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
    const i = tr(this, t, e);
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
    await er(t, this, e, i), this.collab?.documentLoaded?.(), this.undoRedo?.clear?.(), this.undoRedo?.snap?.(!0);
  }
  /**
   * Take a snapshot of the current slate state.
   * Used by undo/redo system.
   *
   * @returns SlateJSON object (not stringified)
   */
  snapshot() {
    return zd(this);
  }
  // ─── Export API ─────────────────────────────────────────────────
  /**
   * Export the slate as an SVG string.
   */
  svg(t, e) {
    return ir(this, t, e);
  }
  /**
   * Export the slate as a PNG (async).
   */
  async png(t, e) {
    return nu(this, t, e);
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
    Dh(this, t, e, i);
  }
  // ─── Layout API ─────────────────────────────────────────────────
  /** Remove overlapping nodes by pushing them apart */
  /** Optimize Layout: the shared tidy layout over the slate's notes, saved as one move. */
  removeLayoutOverlaps(t) {
    du(this, t);
  }
  /** Apply pre-computed layout moves */
  applyLayout(t, e, i) {
    uu(this, t, e, i);
  }
  /** Package current node positions for layout transfer */
  packageLayout() {
    return fu(this);
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
    await Rh(this);
  }
};
fn.NON_UNDOABLE = /* @__PURE__ */ new Set([
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
let Ms = fn;
const Pu = Object.freeze(["#6d28d9", "#0f766e", "#a16207", "#be185d", "#1d4ed8", "#4d7c0f"]), _u = 6e3, Cu = 600, Eu = 6, Su = { todo: "○", doing: "◌", done: "✓", skipped: "–", stopped: "■" };
function te(n) {
  if (n == null) return null;
  const t = n instanceof Date ? n.getTime() : typeof n == "number" ? n : Date.parse(n);
  return Number.isFinite(t) ? t : null;
}
const Qe = (n) => String(n ?? "").replace(/[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u180e\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g, "").replace(/\s+/g, " ").trim(), Au = (n) => (n.targets ?? []).some((t) => typeof t == "string" && t.startsWith("ghost-")), Ts = "Suggesting…", Mu = "Waiting for you";
function Du(n, { landing: t = !1 } = {}) {
  const e = n.plan?.steps ?? [], i = e.findIndex((o) => o.status === "stopped");
  if (i >= 0) return "Stopped: " + Qe(e[i].text);
  if (t) return Ts;
  if (n.waiting) return Mu;
  if (n.status === "live" && te(n.endedAt ?? null) === null && Au(n)) return Ts;
  if (e.length) {
    const o = e.findIndex((a) => a.status === "doing");
    if (e.every((a) => a.status === "done" || a.status === "skipped")) return "Done";
    const r = o >= 0 ? o : Math.min(Math.max(n.plan.current ?? 0, 0), e.length - 1);
    return Qe(e[r].text);
  }
  return Qe(n.message ?? "") || null;
}
function Ou(n) {
  return (n.plan?.steps ?? []).map((t) => Su[t.status] + " " + (t.status === "stopped" ? "Stopped: " : "") + Qe(t.text));
}
function Iu(n, t, { holdMs: e = _u, fadeMs: i = Cu, max: s = Eu } = {}) {
  const o = [];
  for (const r of n) {
    if (!r || typeof r.agentKey != "string") continue;
    const a = te(r.expiresAt), l = te(r.endedAt);
    if (r.status === "live" && l === null) {
      if (a === null || t >= a) continue;
      o.push({ record: r, opacity: 1, until: a });
      continue;
    }
    const h = (l ?? te(r.updatedAt) ?? t) + e;
    t >= h + i || o.push({ record: r, opacity: t <= h ? 1 : 1 - (t - h) / i, until: h + i });
  }
  return o.sort((r, a) => (te(a.record.updatedAt) ?? 0) - (te(r.record.updatedAt) ?? 0)), o.slice(0, s);
}
export {
  Pu as A,
  Ri as S,
  Ru as a,
  ku as b,
  Ni as c,
  er as d,
  Ms as e,
  Du as f,
  Yh as g,
  Ou as h,
  Iu as i,
  rn as n,
  qo as p,
  hs as r,
  tr as s,
  Uh as t,
  lt as v
};
