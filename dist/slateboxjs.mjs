var Oo = Object.create, Ue = Object.defineProperty, Do = Object.getOwnPropertyDescriptor, zo = Object.getOwnPropertyNames, Lo = Object.getPrototypeOf, Bo = Object.prototype.hasOwnProperty, A = (n, t) => () => (t || (n((t = { exports: {} }).exports, t), n = null), t.exports), se = (n, t) => {
  let e = {};
  for (var i in n)
    Ue(e, i, {
      get: n[i],
      enumerable: !0
    });
  return Ue(e, Symbol.toStringTag, { value: "Module" }), e;
}, Go = (n, t, e, i) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (var s = zo(t), o = 0, r = s.length, a; o < r; o++)
      a = s[o], !Bo.call(n, a) && a !== e && Ue(n, a, {
        get: ((l) => t[l]).bind(null, a),
        enumerable: !(i = Do(t, a)) || i.enumerable
      });
  return n;
}, Ho = (n, t, e) => (e = n != null ? Oo(Lo(n)) : {}, Go(Ue(e, "default", {
  value: n,
  enumerable: !0
}), n));
const xn = {}, Bi = [];
function I(n, t) {
  if (Array.isArray(n)) {
    for (const e of n) I(e, t);
    return;
  }
  if (typeof n == "object") {
    for (const e in n) I(e, n[e]);
    return;
  }
  Gi(Object.getOwnPropertyNames(t)), xn[n] = Object.assign(xn[n] || {}, t);
}
function nt(n) {
  return xn[n] || {};
}
function Fo() {
  return [...new Set(Bi)];
}
function Gi(n) {
  Bi.push(...n);
}
var Ot = /* @__PURE__ */ A((n, t) => {
  t.exports = function(e) {
    try {
      return !!e();
    } catch {
      return !0;
    }
  };
}), Ve = /* @__PURE__ */ A((n, t) => {
  var e = Ot();
  t.exports = !e(function() {
    var i = function() {
    }.bind();
    return typeof i != "function" || i.hasOwnProperty("prototype");
  });
}), qt = /* @__PURE__ */ A((n, t) => {
  var e = Ve(), i = Function.prototype, s = i.call, o = e && i.bind.bind(s, s);
  t.exports = e ? o : function(r) {
    return function() {
      return s.apply(r, arguments);
    };
  };
}), Hi = /* @__PURE__ */ A((n, t) => {
  var e = qt();
  t.exports = e({}.isPrototypeOf);
}), bt = /* @__PURE__ */ A((n, t) => {
  var e = function(i) {
    return i && i.Math === Math && i;
  };
  t.exports = e(typeof globalThis == "object" && globalThis) || e(typeof window == "object" && window) || e(typeof self == "object" && self) || e(typeof global == "object" && global) || e(typeof n == "object" && n) || /* @__PURE__ */ function() {
    return this;
  }() || Function("return this")();
}), Uo = /* @__PURE__ */ A((n, t) => {
  var e = Ve(), i = Function.prototype, s = i.apply, o = i.call;
  t.exports = typeof Reflect == "object" && Reflect.apply || (e ? o.bind(s) : function() {
    return o.apply(s, arguments);
  });
}), Ke = /* @__PURE__ */ A((n, t) => {
  var e = qt(), i = e({}.toString), s = e("".slice);
  t.exports = function(o) {
    return s(i(o), 8, -1);
  };
}), Fi = /* @__PURE__ */ A((n, t) => {
  var e = Ke(), i = qt();
  t.exports = function(s) {
    if (e(s) === "Function") return i(s);
  };
}), Dt = /* @__PURE__ */ A((n, t) => {
  var e = typeof document == "object" && document.all;
  t.exports = typeof e > "u" && e !== void 0 ? function(i) {
    return typeof i == "function" || i === e;
  } : function(i) {
    return typeof i == "function";
  };
}), Ae = /* @__PURE__ */ A((n, t) => {
  var e = Ot();
  t.exports = !e(function() {
    return Object.defineProperty({}, 1, { get: function() {
      return 7;
    } })[1] !== 7;
  });
}), Xn = /* @__PURE__ */ A((n, t) => {
  var e = Ve(), i = Function.prototype.call;
  t.exports = e ? i.bind(i) : function() {
    return i.apply(i, arguments);
  };
}), Yo = /* @__PURE__ */ A((n) => {
  var t = {}.propertyIsEnumerable, e = Object.getOwnPropertyDescriptor, i = e && !t.call({ 1: 2 }, 1);
  n.f = i ? function(o) {
    var r = e(this, o);
    return !!r && r.enumerable;
  } : t;
}), Ui = /* @__PURE__ */ A((n, t) => {
  t.exports = function(e, i) {
    return {
      enumerable: !(e & 1),
      configurable: !(e & 2),
      writable: !(e & 4),
      value: i
    };
  };
}), Xo = /* @__PURE__ */ A((n, t) => {
  var e = qt(), i = Ot(), s = Ke(), o = Object, r = e("".split);
  t.exports = i(function() {
    return !o("z").propertyIsEnumerable(0);
  }) ? function(a) {
    return s(a) === "String" ? r(a, "") : o(a);
  } : o;
}), Yi = /* @__PURE__ */ A((n, t) => {
  t.exports = function(e) {
    return e == null;
  };
}), $n = /* @__PURE__ */ A((n, t) => {
  var e = Yi(), i = TypeError;
  t.exports = function(s) {
    if (e(s)) throw new i("Can't call method on " + s);
    return s;
  };
}), Xi = /* @__PURE__ */ A((n, t) => {
  var e = Xo(), i = $n();
  t.exports = function(s) {
    return e(i(s));
  };
}), Me = /* @__PURE__ */ A((n, t) => {
  var e = Dt();
  t.exports = function(i) {
    return typeof i == "object" ? i !== null : e(i);
  };
}), jn = /* @__PURE__ */ A((n, t) => {
  t.exports = {};
}), $o = /* @__PURE__ */ A((n, t) => {
  var e = jn(), i = bt(), s = Dt(), o = function(r) {
    return s(r) ? r : void 0;
  };
  t.exports = function(r, a) {
    return arguments.length < 2 ? o(e[r]) || o(i[r]) : e[r] && e[r][a] || i[r] && i[r][a];
  };
}), jo = /* @__PURE__ */ A((n, t) => {
  var e = bt().navigator, i = e && e.userAgent;
  t.exports = i ? String(i) : "";
}), qo = /* @__PURE__ */ A((n, t) => {
  var e = bt(), i = jo(), s = e.process, o = e.Deno, r = s && s.versions || o && o.version, a = r && r.v8, l, c;
  a && (l = a.split("."), c = l[0] > 0 && l[0] < 4 ? 1 : +(l[0] + l[1])), !c && i && (l = i.match(/Edge\/(\d+)/), (!l || l[1] >= 74) && (l = i.match(/Chrome\/(\d+)/), l && (c = +l[1]))), t.exports = c;
}), $i = /* @__PURE__ */ A((n, t) => {
  var e = qo(), i = Ot(), s = bt().String;
  t.exports = !!Object.getOwnPropertySymbols && !i(function() {
    var o = Symbol("symbol detection");
    return !s(o) || !(Object(o) instanceof Symbol) || !Symbol.sham && e && e < 41;
  });
}), ji = /* @__PURE__ */ A((n, t) => {
  var e = $i();
  t.exports = e && !Symbol.sham && typeof Symbol.iterator == "symbol";
}), qi = /* @__PURE__ */ A((n, t) => {
  var e = $o(), i = Dt(), s = Hi(), o = ji(), r = Object;
  t.exports = o ? function(a) {
    return typeof a == "symbol";
  } : function(a) {
    var l = e("Symbol");
    return i(l) && s(l.prototype, r(a));
  };
}), Zo = /* @__PURE__ */ A((n, t) => {
  var e = String;
  t.exports = function(i) {
    try {
      return e(i);
    } catch {
      return "Object";
    }
  };
}), Zi = /* @__PURE__ */ A((n, t) => {
  var e = Dt(), i = Zo(), s = TypeError;
  t.exports = function(o) {
    if (e(o)) return o;
    throw new s(i(o) + " is not a function");
  };
}), Wo = /* @__PURE__ */ A((n, t) => {
  var e = Zi(), i = Yi();
  t.exports = function(s, o) {
    var r = s[o];
    return i(r) ? void 0 : e(r);
  };
}), Vo = /* @__PURE__ */ A((n, t) => {
  var e = Xn(), i = Dt(), s = Me(), o = TypeError;
  t.exports = function(r, a) {
    var l, c;
    if (a === "string" && i(l = r.toString) && !s(c = e(l, r)) || i(l = r.valueOf) && !s(c = e(l, r)) || a !== "string" && i(l = r.toString) && !s(c = e(l, r))) return c;
    throw new o("Can't convert object to primitive value");
  };
}), Ko = /* @__PURE__ */ A((n, t) => {
  t.exports = !0;
}), Qo = /* @__PURE__ */ A((n, t) => {
  var e = bt(), i = Object.defineProperty;
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
}), Wi = /* @__PURE__ */ A((n, t) => {
  var e = Ko(), i = bt(), s = Qo(), o = "__core-js_shared__", r = t.exports = i[o] || s(o, {});
  (r.versions || (r.versions = [])).push({
    version: "3.49.0",
    mode: e ? "pure" : "global",
    copyright: "© 2013–2025 Denis Pushkarev (zloirock.ru), 2025–2026 CoreJS Company (core-js.io). All rights reserved.",
    license: "https://github.com/zloirock/core-js/blob/v3.49.0/LICENSE",
    source: "https://github.com/zloirock/core-js"
  });
}), Jo = /* @__PURE__ */ A((n, t) => {
  var e = Wi();
  t.exports = function(i, s) {
    return e[i] || (e[i] = s || {});
  };
}), tr = /* @__PURE__ */ A((n, t) => {
  var e = $n(), i = Object;
  t.exports = function(s) {
    return i(e(s));
  };
}), qn = /* @__PURE__ */ A((n, t) => {
  var e = qt(), i = tr(), s = e({}.hasOwnProperty);
  t.exports = Object.hasOwn || function(r, a) {
    return s(i(r), a);
  };
}), er = /* @__PURE__ */ A((n, t) => {
  var e = qt(), i = 0, s = Math.random(), o = e(1.1.toString);
  t.exports = function(r) {
    return "Symbol(" + (r === void 0 ? "" : r) + ")_" + o(++i + s, 36);
  };
}), ke = /* @__PURE__ */ A((n, t) => {
  var e = bt(), i = Jo(), s = qn(), o = er(), r = $i(), a = ji(), l = e.Symbol, c = i("wks"), h = a ? l.for || l : l && l.withoutSetter || o;
  t.exports = function(d) {
    return s(c, d) || (c[d] = r && s(l, d) ? l[d] : h("Symbol." + d)), c[d];
  };
}), nr = /* @__PURE__ */ A((n, t) => {
  var e = Xn(), i = Me(), s = qi(), o = Wo(), r = Vo(), a = ke(), l = TypeError, c = a("toPrimitive");
  t.exports = function(h, d) {
    if (!i(h) || s(h)) return h;
    var u = o(h, c), f;
    if (u) {
      if (d === void 0 && (d = "default"), f = e(u, h, d), !i(f) || s(f)) return f;
      throw new l("Can't convert object to primitive value");
    }
    return d === void 0 && (d = "number"), r(h, d);
  };
}), Vi = /* @__PURE__ */ A((n, t) => {
  var e = nr(), i = qi();
  t.exports = function(s) {
    var o = e(s, "string");
    return i(o) ? o : o + "";
  };
}), ir = /* @__PURE__ */ A((n, t) => {
  var e = bt(), i = Me(), s = e.document, o = i(s) && i(s.createElement);
  t.exports = function(r) {
    return o ? s.createElement(r) : {};
  };
}), Ki = /* @__PURE__ */ A((n, t) => {
  var e = Ae(), i = Ot(), s = ir();
  t.exports = !e && !i(function() {
    return Object.defineProperty(s("div"), "a", { get: function() {
      return 7;
    } }).a !== 7;
  });
}), sr = /* @__PURE__ */ A((n) => {
  var t = Ae(), e = Xn(), i = Yo(), s = Ui(), o = Xi(), r = Vi(), a = qn(), l = Ki(), c = Object.getOwnPropertyDescriptor;
  n.f = t ? c : function(d, u) {
    if (d = o(d), u = r(u), l) try {
      return c(d, u);
    } catch {
    }
    if (a(d, u)) return s(!e(i.f, d, u), d[u]);
  };
}), or = /* @__PURE__ */ A((n, t) => {
  var e = Ot(), i = Dt(), s = /#|\.prototype\./, o = function(h, d) {
    var u = a[r(h)];
    return u === c ? !0 : u === l ? !1 : i(d) ? e(d) : !!d;
  }, r = o.normalize = function(h) {
    return String(h).replace(s, ".").toLowerCase();
  }, a = o.data = {}, l = o.NATIVE = "N", c = o.POLYFILL = "P";
  t.exports = o;
}), rr = /* @__PURE__ */ A((n, t) => {
  var e = Fi(), i = Zi(), s = Ve(), o = e(e.bind);
  t.exports = function(r, a) {
    return i(r), a === void 0 ? r : s ? o(r, a) : function() {
      return r.apply(a, arguments);
    };
  };
}), ar = /* @__PURE__ */ A((n, t) => {
  var e = Ae(), i = Ot();
  t.exports = e && i(function() {
    return Object.defineProperty(function() {
    }, "prototype", {
      value: 42,
      writable: !1
    }).prototype !== 42;
  });
}), lr = /* @__PURE__ */ A((n, t) => {
  var e = Me(), i = String, s = TypeError;
  t.exports = function(o) {
    if (e(o)) return o;
    throw new s(i(o) + " is not an object");
  };
}), cr = /* @__PURE__ */ A((n) => {
  var t = Ae(), e = Ki(), i = ar(), s = lr(), o = Vi(), r = TypeError, a = Object.defineProperty, l = Object.getOwnPropertyDescriptor, c = "enumerable", h = "configurable", d = "writable";
  n.f = t ? i ? function(f, p, g) {
    if (s(f), p = o(p), s(g), typeof f == "function" && p === "prototype" && "value" in g && d in g && !g[d]) {
      var y = l(f, p);
      y && y[d] && (f[p] = g.value, g = {
        configurable: h in g ? g[h] : y[h],
        enumerable: c in g ? g[c] : y[c],
        writable: !1
      });
    }
    return a(f, p, g);
  } : a : function(f, p, g) {
    if (s(f), p = o(p), s(g), e) try {
      return a(f, p, g);
    } catch {
    }
    if ("get" in g || "set" in g) throw new r("Accessors not supported");
    return "value" in g && (f[p] = g.value), f;
  };
}), hr = /* @__PURE__ */ A((n, t) => {
  var e = Ae(), i = cr(), s = Ui();
  t.exports = e ? function(o, r, a) {
    return i.f(o, r, s(1, a));
  } : function(o, r, a) {
    return o[r] = a, o;
  };
}), Qi = /* @__PURE__ */ A((n, t) => {
  var e = bt(), i = Uo(), s = Fi(), o = Dt(), r = sr().f, a = or(), l = jn(), c = rr(), h = hr(), d = qn();
  Wi();
  var u = function(f) {
    var p = function(g, y, m) {
      if (this instanceof p) {
        switch (arguments.length) {
          case 0:
            return new f();
          case 1:
            return new f(g);
          case 2:
            return new f(g, y);
        }
        return new f(g, y, m);
      }
      return i(f, this, arguments);
    };
    return p.prototype = f.prototype, p;
  };
  t.exports = function(f, p) {
    var g = f.target, y = f.global, m = f.stat, b = f.proto, v = y ? e : m ? e[g] : e[g] && e[g].prototype, x = y ? l : l[g] || h(l, g, {})[g], _ = x.prototype, w, E, C, S, T, k, O, D, H;
    for (S in p)
      w = a(y ? S : g + (m ? "." : "#") + S, f.forced), E = !w && v && d(v, S), k = x[S], E && (f.dontCallGetSet ? (H = r(v, S), O = H && H.value) : O = v[S]), T = E && O ? O : p[S], !(!w && !b && typeof k == typeof T) && (f.bind && E ? D = c(T, e) : f.wrap && E ? D = u(T) : b && o(T) ? D = s(T) : D = T, (f.sham || T && T.sham || k && k.sham) && h(D, "sham", !0), h(x, S, D), b && (C = g + "Prototype", d(l, C) || h(l, C, {}), h(l[C], S, T), f.real && _ && (w || !_[S]) && h(_, S, T)));
  };
}), dr = /* @__PURE__ */ A((n, t) => {
  var e = Math.ceil, i = Math.floor;
  t.exports = Math.trunc || function(o) {
    var r = +o;
    return (r > 0 ? i : e)(r);
  };
}), Ji = /* @__PURE__ */ A((n, t) => {
  var e = dr();
  t.exports = function(i) {
    var s = +i;
    return s !== s || s === 0 ? 0 : e(s);
  };
}), ur = /* @__PURE__ */ A((n, t) => {
  var e = Ji(), i = Math.max, s = Math.min;
  t.exports = function(o, r) {
    var a = e(o);
    return a < 0 ? i(a + r, 0) : s(a, r);
  };
}), fr = /* @__PURE__ */ A((n, t) => {
  var e = Ji(), i = Math.min;
  t.exports = function(s) {
    var o = e(s);
    return o > 0 ? i(o, 9007199254740991) : 0;
  };
}), pr = /* @__PURE__ */ A((n, t) => {
  var e = fr();
  t.exports = function(i) {
    return e(i.length);
  };
}), gr = /* @__PURE__ */ A((n, t) => {
  var e = Xi(), i = ur(), s = pr(), o = function(r) {
    return function(a, l, c) {
      var h = e(a), d = s(h);
      if (d === 0) return !r && -1;
      var u = i(c, d), f;
      if (r && l !== l) {
        for (; d > u; )
          if (f = h[u++], f !== f) return !0;
      } else for (; d > u; u++) if ((r || u in h) && h[u] === l) return r || u || 0;
      return !r && -1;
    };
  };
  t.exports = {
    includes: o(!0),
    indexOf: o(!1)
  };
}), mr = /* @__PURE__ */ A((n, t) => {
  t.exports = function() {
  };
}), yr = /* @__PURE__ */ A(() => {
  var n = Qi(), t = gr().includes, e = Ot(), i = mr(), s = e(function() {
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
}), ts = /* @__PURE__ */ A((n, t) => {
  var e = bt(), i = jn();
  t.exports = function(s, o) {
    var r = i[s + "Prototype"], a = r && r[o];
    if (a) return a;
    var l = e[s], c = l && l.prototype;
    return c && c[o];
  };
}), br = /* @__PURE__ */ A((n, t) => {
  yr();
  var e = ts();
  t.exports = e("Array", "includes");
}), vr = /* @__PURE__ */ A((n, t) => {
  var e = Me(), i = Ke(), s = ke()("match");
  t.exports = function(o) {
    var r;
    return e(o) && ((r = o[s]) !== void 0 ? !!r : i(o) === "RegExp");
  };
}), wr = /* @__PURE__ */ A((n, t) => {
  var e = vr(), i = TypeError;
  t.exports = function(s) {
    if (e(s)) throw new i("The method doesn't accept regular expressions");
    return s;
  };
}), xr = /* @__PURE__ */ A((n, t) => {
  var e = ke()("toStringTag"), i = {};
  i[e] = "z", t.exports = String(i) === "[object z]";
}), _r = /* @__PURE__ */ A((n, t) => {
  var e = xr(), i = Dt(), s = Ke(), o = ke()("toStringTag"), r = Object, a = s(/* @__PURE__ */ function() {
    return arguments;
  }()) === "Arguments", l = function(c, h) {
    try {
      return c[h];
    } catch {
    }
  };
  t.exports = e ? s : function(c) {
    var h, d, u;
    return c === void 0 ? "Undefined" : c === null ? "Null" : typeof (d = l(h = r(c), o)) == "string" ? d : a ? s(h) : (u = s(h)) === "Object" && i(h.callee) ? "Arguments" : u;
  };
}), Cr = /* @__PURE__ */ A((n, t) => {
  var e = _r(), i = String;
  t.exports = function(s) {
    if (e(s) === "Symbol") throw new TypeError("Cannot convert a Symbol value to a string");
    return i(s);
  };
}), Er = /* @__PURE__ */ A((n, t) => {
  var e = ke()("match");
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
}), Sr = /* @__PURE__ */ A(() => {
  var n = Qi(), t = qt(), e = wr(), i = $n(), s = Cr(), o = Er(), r = t("".indexOf);
  n({
    target: "String",
    proto: !0,
    forced: !o("includes")
  }, { includes: function(l) {
    return !!~r(s(i(this)), s(e(l)), arguments.length > 1 ? arguments[1] : void 0);
  } });
}), Tr = /* @__PURE__ */ A((n, t) => {
  Sr();
  var e = ts();
  t.exports = e("String", "includes");
}), Ar = /* @__PURE__ */ A((n, t) => {
  var e = Hi(), i = br(), s = Tr(), o = Array.prototype, r = String.prototype;
  t.exports = function(a) {
    var l = a.includes;
    return a === o || e(o, a) && l === o.includes ? i : typeof a == "string" || a === r || e(r, a) && l === r.includes ? s : l;
  };
}), Mr = /* @__PURE__ */ A((n, t) => {
  var e = Ar();
  t.exports = e;
}), Xt = /* @__PURE__ */ Ho(Mr());
function Zn(n, t) {
  let e;
  const i = n.length, s = [];
  for (e = 0; e < i; e++) s.push(t(n[e]));
  return s;
}
function kr(n, t) {
  let e;
  const i = n.length, s = [];
  for (e = 0; e < i; e++) t(n[e]) && s.push(n[e]);
  return s;
}
function un(n) {
  return n % 360 * Math.PI / 180;
}
function es(n) {
  return n.replace(/([A-Z])/g, function(t, e) {
    return "-" + e.toLowerCase();
  });
}
function ns(n) {
  return n.charAt(0).toUpperCase() + n.slice(1);
}
function Zt(n, t, e, i) {
  return (t == null || e == null) && (i = i || n.bbox(), t == null ? t = i.width / i.height * e : e == null && (e = i.height / i.width * t)), {
    width: t,
    height: e
  };
}
function _n(n, t) {
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
const Nr = /* @__PURE__ */ new Set([
  "desc",
  "metadata",
  "title"
]), Cn = (n) => Nr.has(n.nodeName), Rr = (n, t, e = {}) => {
  const i = { ...t };
  for (const s in i) i[s].valueOf() === e[s] && delete i[s];
  Object.keys(i).length ? n.node.setAttribute("data-svgjs", JSON.stringify(i)) : (n.node.removeAttribute("data-svgjs"), n.node.removeAttribute("svgjs:data"));
}, Wn = "http://www.w3.org/2000/svg", Pr = "http://www.w3.org/1999/xhtml", fn = "http://www.w3.org/2000/xmlns/", Ne = "http://www.w3.org/1999/xlink", z = {
  window: typeof window > "u" ? null : window,
  document: typeof document > "u" ? null : document
};
function Vn() {
  return z.window;
}
var Kn = class {
};
const jt = {}, Qn = "___SYMBOL___ROOT___";
function _e(n, t = Wn) {
  return z.document.createElementNS(t, n);
}
function Q(n, t = !1) {
  if (n instanceof Kn) return n;
  if (typeof n == "object") return pn(n);
  if (n == null) return new jt[Qn]();
  if (typeof n == "string" && n.trim().charAt(0) !== "<") return pn(z.document.querySelector(n));
  const e = t ? z.document.createElement("div") : _e("svg");
  return e.innerHTML = n.trim(), n = pn(e.firstElementChild), e.removeChild(e.firstElementChild), n;
}
function U(n, t) {
  return t && (t instanceof z.window.Node || t.ownerDocument && t instanceof t.ownerDocument.defaultView.Node) ? t : _e(n);
}
function tt(n) {
  if (!n) return null;
  if (n.instance instanceof Kn) return n.instance;
  if (n.nodeName === "#document-fragment") return new jt.Fragment(n);
  let t = ns(n.nodeName || "Dom");
  return t === "LinearGradient" || t === "RadialGradient" ? t = "Gradient" : jt[t] || (t = "Dom"), new jt[t](n);
}
let pn = tt;
function L(n, t = n.name, e = !1) {
  return jt[t] = n, e && (jt[Qn] = n), Gi(Object.getOwnPropertyNames(n.prototype)), n;
}
function Ir(n) {
  return jt[n];
}
let Or = 1e3;
function is(n) {
  return "Svgjs" + ns(n) + Or++;
}
function ss(n) {
  for (let t = n.children.length - 1; t >= 0; t--) ss(n.children[t]);
  return n.id && (n.id = is(n.nodeName)), n;
}
function R(n, t) {
  let e, i;
  for (n = Array.isArray(n) ? n : [n], i = n.length - 1; i >= 0; i--) for (e in t) n[i].prototype[e] = t[e];
}
function F(n) {
  return function(...t) {
    const e = t[t.length - 1];
    return e && e.constructor === Object && !(e instanceof Array) ? n.apply(this, t.slice(0, -1)).attr(e) : n.apply(this, t);
  };
}
function Dr() {
  return this.parent().children();
}
function zr() {
  return this.parent().index(this);
}
function Lr() {
  return this.siblings()[this.position() + 1];
}
function Br() {
  return this.siblings()[this.position() - 1];
}
function Gr() {
  const n = this.position();
  return this.parent().add(this.remove(), n + 1), this;
}
function Hr() {
  const n = this.position();
  return this.parent().add(this.remove(), n ? n - 1 : 0), this;
}
function Fr() {
  return this.parent().add(this.remove()), this;
}
function Ur() {
  return this.parent().add(this.remove(), 0), this;
}
function Yr(n) {
  n = Q(n), n.remove();
  const t = this.position();
  return this.parent().add(n, t), this;
}
function Xr(n) {
  n = Q(n), n.remove();
  const t = this.position();
  return this.parent().add(n, t + 1), this;
}
function $r(n) {
  return n = Q(n), n.before(this), this;
}
function jr(n) {
  return n = Q(n), n.after(this), this;
}
I("Dom", {
  siblings: Dr,
  position: zr,
  next: Lr,
  prev: Br,
  forward: Gr,
  backward: Hr,
  front: Fr,
  back: Ur,
  before: Yr,
  after: Xr,
  insertBefore: $r,
  insertAfter: jr
});
const os = /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i, qr = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, Zr = /rgb\((\d+),(\d+),(\d+)\)/, Wr = /^(#[^\s]+)$/, Vr = /\)\s*,?\s*/, Kr = /\s/g, bi = /^#[a-f0-9]{3}$|^#[a-f0-9]{6}$/i, vi = /^rgb\(/, wi = /^(\s+)?$/, xi = /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, Qr = /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i, Et = /[\s,]+/, Jn = /[MLHVCSQTAZ]/i;
function Jr() {
  const n = this.attr("class");
  return n == null ? [] : n.trim().split(Et);
}
function ta(n) {
  return this.classes().indexOf(n) !== -1;
}
function ea(n) {
  if (!this.hasClass(n)) {
    const t = this.classes();
    t.push(n), this.attr("class", t.join(" "));
  }
  return this;
}
function na(n) {
  return this.hasClass(n) && this.attr("class", this.classes().filter(function(t) {
    return t !== n;
  }).join(" ")), this;
}
function ia(n) {
  return this.hasClass(n) ? this.removeClass(n) : this.addClass(n);
}
I("Dom", {
  classes: Jr,
  hasClass: ta,
  addClass: ea,
  removeClass: na,
  toggleClass: ia
});
const ze = (n) => n.startsWith("--") ? n : es(n);
function sa(n, t) {
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
        const s = ze(i);
        e[i] = this.node.style.getPropertyValue(s);
      }
      return e;
    }
    if (typeof n == "string") return this.node.style.getPropertyValue(ze(n));
    if (typeof n == "object") for (const i in n) this.node.style.setProperty(ze(i), n[i] == null || wi.test(n[i]) ? "" : n[i]);
  }
  return arguments.length === 2 && this.node.style.setProperty(ze(n), t == null || wi.test(t) ? "" : t), this;
}
function oa() {
  return this.css("display", "");
}
function ra() {
  return this.css("display", "none");
}
function aa() {
  return this.css("display") !== "none";
}
I("Dom", {
  css: sa,
  show: oa,
  hide: ra,
  visible: aa
});
function la(n, t, e) {
  if (n == null) return this.data(Zn(kr(this.node.attributes, (i) => i.nodeName.indexOf("data-") === 0), (i) => i.nodeName.slice(5)));
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
I("Dom", { data: la });
function ca(n, t) {
  if (typeof arguments[0] == "object") for (const e in n) this.remember(e, n[e]);
  else {
    if (arguments.length === 1) return this.memory()[n];
    this.memory()[n] = t;
  }
  return this;
}
function ha() {
  if (arguments.length === 0) this._memory = {};
  else for (let n = arguments.length - 1; n >= 0; n--) delete this.memory()[arguments[n]];
  return this;
}
function da() {
  return this._memory = this._memory || {};
}
I("Dom", {
  remember: ca,
  forget: ha,
  memory: da
});
function ua(n) {
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
function fa(n) {
  const t = Math.max(0, Math.min(255, Math.round(n))).toString(16);
  return t.length === 1 ? "0" + t : t;
}
function Vt(n, t) {
  for (let e = t.length; e--; ) if (n[t[e]] == null) return !1;
  return !0;
}
function pa(n, t) {
  const e = Vt(n, "rgb") ? {
    _a: n.r,
    _b: n.g,
    _c: n.b,
    _d: 0,
    space: "rgb"
  } : Vt(n, "xyz") ? {
    _a: n.x,
    _b: n.y,
    _c: n.z,
    _d: 0,
    space: "xyz"
  } : Vt(n, "hsl") ? {
    _a: n.h,
    _b: n.s,
    _c: n.l,
    _d: 0,
    space: "hsl"
  } : Vt(n, "lab") ? {
    _a: n.l,
    _b: n.a,
    _c: n.b,
    _d: 0,
    space: "lab"
  } : Vt(n, "lch") ? {
    _a: n.l,
    _b: n.c,
    _c: n.h,
    _d: 0,
    space: "lch"
  } : Vt(n, "cmyk") ? {
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
function ga(n) {
  return n === "lab" || n === "xyz" || n === "lch";
}
function gn(n, t, e) {
  return e < 0 && (e += 1), e > 1 && (e -= 1), e < 1 / 6 ? n + (t - n) * 6 * e : e < 1 / 2 ? t : e < 2 / 3 ? n + (t - n) * (2 / 3 - e) * 6 : n;
}
var yt = class X {
  constructor(...t) {
    this.init(...t);
  }
  static isColor(t) {
    return t && (t instanceof X || this.isRgb(t) || this.test(t));
  }
  static isRgb(t) {
    return t && typeof t.r == "number" && typeof t.g == "number" && typeof t.b == "number";
  }
  static random(t = "vibrant", e) {
    const { random: i, round: s, sin: o, PI: r } = Math;
    if (t === "vibrant") {
      const a = 24 * i() + 57, l = 38 * i() + 45, c = 360 * i();
      return new X(a, l, c, "lch");
    } else if (t === "sine") {
      e = e ?? i();
      const a = s(80 * o(2 * r * e / 0.5 + 0.01) + 150), l = s(50 * o(2 * r * e / 0.5 + 4.6) + 200), c = s(100 * o(2 * r * e / 0.5 + 2.3) + 150);
      return new X(a, l, c);
    } else if (t === "pastel") {
      const a = 8 * i() + 86, l = 17 * i() + 9, c = 360 * i();
      return new X(a, l, c, "lch");
    } else if (t === "dark") {
      const a = 10 + 10 * i(), l = 50 * i() + 86, c = 360 * i();
      return new X(a, l, c, "lch");
    } else if (t === "rgb") {
      const a = 255 * i(), l = 255 * i(), c = 255 * i();
      return new X(a, l, c);
    } else if (t === "lab") {
      const a = 100 * i(), l = 256 * i() - 128, c = 256 * i() - 128;
      return new X(a, l, c, "lab");
    } else if (t === "grey") {
      const a = 255 * i();
      return new X(a, a, a);
    } else throw new Error("Unsupported random color mode");
  }
  static test(t) {
    return typeof t == "string" && (bi.test(t) || vi.test(t));
  }
  cmyk() {
    const { _a: t, _b: e, _c: i } = this.rgb(), [s, o, r] = [
      t,
      e,
      i
    ].map((d) => d / 255), a = Math.min(1 - s, 1 - o, 1 - r);
    if (a === 1) return new X(0, 0, 0, 1, "cmyk");
    const l = (1 - s - a) / (1 - a), c = (1 - o - a) / (1 - a), h = (1 - r - a) / (1 - a);
    return new X(l, c, h, a, "cmyk");
  }
  hsl() {
    const { _a: t, _b: e, _c: i } = this.rgb(), [s, o, r] = [
      t,
      e,
      i
    ].map((p) => p / 255), a = Math.max(s, o, r), l = Math.min(s, o, r), c = (a + l) / 2, h = a === l, d = a - l, u = h ? 0 : c > 0.5 ? d / (2 - a - l) : d / (a + l), f = h ? 0 : a === s ? ((o - r) / d + (o < r ? 6 : 0)) / 6 : a === o ? ((r - s) / d + 2) / 6 : a === r ? ((s - o) / d + 4) / 6 : 0;
    return new X(360 * f, 100 * u, 100 * c, "hsl");
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
      const d = pa(t, e);
      Object.assign(this, d);
    } else if (typeof t == "string") if (vi.test(t)) {
      const d = t.replace(Kr, ""), [u, f, p] = Zr.exec(d).slice(1, 4).map((g) => parseInt(g));
      Object.assign(this, {
        _a: u,
        _b: f,
        _c: p,
        _d: 0,
        space: "rgb"
      });
    } else if (bi.test(t)) {
      const d = (g) => parseInt(g, 16), [, u, f, p] = qr.exec(ua(t)).map(d);
      Object.assign(this, {
        _a: u,
        _b: f,
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
    return new X(s, o, r, "lab");
  }
  lch() {
    const { l: t, a: e, b: i } = this.lab(), s = Math.sqrt(e ** 2 + i ** 2);
    let o = 180 * Math.atan2(i, e) / Math.PI;
    return o < 0 && (o *= -1, o = 360 - o), new X(t, s, o, "lch");
  }
  rgb() {
    if (this.space === "rgb") return this;
    if (ga(this.space)) {
      let { x: t, y: e, z: i } = this;
      if (this.space === "lab" || this.space === "lch") {
        let { l: u, a: f, b: p } = this;
        if (this.space === "lch") {
          const { c: _, h: w } = this, E = Math.PI / 180;
          f = _ * Math.cos(E * w), p = _ * Math.sin(E * w);
        }
        const g = (u + 16) / 116, y = f / 500 + g, m = g - p / 200, b = 16 / 116, v = 8856e-6, x = 7.787;
        t = 0.95047 * (y ** 3 > v ? y ** 3 : (y - b) / x), e = 1 * (g ** 3 > v ? g ** 3 : (g - b) / x), i = 1.08883 * (m ** 3 > v ? m ** 3 : (m - b) / x);
      }
      const s = t * 3.2406 + e * -1.5372 + i * -0.4986, o = t * -0.9689 + e * 1.8758 + i * 0.0415, r = t * 0.0557 + e * -0.204 + i * 1.057, a = Math.pow, l = 31308e-7, c = s > l ? 1.055 * a(s, 1 / 2.4) - 0.055 : 12.92 * s, h = o > l ? 1.055 * a(o, 1 / 2.4) - 0.055 : 12.92 * o, d = r > l ? 1.055 * a(r, 1 / 2.4) - 0.055 : 12.92 * r;
      return new X(255 * c, 255 * h, 255 * d);
    } else if (this.space === "hsl") {
      let { h: t, s: e, l: i } = this;
      if (t /= 360, e /= 100, i /= 100, e === 0)
        return i *= 255, new X(i, i, i);
      const s = i < 0.5 ? i * (1 + e) : i + e - i * e, o = 2 * i - s, r = 255 * gn(o, s, t + 1 / 3), a = 255 * gn(o, s, t), l = 255 * gn(o, s, t - 1 / 3);
      return new X(r, a, l);
    } else if (this.space === "cmyk") {
      const { c: t, m: e, y: i, k: s } = this, o = 255 * (1 - Math.min(1, t * (1 - s) + s)), r = 255 * (1 - Math.min(1, e * (1 - s) + s)), a = 255 * (1 - Math.min(1, i * (1 - s) + s));
      return new X(o, r, a);
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
    const [t, e, i] = this._clamped().map(fa);
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
    ].map((y) => y / 255), a = s > 0.04045 ? Math.pow((s + 0.055) / 1.055, 2.4) : s / 12.92, l = o > 0.04045 ? Math.pow((o + 0.055) / 1.055, 2.4) : o / 12.92, c = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92, h = (a * 0.4124 + l * 0.3576 + c * 0.1805) / 0.95047, d = (a * 0.2126 + l * 0.7152 + c * 0.0722) / 1, u = (a * 0.0193 + l * 0.1192 + c * 0.9505) / 1.08883, f = h > 8856e-6 ? Math.pow(h, 1 / 3) : 7.787 * h + 16 / 116, p = d > 8856e-6 ? Math.pow(d, 1 / 3) : 7.787 * d + 16 / 116, g = u > 8856e-6 ? Math.pow(u, 1 / 3) : 7.787 * u + 16 / 116;
    return new X(f, p, g, "xyz");
  }
  _clamped() {
    const { _a: t, _b: e, _c: i } = this.rgb(), { max: s, min: o, round: r } = Math, a = (l) => s(0, o(r(l), 255));
    return [
      t,
      e,
      i
    ].map(a);
  }
}, Y = class rs {
  constructor(...t) {
    this.init(...t);
  }
  clone() {
    return new rs(this);
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
function ma(n, t) {
  return new Y(n, t).transformO(this.screenCTM().inverseO());
}
function Kt(n, t, e) {
  return Math.abs(t - n) < 1e-6;
}
var P = class $ {
  constructor(...t) {
    this.init(...t);
  }
  static formatTransforms(t) {
    const e = t.flip === "both" || t.flip === !0, i = t.flip && (e || t.flip === "x") ? -1 : 1, s = t.flip && (e || t.flip === "y") ? -1 : 1, o = t.skew && t.skew.length ? t.skew[0] : isFinite(t.skew) ? t.skew : isFinite(t.skewX) ? t.skewX : 0, r = t.skew && t.skew.length ? t.skew[1] : isFinite(t.skew) ? t.skew : isFinite(t.skewY) ? t.skewY : 0, a = t.scale && t.scale.length ? t.scale[0] * i : isFinite(t.scale) ? t.scale * i : isFinite(t.scaleX) ? t.scaleX * i : i, l = t.scale && t.scale.length ? t.scale[1] * s : isFinite(t.scale) ? t.scale * s : isFinite(t.scaleY) ? t.scaleY * s : s, c = t.shear || 0, h = t.rotate || t.theta || 0, d = new Y(t.origin || t.around || t.ox || t.originX, t.oy || t.originY), u = d.x, f = d.y, p = new Y(t.position ?? t.px ?? t.positionX ?? NaN, t.py ?? t.positionY ?? NaN), g = p.x, y = p.y, m = new Y(t.translate || t.tx || t.translateX, t.ty || t.translateY), b = m.x, v = m.y, x = new Y(t.relative || t.rx || t.relativeX, t.ry || t.relativeY);
    return {
      scaleX: a,
      scaleY: l,
      skewX: o,
      skewY: r,
      shear: c,
      theta: h,
      rx: x.x,
      ry: x.y,
      tx: b,
      ty: v,
      ox: u,
      oy: f,
      px: g,
      py: y
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
    return new $(this);
  }
  decompose(t = 0, e = 0) {
    const i = this.a, s = this.b, o = this.c, r = this.d, a = this.e, l = this.f, c = i * r - s * o, h = c > 0 ? 1 : -1, d = h * Math.sqrt(i * i + s * s), u = Math.atan2(h * s, h * i), f = 180 / Math.PI * u, p = (i * o + s * r) / c;
    return {
      scaleX: d,
      scaleY: o * d / (p * i - s) || r * d / (p * s + i),
      shear: p,
      rotate: f,
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
    const e = new $(t);
    return Kt(this.a, e.a) && Kt(this.b, e.b) && Kt(this.c, e.c) && Kt(this.d, e.d) && Kt(this.e, e.e) && Kt(this.f, e.f);
  }
  flip(t, e) {
    return this.clone().flipO(t, e);
  }
  flipO(t, e) {
    return t === "x" ? this.scaleO(-1, 1, e, 0) : t === "y" ? this.scaleO(1, -1, 0, e) : this.scaleO(-1, -1, t, e || t);
  }
  init(t) {
    const e = $.fromArray([
      1,
      0,
      0,
      1,
      0,
      0
    ]);
    return t = t instanceof it ? t.matrixify() : typeof t == "string" ? $.fromArray(t.split(Et).map(parseFloat)) : Array.isArray(t) ? $.fromArray(t) : typeof t == "object" && $.isMatrixLike(t) ? t : typeof t == "object" ? new $().transform(t) : arguments.length === 6 ? $.fromArray([].slice.call(arguments)) : e, this.a = t.a != null ? t.a : e.a, this.b = t.b != null ? t.b : e.b, this.c = t.c != null ? t.c : e.c, this.d = t.d != null ? t.d : e.d, this.e = t.e != null ? t.e : e.e, this.f = t.f != null ? t.f : e.f, this;
  }
  inverse() {
    return this.clone().inverseO();
  }
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
  multiply(t) {
    return this.clone().multiplyO(t);
  }
  multiplyO(t) {
    const e = this, i = t instanceof $ ? t : new $(t);
    return $.matrixMultiply(e, i, this);
  }
  rotate(t, e, i) {
    return this.clone().rotateO(t, e, i);
  }
  rotateO(t, e = 0, i = 0) {
    t = un(t);
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
    arguments.length === 3 && (s = i, i = e, e = t), t = un(t), e = un(e);
    const o = Math.tan(t), r = Math.tan(e), { a, b: l, c, d: h, e: d, f: u } = this;
    return this.a = a + l * o, this.b = l + a * r, this.c = c + h * o, this.d = h + c * r, this.e = d + u * o - s * o, this.f = u + d * r - i * r, this;
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
    if ($.isMatrixLike(t)) return new $(t).multiplyO(this);
    const e = $.formatTransforms(t), i = this, { x: s, y: o } = new Y(e.ox, e.oy).transform(i), r = new $().translateO(e.rx, e.ry).lmultiplyO(i).translateO(-s, -o).scaleO(e.scaleX, e.scaleY).skewO(e.skewX, e.skewY).shearO(e.shear).rotateO(e.theta).translateO(s, o);
    if (isFinite(e.px) || isFinite(e.py)) {
      const a = new Y(s, o).transform(r), l = isFinite(e.px) ? e.px - a.x : 0, c = isFinite(e.py) ? e.py - a.y : 0;
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
function ya() {
  return new P(this.node.getCTM());
}
function ba() {
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
L(P, "Matrix");
function wt() {
  if (!wt.nodes || wt.nodes.svg.node.ownerDocument !== z.document) {
    const n = Q().size(2, 0);
    n.node.style.cssText = [
      "opacity: 0",
      "position: absolute",
      "left: -100%",
      "top: -100%",
      "overflow: hidden"
    ].join(";"), n.attr("focusable", "false"), n.attr("aria-hidden", "true"), wt.nodes = {
      svg: n,
      path: n.path().node
    };
  }
  return wt.nodes.svg.node.parentNode || wt.nodes.svg.addTo(z.document.body || z.document.documentElement), wt.nodes;
}
function as(n) {
  return !n.width && !n.height && !n.x && !n.y;
}
function va(n) {
  return n === z.document || (z.document.documentElement.contains || function(t) {
    for (; t.parentNode; ) t = t.parentNode;
    return t === z.document;
  }).call(z.document.documentElement, n);
}
var q = class Ge {
  constructor(...t) {
    this.init(...t);
  }
  addOffset() {
    return this.x += z.window.pageXOffset, this.y += z.window.pageYOffset, new Ge(this);
  }
  init(t) {
    return t = typeof t == "string" ? t.split(Et).map(parseFloat) : Array.isArray(t) ? t : typeof t == "object" ? [
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
    return as(this);
  }
  merge(t) {
    const e = Math.min(this.x, t.x), i = Math.min(this.y, t.y), s = Math.max(this.x + this.width, t.x + t.width) - e, o = Math.max(this.y + this.height, t.y + t.height) - i;
    return new Ge(e, i, s, o);
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
      new Y(this.x, this.y),
      new Y(this.x2, this.y),
      new Y(this.x, this.y2),
      new Y(this.x2, this.y2)
    ].forEach(function(r) {
      r = r.transform(t), e = Math.min(e, r.x), i = Math.max(i, r.x), s = Math.min(s, r.y), o = Math.max(o, r.y);
    }), new Ge(e, s, i - e, o - s);
  }
};
function ls(n, t, e) {
  let i;
  try {
    if (i = t(n.node), as(i) && !va(n.node)) throw new Error("Element not in the dom");
  } catch {
    i = e(n);
  }
  return i;
}
function wa() {
  const e = ls(this, (i) => i.getBBox(), (i) => {
    try {
      const s = i.clone().addTo(wt().svg).show(), o = s.node.getBBox();
      return s.remove(), o;
    } catch (s) {
      throw new Error(`Getting bbox of element "${i.node.nodeName}" is not possible: ${s.toString()}`);
    }
  });
  return new q(e);
}
function xa(n) {
  const i = ls(this, (o) => o.getBoundingClientRect(), (o) => {
    throw new Error(`Getting rbox of element "${o.node.nodeName}" is not possible`);
  }), s = new q(i);
  return n ? s.transform(n.screenCTM().inverseO()) : s.addOffset();
}
function _a(n, t) {
  const e = this.bbox();
  return n > e.x && t > e.y && n < e.x + e.width && t < e.y + e.height;
}
I({ viewbox: {
  viewbox(n, t, e, i) {
    return n == null ? new q(this.attr("viewBox")) : this.attr("viewBox", new q(n, t, e, i));
  },
  zoom(n, t) {
    let { width: e, height: i } = this.attr(["width", "height"]);
    if ((!e && !i || typeof e == "string" || typeof i == "string") && (e = this.node.clientWidth, i = this.node.clientHeight), !e || !i) throw new Error("Impossible to get absolute width and height. Please provide an absolute width and height attribute on the zooming element");
    const s = this.viewbox(), o = e / s.width, r = i / s.height, a = Math.min(o, r);
    if (n == null) return a;
    let l = a / n;
    l === 1 / 0 && (l = Number.MAX_SAFE_INTEGER / 100), t = t || new Y(e / 2 / o + s.x, i / 2 / r + s.y);
    const c = new q(s).transform(new P({
      scale: l,
      origin: t
    }));
    return this.viewbox(c);
  }
} });
L(q, "Box");
var _t = class extends Array {
  constructor(n = [], ...t) {
    if (super(n, ...t), typeof n == "number") return this;
    this.length = 0, this.push(...n);
  }
};
R([_t], {
  each(n, ...t) {
    return typeof n == "function" ? this.map((e, i, s) => n.call(e, e, i, s)) : this.map((e) => e[n](...t));
  },
  toArray() {
    return Array.prototype.concat.apply([], this);
  }
});
const _i = [
  "toArray",
  "constructor",
  "each"
];
_t.extend = function(n) {
  n = n.reduce((t, e) => ((0, Xt.default)(_i).call(_i, e) || e[0] === "_" || (e in Array.prototype && (t["$" + e] = Array.prototype[e]), t[e] = function(...i) {
    return this.each(e, ...i);
  }), t), {}), R([_t], n);
};
function En(n) {
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
  const i = t.match(Wr);
  return i ? i[1].slice(1) : null;
}
function cs(n, t) {
  const e = `#${z.window.CSS.escape(t)}`;
  return n.nodeType === 1 && n.matches(e) ? n : n.querySelector(e);
}
function Ca(n, t) {
  const e = En(t);
  return e ? cs(n.getRootNode(), e) : null;
}
function Re(n, t, e = `[${t}]`) {
  const i = n.getAttribute("id"), s = n.getRootNode();
  if (!i || cs(s, i) !== n) return new _t();
  const o = [];
  s.nodeType === 1 && s.matches(e) && En(s.getAttribute(t)) === i && o.push(tt(s));
  for (const r of s.querySelectorAll(e)) En(r.getAttribute(t)) === i && o.push(tt(r));
  return new _t(o);
}
function Ea(n, t) {
  return new _t(Zn((t || z.document).querySelectorAll(n), function(e) {
    return tt(e);
  }));
}
function Sa(n) {
  return Ea(n, this.node);
}
function Ta(n) {
  return tt(this.node.querySelector(n));
}
let Aa = 0;
const Sn = /* @__PURE__ */ new WeakMap(), Tn = /* @__PURE__ */ new WeakMap(), An = () => /* @__PURE__ */ Object.create(null);
function ti(n) {
  const t = n.getEventHolder();
  let e = Sn.get(t);
  return e || (e = An(), Sn.set(t, e)), e;
}
function ei(n) {
  return n.getEventTarget();
}
function Ma(n) {
  Sn.delete(n.getEventHolder());
}
function ot(n, t, e, i, s) {
  const o = e.bind(i || n), r = s || !1, a = Q(n), l = ti(a), c = ei(a);
  t = Array.isArray(t) ? t : t.split(Et);
  let h = Tn.get(e);
  h || (h = ++Aa, Tn.set(e, h)), t.forEach(function(d) {
    const u = d.split(".")[0], f = d.split(".")[1] || "*";
    l[u] = l[u] || An(), l[u][f] = l[u][f] || An(), l[u][f][h] = l[u][f][h] || [], l[u][f][h].push({
      listener: o,
      options: r
    }), c.addEventListener(u, o, r);
  });
}
function K(n, t, e, i) {
  const s = Q(n), o = ti(s), r = ei(s);
  typeof e == "function" && (e = Tn.get(e), !e) || (t = Array.isArray(t) ? t : (t || "").split(Et), t.forEach(function(a) {
    const l = a && a.split(".")[0], c = a && a.split(".")[1];
    let h, d;
    if (e) {
      if (o[l] && o[l][c || "*"]) {
        const u = o[l][c || "*"][e];
        if (!u) return;
        u.forEach(function(f) {
          r.removeEventListener(l, f.listener, f.options ?? i ?? !1);
        }), delete o[l][c || "*"][e];
      }
    } else if (l && c) {
      if (o[l] && o[l][c]) {
        for (d in o[l][c]) K(r, [l, c].join("."), d);
        delete o[l][c];
      }
    } else if (c)
      for (a in o) for (h in o[a]) c === h && K(r, [a, c].join("."));
    else if (l) {
      if (o[l]) {
        for (h in o[l]) K(r, [l, h].join("."));
        delete o[l];
      }
    } else {
      for (a in o) K(r, a);
      Ma(s);
    }
  }));
}
function ka(n, t, e, i) {
  const s = ei(n);
  return t instanceof z.window.Event || (t = new z.window.CustomEvent(t, {
    detail: e,
    cancelable: !0,
    ...i
  })), s.dispatchEvent(t), t;
}
var Pe = class extends Kn {
  addEventListener() {
  }
  dispatch(n, t, e) {
    return ka(this, n, t, e);
  }
  dispatchEvent(n) {
    const t = ti(this)[n.type];
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
    return K(this, n, t, e), this;
  }
  on(n, t, e, i) {
    return ot(this, n, t, e, i), this;
  }
  removeEventListener() {
  }
};
L(Pe, "EventTarget");
function Ci() {
}
const ye = {
  duration: 400,
  ease: ">",
  delay: 0
}, Na = {
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
var ee = class extends Array {
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
    return n instanceof Array ? n : n.trim().split(Et).map(parseFloat);
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
}, B = class ut {
  constructor(...t) {
    this.init(...t);
  }
  convert(t) {
    return new ut(this.value, t);
  }
  divide(t) {
    return t = new ut(t), new ut(this / t, this.unit || t.unit);
  }
  init(t, e) {
    return e = Array.isArray(t) ? t[1] : e, t = Array.isArray(t) ? t[0] : t, this.value = 0, this.unit = e || "", typeof t == "number" ? this.value = isNaN(t) ? 0 : isFinite(t) ? t : t < 0 ? -34e37 : 34e37 : typeof t == "string" ? (e = t.match(os), e && (this.value = parseFloat(e[1]), e[5] === "%" ? this.value /= 100 : e[5] === "s" && (this.value *= 1e3), this.unit = e[5])) : t instanceof ut && (this.value = t.valueOf(), this.unit = t.unit), this;
  }
  minus(t) {
    return t = new ut(t), new ut(this - t, this.unit || t.unit);
  }
  plus(t) {
    return t = new ut(t), new ut(this + t, this.unit || t.unit);
  }
  times(t) {
    return t = new ut(t), new ut(this * t, this.unit || t.unit);
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
const Ra = /* @__PURE__ */ new Set([
  "fill",
  "stroke",
  "color",
  "bgcolor",
  "stop-color",
  "flood-color",
  "lighting-color"
]), hs = [];
function Pa(n) {
  hs.push(n);
}
function Ia(n, t, e) {
  if (n == null) {
    n = {}, t = this.node.attributes;
    for (const i of t) n[i.nodeName] = xi.test(i.nodeValue) ? parseFloat(i.nodeValue) : i.nodeValue;
    return n;
  } else {
    if (n instanceof Array) return n.reduce((i, s) => (i[s] = this.attr(s), i), {});
    if (typeof n == "object" && n.constructor === Object) for (t in n) this.attr(t, n[t]);
    else if (t === null) this.node.removeAttribute(n);
    else {
      if (t == null)
        return t = this.node.getAttribute(n), t == null ? Na[n] : xi.test(t) ? parseFloat(t) : t;
      t = hs.reduce((i, s) => s(n, i, this), t), typeof t == "number" ? t = new B(t) : Ra.has(n) && yt.isColor(t) ? t = new yt(t) : t.constructor === Array && (t = new ee(t)), n === "leading" ? this.leading && this.leading(t) : typeof e == "string" ? this.node.setAttributeNS(e, n, t.toString()) : this.node.setAttribute(n, t.toString()), this.rebuild && (n === "font-size" || n === "x") && this.rebuild();
    }
  }
  return this;
}
var ne = class ds extends Pe {
  constructor(t, e) {
    super(), this.node = t, this.type = t.nodeName, e && t !== e && this.attr(e);
  }
  add(t, e) {
    return t = Q(t), t.removeNamespace && this.node instanceof z.window.SVGElement && t.removeNamespace(), e == null ? this.node.appendChild(t.node) : t.node !== this.node.childNodes[e] && this.node.insertBefore(t.node, this.node.childNodes[e]), this;
  }
  addTo(t, e) {
    return Q(t).put(this, e);
  }
  children() {
    return new _t(Zn(this.node.children, function(t) {
      return tt(t);
    }));
  }
  clear() {
    for (; this.node.hasChildNodes(); ) this.node.removeChild(this.node.lastChild);
    return this;
  }
  clone(t = !0, e = !0) {
    this.writeDataToDom();
    let i = this.node.cloneNode(t);
    return e && (i = ss(i)), new this.constructor(i);
  }
  each(t, e) {
    const i = this.children();
    let s, o;
    for (s = 0, o = i.length; s < o; s++)
      t.apply(i[s], [s, i]), e && i[s].each(t, e);
    return this;
  }
  element(t, e) {
    return this.put(new ds(_e(t), e));
  }
  first() {
    return tt(this.node.firstChild);
  }
  get(t) {
    return tt(this.node.childNodes[t]);
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
    return this.xml(t, e, Pr);
  }
  id(t) {
    return typeof t > "u" && !this.node.id && (this.node.id = is(this.type)), this.attr("id", t);
  }
  index(t) {
    return [].slice.call(this.node.childNodes).indexOf(t.node);
  }
  last() {
    return tt(this.node.lastChild);
  }
  matches(t) {
    const e = this.node, i = e.matches || e.matchesSelector || e.msMatchesSelector || e.mozMatchesSelector || e.webkitMatchesSelector || e.oMatchesSelector || null;
    return i && i.call(e, t);
  }
  parent(t) {
    let e = this;
    if (!e.node.parentNode) return null;
    if (e = tt(e.node.parentNode), !t) return e;
    do
      if (typeof t == "string" ? e.matches(t) : e instanceof t) return e;
    while (e = tt(e.node.parentNode));
    return e;
  }
  put(t, e) {
    return t = Q(t), this.add(t, e), t;
  }
  putIn(t, e) {
    return Q(t).add(this, e);
  }
  remove() {
    return this.parent() && this.parent().removeElement(this), this;
  }
  removeElement(t) {
    return this.node.removeChild(t.node), this;
  }
  replace(t) {
    return t = Q(t), this.node.parentNode && this.node.parentNode.replaceChild(t.node, this.node), t;
  }
  round(t = 2, e = null) {
    const i = 10 ** t, s = this.attr(e);
    for (const o in s) typeof s[o] == "number" && (s[o] = Math.round(s[o] * i) / i);
    return this.attr(s), this;
  }
  svg(t, e) {
    return this.xml(t, e, Wn);
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
        if (a = tt(a.node.cloneNode(!0)), e) {
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
    const s = _e("wrapper", i), o = z.document.createDocumentFragment();
    s.innerHTML = t;
    for (let a = s.children.length; a--; ) o.appendChild(s.firstElementChild);
    const r = this.parent();
    return e ? this.replace(o) && r : this.add(o);
  }
};
R(ne, {
  attr: Ia,
  find: Sa,
  findOne: Ta
});
L(ne, "Dom");
var it = class extends ne {
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
    return this.x(new B(n).plus(this.x()));
  }
  dy(n = 0) {
    return this.y(new B(n).plus(this.y()));
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
    t || (n = n && Q(n).node);
    const s = new _t();
    let o = this;
    for (; (o = o.parent()) && o.node !== z.document && o.node.nodeName !== "#document-fragment" && (s.push(o), !(!t && o.node === n || t && o.matches(n))); )
      if (i && o.node === i) return null;
    return s;
  }
  reference(n) {
    if (n = this.attr(n), !n) return null;
    const t = Ca(this.node, n);
    return t ? Q(t) : null;
  }
  root() {
    const n = this.parent(Ir(Qn));
    return n && n.root();
  }
  setData(n) {
    return this.dom = n, this;
  }
  size(n, t) {
    const e = Zt(this, n, t);
    return this.width(new B(e.width)).height(new B(e.height));
  }
  width(n) {
    return this.attr("width", n);
  }
  writeDataToDom(n) {
    return Rr(this, this.dom, n), super.writeDataToDom();
  }
  x(n) {
    return this.attr("x", n);
  }
  y(n) {
    return this.attr("y", n);
  }
};
R(it, {
  bbox: wa,
  rbox: xa,
  inside: _a,
  point: ma,
  ctm: ya,
  screenCTM: ba
});
L(it, "Element");
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
    if (typeof i == "string" || i instanceof yt || yt.isRgb(i) || i instanceof it) this.attr(n, i);
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
  return (this._element || this).type === "radialGradient" ? this.attr("r", new B(n)) : this.rx(n).ry(t);
} });
I("Path", {
  length: function() {
    return this.node.getTotalLength();
  },
  pointAt: function(n) {
    return new Y(this.node.getPointAtLength(n));
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
function Oa() {
  return this.attr("transform", null);
}
function Da() {
  return (this.attr("transform") || "").split(Vr).slice(0, -1).map(function(n) {
    const t = n.trim().split("(");
    return [t[0].trim(), t[1].split(Et).map(function(e) {
      return parseFloat(e);
    })];
  }).reverse().reduce(function(n, t) {
    return t[0] === "matrix" ? n.lmultiply(P.fromArray(t[1])) : n[t[0]].apply(n, t[1]);
  }, new P());
}
function za(n, t) {
  if (this === n) return this;
  if (Cn(this.node)) return this.addTo(n, t);
  const e = this.screenCTM(), i = n.screenCTM().inverse();
  return this.addTo(n, t).untransform().transform(i.multiply(e)), this;
}
function La(n) {
  return this.toParent(this.root(), n);
}
function Ba(n, t) {
  if (n == null || typeof n == "string") {
    const i = new P(this).decompose();
    return n == null ? i : i[n];
  }
  P.isMatrixLike(n) || (n = {
    ...n,
    origin: _n(n, this)
  });
  const e = new P(t === !0 ? this : t || !1).transform(n);
  return this.attr("transform", e);
}
I("Element", {
  untransform: Oa,
  matrixify: Da,
  toParent: za,
  toRoot: La,
  transform: Ba
});
var dt = class us extends it {
  flatten() {
    return this.each(function() {
      if (this instanceof us) return this.flatten().ungroup();
    }), this;
  }
  ungroup(t = this.parent(), e = t.index(this)) {
    return e = e === -1 ? t.children().length : e, this.each(function(i, s) {
      return s[s.length - i - 1].toParent(t, e);
    }), this.remove();
  }
};
L(dt, "Container");
var ni = class extends dt {
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
L(ni, "Defs");
var rt = class extends it {
};
L(rt, "Shape");
var Ga = /* @__PURE__ */ se({
  cx: () => gs,
  cy: () => ms,
  height: () => bs,
  rx: () => ii,
  ry: () => si,
  width: () => ys,
  x: () => fs,
  y: () => ps
});
function ii(n) {
  return this.attr("rx", n);
}
function si(n) {
  return this.attr("ry", n);
}
function fs(n) {
  return n == null ? this.cx() - this.rx() : this.cx(n + this.rx());
}
function ps(n) {
  return n == null ? this.cy() - this.ry() : this.cy(n + this.ry());
}
function gs(n) {
  return this.attr("cx", n);
}
function ms(n) {
  return this.attr("cy", n);
}
function ys(n) {
  return n == null ? this.rx() * 2 : this.rx(new B(n).divide(2));
}
function bs(n) {
  return n == null ? this.ry() * 2 : this.ry(new B(n).divide(2));
}
var Ie = class extends rt {
  constructor(n, t = n) {
    super(U("ellipse", n), t);
  }
  size(n, t) {
    const e = Zt(this, n, t);
    return this.rx(new B(e.width).divide(2)).ry(new B(e.height).divide(2));
  }
};
R(Ie, Ga);
I("Container", { ellipse: F(function(n = 0, t = n) {
  return this.put(new Ie()).size(n, t).move(0, 0);
}) });
L(Ie, "Ellipse");
var vs = class extends ne {
  constructor(n = z.document.createDocumentFragment()) {
    super(n);
  }
  xml(n, t, e) {
    if (typeof n == "boolean" && (e = t, t = n, n = null), n == null || typeof n == "function") {
      const i = new ne(_e("wrapper", e));
      return i.add(this.node.cloneNode(!0)), i.xml(!1, e);
    }
    return super.xml(n, !1, e);
  }
};
L(vs, "Fragment");
var Ha = /* @__PURE__ */ se({
  from: () => ws,
  to: () => xs
});
function ws(n, t) {
  return (this._element || this).type === "radialGradient" ? this.attr({
    fx: new B(n),
    fy: new B(t)
  }) : this.attr({
    x1: new B(n),
    y1: new B(t)
  });
}
function xs(n, t) {
  return (this._element || this).type === "radialGradient" ? this.attr({
    cx: new B(n),
    cy: new B(t)
  }) : this.attr({
    x2: new B(n),
    y2: new B(t)
  });
}
var Oe = class extends dt {
  constructor(n, t) {
    super(U(n + "Gradient", typeof n == "string" ? null : n), t);
  }
  attr(n, t, e) {
    return n === "transform" && (n = "gradientTransform"), super.attr(n, t, e);
  }
  bbox() {
    return new q();
  }
  targets() {
    return Re(this.node, "fill");
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
R(Oe, Ha);
I({
  Container: { gradient(...n) {
    return this.defs().gradient(...n);
  } },
  Defs: { gradient: F(function(n, t) {
    return this.put(new Oe(n)).update(t);
  }) }
});
L(Oe, "Gradient");
var Ce = class extends dt {
  constructor(n, t = n) {
    super(U("pattern", n), t);
  }
  attr(n, t, e) {
    return n === "transform" && (n = "patternTransform"), super.attr(n, t, e);
  }
  bbox() {
    return new q();
  }
  targets() {
    return Re(this.node, "fill");
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
    return this.put(new Ce()).update(e).attr({
      x: 0,
      y: 0,
      width: n,
      height: t,
      patternUnits: "userSpaceOnUse"
    });
  }) }
});
L(Ce, "Pattern");
var Qe = class extends rt {
  constructor(t, e = t) {
    super(U("image", t), e);
  }
  load(t, e) {
    if (!t) return this;
    const i = new z.window.Image();
    return ot(i, "load", function(s) {
      const o = this.parent(Ce);
      this.width() === 0 && this.height() === 0 && this.size(i.width, i.height), o instanceof Ce && o.width() === 0 && o.height() === 0 && o.size(this.width(), this.height()), typeof e == "function" && e.call(this, s);
    }, this), ot(i, "load error", function() {
      K(i);
    }), this.attr("href", i.src = t, Ne);
  }
};
Pa(function(n, t, e) {
  return (n === "fill" || n === "stroke") && Qr.test(t) && (t = e.root().defs().image(t)), t instanceof Qe && (t = e.root().defs().pattern(0, 0, (i) => {
    i.add(t);
  })), t;
});
I({ Container: { image: F(function(n, t) {
  return this.put(new Qe()).size(0, 0).load(n, t);
}) } });
L(Qe, "Image");
var Rt = class extends ee {
  bbox() {
    let n = -1 / 0, t = -1 / 0, e = 1 / 0, i = 1 / 0;
    return this.forEach(function(s) {
      n = Math.max(s[0], n), t = Math.max(s[1], t), e = Math.min(s[0], e), i = Math.min(s[1], i);
    }), new q(e, i, n - e, t - i);
  }
  move(n, t) {
    const e = this.bbox();
    if (n -= e.x, t -= e.y, !isNaN(n) && !isNaN(t)) for (let i = this.length - 1; i >= 0; i--) this[i] = [this[i][0] + n, this[i][1] + t];
    return this;
  }
  parse(n = [0, 0]) {
    const t = [];
    n instanceof Array ? n = Array.prototype.concat.apply([], n) : n = n.trim().split(Et).map(parseFloat), n.length % 2 !== 0 && n.pop();
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
}, oi = /* @__PURE__ */ se({
  MorphArray: () => Fa,
  height: () => $a,
  width: () => Xa,
  x: () => Ua,
  y: () => Ya
});
const Fa = Rt;
function Ua(n) {
  return n == null ? this.bbox().x : this.move(n, this.bbox().y);
}
function Ya(n) {
  return n == null ? this.bbox().y : this.move(this.bbox().x, n);
}
function Xa(n) {
  const t = this.bbox();
  return n == null ? t.width : this.size(n, t.height);
}
function $a(n) {
  const t = this.bbox();
  return n == null ? t.height : this.size(t.width, n);
}
var ie = class extends rt {
  constructor(n, t = n) {
    super(U("line", n), t);
  }
  array() {
    return new Rt([[this.attr("x1"), this.attr("y1")], [this.attr("x2"), this.attr("y2")]]);
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
    } : n = new Rt(n).toLine(), this.attr(n));
  }
  size(n, t) {
    const e = Zt(this, n, t);
    return this.attr(this.array().size(e.width, e.height).toLine());
  }
};
R(ie, oi);
I({ Container: { line: F(function(...n) {
  return ie.prototype.plot.apply(this.put(new ie()), n[0] != null ? n : [
    0,
    0,
    0,
    0
  ]);
}) } });
L(ie, "Line");
var Ye = class extends dt {
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
    return this.put(new Ye()).size(n, t).ref(n / 2, t / 2).viewbox(0, 0, n, t).attr("orient", "auto").update(e);
  }) },
  marker: { marker(n, t, e, i) {
    let s = ["marker"];
    return n !== "all" && s.push(n), s = s.join("-"), n = arguments[1] instanceof Ye ? arguments[1] : this.defs().marker(t, e, i), this.attr(s, n);
  } }
});
L(Ye, "Marker");
function Jt(n, t) {
  return function(e) {
    return e == null ? this[n] : (this[n] = e, t && t.call(this), this);
  };
}
const ja = {
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
var ri = class {
  done() {
    return !1;
  }
}, Mn = class extends ri {
  constructor(n = ye.ease) {
    super(), this.ease = ja[n] || n;
  }
  step(n, t, e) {
    return typeof n != "number" ? e < 1 ? n : t : n + (t - n) * this.ease(e);
  }
}, Xe = class extends ri {
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
function Ei() {
  const n = (this._duration || 500) / 1e3, t = this._overshoot || 0, e = 1e-10, i = Math.PI, s = Math.log(t / 100 + e), o = -s / Math.sqrt(i * i + s * s), r = 3.9 / (o * n);
  this.d = 2 * o * r, this.k = r * r;
}
var qa = class extends Xe {
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
R(qa, {
  duration: Jt("_duration", Ei),
  overshoot: Jt("_overshoot", Ei)
});
var Za = class extends Xe {
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
R(Za, {
  windup: Jt("_windup"),
  p: Jt("P"),
  i: Jt("I"),
  d: Jt("D")
});
const Wa = {
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
}, kn = {
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
}, mn = "mlhvqtcsaz".split("");
for (let n = 0, t = mn.length; n < t; ++n) kn[mn[n]] = /* @__PURE__ */ function(e) {
  return function(i, s, o) {
    if (e === "H") i[0] = i[0] + s.x;
    else if (e === "V") i[0] = i[0] + s.y;
    else if (e === "A")
      i[5] = i[5] + s.x, i[6] = i[6] + s.y;
    else for (let r = 0, a = i.length; r < a; ++r) i[r] = i[r] + (r % 2 ? s.y : s.x);
    return kn[e](i, s, o);
  };
}(mn[n].toUpperCase());
function Va(n) {
  return kn[n.segment[0]](n.segment.slice(1), n.p, n.p0);
}
function Nn(n) {
  return n.segment.length && n.segment.length - 1 === Wa[n.segment[0].toUpperCase()];
}
function Ka(n, t) {
  n.inNumber && Yt(n, !1);
  const e = Jn.test(t);
  if (e) n.segment = [t];
  else {
    const i = n.lastCommand, s = i.toLowerCase();
    n.segment = [s === "m" ? i === s ? "l" : "L" : i];
  }
  return n.inSegment = !0, n.lastCommand = n.segment[0], e;
}
function Yt(n, t) {
  if (!n.inNumber) throw new Error("Parser Error");
  n.number && n.segment.push(parseFloat(n.number)), n.inNumber = t, n.number = "", n.pointSeen = !1, n.hasExponent = !1, Nn(n) && Rn(n);
}
function Rn(n) {
  n.inSegment = !1, n.absolute && (n.segment = Va(n)), n.segments.push(n.segment);
}
function Qa(n) {
  if (!n.segment.length) return !1;
  const t = n.segment[0].toUpperCase() === "A", e = n.segment.length;
  return t && (e === 4 || e === 5);
}
function Ja(n) {
  return n.lastToken.toUpperCase() === "E";
}
const tl = /* @__PURE__ */ new Set([
  " ",
  ",",
  "	",
  `
`,
  "\r",
  "\f"
]);
function el(n, t = !0) {
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
    p0: new Y(),
    p: new Y()
  };
  for (; s.lastToken = i, i = n.charAt(e++); )
    if (!(!s.inSegment && Ka(s, i))) {
      if (i === ".") {
        if (s.pointSeen || s.hasExponent) {
          Yt(s, !1), --e;
          continue;
        }
        s.inNumber = !0, s.pointSeen = !0, s.number += i;
        continue;
      }
      if (!isNaN(parseInt(i))) {
        if (s.number === "0" || Qa(s)) {
          s.inNumber = !0, s.number = i, Yt(s, !0);
          continue;
        }
        s.inNumber = !0, s.number += i;
        continue;
      }
      if (tl.has(i)) {
        s.inNumber && Yt(s, !1);
        continue;
      }
      if (i === "-" || i === "+") {
        if (s.inNumber && !Ja(s)) {
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
      if (Jn.test(i)) {
        if (s.inNumber) Yt(s, !1);
        else if (Nn(s)) Rn(s);
        else throw new Error("parser Error");
        --e;
      }
    }
  return s.inNumber && Yt(s, !1), s.inSegment && Nn(s) && Rn(s), s.segments;
}
function nl(n) {
  let t = "";
  for (let e = 0, i = n.length; e < i; e++)
    t += n[e][0], n[e][1] != null && (t += n[e][1], n[e][2] != null && (t += " ", t += n[e][2], n[e][3] != null && (t += " ", t += n[e][3], t += " ", t += n[e][4], n[e][5] != null && (t += " ", t += n[e][5], t += " ", t += n[e][6], n[e][7] != null && (t += " ", t += n[e][7])))));
  return t + " ";
}
var Pt = class extends ee {
  bbox() {
    return wt().path.setAttribute("d", this.toString()), new q(wt.nodes.path.getBBox());
  }
  move(n, t) {
    const e = this.bbox();
    if (n -= e.x, t -= e.y, !isNaN(n) && !isNaN(t)) for (let i, s = this.length - 1; s >= 0; s--)
      i = this[s][0], i === "M" || i === "L" || i === "T" ? (this[s][1] += n, this[s][2] += t) : i === "H" ? this[s][1] += n : i === "V" ? this[s][1] += t : i === "C" || i === "S" || i === "Q" ? (this[s][1] += n, this[s][2] += t, this[s][3] += n, this[s][4] += t, i === "C" && (this[s][5] += n, this[s][6] += t)) : i === "A" && (this[s][6] += n, this[s][7] += t);
    return this;
  }
  parse(n = "M0 0") {
    return Array.isArray(n) && (n = Array.prototype.concat.apply([], n).toString()), el(n);
  }
  size(n, t) {
    const e = this.bbox();
    let i, s;
    for (e.width = e.width === 0 ? 1 : e.width, e.height = e.height === 0 ? 1 : e.height, i = this.length - 1; i >= 0; i--)
      s = this[i][0], s === "M" || s === "L" || s === "T" ? (this[i][1] = (this[i][1] - e.x) * n / e.width + e.x, this[i][2] = (this[i][2] - e.y) * t / e.height + e.y) : s === "H" ? this[i][1] = (this[i][1] - e.x) * n / e.width + e.x : s === "V" ? this[i][1] = (this[i][1] - e.y) * t / e.height + e.y : s === "C" || s === "S" || s === "Q" ? (this[i][1] = (this[i][1] - e.x) * n / e.width + e.x, this[i][2] = (this[i][2] - e.y) * t / e.height + e.y, this[i][3] = (this[i][3] - e.x) * n / e.width + e.x, this[i][4] = (this[i][4] - e.y) * t / e.height + e.y, s === "C" && (this[i][5] = (this[i][5] - e.x) * n / e.width + e.x, this[i][6] = (this[i][6] - e.y) * t / e.height + e.y)) : s === "A" && (this[i][1] = this[i][1] * n / e.width, this[i][2] = this[i][2] * t / e.height, this[i][6] = (this[i][6] - e.x) * n / e.width + e.x, this[i][7] = (this[i][7] - e.y) * t / e.height + e.y);
    return this;
  }
  toString() {
    return nl(this);
  }
};
const _s = (n) => {
  const t = typeof n;
  return t === "number" ? B : t === "string" ? yt.isColor(n) ? yt : Et.test(n) ? Jn.test(n) ? Pt : ee : os.test(n) ? B : Pn : ai.indexOf(n.constructor) > -1 ? n.constructor : Array.isArray(n) ? ee : t === "object" ? Ee : Pn;
};
var At = class {
  constructor(n) {
    this._stepper = n || new Mn("-"), this._from = null, this._to = null, this._type = null, this._context = null, this._morphObj = null;
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
    this._type || this.type(_s(n));
    let t = new this._type(n);
    return this._type === yt && (t = this._to ? t[this._to[4]]() : this._from ? t[this._from[4]]() : t), this._type === Ee && (t = this._to ? t.align(this._to) : this._from ? t.align(this._from) : t), t = t.toConsumable(), this._morphObj = this._morphObj || new this._type(), this._context = this._context || Array.apply(null, Array(t.length)).map(Object).map(function(e) {
      return e.done = !0, e;
    }), t;
  }
}, Pn = class {
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
}, ve = class Cs {
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
    }), Object.assign(this, Cs.defaults, t), this;
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
ve.defaults = {
  scaleX: 1,
  scaleY: 1,
  shear: 0,
  rotate: 0,
  translateX: 0,
  translateY: 0,
  originX: 0,
  originY: 0
};
const il = (n, t) => n[0] < t[0] ? -1 : n[0] > t[0] ? 1 : 0;
var Ee = class {
  constructor(...n) {
    this.init(...n);
  }
  align(n) {
    const t = this.values;
    for (let e = 0, i = t.length; e < i; ++e) {
      if (t[e + 1] === n[e + 1]) {
        if (t[e + 1] === yt && n[e + 7] !== t[e + 7]) {
          const r = n[e + 7], a = new yt(this.values.splice(e + 3, 5))[r]().toArray();
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
      const i = _s(n[e]), s = new i(n[e]).toArray();
      t.push([
        e,
        i,
        s.length,
        ...s
      ]);
    }
    return t.sort(il), this.values = t.reduce((e, i) => e.concat(i), []), this;
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
const ai = [
  Pn,
  ve,
  Ee
];
function sl(n = []) {
  ai.push(...[].concat(n));
}
function ol() {
  R(ai, {
    to(n) {
      return new At().type(this.constructor).from(this.toArray()).to(n);
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
var oe = class extends rt {
  constructor(n, t = n) {
    super(U("path", n), t);
  }
  array() {
    return this._array || (this._array = new Pt(this.attr("d")));
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
    return n == null ? this.array() : this.clear().attr("d", typeof n == "string" ? n : this._array = new Pt(n));
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
oe.prototype.MorphArray = Pt;
I({ Container: { path: F(function(n) {
  return this.put(new oe()).plot(n || new Pt());
}) } });
L(oe, "Path");
var Es = /* @__PURE__ */ se({
  array: () => rl,
  clear: () => al,
  move: () => ll,
  plot: () => cl,
  size: () => hl
});
function rl() {
  return this._array || (this._array = new Rt(this.attr("points")));
}
function al() {
  return delete this._array, this;
}
function ll(n, t) {
  return this.attr("points", this.array().move(n, t));
}
function cl(n) {
  return n == null ? this.array() : this.clear().attr("points", typeof n == "string" ? n : this._array = new Rt(n));
}
function hl(n, t) {
  const e = Zt(this, n, t);
  return this.attr("points", this.array().size(e.width, e.height));
}
var re = class extends rt {
  constructor(n, t = n) {
    super(U("polygon", n), t);
  }
};
I({ Container: { polygon: F(function(n) {
  return this.put(new re()).plot(n || new Rt());
}) } });
R(re, oi);
R(re, Es);
L(re, "Polygon");
var ae = class extends rt {
  constructor(n, t = n) {
    super(U("polyline", n), t);
  }
};
I({ Container: { polyline: F(function(n) {
  return this.put(new ae()).plot(n || new Rt());
}) } });
R(ae, oi);
R(ae, Es);
L(ae, "Polyline");
var De = class extends rt {
  constructor(n, t = n) {
    super(U("rect", n), t);
  }
};
R(De, {
  rx: ii,
  ry: si
});
I({ Container: { rect: F(function(n, t) {
  return this.put(new De()).size(n, t);
}) } });
L(De, "Rect");
var yn = class {
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
const G = {
  nextDraw: null,
  frames: new yn(),
  timeouts: new yn(),
  immediates: new yn(),
  timer: () => z.window.performance || z.window.Date,
  frame(n) {
    const t = G.frames.push({ run: n });
    return G.nextDraw === null && (G.nextDraw = z.window.requestAnimationFrame(G._draw)), t;
  },
  timeout(n, t) {
    t = t || 0;
    const e = G.timer().now() + t, i = G.timeouts.push({
      run: n,
      time: e
    });
    return G.nextDraw === null && (G.nextDraw = z.window.requestAnimationFrame(G._draw)), i;
  },
  immediate(n) {
    const t = G.immediates.push(n);
    return G.nextDraw === null && (G.nextDraw = z.window.requestAnimationFrame(G._draw)), t;
  },
  cancelFrame(n) {
    n != null && G.frames.remove(n);
  },
  clearTimeout(n) {
    n != null && G.timeouts.remove(n);
  },
  cancelImmediate(n) {
    n != null && G.immediates.remove(n);
  },
  _draw(n) {
    try {
      let t = null;
      const e = G.timeouts.last();
      for (; (t = G.timeouts.shift()) && (n >= t.time ? t.run() : G.timeouts.push(t), t !== e); )
        ;
      let i = null;
      const s = G.frames.last();
      for (; i !== s && (i = G.frames.shift()); ) i.run(n);
      let o = null;
      for (; o = G.immediates.shift(); ) o();
    } finally {
      const t = G.timeouts.first() || G.frames.first() || G.immediates.first();
      G.nextDraw = t ? z.window.requestAnimationFrame(G._draw) : null;
    }
  }
}, dl = function(n) {
  const t = n.start, e = n.runner.duration();
  return {
    start: t,
    duration: e,
    end: t + e,
    runner: n.runner
  };
}, ul = function() {
  const n = z.window;
  return (n.performance || n.Date).now();
};
var Ss = class extends Pe {
  constructor(n = ul) {
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
    if (n == null) return this._runners.map(dl);
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
    return G.cancelFrame(this._nextFrame), this._nextFrame = null, n ? this._stepImmediate() : this._paused ? this : (this._nextFrame = G.frame(this._step), this);
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
    G.cancelFrame(this._nextFrame), this._generation = (this._generation || 0) + 1, this._startTime = 0, this._speed = 1, this._persist = 0;
    for (const { runner: n } of this._runners || [])
      n._retired = !0, n._runnerInfo = null;
    this._nextFrame = null, this._paused = !0, this._finishing = !1, this._runners = [], this._runnerIds = [], this._lastRunnerId = -1, this._time = 0, this._lastSourceTime = 0, this._lastStepTime = 0, this._step = this._stepFn.bind(this, !1), this._stepImmediate = this._stepFn.bind(this, !0);
  }
};
I({ Element: { timeline: function(n) {
  return n == null ? (this._timeline = this._timeline || new Ss(), this._timeline) : (this._timeline = n, this);
} } });
var Ct = class He extends Pe {
  constructor(t) {
    super(), this.id = He.id++, t = t ?? ye.duration, t = typeof t == "function" ? new Xe(t) : t, this._element = null, this._timeline = null, this._runnerInfo = null, this.done = !1, this._queue = [], this._duration = typeof t == "number" && t, this._isDeclarative = t instanceof Xe, this._stepper = this._isDeclarative ? t : new Mn(), this._history = {}, this.enabled = !0, this._time = 0, this._lastTime = 0, this._reseted = !0, this.transforms = new P(), this._isAbsoluteTransform = !1, this._hasTransform = !1, this._transformInitialised = !1, this._transformActive = !1, this._retired = !1, this._reverse = !1, this._swing = !1, this._wait = 0, this._times = 1, this._persist = this._isDeclarative ? !0 : null;
  }
  static sanitise(t, e, i) {
    let s = 1, o = !1, r = 0;
    return t = t ?? ye.duration, e = e ?? ye.delay, i = i || "last", typeof t == "object" && !(t instanceof ri) && (e = t.delay ?? e, i = t.when ?? i, o = t.swing || o, s = t.times ?? s, r = t.wait ?? r, t = t.duration ?? ye.duration), {
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
    const s = He.sanitise(t, e, i), o = new He(s.duration);
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
    return this._stepper = new Mn(t), this;
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
      const d = function(f) {
        const p = r * Math.floor(f % (2 * (s + i)) / (s + i)), g = p && !a || !p && a, y = Math.pow(-1, g) * (f % (s + i)) / i + g;
        return Math.max(Math.min(y, 1), 0);
      }, u = o * (s + i) - s;
      return l = e <= 0 ? Math.round(d(1e-5)) : e < u ? d(e) : Math.round(d(u - 1e-5)), l;
    }
    const c = Math.floor(this.loops()), h = r && c % 2 === 0;
    return l = c + (h && !a || a && h ? t : 1 - t), this.loops(l);
  }
  progress(t) {
    return t == null ? Math.min(1, this._time / this.duration()) : this.time(t * this.duration());
  }
  queue(t, e, i, s) {
    return this._isDeclarative && (this.done = !1), this._queue.push({
      initialiser: t || Ci,
      runner: e || Ci,
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
    if (t instanceof Ss || (i = e, e = t, t = this.timeline()), !t) throw Error("Runner cannot be scheduled without timeline");
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
Ct.id = 0;
var In = class {
  constructor(n = new P(), t = -1, e = !0, i = !1) {
    this.transforms = n, this.id = t, this.done = e, this._isAbsoluteTransform = i, this._transformActive = !0, this._retired = !0;
  }
};
R([Ct, In], { mergeWith(n) {
  return new In(this._isAbsoluteTransform ? this.transforms : n.transforms.lmultiply(this.transforms), n.id, !0, n._isAbsoluteTransform || this._isAbsoluteTransform);
} });
const Ts = (n, t) => n.lmultiplyO(t), As = (n) => n.transforms, fl = (n) => n._transformActive;
function Ms(n) {
  const t = n.filter(fl);
  let e = 0;
  for (let i = 0; i < t.length; ++i) t[i]._isAbsoluteTransform && (e = i);
  return t.slice(e);
}
function pl() {
  const n = Ms(this._transformationRunners.runners).map(As).reduce(Ts, new P());
  this.transform(n), this._transformationRunners.merge(), this._transformationRunners.length() === 1 && (this._frameId = null);
}
var gl = class {
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
    const i = Ct.sanitise(n, t, e), s = this.timeline();
    return new Ct(i.duration).loop(i).element(this).timeline(s.play()).schedule(i.delay, i.when);
  },
  delay(n, t) {
    return this.animate(0, n, t);
  },
  _currentTransform(n) {
    const t = this._transformationRunners.runners, e = t.indexOf(n);
    return Ms(t.slice(0, e + 1)).map(As).reduce(Ts, new P());
  },
  _addRunner(n) {
    this._transformationRunners.length() === 1 && this._transformationRunners.runners[0].id === -1 && (this._transformationRunners.runners[0].transforms = new P(this)), this._transformationRunners.add(n), G.cancelImmediate(this._frameId), this._frameId = G.immediate(pl.bind(this));
  },
  _prepareRunner() {
    this._frameId == null && (this._transformationRunners = new gl().add(new In(new P(this))));
  }
} });
const ml = (n, t) => n.filter((e) => !(0, Xt.default)(t).call(t, e));
R(Ct, {
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
    let o = new At(this._stepper).to(i), r = Object.keys(i);
    return this.queue(function() {
      o = o.from(this.element()[n](r));
    }, function(a) {
      return this.element()[n](o.at(a).valueOf()), o.done();
    }, function(a) {
      const l = ml(Object.keys(a), r);
      if (l.length && o.from() != null) {
        const h = this.element()[n](l), d = new Ee(o.from()).valueOf();
        Object.assign(d, h), o.from(d);
      }
      const c = new Ee(o.to()).valueOf();
      Object.assign(c, a), o.to(c), r = Object.keys(c);
    }), this._rememberMorpher(n, o), this;
  },
  zoom(n, t) {
    if (this._tryRetarget("zoom", n, t)) return this;
    let e = new At(this._stepper).to(new B(n));
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
    const s = new At(this._stepper).type(e ? ve : P), o = e ? new At(this._stepper).type(P) : s;
    let r, a, l, c, h;
    function d() {
      a = a || this.element(), r = r || _n(n, a), h = new P(t ? void 0 : a), a._addRunner(this);
    }
    function u(p) {
      t || this.clearTransform();
      const { x: g, y } = new Y(r).transform(a._currentTransform(this)), m = {
        ...n,
        origin: [g, y]
      };
      m.relative === !0 && delete m.relative;
      let b = new P(m), v = this._isDeclarative && l ? l : h, x = s;
      if (e) {
        const w = b.decompose(g, y), E = v.decompose(g, y);
        if (!new ve(w).toArray().concat(new ve(E).toArray()).every(Number.isFinite)) x = o;
        else {
          b = w, v = E;
          const C = b.rotate, S = v.rotate, T = [
            C - 360,
            C,
            C + 360
          ], k = T.map((H) => Math.abs(H - S)), O = Math.min(...k), D = k.indexOf(O);
          b.rotate = T[D];
        }
      }
      t && x === s && (i || (b.rotate = n.rotate || 0), this._isDeclarative && c && (v.rotate = c)), x.from(v), x.to(b);
      const _ = x.at(p);
      return c = _.rotate, l = new P(_), this.addTransform(l), a._addRunner(this), x.done();
    }
    function f(p) {
      r = _n(p, a), n = { ...p };
    }
    return this.queue(d, u, f, !0), this._isDeclarative && this._rememberMorpher("transform", s), this;
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
    if (t = new B(t), this._tryRetarget(n, t)) return this;
    const e = new At(this._stepper).to(t);
    let i = null;
    return this.queue(function() {
      i = this.element()[n](), e.from(i), e.to(i + t);
    }, function(s) {
      return this.element()[n](e.at(s)), e.done();
    }, function(s) {
      e.to(i + new B(s));
    }), this._rememberMorpher(n, e), this;
  },
  _queueObject(n, t) {
    if (this._tryRetarget(n, t)) return this;
    const e = new At(this._stepper).to(t);
    return this.queue(function() {
      e.from(this.element()[n]());
    }, function(i) {
      return this.element()[n](e.at(i)), e.done();
    }), this._rememberMorpher(n, e), this;
  },
  _queueNumber(n, t) {
    return this._queueObject(n, new B(t));
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
    const s = new At(this._stepper).type(this._element.MorphArray).to(n);
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
    return this._queueObject("viewbox", new q(n, t, e, i));
  },
  update(n) {
    return typeof n != "object" ? this.update({
      offset: arguments[0],
      color: arguments[1],
      opacity: arguments[2]
    }) : (n.opacity != null && this.attr("stop-opacity", n.opacity), n.color != null && this.attr("stop-color", n.color), n.offset != null && this.attr("offset", n.offset), this);
  }
});
R(Ct, {
  rx: ii,
  ry: si,
  from: ws,
  to: xs
});
L(Ct, "Runner");
var Je = class extends dt {
  constructor(n, t = n) {
    super(U("svg", n), t), this.namespace();
  }
  defs() {
    return this.isRoot() ? tt(this.node.querySelector("defs")) || this.put(new ni()) : this.root().defs();
  }
  isRoot() {
    return !this.node.parentNode || !(this.node.parentNode instanceof z.window.SVGElement) && this.node.parentNode.nodeName !== "#document-fragment";
  }
  namespace() {
    return this.isRoot() ? this.attr({
      xmlns: Wn,
      version: "1.1"
    }).attr("xmlns:xlink", Ne, fn) : this.root().namespace();
  }
  removeNamespace() {
    return this.attr({
      xmlns: null,
      version: null
    }).attr("xmlns:xlink", null, fn).attr("xmlns:svgjs", null, fn);
  }
  root() {
    return this.isRoot() ? this : super.root();
  }
};
I({ Container: { nested: F(function() {
  return this.put(new Je());
}) } });
L(Je, "Svg", !0);
var li = class extends dt {
  constructor(n, t = n) {
    super(U("symbol", n), t);
  }
};
I({ Container: { symbol: F(function() {
  return this.put(new li());
}) } });
L(li, "Symbol");
var ks = /* @__PURE__ */ se({
  amove: () => Al,
  ax: () => Sl,
  ay: () => Tl,
  build: () => Ml,
  center: () => El,
  cx: () => _l,
  cy: () => Cl,
  length: () => bl,
  move: () => xl,
  plain: () => yl,
  x: () => vl,
  y: () => wl
});
function yl(n) {
  return this._build === !1 && this.clear(), this.node.appendChild(z.document.createTextNode(n)), this;
}
function bl() {
  return this.node.getComputedTextLength();
}
function vl(n, t = this.bbox()) {
  return n == null ? t.x : this.attr("x", this.attr("x") + n - t.x);
}
function wl(n, t = this.bbox()) {
  return n == null ? t.y : this.attr("y", this.attr("y") + n - t.y);
}
function xl(n, t, e = this.bbox()) {
  return this.x(n, e).y(t, e);
}
function _l(n, t = this.bbox()) {
  return n == null ? t.cx : this.attr("x", this.attr("x") + n - t.cx);
}
function Cl(n, t = this.bbox()) {
  return n == null ? t.cy : this.attr("y", this.attr("y") + n - t.cy);
}
function El(n, t, e = this.bbox()) {
  return this.cx(n, e).cy(t, e);
}
function Sl(n) {
  return this.attr("x", n);
}
function Tl(n) {
  return this.attr("y", n);
}
function Al(n, t) {
  return this.ax(n).ay(t);
}
function Ml(n) {
  return this._build = !!n, this;
}
var ft = class extends rt {
  constructor(n, t = n) {
    super(U("text", n), t), this.dom.leading = this.dom.leading ?? new B(1.3), this._rebuild = !0, this._build = !1;
  }
  leading(n) {
    return n == null ? this.dom.leading : (this.dom.leading = new B(n), this.rebuild());
  }
  rebuild(n) {
    if (typeof n == "boolean" && (this._rebuild = n), this._rebuild) {
      const t = this;
      let e = 0;
      const i = this.dom.leading;
      this.each(function(s) {
        if (Cn(this.node)) return;
        const o = z.window.getComputedStyle(this.node).getPropertyValue("font-size"), r = i * new B(o);
        this.dom.newLined && (this.attr("x", t.attr("x")), this.text() === `
` ? e += r : (this.attr("dy", s ? r + e : 0), e = 0));
      }), this.fire("rebuild");
    }
    return this;
  }
  setData(n) {
    return this.dom = n, this.dom.leading = new B(n.leading || 1.3), this;
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
        if (t[i].nodeName === "textPath" || Cn(t[i])) {
          i === 0 && (e = i + 1);
          continue;
        }
        i !== e && t[i].nodeType !== 3 && tt(t[i]).dom.newLined === !0 && (n += `
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
R(ft, ks);
I({ Container: {
  text: F(function(n = "") {
    return this.put(new ft()).text(n);
  }),
  plain: F(function(n = "") {
    return this.put(new ft()).plain(n);
  })
} });
L(ft, "Text");
var tn = class extends rt {
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
    if (!(n instanceof ft)) return this;
    const t = n.index(this), e = z.window.getComputedStyle(this.node).getPropertyValue("font-size"), i = n.dom.leading * new B(e);
    return this.dy(t ? i : 0).attr("x", n.x());
  }
  text(n) {
    return n == null ? this.node.textContent + (this.dom.newLined ? `
` : "") : (typeof n == "function" ? (this.clear().build(!0), n.call(this, this), this.build(!1)) : this.plain(n), this);
  }
};
R(tn, ks);
I({
  Tspan: { tspan: F(function(n = "") {
    const t = new tn();
    return this._build || this.clear(), this.put(t).text(n);
  }) },
  Text: { newLine: function(n = "") {
    return this.tspan(n).newLine();
  } }
});
L(tn, "Tspan");
var en = class extends rt {
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
    return this.radius(new B(n).divide(2));
  }
};
R(en, {
  x: fs,
  y: ps,
  cx: gs,
  cy: ms,
  width: ys,
  height: bs
});
I({ Container: { circle: F(function(n = 0) {
  return this.put(new en()).size(n).move(0, 0);
}) } });
L(en, "Circle");
var On = class extends dt {
  constructor(n, t = n) {
    super(U("clipPath", n), t);
  }
  remove() {
    return this.targets().forEach(function(n) {
      n.unclip();
    }), super.remove();
  }
  targets() {
    return Re(this.node, "clip-path");
  }
};
I({
  Container: { clip: F(function() {
    return this.defs().put(new On());
  }) },
  Element: {
    clipper() {
      return this.reference("clip-path");
    },
    clipWith(n) {
      const t = n instanceof On ? n : this.parent().clip().add(n);
      return this.attr("clip-path", "url(#" + t.id() + ")");
    },
    unclip() {
      return this.attr("clip-path", null);
    }
  }
});
L(On, "ClipPath");
var Ns = class extends it {
  constructor(n, t = n) {
    super(U("foreignObject", n), t);
  }
};
I({ Container: { foreignObject: F(function(n, t) {
  return this.put(new Ns()).size(n, t);
}) } });
L(Ns, "ForeignObject");
var Rs = /* @__PURE__ */ se({
  dmove: () => kl,
  dx: () => Nl,
  dy: () => Rl,
  height: () => Pl,
  move: () => Il,
  size: () => Ol,
  width: () => Dl,
  x: () => zl,
  y: () => Ll
});
function kl(n, t) {
  return this.children().forEach((e) => {
    let i;
    try {
      i = e.node instanceof Vn().SVGSVGElement ? new q(e.attr([
        "x",
        "y",
        "width",
        "height"
      ])) : e.bbox();
    } catch {
      return;
    }
    const s = new P(e), o = s.translate(n, t).transform(s.inverse()), r = new Y(i.x, i.y).transform(o);
    e.dmove(r.x - i.x, r.y - i.y);
  }), this;
}
function Nl(n) {
  return this.dmove(n, 0);
}
function Rl(n) {
  return this.dmove(0, n);
}
function Pl(n, t = this.bbox()) {
  return n == null ? t.height : this.size(t.width, n, t);
}
function Il(n = 0, t = 0, e = this.bbox()) {
  const i = n - e.x, s = t - e.y;
  return this.dmove(i, s);
}
function Ol(n, t, e = this.bbox()) {
  const i = Zt(this, n, t, e), s = i.width / e.width, o = i.height / e.height;
  return this.children().forEach((r) => {
    const a = new Y(e).transform(new P(r).inverse());
    r.scale(s, o, a.x, a.y);
  }), this;
}
function Dl(n, t = this.bbox()) {
  return n == null ? t.width : this.size(n, t.height, t);
}
function zl(n, t = this.bbox()) {
  return n == null ? t.x : this.move(n, t.y, t);
}
function Ll(n, t = this.bbox()) {
  return n == null ? t.y : this.move(t.x, n, t);
}
var le = class extends dt {
  constructor(n, t = n) {
    super(U("g", n), t);
  }
};
R(le, Rs);
I({ Container: { group: F(function() {
  return this.put(new le());
}) } });
L(le, "G");
var $e = class extends dt {
  constructor(n, t = n) {
    super(U("a", n), t);
  }
  target(n) {
    return this.attr("target", n);
  }
  to(n) {
    return this.attr("href", n, Ne);
  }
};
R($e, Rs);
I({
  Container: { link: F(function(n) {
    return this.put(new $e()).to(n);
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
      return t || (t = new $e(), this.wrap(t)), typeof n == "function" ? n.call(t, t) : t.to(n), this;
    },
    linker() {
      const n = this.parent();
      return n && n.node.nodeName.toLowerCase() === "a" ? n : null;
    }
  }
});
L($e, "A");
var Dn = class extends dt {
  constructor(n, t = n) {
    super(U("mask", n), t);
  }
  remove() {
    return this.targets().forEach(function(n) {
      n.unmask();
    }), super.remove();
  }
  targets() {
    return Re(this.node, "mask");
  }
};
I({
  Container: { mask: F(function() {
    return this.defs().put(new Dn());
  }) },
  Element: {
    masker() {
      return this.reference("mask");
    },
    maskWith(n) {
      const t = n instanceof Dn ? n : this.parent().mask().add(n);
      return this.attr("mask", "url(#" + t.id() + ")");
    },
    unmask() {
      return this.attr("mask", null);
    }
  }
});
L(Dn, "Mask");
var Ps = class extends it {
  constructor(n, t = n) {
    super(U("stop", n), t);
  }
  update(n) {
    return (typeof n == "number" || n instanceof B) && (n = {
      offset: arguments[0],
      color: arguments[1],
      opacity: arguments[2]
    }), n.opacity != null && this.attr("stop-opacity", n.opacity), n.color != null && this.attr("stop-color", n.color), n.offset != null && this.attr("offset", new B(n.offset)), this;
  }
};
I({ Gradient: { stop: function(n, t, e) {
  return this.put(new Ps()).update(n, t, e);
} } });
L(Ps, "Stop");
function Bl(n, t) {
  if (!n) return "";
  if (!t) return n;
  let e = n + "{";
  for (const i in t) e += es(i) + ":" + t[i] + ";";
  return e += "}", e;
}
var zn = class extends it {
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
    return this.addText(Bl(n, t));
  }
};
I("Dom", {
  style(n, t) {
    return this.put(new zn()).rule(n, t);
  },
  fontface(n, t, e) {
    return this.put(new zn()).font(n, t, e);
  }
});
L(zn, "Style");
var ci = class extends ft {
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
    return n instanceof ft || (n = this.text(n)), n.path(t);
  }) },
  Text: {
    path: F(function(n, t = !0) {
      const e = new ci();
      n instanceof oe || (n = this.defs().path(n)), e.attr("href", "#" + n, Ne);
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
      return n instanceof ft || (n = new ft().addTo(this.parent()).text(n)), n.path(this);
    }),
    targets() {
      return Re(this.node, "href", "textPath");
    }
  }
});
ci.prototype.MorphArray = Pt;
L(ci, "TextPath");
var Is = class extends rt {
  constructor(n, t = n) {
    super(U("use", n), t);
  }
  use(n, t) {
    return this.attr("href", (t || "") + "#" + n, Ne);
  }
};
I({ Container: { use: F(function(n, t) {
  return this.put(new Is()).use(n, t);
}) } });
L(Is, "Use");
const nn = Q;
R([
  Je,
  li,
  Qe,
  Ce,
  Ye
], nt("viewbox"));
R([
  ie,
  ae,
  re,
  oe
], nt("marker"));
R(ft, nt("Text"));
R(oe, nt("Path"));
R(ni, nt("Defs"));
R([ft, tn], nt("Tspan"));
R([
  De,
  Ie,
  Oe,
  Ct
], nt("radius"));
R(Pe, nt("EventTarget"));
R(ne, nt("Dom"));
R(it, nt("Element"));
R(rt, nt("Shape"));
R([dt, vs], nt("Container"));
R(Oe, nt("Gradient"));
R(Ct, nt("Runner"));
_t.extend(Fo());
sl([
  B,
  yt,
  q,
  P,
  ee,
  Rt,
  Pt,
  Y
]);
ol();
var Si = (n) => (n.changedTouches && (n = n.changedTouches[0]), {
  x: n.clientX,
  y: n.clientY
}), Gl = class {
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
    n.preventDefault(), n.stopPropagation(), this.init(!1), this.box = this.el.bbox(), this.lastClick = this.el.point(Si(n));
    const e = (t ? "mousemove" : "touchmove") + ".drag", i = (t ? "mouseup" : "touchend") + ".drag";
    ot(window, e, this.drag, this, { passive: !1 }), ot(window, i, this.endDrag, this, { passive: !1 }), this.el.fire("dragstart", {
      event: n,
      handler: this,
      box: this.box
    });
  }
  drag(n) {
    const { box: t, lastClick: e } = this, i = this.el.point(Si(n)), s = i.x - e.x, o = i.y - e.y;
    if (!s && !o) return t;
    const r = t.x + s, a = t.y + o;
    this.box = new q(r, a, t.w, t.h), this.lastClick = i, !this.el.dispatch("dragmove", {
      event: n,
      handler: this,
      box: this.box,
      dx: s,
      dy: o
    }).defaultPrevented && this.move(r, a);
  }
  move(n, t) {
    this.el.type === "svg" ? le.prototype.move.call(this.el, n, t) : this.el.move(n, t);
  }
  endDrag(n) {
    this.drag(n), this.el.fire("dragend", {
      event: n,
      handler: this,
      box: this.box
    }), K(window, "mousemove.drag"), K(window, "touchmove.drag"), K(window, "mouseup.drag"), K(window, "touchend.drag"), this.init(!0);
  }
};
R(it, { draggable(n = !0) {
  return (this.remember("_draggable") || new Gl(this)).init(n), this;
} });
var pe = (n) => n.touches || [{
  clientX: n.clientX,
  clientY: n.clientY
}];
R(Je, { panZoom(n) {
  if (this.off(".panZoom"), n === !1) return this;
  n = n ?? {};
  const t = n.zoomFactor ?? 2, e = n.zoomMin ?? Number.MIN_VALUE, i = n.zoomMax ?? Number.MAX_VALUE, s = n.wheelZoom ?? !0, o = n.pinchZoom ?? !0, r = n.panning ?? !0, a = n.panButton ?? 0, l = n.oneFingerPan ?? !1, c = n.margins ?? !1, h = n.wheelZoomDeltaModeLinePixels ?? 17, d = n.wheelZoomDeltaModeScreenPixels ?? 53;
  let u, f, p = !1;
  const g = this.viewbox(), y = (C) => {
    if (!c) return C;
    const { top: S, left: T, bottom: k, right: O } = c, { width: D, height: H } = this.attr(["width", "height"]), M = this.node.preserveAspectRatio.baseVal;
    let W = 0, J = 0, at = 0, pt = 0;
    if (M.align !== M.SVG_PRESERVEASPECTRATIO_NONE) {
      const lt = D / H, st = g.width / g.height;
      if (st !== lt) {
        const he = M.meetOrSlice !== M.SVG_MEETORSLICE_SLICE, Lt = lt > st ? "width" : "height", de = Lt === "width", ue = he && de || !he && !de, dn = ue ? lt / st : st / lt, gt = C[Lt] - C[Lt] * dn;
        ue ? M.align === M.SVG_PRESERVEASPECTRATIO_XMIDYMIN || M.align === M.SVG_PRESERVEASPECTRATIO_XMIDYMID || M.align === M.SVG_PRESERVEASPECTRATIO_XMIDYMAX ? (W = gt / 2, J = -gt / 2) : M.align === M.SVG_PRESERVEASPECTRATIO_XMINYMIN || M.align === M.SVG_PRESERVEASPECTRATIO_XMINYMID || M.align === M.SVG_PRESERVEASPECTRATIO_XMINYMAX ? J = -gt : (M.align === M.SVG_PRESERVEASPECTRATIO_XMAXYMIN || M.align === M.SVG_PRESERVEASPECTRATIO_XMAXYMID || M.align === M.SVG_PRESERVEASPECTRATIO_XMAXYMAX) && (W = gt) : M.align === M.SVG_PRESERVEASPECTRATIO_XMINYMID || M.align === M.SVG_PRESERVEASPECTRATIO_XMIDYMID || M.align === M.SVG_PRESERVEASPECTRATIO_XMAXYMID ? (at = gt / 2, pt = -gt / 2) : M.align === M.SVG_PRESERVEASPECTRATIO_XMINYMIN || M.align === M.SVG_PRESERVEASPECTRATIO_XMIDYMIN || M.align === M.SVG_PRESERVEASPECTRATIO_XMAXYMIN ? pt = -gt : (M.align === M.SVG_PRESERVEASPECTRATIO_XMINYMAX || M.align === M.SVG_PRESERVEASPECTRATIO_XMIDYMAX || M.align === M.SVG_PRESERVEASPECTRATIO_XMAXYMAX) && (at = gt);
      }
    }
    const vt = g.width + g.x - T - W, zt = g.x + O - C.width - J, St = g.height + g.y - S - at, Tt = g.y + k - C.height - pt;
    return C.x = Math.min(vt, Math.max(zt, C.x)), C.y = Math.min(St, Math.max(Tt, C.y)), C;
  }, m = function(C) {
    C.preventDefault();
    let S;
    switch (C.deltaMode) {
      case 1:
        S = C.deltaY * h;
        break;
      case 2:
        S = C.deltaY * d;
        break;
      default:
        S = C.deltaY;
    }
    let T = Math.pow(1 + t, -1 * S / 100) * this.zoom();
    const k = this.point(C.clientX, C.clientY);
    if (T > i && (T = i), T < e && (T = e), this.dispatch("zoom", {
      level: T,
      focus: k
    }).defaultPrevented) return this;
    if (this.zoom(T, k), c) {
      const O = y(this.viewbox());
      this.viewbox(O);
    }
    this.dispatch("afterZoom", {
      box: this.viewbox(),
      focus: k
    });
  }, b = function(C) {
    if (f = pe(C), f.length < 2) {
      r && l && _.call(this, C);
      return;
    }
    r && l && w.call(this, C), C.preventDefault(), !this.dispatch("pinchZoomStart", { event: C }).defaultPrevented && (this.off("touchstart.panZoom", b), p = !0, ot(document, "touchmove.panZoom", x, this, { passive: !1 }), ot(document, "touchend.panZoom", v, this, { passive: !1 }));
  }, v = function(C) {
    C.preventDefault();
    const S = pe(C);
    S.length > 1 || (p = !1, this.dispatch("pinchZoomEnd", { event: C }), K(document, "touchmove.panZoom", x), K(document, "touchend.panZoom", v), this.on("touchstart.panZoom", b), S.length && r && l && _.call(this, C));
  }, x = function(C) {
    C.preventDefault();
    const S = pe(C), T = this.zoom();
    let k = Math.sqrt(Math.pow(f[0].clientX - f[1].clientX, 2) + Math.pow(f[0].clientY - f[1].clientY, 2)) / Math.sqrt(Math.pow(S[0].clientX - S[1].clientX, 2) + Math.pow(S[0].clientY - S[1].clientY, 2));
    (T < e && k > 1 || T > i && k < 1) && (k = 1);
    const O = {
      x: S[0].clientX + 0.5 * (S[1].clientX - S[0].clientX),
      y: S[0].clientY + 0.5 * (S[1].clientY - S[0].clientY)
    }, D = {
      x: f[0].clientX + 0.5 * (f[1].clientX - f[0].clientX),
      y: f[0].clientY + 0.5 * (f[1].clientY - f[0].clientY)
    }, H = this.point(O.x, O.y), M = this.point(2 * O.x - D.x, 2 * O.y - D.y), W = new q(this.viewbox()).transform(new P().translate(-M.x, -M.y).scale(k, 0, 0).translate(H.x, H.y));
    y(W), this.viewbox(W), f = S, this.dispatch("zoom", {
      box: W,
      focus: M
    }), this.dispatch("afterZoom", {
      box: this.viewbox(),
      focus: M
    });
  }, _ = function(C) {
    C.type.indexOf("mouse") > -1 && C.button !== a && C.which !== a + 1 || (f = pe(C), !p && (this.dispatch("panStart", { event: C }).defaultPrevented || (C.preventDefault(), this.off("mousedown.panZoom", _), u = {
      x: f[0].clientX,
      y: f[0].clientY
    }, ot(document, "touchmove.panZoom mousemove.panZoom", E, this, { passive: !1 }), ot(document, "touchend.panZoom mouseup.panZoom", w, this, { passive: !1 }))));
  }, w = function(C) {
    C.preventDefault(), K(document, "touchmove.panZoom mousemove.panZoom", E), K(document, "touchend.panZoom mouseup.panZoom", w), this.on("mousedown.panZoom", _), this.dispatch("panEnd", { event: C });
  }, E = function(C) {
    C.preventDefault();
    const S = pe(C), T = {
      x: S[0].clientX,
      y: S[0].clientY
    }, k = this.point(T.x, T.y), O = this.point(u.x, u.y), D = [O.x - k.x, O.y - k.y];
    if (!D[0] && !D[1]) return;
    const H = new q(this.viewbox()).transform(new P().translate(D[0], D[1]));
    u = T, y(H), !this.dispatch("panning", {
      box: H,
      event: C
    }).defaultPrevented && this.viewbox(H);
  };
  return s && this.on("wheel.panZoom", m, this, { passive: !1 }), o && this.on("touchstart.panZoom", b, this, { passive: !1 }), r && this.on("mousedown.panZoom", _, this, { passive: !1 }), this;
} });
function te(n, t, e, i = null) {
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
function Ln([n, t], { a: e, b: i, c: s, d: o, e: r, f: a }) {
  return [n * e + t * s + r, n * i + t * o + a];
}
var Os = class {
  constructor(n) {
    this.el = n, n.remember("_selectHandler", this), this.selection = new le(), this.order = [
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
    const t = Vn();
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
      this.handles.includes(i) && (this.createHandle.call(this, this.selection, n, t, e, i), this.selection.last().addClass("svg_select_handle svg_select_handle_" + i).on("mousedown.selection", te(i, this.el, this.handlePoints, t)).on("touchstart.selection", te(i, this.el, this.handlePoints, t), void 0, { passive: !1 }));
    });
  }
  createHandleFn(n) {
    n.polyline();
  }
  updateHandleFn(n, t, e, i) {
    const s = i.at(e - 1), o = i[(e + 1) % i.length], r = t, a = [r[0] - s[0], r[1] - s[1]], l = [r[0] - o[0], r[1] - o[1]], c = Math.sqrt(a[0] * a[0] + a[1] * a[1]), h = Math.sqrt(l[0] * l[0] + l[1] * l[1]), d = [a[0] / c, a[1] / c], u = [l[0] / h, l[1] / h], f = [r[0] - d[0] * 10, r[1] - d[1] * 10], p = [r[0] - u[0] * 10, r[1] - u[1] * 10];
    n.plot([
      f,
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
    const n = this.selection.group().addClass("svg_select_handle_rot").on("mousedown.selection", te("rot", this.el, this.handlePoints)).on("touchstart.selection", te("rot", this.el, this.handlePoints), void 0, { passive: !1 });
    this.createRot.call(this, n);
  }
  updateRotationHandle() {
    if (!this.handles.includes("rot")) return;
    const n = this.selection.findOne("g.svg_select_handle_rot");
    n && this.updateRot(n, this.rotationPoint, this.handlePoints);
  }
  updatePoints() {
    const n = this.el.bbox(), t = this.el.root().screenCTM().inverseO().multiplyO(this.el.screenCTM());
    this.handlePoints = this.getHandlePoints(n).map((e) => Ln(e, t)), this.rotationPoint = Ln(this.getRotationPoint(n), t);
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
}, Hl = class {
  constructor(n) {
    this.el = n, n.remember("_pointSelectHandler", this), this.selection = new le(), this.order = [
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
    const t = Vn();
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
      this.createHandle.call(this, this.selection, n, t, e), this.selection.get(t + 1).addClass("svg_select_handle_point").on("mousedown.selection", te("point", this.el, this.points, t)).on("touchstart.selection", te("point", this.el, this.points, t), void 0, { passive: !1 });
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
    this.points = this.el.array().map((t) => Ln(t, n));
  }
  mutationHandler() {
    this.updatePoints(), this.updateSelection(), this.updatePointHandles();
  }
}, Ds = (n) => function(t = !0, e = {}) {
  typeof t == "object" && (e = t, t = !0);
  let i = this.remember("_" + n.name);
  return i || (t.prototype instanceof Os ? (i = new t(this), t = !0) : i = new n(this), this.remember("_" + n.name, i)), i.active(t, e), this;
};
R(it, { select: Ds(Os) });
R([
  re,
  ae,
  ie
], { pointSelect: Ds(Hl) });
var Le = (n) => (n.changedTouches && (n = n.changedTouches[0]), {
  x: n.clientX,
  y: n.clientY
}), zs = (n) => {
  let t = 1 / 0, e = 1 / 0, i = -1 / 0, s = -1 / 0;
  for (let o = 0; o < n.length; o++) {
    const r = n[o];
    t = Math.min(t, r[0]), e = Math.min(e, r[1]), i = Math.max(i, r[0]), s = Math.max(s, r[1]);
  }
  return new q(t, e, i - t, s - e);
};
function Fl(n, t, e) {
  const i = [
    [n.x, n.y],
    [n.x + n.width, n.y],
    [n.x + n.width, n.y + n.height],
    [n.x, n.y + n.height]
  ].map(([s, o]) => {
    const r = s - t[0], a = o - t[1], l = r * e, c = a * e;
    return [l + t[0], c + t[1]];
  });
  return zs(i);
}
var Ti = class {
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
    this.box = this.el.bbox(), this.startPoint = this.el.point(Le(t)), this.index = e, this.points = i.slice();
    const o = (s ? "mousemove" : "touchmove") + ".resize", r = (s ? "mouseup" : "touchcancel.resize touchend") + ".resize";
    n.type === "point" ? ot(window, o, this.movePoint) : n.type === "rot" ? ot(window, o, this.rotate) : ot(window, o, this.resize), ot(window, r, this.endResize);
  }
  resize(n) {
    this.lastEvent = n;
    const t = this.snapToGrid(this.el.point(Le(n)));
    let e = t.x - this.startPoint.x, i = t.y - this.startPoint.y;
    this.preserveAspectRatio && this.aroundCenter && (e *= 2, i *= 2);
    const s = this.box.x + e, o = this.box.y + i, r = this.box.x2 + e, a = this.box.y2 + i;
    let l = new q(this.box);
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
      ], u = (d.indexOf(this.eventType) + 4) % d.length, f = this.aroundCenter ? [this.box.cx, this.box.cy] : this.points[u];
      let p = this.eventType.includes("t") || this.eventType.includes("b") ? h : c;
      p = this.eventType.length === 2 ? Math.max(c, h) : p, Number.isFinite(p) || (p = 1), l = Fl(this.box, f, p);
    }
    this.el.dispatch("resize", {
      box: new q(l),
      angle: 0,
      eventType: this.eventType,
      event: n,
      handler: this
    }).defaultPrevented || this.el.size(l.width, l.height).move(l.x, l.y);
  }
  movePoint(n) {
    this.lastEvent = n;
    const { x: t, y: e } = this.snapToGrid(this.el.point(Le(n))), i = this.el.array().slice();
    i[this.index] = [t, e], !this.el.dispatch("resize", {
      box: zs(i),
      angle: 0,
      eventType: this.eventType,
      event: n,
      handler: this
    }).defaultPrevented && this.el.plot(i);
  }
  rotate(n) {
    this.lastEvent = n;
    const t = this.startPoint, e = this.el.point(Le(n)), { cx: i, cy: s } = this.box, o = t.x - i, r = t.y - s, a = e.x - i, l = e.y - s, c = Math.sqrt(o * o + r * r) * Math.sqrt(a * a + l * l);
    if (c === 0) return;
    let h = Math.acos((o * a + r * l) / c) / Math.PI * 180;
    if (!h) return;
    e.x < t.x && (h = -h);
    const d = new P(this.el), { x: u, y: f } = new Y(i, s).transformO(d), { rotate: p } = d.decompose(), g = this.snapToAngle(p + h) - p;
    this.el.dispatch("resize", {
      box: this.box,
      angle: g,
      eventType: this.eventType,
      event: n,
      handler: this
    }).defaultPrevented || this.el.transform(d.rotateO(g, u, f));
  }
  endResize(n) {
    this.eventType !== "rot" && this.eventType !== "point" && this.resize(n), this.lastEvent = null, this.eventType = "", K(window, "mousemove.resize touchmove.resize"), K(window, "mouseup.resize touchend.resize");
  }
  snapToGrid(n) {
    return this.grid && (n.x = Math.round(n.x / this.grid) * this.grid, n.y = Math.round(n.y / this.grid) * this.grid), n;
  }
  snapToAngle(n) {
    return this.degree && (n = Math.round(n / this.degree) * this.degree), n;
  }
};
R(it, { resize: function(n = !0, t = {}) {
  typeof n == "object" && (t = n, n = !0);
  let e = this.remember("_ResizeHandler");
  return e || (n.prototype instanceof Ti ? (e = new n(this), n = !0) : e = new Ti(this), this.remember("_resizeHandler", e)), e.active(n, t), this;
} });
function Nt(n, t, e) {
  try {
    const i = n.node.ownerSVGElement || n.node, s = n.node.getScreenCTM(), o = i.getScreenCTM();
    if (!s || !o)
      return [t, e];
    const r = s.a * t + s.c * e + s.e, a = s.b * t + s.d * e + s.f, l = o.a * o.d - o.b * o.c;
    if (Math.abs(l) < 1e-10)
      return [t, e];
    const c = o.d / l, h = -o.b / l, d = -o.c / l, u = o.a / l, f = (o.c * o.f - o.d * o.e) / l, p = (o.b * o.e - o.a * o.f) / l, g = c * r + d * a + f, y = h * r + u * a + p;
    return [g, y];
  } catch {
    return [t, e];
  }
}
function sn(n, t, e) {
  try {
    const i = n.node.ownerSVGElement || n.node, s = n.node.getScreenCTM(), o = i.getScreenCTM();
    if (!s || !o)
      return [t, e];
    const r = o.a * t + o.c * e + o.e, a = o.b * t + o.d * e + o.f, l = s.a * s.d - s.b * s.c;
    if (Math.abs(l) < 1e-10)
      return [t, e];
    const c = s.d / l, h = -s.b / l, d = -s.c / l, u = s.a / l, f = (s.c * s.f - s.d * s.e) / l, p = (s.b * s.e - s.a * s.f) / l, g = c * r + d * a + f, y = h * r + u * a + p;
    return [g, y];
  } catch {
    return [t, e];
  }
}
function Se(n) {
  const t = n.bbox();
  return Nt(n, t.cx, t.cy);
}
function Ul(n, t) {
  try {
    const e = n && n.node;
    let i = e && e.querySelector && e.querySelector("path[data-shape-path]");
    if (!i && e && e.querySelectorAll) {
      let w = 0;
      e.querySelectorAll("svg path:not([data-node-background-path])").forEach((E) => {
        if (typeof E.getTotalLength == "function")
          try {
            const C = E.getBBox(), S = C.width * C.height;
            S > w && (w = S, i = E);
          } catch {
          }
      });
    }
    if (!i || typeof i.getTotalLength != "function") return null;
    const s = i.getTotalLength();
    if (!s || !isFinite(s)) return null;
    let o = i.ownerSVGElement;
    for (; o && o.ownerSVGElement; ) o = o.ownerSVGElement;
    const r = i.getScreenCTM && i.getScreenCTM(), a = o && o.getScreenCTM && o.getScreenCTM();
    if (!o || !r || !a) return null;
    const l = a.inverse(), c = o.createSVGPoint(), h = (w, E) => {
      c.x = w, c.y = E;
      const C = c.matrixTransform(r).matrixTransform(l);
      return [C.x, C.y];
    }, [d, u] = Se(n), f = t[0] - d, p = t[1] - u, g = Math.sqrt(f * f + p * p) || 1, y = f / g, m = p / g;
    let b = null, v = -1 / 0;
    const x = 96;
    let _ = i.__outlineSamples;
    if (!_ || i.__outlineLen !== s) {
      _ = new Array(x);
      for (let w = 0; w < x; w++) {
        const E = i.getPointAtLength(w / x * s);
        _[w] = [E.x, E.y];
      }
      i.__outlineSamples = _, i.__outlineLen = s;
    }
    for (let w = 0; w < _.length; w++) {
      const [E, C] = h(_[w][0], _[w][1]);
      if (!isFinite(E) || !isFinite(C)) continue;
      const S = E - d, T = C - u, k = S * y + T * m, O = Math.abs(S * m - T * y), D = k - O * 1.5;
      D > v && (v = D, b = [E, C]);
    }
    return b;
  } catch {
    return null;
  }
}
function je(n, t) {
  const e = Ul(n, t);
  if (e && isFinite(e[0]) && isFinite(e[1])) {
    const y = n.bbox(), [m, b] = Nt(n, y.cx, y.cy), v = Math.max(y.width, y.height, 1) * 3;
    if (Math.hypot(e[0] - m, e[1] - b) <= v)
      return e;
  }
  const i = n.bbox(), [s, o] = sn(n, t[0], t[1]), r = i.cx, a = i.cy, l = s - r, c = o - a, h = Math.sqrt(l * l + c * c);
  if (h === 0)
    return Nt(n, r, a);
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
    const y = i.x, m = i.x + i.width, b = i.y, v = i.y + i.height, x = [];
    if (d !== 0) {
      const _ = (y - r) / d, w = a + _ * u;
      w >= b && w <= v && _ > 0 && x.push([y, w, _]);
    }
    if (d !== 0) {
      const _ = (m - r) / d, w = a + _ * u;
      w >= b && w <= v && _ > 0 && x.push([m, w, _]);
    }
    if (u !== 0) {
      const _ = (b - a) / u, w = r + _ * d;
      w >= y && w <= m && _ > 0 && x.push([w, b, _]);
    }
    if (u !== 0) {
      const _ = (v - a) / u, w = r + _ * d;
      w >= y && w <= m && _ > 0 && x.push([w, v, _]);
    }
    x.length > 0 ? (x.sort(function(_, w) {
      return _[2] - w[2];
    }), f = [x[0][0], x[0][1]]) : f = [r, a];
  }
  const [p, g] = Nt(n, f[0], f[1]);
  return isNaN(p) || isNaN(g) || !isFinite(p) || !isFinite(g) ? Nt(n, r, a) : [p, g];
}
function Ai(n, t) {
  const e = n.bbox(), i = e.x + (t.x != null ? t.x : 0.5) * e.width, s = e.y + (t.y != null ? t.y : 0.5) * e.height, [o, r] = Nt(n, i, s);
  return isNaN(o) || isNaN(r) || !isFinite(o) || !isFinite(r) ? Se(n) : [o, r];
}
function Mi(n, t) {
  try {
    const e = n.bbox();
    if (!e || !e.width || !e.height) return null;
    const [i, s] = sn(n, t[0], t[1]), o = (i - e.x) / e.width, r = (s - e.y) / e.height, a = o, l = 1 - o, c = r, h = 1 - r, d = Math.min(a, l, c, h);
    let u = 0, f = 0;
    d === a ? u = -1 : d === l ? u = 1 : d === c ? f = -1 : f = 1;
    const p = Nt(n, e.cx, e.cy), g = Nt(n, e.cx + u, e.cy + f), y = g[0] - p[0], m = g[1] - p[1], b = Math.hypot(y, m);
    return b > 1e-4 ? [y / b, m / b] : null;
  } catch {
    return null;
  }
}
function hi(n) {
  const t = {};
  if (!n.source || !n.target)
    return [
      ["M", 0, 0],
      ["L", 50, 50]
    ];
  const e = Se(n.source), i = Se(n.target);
  n.sourceAnchor ? t.point1 = Ai(n.source, n.sourceAnchor) : n.sourceAttach === "center" ? t.point1 = e : t.point1 = je(n.source, i), n.targetAnchor ? t.point2 = Ai(n.target, n.targetAnchor) : n.targetAttach === "center" ? t.point2 = i : t.point2 = je(n.target, e);
  const s = t.point1, o = t.point2;
  let r;
  if (n.type === "curved") {
    const c = o[0] - s[0], h = o[1] - s[1], d = Math.sqrt(c * c + h * h);
    if (d < 1)
      return [["M", s[0], s[1]], ["L", o[0], o[1]]];
    const u = (v, x, _, w) => {
      const E = Math.sqrt(v * v + x * x);
      if (E > 1e-4) return [v / E, x / E];
      const C = Math.sqrt(_ * _ + w * w) || 1;
      return [_ / C, w / C];
    }, f = n.sourceAnchor && Mi(n.source, s) || u(s[0] - e[0], s[1] - e[1], c, h), p = n.targetAnchor && Mi(n.target, o) || u(o[0] - i[0], o[1] - i[1], -c, -h), g = typeof n.lineCurviness == "number" ? n.lineCurviness : 0.3, y = Math.max(20, d * (0.12 + g * 0.55)), m = [s[0] + f[0] * y, s[1] + f[1] * y], b = [o[0] + p[0] * y, o[1] + p[1] * y];
    if (n.lineCurveType === "quadratic") {
      const v = [(m[0] + b[0]) / 2, (m[1] + b[1]) / 2];
      r = [
        ["M", s[0], s[1]],
        ["Q", v[0], v[1], o[0], o[1]]
      ];
    } else
      r = [
        ["M", s[0], s[1]],
        ["C", m[0], m[1], b[0], b[1], o[0], o[1]]
      ];
  } else if (n.type === "orthogonal") {
    const c = o[0] - s[0], h = o[1] - s[1], d = s[0] < e[0], u = s[1] < e[1], f = o[0] < i[0], p = o[1] < i[1];
    let g, y;
    const m = 32;
    if (Math.abs(c) <= m && Math.abs(h) > m) {
      const b = (s[0] + o[0]) / 2;
      r = [
        ["M", b, s[1]],
        ["L", b, o[1]]
      ];
    } else if (Math.abs(h) <= m && Math.abs(c) > m) {
      const b = (s[1] + o[1]) / 2;
      r = [
        ["M", s[0], b],
        ["L", o[0], b]
      ];
    } else if (Math.abs(c) > Math.abs(h))
      if (d && f || !d && !f) {
        const b = Math.max(n.curveRadius, Math.abs(h) / 2);
        y = s[1] + (h > 0 ? -b : b), r = [
          ["M", s[0], s[1]],
          ["L", s[0], y],
          ["L", o[0], y],
          ["L", o[0], o[1]]
        ];
      } else
        g = s[0] + c / 2, r = [
          ["M", s[0], s[1]],
          ["L", g, s[1]],
          ["L", g, o[1]],
          ["L", o[0], o[1]]
        ];
    else if (u && p || !u && !p) {
      const b = Math.max(n.curveRadius, Math.abs(c) / 2);
      g = s[0] + (c > 0 ? -b : b), r = [
        ["M", s[0], s[1]],
        ["L", g, s[1]],
        ["L", g, o[1]],
        ["L", o[0], o[1]]
      ];
    } else
      y = s[1] + h / 2, r = [
        ["M", s[0], s[1]],
        ["L", s[0], y],
        ["L", o[0], y],
        ["L", o[0], o[1]]
      ];
  } else
    r = [
      ["M", s[0], s[1]],
      ["L", o[0], o[1]]
    ];
  const a = n.markerSource && n.markerSource.size;
  if (a && r && r.length >= 2 && Math.hypot(o[0] - s[0], o[1] - s[1]) > a * 1.5) {
    const h = r[0], d = r[1], u = h[h.length - 2], f = h[h.length - 1];
    let p = d[1] - u, g = d[2] - f;
    const y = Math.hypot(p, g);
    y > 1e-3 && (p /= y, g /= y, h[h.length - 2] = u + p * a, h[h.length - 1] = f + g * a, (d[0] === "C" || d[0] === "Q") && (d[1] += p * a, d[2] += g * a));
  }
  const l = n.markerTarget && n.markerTarget.size;
  if (l && r && r.length >= 2 && Math.hypot(o[0] - s[0], o[1] - s[1]) > l * 1.5) {
    const h = r[r.length - 1], d = h[h.length - 2], u = h[h.length - 1];
    let f, p;
    if (h[0] === "C")
      f = h[3], p = h[4];
    else {
      const b = r[r.length - 2];
      f = b[b.length - 2], p = b[b.length - 1];
    }
    let g = d - f, y = u - p;
    const m = Math.hypot(g, y);
    m > 1e-3 && (g /= m, y /= m, h[h.length - 2] = d - g * l, h[h.length - 1] = u - y * l, h[0] === "C" && (h[3] -= g * l, h[4] -= y * l));
  }
  return r;
}
function ki(n, t, e, i, s, o) {
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
function qe(n, t, e, i) {
  return i && (n.markers = i), n.markerSourceType = t || "null", n.markerTargetType = e || "null", n.markerSource && (n.markerSource.element.remove(), n.connector.attr("marker-start", null)), n.markerTarget && (n.markerTarget.element.remove(), n.connector.attr("marker-end", null)), t && t !== "null" ? (n.markerSource = ki(
    t,
    0,
    !0,
    n.strokeWidth,
    n.markers || i,
    n.color
  ), n.connector.attr("marker-start", "url(#" + n.markerSource.id + ")")) : n.markerSource = null, e && e !== "null" ? (n.markerTarget = ki(
    e,
    0,
    !1,
    n.strokeWidth,
    n.markers || i,
    n.color
  ), n.connector.attr("marker-end", "url(#" + n.markerTarget.id + ")")) : n.markerTarget = null, n;
}
function Yl(n, t, e) {
  return n.markerSourceType = t || "null", n.markerTargetType = e || "null", qe(n, n.markerSourceType, n.markerTargetType), n;
}
function Xl(n, t) {
  return n.strokeWidth = t || 2, n.connector.attr("stroke-width", n.strokeWidth), qe(n, n.markerSourceType, n.markerTargetType), n;
}
function Ni(n, t) {
  n.color = t, n.connector.stroke(t).attr("stroke-width", n.strokeWidth), n.markerSource && n.markerSource.element.children().forEach(function(e) {
    e.type === "path" && e.fill(t);
  }), n.markerTarget && n.markerTarget.element.children().forEach(function(e) {
    e.type === "path" && e.fill(t);
  });
}
function $l(n, t) {
  try {
    const [e, i] = sn(n, t[0], t[1]), s = n.bbox();
    if (!s || !s.width || !s.height) return null;
    let o = Math.max(0, Math.min(1, (e - s.x) / s.width)), r = Math.max(0, Math.min(1, (i - s.y) / s.height));
    const a = o, l = 1 - o, c = r, h = 1 - r, d = Math.min(a, l, c, h);
    return d === a ? o = 0 : d === l ? o = 1 : d === c ? r = 0 : r = 1, { x: o, y: r };
  } catch {
    return null;
  }
}
function jl(n, t) {
  return n && typeof n[t] == "function";
}
function Ri(n, t, e) {
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
  return ql(n, s), s;
}
function ql(n, t) {
  let e = null;
  if (!jl(t.element, "draggable")) {
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
    t.element.front(), Zl(n, t);
  }).on("dragmove", function(i) {
    const s = [t.element.cx(), t.element.cy()];
    t.position = s;
    const o = i.detail.event;
    e = Ql(n, o, t), Jl(e), Wl(n, t, s, e);
  }).on("dragend", function(i) {
    try {
      t.element.node.style.cursor = "grab";
    } catch {
      t.element.node.setAttribute("style", "cursor: grab");
    }
    if (n.debugMode && Ls(n.container), e)
      Pi(n, t, e), Bs();
    else {
      const s = [t.element.cx(), t.element.cy()], o = tc(n, s);
      t.isSource ? n._sourcePhantomRect = o : n._targetPhantomRect = o, Pi(n, t, o);
    }
    e = null;
  });
}
function Zl(n, t) {
  t.isDetached = !0, t.originalTarget || (t.originalTarget = t.isSource ? n.source : n.target), t.originalType || (t.originalType = n.type);
  const e = t.isSource ? n.source : n.target;
  e && e._isPhantomRect && (e.remove(), t.isSource ? n._sourcePhantomRect = null : n._targetPhantomRect = null), t.isSource ? n.source = null : n.target = null;
}
function Wl(n, t, e, i) {
  const s = t.originalType || n.type;
  let o = null, r = null;
  i && typeof i.bbox == "function" && !i._isPhantomRect && !(i.hasClass && i.hasClass("connector-handle")) && (r = $l(i, e), r && (o = i));
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
  }, l = n.source, c = n.target, h = n.type, d = n.sourceAnchor, u = n.targetAnchor;
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
    const f = hi(n);
    n.connector.plot(f), n.hitArea.plot(f);
  } finally {
    n.source = l, n.target = c, n.type = h, n.sourceAnchor = d, n.targetAnchor = u;
  }
}
function Vl(n, t, e = !1) {
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
    let p = !1;
    if (n.type === "circle") {
      const g = parseFloat(n.attr("cx")) || s.cx, y = parseFloat(n.attr("cy")) || s.cy, m = parseFloat(n.attr("r")) || 0, b = u - g, v = f - y;
      p = b * b + v * v <= m * m, e && console.log("Circle test:", {
        cx: g,
        cy: y,
        r: m,
        dx: b,
        dy: v,
        distance: Math.sqrt(b * b + v * v),
        result: p
      });
    } else if (n.type === "ellipse") {
      const g = parseFloat(n.attr("cx")) || s.cx, y = parseFloat(n.attr("cy")) || s.cy, m = parseFloat(n.attr("rx")) || 0, b = parseFloat(n.attr("ry")) || 0, v = u - g, x = f - y;
      p = v * v / (m * m) + x * x / (b * b) <= 1, e && console.log("Ellipse test:", { cx: g, cy: y, rx: m, ry: b, dx: v, dy: x, result: p });
    } else
      p = u >= s.x && u <= s.x + s.width && f >= s.y && f <= s.y + s.height, e && console.log("Rect test:", {
        localX: u,
        localY: f,
        bboxX: s.x,
        bboxY: s.y,
        bboxWidth: s.width,
        bboxHeight: s.height,
        result: p
      });
    return p;
  } catch (i) {
    e && console.log("Exception in hit test, using fallback:", i);
    const s = n.bbox();
    return t[0] >= s.x && t[0] <= s.x + s.width && t[1] >= s.y && t[1] <= s.y + s.height;
  }
}
function Kl(n, t) {
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
function Ls(n) {
  try {
    n.find(".debug-hit-zone").forEach((e) => e.remove());
  } catch (t) {
    console.warn("Error clearing hit zone visualizations:", t);
  }
}
function Ql(n, t, e) {
  const i = n.debugMode || !1;
  i && Ls(n.container);
  function s(u) {
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
      const x = u.node.classList;
      if (x && (x.contains("svg_select_boundingRect") || x.contains("svg_select_points") || x.contains("svg_select_selector") || x.contains("svg_resize_rotationPoint") || x.contains("svg_resize_handle") || x.contains("svg_resize_point") || x.contains("svg_draggable_handle") || x.contains("plugin-ui") || x.contains("ui-element")))
        return !1;
    }
    const p = u.bbox();
    if (p.width < 10 || p.height < 10)
      return !1;
    try {
      const _ = window.getComputedStyle(u.node).cursor;
      if (_ === "nw-resize" || _ === "ne-resize" || _ === "sw-resize" || _ === "se-resize" || _ === "ew-resize" || _ === "ns-resize" || _ === "crosshair")
        return !1;
    } catch {
    }
    const g = u.node.dataset;
    if (g && (g.svgjs || g.plugin || g.handle || g.ui))
      return !1;
    let y = u.parent();
    for (; y && y.type !== "svg"; ) {
      if (y.hasClass) {
        const _ = y.node.classList;
        if (_ && (_.contains("svg_select_group") || _.contains("svg_resize_group") || _.contains("plugin-ui-group")))
          return !1;
      }
      const x = y.attr("id");
      if (x && (x.includes("_select_") || x.includes("_resize_") || x.includes("plugin")))
        return !1;
      y = y.parent();
    }
    const m = u.attr("id");
    if (m && (m.includes("_select_") || m.includes("_resize_") || m.includes("_handle_") || m.includes("_rotation_") || m.includes("plugin") || m.startsWith("svg_")))
      return !1;
    const b = u.attr("fill"), v = u.attr("stroke");
    return !(!b && !v || (b === "transparent" || b === "none") && (!v || v === "none" || v === "transparent"));
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
      isValid: bn(n, u, e)
    });
  }), h.forEach((u) => {
    bn(n, u, e) && Kl(u, n.container);
  }));
  const d = [];
  return h.forEach(function(u) {
    if (bn(n, u, e))
      try {
        if (Vl(u, [l, c], i)) {
          let p, g;
          try {
            const m = u.bbox(), b = u.node.getCTM();
            p = b.a * m.cx + b.c * m.cy + b.e, g = b.b * m.cx + b.d * m.cy + b.f;
          } catch {
            const b = u.bbox();
            p = b.cx, g = b.cy;
          }
          const y = Math.sqrt(
            Math.pow(l - p, 2) + Math.pow(c - g, 2)
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
function bn(n, t, e) {
  try {
    let s = t.node;
    for (; s && s.getAttribute && !s.getAttribute("data-node-id"); )
      s = s.parentNode;
    if (!(s && s.getAttribute && s.getAttribute("data-node-id")))
      return !1;
  } catch {
    return !1;
  }
  if (t.attr("connectortype") || t.hasClass && t.hasClass("connector-handle") || t._isPhantomRect) return !1;
  const i = e.isSource ? n.target : n.source;
  return t !== i;
}
function Pi(n, t, e) {
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
    const o = hi(n);
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
let V = null;
function Jl(n) {
  if (n !== V)
    if (Bs(), n) {
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
function Bs() {
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
function Ii(n, t) {
  if (!n.showHandles || !t || t.length < 2) {
    n.sourceHandle && (n.sourceHandle.element.remove(), n.sourceHandle = null), n.targetHandle && (n.targetHandle.element.remove(), n.targetHandle = null);
    return;
  }
  const e = [t[0][1], t[0][2]], i = t[t.length - 1], s = [i[i.length - 2], i[i.length - 1]];
  n.sourceHandle ? (n.sourceHandle.element.attr({
    cx: e[0],
    cy: e[1]
  }), n.sourceHandle.position = e) : n.sourceHandle = Ri(n, !0, e), n.targetHandle ? (n.targetHandle.element.attr({
    cx: s[0],
    cy: s[1]
  }), n.targetHandle.position = s) : n.targetHandle = Ri(n, !1, s);
}
function tc(n, t) {
  const e = n.container.rect(20, 20).attr({
    x: t[0] - 10,
    y: t[1] - 10,
    fill: "transparent",
    stroke: "none",
    "pointer-events": "none"
  }).addClass("connector-phantom-rect");
  return e._isPhantomRect = !0, e;
}
function ct(n, t) {
  return n && typeof n[t] == "function";
}
function Gs(n, t) {
  t.current && t.current !== n && di(t.current), t.current = n, n.isSelected = !0, n.showHandles = !0, n.update();
}
function di(n) {
  n.isSelected = !1, n.showHandles = !1, n.update();
}
function ec(n, t) {
  n.isSelected ? (di(n), t.current === n && (t.current = null)) : Gs(n, t);
}
function nc(n, t) {
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
function ic(n, t, e) {
  n[t + "Attach"] = e, n.update();
}
function sc(n, t) {
  return n.showHandles = t, n.update(), n;
}
function oc(n) {
  return {
    sourceHandle: n.sourceHandle,
    targetHandle: n.targetHandle
  };
}
function rc(n, t) {
  return n.clickAreaWidth = Math.max(6, t || 12), n.hitArea.attr("stroke-width", n.clickAreaWidth), n;
}
function ac(n, t) {
  t && (n.connector.remove(), t == "default" ? (n.connector = n.container.path().attr("connectortype", "default").fill("none").stroke("#000000").attr("stroke-width", 2), n.connector.stroke(n.color).attr("stroke-width", n.strokeWidth)) : n.connector = t, n.update());
}
function lc(n, t) {
  ["straight", "curved", "orthogonal"].indexOf(t) != -1 && n.type != t && (n.type = t, n.update());
}
function Hs(n, t) {
  return n.debugMode = t, n.hitArea.attr({
    stroke: n.debugMode ? "#ff0000" : "#000000",
    "stroke-opacity": n.debugMode ? 0.5 : 0.01
  }), n;
}
function cc(n) {
  return Hs(n, !n.debugMode);
}
function Fs(n, t) {
  return t = t || {}, ct(n.source, "select") ? n.source.select(t) : console.warn(
    "svg.select.js plugin not available. Install @svgdotjs/svg.select.js to use selection features."
  ), ct(n.target, "select") ? n.target.select(t) : console.warn(
    "svg.select.js plugin not available. Install @svgdotjs/svg.select.js to use selection features."
  ), n;
}
function Us(n, t) {
  return ct(n.source, "draggable") ? n.source.draggable() : console.warn(
    "svg.draggable.js plugin not available. Install @svgdotjs/svg.draggable.js to use dragging features."
  ), ct(n.target, "draggable") ? n.target.draggable() : console.warn(
    "svg.draggable.js plugin not available. Install @svgdotjs/svg.draggable.js to use dragging features."
  ), n;
}
function Ys(n, t) {
  return t = t || {}, ct(n.source, "resize") ? n.source.resize(t) : console.warn(
    "svg.resize.js plugin not available. Install @svgdotjs/svg.resize.js to use resize features."
  ), ct(n.target, "resize") ? n.target.resize(t) : console.warn(
    "svg.resize.js plugin not available. Install @svgdotjs/svg.resize.js to use resize features."
  ), n;
}
function hc(n, t, e, i, s) {
  return t = t || {}, i = i || {}, ct(n.source, "draggable") && ct(n.target, "draggable"), ct(n.source, "select") && ct(n.target, "select"), ct(n.source, "resize") && ct(n.target, "resize"), Us(n), Fs(n, t), Ys(n, i), n;
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
let Bt = null, vn = null;
const Be = { current: null };
function dc(n, t) {
  const e = {};
  t === void 0 && (t = n, n = {}), Bt = n.container || this.parent() || Bt;
  const i = this;
  if (vn = n.markers || this.parent() || vn, e.container = Bt, e.source = i, e.target = t, e.type = n.type || "straight", e.strokeWidth = n.strokeWidth || 2, e.color = n.color || "#000000", e.clickAreaWidth = n.clickAreaWidth || Math.max(12, e.strokeWidth * 3), e.debugMode = n.debugMode || !1, n.connector) {
    const a = nn.find(
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
  e.connector || (e.connector = Bt.path().attr("connectortype", "default").fill("none").stroke(e.color).attr("stroke-width", e.strokeWidth)), e.hitArea = Bt.path().attr({
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
    return hi(a || e);
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
      l ? (e.connector.plot(a), e.hitArea.plot(a), Ii(e, a), e.positionLabel && e.positionLabel()) : console.error("Skipping plot due to invalid path data");
    }
  }, qe(e, e.markerSourceType, e.markerTargetType, vn), e.sourceHandle = null, e.targetHandle = null, e.setMarker = function(a, l, c) {
    return qe(e, a, l, c);
  }, e.setMarkerSettings = function(a, l) {
    return Yl(e, a, l);
  }, e.positionLabel = function() {
    if (!(!e.label || !e.connector || !e.connector.node))
      try {
        const a = e.connector.node.getTotalLength();
        if (!a || !isFinite(a)) return;
        const l = e.connector.node.getPointAtLength(a / 2);
        if (e.label.center(l.x, l.y), e.labelBg) {
          const c = e.label.bbox();
          e.labelBg.size(c.width + 10, c.height + 4).center(l.x, l.y);
        }
      } catch {
      }
  }, e.setLabel = function(a) {
    if (e.labelText = a == null ? "" : String(a), !e.labelText) {
      e.label && (e.label.remove(), e.label = null), e.labelBg && (e.labelBg.remove(), e.labelBg = null);
      return;
    }
    e.label ? e.label.text(e.labelText) : (e.labelBg = Bt.rect(0, 0).attr({ fill: "#ffffff", "fill-opacity": 0.85, "pointer-events": "none" }).radius(3), e.label = Bt.text(e.labelText).attr({
      "font-size": 13,
      "font-family": "Arial, sans-serif",
      fill: "#333333",
      "text-anchor": "middle",
      "pointer-events": "none"
    })), e.positionLabel();
  }, e.setStrokeWidth = function(a) {
    return Xl(e, a);
  }, e.setConnectorColor = function(a) {
    return Ni(e, a), e;
  }, e.remove = function() {
    const a = (l) => {
      try {
        l && l.remove && l.remove();
      } catch {
      }
    };
    return a(e.connector), a(e.hitArea), a(e.sourceHandle && e.sourceHandle.element), a(e.targetHandle && e.targetHandle.element), a(e.markerSource), a(e.markerTarget), a(e._sourcePhantomRect), a(e._targetPhantomRect), a(e.label), a(e.labelBg), e;
  }, e.getCurrentAnchor = function(a) {
    const l = a === "source" ? e.source : e.target, c = a === "source" ? e.target : e.source;
    if (!l || !l.bbox || !c) return { x: 0.5, y: 0.5 };
    try {
      const h = Se(c), d = je(l, h), u = sn(l, d[0], d[1]), f = l.bbox();
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
    Ii(e, a);
  }, e.selectConnector = function() {
    Gs(e, Be);
  }, e.deselectConnector = function() {
    di(e), Be.current === e && (Be.current = null);
  }, e.toggleSelection = function() {
    ec(e, Be);
  }, e.setConnectorAttachment = function(a, l) {
    ic(e, a, l);
  }, e.setHandleVisibility = function(a) {
    return sc(e, a);
  }, e.getHandles = function() {
    return oc(e);
  }, e.setClickAreaWidth = function(a) {
    return rc(e, a);
  }, e.setConnector = function(a) {
    ac(e, a);
  }, e.setType = function(a) {
    lc(e, a);
  }, e.setDebugMode = function(a) {
    return Hs(e, a);
  }, e.toggleDebugMode = function() {
    return cc(e);
  }, e.makeSelectable = function(a) {
    return Fs(e, a);
  }, e.makeDraggable = function(a) {
    return Us(e);
  }, e.makeResizable = function(a) {
    return Ys(e, a);
  }, e.makeInteractive = function(a, l, c) {
    return hc(e, a, l, c);
  }, nc(e), e.update();
  function s(a) {
    e.update();
  }
  function o(a) {
    e.update();
  }
  function r(a) {
    e.update();
  }
  return e._sourceUpdateFunction = o, e._targetUpdateFunction = r, i.on("dragmove", o), t.on("dragmove", r), i.on("beforedrag", o), i.on("dragstart", o), i.on("dragend", o), t.on("beforedrag", r), t.on("dragstart", r), t.on("dragend", r), i.on("resize", o), t.on("resize", r), i.on("rotate", o), t.on("rotate", r), i.on("transform", o), t.on("transform", r), e.updateConnector = s, Ni(e, e.color), e;
}
R(it, {
  connectable: dc,
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
function uc(n, t, e) {
  const i = n, s = [i[0] - t[0], i[1] - t[1]], o = [i[0] - e[0], i[1] - e[1]], r = Math.sqrt(s[0] * s[0] + s[1] * s[1]) || 1, a = Math.sqrt(o[0] * o[0] + o[1] * o[1]) || 1, l = [s[0] / r, s[1] / r], c = [o[0] / a, o[1] / a], h = [i[0] - 10 * l[0], i[1] - 10 * l[1]], d = [i[0] - 10 * c[0], i[1] - 10 * c[1]], u = [h, i, d];
  return u.every(
    (p) => Number.isFinite(p[0]) && Number.isFinite(p[1])
  ) ? u : null;
}
class Xs {
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
    if (!this.isActive) {
      if (this.target = this.node.resizeTarget ?? this.node.backgroundRect, !this.target) {
        console.warn(
          "RESIZE_ROTATE_DEBUG: Cannot enable — target (backgroundRect) not available on",
          this.node?.id
        );
        return;
      }
      try {
        const t = this.target;
        typeof t.select == "function" && t.select({
          rotationPoint: this.options.rotateEnabled,
          // svg.select.js' default updateHandle divides by the distance between
          // adjacent handle points; when a transient/degenerate bbox makes points
          // coincide (or the screenCTM collapses), that divide-by-zero plots
          // "NaN" polyline points and floods the console (notably on multi-select
          // via the keyboard). This replicates the default L-bracket exactly but
          // guards the division and never plots non-finite points.
          updateHandle: (e, i, s, o) => {
            const r = o[(s - 1 + o.length) % o.length], a = o[(s + 1) % o.length], l = uc(i, r, a);
            l && e.plot(l);
          }
        }), this.options.resizeEnabled && typeof t.resize == "function" && t.resize({
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
    this.target.on("beforeresize.resizerotate", (t) => {
      this.finish();
      const e = t.detail.handler, i = t.detail.event.detail.event;
      e.preserveAspectRatio = !!(this.options.preserveAspectRatio || i.shiftKey);
      const s = this.node.options, o = this.target.bbox();
      this._start = {
        x: s.x ?? 0,
        y: s.y ?? 0,
        width: s.width ?? 0,
        height: s.height ?? 0,
        angle: s.rotate?.rotationAngle ?? 0,
        localX: o.x,
        localY: o.y
      }, this._interacting = !0, this._didRotate = this._didResize = !1, this.node.disableConnectionHandles();
      const r = this.target.remember("_selectHandler")?.getHandlePoints(o);
      r && queueMicrotask(() => {
        e.points = r;
      });
    }), this.target.on("resize.resizerotate", (t) => {
      const { box: e, angle: i, eventType: s } = t.detail ?? {}, o = this._start;
      if (!(!o || !e)) {
        if (t.preventDefault(), s === "rot") {
          if (!Number.isFinite(i) || !i) return;
          this._didRotate = !0, this.node.applyInteractionRotation(
            (this.node.options.rotate?.rotationAngle ?? 0) + i
          ), this.options.onRotate?.(t);
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
    this._interacting = !1, this._start = void 0;
    const { id: t, options: e, slate: i } = this.node;
    (this._didRotate || this._didResize) && (this.node.finalizeInteraction(), i?.broadcast?.(this._didRotate ? "onNodeRotated" : "onNodeResized", {
      id: t,
      rotate: e.rotate,
      width: e.width,
      height: e.height,
      x: e.x,
      y: e.y,
      ...!this._didRotate && { vectorPath: e.vectorPath }
    })), i?.getSelectedNodes().includes(this.node) && this.node.enableConnectionHandles(), this._didRotate = this._didResize = !1;
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
typeof window < "u" && (window.SVG = nn);
class on {
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
      const h = {
        id: i,
        source: this.node,
        target: t,
        connectable: c,
        lineColor: e.lineColor || this.options.defaultLineColor,
        lineWidth: e.lineWidth || this.options.defaultLineWidth,
        ...e
      };
      h.lineColor && c.setLineColor && c.setLineColor(h.lineColor), this.applyLineAppearance(c, h), h.label && c.setLabel && c.setLabel(h.label), this.connections.set(i, h);
      try {
        this.slate.markersContainer?.front?.();
      } catch {
      }
      if (c.onEndpointChange = (d) => this.handleEndpointChange(h, d), t.connector) {
        const d = `${t.id}<-${i}`;
        t.connector.connections.set(d, h);
      }
      return console.log("CONNECTOR_DEBUG: Successfully connected", i), c.onLineClick = () => {
        this.node.slate?.isReadOnly?.() || this.showLineCog(h, c, t.id);
      }, this.wireHandleReveal(c), this.options.onConnect?.(h), h;
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
    const e = `${this.node.id}->${t.id}`, i = [...this.connections.keys()].filter(
      (o) => o === e || o.startsWith(`${e}~`)
    );
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
        if (e.lineColor != null && s.setConnectorColor && s.setConnectorColor(e.lineColor), e.lineWidth != null && s.setStrokeWidth && s.setStrokeWidth(e.lineWidth), this.applyLineAppearance(s, i), e.label != null && s.setLabel && s.setLabel(e.label), e.lineType != null && s.setType) {
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
    if (i?.attr && (e.lineOpacity != null && i.attr("stroke-opacity", e.lineOpacity), e.lineEffect !== void 0)) {
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
      lineCurveType: t.lineCurveType,
      showParentArrow: t.showParentArrow,
      showChildArrow: t.showChildArrow
    }, l = (t.id.split("->")[1] || "").trim().replace(/~\d+$/, "");
    setTimeout(() => {
      try {
        if (i === "target") {
          const c = t.source;
          if (!c?.relationships) return;
          if (o || !s) {
            if (!r) return;
            l && c.relationships.removeAssociation(t.id), c.relationships.addFloatingAssociation(r, a);
          } else {
            const h = this.slate.nodes.one(s);
            if (!h) return;
            if (h.id === l) {
              this.pinDropAnchor(c, t.id, h, "targetAnchor", r);
              return;
            }
            l && c.relationships.removeAssociation(t.id), c.relationships.addAssociation(h, a), this.pinDropAnchor(c, h.id, h, "targetAnchor", r);
          }
        } else {
          if (o || !s) return;
          const c = t.source, h = t.target, d = this.slate.nodes.one(s);
          if (!d || !h || !c?.relationships) return;
          if (d.id === c.id) {
            this.pinDropAnchor(c, h.id, d, "sourceAnchor", r);
            return;
          }
          c.relationships.removeAssociation(t.id), d.relationships?.addAssociation(h, a), this.pinDropAnchor(d, h.id, d, "sourceAnchor", r);
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
      if (!r.width || !r.height) return;
      const a = (_) => Math.max(0, Math.min(1, _));
      let l = o.x, c = o.y;
      const h = r.rotate?.rotationAngle || 0;
      if (h) {
        const _ = (r.x || 0) + r.width / 2, w = (r.y || 0) + r.height / 2, E = -h * Math.PI / 180, C = l - _, S = c - w;
        l = _ + C * Math.cos(E) - S * Math.sin(E), c = w + C * Math.sin(E) + S * Math.cos(E);
      }
      let d = a((l - (r.x || 0)) / r.width), u = a((c - (r.y || 0)) / r.height);
      const f = d, p = 1 - d, g = u, y = 1 - u, m = Math.min(f, p, g, y);
      m === f ? d = 0 : m === p ? d = 1 : m === g ? u = 0 : u = 1;
      const b = { x: d, y: u }, v = t?.relationships, x = v?.associations?.find((_) => _.id === e) || v?.associations?.find((_) => _.childId === e);
      x?.id && (v.applyLineProperty(x.id, s, b), t.slate?.broadcast?.("onLinePropertiesChanged", {
        id: t.id,
        prop: s,
        val: b,
        associationId: x.id
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
    ), i = (o) => {
      e().forEach((r) => {
        o ? r.node.classList.add("connector-handle--revealed") : !t._handlesPinned && !t._handlesDragging && r.node.classList.remove("connector-handle--revealed");
      });
    };
    t._revealHandles = i;
    const s = () => e().forEach((o) => {
      o._revealArmed || (o._revealArmed = !0, o.on?.("mouseenter", () => i(!0)), o.on?.("mouseleave", () => i(!1)), o.on?.("dragstart", () => {
        t._handlesDragging = !0, i(!0);
      }), o.on?.("dragend", () => {
        t._handlesDragging = !1, t._handlesPinned || i(!1);
      }));
    });
    [t.hitArea, t.connector].forEach((o) => {
      o?.on?.("mouseenter", () => {
        i(!0), s();
      }), o?.on?.("mouseleave", () => i(!1));
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
    ], f = u.length, p = c * 2 + h, g = f * (c * 2) + (f - 1) * h, y = r - g / 2 + c, m = l.group().addClass("line-cog").addClass("line-toolbar");
    m.rect(g + 14, c * 2 + 10).radius((c * 2 + 10) / 2).center(r, a).fill("#ffffff").stroke({ color: "#e3e5ea", width: 1 });
    const b = this.node.constructor;
    u.forEach((v, x) => {
      const _ = y + x * p, w = m.group().addClass(`line-tool-${v.key}`);
      w.circle(c * 2).center(_, a).fill("#ffffff").attr("fill-opacity", 1e-3), b.drawToolIcon?.(w, v.key, _, a, v.color), w.attr("pointer-events", "all");
      try {
        w.node.style.cursor = "pointer";
      } catch {
      }
      w.on("mousedown", (E) => E.stopPropagation?.()), w.on("click", (E) => {
        E.stopPropagation?.(), v.onClick();
      });
    }), m.attr("pointer-events", "all"), s._activeLineCog = m;
    try {
      e.selectConnector?.(), s._activeLineConnectable = e, e._handlesPinned = !0, e._revealHandles?.(!0);
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
    s._activeEndpointToggles && s._activeEndpointToggles.forEach((w) => {
      try {
        w.remove();
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
    const a = o.getPointAtLength(0), l = o.getPointAtLength(r), c = this.node.relationships, h = c?.associations?.find((w) => w.childId === i);
    if (!h) return;
    const d = (w) => {
      const E = w?.options || {};
      return { x: (E.x || 0) + (E.width || 0) / 2, y: (E.y || 0) + (E.height || 0) / 2 };
    }, u = (w, E) => Math.hypot(w.x - E.x, w.y - E.y), f = d(this.node), p = u(a, f) <= u(l, f), g = Math.min(34, r * 0.28), y = o.getPointAtLength(p ? g : r - g), m = o.getPointAtLength(p ? r - g : g), b = s.markersContainer || s.canvas, v = "#5b6472", x = "#4051B5", _ = (w, E) => {
      const C = E === "source" ? !!h.sourceAnchor : !!h.targetAnchor, S = C ? x : v, T = b.group().addClass("endpoint-lock").addClass(`endpoint-lock-${E}`).addClass(C ? "endpoint-lock-absolute" : "endpoint-lock-relative");
      T.circle(24).center(w.x, w.y).fill("#ffffff").stroke({ color: S, width: 1.5 }), on.drawLockIcon(T, w.x, w.y, S, C), T.circle(24).center(w.x, w.y).fill("#ffffff").attr("fill-opacity", 1e-3), T.attr("pointer-events", "all");
      try {
        T.node.style.cursor = "pointer";
      } catch {
      }
      T.on("mousedown", (k) => k.stopPropagation?.()), T.on("click", (k) => {
        k.stopPropagation?.();
        const O = E === "source" ? "sourceLock" : "targetLock", D = C ? "relative" : "absolute";
        try {
          c.applyLineProperty(h.id, O, D);
        } catch {
        }
        try {
          s.broadcast?.("onLinePropertiesChanged", {
            id: this.node.id,
            associationId: h.id,
            prop: O,
            val: D
          });
        } catch {
        }
        this.showEndpointLockToggles(t, e, i);
      }), s._activeEndpointToggles.push(T);
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
function Bn(n, t, e) {
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
const fc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createDefaultAssociation: Bn
}, Symbol.toStringTag, { value: "Module" }));
class $s {
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
    const i = Bn(this.node.id, t.id, e);
    if (!e?.id && this.assocMap.has(i.id)) {
      let s = 2;
      for (; this.assocMap.has(`${i.id}~${s}`); ) s++;
      i.id = `${i.id}~${s}`;
    }
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
      Object.assign(i, t), this.node.connector && this.node.connector.updateConnection(i.id, {
        lineColor: i.lineColor,
        lineWidth: i.lineWidth,
        lineOpacity: i.lineOpacity,
        lineEffect: i.lineEffect
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
    const i = {
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
    const i = e?.childId || `__free_${Math.random().toString(36).slice(2, 10)}`, s = Bn(this.node.id, i, {
      ...e,
      childId: i,
      targetPoint: t
    });
    return this.assocMap.set(s.id, s), this.renderAssociation(s, null), this.node.slate?.broadcast?.("addRelationship", { ...s }), s;
  }
}
class js {
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
const Fe = /* @__PURE__ */ new Set(), ge = /* @__PURE__ */ new Map(), pc = /* @__PURE__ */ new Set([
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
function ui(n) {
  const t = n.trim(), e = t.toLowerCase();
  if (pc.has(e) || Fe.has(e))
    return Promise.resolve();
  if (ge.has(e))
    return ge.get(e);
  const i = new Promise((s, o) => {
    if (typeof document > "u") {
      s();
      return;
    }
    const r = t.split(",")[0].trim().replace(/['"]/g, "");
    try {
      if (document.fonts?.check?.(`12px "${r}"`)) {
        Fe.add(e), s();
        return;
      }
    } catch {
    }
    const a = document.createElement("link");
    a.rel = "stylesheet", a.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      r
    )}:wght@300;400;500;600;700&display=swap`, a.onload = () => {
      Fe.add(e), ge.delete(e), console.log("FONT_DEBUG: Loaded font:", r), s();
    }, a.onerror = () => {
      ge.delete(e), console.warn("FONT_DEBUG: Failed to load font:", r), s();
    }, document.head.appendChild(a);
  });
  return ge.set(e, i), i;
}
async function qs(n) {
  const t = /* @__PURE__ */ new Set(), e = n.nodes?.allNodes || [];
  for (const s of e)
    s.options?.fontFamily && t.add(s.options.fontFamily);
  const i = Array.from(t).map((s) => ui(s));
  await Promise.all(i), console.log("FONT_DEBUG: All fonts loaded:", Array.from(t));
}
function gc(n) {
  return Fe.has(n.toLowerCase().trim());
}
const mc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  isFontLoaded: gc,
  loadAllFonts: qs,
  loadFont: ui
}, Symbol.toStringTag, { value: "Module" }));
class Zs {
  constructor(t) {
    this._inlineEditing = !1, this._inlineFO = null, this.node = t;
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
   * Start inline (on-canvas) text editing — Miro-style. Overlays a
   * contenteditable box exactly on the node (inside its group so it tracks
   * pan/zoom/position), pre-filled + all-selected. Enter commits, Shift+Enter
   * inserts a newline, Escape cancels, blur commits.
   *
   * Commit routes through collab.invoke + collab.send (the same persist/sync path
   * the drawer uses via onNodeTextChanged), so the edit survives reload and syncs
   * to collaborators. SVG-content nodes (no textElement) are skipped.
   */
  startInline() {
    const t = this.node;
    if (this._inlineEditing || !t || t.nestedSvg) return;
    const e = t.svgGroup?.node;
    if (!e) return;
    const i = t.options.width || 100, s = t.options.height || 60, r = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "foreignObject"
    );
    r.setAttribute("x", "0"), r.setAttribute("y", "0"), r.setAttribute("width", String(i)), r.setAttribute("height", String(s)), r.style.overflow = "visible";
    const a = document.createElement("div");
    a.setAttribute("contenteditable", "true"), a.className = "sb-inline-editor", a.textContent = t.options.text || "", a.style.cssText = [
      `width:${i}px`,
      `height:${s}px`,
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
      `font-family:${t.options.fontFamily || "Arial, sans-serif"}`,
      `font-size:${t.options.fontSize || 14}px`,
      `color:${t.options.fontColor || "#000000"}`
    ].join(";"), r.appendChild(a), e.appendChild(r), this._inlineFO = r, this._inlineEditing = !0, t.textElement?.hide?.();
    const l = (c) => {
      if (!this._inlineEditing) return;
      this._inlineEditing = !1;
      const h = (a.innerText || "").replace(/\n+$/, "");
      try {
        r.remove();
      } catch {
      }
      if (this._inlineFO = null, t.textElement?.show?.(), c && h !== (t.options.text || "")) {
        const d = {
          type: "onNodeTextChanged",
          data: { id: t.id, text: h }
        }, u = t.slate, f = u?.collab;
        f?.invoke ? (f.invoke(d), typeof u.broadcast == "function" ? u.broadcast("onNodeTextChanged", d.data) : f.send?.(d)) : t.setText?.(h);
      }
    };
    a.addEventListener("keydown", (c) => {
      c.stopPropagation(), c.key === "Enter" && !c.shiftKey ? (c.preventDefault(), l(!0)) : c.key === "Escape" && (c.preventDefault(), l(!1));
    }), a.addEventListener("blur", () => l(!0)), setTimeout(() => {
      try {
        a.focus();
        const c = document.createRange();
        c.selectNodeContents(a);
        const h = window.getSelection();
        h?.removeAllRanges(), h?.addRange(c);
      } catch {
      }
    }, 0);
  }
  /** Cancel an in-progress inline edit without saving. */
  cancelInline() {
    if (this._inlineEditing) {
      this._inlineEditing = !1;
      try {
        this._inlineFO?.remove();
      } catch {
      }
      this._inlineFO = null, this.node?.textElement?.show?.();
    }
  }
  /**
   * Set text content and properties on the node.
   * This is the primary method used by collaboration events
   * and the text editing pane.
   */
  async set(t, e, i, s, o, r, a) {
    t !== void 0 && (this.node.options.text = t), e !== void 0 && (this.node.options.fontSize = e), s !== void 0 && (this.node.options.fontColor = s), o !== void 0 && (this.node.options.textOpacity = o), r !== void 0 && (this.node.options.textXAlign = r), a !== void 0 && (this.node.options.textYAlign = a), i !== void 0 && i !== this.node.options.fontFamily && (this.node.options.fontFamily = i, await ui(i)), this.applyText();
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
class Ws {
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
const we = 2 * Math.PI;
function et(n, t) {
  return { x: n, y: t };
}
function mt(n, t, e) {
  return et(n.x + (t.x - n.x) * e, n.y + (t.y - n.y) * e);
}
function xe(n, t, e, i) {
  return { kind: "cubic", start: n, first: t, second: e, end: i };
}
function be(n, t) {
  return xe(n, n, t, t);
}
function yc(n, t, e, i, s, o, r) {
  if (e = Math.abs(e), i = Math.abs(i), !e || !i || n.x === t.x && n.y === t.y) return be(n, t);
  const a = s * Math.PI / 180, l = Math.cos(a), c = Math.sin(a), h = (n.x - t.x) / 2, d = (n.y - t.y) / 2;
  let u = (l * h + c * d) / e, f = (-c * h + l * d) / i;
  const p = Math.max(1, Math.hypot(u, f));
  e *= p, i *= p, u /= p, f /= p;
  const g = u * u + f * f, y = (o === r ? -1 : 1) * Math.sqrt(Math.max(0, (1 - g) / g)), m = y * f, b = -y * u, v = et(e * l, e * c), x = et(-i * c, i * l), _ = et(
    (n.x + t.x) / 2 + m * v.x + b * x.x,
    (n.y + t.y) / 2 + m * v.y + b * x.y
  ), w = Math.atan2(f - b, u - m);
  let E = Math.atan2(-f - b, -u - m) - w;
  return r && E < 0 && (E += we), !r && E > 0 && (E -= we), { kind: "arc", start: n, end: t, center: _, axisX: v, axisY: x, angle: w, sweep: E };
}
function Vs(n) {
  const t = [];
  let e = et(0, 0), i = e, s, o;
  for (const r of new Pt(n)) {
    const a = r[0], l = r.slice(1), c = (u) => et(l[u], l[u + 1]);
    let h, d;
    switch (a) {
      case "M":
        i = c(0), h = { kind: "move", end: i };
        break;
      case "H":
        h = be(e, et(l[0], e.y));
        break;
      case "V":
        h = be(e, et(e.x, l[0]));
        break;
      case "L":
        h = be(e, c(0));
        break;
      case "Z":
        h = be(e, i);
        break;
      case "C":
        h = xe(e, c(0), c(2), c(4));
        break;
      case "S":
        h = xe(e, s ? mt(s, e, 2) : e, c(0), c(2));
        break;
      case "Q":
      case "T": {
        const u = c(a === "Q" ? 2 : 0);
        d = a === "Q" ? c(0) : o ? mt(o, e, 2) : e, h = xe(e, mt(e, d, 2 / 3), mt(u, d, 2 / 3), u);
        break;
      }
      case "A":
        h = yc(e, c(5), l[0], l[1], l[2], l[3], l[4]);
        break;
      default:
        continue;
    }
    t.push(h), s = a === "C" || a === "S" ? h.second : void 0, o = d, e = h.end;
  }
  return t;
}
function Ks(n, t) {
  return et(
    n.center.x + n.axisX.x * Math.cos(t) + n.axisY.x * Math.sin(t),
    n.center.y + n.axisX.y * Math.cos(t) + n.axisY.y * Math.sin(t)
  );
}
function Oi(n, t) {
  return et(
    -n.axisX.x * Math.sin(t) + n.axisY.x * Math.cos(t),
    -n.axisX.y * Math.sin(t) + n.axisY.y * Math.cos(t)
  );
}
function bc(n, t, e, i) {
  const s = -n + 3 * t - 3 * e + i, o = 2 * (n - 2 * t + e), r = t - n;
  if (Math.abs(s) < Number.EPSILON * Math.max(1, Math.abs(o), Math.abs(r))) return o ? [-r / o] : [];
  const a = o * o - 4 * s * r;
  if (a < 0) return [];
  const l = Math.sqrt(a);
  return [(-o - l) / (2 * s), (-o + l) / (2 * s)];
}
function vc(n, t) {
  const e = mt(n.start, n.first, t), i = mt(n.first, n.second, t), s = mt(n.second, n.end, t);
  return mt(mt(e, i, t), mt(i, s, t), t);
}
function Qs(n) {
  let t = 1 / 0, e = 1 / 0, i = -1 / 0, s = -1 / 0;
  function o(r) {
    t = Math.min(t, r.x), i = Math.max(i, r.x), e = Math.min(e, r.y), s = Math.max(s, r.y);
  }
  n.length || o(et(0, 0));
  for (const r of n)
    if (o(r.end), r.kind !== "move") {
      o(r.start);
      for (const a of ["x", "y"])
        if (r.kind === "cubic")
          for (const l of bc(r.start[a], r.first[a], r.second[a], r.end[a]))
            l > 0 && l < 1 && o(vc(r, l));
        else {
          const l = Math.atan2(r.axisY[a], r.axisX[a]);
          for (const c of [l, l + Math.PI])
            (Math.sign(r.sweep) * (c - r.angle) % we + we) % we <= Math.abs(r.sweep) && o(Ks(r, c));
        }
    }
  return { x: t, y: e, x2: i, y2: s, width: i - t, height: s - e, cx: (t + i) / 2, cy: (e + s) / 2 };
}
function wc(n) {
  return Qs(Vs(n));
}
function xc(n, t) {
  const e = new P();
  for (const [, i, s] of n.matchAll(/([trsm])([^trsm]*)/gi)) {
    const o = (s.match(/[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/gi) || []).map(Number), [r, a, l, c, h, d] = o;
    let u = new P();
    switch (i.toLowerCase()) {
      case "t":
        o.length === 2 && (u = u.translate(r, a));
        break;
      case "m":
        o.length === 6 && (u = new P(r, a, l, c, h, d));
        break;
      case "r":
        o.length === 1 && (u = u.rotate(r, t.x, t.y)), o.length === 3 && (u = u.rotate(r, a, l));
        break;
      case "s":
        (o.length === 1 || o.length === 2) && (u = u.scale(r, a ?? r, t.x, t.y)), o.length === 3 && (u = u.scale(r, r, a, l)), o.length === 4 && (u = u.scale(r, a, l, c));
        break;
    }
    e.multiplyO(u);
  }
  return e;
}
function _c(n) {
  const t = Math.max(1, Math.ceil(Math.abs(n.sweep) / (Math.PI / 4))), e = n.sweep / t, i = 4 / 3 * Math.tan(e / 4);
  let s = n.start;
  return Array.from({ length: t }, (o, r) => {
    const a = n.angle + r * e, l = a + e, c = r === t - 1 ? n.end : Ks(n, l), h = Oi(n, a), d = Oi(n, l), u = xe(
      s,
      et(s.x + i * h.x, s.y + i * h.y),
      et(c.x - i * d.x, c.y - i * d.y),
      c
    );
    return s = c, u;
  });
}
function Cc(n, t) {
  const e = Vs(n), i = Qs(e), s = xc(t, et(i.cx, i.cy)), o = (r) => new Y(r.x, r.y).transform(s).toArray().join(",");
  return e.map((r) => r.kind === "move" ? "M" + o(r.end) : (r.kind === "arc" ? _c(r) : [r]).map((l) => "C" + [l.first, l.second, l.end].map(o).join(",")).join("")).join("");
}
function It(n = 10) {
  const t = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let e = "";
  for (let i = 0; i < n; i++)
    e += t.charAt(Math.floor(Math.random() * t.length));
  return e;
}
function rn(n) {
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
function Ec(n, t = "normal 10pt Arial") {
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
function Js(n, t) {
  const e = (o) => {
    const r = (o || "").replace("#", "");
    if (r.length < 6) return 0;
    const a = (d) => {
      const u = d / 255;
      return u <= 0.03928 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4);
    }, l = a(parseInt(r.substr(0, 2), 16) || 0), c = a(parseInt(r.substr(2, 2), 16) || 0), h = a(parseInt(r.substr(4, 2), 16) || 0);
    return 0.2126 * l + 0.7152 * c + 0.0722 * h;
  }, i = e(n), s = e(t);
  return (Math.max(i, s) + 0.05) / (Math.min(i, s) + 0.05);
}
function Sc(n) {
  return n?.path ? wc(n.path) : { x: 0, y: 0, x2: 100, y2: 100, width: 100, height: 100, cx: 50, cy: 50 };
}
function Tc(n, t) {
  return Cc(n, t);
}
function Ac(n, t) {
  const e = String(n).split(/ /g), s = String(n).split("").length / t, o = [];
  let r = [], a = 0;
  return e.forEach((l) => {
    a += l.length, a < s || o.length === t - 1 ? r.push(l) : (o.push(r.join(" ")), a = l.length, r = [l]);
  }), r.length > 0 && o.push(r.join(" ")), o.join(`
`);
}
function Mc(n, t) {
  return Math.floor(Math.random() * (t - n + 1)) + n;
}
function kc(n, t, e, i, s = !0) {
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
function Nc(n) {
  const { buildNodeStyleFromTheme: t } = require("./core/Theme");
  return t(n.theme, n.childNumber);
}
function Rc(n) {
  return n.replace(/[^a-zA-Z0-9\s-]/g, "").replace(/\s+/g, "-").toLowerCase();
}
function Pc(n) {
  return n instanceof HTMLElement || n instanceof SVGElement;
}
function Ic(n) {
  return typeof document > "u" ? null : document.getElementById(n);
}
function Oc() {
  return typeof navigator > "u" ? !1 : /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
function Dc() {
  return typeof navigator > "u" ? !1 : /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}
function zc(n) {
  n && (n.preventDefault(), n.stopPropagation());
}
function Lc(n, t) {
  const e = [];
  for (let i = 0; i < n.length; i += t)
    e.push(n.slice(i, i + t));
  return e;
}
const Bc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  _transformPath: Tc,
  buildNodeStyleFromTheme: Nc,
  chunk: Lc,
  contrastRatio: Js,
  createMultiLineText: Ac,
  el: Ic,
  getBBox: Sc,
  getTextWidth: Ec,
  guid: It,
  isElement: Pc,
  isMobile: Dc,
  isSafari: Oc,
  obtainProportionateWidthAndHeightForResizing: kc,
  randomInt: Mc,
  safeForUrls: Rc,
  stopEvent: zc,
  whiteOrBlack: rn
}, Symbol.toStringTag, { value: "Module" })), Gt = "0.6s cubic-bezier(0.4, 0, 0.2, 1) both", an = {
  mystery: {
    id: "sb-mystery",
    types: ["text", "vect"],
    display: "Mystery",
    description: "Gentle fade in with a subtle zoom",
    css: `.sb-animation-mystery{animation:sb-mystery ${Gt}}@keyframes sb-mystery{0%{opacity:0;transform:scale(1.2)}50%{opacity:.5;transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}`
  },
  fadeSlideUp: {
    id: "sb-fade-slide-up",
    types: ["text", "vect"],
    display: "Fade up",
    description: "Smooth upward entrance",
    css: `.sb-animation-fadeSlideUp{animation:sb-fade-slide-up ${Gt}}@keyframes sb-fade-slide-up{0%{opacity:0;transform:translateY(100%) rotateX(40deg)}100%{opacity:1;transform:translateY(0) rotateX(0)}}`
  },
  fadeSlideDown: {
    id: "sb-fade-slide-down",
    types: ["text", "vect"],
    display: "Fade down",
    description: "Smooth downward entrance",
    css: `.sb-animation-fadeSlideDown{animation:sb-fade-slide-down ${Gt}}@keyframes sb-fade-slide-down{0%{opacity:0;transform:translateY(-100%) rotateX(-40deg)}100%{opacity:1;transform:translateY(0) rotateX(0)}}`
  },
  bumpUpIn: {
    id: "sb-bump-up-in",
    types: ["text", "vect"],
    display: "Bump up",
    description: "Playful bounce from below",
    css: `.sb-animation-bumpUpIn{animation:sb-bump-up-in ${Gt}}@keyframes sb-bump-up-in{0%{opacity:0;transform:scale(.8) rotate(-3deg) translateY(100%)}55%{opacity:.8;transform:scale(1.1) rotate(2deg) translateY(-20%)}100%{opacity:1;transform:scale(1) translateY(0)}}`
  },
  bumpDownIn: {
    id: "sb-bump-down-in",
    types: ["text", "vect"],
    display: "Bump down",
    description: "Playful bounce from above",
    css: `.sb-animation-bumpDownIn{animation:sb-bump-down-in ${Gt}}@keyframes sb-bump-down-in{0%{opacity:0;transform:scale(.8) rotate(3deg) translateY(-100%)}55%{opacity:.8;transform:scale(1.1) rotate(-2deg) translateY(20%)}100%{opacity:1;transform:scale(1) translateY(0)}}`
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
    css: `.sb-animation-smoke{animation:sb-smoke ${Gt}}@keyframes sb-smoke{0%{opacity:0;transform:scale(1.5) rotate(5deg);filter:blur(10px)}55%{opacity:.75;transform:scale(1.1) rotate(-2deg);filter:blur(3px)}100%{opacity:1;transform:scale(1);filter:blur(0)}}`
  },
  fractured: {
    id: "sb-fractured",
    types: ["text", "vect"],
    display: "Fractured",
    description: "Sharp geometric reveal",
    css: `.sb-animation-fractured{animation:sb-fractured ${Gt}}@keyframes sb-fractured{0%{opacity:0;clip-path:polygon(50% 50%,50% 50%,50% 50%);transform:rotate(45deg) scale(.3)}55%{opacity:.7;clip-path:polygon(10% 0,90% 0,100% 100%,0 100%);transform:rotate(-8deg) scale(1.1)}100%{opacity:1;clip-path:polygon(0 0,100% 0,100% 100%,0 100%);transform:rotate(0) scale(1)}}`
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
}, Gc = ".sb-node-animation{transform-box:fill-box;transform-origin:center}";
function to() {
  return { ...an };
}
function eo(n) {
  return `sb-animation-${n}`;
}
function Hc(n) {
  const e = n?.root?.()?.defs?.();
  if (!e || e.findOne?.("#sb-node-animation-styles")) return;
  const i = e.element("style").id("sb-node-animation-styles");
  i.attr("type", "text/css"), i.node.textContent = Gc + Object.values(an).map((s) => s.css).join("");
}
function Fc(n, t) {
  if (!n || !an[t]) return !1;
  Hc(n), no(n);
  const e = n.node;
  return e && (e.getBBox?.(), e.classList.add("sb-node-animation", eo(t))), !0;
}
function no(n) {
  const t = n?.node;
  if (t) {
    for (const e of Object.keys(an)) t.classList.remove(eo(e));
    t.classList.remove("sb-node-animation");
  }
}
const ht = /* @__PURE__ */ new Map();
ht.set("dropShadow", {
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
ht.set("blur", {
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
ht.set("outline", {
  name: "outline",
  types: ["text", "vect"],
  apply: (n) => {
    try {
      const t = n.attr("stroke"), e = n.attr("stroke-width");
      n.data("original-stroke", t || "#333"), n.data("original-stroke-width", e || 2);
      const i = n.attr("fill"), s = typeof i == "string" && /^#[0-9a-fA-F]{3,6}$/.test(i) ? rn(i) : "#ffffff";
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
ht.set("postItNote", {
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
ht.set("pencil", {
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
class io {
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
    const i = ht.get(t);
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
    const e = ht.get(t);
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
    return Fc(i, t) ? (this.node.options.animations || (this.node.options.animations = {}), this.node.options.animations[e] = t, !0) : !1;
  }
  /** Clear the animation from a node element without affecting filter effects. */
  removeAnimation(t) {
    const e = t === "text" ? this.node.textElement : this.node.backgroundRect;
    no(e), this.node.options.animations && (this.node.options.animations[t] = void 0);
  }
  /**
   * Toggle filter visibility (hide/show without removing).
   */
  toggleVisibility(t) {
    if (this.hidden = t, t)
      for (const e of this.activeFilters) {
        const i = ht.get(e);
        i && (this.node.backgroundRect && i.remove(this.node.backgroundRect), this.node.textElement && i.remove(this.node.textElement));
      }
    else
      for (const e of this.activeFilters) {
        const i = ht.get(e);
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
function Rh(n) {
  ht.set(n.name, n);
}
function Ph() {
  return Array.from(ht.keys());
}
function so() {
  const n = {};
  for (const [t, e] of ht)
    n[t] = { types: e.types || ["text", "vect"] };
  return n;
}
class oo {
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
const Z = /* @__PURE__ */ new Map();
Z.set("rectangle", {
  path: "M 0 0 H 100 V 60 H 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
Z.set("roundedrectangle", {
  path: "M 10 0 H 90 Q 100 0 100 10 V 50 Q 100 60 90 60 H 10 Q 0 60 0 50 V 10 Q 0 0 10 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  hasRounding: !0,
  viewBox: "0 0 100 60"
});
Z.set("ellipse", {
  path: "M 50 0 A 50 30 0 1 1 50 60 A 50 30 0 1 1 50 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
Z.set("circle", {
  path: "M 50 0 A 50 50 0 1 1 50 100 A 50 50 0 1 1 50 0 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
Z.set("star", {
  path: "M 50 0 L 61.8 38.2 L 100 38.2 L 69.1 61.8 L 80.9 100 L 50 76.4 L 19.1 100 L 30.9 61.8 L 0 38.2 L 38.2 38.2 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
Z.set("triangle", {
  path: "M 50 0 L 100 87 L 0 87 Z",
  defaultWidth: 100,
  defaultHeight: 87,
  viewBox: "0 0 100 87"
});
Z.set("pentagon", {
  path: "M 50 0 L 97.6 34.5 L 79.4 90.5 L 20.6 90.5 L 2.4 34.5 Z",
  defaultWidth: 100,
  defaultHeight: 95,
  viewBox: "0 0 100 95"
});
Z.set("hexagon", {
  path: "M 25 0 L 75 0 L 100 43.3 L 75 86.6 L 25 86.6 L 0 43.3 Z",
  defaultWidth: 100,
  defaultHeight: 87,
  viewBox: "0 0 100 87"
});
Z.set("octagon", {
  path: "M 29.3 0 L 70.7 0 L 100 29.3 L 100 70.7 L 70.7 100 L 29.3 100 L 0 70.7 L 0 29.3 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
Z.set("trapezium", {
  path: "M 20 0 L 80 0 L 100 60 L 0 60 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
Z.set("parallelogram", {
  path: "M 20 0 L 100 0 L 80 60 L 0 60 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
Z.set("rarrow", {
  path: "M 0 15 L 70 15 L 70 0 L 100 30 L 70 60 L 70 45 L 0 45 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
Z.set("larrow", {
  path: "M 100 15 L 30 15 L 30 0 L 0 30 L 30 60 L 30 45 L 100 45 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
Z.set("diamond", {
  path: "M 50 0 L 100 50 L 50 100 L 0 50 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
function Gn(n) {
  return Z.get(n.toLowerCase());
}
function Uc(n) {
  return Z.has(n.toLowerCase());
}
function Yc(n, t) {
  Z.set(n.toLowerCase(), t);
}
function Xc() {
  return Array.from(Z.keys());
}
function $c(n) {
  return ["rectangle", "circle", "ellipse"].includes(n.toLowerCase());
}
function ro(n, t) {
  if (t) {
    const e = Gn(t);
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
    const e = Gn(n);
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
const jc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getShape: Gn,
  getShapeNames: Xc,
  hasShape: Uc,
  isNativeShape: $c,
  registerShape: Yc,
  resolveShapePath: ro
}, Symbol.toStringTag, { value: "Module" }));
function Wt(n) {
  const t = { ...n };
  return n.xPos !== void 0 && t.x === void 0 && (t.x = n.xPos, delete t.xPos), n.yPos !== void 0 && t.y === void 0 && (t.y = n.yPos, delete t.yPos), n.foregroundColor !== void 0 && t.fontColor === void 0 && (t.fontColor = n.foregroundColor, delete t.foregroundColor), n.shapeHint !== void 0 && t.shape === void 0 && (t.shape = qc(n.shapeHint), delete t.shapeHint), n.svgString !== void 0 && t.svgContent === void 0 && (t.svgContent = n.svgString, delete t.svgString), n.blnStraight !== void 0 && (t.isStraightLine = n.blnStraight, delete t.blnStraight), t;
}
function j(n) {
  const t = { ...n };
  return t.xPos = n.x, t.yPos = n.y, t.foregroundColor = n.fontColor, n.shape && (t.shapeHint = n.shape), n.svgContent && (t.svgString = n.svgContent), t;
}
function fi(n) {
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
function ao(n) {
  return { ...n };
}
function pi(n) {
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
function gi(n) {
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
function qc(n) {
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
function Zc(n) {
  const t = {
    options: fi(n.options || {}),
    nodes: [],
    shareId: n.shareId || ""
  };
  return Array.isArray(n.nodes) && (t.nodes = n.nodes.map((e) => {
    const i = Wt(e.options || {}), s = { associations: [] };
    return e.relationships?.associations && (s.associations = e.relationships.associations.map(
      (o) => pi(o)
    )), {
      options: i,
      relationships: s
    };
  })), t;
}
function Wc(n) {
  const t = {
    options: ao(n.options || {}),
    nodes: [],
    shareId: n.shareId || ""
  };
  return Array.isArray(n.nodes) && (t.nodes = n.nodes.map((e) => {
    const i = j(e.options || {}), s = { associations: [] };
    return e.relationships?.associations && (s.associations = e.relationships.associations.map(
      (o) => gi(o)
    )), {
      options: i,
      relationships: s
    };
  })), t;
}
const Vc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  convertV1JsonToV2: Zc,
  convertV2JsonToV1: Wc,
  v1AssociationToV2: pi,
  v1NodeToV2: Wt,
  v1SlateToV2: fi,
  v2AssociationToV1: gi,
  v2NodeToV1: j,
  v2SlateToV1: ao
}, Symbol.toStringTag, { value: "Module" }));
function Kc(n, t, e = 8) {
  const { x: i, y: s, width: o, height: r } = n, a = [i, i + o / 2, i + o], l = [s, s + r / 2, s + r];
  let c = i, h = s, d = e, u = e;
  for (const f of t) {
    const p = [f.x, f.x + f.width / 2, f.x + f.width], g = [f.y, f.y + f.height / 2, f.y + f.height];
    for (const y of a)
      for (const m of p) {
        const b = Math.abs(y - m);
        b < d && (d = b, c = i + (m - y));
      }
    for (const y of l)
      for (const m of g) {
        const b = Math.abs(y - m);
        b < u && (u = b, h = s + (m - y));
      }
  }
  return { x: c, y: h };
}
class ln {
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
    this.connectionHandles = {}, this.connectionHandlesVisible = !1, this._connHandleHideTimer = null, this._connHandlesPinned = !1, this.isDragging = !1, this.wasSelectedBeforeDrag = !1, this.preDragTransform = null, this.preDragPosition = null, this._dragStartPointer = null, this._groupDragSiblings = [], this._lastClickTime = 0, this._initFailed = !1, this._destroyed = !1, this._svgViewboxTimeoutId = null, this._dragEndTimeoutId = null, this._previewViewboxTimeoutId = null, this._connectTimeoutId = null, this.id = t.id || this.generateId(), this.slate = e, console.log("NODE_DEBUG: Constructor called", { id: this.id, options: t }), this.options = {
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
      console.log("NODE_DEBUG: Got viewport for", this.id, t), this.svgGroup = t.group(), this.svgGroup.attr("data-node-id", this.id), this.svgGroup.node.setAttribute("tabindex", "0"), this.svgGroup.node.setAttribute("role", "button"), this.svgGroup.node.style && (this.svgGroup.node.style.cursor = "move"), this.wireConnectionHandleHover(), console.log("NODE_DEBUG: Created svgGroup for", this.id, this.svgGroup), this.finishCreate();
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
          console.log("NODE_DEBUG: Delayed bbox:", l, "Node size:", i, s), (l.width <= 0 || l.height <= 0) && (l = this.calculatePathBounds(this.options.svgContent, i, s), console.log("NODE_DEBUG: Calculated bounds:", l)), l.width > 0 && l.height > 0 ? (this.nestedSvg.viewbox(l.x, l.y, l.width, l.height), this.nestedSvg.node.setAttribute("preserveAspectRatio", "none"), console.log(
            `NODE_DEBUG: Set viewbox(${l.x}, ${l.y}, ${l.width}, ${l.height}) with preserveAspectRatio="none"`
          )) : (console.log("NODE_DEBUG: Invalid bounds, trying default viewbox approach"), this.nestedSvg.viewbox(0, 0, 24, 24), this.nestedSvg.node.setAttribute("preserveAspectRatio", "none"));
        }
      }, 10);
    }
    const e = { ...this.options.resizeRotate };
    this.options.shape === "circle" && (e.preserveAspectRatio = !0), this.resizeRotate = new Xs(this, e), this.connector = new on(this, this.options.connector), this.relationships = new $s(this), this.images = new js(this), this.editor = new Zs(this), this.links = new Ws(this), this.filters = new io(this), this.menu = new oo(this), this.options.image && this.images.set(
      this.options.image,
      this.options.imageOrigWidth,
      this.options.imageOrigHeight
    ), this.options.filters?.vect && this.filters.apply(this.options.filters.vect, "vect"), this.options.filters?.text && this.filters.apply(this.options.filters.text, "text"), this.options.animations?.vect && this.filters.applyAnimation(this.options.animations.vect, "vect"), this.options.animations?.text && this.filters.applyAnimation(this.options.animations.text, "text"), this.options.allowDrag && !this.options.isLocked && this.makeDraggable(), this.setupSelectionBehavior(), typeof this.options.customRender == "function" && this.options.customRender(this.svgGroup, this.options), t || this.centerTextInitial(), this.options.rotate?.rotationAngle && this.applyPositionAndRotation(), console.log("NODE_DEBUG: finishCreate continuing for", this.id), this.svgGroup.node.setAttribute("aria-label", this.options.text || "Unnamed node");
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
      const e = this.options.width || 0, i = this.options.height || 0, s = 11;
      let o = e - s - 3, r = s + 3;
      const a = this.options.shape;
      this.contentPath || this.nestedSvg ? (o = e * 0.72, r = i * 0.28) : (a === "circle" || a === "ellipse") && (o = e * 0.85, r = i * 0.15);
      const l = this.svgGroup.group();
      l.node.setAttribute("class", "node-link-badge"), l.node.setAttribute("style", "cursor:pointer"), l.circle(s * 2).move(o - s, r - s).fill("#2d6cdf").stroke({ color: "#fff", width: 1.5 });
      const h = document.createElementNS("http://www.w3.org/2000/svg", "text");
      h.setAttribute("x", String(o)), h.setAttribute("y", String(r)), h.setAttribute("text-anchor", "middle"), h.setAttribute("dominant-baseline", "central"), h.setAttribute("font-family", "sans-serif"), h.setAttribute("font-size", "15"), h.setAttribute("font-weight", "bold"), h.setAttribute("fill", "#fff"), h.setAttribute("pointer-events", "none"), h.textContent = "↗", l.node.appendChild(h);
      let d = 0;
      const u = (f) => {
        f.stopPropagation(), f.preventDefault?.();
        const p = typeof performance < "u" ? performance.now() : Date.now();
        p - d < 350 || (d = p, this.links?.navigate());
      };
      l.on("pointerdown", (f) => {
        f.stopPropagation();
      }), l.on("pointerup", u), l.on("click", u), this._linkBadge = l;
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
    const f = ro(l, c);
    if (f) {
      const p = this.svgGroup.nested().size(t, e);
      String(c || l || "").toLowerCase() !== "circle" && p.node.setAttribute("preserveAspectRatio", "none");
      const y = p.path(f.path).fill(i).stroke(d);
      try {
        const m = y.bbox();
        m.width > 0 && m.height > 0 ? p.viewbox(m.x, m.y, m.width, m.height) : p.viewbox(f.viewBox);
      } catch {
        p.viewbox(f.viewBox);
      }
      h !== void 0 && y.opacity(h), this.backgroundRect = p, this.contentPath = y;
      try {
        y.node.setAttribute("data-node-background-path", "1"), this.options.svgContent || y.node.setAttribute("data-shape-path", "1");
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
    const { fontSize: t, fontFamily: e, fontColor: i, fontStyle: s, textOpacity: o } = this.options;
    this.textElement.font({
      family: e,
      size: t,
      fill: i,
      opacity: o
    }), this.textElement.attr("font-style", s || null), this.options.text && this.textElement.text(this.wrapTextToWidth(this.options.text)), this.centerText();
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
    return Kc(i, s);
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
    ), i = this.options.fontSize || 14, s = this.options.fontFamily || "sans-serif";
    let o = null;
    try {
      o = (this._measureCanvas || (this._measureCanvas = document.createElement("canvas"))).getContext("2d"), o && (o.font = `${i}px ${s}`);
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
          let f = "";
          for (const p of d)
            f && r(f + p) > e ? (a.push(f), f = p) : f += p;
          h = f;
          continue;
        }
        const u = h ? `${h} ${d}` : d;
        h && r(u) > e ? (a.push(h), h = d) : h = u;
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
    const h = this.textElement.node.querySelectorAll?.("tspan")?.length || 1;
    if (h > 1 && s !== "top" && s !== "bottom") {
      const d = (this.options.fontSize || 14) * 1.3;
      c -= (h - 1) * d / 2;
    }
    this.textElement.attr({ x: l, y: c }), this.fitTextToNode();
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
    const i = this.shapeTextInset(), s = (this.options.width || 0) * i - 12, o = (this.options.height || 0) * i - 10;
    if (s <= 0 || o <= 0) return;
    let r = Math.min(s / e.width, o / e.height);
    if (r >= 0.999) return;
    r = Math.max(r, 0.3);
    const a = e.x + e.width / 2, l = e.y + e.height / 2;
    try {
      t.attr(
        "transform",
        `translate(${a} ${l}) scale(${r.toFixed(
          4
        )}) translate(${-a} ${-l})`
      );
    } catch {
    }
  }
  makeDraggable() {
    this.svgGroup.draggable(), this.svgGroup.on("dragstart.node", (t) => {
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
      ), this.slate.selectNodes([this], s)), this.isDragging = !0, this.wasSelectedBeforeDrag = !0, this.hideConnectionHandles(), this.slate.getSelectedNodes?.().forEach((r) => {
        r !== this && r.hideConnectionHandles?.();
      });
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
        const d = this.slate.getZoom?.() || 1, u = (e.x - this._dragStartPointer.x) / d, f = (e.y - this._dragStartPointer.y) / d;
        this.options.x = this.preDragPosition.x + u, this.options.y = this.preDragPosition.y + f;
        let p = u, g = f;
        const y = this.slate.grid?.snapPoint?.(
          this.options.x,
          this.options.y
        );
        if (y && (this.options.x = y.x, this.options.y = y.y, p = y.x - this.preDragPosition.x, g = y.y - this.preDragPosition.y), this.slate.options.viewPort?.snapToObjects) {
          const m = this.snapToNeighbors(this.options.x, this.options.y);
          this.options.x = m.x, this.options.y = m.y, p = this.options.x - this.preDragPosition.x, g = this.options.y - this.preDragPosition.y;
        }
        for (const m of this._groupDragSiblings)
          m.node.options.x = m.x + p, m.node.options.y = m.y + g, m.node.applyPositionAndRotation();
      }
      const i = this._groupDragSiblings;
      this._groupDragSiblings = [];
      const s = this.preDragPosition, o = 0.5, r = this.options.x ?? 0, a = this.options.y ?? 0, l = !s || Math.abs(r - s.x) > o || Math.abs(a - s.y) > o, c = i.some(
        (d) => Math.abs((d.node.options.x ?? 0) - d.x) > o || Math.abs((d.node.options.y ?? 0) - d.y) > o
      ), h = l || c;
      this.preDragTransform = null, this.preDragPosition = null, this._dragStartPointer = null, this.applyPositionAndRotation(), h && this.slate.broadcast?.("onNodesMove", {
        nodeOptions: [
          j(this.options),
          ...i.map((d) => j(d.node.options))
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
        ), this.slate.selectNodes([this], !1)), this.slate.notifyNodeChanged(this), this._connHandlesPinned && this.showConnectionHandles();
      }, 10);
    }), this.svgGroup.on("dragmove.node", (t) => {
      this.isDragging = !0;
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
        this.applyPositionAndRotation();
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
  /**
   * Raise this node to the top of the SVG z-order. When `persist` is true
   * (deliberate "bring to front"), it broadcasts + records an undo step. Pass
   * false for the transient raise on pointer-down/drag-start so a plain click
   * doesn't persist a z-order change or pollute the undo stack.
   */
  toFront(t = !0) {
    this.svgGroup.front(), t && this.slate.broadcast?.("onNodeToFront", { id: this.id });
  }
  /** Send the node to the back of the SVG z-order. */
  toBack(t = !0) {
    this.svgGroup.back(), t && this.slate.broadcast?.("onNodeToBack", { id: this.id });
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
    this.connectionHandles.container && (this.connectionHandles.container.remove(), this.connectionHandles.container = void 0), this.connectionPreview?.container && (this.connectionPreview.container.remove(), this.connectionPreview.container = void 0), this.hideNodeCog(), this.svgGroup.remove();
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
      const s = Math.min(t, e);
      t = s, e = s;
    }
    if (this.options.width = t, this.options.height = e, this.backgroundRect instanceof De)
      this.backgroundRect.size(t, e);
    else if (this.backgroundRect instanceof en) {
      const s = Math.min(t, e);
      this.backgroundRect.size(s, s), this.options.width = s, this.options.height = s;
    } else if (this.backgroundRect instanceof Ie)
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
    this.textElement && this.options.text && this.textElement.text(this.wrapTextToWidth(this.options.text)), this.centerText(), this._linkBadge && this.updateLinkIndicator();
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
      if (o && this.textElement && t.startsWith("#") && Js(r, t) < 3) {
        const a = rn(t);
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
          ), this.links?.hasLink?.() && this.slate.isReadOnly?.())
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
    !this.options.isComment && !this.nestedSvg && !this.options.isLocked && !this.slate.isReadOnly?.() && !this.slate.isCommentOnly?.() && typeof this.editor?.startInline == "function" ? this.editor.startInline() : this.requestTextPane();
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
      const g = this.svgGroup.rbox(t.canvas);
      i = g.x + g.width / 2, s = g.y;
    } catch {
      i = (this.options.x || 0) + (this.options.width || 0) / 2, s = this.options.y || 0;
    }
    const o = 15, r = 6, a = "#5b6472", l = [
      { key: "delete", color: "#e5484d", onClick: () => this.slate.removeNode(this.id) },
      // plug: press-drag-to-connect (G3) — starts on pointerdown, not click.
      { key: "plug", color: a, onPress: (g) => this.startConnectDrag(g) },
      { key: "cog", color: a, onClick: () => this.menu?.open?.() }
    ], c = l.length, h = o * 2 + r, d = c * (o * 2) + (c - 1) * r, u = i - d / 2 + o, f = s - (o + 28 + 36), p = e.group().addClass("node-cog").addClass("node-toolbar");
    p.rect(d + 14, o * 2 + 10).radius((o * 2 + 10) / 2).center(i, f).fill("#ffffff").stroke({ color: "#e3e5ea", width: 1 }), l.forEach((g, y) => {
      const m = u + y * h, b = p.group().addClass(`node-tool-${g.key}`);
      b.circle(o * 2).center(m, f).fill("#ffffff").attr("fill-opacity", 1e-3), ln.drawToolIcon(b, g.key, m, f, g.color), b.attr("pointer-events", "all");
      try {
        b.node.style.cursor = "pointer";
      } catch {
      }
      b.on("mousedown", (v) => {
        v.stopPropagation?.(), g.onPress && g.onPress(v);
      }), b.on("click", (v) => {
        v.stopPropagation?.(), g.onClick?.();
      });
    }), p.attr("pointer-events", "all"), this._nodeCog = p;
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
    const c = (m, b, v, x) => {
      const _ = Math.hypot(m, b);
      if (_ > 1e-4) return [m / _, b / _];
      const w = Math.hypot(v, x) || 1;
      return [v / w, x / w];
    }, h = (m, b, v) => {
      const x = (m.x || 0) + (m.width || 0) / 2, _ = (m.y || 0) + (m.height || 0) / 2, w = b - x, E = v - _;
      if (Math.abs(w) < 1e-3 && Math.abs(E) < 1e-3) return { x, y: _ };
      const C = w !== 0 ? (m.width || 0) / 2 / Math.abs(w) : 1 / 0, S = E !== 0 ? (m.height || 0) / 2 / Math.abs(E) : 1 / 0, T = Math.min(C, S);
      return { x: x + w * T, y: _ + E * T };
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
    }, p = (m, b) => {
      let v;
      try {
        v = a.node.style.display, a.node.style.display = "none";
      } catch {
      }
      const x = document.elementFromPoint(m, b);
      try {
        v !== void 0 && (a.node.style.display = v);
      } catch {
      }
      const w = x?.closest?.("[data-node-id]")?.getAttribute?.("data-node-id");
      if (w && w !== this.id) return e.nodes?.one?.(w) || null;
      try {
        const E = e.nodes?.allNodes || [];
        for (const C of E) {
          if (!C || C.id === this.id) continue;
          const S = document.querySelector(`#slateCanvas [data-node-id="${C.id}"]`)?.getBoundingClientRect?.(), T = 14;
          if (S && m >= S.left - T && m <= S.right + T && b >= S.top - T && b <= S.bottom + T)
            return C;
        }
      } catch {
      }
      return null;
    }, g = (m) => {
      const b = f(m.clientX, m.clientY), v = p(m.clientX, m.clientY);
      if (v && v.options) {
        const x = v.options, _ = (x.x || 0) + (x.width || 0) / 2, w = (x.y || 0) + (x.height || 0) / 2, E = (vt, zt, St, Tt) => {
          try {
            const lt = vt && vt.svgGroup;
            if (lt) {
              const st = je(lt, [St, Tt]);
              if (st && isFinite(st[0]) && isFinite(st[1]))
                return { x: st[0], y: st[1] };
            }
          } catch {
          }
          return h(zt, St, Tt);
        }, C = E(v, x, o, r), S = E(this, this.options, _, w), T = C.x - S.x, k = C.y - S.y, O = Math.hypot(T, k) || 1, D = c(S.x - o, S.y - r, T, k), H = c(C.x - _, C.y - w, -T, -k), M = Math.max(30, Math.min(O * 0.45, 90)), W = S.x + D[0] * M, J = S.y + D[1] * M, at = C.x + H[0] * M, pt = C.y + H[1] * M;
        a.plot(
          `M ${S.x} ${S.y} C ${W} ${J} ${at} ${pt} ${C.x} ${C.y}`
        );
      } else
        a.plot(`M ${o} ${r} L ${b.x} ${b.y}`);
      if (v !== (d?.node || null) && (u(), v && v.backgroundRect)) {
        const x = v.backgroundRect;
        d = { node: v, _preHiStroke: x.attr("stroke") };
        try {
          x.attr({ stroke: "#007cff", "stroke-dasharray": "8,4", "stroke-opacity": 0.9 });
        } catch {
        }
      }
    }, y = (m) => {
      window.removeEventListener("pointermove", g, !0), window.removeEventListener("pointerup", y, !0), this._connectDragging = !1;
      try {
        a.remove(), l?.remove?.(), i.node.querySelectorAll(
          ".connect-drag-line"
        ).forEach((x) => x.remove());
      } catch {
      }
      const b = p(m.clientX, m.clientY);
      if (u(), b && b.id !== this.id)
        try {
          let v;
          try {
            const x = f(m.clientX, m.clientY), _ = b.options, w = Math.max(
              0,
              Math.min(1, (x.x - (_.x || 0)) / (_.width || 1))
            ), E = Math.max(
              0,
              Math.min(1, (x.y - (_.y || 0)) / (_.height || 1))
            );
            if (Math.min(w, 1 - w, E, 1 - E) < 0.25) {
              let S = w, T = E;
              const k = w, O = 1 - w, D = E, H = 1 - E, M = Math.min(k, O, D, H);
              M === k ? S = 0 : M === O ? S = 1 : M === D ? T = 0 : T = 1, v = { targetAnchor: { x: S, y: T } };
            }
          } catch {
          }
          this.relationships.addAssociation(b, v);
        } catch {
        }
      else if (!b)
        try {
          const v = f(m.clientX, m.clientY), x = this.options, _ = 16, w = v.x >= (x.x || 0) - _ && v.x <= (x.x || 0) + (x.width || 0) + _ && v.y >= (x.y || 0) - _ && v.y <= (x.y || 0) + (x.height || 0) + _;
          if (!e.isReadOnly?.() && !w) {
            const S = e.addNode({
              x: Math.round(v.x - 60),
              y: Math.round(v.y - 35),
              width: 120,
              height: 70,
              text: ""
            });
            if (S) {
              const T = () => {
                try {
                  this.relationships.addAssociation(S);
                } catch {
                }
              };
              S.ready?.then ? S.ready.then(T) : T(), e.selectNodes?.([S]);
            }
          }
        } catch {
        }
    };
    window.addEventListener("pointermove", g, !0), window.addEventListener("pointerup", y, !0);
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
    ), this.connectionHandles.container = this.slate.canvas.group(), this.connectionHandles.container.on(
      "mouseenter",
      () => this.revealConnHandlesOnHover()
    ), this.connectionHandles.container.on(
      "mouseleave",
      () => this.scheduleConnHandlesHide()
    );
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
      }), l.on("pointerdown", (c) => {
        if (this.slate?.isReadOnly?.()) return;
        c.stopPropagation();
        const h = c.clientX, d = c.clientY;
        let u = !1;
        const f = () => {
          window.removeEventListener("pointermove", p, !0), window.removeEventListener("pointerup", g, !0);
        }, p = (y) => {
          if (!u && Math.hypot(y.clientX - h, y.clientY - d) > 5) {
            u = !0, f();
            const m = (b) => {
              b.stopPropagation(), l.node.removeEventListener("click", m, !0);
            };
            l.node.addEventListener("click", m, !0), this.startConnectDrag(c);
          }
        }, g = () => f();
        window.addEventListener("pointermove", p, !0), window.addEventListener("pointerup", g, !0);
      });
    }), this.connectionHandles.container && this.connectionHandles.container.hide(), this.updateConnectionHandlePositions();
  }
  updateConnectionHandlePositions() {
    if (!this.connectionHandles.container || !this.connectionHandlesVisible)
      return;
    const t = this.resizeTarget ?? this.backgroundRect, e = t.bbox(), i = t.screenCTM(), o = t.root().screenCTM().inverseO().multiplyO(i), r = ([u, f], { a: p, b: g, c: y, d: m, e: b, f: v }) => [u * p + f * y + b, u * g + f * m + v], a = e.x + e.width / 2, l = e.y + e.height / 2, c = 35, h = 20, d = {
      top: [a, e.y - c],
      right: [e.x + e.width + h, l],
      bottom: [a, e.y + e.height + h],
      left: [e.x - h, l]
    };
    Object.entries(d).forEach(([u, f]) => {
      const p = this.connectionHandles[u];
      if (p) {
        const [g, y] = r(f, o);
        p.center(g, y);
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
    this.slate?.isReadOnly?.() || this.isDragging || (this._connHandleHideTimer && (clearTimeout(this._connHandleHideTimer), this._connHandleHideTimer = null), this.connectionHandlesVisible || this.showConnectionHandles());
  }
  scheduleConnHandlesHide() {
    this._connHandlesPinned || (this._connHandleHideTimer && clearTimeout(this._connHandleHideTimer), this._connHandleHideTimer = setTimeout(() => {
      this._connHandleHideTimer = null, !(this._connHandlesPinned || this._connectDragging) && this.hideConnectionHandles();
    }, 220));
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
    }, f = u.x - l, p = u.y - c, g = Math.sqrt(f * f + p * p), y = f / g, m = p / g, b = this.backgroundRect.bbox(), v = b.x + b.width / 2, x = b.y + b.height / 2, _ = this.backgroundRect.screenCTM(), E = this.backgroundRect.root().screenCTM().inverseO().multiplyO(_), C = E.inverse(), S = y * C.a + m * C.c, T = y * C.b + m * C.d;
    let k, O;
    const D = Math.abs(S);
    Math.abs(T) > D ? T < 0 ? (k = v, O = b.y) : (k = v, O = b.y + b.height) : S < 0 ? (k = b.x, O = x) : (k = b.x + b.width, O = x);
    const M = ([de, ue], { a: dn, b: gt, c: No, d: Ro, e: Po, f: Io }) => [de * dn + ue * No + Po, de * gt + ue * Ro + Io], [W, J] = M([k, O], E), at = Math.sqrt(
      Math.pow(W - l, 2) + Math.pow(J - c, 2)
    ), pt = at, vt = at + o + pt, zt = l + y * vt, St = c + m * vt, Tt = zt - i / 2, lt = St - s / 2;
    if (!this.connectionPreview.container) {
      console.warn("CONNECTION_HANDLES_DEBUG: Preview container not found");
      return;
    }
    this.connectionPreview.node = this.createPreviewShape(
      this.connectionPreview.container,
      Tt,
      lt,
      i,
      s,
      r
      // Pass rotation angle to preview
    );
    const he = at + o - g, Lt = {
      x: u.x + y * he,
      y: u.y + m * he
    };
    this.connectionPreview.connector = this.connectionPreview.container.line(u.x, u.y, Lt.x, Lt.y).stroke({ color: "#007cff", width: 2, opacity: 0.7 }).attr("pointer-events", "none"), this.addArrowheadToConnector(
      this.connectionPreview.container,
      u,
      Lt
    );
  }
  createPreviewShape(t, e, i, s, o, r = 0) {
    let a;
    const l = this.options.backgroundColor || "#007cff", c = "#ffffff", h = 2, d = 0.6, u = e + s / 2, f = i + o / 2;
    switch (this.options.shape) {
      case "circle":
        const p = Math.min(s, o) / 2;
        a = t.circle(p * 2).center(u, f).fill(l).stroke({ color: c, width: h }).opacity(d), r !== 0 && a.rotate(r, u, f);
        break;
      case "ellipse":
        a = t.ellipse(s, o).center(u, f).fill(l).stroke({ color: c, width: h }).opacity(d), r !== 0 && a.rotate(r, u, f);
        break;
      default:
        if (this.options.svgContent) {
          a = t.rect(s, o).move(e, i).fill("none").stroke({ color: c, width: h }).opacity(d).radius(4);
          const g = t.nested().size(s, o).move(e, i);
          g.svg(this.options.svgContent), this._previewViewboxTimeoutId = setTimeout(() => {
            if (this._destroyed) return;
            const y = g.children()[0];
            if (y) {
              let m = y.bbox();
              (m.width <= 0 || m.height <= 0) && (m = this.calculatePathBounds(
                this.options.svgContent,
                s,
                o
              )), m.width > 0 && m.height > 0 && (g.viewbox(m.x, m.y, m.width, m.height), g.node.setAttribute("preserveAspectRatio", "none")), y.fill(l).opacity(d);
            }
          }, 1), g.attr("pointer-events", "none"), r !== 0 && (a.rotate(r, u, f), g.rotate(r, u, f));
        } else
          a = t.rect(s, o).move(e, i).fill(l).stroke({ color: c, width: h }).opacity(d).radius(4), r !== 0 && a.rotate(r, u, f);
        break;
    }
    return a.attr("pointer-events", "none");
  }
  addArrowheadToConnector(t, e, i) {
    const s = i.x - e.x, o = i.y - e.y, r = Math.sqrt(s * s + o * o);
    if (r === 0) return;
    const a = s / r, l = o / r, c = 12, h = 6, d = i.x, u = i.y, f = d - a * c, p = u - l * c, g = -l * h, y = a * h, m = [
      [d, u],
      [f + g, p + y],
      [f - g, p - y],
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
    ), this._connHandlesPinned = !0, this._connHandleHideTimer && (clearTimeout(this._connHandleHideTimer), this._connHandleHideTimer = null), !this.isDragging && this.showConnectionHandles();
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
      const c = a * Math.cos(r) - l * Math.sin(r), h = a * Math.sin(r) + l * Math.cos(r), d = this.backgroundRect.rbox(this.backgroundRect.root()), u = d.cx, f = d.cy, p = this.backgroundRect.bbox(), g = p.x + p.width / 2, y = p.y + p.height / 2;
      let m, b;
      switch (t) {
        case "top":
          m = g, b = p.y;
          break;
        case "right":
          m = p.x + p.width, b = y;
          break;
        case "bottom":
          m = g, b = p.y + p.height;
          break;
        case "left":
          m = p.x, b = y;
          break;
      }
      const v = this.backgroundRect.screenCTM(), _ = this.backgroundRect.root().screenCTM().inverseO().multiplyO(v), w = ([at, pt], { a: vt, b: zt, c: St, d: Tt, e: lt, f: st }) => [at * vt + pt * St + lt, at * zt + pt * Tt + st], [E, C] = w([m, b], _), S = Math.sqrt(
        Math.pow(E - u, 2) + Math.pow(C - f, 2)
      ), T = S, k = S + s + T, O = u + c * k, D = f + h * k, H = O - e / 2, M = D - i / 2, W = this.cloneNodeOptions(H, M, o), J = this.slate.addNode(W);
      if (!J) {
        console.error("CONNECTION_HANDLES_DEBUG: Failed to create new node");
        return;
      }
      console.log(
        "CONNECTION_HANDLES_DEBUG: Created new node",
        J.id,
        "at",
        H,
        M
      ), this.hideConnectionPreview(), this._connectTimeoutId = setTimeout(() => {
        this._destroyed || this.connectToNode(J);
      }, 100);
    } catch (e) {
      console.error(
        "CONNECTION_HANDLES_DEBUG: Error creating connected node:",
        e
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
      text: `Node ${s.split("_")[1]}`,
      // Give it a different default text
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
class Qc {
  constructor(t) {
    this.nodes = /* @__PURE__ */ new Map(), this.slate = t;
  }
  add(t = {}) {
    if (t.id || (t.id = this.generateId()), this.nodes.has(t.id))
      return console.warn(`Node with id "${t.id}" already exists`), this.nodes.get(t.id);
    const e = new ln(t, this.slate);
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
  addRelationship(t) {
    const { parentId: e, childId: i, targetPoint: s } = t || {}, o = e ? this.one(e) : void 0;
    if (!o) {
      console.warn("NODESMANAGER_DEBUG: addRelationship missing parent", e);
      return;
    }
    const r = t.id;
    if (r) {
      if (o.relationships?.hasAssociationId?.(r)) return;
    } else if (o.relationships?.getAssociation?.(i))
      return;
    if (s) {
      o.relationships?.addFloatingAssociation(
        s,
        t
      );
      return;
    }
    const a = i ? this.one(i) : void 0;
    if (!a) {
      console.warn(
        "NODESMANAGER_DEBUG: addRelationship missing child",
        e,
        i
      );
      return;
    }
    o.relationships?.addAssociation(a, t);
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
function cn(n, t, e) {
  const s = (t || n.nodes.allNodes).map(
    (o) => lo(o)
  );
  return e && s.forEach((o, r) => {
    o.options._presentationIndex = r;
  }), {
    options: th(n.options),
    nodes: s,
    shareId: n.options.shareId || ""
  };
}
async function hn(n, t, e = !1, i = !1) {
  const s = typeof n == "string" ? JSON.parse(n) : n;
  t.beginRemoteApply?.();
  try {
    await Jc(s, t, e, i);
  } finally {
    t.endRemoteApply?.();
  }
}
async function Jc(n, t, e, i) {
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
      const a = co(r.options), l = t.nodes.one(a.id);
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
      const a = r.options.id || r.options.xPos !== void 0 ? Wt(r.options).id : r.options.id;
      if (!a) continue;
      const l = s.get(a) || t.nodes.one(a);
      if (!l) continue;
      const c = r.relationships?.associations;
      if (!(!Array.isArray(c) || c.length === 0))
        for (const h of c) {
          const d = pi(h);
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
function lo(n) {
  const t = j(n.options);
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
      ...i.associations.map((s) => gi(s))
    );
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
function co(n) {
  return Wt(n);
}
function th(n) {
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
function ho(n) {
  return cn(n);
}
const eh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  deserialize: hn,
  deserializeNodeOptions: co,
  serialize: cn,
  serializeNode: lo,
  snapshot: ho
}, Symbol.toStringTag, { value: "Module" }));
class nh {
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
        this.slate.nodes.one(i.id) || this.slate.nodes.add(Wt(i));
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
  /** Apply an authoritative full-document baseline (undo/redo collaboration). */
  async onSlateReplaced(t) {
    const e = t.data?.snapshot;
    e && await hn(e, this.slate, !1, !0);
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
class uo {
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
        const u = o / d, f = i.height / i.width * u, p = e.clientX - s.left, g = e.clientY - s.top, y = i.x + p * r, m = i.y + g * (i.height / s.height || r), b = y - p / o * u, v = m - g / (s.height || o) * f;
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
    for (const b of t) {
      const v = b.options.x ?? 0, x = b.options.y ?? 0, _ = b.options.width ?? 100, w = b.options.height ?? 60;
      e = Math.min(e, v), i = Math.min(i, x), s = Math.max(s, v + _), o = Math.max(o, x + w);
    }
    if (!isFinite(e)) return;
    const r = s - e, a = o - i, l = 50, c = r + l * 2, h = a + l * 2, d = this.getViewportSize(), u = d.w / d.h, f = c / h;
    let p = c, g = h;
    f > u ? g = p / u : p = g * u, p < d.w && (p = d.w, g = d.h);
    const y = e + r / 2, m = i + a / 2;
    this.canvas.viewbox(
      y - p / 2,
      m - g / 2,
      p,
      g
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
class fo {
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
    const u = (this.slate.options.viewPort?.originalWidth || 800) / e, f = (this.slate.options.viewPort?.originalHeight || 600) / e, p = (i.x - r.minX + c) * this.scale, g = (i.y - r.minY + c) * this.scale, y = u * this.scale, m = f * this.scale;
    this.viewportIndicator.move(p, g), this.viewportIndicator.size(Math.max(y, 10), Math.max(m, 10));
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
    this.container && (this.miniCanvas = nn().addTo(this.container).size(this.options.width, this.options.height), this.miniCanvas.rect(this.options.width, this.options.height).fill("#f8f9fa"));
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
        const g = Math.min(d, u) / 2;
        f = this.miniCanvas.circle(g * 2).move(c, h);
      } else
        f = this.miniCanvas.rect(d, u).move(c, h);
      f.fill(l.options.backgroundColor || this.options.nodeColor), f.stroke({ width: 0 });
      const p = l.options.rotate?.rotationAngle || 0;
      if (p !== 0) {
        const g = c + d / 2, y = h + u / 2;
        f.rotate(p, g, y);
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
    }), this.miniCanvas.on("mousedown", (t) => {
      const e = t;
      try {
        const i = this.miniCanvas.point(e.clientX, e.clientY), s = this.viewportIndicator?.bbox().width || 50, o = this.viewportIndicator?.bbox().height || 40, r = this.calculateContentBounds(), a = 100, l = (i.x - s / 2) / this.scale + r.minX - a, c = (i.y - o / 2) / this.scale + r.minY - a;
        this.slate.panZoom?.pan({ x: l, y: c });
      } catch {
      }
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
class po {
  constructor(t, e = {}) {
    this.undoStack = [], this.redoStack = [], this.debounceTimer = null, this.isRestoring = !1, this.restoreQueue = Promise.resolve(), this.pendingRestores = 0, this.slate = t, this.options = {
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
    return this.restore(e, "undo"), console.log(
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
    const t = this.redoStack.pop();
    return this.undoStack.push(t), this.restore(t, "redo"), console.log(
      "UNDOREDO_DEBUG: Redo performed. Undo stack:",
      this.undoStack.length,
      "Redo stack:",
      this.redoStack.length
    ), !0;
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
      t = cn(this.slate);
    } catch {
      return;
    }
    this.redoStack = [], this.undoStack.push(t), this.undoStack.length > this.options.maxHistory && this.undoStack.shift(), console.log(
      "UNDOREDO_DEBUG: Snapshot taken. Stack size:",
      this.undoStack.length
    );
  }
  restore(t, e) {
    this.pendingRestores += 1, this.isRestoring = !0, this.restoreQueue = this.restoreQueue.then(async () => {
      await hn(t, this.slate, !1, !0);
      const i = JSON.stringify(t);
      this.slate.broadcast?.("onSlateReplaced", {
        action: e,
        snapshot: i
      }), this.slate.options.events?.onTakeSnapshot?.({
        action: e,
        slateId: this.slate.options.id,
        snapshot: i
      });
    }).catch(
      (i) => console.error("UNDOREDO_DEBUG: Restore failed", i)
    ).finally(() => {
      this.pendingRestores -= 1, this.pendingRestores === 0 && (this.isRestoring = !1);
    });
  }
}
class go {
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
class mo {
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
class yo {
  constructor(t, e = {}) {
    this.boundHandler = null, this.clipboard = [], this.clipboardEdges = [], this.pasteCount = 0, this.nudgeTimer = null, this.slate = t, this.options = {
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
        if (this.startInlineEditSelected(t)) break;
        this.selectFocused(t);
        break;
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
    const i = e.id;
    return delete e.id, delete e.parentArrowForChildren, delete e.noChildArrowForChildren, delete e.associations, delete e.relationships, i && (e.__srcId = i), e;
  }
  /**
   * Capture the connectors whose BOTH endpoints are within `nodes` — the internal
   * edges of a selection. Duplicating/pasting a connected group must recreate these
   * between the copies (Miro parity), or the copies come out disconnected.
   */
  internalEdges(t) {
    const e = new Set(t.map((s) => s.id)), i = [];
    for (const s of t) {
      const o = s.relationships?.assocMap;
      if (o) {
        for (const r of o.values())
          if (e.has(r.childId)) {
            let a = {};
            try {
              a = JSON.parse(JSON.stringify(r));
            } catch {
              a = { ...r };
            }
            delete a.id, delete a.childId, delete a.parentId, i.push({ parentSrcId: s.id, childSrcId: r.childId, data: a });
          }
      }
    }
    return i;
  }
  /** Ctrl/Cmd+C — copy the selected nodes to the internal clipboard. */
  copySelected(t) {
    const e = this.slate.getSelectedNodes?.() || [];
    e.length !== 0 && (t.preventDefault(), this.clipboard = e.map((i) => this.snapshotNode(i)), this.clipboardEdges = this.internalEdges(e), this.pasteCount = 0, this.slate.announce?.(`Copied ${this.clipboard.length} node(s)`));
  }
  /** Ctrl/Cmd+V — paste the clipboard nodes (offset), then select the copies. */
  pasteClipboard(t) {
    this.clipboard.length !== 0 && (t.preventDefault(), this.pasteCount++, this.createCopies(this.clipboard, 20 * this.pasteCount, this.clipboardEdges));
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
    this.createCopies(i, 20, this.internalEdges(e));
  }
  /**
   * Create fresh nodes from option snapshots, offset by (offset,offset) and each
   * given a new id, then select the new nodes. addNode() broadcasts onNodeAdded,
   * so copies persist + sync to collab peers like any other added node.
   */
  createCopies(t, e, i = []) {
    if (this.slate.isReadOnly?.() || this.slate.isCommentOnly?.()) return;
    const s = [], o = /* @__PURE__ */ new Map();
    for (const r of t) {
      const a = { ...r }, l = a.__srcId;
      delete a.__srcId, a.id = It(), a.x = (a.x || 0) + e, a.y = (a.y || 0) + e;
      try {
        const c = this.slate.addNode(a);
        c && (s.push(c), l && o.set(l, c));
      } catch {
      }
    }
    if (s.length > 0) {
      const r = () => {
        this.slate.selectNodes?.(s, !1);
        for (const l of i) {
          const c = o.get(l.parentSrcId), h = o.get(l.childSrcId);
          if (c && h)
            try {
              c.relationships?.addAssociation?.(h, l.data);
            } catch {
            }
        }
      }, a = s.map((l) => l?.ready).filter(Boolean);
      a.length ? Promise.all(a).then(r).catch(r) : setTimeout(r, 120), this.slate.announce?.(`Pasted ${s.length} node(s)`);
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
          nodeOptions: o.map((r) => j(r.options))
        });
      }, 250);
    }
  }
  handleArrowKey(t) {
    if (this.slate.getSelectedNodes().length > 0) {
      const i = this.options.nudgeDistance, s = t.shiftKey ? i * 4 : i;
      switch (t.key) {
        case "ArrowUp":
          this.nudge(0, -s, t);
          break;
        case "ArrowDown":
          this.nudge(0, s, t);
          break;
        case "ArrowLeft":
          this.nudge(-s, 0, t);
          break;
        case "ArrowRight":
          this.nudge(s, 0, t);
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
  /**
   * If exactly one node is selected, begin inline text editing on it.
   * Returns true when it started an edit (so callers can stop falling through).
   * Skips SVG-content nodes (they have no editable text).
   */
  startInlineEditSelected(t) {
    const e = this.slate.selectedNodes || [];
    if (e.length !== 1) return !1;
    const i = e[0];
    return !i?.editor?.startInline || i.nestedSvg ? !1 : (t.preventDefault(), i.editor.startInline(), !0);
  }
}
class bo {
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
    const t = [], e = /* @__PURE__ */ new Map(), i = new Set(this.targetNodes.map((o) => o.id));
    for (const o of this.targetNodes) {
      let r;
      try {
        r = JSON.parse(JSON.stringify(o.options || {}));
      } catch {
        r = { ...o.options || {} };
      }
      const a = r.id;
      r.id = It(), r.x = (r.x || 0) + 20, r.y = (r.y || 0) + 20, delete r.parentArrowForChildren, delete r.noChildArrowForChildren, delete r.associations;
      try {
        const l = this.slate.addNode?.(r);
        l && (t.push(l), a && e.set(a, l));
      } catch {
      }
    }
    const s = [];
    for (const o of this.targetNodes) {
      const r = o.relationships?.assocMap;
      if (r) {
        for (const a of r.values())
          if (i.has(a.childId)) {
            let l = {};
            try {
              l = JSON.parse(JSON.stringify(a));
            } catch {
              l = { ...a };
            }
            delete l.id, delete l.childId, delete l.parentId, s.push({
              parentSrcId: o.id,
              childSrcId: a.childId,
              data: l
            });
          }
      }
    }
    if (t.length > 0) {
      const o = () => {
        this.slate.selectNodes?.(t, !1);
        for (const a of s) {
          const l = e.get(a.parentSrcId), c = e.get(a.childSrcId);
          if (l && c)
            try {
              l.relationships?.addAssociation?.(c, a.data);
            } catch {
            }
        }
      }, r = t.map((a) => a?.ready).filter(Boolean);
      r.length ? Promise.all(r).then(o).catch(o) : setTimeout(o, 120);
    }
  }
}
function mi(n, t = {}, e) {
  const i = n.canvas;
  if (!i) {
    const s = "";
    return e?.(s), s;
  }
  try {
    const s = i.node.cloneNode(!0), o = [
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
    try {
      const l = s.querySelectorAll("[data-node-id]");
      if (l.length > 0) {
        let h = 1 / 0, d = 1 / 0, u = -1 / 0, f = -1 / 0;
        for (const p of Array.from(l)) {
          const g = p.getAttribute("data-node-id"), m = n.nodes?.one?.(g)?.options;
          if (!m) continue;
          const b = m.x || 0, v = m.y || 0, x = m.width || 0, _ = m.height || 0, w = Number(
            typeof m.rotate == "object" ? m.rotate?.rotationAngle : m.rotate
          ) || 0;
          if (w) {
            const E = b + x / 2, C = v + _ / 2, S = w * Math.PI / 180, T = Math.cos(S), k = Math.sin(S);
            for (const [O, D] of [
              [b, v],
              [b + x, v],
              [b + x, v + _],
              [b, v + _]
            ]) {
              const H = O - E, M = D - C, W = E + H * T - M * k, J = C + H * k + M * T;
              h = Math.min(h, W), d = Math.min(d, J), u = Math.max(u, W), f = Math.max(f, J);
            }
          } else
            h = Math.min(h, b), d = Math.min(d, v), u = Math.max(u, b + x), f = Math.max(f, v + _);
        }
        if (isFinite(h) && u > h) {
          const p = u - h + 80, g = f - d + 40 * 2;
          s.setAttribute(
            "viewBox",
            `${h - 40} ${d - 40} ${p} ${g}`
          ), s.setAttribute("width", String(Math.round(p))), s.setAttribute("height", String(Math.round(g))), s.setAttribute("preserveAspectRatio", "xMidYMid meet");
        }
      }
    } catch {
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
async function vo(n, t = {}, e) {
  const i = mi(n, t);
  if (!i) {
    const o = t.asBinary ? new Blob() : "";
    return e?.(o), o;
  }
  const s = t.scale || 2;
  try {
    const o = n.canvas;
    let r, a;
    const l = i.match(
      /viewBox="[\d.\-]+\s+[\d.\-]+\s+([\d.\-]+)\s+([\d.\-]+)"/
    );
    if (l)
      r = parseFloat(l[1]), a = parseFloat(l[2]);
    else {
      const y = o.viewbox();
      r = y.width, a = y.height;
    }
    const c = r * s, h = a * s, d = document.createElement("canvas");
    d.width = c, d.height = h;
    const u = d.getContext("2d");
    t.alpha || (u.fillStyle = n.options.containerStyle?.backgroundColor || "#ffffff", u.fillRect(0, 0, c, h));
    const f = new Image(), p = new Blob([i], {
      type: "image/svg+xml;charset=utf-8"
    }), g = URL.createObjectURL(p);
    return new Promise((y, m) => {
      f.onload = () => {
        if (u.drawImage(f, 0, 0, c, h), URL.revokeObjectURL(g), t.asBinary)
          d.toBlob(
            (b) => {
              const v = b || new Blob();
              e?.(v), y(v);
            },
            "image/png"
          );
        else {
          const b = d.toDataURL("image/png"), v = t.base64 ? b.split(",")[1] : b;
          e?.(v), y(v);
        }
      }, f.onerror = (b) => {
        URL.revokeObjectURL(g), console.error("EXPORT_DEBUG: PNG rendering failed:", b);
        const v = t.asBinary ? new Blob() : "";
        e?.(v), y(v);
      }, f.src = g;
    });
  } catch (o) {
    console.error("EXPORT_DEBUG: PNG export failed:", o);
    const r = t.asBinary ? new Blob() : "";
    return e?.(r), r;
  }
}
const ih = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  exportPNG: vo,
  exportSVG: mi
}, Symbol.toStringTag, { value: "Module" }));
class wo {
  constructor(t, e = {}) {
    this.doc = null, this.provider = null, this.collabMap = null, this.awareness = null, this.isConnected = !1, this.clientID = 0, this.cursorElements = /* @__PURE__ */ new Map(), this._cursorMoveHandler = null, this._cursorTrackingNode = null, this._cursorSweepTimer = null, this._cursorLastSeen = /* @__PURE__ */ new Map(), this.slate = t, this.options = {
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
      this.awareness.on("change", r), this.awareness.on(
        "update",
        ({
          added: a,
          updated: l,
          removed: c
        }) => {
          const h = Date.now();
          for (const d of a) this._cursorLastSeen.set(d, h);
          for (const d of l) this._cursorLastSeen.set(d, h);
          for (const d of c) this._cursorLastSeen.delete(d);
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
      this.exe(i), this.slate.recordUndoFor?.(i.type);
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
        i.type === "onSlateReplaced" && this.pruneBeforeSlateReplacement();
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
  /** Remove the mutation replay log before installing a full-state baseline. */
  pruneBeforeSlateReplacement() {
    if (this.collabMap)
      try {
        const t = [];
        this.collabMap.forEach((e, i) => t.push(i));
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
    const i = t.type;
    if (typeof e[i] == "function") {
      this.slate.beginRemoteApply?.();
      try {
        e[i](t)?.catch?.(
          (o) => console.warn("COLLAB_DEBUG: Async invoker failed:", i, o)
        );
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
function xo(n, t, e = !1, i = !1) {
  if (!t) return;
  t._id && (n.options.themeId = t._id), e && (n.options.syncWithTheme = !0), t.containerStyle && Object.keys(t.containerStyle).length > 0 && (n.options.containerStyle = { ...t.containerStyle }, n.applyContainerStyle?.()), t.defaultLineColor && (n.options.defaultLineColor = t.defaultLineColor, n.nodes?.allNodes?.forEach((r) => {
    r.relationships?.updateAssociationsWith?.({
      lineColor: t.defaultLineColor
    });
  }));
  const s = n.nodes.allNodes;
  if (!s || s.length === 0 || !t.styles) return;
  const o = sh(n, s);
  s.forEach((r, a) => {
    const l = o ? o.get(r.options.id) ?? 0 : a, c = _o(t, l);
    c && oh(r, c);
  }), console.log("THEME_DEBUG: Applied theme", t.name || t._id);
}
function sh(n, t) {
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
function _o(n, t) {
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
function oh(n, t) {
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
    const l = t.shape || t.vectorPath;
    n.setShape?.(l, t.vectorPath);
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
const rh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  applyTheme: xo,
  buildNodeStyleFromTheme: _o
}, Symbol.toStringTag, { value: "Module" }));
function Co(n, t = !1, e = 20) {
  const i = n.nodes.allNodes;
  if (i.length < 2) return;
  const s = 100;
  let o = !0, r = 0;
  for (; o && r < s; ) {
    o = !1, r++;
    for (let a = 0; a < i.length; a++)
      for (let l = a + 1; l < i.length; l++) {
        const c = i[a], h = i[l], d = c.options.x || 0, u = c.options.y || 0, f = c.options.width || 100, p = c.options.height || 60, g = h.options.x || 0, y = h.options.y || 0, m = h.options.width || 100, b = h.options.height || 60, v = d < g + m + e && d + f + e > g, x = u < y + b + e && u + p + e > y;
        if (v && x) {
          o = !0;
          const _ = d + f / 2 - (g + m / 2), w = u + p / 2 - (y + b / 2), E = Math.sqrt(_ * _ + w * w) || 1, C = _ / E * (e / 2), S = w / E * (e / 2);
          c.position(d + C, u + S), h.position(g - C, y - S);
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
function Eo(n, t, e, i = !1) {
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
function So(n) {
  return n.nodes.allNodes.map((t) => ({
    id: t.id,
    x: t.options.x || 0,
    y: t.options.y || 0
  }));
}
const ah = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  applyLayout: Eo,
  packageLayout: So,
  removeLayoutOverlaps: Co
}, Symbol.toStringTag, { value: "Module" }));
class To {
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
      const o = parseFloat(this.slider.value);
      this.slate.zoom?.(o), this.update();
    }, this.container.appendChild(this.slider);
    const i = document.createElement("button");
    i.textContent = "+", i.style.cssText = "background:none;border:none;color:white;cursor:pointer;font-size:16px;padding:0 4px;", i.onclick = () => this.slate.zoomIn?.(), this.container.appendChild(i), this.label = document.createElement("span"), this.label.textContent = "100%", this.label.style.cssText = "min-width: 40px; text-align: right;", this.container.appendChild(this.label);
    const s = document.createElement("button");
    s.textContent = "⤢", s.title = "Fit to content", s.setAttribute("aria-label", "fitToContent"), s.style.cssText = "background:none;border:none;color:white;cursor:pointer;font-size:15px;padding:0 4px;line-height:1;", s.onclick = () => this.slate.fitToContent?.(), this.container.insertBefore(s, this.container.firstChild), this.slate.element.appendChild(this.container), this._intervalId = setInterval(() => this.update(), 500);
  }
}
class Ao {
  constructor(t) {
    this.steps = [], this.currentStep = -1, this.isActive = !1, this.zoomLevel = 1.5, this._animRaf = null, this.slate = t;
  }
  /**
   * Extract presentation layout from current nodes.
   * Orders nodes by their _presentationIndex or by position (top-to-bottom, left-to-right).
   */
  extractLayout(t) {
    let e = [...this.slate.nodes.allNodes];
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
    const e = (this.slate.nodes?.allNodes || []).filter((p) => !p.options?.isCategory);
    let i = 1 / 0, s = 1 / 0, o = -1 / 0, r = -1 / 0;
    e.forEach((p) => {
      const g = p.options || {};
      i = Math.min(i, g.x || 0), s = Math.min(s, g.y || 0), o = Math.max(o, (g.x || 0) + (g.width || 0)), r = Math.max(r, (g.y || 0) + (g.height || 0));
    }), isFinite(i) || (i = 0, s = 0, o = 0, r = 0);
    const a = { left: i, top: s, width: o - i, height: r - s }, l = new Map(e.map((p) => [p.id, p])), c = (p) => (p.relationships?.associations || []).map((g) => g.childId).filter((g) => l.has(g)), h = (p) => e.some(
      (g) => (g.relationships?.associations || []).some((y) => y.childId === p.id)
    ), d = /* @__PURE__ */ new Set(), u = (p) => {
      if (d.has(p.id)) return null;
      d.add(p.id);
      const g = p.options || {}, y = c(p).map((m) => l.get(m)).filter(Boolean);
      return {
        nodeId: p.id,
        metrics: {
          rotation: Math.ceil(g.rotate?.rotationAngle || 0),
          bbox: {
            x: Number(((g.x || 0) - a.left).toFixed(2)),
            y: Number(((g.y || 0) - a.top).toFixed(2)),
            width: Number((g.width || 0).toFixed(2)),
            height: Number((g.height || 0).toFixed(2))
          }
        },
        description: g.text || g.description || "",
        image: g.image,
        numberOfChildrenNodes: y.length,
        childrenNodes: y.map(u).filter(Boolean)
      };
    }, f = e.filter((p) => !h(p));
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
    const i = this.steps[t], s = this.slate.nodes.one(i.nodeId);
    if (s)
      try {
        const o = s.options, r = o.width || 0, a = o.height || 0, l = (o.x || 0) + r / 2, c = (o.y || 0) + a / 2, d = this.slate.canvas.viewbox(), u = this.slate.panZoom.getViewportSize(), f = (o.rotate?.rotationAngle || 0) * Math.PI / 180, p = Math.abs(Math.cos(f)), g = Math.abs(Math.sin(f)), y = Math.max(1, r * p + a * g), m = Math.max(1, a * p + r * g), b = Math.min(
          this.zoomLevel > 0 ? this.zoomLevel : 1,
          0.9 * u.w / y,
          0.9 * u.h / m
        ), v = u.w / b, x = u.h / b, _ = { x: l - v / 2, y: c - x / 2, width: v, height: x };
        this.animateViewbox(
          { x: d.x, y: d.y, width: d.width, height: d.height },
          _,
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
const We = class We {
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
    if (this.selectedNodes = [], this.groupResizeRotate = null, this.enteredGroupId = null, this._coordinateIntervalId = null, this._lastPointerDown = null, this._windowPointerDownHandler = null, this._destroyed = !1, this._applyingRemote = !1, this._hadGroupSelection = !1, this._emitDeferred = !1, this._emitQueue = [], this._birdsEyeTimeoutId = null, this._coordDisplayTimeoutId = null, this._nodeNotifyTimeoutId = null, this._liveRegion = null, this._resizeObserver = null, this._decoRefreshQueued = !1, typeof t == "string") {
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
      availableFilters: so(),
      availableAnimations: to()
    };
  }
  init() {
    this.canvas = nn().addTo(this.element), this.canvas.node.setAttribute("role", "img"), this.canvas.node.setAttribute("aria-label", this.options.name || "Diagram canvas"), this.canvas.node.setAttribute("tabindex", "0"), this._liveRegion = document.createElement("div"), this._liveRegion.setAttribute("aria-live", "polite"), this._liveRegion.setAttribute("aria-atomic", "true"), this._liveRegion.style.cssText = "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;", this.element.appendChild(this._liveRegion), this.element.style.overflow = this.element.style.overflow || "hidden", getComputedStyle(this.element).position === "static" && (this.element.style.position = "relative");
    const t = this.canvas.node;
    t?.style && (t.style.width = "100%", t.style.height = "100%", t.style.display = "block"), t?.removeAttribute?.("width"), t?.removeAttribute?.("height"), t?.setAttribute?.("preserveAspectRatio", "xMidYMid slice");
    const e = this.element.getBoundingClientRect();
    this.options.viewPort = this.options.viewPort || {};
    const i = this.options.viewPort.originalWidth || Math.round(e.width) || 800, s = this.options.viewPort.originalHeight || Math.round(e.height) || 600;
    this.options.viewPort.originalWidth = i, this.options.viewPort.originalHeight = s;
    const o = this.options.viewPort.left ?? 0, r = this.options.viewPort.top ?? 0;
    this.canvas.viewbox(o, r, i, s), this._setupResizeObserver(), this.nodes = new Qc(this), this.invoker = new nh(this), this.applyContainerStyle(), this.setupSelectionHandling(), this.options.viewPort?.showCoordinates && this.setupCoordinateCallbacks(), this.panZoom = new uo(this, this.options.panZoom), this.birdsEye = new fo(this, this.options.birdsEye), this.options.birdsEye?.enabled && (this._birdsEyeTimeoutId = setTimeout(() => {
      this._destroyed || this.birdsEye.enable();
    }, 200)), this.undoRedo = new po(this, {
      enabled: this.options.showUndoRedo !== !1
    }), this.undoRedo.snap?.(!0), this.multiSelection = new go(this, {
      enabled: this.options.showMultiSelect !== !1
    }), this.grid = new mo(this, {
      enabled: this.options.viewPort?.showGrid || !1,
      gridSize: this.options.viewPort?.gridSize || 20,
      // Re-apply the persisted snap-to-grid setting so it survives reload.
      snapToGrid: this.options.viewPort?.snapToGrid || !1
    }), this.options.viewPort?.showGrid && this.grid.show(), this.keyboard = new yo(this), this.options.enabled !== !1 && this.keyboard.bindGlobal(), this.contextMenu = new bo(this), this.options.enabled !== !1 && this.contextMenu.enable(), this.collab = new wo(this), this.zoomSlider = new To(this, {
      enabled: this.options.showZoom || !1
    }), this.presentation = new Ao(this), this.makeResponsive(), this.options.viewPort?.showCoordinates && (this._coordDisplayTimeoutId = setTimeout(() => {
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
    t && t.remove(), this.canvas.off("click"), this._windowPointerDownHandler && (window.removeEventListener("pointerdown", this._windowPointerDownHandler, !0), this._windowPointerDownHandler = null), this._lastPointerDown = null, this.panZoom && this.panZoom.destroy(), this.birdsEye && this.birdsEye.disable(), this.zoomSlider && this.zoomSlider.destroy(), this.keyboard && this.keyboard.unbindGlobal(), this.contextMenu && this.contextMenu.disable(), this.multiSelection && this.multiSelection.disable(), this.undoRedo && this.undoRedo.clear(), this.collab && this.collab.disconnect(), this.presentation && this.presentation.stop(), this.grid && this.grid.hide(), this.nodes && this.nodes.clear(), this.canvas && this.canvas.remove(), this._liveRegion && (this._liveRegion.remove(), this._liveRegion = null);
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
    this._applyingRemote || this._destroyed || (typeof this.collab?.send == "function" ? this.collab.send({ type: t, data: e }) : this.emitSlateChange(t, e), this.recordUndoFor(t));
  }
  /** Record a debounced undo checkpoint for a document-mutating package. */
  recordUndoFor(t) {
    this.undoRedo && !We.NON_UNDOABLE.has(t) && this.undoRedo.snap?.();
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
      nodeOptions: j(e.options)
    }), e;
  }
  /** Remove a node by ID. */
  removeNode(t) {
    const e = this.nodes.one(t), i = e?.options?.text || "(unnamed)", s = !!e?.options?.isComment;
    if (e && this.selectedNodes.some((r) => r.id === t)) {
      try {
        e.resizeRotate?.disable();
      } catch {
      }
      this.selectedNodes = this.selectedNodes.filter((r) => r.id !== t);
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
        const p = f.options.x ?? 0, g = f.options.y ?? 0, y = f.options.width ?? 0, m = f.options.height ?? 0;
        c = Math.min(c, p - 10), h = Math.min(h, g - 10), d = Math.max(d, p + y + 10), u = Math.max(u, g + m + 10);
      }), o = Math.abs(c), r = Math.abs(h), i = d - c, s = u - h, s > i && (a = "portrait");
    }
    return { orientation: a, width: i, height: s, left: o, top: r };
  }
  // Selection Management
  setupSelectionHandling() {
    const t = (e) => {
      const i = e.target;
      this._lastPointerDown = {
        x: e.clientX,
        y: e.clientY,
        onCanvas: !!i && (i === this.canvas.node || i.tagName?.toLowerCase() === "svg"),
        time: Date.now()
      };
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
      t.map((s) => s.id),
      "addToSelection:",
      e
    ), this.clearLineCog(), t.length === 1) {
      const s = this.getGroupIdOf(t[0]);
      if (this.enteredGroupId && s !== this.enteredGroupId && (this.enteredGroupId = null), s && s !== this.enteredGroupId) {
        const o = this.getGroupMembers(s);
        o.length > 1 && (t = o);
      }
    }
    e || this.clearSelection(), t.forEach((s) => {
      this.selectedNodes.includes(s) || (this.selectedNodes.push(s), s.onSelected());
    }), this.updateSelectionResizeRotate();
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
        const i = t.x + t.width / 2, s = t.y + t.height / 2, r = t.y - 28;
        e.line(i, t.y, i, r).stroke({ color: "#4a90e2", width: 1 }).attr("pointer-events", "none");
        const a = e.circle(14).center(i, r).fill("#ffffff").stroke({ color: "#4a90e2", width: 2 }), l = (y) => {
          const m = a.node;
          m?.style && (m.style.cursor = y);
        };
        l("grab"), a.attr("pointer-events", "all");
        let c = !1, h = 0, d = { x: 0, y: 0 }, u = [];
        const f = () => {
          const y = e.node.getScreenCTM();
          return y ? { x: y.a * i + y.c * s + y.e, y: y.b * i + y.d * s + y.f } : { x: 0, y: 0 };
        }, p = (y) => {
          if (!c) return;
          let b = (Math.atan2(y.clientY - d.y, y.clientX - d.x) - h) * 180 / Math.PI;
          y.shiftKey && (b = Math.round(b / 15) * 15);
          const v = b * Math.PI / 180, x = Math.cos(v), _ = Math.sin(v);
          u.forEach((w) => {
            const E = w.cx - i, C = w.cy - s, S = i + E * x - C * _, T = s + E * _ + C * x, k = w.node.options.width || 0, O = w.node.options.height || 0, D = w.node.options.rotate = w.node.options.rotate || {};
            D.rotationAngle = w.angle + b, w.node.position(S - k / 2, T - O / 2);
          });
        }, g = () => {
          c && (c = !1, l("grab"), window.removeEventListener("pointermove", p), window.removeEventListener("pointerup", g), this.broadcast("onNodesMove", {
            nodeOptions: this.selectedNodes.map((y) => j(y.options))
          }), this.updateSelectionResizeRotate());
        };
        a.on("pointerdown", (y) => {
          y.preventDefault?.(), y.stopPropagation?.(), c = !0, d = f(), h = Math.atan2(y.clientY - d.y, y.clientX - d.x), u = this.selectedNodes.map((m) => ({
            node: m,
            cx: (m.options.x || 0) + (m.options.width || 0) / 2,
            cy: (m.options.y || 0) + (m.options.height || 0) / 2,
            angle: m.options.rotate?.rotationAngle || 0
          })), l("grabbing"), window.addEventListener("pointermove", p), window.addEventListener("pointerup", g);
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
    const l = i + o / 2, c = s + r / 2, h = a * Math.PI / 180, d = Math.cos(h), u = Math.sin(h);
    let f = 1 / 0, p = 1 / 0, g = -1 / 0, y = -1 / 0;
    const m = [
      [i, s],
      [i + o, s],
      [i + o, s + r],
      [i, s + r]
    ];
    for (const [b, v] of m) {
      const x = b - l, _ = v - c, w = l + x * d - _ * u, E = c + x * u + _ * d;
      f = Math.min(f, w), p = Math.min(p, E), g = Math.max(g, w), y = Math.max(y, E);
    }
    return { minX: f, minY: p, maxX: g, maxY: y };
  }
  alignNodes(t, e) {
    const i = e || this.getSelectedNodes();
    if (!i || i.length < 2) return;
    const s = i.map((d) => {
      const u = this.rotatedBounds(d);
      return {
        n: d,
        minX: u.minX,
        maxX: u.maxX,
        minY: u.minY,
        maxY: u.maxY,
        cx: (u.minX + u.maxX) / 2,
        cy: (u.minY + u.maxY) / 2,
        ox: d.options.x || 0,
        oy: d.options.y || 0
      };
    }), o = Math.min(...s.map((d) => d.minX)), r = Math.max(...s.map((d) => d.maxX)), a = Math.min(...s.map((d) => d.minY)), l = Math.max(...s.map((d) => d.maxY)), c = (o + r) / 2, h = (a + l) / 2;
    for (const d of s) {
      let u = d.ox, f = d.oy;
      switch (t) {
        case "left":
          u = d.ox + (o - d.minX);
          break;
        case "right":
          u = d.ox + (r - d.maxX);
          break;
        case "centerH":
          u = d.ox + (c - d.cx);
          break;
        case "top":
          f = d.oy + (a - d.minY);
          break;
        case "bottom":
          f = d.oy + (l - d.maxY);
          break;
        case "middle":
          f = d.oy + (h - d.cy);
          break;
        default:
          return;
      }
      d.n.position(u, f);
    }
    this.broadcast("onNodesMove", {
      nodeOptions: i.map((d) => j(d.options))
    }), this.updateSelectionResizeRotate();
  }
  /**
   * Evenly distribute the selected (or given) nodes along an axis so the gaps
   * between them are equal; the outermost two stay put. axis: horizontal |
   * vertical. Broadcasts onNodesMove. No-op for < 3 nodes.
   */
  distributeNodes(t, e) {
    const i = e || this.getSelectedNodes();
    if (!i || i.length < 3) return;
    const s = i.map((o) => {
      const r = this.rotatedBounds(o);
      return {
        n: o,
        minX: r.minX,
        maxX: r.maxX,
        minY: r.minY,
        maxY: r.maxY,
        w: r.maxX - r.minX,
        h: r.maxY - r.minY,
        ox: o.options.x || 0,
        oy: o.options.y || 0
      };
    });
    if (t === "horizontal") {
      s.sort((h, d) => h.minX - d.minX);
      const o = s[0].minX, r = s[s.length - 1].maxX, a = s.reduce((h, d) => h + d.w, 0), l = (r - o - a) / (s.length - 1);
      let c = o;
      for (const h of s)
        h.n.position(h.ox + (c - h.minX), h.oy), c += h.w + l;
    } else if (t === "vertical") {
      s.sort((h, d) => h.minY - d.minY);
      const o = s[0].minY, r = s[s.length - 1].maxY, a = s.reduce((h, d) => h + d.h, 0), l = (r - o - a) / (s.length - 1);
      let c = o;
      for (const h of s)
        h.n.position(h.ox, h.oy + (c - h.minY)), c += h.h + l;
    } else
      return;
    this.broadcast("onNodesMove", {
      nodeOptions: i.map((o) => j(o.options))
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
    const e = (t || this.getSelectedNodes()).slice();
    if (e.length < 2) return null;
    const i = "grp-" + It(8);
    return e.forEach((s) => {
      s.options.groupId = i;
    }), this.enteredGroupId = null, this.broadcast("onNodesMove", {
      nodeOptions: e.map((s) => j(s.options))
    }), this.selectNodes(e), i;
  }
  /**
   * Ungroup: dissolve every group represented in the selected (or given) nodes by
   * clearing each member's groupId. Persists and keeps the nodes multi-selected.
   */
  ungroupNodes(t) {
    const e = t || this.getSelectedNodes(), i = /* @__PURE__ */ new Set();
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
        ...j(o.options),
        groupId: null
      }))
    }), this.selectNodes(s);
  }
  /**
   * Lock the selected (or given) nodes — and, for any grouped node, its whole
   * group — disabling drag/resize. Persists via onNodesMove.
   */
  lockNodes(t) {
    const e = this.expandToGroups(t || this.getSelectedNodes());
    e.length && (e.forEach((i) => i.lock()), this.broadcast("onNodesMove", {
      nodeOptions: e.map((i) => j(i.options))
    }), this.updateSelectionResizeRotate());
  }
  /** Unlock the selected (or given) nodes and their groups. */
  unlockNodes(t) {
    const e = this.expandToGroups(t || this.getSelectedNodes());
    e.length && (e.forEach((i) => i.unlock()), this.broadcast("onNodesMove", {
      nodeOptions: e.map((i) => j(i.options))
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
  // ─── Serialization API ──────────────────────────────────────────────
  /**
   * Export the slate to a JSON string in v1-compatible format.
   *
   * @param nodes - Optional subset of nodes to include
   * @param asPresentation - If true, includes presentation ordering
   * @returns JSON string
   */
  exportJSON(t, e) {
    const i = cn(this, t, e);
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
    await hn(t, this, e, i), this.undoRedo?.clear?.(), this.undoRedo?.snap?.(!0);
  }
  /**
   * Take a snapshot of the current slate state.
   * Used by undo/redo system.
   *
   * @returns SlateJSON object (not stringified)
   */
  snapshot() {
    return ho(this);
  }
  // ─── Export API ─────────────────────────────────────────────────
  /**
   * Export the slate as an SVG string.
   */
  svg(t, e) {
    return mi(this, t, e);
  }
  /**
   * Export the slate as a PNG (async).
   */
  async png(t, e) {
    return vo(this, t, e);
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
    xo(this, t, e, i);
  }
  // ─── Layout API ─────────────────────────────────────────────────
  /** Remove overlapping nodes by pushing them apart */
  removeLayoutOverlaps(t, e) {
    Co(this, t, e);
  }
  /** Apply pre-computed layout moves */
  applyLayout(t, e, i) {
    Eo(this, t, e, i);
  }
  /** Package current node positions for layout transfer */
  packageLayout() {
    return So(this);
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
    await qs(this);
  }
};
We.NON_UNDOABLE = /* @__PURE__ */ new Set([
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
let Te = We;
function lh(n, t) {
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
function ch(n, t) {
  const e = n.nodes.one(t);
  return !e || !e.options.isComment ? !1 : n.removeNode(t);
}
function hh(n) {
  return n.nodes.allNodes.filter(
    (t) => t.options.isComment === !0
  );
}
const dh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createComment: lh,
  getComments: hh,
  removeComment: ch
}, Symbol.toStringTag, { value: "Module" })), Hn = [
  "rectangle",
  "roundedrectangle",
  "ellipse",
  "circle",
  "star",
  "triangle",
  "pentagon",
  "hexagon",
  "octagon",
  "trapezium",
  "parallelogram",
  "rarrow",
  "larrow",
  "diamond"
], uh = [
  "add_nodes",
  "update_nodes",
  "delete_nodes",
  "connect_nodes",
  "disconnect_nodes",
  "update_connections",
  "arrange_nodes",
  "update_slate"
], fh = /* @__PURE__ */ new Set([
  "text",
  "shape",
  "x",
  "y",
  "width",
  "height",
  "rotationAngle",
  "backgroundColor",
  "foregroundColor",
  "borderColor",
  "borderWidth",
  "borderOpacity",
  "borderStyle",
  "opacity",
  "fontFamily",
  "fontSize",
  "textXAlign",
  "textYAlign",
  "animation",
  "locked"
]), ph = /* @__PURE__ */ new Set(["name", "description", "background"]), Di = /* @__PURE__ */ new Set([
  "label",
  "lineColor",
  "lineWidth",
  "lineOpacity",
  "lineType",
  "lineCurveType",
  "lineCurviness",
  "showParentArrow",
  "showChildArrow"
]), gh = /* @__PURE__ */ new Set([
  "backgroundColor",
  "foregroundColor",
  "borderColor",
  "borderWidth",
  "borderOpacity",
  "borderStyle",
  "opacity",
  "fontFamily",
  "fontSize"
]), mh = /\b(theme|background|canvas|palette|gradient|recolor|colour|color scheme)\b/i, yh = /\b(clear|replace|reset|start over|delete all|remove all)\b/i;
function Qt(n) {
  return !!n && typeof n == "object" && !Array.isArray(n);
}
function Ht(n) {
  return !!(n && ((n.ids?.some(Boolean) ?? !1) || n.text?.trim()));
}
function me(n, t) {
  return Qt(n) ? Object.keys(n).filter((e) => !t.has(e)) : [];
}
function Ft(n, t, e, i) {
  !t.size || !n?.ids || n.ids.some((s) => !t.has(s)) && i.push(`${e} references nodes that are not in the slate.`);
}
function Fn(n, t, e, i, { nullable: s = !1 } = {}) {
  n?.[t] !== void 0 && (s && n[t] === null || typeof n[t] != "string" && i.push(`${e} ${t} must be a string.`));
}
function xt(n, t, e, i, { min: s = -1e6, max: o = 1e6 } = {}) {
  n?.[t] !== void 0 && (!Number.isFinite(n[t]) || n[t] < s || n[t] > o) && i.push(`${e} ${t} must be a number from ${s} to ${o}.`);
}
function Un(n, t, e, i) {
  n?.[t] !== void 0 && typeof n[t] != "boolean" && i.push(`${e} ${t} must be true or false.`);
}
function Ze(n, t, e, i, s) {
  n?.[t] !== void 0 && !e.includes(n[t]) && s.push(`${i} ${t} must be one of: ${e.join(", ")}.`);
}
function zi(n, t, e) {
  for (const i of [
    "text",
    "backgroundColor",
    "foregroundColor",
    "borderColor",
    "borderStyle",
    "fontFamily"
  ])
    Fn(n, i, t, e);
  Fn(n, "animation", t, e, { nullable: !0 });
  for (const i of ["x", "y", "rotationAngle"])
    xt(n, i, t, e);
  for (const i of ["width", "height"])
    xt(n, i, t, e, { min: 20, max: 5e3 });
  xt(n, "borderWidth", t, e, { min: 0, max: 100 }), xt(n, "borderOpacity", t, e, { min: 0, max: 1 }), xt(n, "opacity", t, e, { min: 0, max: 1 }), xt(n, "fontSize", t, e, { min: 1, max: 500 }), Ze(
    n,
    "textXAlign",
    ["left", "middle", "right"],
    t,
    e
  ), Ze(
    n,
    "textYAlign",
    ["top", "middle", "bottom"],
    t,
    e
  ), Un(n, "locked", t, e);
}
function Li(n, t, e) {
  for (const i of ["label", "lineColor"])
    Fn(n, i, t, e);
  xt(n, "lineWidth", t, e, { min: 0.1, max: 100 }), xt(n, "lineOpacity", t, e, { min: 0, max: 1 }), xt(n, "lineCurviness", t, e, { min: 0, max: 1 }), Ze(
    n,
    "lineType",
    ["bezier", "orthogonal", "straight", "linear", "curved"],
    t,
    e
  ), Ze(
    n,
    "lineCurveType",
    ["cubic", "quadratic"],
    t,
    e
  ), Un(n, "showParentArrow", t, e), Un(n, "showChildArrow", t, e);
}
function Mo(n, {
  userMessage: t = "",
  existingNodeIds: e = [],
  existingConnectionIds: i = []
} = {}) {
  const s = [];
  if (!Qt(n))
    return { valid: !1, errors: ["The operation plan must be an object."] };
  (typeof n.message != "string" || !n.message.trim()) && s.push("A natural completion message is required."), !Array.isArray(n.operations) || n.operations.length === 0 ? s.push("At least one slate operation is required.") : n.operations.length > 50 && s.push("A plan cannot contain more than 50 operations.");
  const o = new Set(e.filter(Boolean)), r = new Set(i.filter(Boolean));
  return (n.operations || []).forEach((a, l) => {
    const c = `Operation ${l + 1}`;
    if (!Qt(a) || !uh.includes(a.kind)) {
      s.push(`${c} has an unsupported kind.`);
      return;
    }
    if (a.kind === "add_nodes") {
      (!Number.isInteger(a.count) || a.count < 1 || a.count > 20) && s.push(`${c} count must be an integer from 1 to 20.`), Hn.includes(a.shape) || s.push(`${c} must use a supported shape.`), a.placement?.relativeTo && o.size && !o.has(a.placement.relativeTo) && s.push(`${c} references a node that is not in the slate.`);
      const h = me(a.style, gh);
      h.length && s.push(
        `${c} contains unsupported node styles: ${h.join(", ")}.`
      ), zi(a.style, c, s);
      return;
    }
    if (a.kind === "update_nodes") {
      Ht(a.target) || s.push(`${c} requires a node target.`);
      const h = me(a.changes, fh);
      !Qt(a.changes) || !Object.keys(a.changes).length ? s.push(`${c} requires at least one node change.`) : h.length && s.push(
        `${c} contains unsupported changes: ${h.join(", ")}.`
      ), a.changes?.shape && !Hn.includes(
        a.changes.shape
      ) && s.push(`${c} contains an unsupported shape.`), zi(a.changes, c, s), Ft(a.target, o, c, s);
      return;
    }
    if (a.kind === "delete_nodes") {
      Ht(a.target) || s.push(`${c} requires a node target.`), !yh.test(t) && a.target?.text === "*" && s.push(
        `${c} cannot delete every node without an explicit request.`
      ), Ft(a.target, o, c, s);
      return;
    }
    if (["connect_nodes", "disconnect_nodes"].includes(a.kind)) {
      if ((!Ht(a.from) || !Ht(a.to)) && s.push(`${c} requires both from and to node selectors.`), Ft(a.from, o, c, s), Ft(a.to, o, c, s), a.kind === "connect_nodes") {
        const h = me(
          a.style,
          Di
        );
        h.length && s.push(
          `${c} contains unsupported connection styles: ${h.join(", ")}.`
        ), Li(a.style, c, s);
      }
      return;
    }
    if (a.kind === "update_connections") {
      const h = a.connectionIds?.some(Boolean) ?? !1, d = Ht(a.from) && Ht(a.to);
      !h && !d && s.push(
        `${c} requires connectionIds or both from and to node selectors.`
      ), h && r.size && a.connectionIds.some((f) => !r.has(f)) && s.push(
        `${c} references connections that are not in the slate.`
      );
      const u = me(a.changes, Di);
      !Qt(a.changes) || !Object.keys(a.changes).length ? s.push(`${c} requires at least one connection change.`) : u.length && s.push(
        `${c} contains unsupported connection changes: ${u.join(", ")}.`
      ), Li(a.changes, c, s), Ft(a.from, o, c, s), Ft(a.to, o, c, s);
      return;
    }
    if (a.kind === "arrange_nodes") {
      Ht(a.target) || s.push(`${c} requires a node target.`), (!a.layout || !["row", "column", "grid", "circle"].includes(a.layout)) && s.push(`${c} requires a supported layout.`), Ft(a.target, o, c, s);
      return;
    }
    if (a.kind === "update_slate") {
      const h = me(a.changes, ph);
      !Qt(a.changes) || !Object.keys(a.changes).length ? s.push(`${c} requires at least one slate change.`) : h.length && s.push(
        `${c} contains unsupported slate changes: ${h.join(", ")}.`
      ), a.changes?.background && !mh.test(t) && s.push(
        `${c} cannot change the canvas background unless the user explicitly asks for it.`
      );
    }
  }), { valid: s.length === 0, errors: s };
}
function N(n, t, e = 0) {
  if (n?.options?.[t] !== void 0) return n.options[t];
  const i = { x: "xPos", y: "yPos" };
  return i[t] && n?.options?.[i[t]] !== void 0 ? n.options[i[t]] : e;
}
function wn(n) {
  return `${n || ""}`.replace(/\s+/g, " ").trim().toLowerCase();
}
function ce(n) {
  return n?.nodes?.allNodes || [];
}
function yi(n) {
  const t = /* @__PURE__ */ new Set(), e = [];
  return ce(n).forEach((i) => {
    const s = i?.relationships?.associations || i?.relationships?.getAssociations?.() || [];
    Array.from(s).forEach((o) => {
      const r = o?.id;
      !r || t.has(r) || (t.add(r), e.push({ source: i, association: o }));
    });
  }), e;
}
function bh(n, t) {
  const e = new Set(
    (t.connectionIds || []).filter(Boolean)
  ), i = yi(n);
  if (e.size)
    return i.filter(
      ({ association: r }) => e.has(r.id)
    );
  const s = new Set(
    kt(n, t.from).map(
      (r) => N(r, "id", r.id)
    )
  ), o = new Set(
    kt(n, t.to).map((r) => N(r, "id", r.id))
  );
  return i.filter(({ source: r, association: a }) => {
    const l = a.parentId || N(r, "id", r.id);
    return s.has(l) && o.has(a.childId);
  });
}
function kt(n, t = {}) {
  const e = ce(n), i = new Set((t.ids || []).filter(Boolean));
  if (i.size)
    return e.filter((r) => i.has(N(r, "id", r.id)));
  const s = wn(t.text), o = e.filter(
    (r) => wn(N(r, "text", "")) === s
  );
  return o.length ? o : s ? e.filter((r) => wn(N(r, "text", "")).includes(s)) : [];
}
function ko(n, t) {
  if (t) {
    const e = n?.nodes?.one?.(t);
    if (e) return e;
    const i = kt(n, { text: t })[0];
    if (i) return i;
  }
  return [...ce(n)].sort(
    (e, i) => N(i, "x") + N(i, "width") - (N(e, "x") + N(e, "width"))
  )[0];
}
function vh(n, t, e) {
  return n.x < t.x + t.width + e && n.x + n.width + e > t.x && n.y < t.y + t.height + e && n.y + n.height + e > t.y;
}
function wh(n, t, e, i, s, o) {
  let r = n;
  for (let a = 0; a <= t.length; a += 1) {
    const l = t.filter(
      (d) => r.some(
        (u) => vh({ ...u, width: e, height: i }, d, o)
      )
    );
    if (!l.length) return r;
    let c = 0, h = 0;
    if (s === "left") {
      const d = Math.max(...r.map((f) => f.x + e));
      c = Math.min(
        ...l.map((f) => f.x - o)
      ) - d;
    } else if (s === "above") {
      const d = Math.max(...r.map((f) => f.y + i));
      h = Math.min(
        ...l.map((f) => f.y - o)
      ) - d;
    } else if (s === "below" || s === "center") {
      const d = Math.min(...r.map((f) => f.y));
      h = Math.max(
        ...l.map((f) => f.y + f.height + o)
      ) - d;
    } else {
      const d = Math.min(...r.map((f) => f.x));
      c = Math.max(
        ...l.map((f) => f.x + f.width + o)
      ) - d;
    }
    r = r.map((d) => ({ x: d.x + c, y: d.y + h }));
  }
  return r;
}
function xh(n, t, e, i) {
  const s = t.count || 1, o = t.placement || {}, r = ko(n, o.relativeTo), a = Number.isFinite(o.gap) ? o.gap : 48, l = o.direction || "right", c = o.arrangement || (["left", "right"].includes(l) ? "column" : "row"), h = c === "grid" ? Math.ceil(Math.sqrt(s)) : s, d = Array.from({ length: s }, (f, p) => {
    const g = c === "column" ? p : c === "grid" ? Math.floor(p / h) : 0, y = c === "column" ? 0 : c === "grid" ? p % h : p;
    let m = N(r, "x") + y * (e + a), b = N(r, "y") + g * (i + a);
    return l === "right" && (m += N(r, "width", 160) + a), l === "left" && (m -= e + a), l === "below" && (b += N(r, "height", 100) + a), l === "above" && (b -= i + a), { x: m, y: b };
  }), u = ce(n).map((f) => ({
    x: Number(N(f, "x")),
    y: Number(N(f, "y")),
    width: Number(N(f, "width", 120)),
    height: Number(N(f, "height", 80))
  }));
  return wh(
    d,
    u,
    e,
    i,
    l,
    a
  );
}
function Ut(n, t) {
  const e = (Array.isArray(t) ? t : [t]).filter(
    Boolean
  );
  e.length && (n.collab.invoke(e), n.collab.send(e));
}
function _h(n) {
  const t = ce(n).slice(0, 150).map((e) => ({
    id: N(e, "id", e.id),
    text: `${N(e, "text", "")}`.replace(/\s+/g, " ").trim().slice(0, 240),
    shape: N(e, "shape", N(e, "vectorPath", "rectangle")),
    x: Number(N(e, "x")),
    y: Number(N(e, "y")),
    width: Number(N(e, "width", 120)),
    height: Number(N(e, "height", 80))
  }));
  return {
    name: n?.options?.name || "",
    description: n?.options?.description || "",
    nodeCount: t.length,
    nodes: t,
    connections: yi(n).slice(0, 250).map(({ source: e, association: i }) => ({
      id: i.id,
      from: i.parentId || N(e, "id", e.id),
      to: i.childId,
      label: i.label || "",
      lineColor: i.lineColor,
      lineWidth: i.lineWidth,
      lineOpacity: i.lineOpacity,
      lineType: i.lineType,
      lineCurveType: i.lineCurveType,
      lineCurviness: i.lineCurviness,
      showParentArrow: i.showParentArrow,
      showChildArrow: i.showChildArrow
    }))
  };
}
function Ch(n, t, { userMessage: e = "" } = {}) {
  const i = Mo(t, {
    userMessage: e,
    existingNodeIds: ce(n).map((o) => N(o, "id", o.id)),
    existingConnectionIds: yi(n).map(
      ({ association: o }) => o.id
    )
  });
  if (!i.valid) throw new Error(i.errors.join(" "));
  const s = {
    created: [],
    updated: [],
    deleted: [],
    connected: [],
    disconnected: [],
    connectionsUpdated: []
  };
  return t.operations.forEach((o) => {
    if (o.kind === "add_nodes") {
      const r = o.shape, a = Number(o.width) || (r === "triangle" ? 150 : 180), l = Number(o.height) || (r === "triangle" ? 130 : 110), c = ko(n, o.placement?.relativeTo), h = o.style?.backgroundColor || N(c, "backgroundColor", "#7aa2c8");
      xh(n, o, a, l).forEach(({ x: d, y: u }, f) => {
        const p = o.ids?.[f] || It(12);
        if (n.nodes.one(p)) return;
        const g = o.text ? o.count > 1 ? o.text.replace(/\{n\}/g, `${f + 1}`) : o.text : "";
        Ut(n, {
          type: "onNodeAdded",
          data: {
            nodeOptions: {
              id: p,
              name: p,
              text: g,
              shape: r,
              vectorPath: r,
              shapeHint: r,
              defaultShaped: !0,
              xPos: d,
              yPos: u,
              width: a,
              height: l,
              backgroundColor: h,
              foregroundColor: o.style?.foregroundColor || rn(h),
              borderColor: o.style?.borderColor || "#333333",
              borderWidth: o.style?.borderWidth ?? 1,
              borderOpacity: o.style?.borderOpacity ?? 1,
              borderStyle: o.style?.borderStyle || "solid",
              opacity: o.style?.opacity ?? 1,
              fontFamily: o.style?.fontFamily || "Manrope",
              fontSize: o.style?.fontSize || 20,
              textXAlign: "middle",
              textYAlign: "middle",
              filters: { vect: null, text: null },
              animations: { vect: null, text: null }
            }
          }
        }), s.created.push(p);
      });
      return;
    }
    if (o.kind === "update_nodes") {
      kt(n, o.target).forEach((r) => {
        const a = N(r, "id", r.id), l = o.changes, c = [];
        (l.text !== void 0 || l.fontFamily !== void 0 || l.fontSize !== void 0 || l.foregroundColor !== void 0 || l.textXAlign !== void 0 || l.textYAlign !== void 0) && c.push({
          type: "onNodeTextChanged",
          data: {
            id: a,
            text: l.text,
            fontFamily: l.fontFamily,
            fontSize: l.fontSize,
            fontColor: l.foregroundColor,
            textXAlign: l.textXAlign,
            textYAlign: l.textYAlign
          }
        }), l.shape && c.push({
          type: "onNodeShapeChanged",
          data: { id: a, shape: l.shape, vectorPath: l.shape }
        }), (l.backgroundColor !== void 0 || l.opacity !== void 0 || l.borderColor !== void 0) && c.push({
          type: "onNodeColorChanged",
          data: {
            id: a,
            color: l.backgroundColor,
            opacity: l.opacity,
            borderColor: l.borderColor
          }
        }), ["borderColor", "borderWidth", "borderOpacity", "borderStyle"].forEach(
          (h) => {
            l[h] !== void 0 && c.push({
              type: "onNodeBorderPropertiesChanged",
              data: { id: a, prop: h, val: l[h] }
            });
          }
        ), (l.width !== void 0 || l.height !== void 0) && c.push({
          type: "onNodeResized",
          data: {
            id: a,
            width: l.width ?? N(r, "width"),
            height: l.height ?? N(r, "height")
          }
        }), (l.x !== void 0 || l.y !== void 0) && c.push({
          type: "onNodesMove",
          data: {
            dur: 350,
            moves: [
              {
                id: a,
                x: l.x ?? N(r, "x"),
                y: l.y ?? N(r, "y")
              }
            ]
          }
        }), l.rotationAngle !== void 0 && c.push({
          type: "onNodeRotated",
          data: { id: a, rotationAngle: l.rotationAngle }
        }), l.locked !== void 0 && c.push({
          type: l.locked ? "onNodeLocked" : "onNodeUnlocked",
          data: { id: a }
        }), l.animation !== void 0 && c.push({
          type: "onNodeEffectChanged",
          data: {
            id: a,
            filter: {
              apply: "vect",
              id: l.animation,
              isAnimation: !0
            }
          }
        }), Ut(n, c), s.updated.push(a);
      });
      return;
    }
    if (o.kind === "delete_nodes") {
      kt(n, o.target).forEach((r) => {
        const a = N(r, "id", r.id);
        Ut(n, { type: "onNodeDeleted", data: { id: a } }), s.deleted.push(a);
      });
      return;
    }
    if (["connect_nodes", "disconnect_nodes"].includes(o.kind)) {
      kt(n, o.from).forEach((r) => {
        kt(n, o.to).forEach((a) => {
          const l = N(r, "id", r.id), c = N(a, "id", a.id);
          if (l === c) return;
          const h = `${l}->${c}`;
          Ut(n, {
            type: o.kind === "connect_nodes" ? "addRelationship" : "removeRelationship",
            data: {
              id: h,
              parentId: l,
              childId: c,
              lineColor: o.style?.lineColor || "#333333",
              lineWidth: o.style?.lineWidth || 3,
              lineType: o.style?.lineType || "bezier",
              ...o.style || {}
            }
          }), s[o.kind === "connect_nodes" ? "connected" : "disconnected"].push(h);
        });
      });
      return;
    }
    if (o.kind === "update_connections") {
      bh(n, o).forEach(({ source: r, association: a }) => {
        const l = a.parentId || N(r, "id", r.id), c = Object.entries(o.changes || {}).map(
          ([h, d]) => ({
            type: "onLinePropertiesChanged",
            data: {
              id: l,
              associationId: a.id,
              prop: h,
              val: d
            }
          })
        );
        Ut(n, c), s.connectionsUpdated.push(a.id);
      });
      return;
    }
    if (o.kind === "arrange_nodes") {
      const r = kt(n, o.target);
      if (!r.length) return;
      const a = Math.min(...r.map((p) => N(p, "x"))), l = Math.min(...r.map((p) => N(p, "y"))), c = Math.max(
        ...r.map((p) => N(p, "width", 120))
      ), h = Math.max(
        ...r.map((p) => N(p, "height", 80))
      ), d = o.gap ?? 48, u = o.layout === "grid" ? Math.ceil(Math.sqrt(r.length)) : r.length, f = r.map((p, g) => {
        if (o.layout === "circle") {
          const b = Math.max(180, r.length * 35), v = Math.PI * 2 * g / r.length;
          return {
            id: N(p, "id", p.id),
            x: a + b + Math.cos(v) * b,
            y: l + b + Math.sin(v) * b
          };
        }
        const y = o.layout === "column" ? g : Math.floor(g / u), m = o.layout === "row" ? g : g % u;
        return {
          id: N(p, "id", p.id),
          x: a + m * (c + d),
          y: l + y * (h + d)
        };
      });
      Ut(n, { type: "onNodesMove", data: { dur: 450, moves: f } }), s.updated.push(...r.map((p) => N(p, "id", p.id)));
      return;
    }
    if (o.kind === "update_slate") {
      const r = [];
      o.changes?.name !== void 0 && r.push({
        type: "onSlateNameChanged",
        data: { name: o.changes.name }
      }), o.changes?.description !== void 0 && r.push({
        type: "onSlateDescriptionChanged",
        data: { description: o.changes.description }
      }), o.changes?.background !== void 0 && r.push({
        type: "onSlateBackgroundColorChanged",
        data: o.changes.background
      }), Ut(n, r);
    }
  }), { message: t.message.trim(), report: s };
}
const Ih = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SUPPORTED_SLATE_OPERATION_SHAPES: Hn,
  applySlateOperations: Ch,
  summarizeSlateForOperations: _h,
  validateSlateOperationPlan: Mo
}, Symbol.toStringTag, { value: "Module" }));
class $t {
  constructor(t = {}) {
    this.optionState = { id: It(), ...t }, this.options = new Proxy(this.optionState, {
      get: (e, i, s) => {
        if (typeof i != "string" || !this.v2)
          return Reflect.get(e, i, s);
        const o = j(this.v2.options || {});
        return Object.prototype.hasOwnProperty.call(o, i) ? o[i] : Reflect.get(e, i, s);
      },
      set: (e, i, s, o) => {
        const r = Reflect.set(e, i, s, o);
        return r && typeof i == "string" && this.v2 && Object.assign(this.v2.options, Wt({ [i]: s })), r;
      },
      deleteProperty: (e, i) => {
        const s = Reflect.deleteProperty(e, i);
        if (s && typeof i == "string" && this.v2) {
          const o = {
            xPos: "x",
            yPos: "y",
            foregroundColor: "fontColor",
            shapeHint: "shape",
            svgString: "svgContent"
          }[i] || i;
          delete this.v2.options[o];
        }
        return s;
      },
      ownKeys: (e) => {
        if (!this.v2) return Reflect.ownKeys(e);
        const i = Reflect.ownKeys(j(this.v2.options || {}));
        return Array.from(/* @__PURE__ */ new Set([...Reflect.ownKeys(e), ...i]));
      },
      getOwnPropertyDescriptor: (e, i) => {
        const s = Reflect.getOwnPropertyDescriptor(e, i);
        if (s || !this.v2 || typeof i != "string")
          return s;
        const o = j(this.v2.options || {});
        if (Object.prototype.hasOwnProperty.call(o, i))
          return { configurable: !0, enumerable: !0, writable: !0 };
      }
    }), this.resize = new Eh(this), this.relationships = new Sh(this);
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
class Eh {
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
class Sh {
  constructor(t) {
    this.owner = t;
  }
  /** v1: `node.relationships.addAssociation(childNode, data?)` */
  addAssociation(t, e) {
    if (!this.owner.v2)
      throw new Error(
        "SLATEBOX_COMPAT: add the node to a slate before creating associations"
      );
    const i = t instanceof $t ? t.v2 : t;
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
class Th {
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
    const e = t instanceof $t ? t : new $t(t), i = Wt(e.options), s = this.v2Slate.addNode(i);
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
      const a = r.options || {}, l = j(a);
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
    const e = this.v2Slate, i = new Map((t.moves || []).map((o) => [o.id, o])), s = t.nodes ? t.nodes.map((o) => o instanceof $t ? o.v2 : o).filter(Boolean) : t.moves ? t.moves.map((o) => e.nodes.one(o.id)).filter(Boolean) : e.nodes.allNodes;
    return {
      dur: t.dur ?? 300,
      easing: t.easing ?? ">",
      textPositions: s.map((o) => ({
        id: o.id,
        textPosition: { x: 0, y: 0, transform: "" }
      })),
      nodeOptions: s.map((o) => {
        const r = i.get(o.id), a = j(o.options || {});
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
    return e || (e = new $t({ ...t.options }), e.options.id = t.id, this.wrappers.set(t.id, e)), e.v2 = t, e.slate = this.owner, e;
  }
}
class Ah {
  constructor(t = {}, e = {}) {
    this.savingTemplateImage = !1, this.options = {
      ...t,
      id: t.id || It()
    }, this.events = e || {}, this._shareId = this.options.shareId || It(), this.nodes = new Th(this), this.controller = {
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
    const t = this.resolveContainer(), e = fi(this.options);
    delete e.container, this.options.shareId === void 0 && (e.shareId = this._shareId), e.events = this.events, this.v2 = new Te(t, e), await this.v2.getViewportAsync(), this.options.viewPort || (this.options.viewPort = {});
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
    const e = this.v2?.options;
    if (e) {
      const i = this.options.viewPort;
      this.options = { ...this.options, ...e }, i && (this.options.viewPort = i);
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
      availableFilters: so(),
      availableAnimations: to()
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
  unwrapNodes(t) {
    if (t)
      return t.map(
        (e) => e instanceof $t ? e.v2 : e
      ).filter((e) => !!e);
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
      throw new Error("SLATEBOX_COMPAT: slate.init() must complete before use");
  }
}
const Mt = class Mt {
  constructor(t) {
    this.registerPlugins(t);
  }
  registerPlugins(t) {
    const e = this.constructor.name, i = Mt.availablePlugins[e];
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
    Mt.availablePlugins[e] || (Mt.availablePlugins[e] = []), Mt.availablePlugins[e] = [...Mt.availablePlugins[e], t];
  }
};
Mt.availablePlugins = {};
let Yn = Mt;
const Mh = {
  slate: Ah,
  node: $t,
  base: Yn,
  utils: Bc
};
function kh(n, t = {}) {
  return new Te(n, t);
}
typeof window < "u" && (window.SlateboxJS = kh, window.Slate = Te, window.Node = ln, window.PanZoom = uo, window.ResizeRotate = Xs, window.BirdsEye = fo, window.Connector = on, window.Serialization = eh, window.ShapeRegistry = jc, window.Relationship = fc, window.Relationships = $s, window.FontLoader = mc, window.Images = js, window.Editor = Zs, window.UndoRedo = po, window.MultiSelection = go, window.Grid = mo, window.Menu = oo, window.Keyboard = yo, window.ContextMenu = bo, window.Filters = io, window.Links = Ws, window.Export = ih, window.Collab = wo, window.Theme = rh, window.Layout = ah, window.ZoomSlider = To, window.Comments = dh, window.Presentation = Ao, window.Slatebox = Object.assign({}, Mh, { compat: Vc }));
export {
  fo as BirdsEye,
  wo as Collab,
  dh as Comments,
  on as Connector,
  bo as ContextMenu,
  Zs as Editor,
  ih as ExportModule,
  io as Filters,
  mc as FontLoader,
  mo as Grid,
  js as Images,
  nh as Invoker,
  yo as Keyboard,
  ah as Layout,
  Ws as Links,
  oo as Menu,
  go as MultiSelection,
  ln as Node,
  Qc as NodesManager,
  uo as PanZoom,
  Ao as Presentation,
  fc as Relationship,
  $s as Relationships,
  Xs as ResizeRotate,
  eh as Serialization,
  jc as ShapeRegistry,
  Te as Slate,
  Ih as SlateOperations,
  Mh as Slatebox,
  kh as SlateboxJS,
  rh as Theme,
  po as UndoRedo,
  To as ZoomSlider,
  Vc as compat,
  kh as default,
  Ph as getFilterNames,
  Rh as registerFilter,
  Bc as utils
};
//# sourceMappingURL=slateboxjs.mjs.map
