var wo = Object.defineProperty;
var _o = (t, e, r) => e in t ? wo(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r;
var M = (t, e, r) => _o(t, typeof e != "symbol" ? e + "" : e, r);
import Z, { createContext as ci, useContext as ke, useState as Zr, useCallback as tr, useEffect as Tr, useRef as Ot, useLayoutEffect as Po, useMemo as Li, Fragment as Vi, createElement as te, cloneElement as ut, Component as So, createRef as $o } from "react";
import { jsx as O, jsxs as W, Fragment as Qr } from "react/jsx-runtime";
import { createPortal as Oo } from "react-dom";
var ea = typeof global == "object" && global && global.Object === Object && global, Mo = typeof self == "object" && self && self.Object === Object && self, Et = ea || Mo || Function("return this")(), Bt = Et.Symbol, ra = Object.prototype, To = ra.hasOwnProperty, Io = ra.toString, je = Bt ? Bt.toStringTag : void 0;
function Ao(t) {
  var e = To.call(t, je), r = t[je];
  try {
    t[je] = void 0;
    var n = !0;
  } catch {
  }
  var i = Io.call(t);
  return n && (e ? t[je] = r : delete t[je]), i;
}
var ko = Object.prototype, Co = ko.toString;
function Ro(t) {
  return Co.call(t);
}
var Eo = "[object Null]", Do = "[object Undefined]", Bi = Bt ? Bt.toStringTag : void 0;
function Ce(t) {
  return t == null ? t === void 0 ? Do : Eo : Bi && Bi in Object(t) ? Ao(t) : Ro(t);
}
function _e(t) {
  return t != null && typeof t == "object";
}
var Fo = "[object Symbol]";
function er(t) {
  return typeof t == "symbol" || _e(t) && Ce(t) == Fo;
}
function No(t, e) {
  for (var r = -1, n = t == null ? 0 : t.length, i = Array(n); ++r < n; )
    i[r] = e(t[r], r, t);
  return i;
}
var kt = Array.isArray, Ui = Bt ? Bt.prototype : void 0, Wi = Ui ? Ui.toString : void 0;
function na(t) {
  if (typeof t == "string")
    return t;
  if (kt(t))
    return No(t, na) + "";
  if (er(t))
    return Wi ? Wi.call(t) : "";
  var e = t + "";
  return e == "0" && 1 / t == -1 / 0 ? "-0" : e;
}
var jo = /\s/;
function zo(t) {
  for (var e = t.length; e-- && jo.test(t.charAt(e)); )
    ;
  return e;
}
var Lo = /^\s+/;
function Vo(t) {
  return t && t.slice(0, zo(t) + 1).replace(Lo, "");
}
function Pe(t) {
  var e = typeof t;
  return t != null && (e == "object" || e == "function");
}
var Xi = NaN, Bo = /^[-+]0x[0-9a-f]+$/i, Uo = /^0b[01]+$/i, Wo = /^0o[0-7]+$/i, Xo = parseInt;
function Yo(t) {
  if (typeof t == "number")
    return t;
  if (er(t))
    return Xi;
  if (Pe(t)) {
    var e = typeof t.valueOf == "function" ? t.valueOf() : t;
    t = Pe(e) ? e + "" : e;
  }
  if (typeof t != "string")
    return t === 0 ? t : +t;
  t = Vo(t);
  var r = Uo.test(t);
  return r || Wo.test(t) ? Xo(t.slice(2), r ? 2 : 8) : Bo.test(t) ? Xi : +t;
}
var Yi = 1 / 0, Ho = 17976931348623157e292;
function Pn(t) {
  if (!t)
    return t === 0 ? t : 0;
  if (t = Yo(t), t === Yi || t === -Yi) {
    var e = t < 0 ? -1 : 1;
    return e * Ho;
  }
  return t === t ? t : 0;
}
function qo(t) {
  return t;
}
var Go = "[object AsyncFunction]", Ko = "[object Function]", Zo = "[object GeneratorFunction]", Qo = "[object Proxy]";
function ia(t) {
  if (!Pe(t))
    return !1;
  var e = Ce(t);
  return e == Ko || e == Zo || e == Go || e == Qo;
}
var Sn = Et["__core-js_shared__"], Hi = function() {
  var t = /[^.]+$/.exec(Sn && Sn.keys && Sn.keys.IE_PROTO || "");
  return t ? "Symbol(src)_1." + t : "";
}();
function Jo(t) {
  return !!Hi && Hi in t;
}
var tl = Function.prototype, el = tl.toString;
function ce(t) {
  if (t != null) {
    try {
      return el.call(t);
    } catch {
    }
    try {
      return t + "";
    } catch {
    }
  }
  return "";
}
var rl = /[\\^$.*+?()[\]{}|]/g, nl = /^\[object .+?Constructor\]$/, il = Function.prototype, sl = Object.prototype, al = il.toString, ol = sl.hasOwnProperty, ll = RegExp(
  "^" + al.call(ol).replace(rl, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function ul(t) {
  if (!Pe(t) || Jo(t))
    return !1;
  var e = ia(t) ? ll : nl;
  return e.test(ce(t));
}
function cl(t, e) {
  return t?.[e];
}
function Re(t, e) {
  var r = cl(t, e);
  return ul(r) ? r : void 0;
}
var jn = Re(Et, "WeakMap"), hl = 9007199254740991, fl = /^(?:0|[1-9]\d*)$/;
function hi(t, e) {
  var r = typeof t;
  return e = e ?? hl, !!e && (r == "number" || r != "symbol" && fl.test(t)) && t > -1 && t % 1 == 0 && t < e;
}
function fi(t, e) {
  return t === e || t !== t && e !== e;
}
var dl = 9007199254740991;
function di(t) {
  return typeof t == "number" && t > -1 && t % 1 == 0 && t <= dl;
}
function sa(t) {
  return t != null && di(t.length) && !ia(t);
}
function pl(t, e, r) {
  if (!Pe(r))
    return !1;
  var n = typeof e;
  return (n == "number" ? sa(r) && hi(e, r.length) : n == "string" && e in r) ? fi(r[e], t) : !1;
}
var gl = Object.prototype;
function yl(t) {
  var e = t && t.constructor, r = typeof e == "function" && e.prototype || gl;
  return t === r;
}
function ml(t, e) {
  for (var r = -1, n = Array(t); ++r < t; )
    n[r] = e(r);
  return n;
}
var bl = "[object Arguments]";
function qi(t) {
  return _e(t) && Ce(t) == bl;
}
var aa = Object.prototype, xl = aa.hasOwnProperty, vl = aa.propertyIsEnumerable, oa = qi(/* @__PURE__ */ function() {
  return arguments;
}()) ? qi : function(t) {
  return _e(t) && xl.call(t, "callee") && !vl.call(t, "callee");
};
function wl() {
  return !1;
}
var la = typeof exports == "object" && exports && !exports.nodeType && exports, Gi = la && typeof module == "object" && module && !module.nodeType && module, _l = Gi && Gi.exports === la, Ki = _l ? Et.Buffer : void 0, Pl = Ki ? Ki.isBuffer : void 0, zn = Pl || wl, Sl = "[object Arguments]", $l = "[object Array]", Ol = "[object Boolean]", Ml = "[object Date]", Tl = "[object Error]", Il = "[object Function]", Al = "[object Map]", kl = "[object Number]", Cl = "[object Object]", Rl = "[object RegExp]", El = "[object Set]", Dl = "[object String]", Fl = "[object WeakMap]", Nl = "[object ArrayBuffer]", jl = "[object DataView]", zl = "[object Float32Array]", Ll = "[object Float64Array]", Vl = "[object Int8Array]", Bl = "[object Int16Array]", Ul = "[object Int32Array]", Wl = "[object Uint8Array]", Xl = "[object Uint8ClampedArray]", Yl = "[object Uint16Array]", Hl = "[object Uint32Array]", H = {};
H[zl] = H[Ll] = H[Vl] = H[Bl] = H[Ul] = H[Wl] = H[Xl] = H[Yl] = H[Hl] = !0;
H[Sl] = H[$l] = H[Nl] = H[Ol] = H[jl] = H[Ml] = H[Tl] = H[Il] = H[Al] = H[kl] = H[Cl] = H[Rl] = H[El] = H[Dl] = H[Fl] = !1;
function ql(t) {
  return _e(t) && di(t.length) && !!H[Ce(t)];
}
function Gl(t) {
  return function(e) {
    return t(e);
  };
}
var ua = typeof exports == "object" && exports && !exports.nodeType && exports, Ve = ua && typeof module == "object" && module && !module.nodeType && module, Kl = Ve && Ve.exports === ua, $n = Kl && ea.process, Zi = function() {
  try {
    var t = Ve && Ve.require && Ve.require("util").types;
    return t || $n && $n.binding && $n.binding("util");
  } catch {
  }
}(), Qi = Zi && Zi.isTypedArray, ca = Qi ? Gl(Qi) : ql, Zl = Object.prototype, Ql = Zl.hasOwnProperty;
function Jl(t, e) {
  var r = kt(t), n = !r && oa(t), i = !r && !n && zn(t), s = !r && !n && !i && ca(t), a = r || n || i || s, o = a ? ml(t.length, String) : [], l = o.length;
  for (var u in t)
    Ql.call(t, u) && !(a && // Safari 9 has enumerable `arguments.length` in strict mode.
    (u == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    i && (u == "offset" || u == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    s && (u == "buffer" || u == "byteLength" || u == "byteOffset") || // Skip index properties.
    hi(u, l))) && o.push(u);
  return o;
}
function tu(t, e) {
  return function(r) {
    return t(e(r));
  };
}
var eu = tu(Object.keys, Object), ru = Object.prototype, nu = ru.hasOwnProperty;
function iu(t) {
  if (!yl(t))
    return eu(t);
  var e = [];
  for (var r in Object(t))
    nu.call(t, r) && r != "constructor" && e.push(r);
  return e;
}
function ha(t) {
  return sa(t) ? Jl(t) : iu(t);
}
var su = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, au = /^\w*$/;
function pi(t, e) {
  if (kt(t))
    return !1;
  var r = typeof t;
  return r == "number" || r == "symbol" || r == "boolean" || t == null || er(t) ? !0 : au.test(t) || !su.test(t) || e != null && t in Object(e);
}
var Ue = Re(Object, "create");
function ou() {
  this.__data__ = Ue ? Ue(null) : {}, this.size = 0;
}
function lu(t) {
  var e = this.has(t) && delete this.__data__[t];
  return this.size -= e ? 1 : 0, e;
}
var uu = "__lodash_hash_undefined__", cu = Object.prototype, hu = cu.hasOwnProperty;
function fu(t) {
  var e = this.__data__;
  if (Ue) {
    var r = e[t];
    return r === uu ? void 0 : r;
  }
  return hu.call(e, t) ? e[t] : void 0;
}
var du = Object.prototype, pu = du.hasOwnProperty;
function gu(t) {
  var e = this.__data__;
  return Ue ? e[t] !== void 0 : pu.call(e, t);
}
var yu = "__lodash_hash_undefined__";
function mu(t, e) {
  var r = this.__data__;
  return this.size += this.has(t) ? 0 : 1, r[t] = Ue && e === void 0 ? yu : e, this;
}
function ae(t) {
  var e = -1, r = t == null ? 0 : t.length;
  for (this.clear(); ++e < r; ) {
    var n = t[e];
    this.set(n[0], n[1]);
  }
}
ae.prototype.clear = ou;
ae.prototype.delete = lu;
ae.prototype.get = fu;
ae.prototype.has = gu;
ae.prototype.set = mu;
function bu() {
  this.__data__ = [], this.size = 0;
}
function Jr(t, e) {
  for (var r = t.length; r--; )
    if (fi(t[r][0], e))
      return r;
  return -1;
}
var xu = Array.prototype, vu = xu.splice;
function wu(t) {
  var e = this.__data__, r = Jr(e, t);
  if (r < 0)
    return !1;
  var n = e.length - 1;
  return r == n ? e.pop() : vu.call(e, r, 1), --this.size, !0;
}
function _u(t) {
  var e = this.__data__, r = Jr(e, t);
  return r < 0 ? void 0 : e[r][1];
}
function Pu(t) {
  return Jr(this.__data__, t) > -1;
}
function Su(t, e) {
  var r = this.__data__, n = Jr(r, t);
  return n < 0 ? (++this.size, r.push([t, e])) : r[n][1] = e, this;
}
function Dt(t) {
  var e = -1, r = t == null ? 0 : t.length;
  for (this.clear(); ++e < r; ) {
    var n = t[e];
    this.set(n[0], n[1]);
  }
}
Dt.prototype.clear = bu;
Dt.prototype.delete = wu;
Dt.prototype.get = _u;
Dt.prototype.has = Pu;
Dt.prototype.set = Su;
var We = Re(Et, "Map");
function $u() {
  this.size = 0, this.__data__ = {
    hash: new ae(),
    map: new (We || Dt)(),
    string: new ae()
  };
}
function Ou(t) {
  var e = typeof t;
  return e == "string" || e == "number" || e == "symbol" || e == "boolean" ? t !== "__proto__" : t === null;
}
function tn(t, e) {
  var r = t.__data__;
  return Ou(e) ? r[typeof e == "string" ? "string" : "hash"] : r.map;
}
function Mu(t) {
  var e = tn(this, t).delete(t);
  return this.size -= e ? 1 : 0, e;
}
function Tu(t) {
  return tn(this, t).get(t);
}
function Iu(t) {
  return tn(this, t).has(t);
}
function Au(t, e) {
  var r = tn(this, t), n = r.size;
  return r.set(t, e), this.size += r.size == n ? 0 : 1, this;
}
function Ft(t) {
  var e = -1, r = t == null ? 0 : t.length;
  for (this.clear(); ++e < r; ) {
    var n = t[e];
    this.set(n[0], n[1]);
  }
}
Ft.prototype.clear = $u;
Ft.prototype.delete = Mu;
Ft.prototype.get = Tu;
Ft.prototype.has = Iu;
Ft.prototype.set = Au;
var ku = "Expected a function";
function Xe(t, e) {
  if (typeof t != "function" || e != null && typeof e != "function")
    throw new TypeError(ku);
  var r = function() {
    var n = arguments, i = e ? e.apply(this, n) : n[0], s = r.cache;
    if (s.has(i))
      return s.get(i);
    var a = t.apply(this, n);
    return r.cache = s.set(i, a) || s, a;
  };
  return r.cache = new (Xe.Cache || Ft)(), r;
}
Xe.Cache = Ft;
var Cu = 500;
function Ru(t) {
  var e = Xe(t, function(n) {
    return r.size === Cu && r.clear(), n;
  }), r = e.cache;
  return e;
}
var Eu = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, Du = /\\(\\)?/g, Fu = Ru(function(t) {
  var e = [];
  return t.charCodeAt(0) === 46 && e.push(""), t.replace(Eu, function(r, n, i, s) {
    e.push(i ? s.replace(Du, "$1") : n || r);
  }), e;
});
function Nu(t) {
  return t == null ? "" : na(t);
}
function fa(t, e) {
  return kt(t) ? t : pi(t, e) ? [t] : Fu(Nu(t));
}
function en(t) {
  if (typeof t == "string" || er(t))
    return t;
  var e = t + "";
  return e == "0" && 1 / t == -1 / 0 ? "-0" : e;
}
function da(t, e) {
  e = fa(e, t);
  for (var r = 0, n = e.length; t != null && r < n; )
    t = t[en(e[r++])];
  return r && r == n ? t : void 0;
}
function ju(t, e, r) {
  var n = t == null ? void 0 : da(t, e);
  return n === void 0 ? r : n;
}
function zu(t, e) {
  for (var r = -1, n = e.length, i = t.length; ++r < n; )
    t[i + r] = e[r];
  return t;
}
function Lu() {
  this.__data__ = new Dt(), this.size = 0;
}
function Vu(t) {
  var e = this.__data__, r = e.delete(t);
  return this.size = e.size, r;
}
function Bu(t) {
  return this.__data__.get(t);
}
function Uu(t) {
  return this.__data__.has(t);
}
var Wu = 200;
function Xu(t, e) {
  var r = this.__data__;
  if (r instanceof Dt) {
    var n = r.__data__;
    if (!We || n.length < Wu - 1)
      return n.push([t, e]), this.size = ++r.size, this;
    r = this.__data__ = new Ft(n);
  }
  return r.set(t, e), this.size = r.size, this;
}
function It(t) {
  var e = this.__data__ = new Dt(t);
  this.size = e.size;
}
It.prototype.clear = Lu;
It.prototype.delete = Vu;
It.prototype.get = Bu;
It.prototype.has = Uu;
It.prototype.set = Xu;
function Yu(t, e) {
  for (var r = -1, n = t == null ? 0 : t.length, i = 0, s = []; ++r < n; ) {
    var a = t[r];
    e(a, r, t) && (s[i++] = a);
  }
  return s;
}
function Hu() {
  return [];
}
var qu = Object.prototype, Gu = qu.propertyIsEnumerable, Ji = Object.getOwnPropertySymbols, Ku = Ji ? function(t) {
  return t == null ? [] : (t = Object(t), Yu(Ji(t), function(e) {
    return Gu.call(t, e);
  }));
} : Hu;
function Zu(t, e, r) {
  var n = e(t);
  return kt(t) ? n : zu(n, r(t));
}
function ts(t) {
  return Zu(t, ha, Ku);
}
var Ln = Re(Et, "DataView"), Vn = Re(Et, "Promise"), Bn = Re(Et, "Set"), es = "[object Map]", Qu = "[object Object]", rs = "[object Promise]", ns = "[object Set]", is = "[object WeakMap]", ss = "[object DataView]", Ju = ce(Ln), tc = ce(We), ec = ce(Vn), rc = ce(Bn), nc = ce(jn), Lt = Ce;
(Ln && Lt(new Ln(new ArrayBuffer(1))) != ss || We && Lt(new We()) != es || Vn && Lt(Vn.resolve()) != rs || Bn && Lt(new Bn()) != ns || jn && Lt(new jn()) != is) && (Lt = function(t) {
  var e = Ce(t), r = e == Qu ? t.constructor : void 0, n = r ? ce(r) : "";
  if (n)
    switch (n) {
      case Ju:
        return ss;
      case tc:
        return es;
      case ec:
        return rs;
      case rc:
        return ns;
      case nc:
        return is;
    }
  return e;
});
var as = Et.Uint8Array, ic = "__lodash_hash_undefined__";
function sc(t) {
  return this.__data__.set(t, ic), this;
}
function ac(t) {
  return this.__data__.has(t);
}
function Rr(t) {
  var e = -1, r = t == null ? 0 : t.length;
  for (this.__data__ = new Ft(); ++e < r; )
    this.add(t[e]);
}
Rr.prototype.add = Rr.prototype.push = sc;
Rr.prototype.has = ac;
function oc(t, e) {
  for (var r = -1, n = t == null ? 0 : t.length; ++r < n; )
    if (e(t[r], r, t))
      return !0;
  return !1;
}
function lc(t, e) {
  return t.has(e);
}
var uc = 1, cc = 2;
function pa(t, e, r, n, i, s) {
  var a = r & uc, o = t.length, l = e.length;
  if (o != l && !(a && l > o))
    return !1;
  var u = s.get(t), f = s.get(e);
  if (u && f)
    return u == e && f == t;
  var c = -1, h = !0, p = r & cc ? new Rr() : void 0;
  for (s.set(t, e), s.set(e, t); ++c < o; ) {
    var y = t[c], g = e[c];
    if (n)
      var v = a ? n(g, y, c, e, t, s) : n(y, g, c, t, e, s);
    if (v !== void 0) {
      if (v)
        continue;
      h = !1;
      break;
    }
    if (p) {
      if (!oc(e, function(b, x) {
        if (!lc(p, x) && (y === b || i(y, b, r, n, s)))
          return p.push(x);
      })) {
        h = !1;
        break;
      }
    } else if (!(y === g || i(y, g, r, n, s))) {
      h = !1;
      break;
    }
  }
  return s.delete(t), s.delete(e), h;
}
function hc(t) {
  var e = -1, r = Array(t.size);
  return t.forEach(function(n, i) {
    r[++e] = [i, n];
  }), r;
}
function fc(t) {
  var e = -1, r = Array(t.size);
  return t.forEach(function(n) {
    r[++e] = n;
  }), r;
}
var dc = 1, pc = 2, gc = "[object Boolean]", yc = "[object Date]", mc = "[object Error]", bc = "[object Map]", xc = "[object Number]", vc = "[object RegExp]", wc = "[object Set]", _c = "[object String]", Pc = "[object Symbol]", Sc = "[object ArrayBuffer]", $c = "[object DataView]", os = Bt ? Bt.prototype : void 0, On = os ? os.valueOf : void 0;
function Oc(t, e, r, n, i, s, a) {
  switch (r) {
    case $c:
      if (t.byteLength != e.byteLength || t.byteOffset != e.byteOffset)
        return !1;
      t = t.buffer, e = e.buffer;
    case Sc:
      return !(t.byteLength != e.byteLength || !s(new as(t), new as(e)));
    case gc:
    case yc:
    case xc:
      return fi(+t, +e);
    case mc:
      return t.name == e.name && t.message == e.message;
    case vc:
    case _c:
      return t == e + "";
    case bc:
      var o = hc;
    case wc:
      var l = n & dc;
      if (o || (o = fc), t.size != e.size && !l)
        return !1;
      var u = a.get(t);
      if (u)
        return u == e;
      n |= pc, a.set(t, e);
      var f = pa(o(t), o(e), n, i, s, a);
      return a.delete(t), f;
    case Pc:
      if (On)
        return On.call(t) == On.call(e);
  }
  return !1;
}
var Mc = 1, Tc = Object.prototype, Ic = Tc.hasOwnProperty;
function Ac(t, e, r, n, i, s) {
  var a = r & Mc, o = ts(t), l = o.length, u = ts(e), f = u.length;
  if (l != f && !a)
    return !1;
  for (var c = l; c--; ) {
    var h = o[c];
    if (!(a ? h in e : Ic.call(e, h)))
      return !1;
  }
  var p = s.get(t), y = s.get(e);
  if (p && y)
    return p == e && y == t;
  var g = !0;
  s.set(t, e), s.set(e, t);
  for (var v = a; ++c < l; ) {
    h = o[c];
    var b = t[h], x = e[h];
    if (n)
      var P = a ? n(x, b, h, e, t, s) : n(b, x, h, t, e, s);
    if (!(P === void 0 ? b === x || i(b, x, r, n, s) : P)) {
      g = !1;
      break;
    }
    v || (v = h == "constructor");
  }
  if (g && !v) {
    var m = t.constructor, d = e.constructor;
    m != d && "constructor" in t && "constructor" in e && !(typeof m == "function" && m instanceof m && typeof d == "function" && d instanceof d) && (g = !1);
  }
  return s.delete(t), s.delete(e), g;
}
var kc = 1, ls = "[object Arguments]", us = "[object Array]", br = "[object Object]", Cc = Object.prototype, cs = Cc.hasOwnProperty;
function Rc(t, e, r, n, i, s) {
  var a = kt(t), o = kt(e), l = a ? us : Lt(t), u = o ? us : Lt(e);
  l = l == ls ? br : l, u = u == ls ? br : u;
  var f = l == br, c = u == br, h = l == u;
  if (h && zn(t)) {
    if (!zn(e))
      return !1;
    a = !0, f = !1;
  }
  if (h && !f)
    return s || (s = new It()), a || ca(t) ? pa(t, e, r, n, i, s) : Oc(t, e, l, r, n, i, s);
  if (!(r & kc)) {
    var p = f && cs.call(t, "__wrapped__"), y = c && cs.call(e, "__wrapped__");
    if (p || y) {
      var g = p ? t.value() : t, v = y ? e.value() : e;
      return s || (s = new It()), i(g, v, r, n, s);
    }
  }
  return h ? (s || (s = new It()), Ac(t, e, r, n, i, s)) : !1;
}
function rn(t, e, r, n, i) {
  return t === e ? !0 : t == null || e == null || !_e(t) && !_e(e) ? t !== t && e !== e : Rc(t, e, r, n, rn, i);
}
var Ec = 1, Dc = 2;
function Fc(t, e, r, n) {
  var i = r.length, s = i;
  if (t == null)
    return !s;
  for (t = Object(t); i--; ) {
    var a = r[i];
    if (a[2] ? a[1] !== t[a[0]] : !(a[0] in t))
      return !1;
  }
  for (; ++i < s; ) {
    a = r[i];
    var o = a[0], l = t[o], u = a[1];
    if (a[2]) {
      if (l === void 0 && !(o in t))
        return !1;
    } else {
      var f = new It(), c;
      if (!(c === void 0 ? rn(u, l, Ec | Dc, n, f) : c))
        return !1;
    }
  }
  return !0;
}
function ga(t) {
  return t === t && !Pe(t);
}
function Nc(t) {
  for (var e = ha(t), r = e.length; r--; ) {
    var n = e[r], i = t[n];
    e[r] = [n, i, ga(i)];
  }
  return e;
}
function ya(t, e) {
  return function(r) {
    return r == null ? !1 : r[t] === e && (e !== void 0 || t in Object(r));
  };
}
function jc(t) {
  var e = Nc(t);
  return e.length == 1 && e[0][2] ? ya(e[0][0], e[0][1]) : function(r) {
    return r === t || Fc(r, t, e);
  };
}
function zc(t, e) {
  return t != null && e in Object(t);
}
function Lc(t, e, r) {
  e = fa(e, t);
  for (var n = -1, i = e.length, s = !1; ++n < i; ) {
    var a = en(e[n]);
    if (!(s = t != null && r(t, a)))
      break;
    t = t[a];
  }
  return s || ++n != i ? s : (i = t == null ? 0 : t.length, !!i && di(i) && hi(a, i) && (kt(t) || oa(t)));
}
function Vc(t, e) {
  return t != null && Lc(t, e, zc);
}
var Bc = 1, Uc = 2;
function Wc(t, e) {
  return pi(t) && ga(e) ? ya(en(t), e) : function(r) {
    var n = ju(r, t);
    return n === void 0 && n === e ? Vc(r, t) : rn(e, n, Bc | Uc);
  };
}
function Xc(t) {
  return function(e) {
    return e?.[t];
  };
}
function Yc(t) {
  return function(e) {
    return da(e, t);
  };
}
function Hc(t) {
  return pi(t) ? Xc(en(t)) : Yc(t);
}
function qc(t) {
  return typeof t == "function" ? t : t == null ? qo : typeof t == "object" ? kt(t) ? Wc(t[0], t[1]) : jc(t) : Hc(t);
}
function Gc(t, e) {
  return rn(t, e);
}
function Kc(t, e) {
  return t < e;
}
function Zc(t, e, r) {
  for (var n = -1, i = t.length; ++n < i; ) {
    var s = t[n], a = e(s);
    if (a != null && (o === void 0 ? a === a && !er(a) : r(a, o)))
      var o = a, l = s;
  }
  return l;
}
function ma(t, e) {
  return t && t.length ? Zc(t, qc(e), Kc) : void 0;
}
var Qc = Math.ceil, Jc = Math.max;
function th(t, e, r, n) {
  for (var i = -1, s = Jc(Qc((e - t) / (r || 1)), 0), a = Array(s); s--; )
    a[++i] = t, t += r;
  return a;
}
function eh(t) {
  return function(e, r, n) {
    return n && typeof n != "number" && pl(e, r, n) && (r = n = void 0), e = Pn(e), r === void 0 ? (r = e, e = 0) : r = Pn(r), n = n === void 0 ? e < r ? 1 : -1 : Pn(n), th(e, r, n);
  };
}
var ba = eh(), rh = Array.prototype, nh = rh.reverse;
function ih(t) {
  return t == null ? t : nh.call(t);
}
const At = 11102230246251565e-32, it = 134217729, sh = (3 + 8 * At) * At;
function Mn(t, e, r, n, i) {
  let s, a, o, l, u = e[0], f = n[0], c = 0, h = 0;
  f > u == f > -u ? (s = u, u = e[++c]) : (s = f, f = n[++h]);
  let p = 0;
  if (c < t && h < r)
    for (f > u == f > -u ? (a = u + s, o = s - (a - u), u = e[++c]) : (a = f + s, o = s - (a - f), f = n[++h]), s = a, o !== 0 && (i[p++] = o); c < t && h < r; )
      f > u == f > -u ? (a = s + u, l = a - s, o = s - (a - l) + (u - l), u = e[++c]) : (a = s + f, l = a - s, o = s - (a - l) + (f - l), f = n[++h]), s = a, o !== 0 && (i[p++] = o);
  for (; c < t; )
    a = s + u, l = a - s, o = s - (a - l) + (u - l), u = e[++c], s = a, o !== 0 && (i[p++] = o);
  for (; h < r; )
    a = s + f, l = a - s, o = s - (a - l) + (f - l), f = n[++h], s = a, o !== 0 && (i[p++] = o);
  return (s !== 0 || p === 0) && (i[p++] = s), p;
}
function ah(t, e) {
  let r = e[0];
  for (let n = 1; n < t; n++) r += e[n];
  return r;
}
function rr(t) {
  return new Float64Array(t);
}
const oh = (3 + 16 * At) * At, lh = (2 + 12 * At) * At, uh = (9 + 64 * At) * At * At, fe = rr(4), hs = rr(8), fs = rr(12), ds = rr(16), at = rr(4);
function ch(t, e, r, n, i, s, a) {
  let o, l, u, f, c, h, p, y, g, v, b, x, P, m, d, E, V, z;
  const S = t - i, D = r - i, R = e - s, I = n - s;
  m = S * I, h = it * S, p = h - (h - S), y = S - p, h = it * I, g = h - (h - I), v = I - g, d = y * v - (m - p * g - y * g - p * v), E = R * D, h = it * R, p = h - (h - R), y = R - p, h = it * D, g = h - (h - D), v = D - g, V = y * v - (E - p * g - y * g - p * v), b = d - V, c = d - b, fe[0] = d - (b + c) + (c - V), x = m + b, c = x - m, P = m - (x - c) + (b - c), b = P - E, c = P - b, fe[1] = P - (b + c) + (c - E), z = x + b, c = z - x, fe[2] = x - (z - c) + (b - c), fe[3] = z;
  let j = ah(4, fe), w = lh * a;
  if (j >= w || -j >= w || (c = t - S, o = t - (S + c) + (c - i), c = r - D, u = r - (D + c) + (c - i), c = e - R, l = e - (R + c) + (c - s), c = n - I, f = n - (I + c) + (c - s), o === 0 && l === 0 && u === 0 && f === 0) || (w = uh * a + sh * Math.abs(j), j += S * f + I * o - (R * u + D * l), j >= w || -j >= w)) return j;
  m = o * I, h = it * o, p = h - (h - o), y = o - p, h = it * I, g = h - (h - I), v = I - g, d = y * v - (m - p * g - y * g - p * v), E = l * D, h = it * l, p = h - (h - l), y = l - p, h = it * D, g = h - (h - D), v = D - g, V = y * v - (E - p * g - y * g - p * v), b = d - V, c = d - b, at[0] = d - (b + c) + (c - V), x = m + b, c = x - m, P = m - (x - c) + (b - c), b = P - E, c = P - b, at[1] = P - (b + c) + (c - E), z = x + b, c = z - x, at[2] = x - (z - c) + (b - c), at[3] = z;
  const C = Mn(4, fe, 4, at, hs);
  m = S * f, h = it * S, p = h - (h - S), y = S - p, h = it * f, g = h - (h - f), v = f - g, d = y * v - (m - p * g - y * g - p * v), E = R * u, h = it * R, p = h - (h - R), y = R - p, h = it * u, g = h - (h - u), v = u - g, V = y * v - (E - p * g - y * g - p * v), b = d - V, c = d - b, at[0] = d - (b + c) + (c - V), x = m + b, c = x - m, P = m - (x - c) + (b - c), b = P - E, c = P - b, at[1] = P - (b + c) + (c - E), z = x + b, c = z - x, at[2] = x - (z - c) + (b - c), at[3] = z;
  const $ = Mn(C, hs, 4, at, fs);
  m = o * f, h = it * o, p = h - (h - o), y = o - p, h = it * f, g = h - (h - f), v = f - g, d = y * v - (m - p * g - y * g - p * v), E = l * u, h = it * l, p = h - (h - l), y = l - p, h = it * u, g = h - (h - u), v = u - g, V = y * v - (E - p * g - y * g - p * v), b = d - V, c = d - b, at[0] = d - (b + c) + (c - V), x = m + b, c = x - m, P = m - (x - c) + (b - c), b = P - E, c = P - b, at[1] = P - (b + c) + (c - E), z = x + b, c = z - x, at[2] = x - (z - c) + (b - c), at[3] = z;
  const k = Mn($, fs, 4, at, ds);
  return ds[k - 1];
}
function xr(t, e, r, n, i, s) {
  const a = (e - s) * (r - i), o = (t - i) * (n - s), l = a - o, u = Math.abs(a + o);
  return Math.abs(l) >= oh * u ? l : -ch(t, e, r, n, i, s, u);
}
const ps = Math.pow(2, -52), vr = new Uint32Array(512);
class Er {
  /**
   * Constructs a delaunay triangulation object given an array of points (`[x, y]` by default).
   * `getX` and `getY` are optional functions of the form `(point) => value` for custom point formats.
   *
   * @template P
   * @param {P[]} points
   * @param {(p: P) => number} [getX]
   * @param {(p: P) => number} [getY]
   */
  // @ts-expect-error TS2322
  static from(e, r = gh, n = yh) {
    const i = e.length, s = new Float64Array(i * 2);
    for (let a = 0; a < i; a++) {
      const o = e[a];
      s[2 * a] = r(o), s[2 * a + 1] = n(o);
    }
    return new Er(s);
  }
  /**
   * Constructs a delaunay triangulation object given an array of point coordinates of the form:
   * `[x0, y0, x1, y1, ...]` (use a typed array for best performance). Duplicate points are skipped.
   *
   * @param {T} coords
   */
  constructor(e) {
    const r = e.length >> 1;
    if (r > 0 && typeof e[0] != "number") throw new Error("Expected coords to contain numbers.");
    this.coords = e;
    const n = Math.max(2 * r - 5, 0);
    this._triangles = new Uint32Array(n * 3), this._halfedges = new Int32Array(n * 3), this._hashSize = Math.ceil(Math.sqrt(r)), this._hullPrev = new Uint32Array(r), this._hullNext = new Uint32Array(r), this._hullTri = new Uint32Array(r), this._hullHash = new Int32Array(this._hashSize), this._ids = new Uint32Array(r), this._dists = new Float64Array(r), this.trianglesLen = 0, this._cx = 0, this._cy = 0, this._hullStart = 0, this.hull = this._triangles, this.triangles = this._triangles, this.halfedges = this._halfedges, this.update();
  }
  /**
   * Updates the triangulation if you modified `delaunay.coords` values in place, avoiding expensive memory allocations.
   * Useful for iterative relaxation algorithms such as Lloyd's.
   */
  update() {
    const { coords: e, _hullPrev: r, _hullNext: n, _hullTri: i, _hullHash: s } = this, a = e.length >> 1;
    let o = 1 / 0, l = 1 / 0, u = -1 / 0, f = -1 / 0;
    for (let S = 0; S < a; S++) {
      const D = e[2 * S], R = e[2 * S + 1];
      D < o && (o = D), R < l && (l = R), D > u && (u = D), R > f && (f = R), this._ids[S] = S;
    }
    const c = (o + u) / 2, h = (l + f) / 2;
    let p = 0, y = 0, g = 0;
    for (let S = 0, D = 1 / 0; S < a; S++) {
      const R = Tn(c, h, e[2 * S], e[2 * S + 1]);
      R < D && (p = S, D = R);
    }
    const v = e[2 * p], b = e[2 * p + 1];
    for (let S = 0, D = 1 / 0; S < a; S++) {
      if (S === p) continue;
      const R = Tn(v, b, e[2 * S], e[2 * S + 1]);
      R < D && R > 0 && (y = S, D = R);
    }
    let x = e[2 * y], P = e[2 * y + 1], m = 1 / 0;
    for (let S = 0; S < a; S++) {
      if (S === p || S === y) continue;
      const D = dh(v, b, x, P, e[2 * S], e[2 * S + 1]);
      D < m && (g = S, m = D);
    }
    let d = e[2 * g], E = e[2 * g + 1];
    if (m === 1 / 0) {
      for (let R = 0; R < a; R++)
        this._dists[R] = e[2 * R] - e[0] || e[2 * R + 1] - e[1];
      ge(this._ids, this._dists, 0, a - 1);
      const S = new Uint32Array(a);
      let D = 0;
      for (let R = 0, I = -1 / 0; R < a; R++) {
        const j = this._ids[R], w = this._dists[j];
        w > I && (S[D++] = j, I = w);
      }
      this.hull = S.subarray(0, D), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (xr(v, b, x, P, d, E) < 0) {
      const S = y, D = x, R = P;
      y = g, x = d, P = E, g = S, d = D, E = R;
    }
    const V = ph(v, b, x, P, d, E);
    this._cx = V.x, this._cy = V.y;
    for (let S = 0; S < a; S++)
      this._dists[S] = Tn(e[2 * S], e[2 * S + 1], V.x, V.y);
    ge(this._ids, this._dists, 0, a - 1), this._hullStart = p;
    let z = 3;
    n[p] = r[g] = y, n[y] = r[p] = g, n[g] = r[y] = p, i[p] = 0, i[y] = 1, i[g] = 2, s.fill(-1), s[this._hashKey(v, b)] = p, s[this._hashKey(x, P)] = y, s[this._hashKey(d, E)] = g, this.trianglesLen = 0, this._addTriangle(p, y, g, -1, -1, -1);
    for (let S = 0, D = 0, R = 0; S < this._ids.length; S++) {
      const I = this._ids[S], j = e[2 * I], w = e[2 * I + 1];
      if (S > 0 && Math.abs(j - D) <= ps && Math.abs(w - R) <= ps || (D = j, R = w, I === p || I === y || I === g)) continue;
      let C = 0;
      for (let X = 0, A = this._hashKey(j, w); X < this._hashSize && (C = s[(A + X) % this._hashSize], !(C !== -1 && C !== n[C])); X++)
        ;
      C = r[C];
      let $ = C, k;
      for (; k = n[$], xr(j, w, e[2 * $], e[2 * $ + 1], e[2 * k], e[2 * k + 1]) >= 0; )
        if ($ = k, $ === C) {
          $ = -1;
          break;
        }
      if ($ === -1) continue;
      let B = this._addTriangle($, I, n[$], -1, -1, i[$]);
      i[I] = this._legalize(B + 2), i[$] = B, z++;
      let N = n[$];
      for (; k = n[N], xr(j, w, e[2 * N], e[2 * N + 1], e[2 * k], e[2 * k + 1]) < 0; )
        B = this._addTriangle(N, I, k, i[I], -1, i[N]), i[I] = this._legalize(B + 2), n[N] = N, z--, N = k;
      if ($ === C)
        for (; k = r[$], xr(j, w, e[2 * k], e[2 * k + 1], e[2 * $], e[2 * $ + 1]) < 0; )
          B = this._addTriangle(k, I, $, -1, i[$], i[k]), this._legalize(B + 2), i[k] = B, n[$] = $, z--, $ = k;
      this._hullStart = r[I] = $, n[$] = r[N] = I, n[I] = N, s[this._hashKey(j, w)] = I, s[this._hashKey(e[2 * $], e[2 * $ + 1])] = $;
    }
    this.hull = new Uint32Array(z);
    for (let S = 0, D = this._hullStart; S < z; S++)
      this.hull[S] = D, D = n[D];
    this.triangles = this._triangles.subarray(0, this.trianglesLen), this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
  }
  /**
   * Calculate an angle-based key for the edge hash used for advancing convex hull.
   *
   * @param {number} x
   * @param {number} y
   * @private
   */
  _hashKey(e, r) {
    return Math.floor(hh(e - this._cx, r - this._cy) * this._hashSize) % this._hashSize;
  }
  /**
   * Flip an edge in a pair of triangles if it doesn't satisfy the Delaunay condition.
   *
   * @param {number} a
   * @private
   */
  _legalize(e) {
    const { _triangles: r, _halfedges: n, coords: i } = this;
    let s = 0, a = 0;
    for (; ; ) {
      const o = n[e], l = e - e % 3;
      if (a = l + (e + 2) % 3, o === -1) {
        if (s === 0) break;
        e = vr[--s];
        continue;
      }
      const u = o - o % 3, f = l + (e + 1) % 3, c = u + (o + 2) % 3, h = r[a], p = r[e], y = r[f], g = r[c];
      if (fh(
        i[2 * h],
        i[2 * h + 1],
        i[2 * p],
        i[2 * p + 1],
        i[2 * y],
        i[2 * y + 1],
        i[2 * g],
        i[2 * g + 1]
      )) {
        r[e] = g, r[o] = h;
        const b = n[c];
        if (b === -1) {
          let P = this._hullStart;
          do {
            if (this._hullTri[P] === c) {
              this._hullTri[P] = e;
              break;
            }
            P = this._hullPrev[P];
          } while (P !== this._hullStart);
        }
        this._link(e, b), this._link(o, n[a]), this._link(a, c);
        const x = u + (o + 1) % 3;
        s < vr.length && (vr[s++] = x);
      } else {
        if (s === 0) break;
        e = vr[--s];
      }
    }
    return a;
  }
  /**
   * Link two half-edges to each other.
   * @param {number} a
   * @param {number} b
   * @private
   */
  _link(e, r) {
    this._halfedges[e] = r, r !== -1 && (this._halfedges[r] = e);
  }
  /**
   * Add a new triangle given vertex indices and adjacent half-edge ids.
   *
   * @param {number} i0
   * @param {number} i1
   * @param {number} i2
   * @param {number} a
   * @param {number} b
   * @param {number} c
   * @private
   */
  _addTriangle(e, r, n, i, s, a) {
    const o = this.trianglesLen;
    return this._triangles[o] = e, this._triangles[o + 1] = r, this._triangles[o + 2] = n, this._link(o, i), this._link(o + 1, s), this._link(o + 2, a), this.trianglesLen += 3, o;
  }
}
function hh(t, e) {
  const r = t / (Math.abs(t) + Math.abs(e));
  return (e > 0 ? 3 - r : 1 + r) / 4;
}
function Tn(t, e, r, n) {
  const i = t - r, s = e - n;
  return i * i + s * s;
}
function fh(t, e, r, n, i, s, a, o) {
  const l = t - a, u = e - o, f = r - a, c = n - o, h = i - a, p = s - o, y = l * l + u * u, g = f * f + c * c, v = h * h + p * p;
  return l * (c * v - g * p) - u * (f * v - g * h) + y * (f * p - c * h) < 0;
}
function dh(t, e, r, n, i, s) {
  const a = r - t, o = n - e, l = i - t, u = s - e, f = a * a + o * o, c = l * l + u * u, h = 0.5 / (a * u - o * l), p = (u * f - o * c) * h, y = (a * c - l * f) * h;
  return p * p + y * y;
}
function ph(t, e, r, n, i, s) {
  const a = r - t, o = n - e, l = i - t, u = s - e, f = a * a + o * o, c = l * l + u * u, h = 0.5 / (a * u - o * l), p = t + (u * f - o * c) * h, y = e + (a * c - l * f) * h;
  return { x: p, y };
}
function ge(t, e, r, n) {
  if (n - r <= 20)
    for (let i = r + 1; i <= n; i++) {
      const s = t[i], a = e[s];
      let o = i - 1;
      for (; o >= r && e[t[o]] > a; ) t[o + 1] = t[o--];
      t[o + 1] = s;
    }
  else {
    const i = r + n >> 1;
    let s = r + 1, a = n;
    ze(t, i, s), e[t[r]] > e[t[n]] && ze(t, r, n), e[t[s]] > e[t[n]] && ze(t, s, n), e[t[r]] > e[t[s]] && ze(t, r, s);
    const o = t[s], l = e[o];
    for (; ; ) {
      do
        s++;
      while (e[t[s]] < l);
      do
        a--;
      while (e[t[a]] > l);
      if (a < s) break;
      ze(t, s, a);
    }
    t[r + 1] = t[a], t[a] = o, n - s + 1 >= a - r ? (ge(t, e, s, n), ge(t, e, r, a - 1)) : (ge(t, e, r, a - 1), ge(t, e, s, n));
  }
}
function ze(t, e, r) {
  const n = t[e];
  t[e] = t[r], t[r] = n;
}
function gh(t) {
  return t[0];
}
function yh(t) {
  return t[1];
}
const gs = 1e-6;
class ee {
  constructor() {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null, this._ = "";
  }
  moveTo(e, r) {
    this._ += `M${this._x0 = this._x1 = +e},${this._y0 = this._y1 = +r}`;
  }
  closePath() {
    this._x1 !== null && (this._x1 = this._x0, this._y1 = this._y0, this._ += "Z");
  }
  lineTo(e, r) {
    this._ += `L${this._x1 = +e},${this._y1 = +r}`;
  }
  arc(e, r, n) {
    e = +e, r = +r, n = +n;
    const i = e + n, s = r;
    if (n < 0) throw new Error("negative radius");
    this._x1 === null ? this._ += `M${i},${s}` : (Math.abs(this._x1 - i) > gs || Math.abs(this._y1 - s) > gs) && (this._ += "L" + i + "," + s), n && (this._ += `A${n},${n},0,1,1,${e - n},${r}A${n},${n},0,1,1,${this._x1 = i},${this._y1 = s}`);
  }
  rect(e, r, n, i) {
    this._ += `M${this._x0 = this._x1 = +e},${this._y0 = this._y1 = +r}h${+n}v${+i}h${-n}Z`;
  }
  value() {
    return this._ || null;
  }
}
class Un {
  constructor() {
    this._ = [];
  }
  moveTo(e, r) {
    this._.push([e, r]);
  }
  closePath() {
    this._.push(this._[0].slice());
  }
  lineTo(e, r) {
    this._.push([e, r]);
  }
  value() {
    return this._.length ? this._ : null;
  }
}
class mh {
  constructor(e, [r, n, i, s] = [0, 0, 960, 500]) {
    if (!((i = +i) >= (r = +r)) || !((s = +s) >= (n = +n))) throw new Error("invalid bounds");
    this.delaunay = e, this._circumcenters = new Float64Array(e.points.length * 2), this.vectors = new Float64Array(e.points.length * 2), this.xmax = i, this.xmin = r, this.ymax = s, this.ymin = n, this._init();
  }
  update() {
    return this.delaunay.update(), this._init(), this;
  }
  _init() {
    const { delaunay: { points: e, hull: r, triangles: n }, vectors: i } = this;
    let s, a;
    const o = this.circumcenters = this._circumcenters.subarray(0, n.length / 3 * 2);
    for (let g = 0, v = 0, b = n.length, x, P; g < b; g += 3, v += 2) {
      const m = n[g] * 2, d = n[g + 1] * 2, E = n[g + 2] * 2, V = e[m], z = e[m + 1], S = e[d], D = e[d + 1], R = e[E], I = e[E + 1], j = S - V, w = D - z, C = R - V, $ = I - z, k = (j * $ - w * C) * 2;
      if (Math.abs(k) < 1e-9) {
        if (s === void 0) {
          s = a = 0;
          for (const N of r) s += e[N * 2], a += e[N * 2 + 1];
          s /= r.length, a /= r.length;
        }
        const B = 1e9 * Math.sign((s - V) * $ - (a - z) * C);
        x = (V + R) / 2 - B * $, P = (z + I) / 2 + B * C;
      } else {
        const B = 1 / k, N = j * j + w * w, X = C * C + $ * $;
        x = V + ($ * N - w * X) * B, P = z + (j * X - C * N) * B;
      }
      o[v] = x, o[v + 1] = P;
    }
    let l = r[r.length - 1], u, f = l * 4, c, h = e[2 * l], p, y = e[2 * l + 1];
    i.fill(0);
    for (let g = 0; g < r.length; ++g)
      l = r[g], u = f, c = h, p = y, f = l * 4, h = e[2 * l], y = e[2 * l + 1], i[u + 2] = i[f] = p - y, i[u + 3] = i[f + 1] = h - c;
  }
  render(e) {
    const r = e == null ? e = new ee() : void 0, { delaunay: { halfedges: n, inedges: i, hull: s }, circumcenters: a, vectors: o } = this;
    if (s.length <= 1) return null;
    for (let f = 0, c = n.length; f < c; ++f) {
      const h = n[f];
      if (h < f) continue;
      const p = Math.floor(f / 3) * 2, y = Math.floor(h / 3) * 2, g = a[p], v = a[p + 1], b = a[y], x = a[y + 1];
      this._renderSegment(g, v, b, x, e);
    }
    let l, u = s[s.length - 1];
    for (let f = 0; f < s.length; ++f) {
      l = u, u = s[f];
      const c = Math.floor(i[u] / 3) * 2, h = a[c], p = a[c + 1], y = l * 4, g = this._project(h, p, o[y + 2], o[y + 3]);
      g && this._renderSegment(h, p, g[0], g[1], e);
    }
    return r && r.value();
  }
  renderBounds(e) {
    const r = e == null ? e = new ee() : void 0;
    return e.rect(this.xmin, this.ymin, this.xmax - this.xmin, this.ymax - this.ymin), r && r.value();
  }
  renderCell(e, r) {
    const n = r == null ? r = new ee() : void 0, i = this._clip(e);
    if (i === null || !i.length) return;
    r.moveTo(i[0], i[1]);
    let s = i.length;
    for (; i[0] === i[s - 2] && i[1] === i[s - 1] && s > 1; ) s -= 2;
    for (let a = 2; a < s; a += 2)
      (i[a] !== i[a - 2] || i[a + 1] !== i[a - 1]) && r.lineTo(i[a], i[a + 1]);
    return r.closePath(), n && n.value();
  }
  *cellPolygons() {
    const { delaunay: { points: e } } = this;
    for (let r = 0, n = e.length / 2; r < n; ++r) {
      const i = this.cellPolygon(r);
      i && (i.index = r, yield i);
    }
  }
  cellPolygon(e) {
    const r = new Un();
    return this.renderCell(e, r), r.value();
  }
  _renderSegment(e, r, n, i, s) {
    let a;
    const o = this._regioncode(e, r), l = this._regioncode(n, i);
    o === 0 && l === 0 ? (s.moveTo(e, r), s.lineTo(n, i)) : (a = this._clipSegment(e, r, n, i, o, l)) && (s.moveTo(a[0], a[1]), s.lineTo(a[2], a[3]));
  }
  contains(e, r, n) {
    return r = +r, r !== r || (n = +n, n !== n) ? !1 : this.delaunay._step(e, r, n) === e;
  }
  *neighbors(e) {
    const r = this._clip(e);
    if (r) for (const n of this.delaunay.neighbors(e)) {
      const i = this._clip(n);
      if (i) {
        t: for (let s = 0, a = r.length; s < a; s += 2)
          for (let o = 0, l = i.length; o < l; o += 2)
            if (r[s] === i[o] && r[s + 1] === i[o + 1] && r[(s + 2) % a] === i[(o + l - 2) % l] && r[(s + 3) % a] === i[(o + l - 1) % l]) {
              yield n;
              break t;
            }
      }
    }
  }
  _cell(e) {
    const { circumcenters: r, delaunay: { inedges: n, halfedges: i, triangles: s } } = this, a = n[e];
    if (a === -1) return null;
    const o = [];
    let l = a;
    do {
      const u = Math.floor(l / 3);
      if (o.push(r[u * 2], r[u * 2 + 1]), l = l % 3 === 2 ? l - 2 : l + 1, s[l] !== e) break;
      l = i[l];
    } while (l !== a && l !== -1);
    return o;
  }
  _clip(e) {
    if (e === 0 && this.delaunay.hull.length === 1)
      return [this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax, this.xmin, this.ymin];
    const r = this._cell(e);
    if (r === null) return null;
    const { vectors: n } = this, i = e * 4;
    return this._simplify(n[i] || n[i + 1] ? this._clipInfinite(e, r, n[i], n[i + 1], n[i + 2], n[i + 3]) : this._clipFinite(e, r));
  }
  _clipFinite(e, r) {
    const n = r.length;
    let i = null, s, a, o = r[n - 2], l = r[n - 1], u, f = this._regioncode(o, l), c, h = 0;
    for (let p = 0; p < n; p += 2)
      if (s = o, a = l, o = r[p], l = r[p + 1], u = f, f = this._regioncode(o, l), u === 0 && f === 0)
        c = h, h = 0, i ? i.push(o, l) : i = [o, l];
      else {
        let y, g, v, b, x;
        if (u === 0) {
          if ((y = this._clipSegment(s, a, o, l, u, f)) === null) continue;
          [g, v, b, x] = y;
        } else {
          if ((y = this._clipSegment(o, l, s, a, f, u)) === null) continue;
          [b, x, g, v] = y, c = h, h = this._edgecode(g, v), c && h && this._edge(e, c, h, i, i.length), i ? i.push(g, v) : i = [g, v];
        }
        c = h, h = this._edgecode(b, x), c && h && this._edge(e, c, h, i, i.length), i ? i.push(b, x) : i = [b, x];
      }
    if (i)
      c = h, h = this._edgecode(i[0], i[1]), c && h && this._edge(e, c, h, i, i.length);
    else if (this.contains(e, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2))
      return [this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax, this.xmin, this.ymin];
    return i;
  }
  _clipSegment(e, r, n, i, s, a) {
    const o = s < a;
    for (o && ([e, r, n, i, s, a] = [n, i, e, r, a, s]); ; ) {
      if (s === 0 && a === 0) return o ? [n, i, e, r] : [e, r, n, i];
      if (s & a) return null;
      let l, u, f = s || a;
      f & 8 ? (l = e + (n - e) * (this.ymax - r) / (i - r), u = this.ymax) : f & 4 ? (l = e + (n - e) * (this.ymin - r) / (i - r), u = this.ymin) : f & 2 ? (u = r + (i - r) * (this.xmax - e) / (n - e), l = this.xmax) : (u = r + (i - r) * (this.xmin - e) / (n - e), l = this.xmin), s ? (e = l, r = u, s = this._regioncode(e, r)) : (n = l, i = u, a = this._regioncode(n, i));
    }
  }
  _clipInfinite(e, r, n, i, s, a) {
    let o = Array.from(r), l;
    if ((l = this._project(o[0], o[1], n, i)) && o.unshift(l[0], l[1]), (l = this._project(o[o.length - 2], o[o.length - 1], s, a)) && o.push(l[0], l[1]), o = this._clipFinite(e, o))
      for (let u = 0, f = o.length, c, h = this._edgecode(o[f - 2], o[f - 1]); u < f; u += 2)
        c = h, h = this._edgecode(o[u], o[u + 1]), c && h && (u = this._edge(e, c, h, o, u), f = o.length);
    else this.contains(e, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2) && (o = [this.xmin, this.ymin, this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax]);
    return o;
  }
  _edge(e, r, n, i, s) {
    for (; r !== n; ) {
      let a, o;
      switch (r) {
        case 5:
          r = 4;
          continue;
        case 4:
          r = 6, a = this.xmax, o = this.ymin;
          break;
        case 6:
          r = 2;
          continue;
        case 2:
          r = 10, a = this.xmax, o = this.ymax;
          break;
        case 10:
          r = 8;
          continue;
        case 8:
          r = 9, a = this.xmin, o = this.ymax;
          break;
        case 9:
          r = 1;
          continue;
        case 1:
          r = 5, a = this.xmin, o = this.ymin;
          break;
      }
      (i[s] !== a || i[s + 1] !== o) && this.contains(e, a, o) && (i.splice(s, 0, a, o), s += 2);
    }
    return s;
  }
  _project(e, r, n, i) {
    let s = 1 / 0, a, o, l;
    if (i < 0) {
      if (r <= this.ymin) return null;
      (a = (this.ymin - r) / i) < s && (l = this.ymin, o = e + (s = a) * n);
    } else if (i > 0) {
      if (r >= this.ymax) return null;
      (a = (this.ymax - r) / i) < s && (l = this.ymax, o = e + (s = a) * n);
    }
    if (n > 0) {
      if (e >= this.xmax) return null;
      (a = (this.xmax - e) / n) < s && (o = this.xmax, l = r + (s = a) * i);
    } else if (n < 0) {
      if (e <= this.xmin) return null;
      (a = (this.xmin - e) / n) < s && (o = this.xmin, l = r + (s = a) * i);
    }
    return [o, l];
  }
  _edgecode(e, r) {
    return (e === this.xmin ? 1 : e === this.xmax ? 2 : 0) | (r === this.ymin ? 4 : r === this.ymax ? 8 : 0);
  }
  _regioncode(e, r) {
    return (e < this.xmin ? 1 : e > this.xmax ? 2 : 0) | (r < this.ymin ? 4 : r > this.ymax ? 8 : 0);
  }
  _simplify(e) {
    if (e && e.length > 4) {
      for (let r = 0; r < e.length; r += 2) {
        const n = (r + 2) % e.length, i = (r + 4) % e.length;
        (e[r] === e[n] && e[n] === e[i] || e[r + 1] === e[n + 1] && e[n + 1] === e[i + 1]) && (e.splice(n, 2), r -= 2);
      }
      e.length || (e = null);
    }
    return e;
  }
}
const bh = 2 * Math.PI, de = Math.pow;
function xh(t) {
  return t[0];
}
function vh(t) {
  return t[1];
}
function wh(t) {
  const { triangles: e, coords: r } = t;
  for (let n = 0; n < e.length; n += 3) {
    const i = 2 * e[n], s = 2 * e[n + 1], a = 2 * e[n + 2];
    if ((r[a] - r[i]) * (r[s + 1] - r[i + 1]) - (r[s] - r[i]) * (r[a + 1] - r[i + 1]) > 1e-10) return !1;
  }
  return !0;
}
function _h(t, e, r) {
  return [t + Math.sin(t + e) * r, e + Math.cos(t - e) * r];
}
class gi {
  static from(e, r = xh, n = vh, i) {
    return new gi("length" in e ? Ph(e, r, n, i) : Float64Array.from(Sh(e, r, n, i)));
  }
  constructor(e) {
    this._delaunator = new Er(e), this.inedges = new Int32Array(e.length / 2), this._hullIndex = new Int32Array(e.length / 2), this.points = this._delaunator.coords, this._init();
  }
  update() {
    return this._delaunator.update(), this._init(), this;
  }
  _init() {
    const e = this._delaunator, r = this.points;
    if (e.hull && e.hull.length > 2 && wh(e)) {
      this.collinear = Int32Array.from({ length: r.length / 2 }, (h, p) => p).sort((h, p) => r[2 * h] - r[2 * p] || r[2 * h + 1] - r[2 * p + 1]);
      const l = this.collinear[0], u = this.collinear[this.collinear.length - 1], f = [r[2 * l], r[2 * l + 1], r[2 * u], r[2 * u + 1]], c = 1e-8 * Math.hypot(f[3] - f[1], f[2] - f[0]);
      for (let h = 0, p = r.length / 2; h < p; ++h) {
        const y = _h(r[2 * h], r[2 * h + 1], c);
        r[2 * h] = y[0], r[2 * h + 1] = y[1];
      }
      this._delaunator = new Er(r);
    } else
      delete this.collinear;
    const n = this.halfedges = this._delaunator.halfedges, i = this.hull = this._delaunator.hull, s = this.triangles = this._delaunator.triangles, a = this.inedges.fill(-1), o = this._hullIndex.fill(-1);
    for (let l = 0, u = n.length; l < u; ++l) {
      const f = s[l % 3 === 2 ? l - 2 : l + 1];
      (n[l] === -1 || a[f] === -1) && (a[f] = l);
    }
    for (let l = 0, u = i.length; l < u; ++l)
      o[i[l]] = l;
    i.length <= 2 && i.length > 0 && (this.triangles = new Int32Array(3).fill(-1), this.halfedges = new Int32Array(3).fill(-1), this.triangles[0] = i[0], a[i[0]] = 1, i.length === 2 && (a[i[1]] = 0, this.triangles[1] = i[1], this.triangles[2] = i[1]));
  }
  voronoi(e) {
    return new mh(this, e);
  }
  *neighbors(e) {
    const { inedges: r, hull: n, _hullIndex: i, halfedges: s, triangles: a, collinear: o } = this;
    if (o) {
      const c = o.indexOf(e);
      c > 0 && (yield o[c - 1]), c < o.length - 1 && (yield o[c + 1]);
      return;
    }
    const l = r[e];
    if (l === -1) return;
    let u = l, f = -1;
    do {
      if (yield f = a[u], u = u % 3 === 2 ? u - 2 : u + 1, a[u] !== e) return;
      if (u = s[u], u === -1) {
        const c = n[(i[e] + 1) % n.length];
        c !== f && (yield c);
        return;
      }
    } while (u !== l);
  }
  find(e, r, n = 0) {
    if (e = +e, e !== e || (r = +r, r !== r)) return -1;
    const i = n;
    let s;
    for (; (s = this._step(n, e, r)) >= 0 && s !== n && s !== i; ) n = s;
    return s;
  }
  _step(e, r, n) {
    const { inedges: i, hull: s, _hullIndex: a, halfedges: o, triangles: l, points: u } = this;
    if (u.length < 2) return -1;
    if (i[e] === -1) return (e + 1) % (u.length >> 1);
    let f = e, c = de(r - u[e * 2], 2) + de(n - u[e * 2 + 1], 2);
    const h = i[e];
    let p = h;
    do {
      let y = l[p];
      const g = de(r - u[y * 2], 2) + de(n - u[y * 2 + 1], 2);
      if (g < c && (c = g, f = y), p = p % 3 === 2 ? p - 2 : p + 1, l[p] !== e) break;
      if (p = o[p], p === -1) {
        if (p = s[(a[e] + 1) % s.length], p !== y && de(r - u[p * 2], 2) + de(n - u[p * 2 + 1], 2) < c)
          return p;
        break;
      }
    } while (p !== h);
    return f;
  }
  render(e) {
    const r = e == null ? e = new ee() : void 0, { points: n, halfedges: i, triangles: s } = this;
    for (let a = 0, o = i.length; a < o; ++a) {
      const l = i[a];
      if (l < a) continue;
      const u = s[a] * 2, f = s[l] * 2;
      e.moveTo(n[u], n[u + 1]), e.lineTo(n[f], n[f + 1]);
    }
    return this.renderHull(e), r && r.value();
  }
  renderPoints(e, r) {
    r === void 0 && (!e || typeof e.moveTo != "function") && (r = e, e = null), r = r == null ? 2 : +r;
    const n = e == null ? e = new ee() : void 0, { points: i } = this;
    for (let s = 0, a = i.length & -2; s < a; s += 2) {
      const o = i[s], l = i[s + 1];
      e.moveTo(o + r, l), e.arc(o, l, r, 0, bh);
    }
    return n && n.value();
  }
  renderHull(e) {
    const r = e == null ? e = new ee() : void 0, { hull: n, points: i } = this, s = n[0] * 2, a = n.length;
    e.moveTo(i[s], i[s + 1]);
    for (let o = 1; o < a; ++o) {
      const l = 2 * n[o];
      e.lineTo(i[l], i[l + 1]);
    }
    return e.closePath(), r && r.value();
  }
  hullPolygon() {
    const e = new Un();
    return this.renderHull(e), e.value();
  }
  renderTriangle(e, r) {
    const n = r == null ? r = new ee() : void 0, { points: i, triangles: s } = this, a = s[e *= 3] * 2, o = s[e + 1] * 2, l = s[e + 2] * 2;
    return r.moveTo(i[a], i[a + 1]), r.lineTo(i[o], i[o + 1]), r.lineTo(i[l], i[l + 1]), r.closePath(), n && n.value();
  }
  *trianglePolygons() {
    const { triangles: e } = this;
    for (let r = 0, n = e.length / 3; r < n; ++r)
      yield this.trianglePolygon(r);
  }
  trianglePolygon(e) {
    const r = new Un();
    return this.renderTriangle(e, r), r.value();
  }
}
function Ph(t, e, r, n) {
  const i = t.length, s = new Float64Array(i * 2);
  for (let a = 0; a < i; ++a) {
    const o = t[a];
    s[a * 2] = e.call(n, o, a, t), s[a * 2 + 1] = r.call(n, o, a, t);
  }
  return s;
}
function* Sh(t, e, r, n) {
  let i = 0;
  for (const s of t)
    yield e.call(n, s, i, t), yield r.call(n, s, i, t), ++i;
}
function Ee(t, e, r) {
  t.prototype = e.prototype = r, r.constructor = t;
}
function nr(t, e) {
  var r = Object.create(t.prototype);
  for (var n in e) r[n] = e[n];
  return r;
}
function Wt() {
}
var oe = 0.7, Se = 1 / oe, me = "\\s*([+-]?\\d+)\\s*", Ye = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", wt = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", $h = /^#([0-9a-f]{3,8})$/, Oh = new RegExp(`^rgb\\(${me},${me},${me}\\)$`), Mh = new RegExp(`^rgb\\(${wt},${wt},${wt}\\)$`), Th = new RegExp(`^rgba\\(${me},${me},${me},${Ye}\\)$`), Ih = new RegExp(`^rgba\\(${wt},${wt},${wt},${Ye}\\)$`), Ah = new RegExp(`^hsl\\(${Ye},${wt},${wt}\\)$`), kh = new RegExp(`^hsla\\(${Ye},${wt},${wt},${Ye}\\)$`), ys = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
Ee(Wt, He, {
  copy(t) {
    return Object.assign(new this.constructor(), this, t);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: ms,
  // Deprecated! Use color.formatHex.
  formatHex: ms,
  formatHex8: Ch,
  formatHsl: Rh,
  formatRgb: bs,
  toString: bs
});
function ms() {
  return this.rgb().formatHex();
}
function Ch() {
  return this.rgb().formatHex8();
}
function Rh() {
  return xa(this).formatHsl();
}
function bs() {
  return this.rgb().formatRgb();
}
function He(t) {
  var e, r;
  return t = (t + "").trim().toLowerCase(), (e = $h.exec(t)) ? (r = e[1].length, e = parseInt(e[1], 16), r === 6 ? xs(e) : r === 3 ? new et(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, (e & 15) << 4 | e & 15, 1) : r === 8 ? wr(e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, (e & 255) / 255) : r === 4 ? wr(e >> 12 & 15 | e >> 8 & 240, e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, ((e & 15) << 4 | e & 15) / 255) : null) : (e = Oh.exec(t)) ? new et(e[1], e[2], e[3], 1) : (e = Mh.exec(t)) ? new et(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, 1) : (e = Th.exec(t)) ? wr(e[1], e[2], e[3], e[4]) : (e = Ih.exec(t)) ? wr(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, e[4]) : (e = Ah.exec(t)) ? _s(e[1], e[2] / 100, e[3] / 100, 1) : (e = kh.exec(t)) ? _s(e[1], e[2] / 100, e[3] / 100, e[4]) : ys.hasOwnProperty(t) ? xs(ys[t]) : t === "transparent" ? new et(NaN, NaN, NaN, 0) : null;
}
function xs(t) {
  return new et(t >> 16 & 255, t >> 8 & 255, t & 255, 1);
}
function wr(t, e, r, n) {
  return n <= 0 && (t = e = r = NaN), new et(t, e, r, n);
}
function yi(t) {
  return t instanceof Wt || (t = He(t)), t ? (t = t.rgb(), new et(t.r, t.g, t.b, t.opacity)) : new et();
}
function be(t, e, r, n) {
  return arguments.length === 1 ? yi(t) : new et(t, e, r, n ?? 1);
}
function et(t, e, r, n) {
  this.r = +t, this.g = +e, this.b = +r, this.opacity = +n;
}
Ee(et, be, nr(Wt, {
  brighter(t) {
    return t = t == null ? Se : Math.pow(Se, t), new et(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? oe : Math.pow(oe, t), new et(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new et(ie(this.r), ie(this.g), ie(this.b), Dr(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: vs,
  // Deprecated! Use color.formatHex.
  formatHex: vs,
  formatHex8: Eh,
  formatRgb: ws,
  toString: ws
}));
function vs() {
  return `#${re(this.r)}${re(this.g)}${re(this.b)}`;
}
function Eh() {
  return `#${re(this.r)}${re(this.g)}${re(this.b)}${re((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function ws() {
  const t = Dr(this.opacity);
  return `${t === 1 ? "rgb(" : "rgba("}${ie(this.r)}, ${ie(this.g)}, ${ie(this.b)}${t === 1 ? ")" : `, ${t})`}`;
}
function Dr(t) {
  return isNaN(t) ? 1 : Math.max(0, Math.min(1, t));
}
function ie(t) {
  return Math.max(0, Math.min(255, Math.round(t) || 0));
}
function re(t) {
  return t = ie(t), (t < 16 ? "0" : "") + t.toString(16);
}
function _s(t, e, r, n) {
  return n <= 0 ? t = e = r = NaN : r <= 0 || r >= 1 ? t = e = NaN : e <= 0 && (t = NaN), new mt(t, e, r, n);
}
function xa(t) {
  if (t instanceof mt) return new mt(t.h, t.s, t.l, t.opacity);
  if (t instanceof Wt || (t = He(t)), !t) return new mt();
  if (t instanceof mt) return t;
  t = t.rgb();
  var e = t.r / 255, r = t.g / 255, n = t.b / 255, i = Math.min(e, r, n), s = Math.max(e, r, n), a = NaN, o = s - i, l = (s + i) / 2;
  return o ? (e === s ? a = (r - n) / o + (r < n) * 6 : r === s ? a = (n - e) / o + 2 : a = (e - r) / o + 4, o /= l < 0.5 ? s + i : 2 - s - i, a *= 60) : o = l > 0 && l < 1 ? 0 : a, new mt(a, o, l, t.opacity);
}
function Dh(t, e, r, n) {
  return arguments.length === 1 ? xa(t) : new mt(t, e, r, n ?? 1);
}
function mt(t, e, r, n) {
  this.h = +t, this.s = +e, this.l = +r, this.opacity = +n;
}
Ee(mt, Dh, nr(Wt, {
  brighter(t) {
    return t = t == null ? Se : Math.pow(Se, t), new mt(this.h, this.s, this.l * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? oe : Math.pow(oe, t), new mt(this.h, this.s, this.l * t, this.opacity);
  },
  rgb() {
    var t = this.h % 360 + (this.h < 0) * 360, e = isNaN(t) || isNaN(this.s) ? 0 : this.s, r = this.l, n = r + (r < 0.5 ? r : 1 - r) * e, i = 2 * r - n;
    return new et(
      In(t >= 240 ? t - 240 : t + 120, i, n),
      In(t, i, n),
      In(t < 120 ? t + 240 : t - 120, i, n),
      this.opacity
    );
  },
  clamp() {
    return new mt(Ps(this.h), _r(this.s), _r(this.l), Dr(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const t = Dr(this.opacity);
    return `${t === 1 ? "hsl(" : "hsla("}${Ps(this.h)}, ${_r(this.s) * 100}%, ${_r(this.l) * 100}%${t === 1 ? ")" : `, ${t})`}`;
  }
}));
function Ps(t) {
  return t = (t || 0) % 360, t < 0 ? t + 360 : t;
}
function _r(t) {
  return Math.max(0, Math.min(1, t || 0));
}
function In(t, e, r) {
  return (t < 60 ? e + (r - e) * t / 60 : t < 180 ? r : t < 240 ? e + (r - e) * (240 - t) / 60 : e) * 255;
}
const va = Math.PI / 180, wa = 180 / Math.PI, Fr = 18, _a = 0.96422, Pa = 1, Sa = 0.82521, $a = 4 / 29, xe = 6 / 29, Oa = 3 * xe * xe, Fh = xe * xe * xe;
function Ma(t) {
  if (t instanceof _t) return new _t(t.l, t.a, t.b, t.opacity);
  if (t instanceof Tt) return Ta(t);
  t instanceof et || (t = yi(t));
  var e = Rn(t.r), r = Rn(t.g), n = Rn(t.b), i = An((0.2225045 * e + 0.7168786 * r + 0.0606169 * n) / Pa), s, a;
  return e === r && r === n ? s = a = i : (s = An((0.4360747 * e + 0.3850649 * r + 0.1430804 * n) / _a), a = An((0.0139322 * e + 0.0971045 * r + 0.7141733 * n) / Sa)), new _t(116 * i - 16, 500 * (s - i), 200 * (i - a), t.opacity);
}
function Wn(t, e, r, n) {
  return arguments.length === 1 ? Ma(t) : new _t(t, e, r, n ?? 1);
}
function _t(t, e, r, n) {
  this.l = +t, this.a = +e, this.b = +r, this.opacity = +n;
}
Ee(_t, Wn, nr(Wt, {
  brighter(t) {
    return new _t(this.l + Fr * (t ?? 1), this.a, this.b, this.opacity);
  },
  darker(t) {
    return new _t(this.l - Fr * (t ?? 1), this.a, this.b, this.opacity);
  },
  rgb() {
    var t = (this.l + 16) / 116, e = isNaN(this.a) ? t : t + this.a / 500, r = isNaN(this.b) ? t : t - this.b / 200;
    return e = _a * kn(e), t = Pa * kn(t), r = Sa * kn(r), new et(
      Cn(3.1338561 * e - 1.6168667 * t - 0.4906146 * r),
      Cn(-0.9787684 * e + 1.9161415 * t + 0.033454 * r),
      Cn(0.0719453 * e - 0.2289914 * t + 1.4052427 * r),
      this.opacity
    );
  }
}));
function An(t) {
  return t > Fh ? Math.pow(t, 1 / 3) : t / Oa + $a;
}
function kn(t) {
  return t > xe ? t * t * t : Oa * (t - $a);
}
function Cn(t) {
  return 255 * (t <= 31308e-7 ? 12.92 * t : 1.055 * Math.pow(t, 1 / 2.4) - 0.055);
}
function Rn(t) {
  return (t /= 255) <= 0.04045 ? t / 12.92 : Math.pow((t + 0.055) / 1.055, 2.4);
}
function Nh(t) {
  if (t instanceof Tt) return new Tt(t.h, t.c, t.l, t.opacity);
  if (t instanceof _t || (t = Ma(t)), t.a === 0 && t.b === 0) return new Tt(NaN, 0 < t.l && t.l < 100 ? 0 : NaN, t.l, t.opacity);
  var e = Math.atan2(t.b, t.a) * wa;
  return new Tt(e < 0 ? e + 360 : e, Math.sqrt(t.a * t.a + t.b * t.b), t.l, t.opacity);
}
function jh(t, e, r, n) {
  return arguments.length === 1 ? Nh(t) : new Tt(t, e, r, n ?? 1);
}
function Tt(t, e, r, n) {
  this.h = +t, this.c = +e, this.l = +r, this.opacity = +n;
}
function Ta(t) {
  if (isNaN(t.h)) return new _t(t.l, 0, 0, t.opacity);
  var e = t.h * va;
  return new _t(t.l, Math.cos(e) * t.c, Math.sin(e) * t.c, t.opacity);
}
Ee(Tt, jh, nr(Wt, {
  brighter(t) {
    return new Tt(this.h, this.c, this.l + Fr * (t ?? 1), this.opacity);
  },
  darker(t) {
    return new Tt(this.h, this.c, this.l - Fr * (t ?? 1), this.opacity);
  },
  rgb() {
    return Ta(this).rgb();
  }
}));
var Ia = -0.14861, mi = 1.78277, bi = -0.29227, nn = -0.90649, qe = 1.97294, Ss = qe * nn, $s = qe * mi, Os = mi * bi - nn * Ia;
function zh(t) {
  if (t instanceof se) return new se(t.h, t.s, t.l, t.opacity);
  t instanceof et || (t = yi(t));
  var e = t.r / 255, r = t.g / 255, n = t.b / 255, i = (Os * n + Ss * e - $s * r) / (Os + Ss - $s), s = n - i, a = (qe * (r - i) - bi * s) / nn, o = Math.sqrt(a * a + s * s) / (qe * i * (1 - i)), l = o ? Math.atan2(a, s) * wa - 120 : NaN;
  return new se(l < 0 ? l + 360 : l, o, i, t.opacity);
}
function Xn(t, e, r, n) {
  return arguments.length === 1 ? zh(t) : new se(t, e, r, n ?? 1);
}
function se(t, e, r, n) {
  this.h = +t, this.s = +e, this.l = +r, this.opacity = +n;
}
Ee(se, Xn, nr(Wt, {
  brighter(t) {
    return t = t == null ? Se : Math.pow(Se, t), new se(this.h, this.s, this.l * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? oe : Math.pow(oe, t), new se(this.h, this.s, this.l * t, this.opacity);
  },
  rgb() {
    var t = isNaN(this.h) ? 0 : (this.h + 120) * va, e = +this.l, r = isNaN(this.s) ? 0 : this.s * e * (1 - e), n = Math.cos(t), i = Math.sin(t);
    return new et(
      255 * (e + r * (Ia * n + mi * i)),
      255 * (e + r * (bi * n + nn * i)),
      255 * (e + r * (qe * n)),
      this.opacity
    );
  }
}));
var xi = (t) => () => t;
function Aa(t, e) {
  return function(r) {
    return t + r * e;
  };
}
function Lh(t, e, r) {
  return t = Math.pow(t, r), e = Math.pow(e, r) - t, r = 1 / r, function(n) {
    return Math.pow(t + n * e, r);
  };
}
function Vh(t, e) {
  var r = e - t;
  return r ? Aa(t, r > 180 || r < -180 ? r - 360 * Math.round(r / 360) : r) : xi(isNaN(t) ? e : t);
}
function Bh(t) {
  return (t = +t) == 1 ? vt : function(e, r) {
    return r - e ? Lh(e, r, t) : xi(isNaN(e) ? r : e);
  };
}
function vt(t, e) {
  var r = e - t;
  return r ? Aa(t, r) : xi(isNaN(t) ? e : t);
}
(function t(e) {
  var r = Bh(e);
  function n(i, s) {
    var a = r((i = be(i)).r, (s = be(s)).r), o = r(i.g, s.g), l = r(i.b, s.b), u = vt(i.opacity, s.opacity);
    return function(f) {
      return i.r = a(f), i.g = o(f), i.b = l(f), i.opacity = u(f), i + "";
    };
  }
  return n.gamma = t, n;
})(1);
var Uh = 1e-12;
function Ms(t) {
  return ((t = Math.exp(t)) + 1 / t) / 2;
}
function Wh(t) {
  return ((t = Math.exp(t)) - 1 / t) / 2;
}
function Xh(t) {
  return ((t = Math.exp(2 * t)) - 1) / (t + 1);
}
(function t(e, r, n) {
  function i(s, a) {
    var o = s[0], l = s[1], u = s[2], f = a[0], c = a[1], h = a[2], p = f - o, y = c - l, g = p * p + y * y, v, b;
    if (g < Uh)
      b = Math.log(h / u) / e, v = function(V) {
        return [
          o + V * p,
          l + V * y,
          u * Math.exp(e * V * b)
        ];
      };
    else {
      var x = Math.sqrt(g), P = (h * h - u * u + n * g) / (2 * u * r * x), m = (h * h - u * u - n * g) / (2 * h * r * x), d = Math.log(Math.sqrt(P * P + 1) - P), E = Math.log(Math.sqrt(m * m + 1) - m);
      b = (E - d) / e, v = function(V) {
        var z = V * b, S = Ms(d), D = u / (r * x) * (S * Xh(e * z + d) - Wh(d));
        return [
          o + D * p,
          l + D * y,
          u * S / Ms(e * z + d)
        ];
      };
    }
    return v.duration = Math.abs(b) * 1e3 * e / Math.SQRT2, v;
  }
  return i.rho = function(s) {
    var a = Math.max(1e-3, +s), o = a * a, l = o * o;
    return t(a, o, l);
  }, i;
})(Math.SQRT2, 2, 4);
function Yh(t, e) {
  var r = vt((t = Wn(t)).l, (e = Wn(e)).l), n = vt(t.a, e.a), i = vt(t.b, e.b), s = vt(t.opacity, e.opacity);
  return function(a) {
    return t.l = r(a), t.a = n(a), t.b = i(a), t.opacity = s(a), t + "";
  };
}
function ka(t) {
  return function e(r) {
    r = +r;
    function n(i, s) {
      var a = t((i = Xn(i)).h, (s = Xn(s)).h), o = vt(i.s, s.s), l = vt(i.l, s.l), u = vt(i.opacity, s.opacity);
      return function(f) {
        return i.h = a(f), i.s = o(f), i.l = l(Math.pow(f, r)), i.opacity = u(f), i + "";
      };
    }
    return n.gamma = e, n;
  }(1);
}
ka(Vh);
ka(vt);
function Ts(t, e) {
  var r = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(t);
    e && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(t, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Hh(t) {
  for (var e = 1; e < arguments.length; e++) {
    var r = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Ts(Object(r), !0).forEach(function(n) {
      qh(t, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r)) : Ts(Object(r)).forEach(function(n) {
      Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return t;
}
function Be(t) {
  "@babel/helpers - typeof";
  return typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? Be = function(e) {
    return typeof e;
  } : Be = function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Be(t);
}
function qh(t, e, r) {
  return e in t ? Object.defineProperty(t, e, {
    value: r,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : t[e] = r, t;
}
function Nr() {
  return Nr = Object.assign || function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = arguments[e];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n]);
    }
    return t;
  }, Nr.apply(this, arguments);
}
function Gh(t, e) {
  if (t) {
    if (typeof t == "string") return Is(t, e);
    var r = Object.prototype.toString.call(t).slice(8, -1);
    if (r === "Object" && t.constructor && (r = t.constructor.name), r === "Map" || r === "Set") return Array.from(t);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Is(t, e);
  }
}
function Is(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var r = 0, n = new Array(e); r < e; r++) n[r] = t[r];
  return n;
}
function Ca(t, e) {
  var r = typeof Symbol < "u" && t[Symbol.iterator] || t["@@iterator"];
  if (!r) {
    if (Array.isArray(t) || (r = Gh(t)) || e) {
      r && (t = r);
      var n = 0, i = function() {
      };
      return {
        s: i,
        n: function() {
          return n >= t.length ? {
            done: !0
          } : {
            done: !1,
            value: t[n++]
          };
        },
        e: function(l) {
          throw l;
        },
        f: i
      };
    }
    throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
  }
  var s = !0, a = !1, o;
  return {
    s: function() {
      r = r.call(t);
    },
    n: function() {
      var l = r.next();
      return s = l.done, l;
    },
    e: function(l) {
      a = !0, o = l;
    },
    f: function() {
      try {
        !s && r.return != null && r.return();
      } finally {
        if (a) throw o;
      }
    }
  };
}
function Kh(t, e) {
  var r = [], n = [];
  function i(s, a) {
    if (s.length === 1)
      r.push(s[0]), n.push(s[0]);
    else {
      for (var o = Array(s.length - 1), l = 0; l < o.length; l++)
        l === 0 && r.push(s[0]), l === o.length - 1 && n.push(s[l + 1]), o[l] = [(1 - a) * s[l][0] + a * s[l + 1][0], (1 - a) * s[l][1] + a * s[l + 1][1]];
      i(o, a);
    }
  }
  return t.length && i(t, e), {
    left: r,
    right: n.reverse()
  };
}
function Zh(t) {
  var e = {};
  return t.length === 4 && (e.x2 = t[2][0], e.y2 = t[2][1]), t.length >= 3 && (e.x1 = t[1][0], e.y1 = t[1][1]), e.x = t[t.length - 1][0], e.y = t[t.length - 1][1], t.length === 4 ? e.type = "C" : t.length === 3 ? e.type = "Q" : e.type = "L", e;
}
function Qh(t, e) {
  e = e || 2;
  for (var r = [], n = t, i = 1 / e, s = 0; s < e - 1; s++) {
    var a = i / (1 - i * s), o = Kh(n, a);
    r.push(o.left), n = o.right;
  }
  return r.push(n), r;
}
function Jh(t, e, r) {
  var n = [[t.x, t.y]];
  return e.x1 != null && n.push([e.x1, e.y1]), e.x2 != null && n.push([e.x2, e.y2]), n.push([e.x, e.y]), Qh(n, r).map(Zh);
}
var tf = /[MLCSTQAHVZmlcstqahv]|-?[\d.e+-]+/g, ve = {
  M: ["x", "y"],
  L: ["x", "y"],
  H: ["x"],
  V: ["y"],
  C: ["x1", "y1", "x2", "y2", "x", "y"],
  S: ["x2", "y2", "x", "y"],
  Q: ["x1", "y1", "x", "y"],
  T: ["x", "y"],
  A: ["rx", "ry", "xAxisRotation", "largeArcFlag", "sweepFlag", "x", "y"],
  Z: []
};
Object.keys(ve).forEach(function(t) {
  ve[t.toLowerCase()] = ve[t];
});
function Yn(t, e) {
  for (var r = Array(t), n = 0; n < t; n++)
    r[n] = e;
  return r;
}
function ef(t) {
  return "".concat(t.type).concat(ve[t.type].map(function(e) {
    return t[e];
  }).join(","));
}
function rf(t, e) {
  var r = {
    x1: "x",
    y1: "y",
    x2: "x",
    y2: "y"
  }, n = ["xAxisRotation", "largeArcFlag", "sweepFlag"];
  if (t.type !== e.type && e.type.toUpperCase() !== "M") {
    var i = {};
    Object.keys(e).forEach(function(s) {
      var a = e[s], o = t[s];
      o === void 0 && (n.includes(s) ? o = a : (o === void 0 && r[s] && (o = t[r[s]]), o === void 0 && (o = 0))), i[s] = o;
    }), i.type = e.type, t = i;
  }
  return t;
}
function nf(t, e, r) {
  var n = [];
  if (e.type === "L" || e.type === "Q" || e.type === "C")
    n = n.concat(Jh(t, e, r));
  else {
    var i = Nr({}, t);
    i.type === "M" && (i.type = "L"), n = n.concat(Yn(r - 1).map(function() {
      return i;
    })), n.push(e);
  }
  return n;
}
function As(t, e, r) {
  var n = t.length - 1, i = e.length - 1, s = n / i, a = Yn(i).reduce(function(l, u, f) {
    var c = Math.floor(s * f);
    if (r && c < t.length - 1 && r(t[c], t[c + 1])) {
      var h = s * f % 1 < 0.5;
      l[c] && (h ? c > 0 ? c -= 1 : c < t.length - 1 && (c += 1) : c < t.length - 1 ? c += 1 : c > 0 && (c -= 1));
    }
    return l[c] = (l[c] || 0) + 1, l;
  }, []), o = a.reduce(function(l, u, f) {
    if (f === t.length - 1) {
      var c = Yn(u, Nr({}, t[t.length - 1]));
      return c[0].type === "M" && c.forEach(function(h) {
        h.type = "L";
      }), l.concat(c);
    }
    return l.concat(nf(t[f], t[f + 1], u));
  }, []);
  return o.unshift(t[0]), o;
}
function ks(t) {
  for (var e = (t || "").match(tf) || [], r = [], n, i, s = 0; s < e.length; ++s)
    if (n = ve[e[s]], n) {
      i = {
        type: e[s]
      };
      for (var a = 0; a < n.length; ++a)
        i[n[a]] = +e[s + a + 1];
      s += n.length, r.push(i);
    }
  return r;
}
function sf(t, e, r) {
  var n = t == null ? [] : t.slice(), i = e == null ? [] : e.slice(), s = Be(r) === "object" ? r : {
    excludeSegment: r,
    snapEndsToInput: !0
  }, a = s.excludeSegment, o = s.snapEndsToInput;
  if (!n.length && !i.length)
    return function() {
      return [];
    };
  var l = (n.length === 0 || n[n.length - 1].type === "Z") && (i.length === 0 || i[i.length - 1].type === "Z");
  n.length > 0 && n[n.length - 1].type === "Z" && n.pop(), i.length > 0 && i[i.length - 1].type === "Z" && i.pop(), n.length ? i.length || i.push(n[0]) : n.push(i[0]);
  var u = Math.abs(i.length - n.length);
  u !== 0 && (i.length > n.length ? n = As(n, i, a) : i.length < n.length && (i = As(i, n, a))), n = n.map(function(c, h) {
    return rf(c, i[h]);
  });
  var f = n.map(function(c) {
    return Hh({}, c);
  });
  return l && (f.push({
    type: "Z"
  }), n.push({
    type: "Z"
  })), function(h) {
    if (h === 1 && o)
      return e ?? [];
    if (h === 0)
      return n;
    for (var p = 0; p < f.length; ++p) {
      var y = n[p], g = i[p], v = f[p], b = Ca(ve[v.type]), x;
      try {
        for (b.s(); !(x = b.n()).done; ) {
          var P = x.value;
          v[P] = (1 - h) * y[P] + h * g[P], (P === "largeArcFlag" || P === "sweepFlag") && (v[P] = Math.round(v[P]));
        }
      } catch (m) {
        b.e(m);
      } finally {
        b.f();
      }
    }
    return f;
  };
}
function af(t, e, r) {
  var n = ks(t), i = ks(e), s = Be(r) === "object" ? r : {
    excludeSegment: r,
    snapEndsToInput: !0
  }, a = s.excludeSegment, o = s.snapEndsToInput;
  if (!n.length && !i.length)
    return function() {
      return "";
    };
  var l = sf(n, i, {
    excludeSegment: a,
    snapEndsToInput: o
  });
  return function(f) {
    if (f === 1 && o)
      return e ?? "";
    var c = l(f), h = "", p = Ca(c), y;
    try {
      for (p.s(); !(y = p.n()).done; ) {
        var g = y.value;
        h += ef(g);
      }
    } catch (v) {
      p.e(v);
    } finally {
      p.f();
    }
    return h;
  };
}
function of(t) {
  return --t * t * t + 1;
}
var vi = 3;
(function t(e) {
  e = +e;
  function r(n) {
    return Math.pow(n, e);
  }
  return r.exponent = t, r;
})(vi);
(function t(e) {
  e = +e;
  function r(n) {
    return 1 - Math.pow(1 - n, e);
  }
  return r.exponent = t, r;
})(vi);
(function t(e) {
  e = +e;
  function r(n) {
    return ((n *= 2) <= 1 ? Math.pow(n, e) : 2 - Math.pow(2 - n, e)) / 2;
  }
  return r.exponent = t, r;
})(vi);
function jr(t) {
  return (Math.pow(2, -10 * t) - 9765625e-10) * 1.0009775171065494;
}
var wi = 1.70158;
(function t(e) {
  e = +e;
  function r(n) {
    return (n = +n) * n * (e * (n - 1) + n);
  }
  return r.overshoot = t, r;
})(wi);
(function t(e) {
  e = +e;
  function r(n) {
    return --n * n * ((n + 1) * e + n) + 1;
  }
  return r.overshoot = t, r;
})(wi);
(function t(e) {
  e = +e;
  function r(n) {
    return ((n *= 2) < 1 ? n * n * ((e + 1) * n - e) : (n -= 2) * n * ((e + 1) * n + e) + 2) / 2;
  }
  return r.overshoot = t, r;
})(wi);
var $e = 2 * Math.PI, _i = 1, Pi = 0.3;
(function t(e, r) {
  var n = Math.asin(1 / (e = Math.max(1, e))) * (r /= $e);
  function i(s) {
    return e * jr(- --s) * Math.sin((n - s) / r);
  }
  return i.amplitude = function(s) {
    return t(s, r * $e);
  }, i.period = function(s) {
    return t(e, s);
  }, i;
})(_i, Pi);
var lf = function t(e, r) {
  var n = Math.asin(1 / (e = Math.max(1, e))) * (r /= $e);
  function i(s) {
    return 1 - e * jr(s = +s) * Math.sin((s + n) / r);
  }
  return i.amplitude = function(s) {
    return t(s, r * $e);
  }, i.period = function(s) {
    return t(e, s);
  }, i;
}(_i, Pi);
(function t(e, r) {
  var n = Math.asin(1 / (e = Math.max(1, e))) * (r /= $e);
  function i(s) {
    return ((s = s * 2 - 1) < 0 ? e * jr(-s) * Math.sin((n - s) / r) : 2 - e * jr(s) * Math.sin((n + s) / r)) / 2;
  }
  return i.amplitude = function(s) {
    return t(s, r * $e);
  }, i.period = function(s) {
    return t(e, s);
  }, i;
})(_i, Pi);
var Ra = Symbol.for("immer-nothing"), Cs = Symbol.for("immer-draftable"), st = Symbol.for("immer-state"), uf = process.env.NODE_ENV !== "production" ? [
  // All error codes, starting by 0:
  function(t) {
    return `The plugin for '${t}' has not been loaded into Immer. To enable the plugin, import and call \`enable${t}()\` when initializing your application.`;
  },
  function(t) {
    return `produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '${t}'`;
  },
  "This object has been frozen and should not be mutated",
  function(t) {
    return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + t;
  },
  "An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",
  "Immer forbids circular references",
  "The first or second argument to `produce` must be a function",
  "The third argument to `produce` must be a function or undefined",
  "First argument to `createDraft` must be a plain object, an array, or an immerable object",
  "First argument to `finishDraft` must be a draft returned by `createDraft`",
  function(t) {
    return `'current' expects a draft, got: ${t}`;
  },
  "Object.defineProperty() cannot be used on an Immer draft",
  "Object.setPrototypeOf() cannot be used on an Immer draft",
  "Immer only supports deleting array indices",
  "Immer only supports setting array indices and the 'length' property",
  function(t) {
    return `'original' expects a draft, got: ${t}`;
  }
  // Note: if more errors are added, the errorOffset in Patches.ts should be increased
  // See Patches.ts for additional errors
] : [];
function dt(t, ...e) {
  if (process.env.NODE_ENV !== "production") {
    const r = uf[t], n = Jt(r) ? r.apply(null, e) : r;
    throw new Error(`[Immer] ${n}`);
  }
  throw new Error(
    `[Immer] minified error nr: ${t}. Full error at: https://bit.ly/3cXEKWf`
  );
}
var pt = Object, Oe = pt.getPrototypeOf, zr = "constructor", sn = "prototype", Hn = "configurable", Lr = "enumerable", Ir = "writable", Ge = "value", Ut = (t) => !!t && !!t[st];
function Pt(t) {
  return t ? Ea(t) || on(t) || !!t[Cs] || !!t[zr]?.[Cs] || ln(t) || sr(t) : !1;
}
var cf = pt[sn][zr].toString(), Rs = /* @__PURE__ */ new WeakMap();
function Ea(t) {
  if (!t || !Si(t))
    return !1;
  const e = Oe(t);
  if (e === null || e === pt[sn])
    return !0;
  const r = pt.hasOwnProperty.call(e, zr) && e[zr];
  if (r === Object)
    return !0;
  if (!Jt(r))
    return !1;
  let n = Rs.get(r);
  return n === void 0 && (n = Function.toString.call(r), Rs.set(r, n)), n === cf;
}
function an(t, e, r = !0) {
  ir(t) === 0 ? (r ? Reflect.ownKeys(t) : pt.keys(t)).forEach((i) => {
    e(i, t[i], t);
  }) : t.forEach((n, i) => e(i, n, t));
}
function ir(t) {
  const e = t[st];
  return e ? e.type_ : on(t) ? 1 : ln(t) ? 2 : sr(t) ? 3 : 0;
}
var En = (t, e, r = ir(t)) => r === 2 ? t.has(e) : pt[sn].hasOwnProperty.call(t, e), qn = (t, e, r = ir(t)) => (
  // @ts-ignore
  r === 2 ? t.get(e) : t[e]
), Vr = (t, e, r, n = ir(t)) => {
  n === 2 ? t.set(e, r) : n === 3 ? t.add(r) : t[e] = r;
};
function hf(t, e) {
  return t === e ? t !== 0 || 1 / t === 1 / e : t !== t && e !== e;
}
var on = Array.isArray, ln = (t) => t instanceof Map, sr = (t) => t instanceof Set, Si = (t) => typeof t == "object", Jt = (t) => typeof t == "function", Dn = (t) => typeof t == "boolean";
function ff(t) {
  const e = +t;
  return Number.isInteger(e) && String(e) === t;
}
var Mt = (t) => t.copy_ || t.base_, $i = (t) => t.modified_ ? t.copy_ : t.base_;
function Gn(t, e) {
  if (ln(t))
    return new Map(t);
  if (sr(t))
    return new Set(t);
  if (on(t))
    return Array[sn].slice.call(t);
  const r = Ea(t);
  if (e === !0 || e === "class_only" && !r) {
    const n = pt.getOwnPropertyDescriptors(t);
    delete n[st];
    let i = Reflect.ownKeys(n);
    for (let s = 0; s < i.length; s++) {
      const a = i[s], o = n[a];
      o[Ir] === !1 && (o[Ir] = !0, o[Hn] = !0), (o.get || o.set) && (n[a] = {
        [Hn]: !0,
        [Ir]: !0,
        // could live with !!desc.set as well here...
        [Lr]: o[Lr],
        [Ge]: t[a]
      });
    }
    return pt.create(Oe(t), n);
  } else {
    const n = Oe(t);
    if (n !== null && r)
      return { ...t };
    const i = pt.create(n);
    return pt.assign(i, t);
  }
}
function Oi(t, e = !1) {
  return un(t) || Ut(t) || !Pt(t) || (ir(t) > 1 && pt.defineProperties(t, {
    set: Pr,
    add: Pr,
    clear: Pr,
    delete: Pr
  }), pt.freeze(t), e && an(
    t,
    (r, n) => {
      Oi(n, !0);
    },
    !1
  )), t;
}
function df() {
  dt(2);
}
var Pr = {
  [Ge]: df
};
function un(t) {
  return t === null || !Si(t) ? !0 : pt.isFrozen(t);
}
var Br = "MapSet", Kn = "Patches", Es = "ArrayMethods", Da = {};
function le(t) {
  const e = Da[t];
  return e || dt(0, t), e;
}
var Ds = (t) => !!Da[t], Ke, Fa = () => Ke, pf = (t, e) => ({
  drafts_: [],
  parent_: t,
  immer_: e,
  // Whenever the modified draft contains a draft from another scope, we
  // need to prevent auto-freezing so the unowned draft can be finalized.
  canAutoFreeze_: !0,
  unfinalizedDrafts_: 0,
  handledSet_: /* @__PURE__ */ new Set(),
  processedForPatches_: /* @__PURE__ */ new Set(),
  mapSetPlugin_: Ds(Br) ? le(Br) : void 0,
  arrayMethodsPlugin_: Ds(Es) ? le(Es) : void 0
});
function Fs(t, e) {
  e && (t.patchPlugin_ = le(Kn), t.patches_ = [], t.inversePatches_ = [], t.patchListener_ = e);
}
function Zn(t) {
  Qn(t), t.drafts_.forEach(gf), t.drafts_ = null;
}
function Qn(t) {
  t === Ke && (Ke = t.parent_);
}
var Ns = (t) => Ke = pf(Ke, t);
function gf(t) {
  const e = t[st];
  e.type_ === 0 || e.type_ === 1 ? e.revoke_() : e.revoked_ = !0;
}
function js(t, e) {
  e.unfinalizedDrafts_ = e.drafts_.length;
  const r = e.drafts_[0];
  if (t !== void 0 && t !== r) {
    r[st].modified_ && (Zn(e), dt(4)), Pt(t) && (t = zs(e, t));
    const { patchPlugin_: i } = e;
    i && i.generateReplacementPatches_(
      r[st].base_,
      t,
      e
    );
  } else
    t = zs(e, r);
  return yf(e, t, !0), Zn(e), e.patches_ && e.patchListener_(e.patches_, e.inversePatches_), t !== Ra ? t : void 0;
}
function zs(t, e) {
  if (un(e))
    return e;
  const r = e[st];
  if (!r)
    return Ur(e, t.handledSet_, t);
  if (!cn(r, t))
    return e;
  if (!r.modified_)
    return r.base_;
  if (!r.finalized_) {
    const { callbacks_: n } = r;
    if (n)
      for (; n.length > 0; )
        n.pop()(t);
    za(r, t);
  }
  return r.copy_;
}
function yf(t, e, r = !1) {
  !t.parent_ && t.immer_.autoFreeze_ && t.canAutoFreeze_ && Oi(e, r);
}
function Na(t) {
  t.finalized_ = !0, t.scope_.unfinalizedDrafts_--;
}
var cn = (t, e) => t.scope_ === e, mf = [];
function ja(t, e, r, n) {
  const i = Mt(t), s = t.type_;
  if (n !== void 0 && qn(i, n, s) === e) {
    Vr(i, n, r, s);
    return;
  }
  if (!t.draftLocations_) {
    const o = t.draftLocations_ = /* @__PURE__ */ new Map();
    an(i, (l, u) => {
      if (Ut(u)) {
        const f = o.get(u) || [];
        f.push(l), o.set(u, f);
      }
    });
  }
  const a = t.draftLocations_.get(e) ?? mf;
  for (const o of a)
    Vr(i, o, r, s);
}
function bf(t, e, r) {
  t.callbacks_.push(function(i) {
    const s = e;
    if (!s || !cn(s, i))
      return;
    i.mapSetPlugin_?.fixSetContents(s);
    const a = $i(s);
    ja(t, s.draft_ ?? s, a, r), za(s, i);
  });
}
function za(t, e) {
  if (t.modified_ && !t.finalized_ && (t.type_ === 3 || t.type_ === 1 && t.allIndicesReassigned_ || (t.assigned_?.size ?? 0) > 0)) {
    const { patchPlugin_: n } = e;
    if (n) {
      const i = n.getPath(t);
      i && n.generatePatches_(t, i, e);
    }
    Na(t);
  }
}
function xf(t, e, r) {
  const { scope_: n } = t;
  if (Ut(r)) {
    const i = r[st];
    cn(i, n) && i.callbacks_.push(function() {
      Ar(t);
      const a = $i(i);
      ja(t, r, a, e);
    });
  } else Pt(r) && t.callbacks_.push(function() {
    const s = Mt(t);
    t.type_ === 3 ? s.has(r) && Ur(r, n.handledSet_, n) : qn(s, e, t.type_) === r && n.drafts_.length > 1 && (t.assigned_.get(e) ?? !1) === !0 && t.copy_ && Ur(
      qn(t.copy_, e, t.type_),
      n.handledSet_,
      n
    );
  });
}
function Ur(t, e, r) {
  return !r.immer_.autoFreeze_ && r.unfinalizedDrafts_ < 1 || Ut(t) || e.has(t) || !Pt(t) || un(t) || (e.add(t), an(t, (n, i) => {
    if (Ut(i)) {
      const s = i[st];
      if (cn(s, r)) {
        const a = $i(s);
        Vr(t, n, a, t.type_), Na(s);
      }
    } else Pt(i) && Ur(i, e, r);
  })), t;
}
function vf(t, e) {
  const r = on(t), n = {
    type_: r ? 1 : 0,
    // Track which produce call this is associated with.
    scope_: e ? e.scope_ : Fa(),
    // True for both shallow and deep changes.
    modified_: !1,
    // Used during finalization.
    finalized_: !1,
    // Track which properties have been assigned (true) or deleted (false).
    // actually instantiated in `prepareCopy()`
    assigned_: void 0,
    // The parent draft state.
    parent_: e,
    // The base state.
    base_: t,
    // The base proxy.
    draft_: null,
    // set below
    // The base copy with any updated values.
    copy_: null,
    // Called by the `produce` function.
    revoke_: null,
    isManual_: !1,
    // `callbacks` actually gets assigned in `createProxy`
    callbacks_: void 0
  };
  let i = n, s = Wr;
  r && (i = [n], s = Ze);
  const { revoke: a, proxy: o } = Proxy.revocable(i, s);
  return n.draft_ = o, n.revoke_ = a, [o, n];
}
var Wr = {
  get(t, e) {
    if (e === st)
      return t;
    let r = t.scope_.arrayMethodsPlugin_;
    const n = t.type_ === 1 && typeof e == "string";
    if (n && r?.isArrayOperationMethod(e))
      return r.createMethodInterceptor(t, e);
    const i = Mt(t);
    if (!En(i, e, t.type_))
      return _f(t, i, e);
    const s = i[e];
    if (t.finalized_ || !Pt(s) || n && t.operationMethod && r?.isMutatingArrayMethod(
      t.operationMethod
    ) && ff(e))
      return s;
    if (s === Fn(t.base_, e) || wf(t, e, s)) {
      Ar(t);
      const a = t.type_ === 1 ? +e : e, o = ti(t.scope_, s, t, a);
      return t.copy_[a] = o;
    }
    return s;
  },
  has(t, e) {
    return e in Mt(t);
  },
  ownKeys(t) {
    return Reflect.ownKeys(Mt(t));
  },
  set(t, e, r) {
    const n = La(Mt(t), e);
    if (n?.set)
      return n.set.call(t.draft_, r), !0;
    if (!t.modified_) {
      const i = Fn(Mt(t), e), s = i?.[st];
      if (s && s.base_ === r)
        return t.copy_[e] = r, t.assigned_.delete(e), !0;
      if (hf(r, i) && (r !== void 0 || En(t.base_, e, t.type_)))
        return !0;
      Ar(t), Jn(t);
    }
    return t.copy_[e] === r && // special case: handle new props with value 'undefined'
    (r !== void 0 || En(t.copy_, e, t.type_)) || // special case: NaN
    Number.isNaN(r) && Number.isNaN(t.copy_[e]) || (t.copy_[e] = r, t.assigned_.set(e, !0), xf(t, e, r)), !0;
  },
  deleteProperty(t, e) {
    return Ar(t), Fn(t.base_, e) !== void 0 || e in t.base_ ? (t.assigned_.set(e, !1), Jn(t)) : t.assigned_.delete(e), t.copy_ && delete t.copy_[e], !0;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor(t, e) {
    const r = Mt(t), n = Reflect.getOwnPropertyDescriptor(r, e);
    return n && {
      [Ir]: !0,
      [Hn]: t.type_ !== 1 || e !== "length",
      [Lr]: n[Lr],
      [Ge]: r[e]
    };
  },
  defineProperty() {
    dt(11);
  },
  getPrototypeOf(t) {
    return Oe(t.base_);
  },
  setPrototypeOf() {
    dt(12);
  }
}, Ze = {};
for (let t in Wr) {
  let e = Wr[t];
  Ze[t] = function() {
    const r = arguments;
    return r[0] = r[0][0], e.apply(this, r);
  };
}
Ze.deleteProperty = function(t, e) {
  return process.env.NODE_ENV !== "production" && isNaN(parseInt(e)) && dt(13), Ze.set.call(this, t, e, void 0);
};
Ze.set = function(t, e, r) {
  return process.env.NODE_ENV !== "production" && e !== "length" && isNaN(parseInt(e)) && dt(14), Wr.set.call(this, t[0], e, r, t[0]);
};
function Fn(t, e) {
  const r = t[st];
  return (r ? Mt(r) : t)[e];
}
function wf(t, e, r) {
  return t.type_ !== 1 || !t.allIndicesReassigned_ || !Pt(r) || r[st] ? !1 : t.baseRefs_.has(r);
}
function _f(t, e, r) {
  const n = La(e, r);
  return n ? Ge in n ? n[Ge] : (
    // This is a very special case, if the prop is a getter defined by the
    // prototype, we should invoke it with the draft as context!
    n.get?.call(t.draft_)
  ) : void 0;
}
function La(t, e) {
  if (!(e in t))
    return;
  let r = Oe(t);
  for (; r; ) {
    const n = Object.getOwnPropertyDescriptor(r, e);
    if (n)
      return n;
    r = Oe(r);
  }
}
function Jn(t) {
  t.modified_ || (t.modified_ = !0, t.parent_ && Jn(t.parent_));
}
function Ar(t) {
  t.copy_ || (t.assigned_ = /* @__PURE__ */ new Map(), t.copy_ = Gn(
    t.base_,
    t.scope_.immer_.useStrictShallowCopy_
  ));
}
var Pf = class {
  constructor(t) {
    this.autoFreeze_ = !0, this.useStrictShallowCopy_ = !1, this.useStrictIteration_ = !1, this.produce = (r, n, i) => {
      if (Jt(r) && !Jt(n)) {
        const a = n;
        n = r;
        const o = this;
        return function(u = a, ...f) {
          return o.produce(u, (c) => n.call(this, c, ...f));
        };
      }
      Jt(n) || dt(6), i !== void 0 && !Jt(i) && dt(7);
      let s;
      if (Pt(r)) {
        const a = Ns(this), o = ti(a, r, void 0);
        let l = !0;
        try {
          s = n(o), l = !1;
        } finally {
          l ? Zn(a) : Qn(a);
        }
        return Fs(a, i), js(s, a);
      } else if (!r || !Si(r)) {
        if (s = n(r), s === void 0 && (s = r), s === Ra && (s = void 0), this.autoFreeze_ && Oi(s, !0), i) {
          const a = [], o = [];
          le(Kn).generateReplacementPatches_(r, s, {
            patches_: a,
            inversePatches_: o
          }), i(a, o);
        }
        return s;
      } else
        dt(1, r);
    }, this.produceWithPatches = (r, n) => {
      if (Jt(r))
        return (o, ...l) => this.produceWithPatches(o, (u) => r(u, ...l));
      let i, s;
      return [this.produce(r, n, (o, l) => {
        i = o, s = l;
      }), i, s];
    }, Dn(t?.autoFreeze) && this.setAutoFreeze(t.autoFreeze);
    const e = t?.useStrictShallowCopy;
    (Dn(e) || e === "class_only") && this.setUseStrictShallowCopy(e), Dn(t?.useStrictIteration) && this.setUseStrictIteration(t.useStrictIteration);
  }
  createDraft(t) {
    Pt(t) || dt(8), Ut(t) && (t = Sf(t));
    const e = Ns(this), r = ti(e, t, void 0);
    return r[st].isManual_ = !0, Qn(e), r;
  }
  finishDraft(t, e) {
    const r = t && t[st];
    (!r || !r.isManual_) && dt(9);
    const { scope_: n } = r;
    return Fs(n, e), js(void 0, n);
  }
  /**
   * Pass true to automatically freeze all copies created by Immer.
   *
   * By default, auto-freezing is enabled.
   */
  setAutoFreeze(t) {
    this.autoFreeze_ = t;
  }
  /**
   * Pass true to enable strict shallow copy.
   *
   * By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
   */
  setUseStrictShallowCopy(t) {
    this.useStrictShallowCopy_ = t;
  }
  /**
   * Pass false to use faster iteration that skips non-enumerable properties
   * but still handles symbols for compatibility.
   *
   * By default, strict iteration is enabled (includes all own properties).
   */
  setUseStrictIteration(t) {
    this.useStrictIteration_ = t;
  }
  shouldUseStrictIteration() {
    return this.useStrictIteration_;
  }
  applyPatches(t, e) {
    let r;
    for (r = e.length - 1; r >= 0; r--) {
      const i = e[r];
      if (i.path.length === 0 && i.op === "replace") {
        t = i.value;
        break;
      }
    }
    r > -1 && (e = e.slice(r + 1));
    const n = le(Kn).applyPatches_;
    return Ut(t) ? n(t, e) : this.produce(
      t,
      (i) => n(i, e)
    );
  }
};
function ti(t, e, r, n) {
  const [i, s] = ln(e) ? le(Br).proxyMap_(e, r) : sr(e) ? le(Br).proxySet_(e, r) : vf(e, r);
  return (r?.scope_ ?? Fa()).drafts_.push(i), s.callbacks_ = r?.callbacks_ ?? [], s.key_ = n, r && n !== void 0 ? bf(r, s, n) : s.callbacks_.push(function(l) {
    l.mapSetPlugin_?.fixSetContents(s);
    const { patchPlugin_: u } = l;
    s.modified_ && u && u.generatePatches_(s, [], l);
  }), i;
}
function Sf(t) {
  return Ut(t) || dt(10, t), Va(t);
}
function Va(t) {
  if (!Pt(t) || un(t))
    return t;
  const e = t[st];
  let r, n = !0;
  if (e) {
    if (!e.modified_)
      return e.base_;
    e.finalized_ = !0, r = Gn(t, e.scope_.immer_.useStrictShallowCopy_), n = e.scope_.immer_.shouldUseStrictIteration();
  } else
    r = Gn(t, !0);
  const i = r;
  return sr(r) && (r = /* @__PURE__ */ new Set()), an(
    i,
    (s, a) => {
      Vr(r, s, Va(a));
    },
    n
  ), e && (e.finalized_ = !1), r;
}
var $f = globalThis.Iterator;
$f?.from;
var Of = new Pf(), Mf = Of.produce, hn = ci({}), Me = class extends Error {
  constructor(e, r) {
    super(e);
    M(this, "jsx");
    this.name = "ErrorWithJSX", this.jsx = r;
  }
}, Tf = class extends So {
  constructor() {
    super(...arguments);
    M(this, "state", { hasError: !1, error: null, errorInfo: null, copied: !1 });
    M(this, "jsxRef", $o());
    M(this, "copiedTimeout", null);
    M(this, "copy", async () => {
      let e = this.errorAsText();
      try {
        await navigator.clipboard.writeText(e);
      } catch {
        let r = document.createElement("textarea");
        r.value = e, document.body.appendChild(r), r.select(), document.execCommand("copy"), r.remove();
      }
      this.setState({ copied: !0 }), this.copiedTimeout && clearTimeout(this.copiedTimeout), this.copiedTimeout = setTimeout(() => this.setState({ copied: !1 }), 1500);
    });
    M(this, "reset", () => {
      this.setState({ hasError: !1, error: null, errorInfo: null, copied: !1 });
    });
  }
  errorAsText() {
    let { error: e, errorInfo: r } = this.state;
    if (!e) return "";
    let n = [`Error: ${e.message}`], i = this.jsxRef.current?.innerText.trim();
    return i && n.push(i), e.stack && n.push(`Stack trace:
${e.stack}`), r?.componentStack && n.push(`Component stack:${r.componentStack}`), n.join(`

`);
  }
  static getDerivedStateFromError(e) {
    return { hasError: !0, error: e, errorInfo: null };
  }
  componentDidCatch(e, r) {
    console.error(e, r), this.setState({ error: e, errorInfo: r });
  }
  componentDidUpdate(e) {
    this.state.hasError && this.props.resetOnChange !== e.resetOnChange && this.reset();
  }
  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) return this.props.fallback(this.state.error, this.state.errorInfo);
      let e = this.state.error, r = e instanceof Me;
      return W("div", { style: { border: "1px solid rgb(252, 165, 165)", background: "rgb(254, 242, 242)", borderRadius: 6, padding: 16, margin: 16, userSelect: "text", alignSelf: "flex-start", minWidth: 0 }, children: [W("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 8 }, children: [W("div", { style: { fontWeight: 600, color: "rgb(153, 27, 27)", fontSize: "1.125rem" }, children: ["Error: ", e.message] }), W("div", { style: { display: "flex", gap: 8, flexShrink: 0 }, children: [O("button", { onClick: this.copy, title: "Copy the whole error as plain text", style: { padding: "4px 12px", background: "white", color: "rgb(153, 27, 27)", borderRadius: 6, fontSize: "0.875rem", fontWeight: 500, border: "1px solid rgb(252, 165, 165)", cursor: "pointer", minWidth: 72 }, children: this.state.copied ? "Copied!" : "Copy" }), O("button", { onClick: this.reset, style: { padding: "4px 12px", background: "rgb(220, 38, 38)", color: "white", borderRadius: 6, fontSize: "0.875rem", fontWeight: 500, border: "none", cursor: "pointer" }, children: "Reset" })] })] }), r && O("div", { ref: this.jsxRef, style: { marginTop: 12, marginBottom: 12 }, children: e.jsx }), e.stack && W("details", { style: { marginTop: 12 }, children: [O("summary", { style: { cursor: "pointer", color: "rgb(185, 28, 28)", fontWeight: 500, marginBottom: 4 }, children: "Stack Trace" }), O("pre", { style: { fontSize: "0.75rem", background: "rgb(254, 226, 226)", padding: 12, borderRadius: 6, overflowX: "auto", color: "rgb(127, 29, 29)", marginTop: 8 }, children: e.stack })] }), this.state.errorInfo?.componentStack && W("details", { style: { marginTop: 12 }, children: [O("summary", { style: { cursor: "pointer", color: "rgb(185, 28, 28)", fontWeight: 500, marginBottom: 4 }, children: "Component Stack" }), O("pre", { style: { fontSize: "0.75rem", background: "rgb(254, 226, 226)", padding: 12, borderRadius: 6, overflowX: "auto", color: "rgb(127, 29, 29)", marginTop: 8 }, children: this.state.errorInfo.componentStack })] })] });
    }
    return this.props.children;
  }
};
function Ls(t, e, r) {
  return t + e + r - Math.max(t, e, r) - Math.min(t, e, r);
}
function If(t) {
  let e = [];
  for (let r = 0; r < t.length - 1; r++) e.push([t[r], t[r + 1]]);
  return e;
}
function fn(t, e) {
  throw Error(`Reached unreachable code: unexpected value ${t}`);
}
function Y(t, e) {
  if (!t) throw typeof e == "function" ? (console.group("Assertion failed; debug info:"), e(), console.groupEnd(), Error("Assertion failed")) : Error(e ?? "Assertion failed");
}
function Ba(t, e) {
  if (t == null) throw Error("Assertion failed: value is undefined or null");
  return t;
}
function Af(t, e) {
  t || console.warn("Warning assertion failed:", e);
}
function L(...t) {
  let [e, r] = t;
  if (typeof e == "number") return r === void 0 ? new Le(e, e) : new Le(e, r);
  if (Cf(e)) return e;
  if (typeof e == "object" && "x" in e && "y" in e) return new Le(e.x, e.y);
  if (kf(e)) return new Le(e[0], e[1]);
  fn(e);
}
(function(t) {
  function e(n, i) {
    return L(n, 0).rotateRad(i);
  }
  t.polarRad = e;
  function r(n, i) {
    return L(n, 0).rotateDeg(i);
  }
  t.polarDeg = r;
})(L || (L = {}));
function kf(t) {
  return Array.isArray(t) && t.length === 2 && typeof t[0] == "number" && typeof t[1] == "number";
}
function Cf(t) {
  return t instanceof Le;
}
var Le = class {
  constructor(t, e) {
    this.x = t, this.y = e;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y;
  }
  arr() {
    return [this.x, this.y];
  }
  str(t = ",") {
    return `${this.x}${t}${this.y}`;
  }
  xy() {
    return { x: this.x, y: this.y };
  }
  xy1() {
    return { x1: this.x, y1: this.y };
  }
  xy2() {
    return { x2: this.x, y2: this.y };
  }
  cxy() {
    return { cx: this.x, cy: this.y };
  }
  eq(t) {
    return t = L(t), this.x === t.x && this.y === t.y;
  }
  add(...t) {
    let e = this;
    for (let r of t) {
      let n = L(r);
      e = L(e.x + n.x, e.y + n.y);
    }
    return e;
  }
  sub(t) {
    return t = L(t), L(this.x - t.x, this.y - t.y);
  }
  mul(t) {
    return L(this.x * t, this.y * t);
  }
  div(t) {
    return L(this.x / t, this.y / t);
  }
  scale(t) {
    return t = L(t), L(this.x * t.x, this.y * t.y);
  }
  dot(t) {
    return t = L(t), this.x * t.x + this.y * t.y;
  }
  cross(t) {
    return t = L(t), this.x * t.y - this.y * t.x;
  }
  len2() {
    return this.dot(this);
  }
  len() {
    return Math.hypot(this.x, this.y);
  }
  norm() {
    return this.div(this.len());
  }
  withLen(t) {
    return this.norm().mul(t);
  }
  angleRad() {
    return Math.atan2(this.y, this.x);
  }
  angleDeg() {
    return Vs(this.angleRad());
  }
  angleToRad(t) {
    return t = L(t), Math.atan2(t.y - this.y, t.x - this.x);
  }
  angleToDeg(t) {
    return Vs(this.angleToRad(t));
  }
  dist2(t) {
    return t = L(t), this.sub(t).len2();
  }
  dist(t) {
    return t = L(t), this.sub(t).len();
  }
  lerp(t, e) {
    return t = L(t), L(J(this.x, t.x, e), J(this.y, t.y, e));
  }
  mid(t) {
    return this.lerp(t, 0.5);
  }
  projOnto(t) {
    let e = L(t), r = this.dot(e) / e.len2();
    return e.mul(r);
  }
  towards(t, e) {
    let r = L(t);
    return this.add(r.sub(this).norm().mul(e));
  }
  perp() {
    return L(-this.y, this.x);
  }
  rotateRad(t) {
    let e = Math.cos(t), r = Math.sin(t);
    return L(this.x * e - this.y * r, this.x * r + this.y * e);
  }
  rotateDeg(t) {
    return this.rotateRad(Rf(t));
  }
  round() {
    return L(Math.round(this.x), Math.round(this.y));
  }
  clamp(t, e) {
    return t = L(t), e = L(e), L(Ls(t.x, e.x, this.x), Ls(t.y, e.y, this.y));
  }
};
function J(t, e, r) {
  return t + (e - t) * r;
}
function Rf(t) {
  return t * Math.PI / 180;
}
function Vs(t) {
  return t * 180 / Math.PI;
}
function Xr(t) {
  if (!t || t.trim() === "") return [];
  let e = [], r = /(\w+)\s*\(([^)]+)\)/g, n;
  for (; (n = r.exec(t)) !== null; ) {
    let i = n[1], s = n[2].split(/[\s,]+/).map((a) => parseFloat(a.trim()));
    switch (i) {
      case "translate":
        e.push({ type: "translate", x: s[0] || 0, y: s[1] || 0 });
        break;
      case "rotate":
        e.push({ type: "rotate", degrees: s[0] || 0, cx: s[1] || 0, cy: s[2] || 0 });
        break;
      case "scale":
        e.push({ type: "scale", x: s[0] ?? 1, y: s[1] ?? s[0] ?? 1 });
        break;
    }
  }
  return e;
}
var Ua = (t) => Array.isArray(t) ? t : Xr(t);
function ue(t, e) {
  let r = Ua(t), n = L(e);
  for (let i of r.slice().reverse()) switch (i.type) {
    case "translate":
      n = n.add([i.x, i.y]);
      break;
    case "rotate":
      n = n.sub([i.cx ?? 0, i.cy ?? 0]).rotateDeg(i.degrees).add([i.cx ?? 0, i.cy ?? 0]);
      break;
    case "scale":
      n = n.scale([i.x, i.y]);
      break;
  }
  return n;
}
function Ef(t, e) {
  let r = Ua(t), n = L(e);
  for (let i of r) switch (i.type) {
    case "translate":
      n = n.sub([i.x, i.y]);
      break;
    case "rotate":
      n = n.sub([i.cx ?? 0, i.cy ?? 0]).rotateDeg(-i.degrees).add([i.cx ?? 0, i.cy ?? 0]);
      break;
    case "scale":
      n = n.scale([1 / i.x, 1 / i.y]);
      break;
  }
  return n;
}
function Mi(t, e) {
  return !t && !e ? "" : t ? e ? t + " " + e : t : e;
}
function Vt(t) {
  return t.map((e) => {
    switch (e.type) {
      case "translate":
        return `translate(${e.x}, ${e.y})`;
      case "rotate":
        return `rotate(${e.degrees}, ${e.cx}, ${e.cy})`;
      case "scale":
        return e.x === e.y ? `scale(${e.x})` : `scale(${e.x}, ${e.y})`;
    }
  }).join(" ");
}
function Sr(t, e, r) {
  if (t = Yr(t), e = Yr(e), t.length !== e.length) throw new Me(`Cannot lerp transforms with different lengths: ${t.length} vs ${e.length}`, [t.map((i) => [Vt([i]), te("br")]), "vs", te("br"), e.map((i) => [Vt([i]), te("br")])]);
  let n = [];
  for (let i = 0; i < t.length; i++) {
    let s = t[i], a = e[i];
    if (s.type !== a.type) throw new Me(`Cannot lerp transforms with different types at index ${i}: ${s.type} vs ${a.type}`, [`a: ${Vt(t)}`, te("br"), `b: ${Vt(e)}`]);
    switch (s.type) {
      case "translate":
        Y(a.type === "translate"), n.push({ type: "translate", x: J(s.x, a.x, r), y: J(s.y, a.y, r) });
        break;
      case "rotate":
        Y(a.type === "rotate"), n.push({ type: "rotate", degrees: Df(s.degrees, a.degrees, r), cx: J(s.cx, a.cx, r), cy: J(s.cy, a.cy, r) });
        break;
      case "scale":
        Y(a.type === "scale"), n.push({ type: "scale", x: J(s.x, a.x, r), y: J(s.y, a.y, r) });
        break;
    }
  }
  return n;
}
function Df(t, e, r) {
  return t + (((e - t) % 360 + 540) % 360 - 180) * r;
}
function Yr(t) {
  let e = [];
  for (let r of t) {
    let n = e[e.length - 1];
    r.type === "translate" && n?.type === "translate" ? e[e.length - 1] = { type: "translate", x: n.x + r.x, y: n.y + r.y } : e.push(r);
  }
  return e;
}
function Ff(t, e, r) {
  if (!t && !e) return "";
  let n = Xr(t), i = Xr(e);
  if (n.length === 0 && i.every((o) => o.type === "translate")) return Vt(Sr([{ type: "translate", x: 0, y: 0 }], i, r));
  if (i.length === 0 && n.every((o) => o.type === "translate")) return Vt(Sr(n, [{ type: "translate", x: 0, y: 0 }], r));
  let s = n.some((o) => o.type === "scale"), a = i.some((o) => o.type === "scale");
  if (s || a) {
    let o = Yr(n), l = Yr(i), u = o.some((c) => c.type === "translate"), f = l.some((c) => c.type === "translate");
    return u && !f ? l = [{ type: "translate", x: 0, y: 0 }, ...l] : f && !u && (o = [{ type: "translate", x: 0, y: 0 }, ...o]), s || (o = [...o, { type: "scale", x: 1, y: 1 }]), a || (l = [...l, { type: "scale", x: 1, y: 1 }]), Vt(Sr(o, l, r));
  }
  return t ? e ? Vt(Sr(n, i, r)) : t : e;
}
function pe(t) {
  return Z.isValidElement(t);
}
function Xt(t) {
  return typeof t.type != "string" && t.type !== Z.Fragment;
}
function Nf(t) {
  if (Xt(t) && t.props.dragologyKey !== void 0) throw Error(`<${Te(t)}> has a dragologyKey, which only works on intrinsic elements. Wrap it in a <g dragologyKey=…> instead.`);
}
function jf(t) {
  if (t.type === "foreignObject") for (let e of Z.Children.toArray(t.props.children)) {
    if (Z.isValidElement(e) && Xt(e)) continue;
    let r = Z.isValidElement(e) ? `<${Te(e)}>` : JSON.stringify(e);
    throw Error(`<foreignObject> contains ${r}, but it may only contain component elements. Move the HTML into a component.`);
  }
}
function Te(t) {
  let e = t.type;
  return typeof e == "string" ? e : e.displayName ?? e.name;
}
function ar(t) {
  return !Xt(t) && t.type !== "defs" && !t.props.dragologyOpaque;
}
function ei(t) {
  let e = [], r = (n, i) => {
    if (Array.isArray(n)) n.forEach((s, a) => r(s, i === "" ? `.${a}` : `${i}:${a}`));
    else {
      if (n == null || typeof n == "boolean") return;
      if (Z.isValidElement(n) && n.key == null) e.push(Z.cloneElement(n, { key: i || ".0" }));
      else {
        if (Z.isValidElement(n) && !n.key.startsWith(".")) throw Error(`<${Te(n)}> has a key prop (${n.key}). Draggables match elements by id or dragologyKey, not key.`);
        e.push(n);
      }
    }
  };
  return r(t, ""), e;
}
function Ti(t, e, r) {
  let { children: n } = t.props;
  if (e && n && ar(t)) {
    let a = ei(n), o = !1, l = a.map((u, f) => {
      if (Z.isValidElement(u)) {
        let c = e(u, f);
        return c !== u && (o = !0), c;
      } else return u;
    });
    o && (r = { ...r, children: l });
  }
  if (!r) return t;
  let i = { ...t.props, ...r }, s = {};
  for (let [a, o] of Object.entries(i)) o !== void 0 && (s[a] = o);
  return t.key != null && (s.key = t.key), Z.createElement(t.type, s);
}
function De(t, e, r = "", n = []) {
  let i = Mi(r, t.props.transform || "");
  if (e(t)) return { element: t, accumulatedTransform: i, ancestors: n };
  let s = [...n, t];
  if (ar(t)) {
    let a = Z.Children.toArray(t.props.children);
    for (let o of a) if (Z.isValidElement(o)) {
      let l = De(o, e, i, s);
      if (l) return l;
    }
  }
  return null;
}
function dn(t, e) {
  return Ti(t, (r) => dn(r, e), e(t));
}
function ne(t) {
  return Object.keys(t);
}
function zf(t) {
  return Array.isArray(t);
}
var Wa = "data-path";
function or(t) {
  return t.props[Wa];
}
function Xa(t) {
  return Ya(t, "/");
}
function Ya(t, e) {
  let r = Xt(t) ? void 0 : t.props.id;
  Y(!r || !r.includes("/"), `Element id "${r}" contains a slash, which is not allowed.`);
  let n = r ? r + "/" : e;
  Y(!(typeof t.key == "string" && !t.key.startsWith(".")), `Element with path "${n}" has a key prop (${t.key}), which is not allowed.`), jf(t);
  let i = /* @__PURE__ */ new Set(), s = 0;
  return Ti(t, (a) => {
    Nf(a);
    let o, { dragologyKey: l } = a.props;
    return l === void 0 ? (o = String(s), s++) : (Y(!l.includes("/"), `Element dragologyKey "${l}" contains a slash, which is not allowed.`), o = l), Y(!i.has(o), `Duplicate path step "${o}" among siblings of path "${n}" (can happen when a dragologyKey collides with an unkeyed sibling's index).`), i.add(o), Ya(a, n + o + "/");
  }, { [Wa]: n });
}
function lr(t, e) {
  return De(e, (r) => or(r) === t);
}
function pn(t) {
  let e = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), n = Ha(t, e, r, null, "", 1, []);
  return n && (e = new Map([["", { element: n, stackingPath: [] }], ...e])), { byId: e, descendents: r };
}
function Lf(t) {
  return Y(/^\/(-?\d+)$/.test(t), `Invalid absolute dragologyZIndex "${t}". Expected format: "/<integer>" (e.g. "/5", "/-3").`), parseInt(t.slice(1), 10);
}
function Ha(t, e, r, n, i, s, a) {
  let o = t.props;
  if (o.dragologyZIndex !== void 0 && !o.id) throw Error(`dragologyZIndex can only be set on elements with an id attribute. Found dragologyZIndex="${o.dragologyZIndex}" on <${t.type}> without id.`);
  let l = Xt(t) ? void 0 : o.id, u = l || n, f = Mi(i, o.transform || ""), c = s * (o.opacity === void 0 ? 1 : Number(o.opacity)), h = a;
  if (l) {
    let y = o.dragologyZIndex;
    h = typeof y == "string" ? [Lf(y)] : [...a, y || 0];
  }
  let p = Ti(t, (y) => Ha(y, e, r, u, f, c, h));
  if (l) {
    if (Y(!e.has(l), `Duplicate id "${l}" found in SVG tree. Each element must have a unique id.`), n && (r.has(n) || r.set(n, /* @__PURE__ */ new Set()), r.get(n).add(l), r.has(l))) for (let g of r.get(l)) r.get(n).add(g);
    let y = ut(p, { key: l, transform: f || void 0, opacity: c === 1 ? void 0 : c });
    return e.set(l, { element: y, stackingPath: h }), null;
  } else return p;
}
function Vf(t, e) {
  let r = Math.min(t.length, e.length);
  for (let n = 0; n < r; n++) if (t[n] !== e[n]) return t[n] - e[n];
  return t.length === e.length ? 0 : t.length > e.length ? t[r] >= 0 ? 1 : -1 : e[r] >= 0 ? -1 : 1;
}
function ur(t) {
  return O(Qr, { children: Array.from(t.byId.entries()).sort(([e, r], [n, i]) => Vf(r.stackingPath, i.stackingPath)).map(([e, r]) => O(Vi, { children: dn(r.element, (n) => {
    Y(n.type !== Vi, "Please use <g> rather than <Fragment> / <> in draggables.");
    let i = {};
    for (let s of ne(n.props)) s.startsWith("dragology") && (i[s] = void 0);
    return i;
  }) }, e)) });
}
function Bs(t, e) {
  if (Y(t.descendents !== null, "layered.descendents is null"), !t.byId.has(e)) throw new Me(`Layered SVG does not contain id "${e}"`, W("p", { children: ["Available ids: ", O("code", { children: [...t.byId.keys()].join(", ") })] }));
  let r = /* @__PURE__ */ new Set([e]);
  if (t.descendents.has(e)) for (let o of t.descendents.get(e)) r.add(o);
  let n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  for (let [o, l] of t.byId.entries()) r.has(o) ? n.set(o, l) : i.set(o, l);
  let s = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
  for (let [o, l] of t.descendents.entries()) {
    let u = r.has(o), f = /* @__PURE__ */ new Set();
    for (let c of l) u === r.has(c) && f.add(c);
    f.size > 0 && (u ? s.set(o, f) : a.set(o, f));
  }
  return { remaining: { byId: i, descendents: a }, extracted: { byId: n, descendents: s } };
}
function Hr(t, e) {
  let r = new Map(t.byId);
  for (let [n, i] of e.byId.entries()) Y(!r.has(n), `Cannot merge LayeredSvgx: duplicate id "${n}" found`), r.set(n, i);
  return { byId: r, descendents: null };
}
function Nn(t, e) {
  let r = /* @__PURE__ */ new Map();
  for (let [n, i] of t.byId.entries()) {
    let s = Mi(e, i.element.props.transform || ""), a = ut(i.element, { transform: s || void 0 });
    r.set(n, { ...i, element: a });
  }
  return { byId: r, descendents: t.descendents };
}
function qa(t, e) {
  let r = /* @__PURE__ */ new Map();
  for (let [n, i] of t.byId.entries()) {
    let s = e + n, a = ut(i.element, { id: s, "data-path": s + "/" });
    r.set(s, { ...i, element: a });
  }
  return { byId: r, descendents: null };
}
function Ga(t, e) {
  let r = /* @__PURE__ */ new Map();
  for (let [n, i] of t.byId.entries()) r.set(n, { ...i, stackingPath: [e, ...i.stackingPath] });
  return { ...t, byId: r };
}
function Us(t, e) {
  let r = /* @__PURE__ */ new Map();
  for (let [n, i] of t.byId.entries()) r.set(n, { ...i, element: ut(i.element, e) });
  return { ...t, byId: r };
}
function Ka(t, e) {
  for (let r of e.byId.values()) {
    let n = lr(t, r.element);
    if (n) return n;
  }
  return null;
}
var Bf = ci(null);
function gn() {
  let t = ke(Bf);
  return Y(t !== null, "TreeViewContext not initialized"), t;
}
var Uf = "rgba(250, 204, 21, 0.25)", Qe = "rgb(250, 204, 21)", Wf = "rgba(148, 163, 184, 0.08)", Xf = "rgb(203, 213, 225)";
function Yf({ op: t, path: e }) {
  let { activePath: r, colorMap: n } = gn(), i = e + t.name;
  return t.treeView({ path: e, childPath: i + "/", active: r === i || r.startsWith(i + "/"), color: n?.get(i) });
}
function Ii({ renderedStates: t, closestIndex: e }) {
  let { svgWidth: r, svgHeight: n, thumbArea: i } = gn();
  if (r === 0 || n === 0) return null;
  let s = r / n, a = Math.round(Math.sqrt(i / s)), o = Math.round(a * s);
  return O("div", { style: { display: "flex", flexDirection: "row", gap: 3, flexWrap: "wrap", marginTop: 2 }, children: t.map((l, u) => O("svg", { width: o, height: a, viewBox: `0 0 ${r} ${n}`, style: { border: "1px solid rgb(203, 213, 225)", borderRadius: 3, background: "white", transition: "width 150ms ease, height 150ms ease", ...e === u ? { outline: `2px solid ${Qe}`, outlineOffset: -1 } : {} }, children: ur(l.layered) }, u)) });
}
function Ie({ outputPreview: t, active: e }) {
  let { svgWidth: r, svgHeight: n, thumbArea: i } = gn();
  if (r === 0 || n === 0) return null;
  let s = r / n, a = Math.round(Math.sqrt(i / s));
  return O("div", { style: { marginTop: 2, marginBottom: 4 }, children: W("svg", { width: Math.round(a * s), height: a, viewBox: `0 0 ${r} ${n}`, style: { border: "1px solid rgb(203, 213, 225)", borderRadius: 3, background: "white", transition: "width 150ms ease, height 150ms ease", ...e ? { outline: `2px solid ${Qe}`, outlineOffset: -1 } : {} }, children: [e && O("rect", { width: r, height: n, fill: Qe, opacity: 0.15 }), ur(t)] }) });
}
function ct({ label: t, active: e, color: r, path: n, children: i }) {
  let { nodeProps: s } = gn(), { tightFixed: a } = ke(hn), o = n === void 0 ? void 0 : s?.[n], l = r ? Hf(r, 0.15) : e ? Uf : Wf, u = r || (e ? Qe : Xf);
  return W("div", { style: { width: o?.width ?? "fit-content", height: o?.height, background: l, border: `1px solid ${u}`, borderRadius: 6, padding: "4px 6px", transition: "background 150ms, border-color 150ms", ...e ? r ? { outline: "2px solid black", outlineOffset: 1 } : { outline: `2px solid ${Qe}`, outlineOffset: -1 } : {} }, children: [O("div", { style: { color: e && !r ? "rgb(161, 98, 7)" : "rgb(100, 116, 139)", fontWeight: e ? 600 : 400, marginBottom: i ? 3 : 0, fontSize: a ? 15 : 10 }, children: t }), i] });
}
function ri({ label: t, children: e }) {
  return W("div", { style: { display: "flex", flexDirection: "column", gap: 1 }, children: [O("div", { style: { fontSize: 9, color: "rgb(148, 163, 184)", paddingLeft: 2 }, children: t }), e] });
}
function Za(t) {
  return t ? `${typeof t.easing == "function" ? "fn" : t.easing} ${t.duration}ms` : "none";
}
function Qa(t, e) {
  return t.length <= e ? t : t.slice(0, e - 1) + "…";
}
function Hf(t, e) {
  let r = t.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  return r ? `rgba(${r[1]}, ${r[2]}, ${r[3]}, ${e})` : t;
}
var Ja = class extends Error {
  constructor(t, e) {
    super(`Coincident points at indices ${t} and ${e}`), this.indexA = t, this.indexB = e, this.name = "CoincidentPointsError";
  }
}, qf = class {
  constructor(t) {
    M(this, "_inner");
    this._inner = gi.from(t.map((i) => L(i).arr()));
    let e = this._inner.inedges, r = this._inner.points, n = r.length / 2;
    for (let i = 0; i < n; i++) if (e[i] === -1) {
      for (let s = 0; s < n; s++) if (s !== i && r[2 * i] === r[2 * s] && r[2 * i + 1] === r[2 * s + 1]) throw new Ja(Math.min(i, s), Math.max(i, s));
      throw Error(`Point ${i} was excluded from triangulation for unknown reasons`);
    }
  }
  get d3() {
    return this._inner;
  }
  point(t) {
    return L(this._inner.points[2 * t], this._inner.points[2 * t + 1]);
  }
  numPoints() {
    return this._inner.points.length / 2;
  }
  triangle(t) {
    return [this.point(this._inner.triangles[3 * t + 0]), this.point(this._inner.triangles[3 * t + 1]), this.point(this._inner.triangles[3 * t + 2])];
  }
  numTriangles() {
    return this._inner.triangles.length / 3;
  }
  triangles() {
    return this.numPoints() < 2 ? [] : ba(this.numTriangles()).map((t) => this.triangle(t));
  }
  findTriangle(t, { edge: e = 0, limit: r = 1 / 0 } = {}) {
    if (this.numPoints() < 3 || isNaN(e)) return -1;
    let { triangles: n, halfedges: i, points: s } = this._inner, a = (c) => c % 3 == 0 ? c + 2 : c - 1, o = (c) => c % 3 == 2 ? c - 2 : c + 1, l = e, u = l, f = 0;
    for (; ; ) {
      if (r-- <= 0) return -1;
      let c = o(l), h = n[l] * 2, p = n[c] * 2;
      if (Gf(s[h], s[h + 1], s[p], s[p + 1], t.x, t.y) >= 0) {
        if (u === (l = c)) break;
      } else {
        if ((l = i[l]) === -1) break;
        u = l = ++f % 2 ? o(l) : a(l);
      }
    }
    return l > -1 ? Math.floor(l / 3) : -1;
  }
  projectOntoConvexHull(t) {
    if (this.numPoints() === 1) {
      let x = L(this._inner.points[0], this._inner.points[1]);
      return { type: "vertex", ptIdx: 0, projectedPt: x, dist: t.dist(x) };
    }
    let e = (x) => L(this._inner.points[2 * x], this._inner.points[2 * x + 1]), r = this.findTriangle(t);
    if (r !== -1 && !Ws(this._inner)) {
      let x = this._inner.triangles[3 * r + 0], P = this._inner.triangles[3 * r + 1], m = this._inner.triangles[3 * r + 2], d = /* @__PURE__ */ new Set([x, P, m]);
      if (Y(d.size >= 2), d.size === 2) {
        let [E, V] = Array.from(d), z = e(E), S = e(V).sub(z), D = S.len2();
        Y(D > 0);
        let R = t.sub(z).dot(S) / D;
        return Af(R >= 0 && R <= 1, "t out of range in projectOntoConvexHull"), { type: "edge", ptIdx0: E, ptIdx1: V, t: R, projectedPt: t, dist: 0 };
      } else return { type: "triangle", ptIdx0: x, ptIdx1: P, ptIdx2: m, barycentric: Kf(t, e(x), e(P), e(m)), projectedPt: t, dist: 0 };
    }
    let n = Ws(this._inner), i = n ? [...n, ...ih(n.slice(1, n.length - 1))] : this._inner.hull, s = this._inner.points, a = t.x, o = t.y, l = 1 / 0, u = "vertex", f = 0, c = 0, h = 0, p = 0, y = 0, g = 0;
    for (let x = 0; x < i.length; x++) {
      let P = i[x], m = i[(x + 1) % i.length], d = s[2 * P], E = s[2 * P + 1], V = s[2 * m], z = s[2 * m + 1], S = V - d, D = z - E, R = S * S + D * D;
      if (R < 1e-10) {
        let $ = (a - d) * (a - d) + (o - E) * (o - E);
        $ < l && (l = $, u = "vertex", f = P, y = d, g = E);
        continue;
      }
      let I = Math.max(0, Math.min(1, ((a - d) * S + (o - E) * D) / R)), j = d + I * S, w = E + I * D, C = (a - j) * (a - j) + (o - w) * (o - w);
      C < l && (l = C, y = j, g = w, I < 1e-6 ? (u = "vertex", f = P) : I > 0.999999 ? (u = "vertex", f = m) : (u = "edge", c = P, h = m, p = I));
    }
    let v = Math.sqrt(l), b = L(y, g);
    return u === "vertex" ? { type: "vertex", ptIdx: f, projectedPt: b, dist: v } : { type: "edge", ptIdx0: c, ptIdx1: h, t: p, projectedPt: b, dist: v };
  }
};
function Gf(t, e, r, n, i, s) {
  return Math.sign((i - r) * (n - e) - (s - n) * (r - t));
}
function Kf(t, e, r, n) {
  let i = t.x, s = t.y, a = e.x, o = e.y, l = r.x, u = r.y, f = n.x, c = n.y, h = (u - c) * (a - f) + (f - l) * (o - c), p = ((u - c) * (i - f) + (f - l) * (s - c)) / h, y = ((c - o) * (i - f) + (a - f) * (s - c)) / h;
  return { l0: p, l1: y, l2: 1 - p - y };
}
function Ws(t) {
  return t.collinear;
}
function Qt(t) {
  return t % 3 == 2 ? t - 2 : t + 1;
}
function Zf(t, e, r) {
  let n = r?.coincidenceTolerance2 ?? 1e-20, i = t.d3, s = i.points, { triangles: a, halfedges: o } = i, l = e.x, u = e.y, f = i.find(l, u), c = s[2 * f] - l, h = s[2 * f + 1] - u;
  if (c * c + h * h < n) {
    let w = /* @__PURE__ */ new Map();
    return w.set(f, 1), { weights: w, barycentricDeviation: 0 };
  }
  let p = Qf(s, i.hull, l, u);
  if (p !== null) return Jf(s, p, l, u);
  let y = t.findTriangle(L(l, u));
  if (y === -1) {
    let w = t.projectOntoConvexHull(L(l, u));
    if (w.type === "vertex") {
      let C = /* @__PURE__ */ new Map();
      return C.set(w.ptIdx, 1), { weights: C, barycentricDeviation: 0 };
    }
    if (w.type === "edge") {
      let C = /* @__PURE__ */ new Map();
      return C.set(w.ptIdx0, 1 - w.t), C.set(w.ptIdx1, w.t), { weights: C, barycentricDeviation: 0 };
    }
    return null;
  }
  let g = a.length / 3, v = new Uint8Array(g), b = [y];
  for (v[y] = 1; b.length > 0; ) {
    let w = b.pop();
    for (let C = 0; C < 3; C++) {
      let $ = o[3 * w + C];
      if ($ === -1) continue;
      let k = Math.floor($ / 3);
      v[k] || ed(s, a, k, l, u) && (v[k] = 1, b.push(k));
    }
  }
  let x = [];
  for (let w = 0; w < g; w++) if (v[w]) for (let C = 0; C < 3; C++) {
    let $ = 3 * w + C, k = o[$];
    (k === -1 || !v[Math.floor(k / 3)]) && x.push($);
  }
  if (x.length < 3) return null;
  let P = td(x, a);
  if (P === null) return null;
  let m = P.length, d = Array(m), E = Array(m), V = Array(m);
  for (let w = 0; w < m; w++) {
    let C = a[P[w]];
    d[w] = C, E[w] = s[2 * C] - l, V[w] = s[2 * C + 1] - u;
  }
  let z = new Float64Array(m), S = 0, D = null;
  for (let w = 0; w < m; w++) {
    let C = (w + 1) % m, $ = (C + 1) % m, k = E[w], B = V[w], N = E[C], X = V[C], A = E[$], T = V[$], _ = (k + N) / 2, tt = (B + X) / 2, F = (N + A) / 2, yt = (X + T) / 2, K = D ?? ni(k, B, N, X, 0, 0), U = ni(N, X, A, T, 0, 0);
    D = U;
    let ot = _ * K.y - K.x * tt + (K.x * U.y - U.x * K.y) + (U.x * yt - F * U.y), ht = P[w], lt = P[C], q = Qt(ht), Q = $r(s, a, q, l, u), rt = _ * Q.y - Q.x * tt, bt = 0;
    for (; q !== lt && bt < 1e3; ) {
      bt++;
      let Yt = o[q];
      if (Yt === -1) {
        let Ht = a[q], $t = a[Qt(q)], qt = s[2 * $t] - s[2 * Ht], Gt = s[2 * $t + 1] - s[2 * Ht + 1], Fe = Math.sqrt(qt * qt + Gt * Gt), Kt = 1e8, zt = (s[2 * Ht] + s[2 * $t]) / 2 - l, Ne = (s[2 * Ht + 1] + s[2 * $t + 1]) / 2 - u, Zt = { x: zt + Gt / Fe * Kt, y: Ne + -qt / Fe * Kt };
        rt += Q.x * Zt.y - Zt.x * Q.y, Q = Zt;
        let nt = Qt(lt), ft = $r(s, a, nt, l, u), xt = 0, he = 0;
        for (; he < 1e3; ) {
          he++;
          let Ni = o[nt];
          if (Ni === -1) {
            let yr = a[nt], mr = a[Qt(nt)], wn = s[2 * mr] - s[2 * yr], _n = s[2 * mr + 1] - s[2 * yr + 1], ji = Math.sqrt(wn * wn + _n * _n), zi = { x: (s[2 * yr] + s[2 * mr]) / 2 - l + _n / ji * Kt, y: (s[2 * yr + 1] + s[2 * mr + 1]) / 2 - u + -wn / ji * Kt };
            rt += Q.x * zi.y - zi.x * Q.y, Q = ft;
            break;
          }
          nt = Qt(Ni);
          let vn = $r(s, a, nt, l, u);
          xt += ft.x * vn.y - vn.x * ft.y, ft = vn;
        }
        rt += xt;
        break;
      }
      q = Qt(Yt);
      let jt = $r(s, a, q, l, u);
      rt += Q.x * jt.y - jt.x * Q.y, Q = jt;
    }
    rt += Q.x * yt - F * Q.y;
    let Nt = ot - rt;
    S += Nt, z[C] += Nt;
  }
  if (Math.abs(S) < 1e-30) return null;
  let R = /* @__PURE__ */ new Map();
  for (let w = 0; w < m; w++) R.set(d[w], z[w] / S);
  let I = 0, j = 0;
  for (let w = 0; w < m; w++) {
    let C = z[w] / S;
    I += C * E[w], j += C * V[w];
  }
  return { weights: R, barycentricDeviation: Math.sqrt(I * I + j * j) };
}
function Qf(t, e, r, n, i = 1e-10) {
  for (let s = 0; s < e.length; s++) {
    let a = e[s], o = e[(s + 1) % e.length], l = t[2 * a], u = t[2 * a + 1], f = t[2 * o], c = t[2 * o + 1], h = f - l, p = c - u, y = h * h + p * p;
    if (y < 1e-30) continue;
    let g = ((r - l) * h + (n - u) * p) / y;
    if (g < -i || g > 1 + i) continue;
    let v = (r - l) * p - (n - u) * h;
    if (v * v / y < i * i * y) return [a, o];
  }
  return null;
}
function Jf(t, [e, r], n, i) {
  let s = t[2 * e], a = t[2 * e + 1], o = t[2 * r], l = t[2 * r + 1], u = o - s, f = l - a, c = u * u + f * f, h = c > 0 ? ((n - s) * u + (i - a) * f) / c : 0.5, p = /* @__PURE__ */ new Map();
  return p.set(e, 1 - h), p.set(r, h), { weights: p, barycentricDeviation: 0 };
}
function td(t, e) {
  if (t.length === 0) return null;
  let r = (a) => e[Qt(a)], n = /* @__PURE__ */ new Map();
  for (let a of t) n.set(e[a], a);
  let i = [], s = t[0];
  for (let a = 0; a < t.length; a++) {
    i.push(s);
    let o = r(s), l = n.get(o);
    if (l === void 0) return null;
    s = l;
  }
  return r(i[i.length - 1]) === e[i[0]] ? i : null;
}
function ed(t, e, r, n, i) {
  let s = e[3 * r], a = e[3 * r + 1], o = e[3 * r + 2], l = t[2 * s] - n, u = t[2 * s + 1] - i, f = t[2 * a] - n, c = t[2 * a + 1] - i, h = t[2 * o] - n, p = t[2 * o + 1] - i, y = (l * l + u * u) * (f * p - h * c) + (f * f + c * c) * (h * u - l * p) + (h * h + p * p) * (l * c - f * u);
  return ((f - l) * (p - u) - (c - u) * (h - l)) * y > 0;
}
function ni(t, e, r, n, i, s) {
  let a = 2 * (t * (n - s) + r * (s - e) + i * (e - n));
  if (Math.abs(a) < 1e-30) return { x: (t + r + i) / 3, y: (e + n + s) / 3 };
  let o = t * t + e * e, l = r * r + n * n, u = i * i + s * s;
  return { x: (o * (n - s) + l * (s - e) + u * (e - n)) / a, y: (o * (i - r) + l * (t - i) + u * (r - t)) / a };
}
function $r(t, e, r, n, i) {
  let s = Math.floor(r / 3), a = e[3 * s], o = e[3 * s + 1], l = e[3 * s + 2];
  return ni(t[2 * a] - n, t[2 * a + 1] - i, t[2 * o] - n, t[2 * o + 1] - i, t[2 * l] - n, t[2 * l + 1] - i);
}
function Ct({ op: t, active: e = !0 }) {
  let { overlayFullOpacity: r } = ke(hn), n = r ? 1 : e ? 0.8 : 0.2;
  return t.overlayVis({ active: e, opacity: n });
}
function cr({ from: t, to: e, distance: r }) {
  let { overlayHideDistances: n } = ke(hn), [i, s] = r === 1 / 0 ? ["∞", 24] : [`${Math.round(r)}px`, 11];
  return W("g", { children: [O("line", { ...t.xy1(), ...e.xy2(), stroke: "white", strokeWidth: 5, strokeLinecap: "round" }), O("line", { ...t.xy1(), ...e.xy2(), stroke: "magenta", strokeWidth: 1.5, strokeDasharray: "4 3" }), !n && O("text", { ...t.lerp(e, 0.5).xy(), fill: "magenta", stroke: "white", strokeWidth: 3, paintOrder: "stroke", fontSize: s, fontFamily: "monospace", textAnchor: "middle", dominantBaseline: "central", children: i })] });
}
var St = class {
  constructor(t) {
    M(this, "children", []);
    M(this, "frames", 0);
    M(this, "lastFrame");
    this.ctx = t;
  }
  child(t, e, r = this.ctx) {
    let n = new rd(t, e, r), i = this.children.findIndex((s) => s.key === t);
    return i === -1 ? this.children.push(n) : this.children[i] = n, n;
  }
}, gt = class extends St {
  constructor(e, r, n = e) {
    super(e);
    M(this, "inner");
    this.inner = this.child(null, r, n);
  }
  treeView(e) {
    return this.wrapperView(e);
  }
  overlayVis({ active: e }) {
    return O(Ct, { op: this.inner.op, active: e });
  }
  wrapperView(e, r) {
    return O(ct, { label: r ? `${this.name} (${r})` : this.name, path: e.path, children: this.inner.treeView(e) });
  }
}, rd = class {
  constructor(t, e, r) {
    M(this, "op");
    M(this, "behavior");
    this.key = t, this.op = new e.opClass(r, ...e.args), this.behavior = to(this.op);
  }
  run(t) {
    let { op: e, activePath: r, ...n } = this.behavior(t);
    return { ...n, activePath: Ai(this.key, r) };
  }
  treeView({ childPath: t }) {
    return O(Yf, { op: this.op, path: this.key === null ? t : `${t}${this.key}/` }, this.key);
  }
};
function to(t) {
  return (e) => {
    let { activePath: r, ...n } = t.frame(e);
    return t.frames++, t.lastFrame = e, { ...n, activePath: Ai(t.name, r), op: t };
  };
}
function Ai(...t) {
  return t.filter((e) => e != null).join("/");
}
var ye = { empty: !0 };
function nd(t, e) {
  return e.empty ? !1 : t.x >= e.minX && t.x <= e.maxX && t.y >= e.minY && t.y <= e.maxY;
}
function ii(t, e) {
  return t.empty ? e : e.empty ? t : { empty: !1, minX: Math.min(t.minX, e.minX), minY: Math.min(t.minY, e.minY), maxX: Math.max(t.maxX, e.maxX), maxY: Math.max(t.maxY, e.maxY) };
}
function eo(t, e) {
  if (t.empty) return t;
  let r = Xr(e);
  if (r.length === 0) return t;
  let n = [L(t.minX, t.minY), L(t.maxX, t.minY), L(t.maxX, t.maxY), L(t.minX, t.maxY)].map((i) => ue(r, i));
  return { empty: !1, minX: Math.min(...n.map((i) => i.x)), minY: Math.min(...n.map((i) => i.y)), maxX: Math.max(...n.map((i) => i.x)), maxY: Math.max(...n.map((i) => i.y)) };
}
function ki(t, e) {
  let r = Ci(t);
  return e ? eo(r, e) : r;
}
function Ci(t) {
  let e = t.props, r = t.type;
  if (r === "rect" || r === "foreignObject" || r === "image") {
    let s = Number(e.x) || 0, a = Number(e.y) || 0, o = Number(e.width) || 0, l = Number(e.height) || 0;
    return { empty: !1, minX: s, minY: a, maxX: s + o, maxY: a + l };
  }
  if (r === "circle") {
    let s = Number(e.cx) || 0, a = Number(e.cy) || 0, o = Number(e.r) || 0;
    return { empty: !1, minX: s - o, minY: a - o, maxX: s + o, maxY: a + o };
  }
  if (r === "ellipse") {
    let s = Number(e.cx) || 0, a = Number(e.cy) || 0, o = Number(e.rx) || 0, l = Number(e.ry) || 0;
    return { empty: !1, minX: s - o, minY: a - l, maxX: s + o, maxY: a + l };
  }
  if (r === "line") {
    let s = Number(e.x1) || 0, a = Number(e.y1) || 0, o = Number(e.x2) || 0, l = Number(e.y2) || 0;
    return { empty: !1, minX: Math.min(s, o), minY: Math.min(a, l), maxX: Math.max(s, o), maxY: Math.max(a, l) };
  }
  if (r === "polygon" || r === "polyline") {
    let s = String(e.points ?? "").trim().split(/[\s,]+/).filter((o) => o !== "").map(Number), a = ye;
    for (let o = 0; o + 1 < s.length; o += 2) {
      let [l, u] = [s[o], s[o + 1]];
      !Number.isFinite(l) || !Number.isFinite(u) || (a = ii(a, { empty: !1, minX: l, minY: u, maxX: l, maxY: u }));
    }
    return a;
  }
  if (!ar(t)) return ye;
  let n = e.children;
  if (n == null) return ye;
  let i = ye;
  for (let s of Z.Children.toArray(n)) {
    if (!Z.isValidElement(s)) continue;
    let a = Ci(s), o = s.props.transform, l = o ? eo(a, o) : a;
    i = ii(i, l);
  }
  return i;
}
function si(t) {
  return L((t.minX + t.maxX) / 2, (t.minY + t.maxY) / 2);
}
function kr(...t) {
  let { x: e, y: r } = L(...t);
  return `translate(${e},${r}) `;
}
function ro(t, e = L(0)) {
  let { x: r, y: n } = L(e);
  return `rotate(${t},${r},${n}) `;
}
function qp(t, e = L(0)) {
  return ro(t * 180 / Math.PI, e);
}
function id(t, e) {
  return e === void 0 && (e = t), `scale(${t},${e}) `;
}
function sd(...t) {
  return t.map((e) => typeof e == "string" ? e : typeof e == "number" ? e.toString() : L(e).str()).join(" ");
}
function Gp(t, e) {
  let r = L(t), n = L(e).sub(r);
  return { transform: kr(r) + ro(n.angleDeg()) + id(n.len()), x1: 0, y1: 0, x2: 1, y2: 0, vectorEffect: "non-scaling-stroke" };
}
function ad(t) {
  return [...t.byId.values()].reduce((e, { element: r }) => ii(e, ki(r, r.props.transform ?? "")), ye);
}
function od(t) {
  return O("pre", { style: { margin: 0, fontSize: "11px", whiteSpace: "pre-wrap", wordBreak: "break-word" }, children: t.kind === "state" ? Ri(t.value) : io(t.value) });
}
var no = ci(od);
function Kp({ component: t, children: e }) {
  return O(no.Provider, { value: t, children: e });
}
function ai(t) {
  return O(ke(no), { ...t });
}
function Ri(t) {
  let e = [];
  try {
    return JSON.stringify(t, function(r, n) {
      for (; e.length > 0 && e.at(-1) !== this; ) e.pop();
      if (typeof n == "object" && n) {
        if (e.includes(n)) return "[Circular]";
        e.push(n);
      }
      return ld(n);
    }, 2) ?? String(t);
  } catch {
    return String(t);
  }
}
function ld(t) {
  return typeof t == "number" && !Number.isInteger(t) ? Math.round(t * 100) / 100 : typeof t == "function" ? `[Function ${t.name || "anonymous"}]` : typeof t == "bigint" ? `${t}n` : typeof t == "symbol" ? t.toString() : t instanceof Map ? Object.fromEntries(t) : t instanceof Set ? [...t] : t;
}
function io(t, e = "") {
  if (!Z.isValidElement(t)) return e + (typeof t == "string" ? t : Ri(t));
  let r = t, n = Te(r) ?? "", { children: i, ...s } = r.props, a = Object.entries(s).filter(([, l]) => l !== void 0).map(([l, u]) => ` ${l}=${ud(u)}`).join(""), o = Z.Children.toArray(i);
  return o.length === 0 ? `${e}<${n}${a} />` : [`${e}<${n}${a}>`, ...o.map((l) => io(l, e + "  ")), `${e}</${n}>`].join(`
`);
}
function ud(t) {
  return typeof t == "string" ? JSON.stringify(t) : typeof t == "function" ? "{ƒ}" : `{${Ri(t).replace(/\s*\n\s*/g, " ")}}`;
}
var cd = /* @__PURE__ */ new Set(["fill", "stroke", "color", "stop-color", "flood-color", "lighting-color", "backgroundColor", "borderColor", "outlineColor"]), Cr = Yh, Xs = /* @__PURE__ */ new Set(["pointerEvents", "cursor"]), Ys = { opacity: 1 };
function Hs(t) {
  let e = t.trim().split(/[\s,]+/).filter((n) => n.length > 0).map((n) => parseFloat(n)), r = [];
  for (let n = 0; n < e.length; n += 2) r.push([e[n], e[n + 1]]);
  return r;
}
function hd(t) {
  return t.map((e) => `${e[0]},${e[1]}`).join(" ");
}
function fd(t, e, r) {
  let n = Hs(t), i = Hs(e);
  if (n.length !== i.length) throw Error(`Cannot lerp points: different point counts (${n.length} vs ${i.length})`);
  return hd(n.map((s, a) => {
    let o = i[a];
    return [J(s[0], o[0], r), J(s[1], o[1], r)];
  }));
}
function oi(t, e, r, n) {
  if (e === r || (e ?? (e = Ys[t]), r ?? (r = Ys[t]), e !== void 0 && r === void 0)) return e;
  if (e === void 0 && r !== void 0) return r;
  if (typeof e == "number" && typeof r == "number") return J(e, r, n);
  if (t === "points" && typeof e == "string" && typeof r == "string") return fd(e, r, n);
  if (t === "d" && typeof e == "string" && typeof r == "string") return af(e, r)(n);
  if (cd.has(t) && typeof e == "string" && typeof r == "string") {
    let i = e === "none";
    if (i || r === "none") {
      let s = i ? r : e, a = be(s);
      if (a === null) throw Error(`Cannot lerp prop "${t}": invalid color value (${s})`);
      let o = be(a.r, a.g, a.b, 0), l = be(a.r, a.g, a.b, 1);
      return (i ? Cr(o.formatRgb(), l.formatRgb()) : Cr(l.formatRgb(), o.formatRgb()))(n);
    }
    return Cr(e, r)(n);
  } else if ((t === "filter" || t === "WebkitFilter") && typeof e == "string" && typeof r == "string") {
    let i = bd(e, r, n);
    if (i) return i;
    throw Error(`Cannot lerp prop "${t}": unrecognized filter values (${e} vs ${r})`);
  } else if (typeof e == "string" && typeof r == "string") {
    let i = parseFloat(e), s = parseFloat(r);
    if (!isNaN(i) && !isNaN(s)) return String(J(i, s, n));
    throw Error(`Cannot lerp prop "${t}": different non-numeric values (${e} vs ${r})`);
  } else throw Error(`Cannot lerp prop "${t}": different non-numeric values (${e} vs ${r})`);
}
function qr(t, e) {
  if (Xt(t)) return e >= 0.5 ? t : null;
  let r = +(t.props.opacity ?? 1) * e;
  return r <= 1e-3 ? null : ut(t, { opacity: r });
}
function so(t, e, r, n = "a") {
  if (t.type !== e.type) throw new Me(`Cannot lerp between different element types: ${String(t.type)} and ${String(e.type)}`, W(Qr, { children: [O("p", { style: { marginBottom: 8 }, children: `During interpolation, I found elements of different types at the same path in the "before" and "after" SVG trees. I don't know how to interpolate between those, sorry.` }), t.props.id !== void 0 && t.props.id === e.props.id && W("p", { style: { marginBottom: 8 }, children: ["(FYI: These elements share the ID", " ", O("span", { style: { fontFamily: "monospace" }, children: t.props.id }), ". I would guess that you are drawing this element in two different code paths, and they don't match up.)"] }), O(ai, { kind: "svg", value: t }), O("div", { style: { marginTop: 16, marginBottom: 16 }, children: "vs" }), O(ai, { kind: "svg", value: e })] }));
  if (Xt(t)) return dd(t, e, r, n);
  let i = t.props, s = e.props, a = n === "b", o = Ff(i.transform || "", s.transform || "", r), l = {}, u = /* @__PURE__ */ new Set([...ne(i), ...ne(s)]);
  for (let g of u) {
    if (g === "children" || g === "transform") continue;
    if (g.startsWith("data-") || g.startsWith("dragology") || /^on[A-Z]/.test(g) || Xs.has(g)) {
      a && (l[g] = s[g]);
      continue;
    }
    let v = i[g], b = s[g];
    if (g === "style" && typeof v == "object" && typeof b == "object") {
      let x = v || {}, P = b || {}, m = {}, d = /* @__PURE__ */ new Set([...ne(x), ...ne(P)]);
      for (let E of d) {
        if (Xs.has(E)) {
          m[E] = (a ? P : x)[E];
          continue;
        }
        m[E] = oi(E, x[E], P[E], r);
      }
      l[g] = m;
    } else l[g] = oi(g, v, b, r);
  }
  if (!ar(t)) return Z.cloneElement(t, { ...l, ...o ? { transform: o } : {}, children: (a ? s : i).children });
  let f = ei(i.children), c = ei(s.children), h = [], p = /* @__PURE__ */ new Map(), y = (g, v) => {
    let b = 0;
    for (let x of g) {
      let P = pe(x) ? x.props.dragologyKey : void 0, m = P === void 0 ? String(b++) : P, d = p.get(m) ?? {};
      d[v] = x, p.set(m, d);
    }
  };
  y(f, "a"), y(c, "b");
  for (let { a: g, b: v } of p.values()) if (g !== void 0 && v !== void 0) pe(g) && pe(v) ? h.push(so(g, v, r, n)) : h.push(a ? v : g);
  else if (g !== void 0 && pe(g)) {
    let b = qr(g, 1 - r);
    b && h.push(b);
  } else if (v !== void 0 && pe(v)) {
    let b = qr(v, r);
    b && h.push(b);
  }
  return Z.cloneElement(t, { ...l, ...o ? { transform: o } : {}, children: h.length === 0 ? void 0 : h });
}
function dd(t, e, r, n) {
  let i = n === "b", s = i ? ut(e, { key: t.key ?? void 0 }) : t, { dragologyLerpProps: a } = s.props;
  if (!a) return s;
  let o = a === !0 ? /* @__PURE__ */ new Set([...ne(t.props), ...ne(e.props)]) : a;
  a !== !0 && pd(o, t, e);
  let l = {};
  for (let u of o) u === "children" || u.startsWith("data-") || u.startsWith("dragology") || typeof t.props[u] == "function" || (l[u] = li(u, t.props[u], e.props[u], r, i));
  return ut(s, l);
}
var qs = /* @__PURE__ */ new Set();
function pd(t, e, r) {
  for (let n of t) {
    if (n in e.props || n in r.props) continue;
    let i = `${Te(e)}.${n}`;
    qs.has(i) || (qs.add(i), console.warn(`dragologyLerpProps on <${Te(e)}> lists "${n}", but it has no prop by that name.`));
  }
}
function li(t, e, r, n, i) {
  if (e === r) return e;
  let s = i ? r : e;
  if (Array.isArray(e) && Array.isArray(r)) return e.length === r.length ? e.map((a, o) => li(t, a, r[o], n, i)) : s;
  if (Gs(e) && Gs(r)) {
    let a = Object.keys(e), o = Object.keys(r);
    return a.length !== o.length || !a.every((l) => Object.hasOwn(r, l)) ? s : Object.fromEntries(a.map((l) => [l, li(l, e[l], r[l], n, i)]));
  }
  if (typeof e == "string" && typeof r == "string" && He(e) && He(r)) return Cr(e, r)(n);
  try {
    return oi(t, e, r, n);
  } catch {
    return s;
  }
}
function Gs(t) {
  if (typeof t != "object" || !t) return !1;
  let e = Object.getPrototypeOf(t);
  return e === Object.prototype || e === null;
}
var gd = /^drop-shadow\(\s*([\d.+-]+)(?:px)?\s+([\d.+-]+)(?:px)?\s+([\d.+-]+)(?:px)?\s+rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)\s*\)$/;
function Ks(t) {
  let e = t.match(gd);
  return e ? { offsetX: parseFloat(e[1]), offsetY: parseFloat(e[2]), blur: parseFloat(e[3]), r: parseFloat(e[4]), g: parseFloat(e[5]), b: parseFloat(e[6]), a: parseFloat(e[7]) } : null;
}
function yd(t) {
  return `drop-shadow(${t.offsetX}px ${t.offsetY}px ${t.blur}px rgba(${t.r},${t.g},${t.b},${t.a}))`;
}
function md(t, e, r) {
  return yd({ offsetX: J(t.offsetX, e.offsetX, r), offsetY: J(t.offsetY, e.offsetY, r), blur: J(t.blur, e.blur, r), r: J(t.r, e.r, r), g: J(t.g, e.g, r), b: J(t.b, e.b, r), a: J(t.a, e.a, r) });
}
function bd(t, e, r) {
  let n = Ks(t), i = Ks(e);
  return n && i ? md(n, i, r) : null;
}
function Or(t) {
  let e = Z.Children.toArray(t.props.children), r = null, n = null, i = null;
  for (let s of e) if (Z.isValidElement(s)) {
    if (s.type === "rect" && r === null) {
      let a = s.props;
      r = parseFloat(a.width), n = parseFloat(a.height);
    } else if (s.type === "text" && i === null) {
      let a = s.props;
      i = parseFloat(a.y);
    }
  }
  return r !== null && n !== null && !isNaN(r) && !isNaN(n) ? { rectWidth: r, rectHeight: n, textY: i !== null && !isNaN(i) ? i : null } : null;
}
function Zs(t, e) {
  let r = t.props, n = Z.Children.toArray(r.children), i = !1, s = !1;
  return ut(t, { children: n.map((a) => {
    if (Z.isValidElement(a)) {
      if (!i && a.type === "rect") return i = !0, ut(a, { width: e.rectWidth, height: e.rectHeight });
      if (!s && a.type === "text" && e.textY !== null) return s = !0, ut(a, { y: e.textY });
    }
    return a;
  }) });
}
function xd(t, e) {
  let r = e.props.transform || "", n = t.props.dragologyEmergeMode;
  if (n === "clone") {
    let i = Or(e), s = Or(t);
    return ut(i && s ? Zs(t, i) : t, { transform: r || void 0 });
  }
  if (n !== "scale") {
    let i = Or(e), s = Or(t);
    if (i && s) return ut(Zs(t, i), { transform: r || void 0, opacity: 0 });
  }
  return ut(t, { transform: r + " scale(0)", opacity: 0 });
}
function Qs(t, e, r) {
  for (let [n, i] of e) if (!t.has(n)) {
    let s = i.element.props.dragologyEmergeFrom;
    if (s && typeof s == "string") {
      let a = r.get(s);
      a && t.set(n, { element: xd(i.element, a.element), stackingPath: i.stackingPath });
    }
  }
}
function ao(t, e, r, n) {
  let i = new Map(t.byId), s = new Map(e.byId);
  Qs(i, e.byId, t.byId), Qs(s, t.byId, e.byId);
  let a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set([...i.keys(), ...s.keys()]);
  for (let u of o) {
    let f = i.get(u), c = s.get(u);
    if (f && c) a.set(u, { element: so(f.element, c.element, r, n), stackingPath: (n === "b" ? c : f).stackingPath });
    else if (f) {
      let h = qr(f.element, 1 - r);
      h && a.set(u, { element: h, stackingPath: f.stackingPath });
    } else if (c) {
      let h = qr(c.element, r);
      h && a.set(u, { element: h, stackingPath: c.stackingPath });
    }
  }
  let l = null;
  if (t.descendents && e.descendents) {
    l = new Map(t.descendents);
    for (let [u, f] of e.descendents) {
      let c = l.get(u);
      if (c) for (let h of f) c.add(h);
      else l.set(u, new Set(f));
    }
  } else l = t.descendents ?? e.descendents;
  return { byId: a, descendents: l };
}
function vd(t, e) {
  let r = [...e.entries()].filter(([, a]) => a > 1e-10).sort((a, o) => a[0] - o[0]);
  if (r.length === 0) return t[0];
  if (r.length === 1) return t[r[0][0]];
  let n = r.reduce((a, o) => o[1] > a[1] ? o : a)[0], i = t[r[0][0]], s = r[0][1];
  for (let a = 1; a < r.length; a++) {
    let [o, l] = r[a], u = l / (s + l);
    i = ao(i, t[o], u, o === n ? "b" : "a"), s += l;
  }
  return i;
}
function hr(t) {
  let e = [];
  function r(n) {
    n == null || n === !1 || (zf(n) ? n.forEach(r) : e.push(n));
  }
  return r(t), e;
}
function yn(t, e) {
  return typeof t == "function" ? yn(t(e), e) : t;
}
function Mr(t, ...e) {
  let r = [];
  function n(i) {
    for (let s of hr(i)) typeof s == "function" ? n(s(...e)) : r.push(s);
  }
  return n(t), r;
}
function oo(t) {
  return G(lo)(t);
}
function wd(t) {
  return t.opClass === lo ? t.args[0] : void 0;
}
var lo = class extends St {
  constructor(e, r) {
    super(e);
    M(this, "name", "fixed");
    M(this, "position");
    M(this, "rendered");
    this.state = r, this.position = xn(e, r);
  }
  get outputPreview() {
    return this.rendered ?? (this.rendered = Rt(this.ctx, this.state));
  }
  fuzzDropPositions() {
    return this.position ? [this.position] : [];
  }
  frame(e) {
    return { preview: () => this.outputPreview, dropState: this.state, gap: this.position ? e.pointer.dist(this.position) : 1 / 0, grabPos: this.position ?? void 0 };
  }
  treeView(e) {
    return O(_d, { op: this, ...e });
  }
  overlayVis({ opacity: e }) {
    let r = this.position;
    if (!this.lastFrame || !r) return null;
    let { pointer: n } = this.lastFrame;
    return W("g", { opacity: e, children: [O("circle", { cx: r.x, cy: r.y, r: 4, fill: "none", stroke: "magenta", strokeWidth: 1.5 }), O(cr, { from: r, to: n, distance: n.dist(r) })] });
  }
};
function _d({ op: t, path: e, active: r, color: n }) {
  let { tightFixed: i } = ke(hn), s = t.frames > 0;
  return i && s ? O(Ie, { outputPreview: t.outputPreview, active: r }) : O(ct, { label: "fixed", active: r, color: n, path: e, children: s && O(Ie, { outputPreview: t.outputPreview }) });
}
function Pd(t, e) {
  let r = hr(t).map(bn);
  return Y(r.length > 0, "between requires at least one state"), G(Sd)(r, e);
}
var Sd = class extends St {
  constructor(e, r, n = {}) {
    super(e);
    M(this, "name", "between");
    M(this, "allFixed");
    M(this, "branches");
    M(this, "renderedStates", []);
    M(this, "delaunay");
    M(this, "projection");
    M(this, "weights", /* @__PURE__ */ new Map());
    M(this, "closestIndex", -1);
    M(this, "preview");
    this.specs = r, this.options = n;
    let i = r.map((s) => wd(s));
    this.allFixed = i.every((s) => s !== void 0), this.allFixed ? (this.branches = [], this.renderedStates = i.map((s) => {
      Y(s !== void 0);
      let a = Rt(e, s);
      return { state: s, layered: a, position: Kr(e, a) };
    }), this.delaunay = Js(this.renderedStates, e)) : this.branches = r.map((s, a) => this.child(String(a), s));
  }
  frame(e) {
    this.allFixed || (this.renderedStates = this.branches.map((h) => {
      let p = h.run(e), y = p.preview(), g = Kr(this.ctx, y);
      return { state: p.dropState, layered: y, position: g };
    }), this.delaunay = Js(this.renderedStates, this.ctx));
    let r = this.renderedStates, n = this.delaunay, i = n.projectOntoConvexHull(e.pointer), s = this.options.interpolation ?? "delaunay", a;
    s === "natural-neighbor" ? a = Od(n, e, i) : s === "delaunay" ? a = uo(i) : fn(s);
    let { sharpness: o } = this.options;
    if (o !== void 0) {
      let h = 0;
      for (let [p, y] of a.entries()) {
        let g = y ** +o;
        a.set(p, g), h += g;
      }
      for (let [p, y] of a.entries()) a.set(p, y / h);
    }
    let l, u = () => l ?? (l = vd(r.map((h) => h.layered), a)), f = ma(r, (h) => h.position.dist(e.pointer));
    this.projection = i, this.weights = a, this.closestIndex = r.indexOf(f), this.preview = u;
    let c = L(0);
    for (let [h, p] of a.entries()) c = c.add(r[h].position.mul(p));
    return { preview: u, dropState: f.state, gap: i.dist, grabPos: c };
  }
  fuzzDropPositions() {
    return this.renderedStates.map((e) => e.position);
  }
  treeView(e) {
    let { path: r, active: n, color: i } = e, { interpolation: s } = this.options;
    return W(ct, { label: `between [${this.specs.length}]${s ? ` (${s})` : ""}`, active: n, color: i, path: r, children: [this.preview && O(Ie, { outputPreview: this.preview() }), this.allFixed ? O(ri, { label: "states", children: O(Ii, { renderedStates: this.renderedStates, closestIndex: this.closestIndex }) }) : this.branches.map((a) => a.treeView(e))] });
  }
  overlayVis({ active: e, opacity: r }) {
    let { projection: n, delaunay: i, lastFrame: s } = this;
    if (!n || !i || !s) return null;
    let { pointer: a } = s, o = a.dist(n.projectedPt);
    return W("g", { children: [this.branches.map((l, u) => O(Ct, { op: l.op, active: !1 }, `sub-${u}`)), W("g", { opacity: r, children: [i.triangles().map((l, u) => {
      let [f, c, h] = l;
      return O("path", { d: sd("M", f.x, f.y, "L", c.x, c.y, "L", h.x, h.y, "Z"), stroke: "magenta", strokeWidth: 1, fill: "magenta", fillOpacity: 0.05 }, `tri-${u}`);
    }), this.renderedStates.map((l, u) => {
      let f = this.weights.get(u) ?? 0, c = Math.sqrt(f) * 8, h = u === this.closestIndex;
      return W("g", { children: [O("circle", { ...l.position.cxy(), r: h ? 8 : 3, fill: "none", stroke: "magenta", strokeWidth: 1.5 }), e && c > 0.5 && O("circle", { ...l.position.cxy(), r: c, fill: "magenta" })] }, `pt-${u}`);
    }), O("circle", { ...n.projectedPt.cxy(), r: 5, stroke: "magenta", strokeWidth: 2, fill: "none" }), O(cr, { from: a, to: n.projectedPt, distance: o })] })] });
  }
};
function Js(t, e) {
  try {
    return new qf(t.map((r) => r.position));
  } catch (r) {
    if (r instanceof Ja) {
      let n = t[r.indexA], i = t[r.indexB];
      throw new Me("Coincident targets detected in d.between", W(Qr, { children: [O("p", { style: { marginBottom: 8, fontStyle: "italic" }, children: "(Quick hint: are you reordering siblings without IDs?)" }), W("p", { style: { marginBottom: 8 }, children: ["In order to use", " ", O("span", { style: { fontFamily: "monospace" }, children: "d.between" }), ", the dragged element must move to distinct locations in each rendered state."] }), W("p", { style: { marginBottom: 8 }, children: ["Here, we are dragging element", " ", O("span", { style: { fontFamily: "monospace" }, children: e.draggedPath }), ". Two states put it at the point [", n.position.str(", "), "]:"] }), O("div", { style: { display: "flex", gap: 16, marginBottom: 8, overflow: "hidden" }, children: [n, i].map((s, a) => O($d, { layered: s.layered, draggedPath: e.draggedPath, state: s.state }, a)) }), O("p", { style: { marginBottom: 8 }, children: "(This is just the first pair of overlaps – other states may also cause overlap.)" }), O("p", { style: { marginBottom: 8 }, children: "If this isn't caused by reordering siblings without IDs, you may have a genuinely ambiguous drag behavior: multiple states bringing the dragged element to the same location. (Or maybe you just repeated a state?)" })] }));
    }
    throw Error(`Failed to create Delaunay triangulation: ${r}`);
  }
}
function $d({ layered: t, draggedPath: e, state: r }) {
  let n = ad(t), i = Ka(e, t), s = i ? ki(i.element, i.accumulatedTransform) : ye, a = n.empty ? { minX: 0, minY: 0, maxX: 100, maxY: 100 } : n;
  return W("div", { style: { flex: "1 1 0", minWidth: 0, overflow: "hidden", display: "flex", flexDirection: "column", gap: 8 }, children: [W("svg", { viewBox: `${a.minX - 10} ${a.minY - 10} ${a.maxX - a.minX + 20} ${a.maxY - a.minY + 20}`, style: { width: "100%", maxWidth: 200, border: "1px solid #ccc", borderRadius: 4, background: "#fff" }, children: [ur(t), !s.empty && O("rect", { x: s.minX - 3, y: s.minY - 3, width: s.maxX - s.minX + 6, height: s.maxY - s.minY + 6, fill: "none", stroke: "#ff0000", strokeWidth: 2, rx: 2 })] }), O("div", { style: { fontStyle: "italic" }, children: "from" }), O(ai, { kind: "state", value: r })] });
}
function Od(t, e, r) {
  let n = Zf(t, e.pointer, {});
  return n ? n.weights : uo(r);
}
function uo(t) {
  let e = /* @__PURE__ */ new Map();
  if (t.type === "vertex") e.set(t.ptIdx, 1);
  else if (t.type === "edge") e.set(t.ptIdx0, 1 - t.t), e.set(t.ptIdx1, t.t);
  else {
    let { l0: r, l1: n, l2: i } = t.barycentric;
    e.set(t.ptIdx0, r), e.set(t.ptIdx1, n), e.set(t.ptIdx2, i);
  }
  return e;
}
function Md(t) {
  return G(Td)(this, t);
}
var Td = class extends gt {
  constructor(e, r, n) {
    super(e, r);
    M(this, "name", "changeFrame");
    this.f = n;
  }
  frame(e) {
    return this.inner.run({ ...e, ...yn(this.f, e) });
  }
};
function Id(t) {
  return G(Ad)(this, t);
}
var Ad = class extends gt {
  constructor(e, r, n) {
    super(e, r);
    M(this, "name", "changeGap");
    this.f = n;
  }
  frame(e) {
    let r = this.inner.run(e);
    return { ...r, gap: this.f(r.gap) };
  }
};
function kd(t) {
  return G(Cd)(this, t);
}
var Cd = class extends gt {
  constructor(e, r, n) {
    super(e, r);
    M(this, "name", "changeResult");
    this.f = n;
  }
  frame(e) {
    let r = this.inner.run(e), n = yn(this.f, r), i = "preview" in n && !("grabPos" in n) ? void 0 : r.grabPos;
    return { ...r, grabPos: i, ...n };
  }
};
function Rd(t, e) {
  return G(Ed)(hr(t).map(bn), e?.stickiness ?? 0, e?.lockPast);
}
var Ed = class extends St {
  constructor(e, r, n, i) {
    super(e);
    M(this, "name", "closest");
    M(this, "options");
    M(this, "lastBest", null);
    M(this, "lockedIndex", null);
    M(this, "ran", []);
    M(this, "home");
    if (this.stickiness = n, this.lockPast = i, this.options = r.map((s, a) => this.child(String(a), s)), i !== void 0) {
      let s = xn(e, e.startState);
      Y(s !== null, "closest: dragged element not found in start state"), this.home = s;
    }
  }
  isPastLock(e) {
    if (this.home === void 0 || this.lockPast === void 0) return !1;
    let r = e.grabPos ?? Di(this.ctx, e.preview());
    return r === null || r.dist(this.home) > this.lockPast;
  }
  frame(e) {
    if (this.options.length === 0) return { preview: () => Rt(this.ctx, this.ctx.startState), dropState: this.ctx.startState, gap: 1 / 0, activePath: "none" };
    let r = [], n = (s) => r[s] ?? (r[s] = this.options[s].run(e));
    this.lockedIndex !== null && !this.isPastLock(n(this.lockedIndex)) && (this.lockedIndex = null);
    let i = this.lockedIndex;
    return i === null && (i = ma(ba(this.options.length), (s) => n(s).gap - (s === this.lastBest ? this.stickiness : 0)), this.isPastLock(n(i)) && (this.lockedIndex = i)), this.lastBest = i, this.ran = this.options.map((s, a) => r[a] !== void 0), n(i);
  }
  treeView(e) {
    return O(ct, { label: "closest", path: e.path, children: O("div", { style: { display: "flex", flexDirection: "row", gap: 4, flexWrap: "wrap" }, children: this.options.map((r, n) => W("div", { style: { display: "flex", flexDirection: "column", gap: 1 }, children: [O("div", { style: { fontSize: 9, color: "rgb(148, 163, 184)", paddingLeft: 2 }, children: n }), r.treeView(e)] }, n)) }) });
  }
  overlayVis({ active: e }) {
    return this.frames === 0 ? null : O("g", { children: this.options.map((r, n) => this.ran[n] && O(Ct, { op: r.op, active: e && n === this.lastBest }, n)) });
  }
};
function Dd(t) {
  return G(Fd)(t);
}
var Fd = class extends St {
  constructor(e, r) {
    super(e);
    M(this, "name", "custom");
    M(this, "behavior");
    this.fn = r, this.behavior = r(e);
  }
  frame(e) {
    return this.behavior(e);
  }
  treeView({ path: e }) {
    return O(ct, { label: "custom", path: e, children: "not supported yet" });
  }
  overlayVis() {
    return null;
  }
};
function Nd(t, e, r) {
  return G(jd)(t, e, r?.boundsState);
}
var jd = class extends St {
  constructor(e, r, n, i) {
    super(e);
    M(this, "name", "dropTarget");
    M(this, "preview");
    M(this, "globalBounds");
    M(this, "inside", !1);
    this.targetId = r, this.state = n, this.boundsState = i, this.preview = Rt(e, n);
    let s = (i === void 0 ? this.preview : Rt(e, i)).byId.get(r);
    Y(s !== void 0, `dropTarget: element with id "${r}" not found in rendered state`), this.globalBounds = ki(s.element, s.element.props.transform ?? ""), Y(!this.globalBounds.empty, `dropTarget: could not compute bounds for element "${r}"`);
  }
  frame(e) {
    return this.inside = nd(e.pointer, this.globalBounds), { preview: () => this.preview, dropState: this.state, gap: this.inside ? 0 : 1 / 0 };
  }
  fuzzDropPositions() {
    return this.globalBounds.empty ? [] : [si(this.globalBounds)];
  }
  treeView({ path: e, active: r, color: n }) {
    return O(ct, { label: `dropTarget → ${this.targetId}`, active: r, color: n, path: e, children: this.frames > 0 && O(Ii, { renderedStates: [{ layered: this.preview, position: L(0) }] }) });
  }
  overlayVis({ opacity: e }) {
    let r = this.globalBounds;
    if (!this.lastFrame || r.empty) return null;
    let { pointer: n } = this.lastFrame;
    return W("g", { opacity: e, children: [O("rect", { x: r.minX, y: r.minY, width: r.maxX - r.minX, height: r.maxY - r.minY, fill: "magenta", fillOpacity: 0.15, stroke: "magenta", strokeWidth: 1.5 }), O(cr, { from: si(r), to: n, distance: this.inside ? 0 : 1 / 0 })] });
  }
};
function zd(t) {
  return G(Ld)(this, t);
}
var Ld = class extends gt {
  constructor(e, r, n) {
    super(e, r);
    M(this, "name", "during");
    M(this, "outputPreview");
    this.duringFn = n;
  }
  frame(e) {
    let r = this.inner.run(e), n = this.duringFn(r.dropState), i = Rt(this.ctx, n), s = Di(this.ctx, i);
    return this.outputPreview = i, { ...r, preview: () => i, dropState: n, gap: s ? e.pointer.dist(s) : 1 / 0, grabPos: s ?? void 0 };
  }
  treeView(e) {
    return W(ct, { label: "during", path: e.path, children: [this.outputPreview && O(Ie, { outputPreview: this.outputPreview }), this.inner.treeView(e)] });
  }
};
function Vd(t) {
  return G(Bd)(this, t);
}
var Bd = class extends gt {
  constructor(e, r, n) {
    super(e, r);
    M(this, "name", "onDrop");
    this.onDropState = n;
  }
  frame(e) {
    let r = this.inner.run(e);
    return { ...r, dropState: typeof this.onDropState == "function" ? this.onDropState(r.dropState) : this.onDropState };
  }
}, Ud = class {
  reactTo(t, e) {
    return G(Wd)(t, e);
  }
}, Wd = class extends St {
  constructor(e, r, n) {
    super(e);
    M(this, "name", "reactTo");
    M(this, "currentValue", {});
    M(this, "changeCount", 0);
    M(this, "current");
    this.getter = r, this.callback = n;
  }
  frame(e) {
    let r = this.getter();
    return r !== this.currentValue && (this.currentValue = r, this.changeCount++, this.current = this.child(null, this.callback(r))), this.current.run(e);
  }
  treeView(e) {
    return O(ct, { label: "reactTo", path: e.path, children: this.current && W(Qr, { children: [W("div", { style: { fontSize: 9, color: "rgb(120, 113, 108)", background: "rgba(0,0,0,0.04)", borderRadius: 3, padding: "2px 4px", whiteSpace: "pre-wrap", wordBreak: "break-all" }, children: ["value: ", Qa(String(this.currentValue), 40), " · ", "changes: ", this.changeCount] }), this.current.treeView(e)] }) });
  }
  overlayVis({ active: e }) {
    return this.current ? O(Ct, { op: this.current.op, active: e }) : null;
  }
};
function Gr(t, e) {
  let r = t;
  for (let n of e) r = r[n];
  return r;
}
function Ae(t, e, r) {
  let [n, ...i] = e;
  if (i.length === 0) {
    if (Array.isArray(t)) {
      let s = t.slice();
      return s[n] = r, s;
    }
    return ta(t, n, r);
  }
  if (Array.isArray(t)) {
    let s = t.slice();
    return s[n] = Ae(t[n], i, r), s;
  }
  return ta(t, n, Ae(t[n], i, r));
}
function ta(t, e, r) {
  let n = Object.assign(Object.create(Object.getPrototypeOf(t)), t);
  return n[e] = r, n;
}
var Xd = class {
  substate(t, e, r) {
    let n = r(new fo(Gr(t, e)));
    return G(Yd)(t, e, n);
  }
}, Yd = class extends St {
  constructor(e, r, n, i) {
    super(e);
    M(this, "name", "substate");
    M(this, "inner");
    this.state = r, this.path = n;
    let s = (a) => e.draggable(pr({ state: Ae(r, n, a.state), draggedId: a.draggedId, setState: a.setState, isTracking: a.isTracking }));
    this.inner = this.child(null, i, { ...e, draggable: s });
  }
  frame(e) {
    let r = this.inner.run(e);
    return { ...r, dropState: Ae(this.state, this.path, r.dropState) };
  }
  treeView(e) {
    return O(ct, { label: `substate [${this.path.join(", ")}]`, path: e.path, children: this.inner.treeView(e) });
  }
  overlayVis({ active: e }) {
    return O(Ct, { op: this.inner.op, active: e });
  }
};
function Ei(t, ...e) {
  return e.reduce((r, n) => n(r), t);
}
function fr(t, e, r, n) {
  return Ei(t(pr({ state: e, draggedId: r, setState: () => {
    throw Error("This function should not have been called");
  }, isTracking: n })), Xa);
}
function mn(t, e, r, n) {
  return pn(fr(t, e, r, n));
}
function Hd(t, e, r) {
  return G(Gd)(t, e, r && bn(r));
}
function qd(t, e, r, n) {
  if (!n && r) {
    let i = De(fr(t.draggable, e, r, !0), (a) => a.props.id === r);
    Y(!!i, `switchToStateAndFollow: element "${r}" not found`);
    let s = gr(i.element);
    Y(!!s, `switchToStateAndFollow: no followSpec and no dragology on "${r}"`), n = s();
  }
  return Y(!!n, "switchToStateAndFollow: no followSpec"), n;
}
var Gd = class extends gt {
  constructor(e, r, n, i) {
    super(e, qd(e, r, n, i), { ...e, startState: r, draggedId: n, draggedPath: n + "/" });
    M(this, "name", "switchToStateAndFollow");
    this.state = r, this.draggedId = n;
  }
  frame(e) {
    return this.inner.run(e);
  }
  treeView(e) {
    return O(ct, { label: `switchToStateAndFollow → ${this.draggedId}`, color: e.color, path: e.path, children: this.inner.treeView(e) });
  }
}, Kd = { arr: function(t) {
  return new Float64Array(t);
}, arr2: function(t, e) {
  for (var r = 0, n = Array(t); r < t; ) n[r] = this.arr(e), r++;
  return n;
}, arraycopy: function(t, e, r, n, i) {
  for (var s = 0; s < i; ) r[s + n] = t[s + e], s++;
}, lastNumberOfEvaluations: 0, GetLastNumberOfEvaluations: function() {
  return this.lastNumberOfEvaluations;
}, Normal: 0, MaxIterationsReached: 1, DivergingRoundingErrors: 2, FindMinimum: function(t, e, r, n, i, s, a, o, l) {
  var u = r + 2, f, c = this.arr(e + 1), h = this, p;
  return this.lastNumberOfEvaluations = 0, l && console.log("Experimental feature 'testForRoundingErrors' is activated."), c[0] = 0, this.arraycopy(n, 0, c, 1, e), p = function(y, g, v, b) {
    var x = h.arr(y), P, m;
    return h.lastNumberOfEvaluations += 1, h.arraycopy(v, 1, x, 0, y), P = h.arr(g), m = t(y, g, x, P), h.arraycopy(P, 0, b, 1, g), m;
  }, f = this.cobylb(p, e, r, u, c, i, s, a, o, l), this.arraycopy(c, 1, n, 0, e), f;
}, cobylb: function(t, e, r, n, i, s, a, o, l, u) {
  var f = -1, c = 0.25, h = 2.1, p = 0.5, y = 1.1, g = 0, v = 0, b, x = e + 1, P = r + 1, m = s, d = 0, E = !1, V = !1, z = 0, S = 0, D = 0, R = this.arr(1 + n), I = this.arr2(1 + e, 1 + x), j = this.arr2(1 + e, 1 + e), w = this.arr2(1 + n, 1 + x), C = this.arr2(1 + e, 1 + P), $ = this.arr(1 + e), k = this.arr(1 + e), B = this.arr(1 + e), N = this.arr(1 + e), X = this.arr(1 + e), A, T, _, tt, F, yt, K, U, ot, ht, lt, q, Q, rt, bt, Nt, Yt, jt, Ht, $t, qt, Gt, Fe, Kt, zt, Ne, Zt, nt, ft, xt, he = !0;
  for (o >= 2 && console.log("The initial value of RHO is " + m + " and PARMU is set to zero."), K = 0, F = 1 / m, A = 1; A <= e; ++A) I[A][x] = i[A], I[A][A] = m, j[A][A] = F;
  U = x, ot = !1;
  t: do {
    if (K >= l && K > 0) {
      f = this.MaxIterationsReached;
      break t;
    }
    for (++K, g = t(e, r, i, R), v = 0, _ = 1; _ <= r; ++_) v = Math.max(v, -R[_]);
    if ((K === o - 1 || o === 3) && this.PrintIterationResult(K, g, v, i, e, o), R[P] = g, R[n] = v, ht = !0, !ot) {
      for (ht = !1, A = 1; A <= n; ++A) w[A][U] = R[A];
      if (K <= x) {
        if (U <= e) if (w[P][x] <= g) i[U] = I[U][x];
        else {
          for (I[U][x] = i[U], _ = 1; _ <= n; ++_) w[_][U] = w[_][x], w[_][x] = R[_];
          for (_ = 1; _ <= U; ++_) {
            for (I[U][_] = -m, F = 0, A = _; A <= U; ++A) F -= j[A][_];
            j[U][_] = F;
          }
        }
        if (K <= e) {
          U = K, i[U] += m;
          continue t;
        }
      }
      ot = !0;
    }
    e: do {
      r: do {
        if (!ht) {
          for (lt = w[P][x] + d * w[n][x], q = x, T = 1; T <= e; ++T) F = w[P][T] + d * w[n][T], F < lt ? (q = T, lt = F) : F === lt && d === 0 && w[n][T] < w[n][q] && (q = T);
          if (q <= e) {
            for (A = 1; A <= n; ++A) F = w[A][x], w[A][x] = w[A][q], w[A][q] = F;
            for (A = 1; A <= e; ++A) {
              for (F = I[A][q], I[A][q] = 0, I[A][x] += F, yt = 0, _ = 1; _ <= e; ++_) I[A][_] -= F, yt -= j[_][A];
              j[q][A] = yt;
            }
          }
          if (Q = 0, u) for (A = 1; A <= e; ++A) for (T = 1; T <= e; ++T) F = this.DOT_PRODUCT_ROW_COL(j, A, I, T, 1, e) - (A === T ? 1 : 0), Q = Math.max(Q, Math.abs(F));
          if (Q > 0.1) {
            f = this.DivergingRoundingErrors;
            break t;
          }
          for (_ = 1; _ <= P; ++_) {
            for (R[_] = -w[_][x], T = 1; T <= e; ++T) X[T] = w[_][T] + R[_];
            for (A = 1; A <= e; ++A) C[A][_] = (_ === P ? -1 : 1) * this.DOT_PRODUCT_ROW_COL(X, -1, j, A, 1, e);
          }
          for (E = !0, z = c * m, rt = h * m, T = 1; T <= e; ++T) {
            for (bt = 0, Nt = 0, _ = 1; _ <= e; ++_) bt += j[T][_] * j[T][_], Nt += I[_][T] * I[_][T];
            $[T] = 1 / Math.sqrt(bt), k[T] = Math.sqrt(Nt), ($[T] < z || k[T] > rt) && (E = !1);
          }
          if (!ot && !E) {
            for (U = 0, F = rt, T = 1; T <= e; ++T) k[T] > F && (U = T, F = k[T]);
            if (U === 0) for (T = 1; T <= e; ++T) $[T] < F && (U = T, F = $[T]);
            for (F = p * m * $[U], _ = 1; _ <= e; ++_) N[_] = F * j[U][_];
            for (Yt = 0, jt = 0, b = 0, _ = 1; _ <= P; ++_) b = this.DOT_PRODUCT_ROW_COL(N, -1, C, _, 1, e), _ < P && (F = w[_][x], Yt = Math.max(Yt, -b - F), jt = Math.max(jt, b - F));
            for (Ht = d * (Yt - jt) > 2 * b ? -1 : 1, F = 0, A = 1; A <= e; ++A) N[A] = Ht * N[A], I[A][U] = N[A], F += j[U][A] * N[A];
            for (_ = 1; _ <= e; ++_) j[U][_] /= F;
            for (T = 1; T <= e; ++T) {
              if (T !== U) for (F = this.DOT_PRODUCT_ROW_COL(j, T, N, -1, 1, e), _ = 1; _ <= e; ++_) j[T][_] -= F * j[U][_];
              i[T] = I[T][x] + N[T];
            }
            continue t;
          }
          if (V = this.trstlp(e, r, C, R, m, N), !V) {
            for (F = 0, _ = 1; _ <= e; ++_) F += N[_] * N[_];
            if (F < 0.25 * m * m) {
              ot = !0;
              break r;
            }
          }
          for (b = 0, $t = 0, R[P] = 0, _ = 1; _ <= P; ++_) b = R[_] - this.DOT_PRODUCT_ROW_COL(N, -1, C, _, 1, e), _ < P && ($t = Math.max($t, b));
          if (S = w[n][x] - $t, qt = S > 0 ? b / S : 0, d < 1.5 * qt) {
            for (d = 2 * qt, o >= 2 && console.log("Increase in PARMU to " + d), Gt = w[P][x] + d * w[n][x], T = 1; T <= e; ++T) if (F = w[P][T] + d * w[n][T], F < Gt || F === Gt && d === 0 && w[n][T] < w[n][x]) continue e;
          }
          for (D = d * S - b, _ = 1; _ <= e; ++_) i[_] = I[_][x] + N[_];
          ot = !0;
          continue t;
        }
        for (ht = !1, Fe = w[P][x] + d * w[n][x], Kt = g + d * v, zt = Fe - Kt, d === 0 && g === w[P][x] && (D = S, zt = w[n][x] - v), Ne = zt <= 0 ? 1 : 0, U = 0, T = 1; T <= e; ++T) F = Math.abs(this.DOT_PRODUCT_ROW_COL(j, T, N, -1, 1, e)), F > Ne && (U = T, Ne = F), B[T] = F * $[T];
        for (Zt = y * m, tt = 0, T = 1; T <= e; ++T) if (B[T] >= z || B[T] >= $[T]) {
          if (F = k[T], zt > 0) {
            for (F = 0, _ = 1; _ <= e; ++_) F += (N[_] - I[_][T]) ** 2;
            F = Math.sqrt(F);
          }
          F > Zt && (tt = T, Zt = F);
        }
        if (tt > 0 && (U = tt), U !== 0) {
          for (F = 0, A = 1; A <= e; ++A) I[A][U] = N[A], F += j[U][A] * N[A];
          for (_ = 1; _ <= e; ++_) j[U][_] /= F;
          for (T = 1; T <= e; ++T) if (T !== U) for (F = this.DOT_PRODUCT_ROW_COL(j, T, N, -1, 1, e), _ = 1; _ <= e; ++_) j[T][_] -= F * j[U][_];
          for (_ = 1; _ <= n; ++_) w[_][U] = R[_];
          if (zt > 0 && zt >= 0.1 * D) continue e;
        }
      } while (!he);
      if (!E) {
        ot = !1;
        continue e;
      }
      if (m <= a) {
        f = this.Normal;
        break t;
      }
      if (nt = 0, ft = 0, m *= 0.5, m <= 1.5 * a && (m = a), d > 0) {
        for (xt = 0, _ = 1; _ <= P; ++_) {
          for (nt = w[_][x], ft = nt, A = 1; A <= e; ++A) nt = Math.min(nt, w[_][A]), ft = Math.max(ft, w[_][A]);
          _ <= r && nt < 0.5 * ft && (F = Math.max(ft, 0) - nt, xt = xt <= 0 ? F : Math.min(xt, F));
        }
        xt === 0 ? d = 0 : ft - nt < d * xt && (d = (ft - nt) / xt);
      }
      o >= 2 && console.log("Reduction in RHO to " + m + "  and PARMU = " + d), o === 2 && this.PrintIterationResult(K, w[P][x], w[n][x], this.COL(I, x), e, o);
    } while (he);
  } while (he);
  switch (f) {
    case this.Normal:
      if (o >= 1 && console.log("%nNormal return from subroutine COBYLA%n"), V) return o >= 1 && this.PrintIterationResult(K, g, v, i, e, o), f;
      break;
    case this.MaxIterationsReached:
      o >= 1 && console.log("%nReturn from subroutine COBYLA because the MAXFUN limit has been reached.%n");
      break;
    case this.DivergingRoundingErrors:
      o >= 1 && console.log("%nReturn from subroutine COBYLA because rounding errors are becoming damaging.%n");
      break;
  }
  for (_ = 1; _ <= e; ++_) i[_] = I[_][x];
  return g = w[P][x], v = w[n][x], o >= 1 && this.PrintIterationResult(K, g, v, i, e, o), f;
}, trstlp: function(t, e, r, n, i, s) {
  var a = 0, o = 0, l = 0, u = this.arr2(1 + t, 1 + t), f = this.arr(2 + e), c = this.arr(2 + e), h = this.arr(1 + t), p = this.arr(1 + t), y = this.arr(2 + e), g = this.arr(2 + e), v = e, b = 0, x, P, m, d, E, V, z, S, D, R, I, j, w, C, $, k, B, N, X, A, T, _, tt, F, yt, K, U, ot, ht, lt, q, Q, rt, bt, Nt = !0;
  for (m = 1; m <= t; ++m) u[m][m] = 1, s[m] = 0;
  if (x = 0, P = 0, e >= 1) {
    for (d = 1; d <= e; ++d) n[d] > P && (P = n[d], x = d);
    for (d = 1; d <= e; ++d) g[d] = d, c[d] = P - n[d];
  }
  E = !0;
  do
    t: do {
      (!E || E && P === 0) && (v = e + 1, x = v, g[v] = v, c[v] = 0), E = !1, V = 0, z = 0, S = 0, D = 0;
      e: do {
        if (R = v === e ? P : -this.DOT_PRODUCT_ROW_COL(s, -1, r, v, 1, t), z === 0 || R < V ? (V = R, o = b, z = 3) : b > o ? (o = b, z = 3) : --z, z === 0) break t;
        if (I = 0, x <= b) {
          if (x < b) {
            j = g[x], w = c[x], d = x;
            do {
              for ($ = d + 1, k = g[$], B = this.DOT_PRODUCT(this.PART(this.COL(u, d), 1, t), this.PART(this.COL(r, k), 1, t)), a = Math.hypot(B, f[$]), N = f[$] / a, X = B / a, f[$] = N * f[d], f[d] = a, m = 1; m <= t; ++m) a = N * u[m][$] + X * u[m][d], u[m][$] = N * u[m][d] - X * u[m][$], u[m][d] = a;
              g[d] = k, c[d] = c[$], d = $;
            } while (d < b);
            g[d] = j, c[d] = w;
          }
          if (--b, v > e) for (a = 1 / f[b], d = 1; d <= t; ++d) h[d] = a * u[d][b];
          else for (a = this.DOT_PRODUCT_ROW_COL(h, -1, u, b + 1, 1, t), d = 1; d <= t; ++d) h[d] -= a * u[d][b + 1];
        } else {
          for (k = g[x], d = 1; d <= t; ++d) p[d] = r[d][k];
          for (A = 0, d = t; d > b; ) {
            for (B = 0, T = 0, m = 1; m <= t; ++m) a = u[m][d] * p[m], B += a, T += Math.abs(a);
            if (_ = T + 0.1 * Math.abs(B), tt = T + 0.2 * Math.abs(B), (T >= _ || _ >= tt) && (B = 0), A === 0) A = B;
            else for ($ = d + 1, a = Math.hypot(B, A), N = B / a, X = A / a, A = a, m = 1; m <= t; ++m) a = N * u[m][d] + X * u[m][$], u[m][$] = N * u[m][$] - X * u[m][d], u[m][d] = a;
            --d;
          }
          if (A === 0) {
            I = -1, d = b;
            do {
              for (F = 0, yt = 0, m = 1; m <= t; ++m) a = u[m][d] * p[m], F += a, yt += Math.abs(a);
              if (_ = yt + 0.1 * Math.abs(F), tt = yt + 0.2 * Math.abs(F), yt < _ && _ < tt) {
                if (a = F / f[d], a > 0 && g[d] <= e && (bt = c[d] / a, (I < 0 || bt < I) && (I = bt)), d >= 2) for (K = g[d], m = 1; m <= t; ++m) p[m] -= a * r[m][K];
                y[d] = a;
              } else y[d] = 0;
            } while (--d > 0);
            if (I < 0) break t;
            for (d = 1; d <= b; ++d) c[d] = Math.max(0, c[d] - I * y[d]);
            if (x < b) {
              j = g[x], w = c[x], d = x;
              do {
                for ($ = d + 1, K = g[$], B = this.DOT_PRODUCT(this.PART(this.COL(u, d), 1, t), this.PART(this.COL(r, K), 1, t)), a = Math.hypot(B, f[$]), N = f[$] / a, X = B / a, f[$] = N * f[d], f[d] = a, m = 1; m <= t; ++m) a = N * u[m][$] + X * u[m][d], u[m][$] = N * u[m][d] - X * u[m][$], u[m][d] = a;
                g[d] = K, c[d] = c[$], d = $;
              } while (d < b);
              g[d] = j, c[d] = w;
            }
            if (a = this.DOT_PRODUCT(this.PART(this.COL(u, b), 1, t), this.PART(this.COL(r, k), 1, t)), a === 0) break t;
            f[b] = a, c[x] = 0, c[b] = I;
          } else ++b, f[b] = A, c[x] = c[b], c[b] = 0;
          if (g[x] = g[b], g[b] = k, v > e && k !== v) {
            for (d = b - 1, B = this.DOT_PRODUCT(this.PART(this.COL(u, d), 1, t), this.PART(this.COL(r, k), 1, t)), a = Math.hypot(B, f[b]), N = f[b] / a, X = B / a, f[b] = N * f[d], f[d] = a, m = 1; m <= t; ++m) a = N * u[m][b] + X * u[m][d], u[m][b] = N * u[m][d] - X * u[m][b], u[m][d] = a;
            g[b] = g[d], g[d] = k, a = c[d], c[d] = c[b], c[b] = a;
          }
          if (v > e) for (a = 1 / f[b], d = 1; d <= t; ++d) h[d] = a * u[d][b];
          else for (k = g[b], a = (this.DOT_PRODUCT_ROW_COL(h, -1, r, k, 1, t) - 1) / f[b], d = 1; d <= t; ++d) h[d] -= a * u[d][b];
        }
        for (U = i * i, ht = 0, ot = 0, m = 1; m <= t; ++m) Math.abs(s[m]) >= 1e-6 * i && (U -= s[m] * s[m]), ht += s[m] * h[m], ot += h[m] * h[m];
        if (U <= 0) break t;
        if (a = Math.sqrt(ot * U), Math.abs(ht) >= 1e-6 * a && (a = Math.sqrt(ot * U + ht * ht)), D = U / (a + ht), S = D, v === e) {
          if (_ = S + 0.1 * P, tt = S + 0.2 * P, S >= _ || _ >= tt) break e;
          S = Math.min(S, P);
        }
        for (d = 1; d <= t; ++d) p[d] = s[d] + S * h[d];
        if (v === e) for (l = P, P = 0, d = 1; d <= b; ++d) k = g[d], a = n[k] - this.DOT_PRODUCT_ROW_COL(p, -1, r, k, 1, t), P = Math.max(P, a);
        d = b;
        do {
          for (lt = 0, q = 0, m = 1; m <= t; ++m) a = u[m][d] * p[m], lt += a, q += Math.abs(a);
          if (_ = q + 0.1 * Math.abs(lt), tt = q + 0.2 * Math.abs(lt), (q >= _ || _ >= tt) && (lt = 0), y[d] = lt / f[d], d >= 2) for (k = g[d], m = 1; m <= t; ++m) p[m] -= y[d] * r[m][k];
        } while (d-- >= 2);
        for (v > e && (y[b] = Math.max(0, y[b])), d = 1; d <= t; ++d) p[d] = s[d] + S * h[d];
        if (v > b) for (Q = b + 1, d = Q; d <= v; ++d) {
          for (k = g[d], C = P - n[k], rt = P + Math.abs(n[k]), m = 1; m <= t; ++m) a = r[m][k] * p[m], C += a, rt += Math.abs(a);
          _ = rt + 0.1 * Math.abs(C), tt = rt + 0.2 * Math.abs(C), (rt >= _ || _ >= tt) && (C = 0), y[d] = C;
        }
        for (I = 1, x = 0, d = 1; d <= v; ++d) y[d] < 0 && (a = c[d] / (c[d] - y[d]), a < I && (I = a, x = d));
        for (a = 1 - I, d = 1; d <= t; ++d) s[d] = a * s[d] + I * p[d];
        for (d = 1; d <= v; ++d) c[d] = Math.max(0, a * c[d] + I * y[d]);
        v === e && (P = l + I * (P - l));
      } while (x > 0);
      if (S === D) return !0;
    } while (Nt);
  while (v === e);
  return !1;
}, PrintIterationResult: function(t, e, r, n, i, s) {
  s > 1 && console.log("NFVALS = " + t + "  F = " + e + "  MAXCV = " + r), s > 1 && console.log("X = " + this.PART(n, 1, i));
}, ROW: function(t, e) {
  return t[e].slice();
}, COL: function(t, e) {
  var r, n = t.length, i = [];
  for (r = 0; r < n; ++r) i[r] = t[r][e];
  return i;
}, PART: function(t, e, r) {
  return t.slice(e, r + 1);
}, FORMAT: function(t) {
  return t.join(",");
}, DOT_PRODUCT: function(t, e) {
  var r, n = 0, i = t.length;
  for (r = 0; r < i; ++r) n += t[r] * e[r];
  return n;
}, DOT_PRODUCT_ROW_COL: function(t, e, r, n, i, s) {
  var a, o = 0;
  if (e === -1) for (a = i; a <= s; ++a) o += t[a] * r[a][n];
  else if (n === -1) for (a = i; a <= s; ++a) o += t[e][a] * r[a];
  else for (a = i; a <= s; ++a) o += t[e][a] * r[a][n];
  return o;
} };
function Zd(t, e, r, n, i, s, a, o) {
  return Kd.FindMinimum(t, e, r, n, i, s, a, o);
}
var Qd = class {
  constructor(t, e) {
    M(this, "curParams");
    M(this, "numConstraints");
    M(this, "scales");
    M(this, "exploredValues", []);
    M(this, "exploredPositions", []);
    this.curParams = t.slice(), this.numConstraints = e;
  }
  get params() {
    return this.curParams;
  }
  estimateScales(t, e) {
    let r = e.length, n = t(e), i = 1e-3, s = [];
    for (let a = 0; a < r; a++) {
      let o = e.slice();
      o[a] += i;
      let l = t(o).dist(n) / i;
      s[a] = Math.max(l, 0.01);
    }
    return s;
  }
  minimize(t, e, r) {
    let n = this.curParams.length;
    this.scales || (this.scales = this.estimateScales(e, this.curParams));
    let i = this.scales, s = (f) => f.map((c, h) => c * i[h]), a = (f) => f.map((c, h) => c / i[h]), o = s(this.curParams);
    o.every((f) => f === 0) && (o[0] = 1e-4);
    let l = Math.max(1, e(a(o)).dist(t)), u = r?.constraints;
    return this.exploredValues = [], this.exploredPositions = [], Zd((f, c, h, p) => {
      let y = [];
      for (let x = 0; x < n; x++) y[x] = h[x];
      let g = a(y);
      this.exploredValues.push(g.slice());
      let v = e(g);
      this.exploredPositions.push(v);
      let b = v.dist2(t);
      if (u) {
        let x = u(g);
        for (let P = 0; P < x.length; P++) p[P] = -x[P];
      }
      return b;
    }, n, this.numConstraints, o, l, 1e-3, 0, 200), this.curParams = a(o), this.curParams;
  }
};
function Jd(t, e) {
  return t - e;
}
function Zp(t, e) {
  return e - t;
}
function Qp(t) {
  return If(hr(t)).map(([e, r]) => Jd(e, r));
}
function Jp(...t) {
  return t;
}
var tp = class {
  vary(t, e, r) {
    let n = hr(e).map($p);
    return G(co)(n.map((i) => Gr(t, i)), (i) => {
      let s = t;
      for (let a = 0; a < n.length; a++) s = Ae(s, n[a], i[a]);
      return s;
    }, r ?? {}, n);
  }
};
function ep(t, e, r) {
  return G(co)(t, e, r ?? {}, void 0);
}
var rp = 0.05, np = 0.3, co = class extends St {
  constructor(e, r, n, i, s) {
    super(e);
    M(this, "name", "vary");
    M(this, "minimizer");
    M(this, "constraintsFn");
    M(this, "rendered");
    M(this, "currentParams", []);
    M(this, "exploredPositions");
    M(this, "varyVisLastSwitch", performance.now() / 1e3);
    M(this, "varyVisSampledParams", null);
    this.initParams = r, this.stateFromParams = n, this.options = i, this.paramPaths = s;
    let { constraint: a, pin: o } = i, l = n(r), u = o ? Mr(o, l) : void 0, f = o ? [a, (c) => Mr(o, c).map((h, p) => [h - u[p], u[p] - h])] : a;
    this.minimizer = new Qd(r, f ? Mr(f, l).length : 0), this.constraintsFn = f ? (c) => Mr(f, n(c)) : void 0;
  }
  frame(e) {
    let { ctx: r, minimizer: n } = this;
    n.minimize(e.pointer, (u) => xn(r, this.stateFromParams(u)) ?? L(1 / 0, 1 / 0), { constraints: this.constraintsFn });
    let i = n.params;
    if (r.debug.varyVisualizer && n.exploredValues.length > 0) {
      let u = performance.now() / 1e3;
      if (u - this.varyVisLastSwitch >= rp) {
        this.varyVisLastSwitch = u;
        let f = Math.floor(Math.random() * n.exploredValues.length * np);
        this.varyVisSampledParams = n.exploredValues[f];
      }
      i = this.varyVisSampledParams ?? n.exploredValues[0] ?? n.params;
    }
    let s = this.stateFromParams(i), a = Rt(r, s), o = Kr(r, a), l = o.dist(e.pointer);
    if (r.debug.varyVisualizer) {
      let u = n.exploredValues.map((f) => Rt(r, this.stateFromParams(f)));
      a = Hr(a, pn(O("g", { id: "vary-cloud", dragologyZIndex: "/-100", dragologyOpaque: !0, children: u.map((f, c) => O("g", { opacity: 0.15, children: ur(f) }, `explored-${c}`)) })));
    }
    return this.rendered = { layered: a, position: o }, this.currentParams = i.slice(), this.exploredPositions = r.debug.varyVisualizer ? n.exploredPositions.slice() : void 0, { preview: () => a, dropState: s, gap: l, grabPos: o };
  }
  fuzzDropPositions() {
    return this.rendered ? [this.rendered.position] : [];
  }
  treeView({ path: e, active: r, color: n }) {
    let i = this.paramPaths ? `vary [${this.paramPaths.map((a) => a.join(".")).join(", ")}]` : `varyFunc [${this.initParams.length} params]`, s = this.options.constraint ? Qa(this.options.constraint.toString(), 60) : null;
    return W(ct, { label: i, active: r, color: n, path: e, children: [s && W("div", { style: { fontSize: 9, color: "rgb(120, 113, 108)", background: "rgba(0,0,0,0.04)", borderRadius: 3, padding: "2px 4px", whiteSpace: "pre-wrap", wordBreak: "break-all" }, children: ["constraint: ", s] }), this.rendered && O(Ii, { renderedStates: [this.rendered] })] });
  }
  overlayVis({ opacity: e }) {
    if (!this.rendered || !this.lastFrame) return null;
    let { pointer: r } = this.lastFrame, n = this.rendered.position, i = r.dist(n);
    return W("g", { opacity: e, children: [this.exploredPositions?.map((s, a) => O("line", { ...s.xy1(), ...r.xy2(), stroke: "magenta", strokeWidth: 0.5, opacity: 0.5 }, a)), this.exploredPositions?.map((s, a) => O("circle", { ...s.cxy(), r: 2, fill: "magenta", opacity: 0.5 }, `c${a}`)), O("circle", { ...n.cxy(), r: 5, fill: "magenta" }), O(cr, { from: n, to: r, distance: i })] });
  }
};
function ip(t, e = {}) {
  let r = e.gap ?? 50, n = e.gapIn ?? r, i = e.gapOut ?? r;
  return Y(n <= i, `whenFar: gapIn (${n}) must be <= gapOut (${i}), otherwise the behavior oscillates`), G(sp)(this, bn(t), n, i);
}
var sp = class extends St {
  constructor(e, r, n, i, s) {
    super(e);
    M(this, "name", "whenFar");
    M(this, "foreground");
    M(this, "background");
    M(this, "inForeground", !0);
    this.gapIn = i, this.gapOut = s, this.foreground = this.child("fg", r), this.background = this.child("bg", n);
  }
  frame(e) {
    let r = this.foreground.run(e), n = this.inForeground ? this.gapOut : this.gapIn;
    return this.inForeground = r.gap <= n, this.inForeground ? r : this.background.run(e);
  }
  treeView(e) {
    return O(ct, { label: `whenFar (${this.gapIn === this.gapOut ? `gap=${this.gapIn}` : `gapIn=${this.gapIn} gapOut=${this.gapOut}`})`, path: e.path, children: W("div", { style: { display: "flex", flexDirection: "row", gap: 4 }, children: [O(ri, { label: "fg", children: this.foreground.treeView(e) }), O(ri, { label: "bg", children: this.background.treeView(e) })] }) });
  }
  overlayVis({ active: e }) {
    if (this.frames === 0) return null;
    let r = O(Ct, { op: this.foreground.op, active: e && this.inForeground });
    return this.inForeground ? r : W("g", { children: [r, O(Ct, { op: this.background.op, active: e })] });
  }
};
function ap({ easing: t, duration: e }, r) {
  return (typeof t == "function" ? t : t === "cubic-out" ? of : t === "elastic-out" ? lf : fn(t))(r / e);
}
function dr(t) {
  if (t === !1) return !1;
  if (typeof t == "object") return t;
  let e = { easing: "cubic-out", duration: 200 };
  return typeof t == "string" || typeof t == "function" ? e.easing = t : typeof t == "number" ? e.duration = t : t === !0 || t === void 0 || fn(t), e;
}
function op(t) {
  return G(lp)(this, dr(t));
}
var lp = class extends gt {
  constructor(e, r, n) {
    super(e, r);
    M(this, "name", "withBranchTransition");
    this.transition = n;
  }
  frame(e) {
    return { ...this.inner.run(e), activePathTransition: this.transition };
  }
  treeView(e) {
    return this.wrapperView(e, Za(this.transition));
  }
};
function up({ transition: t = !0, ...e } = {}) {
  return G(cp)(this, { ...e, transition: dr(t) });
}
var cp = class extends gt {
  constructor(e, r, n) {
    super(e, r);
    M(this, "name", "withChaining");
    this.chaining = n;
  }
  frame(e) {
    let r = this.inner.run(e);
    return { ...r, chainNow: r.chainNow ?? this.chaining };
  }
};
function hp(t) {
  return G(fp)(this, dr(t));
}
var fp = class extends gt {
  constructor(e, r, n) {
    super(e, r);
    M(this, "name", "withDropTransition");
    this.transition = n;
  }
  frame(e) {
    return { ...this.inner.run(e), dropTransition: this.transition };
  }
  treeView(e) {
    return this.wrapperView(e, Za(this.transition));
  }
};
function dp({ ghost: t, tether: e } = {}) {
  return G(pp)(this, t === !0 ? { opacity: 0.5 } : t, e);
}
var pp = class extends gt {
  constructor(e, r, n, i) {
    super(e, r);
    M(this, "name", "withFloating");
    M(this, "draggedId");
    M(this, "cachedFloatAnchored", null);
    M(this, "computed");
    this.ghost = n, this.tether = i, Y(e.draggedId !== null, "Floating drags require the dragged element to have an id"), this.draggedId = e.draggedId;
  }
  get outputPreview() {
    return this.computed?.().preview;
  }
  get elementPos() {
    return this.computed?.().elementPos;
  }
  frame(e) {
    let { ctx: r, draggedId: n } = this, i = this.inner.run(e), s = null, a = () => {
      if (s) return s;
      let o = i.preview(), l = o.byId.get(n), u = null, f, c;
      if (l) {
        u = ue(l.element.props.transform, r.anchorPos);
        let { remaining: y, extracted: g } = Bs(o, n);
        f = Nn(g, kr(u.mul(-1))), this.cachedFloatAnchored = f, c = this.ghost === void 0 ? y : Hr(y, Us(qa(g, "ghost-"), this.ghost));
      } else {
        if (this.cachedFloatAnchored === null) {
          let y = mn(r.draggable, r.startState, n, !1), { extracted: g } = Bs(y, n), v = y.byId.get(n);
          this.cachedFloatAnchored = Nn(g, kr((v ? ue(v.element.props.transform, r.anchorPos) : L(0)).mul(-1)));
        }
        f = this.cachedFloatAnchored, c = o;
      }
      let h = e.pointer;
      if (u && this.tether) {
        let y = e.pointer.sub(u), g = y.len();
        if (g > 1e-6) {
          let v = this.tether(g);
          h = u.add(y.mul(v / g));
        }
      }
      let p = Nn(f, kr(h));
      return s = { preview: Hr(c, Ei(p, (y) => Us(y, { dragologyTransition: !1 }), (y) => Ga(y, 1e6))), elementPos: u }, s;
    };
    return this.computed = a, { ...i, preview: () => a().preview, dropTransition: void 0, activePathTransition: void 0, chainNow: void 0, grabPos: this.tether ? void 0 : e.pointer };
  }
  treeView(e) {
    let r = this.outputPreview;
    return W(ct, { label: "withFloating", color: e.color, path: e.path, children: [r && O(Ie, { outputPreview: r }), this.inner.treeView(e)] });
  }
  overlayVis({ active: e, opacity: r }) {
    if (!this.lastFrame) return null;
    let { pointer: n } = this.lastFrame, i = this.elementPos;
    return W("g", { children: [O(Ct, { op: this.inner.op, active: e }), i && W("g", { opacity: r, children: [O("circle", { cx: i.x, cy: i.y, r: 5, fill: "magenta" }), O(cr, { from: i, to: n, distance: n.dist(i) })] })] });
  }
};
function gp(t) {
  return G(yp)(this, t);
}
var yp = class extends gt {
  constructor(e, r, n) {
    super(e, r, { ...e, ...yn(n, e) });
    M(this, "name", "withInitContext");
    this.f = n;
  }
  frame(e) {
    return this.inner.run(e);
  }
}, mp = 2e6, bp = 0;
function xp(t) {
  return G(vp)(this, t);
}
var vp = class extends gt {
  constructor(e, r, n) {
    super(e, r);
    M(this, "name", "withOverlay");
    M(this, "layer");
    this.layer = Ga(qa(pn(O("g", { children: n })), `overlay-${bp++}-`), mp);
  }
  frame(e) {
    let r = this.inner.run(e);
    return { ...r, preview: () => Hr(r.preview(), this.layer) };
  }
};
function wp(t, { transition: e = !1, chain: r = !1 } = {}) {
  return G(_p)(this, t, dr(e), r);
}
var _p = class extends gt {
  constructor(e, r, n, i, s) {
    super(e, r);
    M(this, "name", "withSnapRadius");
    M(this, "dropRendered", Xe((e) => Rt(this.ctx, e)));
    M(this, "dropGrabPos", Xe((e) => Ba(xn(this.ctx, e))));
    M(this, "snapped", !1);
    M(this, "segment");
    M(this, "preview");
    this.radius = n, this.transition = i, this.chain = s;
  }
  get outputPreview() {
    return this.preview?.();
  }
  frame(e) {
    let r = this.inner.run(e), n = r.grabPos ?? Kr(this.ctx, r.preview()), i = this.dropGrabPos(r.dropState), s = i.dist2(n) <= this.radius ** 2, a = s ? () => this.dropRendered(r.dropState) : r.preview;
    return this.snapped = s, this.preview = a, this.segment = this.transition ? s ? "snapped" : "unsnapped" : void 0, { ...r, preview: a, grabPos: s ? i : n, activePath: Ai(this.segment, r.activePath), activePathTransition: this.transition || void 0, chainNow: this.chain && s ? { transition: this.transition } : void 0 };
  }
  treeView(e) {
    let { snapped: r, transition: n } = this, i = [n && "transition", this.chain && "chain"].filter(Boolean), s = `withSnapRadius (${this.radius}${i.length ? `, ${i.join(", ")}` : ""})`;
    return n && (s += r ? " [snapped]" : " [not snapped]"), W(ct, { label: s, path: e.path, children: [this.outputPreview && O(Ie, { outputPreview: this.outputPreview }), this.inner.treeView({ ...e, childPath: this.segment ? `${e.childPath}${this.segment}/` : e.childPath })] });
  }
}, ho = class {
  get onDrop() {
    return Vd;
  }
  get whenFar() {
    return ip;
  }
  get withSnapRadius() {
    return wp;
  }
  get withDropTransition() {
    return hp;
  }
  get withOverlay() {
    return xp;
  }
  get withBranchTransition() {
    return op;
  }
  get changeFrame() {
    return Md;
  }
  get changeResult() {
    return kd;
  }
  get changeGap() {
    return Id;
  }
  get withFloating() {
    return dp;
  }
  get withChaining() {
    return up;
  }
  get during() {
    return zd;
  }
  get withInitContext() {
    return gp;
  }
  with(t) {
    return t(this);
  }
};
function tg(t) {
  let e = G(t);
  return (...r) => (n) => e(n, ...r);
}
function G(t) {
  return (...e) => Pp({ opClass: t, args: e });
}
function Pp(t) {
  return Object.assign(Object.create(ho.prototype), t);
}
function Sp(t) {
  return typeof t == "object" && !!t && Object.getPrototypeOf(t) === ho.prototype;
}
function bn(t) {
  return Sp(t) ? t : oo(t);
}
var fo = class {
  constructor(t) {
    M(this, "state");
    this.state = t;
  }
  get fixed() {
    return oo;
  }
  get between() {
    return Pd;
  }
  get closest() {
    return Rd;
  }
  get vary() {
    return tp.prototype.vary;
  }
  get varyFunc() {
    return ep;
  }
  get custom() {
    return Dd;
  }
  get dropTarget() {
    return Nd;
  }
  get substate() {
    return Xd.prototype.substate;
  }
  get switchToStateAndFollow() {
    return Hd;
  }
  get reactTo() {
    return Ud.prototype.reactTo;
  }
}, po = Symbol("VaryPath");
function eg(...t) {
  return { [po]: t };
}
function $p(t) {
  return t[po];
}
function pr(t) {
  let e = { ...t, d: new fo(t.state), embed(r, n) {
    return Op(r, e, n);
  } };
  return e;
}
var go = "dragologyOnDrag";
function gr(t) {
  return t.props[go] || void 0;
}
function Op(t, e, r) {
  return dn(t(pr({ state: Gr(e.state, r), draggedId: e.draggedId, setState: (n, i) => {
    e.setState((s) => {
      let a = Gr(s, r);
      return Ae(s, r, typeof n == "function" ? n(a) : n);
    }, i);
  }, isTracking: e.isTracking })), (n) => {
    let i = gr(n);
    if (i) return { [go]: () => {
      let s = i();
      return e.d.substate(e.state, r, () => s);
    } };
  });
}
function Mp(t, e) {
  return to(new t.opClass(e, ...t.args));
}
function Rt(t, e) {
  return mn(t.draggable, e, t.draggedId, !1);
}
function xn(t, e) {
  if (t.draggedId) {
    let i = De(t.draggable(pr({ state: e, draggedId: t.draggedId, setState: () => {
      throw Error("This function should not have been called");
    }, isTracking: !0 })), (s) => s.props.id === t.draggedId);
    return i ? ue(i.accumulatedTransform, t.anchorPos) : null;
  }
  let r = fr(t.draggable, e, t.draggedId, !0), n = lr(t.draggedPath, r);
  return n ? ue(n.accumulatedTransform, t.anchorPos) : null;
}
function Di(t, e) {
  let r = Ka(t.draggedPath, e);
  return r ? ue(r.accumulatedTransform, t.anchorPos) : null;
}
function Kr(t, e) {
  return Ba(Di(t, e));
}
var Tp = "http://www.w3.org/2000/svg", Ip = class {
  constructor() {
    M(this, "containers", /* @__PURE__ */ new Map());
    M(this, "refCallbacks", /* @__PURE__ */ new Map());
    M(this, "retained", /* @__PURE__ */ new Map());
  }
  frame(t, e) {
    let r = /* @__PURE__ */ new Map(), n = new Map([...t.byId].map(([a, o]) => [a, { ...o, element: this.walk(o.element, !1, void 0, r) }])), i = e ? new Map([...this.retained, ...r]) : r;
    this.retained = i;
    for (let a of [...this.containers.keys()]) i.has(a) || (this.containers.delete(a), this.refCallbacks.delete(a));
    let s = [...i.values()].map((a) => O("g", { onPointerDown: a.grab, children: Oo(Ap(a.element), this.container(a)) }, a.key));
    return { layered: { ...t, byId: n }, portals: s };
  }
  container(t) {
    let e = this.containers.get(t.key);
    if (e && e.html === t.html) return e.el;
    let r;
    return t.html ? (r = document.createElement("div"), r.style.display = "contents") : r = document.createElementNS(Tp, "g"), this.containers.set(t.key, { el: r, html: t.html }), r;
  }
  refCallback(t) {
    let e = this.refCallbacks.get(t);
    return e || (e = (r) => {
      let n = this.containers.get(t)?.el;
      r && n && n.parentNode !== r && r.appendChild(n);
    }, this.refCallbacks.set(t, e)), e;
  }
  walk(t, e, r, n) {
    if (Xt(t)) {
      let h = or(t);
      return h === void 0 ? t : (n.set(h, { key: h, element: t, html: e, grab: r }), e ? te("div", { key: t.key, ref: this.refCallback(h), style: { display: "contents" } }) : te("g", { key: t.key, ref: this.refCallback(h) }));
    }
    let { children: i, onPointerDown: s, dragologyOnDrag: a } = t.props;
    if (i === void 0 || !ar(t)) return t;
    let o = a && s ? s : r, l = t.type === "foreignObject", u = !1, f = (h) => {
      if (Array.isArray(h)) {
        let y = h.map(f);
        return y.some((g, v) => g !== h[v]) ? y : h;
      }
      if (!pe(h)) return h;
      let p = this.walk(h, l, o, n);
      return p !== h && (u = !0), p;
    }, c = f(i);
    return u ? ut(t, void 0, c) : t;
  }
};
function Ap(t) {
  let e = {};
  for (let [r, n] of Object.entries(t.props)) r === "data-path" || r.startsWith("dragology") || (e[r] = n);
  return te(t.type, e);
}
function kp(t) {
  let e = Ot(t);
  e.current = t, Tr(() => {
    let r, n = () => {
      e.current(), r = requestAnimationFrame(n);
    };
    return r = requestAnimationFrame(n), () => {
      cancelAnimationFrame(r);
    };
  }, []);
}
function Cp() {
  let [t, e] = Zr(null);
  if (t) throw t;
  return tr((r) => {
    throw e(r), r;
  }, []);
}
function Rp() {
  let t = Cp();
  return tr(function(e) {
    return (...r) => {
      try {
        return e(...r);
      } catch (n) {
        return t(n);
      }
    };
  }, [t]);
}
function Ep(t) {
  let [e, r] = Zr(t), n = Ot(e);
  return n.current = e, [e, tr((i) => {
    let s = typeof i == "function" ? i(n.current) : i;
    n.current = s, r(s);
  }, []), n];
}
function Je(t, e) {
  let r = dr(t);
  return r === !1 ? null : { layered: e(), time: performance.now(), transition: r };
}
function rg({ state: t, initialState: e, ...r }) {
  return Y(!(t !== void 0 && e !== void 0), "DraggableRenderer: provide either 'state' or 'initialState', not both"), t === void 0 ? O(Dp, { ...r, initialState: e }) : O(yo, { ...r, state: t });
}
function Dp({ initialState: t, onDropState: e, ...r }) {
  let [n, i] = Zr(t), s = tr((a) => {
    i(a), e?.(a);
  }, [e]);
  return O(yo, { ...r, state: n, onDropState: s });
}
function yo({ draggable: t, state: e, width: r, height: n, onDropState: i, onDragState: s, onDragStatus: a, showDebugOverlay: o, showVaryVisualizer: l, dragThreshold: u = 2, simulateDrag: f }) {
  let c = Rp(), [h, p, y] = Ep({ type: "idle", state: e, springOrigin: null });
  if (h.type === "idle" && h.state !== e) {
    let w = mn(t, h.state, null, !1), C = we(h.springOrigin, w);
    p({ ...h, state: e, springOrigin: Je(!0, () => C) });
  }
  Tr(() => {
    a?.(h);
  }, [h, a]);
  let g = Ot(void 0);
  Po(() => {
    let w = h.type === "dragging" ? h.result.dropState : void 0;
    w !== void 0 && w !== g.current && s?.(w), g.current = w;
  }, [h, s]);
  let v = Ot(void 0), b = Ot(void 0), x = () => b.current ?? v.current, P = Ot(i);
  P.current = i;
  let m = Ot(s);
  m.current = s;
  let d = Ot(!1), [E, V] = Zr(null), z = tr((w) => {
    Y(!!E);
    let C = E.getBoundingClientRect(), $ = E.width.baseVal.value === 0 ? 1 : C.width / E.width.baseVal.value, k = L((w.clientX - C.left) / $, (w.clientY - C.top) / $);
    return v.current = k, k;
  }, [E]);
  if (kp(c(() => {
    let w = Fp(y.current, x(), performance.now());
    w && p(w);
  })), f && h.type === "idle" && !h.pendingDrag) {
    let w = f.id, C = f.offset ? L(f.offset) : L(0, 0), $ = De(fr(t, e, w, !0), (k) => k.props.id === w);
    if ($) {
      let k = Ci($.element);
      if (!k.empty) {
        let B = si(k), N = ue($.accumulatedTransform, B).add(C);
        b.current = N;
        let X = gr($.element)?.(), A = or($.element);
        X && A && p(Fi(X, { draggable: t, draggedPath: A, draggedId: w, anchorPos: B, startState: e, debug: { varyVisualizer: !1 } }, e, { pointer: N }, null));
      }
    }
  }
  Tr(() => {
    document.body.style.cursor = h.type === "dragging" ? "grabbing" : "default";
  }, [h.type]);
  let S = !f && (h.type === "dragging" || h.type === "idle" && !!h.pendingDrag);
  Tr(() => {
    if (!S) return;
    let w = c(($) => {
      let k = y.current;
      if (k.type === "idle" && k.pendingDrag) {
        let { pendingDrag: B } = k;
        L($.clientX, $.clientY).sub(B.startClientPos).len2() > B.threshold * B.threshold && (z($), p(B.status));
      } else z($);
    }), C = c(($) => {
      let k = y.current;
      if (k.type === "idle" && k.pendingDrag) {
        p({ type: "idle", state: k.state, springOrigin: k.springOrigin });
        return;
      }
      if (k.type !== "dragging") return;
      d.current = !0;
      let B = { pointer: z($) }, N = k.behavior(B), X = N.dropState;
      p({ type: "idle", state: X, springOrigin: Je(N.dropTransition, () => we(k.springOrigin, N.preview())) }), P.current?.(X), m.current?.(X);
    });
    return document.addEventListener("pointermove", w), document.addEventListener("pointerup", C), () => {
      document.removeEventListener("pointermove", w), document.removeEventListener("pointerup", C);
    };
  }, [c, y, S, p, z]);
  let D = Li(() => ({ draggable: t, catchToRenderError: c, setPointerFromEvent: z, setStatus: p, onDropState: i, dragThreshold: u, showVaryVisualizer: l ?? !1, showDebugOverlay: o ?? !1 }), [c, t, u, i, p, z, l, o]), R = Ot(null);
  R.current ?? (R.current = new Ip());
  let I = Li(() => {
    let { layered: w, portals: C } = R.current.frame(h.type === "idle" ? Lp(h, D) : we(h.springOrigin, h.result.preview()), h.type === "dragging");
    return { layers: ur(w), portals: C };
  }, [h, D]), j = x();
  return W("svg", { ref: V, width: r, height: n, xmlns: "http://www.w3.org/2000/svg", style: { overflow: "visible", userSelect: "none", touchAction: "none", ...f ? { pointerEvents: "none" } : {} }, onPointerDownCapture: () => {
    d.current = !1;
  }, onClickCapture: (w) => {
    d.current && (d.current = !1, w.stopPropagation(), w.preventDefault());
  }, children: [I.layers, I.portals, h.type === "dragging" && o && j && O(Tf, { children: O(Ct, { op: h.result.op }) }), f && b.current && O("circle", { cx: b.current.x, cy: b.current.y, r: 4, fill: "red", stroke: "white", strokeWidth: 1.5, opacity: 0.8 })] });
}
function we(t, e) {
  if (!t) return e;
  let r = performance.now() - t.time, n = ap(t.transition, r), i = ao(e, t.layered, 1 - n, "a");
  for (let [s, a] of i.byId.entries()) if (a.element.props.dragologyTransition === !1) {
    let o = e.byId.get(s);
    o && i.byId.set(s, o);
  }
  return i;
}
function Fp(t, e, r) {
  if (t.type === "dragging") {
    if (!e) return null;
    let n = { pointer: e }, i = t.behavior(n), s = Np(t, n, i);
    if (s !== t) return s;
    let a = t.springOrigin;
    return i.activePath !== t.result.activePath && (a = Je(i.activePathTransition, () => we(a, t.result.preview()))), a && r - a.time >= a.transition?.duration && (a = null), { ...t, result: i, springOrigin: a };
  }
  return t.type === "idle" && t.springOrigin ? r - t.springOrigin.time >= t.springOrigin.transition.duration ? { ...t, springOrigin: null } : { ...t } : null;
}
function Np(t, e, r) {
  if (!r.chainNow || Gc(r.dropState, t.startState)) return t;
  let n = r.dropState, i = r.chainNow.draggedId ?? t.behaviorCtx.draggedId, s = fr(t.behaviorCtx.draggable, n, i, !0), a = i ? De(s, (h) => h.props.id === i) : lr(t.behaviorCtx.draggedPath, s);
  Y(!!a, `Chained drag must have a valid dragged element; couldn't find element with id ${i}`);
  let o = r.chainNow.followSpec ?? gr(a.element)?.();
  if (!o) return t;
  let l = r.chainNow.transition, u = Je(l, () => we(t.springOrigin, t.result.preview())), f = or(a.element);
  Y(!!f, "Chained element must have a path");
  let c = t.behaviorCtx.anchorPos;
  return Fi(o, { ...t.behaviorCtx, draggedPath: f, draggedId: i, anchorPos: c, startState: n }, n, e, u);
}
function Fi(t, e, r, n, i) {
  let s = Mp(t, e);
  return { type: "dragging", startState: r, behavior: s, specForDropZoneVis: t, behaviorCtx: e, result: s(n), springOrigin: i };
}
function jp(t, e) {
  let r = lr(e, t);
  return r ? [...r.ancestors, r.element].some((n) => n.props.onClick || n.props.onDoubleClick) : !1;
}
function zp(t, e, r) {
  let n = Xa(t);
  return Ei(n, (i) => dn(i, (s) => {
    let a = gr(s);
    if (a) return Y(!s.props.onPointerDown, "Elements with dragology cannot have onPointerDown (it is overwritten)"), { style: { cursor: "grab", ...s.props.style || {} }, onPointerDown: r.catchToRenderError((o) => {
      o.stopPropagation();
      let l = r.setPointerFromEvent(o.nativeEvent), u = a(), f = s.props.id ?? null, c = or(s);
      Y(!!c, "Dragged element must have a path");
      let h = lr(c, n);
      Y(!!h, "Dragged element must be findable by path");
      let p = Ef(h.accumulatedTransform, l), y = Fi(u, { draggable: r.draggable, draggedPath: c, draggedId: f, anchorPos: p, startState: e, debug: { varyVisualizer: r.showVaryVisualizer } }, e, { pointer: l }, null), g = jp(n, c);
      r.dragThreshold <= 0 || !g ? r.setStatus(y) : r.setStatus({ type: "idle", state: e, springOrigin: null, pendingDrag: { startClientPos: L(o.clientX, o.clientY), threshold: r.dragThreshold, status: y } });
    }) };
  }), pn);
}
function Lp(t, e) {
  let r = zp(e.draggable(pr({ state: t.state, draggedId: null, setState: e.catchToRenderError((n, { transition: i } = {}) => {
    let s = typeof n == "function" ? n(t.state) : n, a = { type: "idle", state: s, springOrigin: Je(i, () => mn(e.draggable, t.state, null, !1)) };
    e.setStatus(a), e.onDropState?.(s);
  }), isTracking: !1 })), t.state, e);
  return we(t.springOrigin, r);
}
var mo = class extends Error {
  constructor(t) {
    super("AmbError"), this.optionsLength = t;
  }
}, bo = class extends Error {
  constructor() {
    super("FailError");
  }
}, ui = [], xo = 0;
function ng(t) {
  let e = xo++;
  if (e < ui.length) return t[ui[e]];
  throw new mo(t.length);
}
function Vp(t) {
  return vo(t, []);
}
function* vo(t, e) {
  try {
    ui = e, xo = 0, yield t();
  } catch (r) {
    if (r instanceof mo) for (let n = 0; n < r.optionsLength; n++) yield* vo(t, [...e, n]);
    else {
      if (r instanceof bo) return;
      throw r;
    }
  }
}
function Bp(t) {
  return [...Vp(t)];
}
function Up() {
  throw new bo();
}
function ig(t) {
  t || Up();
}
function sg(t, e) {
  return Bp(() => Mf(t, e));
}
export {
  ct as Box,
  od as DefaultValueView,
  cr as DistanceLine,
  rg as DraggableRenderer,
  gt as Modifier,
  St as Operator,
  Ie as OutputThumbnail,
  Ct as OverlayVis,
  ri as Slot,
  Ii as StateThumbnails,
  ai as ValueView,
  Kp as ValueViewProvider,
  L as Vec2,
  ng as amb,
  Jp as and,
  Mp as dragSpecToBehavior,
  Gp as draggableLine,
  Up as fail,
  Di as getElementPosition,
  xn as getElementPositionCheap,
  Qp as inOrder,
  Jd as lessThan,
  tg as modifier,
  Zp as moreThan,
  G as operator,
  eg as param,
  sd as path,
  sg as produceAmb,
  Rt as renderStateReadOnly,
  ig as require,
  bn as resolveDragSpecLike,
  ro as rotateDeg,
  qp as rotateRad,
  Bp as runAmb,
  id as scale,
  kr as translate
};
