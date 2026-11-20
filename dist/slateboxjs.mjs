var Zr = Object.create, hn = Object.defineProperty, Wr = Object.getOwnPropertyDescriptor, Vr = Object.getOwnPropertyNames, Kr = Object.getPrototypeOf, Jr = Object.prototype.hasOwnProperty, N = (n, t) => () => (t || (n((t = { exports: {} }).exports, t), n = null), t.exports), ve = (n, t) => {
  let e = {};
  for (var s in n)
    hn(e, s, {
      get: n[s],
      enumerable: !0
    });
  return hn(e, Symbol.toStringTag, { value: "Module" }), e;
}, Qr = (n, t, e, s) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (var i = Vr(t), o = 0, r = i.length, a; o < r; o++)
      a = i[o], !Jr.call(n, a) && a !== e && hn(n, a, {
        get: ((c) => t[c]).bind(null, a),
        enumerable: !(s = Wr(t, a)) || s.enumerable
      });
  return n;
}, ta = (n, t, e) => (e = n != null ? Zr(Kr(n)) : {}, Qr(hn(e, "default", {
  value: n,
  enumerable: !0
}), n));
const Jn = {}, zi = [];
function B(n, t) {
  if (Array.isArray(n)) {
    for (const e of n) B(e, t);
    return;
  }
  if (typeof n == "object") {
    for (const e in n) B(e, n[e]);
    return;
  }
  Gi(Object.getOwnPropertyNames(t)), Jn[n] = Object.assign(Jn[n] || {}, t);
}
function gt(n) {
  return Jn[n] || {};
}
function ea() {
  return [...new Set(zi)];
}
function Gi(n) {
  zi.push(...n);
}
var qt = /* @__PURE__ */ N((n, t) => {
  t.exports = function(e) {
    try {
      return !!e();
    } catch {
      return !0;
    }
  };
}), _n = /* @__PURE__ */ N((n, t) => {
  var e = qt();
  t.exports = !e(function() {
    var s = function() {
    }.bind();
    return typeof s != "function" || s.hasOwnProperty("prototype");
  });
}), ie = /* @__PURE__ */ N((n, t) => {
  var e = _n(), s = Function.prototype, i = s.call, o = e && s.bind.bind(i, i);
  t.exports = e ? o : function(r) {
    return function() {
      return i.apply(r, arguments);
    };
  };
}), Bi = /* @__PURE__ */ N((n, t) => {
  var e = ie();
  t.exports = e({}.isPrototypeOf);
}), Dt = /* @__PURE__ */ N((n, t) => {
  var e = function(s) {
    return s && s.Math === Math && s;
  };
  t.exports = e(typeof globalThis == "object" && globalThis) || e(typeof window == "object" && window) || e(typeof self == "object" && self) || e(typeof global == "object" && global) || e(typeof n == "object" && n) || /* @__PURE__ */ function() {
    return this;
  }() || Function("return this")();
}), na = /* @__PURE__ */ N((n, t) => {
  var e = _n(), s = Function.prototype, i = s.apply, o = s.call;
  t.exports = typeof Reflect == "object" && Reflect.apply || (e ? o.bind(i) : function() {
    return o.apply(i, arguments);
  });
}), Cn = /* @__PURE__ */ N((n, t) => {
  var e = ie(), s = e({}.toString), i = e("".slice);
  t.exports = function(o) {
    return i(s(o), 8, -1);
  };
}), Hi = /* @__PURE__ */ N((n, t) => {
  var e = Cn(), s = ie();
  t.exports = function(i) {
    if (e(i) === "Function") return s(i);
  };
}), Zt = /* @__PURE__ */ N((n, t) => {
  var e = typeof document == "object" && document.all;
  t.exports = typeof e > "u" && e !== void 0 ? function(s) {
    return typeof s == "function" || s === e;
  } : function(s) {
    return typeof s == "function";
  };
}), Ye = /* @__PURE__ */ N((n, t) => {
  var e = qt();
  t.exports = !e(function() {
    return Object.defineProperty({}, 1, { get: function() {
      return 7;
    } })[1] !== 7;
  });
}), Cs = /* @__PURE__ */ N((n, t) => {
  var e = _n(), s = Function.prototype.call;
  t.exports = e ? s.bind(s) : function() {
    return s.apply(s, arguments);
  };
}), sa = /* @__PURE__ */ N((n) => {
  var t = {}.propertyIsEnumerable, e = Object.getOwnPropertyDescriptor, s = e && !t.call({ 1: 2 }, 1);
  n.f = s ? function(o) {
    var r = e(this, o);
    return !!r && r.enumerable;
  } : t;
}), Fi = /* @__PURE__ */ N((n, t) => {
  t.exports = function(e, s) {
    return {
      enumerable: !(e & 1),
      configurable: !(e & 2),
      writable: !(e & 4),
      value: s
    };
  };
}), ia = /* @__PURE__ */ N((n, t) => {
  var e = ie(), s = qt(), i = Cn(), o = Object, r = e("".split);
  t.exports = s(function() {
    return !o("z").propertyIsEnumerable(0);
  }) ? function(a) {
    return i(a) === "String" ? r(a, "") : o(a);
  } : o;
}), $i = /* @__PURE__ */ N((n, t) => {
  t.exports = function(e) {
    return e == null;
  };
}), Es = /* @__PURE__ */ N((n, t) => {
  var e = $i(), s = TypeError;
  t.exports = function(i) {
    if (e(i)) throw new s("Can't call method on " + i);
    return i;
  };
}), Ui = /* @__PURE__ */ N((n, t) => {
  var e = ia(), s = Es();
  t.exports = function(i) {
    return e(s(i));
  };
}), je = /* @__PURE__ */ N((n, t) => {
  var e = Zt();
  t.exports = function(s) {
    return typeof s == "object" ? s !== null : e(s);
  };
}), Ss = /* @__PURE__ */ N((n, t) => {
  t.exports = {};
}), oa = /* @__PURE__ */ N((n, t) => {
  var e = Ss(), s = Dt(), i = Zt(), o = function(r) {
    return i(r) ? r : void 0;
  };
  t.exports = function(r, a) {
    return arguments.length < 2 ? o(e[r]) || o(s[r]) : e[r] && e[r][a] || s[r] && s[r][a];
  };
}), ra = /* @__PURE__ */ N((n, t) => {
  var e = Dt().navigator, s = e && e.userAgent;
  t.exports = s ? String(s) : "";
}), aa = /* @__PURE__ */ N((n, t) => {
  var e = Dt(), s = ra(), i = e.process, o = e.Deno, r = i && i.versions || o && o.version, a = r && r.v8, c, l;
  a && (c = a.split("."), l = c[0] > 0 && c[0] < 4 ? 1 : +(c[0] + c[1])), !l && s && (c = s.match(/Edge\/(\d+)/), (!c || c[1] >= 74) && (c = s.match(/Chrome\/(\d+)/), c && (l = +c[1]))), t.exports = l;
}), Yi = /* @__PURE__ */ N((n, t) => {
  var e = aa(), s = qt(), i = Dt().String;
  t.exports = !!Object.getOwnPropertySymbols && !s(function() {
    var o = Symbol("symbol detection");
    return !i(o) || !(Object(o) instanceof Symbol) || !Symbol.sham && e && e < 41;
  });
}), ji = /* @__PURE__ */ N((n, t) => {
  var e = Yi();
  t.exports = e && !Symbol.sham && typeof Symbol.iterator == "symbol";
}), Xi = /* @__PURE__ */ N((n, t) => {
  var e = oa(), s = Zt(), i = Bi(), o = ji(), r = Object;
  t.exports = o ? function(a) {
    return typeof a == "symbol";
  } : function(a) {
    var c = e("Symbol");
    return s(c) && i(c.prototype, r(a));
  };
}), ca = /* @__PURE__ */ N((n, t) => {
  var e = String;
  t.exports = function(s) {
    try {
      return e(s);
    } catch {
      return "Object";
    }
  };
}), qi = /* @__PURE__ */ N((n, t) => {
  var e = Zt(), s = ca(), i = TypeError;
  t.exports = function(o) {
    if (e(o)) return o;
    throw new i(s(o) + " is not a function");
  };
}), la = /* @__PURE__ */ N((n, t) => {
  var e = qi(), s = $i();
  t.exports = function(i, o) {
    var r = i[o];
    return s(r) ? void 0 : e(r);
  };
}), ha = /* @__PURE__ */ N((n, t) => {
  var e = Cs(), s = Zt(), i = je(), o = TypeError;
  t.exports = function(r, a) {
    var c, l;
    if (a === "string" && s(c = r.toString) && !i(l = e(c, r)) || s(c = r.valueOf) && !i(l = e(c, r)) || a !== "string" && s(c = r.toString) && !i(l = e(c, r))) return l;
    throw new o("Can't convert object to primitive value");
  };
}), da = /* @__PURE__ */ N((n, t) => {
  t.exports = !0;
}), ua = /* @__PURE__ */ N((n, t) => {
  var e = Dt(), s = Object.defineProperty;
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
}), Zi = /* @__PURE__ */ N((n, t) => {
  var e = da(), s = Dt(), i = ua(), o = "__core-js_shared__", r = t.exports = s[o] || i(o, {});
  (r.versions || (r.versions = [])).push({
    version: "3.49.0",
    mode: e ? "pure" : "global",
    copyright: "© 2013–2025 Denis Pushkarev (zloirock.ru), 2025–2026 CoreJS Company (core-js.io). All rights reserved.",
    license: "https://github.com/zloirock/core-js/blob/v3.49.0/LICENSE",
    source: "https://github.com/zloirock/core-js"
  });
}), fa = /* @__PURE__ */ N((n, t) => {
  var e = Zi();
  t.exports = function(s, i) {
    return e[s] || (e[s] = i || {});
  };
}), pa = /* @__PURE__ */ N((n, t) => {
  var e = Es(), s = Object;
  t.exports = function(i) {
    return s(e(i));
  };
}), ks = /* @__PURE__ */ N((n, t) => {
  var e = ie(), s = pa(), i = e({}.hasOwnProperty);
  t.exports = Object.hasOwn || function(r, a) {
    return i(s(r), a);
  };
}), ga = /* @__PURE__ */ N((n, t) => {
  var e = ie(), s = 0, i = Math.random(), o = e(1.1.toString);
  t.exports = function(r) {
    return "Symbol(" + (r === void 0 ? "" : r) + ")_" + o(++s + i, 36);
  };
}), Xe = /* @__PURE__ */ N((n, t) => {
  var e = Dt(), s = fa(), i = ks(), o = ga(), r = Yi(), a = ji(), c = e.Symbol, l = s("wks"), d = a ? c.for || c : c && c.withoutSetter || o;
  t.exports = function(h) {
    return i(l, h) || (l[h] = r && i(c, h) ? c[h] : d("Symbol." + h)), l[h];
  };
}), ma = /* @__PURE__ */ N((n, t) => {
  var e = Cs(), s = je(), i = Xi(), o = la(), r = ha(), a = Xe(), c = TypeError, l = a("toPrimitive");
  t.exports = function(d, h) {
    if (!s(d) || i(d)) return d;
    var u = o(d, l), f;
    if (u) {
      if (h === void 0 && (h = "default"), f = e(u, d, h), !s(f) || i(f)) return f;
      throw new c("Can't convert object to primitive value");
    }
    return h === void 0 && (h = "number"), r(d, h);
  };
}), Wi = /* @__PURE__ */ N((n, t) => {
  var e = ma(), s = Xi();
  t.exports = function(i) {
    var o = e(i, "string");
    return s(o) ? o : o + "";
  };
}), ya = /* @__PURE__ */ N((n, t) => {
  var e = Dt(), s = je(), i = e.document, o = s(i) && s(i.createElement);
  t.exports = function(r) {
    return o ? i.createElement(r) : {};
  };
}), Vi = /* @__PURE__ */ N((n, t) => {
  var e = Ye(), s = qt(), i = ya();
  t.exports = !e && !s(function() {
    return Object.defineProperty(i("div"), "a", { get: function() {
      return 7;
    } }).a !== 7;
  });
}), ba = /* @__PURE__ */ N((n) => {
  var t = Ye(), e = Cs(), s = sa(), i = Fi(), o = Ui(), r = Wi(), a = ks(), c = Vi(), l = Object.getOwnPropertyDescriptor;
  n.f = t ? l : function(h, u) {
    if (h = o(h), u = r(u), c) try {
      return l(h, u);
    } catch {
    }
    if (a(h, u)) return i(!e(s.f, h, u), h[u]);
  };
}), va = /* @__PURE__ */ N((n, t) => {
  var e = qt(), s = Zt(), i = /#|\.prototype\./, o = function(d, h) {
    var u = a[r(d)];
    return u === l ? !0 : u === c ? !1 : s(h) ? e(h) : !!h;
  }, r = o.normalize = function(d) {
    return String(d).replace(i, ".").toLowerCase();
  }, a = o.data = {}, c = o.NATIVE = "N", l = o.POLYFILL = "P";
  t.exports = o;
}), wa = /* @__PURE__ */ N((n, t) => {
  var e = Hi(), s = qi(), i = _n(), o = e(e.bind);
  t.exports = function(r, a) {
    return s(r), a === void 0 ? r : i ? o(r, a) : function() {
      return r.apply(a, arguments);
    };
  };
}), xa = /* @__PURE__ */ N((n, t) => {
  var e = Ye(), s = qt();
  t.exports = e && s(function() {
    return Object.defineProperty(function() {
    }, "prototype", {
      value: 42,
      writable: !1
    }).prototype !== 42;
  });
}), _a = /* @__PURE__ */ N((n, t) => {
  var e = je(), s = String, i = TypeError;
  t.exports = function(o) {
    if (e(o)) return o;
    throw new i(s(o) + " is not an object");
  };
}), Ca = /* @__PURE__ */ N((n) => {
  var t = Ye(), e = Vi(), s = xa(), i = _a(), o = Wi(), r = TypeError, a = Object.defineProperty, c = Object.getOwnPropertyDescriptor, l = "enumerable", d = "configurable", h = "writable";
  n.f = t ? s ? function(f, p, g) {
    if (i(f), p = o(p), i(g), typeof f == "function" && p === "prototype" && "value" in g && h in g && !g[h]) {
      var m = c(f, p);
      m && m[h] && (f[p] = g.value, g = {
        configurable: d in g ? g[d] : m[d],
        enumerable: l in g ? g[l] : m[l],
        writable: !1
      });
    }
    return a(f, p, g);
  } : a : function(f, p, g) {
    if (i(f), p = o(p), i(g), e) try {
      return a(f, p, g);
    } catch {
    }
    if ("get" in g || "set" in g) throw new r("Accessors not supported");
    return "value" in g && (f[p] = g.value), f;
  };
}), Ea = /* @__PURE__ */ N((n, t) => {
  var e = Ye(), s = Ca(), i = Fi();
  t.exports = e ? function(o, r, a) {
    return s.f(o, r, i(1, a));
  } : function(o, r, a) {
    return o[r] = a, o;
  };
}), Ki = /* @__PURE__ */ N((n, t) => {
  var e = Dt(), s = na(), i = Hi(), o = Zt(), r = ba().f, a = va(), c = Ss(), l = wa(), d = Ea(), h = ks();
  Zi();
  var u = function(f) {
    var p = function(g, m, b) {
      if (this instanceof p) {
        switch (arguments.length) {
          case 0:
            return new f();
          case 1:
            return new f(g);
          case 2:
            return new f(g, m);
        }
        return new f(g, m, b);
      }
      return s(f, this, arguments);
    };
    return p.prototype = f.prototype, p;
  };
  t.exports = function(f, p) {
    var g = f.target, m = f.global, b = f.stat, y = f.proto, x = m ? e : b ? e[g] : e[g] && e[g].prototype, E = m ? c : c[g] || d(c, g, {})[g], v = E.prototype, w, _, C, S, k, M, O, P, R;
    for (S in p)
      w = a(m ? S : g + (b ? "." : "#") + S, f.forced), _ = !w && x && h(x, S), M = E[S], _ && (f.dontCallGetSet ? (R = r(x, S), O = R && R.value) : O = x[S]), k = _ && O ? O : p[S], !(!w && !y && typeof M == typeof k) && (f.bind && _ ? P = l(k, e) : f.wrap && _ ? P = u(k) : y && o(k) ? P = i(k) : P = k, (f.sham || k && k.sham || M && M.sham) && d(P, "sham", !0), d(E, S, P), y && (C = g + "Prototype", h(c, C) || d(c, C, {}), d(c[C], S, k), f.real && v && (w || !v[S]) && d(v, S, k)));
  };
}), Sa = /* @__PURE__ */ N((n, t) => {
  var e = Math.ceil, s = Math.floor;
  t.exports = Math.trunc || function(o) {
    var r = +o;
    return (r > 0 ? s : e)(r);
  };
}), Ji = /* @__PURE__ */ N((n, t) => {
  var e = Sa();
  t.exports = function(s) {
    var i = +s;
    return i !== i || i === 0 ? 0 : e(i);
  };
}), ka = /* @__PURE__ */ N((n, t) => {
  var e = Ji(), s = Math.max, i = Math.min;
  t.exports = function(o, r) {
    var a = e(o);
    return a < 0 ? s(a + r, 0) : i(a, r);
  };
}), Aa = /* @__PURE__ */ N((n, t) => {
  var e = Ji(), s = Math.min;
  t.exports = function(i) {
    var o = e(i);
    return o > 0 ? s(o, 9007199254740991) : 0;
  };
}), Ma = /* @__PURE__ */ N((n, t) => {
  var e = Aa();
  t.exports = function(s) {
    return e(s.length);
  };
}), Ta = /* @__PURE__ */ N((n, t) => {
  var e = Ui(), s = ka(), i = Ma(), o = function(r) {
    return function(a, c, l) {
      var d = e(a), h = i(d);
      if (h === 0) return !r && -1;
      var u = s(l, h), f;
      if (r && c !== c) {
        for (; h > u; )
          if (f = d[u++], f !== f) return !0;
      } else for (; h > u; u++) if ((r || u in d) && d[u] === c) return r || u || 0;
      return !r && -1;
    };
  };
  t.exports = {
    includes: o(!0),
    indexOf: o(!1)
  };
}), Na = /* @__PURE__ */ N((n, t) => {
  t.exports = function() {
  };
}), Oa = /* @__PURE__ */ N(() => {
  var n = Ki(), t = Ta().includes, e = qt(), s = Na(), i = e(function() {
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
}), Qi = /* @__PURE__ */ N((n, t) => {
  var e = Dt(), s = Ss();
  t.exports = function(i, o) {
    var r = s[i + "Prototype"], a = r && r[o];
    if (a) return a;
    var c = e[i], l = c && c.prototype;
    return l && l[o];
  };
}), Ra = /* @__PURE__ */ N((n, t) => {
  Oa();
  var e = Qi();
  t.exports = e("Array", "includes");
}), Pa = /* @__PURE__ */ N((n, t) => {
  var e = je(), s = Cn(), i = Xe()("match");
  t.exports = function(o) {
    var r;
    return e(o) && ((r = o[i]) !== void 0 ? !!r : s(o) === "RegExp");
  };
}), Ia = /* @__PURE__ */ N((n, t) => {
  var e = Pa(), s = TypeError;
  t.exports = function(i) {
    if (e(i)) throw new s("The method doesn't accept regular expressions");
    return i;
  };
}), Da = /* @__PURE__ */ N((n, t) => {
  var e = Xe()("toStringTag"), s = {};
  s[e] = "z", t.exports = String(s) === "[object z]";
}), La = /* @__PURE__ */ N((n, t) => {
  var e = Da(), s = Zt(), i = Cn(), o = Xe()("toStringTag"), r = Object, a = i(/* @__PURE__ */ function() {
    return arguments;
  }()) === "Arguments", c = function(l, d) {
    try {
      return l[d];
    } catch {
    }
  };
  t.exports = e ? i : function(l) {
    var d, h, u;
    return l === void 0 ? "Undefined" : l === null ? "Null" : typeof (h = c(d = r(l), o)) == "string" ? h : a ? i(d) : (u = i(d)) === "Object" && s(d.callee) ? "Arguments" : u;
  };
}), za = /* @__PURE__ */ N((n, t) => {
  var e = La(), s = String;
  t.exports = function(i) {
    if (e(i) === "Symbol") throw new TypeError("Cannot convert a Symbol value to a string");
    return s(i);
  };
}), Ga = /* @__PURE__ */ N((n, t) => {
  var e = Xe()("match");
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
}), Ba = /* @__PURE__ */ N(() => {
  var n = Ki(), t = ie(), e = Ia(), s = Es(), i = za(), o = Ga(), r = t("".indexOf);
  n({
    target: "String",
    proto: !0,
    forced: !o("includes")
  }, { includes: function(c) {
    return !!~r(i(s(this)), i(e(c)), arguments.length > 1 ? arguments[1] : void 0);
  } });
}), Ha = /* @__PURE__ */ N((n, t) => {
  Ba();
  var e = Qi();
  t.exports = e("String", "includes");
}), Fa = /* @__PURE__ */ N((n, t) => {
  var e = Bi(), s = Ra(), i = Ha(), o = Array.prototype, r = String.prototype;
  t.exports = function(a) {
    var c = a.includes;
    return a === o || e(o, a) && c === o.includes ? s : typeof a == "string" || a === r || e(r, a) && c === r.includes ? i : c;
  };
}), $a = /* @__PURE__ */ N((n, t) => {
  var e = Fa();
  t.exports = e;
}), Qt = /* @__PURE__ */ ta($a());
function As(n, t) {
  let e;
  const s = n.length, i = [];
  for (e = 0; e < s; e++) i.push(t(n[e]));
  return i;
}
function Ua(n, t) {
  let e;
  const s = n.length, i = [];
  for (e = 0; e < s; e++) t(n[e]) && i.push(n[e]);
  return i;
}
function Dn(n) {
  return n % 360 * Math.PI / 180;
}
function to(n) {
  return n.replace(/([A-Z])/g, function(t, e) {
    return "-" + e.toLowerCase();
  });
}
function eo(n) {
  return n.charAt(0).toUpperCase() + n.slice(1);
}
function oe(n, t, e, s) {
  return (t == null || e == null) && (s = s || n.bbox(), t == null ? t = s.width / s.height * e : e == null && (e = s.height / s.width * t)), {
    width: t,
    height: e
  };
}
function Qn(n, t) {
  const e = n.origin;
  let s = n.ox != null ? n.ox : n.originX != null ? n.originX : "center", i = n.oy != null ? n.oy : n.originY != null ? n.originY : "center";
  e != null && ([s, i] = Array.isArray(e) ? e : typeof e == "object" ? [e.x, e.y] : [e, e]);
  const o = typeof s == "string", r = typeof i == "string";
  if (o || r) {
    const { height: a, width: c, x: l, y: d } = t.bbox();
    o && (s = (0, Qt.default)(s).call(s, "left") ? l : (0, Qt.default)(s).call(s, "right") ? l + c : l + c / 2), r && (i = (0, Qt.default)(i).call(i, "top") ? d : (0, Qt.default)(i).call(i, "bottom") ? d + a : d + a / 2);
  }
  return [s, i];
}
const Ya = /* @__PURE__ */ new Set([
  "desc",
  "metadata",
  "title"
]), ts = (n) => Ya.has(n.nodeName), ja = (n, t, e = {}) => {
  const s = { ...t };
  for (const i in s) s[i].valueOf() === e[i] && delete s[i];
  Object.keys(s).length ? n.node.setAttribute("data-svgjs", JSON.stringify(s)) : (n.node.removeAttribute("data-svgjs"), n.node.removeAttribute("svgjs:data"));
}, Ms = "http://www.w3.org/2000/svg", Xa = "http://www.w3.org/1999/xhtml", Ln = "http://www.w3.org/2000/xmlns/", qe = "http://www.w3.org/1999/xlink", F = {
  window: typeof window > "u" ? null : window,
  document: typeof document > "u" ? null : document
};
function Ts() {
  return F.window;
}
var Ns = class {
};
const ne = {}, Os = "___SYMBOL___ROOT___";
function ze(n, t = Ms) {
  return F.document.createElementNS(t, n);
}
function dt(n, t = !1) {
  if (n instanceof Ns) return n;
  if (typeof n == "object") return zn(n);
  if (n == null) return new ne[Os]();
  if (typeof n == "string" && n.trim().charAt(0) !== "<") return zn(F.document.querySelector(n));
  const e = t ? F.document.createElement("div") : ze("svg");
  return e.innerHTML = n.trim(), n = zn(e.firstElementChild), e.removeChild(e.firstElementChild), n;
}
function W(n, t) {
  return t && (t instanceof F.window.Node || t.ownerDocument && t instanceof t.ownerDocument.defaultView.Node) ? t : ze(n);
}
function ft(n) {
  if (!n) return null;
  if (n.instance instanceof Ns) return n.instance;
  if (n.nodeName === "#document-fragment") return new ne.Fragment(n);
  let t = eo(n.nodeName || "Dom");
  return t === "LinearGradient" || t === "RadialGradient" ? t = "Gradient" : ne[t] || (t = "Dom"), new ne[t](n);
}
let zn = ft;
function $(n, t = n.name, e = !1) {
  return ne[t] = n, e && (ne[Os] = n), Gi(Object.getOwnPropertyNames(n.prototype)), n;
}
function qa(n) {
  return ne[n];
}
let Za = 1e3;
function no(n) {
  return "Svgjs" + eo(n) + Za++;
}
function so(n) {
  for (let t = n.children.length - 1; t >= 0; t--) so(n.children[t]);
  return n.id && (n.id = no(n.nodeName)), n;
}
function z(n, t) {
  let e, s;
  for (n = Array.isArray(n) ? n : [n], s = n.length - 1; s >= 0; s--) for (e in t) n[s].prototype[e] = t[e];
}
function Z(n) {
  return function(...t) {
    const e = t[t.length - 1];
    return e && e.constructor === Object && !(e instanceof Array) ? n.apply(this, t.slice(0, -1)).attr(e) : n.apply(this, t);
  };
}
function Wa() {
  return this.parent().children();
}
function Va() {
  return this.parent().index(this);
}
function Ka() {
  return this.siblings()[this.position() + 1];
}
function Ja() {
  return this.siblings()[this.position() - 1];
}
function Qa() {
  const n = this.position();
  return this.parent().add(this.remove(), n + 1), this;
}
function tc() {
  const n = this.position();
  return this.parent().add(this.remove(), n ? n - 1 : 0), this;
}
function ec() {
  return this.parent().add(this.remove()), this;
}
function nc() {
  return this.parent().add(this.remove(), 0), this;
}
function sc(n) {
  n = dt(n), n.remove();
  const t = this.position();
  return this.parent().add(n, t), this;
}
function ic(n) {
  n = dt(n), n.remove();
  const t = this.position();
  return this.parent().add(n, t + 1), this;
}
function oc(n) {
  return n = dt(n), n.before(this), this;
}
function rc(n) {
  return n = dt(n), n.after(this), this;
}
B("Dom", {
  siblings: Wa,
  position: Va,
  next: Ka,
  prev: Ja,
  forward: Qa,
  backward: tc,
  front: ec,
  back: nc,
  before: sc,
  after: ic,
  insertBefore: oc,
  insertAfter: rc
});
const io = /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i, ac = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, cc = /rgb\((\d+),(\d+),(\d+)\)/, lc = /^(#[^\s]+)$/, hc = /\)\s*,?\s*/, dc = /\s/g, ni = /^#[a-f0-9]{3}$|^#[a-f0-9]{6}$/i, si = /^rgb\(/, ii = /^(\s+)?$/, oi = /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, uc = /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i, Bt = /[\s,]+/, Rs = /[MLHVCSQTAZ]/i;
function fc() {
  const n = this.attr("class");
  return n == null ? [] : n.trim().split(Bt);
}
function pc(n) {
  return this.classes().indexOf(n) !== -1;
}
function gc(n) {
  if (!this.hasClass(n)) {
    const t = this.classes();
    t.push(n), this.attr("class", t.join(" "));
  }
  return this;
}
function mc(n) {
  return this.hasClass(n) && this.attr("class", this.classes().filter(function(t) {
    return t !== n;
  }).join(" ")), this;
}
function yc(n) {
  return this.hasClass(n) ? this.removeClass(n) : this.addClass(n);
}
B("Dom", {
  classes: fc,
  hasClass: pc,
  addClass: gc,
  removeClass: mc,
  toggleClass: yc
});
const Qe = (n) => n.startsWith("--") ? n : to(n);
function bc(n, t) {
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
        const i = Qe(s);
        e[s] = this.node.style.getPropertyValue(i);
      }
      return e;
    }
    if (typeof n == "string") return this.node.style.getPropertyValue(Qe(n));
    if (typeof n == "object") for (const s in n) this.node.style.setProperty(Qe(s), n[s] == null || ii.test(n[s]) ? "" : n[s]);
  }
  return arguments.length === 2 && this.node.style.setProperty(Qe(n), t == null || ii.test(t) ? "" : t), this;
}
function vc() {
  return this.css("display", "");
}
function wc() {
  return this.css("display", "none");
}
function xc() {
  return this.css("display") !== "none";
}
B("Dom", {
  css: bc,
  show: vc,
  hide: wc,
  visible: xc
});
function _c(n, t, e) {
  if (n == null) return this.data(As(Ua(this.node.attributes, (s) => s.nodeName.indexOf("data-") === 0), (s) => s.nodeName.slice(5)));
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
B("Dom", { data: _c });
function Cc(n, t) {
  if (typeof arguments[0] == "object") for (const e in n) this.remember(e, n[e]);
  else {
    if (arguments.length === 1) return this.memory()[n];
    this.memory()[n] = t;
  }
  return this;
}
function Ec() {
  if (arguments.length === 0) this._memory = {};
  else for (let n = arguments.length - 1; n >= 0; n--) delete this.memory()[arguments[n]];
  return this;
}
function Sc() {
  return this._memory = this._memory || {};
}
B("Dom", {
  remember: Cc,
  forget: Ec,
  memory: Sc
});
function kc(n) {
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
function Ac(n) {
  const t = Math.max(0, Math.min(255, Math.round(n))).toString(16);
  return t.length === 1 ? "0" + t : t;
}
function ae(n, t) {
  for (let e = t.length; e--; ) if (n[t[e]] == null) return !1;
  return !0;
}
function Mc(n, t) {
  const e = ae(n, "rgb") ? {
    _a: n.r,
    _b: n.g,
    _c: n.b,
    _d: 0,
    space: "rgb"
  } : ae(n, "xyz") ? {
    _a: n.x,
    _b: n.y,
    _c: n.z,
    _d: 0,
    space: "xyz"
  } : ae(n, "hsl") ? {
    _a: n.h,
    _b: n.s,
    _c: n.l,
    _d: 0,
    space: "hsl"
  } : ae(n, "lab") ? {
    _a: n.l,
    _b: n.a,
    _c: n.b,
    _d: 0,
    space: "lab"
  } : ae(n, "lch") ? {
    _a: n.l,
    _b: n.c,
    _c: n.h,
    _d: 0,
    space: "lch"
  } : ae(n, "cmyk") ? {
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
function Tc(n) {
  return n === "lab" || n === "xyz" || n === "lch";
}
function Gn(n, t, e) {
  return e < 0 && (e += 1), e > 1 && (e -= 1), e < 1 / 6 ? n + (t - n) * 6 * e : e < 1 / 2 ? t : e < 2 / 3 ? n + (t - n) * (2 / 3 - e) * 6 : n;
}
var It = class et {
  constructor(...t) {
    this.init(...t);
  }
  static isColor(t) {
    return t && (t instanceof et || this.isRgb(t) || this.test(t));
  }
  static isRgb(t) {
    return t && typeof t.r == "number" && typeof t.g == "number" && typeof t.b == "number";
  }
  static random(t = "vibrant", e) {
    const { random: s, round: i, sin: o, PI: r } = Math;
    if (t === "vibrant") {
      const a = 24 * s() + 57, c = 38 * s() + 45, l = 360 * s();
      return new et(a, c, l, "lch");
    } else if (t === "sine") {
      e = e ?? s();
      const a = i(80 * o(2 * r * e / 0.5 + 0.01) + 150), c = i(50 * o(2 * r * e / 0.5 + 4.6) + 200), l = i(100 * o(2 * r * e / 0.5 + 2.3) + 150);
      return new et(a, c, l);
    } else if (t === "pastel") {
      const a = 8 * s() + 86, c = 17 * s() + 9, l = 360 * s();
      return new et(a, c, l, "lch");
    } else if (t === "dark") {
      const a = 10 + 10 * s(), c = 50 * s() + 86, l = 360 * s();
      return new et(a, c, l, "lch");
    } else if (t === "rgb") {
      const a = 255 * s(), c = 255 * s(), l = 255 * s();
      return new et(a, c, l);
    } else if (t === "lab") {
      const a = 100 * s(), c = 256 * s() - 128, l = 256 * s() - 128;
      return new et(a, c, l, "lab");
    } else if (t === "grey") {
      const a = 255 * s();
      return new et(a, a, a);
    } else throw new Error("Unsupported random color mode");
  }
  static test(t) {
    return typeof t == "string" && (ni.test(t) || si.test(t));
  }
  cmyk() {
    const { _a: t, _b: e, _c: s } = this.rgb(), [i, o, r] = [
      t,
      e,
      s
    ].map((h) => h / 255), a = Math.min(1 - i, 1 - o, 1 - r);
    if (a === 1) return new et(0, 0, 0, 1, "cmyk");
    const c = (1 - i - a) / (1 - a), l = (1 - o - a) / (1 - a), d = (1 - r - a) / (1 - a);
    return new et(c, l, d, a, "cmyk");
  }
  hsl() {
    const { _a: t, _b: e, _c: s } = this.rgb(), [i, o, r] = [
      t,
      e,
      s
    ].map((p) => p / 255), a = Math.max(i, o, r), c = Math.min(i, o, r), l = (a + c) / 2, d = a === c, h = a - c, u = d ? 0 : l > 0.5 ? h / (2 - a - c) : h / (a + c), f = d ? 0 : a === i ? ((o - r) / h + (o < r ? 6 : 0)) / 6 : a === o ? ((r - i) / h + 2) / 6 : a === r ? ((i - o) / h + 4) / 6 : 0;
    return new et(360 * f, 100 * u, 100 * l, "hsl");
  }
  init(t = 0, e = 0, s = 0, i = 0, o = "rgb") {
    if (t = t || 0, this.space) for (const h in this.space) delete this[this.space[h]];
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
      const h = Mc(t, e);
      Object.assign(this, h);
    } else if (typeof t == "string") if (si.test(t)) {
      const h = t.replace(dc, ""), [u, f, p] = cc.exec(h).slice(1, 4).map((g) => parseInt(g));
      Object.assign(this, {
        _a: u,
        _b: f,
        _c: p,
        _d: 0,
        space: "rgb"
      });
    } else if (ni.test(t)) {
      const h = (g) => parseInt(g, 16), [, u, f, p] = ac.exec(kc(t)).map(h);
      Object.assign(this, {
        _a: u,
        _b: f,
        _c: p,
        _d: 0,
        space: "rgb"
      });
    } else throw Error("Unsupported string format, can't construct Color");
    const { _a: r, _b: a, _c: c, _d: l } = this, d = this.space === "rgb" ? {
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
    Object.assign(this, d);
  }
  lab() {
    const { x: t, y: e, z: s } = this.xyz(), i = 116 * e - 16, o = 500 * (t - e), r = 200 * (e - s);
    return new et(i, o, r, "lab");
  }
  lch() {
    const { l: t, a: e, b: s } = this.lab(), i = Math.sqrt(e ** 2 + s ** 2);
    let o = 180 * Math.atan2(s, e) / Math.PI;
    return o < 0 && (o *= -1, o = 360 - o), new et(t, i, o, "lch");
  }
  rgb() {
    if (this.space === "rgb") return this;
    if (Tc(this.space)) {
      let { x: t, y: e, z: s } = this;
      if (this.space === "lab" || this.space === "lch") {
        let { l: u, a: f, b: p } = this;
        if (this.space === "lch") {
          const { c: v, h: w } = this, _ = Math.PI / 180;
          f = v * Math.cos(_ * w), p = v * Math.sin(_ * w);
        }
        const g = (u + 16) / 116, m = f / 500 + g, b = g - p / 200, y = 16 / 116, x = 8856e-6, E = 7.787;
        t = 0.95047 * (m ** 3 > x ? m ** 3 : (m - y) / E), e = 1 * (g ** 3 > x ? g ** 3 : (g - y) / E), s = 1.08883 * (b ** 3 > x ? b ** 3 : (b - y) / E);
      }
      const i = t * 3.2406 + e * -1.5372 + s * -0.4986, o = t * -0.9689 + e * 1.8758 + s * 0.0415, r = t * 0.0557 + e * -0.204 + s * 1.057, a = Math.pow, c = 31308e-7, l = i > c ? 1.055 * a(i, 1 / 2.4) - 0.055 : 12.92 * i, d = o > c ? 1.055 * a(o, 1 / 2.4) - 0.055 : 12.92 * o, h = r > c ? 1.055 * a(r, 1 / 2.4) - 0.055 : 12.92 * r;
      return new et(255 * l, 255 * d, 255 * h);
    } else if (this.space === "hsl") {
      let { h: t, s: e, l: s } = this;
      if (t /= 360, e /= 100, s /= 100, e === 0)
        return s *= 255, new et(s, s, s);
      const i = s < 0.5 ? s * (1 + e) : s + e - s * e, o = 2 * s - i, r = 255 * Gn(o, i, t + 1 / 3), a = 255 * Gn(o, i, t), c = 255 * Gn(o, i, t - 1 / 3);
      return new et(r, a, c);
    } else if (this.space === "cmyk") {
      const { c: t, m: e, y: s, k: i } = this, o = 255 * (1 - Math.min(1, t * (1 - i) + i)), r = 255 * (1 - Math.min(1, e * (1 - i) + i)), a = 255 * (1 - Math.min(1, s * (1 - i) + i));
      return new et(o, r, a);
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
    const [t, e, s] = this._clamped().map(Ac);
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
    ].map((m) => m / 255), a = i > 0.04045 ? Math.pow((i + 0.055) / 1.055, 2.4) : i / 12.92, c = o > 0.04045 ? Math.pow((o + 0.055) / 1.055, 2.4) : o / 12.92, l = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92, d = (a * 0.4124 + c * 0.3576 + l * 0.1805) / 0.95047, h = (a * 0.2126 + c * 0.7152 + l * 0.0722) / 1, u = (a * 0.0193 + c * 0.1192 + l * 0.9505) / 1.08883, f = d > 8856e-6 ? Math.pow(d, 1 / 3) : 7.787 * d + 16 / 116, p = h > 8856e-6 ? Math.pow(h, 1 / 3) : 7.787 * h + 16 / 116, g = u > 8856e-6 ? Math.pow(u, 1 / 3) : 7.787 * u + 16 / 116;
    return new et(f, p, g, "xyz");
  }
  _clamped() {
    const { _a: t, _b: e, _c: s } = this.rgb(), { max: i, min: o, round: r } = Math, a = (c) => i(0, o(r(c), 255));
    return [
      t,
      e,
      s
    ].map(a);
  }
}, Q = class oo {
  constructor(...t) {
    this.init(...t);
  }
  clone() {
    return new oo(this);
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
    G.isMatrixLike(t) || (t = new G(t));
    const { x: e, y: s } = this;
    return this.x = t.a * e + t.c * s + t.e, this.y = t.b * e + t.d * s + t.f, this;
  }
};
function Nc(n, t) {
  return new Q(n, t).transformO(this.screenCTM().inverseO());
}
function ce(n, t, e) {
  return Math.abs(t - n) < 1e-6;
}
var G = class nt {
  constructor(...t) {
    this.init(...t);
  }
  static formatTransforms(t) {
    const e = t.flip === "both" || t.flip === !0, s = t.flip && (e || t.flip === "x") ? -1 : 1, i = t.flip && (e || t.flip === "y") ? -1 : 1, o = t.skew && t.skew.length ? t.skew[0] : isFinite(t.skew) ? t.skew : isFinite(t.skewX) ? t.skewX : 0, r = t.skew && t.skew.length ? t.skew[1] : isFinite(t.skew) ? t.skew : isFinite(t.skewY) ? t.skewY : 0, a = t.scale && t.scale.length ? t.scale[0] * s : isFinite(t.scale) ? t.scale * s : isFinite(t.scaleX) ? t.scaleX * s : s, c = t.scale && t.scale.length ? t.scale[1] * i : isFinite(t.scale) ? t.scale * i : isFinite(t.scaleY) ? t.scaleY * i : i, l = t.shear || 0, d = t.rotate || t.theta || 0, h = new Q(t.origin || t.around || t.ox || t.originX, t.oy || t.originY), u = h.x, f = h.y, p = new Q(t.position ?? t.px ?? t.positionX ?? NaN, t.py ?? t.positionY ?? NaN), g = p.x, m = p.y, b = new Q(t.translate || t.tx || t.translateX, t.ty || t.translateY), y = b.x, x = b.y, E = new Q(t.relative || t.rx || t.relativeX, t.ry || t.relativeY);
    return {
      scaleX: a,
      scaleY: c,
      skewX: o,
      skewY: r,
      shear: l,
      theta: d,
      rx: E.x,
      ry: E.y,
      tx: y,
      ty: x,
      ox: u,
      oy: f,
      px: g,
      py: m
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
    return new nt(this);
  }
  decompose(t = 0, e = 0) {
    const s = this.a, i = this.b, o = this.c, r = this.d, a = this.e, c = this.f, l = s * r - i * o, d = l > 0 ? 1 : -1, h = d * Math.sqrt(s * s + i * i), u = Math.atan2(d * i, d * s), f = 180 / Math.PI * u, p = (s * o + i * r) / l;
    return {
      scaleX: h,
      scaleY: o * h / (p * s - i) || r * h / (p * i + s),
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
    const e = new nt(t);
    return ce(this.a, e.a) && ce(this.b, e.b) && ce(this.c, e.c) && ce(this.d, e.d) && ce(this.e, e.e) && ce(this.f, e.f);
  }
  flip(t, e) {
    return this.clone().flipO(t, e);
  }
  flipO(t, e) {
    return t === "x" ? this.scaleO(-1, 1, e, 0) : t === "y" ? this.scaleO(1, -1, 0, e) : this.scaleO(-1, -1, t, e || t);
  }
  init(t) {
    const e = nt.fromArray([
      1,
      0,
      0,
      1,
      0,
      0
    ]);
    return t = t instanceof mt ? t.matrixify() : typeof t == "string" ? nt.fromArray(t.split(Bt).map(parseFloat)) : Array.isArray(t) ? nt.fromArray(t) : typeof t == "object" && nt.isMatrixLike(t) ? t : typeof t == "object" ? new nt().transform(t) : arguments.length === 6 ? nt.fromArray([].slice.call(arguments)) : e, this.a = t.a != null ? t.a : e.a, this.b = t.b != null ? t.b : e.b, this.c = t.c != null ? t.c : e.c, this.d = t.d != null ? t.d : e.d, this.e = t.e != null ? t.e : e.e, this.f = t.f != null ? t.f : e.f, this;
  }
  inverse() {
    return this.clone().inverseO();
  }
  inverseO() {
    const t = this.a, e = this.b, s = this.c, i = this.d, o = this.e, r = this.f, a = t * i - e * s;
    if (!a) throw new Error("Cannot invert " + this);
    const c = i / a, l = -e / a, d = -s / a, h = t / a, u = -(c * o + d * r), f = -(l * o + h * r);
    return this.a = c, this.b = l, this.c = d, this.d = h, this.e = u, this.f = f, this;
  }
  lmultiply(t) {
    return this.clone().lmultiplyO(t);
  }
  lmultiplyO(t) {
    const e = this, s = t instanceof nt ? t : new nt(t);
    return nt.matrixMultiply(s, e, this);
  }
  multiply(t) {
    return this.clone().multiplyO(t);
  }
  multiplyO(t) {
    const e = this, s = t instanceof nt ? t : new nt(t);
    return nt.matrixMultiply(e, s, this);
  }
  rotate(t, e, s) {
    return this.clone().rotateO(t, e, s);
  }
  rotateO(t, e = 0, s = 0) {
    t = Dn(t);
    const i = Math.cos(t), o = Math.sin(t), { a: r, b: a, c, d: l, e: d, f: h } = this;
    return this.a = r * i - a * o, this.b = a * i + r * o, this.c = c * i - l * o, this.d = l * i + c * o, this.e = d * i - h * o + s * o - e * i + e, this.f = h * i + d * o - e * o - s * i + s, this;
  }
  scale() {
    return this.clone().scaleO(...arguments);
  }
  scaleO(t, e = t, s = 0, i = 0) {
    arguments.length === 3 && (i = s, s = e, e = t);
    const { a: o, b: r, c: a, d: c, e: l, f: d } = this;
    return this.a = o * t, this.b = r * e, this.c = a * t, this.d = c * e, this.e = l * t - s * t + s, this.f = d * e - i * e + i, this;
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
    arguments.length === 3 && (i = s, s = e, e = t), t = Dn(t), e = Dn(e);
    const o = Math.tan(t), r = Math.tan(e), { a, b: c, c: l, d, e: h, f: u } = this;
    return this.a = a + c * o, this.b = c + a * r, this.c = l + d * o, this.d = d + l * r, this.e = h + u * o - i * o, this.f = u + h * r - s * r, this;
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
    if (nt.isMatrixLike(t)) return new nt(t).multiplyO(this);
    const e = nt.formatTransforms(t), s = this, { x: i, y: o } = new Q(e.ox, e.oy).transform(s), r = new nt().translateO(e.rx, e.ry).lmultiplyO(s).translateO(-i, -o).scaleO(e.scaleX, e.scaleY).skewO(e.skewX, e.skewY).shearO(e.shear).rotateO(e.theta).translateO(i, o);
    if (isFinite(e.px) || isFinite(e.py)) {
      const a = new Q(i, o).transform(r), c = isFinite(e.px) ? e.px - a.x : 0, l = isFinite(e.py) ? e.py - a.y : 0;
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
function Oc() {
  return new G(this.node.getCTM());
}
function Rc() {
  try {
    if (typeof this.isRoot == "function" && !this.isRoot()) {
      const n = this.rect(1, 1), t = n.node.getScreenCTM();
      return n.remove(), new G(t);
    }
    return new G(this.node.getScreenCTM());
  } catch {
    return console.warn(`Cannot get CTM from SVG node ${this.node.nodeName}. Is the element rendered?`), new G();
  }
}
$(G, "Matrix");
function Lt() {
  if (!Lt.nodes || Lt.nodes.svg.node.ownerDocument !== F.document) {
    const n = dt().size(2, 0);
    n.node.style.cssText = [
      "opacity: 0",
      "position: absolute",
      "left: -100%",
      "top: -100%",
      "overflow: hidden"
    ].join(";"), n.attr("focusable", "false"), n.attr("aria-hidden", "true"), Lt.nodes = {
      svg: n,
      path: n.path().node
    };
  }
  return Lt.nodes.svg.node.parentNode || Lt.nodes.svg.addTo(F.document.body || F.document.documentElement), Lt.nodes;
}
function ro(n) {
  return !n.width && !n.height && !n.x && !n.y;
}
function Pc(n) {
  return n === F.document || (F.document.documentElement.contains || function(t) {
    for (; t.parentNode; ) t = t.parentNode;
    return t === F.document;
  }).call(F.document.documentElement, n);
}
var st = class rn {
  constructor(...t) {
    this.init(...t);
  }
  addOffset() {
    return this.x += F.window.pageXOffset, this.y += F.window.pageYOffset, new rn(this);
  }
  init(t) {
    return t = typeof t == "string" ? t.split(Bt).map(parseFloat) : Array.isArray(t) ? t : typeof t == "object" ? [
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
    return ro(this);
  }
  merge(t) {
    const e = Math.min(this.x, t.x), s = Math.min(this.y, t.y), i = Math.max(this.x + this.width, t.x + t.width) - e, o = Math.max(this.y + this.height, t.y + t.height) - s;
    return new rn(e, s, i, o);
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
    t instanceof G || (t = new G(t));
    let e = 1 / 0, s = -1 / 0, i = 1 / 0, o = -1 / 0;
    return [
      new Q(this.x, this.y),
      new Q(this.x2, this.y),
      new Q(this.x, this.y2),
      new Q(this.x2, this.y2)
    ].forEach(function(r) {
      r = r.transform(t), e = Math.min(e, r.x), s = Math.max(s, r.x), i = Math.min(i, r.y), o = Math.max(o, r.y);
    }), new rn(e, i, s - e, o - i);
  }
};
function ao(n, t, e) {
  let s;
  try {
    if (s = t(n.node), ro(s) && !Pc(n.node)) throw new Error("Element not in the dom");
  } catch {
    s = e(n);
  }
  return s;
}
function Ic() {
  const e = ao(this, (s) => s.getBBox(), (s) => {
    try {
      const i = s.clone().addTo(Lt().svg).show(), o = i.node.getBBox();
      return i.remove(), o;
    } catch (i) {
      throw new Error(`Getting bbox of element "${s.node.nodeName}" is not possible: ${i.toString()}`);
    }
  });
  return new st(e);
}
function Dc(n) {
  const s = ao(this, (o) => o.getBoundingClientRect(), (o) => {
    throw new Error(`Getting rbox of element "${o.node.nodeName}" is not possible`);
  }), i = new st(s);
  return n ? i.transform(n.screenCTM().inverseO()) : i.addOffset();
}
function Lc(n, t) {
  const e = this.bbox();
  return n > e.x && t > e.y && n < e.x + e.width && t < e.y + e.height;
}
B({ viewbox: {
  viewbox(n, t, e, s) {
    return n == null ? new st(this.attr("viewBox")) : this.attr("viewBox", new st(n, t, e, s));
  },
  zoom(n, t) {
    let { width: e, height: s } = this.attr(["width", "height"]);
    if ((!e && !s || typeof e == "string" || typeof s == "string") && (e = this.node.clientWidth, s = this.node.clientHeight), !e || !s) throw new Error("Impossible to get absolute width and height. Please provide an absolute width and height attribute on the zooming element");
    const i = this.viewbox(), o = e / i.width, r = s / i.height, a = Math.min(o, r);
    if (n == null) return a;
    let c = a / n;
    c === 1 / 0 && (c = Number.MAX_SAFE_INTEGER / 100), t = t || new Q(e / 2 / o + i.x, s / 2 / r + i.y);
    const l = new st(i).transform(new G({
      scale: c,
      origin: t
    }));
    return this.viewbox(l);
  }
} });
$(st, "Box");
var zt = class extends Array {
  constructor(n = [], ...t) {
    if (super(n, ...t), typeof n == "number") return this;
    this.length = 0, this.push(...n);
  }
};
z([zt], {
  each(n, ...t) {
    return typeof n == "function" ? this.map((e, s, i) => n.call(e, e, s, i)) : this.map((e) => e[n](...t));
  },
  toArray() {
    return Array.prototype.concat.apply([], this);
  }
});
const ri = [
  "toArray",
  "constructor",
  "each"
];
zt.extend = function(n) {
  n = n.reduce((t, e) => ((0, Qt.default)(ri).call(ri, e) || e[0] === "_" || (e in Array.prototype && (t["$" + e] = Array.prototype[e]), t[e] = function(...s) {
    return this.each(e, ...s);
  }), t), {}), z([zt], n);
};
function es(n) {
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
  const s = t.match(lc);
  return s ? s[1].slice(1) : null;
}
function co(n, t) {
  const e = `#${F.window.CSS.escape(t)}`;
  return n.nodeType === 1 && n.matches(e) ? n : n.querySelector(e);
}
function zc(n, t) {
  const e = es(t);
  return e ? co(n.getRootNode(), e) : null;
}
function Ze(n, t, e = `[${t}]`) {
  const s = n.getAttribute("id"), i = n.getRootNode();
  if (!s || co(i, s) !== n) return new zt();
  const o = [];
  i.nodeType === 1 && i.matches(e) && es(i.getAttribute(t)) === s && o.push(ft(i));
  for (const r of i.querySelectorAll(e)) es(r.getAttribute(t)) === s && o.push(ft(r));
  return new zt(o);
}
function Gc(n, t) {
  return new zt(As((t || F.document).querySelectorAll(n), function(e) {
    return ft(e);
  }));
}
function Bc(n) {
  return Gc(n, this.node);
}
function Hc(n) {
  return ft(this.node.querySelector(n));
}
let Fc = 0;
const ns = /* @__PURE__ */ new WeakMap(), ss = /* @__PURE__ */ new WeakMap(), is = () => /* @__PURE__ */ Object.create(null);
function Ps(n) {
  const t = n.getEventHolder();
  let e = ns.get(t);
  return e || (e = is(), ns.set(t, e)), e;
}
function Is(n) {
  return n.getEventTarget();
}
function $c(n) {
  ns.delete(n.getEventHolder());
}
function wt(n, t, e, s, i) {
  const o = e.bind(s || n), r = i || !1, a = dt(n), c = Ps(a), l = Is(a);
  t = Array.isArray(t) ? t : t.split(Bt);
  let d = ss.get(e);
  d || (d = ++Fc, ss.set(e, d)), t.forEach(function(h) {
    const u = h.split(".")[0], f = h.split(".")[1] || "*";
    c[u] = c[u] || is(), c[u][f] = c[u][f] || is(), c[u][f][d] = c[u][f][d] || [], c[u][f][d].push({
      listener: o,
      options: r
    }), l.addEventListener(u, o, r);
  });
}
function tt(n, t, e, s) {
  const i = dt(n), o = Ps(i), r = Is(i);
  typeof e == "function" && (e = ss.get(e), !e) || (t = Array.isArray(t) ? t : (t || "").split(Bt), t.forEach(function(a) {
    const c = a && a.split(".")[0], l = a && a.split(".")[1];
    let d, h;
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
        for (h in o[c][l]) tt(r, [c, l].join("."), h);
        delete o[c][l];
      }
    } else if (l)
      for (a in o) for (d in o[a]) l === d && tt(r, [a, l].join("."));
    else if (c) {
      if (o[c]) {
        for (d in o[c]) tt(r, [c, d].join("."));
        delete o[c];
      }
    } else {
      for (a in o) tt(r, a);
      $c(i);
    }
  }));
}
function Uc(n, t, e, s) {
  const i = Is(n);
  return t instanceof F.window.Event || (t = new F.window.CustomEvent(t, {
    detail: e,
    cancelable: !0,
    ...s
  })), i.dispatchEvent(t), t;
}
var We = class extends Ns {
  addEventListener() {
  }
  dispatch(n, t, e) {
    return Uc(this, n, t, e);
  }
  dispatchEvent(n) {
    const t = Ps(this)[n.type];
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
    return tt(this, n, t, e), this;
  }
  on(n, t, e, s) {
    return wt(this, n, t, e, s), this;
  }
  removeEventListener() {
  }
};
$(We, "EventTarget");
function ai() {
}
const Te = {
  duration: 400,
  ease: ">",
  delay: 0
}, Yc = {
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
var ge = class extends Array {
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
    return n instanceof Array ? n : n.trim().split(Bt).map(parseFloat);
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
}, U = class At {
  constructor(...t) {
    this.init(...t);
  }
  convert(t) {
    return new At(this.value, t);
  }
  divide(t) {
    return t = new At(t), new At(this / t, this.unit || t.unit);
  }
  init(t, e) {
    return e = Array.isArray(t) ? t[1] : e, t = Array.isArray(t) ? t[0] : t, this.value = 0, this.unit = e || "", typeof t == "number" ? this.value = isNaN(t) ? 0 : isFinite(t) ? t : t < 0 ? -34e37 : 34e37 : typeof t == "string" ? (e = t.match(io), e && (this.value = parseFloat(e[1]), e[5] === "%" ? this.value /= 100 : e[5] === "s" && (this.value *= 1e3), this.unit = e[5])) : t instanceof At && (this.value = t.valueOf(), this.unit = t.unit), this;
  }
  minus(t) {
    return t = new At(t), new At(this - t, this.unit || t.unit);
  }
  plus(t) {
    return t = new At(t), new At(this + t, this.unit || t.unit);
  }
  times(t) {
    return t = new At(t), new At(this * t, this.unit || t.unit);
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
const jc = /* @__PURE__ */ new Set([
  "fill",
  "stroke",
  "color",
  "bgcolor",
  "stop-color",
  "flood-color",
  "lighting-color"
]), lo = [];
function Xc(n) {
  lo.push(n);
}
function qc(n, t, e) {
  if (n == null) {
    n = {}, t = this.node.attributes;
    for (const s of t) n[s.nodeName] = oi.test(s.nodeValue) ? parseFloat(s.nodeValue) : s.nodeValue;
    return n;
  } else {
    if (n instanceof Array) return n.reduce((s, i) => (s[i] = this.attr(i), s), {});
    if (typeof n == "object" && n.constructor === Object) for (t in n) this.attr(t, n[t]);
    else if (t === null) this.node.removeAttribute(n);
    else {
      if (t == null)
        return t = this.node.getAttribute(n), t == null ? Yc[n] : oi.test(t) ? parseFloat(t) : t;
      t = lo.reduce((s, i) => i(n, s, this), t), typeof t == "number" ? t = new U(t) : jc.has(n) && It.isColor(t) ? t = new It(t) : t.constructor === Array && (t = new ge(t)), n === "leading" ? this.leading && this.leading(t) : typeof e == "string" ? this.node.setAttributeNS(e, n, t.toString()) : this.node.setAttribute(n, t.toString()), this.rebuild && (n === "font-size" || n === "x") && this.rebuild();
    }
  }
  return this;
}
var me = class ho extends We {
  constructor(t, e) {
    super(), this.node = t, this.type = t.nodeName, e && t !== e && this.attr(e);
  }
  add(t, e) {
    return t = dt(t), t.removeNamespace && this.node instanceof F.window.SVGElement && t.removeNamespace(), e == null ? this.node.appendChild(t.node) : t.node !== this.node.childNodes[e] && this.node.insertBefore(t.node, this.node.childNodes[e]), this;
  }
  addTo(t, e) {
    return dt(t).put(this, e);
  }
  children() {
    return new zt(As(this.node.children, function(t) {
      return ft(t);
    }));
  }
  clear() {
    for (; this.node.hasChildNodes(); ) this.node.removeChild(this.node.lastChild);
    return this;
  }
  clone(t = !0, e = !0) {
    this.writeDataToDom();
    let s = this.node.cloneNode(t);
    return e && (s = so(s)), new this.constructor(s);
  }
  each(t, e) {
    const s = this.children();
    let i, o;
    for (i = 0, o = s.length; i < o; i++)
      t.apply(s[i], [i, s]), e && s[i].each(t, e);
    return this;
  }
  element(t, e) {
    return this.put(new ho(ze(t), e));
  }
  first() {
    return ft(this.node.firstChild);
  }
  get(t) {
    return ft(this.node.childNodes[t]);
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
    return this.xml(t, e, Xa);
  }
  id(t) {
    return typeof t > "u" && !this.node.id && (this.node.id = no(this.type)), this.attr("id", t);
  }
  index(t) {
    return [].slice.call(this.node.childNodes).indexOf(t.node);
  }
  last() {
    return ft(this.node.lastChild);
  }
  matches(t) {
    const e = this.node, s = e.matches || e.matchesSelector || e.msMatchesSelector || e.mozMatchesSelector || e.webkitMatchesSelector || e.oMatchesSelector || null;
    return s && s.call(e, t);
  }
  parent(t) {
    let e = this;
    if (!e.node.parentNode) return null;
    if (e = ft(e.node.parentNode), !t) return e;
    do
      if (typeof t == "string" ? e.matches(t) : e instanceof t) return e;
    while (e = ft(e.node.parentNode));
    return e;
  }
  put(t, e) {
    return t = dt(t), this.add(t, e), t;
  }
  putIn(t, e) {
    return dt(t).add(this, e);
  }
  remove() {
    return this.parent() && this.parent().removeElement(this), this;
  }
  removeElement(t) {
    return this.node.removeChild(t.node), this;
  }
  replace(t) {
    return t = dt(t), this.node.parentNode && this.node.parentNode.replaceChild(t.node, this.node), t;
  }
  round(t = 2, e = null) {
    const s = 10 ** t, i = this.attr(e);
    for (const o in i) typeof i[o] == "number" && (i[o] = Math.round(i[o] * s) / s);
    return this.attr(i), this;
  }
  svg(t, e) {
    return this.xml(t, e, Ms);
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
        if (a = ft(a.node.cloneNode(!0)), e) {
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
    const i = ze("wrapper", s), o = F.document.createDocumentFragment();
    i.innerHTML = t;
    for (let a = i.children.length; a--; ) o.appendChild(i.firstElementChild);
    const r = this.parent();
    return e ? this.replace(o) && r : this.add(o);
  }
};
z(me, {
  attr: qc,
  find: Bc,
  findOne: Hc
});
$(me, "Dom");
var mt = class extends me {
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
    e || (t = t && dt(t).node);
    const o = new zt();
    let r = this;
    for (; (r = r.parent()) && r.node !== F.document && r.node.nodeName !== "#document-fragment" && (o.push(r), !(!e && r.node === t || e && r.matches(t))); )
      if (i && r.node === i) return null;
    return o;
  }
  reference(t) {
    if (t = this.attr(t), !t) return null;
    const e = zc(this.node, t);
    return e ? dt(e) : null;
  }
  root() {
    const t = this.parent(qa(Os));
    return t && t.root();
  }
  setData(t) {
    return this.dom = t, this;
  }
  size(t, e) {
    const s = oe(this, t, e);
    return this.width(new U(s.width)).height(new U(s.height));
  }
  width(t) {
    return this.attr("width", t);
  }
  writeDataToDom(t) {
    return ja(this, this.dom, t), super.writeDataToDom();
  }
  x(t) {
    return this.attr("x", t);
  }
  y(t) {
    return this.attr("y", t);
  }
};
z(mt, {
  bbox: Ic,
  rbox: Dc,
  inside: Lc,
  point: Nc,
  ctm: Oc,
  screenCTM: Rc
});
$(mt, "Element");
const Ee = {
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
    if (typeof s == "string" || s instanceof It || It.isRgb(s) || s instanceof mt) this.attr(n, s);
    else for (e = Ee[n].length - 1; e >= 0; e--) s[Ee[n][e]] != null && this.attr(Ee.prefix(n, Ee[n][e]), s[Ee[n][e]]);
    return this;
  }, B(["Element", "Runner"], t);
});
B(["Element", "Runner"], {
  matrix: function(n, t, e, s, i, o) {
    return n == null ? new G(this) : this.attr("transform", new G(n, t, e, s, i, o));
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
B("radius", { radius: function(n, t = n) {
  return (this._element || this).type === "radialGradient" ? this.attr("r", new U(n)) : this.rx(n).ry(t);
} });
B("Path", {
  length: function() {
    return this.node.getTotalLength();
  },
  pointAt: function(n) {
    return new Q(this.node.getPointAtLength(n));
  }
});
B(["Element", "Runner"], { font: function(n, t) {
  if (typeof n == "object") {
    for (t in n) this.font(t, n[t]);
    return this;
  }
  return n === "leading" ? this.leading(t) : n === "anchor" ? this.attr("text-anchor", t) : n === "size" || n === "family" || n === "weight" || n === "stretch" || n === "variant" || n === "style" ? this.attr("font-" + n, t) : this.attr(n, t);
} });
B("Element", [
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
function Zc() {
  return this.attr("transform", null);
}
function Wc() {
  return (this.attr("transform") || "").split(hc).slice(0, -1).map(function(n) {
    const t = n.trim().split("(");
    return [t[0].trim(), t[1].split(Bt).map(function(e) {
      return parseFloat(e);
    })];
  }).reverse().reduce(function(n, t) {
    return t[0] === "matrix" ? n.lmultiply(G.fromArray(t[1])) : n[t[0]].apply(n, t[1]);
  }, new G());
}
function Vc(n, t) {
  if (this === n) return this;
  if (ts(this.node)) return this.addTo(n, t);
  const e = this.screenCTM(), s = n.screenCTM().inverse();
  return this.addTo(n, t).untransform().transform(s.multiply(e)), this;
}
function Kc(n) {
  return this.toParent(this.root(), n);
}
function Jc(n, t) {
  if (n == null || typeof n == "string") {
    const s = new G(this).decompose();
    return n == null ? s : s[n];
  }
  G.isMatrixLike(n) || (n = {
    ...n,
    origin: Qn(n, this)
  });
  const e = new G(t === !0 ? this : t || !1).transform(n);
  return this.attr("transform", e);
}
B("Element", {
  untransform: Zc,
  matrixify: Wc,
  toParent: Vc,
  toRoot: Kc,
  transform: Jc
});
var kt = class uo extends mt {
  flatten() {
    return this.each(function() {
      if (this instanceof uo) return this.flatten().ungroup();
    }), this;
  }
  ungroup(t = this.parent(), e = t.index(this)) {
    return e = e === -1 ? t.children().length : e, this.each(function(s, i) {
      return i[i.length - s - 1].toParent(t, e);
    }), this.remove();
  }
};
$(kt, "Container");
var Ds = class extends kt {
  constructor(n, t = n) {
    super(W("defs", n), t);
  }
  flatten() {
    return this;
  }
  ungroup() {
    return this;
  }
};
$(Ds, "Defs");
var xt = class extends mt {
};
$(xt, "Shape");
var Qc = /* @__PURE__ */ ve({
  cx: () => go,
  cy: () => mo,
  height: () => bo,
  rx: () => Ls,
  ry: () => zs,
  width: () => yo,
  x: () => fo,
  y: () => po
});
function Ls(n) {
  return this.attr("rx", n);
}
function zs(n) {
  return this.attr("ry", n);
}
function fo(n) {
  return n == null ? this.cx() - this.rx() : this.cx(n + this.rx());
}
function po(n) {
  return n == null ? this.cy() - this.ry() : this.cy(n + this.ry());
}
function go(n) {
  return this.attr("cx", n);
}
function mo(n) {
  return this.attr("cy", n);
}
function yo(n) {
  return n == null ? this.rx() * 2 : this.rx(new U(n).divide(2));
}
function bo(n) {
  return n == null ? this.ry() * 2 : this.ry(new U(n).divide(2));
}
var Ve = class extends xt {
  constructor(n, t = n) {
    super(W("ellipse", n), t);
  }
  size(n, t) {
    const e = oe(this, n, t);
    return this.rx(new U(e.width).divide(2)).ry(new U(e.height).divide(2));
  }
};
z(Ve, Qc);
B("Container", { ellipse: Z(function(n = 0, t = n) {
  return this.put(new Ve()).size(n, t).move(0, 0);
}) });
$(Ve, "Ellipse");
var vo = class extends me {
  constructor(n = F.document.createDocumentFragment()) {
    super(n);
  }
  xml(n, t, e) {
    if (typeof n == "boolean" && (e = t, t = n, n = null), n == null || typeof n == "function") {
      const s = new me(ze("wrapper", e));
      return s.add(this.node.cloneNode(!0)), s.xml(!1, e);
    }
    return super.xml(n, !1, e);
  }
};
$(vo, "Fragment");
var tl = /* @__PURE__ */ ve({
  from: () => wo,
  to: () => xo
});
function wo(n, t) {
  return (this._element || this).type === "radialGradient" ? this.attr({
    fx: new U(n),
    fy: new U(t)
  }) : this.attr({
    x1: new U(n),
    y1: new U(t)
  });
}
function xo(n, t) {
  return (this._element || this).type === "radialGradient" ? this.attr({
    cx: new U(n),
    cy: new U(t)
  }) : this.attr({
    x2: new U(n),
    y2: new U(t)
  });
}
var Ke = class extends kt {
  constructor(n, t) {
    super(W(n + "Gradient", typeof n == "string" ? null : n), t);
  }
  attr(n, t, e) {
    return n === "transform" && (n = "gradientTransform"), super.attr(n, t, e);
  }
  bbox() {
    return new st();
  }
  targets() {
    return Ze(this.node, "fill");
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
z(Ke, tl);
B({
  Container: { gradient(...n) {
    return this.defs().gradient(...n);
  } },
  Defs: { gradient: Z(function(n, t) {
    return this.put(new Ke(n)).update(t);
  }) }
});
$(Ke, "Gradient");
var Ge = class extends kt {
  constructor(n, t = n) {
    super(W("pattern", n), t);
  }
  attr(n, t, e) {
    return n === "transform" && (n = "patternTransform"), super.attr(n, t, e);
  }
  bbox() {
    return new st();
  }
  targets() {
    return Ze(this.node, "fill");
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
B({
  Container: { pattern(...n) {
    return this.defs().pattern(...n);
  } },
  Defs: { pattern: Z(function(n, t, e) {
    return this.put(new Ge()).update(e).attr({
      x: 0,
      y: 0,
      width: n,
      height: t,
      patternUnits: "userSpaceOnUse"
    });
  }) }
});
$(Ge, "Pattern");
var En = class extends xt {
  constructor(t, e = t) {
    super(W("image", t), e);
  }
  load(t, e) {
    if (!t) return this;
    const s = new F.window.Image();
    return wt(s, "load", function(i) {
      const o = this.parent(Ge);
      this.width() === 0 && this.height() === 0 && this.size(s.width, s.height), o instanceof Ge && o.width() === 0 && o.height() === 0 && o.size(this.width(), this.height()), typeof e == "function" && e.call(this, i);
    }, this), wt(s, "load error", function() {
      tt(s);
    }), this.attr("href", s.src = t, qe);
  }
};
Xc(function(n, t, e) {
  return (n === "fill" || n === "stroke") && uc.test(t) && (t = e.root().defs().image(t)), t instanceof En && (t = e.root().defs().pattern(0, 0, (s) => {
    s.add(t);
  })), t;
});
B({ Container: { image: Z(function(n, t) {
  return this.put(new En()).size(0, 0).load(n, t);
}) } });
$(En, "Image");
var jt = class extends ge {
  bbox() {
    let n = -1 / 0, t = -1 / 0, e = 1 / 0, s = 1 / 0;
    return this.forEach(function(i) {
      n = Math.max(i[0], n), t = Math.max(i[1], t), e = Math.min(i[0], e), s = Math.min(i[1], s);
    }), new st(e, s, n - e, t - s);
  }
  move(n, t) {
    const e = this.bbox();
    if (n -= e.x, t -= e.y, !isNaN(n) && !isNaN(t)) for (let s = this.length - 1; s >= 0; s--) this[s] = [this[s][0] + n, this[s][1] + t];
    return this;
  }
  parse(n = [0, 0]) {
    const t = [];
    n instanceof Array ? n = Array.prototype.concat.apply([], n) : n = n.trim().split(Bt).map(parseFloat), n.length % 2 !== 0 && n.pop();
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
    G.isMatrixLike(n) || (n = new G(n));
    for (let t = this.length; t--; ) {
      const [e, s] = this[t];
      this[t][0] = n.a * e + n.c * s + n.e, this[t][1] = n.b * e + n.d * s + n.f;
    }
    return this;
  }
}, Gs = /* @__PURE__ */ ve({
  MorphArray: () => el,
  height: () => ol,
  width: () => il,
  x: () => nl,
  y: () => sl
});
const el = jt;
function nl(n) {
  return n == null ? this.bbox().x : this.move(n, this.bbox().y);
}
function sl(n) {
  return n == null ? this.bbox().y : this.move(this.bbox().x, n);
}
function il(n) {
  const t = this.bbox();
  return n == null ? t.width : this.size(n, t.height);
}
function ol(n) {
  const t = this.bbox();
  return n == null ? t.height : this.size(t.width, n);
}
var ye = class extends xt {
  constructor(n, t = n) {
    super(W("line", n), t);
  }
  array() {
    return new jt([[this.attr("x1"), this.attr("y1")], [this.attr("x2"), this.attr("y2")]]);
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
    } : n = new jt(n).toLine(), this.attr(n));
  }
  size(n, t) {
    const e = oe(this, n, t);
    return this.attr(this.array().size(e.width, e.height).toLine());
  }
};
z(ye, Gs);
B({ Container: { line: Z(function(...n) {
  return ye.prototype.plot.apply(this.put(new ye()), n[0] != null ? n : [
    0,
    0,
    0,
    0
  ]);
}) } });
$(ye, "Line");
var dn = class extends kt {
  constructor(n, t = n) {
    super(W("marker", n), t);
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
B({
  Container: { marker(...n) {
    return this.defs().marker(...n);
  } },
  Defs: { marker: Z(function(n, t, e) {
    return this.put(new dn()).size(n, t).ref(n / 2, t / 2).viewbox(0, 0, n, t).attr("orient", "auto").update(e);
  }) },
  marker: { marker(n, t, e, s) {
    let i = ["marker"];
    return n !== "all" && i.push(n), i = i.join("-"), n = arguments[1] instanceof dn ? arguments[1] : this.defs().marker(t, e, s), this.attr(i, n);
  } }
});
$(dn, "Marker");
function fe(n, t) {
  return function(e) {
    return e == null ? this[n] : (this[n] = e, t && t.call(this), this);
  };
}
const rl = {
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
var Bs = class {
  done() {
    return !1;
  }
}, os = class extends Bs {
  constructor(n = Te.ease) {
    super(), this.ease = rl[n] || n;
  }
  step(n, t, e) {
    return typeof n != "number" ? e < 1 ? n : t : n + (t - n) * this.ease(e);
  }
}, un = class extends Bs {
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
function ci() {
  const n = (this._duration || 500) / 1e3, t = this._overshoot || 0, e = 1e-10, s = Math.PI, i = Math.log(t / 100 + e), o = -i / Math.sqrt(s * s + i * i), r = 3.9 / (o * n);
  this.d = 2 * o * r, this.k = r * r;
}
var al = class extends un {
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
z(al, {
  duration: fe("_duration", ci),
  overshoot: fe("_overshoot", ci)
});
var cl = class extends un {
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
z(cl, {
  windup: fe("_windup"),
  p: fe("P"),
  i: fe("I"),
  d: fe("D")
});
const ll = {
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
}, rs = {
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
}, Bn = "mlhvqtcsaz".split("");
for (let n = 0, t = Bn.length; n < t; ++n) rs[Bn[n]] = /* @__PURE__ */ function(e) {
  return function(s, i, o) {
    if (e === "H") s[0] = s[0] + i.x;
    else if (e === "V") s[0] = s[0] + i.y;
    else if (e === "A")
      s[5] = s[5] + i.x, s[6] = s[6] + i.y;
    else for (let r = 0, a = s.length; r < a; ++r) s[r] = s[r] + (r % 2 ? i.y : i.x);
    return rs[e](s, i, o);
  };
}(Bn[n].toUpperCase());
function hl(n) {
  return rs[n.segment[0]](n.segment.slice(1), n.p, n.p0);
}
function as(n) {
  return n.segment.length && n.segment.length - 1 === ll[n.segment[0].toUpperCase()];
}
function dl(n, t) {
  n.inNumber && Jt(n, !1);
  const e = Rs.test(t);
  if (e) n.segment = [t];
  else {
    const s = n.lastCommand, i = s.toLowerCase();
    n.segment = [i === "m" ? s === i ? "l" : "L" : s];
  }
  return n.inSegment = !0, n.lastCommand = n.segment[0], e;
}
function Jt(n, t) {
  if (!n.inNumber) throw new Error("Parser Error");
  n.number && n.segment.push(parseFloat(n.number)), n.inNumber = t, n.number = "", n.pointSeen = !1, n.hasExponent = !1, as(n) && cs(n);
}
function cs(n) {
  n.inSegment = !1, n.absolute && (n.segment = hl(n)), n.segments.push(n.segment);
}
function ul(n) {
  if (!n.segment.length) return !1;
  const t = n.segment[0].toUpperCase() === "A", e = n.segment.length;
  return t && (e === 4 || e === 5);
}
function fl(n) {
  return n.lastToken.toUpperCase() === "E";
}
const pl = /* @__PURE__ */ new Set([
  " ",
  ",",
  "	",
  `
`,
  "\r",
  "\f"
]);
function gl(n, t = !0) {
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
    p0: new Q(),
    p: new Q()
  };
  for (; i.lastToken = s, s = n.charAt(e++); )
    if (!(!i.inSegment && dl(i, s))) {
      if (s === ".") {
        if (i.pointSeen || i.hasExponent) {
          Jt(i, !1), --e;
          continue;
        }
        i.inNumber = !0, i.pointSeen = !0, i.number += s;
        continue;
      }
      if (!isNaN(parseInt(s))) {
        if (i.number === "0" || ul(i)) {
          i.inNumber = !0, i.number = s, Jt(i, !0);
          continue;
        }
        i.inNumber = !0, i.number += s;
        continue;
      }
      if (pl.has(s)) {
        i.inNumber && Jt(i, !1);
        continue;
      }
      if (s === "-" || s === "+") {
        if (i.inNumber && !fl(i)) {
          Jt(i, !1), --e;
          continue;
        }
        i.number += s, i.inNumber = !0;
        continue;
      }
      if (s.toUpperCase() === "E") {
        i.number += s, i.hasExponent = !0;
        continue;
      }
      if (Rs.test(s)) {
        if (i.inNumber) Jt(i, !1);
        else if (as(i)) cs(i);
        else throw new Error("parser Error");
        --e;
      }
    }
  return i.inNumber && Jt(i, !1), i.inSegment && as(i) && cs(i), i.segments;
}
function ml(n) {
  let t = "";
  for (let e = 0, s = n.length; e < s; e++)
    t += n[e][0], n[e][1] != null && (t += n[e][1], n[e][2] != null && (t += " ", t += n[e][2], n[e][3] != null && (t += " ", t += n[e][3], t += " ", t += n[e][4], n[e][5] != null && (t += " ", t += n[e][5], t += " ", t += n[e][6], n[e][7] != null && (t += " ", t += n[e][7])))));
  return t + " ";
}
var Xt = class extends ge {
  bbox() {
    return Lt().path.setAttribute("d", this.toString()), new st(Lt.nodes.path.getBBox());
  }
  move(n, t) {
    const e = this.bbox();
    if (n -= e.x, t -= e.y, !isNaN(n) && !isNaN(t)) for (let s, i = this.length - 1; i >= 0; i--)
      s = this[i][0], s === "M" || s === "L" || s === "T" ? (this[i][1] += n, this[i][2] += t) : s === "H" ? this[i][1] += n : s === "V" ? this[i][1] += t : s === "C" || s === "S" || s === "Q" ? (this[i][1] += n, this[i][2] += t, this[i][3] += n, this[i][4] += t, s === "C" && (this[i][5] += n, this[i][6] += t)) : s === "A" && (this[i][6] += n, this[i][7] += t);
    return this;
  }
  parse(n = "M0 0") {
    return Array.isArray(n) && (n = Array.prototype.concat.apply([], n).toString()), gl(n);
  }
  size(n, t) {
    const e = this.bbox();
    let s, i;
    for (e.width = e.width === 0 ? 1 : e.width, e.height = e.height === 0 ? 1 : e.height, s = this.length - 1; s >= 0; s--)
      i = this[s][0], i === "M" || i === "L" || i === "T" ? (this[s][1] = (this[s][1] - e.x) * n / e.width + e.x, this[s][2] = (this[s][2] - e.y) * t / e.height + e.y) : i === "H" ? this[s][1] = (this[s][1] - e.x) * n / e.width + e.x : i === "V" ? this[s][1] = (this[s][1] - e.y) * t / e.height + e.y : i === "C" || i === "S" || i === "Q" ? (this[s][1] = (this[s][1] - e.x) * n / e.width + e.x, this[s][2] = (this[s][2] - e.y) * t / e.height + e.y, this[s][3] = (this[s][3] - e.x) * n / e.width + e.x, this[s][4] = (this[s][4] - e.y) * t / e.height + e.y, i === "C" && (this[s][5] = (this[s][5] - e.x) * n / e.width + e.x, this[s][6] = (this[s][6] - e.y) * t / e.height + e.y)) : i === "A" && (this[s][1] = this[s][1] * n / e.width, this[s][2] = this[s][2] * t / e.height, this[s][6] = (this[s][6] - e.x) * n / e.width + e.x, this[s][7] = (this[s][7] - e.y) * t / e.height + e.y);
    return this;
  }
  toString() {
    return ml(this);
  }
};
const _o = (n) => {
  const t = typeof n;
  return t === "number" ? U : t === "string" ? It.isColor(n) ? It : Bt.test(n) ? Rs.test(n) ? Xt : ge : io.test(n) ? U : ls : Hs.indexOf(n.constructor) > -1 ? n.constructor : Array.isArray(n) ? ge : t === "object" ? Be : ls;
};
var Ft = class {
  constructor(n) {
    this._stepper = n || new os("-"), this._from = null, this._to = null, this._type = null, this._context = null, this._morphObj = null;
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
    this._type || this.type(_o(n));
    let t = new this._type(n);
    return this._type === It && (t = this._to ? t[this._to[4]]() : this._from ? t[this._from[4]]() : t), this._type === Be && (t = this._to ? t.align(this._to) : this._from ? t.align(this._from) : t), t = t.toConsumable(), this._morphObj = this._morphObj || new this._type(), this._context = this._context || Array.apply(null, Array(t.length)).map(Object).map(function(e) {
      return e.done = !0, e;
    }), t;
  }
}, ls = class {
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
}, Re = class Co {
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
    }), Object.assign(this, Co.defaults, t), this;
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
Re.defaults = {
  scaleX: 1,
  scaleY: 1,
  shear: 0,
  rotate: 0,
  translateX: 0,
  translateY: 0,
  originX: 0,
  originY: 0
};
const yl = (n, t) => n[0] < t[0] ? -1 : n[0] > t[0] ? 1 : 0;
var Be = class {
  constructor(...n) {
    this.init(...n);
  }
  align(n) {
    const t = this.values;
    for (let e = 0, s = t.length; e < s; ++e) {
      if (t[e + 1] === n[e + 1]) {
        if (t[e + 1] === It && n[e + 7] !== t[e + 7]) {
          const r = n[e + 7], a = new It(this.values.splice(e + 3, 5))[r]().toArray();
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
      const s = _o(n[e]), i = new s(n[e]).toArray();
      t.push([
        e,
        s,
        i.length,
        ...i
      ]);
    }
    return t.sort(yl), this.values = t.reduce((e, s) => e.concat(s), []), this;
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
const Hs = [
  ls,
  Re,
  Be
];
function bl(n = []) {
  Hs.push(...[].concat(n));
}
function vl() {
  z(Hs, {
    to(n) {
      return new Ft().type(this.constructor).from(this.toArray()).to(n);
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
var we = class extends xt {
  constructor(n, t = n) {
    super(W("path", n), t);
  }
  array() {
    return this._array || (this._array = new Xt(this.attr("d")));
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
    return n == null ? this.array() : this.clear().attr("d", typeof n == "string" ? n : this._array = new Xt(n));
  }
  size(n, t) {
    const e = oe(this, n, t);
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
we.prototype.MorphArray = Xt;
B({ Container: { path: Z(function(n) {
  return this.put(new we()).plot(n || new Xt());
}) } });
$(we, "Path");
var Eo = /* @__PURE__ */ ve({
  array: () => wl,
  clear: () => xl,
  move: () => _l,
  plot: () => Cl,
  size: () => El
});
function wl() {
  return this._array || (this._array = new jt(this.attr("points")));
}
function xl() {
  return delete this._array, this;
}
function _l(n, t) {
  return this.attr("points", this.array().move(n, t));
}
function Cl(n) {
  return n == null ? this.array() : this.clear().attr("points", typeof n == "string" ? n : this._array = new jt(n));
}
function El(n, t) {
  const e = oe(this, n, t);
  return this.attr("points", this.array().size(e.width, e.height));
}
var xe = class extends xt {
  constructor(n, t = n) {
    super(W("polygon", n), t);
  }
};
B({ Container: { polygon: Z(function(n) {
  return this.put(new xe()).plot(n || new jt());
}) } });
z(xe, Gs);
z(xe, Eo);
$(xe, "Polygon");
var _e = class extends xt {
  constructor(n, t = n) {
    super(W("polyline", n), t);
  }
};
B({ Container: { polyline: Z(function(n) {
  return this.put(new _e()).plot(n || new jt());
}) } });
z(_e, Gs);
z(_e, Eo);
$(_e, "Polyline");
var Je = class extends xt {
  constructor(n, t = n) {
    super(W("rect", n), t);
  }
};
z(Je, {
  rx: Ls,
  ry: zs
});
B({ Container: { rect: Z(function(n, t) {
  return this.put(new Je()).size(n, t);
}) } });
$(Je, "Rect");
var Hn = class {
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
const Y = {
  nextDraw: null,
  frames: new Hn(),
  timeouts: new Hn(),
  immediates: new Hn(),
  timer: () => F.window.performance || F.window.Date,
  frame(n) {
    const t = Y.frames.push({ run: n });
    return Y.nextDraw === null && (Y.nextDraw = F.window.requestAnimationFrame(Y._draw)), t;
  },
  timeout(n, t) {
    t = t || 0;
    const e = Y.timer().now() + t, s = Y.timeouts.push({
      run: n,
      time: e
    });
    return Y.nextDraw === null && (Y.nextDraw = F.window.requestAnimationFrame(Y._draw)), s;
  },
  immediate(n) {
    const t = Y.immediates.push(n);
    return Y.nextDraw === null && (Y.nextDraw = F.window.requestAnimationFrame(Y._draw)), t;
  },
  cancelFrame(n) {
    n != null && Y.frames.remove(n);
  },
  clearTimeout(n) {
    n != null && Y.timeouts.remove(n);
  },
  cancelImmediate(n) {
    n != null && Y.immediates.remove(n);
  },
  _draw(n) {
    try {
      let t = null;
      const e = Y.timeouts.last();
      for (; (t = Y.timeouts.shift()) && (n >= t.time ? t.run() : Y.timeouts.push(t), t !== e); )
        ;
      let s = null;
      const i = Y.frames.last();
      for (; s !== i && (s = Y.frames.shift()); ) s.run(n);
      let o = null;
      for (; o = Y.immediates.shift(); ) o();
    } finally {
      const t = Y.timeouts.first() || Y.frames.first() || Y.immediates.first();
      Y.nextDraw = t ? F.window.requestAnimationFrame(Y._draw) : null;
    }
  }
}, Sl = function(n) {
  const t = n.start, e = n.runner.duration();
  return {
    start: t,
    duration: e,
    end: t + e,
    runner: n.runner
  };
}, kl = function() {
  const n = F.window;
  return (n.performance || n.Date).now();
};
var So = class extends We {
  constructor(n = kl) {
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
    if (n == null) return this._runners.map(Sl);
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
    return Y.cancelFrame(this._nextFrame), this._nextFrame = null, n ? this._stepImmediate() : this._paused ? this : (this._nextFrame = Y.frame(this._step), this);
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
      const d = this._time - a.start;
      if (d < 0) {
        r = !0;
        continue;
      } else if (d === 0) {
        c.reset(), r = !0;
        continue;
      } else d < l && (l = d);
      if (!c.active()) continue;
      const h = (this._finishing && c._isDeclarative ? c.finish() : c.step(l)).done;
      c._runnerInfo === a && (h ? a.persist !== !0 && c.duration() - c.time() + this._time + a.persist <= this._time && c.unschedule() : r = !0);
    }
    return t !== this._generation ? this : (r || (r = this._runners.some(({ start: a, runner: c }) => a >= this._time || c.active() && !c.done)), r && !(this._speed < 0 && this._time === 0) || this._runnerIds.length && this._speed < 0 && this._time > 0 ? this._continue() : (this.pause(), this.fire("finished")), this);
  }
  terminate() {
    Y.cancelFrame(this._nextFrame), this._generation = (this._generation || 0) + 1, this._startTime = 0, this._speed = 1, this._persist = 0;
    for (const { runner: n } of this._runners || [])
      n._retired = !0, n._runnerInfo = null;
    this._nextFrame = null, this._paused = !0, this._finishing = !1, this._runners = [], this._runnerIds = [], this._lastRunnerId = -1, this._time = 0, this._lastSourceTime = 0, this._lastStepTime = 0, this._step = this._stepFn.bind(this, !1), this._stepImmediate = this._stepFn.bind(this, !0);
  }
};
B({ Element: { timeline: function(n) {
  return n == null ? (this._timeline = this._timeline || new So(), this._timeline) : (this._timeline = n, this);
} } });
var Gt = class an extends We {
  constructor(t) {
    super(), this.id = an.id++, t = t ?? Te.duration, t = typeof t == "function" ? new un(t) : t, this._element = null, this._timeline = null, this._runnerInfo = null, this.done = !1, this._queue = [], this._duration = typeof t == "number" && t, this._isDeclarative = t instanceof un, this._stepper = this._isDeclarative ? t : new os(), this._history = {}, this.enabled = !0, this._time = 0, this._lastTime = 0, this._reseted = !0, this.transforms = new G(), this._isAbsoluteTransform = !1, this._hasTransform = !1, this._transformInitialised = !1, this._transformActive = !1, this._retired = !1, this._reverse = !1, this._swing = !1, this._wait = 0, this._times = 1, this._persist = this._isDeclarative ? !0 : null;
  }
  static sanitise(t, e, s) {
    let i = 1, o = !1, r = 0;
    return t = t ?? Te.duration, e = e ?? Te.delay, s = s || "last", typeof t == "object" && !(t instanceof Bs) && (e = t.delay ?? e, s = t.when ?? s, o = t.swing || o, i = t.times ?? i, r = t.wait ?? r, t = t.duration ?? Te.duration), {
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
    const i = an.sanitise(t, e, s), o = new an(i.duration);
    return this._timeline && o.timeline(this._timeline), this._element && o.element(this._element), o.loop(i).schedule(i.delay, i.when);
  }
  clearTransform() {
    return this.transforms = new G(), this;
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
    return this._stepper = new os(t), this;
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
      const h = function(f) {
        const p = r * Math.floor(f % (2 * (i + s)) / (i + s)), g = p && !a || !p && a, m = Math.pow(-1, g) * (f % (i + s)) / s + g;
        return Math.max(Math.min(m, 1), 0);
      }, u = o * (i + s) - i;
      return c = e <= 0 ? Math.round(h(1e-5)) : e < u ? h(e) : Math.round(h(u - 1e-5)), c;
    }
    const l = Math.floor(this.loops()), d = r && l % 2 === 0;
    return c = l + (d && !a || a && d ? t : 1 - t), this.loops(c);
  }
  progress(t) {
    return t == null ? Math.min(1, this._time / this.duration()) : this.time(t * this.duration());
  }
  queue(t, e, s, i) {
    return this._isDeclarative && (this.done = !1), this._queue.push({
      initialiser: t || ai,
      runner: e || ai,
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
    if (t instanceof So || (s = e, e = t, t = this.timeline()), !t) throw Error("Runner cannot be scheduled without timeline");
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
    return (i || a) && (this._initialise(i), this.transforms = new G(), l = this._run(a ? t : s), this._transformActive = c, this.fire("step", this)), this.done = this.done || l && a, this.done && !e && this.fire("finished", this), this;
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
Gt.id = 0;
var hs = class {
  constructor(n = new G(), t = -1, e = !0, s = !1) {
    this.transforms = n, this.id = t, this.done = e, this._isAbsoluteTransform = s, this._transformActive = !0, this._retired = !0;
  }
};
z([Gt, hs], { mergeWith(n) {
  return new hs(this._isAbsoluteTransform ? this.transforms : n.transforms.lmultiply(this.transforms), n.id, !0, n._isAbsoluteTransform || this._isAbsoluteTransform);
} });
const ko = (n, t) => n.lmultiplyO(t), Ao = (n) => n.transforms, Al = (n) => n._transformActive;
function Mo(n) {
  const t = n.filter(Al);
  let e = 0;
  for (let s = 0; s < t.length; ++s) t[s]._isAbsoluteTransform && (e = s);
  return t.slice(e);
}
function Ml() {
  const n = Mo(this._transformationRunners.runners).map(Ao).reduce(ko, new G());
  this.transform(n), this._transformationRunners.merge(), this._transformationRunners.length() === 1 && (this._frameId = null);
}
var Tl = class {
  constructor() {
    this.runners = [];
  }
  add(n) {
    var t;
    if (!(0, Qt.default)(t = this.runners).call(t, n))
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
B({ Element: {
  animate(n, t, e) {
    const s = Gt.sanitise(n, t, e), i = this.timeline();
    return new Gt(s.duration).loop(s).element(this).timeline(i.play()).schedule(s.delay, s.when);
  },
  delay(n, t) {
    return this.animate(0, n, t);
  },
  _currentTransform(n) {
    const t = this._transformationRunners.runners, e = t.indexOf(n);
    return Mo(t.slice(0, e + 1)).map(Ao).reduce(ko, new G());
  },
  _addRunner(n) {
    this._transformationRunners.length() === 1 && this._transformationRunners.runners[0].id === -1 && (this._transformationRunners.runners[0].transforms = new G(this)), this._transformationRunners.add(n), Y.cancelImmediate(this._frameId), this._frameId = Y.immediate(Ml.bind(this));
  },
  _prepareRunner() {
    this._frameId == null && (this._transformationRunners = new Tl().add(new hs(new G(this))));
  }
} });
const Nl = (n, t) => n.filter((e) => !(0, Qt.default)(t).call(t, e));
z(Gt, {
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
    let o = new Ft(this._stepper).to(s), r = Object.keys(s);
    return this.queue(function() {
      o = o.from(this.element()[n](r));
    }, function(a) {
      return this.element()[n](o.at(a).valueOf()), o.done();
    }, function(a) {
      const c = Nl(Object.keys(a), r);
      if (c.length && o.from() != null) {
        const d = this.element()[n](c), h = new Be(o.from()).valueOf();
        Object.assign(h, d), o.from(h);
      }
      const l = new Be(o.to()).valueOf();
      Object.assign(l, a), o.to(l), r = Object.keys(l);
    }), this._rememberMorpher(n, o), this;
  },
  zoom(n, t) {
    if (this._tryRetarget("zoom", n, t)) return this;
    let e = new Ft(this._stepper).to(new U(n));
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
    const s = G.isMatrixLike(n);
    e = n.affine != null ? n.affine : e ?? !s;
    const i = new Ft(this._stepper).type(e ? Re : G), o = e ? new Ft(this._stepper).type(G) : i;
    let r, a, c, l, d;
    function h() {
      a = a || this.element(), r = r || Qn(n, a), d = new G(t ? void 0 : a), a._addRunner(this);
    }
    function u(p) {
      t || this.clearTransform();
      const { x: g, y: m } = new Q(r).transform(a._currentTransform(this)), b = {
        ...n,
        origin: [g, m]
      };
      b.relative === !0 && delete b.relative;
      let y = new G(b), x = this._isDeclarative && c ? c : d, E = i;
      if (e) {
        const w = y.decompose(g, m), _ = x.decompose(g, m);
        if (!new Re(w).toArray().concat(new Re(_).toArray()).every(Number.isFinite)) E = o;
        else {
          y = w, x = _;
          const C = y.rotate, S = x.rotate, k = [
            C - 360,
            C,
            C + 360
          ], M = k.map((R) => Math.abs(R - S)), O = Math.min(...M), P = M.indexOf(O);
          y.rotate = k[P];
        }
      }
      t && E === i && (s || (y.rotate = n.rotate || 0), this._isDeclarative && l && (x.rotate = l)), E.from(x), E.to(y);
      const v = E.at(p);
      return l = v.rotate, c = new G(v), this.addTransform(c), a._addRunner(this), E.done();
    }
    function f(p) {
      r = Qn(p, a), n = { ...p };
    }
    return this.queue(h, u, f, !0), this._isDeclarative && this._rememberMorpher("transform", i), this;
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
    const e = new Ft(this._stepper).to(t);
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
    const e = new Ft(this._stepper).to(t);
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
    const e = oe(this._element, n, t);
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
    const i = new Ft(this._stepper).type(this._element.MorphArray).to(n);
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
    return this._queueObject("viewbox", new st(n, t, e, s));
  },
  update(n) {
    return typeof n != "object" ? this.update({
      offset: arguments[0],
      color: arguments[1],
      opacity: arguments[2]
    }) : (n.opacity != null && this.attr("stop-opacity", n.opacity), n.color != null && this.attr("stop-color", n.color), n.offset != null && this.attr("offset", n.offset), this);
  }
});
z(Gt, {
  rx: Ls,
  ry: zs,
  from: wo,
  to: xo
});
$(Gt, "Runner");
var Sn = class extends kt {
  constructor(n, t = n) {
    super(W("svg", n), t), this.namespace();
  }
  defs() {
    return this.isRoot() ? ft(this.node.querySelector("defs")) || this.put(new Ds()) : this.root().defs();
  }
  isRoot() {
    return !this.node.parentNode || !(this.node.parentNode instanceof F.window.SVGElement) && this.node.parentNode.nodeName !== "#document-fragment";
  }
  namespace() {
    return this.isRoot() ? this.attr({
      xmlns: Ms,
      version: "1.1"
    }).attr("xmlns:xlink", qe, Ln) : this.root().namespace();
  }
  removeNamespace() {
    return this.attr({
      xmlns: null,
      version: null
    }).attr("xmlns:xlink", null, Ln).attr("xmlns:svgjs", null, Ln);
  }
  root() {
    return this.isRoot() ? this : super.root();
  }
};
B({ Container: { nested: Z(function() {
  return this.put(new Sn());
}) } });
$(Sn, "Svg", !0);
var Fs = class extends kt {
  constructor(n, t = n) {
    super(W("symbol", n), t);
  }
};
B({ Container: { symbol: Z(function() {
  return this.put(new Fs());
}) } });
$(Fs, "Symbol");
var To = /* @__PURE__ */ ve({
  amove: () => Fl,
  ax: () => Bl,
  ay: () => Hl,
  build: () => $l,
  center: () => Gl,
  cx: () => Ll,
  cy: () => zl,
  length: () => Rl,
  move: () => Dl,
  plain: () => Ol,
  x: () => Pl,
  y: () => Il
});
function Ol(n) {
  return this._build === !1 && this.clear(), this.node.appendChild(F.document.createTextNode(n)), this;
}
function Rl() {
  return this.node.getComputedTextLength();
}
function Pl(n, t = this.bbox()) {
  return n == null ? t.x : this.attr("x", this.attr("x") + n - t.x);
}
function Il(n, t = this.bbox()) {
  return n == null ? t.y : this.attr("y", this.attr("y") + n - t.y);
}
function Dl(n, t, e = this.bbox()) {
  return this.x(n, e).y(t, e);
}
function Ll(n, t = this.bbox()) {
  return n == null ? t.cx : this.attr("x", this.attr("x") + n - t.cx);
}
function zl(n, t = this.bbox()) {
  return n == null ? t.cy : this.attr("y", this.attr("y") + n - t.cy);
}
function Gl(n, t, e = this.bbox()) {
  return this.cx(n, e).cy(t, e);
}
function Bl(n) {
  return this.attr("x", n);
}
function Hl(n) {
  return this.attr("y", n);
}
function Fl(n, t) {
  return this.ax(n).ay(t);
}
function $l(n) {
  return this._build = !!n, this;
}
var Tt = class extends xt {
  constructor(n, t = n) {
    super(W("text", n), t), this.dom.leading = this.dom.leading ?? new U(1.3), this._rebuild = !0, this._build = !1;
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
        if (ts(this.node)) return;
        const o = F.window.getComputedStyle(this.node).getPropertyValue("font-size"), r = s * new U(o);
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
        if (t[s].nodeName === "textPath" || ts(t[s])) {
          s === 0 && (e = s + 1);
          continue;
        }
        s !== e && t[s].nodeType !== 3 && ft(t[s]).dom.newLined === !0 && (n += `
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
z(Tt, To);
B({ Container: {
  text: Z(function(n = "") {
    return this.put(new Tt()).text(n);
  }),
  plain: Z(function(n = "") {
    return this.put(new Tt()).plain(n);
  })
} });
$(Tt, "Text");
var kn = class extends xt {
  constructor(n, t = n) {
    super(W("tspan", n), t), this._build = !1;
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
    if (!(n instanceof Tt)) return this;
    const t = n.index(this), e = F.window.getComputedStyle(this.node).getPropertyValue("font-size"), s = n.dom.leading * new U(e);
    return this.dy(t ? s : 0).attr("x", n.x());
  }
  text(n) {
    return n == null ? this.node.textContent + (this.dom.newLined ? `
` : "") : (typeof n == "function" ? (this.clear().build(!0), n.call(this, this), this.build(!1)) : this.plain(n), this);
  }
};
z(kn, To);
B({
  Tspan: { tspan: Z(function(n = "") {
    const t = new kn();
    return this._build || this.clear(), this.put(t).text(n);
  }) },
  Text: { newLine: function(n = "") {
    return this.tspan(n).newLine();
  } }
});
$(kn, "Tspan");
var An = class extends xt {
  constructor(n, t = n) {
    super(W("circle", n), t);
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
z(An, {
  x: fo,
  y: po,
  cx: go,
  cy: mo,
  width: yo,
  height: bo
});
B({ Container: { circle: Z(function(n = 0) {
  return this.put(new An()).size(n).move(0, 0);
}) } });
$(An, "Circle");
var ds = class extends kt {
  constructor(n, t = n) {
    super(W("clipPath", n), t);
  }
  remove() {
    return this.targets().forEach(function(n) {
      n.unclip();
    }), super.remove();
  }
  targets() {
    return Ze(this.node, "clip-path");
  }
};
B({
  Container: { clip: Z(function() {
    return this.defs().put(new ds());
  }) },
  Element: {
    clipper() {
      return this.reference("clip-path");
    },
    clipWith(n) {
      const t = n instanceof ds ? n : this.parent().clip().add(n);
      return this.attr("clip-path", "url(#" + t.id() + ")");
    },
    unclip() {
      return this.attr("clip-path", null);
    }
  }
});
$(ds, "ClipPath");
var No = class extends mt {
  constructor(n, t = n) {
    super(W("foreignObject", n), t);
  }
};
B({ Container: { foreignObject: Z(function(n, t) {
  return this.put(new No()).size(n, t);
}) } });
$(No, "ForeignObject");
var Oo = /* @__PURE__ */ ve({
  dmove: () => Ul,
  dx: () => Yl,
  dy: () => jl,
  height: () => Xl,
  move: () => ql,
  size: () => Zl,
  width: () => Wl,
  x: () => Vl,
  y: () => Kl
});
function Ul(n, t) {
  return this.children().forEach((e) => {
    let s;
    try {
      s = e.node instanceof Ts().SVGSVGElement ? new st(e.attr([
        "x",
        "y",
        "width",
        "height"
      ])) : e.bbox();
    } catch {
      return;
    }
    const i = new G(e), o = i.translate(n, t).transform(i.inverse()), r = new Q(s.x, s.y).transform(o);
    e.dmove(r.x - s.x, r.y - s.y);
  }), this;
}
function Yl(n) {
  return this.dmove(n, 0);
}
function jl(n) {
  return this.dmove(0, n);
}
function Xl(n, t = this.bbox()) {
  return n == null ? t.height : this.size(t.width, n, t);
}
function ql(n = 0, t = 0, e = this.bbox()) {
  const s = n - e.x, i = t - e.y;
  return this.dmove(s, i);
}
function Zl(n, t, e = this.bbox()) {
  const s = oe(this, n, t, e), i = s.width / e.width, o = s.height / e.height;
  return this.children().forEach((r) => {
    const a = new Q(e).transform(new G(r).inverse());
    r.scale(i, o, a.x, a.y);
  }), this;
}
function Wl(n, t = this.bbox()) {
  return n == null ? t.width : this.size(n, t.height, t);
}
function Vl(n, t = this.bbox()) {
  return n == null ? t.x : this.move(n, t.y, t);
}
function Kl(n, t = this.bbox()) {
  return n == null ? t.y : this.move(t.x, n, t);
}
var Ce = class extends kt {
  constructor(n, t = n) {
    super(W("g", n), t);
  }
};
z(Ce, Oo);
B({ Container: { group: Z(function() {
  return this.put(new Ce());
}) } });
$(Ce, "G");
var fn = class extends kt {
  constructor(n, t = n) {
    super(W("a", n), t);
  }
  target(n) {
    return this.attr("target", n);
  }
  to(n) {
    return this.attr("href", n, qe);
  }
};
z(fn, Oo);
B({
  Container: { link: Z(function(n) {
    return this.put(new fn()).to(n);
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
      return t || (t = new fn(), this.wrap(t)), typeof n == "function" ? n.call(t, t) : t.to(n), this;
    },
    linker() {
      const n = this.parent();
      return n && n.node.nodeName.toLowerCase() === "a" ? n : null;
    }
  }
});
$(fn, "A");
var us = class extends kt {
  constructor(n, t = n) {
    super(W("mask", n), t);
  }
  remove() {
    return this.targets().forEach(function(n) {
      n.unmask();
    }), super.remove();
  }
  targets() {
    return Ze(this.node, "mask");
  }
};
B({
  Container: { mask: Z(function() {
    return this.defs().put(new us());
  }) },
  Element: {
    masker() {
      return this.reference("mask");
    },
    maskWith(n) {
      const t = n instanceof us ? n : this.parent().mask().add(n);
      return this.attr("mask", "url(#" + t.id() + ")");
    },
    unmask() {
      return this.attr("mask", null);
    }
  }
});
$(us, "Mask");
var Ro = class extends mt {
  constructor(n, t = n) {
    super(W("stop", n), t);
  }
  update(n) {
    return (typeof n == "number" || n instanceof U) && (n = {
      offset: arguments[0],
      color: arguments[1],
      opacity: arguments[2]
    }), n.opacity != null && this.attr("stop-opacity", n.opacity), n.color != null && this.attr("stop-color", n.color), n.offset != null && this.attr("offset", new U(n.offset)), this;
  }
};
B({ Gradient: { stop: function(n, t, e) {
  return this.put(new Ro()).update(n, t, e);
} } });
$(Ro, "Stop");
function Jl(n, t) {
  if (!n) return "";
  if (!t) return n;
  let e = n + "{";
  for (const s in t) e += to(s) + ":" + t[s] + ";";
  return e += "}", e;
}
var fs = class extends mt {
  constructor(n, t = n) {
    super(W("style", n), t);
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
    return this.addText(Jl(n, t));
  }
};
B("Dom", {
  style(n, t) {
    return this.put(new fs()).rule(n, t);
  },
  fontface(n, t, e) {
    return this.put(new fs()).font(n, t, e);
  }
});
$(fs, "Style");
var $s = class extends Tt {
  constructor(n, t = n) {
    super(W("textPath", n), t);
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
B({
  Container: { textPath: Z(function(n, t) {
    return n instanceof Tt || (n = this.text(n)), n.path(t);
  }) },
  Text: {
    path: Z(function(n, t = !0) {
      const e = new $s();
      n instanceof we || (n = this.defs().path(n)), e.attr("href", "#" + n, qe);
      let s;
      if (t) for (; s = this.node.firstChild; ) e.node.appendChild(s);
      return this.put(e);
    }),
    textPath() {
      return this.findOne("textPath");
    }
  },
  Path: {
    text: Z(function(n) {
      return n instanceof Tt || (n = new Tt().addTo(this.parent()).text(n)), n.path(this);
    }),
    targets() {
      return Ze(this.node, "href", "textPath");
    }
  }
});
$s.prototype.MorphArray = Xt;
$($s, "TextPath");
var Po = class extends xt {
  constructor(n, t = n) {
    super(W("use", n), t);
  }
  use(n, t) {
    return this.attr("href", (t || "") + "#" + n, qe);
  }
};
B({ Container: { use: Z(function(n, t) {
  return this.put(new Po()).use(n, t);
}) } });
$(Po, "Use");
const Mn = dt;
z([
  Sn,
  Fs,
  En,
  Ge,
  dn
], gt("viewbox"));
z([
  ye,
  _e,
  xe,
  we
], gt("marker"));
z(Tt, gt("Text"));
z(we, gt("Path"));
z(Ds, gt("Defs"));
z([Tt, kn], gt("Tspan"));
z([
  Je,
  Ve,
  Ke,
  Gt
], gt("radius"));
z(We, gt("EventTarget"));
z(me, gt("Dom"));
z(mt, gt("Element"));
z(xt, gt("Shape"));
z([kt, vo], gt("Container"));
z(Ke, gt("Gradient"));
z(Gt, gt("Runner"));
zt.extend(ea());
bl([
  U,
  It,
  st,
  G,
  ge,
  jt,
  Xt,
  Q
]);
vl();
var li = (n) => (n.changedTouches && (n = n.changedTouches[0]), {
  x: n.clientX,
  y: n.clientY
}), Ql = class {
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
    n.preventDefault(), n.stopPropagation(), this.init(!1), this.box = this.el.bbox(), this.lastClick = this.el.point(li(n));
    const e = (t ? "mousemove" : "touchmove") + ".drag", s = (t ? "mouseup" : "touchend") + ".drag";
    wt(window, e, this.drag, this, { passive: !1 }), wt(window, s, this.endDrag, this, { passive: !1 }), this.el.fire("dragstart", {
      event: n,
      handler: this,
      box: this.box
    });
  }
  drag(n) {
    const { box: t, lastClick: e } = this, s = this.el.point(li(n)), i = s.x - e.x, o = s.y - e.y;
    if (!i && !o) return t;
    const r = t.x + i, a = t.y + o;
    this.box = new st(r, a, t.w, t.h), this.lastClick = s, !this.el.dispatch("dragmove", {
      event: n,
      handler: this,
      box: this.box,
      dx: i,
      dy: o
    }).defaultPrevented && this.move(r, a);
  }
  move(n, t) {
    this.el.type === "svg" ? Ce.prototype.move.call(this.el, n, t) : this.el.move(n, t);
  }
  endDrag(n) {
    this.drag(n), this.el.fire("dragend", {
      event: n,
      handler: this,
      box: this.box
    }), tt(window, "mousemove.drag"), tt(window, "touchmove.drag"), tt(window, "mouseup.drag"), tt(window, "touchend.drag"), this.init(!0);
  }
};
z(mt, { draggable(n = !0) {
  return (this.remember("_draggable") || new Ql(this)).init(n), this;
} });
var Se = (n) => n.touches || [{
  clientX: n.clientX,
  clientY: n.clientY
}];
z(Sn, { panZoom(n) {
  if (this.off(".panZoom"), n === !1) return this;
  n = n ?? {};
  const t = n.zoomFactor ?? 2, e = n.zoomMin ?? Number.MIN_VALUE, s = n.zoomMax ?? Number.MAX_VALUE, i = n.wheelZoom ?? !0, o = n.pinchZoom ?? !0, r = n.panning ?? !0, a = n.panButton ?? 0, c = n.oneFingerPan ?? !1, l = n.margins ?? !1, d = n.wheelZoomDeltaModeLinePixels ?? 17, h = n.wheelZoomDeltaModeScreenPixels ?? 53;
  let u, f, p = !1;
  const g = this.viewbox(), m = (C) => {
    if (!l) return C;
    const { top: S, left: k, bottom: M, right: O } = l, { width: P, height: R } = this.attr(["width", "height"]), A = this.node.preserveAspectRatio.baseVal;
    let T = 0, I = 0, L = 0, H = 0;
    if (A.align !== A.SVG_PRESERVEASPECTRATIO_NONE) {
      const j = P / R, yt = g.width / g.height;
      if (yt !== j) {
        const K = A.meetOrSlice !== A.SVG_MEETORSLICE_SLICE, ct = j > yt ? "width" : "height", Nt = ct === "width", bt = K && Nt || !K && !Nt, vt = bt ? j / yt : yt / j, ut = C[ct] - C[ct] * vt;
        bt ? A.align === A.SVG_PRESERVEASPECTRATIO_XMIDYMIN || A.align === A.SVG_PRESERVEASPECTRATIO_XMIDYMID || A.align === A.SVG_PRESERVEASPECTRATIO_XMIDYMAX ? (T = ut / 2, I = -ut / 2) : A.align === A.SVG_PRESERVEASPECTRATIO_XMINYMIN || A.align === A.SVG_PRESERVEASPECTRATIO_XMINYMID || A.align === A.SVG_PRESERVEASPECTRATIO_XMINYMAX ? I = -ut : (A.align === A.SVG_PRESERVEASPECTRATIO_XMAXYMIN || A.align === A.SVG_PRESERVEASPECTRATIO_XMAXYMID || A.align === A.SVG_PRESERVEASPECTRATIO_XMAXYMAX) && (T = ut) : A.align === A.SVG_PRESERVEASPECTRATIO_XMINYMID || A.align === A.SVG_PRESERVEASPECTRATIO_XMIDYMID || A.align === A.SVG_PRESERVEASPECTRATIO_XMAXYMID ? (L = ut / 2, H = -ut / 2) : A.align === A.SVG_PRESERVEASPECTRATIO_XMINYMIN || A.align === A.SVG_PRESERVEASPECTRATIO_XMIDYMIN || A.align === A.SVG_PRESERVEASPECTRATIO_XMAXYMIN ? H = -ut : (A.align === A.SVG_PRESERVEASPECTRATIO_XMINYMAX || A.align === A.SVG_PRESERVEASPECTRATIO_XMIDYMAX || A.align === A.SVG_PRESERVEASPECTRATIO_XMAXYMAX) && (L = ut);
      }
    }
    const q = g.width + g.x - k - T, at = g.x + O - C.width - I, J = g.height + g.y - S - L, V = g.y + M - C.height - H;
    return C.x = Math.min(q, Math.max(at, C.x)), C.y = Math.min(J, Math.max(V, C.y)), C;
  }, b = function(C) {
    C.preventDefault();
    let S;
    switch (C.deltaMode) {
      case 1:
        S = C.deltaY * d;
        break;
      case 2:
        S = C.deltaY * h;
        break;
      default:
        S = C.deltaY;
    }
    let k = Math.pow(1 + t, -1 * S / 100) * this.zoom();
    const M = this.point(C.clientX, C.clientY);
    if (k > s && (k = s), k < e && (k = e), this.dispatch("zoom", {
      level: k,
      focus: M
    }).defaultPrevented) return this;
    if (this.zoom(k, M), l) {
      const O = m(this.viewbox());
      this.viewbox(O);
    }
    this.dispatch("afterZoom", {
      box: this.viewbox(),
      focus: M
    });
  }, y = function(C) {
    if (f = Se(C), f.length < 2) {
      r && c && v.call(this, C);
      return;
    }
    r && c && w.call(this, C), C.preventDefault(), !this.dispatch("pinchZoomStart", { event: C }).defaultPrevented && (this.off("touchstart.panZoom", y), p = !0, wt(document, "touchmove.panZoom", E, this, { passive: !1 }), wt(document, "touchend.panZoom", x, this, { passive: !1 }));
  }, x = function(C) {
    C.preventDefault();
    const S = Se(C);
    S.length > 1 || (p = !1, this.dispatch("pinchZoomEnd", { event: C }), tt(document, "touchmove.panZoom", E), tt(document, "touchend.panZoom", x), this.on("touchstart.panZoom", y), S.length && r && c && v.call(this, C));
  }, E = function(C) {
    C.preventDefault();
    const S = Se(C), k = this.zoom();
    let M = Math.sqrt(Math.pow(f[0].clientX - f[1].clientX, 2) + Math.pow(f[0].clientY - f[1].clientY, 2)) / Math.sqrt(Math.pow(S[0].clientX - S[1].clientX, 2) + Math.pow(S[0].clientY - S[1].clientY, 2));
    (k < e && M > 1 || k > s && M < 1) && (M = 1);
    const O = {
      x: S[0].clientX + 0.5 * (S[1].clientX - S[0].clientX),
      y: S[0].clientY + 0.5 * (S[1].clientY - S[0].clientY)
    }, P = {
      x: f[0].clientX + 0.5 * (f[1].clientX - f[0].clientX),
      y: f[0].clientY + 0.5 * (f[1].clientY - f[0].clientY)
    }, R = this.point(O.x, O.y), A = this.point(2 * O.x - P.x, 2 * O.y - P.y), T = new st(this.viewbox()).transform(new G().translate(-A.x, -A.y).scale(M, 0, 0).translate(R.x, R.y));
    m(T), this.viewbox(T), f = S, this.dispatch("zoom", {
      box: T,
      focus: A
    }), this.dispatch("afterZoom", {
      box: this.viewbox(),
      focus: A
    });
  }, v = function(C) {
    C.type.indexOf("mouse") > -1 && C.button !== a && C.which !== a + 1 || (f = Se(C), !p && (this.dispatch("panStart", { event: C }).defaultPrevented || (C.preventDefault(), this.off("mousedown.panZoom", v), u = {
      x: f[0].clientX,
      y: f[0].clientY
    }, wt(document, "touchmove.panZoom mousemove.panZoom", _, this, { passive: !1 }), wt(document, "touchend.panZoom mouseup.panZoom", w, this, { passive: !1 }))));
  }, w = function(C) {
    C.preventDefault(), tt(document, "touchmove.panZoom mousemove.panZoom", _), tt(document, "touchend.panZoom mouseup.panZoom", w), this.on("mousedown.panZoom", v), this.dispatch("panEnd", { event: C });
  }, _ = function(C) {
    C.preventDefault();
    const S = Se(C), k = {
      x: S[0].clientX,
      y: S[0].clientY
    }, M = this.point(k.x, k.y), O = this.point(u.x, u.y), P = [O.x - M.x, O.y - M.y];
    if (!P[0] && !P[1]) return;
    const R = new st(this.viewbox()).transform(new G().translate(P[0], P[1]));
    u = k, m(R), !this.dispatch("panning", {
      box: R,
      event: C
    }).defaultPrevented && this.viewbox(R);
  };
  return i && this.on("wheel.panZoom", b, this, { passive: !1 }), o && this.on("touchstart.panZoom", y, this, { passive: !1 }), r && this.on("mousedown.panZoom", v, this, { passive: !1 }), this;
} });
function pe(n, t, e, s = null) {
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
function ps([n, t], { a: e, b: s, c: i, d: o, e: r, f: a }) {
  return [n * e + t * i + r, n * s + t * o + a];
}
var Io = class {
  constructor(n) {
    this.el = n, n.remember("_selectHandler", this), this.selection = new Ce(), this.order = [
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
    const t = Ts();
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
      this.handles.includes(s) && (this.createHandle.call(this, this.selection, n, t, e, s), this.selection.last().addClass("svg_select_handle svg_select_handle_" + s).on("mousedown.selection", pe(s, this.el, this.handlePoints, t)).on("touchstart.selection", pe(s, this.el, this.handlePoints, t), void 0, { passive: !1 }));
    });
  }
  createHandleFn(n) {
    n.polyline();
  }
  updateHandleFn(n, t, e, s) {
    const i = s.at(e - 1), o = s[(e + 1) % s.length], r = t, a = [r[0] - i[0], r[1] - i[1]], c = [r[0] - o[0], r[1] - o[1]], l = Math.sqrt(a[0] * a[0] + a[1] * a[1]), d = Math.sqrt(c[0] * c[0] + c[1] * c[1]), h = [a[0] / l, a[1] / l], u = [c[0] / d, c[1] / d], f = [r[0] - h[0] * 10, r[1] - h[1] * 10], p = [r[0] - u[0] * 10, r[1] - u[1] * 10];
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
    const n = this.selection.group().addClass("svg_select_handle_rot").on("mousedown.selection", pe("rot", this.el, this.handlePoints)).on("touchstart.selection", pe("rot", this.el, this.handlePoints), void 0, { passive: !1 });
    this.createRot.call(this, n);
  }
  updateRotationHandle() {
    if (!this.handles.includes("rot")) return;
    const n = this.selection.findOne("g.svg_select_handle_rot");
    n && this.updateRot(n, this.rotationPoint, this.handlePoints);
  }
  updatePoints() {
    const n = this.el.bbox(), t = this.el.root().screenCTM().inverseO().multiplyO(this.el.screenCTM());
    this.handlePoints = this.getHandlePoints(n).map((e) => ps(e, t)), this.rotationPoint = ps(this.getRotationPoint(n), t);
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
}, th = class {
  constructor(n) {
    this.el = n, n.remember("_pointSelectHandler", this), this.selection = new Ce(), this.order = [
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
    const t = Ts();
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
      this.createHandle.call(this, this.selection, n, t, e), this.selection.get(t + 1).addClass("svg_select_handle_point").on("mousedown.selection", pe("point", this.el, this.points, t)).on("touchstart.selection", pe("point", this.el, this.points, t), void 0, { passive: !1 });
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
    this.points = this.el.array().map((t) => ps(t, n));
  }
  mutationHandler() {
    this.updatePoints(), this.updateSelection(), this.updatePointHandles();
  }
}, Do = (n) => function(t = !0, e = {}) {
  typeof t == "object" && (e = t, t = !0);
  let s = this.remember("_" + n.name);
  return s || (t.prototype instanceof Io ? (s = new t(this), t = !0) : s = new n(this), this.remember("_" + n.name, s)), s.active(t, e), this;
};
z(mt, { select: Do(Io) });
z([
  xe,
  _e,
  ye
], { pointSelect: Do(th) });
var tn = (n) => (n.changedTouches && (n = n.changedTouches[0]), {
  x: n.clientX,
  y: n.clientY
}), Lo = (n) => {
  let t = 1 / 0, e = 1 / 0, s = -1 / 0, i = -1 / 0;
  for (let o = 0; o < n.length; o++) {
    const r = n[o];
    t = Math.min(t, r[0]), e = Math.min(e, r[1]), s = Math.max(s, r[0]), i = Math.max(i, r[1]);
  }
  return new st(t, e, s - t, i - e);
};
function eh(n, t, e) {
  const s = [
    [n.x, n.y],
    [n.x + n.width, n.y],
    [n.x + n.width, n.y + n.height],
    [n.x, n.y + n.height]
  ].map(([i, o]) => {
    const r = i - t[0], a = o - t[1], c = r * e, l = a * e;
    return [c + t[0], l + t[1]];
  });
  return Lo(s);
}
var hi = class {
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
    this.box = this.el.bbox(), this.startPoint = this.el.point(tn(t)), this.index = e, this.points = s.slice();
    const o = (i ? "mousemove" : "touchmove") + ".resize", r = (i ? "mouseup" : "touchcancel.resize touchend") + ".resize";
    n.type === "point" ? wt(window, o, this.movePoint) : n.type === "rot" ? wt(window, o, this.rotate) : wt(window, o, this.resize), wt(window, r, this.endResize);
  }
  resize(n) {
    this.lastEvent = n;
    const t = this.snapToGrid(this.el.point(tn(n)));
    let e = t.x - this.startPoint.x, s = t.y - this.startPoint.y;
    this.preserveAspectRatio && this.aroundCenter && (e *= 2, s *= 2);
    const i = this.box.x + e, o = this.box.y + s, r = this.box.x2 + e, a = this.box.y2 + s;
    let c = new st(this.box);
    if (this.eventType.includes("l") && (c.x = Math.min(i, this.box.x2), c.x2 = Math.max(i, this.box.x2)), this.eventType.includes("r") && (c.x = Math.min(r, this.box.x), c.x2 = Math.max(r, this.box.x)), this.eventType.includes("t") && (c.y = Math.min(o, this.box.y2), c.y2 = Math.max(o, this.box.y2)), this.eventType.includes("b") && (c.y = Math.min(a, this.box.y), c.y2 = Math.max(a, this.box.y)), c.width = c.x2 - c.x, c.height = c.y2 - c.y, this.preserveAspectRatio) {
      const l = this.box.width ? c.width / this.box.width : 1, d = this.box.height ? c.height / this.box.height : 1, h = [
        "lt",
        "t",
        "rt",
        "r",
        "rb",
        "b",
        "lb",
        "l"
      ], u = (h.indexOf(this.eventType) + 4) % h.length, f = this.aroundCenter ? [this.box.cx, this.box.cy] : this.points[u];
      let p = this.eventType.includes("t") || this.eventType.includes("b") ? d : l;
      p = this.eventType.length === 2 ? Math.max(l, d) : p, Number.isFinite(p) || (p = 1), c = eh(this.box, f, p);
    }
    this.el.dispatch("resize", {
      box: new st(c),
      angle: 0,
      eventType: this.eventType,
      event: n,
      handler: this
    }).defaultPrevented || this.el.size(c.width, c.height).move(c.x, c.y);
  }
  movePoint(n) {
    this.lastEvent = n;
    const { x: t, y: e } = this.snapToGrid(this.el.point(tn(n))), s = this.el.array().slice();
    s[this.index] = [t, e], !this.el.dispatch("resize", {
      box: Lo(s),
      angle: 0,
      eventType: this.eventType,
      event: n,
      handler: this
    }).defaultPrevented && this.el.plot(s);
  }
  rotate(n) {
    this.lastEvent = n;
    const t = this.startPoint, e = this.el.point(tn(n)), { cx: s, cy: i } = this.box, o = t.x - s, r = t.y - i, a = e.x - s, c = e.y - i, l = Math.sqrt(o * o + r * r) * Math.sqrt(a * a + c * c);
    if (l === 0) return;
    let d = Math.acos((o * a + r * c) / l) / Math.PI * 180;
    if (!d) return;
    e.x < t.x && (d = -d);
    const h = new G(this.el), { x: u, y: f } = new Q(s, i).transformO(h), { rotate: p } = h.decompose(), g = this.snapToAngle(p + d) - p;
    this.el.dispatch("resize", {
      box: this.box,
      angle: g,
      eventType: this.eventType,
      event: n,
      handler: this
    }).defaultPrevented || this.el.transform(h.rotateO(g, u, f));
  }
  endResize(n) {
    this.eventType !== "rot" && this.eventType !== "point" && this.resize(n), this.lastEvent = null, this.eventType = "", tt(window, "mousemove.resize touchmove.resize"), tt(window, "mouseup.resize touchend.resize");
  }
  snapToGrid(n) {
    return this.grid && (n.x = Math.round(n.x / this.grid) * this.grid, n.y = Math.round(n.y / this.grid) * this.grid), n;
  }
  snapToAngle(n) {
    return this.degree && (n = Math.round(n / this.degree) * this.degree), n;
  }
};
z(mt, { resize: function(n = !0, t = {}) {
  typeof n == "object" && (t = n, n = !0);
  let e = this.remember("_ResizeHandler");
  return e || (n.prototype instanceof hi ? (e = new n(this), n = !0) : e = new hi(this), this.remember("_resizeHandler", e)), e.active(n, t), this;
} });
function Yt(n, t, e) {
  try {
    const s = n.node.ownerSVGElement || n.node, i = n.node.getScreenCTM(), o = s.getScreenCTM();
    if (!i || !o)
      return [t, e];
    const r = i.a * t + i.c * e + i.e, a = i.b * t + i.d * e + i.f, c = o.a * o.d - o.b * o.c;
    if (Math.abs(c) < 1e-10)
      return [t, e];
    const l = o.d / c, d = -o.b / c, h = -o.c / c, u = o.a / c, f = (o.c * o.f - o.d * o.e) / c, p = (o.b * o.e - o.a * o.f) / c, g = l * r + h * a + f, m = d * r + u * a + p;
    return [g, m];
  } catch {
    return [t, e];
  }
}
function Tn(n, t, e) {
  try {
    const s = n.node.ownerSVGElement || n.node, i = n.node.getScreenCTM(), o = s.getScreenCTM();
    if (!i || !o)
      return [t, e];
    const r = o.a * t + o.c * e + o.e, a = o.b * t + o.d * e + o.f, c = i.a * i.d - i.b * i.c;
    if (Math.abs(c) < 1e-10)
      return [t, e];
    const l = i.d / c, d = -i.b / c, h = -i.c / c, u = i.a / c, f = (i.c * i.f - i.d * i.e) / c, p = (i.b * i.e - i.a * i.f) / c, g = l * r + h * a + f, m = d * r + u * a + p;
    return [g, m];
  } catch {
    return [t, e];
  }
}
function He(n) {
  const t = n.bbox();
  return Yt(n, t.cx, t.cy);
}
function nh(n, t) {
  try {
    const e = n && n.node;
    let s = e && e.querySelector && e.querySelector("path[data-shape-path]");
    if (!s && e && e.querySelectorAll) {
      let w = 0;
      e.querySelectorAll("svg path:not([data-node-background-path])").forEach((_) => {
        if (typeof _.getTotalLength == "function")
          try {
            const C = _.getBBox(), S = C.width * C.height;
            S > w && (w = S, s = _);
          } catch {
          }
      });
    }
    if (!s || typeof s.getTotalLength != "function") return null;
    const i = s.getTotalLength();
    if (!i || !isFinite(i)) return null;
    let o = s.ownerSVGElement;
    for (; o && o.ownerSVGElement; ) o = o.ownerSVGElement;
    const r = s.getScreenCTM && s.getScreenCTM(), a = o && o.getScreenCTM && o.getScreenCTM();
    if (!o || !r || !a) return null;
    const c = a.inverse(), l = o.createSVGPoint(), d = (w, _) => {
      l.x = w, l.y = _;
      const C = l.matrixTransform(r).matrixTransform(c);
      return [C.x, C.y];
    }, [h, u] = He(n), f = t[0] - h, p = t[1] - u, g = Math.sqrt(f * f + p * p) || 1, m = f / g, b = p / g;
    let y = null, x = -1 / 0;
    const E = 96;
    let v = s.__outlineSamples;
    if (!v || s.__outlineLen !== i) {
      v = new Array(E);
      for (let w = 0; w < E; w++) {
        const _ = s.getPointAtLength(w / E * i);
        v[w] = [_.x, _.y];
      }
      s.__outlineSamples = v, s.__outlineLen = i;
    }
    for (let w = 0; w < v.length; w++) {
      const [_, C] = d(v[w][0], v[w][1]);
      if (!isFinite(_) || !isFinite(C)) continue;
      const S = _ - h, k = C - u, M = S * m + k * b, O = Math.abs(S * b - k * m), P = M - O * 1.5;
      P > x && (x = P, y = [_, C]);
    }
    return y;
  } catch {
    return null;
  }
}
function pn(n, t) {
  const e = nh(n, t);
  if (e && isFinite(e[0]) && isFinite(e[1])) {
    const m = n.bbox(), [b, y] = Yt(n, m.cx, m.cy), x = Math.max(m.width, m.height, 1) * 3;
    if (Math.hypot(e[0] - b, e[1] - y) <= x)
      return e;
  }
  const s = n.bbox(), [i, o] = Tn(n, t[0], t[1]), r = s.cx, a = s.cy, c = i - r, l = o - a, d = Math.sqrt(c * c + l * l);
  if (d === 0)
    return Yt(n, r, a);
  const h = c / d, u = l / d;
  let f;
  if (n.type === "circle") {
    const m = parseFloat(n.attr("r")) || 0;
    f = [r + m * h, a + m * u];
  } else if (n.type === "ellipse") {
    const m = parseFloat(n.attr("rx")) || 0, b = parseFloat(n.attr("ry")) || 0, y = Math.atan2(u, h);
    f = [
      r + m * Math.cos(y),
      a + b * Math.sin(y)
    ];
  } else {
    const m = s.x, b = s.x + s.width, y = s.y, x = s.y + s.height, E = [];
    if (h !== 0) {
      const v = (m - r) / h, w = a + v * u;
      w >= y && w <= x && v > 0 && E.push([m, w, v]);
    }
    if (h !== 0) {
      const v = (b - r) / h, w = a + v * u;
      w >= y && w <= x && v > 0 && E.push([b, w, v]);
    }
    if (u !== 0) {
      const v = (y - a) / u, w = r + v * h;
      w >= m && w <= b && v > 0 && E.push([w, y, v]);
    }
    if (u !== 0) {
      const v = (x - a) / u, w = r + v * h;
      w >= m && w <= b && v > 0 && E.push([w, x, v]);
    }
    E.length > 0 ? (E.sort(function(v, w) {
      return v[2] - w[2];
    }), f = [E[0][0], E[0][1]]) : f = [r, a];
  }
  const [p, g] = Yt(n, f[0], f[1]);
  return isNaN(p) || isNaN(g) || !isFinite(p) || !isFinite(g) ? Yt(n, r, a) : [p, g];
}
function di(n, t) {
  const e = n.bbox(), s = e.x + (t.x != null ? t.x : 0.5) * e.width, i = e.y + (t.y != null ? t.y : 0.5) * e.height, [o, r] = Yt(n, s, i);
  return isNaN(o) || isNaN(r) || !isFinite(o) || !isFinite(r) ? He(n) : [o, r];
}
function ui(n, t) {
  try {
    const e = n.bbox();
    if (!e || !e.width || !e.height) return null;
    const [s, i] = Tn(n, t[0], t[1]), o = (s - e.x) / e.width, r = (i - e.y) / e.height, a = o, c = 1 - o, l = r, d = 1 - r, h = Math.min(a, c, l, d);
    let u = 0, f = 0;
    h === a ? u = -1 : h === c ? u = 1 : h === l ? f = -1 : f = 1;
    const p = Yt(n, e.cx, e.cy), g = Yt(n, e.cx + u, e.cy + f), m = g[0] - p[0], b = g[1] - p[1], y = Math.hypot(m, b);
    return y > 1e-4 ? [m / y, b / y] : null;
  } catch {
    return null;
  }
}
function Us(n) {
  const t = {};
  if (!n.source || !n.target)
    return [
      ["M", 0, 0],
      ["L", 50, 50]
    ];
  const e = He(n.source), s = He(n.target);
  n.sourceAnchor ? t.point1 = di(n.source, n.sourceAnchor) : n.sourceAttach === "center" ? t.point1 = e : t.point1 = pn(n.source, s), n.targetAnchor ? t.point2 = di(n.target, n.targetAnchor) : n.targetAttach === "center" ? t.point2 = s : t.point2 = pn(n.target, e);
  const i = t.point1, o = t.point2;
  let r;
  if (n.type === "curved") {
    const l = o[0] - i[0], d = o[1] - i[1], h = Math.sqrt(l * l + d * d);
    if (h < 1)
      return [["M", i[0], i[1]], ["L", o[0], o[1]]];
    const u = (x, E, v, w) => {
      const _ = Math.sqrt(x * x + E * E);
      if (_ > 1e-4) return [x / _, E / _];
      const C = Math.sqrt(v * v + w * w) || 1;
      return [v / C, w / C];
    }, f = n.sourceAnchor && ui(n.source, i) || u(i[0] - e[0], i[1] - e[1], l, d), p = n.targetAnchor && ui(n.target, o) || u(o[0] - s[0], o[1] - s[1], -l, -d), g = typeof n.lineCurviness == "number" ? n.lineCurviness : 0.3, m = Math.max(20, h * (0.12 + g * 0.55)), b = [i[0] + f[0] * m, i[1] + f[1] * m], y = [o[0] + p[0] * m, o[1] + p[1] * m];
    if (n.lineCurveType === "quadratic") {
      const x = [(b[0] + y[0]) / 2, (b[1] + y[1]) / 2];
      r = [
        ["M", i[0], i[1]],
        ["Q", x[0], x[1], o[0], o[1]]
      ];
    } else
      r = [
        ["M", i[0], i[1]],
        ["C", b[0], b[1], y[0], y[1], o[0], o[1]]
      ];
  } else if (n.type === "orthogonal") {
    const l = o[0] - i[0], d = o[1] - i[1], h = i[0] < e[0], u = i[1] < e[1], f = o[0] < s[0], p = o[1] < s[1];
    let g, m;
    const b = 32;
    if (Math.abs(l) <= b && Math.abs(d) > b) {
      const y = (i[0] + o[0]) / 2;
      r = [
        ["M", y, i[1]],
        ["L", y, o[1]]
      ];
    } else if (Math.abs(d) <= b && Math.abs(l) > b) {
      const y = (i[1] + o[1]) / 2;
      r = [
        ["M", i[0], y],
        ["L", o[0], y]
      ];
    } else if (Math.abs(l) > Math.abs(d))
      if (h && f || !h && !f) {
        const y = Math.max(n.curveRadius, Math.abs(d) / 2);
        m = i[1] + (d > 0 ? -y : y), r = [
          ["M", i[0], i[1]],
          ["L", i[0], m],
          ["L", o[0], m],
          ["L", o[0], o[1]]
        ];
      } else
        g = i[0] + l / 2, r = [
          ["M", i[0], i[1]],
          ["L", g, i[1]],
          ["L", g, o[1]],
          ["L", o[0], o[1]]
        ];
    else if (u && p || !u && !p) {
      const y = Math.max(n.curveRadius, Math.abs(l) / 2);
      g = i[0] + (l > 0 ? -y : y), r = [
        ["M", i[0], i[1]],
        ["L", g, i[1]],
        ["L", g, o[1]],
        ["L", o[0], o[1]]
      ];
    } else
      m = i[1] + d / 2, r = [
        ["M", i[0], i[1]],
        ["L", i[0], m],
        ["L", o[0], m],
        ["L", o[0], o[1]]
      ];
  } else
    r = [
      ["M", i[0], i[1]],
      ["L", o[0], o[1]]
    ];
  const a = n.markerSource && n.markerSource.size;
  if (a && r && r.length >= 2 && Math.hypot(o[0] - i[0], o[1] - i[1]) > a * 1.5) {
    const d = r[0], h = r[1], u = d[d.length - 2], f = d[d.length - 1];
    let p = h[1] - u, g = h[2] - f;
    const m = Math.hypot(p, g);
    m > 1e-3 && (p /= m, g /= m, d[d.length - 2] = u + p * a, d[d.length - 1] = f + g * a, (h[0] === "C" || h[0] === "Q") && (h[1] += p * a, h[2] += g * a));
  }
  const c = n.markerTarget && n.markerTarget.size;
  if (c && r && r.length >= 2 && Math.hypot(o[0] - i[0], o[1] - i[1]) > c * 1.5) {
    const d = r[r.length - 1], h = d[d.length - 2], u = d[d.length - 1];
    let f, p;
    if (d[0] === "C")
      f = d[3], p = d[4];
    else {
      const y = r[r.length - 2];
      f = y[y.length - 2], p = y[y.length - 1];
    }
    let g = h - f, m = u - p;
    const b = Math.hypot(g, m);
    b > 1e-3 && (g /= b, m /= b, d[d.length - 2] = h - g * c, d[d.length - 1] = u - m * c, d[0] === "C" && (d[3] -= g * c, d[4] -= m * c));
  }
  return r;
}
function fi(n, t, e, s, i, o) {
  if (!n || n === "null") return null;
  const a = Math.max(12, s * 3 + 6), c = a, l = a * 0.8, d = (e ? "source-" : "target-") + "triangle-" + Math.random().toString(16).substr(2, 8), h = i.defs().marker(c, l);
  h.attr({
    id: d,
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
  const u = h.path(), f = l / 2;
  return e ? u.attr({
    d: "M 0 " + f + " L " + c + " 0 L " + c + " " + l + " z"
  }) : u.attr({
    d: "M 0 0 L 0 " + l + " L " + c + " " + f + " z"
  }), u.fill(o), {
    element: h,
    id: d,
    size: a
  };
}
function gn(n, t, e, s) {
  return s && (n.markers = s), n.markerSourceType = t || "null", n.markerTargetType = e || "null", n.markerSource && (n.markerSource.element.remove(), n.connector.attr("marker-start", null)), n.markerTarget && (n.markerTarget.element.remove(), n.connector.attr("marker-end", null)), t && t !== "null" ? (n.markerSource = fi(
    t,
    0,
    !0,
    n.strokeWidth,
    n.markers || s,
    n.color
  ), n.connector.attr("marker-start", "url(#" + n.markerSource.id + ")")) : n.markerSource = null, e && e !== "null" ? (n.markerTarget = fi(
    e,
    0,
    !1,
    n.strokeWidth,
    n.markers || s,
    n.color
  ), n.connector.attr("marker-end", "url(#" + n.markerTarget.id + ")")) : n.markerTarget = null, n;
}
function sh(n, t, e) {
  return n.markerSourceType = t || "null", n.markerTargetType = e || "null", gn(n, n.markerSourceType, n.markerTargetType), n;
}
function ih(n, t) {
  return n.strokeWidth = t || 2, n.connector.attr("stroke-width", n.strokeWidth), gn(n, n.markerSourceType, n.markerTargetType), n;
}
function pi(n, t) {
  n.color = t, n.connector.stroke(t).attr("stroke-width", n.strokeWidth), n.markerSource && n.markerSource.element.children().forEach(function(e) {
    e.type === "path" && e.fill(t);
  }), n.markerTarget && n.markerTarget.element.children().forEach(function(e) {
    e.type === "path" && e.fill(t);
  });
}
function oh(n, t) {
  try {
    const [e, s] = Tn(n, t[0], t[1]), i = n.bbox();
    if (!i || !i.width || !i.height) return null;
    let o = Math.max(0, Math.min(1, (e - i.x) / i.width)), r = Math.max(0, Math.min(1, (s - i.y) / i.height));
    const a = o, c = 1 - o, l = r, d = 1 - r, h = Math.min(a, c, l, d);
    return h === a ? o = 0 : h === c ? o = 1 : h === l ? r = 0 : r = 1, { x: o, y: r };
  } catch {
    return null;
  }
}
function rh(n, t) {
  return n && typeof n[t] == "function";
}
function gi(n, t, e) {
  if (!n.showHandles) return null;
  const s = n.container.circle(n.handleRadius * 2).attr({
    cx: e[0],
    cy: e[1],
    fill: n.handleFill,
    stroke: n.handleStroke,
    "stroke-width": n.handleStrokeWidth,
    "pointer-events": "all"
  }).addClass("connector-handle").addClass(t ? "connector-handle-source" : "connector-handle-target");
  try {
    s.node.style.cursor = "grab";
  } catch {
    s.node.setAttribute("style", "cursor: grab");
  }
  const i = {
    element: s,
    isSource: t,
    position: e,
    isDetached: !1,
    originalTarget: t ? n.source : n.target
  };
  return ah(n, i), i;
}
function ah(n, t) {
  let e = null;
  if (!rh(t.element, "draggable")) {
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
    t.element.front(), ch(n, t);
  }).on("dragmove", function(s) {
    const i = [t.element.cx(), t.element.cy()];
    t.position = i;
    const o = s.detail.event;
    e = uh(n, o, t), fh(e), lh(n, t, i, e);
  }).on("dragend", function(s) {
    try {
      t.element.node.style.cursor = "grab";
    } catch {
      t.element.node.setAttribute("style", "cursor: grab");
    }
    if (n.debugMode && zo(n.container), e)
      mi(n, t, e), Go();
    else {
      const i = [t.element.cx(), t.element.cy()], o = ph(n, i);
      t.isSource ? n._sourcePhantomRect = o : n._targetPhantomRect = o, mi(n, t, o);
    }
    e = null;
  });
}
function ch(n, t) {
  t.isDetached = !0, t.originalTarget || (t.originalTarget = t.isSource ? n.source : n.target), t.originalType || (t.originalType = n.type);
  const e = t.isSource ? n.source : n.target;
  e && e._isPhantomRect && (e.remove(), t.isSource ? n._sourcePhantomRect = null : n._targetPhantomRect = null), t.isSource ? n.source = null : n.target = null;
}
function lh(n, t, e, s) {
  const i = t.originalType || n.type;
  let o = null, r = null;
  s && typeof s.bbox == "function" && !s._isPhantomRect && !(s.hasClass && s.hasClass("connector-handle")) && (r = oh(s, e), r && (o = s));
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
  }, c = n.source, l = n.target, d = n.type, h = n.sourceAnchor, u = n.targetAnchor;
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
    const f = Us(n);
    n.connector.plot(f), n.hitArea.plot(f);
  } finally {
    n.source = c, n.target = l, n.type = d, n.sourceAnchor = h, n.targetAnchor = u;
  }
}
function hh(n, t, e = !1) {
  try {
    const s = n.node.getCTM(), i = n.bbox();
    e && console.log("Hit test debug:", {
      element: n.type,
      point: t,
      bbox: i,
      ctm: s
    });
    const o = s.a * s.d - s.b * s.c;
    if (Math.abs(o) < 1e-10)
      return e && console.log("Using fallback bbox test due to singular matrix"), t[0] >= i.x && t[0] <= i.x + i.width && t[1] >= i.y && t[1] <= i.y + i.height;
    const r = s.d / o, a = -s.b / o, c = -s.c / o, l = s.a / o, d = (s.c * s.f - s.d * s.e) / o, h = (s.b * s.e - s.a * s.f) / o, u = r * t[0] + c * t[1] + d, f = a * t[0] + l * t[1] + h;
    e && console.log("Local coordinates:", { localX: u, localY: f });
    let p = !1;
    if (n.type === "circle") {
      const g = parseFloat(n.attr("cx")) || i.cx, m = parseFloat(n.attr("cy")) || i.cy, b = parseFloat(n.attr("r")) || 0, y = u - g, x = f - m;
      p = y * y + x * x <= b * b, e && console.log("Circle test:", {
        cx: g,
        cy: m,
        r: b,
        dx: y,
        dy: x,
        distance: Math.sqrt(y * y + x * x),
        result: p
      });
    } else if (n.type === "ellipse") {
      const g = parseFloat(n.attr("cx")) || i.cx, m = parseFloat(n.attr("cy")) || i.cy, b = parseFloat(n.attr("rx")) || 0, y = parseFloat(n.attr("ry")) || 0, x = u - g, E = f - m;
      p = x * x / (b * b) + E * E / (y * y) <= 1, e && console.log("Ellipse test:", { cx: g, cy: m, rx: b, ry: y, dx: x, dy: E, result: p });
    } else
      p = u >= i.x && u <= i.x + i.width && f >= i.y && f <= i.y + i.height, e && console.log("Rect test:", {
        localX: u,
        localY: f,
        bboxX: i.x,
        bboxY: i.y,
        bboxWidth: i.width,
        bboxHeight: i.height,
        result: p
      });
    return p;
  } catch (s) {
    e && console.log("Exception in hit test, using fallback:", s);
    const i = n.bbox();
    return t[0] >= i.x && t[0] <= i.x + i.width && t[1] >= i.y && t[1] <= i.y + i.height;
  }
}
function dh(n, t) {
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
      const d = [
        [e.x, e.y],
        [e.x + e.width, e.y],
        [e.x + e.width, e.y + e.height],
        [e.x, e.y + e.height]
      ].map((h) => [
        s.a * h[0] + s.c * h[1] + s.e,
        s.b * h[0] + s.d * h[1] + s.f
      ]).map(
        (h, u) => (u === 0 ? "M" : "L") + h[0] + "," + h[1]
      ).join(" ") + " Z";
      i.path(d).attr({
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
function zo(n) {
  try {
    n.find(".debug-hit-zone").forEach((e) => e.remove());
  } catch (t) {
    console.warn("Error clearing hit zone visualizations:", t);
  }
}
function uh(n, t, e) {
  const s = n.debugMode || !1;
  s && zo(n.container);
  function i(u) {
    const f = [];
    function p(g) {
      o(g) && f.push(g), g.children && typeof g.children == "function" && g.children().forEach(p);
    }
    return p(u), f;
  }
  function o(u) {
    if (!["circle", "rect", "ellipse", "polygon", "path"].includes(u.type) || u.attr("connectortype") || u.hasClass && u.hasClass("connector-handle") || u._isPhantomRect || u.hasClass && u.hasClass("debug-hit-zone"))
      return !1;
    if (u.hasClass) {
      const E = u.node.classList;
      if (E && (E.contains("svg_select_boundingRect") || E.contains("svg_select_points") || E.contains("svg_select_selector") || E.contains("svg_resize_rotationPoint") || E.contains("svg_resize_handle") || E.contains("svg_resize_point") || E.contains("svg_draggable_handle") || E.contains("plugin-ui") || E.contains("ui-element")))
        return !1;
    }
    const p = u.bbox();
    if (p.width < 10 || p.height < 10)
      return !1;
    try {
      const v = window.getComputedStyle(u.node).cursor;
      if (v === "nw-resize" || v === "ne-resize" || v === "sw-resize" || v === "se-resize" || v === "ew-resize" || v === "ns-resize" || v === "crosshair")
        return !1;
    } catch {
    }
    const g = u.node.dataset;
    if (g && (g.svgjs || g.plugin || g.handle || g.ui))
      return !1;
    let m = u.parent();
    for (; m && m.type !== "svg"; ) {
      if (m.hasClass) {
        const v = m.node.classList;
        if (v && (v.contains("svg_select_group") || v.contains("svg_resize_group") || v.contains("plugin-ui-group")))
          return !1;
      }
      const E = m.attr("id");
      if (E && (E.includes("_select_") || E.includes("_resize_") || E.includes("plugin")))
        return !1;
      m = m.parent();
    }
    const b = u.attr("id");
    if (b && (b.includes("_select_") || b.includes("_resize_") || b.includes("_handle_") || b.includes("_rotation_") || b.includes("plugin") || b.startsWith("svg_")))
      return !1;
    const y = u.attr("fill"), x = u.attr("stroke");
    return !(!y && !x || (y === "transparent" || y === "none") && (!x || x === "none" || x === "transparent"));
  }
  const r = n.container.root(), a = r.node.getBoundingClientRect(), c = t.clientX - a.left, l = t.clientY - a.top;
  s && console.log("Drop target search at:", { svgX: c, svgY: l });
  const d = i(r);
  s && (console.log("Found target shapes:", d.length), d.forEach((u, f) => {
    console.log(`Target shape ${f}:`, {
      type: u.type,
      id: u.attr("id"),
      classes: u.node.classList ? Array.from(u.node.classList) : [],
      fill: u.attr("fill"),
      stroke: u.attr("stroke"),
      bbox: u.bbox(),
      isValid: Fn(n, u, e)
    });
  }), d.forEach((u) => {
    Fn(n, u, e) && dh(u, n.container);
  }));
  const h = [];
  return d.forEach(function(u) {
    if (Fn(n, u, e))
      try {
        if (hh(u, [c, l], s)) {
          let p, g;
          try {
            const b = u.bbox(), y = u.node.getCTM();
            p = y.a * b.cx + y.c * b.cy + y.e, g = y.b * b.cx + y.d * b.cy + y.f;
          } catch {
            const y = u.bbox();
            p = y.cx, g = y.cy;
          }
          const m = Math.sqrt(
            Math.pow(c - p, 2) + Math.pow(l - g, 2)
          );
          s && console.log("Found candidate:", {
            element: u.type,
            distance: m
          }), h.push({ element: u, distance: m });
        }
      } catch (f) {
        console.warn("Error checking element for drop target:", f);
      }
  }), h.length > 0 ? (h.sort(function(u, f) {
    return u.distance - f.distance;
  }), s && console.log("Selected closest candidate:", h[0]), h[0].element) : (s && console.log("No drop target found"), null);
}
function Fn(n, t, e) {
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
function mi(n, t, e) {
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
    const o = Us(n);
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
let lt = null;
function fh(n) {
  if (n !== lt)
    if (Go(), n) {
      lt = n, n._originalStroke = n.attr("stroke"), n._originalStrokeWidth = n.attr("stroke-width"), n._originalStrokeDasharray = n.attr("stroke-dasharray"), n._originalStrokeOpacity = n.attr("stroke-opacity"), n.attr({
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
      lt = null;
}
function Go() {
  if (lt && lt._originalStroke !== void 0) {
    lt.attr({
      stroke: lt._originalStroke,
      "stroke-width": lt._originalStrokeWidth,
      "stroke-dasharray": lt._originalStrokeDasharray,
      "stroke-opacity": lt._originalStrokeOpacity
    });
    try {
      const n = lt.node.style;
      n.animation = "", n.strokeDashoffset = "";
    } catch {
    }
    delete lt._originalStroke, delete lt._originalStrokeWidth, delete lt._originalStrokeDasharray, delete lt._originalStrokeOpacity;
  }
  lt = null;
}
function yi(n, t) {
  if (!n.showHandles || !t || t.length < 2) {
    n.sourceHandle && (n.sourceHandle.element.remove(), n.sourceHandle = null), n.targetHandle && (n.targetHandle.element.remove(), n.targetHandle = null);
    return;
  }
  const e = [t[0][1], t[0][2]], s = t[t.length - 1], i = [s[s.length - 2], s[s.length - 1]];
  n.sourceHandle ? (n.sourceHandle.element.attr({
    cx: e[0],
    cy: e[1]
  }), n.sourceHandle.position = e) : n.sourceHandle = gi(n, !0, e), n.targetHandle ? (n.targetHandle.element.attr({
    cx: i[0],
    cy: i[1]
  }), n.targetHandle.position = i) : n.targetHandle = gi(n, !1, i);
}
function ph(n, t) {
  const e = n.container.rect(20, 20).attr({
    x: t[0] - 10,
    y: t[1] - 10,
    fill: "transparent",
    stroke: "none",
    "pointer-events": "none"
  }).addClass("connector-phantom-rect");
  return e._isPhantomRect = !0, e;
}
function Et(n, t) {
  return n && typeof n[t] == "function";
}
function Bo(n, t) {
  t.current && t.current !== n && Ys(t.current), t.current = n, n.isSelected = !0, n.showHandles = !0, n.update();
}
function Ys(n) {
  n.isSelected = !1, n.showHandles = !1, n.update();
}
function gh(n, t) {
  n.isSelected ? (Ys(n), t.current === n && (t.current = null)) : Bo(n, t);
}
function mh(n, t) {
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
function yh(n, t, e) {
  n[t + "Attach"] = e, n.update();
}
function bh(n, t) {
  return n.showHandles = t, n.update(), n;
}
function vh(n) {
  return {
    sourceHandle: n.sourceHandle,
    targetHandle: n.targetHandle
  };
}
function wh(n, t) {
  return n.clickAreaWidth = Math.max(6, t || 12), n.hitArea.attr("stroke-width", n.clickAreaWidth), n;
}
function xh(n, t) {
  t && (n.connector.remove(), t == "default" ? (n.connector = n.container.path().attr("connectortype", "default").fill("none").stroke("#000000").attr("stroke-width", 2), n.connector.stroke(n.color).attr("stroke-width", n.strokeWidth)) : n.connector = t, n.update());
}
function _h(n, t) {
  ["straight", "curved", "orthogonal"].indexOf(t) != -1 && n.type != t && (n.type = t, n.update());
}
function Ho(n, t) {
  return n.debugMode = t, n.hitArea.attr({
    stroke: n.debugMode ? "#ff0000" : "#000000",
    "stroke-opacity": n.debugMode ? 0.5 : 0.01
  }), n;
}
function Ch(n) {
  return Ho(n, !n.debugMode);
}
function Fo(n, t) {
  return t = t || {}, Et(n.source, "select") ? n.source.select(t) : console.warn(
    "svg.select.js plugin not available. Install @svgdotjs/svg.select.js to use selection features."
  ), Et(n.target, "select") ? n.target.select(t) : console.warn(
    "svg.select.js plugin not available. Install @svgdotjs/svg.select.js to use selection features."
  ), n;
}
function $o(n, t) {
  return Et(n.source, "draggable") ? n.source.draggable() : console.warn(
    "svg.draggable.js plugin not available. Install @svgdotjs/svg.draggable.js to use dragging features."
  ), Et(n.target, "draggable") ? n.target.draggable() : console.warn(
    "svg.draggable.js plugin not available. Install @svgdotjs/svg.draggable.js to use dragging features."
  ), n;
}
function Uo(n, t) {
  return t = t || {}, Et(n.source, "resize") ? n.source.resize(t) : console.warn(
    "svg.resize.js plugin not available. Install @svgdotjs/svg.resize.js to use resize features."
  ), Et(n.target, "resize") ? n.target.resize(t) : console.warn(
    "svg.resize.js plugin not available. Install @svgdotjs/svg.resize.js to use resize features."
  ), n;
}
function Eh(n, t, e, s, i) {
  return t = t || {}, s = s || {}, Et(n.source, "draggable") && Et(n.target, "draggable"), Et(n.source, "select") && Et(n.target, "select"), Et(n.source, "resize") && Et(n.target, "resize"), $o(n), Fo(n, t), Uo(n, s), n;
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
let Wt = null, $n = null;
const en = { current: null };
function Sh(n, t) {
  const e = {};
  t === void 0 && (t = n, n = {}), Wt = n.container || this.parent() || Wt;
  const s = this;
  if ($n = n.markers || this.parent() || $n, e.container = Wt, e.source = s, e.target = t, e.type = n.type || "straight", e.strokeWidth = n.strokeWidth || 2, e.color = n.color || "#000000", e.clickAreaWidth = n.clickAreaWidth || Math.max(12, e.strokeWidth * 3), e.debugMode = n.debugMode || !1, n.connector) {
    const a = Mn.find(
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
  e.hitArea.back(), e.sourceAttach = n.sourceAttach || "perifery", e.targetAttach = n.targetAttach || "perifery", e.sourceAnchor = n.sourceAnchor || null, e.targetAnchor = n.targetAnchor || null, e.curveRadius = n.curveRadius || 20, e.lineCurviness = typeof n.lineCurviness == "number" ? n.lineCurviness : 0.3, e.lineCurveType = n.lineCurveType || "cubic", e.markerSourceType = n.markerSource || "null", e.markerTargetType = n.markerTarget || n.marker || "default", e.showHandles = n.showHandles || !1, e.handleRadius = n.handleRadius || 6, e.handleStrokeWidth = n.handleStrokeWidth || 2, e.handleStroke = n.handleStroke || "#007cff", e.handleFill = n.handleFill || "none", e.isSelected = !1, e.computeConnectorCoordinates = function(a) {
    return Us(a || e);
  }, s.cons = s.cons || [], s.cons.push(e), t.targetCons = t.targetCons || [], t.targetCons.push(e), e.update = function() {
    if (e.connector.attr("connectortype") == "default") {
      const a = e.computeConnectorCoordinates(e);
      let c = !0;
      for (let l = 0; l < a.length; l++)
        for (let d = 1; d < a[l].length; d++)
          (isNaN(a[l][d]) || !isFinite(a[l][d])) && (console.error(
            "Invalid coordinate in path data:",
            a[l][d],
            "at",
            [l, d]
          ), c = !1);
      c ? (e.connector.plot(a), e.hitArea.plot(a), yi(e, a), e.positionLabel && e.positionLabel()) : console.error("Skipping plot due to invalid path data");
    }
  }, gn(e, e.markerSourceType, e.markerTargetType, $n), e.sourceHandle = null, e.targetHandle = null, e.setMarker = function(a, c, l) {
    return gn(e, a, c, l);
  }, e.setMarkerSettings = function(a, c) {
    return sh(e, a, c);
  }, e.positionLabel = function() {
    if (!(!e.label || !e.connector || !e.connector.node))
      try {
        const a = e.connector.node.getTotalLength();
        if (!a || !isFinite(a)) return;
        const c = e.connector.node.getPointAtLength(a / 2);
        if (e.label.center(c.x, c.y), e.labelBg) {
          const l = e.label.bbox();
          e.labelBg.size(l.width + 10, l.height + 4).center(c.x, c.y);
        }
      } catch {
      }
  }, e.setLabel = function(a) {
    if (e.labelText = a == null ? "" : String(a), !e.labelText) {
      e.label && (e.label.remove(), e.label = null), e.labelBg && (e.labelBg.remove(), e.labelBg = null);
      return;
    }
    e.label ? e.label.text(e.labelText) : (e.labelBg = Wt.rect(0, 0).attr({ fill: "#ffffff", "fill-opacity": 0.85, "pointer-events": "none" }).radius(3), e.label = Wt.text(e.labelText).attr({
      "font-size": 13,
      "font-family": "Arial, sans-serif",
      fill: "#333333",
      "text-anchor": "middle",
      "pointer-events": "none"
    })), e.positionLabel();
  }, e.setStrokeWidth = function(a) {
    return ih(e, a);
  }, e.setConnectorColor = function(a) {
    return pi(e, a), e;
  }, e.remove = function() {
    const a = (c) => {
      try {
        c && c.remove && c.remove();
      } catch {
      }
    };
    return a(e.connector), a(e.hitArea), a(e.sourceHandle && e.sourceHandle.element), a(e.targetHandle && e.targetHandle.element), a(e.markerSource), a(e.markerTarget), a(e._sourcePhantomRect), a(e._targetPhantomRect), a(e.label), a(e.labelBg), e;
  }, e.getCurrentAnchor = function(a) {
    const c = a === "source" ? e.source : e.target, l = a === "source" ? e.target : e.source;
    if (!c || !c.bbox || !l) return { x: 0.5, y: 0.5 };
    try {
      const d = He(l), h = pn(c, d), u = Tn(c, h[0], h[1]), f = c.bbox();
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
    yi(e, a);
  }, e.selectConnector = function() {
    Bo(e, en);
  }, e.deselectConnector = function() {
    Ys(e), en.current === e && (en.current = null);
  }, e.toggleSelection = function() {
    gh(e, en);
  }, e.setConnectorAttachment = function(a, c) {
    yh(e, a, c);
  }, e.setHandleVisibility = function(a) {
    return bh(e, a);
  }, e.getHandles = function() {
    return vh(e);
  }, e.setClickAreaWidth = function(a) {
    return wh(e, a);
  }, e.setConnector = function(a) {
    xh(e, a);
  }, e.setType = function(a) {
    _h(e, a);
  }, e.setDebugMode = function(a) {
    return Ho(e, a);
  }, e.toggleDebugMode = function() {
    return Ch(e);
  }, e.makeSelectable = function(a) {
    return Fo(e, a);
  }, e.makeDraggable = function(a) {
    return $o(e);
  }, e.makeResizable = function(a) {
    return Uo(e, a);
  }, e.makeInteractive = function(a, c, l) {
    return Eh(e, a, c, l);
  }, mh(e), e.update();
  function i(a) {
    e.update();
  }
  function o(a) {
    e.update();
  }
  function r(a) {
    e.update();
  }
  return e._sourceUpdateFunction = o, e._targetUpdateFunction = r, s.on("dragmove", o), t.on("dragmove", r), s.on("beforedrag", o), s.on("dragstart", o), s.on("dragend", o), t.on("beforedrag", r), t.on("dragstart", r), t.on("dragend", r), s.on("resize", o), t.on("resize", r), s.on("rotate", o), t.on("rotate", r), s.on("transform", o), t.on("transform", r), e.updateConnector = i, pi(e, e.color), e;
}
z(mt, {
  connectable: Sh,
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
function kh(n, t, e) {
  const s = n, i = [s[0] - t[0], s[1] - t[1]], o = [s[0] - e[0], s[1] - e[1]], r = Math.sqrt(i[0] * i[0] + i[1] * i[1]) || 1, a = Math.sqrt(o[0] * o[0] + o[1] * o[1]) || 1, c = [i[0] / r, i[1] / r], l = [o[0] / a, o[1] / a], d = [s[0] - 10 * c[0], s[1] - 10 * c[1]], h = [s[0] - 10 * l[0], s[1] - 10 * l[1]], u = [d, s, h];
  return u.every(
    (p) => Number.isFinite(p[0]) && Number.isFinite(p[1])
  ) ? u : null;
}
class Yo {
  /**
   * Creates resize/rotate handle management for a node.
   *
   * @param node    - The parent Node instance
   * @param options - Resize/rotate configuration
   */
  constructor(t, e = {}) {
    this.isActive = !1, this._interacting = !1, this._didRotate = !1, this._didResize = !1, this.scheduleFinish = () => {
      this._interacting && (clearTimeout(this._endTimer), this._endTimer = setTimeout(() => this.finish(), 0));
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
      typeof o.select == "function" && o.select({
        rotationPoint: e ? i : this.options.rotateEnabled,
        // svg.select.js' default updateHandle divides by the distance between
        // adjacent handle points; when a transient/degenerate bbox makes points
        // coincide (or the screenCTM collapses), that divide-by-zero plots
        // "NaN" polyline points and floods the console (notably on multi-select
        // via the keyboard). This replicates the default L-bracket exactly but
        // guards the division and never plots non-finite points.
        updateHandle: (r, a, c, l) => {
          const d = l[(c - 1 + l.length) % l.length], h = l[(c + 1) % l.length], u = kh(a, d, h);
          u && r.plot(u);
        }
      }), (e ? s || i : this.options.resizeEnabled) && typeof o.resize == "function" && o.resize({
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
    if (this.isActive)
      try {
        const t = this.target;
        typeof t.select == "function" && t.select(!1), typeof t.resize == "function" && t.resize(!1), this.removeEventListeners(), this.isActive = !1;
      } catch (t) {
        console.warn("Failed to disable resize/rotate:", t);
      }
  }
  addEventListeners() {
    this.target.on("beforeresize.resizerotate", (t) => {
      this.finish();
      const e = t.detail.handler, s = t.detail.event.detail.event;
      e.preserveAspectRatio = !!(this.options.preserveAspectRatio || s.shiftKey);
      const i = this.node.options, o = this.target.bbox();
      this._start = {
        x: i.x ?? 0,
        y: i.y ?? 0,
        width: i.width ?? 0,
        height: i.height ?? 0,
        angle: i.rotate?.rotationAngle ?? 0,
        localX: o.x,
        localY: o.y
      }, this._interacting = !0, this._didRotate = this._didResize = !1, this.node.disableConnectionHandles();
      const r = this.target.remember("_selectHandler")?.getHandlePoints(o);
      r && queueMicrotask(() => {
        e.points = r;
      });
    }), this.target.on("resize.resizerotate", (t) => {
      const { box: e, angle: s, eventType: i } = t.detail ?? {}, o = this._start;
      if (!(!o || !e)) {
        if (t.preventDefault(), i === "rot") {
          if (!Number.isFinite(s) || !s) return;
          this._didRotate = !0, this.node.applyInteractionRotation(
            (this.node.options.rotate?.rotationAngle ?? 0) + s
          ), this.options.onRotate?.(t);
        } else {
          this._didResize = !0, this.node.backgroundRect.move(e.x, e.y), this.node.resizeTarget?.move(e.x, e.y), this.node.setSize(e.width, e.height);
          const r = this.node.options.width ?? e.width, a = this.node.options.height ?? e.height, c = e.x - o.localX + (r - o.width) / 2, l = e.y - o.localY + (a - o.height) / 2, d = o.angle * Math.PI / 180;
          this.node.options.x = o.x + (o.width - r) / 2 + Math.cos(d) * c - Math.sin(d) * l, this.node.options.y = o.y + (o.height - a) / 2 + Math.sin(d) * c + Math.cos(d) * l, this.node.svgGroup.fire("transform");
        }
        this.syncOverlay(), this.options.onResize?.(t), this.node.slate?.notifyNodeChanged(this.node);
      }
    }), window.addEventListener("mouseup", this.scheduleFinish), window.addEventListener("touchend", this.scheduleFinish), window.addEventListener("touchcancel", this.scheduleFinish);
  }
  finish() {
    if (clearTimeout(this._endTimer), !this._interacting) return;
    this._interacting = !1, this._start = void 0;
    const { id: t, options: e, slate: s } = this.node;
    (this._didRotate || this._didResize) && (this.node.finalizeInteraction(), s?.broadcast?.(this._didRotate ? "onNodeRotated" : "onNodeResized", {
      id: t,
      rotate: e.rotate,
      width: e.width,
      height: e.height,
      x: e.x,
      y: e.y,
      ...!this._didRotate && { vectorPath: e.vectorPath }
    })), s?.getSelectedNodes().includes(this.node) && this.node.enableConnectionHandles(), this._didRotate = this._didResize = !1;
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
typeof window < "u" && (window.SVG = Mn);
class Nn {
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
      const d = (u) => this.slate.governanceOf?.(u)?.capabilities?.canConnect === !1;
      d(this.node) && d(t) && (l.connector?.attr?.({ "pointer-events": "none", "data-governed": "line" }), l.hitArea?.attr?.({ "pointer-events": "none" }), l.hitArea?.node?.style && (l.hitArea.node.style.cursor = ""));
      const h = {
        id: s,
        source: this.node,
        target: t,
        connectable: l,
        lineColor: e.lineColor || this.options.defaultLineColor,
        lineWidth: e.lineWidth || this.options.defaultLineWidth,
        ...e
      };
      h.lineColor && l.setLineColor && l.setLineColor(h.lineColor), this.applyLineAppearance(l, h), h.label && l.setLabel && l.setLabel(h.label), this.connections.set(s, h);
      try {
        this.slate.markersContainer?.front?.();
      } catch {
      }
      if (l.onEndpointChange = (u) => this.handleEndpointChange(h, u), t.connector) {
        const u = `${t.id}<-${s}`;
        t.connector.connections.set(u, h);
      }
      return console.log("CONNECTOR_DEBUG: Successfully connected", s), l.onLineClick = () => {
        this.node.slate?.isReadOnly?.() || this.showLineCog(h, l, t.id);
      }, this.wireHandleReveal(l), this.options.onConnect?.(h), h;
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
    const e = `${this.node.id}->${t.id}`, s = [...this.connections.keys()].filter(
      (o) => o === e || o.startsWith(`${e}~`)
    );
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
    return this.connections.get(e) || null;
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
        if (e.lineColor != null && i.setConnectorColor && i.setConnectorColor(e.lineColor), e.lineWidth != null && i.setStrokeWidth && i.setStrokeWidth(e.lineWidth), this.applyLineAppearance(i, s), e.label != null && i.setLabel && i.setLabel(e.label), e.lineType != null && i.setType) {
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
    if (s?.attr && (e.lineOpacity != null && s.attr("stroke-opacity", e.lineOpacity), e.lineEffect !== void 0)) {
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
    const i = this.connections.get(`${this.node.id}->${t}`);
    return i ? (e === "source" ? i.sourceAnchor = s : i.targetAnchor = s, i.connectable?.setAttachmentAnchor?.(e, s), !0) : !1;
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
    const { which: s, targetNodeId: i, isPhantom: o, point: r } = e, a = {
      lineColor: t.lineColor,
      lineWidth: t.lineWidth,
      lineType: t.lineType,
      lineCurviness: t.lineCurviness,
      lineCurveType: t.lineCurveType,
      showParentArrow: t.showParentArrow,
      showChildArrow: t.showChildArrow
    }, c = (t.id.split("->")[1] || "").trim().replace(/~\d+$/, "");
    setTimeout(() => {
      try {
        if (s === "target") {
          const l = t.source;
          if (!l?.relationships) return;
          if (o || !i) {
            if (!r) return;
            c && l.relationships.removeAssociation(t.id), l.relationships.addFloatingAssociation(r, a);
          } else {
            const d = this.slate.nodes.one(i);
            if (!d) return;
            if (d.id === c) {
              this.pinDropAnchor(l, t.id, d, "targetAnchor", r);
              return;
            }
            c && l.relationships.removeAssociation(t.id), l.relationships.addAssociation(d, a), this.pinDropAnchor(l, d.id, d, "targetAnchor", r);
          }
        } else {
          if (o || !i) return;
          const l = t.source, d = t.target, h = this.slate.nodes.one(i);
          if (!h || !d || !l?.relationships) return;
          if (h.id === l.id) {
            this.pinDropAnchor(l, d.id, h, "sourceAnchor", r);
            return;
          }
          l.relationships.removeAssociation(t.id), h.relationships?.addAssociation(d, a), this.pinDropAnchor(h, d.id, h, "sourceAnchor", r);
        }
      } catch (l) {
        console.warn("CONNECTOR_DEBUG: endpoint change → model failed:", l);
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
  pinDropAnchor(t, e, s, i, o) {
    try {
      if (!o) return;
      const r = s?.options || {};
      if (!r.width || !r.height) return;
      const a = (v) => Math.max(0, Math.min(1, v));
      let c = o.x, l = o.y;
      const d = r.rotate?.rotationAngle || 0;
      if (d) {
        const v = (r.x || 0) + r.width / 2, w = (r.y || 0) + r.height / 2, _ = -d * Math.PI / 180, C = c - v, S = l - w;
        c = v + C * Math.cos(_) - S * Math.sin(_), l = w + C * Math.sin(_) + S * Math.cos(_);
      }
      let h = a((c - (r.x || 0)) / r.width), u = a((l - (r.y || 0)) / r.height);
      const f = h, p = 1 - h, g = u, m = 1 - u, b = Math.min(f, p, g, m);
      b === f ? h = 0 : b === p ? h = 1 : b === g ? u = 0 : u = 1;
      const y = { x: h, y: u }, x = t?.relationships, E = x?.associations?.find((v) => v.id === e) || x?.associations?.find((v) => v.childId === e);
      E?.id && (x.applyLineProperty(E.id, i, y), t.slate?.broadcast?.("onLinePropertiesChanged", {
        id: t.id,
        prop: i,
        val: y,
        associationId: E.id
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
  setEndpointLock(t, e, s) {
    const i = this.connections.get(t);
    if (!i) return null;
    const o = i.connectable;
    if (s === "absolute") {
      const r = o?.getCurrentAnchor?.(e) || { x: 0.5, y: 0.5 };
      return i[e + "Anchor"] = r, o?.setAttachmentAnchor?.(e, r), r;
    }
    return i[e + "Anchor"] = null, o?.setAttachmentAnchor?.(e, null), null;
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
    ), s = (o) => {
      e().forEach((r) => {
        o ? r.node.classList.add("connector-handle--revealed") : !t._handlesPinned && !t._handlesDragging && r.node.classList.remove("connector-handle--revealed");
      });
    };
    t._revealHandles = s;
    const i = () => e().forEach((o) => {
      o._revealArmed || (o._revealArmed = !0, o.on?.("mouseenter", () => s(!0)), o.on?.("mouseleave", () => s(!1)), o.on?.("dragstart", () => {
        t._handlesDragging = !0, s(!0);
      }), o.on?.("dragend", () => {
        t._handlesDragging = !1, t._handlesPinned || s(!1);
      }));
    });
    [t.hitArea, t.connector].forEach((o) => {
      o?.on?.("mouseenter", () => {
        s(!0), i();
      }), o?.on?.("mouseleave", () => s(!1));
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
    const l = 15, d = 6, h = "#5b6472", u = [
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
      color: h,
      onClick: () => {
        this.openLinePane(t, e, s), this.showEndpointLockToggles(t, e, s);
      }
    });
    const f = u.length, p = l * 2 + d, g = f * (l * 2) + (f - 1) * d, m = r - g / 2 + l, b = c.group().addClass("line-cog").addClass("line-toolbar");
    b.rect(g + 14, l * 2 + 10).radius((l * 2 + 10) / 2).center(r, a).fill("#ffffff").stroke({ color: "#e3e5ea", width: 1 });
    const y = this.node.constructor;
    u.forEach((x, E) => {
      const v = m + E * p, w = b.group().addClass(`line-tool-${x.key}`);
      w.circle(l * 2).center(v, a).fill("#ffffff").attr("fill-opacity", 1e-3), y.drawToolIcon?.(w, x.key, v, a, x.color), w.attr("pointer-events", "all");
      try {
        w.node.style.cursor = "pointer";
      } catch {
      }
      w.on("mousedown", (_) => _.stopPropagation?.()), w.on("click", (_) => {
        _.stopPropagation?.(), x.onClick();
      });
    }), b.attr("pointer-events", "all"), i._activeLineCog = b;
    try {
      e.selectConnector?.(), i._activeLineConnectable = e, e._handlesPinned = !0, e._revealHandles?.(!0);
    } catch {
    }
    try {
      i.markersContainer?.front?.();
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
  /**
   * Q3: show a lock/relative toggle at EACH endpoint (source + target) when the
   * line cog is clicked. Clicking a toggle flips absolute (pinned anchor) ↔
   * relative (auto-flow) via applyLineProperty, and broadcasts for collab parity.
   */
  showEndpointLockToggles(t, e, s) {
    const i = this.slate;
    i._activeEndpointToggles && i._activeEndpointToggles.forEach((w) => {
      try {
        w.remove();
      } catch {
      }
    }), i._activeEndpointToggles = [];
    const o = e?.connector?.node;
    if (!o || !o.getPointAtLength) return;
    let r = 0;
    try {
      r = o.getTotalLength();
    } catch {
      return;
    }
    const a = o.getPointAtLength(0), c = o.getPointAtLength(r), l = this.node.relationships, d = l?.associations?.find((w) => w.childId === s);
    if (!d) return;
    const h = (w) => {
      const _ = w?.options || {};
      return { x: (_.x || 0) + (_.width || 0) / 2, y: (_.y || 0) + (_.height || 0) / 2 };
    }, u = (w, _) => Math.hypot(w.x - _.x, w.y - _.y), f = h(this.node), p = u(a, f) <= u(c, f), g = Math.min(34, r * 0.28), m = o.getPointAtLength(p ? g : r - g), b = o.getPointAtLength(p ? r - g : g), y = i.markersContainer || i.canvas, x = "#5b6472", E = "#4051B5", v = (w, _) => {
      const C = _ === "source" ? !!d.sourceAnchor : !!d.targetAnchor, S = C ? E : x, k = y.group().addClass("endpoint-lock").addClass(`endpoint-lock-${_}`).addClass(C ? "endpoint-lock-absolute" : "endpoint-lock-relative");
      k.circle(24).center(w.x, w.y).fill("#ffffff").stroke({ color: S, width: 1.5 }), Nn.drawLockIcon(k, w.x, w.y, S, C), k.circle(24).center(w.x, w.y).fill("#ffffff").attr("fill-opacity", 1e-3), k.attr("pointer-events", "all");
      try {
        k.node.style.cursor = "pointer";
      } catch {
      }
      k.on("mousedown", (M) => M.stopPropagation?.()), k.on("click", (M) => {
        M.stopPropagation?.();
        const O = _ === "source" ? "sourceLock" : "targetLock", P = C ? "relative" : "absolute";
        try {
          l.applyLineProperty(d.id, O, P);
        } catch {
        }
        try {
          i.broadcast?.("onLinePropertiesChanged", {
            id: this.node.id,
            associationId: d.id,
            prop: O,
            val: P
          });
        } catch {
        }
        this.showEndpointLockToggles(t, e, s);
      }), i._activeEndpointToggles.push(k);
    };
    v(m, "source"), v(b, "target");
    try {
      i.markersContainer?.front?.();
    } catch {
    }
  }
  /** Draw a small padlock (closed = absolute/locked, open = relative). */
  static drawLockIcon(t, e, s, i, o) {
    const r = { color: i, width: 1.4, linecap: "round", linejoin: "round" };
    t.rect(11, 8).radius(1.5).move(e - 5.5, s - 0.5).fill("none").stroke(r), o ? t.path(
      `M ${e - 3.4} ${s - 0.5} v -2.2 a 3.4 3.4 0 0 1 6.8 0 v 2.2`
    ).fill("none").stroke(r) : t.path(`M ${e - 3.4} ${s - 0.5} v -2.2 a 3.4 3.4 0 0 1 6.8 -0.6`).fill("none").stroke(r), t.circle(1.6).center(e, s + 3).fill(i);
  }
  isEnabled() {
    return this.isActive;
  }
  updateOptions(t) {
    this.options = { ...this.options, ...t }, console.log("CONNECTOR_DEBUG: Updated options for node", this.node.id);
  }
}
function gs(n, t, e) {
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
const Ah = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createDefaultAssociation: gs
}, Symbol.toStringTag, { value: "Module" }));
class jo {
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
    const s = gs(this.node.id, t.id, e), i = this.node.slate;
    if (i?.capabilitiesOf?.(this.node).canConnect === !1 || i?.capabilitiesOf?.(t).canConnect === !1)
      return s;
    if (!e?.id && this.assocMap.has(s.id)) {
      let o = 2;
      for (; this.assocMap.has(`${s.id}~${o}`); ) o++;
      s.id = `${s.id}~${o}`;
    }
    return this.assocMap.set(s.id, s), this.renderAssociation(s, t), this.node.slate?.broadcast?.("addRelationship", { ...s }), console.log(
      "RELATIONSHIP_DEBUG: Added association",
      s.id,
      "from",
      this.node.id,
      "to",
      t.id
    ), s;
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
    if (e === "sourceLock" || e === "targetLock") {
      const r = e === "sourceLock" ? "source" : "target", a = this.node.connector?.setEndpointLock(
        o,
        r,
        s === "absolute" ? "absolute" : "relative"
      );
      return i[r + "Anchor"] = a ?? null, !0;
    }
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
        lineEffect: s.lineEffect
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
          lineEffect: e.lineEffect
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
      lineType: t.lineType,
      lineCurviness: t.lineCurviness,
      lineCurveType: t.lineCurveType,
      showParentArrow: t.showParentArrow,
      showChildArrow: t.showChildArrow,
      sourceAnchor: t.sourceAnchor,
      targetAnchor: t.targetAnchor,
      label: t.label
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
   * Add a free-floating association whose target is a bare world point rather
   * than a node (L1b). Backed by a phantom endpoint; broadcasts + persists like
   * a normal association (targetPoint travels in the record).
   */
  addFloatingAssociation(t, e) {
    const s = e?.childId || `__free_${Math.random().toString(36).slice(2, 10)}`, i = gs(this.node.id, s, {
      ...e,
      childId: s,
      targetPoint: t
    });
    return this.assocMap.set(i.id, i), this.renderAssociation(i, null), this.node.slate?.broadcast?.("addRelationship", { ...i }), i;
  }
}
class Xo {
  constructor(t) {
    this.patternElement = null, this.imageUrl = "", this.origWidth = 0, this.origHeight = 0, this.preserveAspectRatio = !0, this.node = t;
  }
  /**
   * Set an image fill on the node's background.
   *
   * Uses SVG pattern fills for proper scaling within the shape.
   */
  set(t, e, s, i = !0) {
    this.imageUrl = t, this.origWidth = e || this.node.options.width || 100, this.origHeight = s || this.node.options.height || 60, this.preserveAspectRatio = i, this.node.options.image = t, this.node.options.imageOrigWidth = this.origWidth, this.node.options.imageOrigHeight = this.origHeight, this.render();
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
const cn = /* @__PURE__ */ new Set(), ke = /* @__PURE__ */ new Map(), Mh = /* @__PURE__ */ new Set([
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
function js(n) {
  const t = n.trim(), e = t.toLowerCase();
  if (Mh.has(e) || cn.has(e))
    return Promise.resolve();
  if (ke.has(e))
    return ke.get(e);
  const s = new Promise((i, o) => {
    if (typeof document > "u") {
      i();
      return;
    }
    const r = t.split(",")[0].trim().replace(/['"]/g, "");
    try {
      if (document.fonts?.check?.(`12px "${r}"`)) {
        cn.add(e), i();
        return;
      }
    } catch {
    }
    const a = document.createElement("link");
    a.rel = "stylesheet", a.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      r
    )}:wght@300;400;500;600;700&display=swap`, a.onload = () => {
      cn.add(e), ke.delete(e), console.log("FONT_DEBUG: Loaded font:", r), i();
    }, a.onerror = () => {
      ke.delete(e), console.warn("FONT_DEBUG: Failed to load font:", r), i();
    }, document.head.appendChild(a);
  });
  return ke.set(e, s), s;
}
async function qo(n) {
  const t = /* @__PURE__ */ new Set(), e = n.nodes?.allNodes || [];
  for (const i of e)
    i.options?.fontFamily && t.add(i.options.fontFamily);
  const s = Array.from(t).map((i) => js(i));
  await Promise.all(s), console.log("FONT_DEBUG: All fonts loaded:", Array.from(t));
}
function Th(n) {
  return cn.has(n.toLowerCase().trim());
}
const Nh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  isFontLoaded: Th,
  loadAllFonts: qo,
  loadFont: js
}, Symbol.toStringTag, { value: "Module" }));
class Zo {
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
      `font-family:${e.options.fontFamily || "Arial, sans-serif"}`,
      `font-size:${e.options.fontSize || 14}px`,
      `color:${e.options.fontColor || "#000000"}`
    ].join(";"), c.appendChild(l), s.appendChild(c), this._inlineFO = c, this._inlineDiv = l, this._returnFocus = i, this._inlineEditing = !0, e.textElement?.hide?.();
    const d = (f, p = !1) => {
      if (!this._inlineEditing) return;
      this._inlineEditing = !1;
      const g = (l.innerText || "").replace(/\n+$/, ""), m = p && i && document.activeElement === l;
      try {
        c.remove();
      } catch {
      }
      if (this._inlineFO = null, this._inlineDiv = null, e.textElement?.show?.(), m)
        try {
          s.focus({ preventScroll: !0 });
        } catch {
        }
      const b = e.slate?.governanceOf?.(e);
      if (b) {
        const y = e.options.text || "";
        if (!f || g === y) return;
        let x;
        try {
          x = b.policy.onTextCommit?.(e, g, y);
        } catch (v) {
          console.warn("DRAG_POLICY: onTextCommit threw; keeping the old text", v), x = !1;
        }
        if (x === !1) return;
        const E = typeof x == "string" ? x : g;
        (e.options.text || "") !== E && e.setText?.(E);
        return;
      }
      if (f && g !== (e.options.text || "")) {
        const y = {
          type: "onNodeTextChanged",
          data: { id: e.id, text: g }
        }, x = e.slate, E = x?.collab;
        E?.invoke ? (E.invoke(y), typeof x.broadcast == "function" ? x.broadcast("onNodeTextChanged", y.data) : E.send?.(y)) : e.setText?.(g), x?.offerFreeTextCommit?.(e);
      }
    }, h = new Set(t.heldKey ? [t.heldKey] : []);
    l.addEventListener("keydown", (f) => {
      if (f.stopPropagation(), f.repeat && !h.has(f.key)) {
        f.preventDefault();
        return;
      }
      h.add(f.key), f.key === "Enter" && !f.shiftKey ? (f.preventDefault(), d(!0, !0)) : f.key === "Escape" && (f.preventDefault(), d(!1, !0));
    }), l.addEventListener("keyup", (f) => h.delete(f.key)), l.addEventListener("blur", () => d(!0));
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
          const m = (p.textContent || "").length;
          f.setStart(p, Math.min(t.selection.start, m)), f.setEnd(p, Math.min(Math.max(t.selection.end, t.selection.start), m));
        } else (t.selection || t.caret === "end") && f.collapse(!1);
        const g = window.getSelection();
        g?.removeAllRanges(), g?.addRange(f);
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
    t !== void 0 && (this.node.options.text = t), e !== void 0 && (this.node.options.fontSize = e), i !== void 0 && (this.node.options.fontColor = i), o !== void 0 && (this.node.options.textOpacity = o), r !== void 0 && (this.node.options.textXAlign = r), a !== void 0 && (this.node.options.textYAlign = a), s !== void 0 && s !== this.node.options.fontFamily && (this.node.options.fontFamily = s, await js(s)), this.applyText();
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
    }), typeof this.node.centerText == "function" && this.node.centerText(), this.node.slate?.options?.autoResizeNodesBasedOnText && this.autoResize();
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
class Wo {
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
function Vo(n, t, e = !1, s = !1) {
  if (!t) return;
  t._id && (n.options.themeId = t._id), e && (n.options.syncWithTheme = !0), t.containerStyle && Object.keys(t.containerStyle).length > 0 && (n.options.containerStyle = { ...t.containerStyle }, n.applyContainerStyle?.()), t.defaultLineColor && (n.options.defaultLineColor = t.defaultLineColor, (n.freeNodes?.() ?? n.nodes?.allNodes)?.forEach((r) => {
    r.relationships?.updateAssociationsWith?.({
      lineColor: t.defaultLineColor
    });
  }));
  const i = n.freeNodes?.() ?? n.nodes.allNodes;
  if (!i || i.length === 0 || !t.styles) return;
  const o = Oh(n, i);
  i.forEach((r, a) => {
    const c = o ? o.get(r.options.id) ?? 0 : a, l = Xs(t, c);
    l && Rh(r, l);
  }), console.log("THEME_DEBUG: Applied theme", t.name || t._id);
}
function Oh(n, t) {
  if (!n?.options?.mindMapMode) return null;
  const e = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map();
  let i = !1;
  for (const a of t) {
    const c = a.relationships?.assocMap, l = c ? Array.from(c.values()).map((d) => d.childId || d.child?.id).filter(Boolean) : [];
    l.length && (i = !0), s.set(a.options.id, l), l.forEach((d) => e.add(d));
  }
  if (!i) return null;
  const o = /* @__PURE__ */ new Map(), r = [];
  for (const a of t)
    e.has(a.options.id) || r.push([a.options.id, 0]);
  for (; r.length; ) {
    const [a, c] = r.shift();
    if (!o.has(a)) {
      o.set(a, c);
      for (const l of s.get(a) || []) r.push([l, c + 1]);
    }
  }
  for (const a of t)
    o.has(a.options.id) || o.set(a.options.id, 0);
  return o;
}
function Xs(n, t) {
  if (!n.styles) return null;
  if (t === 0 && n.styles.parent)
    return n.styles.parent;
  const e = Object.keys(n.styles).filter(
    (o) => o.startsWith("child_")
  );
  if (e.length === 0)
    return n.styles.parent || null;
  const i = `child_${(t - 1) % e.length + 1}`;
  return n.styles[i] || n.styles.parent || null;
}
function Rh(n, t) {
  const e = t, s = t.backgroundColor ?? e.nodeColor, i = t.fontColor ?? e.foregroundColor, o = [
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
  for (const c of o)
    Object.prototype.hasOwnProperty.call(t, c) && (n.options[c] = t[c]);
  if (s && (n.options.backgroundColor = s), i && (n.options.fontColor = i), !!(t.vectorPath || t.shape)) {
    n.filters?.removeAll?.(), n.images?.clear?.();
    const c = t.shape || t.vectorPath;
    n.setShape?.(c, t.vectorPath);
  }
  n.setColors?.(s, t.borderColor), n.applyBorder?.(), n.applyOpacity?.(), (i || t.fontSize !== void 0 || t.fontFamily || t.textOpacity !== void 0 || t.fontStyle) && n.applyTextStyle?.(), Object.prototype.hasOwnProperty.call(t, "image") && (t.image ? n.images?.set?.(t.image) : n.images?.clear?.()), t.filters && (n.filters?.removeAll?.(), n.options.filters = {}, t.filters.vect && n.filters?.apply?.(t.filters.vect, "vect"), t.filters.text && n.filters?.apply?.(t.filters.text, "text"));
  const a = {};
  for (const c of [
    "lineColor",
    "lineOpacity",
    "lineEffect",
    "lineWidth"
  ])
    Object.prototype.hasOwnProperty.call(t, c) && (a[c] = t[c]);
  Object.keys(a).length && n.relationships?.updateAssociationsWith?.(a);
}
const Ph = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  applyTheme: Vo,
  buildNodeStyleFromTheme: Xs
}, Symbol.toStringTag, { value: "Module" })), Pe = 2 * Math.PI;
function pt(n, t) {
  return { x: n, y: t };
}
function Rt(n, t, e) {
  return pt(n.x + (t.x - n.x) * e, n.y + (t.y - n.y) * e);
}
function Ie(n, t, e, s) {
  return { kind: "cubic", start: n, first: t, second: e, end: s };
}
function Ne(n, t) {
  return Ie(n, n, t, t);
}
function Ih(n, t, e, s, i, o, r) {
  if (e = Math.abs(e), s = Math.abs(s), !e || !s || n.x === t.x && n.y === t.y) return Ne(n, t);
  const a = i * Math.PI / 180, c = Math.cos(a), l = Math.sin(a), d = (n.x - t.x) / 2, h = (n.y - t.y) / 2;
  let u = (c * d + l * h) / e, f = (-l * d + c * h) / s;
  const p = Math.max(1, Math.hypot(u, f));
  e *= p, s *= p, u /= p, f /= p;
  const g = u * u + f * f, m = (o === r ? -1 : 1) * Math.sqrt(Math.max(0, (1 - g) / g)), b = m * f, y = -m * u, x = pt(e * c, e * l), E = pt(-s * l, s * c), v = pt(
    (n.x + t.x) / 2 + b * x.x + y * E.x,
    (n.y + t.y) / 2 + b * x.y + y * E.y
  ), w = Math.atan2(f - y, u - b);
  let _ = Math.atan2(-f - y, -u - b) - w;
  return r && _ < 0 && (_ += Pe), !r && _ > 0 && (_ -= Pe), { kind: "arc", start: n, end: t, center: v, axisX: x, axisY: E, angle: w, sweep: _ };
}
function Ko(n) {
  const t = [];
  let e = pt(0, 0), s = e, i, o;
  for (const r of new Xt(n)) {
    const a = r[0], c = r.slice(1), l = (u) => pt(c[u], c[u + 1]);
    let d, h;
    switch (a) {
      case "M":
        s = l(0), d = { kind: "move", end: s };
        break;
      case "H":
        d = Ne(e, pt(c[0], e.y));
        break;
      case "V":
        d = Ne(e, pt(e.x, c[0]));
        break;
      case "L":
        d = Ne(e, l(0));
        break;
      case "Z":
        d = Ne(e, s);
        break;
      case "C":
        d = Ie(e, l(0), l(2), l(4));
        break;
      case "S":
        d = Ie(e, i ? Rt(i, e, 2) : e, l(0), l(2));
        break;
      case "Q":
      case "T": {
        const u = l(a === "Q" ? 2 : 0);
        h = a === "Q" ? l(0) : o ? Rt(o, e, 2) : e, d = Ie(e, Rt(e, h, 2 / 3), Rt(u, h, 2 / 3), u);
        break;
      }
      case "A":
        d = Ih(e, l(5), c[0], c[1], c[2], c[3], c[4]);
        break;
      default:
        continue;
    }
    t.push(d), i = a === "C" || a === "S" ? d.second : void 0, o = h, e = d.end;
  }
  return t;
}
function Jo(n, t) {
  return pt(
    n.center.x + n.axisX.x * Math.cos(t) + n.axisY.x * Math.sin(t),
    n.center.y + n.axisX.y * Math.cos(t) + n.axisY.y * Math.sin(t)
  );
}
function bi(n, t) {
  return pt(
    -n.axisX.x * Math.sin(t) + n.axisY.x * Math.cos(t),
    -n.axisX.y * Math.sin(t) + n.axisY.y * Math.cos(t)
  );
}
function Dh(n, t, e, s) {
  const i = -n + 3 * t - 3 * e + s, o = 2 * (n - 2 * t + e), r = t - n;
  if (Math.abs(i) < Number.EPSILON * Math.max(1, Math.abs(o), Math.abs(r))) return o ? [-r / o] : [];
  const a = o * o - 4 * i * r;
  if (a < 0) return [];
  const c = Math.sqrt(a);
  return [(-o - c) / (2 * i), (-o + c) / (2 * i)];
}
function Lh(n, t) {
  const e = Rt(n.start, n.first, t), s = Rt(n.first, n.second, t), i = Rt(n.second, n.end, t);
  return Rt(Rt(e, s, t), Rt(s, i, t), t);
}
function Qo(n) {
  let t = 1 / 0, e = 1 / 0, s = -1 / 0, i = -1 / 0;
  function o(r) {
    t = Math.min(t, r.x), s = Math.max(s, r.x), e = Math.min(e, r.y), i = Math.max(i, r.y);
  }
  n.length || o(pt(0, 0));
  for (const r of n)
    if (o(r.end), r.kind !== "move") {
      o(r.start);
      for (const a of ["x", "y"])
        if (r.kind === "cubic")
          for (const c of Dh(r.start[a], r.first[a], r.second[a], r.end[a]))
            c > 0 && c < 1 && o(Lh(r, c));
        else {
          const c = Math.atan2(r.axisY[a], r.axisX[a]);
          for (const l of [c, c + Math.PI])
            (Math.sign(r.sweep) * (l - r.angle) % Pe + Pe) % Pe <= Math.abs(r.sweep) && o(Jo(r, l));
        }
    }
  return { x: t, y: e, x2: s, y2: i, width: s - t, height: i - e, cx: (t + s) / 2, cy: (e + i) / 2 };
}
function zh(n) {
  return Qo(Ko(n));
}
function Gh(n, t) {
  const e = new G();
  for (const [, s, i] of n.matchAll(/([trsm])([^trsm]*)/gi)) {
    const o = (i.match(/[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/gi) || []).map(Number), [r, a, c, l, d, h] = o;
    let u = new G();
    switch (s.toLowerCase()) {
      case "t":
        o.length === 2 && (u = u.translate(r, a));
        break;
      case "m":
        o.length === 6 && (u = new G(r, a, c, l, d, h));
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
function Bh(n) {
  const t = Math.max(1, Math.ceil(Math.abs(n.sweep) / (Math.PI / 4))), e = n.sweep / t, s = 4 / 3 * Math.tan(e / 4);
  let i = n.start;
  return Array.from({ length: t }, (o, r) => {
    const a = n.angle + r * e, c = a + e, l = r === t - 1 ? n.end : Jo(n, c), d = bi(n, a), h = bi(n, c), u = Ie(
      i,
      pt(i.x + s * d.x, i.y + s * d.y),
      pt(l.x - s * h.x, l.y - s * h.y),
      l
    );
    return i = l, u;
  });
}
function Hh(n, t) {
  const e = Ko(n), s = Qo(e), i = Gh(t, pt(s.cx, s.cy)), o = (r) => new Q(r.x, r.y).transform(i).toArray().join(",");
  return e.map((r) => r.kind === "move" ? "M" + o(r.end) : (r.kind === "arc" ? Bh(r) : [r]).map((c) => "C" + [c.first, c.second, c.end].map(o).join(",")).join("")).join("");
}
function se(n = 10) {
  const t = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let e = "";
  for (let s = 0; s < n; s++)
    e += t.charAt(Math.floor(Math.random() * t.length));
  return e;
}
function qs(n) {
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
    const l = s(a), d = s(c);
    return (Math.max(l, d) + 0.05) / (Math.min(l, d) + 0.05);
  }
  const o = i(n || "#fff", "#ffffff"), r = i(n || "#fff", "#000000");
  return o > r ? "#ffffff" : "#000000";
}
function Fh(n, t = "normal 10pt Arial") {
  const e = String(n).split(`
`), s = t.split(" "), i = "normal", o = s?.[0]?.includes("pt") ? parseFloat(s?.[0]?.replace(/pt/gi, "")) : 10, r = s?.slice(1).join(" ").trim();
  if (typeof document > "u")
    return {
      width: Math.max(...e.map((h) => h.length)) * o * 0.6,
      height: e.length * o * 1.4 + 10
    };
  const a = document.createElement("canvas"), c = [], l = 0.98;
  if (e.forEach((h) => {
    const u = a.getContext("2d");
    if (!u) return;
    const f = o * l;
    u.font = `${i} ${f}pt ${r}`, c.push(u.measureText(h));
  }), a.remove(), c.length === 0)
    return {
      width: Math.max(...e.map((h) => h.length)) * o * 0.6,
      height: e.length * o * 1.4 + 10
    };
  let d = 0;
  return c.forEach((h) => {
    d += (h.actualBoundingBoxAscent || o) + (h.actualBoundingBoxDescent || o * 0.3) + 5;
  }), {
    width: Math.max(...c.map((h) => h.width)),
    height: d + 10
  };
}
function tr(n, t) {
  const e = (o) => {
    const r = (o || "").replace("#", "");
    if (r.length < 6) return 0;
    const a = (h) => {
      const u = h / 255;
      return u <= 0.03928 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4);
    }, c = a(parseInt(r.substr(0, 2), 16) || 0), l = a(parseInt(r.substr(2, 2), 16) || 0), d = a(parseInt(r.substr(4, 2), 16) || 0);
    return 0.2126 * c + 0.7152 * l + 0.0722 * d;
  }, s = e(n), i = e(t);
  return (Math.max(s, i) + 0.05) / (Math.min(s, i) + 0.05);
}
function $h(n) {
  return n?.path ? zh(n.path) : { x: 0, y: 0, x2: 100, y2: 100, width: 100, height: 100, cx: 50, cy: 50 };
}
function Uh(n, t) {
  return Hh(n, t);
}
function Yh(n, t) {
  const e = String(n).split(/ /g), i = String(n).split("").length / t, o = [];
  let r = [], a = 0;
  return e.forEach((c) => {
    a += c.length, a < i || o.length === t - 1 ? r.push(c) : (o.push(r.join(" ")), a = c.length, r = [c]);
  }), r.length > 0 && o.push(r.join(" ")), o.join(`
`);
}
function jh(n, t) {
  return Math.floor(Math.random() * (t - n + 1)) + n;
}
function Xh(n, t, e, s, i = !0) {
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
function qh(n) {
  return Xs(n.theme, n.childNumber);
}
function Zh(n) {
  return n.replace(/[^a-zA-Z0-9\s-]/g, "").replace(/\s+/g, "-").toLowerCase();
}
function Wh(n) {
  return n instanceof HTMLElement || n instanceof SVGElement;
}
function Vh(n) {
  return typeof document > "u" ? null : document.getElementById(n);
}
function Kh() {
  return typeof navigator > "u" ? !1 : /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
function Jh() {
  return typeof navigator > "u" ? !1 : /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}
function Qh(n) {
  n && (n.preventDefault(), n.stopPropagation());
}
function td(n, t) {
  const e = [];
  for (let s = 0; s < n.length; s += t)
    e.push(n.slice(s, s + t));
  return e;
}
const ed = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  _transformPath: Uh,
  buildNodeStyleFromTheme: qh,
  chunk: td,
  contrastRatio: tr,
  createMultiLineText: Yh,
  el: Vh,
  getBBox: $h,
  getTextWidth: Fh,
  guid: se,
  isElement: Wh,
  isMobile: Jh,
  isSafari: Kh,
  obtainProportionateWidthAndHeightForResizing: Xh,
  randomInt: jh,
  safeForUrls: Zh,
  stopEvent: Qh,
  whiteOrBlack: qs
}, Symbol.toStringTag, { value: "Module" })), Vt = "0.6s cubic-bezier(0.4, 0, 0.2, 1) both", On = {
  mystery: {
    id: "sb-mystery",
    types: ["text", "vect"],
    display: "Mystery",
    description: "Gentle fade in with a subtle zoom",
    css: `.sb-animation-mystery{animation:sb-mystery ${Vt}}@keyframes sb-mystery{0%{opacity:0;transform:scale(1.2)}50%{opacity:.5;transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}`
  },
  fadeSlideUp: {
    id: "sb-fade-slide-up",
    types: ["text", "vect"],
    display: "Fade up",
    description: "Smooth upward entrance",
    css: `.sb-animation-fadeSlideUp{animation:sb-fade-slide-up ${Vt}}@keyframes sb-fade-slide-up{0%{opacity:0;transform:translateY(100%) rotateX(40deg)}100%{opacity:1;transform:translateY(0) rotateX(0)}}`
  },
  fadeSlideDown: {
    id: "sb-fade-slide-down",
    types: ["text", "vect"],
    display: "Fade down",
    description: "Smooth downward entrance",
    css: `.sb-animation-fadeSlideDown{animation:sb-fade-slide-down ${Vt}}@keyframes sb-fade-slide-down{0%{opacity:0;transform:translateY(-100%) rotateX(-40deg)}100%{opacity:1;transform:translateY(0) rotateX(0)}}`
  },
  bumpUpIn: {
    id: "sb-bump-up-in",
    types: ["text", "vect"],
    display: "Bump up",
    description: "Playful bounce from below",
    css: `.sb-animation-bumpUpIn{animation:sb-bump-up-in ${Vt}}@keyframes sb-bump-up-in{0%{opacity:0;transform:scale(.8) rotate(-3deg) translateY(100%)}55%{opacity:.8;transform:scale(1.1) rotate(2deg) translateY(-20%)}100%{opacity:1;transform:scale(1) translateY(0)}}`
  },
  bumpDownIn: {
    id: "sb-bump-down-in",
    types: ["text", "vect"],
    display: "Bump down",
    description: "Playful bounce from above",
    css: `.sb-animation-bumpDownIn{animation:sb-bump-down-in ${Vt}}@keyframes sb-bump-down-in{0%{opacity:0;transform:scale(.8) rotate(3deg) translateY(-100%)}55%{opacity:.8;transform:scale(1.1) rotate(-2deg) translateY(20%)}100%{opacity:1;transform:scale(1) translateY(0)}}`
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
    css: `.sb-animation-smoke{animation:sb-smoke ${Vt}}@keyframes sb-smoke{0%{opacity:0;transform:scale(1.5) rotate(5deg);filter:blur(10px)}55%{opacity:.75;transform:scale(1.1) rotate(-2deg);filter:blur(3px)}100%{opacity:1;transform:scale(1);filter:blur(0)}}`
  },
  fractured: {
    id: "sb-fractured",
    types: ["text", "vect"],
    display: "Fractured",
    description: "Sharp geometric reveal",
    css: `.sb-animation-fractured{animation:sb-fractured ${Vt}}@keyframes sb-fractured{0%{opacity:0;clip-path:polygon(50% 50%,50% 50%,50% 50%);transform:rotate(45deg) scale(.3)}55%{opacity:.7;clip-path:polygon(10% 0,90% 0,100% 100%,0 100%);transform:rotate(-8deg) scale(1.1)}100%{opacity:1;clip-path:polygon(0 0,100% 0,100% 100%,0 100%);transform:rotate(0) scale(1)}}`
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
}, nd = ".sb-node-animation{transform-box:fill-box;transform-origin:center}";
function Zs() {
  return { ...On };
}
function er(n) {
  return `sb-animation-${n}`;
}
function sd(n) {
  const e = n?.root?.()?.defs?.();
  if (!e || e.findOne?.("#sb-node-animation-styles")) return;
  const s = e.element("style").id("sb-node-animation-styles");
  s.attr("type", "text/css"), s.node.textContent = nd + Object.values(On).map((i) => i.css).join("");
}
function id(n, t) {
  if (!n || !On[t]) return !1;
  sd(n), nr(n);
  const e = n.node;
  return e && (e.getBBox?.(), e.classList.add("sb-node-animation", er(t))), !0;
}
function nr(n) {
  const t = n?.node;
  if (t) {
    for (const e of Object.keys(On)) t.classList.remove(er(e));
    t.classList.remove("sb-node-animation");
  }
}
const St = /* @__PURE__ */ new Map();
St.set("dropShadow", {
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
St.set("blur", {
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
St.set("outline", {
  name: "outline",
  types: ["text", "vect"],
  apply: (n) => {
    try {
      const t = n.attr("stroke"), e = n.attr("stroke-width");
      n.data("original-stroke", t || "#333"), n.data("original-stroke-width", e || 2);
      const s = n.attr("fill"), i = typeof s == "string" && /^#[0-9a-fA-F]{3,6}$/.test(s) ? qs(s) : "#ffffff";
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
St.set("postItNote", {
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
St.set("pencil", {
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
class sr {
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
    const s = St.get(t);
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
    const e = St.get(t);
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
    return id(s, t) ? (this.node.options.animations || (this.node.options.animations = {}), this.node.options.animations[e] = t, !0) : !1;
  }
  /** Clear the animation from a node element without affecting filter effects. */
  removeAnimation(t) {
    const e = t === "text" ? this.node.textElement : this.node.backgroundRect;
    nr(e), this.node.options.animations && (this.node.options.animations[t] = void 0);
  }
  /**
   * Toggle filter visibility (hide/show without removing).
   */
  toggleVisibility(t) {
    if (this.hidden = t, t)
      for (const e of this.activeFilters) {
        const s = St.get(e);
        s && (this.node.backgroundRect && s.remove(this.node.backgroundRect), this.node.textElement && s.remove(this.node.textElement));
      }
    else
      for (const e of this.activeFilters) {
        const s = St.get(e);
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
function Nu(n) {
  St.set(n.name, n);
}
function Ou() {
  return Array.from(St.keys());
}
function ir() {
  const n = {};
  for (const [t, e] of St)
    n[t] = { types: e.types || ["text", "vect"] };
  return n;
}
class or {
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
const it = /* @__PURE__ */ new Map();
it.set("rectangle", {
  path: "M 0 0 H 100 V 60 H 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
it.set("roundedrectangle", {
  path: "M 10 0 H 90 Q 100 0 100 10 V 50 Q 100 60 90 60 H 10 Q 0 60 0 50 V 10 Q 0 0 10 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  hasRounding: !0,
  viewBox: "0 0 100 60"
});
it.set("ellipse", {
  path: "M 50 0 A 50 30 0 1 1 50 60 A 50 30 0 1 1 50 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
it.set("circle", {
  path: "M 50 0 A 50 50 0 1 1 50 100 A 50 50 0 1 1 50 0 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
it.set("star", {
  path: "M 50 0 L 61.8 38.2 L 100 38.2 L 69.1 61.8 L 80.9 100 L 50 76.4 L 19.1 100 L 30.9 61.8 L 0 38.2 L 38.2 38.2 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
it.set("triangle", {
  path: "M 50 0 L 100 87 L 0 87 Z",
  defaultWidth: 100,
  defaultHeight: 87,
  viewBox: "0 0 100 87"
});
it.set("pentagon", {
  path: "M 50 0 L 97.6 34.5 L 79.4 90.5 L 20.6 90.5 L 2.4 34.5 Z",
  defaultWidth: 100,
  defaultHeight: 95,
  viewBox: "0 0 100 95"
});
it.set("hexagon", {
  path: "M 25 0 L 75 0 L 100 43.3 L 75 86.6 L 25 86.6 L 0 43.3 Z",
  defaultWidth: 100,
  defaultHeight: 87,
  viewBox: "0 0 100 87"
});
it.set("octagon", {
  path: "M 29.3 0 L 70.7 0 L 100 29.3 L 100 70.7 L 70.7 100 L 29.3 100 L 0 70.7 L 0 29.3 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
it.set("trapezium", {
  path: "M 20 0 L 80 0 L 100 60 L 0 60 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
it.set("parallelogram", {
  path: "M 20 0 L 100 0 L 80 60 L 0 60 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
it.set("rarrow", {
  path: "M 0 15 L 70 15 L 70 0 L 100 30 L 70 60 L 70 45 L 0 45 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
it.set("larrow", {
  path: "M 100 15 L 30 15 L 30 0 L 0 30 L 30 60 L 30 45 L 100 45 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
it.set("diamond", {
  path: "M 50 0 L 100 50 L 50 100 L 0 50 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
it.set("stickynote", {
  path: "M1 1l18 0.1l-0.1 17.8s-15.5 0.4-17.6-1c-0.4-2.1-0.3-16.9-0.3-16.9z",
  defaultWidth: 108,
  defaultHeight: 108,
  viewBox: "1 1 18 18"
});
function ms(n) {
  return it.get(n.toLowerCase());
}
function od(n) {
  return it.has(n.toLowerCase());
}
function rd(n, t) {
  it.set(n.toLowerCase(), t);
}
function rr() {
  return Array.from(it.keys());
}
function ad(n) {
  return ["rectangle", "circle", "ellipse"].includes(n.toLowerCase());
}
function ar(n, t) {
  if (t) {
    const e = ms(t);
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
    const e = ms(n);
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
const cd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getShape: ms,
  getShapeNames: rr,
  hasShape: od,
  isNativeShape: ad,
  registerShape: rd,
  resolveShapePath: ar
}, Symbol.toStringTag, { value: "Module" }));
function re(n) {
  const t = { ...n };
  return n.xPos !== void 0 && t.x === void 0 && (t.x = n.xPos, delete t.xPos), n.yPos !== void 0 && t.y === void 0 && (t.y = n.yPos, delete t.yPos), n.foregroundColor !== void 0 && t.fontColor === void 0 && (t.fontColor = n.foregroundColor, delete t.foregroundColor), n.shapeHint !== void 0 && t.shape === void 0 && (t.shape = ld(n.shapeHint), delete t.shapeHint), n.svgString !== void 0 && t.svgContent === void 0 && (t.svgContent = n.svgString, delete t.svgString), n.blnStraight !== void 0 && (t.isStraightLine = n.blnStraight, delete t.blnStraight), Ws(t), t;
}
function cr(n) {
  if (!n || typeof n != "object") return !1;
  const t = n;
  return t.width !== void 0 || t.height !== void 0;
}
function Ws(n) {
  return n && cr(n.textOffset) && (n.textOffset = { x: 0, y: 0 }), n;
}
function rt(n) {
  const t = { ...n };
  return t.xPos = n.x, t.yPos = n.y, t.foregroundColor = n.fontColor, n.shape && (t.shapeHint = n.shape), n.svgContent && (t.svgString = n.svgContent), t;
}
function Vs(n) {
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
function lr(n) {
  return { ...n };
}
function Ks(n) {
  return {
    id: n.id || `${n.parentId}->${n.childId}`,
    childId: n.childId,
    parentId: n.parentId,
    isStraightLine: n.isStraightLine ?? n.blnStraight ?? !1,
    lineColor: n.lineColor || "#666666",
    lineEffect: n.lineEffect || "",
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
    label: n.label ?? ""
  };
}
function Js(n) {
  return {
    // Persist the association id so parallel edges (`A->B~2`) survive a save/reload
    // round-trip instead of collapsing back onto the canonical `A->B` and deduping.
    id: n.id,
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
    targetAnchor: n.targetAnchor ?? null,
    label: n.label ?? ""
  };
}
function ld(n) {
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
function hd(n) {
  const t = {
    options: Vs(n.options || {}),
    nodes: [],
    shareId: n.shareId || ""
  };
  return Array.isArray(n.nodes) && (t.nodes = n.nodes.map((e) => {
    const s = re(e.options || {}), i = { associations: [] };
    return e.relationships?.associations && (i.associations = e.relationships.associations.map(
      (o) => Ks(o)
    )), {
      options: s,
      relationships: i
    };
  })), t;
}
function dd(n) {
  const t = {
    options: lr(n.options || {}),
    nodes: [],
    shareId: n.shareId || ""
  };
  return Array.isArray(n.nodes) && (t.nodes = n.nodes.map((e) => {
    const s = rt(e.options || {}), i = { associations: [] };
    return e.relationships?.associations && (i.associations = e.relationships.associations.map(
      (o) => Js(o)
    )), {
      options: s,
      relationships: i
    };
  })), t;
}
const ud = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  convertV1JsonToV2: hd,
  convertV2JsonToV1: dd,
  isLegacyTextOffset: cr,
  normalizeLegacyTextOffset: Ws,
  v1AssociationToV2: Ks,
  v1NodeToV2: re,
  v1SlateToV2: Vs,
  v2AssociationToV1: Js,
  v2NodeToV1: rt,
  v2SlateToV1: lr
}, Symbol.toStringTag, { value: "Module" })), vi = Object.freeze({
  canMove: !0,
  canResize: !0,
  canRotate: !0,
  canDelete: !0,
  canDuplicate: !0,
  canConnect: !0,
  canEditText: !0,
  canSelect: !0,
  persist: !0
}), wi = Object.freeze({
  canMove: !0,
  canResize: !1,
  canRotate: !1,
  canDelete: !1,
  canDuplicate: !1,
  canConnect: !1,
  canEditText: !1,
  canSelect: !0,
  persist: !1
});
function Un() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
function fd(n, t) {
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
        capabilities: s === !0 ? wi : { ...wi, ...s }
      };
  }
  return null;
}
function pd(n, t, e = 0) {
  let s = null;
  for (const i of t) {
    const o = i?.options;
    if (!o) continue;
    const r = o.width || 0, a = o.height || 0, c = (o.x || 0) + r / 2, l = (o.y || 0) + a / 2;
    let d = n.x - c, h = n.y - l;
    const u = o.rotate?.rotationAngle || 0;
    if (u) {
      const f = -u * Math.PI / 180, p = d * Math.cos(f) - h * Math.sin(f), g = d * Math.sin(f) + h * Math.cos(f);
      d = p, h = g;
    }
    Math.abs(d) > r / 2 + e || Math.abs(h) > a / 2 + e || (!s || gd(i, s)) && (s = i);
  }
  return s;
}
function gd(n, t) {
  const e = n.svgGroup?.node, s = t.svgGroup?.node;
  return !e || !s || typeof s.compareDocumentPosition != "function" ? !0 : (s.compareDocumentPosition(e) & 4) !== 0;
}
const le = Object.freeze({
  fontSize: 14,
  fontFamily: "Arial, sans-serif",
  fontColor: "#000000",
  borderColor: "#cccccc",
  borderWidth: 1,
  backgroundColor: "#f0f0f0"
}), md = Object.freeze({
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
    shape: "stickynote",
    width: 108,
    height: 108,
    style: Object.freeze({ borderOpacity: 0, effect: "postItNote" })
  })
}), yd = 4, bd = 56, vd = 900, nn = ["top", "right", "bottom", "left"], wd = {
  top: "Add connected note above",
  right: "Add connected note to the right",
  bottom: "Add connected note below",
  left: "Add connected note to the left"
};
function xd(n, t, e = 8) {
  const { x: s, y: i, width: o, height: r } = n, a = [s, s + o / 2, s + o], c = [i, i + r / 2, i + r];
  let l = s, d = i, h = e, u = e;
  for (const f of t) {
    const p = [f.x, f.x + f.width / 2, f.x + f.width], g = [f.y, f.y + f.height / 2, f.y + f.height];
    for (const m of a)
      for (const b of p) {
        const y = Math.abs(m - b);
        y < h && (h = y, l = s + (b - m));
      }
    for (const m of c)
      for (const b of g) {
        const y = Math.abs(m - b);
        y < u && (u = y, d = i + (b - m));
      }
  }
  return { x: l, y: d };
}
class Rn {
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
      fontSize: le.fontSize,
      fontFamily: le.fontFamily,
      fontColor: le.fontColor,
      textOpacity: 1,
      textXAlign: "center",
      textYAlign: "middle",
      backgroundColor: le.backgroundColor,
      borderColor: le.borderColor,
      borderWidth: le.borderWidth,
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
    }, this.ready = new Promise((s, i) => {
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
      const s = this.options.width, i = this.options.height, o = this.backgroundRect.x?.() ?? 0, r = this.backgroundRect.y?.() ?? 0;
      this.nestedSvg = this.svgGroup.nested().size(s, i).move(o, r), this.nestedSvg.svg(this.options.svgContent), this._svgViewboxTimeoutId = setTimeout(() => {
        if (this._destroyed || !this.nestedSvg) return;
        const a = this.nestedSvg.children()[0];
        if (a) {
          let c = a.bbox();
          console.log("NODE_DEBUG: Delayed bbox:", c, "Node size:", s, i), (c.width <= 0 || c.height <= 0) && (c = this.calculatePathBounds(this.options.svgContent, s, i), console.log("NODE_DEBUG: Calculated bounds:", c)), c.width > 0 && c.height > 0 ? (this.nestedSvg.viewbox(c.x, c.y, c.width, c.height), this.nestedSvg.node.setAttribute("preserveAspectRatio", "none"), console.log(
            `NODE_DEBUG: Set viewbox(${c.x}, ${c.y}, ${c.width}, ${c.height}) with preserveAspectRatio="none"`
          )) : (console.log("NODE_DEBUG: Invalid bounds, trying default viewbox approach"), this.nestedSvg.viewbox(0, 0, 24, 24), this.nestedSvg.node.setAttribute("preserveAspectRatio", "none"));
        }
      }, 10);
    }
    const e = { ...this.options.resizeRotate };
    this.options.shape === "circle" && (e.preserveAspectRatio = !0), this.resizeRotate = new Yo(this, e), this.connector = new Nn(this, this.options.connector), this.relationships = new jo(this), this.images = new Xo(this), this.editor = new Zo(this), this.links = new Wo(this), this.filters = new sr(this), this.menu = new or(this), this.options.image && this.images.set(
      this.options.image,
      this.options.imageOrigWidth,
      this.options.imageOrigHeight
    ), this.options.filters?.vect && this.filters.apply(this.options.filters.vect, "vect"), this.options.filters?.text && this.filters.apply(this.options.filters.text, "text"), this.options.animations?.vect && this.filters.applyAnimation(this.options.animations.vect, "vect"), this.options.animations?.text && this.filters.applyAnimation(this.options.animations.text, "text"), this.options.allowDrag && !this.options.isLocked && this.makeDraggable(), this.setupSelectionBehavior(), typeof this.options.customRender == "function" && this.options.customRender(this.svgGroup, this.options), t || this.centerTextInitial(), this.options.rotate?.rotationAngle && this.applyPositionAndRotation(), console.log("NODE_DEBUG: finishCreate continuing for", this.id), this.svgGroup.node.setAttribute("aria-label", this.options.text || "Unnamed node");
    try {
      this.slate.markersContainer?.front?.();
    } catch {
    }
    this.updateLinkIndicator(), this.applyGovernance(), this._resolveReady();
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
      const d = document.createElementNS("http://www.w3.org/2000/svg", "text");
      d.setAttribute("x", String(o)), d.setAttribute("y", String(r)), d.setAttribute("text-anchor", "middle"), d.setAttribute("dominant-baseline", "central"), d.setAttribute("font-family", "sans-serif"), d.setAttribute("font-size", "15"), d.setAttribute("font-weight", "bold"), d.setAttribute("fill", "#fff"), d.setAttribute("pointer-events", "none"), d.textContent = "↗", c.node.appendChild(d);
      let h = 0;
      const u = (f) => {
        f.stopPropagation(), f.preventDefault?.();
        const p = typeof performance < "u" ? performance.now() : Date.now();
        p - h < 350 || (h = p, this.links?.navigate());
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
      opacity: d
    } = this.options, h = { color: i, width: o }, u = this.borderDashArray();
    u !== "none" && (h.dasharray = u), a !== void 0 && (h.opacity = a);
    const f = ar(c, l);
    if (f) {
      const p = this.svgGroup.nested().size(t, e);
      String(l || c || "").toLowerCase() !== "circle" && p.node.setAttribute("preserveAspectRatio", "none");
      const m = p.path(f.path).fill(s).stroke(h);
      try {
        const b = m.bbox();
        b.width > 0 && b.height > 0 ? p.viewbox(b.x, b.y, b.width, b.height) : p.viewbox(f.viewBox);
      } catch {
        p.viewbox(f.viewBox);
      }
      d !== void 0 && m.opacity(d), this.backgroundRect = p, this.contentPath = m;
      try {
        m.node.setAttribute("data-node-background-path", "1"), this.options.svgContent || m.node.setAttribute("data-shape-path", "1");
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
          this.backgroundRect = this.svgGroup.circle(p * 2).fill(s).stroke(h);
          break;
        }
        case "ellipse":
          this.backgroundRect = this.svgGroup.ellipse(t, e).fill(s).stroke(h);
          break;
        default:
          this.backgroundRect = this.svgGroup.rect(t, e).fill(s).stroke(h).radius(4);
          break;
      }
      d !== void 0 && this.backgroundRect.opacity(d);
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
      this.backgroundRect?.remove?.();
    } catch {
    }
    this.backgroundRect = void 0, this.contentPath = void 0;
    try {
      this.resizeTarget?.remove?.();
    } catch {
    }
    this.resizeTarget = void 0, this.options.shape = t, this.options.vectorPath = e ?? t, this.createBackground();
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
      "font-style": o || null
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
    }), this.textElement.attr("font-style", i || null), this.options.text && this.textElement.text(this.wrapTextToWidth(this.options.text)), this.centerText();
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
    return xd(s, i);
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
  shapeTextInset() {
    const t = String(this.options.shape || "rectangle").toLowerCase();
    return t.includes("diamond") ? 0.6 : t.includes("triangle") ? 0.55 : t.includes("star") ? 0.5 : t.includes("ellipse") || t.includes("circle") ? 0.82 : 1;
  }
  wrapTextToWidth(t) {
    if (!t) return t;
    const e = Math.max(
      24,
      (this.options.width || 100) * this.shapeTextInset() - 14
    ), s = this.options.fontSize || 14, i = this.options.fontFamily || "sans-serif";
    let o = null;
    try {
      o = (this._measureCanvas || (this._measureCanvas = document.createElement("canvas"))).getContext("2d"), o && (o.font = `${s}px ${i}`);
    } catch {
      o = null;
    }
    const r = (c) => o ? o.measureText(c).width : c.length * s * 0.55, a = [];
    for (const c of String(t).split(`
`)) {
      const l = c.split(/\s+/).filter(Boolean);
      if (!l.length) {
        a.push("");
        continue;
      }
      let d = "";
      for (const h of l) {
        if (r(h) > e) {
          d && (a.push(d), d = "");
          let f = "";
          for (const p of h)
            f && r(f + p) > e ? (a.push(f), f = p) : f += p;
          d = f;
          continue;
        }
        const u = d ? `${d} ${h}` : h;
        d && r(u) > e ? (a.push(d), d = h) : d = u;
      }
      d && a.push(d);
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
    Ws(this.options);
    const { width: t, height: e, textXAlign: s, textYAlign: i, textOffset: o } = this.options, r = this.backgroundRect.x?.() ?? 0, a = this.backgroundRect.y?.() ?? 0;
    let c = r + t / 2 + (o?.x || 0), l = a + e / 2 + (o?.y || 0);
    switch (s) {
      case "left":
        c = r + 5 + (o?.x || 0), this.textElement.attr("text-anchor", "start");
        break;
      case "right":
        c = r + t - 5 + (o?.x || 0), this.textElement.attr("text-anchor", "end");
        break;
      default:
        this.textElement.attr("text-anchor", "middle");
        break;
    }
    switch (i) {
      case "top":
        l = a + 5 + (o?.y || 0), this.textElement.attr("dominant-baseline", "hanging");
        break;
      case "bottom":
        l = a + e - 5 + (o?.y || 0), this.textElement.attr("dominant-baseline", "auto");
        break;
      default:
        this.textElement.attr("dominant-baseline", "central");
        break;
    }
    const d = this.textElement.node.querySelectorAll?.("tspan")?.length || 1;
    if (d > 1 && i !== "top" && i !== "bottom") {
      const h = (this.options.fontSize || 14) * 1.3;
      l -= (d - 1) * h / 2;
    }
    this.textElement.attr({ x: c, y: l }), this.fitTextToNode();
  }
  /**
   * Shrink the rendered text to fit within the node bounds (Miro shape behavior).
   * Applies a uniform scale transform around the text's visual center; never grows
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
    const s = this.shapeTextInset(), i = (this.options.width || 0) * s - 12, o = (this.options.height || 0) * s - 10;
    if (i <= 0 || o <= 0) return;
    let r = Math.min(i / e.width, o / e.height);
    if (r >= 0.999) return;
    r = Math.max(r, 0.3);
    const a = e.x + e.width / 2, c = e.y + e.height / 2;
    try {
      t.attr(
        "transform",
        `translate(${a} ${c}) scale(${r.toFixed(
          4
        )}) translate(${-a} ${-c})`
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
        const h = this._governed, u = this.pointerFromDragEvent(t), f = u ? this.slate.clientToWorld(u) : h.last?.point ?? h.startWorld, p = {
          clientX: u?.x ?? h.last?.gesture.clientX ?? h.startClient.x,
          clientY: u?.y ?? h.last?.gesture.clientY ?? h.startClient.y,
          pointerType: h.pointerType
        };
        this.finishGovernedDrag(h, { point: f, gesture: p });
        return;
      }
      const e = this.pointerFromDragEvent(t);
      if (e && this._dragStartPointer && this.preDragPosition) {
        const h = this.slate.getZoom?.() || 1, u = (e.x - this._dragStartPointer.x) / h, f = (e.y - this._dragStartPointer.y) / h;
        this.options.x = this.preDragPosition.x + u, this.options.y = this.preDragPosition.y + f;
        let p = u, g = f;
        const m = this.slate.grid?.snapPoint?.(
          this.options.x,
          this.options.y
        );
        if (m && (this.options.x = m.x, this.options.y = m.y, p = m.x - this.preDragPosition.x, g = m.y - this.preDragPosition.y), this.slate.options.viewPort?.snapToObjects) {
          const b = this.snapToNeighbors(this.options.x, this.options.y);
          this.options.x = b.x, this.options.y = b.y, p = this.options.x - this.preDragPosition.x, g = this.options.y - this.preDragPosition.y;
        }
        for (const b of this._groupDragSiblings)
          b.node.options.x = b.x + p, b.node.options.y = b.y + g, b.node.applyPositionAndRotation();
      }
      const s = this._groupDragSiblings;
      if (this._groupDragSiblings = [], !s.length && this.preDragPosition && e) {
        const h = { ...this.preDragPosition }, f = Math.abs((this.options.x ?? 0) - h.x) > 0.5 || Math.abs((this.options.y ?? 0) - h.y) > 0.5 ? this.slate.offerFreeDrop?.(this, this.slate.clientToWorld(e), h) : null;
        if (f) {
          this.preDragTransform = null, this.preDragPosition = null, this._dragStartPointer = null, f === "refused" && this.position(h.x, h.y, void 0, void 0, Un() ? 0 : 180), this.isOnSlate() ? this.settleAfterDrag() : this.isDragging = !1;
          return;
        }
      }
      if (s.length && this.preDragPosition && e) {
        const h = { ...this.preDragPosition }, u = Math.abs((this.options.x ?? 0) - h.x) > 0.5 || Math.abs((this.options.y ?? 0) - h.y) > 0.5, f = [h, ...s.map((g) => ({ x: g.x, y: g.y }))], p = u ? this.slate.offerFreeGroupDrop?.([this, ...s.map((g) => g.node)], this.slate.clientToWorld(e), f) : null;
        if (p) {
          if (this.preDragTransform = null, this.preDragPosition = null, this._dragStartPointer = null, p === "refused") {
            const g = Un() ? 0 : 180;
            this.position(h.x, h.y, void 0, void 0, g);
            for (const m of s) m.node.isOnSlate() && m.node.position(m.x, m.y, void 0, void 0, g);
          }
          this.isOnSlate() ? this.settleAfterDrag() : this.isDragging = !1;
          return;
        }
      }
      const i = this.preDragPosition, o = 0.5, r = this.options.x ?? 0, a = this.options.y ?? 0, c = !i || Math.abs(r - i.x) > o || Math.abs(a - i.y) > o, l = s.some(
        (h) => Math.abs((h.node.options.x ?? 0) - h.x) > o || Math.abs((h.node.options.y ?? 0) - h.y) > o
      ), d = c || l;
      this.preDragTransform = null, this.preDragPosition = null, this._dragStartPointer = null, this.applyPositionAndRotation(), d && this.slate.broadcast?.("onNodesMove", {
        nodeOptions: [
          rt(this.options),
          ...s.map((h) => rt(h.node.options))
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
  settleAfterDrag(t = !1) {
    {
      const e = this.slate.getSelectedNodes().slice();
      this._dragEndTimeoutId = setTimeout(() => {
        if (this._destroyed || t && !this.isOnSlate()) return;
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
    ), s.canConnect ? t.removeAttribute("data-no-connect") : t.setAttribute("data-no-connect", "1"), s.canSelect ? (t.removeAttribute("aria-hidden"), t.setAttribute("tabindex", "0"), t.setAttribute("role", "button")) : (t.setAttribute("aria-hidden", "true"), t.removeAttribute("tabindex"), t.removeAttribute("role")), t.style && (t.style.cursor = s.canSelect ? s.canMove ? "grab" : "default" : "", t.style.pointerEvents = s.canSelect ? "" : "none"), s.canConnect || this.hideConnectionHandles();
  }
  /** The press that may become a governed drag. Nothing is asked of the policy yet. */
  beginGovernedDrag(t, e) {
    const s = e?.detail?.event ?? e, i = this.pointerFromDragEvent(e) ?? { x: 0, y: 0 }, o = typeof s?.type == "string" && s.type.indexOf("touch") === 0 ? "touch" : "mouse", r = (f) => this.cancelGovernedDrag(f), a = (f) => {
      f.key === "Escape" && this._governed?.started && (f.preventDefault(), f.stopPropagation(), r("escape"));
    }, c = () => r("pointercancel"), l = () => r("touchcancel"), d = () => r("blur"), h = (f) => {
      this._governed && this.moveGovernedDrag(this._governed, f);
    }, u = o === "touch" ? "touchmove" : "mousemove";
    window.addEventListener(u, h, !0), window.addEventListener("keydown", a, !0), window.addEventListener("blur", d), o === "touch" ? window.addEventListener("touchcancel", l, !0) : window.addEventListener("pointercancel", c, !0), this._governed = {
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
        window.removeEventListener(u, h, !0), window.removeEventListener("keydown", a, !0), window.removeEventListener("blur", d), window.removeEventListener("touchcancel", l, !0), window.removeEventListener("pointercancel", c, !0);
      }
    }, this.slate._governedDragNode = this;
  }
  moveGovernedDrag(t, e) {
    const s = this.pointerFromDragEvent(e);
    if (!s || t.refused) return;
    const i = { clientX: s.x, clientY: s.y, pointerType: t.pointerType };
    if (!t.started) {
      if (Math.hypot(s.x - t.startClient.x, s.y - t.startClient.y) < yd) return;
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
    const i = Math.max(s.left, 0), o = Math.max(s.top, 0), r = Math.min(s.right, window.innerWidth || s.right), a = Math.min(s.bottom, window.innerHeight || s.bottom), c = Math.min(bd, (r - i) / 4, (a - o) / 4);
    if (!(c > 0)) return { x: 0, y: 0 };
    const l = (u) => {
      if (u >= c) return 0;
      const f = Math.min(1, (c - u) / c);
      return f * f * vd;
    }, d = e.clientX - t.startClient.x, h = e.clientY - t.startClient.y;
    return {
      x: (d > 0 ? l(r - e.clientX) : 0) - (d < 0 ? l(e.clientX - i) : 0),
      y: (h > 0 ? l(a - e.clientY) : 0) - (h < 0 ? l(e.clientY - o) : 0)
    };
  }
  /**
   * While a governed note is held near an edge of the visible canvas, pan the canvas
   * toward that edge so the note can be carried to a place that started off screen.
   * The note stays under the pointer and the policy hears each step as a move.
   */
  panWhileHeldNearEdge(t) {
    if (t.pan || !t.started || !t.last || typeof requestAnimationFrame > "u") return;
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
      i || this._destroyed || (i = !0, this.isOnSlate() && (this.svgGroup?.node?.style && this._governanceApplied && (this.svgGroup.node.style.cursor = "grab"), this.settleAfterDrag(!0)));
    }, r = Un();
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
      tt(window, "mousemove.drag"), tt(window, "touchmove.drag"), tt(window, "mouseup.drag"), tt(window, "touchend.drag"), this.svgGroup.remember?.("_draggable")?.init(!0);
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
      const d = performance.now(), h = () => {
        if (this._destroyed || !this.svgGroup || l.cancelled) return;
        const u = Math.min(1, (performance.now() - d) / o), f = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
        this.options.x = r + (t - r) * f, this.options.y = a + (e - a) * f, this.applyPositionAndRotation(), u < 1 ? requestAnimationFrame(h) : (this.options.x = t, this.options.y = e, this.applyPositionAndRotation(), this._glide === l && (this._glide = null), s && s());
      };
      requestAnimationFrame(h);
    } else
      this.applyPositionAndRotation(), s && s();
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
    const l = e === "resolved" ? "#2e7d32" : e === "empty" ? "#6b7280" : "#e5484d", d = this.svgGroup.group().addClass("comment-badge");
    d.circle(o * 2).center(r, a).fill(l).stroke({
      color: "#ffffff",
      width: 1.5
    });
    const h = t > 99 ? "99+" : String(t);
    d.text(h).font({
      size: 12,
      anchor: "middle",
      family: "sans-serif",
      weight: "bold"
    }).fill("#ffffff").center(r, a).attr("dy", "0.05em"), d.attr("pointer-events", "none"), this._commentBadge = d, this._commentBadgeState = { count: t, kind: e };
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
    this.connectionHandles.container && (this.connectionHandles.container.remove(), this.connectionHandles.container = void 0), this.connectionPreview?.container && (this.connectionPreview.container.remove(), this.connectionPreview.container = void 0), this.hideNodeCog(), this._removed = !0, this.svgGroup?.remove();
  }
  /**
   * Destroy the node completely, cleaning up all timers, event handlers,
   * and owned sub-modules. Pattern matches PanZoom.ts.
   */
  destroy() {
    this._destroyed = !0, this._svgViewboxTimeoutId !== null && (clearTimeout(this._svgViewboxTimeoutId), this._svgViewboxTimeoutId = null), this._dragEndTimeoutId !== null && (clearTimeout(this._dragEndTimeoutId), this._dragEndTimeoutId = null), this._previewViewboxTimeoutId !== null && (clearTimeout(this._previewViewboxTimeoutId), this._previewViewboxTimeoutId = null), this.resizeRotate && this.resizeRotate.isEnabled() && this.resizeRotate.disable(), this.connector && this.connector.isActive && this.connector.disable(), this.relationships && (this.relationships.disable(), this.relationships.removeAll()), this.connectionHandles.container && (this.connectionHandles.container.remove(), this.connectionHandles.container = void 0), this.connectionPreview?.container && (this.connectionPreview.container.remove(), this.connectionPreview.container = void 0), this.svgGroup.remove(), this.isDragging = !1;
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
    if (this.options.shape === "circle") {
      const i = Math.min(t, e);
      t = i, e = i;
    }
    if (this.options.width = t, this.options.height = e, this.backgroundRect instanceof Je)
      this.backgroundRect.size(t, e);
    else if (this.backgroundRect instanceof An) {
      const i = Math.min(t, e);
      this.backgroundRect.size(i, i), this.options.width = i, this.options.height = i;
    } else if (this.backgroundRect instanceof Ve)
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
    this.textElement && this.options.text && this.textElement.text(this.wrapTextToWidth(this.options.text)), this.centerText(), this._linkBadge && this.updateLinkIndicator();
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
      if (o && this.textElement && t.startsWith("#") && tr(r, t) < 3) {
        const a = qs(t);
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
   * but rotation lives on the PARENT group transform, which those observers
   * never see. Interactive drags refresh via finalizeInteraction; this call
   * covers the non-drag paths (setRotation, collab onNodeRotated, group
   * rotate, SlateOperations, host API) where nothing else re-positions the
   * decorations and they would strand at the pre-rotation box.
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
  applyPositionAndRotation(t = !0) {
    if (!this.svgGroup) return;
    const e = this.options.x || 0, s = this.options.y || 0, i = this.options.width || 0, o = this.options.height || 0, r = this.options.rotate?.rotationAngle || 0;
    if (t && typeof this.svgGroup.node?.removeAttribute == "function" && typeof this.svgGroup.bbox == "function")
      try {
        this.svgGroup.node.removeAttribute("transform");
        const c = this.resizeTarget ?? this.backgroundRect, l = c ? { x: c.x(), y: c.y() } : this.svgGroup.bbox();
        l && (Math.abs(l.x) > 0.01 || Math.abs(l.y) > 0.01) && this.svgGroup.children().forEach((d) => {
          typeof d?.dmove == "function" && d.dmove(-l.x, -l.y);
        });
      } catch (c) {
        console.warn("NODE_DEBUG: child normalization failed:", c);
      }
    try {
      const c = (d) => {
        if (!d?.node?.removeAttribute) return !1;
        const h = typeof d.transform == "function" ? d.transform() : null;
        return h && Math.abs(h.rotate || 0) > 0.01 ? (d.node.removeAttribute("transform"), !0) : !1;
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
      (this.slate._activeLineCog || this.slate._activeEndpointToggles) && this.slate.clearLineCog?.();
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
          ), this.links?.hasLink?.() && this.slate.isReadOnly?.())
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
    return !this._destroyed && !!this.svgGroup && !this.options.isComment && !this.nestedSvg && !this.options.isLocked && t?.options?.enabled !== !1 && !t?.isReadOnly?.() && !t?.isCommentOnly?.() && t?.capabilitiesOf?.(this).canEditText !== !1 && typeof this.editor?.startInline == "function";
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
      const l = s.canvas.viewbox(), d = t.svgGroup.rbox(s.canvas), h = (p, g, m, b) => {
        const y = Math.min(24, Math.max(0, (b - (g - p)) / 2));
        return g - p > b ? (p + g) / 2 - b / 2 : p - y < m ? p - y : g + y > m + b ? g + y - b : m;
      }, u = h(d.x, d.x2, l.x, l.width), f = h(d.y, d.y2, l.y, l.height);
      (u !== l.x || f !== l.y) && s.pan({ x: u, y: f });
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
    const t = this.slate, e = t.markersContainer || t.canvas;
    if (!e || !this.svgGroup) return;
    let s, i;
    try {
      const b = this.svgGroup.rbox(t.canvas);
      s = b.x + b.width / 2, i = b.y;
    } catch {
      s = (this.options.x || 0) + (this.options.width || 0) / 2, i = this.options.y || 0;
    }
    const o = 15, r = 6, a = "#5b6472", c = t.capabilitiesOf?.(this), l = !!t.governanceOf?.(this), d = [];
    if (c?.canDelete !== !1 && d.push({ key: "delete", color: "#e5484d", onClick: () => this.slate.removeNode(this.id) }), c?.canConnect !== !1 && d.push({ key: "plug", color: a, onPress: (b) => this.startConnectDrag(b) }), !l && typeof t.options?.events?.onMenuRequested == "function" && d.push({ key: "cog", color: a, onClick: () => this.menu?.open?.() }), !d.length) return;
    const h = d.length, u = o * 2 + r, f = h * (o * 2) + (h - 1) * r, p = s - f / 2 + o, g = i - (o + 28 + 36), m = e.group().addClass("node-cog").addClass("node-toolbar");
    m.rect(f + 14, o * 2 + 10).radius((o * 2 + 10) / 2).center(s, g).fill("#ffffff").stroke({ color: "#e3e5ea", width: 1 }), d.forEach((b, y) => {
      const x = p + y * u, E = m.group().addClass(`node-tool-${b.key}`);
      E.circle(o * 2).center(x, g).fill("#ffffff").attr("fill-opacity", 1e-3), Rn.drawToolIcon(E, b.key, x, g, b.color), E.attr("pointer-events", "all");
      try {
        E.node.style.cursor = "pointer";
      } catch {
      }
      E.on("mousedown", (v) => {
        v.stopPropagation?.(), b.onPress && b.onPress(v);
      }), E.on("click", (v) => {
        v.stopPropagation?.(), b.onClick?.();
      });
    }), m.attr("pointer-events", "all"), this._nodeCog = m;
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
      const y = this.svgGroup.rbox(s);
      o = y.cx, r = y.cy;
    } catch {
      o = (this.options.x || 0) + (this.options.width || 0) / 2, r = (this.options.y || 0) + (this.options.height || 0) / 2;
    }
    const a = i.path(`M ${o} ${r} L ${o} ${r}`).fill("none").stroke({ color: "#007cff", width: 2, dasharray: "6,4", linecap: "round" }).addClass("connect-drag-line");
    a.attr("pointer-events", "none");
    let c = null;
    try {
      c = i.marker(7, 7, (y) => {
        y.path("M0,0 L7,3.5 L0,7 z").fill("#007cff").attr("pointer-events", "none");
      }), c.ref(6, 3.5), c.attr("pointer-events", "none"), a.marker("end", c);
    } catch {
    }
    try {
      e.markersContainer?.front?.();
    } catch {
    }
    const l = (y, x, E, v) => {
      const w = Math.hypot(y, x);
      if (w > 1e-4) return [y / w, x / w];
      const _ = Math.hypot(E, v) || 1;
      return [E / _, v / _];
    }, d = (y, x, E) => {
      const v = (y.x || 0) + (y.width || 0) / 2, w = (y.y || 0) + (y.height || 0) / 2, _ = x - v, C = E - w;
      if (Math.abs(_) < 1e-3 && Math.abs(C) < 1e-3) return { x: v, y: w };
      const S = _ !== 0 ? (y.width || 0) / 2 / Math.abs(_) : 1 / 0, k = C !== 0 ? (y.height || 0) / 2 / Math.abs(C) : 1 / 0, M = Math.min(S, k);
      return { x: v + _ * M, y: w + C * M };
    };
    let h = null;
    const u = () => {
      if (h) {
        try {
          h._preHiStroke !== void 0 && h.node.backgroundRect?.attr?.("stroke", h._preHiStroke), h.node.backgroundRect?.attr?.({
            "stroke-dasharray": null,
            "stroke-opacity": null
          });
        } catch {
        }
        h = null;
      }
    }, f = (y, x) => {
      try {
        return s.point(y, x);
      } catch {
        return { x: o, y: r };
      }
    }, p = (y, x) => {
      let E;
      try {
        E = a.node.style.display, a.node.style.display = "none";
      } catch {
      }
      const v = document.elementFromPoint(y, x);
      try {
        E !== void 0 && (a.node.style.display = E);
      } catch {
      }
      const _ = v?.closest?.("[data-node-id]")?.getAttribute?.("data-node-id");
      if (_ && _ !== this.id) return e.nodes?.one?.(_) || null;
      try {
        const C = e.nodes?.allNodes || [];
        for (const S of C) {
          if (!S || S.id === this.id) continue;
          const k = document.querySelector(`#slateCanvas [data-node-id="${S.id}"]`)?.getBoundingClientRect?.(), M = 14;
          if (k && y >= k.left - M && y <= k.right + M && x >= k.top - M && x <= k.bottom + M)
            return S;
        }
      } catch {
      }
      return null;
    }, g = (y) => !!y && e.capabilitiesOf?.(y).canConnect === !1, m = (y) => {
      if (t.pointerId != null && y.pointerId !== t.pointerId) return;
      const x = f(y.clientX, y.clientY), E = p(y.clientX, y.clientY), v = g(E) ? null : E;
      if (v && v.options) {
        const w = v.options, _ = (w.x || 0) + (w.width || 0) / 2, C = (w.y || 0) + (w.height || 0) / 2, S = (J, V, j, yt) => {
          try {
            const K = J && J.svgGroup;
            if (K) {
              const ct = pn(K, [j, yt]);
              if (ct && isFinite(ct[0]) && isFinite(ct[1]))
                return { x: ct[0], y: ct[1] };
            }
          } catch {
          }
          return d(V, j, yt);
        }, k = S(v, w, o, r), M = S(this, this.options, _, C), O = k.x - M.x, P = k.y - M.y, R = Math.hypot(O, P) || 1, A = l(M.x - o, M.y - r, O, P), T = l(k.x - _, k.y - C, -O, -P), I = Math.max(30, Math.min(R * 0.45, 90)), L = M.x + A[0] * I, H = M.y + A[1] * I, q = k.x + T[0] * I, at = k.y + T[1] * I;
        a.plot(
          `M ${M.x} ${M.y} C ${L} ${H} ${q} ${at} ${k.x} ${k.y}`
        );
      } else
        a.plot(`M ${o} ${r} L ${x.x} ${x.y}`);
      if (v !== (h?.node || null) && (u(), v && v.backgroundRect)) {
        const w = v.backgroundRect;
        h = { node: v, _preHiStroke: w.attr("stroke") };
        try {
          w.attr({ stroke: "#007cff", "stroke-dasharray": "8,4", "stroke-opacity": 0.9 });
        } catch {
        }
      }
    }, b = (y) => {
      if (t.pointerId != null && y.pointerId !== t.pointerId) return;
      window.removeEventListener("pointercancel", b, !0), window.removeEventListener("pointermove", m, !0), window.removeEventListener("pointerup", b, !0), this._connectDragging = !1;
      try {
        a.remove(), c?.remove?.(), s.node.querySelectorAll(
          ".connect-drag-line"
        ).forEach((v) => v.remove());
      } catch {
      }
      if (u(), y.type === "pointercancel") return;
      const x = p(y.clientX, y.clientY);
      if (!g(x)) {
        if (x && x.id !== this.id)
          try {
            let E;
            try {
              const v = f(y.clientX, y.clientY), w = x.options, _ = Math.max(
                0,
                Math.min(1, (v.x - (w.x || 0)) / (w.width || 1))
              ), C = Math.max(
                0,
                Math.min(1, (v.y - (w.y || 0)) / (w.height || 1))
              );
              if (Math.min(_, 1 - _, C, 1 - C) < 0.25) {
                let k = _, M = C;
                const O = _, P = 1 - _, R = C, A = 1 - C, T = Math.min(O, P, R, A);
                T === O ? k = 0 : T === P ? k = 1 : T === R ? M = 0 : M = 1, E = { targetAnchor: { x: k, y: M } };
              }
            } catch {
            }
            this.relationships.addAssociation(x, E);
          } catch {
          }
        else if (!x)
          try {
            const E = f(y.clientX, y.clientY), v = this.options, w = 16, _ = E.x >= (v.x || 0) - w && E.x <= (v.x || 0) + (v.width || 0) + w && E.y >= (v.y || 0) - w && E.y <= (v.y || 0) + (v.height || 0) + w;
            if (!e.isReadOnly?.() && !_) {
              const k = e.addNode({
                x: Math.round(E.x - 60),
                y: Math.round(E.y - 35),
                width: 120,
                height: 70,
                text: ""
              });
              if (k) {
                k.announcedByCreator = !0;
                const M = () => {
                  try {
                    this.relationships.addAssociation(k);
                  } catch {
                  }
                  try {
                    e.nodes?.one?.(k.id) === k && this.beginNamingCreatedNode(k, "drop");
                  } catch {
                  }
                };
                k.ready?.then ? k.ready.then(M) : M();
              }
            }
          } catch {
          }
      }
    };
    window.addEventListener("pointermove", m, !0), window.addEventListener("pointerup", b, !0), window.addEventListener("pointercancel", b, !0);
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
      for (const r of nn) this.connectionHandles[r]?.attr("tabindex", 0);
    }), t.on("focusout", (r) => {
      if (!t.node.contains(r.relatedTarget))
        for (const a of nn) this.connectionHandles[a]?.attr("tabindex", -1);
    });
    const e = 8, s = "#007cff", i = "#ffffff", o = 2;
    nn.forEach((r) => {
      if (!this.connectionHandles.container) return;
      const a = this.connectionHandles.container.circle(e * 2).fill(s).stroke({ color: i, width: o }).attr({ role: "button", tabindex: -1, "aria-label": wd[r] }).addClass(`connection-handle connection-handle-${r}`);
      a.node.style.cursor = "pointer", this.connectionHandles[r] = a, a.on(
        "mouseenter",
        () => this.showConnectionPreview(r)
      ), a.on("mouseleave", () => this.hideConnectionPreview()), a.on("keydown", (c) => {
        if (c.key === "Tab" && c.shiftKey && r === "top") {
          c.preventDefault(), this.svgGroup.node.focus();
          return;
        }
        if (c.key === "Tab" && !c.shiftKey && r === "left") {
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
    for (const r of nn) {
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
    const i = this.slate.canvas.node, o = (d) => d.preventDefault();
    s && i.addEventListener("touchstart", o, { capture: !0, passive: !1, once: !0 });
    const r = () => {
      i.removeEventListener("touchstart", o, !0), window.removeEventListener("pointermove", l, !0), window.removeEventListener("pointerup", c, !0), window.removeEventListener("pointercancel", a, !0);
    }, a = (d) => {
      d.pointerId === t.pointerId && r();
    }, c = (d) => {
      d.pointerId === t.pointerId && (r(), s?.());
    }, l = (d) => {
      d.pointerId !== t.pointerId || Math.hypot(d.clientX - t.clientX, d.clientY - t.clientY) <= 5 || (r(), this.draggedPlug = e, this.startConnectDrag(t));
    };
    window.addEventListener("pointermove", l, !0), window.addEventListener("pointerup", c, !0), window.addEventListener("pointercancel", a, !0);
  }
  updateConnectionHandlePositions() {
    if (!this.connectionHandles.container || !this.connectionHandlesVisible)
      return;
    const t = this.resizeTarget ?? this.backgroundRect;
    if (!t?.root?.()) return;
    const e = t.bbox(), s = t.screenCTM(), o = t.root().screenCTM().inverseO().multiplyO(s), r = ([u, f], { a: p, b: g, c: m, d: b, e: y, f: x }) => [u * p + f * m + y, u * g + f * b + x], a = e.x + e.width / 2, c = e.y + e.height / 2, l = 35, d = 20, h = {
      top: [a, e.y - l],
      right: [e.x + e.width + d, c],
      bottom: [a, e.y + e.height + d],
      left: [e.x - d, c]
    };
    Object.entries(h).forEach(([u, f]) => {
      const p = this.connectionHandles[u];
      if (p) {
        const [g, m] = r(f, o);
        p.center(g, m);
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
    this._handlesHiddenForDrag || (this._handlesHiddenForDrag = !0, this.slate.disableNodeResizeRotate(this), this.hideConnectionHandles(), this.slate.getSelectedNodes?.().forEach((t) => {
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
    const s = this.options.width, i = this.options.height, o = 75, r = this.getRotation(), a = this.backgroundRect.rbox(this.backgroundRect.root()), c = a.cx, l = a.cy, d = this.connectionHandles[t];
    if (!d) {
      console.warn("CONNECTION_HANDLES_DEBUG: Handle not found for direction", t);
      return;
    }
    const h = d.bbox(), u = {
      x: h.x + h.width / 2,
      y: h.y + h.height / 2
    }, f = u.x - c, p = u.y - l, g = Math.sqrt(f * f + p * p), m = f / g, b = p / g, y = this.backgroundRect.bbox(), x = y.x + y.width / 2, E = y.y + y.height / 2, v = this.backgroundRect.screenCTM(), _ = this.backgroundRect.root().screenCTM().inverseO().multiplyO(v), C = _.inverse(), S = m * C.a + b * C.c, k = m * C.b + b * C.d;
    let M, O;
    const P = Math.abs(S);
    Math.abs(k) > P ? k < 0 ? (M = x, O = y.y) : (M = x, O = y.y + y.height) : S < 0 ? (M = y.x, O = E) : (M = y.x + y.width, O = E);
    const A = ([Nt, bt], { a: vt, b: ut, c: Yr, d: jr, e: Xr, f: qr }) => [Nt * vt + bt * Yr + Xr, Nt * ut + bt * jr + qr], [T, I] = A([M, O], _), L = Math.sqrt(
      Math.pow(T - c, 2) + Math.pow(I - l, 2)
    ), H = L, q = L + o + H, at = c + m * q, J = l + b * q, V = at - s / 2, j = J - i / 2;
    if (!this.connectionPreview.container) {
      console.warn("CONNECTION_HANDLES_DEBUG: Preview container not found");
      return;
    }
    this.connectionPreview.node = this.createPreviewShape(
      this.connectionPreview.container,
      V,
      j,
      s,
      i,
      r
      // Pass rotation angle to preview
    );
    const K = L + o - g, ct = {
      x: u.x + m * K,
      y: u.y + b * K
    };
    this.connectionPreview.connector = this.connectionPreview.container.line(u.x, u.y, ct.x, ct.y).stroke({ color: "#007cff", width: 2, opacity: 0.7 }).attr("pointer-events", "none"), this.addArrowheadToConnector(
      this.connectionPreview.container,
      u,
      ct
    );
  }
  createPreviewShape(t, e, s, i, o, r = 0) {
    let a;
    const c = this.options.backgroundColor || "#007cff", l = "#ffffff", d = 2, h = 0.6, u = e + i / 2, f = s + o / 2;
    switch (this.options.shape) {
      case "circle":
        const p = Math.min(i, o) / 2;
        a = t.circle(p * 2).center(u, f).fill(c).stroke({ color: l, width: d }).opacity(h), r !== 0 && a.rotate(r, u, f);
        break;
      case "ellipse":
        a = t.ellipse(i, o).center(u, f).fill(c).stroke({ color: l, width: d }).opacity(h), r !== 0 && a.rotate(r, u, f);
        break;
      default:
        if (this.options.svgContent) {
          a = t.rect(i, o).move(e, s).fill("none").stroke({ color: l, width: d }).opacity(h).radius(4);
          const g = t.nested().size(i, o).move(e, s);
          g.svg(this.options.svgContent), this._previewViewboxTimeoutId = setTimeout(() => {
            if (this._destroyed) return;
            const m = g.children()[0];
            if (m) {
              let b = m.bbox();
              (b.width <= 0 || b.height <= 0) && (b = this.calculatePathBounds(
                this.options.svgContent,
                i,
                o
              )), b.width > 0 && b.height > 0 && (g.viewbox(b.x, b.y, b.width, b.height), g.node.setAttribute("preserveAspectRatio", "none")), m.fill(c).opacity(h);
            }
          }, 1), g.attr("pointer-events", "none"), r !== 0 && (a.rotate(r, u, f), g.rotate(r, u, f));
        } else
          a = t.rect(i, o).move(e, s).fill(c).stroke({ color: l, width: d }).opacity(h).radius(4), r !== 0 && a.rotate(r, u, f);
        break;
    }
    return a.attr("pointer-events", "none");
  }
  addArrowheadToConnector(t, e, s) {
    const i = s.x - e.x, o = s.y - e.y, r = Math.sqrt(i * i + o * o);
    if (r === 0) return;
    const a = i / r, c = o / r, l = 12, d = 6, h = s.x, u = s.y, f = h - a * l, p = u - c * l, g = -c * d, m = a * d, b = [
      [h, u],
      [f + g, p + m],
      [f - g, p - m],
      [h, u]
    ];
    t.polygon(b).fill("#007cff").opacity(0.8).attr("pointer-events", "none");
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
      const d = c * Math.cos(a) - l * Math.sin(a), h = c * Math.sin(a) + l * Math.cos(a), u = this.backgroundRect.rbox(this.backgroundRect.root()), f = u.cx, p = u.cy, g = this.backgroundRect.bbox(), m = g.x + g.width / 2, b = g.y + g.height / 2;
      let y, x;
      switch (t) {
        case "top":
          y = m, x = g.y;
          break;
        case "right":
          y = g.x + g.width, x = b;
          break;
        case "bottom":
          y = m, x = g.y + g.height;
          break;
        case "left":
          y = g.x, x = b;
          break;
      }
      const E = this.backgroundRect.screenCTM(), w = this.backgroundRect.root().screenCTM().inverseO().multiplyO(E), _ = ([H, q], { a: at, b: J, c: V, d: j, e: yt, f: K }) => [H * at + q * V + yt, H * J + q * j + K], [C, S] = _([y, x], w), k = Math.sqrt(
        Math.pow(C - f, 2) + Math.pow(S - p, 2)
      ), M = k, O = k + o + M, P = f + d * O, R = p + h * O, A = P - s / 2, T = R - i / 2, I = this.cloneNodeOptions(A, T, r), L = this.slate.addNode(I);
      if (!L) {
        console.error("CONNECTION_HANDLES_DEBUG: Failed to create new node");
        return;
      }
      console.log(
        "CONNECTION_HANDLES_DEBUG: Created new node",
        L.id,
        "at",
        A,
        T
      ), this.hideConnectionPreview(), L.announcedByCreator = !0, L.ready.then(() => {
        this._destroyed || this.slate.getNode(this.id) !== this || this.slate.getNode(L.id) !== L || (this.connectToNode(L), this.canUseConnectionHandles() ? this.beginNamingCreatedNode(L, e ? "keyboard" : "plug") : this.slate.announce(`Node added: ${L.options.text || "(unnamed)"}`));
      }).catch((H) => console.error("Could not connect the new note", H));
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
class _d {
  constructor(t) {
    this.nodes = /* @__PURE__ */ new Map(), this.unbuilt = /* @__PURE__ */ new Set(), this.slate = t;
  }
  add(t = {}) {
    if (t.id || (t.id = this.generateId()), this.nodes.has(t.id))
      return console.warn(`Node with id "${t.id}" already exists`), this.nodes.get(t.id);
    const e = new Rn(t, this.slate);
    this.nodes.set(e.id, e);
    const s = e.ready;
    if (s && typeof s.then == "function") {
      this.unbuilt.add(s);
      const i = () => {
        this.unbuilt.delete(s);
      };
      s.then(i, i);
    }
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
      return this.allNodes.forEach((s) => {
        if (s.id !== t)
          try {
            s.relationships?.getAssociation?.(t) && s.relationships.removeAssociation(t);
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
    const a = [r].filter((d) => !d.relationships && d.ready);
    if (a.length && !e) {
      Promise.all(a.map((d) => d.ready)).then(() => this.addRelationship(t, !0)).catch((d) => console.warn("NODESMANAGER_DEBUG: addRelationship after ready failed", d));
      return;
    }
    const c = t.id;
    if (c) {
      if (r.relationships?.hasAssociationId?.(c)) return;
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
function te(n, t, e) {
  const s = t || n.nodes.allNodes, o = (typeof n.isDerivedNode == "function" ? s.filter((r) => !n.isDerivedNode(r)) : s).map(
    (r) => hr(r)
  );
  return e && o.forEach((r, a) => {
    r.options._presentationIndex = a;
  }), {
    options: Ed(n.options),
    nodes: o,
    shareId: n.options.shareId || ""
  };
}
async function Pn(n, t, e = !1, s = !1) {
  const i = typeof n == "string" ? JSON.parse(n) : n, o = e ? null : t.takeInlineDraft?.() ?? null;
  t.beginRemoteApply?.();
  try {
    const r = Cd(i, t, e, s);
    await (t.holdUntilLoaded?.(r) ?? r);
  } finally {
    t.endRemoteApply?.();
  }
  e || t.notifyNotesReplaced?.(), o && t.resumeInlineDraft?.(o);
}
async function Cd(n, t, e, s) {
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
  const i = /* @__PURE__ */ new Map();
  if (Array.isArray(n.nodes)) {
    for (const r of n.nodes) {
      const a = dr(r.options), c = t.nodes.one(a.id);
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
      const a = r.options.id || r.options.xPos !== void 0 ? re(r.options).id : r.options.id;
      if (!a) continue;
      const c = i.get(a) || t.nodes.one(a);
      if (!c) continue;
      const l = r.relationships?.associations;
      if (!(!Array.isArray(l) || l.length === 0))
        for (const d of l) {
          const h = Ks(d);
          if (h.targetPoint && c?.relationships) {
            c.relationships.addFloatingAssociation(
              h.targetPoint,
              h
            );
            continue;
          }
          const u = i.get(h.childId) || t.nodes.one(h.childId);
          if (u && c)
            if (c.relationships)
              c.relationships.addAssociation(u, h);
            else
              try {
                c.connector.isEnabled() || c.connector.enable(), c.connector.connectTo(u, {
                  lineColor: h.lineColor,
                  lineWidth: h.lineWidth
                });
              } catch (f) {
                console.warn(
                  "SERIALIZATION_DEBUG: Failed to create connection",
                  h.parentId,
                  "->",
                  h.childId,
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
      for (const d of a) {
        const h = d.options.x ?? 0, u = d.options.width ?? 100;
        c = Math.min(c, h), l = Math.max(l, h + u);
      }
      return (c + l) / 2;
    }, r = (a) => {
      if (t._destroyed) return;
      const c = t.element?.getBoundingClientRect?.(), l = !!c && c.width > 1 && c.height > 1, d = o();
      if (l && d !== null) {
        try {
          t.fitToContent();
        } catch {
        }
        const h = t.canvas?.viewbox?.();
        if (h && Math.abs(h.x + h.width / 2 - d) < h.width / 2) {
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
function hr(n) {
  const t = rt(n.options);
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
    s?.associations && e.push(
      ...s.associations.map((i) => Js(i))
    );
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
function dr(n) {
  return re(n);
}
function Ed(n) {
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
  for (const s of e)
    n[s] !== void 0 && (t[s] = n[s]);
  return n.viewPort && (t.viewPort = { ...n.viewPort }), n.containerStyle && (t.containerStyle = { ...n.containerStyle }), t;
}
function ur(n) {
  return te(n);
}
const Sd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  deserialize: Pn,
  deserializeNodeOptions: dr,
  serialize: te,
  serializeNode: hr,
  snapshot: ur
}, Symbol.toStringTag, { value: "Module" }));
class kd {
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
  onNodeBehaviorChanged(t) {
    const e = this.slate.nodes.one(t.data.id);
    e && t.data.behaviorChanges.forEach((s) => {
      typeof s.value == "object" ? (e.options[s.name] = s.value.val, Object.keys(s.value).forEach((i) => {
        i !== "val" && (e.options[i] = s.value[i]);
      })) : e.options[s.name] = s.value;
    });
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
    const s = t.data.shape ?? t.data.vectorPath;
    Object.assign(e.options, t.data), s && e.setShape(s, t.data.vectorPath);
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
        this.slate.nodes.one(s.id) || this.slate.nodes.add(re(s));
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
    e && await Pn(e, this.slate, !1, !0);
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
class fr {
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
      const l = c.clientX - e.x, d = c.clientY - e.y;
      if (!s && Math.hypot(l, d) < 6) return;
      a.cancelable && a.preventDefault(), s || (s = !0, this.canvas.dispatch("panStart", { event: a }));
      const h = this.canvas.viewbox(), u = t.getBoundingClientRect(), f = h.width / (u.width || h.width), p = { x: h.x - l * f, y: h.y - d * f, width: h.width, height: h.height };
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
        let h = o / s.width * a;
        h = Math.max(c, Math.min(l, h));
        const u = o / h, f = s.height / s.width * u, p = e.clientX - i.left, g = e.clientY - i.top, m = s.x + p * r, b = s.y + g * (s.height / i.height || r), y = m - p / o * u, x = b - g / (i.height || o) * f;
        this.canvas.viewbox(y, x, u, f);
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
    for (const y of t) {
      const x = y.options.x ?? 0, E = y.options.y ?? 0, v = y.options.width ?? 100, w = y.options.height ?? 60;
      e = Math.min(e, x), s = Math.min(s, E), i = Math.max(i, x + v), o = Math.max(o, E + w);
    }
    if (!isFinite(e)) return;
    const r = i - e, a = o - s, c = 50, l = r + c * 2, d = a + c * 2, h = this.getViewportSize(), u = h.w / h.h, f = l / d;
    let p = l, g = d;
    f > u ? g = p / u : p = g * u, p < h.w && (p = h.w, g = h.h);
    const m = e + r / 2, b = s + a / 2;
    this.canvas.viewbox(
      m - p / 2,
      b - g / 2,
      p,
      g
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
      const d = l.options.x ?? 0, h = l.options.y ?? 0, u = l.options.width ?? 100, f = l.options.height ?? 60;
      s = Math.min(s, d), i = Math.min(i, h), o = Math.max(o, d + u), r = Math.max(r, h + f);
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
class pr {
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
    const e = t.getZoom() || 1, s = t.getPan() || { x: 0, y: 0 }, i = this.options.width || 200, o = this.options.height || 150, r = this.calculateContentBounds(), a = Math.max(r.maxX - r.minX, 1), c = Math.max(r.maxY - r.minY, 1), l = 100, d = a + l * 2, h = c + l * 2;
    this.scale = Math.min(
      i / d,
      o / h
    );
    const u = (this.slate.options.viewPort?.originalWidth || 800) / e, f = (this.slate.options.viewPort?.originalHeight || 600) / e, p = (s.x - r.minX + l) * this.scale, g = (s.y - r.minY + l) * this.scale, m = u * this.scale, b = f * this.scale;
    this.viewportIndicator.move(p, g), this.viewportIndicator.size(Math.max(m, 10), Math.max(b, 10));
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
    const a = (d) => d < 0.5 ? 2 * d * d : 1 - Math.pow(-2 * d + 2, 2) / 2;
    let c = null;
    const l = (d) => {
      c === null && (c = d);
      const h = Math.min(1, (d - c) / i), u = a(h);
      try {
        t.move(o + (e - o) * u, r + (s - r) * u);
      } catch {
      }
      h < 1 ? t._beRaf = requestAnimationFrame(l) : t._beRaf = null;
    };
    t._beRaf = requestAnimationFrame(l);
  }
  addNodeShape(t) {
    if (!this._enabled || !this.miniCanvas) return;
    const e = this.calculateContentBounds(), s = 100, i = (t.options.x - e.minX + s) * this.scale, o = (t.options.y - e.minY + s) * this.scale, r = (t.options.width || 100) * this.scale, a = (t.options.height || 60) * this.scale;
    let c;
    if (t.options.shape === "circle") {
      const l = Math.min(r, a) / 2;
      c = this.miniCanvas.circle(l * 2).move(i, o);
    } else
      c = this.miniCanvas.rect(r, a).move(i, o);
    c.fill(t.options.backgroundColor || this.options.nodeColor), c.stroke({ width: 0 }), this.applyShapeRotation(c, t, i, o, r, a), this.nodeShapes.set(t.id, c);
    try {
      c.opacity(0), c.animate(220).opacity(1);
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
    this.container && (this.miniCanvas = Mn().addTo(this.container).size(this.options.width, this.options.height), this.miniCanvas.rect(this.options.width, this.options.height).fill("#f8f9fa"));
  }
  renderNodes() {
    if (!this.miniCanvas) return;
    this.nodeShapes.forEach((c) => c.remove()), this.nodeShapes.clear();
    const t = this.calculateContentBounds(), e = 100, s = Math.max(t.maxX - t.minX, 1), i = Math.max(t.maxY - t.minY, 1), o = s + e * 2, r = i + e * 2;
    this.scale = Math.min(
      this.options.width / o,
      this.options.height / r
    ), this.slate.getAllNodes().forEach((c) => {
      const l = (c.options.x - t.minX + e) * this.scale, d = (c.options.y - t.minY + e) * this.scale, h = Math.max((c.options.width || 100) * this.scale, 2), u = Math.max((c.options.height || 60) * this.scale, 2);
      let f;
      if (c.options.shape === "circle") {
        const g = Math.min(h, u) / 2;
        f = this.miniCanvas.circle(g * 2).move(l, d);
      } else
        f = this.miniCanvas.rect(h, u).move(l, d);
      f.fill(c.options.backgroundColor || this.options.nodeColor), f.stroke({ width: 0 });
      const p = c.options.rotate?.rotationAngle || 0;
      if (p !== 0) {
        const g = l + h / 2, m = d + u / 2;
        f.rotate(p, g, m);
      }
      this.nodeShapes.set(c.id, f);
    });
  }
  createViewportIndicator() {
    this.miniCanvas && (this.viewportIndicator = this.miniCanvas.rect(50, 40).fill(this.options.viewportColor).stroke({ color: this.options.viewportBorderColor, width: 2 }).css({ cursor: "move" }), this.viewportIndicator.on("mousedown", (t) => {
      t.preventDefault(), t.stopPropagation();
      const e = t;
      this.isDragging = !0, this.dragStartX = e.clientX, this.dragStartY = e.clientY;
      const s = this.viewportIndicator.bbox();
      this.viewportStartX = s.x, this.viewportStartY = s.y, this.boundMouseMove = this.handleMouseMove.bind(this), this.boundMouseUp = this.handleMouseUp.bind(this), document.addEventListener("mousemove", this.boundMouseMove), document.addEventListener("mouseup", this.boundMouseUp);
    }), this.miniCanvas.on("mousedown", (t) => {
      const e = t;
      try {
        const s = this.miniCanvas.point(e.clientX, e.clientY), i = this.viewportIndicator?.bbox().width || 50, o = this.viewportIndicator?.bbox().height || 40, r = this.calculateContentBounds(), a = 100, c = (s.x - i / 2) / this.scale + r.minX - a, l = (s.y - o / 2) / this.scale + r.minY - a;
        this.slate.panZoom?.pan({ x: c, y: l });
      } catch {
      }
    }));
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
      const a = r.options.x || 0, c = r.options.y || 0, l = r.options.width || 100, d = r.options.height || 60;
      e = Math.min(e, a), s = Math.min(s, c), i = Math.max(i, a + l), o = Math.max(o, c + d);
    }), { minX: e, minY: s, maxX: i, maxY: o };
  }
}
const Ad = /* @__PURE__ */ new Set(["collabBaseline", "viewPort"]), ys = (n, t) => n === t || JSON.stringify(n) === JSON.stringify(t), ln = (n) => n?.options?.id, mn = (n) => n.relationships?.associations ?? [];
function De(n) {
  return n.id != null && n.id !== "" ? String(n.id) : `${n.parentId}->${n.childId}`;
}
function xi(n, t, e) {
  const s = {}, i = [];
  for (const o of Object.keys(t))
    e?.has(o) || (!(o in n) || !ys(n[o], t[o])) && (s[o] = t[o]);
  for (const o of Object.keys(n))
    e?.has(o) || o in t || i.push(o);
  return { set: s, unset: i };
}
const _i = (n) => Object.keys(n.set).length === 0 && n.unset.length === 0;
function Ci(n) {
  const t = /* @__PURE__ */ new Map();
  for (const e of n ?? []) {
    const s = ln(e);
    s != null && t.set(s, e);
  }
  return t;
}
function Md(n, t) {
  const e = xi(n?.options ?? {}, t?.options ?? {}, Ad), s = Ci(n?.nodes ?? []), i = Ci(t?.nodes ?? []), o = [], r = [], a = [];
  for (const [c, l] of i) {
    const d = s.get(c);
    if (!d) {
      o.push(l);
      continue;
    }
    if (ys(d, l)) continue;
    const h = xi(d.options ?? {}, l.options ?? {}), u = new Map(mn(d).map((g) => [De(g), g])), f = new Map(mn(l).map((g) => [De(g), g])), p = { set: [], removed: [] };
    for (const [g, m] of f) ys(u.get(g), m) || p.set.push(m);
    for (const g of u.keys()) f.has(g) || p.removed.push(g);
    _i(h) && p.set.length === 0 && p.removed.length === 0 || a.push({ id: c, ...h, links: p });
  }
  for (const c of s.keys()) i.has(c) || r.push(c);
  return _i(e) && o.length === 0 && r.length === 0 && a.length === 0 ? null : { options: e, added: o, removed: r, changed: a };
}
function Ei(n, t) {
  const e = { ...n.options ?? {} };
  for (const [l, d] of Object.entries(t.options.set)) e[l] = d;
  for (const l of t.options.unset) delete e[l];
  const s = new Set(t.removed), i = new Map(t.changed.map((l) => [l.id, l])), o = new Map(t.added.map((l) => [ln(l), l])), r = [];
  for (const l of n.nodes ?? []) {
    const d = ln(l);
    if (d != null && s.has(d)) continue;
    if (d != null && o.has(d)) {
      r.push(o.get(d)), o.delete(d);
      continue;
    }
    const h = d != null ? i.get(d) : void 0;
    let u = l;
    if (h) {
      const f = { ...l.options ?? {} };
      for (const [g, m] of Object.entries(h.set)) f[g] = m;
      for (const g of h.unset) delete f[g];
      let p = mn(l);
      if (h.links.set.length || h.links.removed.length) {
        const g = new Set(h.links.removed), m = new Map(h.links.set.map((b) => [De(b), b]));
        p = p.filter((b) => !g.has(De(b))).map((b) => {
          const y = De(b), x = m.get(y);
          return x ? (m.delete(y), x) : b;
        }), p.push(...m.values());
      }
      u = { ...l, options: f, relationships: { ...l.relationships ?? {}, associations: p } };
    }
    r.push(u);
  }
  r.push(...o.values());
  const a = new Set(r.map(ln)), c = r.map((l) => {
    const d = mn(l), h = d.filter((u) => u.targetPoint || u.childId == null || a.has(u.childId));
    return h.length === d.length ? l : { ...l, relationships: { ...l.relationships, associations: h } };
  });
  return { ...n, options: e, nodes: c };
}
class Fe {
  constructor(t, e = {}) {
    this.undoStack = [], this.redoStack = [], this.undoHost = [], this.redoHost = [], this.debounceTimer = null, this.isRestoring = !1, this.restoreQueue = Promise.resolve(), this.pendingRestores = 0, this.gestureRecordDue = !1, this.slate = t, this.options = {
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
      this.gestureRecordDue || (this.debounceTimer && clearTimeout(this.debounceTimer), this.debounceTimer = setTimeout(() => {
        this.debounceTimer = null, this.takeSnapshot();
      }, this.options.debounceMs));
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
    !this.options.enabled || this.isRestoring || (this.debounceTimer && (clearTimeout(this.debounceTimer), this.debounceTimer = null), !this.gestureRecordDue && (this.gestureRecordDue = !0, queueMicrotask(() => {
      this.gestureRecordDue && (this.gestureRecordDue = !1, !(!this.slate || this.isRestoring) && this.takeSnapshot());
    })));
  }
  /**
   * Take an immediate snapshot, bypassing the debounce timer.
   * Useful for programmatic undo/redo sequences where you need
   * guaranteed snapshot state right now (e.g., tests, scripts).
   */
  forceSnapshot() {
    !this.options.enabled || this.isRestoring || (this.debounceTimer && (clearTimeout(this.debounceTimer), this.debounceTimer = null), this.gestureRecordDue = !1, this.takeSnapshot());
  }
  /**
   * Record a change still waiting for its pause (or its gesture) now, as a step of
   * its own. Nothing happens when nothing is waiting.
   */
  flushPending() {
    (this.debounceTimer || this.gestureRecordDue) && this.forceSnapshot();
  }
  /** Bring what the host keeps with the current record up to date (see Slate.beginHostStep). */
  refreshHostState() {
    !this.options.enabled || !this.slate || !this.undoStack.length || (this.undoHost[this.undoStack.length - 1] = this.hostState());
  }
  /**
   * Undo the last change. Restores the previous snapshot.
   */
  undo() {
    if ((this.debounceTimer || this.gestureRecordDue) && this.forceSnapshot(), this.undoStack.length <= 1)
      return console.log("UNDOREDO_DEBUG: Nothing to undo"), !1;
    const t = this.undoStack.pop();
    this.redoStack.push(t), this.redoHost.push(this.undoHost.pop());
    const e = this.undoStack[this.undoStack.length - 1];
    return this.restore(e, "undo", this.undoHost[this.undoStack.length - 1]), console.log(
      "UNDOREDO_DEBUG: Undo performed. Undo stack:",
      this.undoStack.length,
      "Redo stack:",
      this.redoStack.length
    ), !0;
  }
  /**
   * Redo the last undone change.
   */
  redo() {
    if (this.redoStack.length === 0)
      return console.log("UNDOREDO_DEBUG: Nothing to redo"), !1;
    const t = this.redoStack.pop(), e = this.redoHost.pop();
    return this.undoStack.push(t), this.undoHost.push(e), this.restore(t, "redo", e), console.log(
      "UNDOREDO_DEBUG: Redo performed. Undo stack:",
      this.undoStack.length,
      "Redo stack:",
      this.redoStack.length
    ), !0;
  }
  /**
   * The slate as it is now, taken just before other people's changes are
   * applied to it; pass it to {@link absorbRemote} once they have been. Null
   * when this slate keeps no history.
   */
  beforeRemote() {
    if (!this.options.enabled || !this.slate) return null;
    try {
      return te(this.slate);
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
      e = te(this.slate);
    } catch {
      return;
    }
    if (t && typeof t == "object") {
      const s = Md(t, e);
      s && (this.undoStack = this.undoStack.map((i) => Ei(i, s)), this.redoStack = this.redoStack.map((i) => Ei(i, s)));
    }
    this.isRestoring || this.debounceTimer || this.gestureRecordDue || this.undoStack.length === 0 || (this.undoStack[this.undoStack.length - 1] = e, this.undoHost[this.undoStack.length - 1] = this.hostState());
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
    this.undoStack = [], this.redoStack = [], this.undoHost = [], this.redoHost = [], this.debounceTimer && (clearTimeout(this.debounceTimer), this.debounceTimer = null), this.gestureRecordDue = !1;
  }
  /** Destroy the undo/redo system, clearing all history and references */
  destroy() {
    this.clear(), this.isRestoring = !1, this.slate = null;
  }
  // ─── Private ─────────────────────────────────────────────────────
  takeSnapshot() {
    let t;
    try {
      t = te(this.slate);
    } catch {
      return;
    }
    this.redoStack = [], this.redoHost = [], this.undoStack.push(t), this.undoHost.push(this.hostState()), this.undoStack.length > this.options.maxHistory && (this.undoStack.shift(), this.undoHost.shift()), console.log(
      "UNDOREDO_DEBUG: Snapshot taken. Stack size:",
      this.undoStack.length
    );
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
  restore(t, e, s = null) {
    this.pendingRestores += 1, this.isRestoring = !0, this.restoreQueue = this.restoreQueue.then(async () => {
      await this.slate.collab?.whenApplied?.();
      let i = null;
      try {
        i = te(this.slate);
      } catch {
        i = null;
      }
      await Pn(t, this.slate, !1, !0);
      const o = Fe.noteIds(i), r = Fe.noteIds(t);
      this.slate.restoreUndoHostState?.(s, {
        added: [...r].filter((c) => !o.has(c)),
        removed: [...o].filter((c) => !r.has(c))
      });
      const a = JSON.stringify(t);
      this.slate.broadcast?.("onSlateReplaced", {
        action: e,
        snapshot: a
      }), this.slate.options.events?.onTakeSnapshot?.({
        action: e,
        slateId: this.slate.options.id,
        snapshot: a
      });
    }).catch(
      (i) => console.error("UNDOREDO_DEBUG: Restore failed", i)
    ).finally(() => {
      this.pendingRestores -= 1, this.pendingRestores === 0 && (this.isRestoring = !1);
    });
  }
}
class gr {
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
        const l = c.options, d = l.x ?? 0, h = l.y ?? 0, u = l.width ?? 0, f = l.height ?? 0;
        d < t + s && d + u > t && h < e + i && h + f > e && r.push(c);
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
class mr {
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
    for (let d = r; d <= c; d += s)
      this.gridGroup.line(d, a, d, l).stroke({ color: i, width: 0.5, opacity: o });
    for (let d = a; d <= l; d += s)
      this.gridGroup.line(r, d, c, d).stroke({ color: i, width: 0.5, opacity: o });
    this.gridGroup.back();
  }
}
const Le = class Le {
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
    const s = Le.isTypingKey(t), i = t.ctrlKey || t.metaKey;
    if (!(e instanceof Element && e !== document.body && e !== document.documentElement && !this.slate.element.contains(e) && (!i || e.closest(Le.MODAL_SURFACES))) && !this.offerKeyToPolicy(t) && !(s && t.key !== "?" && this.typeIntoSelected(t)))
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
      delete a.__srcId, a.id = se(), a.x = (a.x || 0) + e, a.y = (a.y || 0) + e;
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
          const l = o.get(c.parentSrcId), d = o.get(c.childSrcId);
          if (l && d)
            try {
              l.relationships?.addAssociation?.(d, c.data);
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
        const c = o[0], l = { x: (c.options.x || 0) + (c.options.width || 0) / 2, y: (c.options.y || 0) + (c.options.height || 0) / 2 }, d = this.slate.offerFreeDrop?.(c, l, a);
        if (d === "refused" && c.position(a.x, a.y, () => this.slate.updateSelectionResizeRotate?.()), d) return;
      }
      o.length > 0 && this.slate.broadcast?.("onNodesMove", {
        nodeOptions: o.map((c) => rt(c.options))
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
    if (!s?.editor?.startInline || s.nestedSvg) return !1;
    const i = this.slate;
    return s.options?.isLocked || i?.capabilitiesOf?.(s).canEditText === !1 || i?.options?.enabled === !1 || i?.isReadOnly?.() || i?.isCommentOnly?.() && !s.options?.isComment ? !1 : (t.preventDefault(), s.editor.startInline(), !0);
  }
};
Le.MODAL_SURFACES = '[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"], [aria-modal="true"]';
let yn = Le;
class yr {
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
      r.id = se(), r.x = (r.x || 0) + 20, r.y = (r.y || 0) + 20, delete r.parentArrowForChildren, delete r.noChildArrowForChildren, delete r.associations;
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
function Qs(n, t = {}, e) {
  const s = n.canvas;
  if (!s) {
    const i = "";
    return e?.(i), i;
  }
  try {
    const i = s.node.cloneNode(!0), o = [
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
      "#slate-coordinates",
      // Connector hit areas: invisible wide paths used only for click detection
      // (attribute-tagged, so the class selectors above miss them). Not visible
      // content — strip them so the export has no near-invisible cruft / bbox skew.
      '[connectortype="hitarea"]'
    ];
    for (const c of o)
      i.querySelectorAll(c).forEach((d) => d.remove());
    if (t.noBackground) {
      const c = i.querySelector("rect[data-background]");
      c && c.remove();
    }
    if (t.backgroundOnly)
      i.querySelectorAll("[data-node-id]").forEach((l) => l.remove());
    else if (t.nodes) {
      const c = new Set(
        t.nodes.map((d) => typeof d == "string" ? d : d.id)
      );
      i.querySelectorAll("[data-node-id]").forEach((d) => {
        const h = d.getAttribute("data-node-id");
        h && !c.has(h) && d.remove();
      });
    }
    try {
      const c = i.querySelectorAll("[data-node-id]");
      if (c.length > 0) {
        let d = 1 / 0, h = 1 / 0, u = -1 / 0, f = -1 / 0;
        for (const p of Array.from(c)) {
          const g = p.getAttribute("data-node-id"), b = n.nodes?.one?.(g)?.options;
          if (!b) continue;
          const y = b.x || 0, x = b.y || 0, E = b.width || 0, v = b.height || 0, w = Number(
            typeof b.rotate == "object" ? b.rotate?.rotationAngle : b.rotate
          ) || 0;
          if (w) {
            const _ = y + E / 2, C = x + v / 2, S = w * Math.PI / 180, k = Math.cos(S), M = Math.sin(S);
            for (const [O, P] of [
              [y, x],
              [y + E, x],
              [y + E, x + v],
              [y, x + v]
            ]) {
              const R = O - _, A = P - C, T = _ + R * k - A * M, I = C + R * M + A * k;
              d = Math.min(d, T), h = Math.min(h, I), u = Math.max(u, T), f = Math.max(f, I);
            }
          } else
            d = Math.min(d, y), h = Math.min(h, x), u = Math.max(u, y + E), f = Math.max(f, x + v);
        }
        if (isFinite(d) && u > d) {
          const p = u - d + 80, g = f - h + 40 * 2;
          i.setAttribute(
            "viewBox",
            `${d - 40} ${h - 40} ${p} ${g}`
          ), i.setAttribute("width", String(Math.round(p))), i.setAttribute("height", String(Math.round(g))), i.setAttribute("preserveAspectRatio", "xMidYMid meet");
        }
      }
    } catch {
    }
    let a = new XMLSerializer().serializeToString(i);
    return a = `<?xml version="1.0" encoding="UTF-8"?>
` + a, e?.(a), a;
  } catch (i) {
    console.error("EXPORT_DEBUG: SVG export failed:", i);
    const o = "";
    return e?.(o), o;
  }
}
async function br(n, t = {}, e) {
  const s = Qs(n, t);
  if (!s) {
    const o = t.asBinary ? new Blob() : "";
    return e?.(o), o;
  }
  const i = t.scale || 2;
  try {
    const o = n.canvas;
    let r, a;
    const c = s.match(
      /viewBox="[\d.\-]+\s+[\d.\-]+\s+([\d.\-]+)\s+([\d.\-]+)"/
    );
    if (c)
      r = parseFloat(c[1]), a = parseFloat(c[2]);
    else {
      const m = o.viewbox();
      r = m.width, a = m.height;
    }
    const l = r * i, d = a * i, h = document.createElement("canvas");
    h.width = l, h.height = d;
    const u = h.getContext("2d");
    t.alpha || (u.fillStyle = n.options.containerStyle?.backgroundColor || "#ffffff", u.fillRect(0, 0, l, d));
    const f = new Image(), p = new Blob([s], {
      type: "image/svg+xml;charset=utf-8"
    }), g = URL.createObjectURL(p);
    return new Promise((m, b) => {
      f.onload = () => {
        if (u.drawImage(f, 0, 0, l, d), URL.revokeObjectURL(g), t.asBinary)
          h.toBlob(
            (y) => {
              const x = y || new Blob();
              e?.(x), m(x);
            },
            "image/png"
          );
        else {
          const y = h.toDataURL("image/png"), x = t.base64 ? y.split(",")[1] : y;
          e?.(x), m(x);
        }
      }, f.onerror = (y) => {
        URL.revokeObjectURL(g), console.error("EXPORT_DEBUG: PNG rendering failed:", y);
        const x = t.asBinary ? new Blob() : "";
        e?.(x), m(x);
      }, f.src = g;
    });
  } catch (o) {
    console.error("EXPORT_DEBUG: PNG export failed:", o);
    const r = t.asBinary ? new Blob() : "";
    return e?.(r), r;
  }
}
const Td = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  exportPNG: br,
  exportSVG: Qs
}, Symbol.toStringTag, { value: "Module" }));
function ue(n, t) {
  if (n.t !== t.t) return n.t - t.t;
  if (n.c !== t.c) return n.c - t.c;
  const e = n.k ?? "", s = t.k ?? "";
  return e < s ? -1 : e > s ? 1 : 0;
}
const he = "onSlateReplaced", Nd = /* @__PURE__ */ new Set([
  "onZoom",
  "onCanvasMove",
  "onFollowMeChanged",
  "onSlateFollowMeChanged",
  "onSlateHuddleChanged",
  "onCursorMoved",
  "onPresenceChanged",
  "onMouseMoved"
]);
function bn(n, t) {
  return {
    t: typeof t.timestamp == "number" ? t.timestamp : 0,
    c: typeof t.clientID == "number" ? t.clientID : 0,
    k: n
  };
}
const Si = (n, t) => ue(bn(n.key, n.pkg), bn(t.key, t.pkg)), Yn = /* @__PURE__ */ new Set(["onNodeToFront", "onNodeToBack"]), ki = "node-order";
class vr {
  constructor(t, e = {}) {
    this.doc = null, this.provider = null, this.collabMap = null, this.awareness = null, this.isConnected = !1, this.clientID = 0, this.cursorElements = /* @__PURE__ */ new Map(), this._cursorMoveHandler = null, this._cursorTrackingNode = null, this._cursorSweepTimer = null, this._cursorLastSeen = /* @__PURE__ */ new Map(), this.clock = 0, this.baseline = null, this.applying = null, this.slate = t, this.options = {
      wsUrl: "ws://localhost:1234",
      roomName: "default-slate",
      userName: "",
      // empty = no label rendered (see renderCursor); hosts pass real names via onInitCollaboration
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
      ), s = this.options.WebsocketProvider || (await import(
        /* @vite-ignore */
        "y-websocket"
      )).WebsocketProvider;
      this.doc = new e.Doc(), this.clientID = this.doc.clientID;
      let i;
      const o = this.slate.options.events?.onInitCollaboration;
      if (o)
        try {
          i = await o(this.clientID.toString()) || void 0;
        } catch (a) {
          console.warn(
            "COLLAB_DEBUG: onInitCollaboration threw; using static options",
            a
          );
        }
      i && (this.userBaseData = i, i.websocketUrl && (this.options.wsUrl = i.websocketUrl), i.websocketParams && (this.options.wsParams = i.websocketParams), i.userName && (this.options.userName = i.userName), i.color && (this.options.userColor = i.color)), this.collabMap = this.doc.getMap("collabPackages"), this.collabMap.observe((a) => {
        a.transaction.local || this.applyRemoteChanges(a.keysChanged);
      }), this.provider = new s(
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
      this.awareness.on("change", r), this.awareness.on(
        "update",
        ({
          added: a,
          updated: c,
          removed: l
        }) => {
          const d = Date.now();
          for (const h of a) this._cursorLastSeen.set(h, d);
          for (const h of c) this._cursorLastSeen.set(h, d);
          for (const h of l) this._cursorLastSeen.delete(h);
        }
      ), this.setupCursorTracking(), this.getCollabUsers().length > 0 && r(), this.provider.on("status", (a) => {
        this.isConnected = a.status === "connected", a.status !== "connected" && this.clearRemoteCursors(), this.options.onStatusChange?.(a.status);
      }), this._cursorSweepTimer = setInterval(() => {
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
      if (Yn.has(o.type) && !Array.isArray(o.data?.order)) {
        const r = (this.slate.nodes?.allNodes || []).map((a) => a.id ?? a.options?.id);
        return [{ ...o, data: { ...o.data, order: r } }];
      }
      return [o];
    });
    if (this.collabMap)
      for (const s of e) {
        const i = `${s.type}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        if (s.type === he) {
          const r = this.tick(), a = { ...s, clientID: this.clientID, timestamp: r }, c = () => {
            this.pruneBeforeSlateReplacement(), this.collabMap.set(i, a);
          };
          this.doc ? this.doc.transact(c) : c(), this.adoptBaseline({ t: r, c: this.clientID, k: i });
          continue;
        }
        s.type === "onLinePropertiesChanged" && this.pruneSupersededLineProperty(s.data);
        const o = { ...s, clientID: this.clientID, timestamp: this.tick() };
        if (s.type === "onNodeTextChanged" && typeof s.data?.text == "string" ? this.storeNodeText(i, o) : Yn.has(s.type) ? this.storeNodeOrder(o) : this.collabMap.set(i, o), s.type === "onNodeDeleted") {
          const r = s.data?.id;
          r != null && this.pruneNodePackages(r);
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
        if (this.sawTime(c.timestamp), c.type === he) {
          i = !0;
          continue;
        }
        e.push({ key: a, pkg: c }), c.type === "onNodeTextChanged" && typeof c.data?.text == "string" && s.add(c.data.id);
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
    if (e.length === 0) return;
    e.sort(Si);
    const o = this.latestLabels(s), r = e.some(({ pkg: a }) => !Nd.has(a.type));
    this.run(() => {
      const a = r ? this.beforeRemote() : null, c = this.applyInOrder(e, o);
      if (!r) return c;
      if (c) return c.then(() => this.afterRemote(a));
      this.afterRemote(a);
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
      if (c.type === "onNodeTextChanged" && typeof c.data?.text == "string" && e.get(c.data.id) !== a) {
        const { text: d, ...h } = c.data;
        if (!Object.keys(h).some((u) => u !== "id")) continue;
        c = { ...c, data: h };
      }
      let l;
      try {
        l = this.handleRemotePackage(c);
      } catch (d) {
        console.warn("COLLAB_DEBUG: A package from the room could not be applied:", c.type, d);
      }
      if (l && typeof l.then == "function")
        return l.then(
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
    const s = !!this.baseline && this.baseline.c === this.clientID && this.clientID !== 0, i = this.beforeRemote();
    this.adoptBaseline(t.stamp);
    try {
      await this.handleRemotePackage(t.pkg);
    } catch (a) {
      console.warn("COLLAB_DEBUG: The room's replacement could not be applied:", a);
    }
    if (!this.collabMap || !this.slate) return;
    this.adoptBaseline(t.stamp), this.dropOlderReplacements(t);
    const o = [], r = /* @__PURE__ */ new Set();
    this.collabMap.forEach((a, c) => {
      !a || a.type === he || (o.push({ key: c, pkg: a }), a.type === "onNodeTextChanged" && typeof a.data?.text == "string" && r.add(a.data.id));
    }), o.sort(Si), await this.applyInOrder(o, this.latestLabels(r)), this.afterRemote(i), s && this.slate && this.slate.emitSlateChange?.(he, { action: "superseded" });
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
    this.baseline && this.knownBaseline() === this.baseline && this.adoptBaseline(this.baseline);
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
      if (e?.type !== he) return;
      const i = bn(s, e);
      (!t || ue(i, t.stamp) > 0) && (t = { key: s, pkg: e, stamp: i });
    }), t;
  }
  /** Take replacements that lost to a later one out of the room. */
  dropOlderReplacements(t) {
    if (!this.collabMap) return;
    const e = this.knownBaseline(), s = [];
    if (this.collabMap.forEach((o, r) => {
      o?.type !== he || r === t?.key || e && ue(bn(r, o), e) < 0 && s.push(r);
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
        i !== ki && Yn.has(s.type) && this.collabMap.delete(i);
      }), this.collabMap.set(ki, t);
    };
    this.doc ? this.doc.transact(e) : e();
  }
  // Y.Map chooses one convergent label per node, including simultaneous
  // edits. Random keys retain every old label and replay them in varying order.
  storeNodeText(t, e) {
    const { id: s, text: i, ...o } = e.data, r = "node-text:" + s, a = () => {
      this.collabMap.forEach((c, l) => {
        if (l === r || c.type !== "onNodeTextChanged" || c.data?.id !== s || c.data.text === void 0) return;
        const { text: d, ...h } = c.data;
        Object.keys(h).some((u) => u !== "id") ? this.collabMap.set(l, { ...c, data: h }) : this.collabMap.delete(l);
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
        this.collabMap.forEach((e, s) => t.push(s));
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
          const h = o.bbox();
          h && h.width && (r = h.width, a = h.height);
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
    this.cursorElements.clear(), this.provider && (this.provider.disconnect(), this.provider = null), this.doc && (this.doc.destroy(), this.doc = null), this.collabMap = null, this.awareness = null, this.isConnected = !1, this.applying = null, console.log("COLLAB_DEBUG: Disconnected");
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
function wr(n) {
  const { x: t, y: e, width: s, height: i } = n, o = n.rotationAngle || 0;
  if (!o) return { minX: t, minY: e, maxX: t + s, maxY: e + i };
  const r = t + s / 2, a = e + i / 2, c = o * Math.PI / 180, l = Math.cos(c), d = Math.sin(c);
  let h = 1 / 0, u = 1 / 0, f = -1 / 0, p = -1 / 0;
  for (const [m, b] of [[t, e], [t + s, e], [t + s, e + i], [t, e + i]]) {
    const y = m - r, x = b - a, E = r + y * l - x * d, v = a + y * d + x * l;
    h = Math.min(h, E), u = Math.min(u, v), f = Math.max(f, E), p = Math.max(p, v);
  }
  const g = (m) => Math.round(m * 1e6) / 1e6;
  return { minX: g(h), minY: g(u), maxX: g(f), maxY: g(p) };
}
function xr(n, t) {
  if (t.length < 2) return [];
  const e = t.map(wr), s = Math.min(...e.map((l) => l.minX)), i = Math.max(...e.map((l) => l.maxX)), o = Math.min(...e.map((l) => l.minY)), r = Math.max(...e.map((l) => l.maxY)), a = (s + i) / 2, c = (o + r) / 2;
  return t.map((l, d) => {
    const h = e[d];
    let { x: u, y: f } = l;
    return n === "left" ? u += s - h.minX : n === "right" ? u += i - h.maxX : n === "centerH" ? u += a - (h.minX + h.maxX) / 2 : n === "top" ? f += o - h.minY : n === "bottom" ? f += r - h.maxY : n === "middle" && (f += c - (h.minY + h.maxY) / 2), { id: l.id, x: u, y: f };
  });
}
function _r(n, t) {
  if (t.length < 3) return [];
  const e = t.map((u, f) => ({ box: u, index: f, b: wr(u) })), s = n === "horizontal", i = (u) => s ? u.b.minX : u.b.minY, o = (u) => s ? u.b.maxX - u.b.minX : u.b.maxY - u.b.minY, r = [...e].sort((u, f) => i(u) - i(f) || u.index - f.index), a = i(r[0]), l = (r.reduce((u, f) => Math.max(u, i(f) + o(f)), -1 / 0) - a - r.reduce((u, f) => u + o(f), 0)) / (r.length - 1), d = /* @__PURE__ */ new Map();
  let h = a;
  for (const u of r) {
    const f = h - i(u);
    d.set(u.index, {
      id: u.box.id,
      x: s ? u.box.x + f : u.box.x,
      y: s ? u.box.y : u.box.y + f
    }), h += o(u) + l;
  }
  return e.map((u) => d.get(u.index));
}
function vn(n, t, e) {
  const s = Math.min(n.x + n.width + e - t.x, t.x + t.width + e - n.x), i = Math.min(n.y + n.height + e - t.y, t.y + t.height + e - n.y);
  return s > 0 && i > 0 ? { x: s, y: i } : null;
}
const Od = 4e6;
function Cr(n, t, { gap: e = 20 } = {}) {
  const s = n.map((d) => ({ ...d })), i = t.map((d) => ({ ...d })), o = (d, h, u, f, p) => {
    const g = d.x + d.width / 2 - (h.x + h.width / 2), m = d.y + d.height / 2 - (h.y + h.height / 2);
    u.y <= u.x ? d.y += (m > 0 || m === 0 && p > 0 ? 1 : -1) * u.y * f : d.x += (g > 0 || g === 0 && p > 0 ? 1 : -1) * u.x * f;
  }, r = Math.max(1, s.length * (i.length + s.length / 2)), a = Math.max(1, Math.min(1e3, Math.floor(Od / r)));
  let c = !1;
  for (let d = 0; d < a; d += 1) {
    let h = !1;
    for (let u = 0; u < s.length; u += 1) {
      for (const f of i) {
        const p = vn(s[u], f, e);
        p && (o(s[u], f, p, 1, 1), h = !0);
      }
      for (let f = u + 1; f < s.length; f += 1) {
        const p = vn(s[u], s[f], e);
        p && (o(s[u], s[f], p, 0.5, -1), o(s[f], s[u], p, 0.5, 1), h = !0);
      }
    }
    if (!h) {
      c = !0;
      break;
    }
  }
  const l = (d) => Math.round(d * 100) / 100;
  for (const d of s)
    d.x = l(d.x), d.y = l(d.y);
  return c || Rd(s, i, e), s.map(({ id: d, x: h, y: u }) => ({ id: d, x: h, y: u }));
}
function Rd(n, t, e) {
  const s = [...t], i = [];
  for (const f of n)
    s.some((p) => vn(f, p, e)) ? i.push(f) : s.push(f);
  if (!i.length) return;
  const o = Math.min(...n.map((f) => f.x)), r = s.length ? Math.max(...s.map((f) => f.y + f.height)) + e : Math.min(...n.map((f) => f.y)), a = s.length ? Math.max(...s.map((f) => f.x + f.width)) : o, c = i.reduce((f, p) => f + (p.width + e) * (p.height + e), 0), l = Math.max(a - o, Math.sqrt(c) * 1.5, ...i.map((f) => f.width));
  let d = o, h = r, u = 0;
  for (const f of i)
    d > o && d + f.width > o + l && (d = o, h += u + e, u = 0), f.x = d, f.y = h, d += f.width + e, u = Math.max(u, f.height);
}
function Pd(n, t, { gap: e = 48, obstacles: s = [] } = {}) {
  if (!n.length) return [];
  const i = new Map(n.map((v) => [v.id, v])), o = new Map(n.map((v) => [v.id, []])), r = new Map(n.map((v) => [v.id, 0]));
  for (const [v, w] of t)
    !i.has(v) || !i.has(w) || v === w || (o.get(v).push(w), r.set(w, r.get(w) + 1));
  const a = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), l = [], d = (v) => {
    l.push(v), c.set(v, 0), a.set(v, []);
    const w = [v];
    for (; w.length; ) {
      const _ = w.shift();
      for (const C of o.get(_))
        c.has(C) || (c.set(C, c.get(_) + 1), a.set(C, []), a.get(_).push(C), w.push(C));
    }
  };
  for (const v of n) r.get(v.id) === 0 && !c.has(v.id) && d(v.id);
  for (const v of n) c.has(v.id) || d(v.id);
  const h = [];
  for (const v of n) {
    const w = c.get(v.id);
    h[w] = Math.max(h[w] ?? 0, v.height);
  }
  const u = Math.min(...n.map((v) => v.x)), f = Math.min(...n.map((v) => v.y)), p = [];
  h.forEach((v, w) => {
    p[w] = w === 0 ? f : p[w - 1] + h[w - 1] + e;
  });
  const g = /* @__PURE__ */ new Map(), m = (v) => {
    const w = a.get(v), _ = w.reduce((S, k) => S + m(k), 0) + e * Math.max(0, w.length - 1), C = Math.max(i.get(v).width, _);
    return g.set(v, C), C;
  }, b = /* @__PURE__ */ new Map(), y = (v, w) => {
    const _ = i.get(v), C = a.get(v), S = g.get(v), k = p[c.get(v)];
    if (!C.length) {
      b.set(v, { id: v, x: w + (S - _.width) / 2, y: k });
      return;
    }
    const M = C.reduce((I, L) => I + g.get(L), 0) + e * (C.length - 1);
    let O = w + (S - M) / 2;
    for (const I of C)
      y(I, O), O += g.get(I) + e;
    const P = b.get(C[0]), R = b.get(C[C.length - 1]), A = (P.x + i.get(C[0]).width / 2 + R.x + i.get(C[C.length - 1]).width / 2) / 2, T = Math.min(Math.max(A - _.width / 2, w), w + S - _.width);
    b.set(v, { id: v, x: T, y: k });
  };
  let x = u;
  for (const v of l) {
    const w = m(v);
    y(v, x), x += w + e;
  }
  const E = n.map((v) => b.get(v.id));
  return Id(n, E, s, e);
}
function Id(n, t, e, s) {
  if (!e.length) return t;
  let i = 0;
  for (let o = 0; o <= e.length; o += 1) {
    let r = 0;
    if (t.forEach((a, c) => {
      const l = { ...n[c], x: a.x, y: a.y + i };
      for (const d of e)
        vn(l, d, s) && (r = Math.max(r, d.y + d.height + s - l.y));
    }), !r) break;
    i += r;
  }
  return i ? t.map((o) => ({ ...o, y: o.y + i })) : t;
}
function Er(n, t = 20) {
  const e = n.nodes.allNodes, i = (n.freeNodes?.() ?? e).filter((l) => !l.options.isLocked);
  if (i.length < 1 || e.length < 2) return;
  const o = (l) => ({
    id: l.id ?? l.options.id,
    x: l.options.x || 0,
    y: l.options.y || 0,
    width: l.options.width || 100,
    height: l.options.height || 60
  }), r = new Set(i), c = Cr(i.map(o), e.filter((l) => !r.has(l)).map(o), { gap: t }).filter((l, d) => {
    const h = i[d];
    return l.x !== (h.options.x || 0) || l.y !== (h.options.y || 0);
  });
  c.length && (c.forEach((l) => {
    i.find((h) => (h.id ?? h.options.id) === l.id).position(l.x, l.y);
  }), n.broadcast?.("onNodesMove", { nodes: c }));
}
function Sr(n, t, e, s = !1) {
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
function kr(n) {
  return (n.freeNodes?.() ?? n.nodes.allNodes).map((t) => ({
    id: t.id,
    x: t.options.x || 0,
    y: t.options.y || 0
  }));
}
const Dd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  applyLayout: Sr,
  packageLayout: kr,
  removeLayoutOverlaps: Er
}, Symbol.toStringTag, { value: "Module" }));
class Ar {
  constructor(t, e = {}) {
    this.container = null, this.slider = null, this.label = null, this._viewObserver = null, this.slate = t, this.options = {
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
    this._viewObserver?.disconnect(), this._viewObserver = null, this.container && (this.container.remove(), this.container = null, this.slider = null, this.label = null);
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
      const r = parseFloat(this.slider.value);
      this.slate.zoom?.(r), this.update();
    }, this.container.appendChild(this.slider);
    const s = document.createElement("button");
    s.textContent = "+", s.style.cssText = "background:none;border:none;color:white;cursor:pointer;font-size:16px;padding:0 4px;", s.onclick = () => this.slate.zoomIn?.(), this.container.appendChild(s), this.label = document.createElement("span"), this.label.textContent = "100%", this.label.style.cssText = "min-width: 40px; text-align: right;", this.container.appendChild(this.label);
    const i = document.createElement("button");
    i.textContent = "⤢", i.title = "Fit to content", i.setAttribute("aria-label", "fitToContent"), i.style.cssText = "background:none;border:none;color:white;cursor:pointer;font-size:15px;padding:0 4px;line-height:1;", i.onclick = () => this.slate.fitToContent?.(), this.container.insertBefore(i, this.container.firstChild), this.slate.element.appendChild(this.container), this.update();
    const o = this.slate.canvas?.node;
    o && typeof MutationObserver < "u" && (this._viewObserver = new MutationObserver(() => this.update()), this._viewObserver.observe(o, { attributes: !0, attributeFilter: ["viewBox"] }));
  }
}
class Mr {
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
   * slate.extractPresentationLayout). Bbox is relative to the content top-left.
   */
  extractPresentationLayout() {
    const t = this.stops().filter((f) => !f.options?.isCategory);
    let e = 1 / 0, s = 1 / 0, i = -1 / 0, o = -1 / 0;
    t.forEach((f) => {
      const p = f.options || {};
      e = Math.min(e, p.x || 0), s = Math.min(s, p.y || 0), i = Math.max(i, (p.x || 0) + (p.width || 0)), o = Math.max(o, (p.y || 0) + (p.height || 0));
    }), isFinite(e) || (e = 0, s = 0, i = 0, o = 0);
    const r = { left: e, top: s, width: i - e, height: o - s }, a = new Map(t.map((f) => [f.id, f])), c = (f) => (f.relationships?.associations || []).map((p) => p.childId).filter((p) => a.has(p)), l = new Set(t.flatMap(c)), d = /* @__PURE__ */ new Set(), h = (f) => {
      if (d.has(f.id)) return null;
      d.add(f.id);
      const p = f.options || {}, g = c(f).map((m) => a.get(m)).filter(Boolean);
      return {
        nodeId: f.id,
        metrics: {
          rotation: Math.ceil(p.rotate?.rotationAngle || 0),
          bbox: {
            x: Number(((p.x || 0) - r.left).toFixed(2)),
            y: Number(((p.y || 0) - r.top).toFixed(2)),
            width: Number((p.width || 0).toFixed(2)),
            height: Number((p.height || 0).toFixed(2))
          }
        },
        description: p.text || p.description || "",
        image: p.image,
        numberOfChildrenNodes: g.length,
        childrenNodes: g.map(h).filter(Boolean)
      };
    }, u = t.filter((f) => !l.has(f.id)).map(h);
    for (const f of t)
      d.has(f.id) || u.push(h(f));
    return {
      presentationHeight: Math.ceil(r.height),
      presentationWidth: Math.ceil(r.width),
      nodes: u
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
    this.isActive = !1, this.currentStep = -1, this._animRaf !== null && (cancelAnimationFrame(this._animRaf), this._animRaf = null);
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
    this.currentStep = t;
    const s = this.steps[t], i = this.slate.nodes.one(s.nodeId);
    if (i)
      try {
        const o = i.options, r = o.width || 0, a = o.height || 0, c = (o.x || 0) + r / 2, l = (o.y || 0) + a / 2, h = this.slate.canvas.viewbox(), u = this.slate.panZoom.getViewportSize(), f = (o.rotate?.rotationAngle || 0) * Math.PI / 180, p = Math.abs(Math.cos(f)), g = Math.abs(Math.sin(f)), m = Math.max(1, r * p + a * g), b = Math.max(1, a * p + r * g), y = Math.min(
          this.zoomLevel > 0 ? this.zoomLevel : 1,
          0.9 * u.w / m,
          0.9 * u.h / b
        ), x = u.w / y, E = u.h / y, v = { x: c - x / 2, y: l - E / 2, width: x, height: E };
        this.animateViewbox(
          { x: h.x, y: h.y, width: h.width, height: h.height },
          v,
          e
        );
      } catch {
      }
  }
  /** Tween the canvas viewbox from → to over `duration` ms (easeInOutQuad). */
  animateViewbox(t, e, s) {
    const i = this.slate.canvas, o = (l, d, h, u) => {
      try {
        i.viewbox(l, d, h, u);
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
      const d = Math.min(1, (l - a) / s), h = r(d);
      o(
        t.x + (e.x - t.x) * h,
        t.y + (e.y - t.y) * h,
        t.width + (e.width - t.width) * h,
        t.height + (e.height - t.height) * h
      ), d < 1 ? this._animRaf = requestAnimationFrame(c) : this._animRaf = null;
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
const xn = class xn {
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
    if (this.selectedNodes = [], this.groupResizeRotate = null, this.enteredGroupId = null, this._coordinateIntervalId = null, this._lastPointerDown = null, this._windowPointerDownHandler = null, this._destroyed = !1, this._applyingRemote = 0, this._onlyHere = 0, this._held = /* @__PURE__ */ new Set(), this._loadsInFlight = /* @__PURE__ */ new Set(), this._hadGroupSelection = !1, this._emitDeferred = !1, this._emitQueue = [], this._birdsEyeTimeoutId = null, this._coordDisplayTimeoutId = null, this._nodeNotifyTimeoutId = null, this._liveRegion = null, this._announcementsHeld = 0, this._resizeObserver = null, this._dragPolicies = [], this._selectionListeners = [], this._selectionNoticeQueued = !1, this._policyAuthority = 0, this._governedDragNode = null, this._decoRefreshQueued = !1, typeof t == "string") {
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
      availableFilters: ir(),
      availableAnimations: Zs()
    };
  }
  init() {
    this.canvas = Mn().addTo(this.element), this.canvas.node.setAttribute("role", this.options.enabled === !1 ? "img" : "group"), this.canvas.node.setAttribute("aria-label", this.options.name || "Diagram canvas"), this.canvas.node.setAttribute("tabindex", "0"), this._liveRegion = document.createElement("div"), this._liveRegion.setAttribute("aria-live", "polite"), this._liveRegion.setAttribute("aria-atomic", "true"), this._liveRegion.style.cssText = "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;", this.element.appendChild(this._liveRegion), this.element.style.overflow = this.element.style.overflow || "hidden", getComputedStyle(this.element).position === "static" && (this.element.style.position = "relative");
    const t = this.canvas.node;
    t?.style && (t.style.width = "100%", t.style.height = "100%", t.style.display = "block"), t?.removeAttribute?.("width"), t?.removeAttribute?.("height"), t?.setAttribute?.("preserveAspectRatio", "xMidYMid slice");
    const e = this.element.getBoundingClientRect();
    this.options.viewPort = this.options.viewPort || {};
    const s = this.options.viewPort.originalWidth || Math.round(e.width) || 800, i = this.options.viewPort.originalHeight || Math.round(e.height) || 600;
    this.options.viewPort.originalWidth = s, this.options.viewPort.originalHeight = i;
    const o = this.options.viewPort.left ?? 0, r = this.options.viewPort.top ?? 0;
    this.canvas.viewbox(o, r, s, i), this._setupResizeObserver(), this.nodes = new _d(this), this.invoker = new kd(this), this.applyContainerStyle(), this.setupSelectionHandling(), this.options.viewPort?.showCoordinates && this.setupCoordinateCallbacks(), this.panZoom = new fr(this, this.options.panZoom), this.birdsEye = new pr(this, this.options.birdsEye), this.options.birdsEye?.enabled && (this._birdsEyeTimeoutId = setTimeout(() => {
      this._destroyed || this.birdsEye.enable();
    }, 200)), this.undoRedo = new Fe(this, {
      enabled: this.options.showUndoRedo !== !1
    }), this.undoRedo.snap?.(!0), this.multiSelection = new gr(this, {
      enabled: this.options.showMultiSelect !== !1
    }), this.grid = new mr(this, {
      enabled: this.options.viewPort?.showGrid || !1,
      gridSize: this.options.viewPort?.gridSize || 20,
      // Re-apply the persisted snap-to-grid setting so it survives reload.
      snapToGrid: this.options.viewPort?.snapToGrid || !1
    }), this.options.viewPort?.showGrid && this.grid.show(), this.keyboard = new yn(this), this.options.enabled !== !1 && this.keyboard.bindGlobal(), this.contextMenu = new yr(this), this.options.enabled !== !1 && this.contextMenu.enable(), this.collab = new vr(this), this.zoomSlider = new Ar(this, {
      enabled: this.options.showZoom || !1
    }), this.presentation = new Mr(this), this.makeResponsive(), this.options.viewPort?.showCoordinates && (this._coordDisplayTimeoutId = setTimeout(() => {
      this._destroyed || this.addCoordinateDisplay();
    }, 150));
  }
  /**
   * Destroy the Slate, cleaning up all sub-modules, timers, and event listeners.
   * Follows the PanZoom.ts pattern: clear timers → remove listeners → chain to owned objects.
   */
  destroy() {
    if (this._destroyed = !0, this._dragPolicies = [], this._governedDragNode = null, this._resizeObserver && (this._resizeObserver.disconnect(), this._resizeObserver = null), typeof window < "u") {
      const e = window;
      Array.isArray(e.__slateboxInstances) && (e.__slateboxInstances = e.__slateboxInstances.filter(
        (s) => s !== this
      ));
    }
    this._birdsEyeTimeoutId !== null && (clearTimeout(this._birdsEyeTimeoutId), this._birdsEyeTimeoutId = null), this._coordDisplayTimeoutId !== null && (clearTimeout(this._coordDisplayTimeoutId), this._coordDisplayTimeoutId = null), this._nodeNotifyTimeoutId !== null && (clearTimeout(this._nodeNotifyTimeoutId), this._nodeNotifyTimeoutId = null), this._coordinateIntervalId !== null && (clearInterval(this._coordinateIntervalId), this._coordinateIntervalId = null);
    const t = this.element.querySelector("#slate-coordinates");
    t && t.remove(), this.canvas.off("click"), this._windowPointerDownHandler && (window.removeEventListener("pointerdown", this._windowPointerDownHandler, !0), this._windowPointerDownHandler = null), this._lastPointerDown = null, this.panZoom && this.panZoom.destroy(), this.birdsEye && this.birdsEye.disable(), this.zoomSlider && this.zoomSlider.destroy(), this.keyboard && this.keyboard.unbindGlobal(), this.contextMenu && this.contextMenu.disable(), this.multiSelection && this.multiSelection.disable(), this.undoRedo && this.undoRedo.clear(), this.collab && this.collab.disconnect(), this.presentation && this.presentation.stop(), this.grid && this.grid.hide(), this.nodes && this.nodes.clear(), this.canvas && this.canvas.remove(), this._liveRegion && (this._liveRegion.remove(), this._liveRegion = null);
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
    if (!(this._destroyed || !t.length))
      if (typeof this.collab?.send == "function")
        this.collab.send(t);
      else
        for (const e of t) this.emitSlateChange(e.type, e.data);
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
    this.undoRedo && !xn.NON_UNDOABLE.has(t) && (t === "onNodeDeleted" && typeof this.undoRedo.snapAfterGesture == "function" ? this.undoRedo.snapAfterGesture() : this.undoRedo.snap?.());
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
      nodeOptions: rt(e.options)
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
      const s = this.element.getBoundingClientRect(), i = Math.max(1, Math.round(s.width)), o = Math.max(1, Math.round(s.height));
      if (i === t && o === e) return;
      const r = this.canvas.viewbox(), a = r.width / (t || i);
      t = i, e = o;
      const c = r.x + r.width / 2, l = r.y + r.height / 2, d = i * a, h = o * a;
      this.canvas.viewbox(c - d / 2, l - h / 2, d, h), this.options.viewPort = this.options.viewPort || {}, this.options.viewPort.originalWidth = i, this.options.viewPort.originalHeight = o;
    }), this._resizeObserver.observe(this.element);
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
      let l = 1 / 0, d = 1 / 0, h = -1 / 0, u = -1 / 0;
      t.forEach((f) => {
        const p = f.options.x ?? 0, g = f.options.y ?? 0, m = f.options.width ?? 0, b = f.options.height ?? 0;
        l = Math.min(l, p - 10), d = Math.min(d, g - 10), h = Math.max(h, p + m + 10), u = Math.max(u, g + b + 10);
      }), o = Math.abs(l), r = Math.abs(d), s = h - l, i = u - d, i > s && (a = "portrait");
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
        const s = t.x + t.width / 2, i = t.y + t.height / 2, r = t.y - 28;
        e.line(s, t.y, s, r).stroke({ color: "#4a90e2", width: 1 }).attr("pointer-events", "none");
        const a = e.circle(14).center(s, r).fill("#ffffff").stroke({ color: "#4a90e2", width: 2 }), c = (m) => {
          const b = a.node;
          b?.style && (b.style.cursor = m);
        };
        c("grab"), a.attr("pointer-events", "all");
        let l = !1, d = 0, h = { x: 0, y: 0 }, u = [];
        const f = () => {
          const m = e.node.getScreenCTM();
          return m ? { x: m.a * s + m.c * i + m.e, y: m.b * s + m.d * i + m.f } : { x: 0, y: 0 };
        }, p = (m) => {
          if (!l) return;
          let y = (Math.atan2(m.clientY - h.y, m.clientX - h.x) - d) * 180 / Math.PI;
          m.shiftKey && (y = Math.round(y / 15) * 15);
          const x = y * Math.PI / 180, E = Math.cos(x), v = Math.sin(x);
          u.forEach((w) => {
            const _ = w.cx - s, C = w.cy - i, S = s + _ * E - C * v, k = i + _ * v + C * E, M = w.node.options.width || 0, O = w.node.options.height || 0, P = w.node.options.rotate = w.node.options.rotate || {};
            P.rotationAngle = w.angle + y, w.node.position(S - M / 2, k - O / 2);
          });
        }, g = () => {
          l && (l = !1, c("grab"), window.removeEventListener("pointermove", p), window.removeEventListener("pointerup", g), this.broadcast("onNodesMove", {
            nodeOptions: this.selectedNodes.map((m) => rt(m.options))
          }), this.updateSelectionResizeRotate());
        };
        a.on("pointerdown", (m) => {
          m.preventDefault?.(), m.stopPropagation?.(), l = !0, h = f(), d = Math.atan2(m.clientY - h.y, m.clientX - h.x), u = this.selectedNodes.map((b) => ({
            node: b,
            cx: (b.options.x || 0) + (b.options.width || 0) / 2,
            cy: (b.options.y || 0) + (b.options.height || 0) / 2,
            angle: b.options.rotate?.rotationAngle || 0
          })), c("grabbing"), window.addEventListener("pointermove", p), window.addEventListener("pointerup", g);
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
      const a = r.svgGroup.bbox(), c = (a.x - s.x) * i, l = (a.y - s.y) * o, d = a.width * i, h = a.height * o;
      r.setSize(d, h), r.position(e.x + c, e.y + l);
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
    this._selectionNoticeQueued || this._selectionListeners.length === 0 || (this._selectionNoticeQueued = !0, queueMicrotask(() => {
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
  /** Deselect a single node. */
  deselectNode(t) {
    this.selectedNodes.includes(t) && (console.log("SELECTION_DEBUG: Deselecting node", t.id), this.selectedNodes = this.selectedNodes.filter((e) => e !== t), t.onDeselected(), this.selectionChanged(), this.selectedNodes.length === 0 ? this.disableGroupResizeRotate() : this.updateSelectionResizeRotate());
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
    const c = s + o / 2, l = i + r / 2, d = a * Math.PI / 180, h = Math.cos(d), u = Math.sin(d);
    let f = 1 / 0, p = 1 / 0, g = -1 / 0, m = -1 / 0;
    const b = [
      [s, i],
      [s + o, i],
      [s + o, i + r],
      [s, i + r]
    ];
    for (const [y, x] of b) {
      const E = y - c, v = x - l, w = c + E * h - v * u, _ = l + E * u + v * h;
      f = Math.min(f, w), p = Math.min(p, _), g = Math.max(g, w), m = Math.max(m, _);
    }
    return { minX: f, minY: p, maxX: g, maxY: m };
  }
  alignNodes(t, e) {
    const s = this.freeNodes(e || this.getSelectedNodes());
    !s || s.length < 2 || ["left", "right", "centerH", "top", "bottom", "middle"].includes(t) && this.moveToPositions(s, xr(t, s.map((i) => this.layoutBoxOf(i))));
  }
  /**
   * Evenly distribute the selected (or given) nodes along an axis so the gaps
   * between them are equal; the outermost two stay put. axis: horizontal |
   * vertical. Broadcasts onNodesMove. No-op for < 3 nodes.
   */
  distributeNodes(t, e) {
    const s = this.freeNodes(e || this.getSelectedNodes());
    !s || s.length < 3 || t !== "horizontal" && t !== "vertical" || this.moveToPositions(s, _r(t, s.map((i) => this.layoutBoxOf(i))));
  }
  layoutBoxOf(t) {
    const e = t.options;
    return { id: t.id, x: e.x || 0, y: e.y || 0, width: e.width || 0, height: e.height || 0, rotationAngle: e.rotate?.rotationAngle || 0 };
  }
  moveToPositions(t, e) {
    e.forEach((s, i) => t[i].position(s.x, s.y)), this.broadcast("onNodesMove", {
      nodeOptions: t.map((s) => rt(s.options))
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
    const s = "grp-" + se(8);
    return e.forEach((i) => {
      i.options.groupId = s;
    }), this.enteredGroupId = null, this.broadcast("onNodesMove", {
      nodeOptions: e.map((i) => rt(i.options))
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
        ...rt(o.options),
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
      nodeOptions: e.map((s) => rt(s.options))
    }), this.updateSelectionResizeRotate());
  }
  /** Unlock the selected (or given) nodes and their groups. */
  unlockNodes(t) {
    const e = this.freeNodes(this.expandToGroups(t || this.getSelectedNodes()));
    e.length && (e.forEach((s) => s.unlock()), this.broadcast("onNodesMove", {
      nodeOptions: e.map((s) => rt(s.options))
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
    return !t || this._dragPolicies.length === 0 ? null : fd(this._dragPolicies, t);
  }
  /**
   * What may be done to `node` right now. Ordinary notes can do everything; so can
   * governed notes while their host is changing them (withPolicyAuthority).
   */
  capabilitiesOf(t) {
    return this._dragPolicies.length === 0 || this._policyAuthority > 0 ? vi : this.governanceOf(t)?.capabilities ?? vi;
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
      for (const e of t)
        try {
          e.onDeselected();
        } catch {
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
    return pd(t, i, s.padding ?? 0);
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
    const s = te(this, t, e);
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
    await Pn(t, this, e, s), this.collab?.documentLoaded?.(), this.undoRedo?.clear?.(), this.undoRedo?.snap?.(!0);
  }
  /**
   * Take a snapshot of the current slate state.
   * Used by undo/redo system.
   *
   * @returns SlateJSON object (not stringified)
   */
  snapshot() {
    return ur(this);
  }
  // ─── Export API ─────────────────────────────────────────────────
  /**
   * Export the slate as an SVG string.
   */
  svg(t, e) {
    return Qs(this, t, e);
  }
  /**
   * Export the slate as a PNG (async).
   */
  async png(t, e) {
    return br(this, t, e);
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
  applyTheme(t, e, s) {
    Vo(this, t, e, s);
  }
  // ─── Layout API ─────────────────────────────────────────────────
  /** Remove overlapping nodes by pushing them apart */
  /** Optimize Layout: the shared tidy layout over the slate's notes, saved as one move. */
  removeLayoutOverlaps(t) {
    Er(this, t);
  }
  /** Apply pre-computed layout moves */
  applyLayout(t, e, s) {
    Sr(this, t, e, s);
  }
  /** Package current node positions for layout transfer */
  packageLayout() {
    return kr(this);
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
    await qo(this);
  }
};
xn.NON_UNDOABLE = /* @__PURE__ */ new Set([
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
let $e = xn;
function Ld(n, t) {
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
function zd(n, t) {
  const e = n.nodes.one(t);
  return !e || !e.options.isComment ? !1 : n.removeNode(t);
}
function Gd(n) {
  return n.nodes.allNodes.filter(
    (t) => t.options.isComment === !0
  );
}
const Bd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createComment: Ld,
  getComments: Gd,
  removeComment: zd
}, Symbol.toStringTag, { value: "Module" }));
function ht(n) {
  return !!n && typeof n == "object" && !Array.isArray(n);
}
const Hd = /^(#[0-9a-f]{3,8}|(rgb|rgba|hsl|hsla)\([\d\s.,%+-]{1,60}\)|[a-z]{3,30}|transparent)$/i, Fd = /^https?:\/\/[^\s]+$/i, Tr = 2e3, $d = /^[A-Za-z0-9_-]{1,64}$/;
function bs(n, t) {
  if (typeof t != "string") return;
  const e = t.trim().toLowerCase();
  return n.find((s) => s.toLowerCase() === e);
}
function ot(n, t, e) {
  switch (n.type) {
    case "string":
      return t === null && n.nullable ? null : typeof t != "string" ? `${e} must be a string.` : t.length > n.maxLength ? `${e} must be at most ${n.maxLength} characters.` : n.minLength && t.trim().length < n.minLength ? `${e} must not be empty.` : null;
    case "number":
      return typeof t != "number" || !Number.isFinite(t) || t < n.min || t > n.max ? `${e} must be a number from ${n.min} to ${n.max}.` : null;
    case "boolean":
      return typeof t == "boolean" ? null : `${e} must be true or false.`;
    case "enum":
      return t === null && n.nullable || (n.caseless ? bs(n.values, t) : n.values.find((i) => i === t)) !== void 0 ? null : `${e} must be one of: ${n.values.join(", ")}.`;
    case "color":
      return typeof t == "string" && Hd.test(t.trim()) ? null : `${e} must be a colour such as #336699 or rgb(51, 102, 153).`;
    case "point":
      return ht(t) && Object.keys(t).every((s) => s === "x" || s === "y") && [t.x, t.y].every((s) => typeof s == "number" && Number.isFinite(s) && Math.abs(s) <= 1e6) ? null : `${e} must be a point {x, y} with numbers from -1000000 to 1000000.`;
    case "object":
      return ht(t) ? null : `${e} must be an object.`;
    case "url":
      return t === null && n.nullable || typeof t == "string" && t.length <= Tr && Fd.test(t.trim()) ? null : `${e} must be an http or https address${n.nullable ? ", or null to remove it" : ""}.`;
    case "id":
      return t === null && n.nullable || typeof t == "string" && $d.test(t) ? null : `${e} must be 1 to 64 letters, digits, _ or -${n.nullable ? ", or null" : ""}.`;
  }
}
function $t(n) {
  switch (n.type) {
    case "string":
      return { type: n.nullable ? ["string", "null"] : "string", maxLength: n.maxLength, ...n.minLength ? { minLength: n.minLength } : {} };
    case "number":
      return { type: "number", minimum: n.min, maximum: n.max };
    case "boolean":
      return { type: "boolean" };
    case "enum":
      return n.nullable ? { type: ["string", "null"], enum: [...n.values, null] } : { type: "string", enum: [...n.values] };
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
        maxLength: Tr,
        pattern: "^https?://\\S+$",
        description: "An http or https address."
      };
    case "id":
      return { type: n.nullable ? ["string", "null"] : "string", pattern: "^[A-Za-z0-9_-]{1,64}$" };
  }
}
const _t = (n) => ({
  store: (t, e) => {
    t[n] = e;
  },
  read: (t) => t[n]
}), Ud = ["solid", "dashed", "dotted", "combo"], Yd = Object.freeze(["dropShadow", "blur", "outline", "postItNote", "pencil"]), jd = ["front", "back"], Xd = ["left", "middle", "right"], qd = ["top", "middle", "bottom"], X = {
  text: { spec: () => ({ type: "string", maxLength: 1e4 }), description: "The note's text.", ..._t("text") },
  shape: {
    spec: (n) => ({ type: "enum", values: n.shapes, caseless: !0 }),
    description: "A shape registered with the engine.",
    store: (n, t, e) => {
      const s = bs(e.shapes, t);
      n.shape = s, n.vectorPath = s, n.shapeHint = s;
    },
    read: (n) => n.shape || n.shapeHint || n.vectorPath || "rectangle"
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
  width: { spec: () => ({ type: "number", min: 20, max: 5e3 }), description: "Width in canvas units.", ..._t("width") },
  height: { spec: () => ({ type: "number", min: 20, max: 5e3 }), description: "Height in canvas units.", ..._t("height") },
  rotationAngle: {
    spec: () => ({ type: "number", min: -360, max: 360 }),
    description: "Rotation in degrees.",
    store: (n, t) => {
      n.rotate = { ...n.rotate || {}, rotationAngle: t }, delete n.rotationAngle;
    },
    read: (n) => Number(n.rotate?.rotationAngle ?? 0)
  },
  backgroundColor: { spec: () => ({ type: "color" }), description: "Fill colour.", ..._t("backgroundColor") },
  foregroundColor: {
    spec: () => ({ type: "color" }),
    description: "Text colour.",
    store: (n, t) => {
      n.foregroundColor = t, n.fontColor = t;
    },
    read: (n) => n.fontColor ?? n.foregroundColor
  },
  borderColor: { spec: () => ({ type: "color" }), description: "Border colour.", ..._t("borderColor") },
  borderWidth: { spec: () => ({ type: "number", min: 0, max: 100 }), description: "Border width.", ..._t("borderWidth") },
  borderOpacity: { spec: () => ({ type: "number", min: 0, max: 1 }), description: "Border opacity from 0 to 1.", ..._t("borderOpacity") },
  borderStyle: {
    spec: () => ({ type: "enum", values: Ud }),
    description: "Border line style.",
    ..._t("borderStyle")
  },
  opacity: { spec: () => ({ type: "number", min: 0, max: 1 }), description: "Note opacity from 0 to 1.", ..._t("opacity") },
  fontFamily: {
    spec: (n) => ({ type: "enum", values: n.fonts, caseless: !0 }),
    description: "A font this instance offers.",
    store: (n, t, e) => {
      n.fontFamily = bs(e.fonts, t);
    },
    read: (n) => n.fontFamily
  },
  fontSize: { spec: () => ({ type: "number", min: 1, max: 500 }), description: "Font size.", ..._t("fontSize") },
  textXAlign: { spec: () => ({ type: "enum", values: Xd }), description: "Horizontal text alignment.", ..._t("textXAlign") },
  textYAlign: { spec: () => ({ type: "enum", values: qd }), description: "Vertical text alignment.", ..._t("textYAlign") },
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
  locked: {
    spec: () => ({ type: "boolean" }),
    description: "A locked note cannot be moved, changed or deleted until it is unlocked.",
    store: (n, t) => {
      n.isLocked = t;
    },
    read: (n) => n.isLocked === !0
  }
}, In = {
  order: {
    spec: { type: "enum", values: jd },
    description: "Bring the note to the front or send it to the back."
  }
}, Zd = [...Object.keys(X), ...Object.keys(In)], Wd = /* @__PURE__ */ new Set(["text", "shape", "x", "y", "width", "height"]), Nr = Object.keys(X).filter((n) => !Wd.has(n)), vs = [
  "add_nodes",
  "update_nodes",
  "delete_nodes",
  "duplicate_nodes",
  "connect_nodes",
  "disconnect_nodes",
  "update_connections",
  "arrange_nodes",
  "update_slate"
], Or = {
  add_nodes: ["kind", "count", "shape", "preset", "text", "ids", "x", "y", "width", "height", "placement", "style"],
  update_nodes: ["kind", "target", "changes"],
  delete_nodes: ["kind", "target"],
  duplicate_nodes: ["kind", "target", "offset", "ids"],
  connect_nodes: ["kind", "from", "to", "ids", "style"],
  disconnect_nodes: ["kind", "from", "to", "connectionIds"],
  update_connections: ["kind", "from", "to", "connectionIds", "changes"],
  arrange_nodes: ["kind", "target", "layout", "gap"],
  update_slate: ["kind", "changes"]
}, Rr = ["left", "right", "above", "below", "center"], Pr = ["row", "column", "grid"], Vd = ["align-left", "align-center", "align-right", "align-top", "align-middle", "align-bottom"], Kd = ["distribute-horizontal", "distribute-vertical"], Ir = ["row", "column", "grid", "circle", ...Vd, ...Kd, "tidy", "tree"], Dr = ["text", "sticky"], Jd = 75, Qd = Object.freeze({ x: 20, y: 20 }), tu = Object.freeze({
  operationsPerPlan: 50,
  notesPerAdd: 20,
  notesPerSlate: 1e3,
  connectorsPerOperation: 400,
  connectorsPerSlate: 5e3
}), Ai = /^(?!__free_)[A-Za-z0-9_-]{1,64}$/, Mi = 200, eu = Object.freeze([
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
  "Urbanist"
]);
function ti(n = {}) {
  return {
    shapes: [...n.shapes ?? rr()],
    fonts: [...n.fonts ?? eu],
    animations: Object.keys(Zs()),
    effects: [...Yd]
  };
}
function ei(n = {}) {
  return { ...tu, ...n.limits || {} };
}
class Ct extends Error {
  constructor(t, e, s, i) {
    super(s), this.name = "OperationPlanError", this.code = t, this.status = e, i && (this.details = i);
  }
}
const nu = ["bezier", "orthogonal", "straight", "linear", "curved"], su = ["cubic", "quadratic"], be = {
  label: { spec: { type: "string", maxLength: 500 }, description: "Text shown on the connector." },
  lineColor: { spec: { type: "color" }, description: "Line colour." },
  lineWidth: { spec: { type: "number", min: 0.1, max: 100 }, description: "Line width." },
  lineOpacity: { spec: { type: "number", min: 0, max: 1 }, description: "Line opacity from 0 to 1." },
  lineType: { spec: { type: "enum", values: nu }, description: "Path style." },
  lineCurveType: { spec: { type: "enum", values: su }, description: "Curve type." },
  lineCurviness: { spec: { type: "number", min: 0, max: 1 }, description: "How much the line bends." },
  showParentArrow: { spec: { type: "boolean" }, description: "Arrowhead at the starting note." },
  showChildArrow: { spec: { type: "boolean" }, description: "Arrowhead at the far end." },
  toPoint: {
    spec: { type: "point" },
    description: "Move a free end to this point. Only for a connector whose far end is not on a note.",
    field: "targetPoint"
  }
}, Lr = Object.keys(be).filter((n) => n !== "toPoint"), jn = { lineColor: "#333333", lineWidth: 3, lineType: "bezier" }, ws = "__free_", zr = ["linear", "radial"], Gr = ["horizontal", "vertical", "diagonal"], sn = (n) => ({
  store: (t, e) => {
    t.options[n] = e;
  }
}), Ti = (n) => ({
  store: (t, e) => {
    t.options.viewPort = { ...t.options.viewPort || {}, [n]: e };
  }
}), Ue = {
  name: { spec: { type: "string", minLength: 1, maxLength: 200 }, description: "The slate's name.", ...sn("name") },
  description: { spec: { type: "string", maxLength: 5e3 }, description: "The slate's description.", ...sn("description") },
  background: {
    spec: { type: "object" },
    description: "Canvas background: {color, gradient?: {type, colors, direction?}}.",
    store: (n, t) => {
      const e = { ...n.options.containerStyle || {}, ...Br(t) };
      delete e.backgroundImage, delete e.backgroundEffect, n.options.containerStyle = e;
    }
  },
  mindMapMode: {
    spec: { type: "boolean" },
    description: "Mind map mode: a theme colours notes by their depth in the connected tree.",
    ...sn("mindMapMode")
  },
  autoResizeNodesBasedOnText: {
    spec: { type: "boolean" },
    description: "Notes grow to fit their text while it is typed.",
    ...sn("autoResizeNodesBasedOnText")
  },
  showGrid: { spec: { type: "boolean" }, description: "Show the grid behind the canvas.", ...Ti("showGrid") },
  snapToObjects: { spec: { type: "boolean" }, description: "A dragged note snaps to the edges of its neighbours.", ...Ti("snapToObjects") },
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
function iu(n, t) {
  if (!ht(n)) return [`${t} must be an object {color, gradient?}.`];
  const e = [];
  for (const i of Object.keys(n))
    i !== "color" && i !== "gradient" && e.push(`${t} has an unknown field: ${i}.`);
  const s = ot({ type: "color" }, n.color, `${t}.color`);
  if (s && e.push(s), n.gradient !== void 0) {
    const i = n.gradient;
    if (!ht(i)) return [...e, `${t}.gradient must be an object {type, colors, direction?}.`];
    for (const r of Object.keys(i))
      ["type", "colors", "direction"].includes(r) || e.push(`${t}.gradient has an unknown field: ${r}.`);
    const o = ot({ type: "enum", values: zr }, i.type, `${t}.gradient.type`);
    if (o && e.push(o), i.direction !== void 0) {
      const r = ot({ type: "enum", values: Gr }, i.direction, `${t}.gradient.direction`);
      r && e.push(r);
    }
    !Array.isArray(i.colors) || i.colors.length < 2 || i.colors.length > 8 ? e.push(`${t}.gradient.colors must list 2 to 8 colours.`) : i.colors.forEach((r, a) => {
      const c = ot({ type: "color" }, r, `${t}.gradient.colors[${a}]`);
      c && e.push(c);
    });
  }
  return e;
}
function Br(n) {
  return {
    backgroundColor: n.color,
    backgroundColorAsGradient: !!n.gradient,
    backgroundGradientType: n.gradient?.type ?? "linear",
    backgroundGradientColors: n.gradient?.colors ?? [],
    backgroundGradientStrategy: n.gradient?.direction ?? "horizontal"
  };
}
function ou() {
  return {
    type: "object",
    additionalProperties: !1,
    required: ["color"],
    properties: {
      color: $t({ type: "color" }),
      gradient: {
        type: "object",
        additionalProperties: !1,
        required: ["type", "colors"],
        properties: {
          type: { type: "string", enum: [...zr] },
          colors: { type: "array", minItems: 2, maxItems: 8, items: $t({ type: "color" }) },
          direction: { type: "string", enum: [...Gr] }
        }
      }
    }
  };
}
const ru = ["ids", "text", "match", "all", "within", "groupId"], au = ["ids", "text", "within", "groupId"];
function Ae(n, t) {
  if (!ht(n)) return [`${t} must be a selector such as {ids: [...]}, {text}, {within}, {groupId} or {all: true}.`];
  const e = [];
  for (const i of Object.keys(n))
    ru.includes(i) || e.push(`${t} has an unknown field: ${i}.`);
  const s = au.filter((i) => n[i] !== void 0);
  if (s.length > 1 && e.push(`${t} must name notes one way, not by ${s.join(" and ")}.`), !s.length && n.all !== !0 && e.push(`${t} must name notes by ids, text, within, groupId or all: true.`), n.ids !== void 0 && (!Array.isArray(n.ids) || !n.ids.length || n.ids.some((i) => typeof i != "string" || !i)) && e.push(`${t}.ids must be a list of note ids.`), n.text !== void 0 && (typeof n.text != "string" || !n.text.trim()) && e.push(`${t}.text must be the text of a note.`), n.match !== void 0) {
    n.text === void 0 && e.push(`${t}.match goes with text.`);
    const i = ot({ type: "enum", values: ["exact", "contains"] }, n.match, `${t}.match`);
    i && e.push(i);
  }
  if (n.all !== void 0 && n.all !== !0 && e.push(`${t}.all must be true when given.`), n.groupId !== void 0 && (typeof n.groupId != "string" || !n.groupId) && e.push(`${t}.groupId must be a group id.`), n.within !== void 0) {
    const i = n.within;
    ht(i) && Object.keys(i).every((r) => ["x", "y", "width", "height"].includes(r)) && ["x", "y", "width", "height"].every((r) => typeof i[r] == "number" && Number.isFinite(i[r])) && i.width > 0 && i.height > 0 || e.push(`${t}.within must be {x, y, width, height} with a positive width and height.`);
  }
  return e;
}
function cu() {
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
const lu = /\b(theme|background|canvas|palette|gradient|recolor|colour|color scheme)\b/i, Hr = /\b(clear|replace|reset|start over|delete all|remove all)\b/i;
function Me(n, t, e, s, i, { required: o = !0, plural: r = `${s}s` } = {}) {
  const a = [];
  if (n === void 0 && !o) return a;
  if (!ht(n) || o && !Object.keys(n).length)
    return [o ? `${e} requires at least one ${s}.` : `${e} ${r} must be an object.`];
  const c = Object.keys(n).filter((l) => !t.includes(l));
  c.length && a.push(`${e} contains unsupported ${r}: ${c.join(", ")}.`);
  for (const [l, d] of Object.entries(n))
    t.includes(l) && i(l, d, a);
  return a;
}
function Ni(n, t) {
  return (e, s, i) => {
    const o = In[e]?.spec ?? X[e].spec(n), r = ot(o, s, `${t} ${e}`);
    r && i.push(r);
  };
}
function Oi(n) {
  return (t, e, s) => {
    const i = ot(be[t].spec, e, `${n} ${t}`);
    i && s.push(i);
  };
}
function Ot(n) {
  return Array.isArray(n) && n.length > 0 && n.every((t) => typeof t == "string" && t.length > 0);
}
function hu(n, t = {}) {
  const e = ti(t), s = ei(t), i = t.userMessage || "";
  if (!ht(n)) return { valid: !1, errors: ["The operation plan must be an object."] };
  const o = [];
  for (const h of Object.keys(n))
    h !== "message" && h !== "operations" && o.push(`The plan has an unknown field: ${h}.`);
  (typeof n.message != "string" || !n.message.trim()) && o.push("A natural completion message is required."), !Array.isArray(n.operations) || n.operations.length === 0 ? o.push("At least one slate operation is required.") : n.operations.length > s.operationsPerPlan && o.push(`A plan cannot contain more than ${s.operationsPerPlan} operations.`);
  const r = !!t.existingNodeIds?.length, a = new Set((t.existingNodeIds || []).filter(Boolean)), c = !!t.existingConnectionIds?.length, l = new Set((t.existingConnectionIds || []).filter(Boolean)), d = (h, u) => {
    r && ht(h) && Array.isArray(h.ids) && h.ids.some((f) => !a.has(f)) && o.push(`${u} references notes that are not in the slate.`);
  };
  return (Array.isArray(n.operations) ? n.operations : []).forEach((h, u) => {
    const f = `Operation ${u + 1}`;
    if (!ht(h) || !vs.includes(h.kind)) {
      o.push(`${f} has an unsupported kind.`);
      return;
    }
    const p = Or[h.kind], g = Object.keys(h).filter((m) => !p.includes(m));
    for (const m of g) o.push(`${f} has an unknown field: ${m}.`);
    switch (h.kind) {
      case "add_nodes": {
        if ((!Number.isInteger(h.count) || h.count < 1 || h.count > s.notesPerAdd) && o.push(`${f} count must be an integer from 1 to ${s.notesPerAdd}.`), h.preset !== void 0) {
          const y = ot({ type: "enum", values: Dr }, h.preset, `${f} preset`);
          y && o.push(y);
        }
        const m = ht(h.placement) && h.placement.connect === !0;
        if (h.shape !== void 0 || h.preset === void 0 && !m) {
          const y = ot(X.shape.spec(e), h.shape, `${f} shape`);
          y && o.push(y);
        }
        for (const y of ["text", "width", "height"]) {
          if (h[y] === void 0) continue;
          const x = ot(X[y].spec(e), h[y], `${f} ${y}`);
          x && o.push(x);
        }
        h.x === void 0 != (h.y === void 0) && o.push(`${f} needs both x and y, or neither.`);
        for (const y of ["x", "y"]) {
          if (h[y] === void 0) continue;
          const x = ot(X[y].spec(e), h[y], `${f} ${y}`);
          x && o.push(x);
        }
        h.ids !== void 0 && (!Ot(h.ids) || new Set(h.ids).size !== h.ids.length ? o.push(`${f} ids must be a list of different note ids.`) : h.ids.some((y) => !Ai.test(y)) ? o.push(`${f} ids must be 1 to 64 letters, digits, _ or -, and must not start with __free_.`) : Number.isInteger(h.count) && h.ids.length > h.count && o.push(`${f} has more ids than notes to add.`));
        const b = h.placement;
        if (b !== void 0)
          if (!ht(b))
            o.push(`${f} placement must be an object.`);
          else {
            const y = h.x !== void 0 ? ["arrangement", "gap", ...b.connect === !0 ? ["relativeTo", "connect"] : []] : ["relativeTo", "direction", "arrangement", "gap", "connect"];
            for (const x of Object.keys(b))
              y.includes(x) || o.push(
                h.x !== void 0 && ["relativeTo", "direction", "connect"].includes(x) ? `${f} gives x and y, so placement cannot also give ${x}.` : `${f} placement has an unknown field: ${x}.`
              );
            b.connect !== void 0 && (typeof b.connect != "boolean" ? o.push(`${f} placement.connect must be true or false.`) : b.connect && (b.relativeTo === void 0 && o.push(`${f} placement.connect needs relativeTo, the note to copy and connect from.`), b.direction === "center" && o.push(`${f} cannot connect a note placed at the centre of another; choose left, right, above or below.`))), b.relativeTo !== void 0 && typeof b.relativeTo != "string" ? o.push(`${f} placement.relativeTo must be a note id.`) : b.relativeTo && r && !a.has(b.relativeTo) && o.push(`${f} references a note that is not in the slate.`);
            for (const [x, E] of [["direction", Rr], ["arrangement", Pr]]) {
              if (b[x] === void 0) continue;
              const v = ot({ type: "enum", values: E }, b[x], `${f} placement.${x}`);
              v && o.push(v);
            }
            if (b.gap !== void 0) {
              const x = ot({ type: "number", min: 0, max: 2e3 }, b.gap, `${f} placement.gap`);
              x && o.push(x);
            }
          }
        o.push(...Me(h.style, Nr, f, "node style", Ni(e, f), { required: !1 })), Ot(h.ids) && h.ids.forEach((y) => a.add(y));
        return;
      }
      case "update_nodes":
      case "delete_nodes":
      case "arrange_nodes": {
        const m = Ae(h.target, `${f} target`);
        if (o.push(...m), m.length || d(h.target, f), h.kind === "update_nodes" && o.push(...Me(h.changes, Zd, f, "node change", Ni(e, f), { plural: "changes" })), h.kind === "delete_nodes" && ht(h.target) && h.target.all === !0 && Object.keys(h.target).length === 1 && !Hr.test(i) && o.push(`${f} cannot delete every note without an explicit request.`), h.kind === "arrange_nodes") {
          const b = ot({ type: "enum", values: Ir }, h.layout, `${f} layout`);
          if (b && o.push(b), h.gap !== void 0) {
            const y = ot({ type: "number", min: 0, max: 2e3 }, h.gap, `${f} gap`);
            y && o.push(y);
          }
        }
        return;
      }
      case "duplicate_nodes": {
        const m = Ae(h.target, `${f} target`);
        if (o.push(...m), m.length || d(h.target, f), h.offset !== void 0) {
          const b = ot({ type: "point" }, h.offset, `${f} offset`);
          b && o.push(b);
        }
        h.ids !== void 0 && (!Ot(h.ids) || new Set(h.ids).size !== h.ids.length ? o.push(`${f} ids must be a list of different note ids.`) : h.ids.some((b) => !Ai.test(b)) ? o.push(`${f} ids must be 1 to 64 letters, digits, _ or -, and must not start with __free_.`) : ht(h.target) && Ot(h.target.ids) && h.ids.length > h.target.ids.length && o.push(`${f} has more ids than notes to copy.`)), Ot(h.ids) && h.ids.forEach((b) => a.add(b));
        return;
      }
      case "connect_nodes": {
        const m = Ae(h.from, `${f} from`);
        if (o.push(...m), m.length || d(h.from, f), ht(h.to) && h.to.point !== void 0) {
          Object.keys(h.to).length !== 1 && o.push(`${f} to must be a note selector or {point}, not both.`);
          const x = ot({ type: "point" }, h.to.point, `${f} to.point`);
          x && o.push(x);
        } else {
          const x = Ae(h.to, `${f} to`);
          o.push(...x), x.length || d(h.to, f);
        }
        h.ids !== void 0 && (!Ot(h.ids) || new Set(h.ids).size !== h.ids.length ? o.push(`${f} ids must be a list of different connector ids.`) : h.ids.some((x) => x.length > Mi) && o.push(`${f} connector ids can be at most ${Mi} characters.`)), o.push(...Me(h.style, Lr, f, "connection style", Oi(f), { required: !1 })), Ot(h.ids) && h.ids.forEach((x) => l.add(x));
        const b = h.from?.ids, y = h.to?.ids;
        Ot(b) && Ot(y) && b.forEach((x) => y.forEach((E) => l.add(`${x}->${E}`)));
        return;
      }
      case "disconnect_nodes":
      case "update_connections": {
        const m = h.connectionIds !== void 0, b = h.from !== void 0 || h.to !== void 0;
        if (m && b && o.push(`${f} names connectors by connectionIds or by from and to, not both.`), !m && !b && o.push(`${f} requires connectionIds or both from and to note selectors.`), m && (Ot(h.connectionIds) ? c && h.connectionIds.some((y) => !l.has(y)) && o.push(`${f} references connectors that are not in the slate.`) : o.push(`${f} connectionIds must be a list of connector ids.`)), b)
          for (const y of ["from", "to"]) {
            const x = Ae(h[y], `${f} ${y}`);
            o.push(...x), x.length || d(h[y], f);
          }
        h.kind === "update_connections" && o.push(...Me(h.changes, Object.keys(be), f, "connection change", Oi(f)));
        return;
      }
      case "update_slate": {
        o.push(
          ...Me(h.changes, Object.keys(Ue), f, "slate change", (m, b, y) => {
            if (m === "background") {
              y.push(...iu(b, `${f} background`));
              return;
            }
            const x = ot(Ue[m].spec, b, `${f} ${m}`);
            x && y.push(x);
          })
        ), ht(h.changes) && h.changes.background !== void 0 && !lu.test(i) && o.push(`${f} cannot change the canvas background unless the user explicitly asks for it.`);
        return;
      }
    }
  }), { valid: o.length === 0, errors: o };
}
const D = (n) => n.options.id, Mt = (n, t) => X[t].read(n.options), Pt = (n) => ({
  x: Mt(n, "x"),
  y: Mt(n, "y"),
  width: Number(n.options.width ?? 120),
  height: Number(n.options.height ?? 80)
}), Xn = (n) => !!n.targetPoint || `${n.childId || ""}`.startsWith(ws), Oe = (n, t) => `${n}->${t}`;
function wn(n) {
  return JSON.parse(JSON.stringify(n ?? null));
}
function Fr(n) {
  const t = n?.nodes && !Array.isArray(n.nodes), e = t ? n.v2 ?? n : null, s = t ? {
    options: wn(e.options || {}),
    nodes: (e.freeNodes?.() ?? e.nodes.allNodes ?? []).map((i) => du(i?.v2 ?? i))
  } : wn(n || {});
  return s.options || (s.options = {}), s.nodes = (Array.isArray(s.nodes) ? s.nodes : []).map((i) => {
    const o = i?.options ? i : { options: { ...i || {} }, relationships: i?.relationships };
    return o.options.relationships && delete o.options.relationships, o.relationships = { ...o.relationships || {}, associations: [...o.relationships?.associations || []] }, o.relationships.associations.forEach((r) => {
      r.parentId || (r.parentId = o.options.id), r.id || (r.id = Oe(r.parentId, r.childId));
    }), o;
  }), s;
}
function du(n) {
  const t = wn(n.options || {});
  t.x !== void 0 && (t.xPos = t.x, delete t.x), t.y !== void 0 && (t.yPos = t.y, delete t.y), t.fontColor !== void 0 && t.foregroundColor === void 0 && (t.foregroundColor = t.fontColor);
  const e = typeof n.getRotation == "function" ? n.getRotation() : void 0;
  typeof e == "number" && (t.rotate = { ...t.rotate || {}, rotationAngle: e });
  const s = n.relationships, i = typeof s?.getAssociations == "function" ? s.getAssociations() : Array.from(s?.associations || []);
  return {
    options: t,
    relationships: {
      associations: i.map(({ parent: o, child: r, ...a }) => wn(a))
    }
  };
}
function Kt(n) {
  const t = /* @__PURE__ */ new Set(), e = [];
  for (const s of n.nodes)
    for (const i of s.relationships.associations)
      t.has(i.id) || (t.add(i.id), e.push({ node: s, association: i }));
  return e;
}
const qn = (n) => `${n ?? ""}`.replace(/\s+/g, " ").trim().toLowerCase();
function Ht(n, t, e) {
  const s = n.nodes;
  if (t.ids)
    return t.ids.map((i) => s.find((o) => D(o) === i)).filter(Boolean);
  if (t.text !== void 0) {
    const i = qn(t.text), o = s.filter(
      (r) => t.match === "contains" ? qn(r.options.text).includes(i) : qn(r.options.text) === i
    );
    if (o.length > 1 && t.all !== !0)
      throw new Ct(
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
      const r = Pt(o);
      return r.x >= i.x && r.y >= i.y && r.x + r.width <= i.x + i.width && r.y + r.height <= i.y + i.height;
    });
  }
  return t.groupId !== void 0 ? s.filter((i) => i.options.groupId === t.groupId) : t.all === !0 ? [...s] : [];
}
function uu() {
  const n = "abcdefghijklmnopqrstuvwxyz0123456789";
  let t = "";
  for (let e = 0; e < 12; e += 1) t += n[Math.floor(Math.random() * n.length)];
  return t;
}
function fu(n) {
  const t = (o) => {
    const r = (parseInt(o, 16) || 0) / 255;
    return r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  }, e = (o) => 0.2126 * t(o.substr(1, 2)) + 0.7152 * t(o.substr(3, 2)) + 0.0722 * t(o.substr(-2)), s = (o, r) => {
    const [a, c] = [e(o), e(r)];
    return (Math.max(a, c) + 0.05) / (Math.min(a, c) + 0.05);
  }, i = /^#[0-9a-f]{6}$/i.test(n) ? n : "#7aa2c8";
  return s(i, "#ffffff") > s(i, "#000000") ? "#ffffff" : "#000000";
}
function pu(n, t, e) {
  return n.x < t.x + t.width + e && n.x + n.width + e > t.x && n.y < t.y + t.height + e && n.y + n.height + e > t.y;
}
function gu(n, t, e, s, i, o) {
  let r = n;
  for (let a = 0; a <= t.length; a += 1) {
    const c = t.filter((h) => r.some((u) => pu({ ...u, width: e, height: s }, h, o)));
    if (!c.length) return r;
    let l = 0, d = 0;
    i === "left" ? l = Math.min(...c.map((h) => h.x - o)) - Math.max(...r.map((h) => h.x + e)) : i === "above" ? d = Math.min(...c.map((h) => h.y - o)) - Math.max(...r.map((h) => h.y + s)) : i === "below" || i === "center" ? d = Math.max(...c.map((h) => h.y + h.height + o)) - Math.min(...r.map((h) => h.y)) : l = Math.max(...c.map((h) => h.x + h.width + o)) - Math.min(...r.map((h) => h.x)), r = r.map((h) => ({ x: h.x + l, y: h.y + d }));
  }
  return r;
}
function $r(n, t) {
  if (t) {
    const e = n.nodes.find((i) => D(i) === t);
    if (e) return e;
    const s = n.nodes.filter((i) => `${i.options.text ?? ""}`.trim().toLowerCase() === t.trim().toLowerCase());
    if (s.length === 1) return s[0];
  }
  return [...n.nodes].sort((e, s) => Pt(s).x + Pt(s).width - (Pt(e).x + Pt(e).width))[0];
}
function xs(n, t) {
  const e = t === "grid" ? Math.ceil(Math.sqrt(n)) : n;
  return Array.from({ length: n }, (s, i) => ({
    row: t === "column" ? i : t === "grid" ? Math.floor(i / e) : 0,
    column: t === "column" ? 0 : t === "grid" ? i % e : i
  }));
}
function mu(n, t, e, s) {
  const i = t.count, o = t.placement || {}, r = o.gap ?? (o.connect ? Jd : 48);
  if (t.x !== void 0 && t.y !== void 0) {
    const u = o.arrangement || "row";
    return { points: xs(i, u).map(({ row: p, column: g }) => ({
      x: t.x + g * (e + r),
      y: t.y + p * (s + r)
    })), arrangement: u, gap: r };
  }
  const a = $r(n, o.relativeTo), c = a ? Pt(a) : { x: 0, y: 0, width: 160, height: 100 }, l = o.direction || "right", d = o.arrangement || (["left", "right"].includes(l) ? "column" : "row"), h = xs(i, d).map(({ row: u, column: f }) => {
    let p = c.x + f * (e + r), g = c.y + u * (s + r);
    return l === "right" && (p += c.width + r), l === "left" && (p -= e + r), l === "below" && (g += c.height + r), l === "above" && (g -= s + r), { x: p, y: g };
  });
  return { points: gu(h, n.nodes.map(Pt), e, s, l, r), arrangement: d, gap: r };
}
function yu(n, t) {
  if (!n) return { childId: `${ws}${t()}` };
  const e = n.match(/->(__free_.+)$/);
  return { id: n, childId: e ? e[1] : `${ws}${n.replace(/[^A-Za-z0-9_-]/g, "_")}` };
}
function Zn(n, t) {
  if (!n.has(t)) return t;
  let e = 2;
  for (; n.has(`${t}~${e}`); ) e += 1;
  return `${t}~${e}`;
}
const Wn = (n, t) => JSON.stringify([n, t]);
function Vn(n, t, e) {
  return new Ct(
    "id_taken",
    409,
    `${n} names ${t} ids already in use: ${e.join(", ")}. Choose new ids, or name the existing ${t}s in a later operation.`,
    { ids: e }
  );
}
const Ri = (n, t) => JSON.stringify(n) === JSON.stringify(t), bu = ["id", "name", "text", "xPos", "yPos", "x", "y", "isLocked"], Kn = (n) => JSON.parse(JSON.stringify(n)), on = 1e6, Pi = {
  "align-left": "left",
  "align-center": "centerH",
  "align-right": "right",
  "align-top": "top",
  "align-middle": "middle",
  "align-bottom": "bottom"
}, de = (n) => ({ id: D(n), ...Pt(n), rotationAngle: Mt(n, "rotationAngle") });
function Ii(n, t, e = {}) {
  const s = ti(e), i = ei(e), o = e.idFactory || uu, r = Fr(n), a = hu(t, {
    ...e,
    existingNodeIds: r.nodes.map(D),
    existingConnectionIds: Kt(r).map(({ association: u }) => u.id)
  });
  if (!a.valid)
    throw new Ct("invalid_operation_plan", 400, a.errors.join(" "), { errors: a.errors });
  const c = JSON.stringify(r), l = r.nodes.length, d = [], h = {
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
    const p = f + 1, g = `Operation ${p}`, m = { operation: p, kind: u.kind, matched: [], changed: [] };
    h.operations.push(m);
    const b = () => h.warnings.push(`${g} matched no notes.`), y = (v) => {
      h.skipped.push({ operation: p, id: D(v), reason: "locked" });
    }, x = (v) => {
      const w = r.nodes.length + v;
      if (v > 0 && w > i.notesPerSlate && w > l)
        throw new Ct(
          "note_limit",
          422,
          `${g} would leave ${w} notes; a slate can hold at most ${i.notesPerSlate} notes.`,
          { limit: i.notesPerSlate, operation: p }
        );
    }, E = (v, w) => {
      if (w > 0 && v > i.connectorsPerSlate)
        throw new Ct(
          "connector_limit",
          422,
          `${g} would leave ${v} connectors; a slate can hold at most ${i.connectorsPerSlate} connectors.`,
          { limit: i.connectorsPerSlate, operation: p }
        );
    };
    switch (u.kind) {
      case "add_nodes": {
        const v = u.preset ? md[u.preset] : void 0, w = u.placement?.connect === !0, _ = w ? r.nodes.find((V) => D(V) === u.placement.relativeTo) : void 0;
        if (w && !_)
          throw new Ct("no_match", 409, `${g} placement.relativeTo names no note on the slate to connect from.`, { operation: p });
        if (_ && _.options.isLocked === !0) {
          y(_);
          return;
        }
        const C = u.shape ?? v?.shape, S = _ ? Pt(_) : void 0, k = u.width ?? v?.width ?? S?.width ?? (C?.toLowerCase() === "triangle" ? 150 : 180), M = u.height ?? v?.height ?? S?.height ?? (C?.toLowerCase() === "triangle" ? 130 : 110), O = _ ?? $r(r, u.placement?.relativeTo), P = u.style?.backgroundColor || v?.style?.backgroundColor || O?.options.backgroundColor || "#7aa2c8", { points: R, arrangement: A, gap: T } = mu(r, u, k, M), I = new Set(Kt(r).map(({ association: V }) => V.id)), L = new Set(r.nodes.map(D)), H = (u.ids || []).filter((V) => L.has(V));
        if (H.length && !e.replay) throw Vn(g, "note", H);
        const q = R.map((V, j) => u.ids?.[j] || o());
        x(q.filter((V) => !L.has(V)).length), _ && E(I.size + q.filter((V) => !L.has(V)).length, q.length), R.forEach(({ x: V, y: j }, yt) => {
          const K = q[yt];
          if (m.matched.push(K), L.has(K)) return;
          const ct = u.text ? u.count > 1 ? u.text.replace(/\{n\}/g, `${yt + 1}`) : u.text : "", Nt = _ ? Kn(_.options) : void 0;
          if (Nt) for (const vt of bu) delete Nt[vt];
          const bt = Nt ? { ...Nt, id: K, name: K, text: ct, width: k, height: M } : {
            id: K,
            name: K,
            text: ct,
            defaultShaped: !0,
            width: k,
            height: M,
            backgroundColor: P,
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
          C && X.shape.store(bt, C, s), X.x.store(bt, V, s), X.y.store(bt, j, s), _ || X.foregroundColor.store(bt, fu(P), s);
          for (const [vt, ut] of Object.entries(v?.style || {})) X[vt].store(bt, ut, s);
          for (const [vt, ut] of Object.entries(u.style || {})) X[vt].store(bt, ut, s);
          if (r.nodes.push({ options: bt, relationships: { associations: [] } }), m.changed.push(K), h.created.push(K), _) {
            const vt = Zn(I, Oe(D(_), K));
            I.add(vt), _.relationships.associations.push({ id: vt, parentId: D(_), childId: K, ...jn }), h.connected.push(vt);
          }
        });
        const { placement: at, ...J } = u;
        d.push({
          ...J,
          ids: q,
          x: R[0].x,
          y: R[0].y,
          placement: { arrangement: A, gap: T, ..._ ? { relativeTo: D(_), connect: !0 } : {} }
        });
        return;
      }
      case "update_nodes": {
        const v = Ht(r, u.target, `${g} target`);
        m.matched = v.map(D), v.length || b();
        const w = [];
        for (const _ of v) {
          if (_.options.isLocked === !0 && u.changes.locked !== !1) {
            y(_);
            continue;
          }
          const C = JSON.stringify(_.options);
          for (const [S, k] of Object.entries(u.changes))
            In[S] || X[S].store(_.options, k, s);
          w.push(D(_)), JSON.stringify(_.options) !== C && m.changed.push(D(_));
        }
        if (u.changes.order && w.length) {
          const _ = new Set(w), C = r.nodes.map(D), S = r.nodes.filter((M) => _.has(D(M))), k = r.nodes.filter((M) => !_.has(D(M)));
          r.nodes = u.changes.order === "front" ? [...k, ...S] : [...S, ...k], r.nodes.forEach((M, O) => {
            const P = D(M);
            _.has(P) && C[O] !== P && !m.changed.includes(P) && m.changed.push(P);
          });
        }
        h.updated.push(...w), w.length && d.push({ kind: "update_nodes", target: { ids: w }, changes: u.changes });
        return;
      }
      case "delete_nodes": {
        const v = Ht(r, u.target, `${g} target`);
        if (m.matched = v.map(D), v.length || b(), !u.target.ids && r.nodes.length > 1 && v.length === r.nodes.length && !Hr.test(e.userMessage || ""))
          throw new Ct("invalid_operation_plan", 400, `${g} cannot delete every note without an explicit request.`);
        const _ = /* @__PURE__ */ new Set();
        for (const C of v)
          C.options.isLocked === !0 ? y(C) : _.add(D(C));
        r.nodes = r.nodes.filter((C) => !_.has(D(C)));
        for (const C of r.nodes)
          C.relationships.associations = C.relationships.associations.filter(
            (S) => !_.has(S.parentId) && !_.has(S.childId)
          );
        m.changed = [..._], h.deleted.push(..._), _.size && d.push({ kind: "delete_nodes", target: { ids: [..._] } });
        return;
      }
      case "duplicate_nodes": {
        const v = Ht(r, u.target, `${g} target`);
        m.matched = v.map(D), v.length || b();
        const w = u.offset ?? Qd, _ = new Set(r.nodes.map(D)), C = (u.ids || []).filter((R) => _.has(R));
        if (C.length && !e.replay) throw Vn(g, "note", C);
        const S = v.map((R, A) => u.ids?.[A] || o());
        x(S.filter((R) => !_.has(R)).length);
        for (const R of v) {
          const A = Mt(R, "x") + w.x, T = Mt(R, "y") + w.y;
          if (Math.abs(A) > on || Math.abs(T) > on)
            throw new Ct(
              "invalid_operation_plan",
              400,
              `${g} would put the copy of ${D(R)} at ${A}, ${T}; a note's position must be from -${on} to ${on}.`
            );
        }
        const k = new Map(v.map((R, A) => [D(R), S[A]])), M = /* @__PURE__ */ new Map();
        v.forEach((R, A) => {
          const T = S[A];
          if (_.has(T)) return;
          const I = { options: { ...Kn(R.options), id: T, name: T }, relationships: { associations: [] } };
          X.x.store(I.options, Mt(R, "x") + w.x, s), X.y.store(I.options, Mt(R, "y") + w.y, s), r.nodes.push(I), M.set(T, I), m.changed.push(T), h.created.push(T);
        });
        const O = new Set(Kt(r).map(({ association: R }) => R.id));
        let P = 0;
        for (const R of v) {
          const A = M.get(k.get(D(R)));
          if (A)
            for (const T of R.relationships.associations) {
              const I = k.get(T.childId);
              if (!I || Xn(T)) continue;
              const L = Zn(O, Oe(D(A), I));
              O.add(L), A.relationships.associations.push({ ...Kn(T), id: L, parentId: D(A), childId: I }), h.connected.push(L), P += 1;
            }
        }
        E(O.size, P), v.length && d.push({ kind: "duplicate_nodes", target: { ids: v.map(D) }, ids: S, offset: { ...w } });
        return;
      }
      case "connect_nodes": {
        const v = Ht(r, u.from, `${g} from`), w = u.to?.point, _ = w ? [] : Ht(r, u.to, `${g} to`);
        (!v.length || !w && !_.length) && b();
        const C = v.length * (w ? 1 : _.length);
        if (C > i.connectorsPerOperation)
          throw new Ct(
            "connector_limit",
            422,
            `${g} would join ${C} pairs of notes; one operation may join at most ${i.connectorsPerOperation}.`,
            { limit: i.connectorsPerOperation }
          );
        const S = /* @__PURE__ */ new Set(), k = /* @__PURE__ */ new Map();
        for (const { association: A } of Kt(r)) {
          S.add(A.id);
          const T = Wn(A.parentId, A.childId);
          k.has(T) || k.set(T, A.id);
        }
        const M = [], O = [], P = [];
        let R = 0;
        for (const A of v) {
          const T = D(A), I = w ? [null] : _.filter((L) => D(L) !== T);
          if (A.options.isLocked === !0) {
            I.length && y(A), R += I.length;
            continue;
          }
          I.length && P.push(T);
          for (const L of I) {
            const H = u.ids?.[R];
            if (R += 1, !L) {
              const V = yu(H, o), j = V.id ?? Oe(T, V.childId);
              if (S.has(j)) {
                e.replay || M.push(j), O.push(j), m.matched.push(j);
                continue;
              }
              A.relationships.associations.push({ id: j, parentId: T, childId: V.childId, targetPoint: { ...w }, ...jn, ...u.style || {} }), S.add(j), O.push(j), m.matched.push(j), m.changed.push(j), h.connected.push(j);
              continue;
            }
            const q = D(L), at = k.get(Wn(T, q));
            if (at) {
              O.push(at), m.matched.push(at);
              continue;
            }
            if (H && S.has(H)) {
              e.replay || M.push(H), O.push(H), m.matched.push(H);
              continue;
            }
            const J = H || Zn(S, Oe(T, q));
            A.relationships.associations.push({ id: J, parentId: T, childId: q, ...jn, ...u.style || {} }), S.add(J), k.set(Wn(T, q), J), O.push(J), m.matched.push(J), m.changed.push(J), h.connected.push(J);
          }
        }
        if (M.length) throw Vn(g, "connector", M);
        if (S.size > i.connectorsPerSlate && m.changed.length)
          throw new Ct(
            "connector_limit",
            422,
            `A slate can hold at most ${i.connectorsPerSlate} connectors; this plan would leave ${S.size}.`,
            { limit: i.connectorsPerSlate }
          );
        m.changed.length && d.push({
          kind: "connect_nodes",
          from: { ids: P },
          to: w ? { point: { ...w } } : { ids: _.map(D) },
          ids: O,
          ...u.style ? { style: u.style } : {}
        });
        return;
      }
      case "disconnect_nodes":
      case "update_connections": {
        let v;
        if (u.connectionIds) {
          const w = new Set(u.connectionIds);
          v = Kt(r).filter(({ association: _ }) => w.has(_.id));
        } else {
          const w = new Set(Ht(r, u.from, `${g} from`).map(D)), _ = new Set(Ht(r, u.to, `${g} to`).map(D));
          v = Kt(r).filter(
            ({ association: C }) => w.has(C.parentId) && _.has(C.childId) || _.has(C.parentId) && w.has(C.childId)
          );
        }
        if (m.matched = v.map(({ association: w }) => w.id), v.length || h.warnings.push(`${g} matched no connectors.`), u.kind === "disconnect_nodes") {
          for (const { node: w, association: _ } of v)
            w.relationships.associations = w.relationships.associations.filter((C) => C !== _);
          m.changed = [...m.matched], h.disconnected.push(...m.matched), v.length && d.push({ kind: "disconnect_nodes", connectionIds: m.matched });
          return;
        }
        for (const { association: w } of v) {
          if (u.changes.toPoint !== void 0 && !Xn(w))
            throw new Ct(
              "invalid_operation_plan",
              400,
              `${g} can move only a free end with toPoint; connector ${w.id} ends on a note.`
            );
          const _ = JSON.stringify(w);
          for (const [C, S] of Object.entries(u.changes))
            w[be[C].field || C] = C === "toPoint" ? { ...S } : S;
          JSON.stringify(w) !== _ && m.changed.push(w.id);
        }
        h.connectionsUpdated.push(...m.matched), v.length && d.push({ kind: "update_connections", connectionIds: m.matched, changes: u.changes });
        return;
      }
      case "arrange_nodes": {
        const v = Ht(r, u.target, `${g} target`);
        m.matched = v.map(D), v.length || b();
        const w = v.filter((T) => T.options.isLocked !== !0 ? !0 : (y(T), !1));
        if (!w.length) return;
        const _ = u.layout;
        let C;
        if (Pi[_]) C = xr(Pi[_], w.map(de));
        else if (_ === "distribute-horizontal" || _ === "distribute-vertical")
          C = _r(_ === "distribute-horizontal" ? "horizontal" : "vertical", w.map(de));
        else if (_ === "tidy") {
          const T = new Set(w.map(D)), I = r.nodes.filter((L) => !T.has(D(L))).map(de);
          C = Cr(w.map(de), I, { gap: u.gap ?? 20 });
        } else if (_ === "tree") {
          const T = Kt(r).filter(({ association: H }) => !Xn(H)).map(({ association: H }) => [H.parentId, H.childId]), I = new Set(w.map(D)), L = r.nodes.filter((H) => !I.has(D(H))).map(de);
          C = Pd(w.map(de), T, { gap: u.gap ?? 48, obstacles: L });
        }
        if (C) {
          const T = new Map(w.map((I) => [D(I), I]));
          for (const I of C) {
            const L = T.get(I.id), H = [Mt(L, "x"), Mt(L, "y")];
            X.x.store(L.options, I.x, s), X.y.store(L.options, I.y, s), Ri(H, [I.x, I.y]) || m.changed.push(I.id);
          }
          h.updated.push(...w.map(D)), d.push({ kind: "arrange_nodes", target: { ids: w.map(D) }, layout: u.layout, ...u.gap !== void 0 ? { gap: u.gap } : {} });
          return;
        }
        const S = w.map(Pt), k = u.gap ?? 48, M = Math.min(...S.map((T) => T.x)), O = Math.min(...S.map((T) => T.y)), P = Math.max(...S.map((T) => T.width), 120), R = Math.max(...S.map((T) => T.height), 80), A = xs(w.length, u.layout === "circle" ? "row" : u.layout);
        w.forEach((T, I) => {
          const L = [Mt(T, "x"), Mt(T, "y")];
          let H, q;
          if (u.layout === "circle") {
            const at = Math.max(180, w.length * 35), J = Math.PI * 2 * I / w.length;
            H = M + at + Math.cos(J) * at, q = O + at + Math.sin(J) * at;
          } else
            H = M + A[I].column * (P + k), q = O + A[I].row * (R + k);
          X.x.store(T.options, H, s), X.y.store(T.options, q, s), Ri(L, [H, q]) || m.changed.push(D(T));
        }), h.updated.push(...w.map(D)), d.push({ kind: "arrange_nodes", target: { ids: w.map(D) }, layout: u.layout, ...u.gap !== void 0 ? { gap: k } : {} });
        return;
      }
      case "update_slate": {
        const v = u.changes, w = JSON.stringify(r);
        for (const [_, C] of Object.entries(Ue))
          v[_] !== void 0 && C.store(r, v[_]);
        JSON.stringify(r) !== w && m.changed.push("slate"), d.push({ kind: "update_slate", changes: v });
        return;
      }
    }
  }), e.requireMatches && h.warnings.length) {
    const u = h.warnings[0];
    throw new Ct("no_match", 409, u, { operation: Number(u.match(/^Operation (\d+)/)?.[1]) });
  }
  return h.unchanged = JSON.stringify(r) === c, { slate: r, materializedPlan: { message: t.message.trim(), operations: d }, report: h };
}
[...Object.keys(X)];
function vu(n = {}) {
  const t = ti(n), e = ei(n), s = (c) => Object.fromEntries(c.map((l) => [l, $t(X[l].spec(t))])), i = (c) => Object.fromEntries(c.map((l) => [l, $t(be[l].spec)])), o = cu(), r = { type: "array", items: { type: "string" } }, a = vs.map((c) => `${c}: ${Or[c].filter((l) => l !== "kind").join(", ")}`).join("; ");
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
        maxItems: e.operationsPerPlan,
        items: {
          type: "object",
          additionalProperties: !1,
          required: ["kind"],
          description: `Fields by kind. ${a}.`,
          properties: {
            kind: { type: "string", enum: [...vs] },
            count: { type: "integer", minimum: 1, maximum: e.notesPerAdd },
            ...s(["shape", "text", "x", "y", "width", "height"]),
            preset: {
              type: "string",
              enum: [...Dr],
              description: "add_nodes: text (no fill or border) or sticky (a sticky note), as the note toolbar makes them. Gives the shape when none is given."
            },
            ids: { ...r, description: "add_nodes and duplicate_nodes: new note ids (1 to 64 letters, digits, _ or -), which later operations in the plan may name. connect_nodes: ids for the new connectors, one per pair. An id already in use is refused." },
            connectionIds: r,
            gap: { type: "number", minimum: 0, maximum: 2e3 },
            offset: { ...$t({ type: "point" }), description: "duplicate_nodes: how far the copies sit from the notes copied; 20, 20 when left out." },
            placement: {
              type: "object",
              additionalProperties: !1,
              description: "add_nodes: where to put the notes. With x and y, only arrangement and gap apply. connect: true with relativeTo makes notes that copy that note's look and are joined to it, 75 from its edge, as the canvas's connection handles do.",
              properties: {
                relativeTo: { type: "string" },
                direction: { type: "string", enum: [...Rr] },
                arrangement: { type: "string", enum: [...Pr] },
                gap: { type: "number", minimum: 0, maximum: 2e3 },
                connect: { type: "boolean" }
              }
            },
            style: {
              type: "object",
              additionalProperties: !1,
              description: "add_nodes: note keys for the new notes. connect_nodes: connector keys for the new connectors.",
              properties: { ...s(Nr), ...i(Lr) }
            },
            target: o,
            from: o,
            to: {
              ...o,
              description: `${o.description} connect_nodes may instead give {point: {x, y}} for a connector with a free end.`,
              properties: { ...o.properties, point: $t({ type: "point" }) }
            },
            layout: {
              type: "string",
              enum: [...Ir],
              description: "arrange_nodes: row, column, grid, circle; align-* and distribute-* as the canvas aligns by what you see; tidy moves notes apart until none overlaps; tree lays connected notes out in layers under their root."
            },
            changes: {
              type: "object",
              additionalProperties: !1,
              minProperties: 1,
              description: `update_nodes: note keys (and order: front or back). update_connections: connector keys. update_slate: ${Object.keys(Ue).join(", ")}.`,
              properties: {
                ...s(Object.keys(X)),
                ...Object.fromEntries(Object.entries(In).map(([c, l]) => [c, $t(l.spec)])),
                ...i(Object.keys(be)),
                ...Object.fromEntries(
                  Object.entries(Ue).map(([c, l]) => [c, c === "background" ? ou() : $t(l.spec)])
                )
              }
            }
          }
        }
      }
    }
  };
}
Object.freeze({
  name: "applySlateOperations",
  description: "Edit the existing slate without starting a new slate, replacing its content, or changing its theme unless the user explicitly asked for that. Always include a natural completion message.",
  parameters: vu()
});
function Di(n) {
  return new Map(n.nodes.map((t) => [t.options.id, t]));
}
function Li(n) {
  const t = /* @__PURE__ */ new Map();
  return n.nodes.forEach((e) => e.relationships.associations.forEach((s) => t.set(s.id, s))), t;
}
function wu(n, t, e) {
  const s = (r) => X[r].read(e), i = (...r) => r.some((a) => t[a] !== void 0), o = [];
  i("shape") && o.push({ type: "onNodeShapeChanged", data: { id: n, shape: s("shape"), vectorPath: e.vectorPath } }), i("backgroundColor", "opacity") && o.push({ type: "onNodeColorChanged", data: { id: n, color: e.backgroundColor, opacity: e.opacity, borderColor: e.borderColor } }), i("text", "fontFamily", "fontSize", "foregroundColor", "textOpacity", "textXAlign", "textYAlign") && o.push({
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
  for (const r of ["borderColor", "borderWidth", "borderOpacity", "borderStyle"])
    i(r) && o.push({ type: "onNodeBorderPropertiesChanged", data: { id: n, prop: r, val: e[r] } });
  return i("width", "height") && o.push({ type: "onNodeResized", data: { id: n, width: e.width, height: e.height } }), i("x", "y") && o.push({ type: "onNodesMove", data: { dur: 350, nodes: [{ id: n, x: s("x"), y: s("y") }] } }), i("rotationAngle") && o.push({ type: "onNodeRotated", data: { id: n, rotationAngle: s("rotationAngle") } }), i("locked") && o.push({ type: s("locked") ? "onNodeLocked" : "onNodeUnlocked", data: { id: n } }), i("animation") && o.push({ type: "onNodeEffectChanged", data: { id: n, filter: { apply: "vect", id: s("animation"), isAnimation: !0 } } }), i("effect") && o.push({ type: "onNodeEffectChanged", data: { id: n, filter: { apply: "vect", id: s("effect") } } }), i("link") && o.push(e.link ? { type: "onNodeLinkAdded", data: { id: n, link: { ...e.link } } } : { type: "onNodeLinkRemoved", data: { id: n } }), i("groupId") && o.push({ type: "onNodesMove", data: { dur: 0, nodes: [{ id: n, groupId: s("groupId") }] } }), o;
}
function Ur(n, t, e) {
  const s = Di(t), i = Di(e), o = Li(t), r = Li(e);
  switch (n.kind) {
    case "add_nodes":
    case "duplicate_nodes": {
      const a = (n.ids || []).filter((d) => !s.has(d) && i.has(d)), c = new Set(a), l = [...r.values()].filter((d) => !o.has(d.id) && c.has(d.childId));
      return [
        ...a.map((d) => ({ type: "onNodeAdded", data: { nodeOptions: { ...i.get(d).options } } })),
        ...l.map((d) => ({ type: "addRelationship", data: { ...d } }))
      ];
    }
    case "update_nodes": {
      const a = (n.target?.ids || []).filter((d) => i.has(d)), c = a.flatMap((d) => wu(d, n.changes || {}, i.get(d).options)), l = n.changes?.order;
      return l && a.length && c.push({ type: l === "front" ? "onNodeToFront" : "onNodeToBack", data: { id: a[0], order: e.nodes.map((d) => d.options.id) } }), c;
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
        const c = r.get(a);
        return c ? n.changes?.toPoint !== void 0 ? [
          { type: "removeRelationship", data: { id: a, parentId: c.parentId, childId: c.childId } },
          { type: "addRelationship", data: { ...c } }
        ] : Object.keys(n.changes || {}).map((l) => ({
          type: "onLinePropertiesChanged",
          data: { id: c.parentId, associationId: a, prop: l, val: c[l] }
        })) : [];
      });
    case "arrange_nodes": {
      const a = (n.target?.ids || []).flatMap((c) => {
        const l = i.get(c);
        return l ? [{ id: c, x: X.x.read(l.options), y: X.y.read(l.options) }] : [];
      });
      return a.length ? [{ type: "onNodesMove", data: { dur: 450, nodes: a } }] : [];
    }
    case "update_slate": {
      const a = n.changes || {}, c = [], l = e.options;
      if (a.name !== void 0 && c.push({ type: "onSlateNameChanged", data: { name: e.options.name } }), a.description !== void 0 && c.push({ type: "onSlateDescriptionChanged", data: { description: e.options.description } }), a.background !== void 0) {
        const d = Br(a.background);
        c.push({
          type: "onSlateBackgroundColorChanged",
          data: {
            color: d.backgroundColor,
            asGradient: d.backgroundColorAsGradient,
            gradientType: d.backgroundGradientType,
            gradientColors: d.backgroundGradientColors,
            gradientStrategy: d.backgroundGradientStrategy
          }
        });
      }
      return a.mindMapMode !== void 0 && c.push({ type: "onSlateMindMapModeChanged", data: { mindMapMode: l.mindMapMode } }), a.autoResizeNodesBasedOnText !== void 0 && c.push({ type: "onSlateAutoResizeNodesBasedOnTextChanged", data: { autoResizeNodesBasedOnText: l.autoResizeNodesBasedOnText } }), a.showGrid !== void 0 && c.push({ type: "onSlateShowGridChanged", data: { showGrid: l.viewPort.showGrid } }), a.snapToObjects !== void 0 && c.push({ type: "onSlateSnapToObjectsChanged", data: { snapToObjects: l.viewPort.snapToObjects } }), a.defaultLineColor !== void 0 && c.push({ type: "onLineColorChanged", data: { color: l.defaultLineColor } }), c;
    }
  }
  return [];
}
function xu(n, t, { userMessage: e = "", replay: s = !1, ...i } = {}) {
  let o = Fr(n);
  const r = Ii(o, t, { userMessage: e, replay: s, ...i }), a = [];
  for (const f of r.materializedPlan.operations) {
    const p = Ii(o, { message: t.message, operations: [f] }, { userMessage: e, replay: !0, ...i }).slate, g = Ur(f, o, p), m = new Set(o.nodes.map((b) => b.options.id));
    a.push({ packages: g, created: p.nodes.map((b) => b.options.id).filter((b) => !m.has(b)) }), o = p;
  }
  const c = n.v2 ?? n, l = (f) => f.map((p) => c.nodes?.one?.(p)).filter((p) => p?.ready && !p.relationships), d = (f) => {
    f.packages.length && n.collab.invoke(f.packages);
    const p = l(f.created);
    return p.length ? Promise.all(p.map((g) => g.ready)) : null;
  };
  let h = null;
  for (const f of a)
    h ? h = h.then(() => d(f)) : h = d(f);
  const u = a.flatMap((f) => f.packages);
  return u.length && n.collab.send(u), {
    message: r.materializedPlan.message,
    report: r.report,
    materializedPlan: r.materializedPlan,
    applied: (h ?? Promise.resolve()).then(() => {
    })
  };
}
const Ru = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  applySlateOperations: xu,
  packagesForOperation: Ur
}, Symbol.toStringTag, { value: "Module" }));
class ee {
  constructor(t = {}) {
    this.optionState = { id: se(), ...t }, this.options = new Proxy(this.optionState, {
      get: (e, s, i) => {
        if (typeof s != "string" || !this.v2)
          return Reflect.get(e, s, i);
        const o = rt(this.v2.options || {});
        return Object.prototype.hasOwnProperty.call(o, s) ? o[s] : Reflect.get(e, s, i);
      },
      set: (e, s, i, o) => {
        const r = Reflect.set(e, s, i, o);
        return r && typeof s == "string" && this.v2 && Object.assign(this.v2.options, re({ [s]: i })), r;
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
        const s = Reflect.ownKeys(rt(this.v2.options || {}));
        return Array.from(/* @__PURE__ */ new Set([...Reflect.ownKeys(e), ...s]));
      },
      getOwnPropertyDescriptor: (e, s) => {
        const i = Reflect.getOwnPropertyDescriptor(e, s);
        if (i || !this.v2 || typeof s != "string")
          return i;
        const o = rt(this.v2.options || {});
        if (Object.prototype.hasOwnProperty.call(o, s))
          return { configurable: !0, enumerable: !0, writable: !0 };
      }
    }), this.resize = new _u(this), this.relationships = new Cu(this);
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
          const c = a[0] + a[2] / 2, l = a[1] + a[3] / 2, d = s.options.width || 0, h = s.options.height || 0;
          s.position(c - d / 2, l - h / 2);
        }
      }
    } catch {
    }
    return this;
  }
}
class _u {
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
class Cu {
  constructor(t) {
    this.owner = t;
  }
  /** v1: `node.relationships.addAssociation(childNode, data?)` */
  addAssociation(t, e) {
    if (!this.owner.v2)
      throw new Error(
        "SLATEBOX_COMPAT: add the node to a slate before creating associations"
      );
    const s = t instanceof ee ? t.v2 : t;
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
class Eu {
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
    const e = t instanceof ee ? t : new ee(t), s = re(e.options), i = this.v2Slate.addNode(s);
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
      const a = r.options || {}, c = rt(a);
      (r.relationships?.getAssociations?.() ?? []).forEach((d) => {
        s.push({
          parentId: d.parentId,
          childId: d.childId,
          lineWidth: d.lineWidth,
          lineType: d.lineType,
          lineCurveType: d.lineCurveType,
          lineCurviness: d.lineCurviness,
          lineOpacity: d.lineOpacity,
          showParentArrow: d.showParentArrow,
          showChildArrow: d.showChildArrow
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
    const e = this.v2Slate, s = new Map((t.moves || []).map((o) => [o.id, o])), i = t.nodes ? t.nodes.map((o) => o instanceof ee ? o.v2 : o).filter(Boolean) : t.moves ? t.moves.map((o) => e.nodes.one(o.id)).filter(Boolean) : e.nodes.allNodes;
    return {
      dur: t.dur ?? 300,
      easing: t.easing ?? ">",
      textPositions: i.map((o) => ({
        id: o.id,
        textPosition: { x: 0, y: 0, transform: "" }
      })),
      nodeOptions: i.map((o) => {
        const r = s.get(o.id), a = rt(o.options || {});
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
    return e || (e = new ee({ ...t.options }), e.options.id = t.id, this.wrappers.set(t.id, e)), e.v2 = t, e.slate = this.owner, e;
  }
}
class Su {
  constructor(t = {}, e = {}) {
    this.savingTemplateImage = !1, this.options = {
      ...t,
      id: t.id || se()
    }, this.events = e || {}, this._shareId = this.options.shareId || se(), this.nodes = new Eu(this), this.controller = {
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
    const t = this.resolveContainer(), e = Vs(this.options);
    delete e.container, this.options.shareId === void 0 && (e.shareId = this._shareId), e.events = this.events, this.v2 = new $e(t, e), await this.v2.getViewportAsync(), this.options.viewPort || (this.options.viewPort = {});
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
      availableFilters: ir(),
      availableAnimations: Zs()
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
  unwrapNodes(t) {
    if (t)
      return t.map(
        (e) => e instanceof ee ? e.v2 : e
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
const Ut = class Ut {
  constructor(t) {
    this.registerPlugins(t);
  }
  registerPlugins(t) {
    const e = this.constructor.name, s = Ut.availablePlugins[e];
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
    Ut.availablePlugins[e] || (Ut.availablePlugins[e] = []), Ut.availablePlugins[e] = [...Ut.availablePlugins[e], t];
  }
};
Ut.availablePlugins = {};
let _s = Ut;
const ku = {
  slate: Su,
  node: ee,
  base: _s,
  utils: ed
};
function Au(n, t = {}) {
  return new $e(n, t);
}
typeof window < "u" && (window.SlateboxJS = Au, window.Slate = $e, window.Node = Rn, window.PanZoom = fr, window.ResizeRotate = Yo, window.BirdsEye = pr, window.Connector = Nn, window.Serialization = Sd, window.ShapeRegistry = cd, window.Relationship = Ah, window.Relationships = jo, window.FontLoader = Nh, window.Images = Xo, window.Editor = Zo, window.UndoRedo = Fe, window.MultiSelection = gr, window.Grid = mr, window.Menu = or, window.Keyboard = yn, window.ContextMenu = yr, window.Filters = sr, window.Links = Wo, window.Export = Td, window.Collab = vr, window.Theme = Ph, window.Layout = Dd, window.ZoomSlider = Ar, window.Comments = Bd, window.Presentation = Mr, window.Slatebox = Object.assign({}, ku, { compat: ud }));
export {
  pr as BirdsEye,
  vr as Collab,
  Bd as Comments,
  Nn as Connector,
  yr as ContextMenu,
  le as DEFAULT_NOTE_STYLE,
  Zo as Editor,
  Td as ExportModule,
  vi as FREE_NODE,
  sr as Filters,
  Nh as FontLoader,
  wi as GOVERNED_NODE,
  mr as Grid,
  Xo as Images,
  kd as Invoker,
  yn as Keyboard,
  Dd as Layout,
  Wo as Links,
  or as Menu,
  gr as MultiSelection,
  Rn as Node,
  _d as NodesManager,
  fr as PanZoom,
  Mr as Presentation,
  Ah as Relationship,
  jo as Relationships,
  Yo as ResizeRotate,
  Sd as Serialization,
  cd as ShapeRegistry,
  $e as Slate,
  Ru as SlateOperations,
  ku as Slatebox,
  Au as SlateboxJS,
  Ph as Theme,
  Fe as UndoRedo,
  Ar as ZoomSlider,
  ud as compat,
  Au as default,
  Ou as getFilterNames,
  pd as hitTestNodeBoxes,
  Nu as registerFilter,
  ed as utils
};
//# sourceMappingURL=slateboxjs.mjs.map
