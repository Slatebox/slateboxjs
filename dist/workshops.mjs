var hs = Object.defineProperty;
var cs = (t, e, r) => e in t ? hs(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r;
var O = (t, e, r) => cs(t, typeof e != "symbol" ? e + "" : e, r);
import X, { createContext as Mn, useState as Or, useCallback as We, useEffect as dr, useRef as _t, useLayoutEffect as fs, useMemo as Qn, createElement as qt, cloneElement as lt, Fragment as Jn, Component as ds, createRef as ps, useContext as Pe } from "react";
import { jsx as S, jsxs as Y, Fragment as Tr } from "react/jsx-runtime";
import { createPortal as gs } from "react-dom";
import { workshopPositions as sa, availableLanes as sn, moveWorkshopCard as on, workshopLayout as ys, laneColors as ms } from "./workshop-model.mjs";
import { industrialWorkshop as Pd, nightTransfer as $d, validateWorkshop as Md, workshopToSlate as Sd } from "./workshop-model.mjs";
var oa = typeof global == "object" && global && global.Object === Object && global, bs = typeof self == "object" && self && self.Object === Object && self, It = oa || bs || Function("return this")(), Nt = It.Symbol, la = Object.prototype, xs = la.hasOwnProperty, vs = la.toString, Ae = Nt ? Nt.toStringTag : void 0;
function ws(t) {
  var e = xs.call(t, Ae), r = t[Ae];
  try {
    t[Ae] = void 0;
    var n = !0;
  } catch {
  }
  var i = vs.call(t);
  return n && (e ? t[Ae] = r : delete t[Ae]), i;
}
var _s = Object.prototype, Ps = _s.toString;
function $s(t) {
  return Ps.call(t);
}
var Ms = "[object Null]", Ss = "[object Undefined]", ti = Nt ? Nt.toStringTag : void 0;
function $e(t) {
  return t == null ? t === void 0 ? Ss : Ms : ti && ti in Object(t) ? ws(t) : $s(t);
}
function ge(t) {
  return t != null && typeof t == "object";
}
var Os = "[object Symbol]";
function Xe(t) {
  return typeof t == "symbol" || ge(t) && $e(t) == Os;
}
function Ts(t, e) {
  for (var r = -1, n = t == null ? 0 : t.length, i = Array(n); ++r < n; )
    i[r] = e(t[r], r, t);
  return i;
}
var St = Array.isArray, ei = Nt ? Nt.prototype : void 0, ri = ei ? ei.toString : void 0;
function ua(t) {
  if (typeof t == "string")
    return t;
  if (St(t))
    return Ts(t, ua) + "";
  if (Xe(t))
    return ri ? ri.call(t) : "";
  var e = t + "";
  return e == "0" && 1 / t == -1 / 0 ? "-0" : e;
}
var Is = /\s/;
function As(t) {
  for (var e = t.length; e-- && Is.test(t.charAt(e)); )
    ;
  return e;
}
var ks = /^\s+/;
function Es(t) {
  return t && t.slice(0, As(t) + 1).replace(ks, "");
}
function ye(t) {
  var e = typeof t;
  return t != null && (e == "object" || e == "function");
}
var ni = NaN, Cs = /^[-+]0x[0-9a-f]+$/i, Rs = /^0b[01]+$/i, Ds = /^0o[0-7]+$/i, Fs = parseInt;
function js(t) {
  if (typeof t == "number")
    return t;
  if (Xe(t))
    return ni;
  if (ye(t)) {
    var e = typeof t.valueOf == "function" ? t.valueOf() : t;
    t = ye(e) ? e + "" : e;
  }
  if (typeof t != "string")
    return t === 0 ? t : +t;
  t = Es(t);
  var r = Rs.test(t);
  return r || Ds.test(t) ? Fs(t.slice(2), r ? 2 : 8) : Cs.test(t) ? ni : +t;
}
var ii = 1 / 0, Ns = 17976931348623157e292;
function Ur(t) {
  if (!t)
    return t === 0 ? t : 0;
  if (t = js(t), t === ii || t === -ii) {
    var e = t < 0 ? -1 : 1;
    return e * Ns;
  }
  return t === t ? t : 0;
}
function Ls(t) {
  return t;
}
var Vs = "[object AsyncFunction]", zs = "[object Function]", Bs = "[object GeneratorFunction]", Ws = "[object Proxy]";
function ha(t) {
  if (!ye(t))
    return !1;
  var e = $e(t);
  return e == zs || e == Bs || e == Vs || e == Ws;
}
var qr = It["__core-js_shared__"], ai = function() {
  var t = /[^.]+$/.exec(qr && qr.keys && qr.keys.IE_PROTO || "");
  return t ? "Symbol(src)_1." + t : "";
}();
function Xs(t) {
  return !!ai && ai in t;
}
var Ys = Function.prototype, Hs = Ys.toString;
function ne(t) {
  if (t != null) {
    try {
      return Hs.call(t);
    } catch {
    }
    try {
      return t + "";
    } catch {
    }
  }
  return "";
}
var Us = /[\\^$.*+?()[\]{}|]/g, qs = /^\[object .+?Constructor\]$/, Gs = Function.prototype, Ks = Object.prototype, Zs = Gs.toString, Qs = Ks.hasOwnProperty, Js = RegExp(
  "^" + Zs.call(Qs).replace(Us, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function to(t) {
  if (!ye(t) || Xs(t))
    return !1;
  var e = ha(t) ? Js : qs;
  return e.test(ne(t));
}
function eo(t, e) {
  return t?.[e];
}
function Me(t, e) {
  var r = eo(t, e);
  return to(r) ? r : void 0;
}
var ln = Me(It, "WeakMap"), ro = 9007199254740991, no = /^(?:0|[1-9]\d*)$/;
function Sn(t, e) {
  var r = typeof t;
  return e = e ?? ro, !!e && (r == "number" || r != "symbol" && no.test(t)) && t > -1 && t % 1 == 0 && t < e;
}
function On(t, e) {
  return t === e || t !== t && e !== e;
}
var io = 9007199254740991;
function Tn(t) {
  return typeof t == "number" && t > -1 && t % 1 == 0 && t <= io;
}
function ca(t) {
  return t != null && Tn(t.length) && !ha(t);
}
function ao(t, e, r) {
  if (!ye(r))
    return !1;
  var n = typeof e;
  return (n == "number" ? ca(r) && Sn(e, r.length) : n == "string" && e in r) ? On(r[e], t) : !1;
}
var so = Object.prototype;
function oo(t) {
  var e = t && t.constructor, r = typeof e == "function" && e.prototype || so;
  return t === r;
}
function lo(t, e) {
  for (var r = -1, n = Array(t); ++r < t; )
    n[r] = e(r);
  return n;
}
var uo = "[object Arguments]";
function si(t) {
  return ge(t) && $e(t) == uo;
}
var fa = Object.prototype, ho = fa.hasOwnProperty, co = fa.propertyIsEnumerable, da = si(/* @__PURE__ */ function() {
  return arguments;
}()) ? si : function(t) {
  return ge(t) && ho.call(t, "callee") && !co.call(t, "callee");
};
function fo() {
  return !1;
}
var pa = typeof exports == "object" && exports && !exports.nodeType && exports, oi = pa && typeof module == "object" && module && !module.nodeType && module, po = oi && oi.exports === pa, li = po ? It.Buffer : void 0, go = li ? li.isBuffer : void 0, un = go || fo, yo = "[object Arguments]", mo = "[object Array]", bo = "[object Boolean]", xo = "[object Date]", vo = "[object Error]", wo = "[object Function]", _o = "[object Map]", Po = "[object Number]", $o = "[object Object]", Mo = "[object RegExp]", So = "[object Set]", Oo = "[object String]", To = "[object WeakMap]", Io = "[object ArrayBuffer]", Ao = "[object DataView]", ko = "[object Float32Array]", Eo = "[object Float64Array]", Co = "[object Int8Array]", Ro = "[object Int16Array]", Do = "[object Int32Array]", Fo = "[object Uint8Array]", jo = "[object Uint8ClampedArray]", No = "[object Uint16Array]", Lo = "[object Uint32Array]", q = {};
q[ko] = q[Eo] = q[Co] = q[Ro] = q[Do] = q[Fo] = q[jo] = q[No] = q[Lo] = !0;
q[yo] = q[mo] = q[Io] = q[bo] = q[Ao] = q[xo] = q[vo] = q[wo] = q[_o] = q[Po] = q[$o] = q[Mo] = q[So] = q[Oo] = q[To] = !1;
function Vo(t) {
  return ge(t) && Tn(t.length) && !!q[$e(t)];
}
function zo(t) {
  return function(e) {
    return t(e);
  };
}
var ga = typeof exports == "object" && exports && !exports.nodeType && exports, Ce = ga && typeof module == "object" && module && !module.nodeType && module, Bo = Ce && Ce.exports === ga, Gr = Bo && oa.process, ui = function() {
  try {
    var t = Ce && Ce.require && Ce.require("util").types;
    return t || Gr && Gr.binding && Gr.binding("util");
  } catch {
  }
}(), hi = ui && ui.isTypedArray, ya = hi ? zo(hi) : Vo, Wo = Object.prototype, Xo = Wo.hasOwnProperty;
function Yo(t, e) {
  var r = St(t), n = !r && da(t), i = !r && !n && un(t), a = !r && !n && !i && ya(t), s = r || n || i || a, o = s ? lo(t.length, String) : [], l = o.length;
  for (var u in t)
    Xo.call(t, u) && !(s && // Safari 9 has enumerable `arguments.length` in strict mode.
    (u == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    i && (u == "offset" || u == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    a && (u == "buffer" || u == "byteLength" || u == "byteOffset") || // Skip index properties.
    Sn(u, l))) && o.push(u);
  return o;
}
function Ho(t, e) {
  return function(r) {
    return t(e(r));
  };
}
var Uo = Ho(Object.keys, Object), qo = Object.prototype, Go = qo.hasOwnProperty;
function Ko(t) {
  if (!oo(t))
    return Uo(t);
  var e = [];
  for (var r in Object(t))
    Go.call(t, r) && r != "constructor" && e.push(r);
  return e;
}
function ma(t) {
  return ca(t) ? Yo(t) : Ko(t);
}
var Zo = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, Qo = /^\w*$/;
function In(t, e) {
  if (St(t))
    return !1;
  var r = typeof t;
  return r == "number" || r == "symbol" || r == "boolean" || t == null || Xe(t) ? !0 : Qo.test(t) || !Zo.test(t) || e != null && t in Object(e);
}
var De = Me(Object, "create");
function Jo() {
  this.__data__ = De ? De(null) : {}, this.size = 0;
}
function tl(t) {
  var e = this.has(t) && delete this.__data__[t];
  return this.size -= e ? 1 : 0, e;
}
var el = "__lodash_hash_undefined__", rl = Object.prototype, nl = rl.hasOwnProperty;
function il(t) {
  var e = this.__data__;
  if (De) {
    var r = e[t];
    return r === el ? void 0 : r;
  }
  return nl.call(e, t) ? e[t] : void 0;
}
var al = Object.prototype, sl = al.hasOwnProperty;
function ol(t) {
  var e = this.__data__;
  return De ? e[t] !== void 0 : sl.call(e, t);
}
var ll = "__lodash_hash_undefined__";
function ul(t, e) {
  var r = this.__data__;
  return this.size += this.has(t) ? 0 : 1, r[t] = De && e === void 0 ? ll : e, this;
}
function te(t) {
  var e = -1, r = t == null ? 0 : t.length;
  for (this.clear(); ++e < r; ) {
    var n = t[e];
    this.set(n[0], n[1]);
  }
}
te.prototype.clear = Jo;
te.prototype.delete = tl;
te.prototype.get = il;
te.prototype.has = ol;
te.prototype.set = ul;
function hl() {
  this.__data__ = [], this.size = 0;
}
function Ir(t, e) {
  for (var r = t.length; r--; )
    if (On(t[r][0], e))
      return r;
  return -1;
}
var cl = Array.prototype, fl = cl.splice;
function dl(t) {
  var e = this.__data__, r = Ir(e, t);
  if (r < 0)
    return !1;
  var n = e.length - 1;
  return r == n ? e.pop() : fl.call(e, r, 1), --this.size, !0;
}
function pl(t) {
  var e = this.__data__, r = Ir(e, t);
  return r < 0 ? void 0 : e[r][1];
}
function gl(t) {
  return Ir(this.__data__, t) > -1;
}
function yl(t, e) {
  var r = this.__data__, n = Ir(r, t);
  return n < 0 ? (++this.size, r.push([t, e])) : r[n][1] = e, this;
}
function At(t) {
  var e = -1, r = t == null ? 0 : t.length;
  for (this.clear(); ++e < r; ) {
    var n = t[e];
    this.set(n[0], n[1]);
  }
}
At.prototype.clear = hl;
At.prototype.delete = dl;
At.prototype.get = pl;
At.prototype.has = gl;
At.prototype.set = yl;
var Fe = Me(It, "Map");
function ml() {
  this.size = 0, this.__data__ = {
    hash: new te(),
    map: new (Fe || At)(),
    string: new te()
  };
}
function bl(t) {
  var e = typeof t;
  return e == "string" || e == "number" || e == "symbol" || e == "boolean" ? t !== "__proto__" : t === null;
}
function Ar(t, e) {
  var r = t.__data__;
  return bl(e) ? r[typeof e == "string" ? "string" : "hash"] : r.map;
}
function xl(t) {
  var e = Ar(this, t).delete(t);
  return this.size -= e ? 1 : 0, e;
}
function vl(t) {
  return Ar(this, t).get(t);
}
function wl(t) {
  return Ar(this, t).has(t);
}
function _l(t, e) {
  var r = Ar(this, t), n = r.size;
  return r.set(t, e), this.size += r.size == n ? 0 : 1, this;
}
function kt(t) {
  var e = -1, r = t == null ? 0 : t.length;
  for (this.clear(); ++e < r; ) {
    var n = t[e];
    this.set(n[0], n[1]);
  }
}
kt.prototype.clear = ml;
kt.prototype.delete = xl;
kt.prototype.get = vl;
kt.prototype.has = wl;
kt.prototype.set = _l;
var Pl = "Expected a function";
function je(t, e) {
  if (typeof t != "function" || e != null && typeof e != "function")
    throw new TypeError(Pl);
  var r = function() {
    var n = arguments, i = e ? e.apply(this, n) : n[0], a = r.cache;
    if (a.has(i))
      return a.get(i);
    var s = t.apply(this, n);
    return r.cache = a.set(i, s) || a, s;
  };
  return r.cache = new (je.Cache || kt)(), r;
}
je.Cache = kt;
var $l = 500;
function Ml(t) {
  var e = je(t, function(n) {
    return r.size === $l && r.clear(), n;
  }), r = e.cache;
  return e;
}
var Sl = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, Ol = /\\(\\)?/g, Tl = Ml(function(t) {
  var e = [];
  return t.charCodeAt(0) === 46 && e.push(""), t.replace(Sl, function(r, n, i, a) {
    e.push(i ? a.replace(Ol, "$1") : n || r);
  }), e;
});
function Il(t) {
  return t == null ? "" : ua(t);
}
function ba(t, e) {
  return St(t) ? t : In(t, e) ? [t] : Tl(Il(t));
}
function kr(t) {
  if (typeof t == "string" || Xe(t))
    return t;
  var e = t + "";
  return e == "0" && 1 / t == -1 / 0 ? "-0" : e;
}
function xa(t, e) {
  e = ba(e, t);
  for (var r = 0, n = e.length; t != null && r < n; )
    t = t[kr(e[r++])];
  return r && r == n ? t : void 0;
}
function Al(t, e, r) {
  var n = t == null ? void 0 : xa(t, e);
  return n === void 0 ? r : n;
}
function kl(t, e) {
  for (var r = -1, n = e.length, i = t.length; ++r < n; )
    t[i + r] = e[r];
  return t;
}
function El() {
  this.__data__ = new At(), this.size = 0;
}
function Cl(t) {
  var e = this.__data__, r = e.delete(t);
  return this.size = e.size, r;
}
function Rl(t) {
  return this.__data__.get(t);
}
function Dl(t) {
  return this.__data__.has(t);
}
var Fl = 200;
function jl(t, e) {
  var r = this.__data__;
  if (r instanceof At) {
    var n = r.__data__;
    if (!Fe || n.length < Fl - 1)
      return n.push([t, e]), this.size = ++r.size, this;
    r = this.__data__ = new kt(n);
  }
  return r.set(t, e), this.size = r.size, this;
}
function $t(t) {
  var e = this.__data__ = new At(t);
  this.size = e.size;
}
$t.prototype.clear = El;
$t.prototype.delete = Cl;
$t.prototype.get = Rl;
$t.prototype.has = Dl;
$t.prototype.set = jl;
function Nl(t, e) {
  for (var r = -1, n = t == null ? 0 : t.length, i = 0, a = []; ++r < n; ) {
    var s = t[r];
    e(s, r, t) && (a[i++] = s);
  }
  return a;
}
function Ll() {
  return [];
}
var Vl = Object.prototype, zl = Vl.propertyIsEnumerable, ci = Object.getOwnPropertySymbols, Bl = ci ? function(t) {
  return t == null ? [] : (t = Object(t), Nl(ci(t), function(e) {
    return zl.call(t, e);
  }));
} : Ll;
function Wl(t, e, r) {
  var n = e(t);
  return St(t) ? n : kl(n, r(t));
}
function fi(t) {
  return Wl(t, ma, Bl);
}
var hn = Me(It, "DataView"), cn = Me(It, "Promise"), fn = Me(It, "Set"), di = "[object Map]", Xl = "[object Object]", pi = "[object Promise]", gi = "[object Set]", yi = "[object WeakMap]", mi = "[object DataView]", Yl = ne(hn), Hl = ne(Fe), Ul = ne(cn), ql = ne(fn), Gl = ne(ln), Dt = $e;
(hn && Dt(new hn(new ArrayBuffer(1))) != mi || Fe && Dt(new Fe()) != di || cn && Dt(cn.resolve()) != pi || fn && Dt(new fn()) != gi || ln && Dt(new ln()) != yi) && (Dt = function(t) {
  var e = $e(t), r = e == Xl ? t.constructor : void 0, n = r ? ne(r) : "";
  if (n)
    switch (n) {
      case Yl:
        return mi;
      case Hl:
        return di;
      case Ul:
        return pi;
      case ql:
        return gi;
      case Gl:
        return yi;
    }
  return e;
});
var bi = It.Uint8Array, Kl = "__lodash_hash_undefined__";
function Zl(t) {
  return this.__data__.set(t, Kl), this;
}
function Ql(t) {
  return this.__data__.has(t);
}
function gr(t) {
  var e = -1, r = t == null ? 0 : t.length;
  for (this.__data__ = new kt(); ++e < r; )
    this.add(t[e]);
}
gr.prototype.add = gr.prototype.push = Zl;
gr.prototype.has = Ql;
function Jl(t, e) {
  for (var r = -1, n = t == null ? 0 : t.length; ++r < n; )
    if (e(t[r], r, t))
      return !0;
  return !1;
}
function tu(t, e) {
  return t.has(e);
}
var eu = 1, ru = 2;
function va(t, e, r, n, i, a) {
  var s = r & eu, o = t.length, l = e.length;
  if (o != l && !(s && l > o))
    return !1;
  var u = a.get(t), f = a.get(e);
  if (u && f)
    return u == e && f == t;
  var h = -1, c = !0, p = r & ru ? new gr() : void 0;
  for (a.set(t, e), a.set(e, t); ++h < o; ) {
    var y = t[h], g = e[h];
    if (n)
      var v = s ? n(g, y, h, e, t, a) : n(y, g, h, t, e, a);
    if (v !== void 0) {
      if (v)
        continue;
      c = !1;
      break;
    }
    if (p) {
      if (!Jl(e, function(b, x) {
        if (!tu(p, x) && (y === b || i(y, b, r, n, a)))
          return p.push(x);
      })) {
        c = !1;
        break;
      }
    } else if (!(y === g || i(y, g, r, n, a))) {
      c = !1;
      break;
    }
  }
  return a.delete(t), a.delete(e), c;
}
function nu(t) {
  var e = -1, r = Array(t.size);
  return t.forEach(function(n, i) {
    r[++e] = [i, n];
  }), r;
}
function iu(t) {
  var e = -1, r = Array(t.size);
  return t.forEach(function(n) {
    r[++e] = n;
  }), r;
}
var au = 1, su = 2, ou = "[object Boolean]", lu = "[object Date]", uu = "[object Error]", hu = "[object Map]", cu = "[object Number]", fu = "[object RegExp]", du = "[object Set]", pu = "[object String]", gu = "[object Symbol]", yu = "[object ArrayBuffer]", mu = "[object DataView]", xi = Nt ? Nt.prototype : void 0, Kr = xi ? xi.valueOf : void 0;
function bu(t, e, r, n, i, a, s) {
  switch (r) {
    case mu:
      if (t.byteLength != e.byteLength || t.byteOffset != e.byteOffset)
        return !1;
      t = t.buffer, e = e.buffer;
    case yu:
      return !(t.byteLength != e.byteLength || !a(new bi(t), new bi(e)));
    case ou:
    case lu:
    case cu:
      return On(+t, +e);
    case uu:
      return t.name == e.name && t.message == e.message;
    case fu:
    case pu:
      return t == e + "";
    case hu:
      var o = nu;
    case du:
      var l = n & au;
      if (o || (o = iu), t.size != e.size && !l)
        return !1;
      var u = s.get(t);
      if (u)
        return u == e;
      n |= su, s.set(t, e);
      var f = va(o(t), o(e), n, i, a, s);
      return s.delete(t), f;
    case gu:
      if (Kr)
        return Kr.call(t) == Kr.call(e);
  }
  return !1;
}
var xu = 1, vu = Object.prototype, wu = vu.hasOwnProperty;
function _u(t, e, r, n, i, a) {
  var s = r & xu, o = fi(t), l = o.length, u = fi(e), f = u.length;
  if (l != f && !s)
    return !1;
  for (var h = l; h--; ) {
    var c = o[h];
    if (!(s ? c in e : wu.call(e, c)))
      return !1;
  }
  var p = a.get(t), y = a.get(e);
  if (p && y)
    return p == e && y == t;
  var g = !0;
  a.set(t, e), a.set(e, t);
  for (var v = s; ++h < l; ) {
    c = o[h];
    var b = t[c], x = e[c];
    if (n)
      var P = s ? n(x, b, c, e, t, a) : n(b, x, c, t, e, a);
    if (!(P === void 0 ? b === x || i(b, x, r, n, a) : P)) {
      g = !1;
      break;
    }
    v || (v = c == "constructor");
  }
  if (g && !v) {
    var m = t.constructor, d = e.constructor;
    m != d && "constructor" in t && "constructor" in e && !(typeof m == "function" && m instanceof m && typeof d == "function" && d instanceof d) && (g = !1);
  }
  return a.delete(t), a.delete(e), g;
}
var Pu = 1, vi = "[object Arguments]", wi = "[object Array]", ir = "[object Object]", $u = Object.prototype, _i = $u.hasOwnProperty;
function Mu(t, e, r, n, i, a) {
  var s = St(t), o = St(e), l = s ? wi : Dt(t), u = o ? wi : Dt(e);
  l = l == vi ? ir : l, u = u == vi ? ir : u;
  var f = l == ir, h = u == ir, c = l == u;
  if (c && un(t)) {
    if (!un(e))
      return !1;
    s = !0, f = !1;
  }
  if (c && !f)
    return a || (a = new $t()), s || ya(t) ? va(t, e, r, n, i, a) : bu(t, e, l, r, n, i, a);
  if (!(r & Pu)) {
    var p = f && _i.call(t, "__wrapped__"), y = h && _i.call(e, "__wrapped__");
    if (p || y) {
      var g = p ? t.value() : t, v = y ? e.value() : e;
      return a || (a = new $t()), i(g, v, r, n, a);
    }
  }
  return c ? (a || (a = new $t()), _u(t, e, r, n, i, a)) : !1;
}
function Er(t, e, r, n, i) {
  return t === e ? !0 : t == null || e == null || !ge(t) && !ge(e) ? t !== t && e !== e : Mu(t, e, r, n, Er, i);
}
var Su = 1, Ou = 2;
function Tu(t, e, r, n) {
  var i = r.length, a = i;
  if (t == null)
    return !a;
  for (t = Object(t); i--; ) {
    var s = r[i];
    if (s[2] ? s[1] !== t[s[0]] : !(s[0] in t))
      return !1;
  }
  for (; ++i < a; ) {
    s = r[i];
    var o = s[0], l = t[o], u = s[1];
    if (s[2]) {
      if (l === void 0 && !(o in t))
        return !1;
    } else {
      var f = new $t(), h;
      if (!(h === void 0 ? Er(u, l, Su | Ou, n, f) : h))
        return !1;
    }
  }
  return !0;
}
function wa(t) {
  return t === t && !ye(t);
}
function Iu(t) {
  for (var e = ma(t), r = e.length; r--; ) {
    var n = e[r], i = t[n];
    e[r] = [n, i, wa(i)];
  }
  return e;
}
function _a(t, e) {
  return function(r) {
    return r == null ? !1 : r[t] === e && (e !== void 0 || t in Object(r));
  };
}
function Au(t) {
  var e = Iu(t);
  return e.length == 1 && e[0][2] ? _a(e[0][0], e[0][1]) : function(r) {
    return r === t || Tu(r, t, e);
  };
}
function ku(t, e) {
  return t != null && e in Object(t);
}
function Eu(t, e, r) {
  e = ba(e, t);
  for (var n = -1, i = e.length, a = !1; ++n < i; ) {
    var s = kr(e[n]);
    if (!(a = t != null && r(t, s)))
      break;
    t = t[s];
  }
  return a || ++n != i ? a : (i = t == null ? 0 : t.length, !!i && Tn(i) && Sn(s, i) && (St(t) || da(t)));
}
function Cu(t, e) {
  return t != null && Eu(t, e, ku);
}
var Ru = 1, Du = 2;
function Fu(t, e) {
  return In(t) && wa(e) ? _a(kr(t), e) : function(r) {
    var n = Al(r, t);
    return n === void 0 && n === e ? Cu(r, t) : Er(e, n, Ru | Du);
  };
}
function ju(t) {
  return function(e) {
    return e?.[t];
  };
}
function Nu(t) {
  return function(e) {
    return xa(e, t);
  };
}
function Lu(t) {
  return In(t) ? ju(kr(t)) : Nu(t);
}
function Vu(t) {
  return typeof t == "function" ? t : t == null ? Ls : typeof t == "object" ? St(t) ? Fu(t[0], t[1]) : Au(t) : Lu(t);
}
function zu(t, e) {
  return Er(t, e);
}
function Bu(t, e) {
  return t < e;
}
function Wu(t, e, r) {
  for (var n = -1, i = t.length; ++n < i; ) {
    var a = t[n], s = e(a);
    if (s != null && (o === void 0 ? s === s && !Xe(s) : r(s, o)))
      var o = s, l = a;
  }
  return l;
}
function Pa(t, e) {
  return t && t.length ? Wu(t, Vu(e), Bu) : void 0;
}
var Xu = Math.ceil, Yu = Math.max;
function Hu(t, e, r, n) {
  for (var i = -1, a = Yu(Xu((e - t) / (r || 1)), 0), s = Array(a); a--; )
    s[++i] = t, t += r;
  return s;
}
function Uu(t) {
  return function(e, r, n) {
    return n && typeof n != "number" && ao(e, r, n) && (r = n = void 0), e = Ur(e), r === void 0 ? (r = e, e = 0) : r = Ur(r), n = n === void 0 ? e < r ? 1 : -1 : Ur(n), Hu(e, r, n);
  };
}
var $a = Uu(), qu = Array.prototype, Gu = qu.reverse;
function Ku(t) {
  return t == null ? t : Gu.call(t);
}
const Mt = 11102230246251565e-32, it = 134217729, Zu = (3 + 8 * Mt) * Mt;
function Zr(t, e, r, n, i) {
  let a, s, o, l, u = e[0], f = n[0], h = 0, c = 0;
  f > u == f > -u ? (a = u, u = e[++h]) : (a = f, f = n[++c]);
  let p = 0;
  if (h < t && c < r)
    for (f > u == f > -u ? (s = u + a, o = a - (s - u), u = e[++h]) : (s = f + a, o = a - (s - f), f = n[++c]), a = s, o !== 0 && (i[p++] = o); h < t && c < r; )
      f > u == f > -u ? (s = a + u, l = s - a, o = a - (s - l) + (u - l), u = e[++h]) : (s = a + f, l = s - a, o = a - (s - l) + (f - l), f = n[++c]), a = s, o !== 0 && (i[p++] = o);
  for (; h < t; )
    s = a + u, l = s - a, o = a - (s - l) + (u - l), u = e[++h], a = s, o !== 0 && (i[p++] = o);
  for (; c < r; )
    s = a + f, l = s - a, o = a - (s - l) + (f - l), f = n[++c], a = s, o !== 0 && (i[p++] = o);
  return (a !== 0 || p === 0) && (i[p++] = a), p;
}
function Qu(t, e) {
  let r = e[0];
  for (let n = 1; n < t; n++) r += e[n];
  return r;
}
function Ye(t) {
  return new Float64Array(t);
}
const Ju = (3 + 16 * Mt) * Mt, th = (2 + 12 * Mt) * Mt, eh = (9 + 64 * Mt) * Mt * Mt, ae = Ye(4), Pi = Ye(8), $i = Ye(12), Mi = Ye(16), at = Ye(4);
function rh(t, e, r, n, i, a, s) {
  let o, l, u, f, h, c, p, y, g, v, b, x, P, m, d, R, z, L;
  const $ = t - i, D = r - i, C = e - a, I = n - a;
  m = $ * I, c = it * $, p = c - (c - $), y = $ - p, c = it * I, g = c - (c - I), v = I - g, d = y * v - (m - p * g - y * g - p * v), R = C * D, c = it * C, p = c - (c - C), y = C - p, c = it * D, g = c - (c - D), v = D - g, z = y * v - (R - p * g - y * g - p * v), b = d - z, h = d - b, ae[0] = d - (b + h) + (h - z), x = m + b, h = x - m, P = m - (x - h) + (b - h), b = P - R, h = P - b, ae[1] = P - (b + h) + (h - R), L = x + b, h = L - x, ae[2] = x - (L - h) + (b - h), ae[3] = L;
  let N = Qu(4, ae), w = th * s;
  if (N >= w || -N >= w || (h = t - $, o = t - ($ + h) + (h - i), h = r - D, u = r - (D + h) + (h - i), h = e - C, l = e - (C + h) + (h - a), h = n - I, f = n - (I + h) + (h - a), o === 0 && l === 0 && u === 0 && f === 0) || (w = eh * s + Zu * Math.abs(N), N += $ * f + I * o - (C * u + D * l), N >= w || -N >= w)) return N;
  m = o * I, c = it * o, p = c - (c - o), y = o - p, c = it * I, g = c - (c - I), v = I - g, d = y * v - (m - p * g - y * g - p * v), R = l * D, c = it * l, p = c - (c - l), y = l - p, c = it * D, g = c - (c - D), v = D - g, z = y * v - (R - p * g - y * g - p * v), b = d - z, h = d - b, at[0] = d - (b + h) + (h - z), x = m + b, h = x - m, P = m - (x - h) + (b - h), b = P - R, h = P - b, at[1] = P - (b + h) + (h - R), L = x + b, h = L - x, at[2] = x - (L - h) + (b - h), at[3] = L;
  const E = Zr(4, ae, 4, at, Pi);
  m = $ * f, c = it * $, p = c - (c - $), y = $ - p, c = it * f, g = c - (c - f), v = f - g, d = y * v - (m - p * g - y * g - p * v), R = C * u, c = it * C, p = c - (c - C), y = C - p, c = it * u, g = c - (c - u), v = u - g, z = y * v - (R - p * g - y * g - p * v), b = d - z, h = d - b, at[0] = d - (b + h) + (h - z), x = m + b, h = x - m, P = m - (x - h) + (b - h), b = P - R, h = P - b, at[1] = P - (b + h) + (h - R), L = x + b, h = L - x, at[2] = x - (L - h) + (b - h), at[3] = L;
  const M = Zr(E, Pi, 4, at, $i);
  m = o * f, c = it * o, p = c - (c - o), y = o - p, c = it * f, g = c - (c - f), v = f - g, d = y * v - (m - p * g - y * g - p * v), R = l * u, c = it * l, p = c - (c - l), y = l - p, c = it * u, g = c - (c - u), v = u - g, z = y * v - (R - p * g - y * g - p * v), b = d - z, h = d - b, at[0] = d - (b + h) + (h - z), x = m + b, h = x - m, P = m - (x - h) + (b - h), b = P - R, h = P - b, at[1] = P - (b + h) + (h - R), L = x + b, h = L - x, at[2] = x - (L - h) + (b - h), at[3] = L;
  const k = Zr(M, $i, 4, at, Mi);
  return Mi[k - 1];
}
function ar(t, e, r, n, i, a) {
  const s = (e - a) * (r - i), o = (t - i) * (n - a), l = s - o, u = Math.abs(s + o);
  return Math.abs(l) >= Ju * u ? l : -rh(t, e, r, n, i, a, u);
}
const Si = Math.pow(2, -52), sr = new Uint32Array(512);
class yr {
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
  static from(e, r = oh, n = lh) {
    const i = e.length, a = new Float64Array(i * 2);
    for (let s = 0; s < i; s++) {
      const o = e[s];
      a[2 * s] = r(o), a[2 * s + 1] = n(o);
    }
    return new yr(a);
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
    const { coords: e, _hullPrev: r, _hullNext: n, _hullTri: i, _hullHash: a } = this, s = e.length >> 1;
    let o = 1 / 0, l = 1 / 0, u = -1 / 0, f = -1 / 0;
    for (let $ = 0; $ < s; $++) {
      const D = e[2 * $], C = e[2 * $ + 1];
      D < o && (o = D), C < l && (l = C), D > u && (u = D), C > f && (f = C), this._ids[$] = $;
    }
    const h = (o + u) / 2, c = (l + f) / 2;
    let p = 0, y = 0, g = 0;
    for (let $ = 0, D = 1 / 0; $ < s; $++) {
      const C = Qr(h, c, e[2 * $], e[2 * $ + 1]);
      C < D && (p = $, D = C);
    }
    const v = e[2 * p], b = e[2 * p + 1];
    for (let $ = 0, D = 1 / 0; $ < s; $++) {
      if ($ === p) continue;
      const C = Qr(v, b, e[2 * $], e[2 * $ + 1]);
      C < D && C > 0 && (y = $, D = C);
    }
    let x = e[2 * y], P = e[2 * y + 1], m = 1 / 0;
    for (let $ = 0; $ < s; $++) {
      if ($ === p || $ === y) continue;
      const D = ah(v, b, x, P, e[2 * $], e[2 * $ + 1]);
      D < m && (g = $, m = D);
    }
    let d = e[2 * g], R = e[2 * g + 1];
    if (m === 1 / 0) {
      for (let C = 0; C < s; C++)
        this._dists[C] = e[2 * C] - e[0] || e[2 * C + 1] - e[1];
      le(this._ids, this._dists, 0, s - 1);
      const $ = new Uint32Array(s);
      let D = 0;
      for (let C = 0, I = -1 / 0; C < s; C++) {
        const N = this._ids[C], w = this._dists[N];
        w > I && ($[D++] = N, I = w);
      }
      this.hull = $.subarray(0, D), this.triangles = new Uint32Array(0), this.halfedges = new Int32Array(0);
      return;
    }
    if (ar(v, b, x, P, d, R) < 0) {
      const $ = y, D = x, C = P;
      y = g, x = d, P = R, g = $, d = D, R = C;
    }
    const z = sh(v, b, x, P, d, R);
    this._cx = z.x, this._cy = z.y;
    for (let $ = 0; $ < s; $++)
      this._dists[$] = Qr(e[2 * $], e[2 * $ + 1], z.x, z.y);
    le(this._ids, this._dists, 0, s - 1), this._hullStart = p;
    let L = 3;
    n[p] = r[g] = y, n[y] = r[p] = g, n[g] = r[y] = p, i[p] = 0, i[y] = 1, i[g] = 2, a.fill(-1), a[this._hashKey(v, b)] = p, a[this._hashKey(x, P)] = y, a[this._hashKey(d, R)] = g, this.trianglesLen = 0, this._addTriangle(p, y, g, -1, -1, -1);
    for (let $ = 0, D = 0, C = 0; $ < this._ids.length; $++) {
      const I = this._ids[$], N = e[2 * I], w = e[2 * I + 1];
      if ($ > 0 && Math.abs(N - D) <= Si && Math.abs(w - C) <= Si || (D = N, C = w, I === p || I === y || I === g)) continue;
      let E = 0;
      for (let H = 0, A = this._hashKey(N, w); H < this._hashSize && (E = a[(A + H) % this._hashSize], !(E !== -1 && E !== n[E])); H++)
        ;
      E = r[E];
      let M = E, k;
      for (; k = n[M], ar(N, w, e[2 * M], e[2 * M + 1], e[2 * k], e[2 * k + 1]) >= 0; )
        if (M = k, M === E) {
          M = -1;
          break;
        }
      if (M === -1) continue;
      let B = this._addTriangle(M, I, n[M], -1, -1, i[M]);
      i[I] = this._legalize(B + 2), i[M] = B, L++;
      let j = n[M];
      for (; k = n[j], ar(N, w, e[2 * j], e[2 * j + 1], e[2 * k], e[2 * k + 1]) < 0; )
        B = this._addTriangle(j, I, k, i[I], -1, i[j]), i[I] = this._legalize(B + 2), n[j] = j, L--, j = k;
      if (M === E)
        for (; k = r[M], ar(N, w, e[2 * k], e[2 * k + 1], e[2 * M], e[2 * M + 1]) < 0; )
          B = this._addTriangle(k, I, M, -1, i[M], i[k]), this._legalize(B + 2), i[k] = B, n[M] = M, L--, M = k;
      this._hullStart = r[I] = M, n[M] = r[j] = I, n[I] = j, a[this._hashKey(N, w)] = I, a[this._hashKey(e[2 * M], e[2 * M + 1])] = M;
    }
    this.hull = new Uint32Array(L);
    for (let $ = 0, D = this._hullStart; $ < L; $++)
      this.hull[$] = D, D = n[D];
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
    return Math.floor(nh(e - this._cx, r - this._cy) * this._hashSize) % this._hashSize;
  }
  /**
   * Flip an edge in a pair of triangles if it doesn't satisfy the Delaunay condition.
   *
   * @param {number} a
   * @private
   */
  _legalize(e) {
    const { _triangles: r, _halfedges: n, coords: i } = this;
    let a = 0, s = 0;
    for (; ; ) {
      const o = n[e], l = e - e % 3;
      if (s = l + (e + 2) % 3, o === -1) {
        if (a === 0) break;
        e = sr[--a];
        continue;
      }
      const u = o - o % 3, f = l + (e + 1) % 3, h = u + (o + 2) % 3, c = r[s], p = r[e], y = r[f], g = r[h];
      if (ih(
        i[2 * c],
        i[2 * c + 1],
        i[2 * p],
        i[2 * p + 1],
        i[2 * y],
        i[2 * y + 1],
        i[2 * g],
        i[2 * g + 1]
      )) {
        r[e] = g, r[o] = c;
        const b = n[h];
        if (b === -1) {
          let P = this._hullStart;
          do {
            if (this._hullTri[P] === h) {
              this._hullTri[P] = e;
              break;
            }
            P = this._hullPrev[P];
          } while (P !== this._hullStart);
        }
        this._link(e, b), this._link(o, n[s]), this._link(s, h);
        const x = u + (o + 1) % 3;
        a < sr.length && (sr[a++] = x);
      } else {
        if (a === 0) break;
        e = sr[--a];
      }
    }
    return s;
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
  _addTriangle(e, r, n, i, a, s) {
    const o = this.trianglesLen;
    return this._triangles[o] = e, this._triangles[o + 1] = r, this._triangles[o + 2] = n, this._link(o, i), this._link(o + 1, a), this._link(o + 2, s), this.trianglesLen += 3, o;
  }
}
function nh(t, e) {
  const r = t / (Math.abs(t) + Math.abs(e));
  return (e > 0 ? 3 - r : 1 + r) / 4;
}
function Qr(t, e, r, n) {
  const i = t - r, a = e - n;
  return i * i + a * a;
}
function ih(t, e, r, n, i, a, s, o) {
  const l = t - s, u = e - o, f = r - s, h = n - o, c = i - s, p = a - o, y = l * l + u * u, g = f * f + h * h, v = c * c + p * p;
  return l * (h * v - g * p) - u * (f * v - g * c) + y * (f * p - h * c) < 0;
}
function ah(t, e, r, n, i, a) {
  const s = r - t, o = n - e, l = i - t, u = a - e, f = s * s + o * o, h = l * l + u * u, c = 0.5 / (s * u - o * l), p = (u * f - o * h) * c, y = (s * h - l * f) * c;
  return p * p + y * y;
}
function sh(t, e, r, n, i, a) {
  const s = r - t, o = n - e, l = i - t, u = a - e, f = s * s + o * o, h = l * l + u * u, c = 0.5 / (s * u - o * l), p = t + (u * f - o * h) * c, y = e + (s * h - l * f) * c;
  return { x: p, y };
}
function le(t, e, r, n) {
  if (n - r <= 20)
    for (let i = r + 1; i <= n; i++) {
      const a = t[i], s = e[a];
      let o = i - 1;
      for (; o >= r && e[t[o]] > s; ) t[o + 1] = t[o--];
      t[o + 1] = a;
    }
  else {
    const i = r + n >> 1;
    let a = r + 1, s = n;
    ke(t, i, a), e[t[r]] > e[t[n]] && ke(t, r, n), e[t[a]] > e[t[n]] && ke(t, a, n), e[t[r]] > e[t[a]] && ke(t, r, a);
    const o = t[a], l = e[o];
    for (; ; ) {
      do
        a++;
      while (e[t[a]] < l);
      do
        s--;
      while (e[t[s]] > l);
      if (s < a) break;
      ke(t, a, s);
    }
    t[r + 1] = t[s], t[s] = o, n - a + 1 >= s - r ? (le(t, e, a, n), le(t, e, r, s - 1)) : (le(t, e, r, s - 1), le(t, e, a, n));
  }
}
function ke(t, e, r) {
  const n = t[e];
  t[e] = t[r], t[r] = n;
}
function oh(t) {
  return t[0];
}
function lh(t) {
  return t[1];
}
const Oi = 1e-6;
class Gt {
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
    const i = e + n, a = r;
    if (n < 0) throw new Error("negative radius");
    this._x1 === null ? this._ += `M${i},${a}` : (Math.abs(this._x1 - i) > Oi || Math.abs(this._y1 - a) > Oi) && (this._ += "L" + i + "," + a), n && (this._ += `A${n},${n},0,1,1,${e - n},${r}A${n},${n},0,1,1,${this._x1 = i},${this._y1 = a}`);
  }
  rect(e, r, n, i) {
    this._ += `M${this._x0 = this._x1 = +e},${this._y0 = this._y1 = +r}h${+n}v${+i}h${-n}Z`;
  }
  value() {
    return this._ || null;
  }
}
class dn {
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
class uh {
  constructor(e, [r, n, i, a] = [0, 0, 960, 500]) {
    if (!((i = +i) >= (r = +r)) || !((a = +a) >= (n = +n))) throw new Error("invalid bounds");
    this.delaunay = e, this._circumcenters = new Float64Array(e.points.length * 2), this.vectors = new Float64Array(e.points.length * 2), this.xmax = i, this.xmin = r, this.ymax = a, this.ymin = n, this._init();
  }
  update() {
    return this.delaunay.update(), this._init(), this;
  }
  _init() {
    const { delaunay: { points: e, hull: r, triangles: n }, vectors: i } = this;
    let a, s;
    const o = this.circumcenters = this._circumcenters.subarray(0, n.length / 3 * 2);
    for (let g = 0, v = 0, b = n.length, x, P; g < b; g += 3, v += 2) {
      const m = n[g] * 2, d = n[g + 1] * 2, R = n[g + 2] * 2, z = e[m], L = e[m + 1], $ = e[d], D = e[d + 1], C = e[R], I = e[R + 1], N = $ - z, w = D - L, E = C - z, M = I - L, k = (N * M - w * E) * 2;
      if (Math.abs(k) < 1e-9) {
        if (a === void 0) {
          a = s = 0;
          for (const j of r) a += e[j * 2], s += e[j * 2 + 1];
          a /= r.length, s /= r.length;
        }
        const B = 1e9 * Math.sign((a - z) * M - (s - L) * E);
        x = (z + C) / 2 - B * M, P = (L + I) / 2 + B * E;
      } else {
        const B = 1 / k, j = N * N + w * w, H = E * E + M * M;
        x = z + (M * j - w * H) * B, P = L + (N * H - E * j) * B;
      }
      o[v] = x, o[v + 1] = P;
    }
    let l = r[r.length - 1], u, f = l * 4, h, c = e[2 * l], p, y = e[2 * l + 1];
    i.fill(0);
    for (let g = 0; g < r.length; ++g)
      l = r[g], u = f, h = c, p = y, f = l * 4, c = e[2 * l], y = e[2 * l + 1], i[u + 2] = i[f] = p - y, i[u + 3] = i[f + 1] = c - h;
  }
  render(e) {
    const r = e == null ? e = new Gt() : void 0, { delaunay: { halfedges: n, inedges: i, hull: a }, circumcenters: s, vectors: o } = this;
    if (a.length <= 1) return null;
    for (let f = 0, h = n.length; f < h; ++f) {
      const c = n[f];
      if (c < f) continue;
      const p = Math.floor(f / 3) * 2, y = Math.floor(c / 3) * 2, g = s[p], v = s[p + 1], b = s[y], x = s[y + 1];
      this._renderSegment(g, v, b, x, e);
    }
    let l, u = a[a.length - 1];
    for (let f = 0; f < a.length; ++f) {
      l = u, u = a[f];
      const h = Math.floor(i[u] / 3) * 2, c = s[h], p = s[h + 1], y = l * 4, g = this._project(c, p, o[y + 2], o[y + 3]);
      g && this._renderSegment(c, p, g[0], g[1], e);
    }
    return r && r.value();
  }
  renderBounds(e) {
    const r = e == null ? e = new Gt() : void 0;
    return e.rect(this.xmin, this.ymin, this.xmax - this.xmin, this.ymax - this.ymin), r && r.value();
  }
  renderCell(e, r) {
    const n = r == null ? r = new Gt() : void 0, i = this._clip(e);
    if (i === null || !i.length) return;
    r.moveTo(i[0], i[1]);
    let a = i.length;
    for (; i[0] === i[a - 2] && i[1] === i[a - 1] && a > 1; ) a -= 2;
    for (let s = 2; s < a; s += 2)
      (i[s] !== i[s - 2] || i[s + 1] !== i[s - 1]) && r.lineTo(i[s], i[s + 1]);
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
    const r = new dn();
    return this.renderCell(e, r), r.value();
  }
  _renderSegment(e, r, n, i, a) {
    let s;
    const o = this._regioncode(e, r), l = this._regioncode(n, i);
    o === 0 && l === 0 ? (a.moveTo(e, r), a.lineTo(n, i)) : (s = this._clipSegment(e, r, n, i, o, l)) && (a.moveTo(s[0], s[1]), a.lineTo(s[2], s[3]));
  }
  contains(e, r, n) {
    return r = +r, r !== r || (n = +n, n !== n) ? !1 : this.delaunay._step(e, r, n) === e;
  }
  *neighbors(e) {
    const r = this._clip(e);
    if (r) for (const n of this.delaunay.neighbors(e)) {
      const i = this._clip(n);
      if (i) {
        t: for (let a = 0, s = r.length; a < s; a += 2)
          for (let o = 0, l = i.length; o < l; o += 2)
            if (r[a] === i[o] && r[a + 1] === i[o + 1] && r[(a + 2) % s] === i[(o + l - 2) % l] && r[(a + 3) % s] === i[(o + l - 1) % l]) {
              yield n;
              break t;
            }
      }
    }
  }
  _cell(e) {
    const { circumcenters: r, delaunay: { inedges: n, halfedges: i, triangles: a } } = this, s = n[e];
    if (s === -1) return null;
    const o = [];
    let l = s;
    do {
      const u = Math.floor(l / 3);
      if (o.push(r[u * 2], r[u * 2 + 1]), l = l % 3 === 2 ? l - 2 : l + 1, a[l] !== e) break;
      l = i[l];
    } while (l !== s && l !== -1);
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
    let i = null, a, s, o = r[n - 2], l = r[n - 1], u, f = this._regioncode(o, l), h, c = 0;
    for (let p = 0; p < n; p += 2)
      if (a = o, s = l, o = r[p], l = r[p + 1], u = f, f = this._regioncode(o, l), u === 0 && f === 0)
        h = c, c = 0, i ? i.push(o, l) : i = [o, l];
      else {
        let y, g, v, b, x;
        if (u === 0) {
          if ((y = this._clipSegment(a, s, o, l, u, f)) === null) continue;
          [g, v, b, x] = y;
        } else {
          if ((y = this._clipSegment(o, l, a, s, f, u)) === null) continue;
          [b, x, g, v] = y, h = c, c = this._edgecode(g, v), h && c && this._edge(e, h, c, i, i.length), i ? i.push(g, v) : i = [g, v];
        }
        h = c, c = this._edgecode(b, x), h && c && this._edge(e, h, c, i, i.length), i ? i.push(b, x) : i = [b, x];
      }
    if (i)
      h = c, c = this._edgecode(i[0], i[1]), h && c && this._edge(e, h, c, i, i.length);
    else if (this.contains(e, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2))
      return [this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax, this.xmin, this.ymin];
    return i;
  }
  _clipSegment(e, r, n, i, a, s) {
    const o = a < s;
    for (o && ([e, r, n, i, a, s] = [n, i, e, r, s, a]); ; ) {
      if (a === 0 && s === 0) return o ? [n, i, e, r] : [e, r, n, i];
      if (a & s) return null;
      let l, u, f = a || s;
      f & 8 ? (l = e + (n - e) * (this.ymax - r) / (i - r), u = this.ymax) : f & 4 ? (l = e + (n - e) * (this.ymin - r) / (i - r), u = this.ymin) : f & 2 ? (u = r + (i - r) * (this.xmax - e) / (n - e), l = this.xmax) : (u = r + (i - r) * (this.xmin - e) / (n - e), l = this.xmin), a ? (e = l, r = u, a = this._regioncode(e, r)) : (n = l, i = u, s = this._regioncode(n, i));
    }
  }
  _clipInfinite(e, r, n, i, a, s) {
    let o = Array.from(r), l;
    if ((l = this._project(o[0], o[1], n, i)) && o.unshift(l[0], l[1]), (l = this._project(o[o.length - 2], o[o.length - 1], a, s)) && o.push(l[0], l[1]), o = this._clipFinite(e, o))
      for (let u = 0, f = o.length, h, c = this._edgecode(o[f - 2], o[f - 1]); u < f; u += 2)
        h = c, c = this._edgecode(o[u], o[u + 1]), h && c && (u = this._edge(e, h, c, o, u), f = o.length);
    else this.contains(e, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2) && (o = [this.xmin, this.ymin, this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax]);
    return o;
  }
  _edge(e, r, n, i, a) {
    for (; r !== n; ) {
      let s, o;
      switch (r) {
        case 5:
          r = 4;
          continue;
        case 4:
          r = 6, s = this.xmax, o = this.ymin;
          break;
        case 6:
          r = 2;
          continue;
        case 2:
          r = 10, s = this.xmax, o = this.ymax;
          break;
        case 10:
          r = 8;
          continue;
        case 8:
          r = 9, s = this.xmin, o = this.ymax;
          break;
        case 9:
          r = 1;
          continue;
        case 1:
          r = 5, s = this.xmin, o = this.ymin;
          break;
      }
      (i[a] !== s || i[a + 1] !== o) && this.contains(e, s, o) && (i.splice(a, 0, s, o), a += 2);
    }
    return a;
  }
  _project(e, r, n, i) {
    let a = 1 / 0, s, o, l;
    if (i < 0) {
      if (r <= this.ymin) return null;
      (s = (this.ymin - r) / i) < a && (l = this.ymin, o = e + (a = s) * n);
    } else if (i > 0) {
      if (r >= this.ymax) return null;
      (s = (this.ymax - r) / i) < a && (l = this.ymax, o = e + (a = s) * n);
    }
    if (n > 0) {
      if (e >= this.xmax) return null;
      (s = (this.xmax - e) / n) < a && (o = this.xmax, l = r + (a = s) * i);
    } else if (n < 0) {
      if (e <= this.xmin) return null;
      (s = (this.xmin - e) / n) < a && (o = this.xmin, l = r + (a = s) * i);
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
const hh = 2 * Math.PI, se = Math.pow;
function ch(t) {
  return t[0];
}
function fh(t) {
  return t[1];
}
function dh(t) {
  const { triangles: e, coords: r } = t;
  for (let n = 0; n < e.length; n += 3) {
    const i = 2 * e[n], a = 2 * e[n + 1], s = 2 * e[n + 2];
    if ((r[s] - r[i]) * (r[a + 1] - r[i + 1]) - (r[a] - r[i]) * (r[s + 1] - r[i + 1]) > 1e-10) return !1;
  }
  return !0;
}
function ph(t, e, r) {
  return [t + Math.sin(t + e) * r, e + Math.cos(t - e) * r];
}
class An {
  static from(e, r = ch, n = fh, i) {
    return new An("length" in e ? gh(e, r, n, i) : Float64Array.from(yh(e, r, n, i)));
  }
  constructor(e) {
    this._delaunator = new yr(e), this.inedges = new Int32Array(e.length / 2), this._hullIndex = new Int32Array(e.length / 2), this.points = this._delaunator.coords, this._init();
  }
  update() {
    return this._delaunator.update(), this._init(), this;
  }
  _init() {
    const e = this._delaunator, r = this.points;
    if (e.hull && e.hull.length > 2 && dh(e)) {
      this.collinear = Int32Array.from({ length: r.length / 2 }, (c, p) => p).sort((c, p) => r[2 * c] - r[2 * p] || r[2 * c + 1] - r[2 * p + 1]);
      const l = this.collinear[0], u = this.collinear[this.collinear.length - 1], f = [r[2 * l], r[2 * l + 1], r[2 * u], r[2 * u + 1]], h = 1e-8 * Math.hypot(f[3] - f[1], f[2] - f[0]);
      for (let c = 0, p = r.length / 2; c < p; ++c) {
        const y = ph(r[2 * c], r[2 * c + 1], h);
        r[2 * c] = y[0], r[2 * c + 1] = y[1];
      }
      this._delaunator = new yr(r);
    } else
      delete this.collinear;
    const n = this.halfedges = this._delaunator.halfedges, i = this.hull = this._delaunator.hull, a = this.triangles = this._delaunator.triangles, s = this.inedges.fill(-1), o = this._hullIndex.fill(-1);
    for (let l = 0, u = n.length; l < u; ++l) {
      const f = a[l % 3 === 2 ? l - 2 : l + 1];
      (n[l] === -1 || s[f] === -1) && (s[f] = l);
    }
    for (let l = 0, u = i.length; l < u; ++l)
      o[i[l]] = l;
    i.length <= 2 && i.length > 0 && (this.triangles = new Int32Array(3).fill(-1), this.halfedges = new Int32Array(3).fill(-1), this.triangles[0] = i[0], s[i[0]] = 1, i.length === 2 && (s[i[1]] = 0, this.triangles[1] = i[1], this.triangles[2] = i[1]));
  }
  voronoi(e) {
    return new uh(this, e);
  }
  *neighbors(e) {
    const { inedges: r, hull: n, _hullIndex: i, halfedges: a, triangles: s, collinear: o } = this;
    if (o) {
      const h = o.indexOf(e);
      h > 0 && (yield o[h - 1]), h < o.length - 1 && (yield o[h + 1]);
      return;
    }
    const l = r[e];
    if (l === -1) return;
    let u = l, f = -1;
    do {
      if (yield f = s[u], u = u % 3 === 2 ? u - 2 : u + 1, s[u] !== e) return;
      if (u = a[u], u === -1) {
        const h = n[(i[e] + 1) % n.length];
        h !== f && (yield h);
        return;
      }
    } while (u !== l);
  }
  find(e, r, n = 0) {
    if (e = +e, e !== e || (r = +r, r !== r)) return -1;
    const i = n;
    let a;
    for (; (a = this._step(n, e, r)) >= 0 && a !== n && a !== i; ) n = a;
    return a;
  }
  _step(e, r, n) {
    const { inedges: i, hull: a, _hullIndex: s, halfedges: o, triangles: l, points: u } = this;
    if (u.length < 2) return -1;
    if (i[e] === -1) return (e + 1) % (u.length >> 1);
    let f = e, h = se(r - u[e * 2], 2) + se(n - u[e * 2 + 1], 2);
    const c = i[e];
    let p = c;
    do {
      let y = l[p];
      const g = se(r - u[y * 2], 2) + se(n - u[y * 2 + 1], 2);
      if (g < h && (h = g, f = y), p = p % 3 === 2 ? p - 2 : p + 1, l[p] !== e) break;
      if (p = o[p], p === -1) {
        if (p = a[(s[e] + 1) % a.length], p !== y && se(r - u[p * 2], 2) + se(n - u[p * 2 + 1], 2) < h)
          return p;
        break;
      }
    } while (p !== c);
    return f;
  }
  render(e) {
    const r = e == null ? e = new Gt() : void 0, { points: n, halfedges: i, triangles: a } = this;
    for (let s = 0, o = i.length; s < o; ++s) {
      const l = i[s];
      if (l < s) continue;
      const u = a[s] * 2, f = a[l] * 2;
      e.moveTo(n[u], n[u + 1]), e.lineTo(n[f], n[f + 1]);
    }
    return this.renderHull(e), r && r.value();
  }
  renderPoints(e, r) {
    r === void 0 && (!e || typeof e.moveTo != "function") && (r = e, e = null), r = r == null ? 2 : +r;
    const n = e == null ? e = new Gt() : void 0, { points: i } = this;
    for (let a = 0, s = i.length & -2; a < s; a += 2) {
      const o = i[a], l = i[a + 1];
      e.moveTo(o + r, l), e.arc(o, l, r, 0, hh);
    }
    return n && n.value();
  }
  renderHull(e) {
    const r = e == null ? e = new Gt() : void 0, { hull: n, points: i } = this, a = n[0] * 2, s = n.length;
    e.moveTo(i[a], i[a + 1]);
    for (let o = 1; o < s; ++o) {
      const l = 2 * n[o];
      e.lineTo(i[l], i[l + 1]);
    }
    return e.closePath(), r && r.value();
  }
  hullPolygon() {
    const e = new dn();
    return this.renderHull(e), e.value();
  }
  renderTriangle(e, r) {
    const n = r == null ? r = new Gt() : void 0, { points: i, triangles: a } = this, s = a[e *= 3] * 2, o = a[e + 1] * 2, l = a[e + 2] * 2;
    return r.moveTo(i[s], i[s + 1]), r.lineTo(i[o], i[o + 1]), r.lineTo(i[l], i[l + 1]), r.closePath(), n && n.value();
  }
  *trianglePolygons() {
    const { triangles: e } = this;
    for (let r = 0, n = e.length / 3; r < n; ++r)
      yield this.trianglePolygon(r);
  }
  trianglePolygon(e) {
    const r = new dn();
    return this.renderTriangle(e, r), r.value();
  }
}
function gh(t, e, r, n) {
  const i = t.length, a = new Float64Array(i * 2);
  for (let s = 0; s < i; ++s) {
    const o = t[s];
    a[s * 2] = e.call(n, o, s, t), a[s * 2 + 1] = r.call(n, o, s, t);
  }
  return a;
}
function* yh(t, e, r, n) {
  let i = 0;
  for (const a of t)
    yield e.call(n, a, i, t), yield r.call(n, a, i, t), ++i;
}
function Se(t, e, r) {
  t.prototype = e.prototype = r, r.constructor = t;
}
function He(t, e) {
  var r = Object.create(t.prototype);
  for (var n in e) r[n] = e[n];
  return r;
}
function Lt() {
}
var ee = 0.7, me = 1 / ee, he = "\\s*([+-]?\\d+)\\s*", Ne = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", bt = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", mh = /^#([0-9a-f]{3,8})$/, bh = new RegExp(`^rgb\\(${he},${he},${he}\\)$`), xh = new RegExp(`^rgb\\(${bt},${bt},${bt}\\)$`), vh = new RegExp(`^rgba\\(${he},${he},${he},${Ne}\\)$`), wh = new RegExp(`^rgba\\(${bt},${bt},${bt},${Ne}\\)$`), _h = new RegExp(`^hsl\\(${Ne},${bt},${bt}\\)$`), Ph = new RegExp(`^hsla\\(${Ne},${bt},${bt},${Ne}\\)$`), Ti = {
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
Se(Lt, Le, {
  copy(t) {
    return Object.assign(new this.constructor(), this, t);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Ii,
  // Deprecated! Use color.formatHex.
  formatHex: Ii,
  formatHex8: $h,
  formatHsl: Mh,
  formatRgb: Ai,
  toString: Ai
});
function Ii() {
  return this.rgb().formatHex();
}
function $h() {
  return this.rgb().formatHex8();
}
function Mh() {
  return Ma(this).formatHsl();
}
function Ai() {
  return this.rgb().formatRgb();
}
function Le(t) {
  var e, r;
  return t = (t + "").trim().toLowerCase(), (e = mh.exec(t)) ? (r = e[1].length, e = parseInt(e[1], 16), r === 6 ? ki(e) : r === 3 ? new et(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, (e & 15) << 4 | e & 15, 1) : r === 8 ? or(e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, (e & 255) / 255) : r === 4 ? or(e >> 12 & 15 | e >> 8 & 240, e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, ((e & 15) << 4 | e & 15) / 255) : null) : (e = bh.exec(t)) ? new et(e[1], e[2], e[3], 1) : (e = xh.exec(t)) ? new et(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, 1) : (e = vh.exec(t)) ? or(e[1], e[2], e[3], e[4]) : (e = wh.exec(t)) ? or(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, e[4]) : (e = _h.exec(t)) ? Ri(e[1], e[2] / 100, e[3] / 100, 1) : (e = Ph.exec(t)) ? Ri(e[1], e[2] / 100, e[3] / 100, e[4]) : Ti.hasOwnProperty(t) ? ki(Ti[t]) : t === "transparent" ? new et(NaN, NaN, NaN, 0) : null;
}
function ki(t) {
  return new et(t >> 16 & 255, t >> 8 & 255, t & 255, 1);
}
function or(t, e, r, n) {
  return n <= 0 && (t = e = r = NaN), new et(t, e, r, n);
}
function kn(t) {
  return t instanceof Lt || (t = Le(t)), t ? (t = t.rgb(), new et(t.r, t.g, t.b, t.opacity)) : new et();
}
function ce(t, e, r, n) {
  return arguments.length === 1 ? kn(t) : new et(t, e, r, n ?? 1);
}
function et(t, e, r, n) {
  this.r = +t, this.g = +e, this.b = +r, this.opacity = +n;
}
Se(et, ce, He(Lt, {
  brighter(t) {
    return t = t == null ? me : Math.pow(me, t), new et(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? ee : Math.pow(ee, t), new et(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new et(Qt(this.r), Qt(this.g), Qt(this.b), mr(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Ei,
  // Deprecated! Use color.formatHex.
  formatHex: Ei,
  formatHex8: Sh,
  formatRgb: Ci,
  toString: Ci
}));
function Ei() {
  return `#${Kt(this.r)}${Kt(this.g)}${Kt(this.b)}`;
}
function Sh() {
  return `#${Kt(this.r)}${Kt(this.g)}${Kt(this.b)}${Kt((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Ci() {
  const t = mr(this.opacity);
  return `${t === 1 ? "rgb(" : "rgba("}${Qt(this.r)}, ${Qt(this.g)}, ${Qt(this.b)}${t === 1 ? ")" : `, ${t})`}`;
}
function mr(t) {
  return isNaN(t) ? 1 : Math.max(0, Math.min(1, t));
}
function Qt(t) {
  return Math.max(0, Math.min(255, Math.round(t) || 0));
}
function Kt(t) {
  return t = Qt(t), (t < 16 ? "0" : "") + t.toString(16);
}
function Ri(t, e, r, n) {
  return n <= 0 ? t = e = r = NaN : r <= 0 || r >= 1 ? t = e = NaN : e <= 0 && (t = NaN), new pt(t, e, r, n);
}
function Ma(t) {
  if (t instanceof pt) return new pt(t.h, t.s, t.l, t.opacity);
  if (t instanceof Lt || (t = Le(t)), !t) return new pt();
  if (t instanceof pt) return t;
  t = t.rgb();
  var e = t.r / 255, r = t.g / 255, n = t.b / 255, i = Math.min(e, r, n), a = Math.max(e, r, n), s = NaN, o = a - i, l = (a + i) / 2;
  return o ? (e === a ? s = (r - n) / o + (r < n) * 6 : r === a ? s = (n - e) / o + 2 : s = (e - r) / o + 4, o /= l < 0.5 ? a + i : 2 - a - i, s *= 60) : o = l > 0 && l < 1 ? 0 : s, new pt(s, o, l, t.opacity);
}
function Oh(t, e, r, n) {
  return arguments.length === 1 ? Ma(t) : new pt(t, e, r, n ?? 1);
}
function pt(t, e, r, n) {
  this.h = +t, this.s = +e, this.l = +r, this.opacity = +n;
}
Se(pt, Oh, He(Lt, {
  brighter(t) {
    return t = t == null ? me : Math.pow(me, t), new pt(this.h, this.s, this.l * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? ee : Math.pow(ee, t), new pt(this.h, this.s, this.l * t, this.opacity);
  },
  rgb() {
    var t = this.h % 360 + (this.h < 0) * 360, e = isNaN(t) || isNaN(this.s) ? 0 : this.s, r = this.l, n = r + (r < 0.5 ? r : 1 - r) * e, i = 2 * r - n;
    return new et(
      Jr(t >= 240 ? t - 240 : t + 120, i, n),
      Jr(t, i, n),
      Jr(t < 120 ? t + 240 : t - 120, i, n),
      this.opacity
    );
  },
  clamp() {
    return new pt(Di(this.h), lr(this.s), lr(this.l), mr(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const t = mr(this.opacity);
    return `${t === 1 ? "hsl(" : "hsla("}${Di(this.h)}, ${lr(this.s) * 100}%, ${lr(this.l) * 100}%${t === 1 ? ")" : `, ${t})`}`;
  }
}));
function Di(t) {
  return t = (t || 0) % 360, t < 0 ? t + 360 : t;
}
function lr(t) {
  return Math.max(0, Math.min(1, t || 0));
}
function Jr(t, e, r) {
  return (t < 60 ? e + (r - e) * t / 60 : t < 180 ? r : t < 240 ? e + (r - e) * (240 - t) / 60 : e) * 255;
}
const Sa = Math.PI / 180, Oa = 180 / Math.PI, br = 18, Ta = 0.96422, Ia = 1, Aa = 0.82521, ka = 4 / 29, fe = 6 / 29, Ea = 3 * fe * fe, Th = fe * fe * fe;
function Ca(t) {
  if (t instanceof xt) return new xt(t.l, t.a, t.b, t.opacity);
  if (t instanceof Pt) return Ra(t);
  t instanceof et || (t = kn(t));
  var e = nn(t.r), r = nn(t.g), n = nn(t.b), i = tn((0.2225045 * e + 0.7168786 * r + 0.0606169 * n) / Ia), a, s;
  return e === r && r === n ? a = s = i : (a = tn((0.4360747 * e + 0.3850649 * r + 0.1430804 * n) / Ta), s = tn((0.0139322 * e + 0.0971045 * r + 0.7141733 * n) / Aa)), new xt(116 * i - 16, 500 * (a - i), 200 * (i - s), t.opacity);
}
function pn(t, e, r, n) {
  return arguments.length === 1 ? Ca(t) : new xt(t, e, r, n ?? 1);
}
function xt(t, e, r, n) {
  this.l = +t, this.a = +e, this.b = +r, this.opacity = +n;
}
Se(xt, pn, He(Lt, {
  brighter(t) {
    return new xt(this.l + br * (t ?? 1), this.a, this.b, this.opacity);
  },
  darker(t) {
    return new xt(this.l - br * (t ?? 1), this.a, this.b, this.opacity);
  },
  rgb() {
    var t = (this.l + 16) / 116, e = isNaN(this.a) ? t : t + this.a / 500, r = isNaN(this.b) ? t : t - this.b / 200;
    return e = Ta * en(e), t = Ia * en(t), r = Aa * en(r), new et(
      rn(3.1338561 * e - 1.6168667 * t - 0.4906146 * r),
      rn(-0.9787684 * e + 1.9161415 * t + 0.033454 * r),
      rn(0.0719453 * e - 0.2289914 * t + 1.4052427 * r),
      this.opacity
    );
  }
}));
function tn(t) {
  return t > Th ? Math.pow(t, 1 / 3) : t / Ea + ka;
}
function en(t) {
  return t > fe ? t * t * t : Ea * (t - ka);
}
function rn(t) {
  return 255 * (t <= 31308e-7 ? 12.92 * t : 1.055 * Math.pow(t, 1 / 2.4) - 0.055);
}
function nn(t) {
  return (t /= 255) <= 0.04045 ? t / 12.92 : Math.pow((t + 0.055) / 1.055, 2.4);
}
function Ih(t) {
  if (t instanceof Pt) return new Pt(t.h, t.c, t.l, t.opacity);
  if (t instanceof xt || (t = Ca(t)), t.a === 0 && t.b === 0) return new Pt(NaN, 0 < t.l && t.l < 100 ? 0 : NaN, t.l, t.opacity);
  var e = Math.atan2(t.b, t.a) * Oa;
  return new Pt(e < 0 ? e + 360 : e, Math.sqrt(t.a * t.a + t.b * t.b), t.l, t.opacity);
}
function Ah(t, e, r, n) {
  return arguments.length === 1 ? Ih(t) : new Pt(t, e, r, n ?? 1);
}
function Pt(t, e, r, n) {
  this.h = +t, this.c = +e, this.l = +r, this.opacity = +n;
}
function Ra(t) {
  if (isNaN(t.h)) return new xt(t.l, 0, 0, t.opacity);
  var e = t.h * Sa;
  return new xt(t.l, Math.cos(e) * t.c, Math.sin(e) * t.c, t.opacity);
}
Se(Pt, Ah, He(Lt, {
  brighter(t) {
    return new Pt(this.h, this.c, this.l + br * (t ?? 1), this.opacity);
  },
  darker(t) {
    return new Pt(this.h, this.c, this.l - br * (t ?? 1), this.opacity);
  },
  rgb() {
    return Ra(this).rgb();
  }
}));
var Da = -0.14861, En = 1.78277, Cn = -0.29227, Cr = -0.90649, Ve = 1.97294, Fi = Ve * Cr, ji = Ve * En, Ni = En * Cn - Cr * Da;
function kh(t) {
  if (t instanceof Jt) return new Jt(t.h, t.s, t.l, t.opacity);
  t instanceof et || (t = kn(t));
  var e = t.r / 255, r = t.g / 255, n = t.b / 255, i = (Ni * n + Fi * e - ji * r) / (Ni + Fi - ji), a = n - i, s = (Ve * (r - i) - Cn * a) / Cr, o = Math.sqrt(s * s + a * a) / (Ve * i * (1 - i)), l = o ? Math.atan2(s, a) * Oa - 120 : NaN;
  return new Jt(l < 0 ? l + 360 : l, o, i, t.opacity);
}
function gn(t, e, r, n) {
  return arguments.length === 1 ? kh(t) : new Jt(t, e, r, n ?? 1);
}
function Jt(t, e, r, n) {
  this.h = +t, this.s = +e, this.l = +r, this.opacity = +n;
}
Se(Jt, gn, He(Lt, {
  brighter(t) {
    return t = t == null ? me : Math.pow(me, t), new Jt(this.h, this.s, this.l * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? ee : Math.pow(ee, t), new Jt(this.h, this.s, this.l * t, this.opacity);
  },
  rgb() {
    var t = isNaN(this.h) ? 0 : (this.h + 120) * Sa, e = +this.l, r = isNaN(this.s) ? 0 : this.s * e * (1 - e), n = Math.cos(t), i = Math.sin(t);
    return new et(
      255 * (e + r * (Da * n + En * i)),
      255 * (e + r * (Cn * n + Cr * i)),
      255 * (e + r * (Ve * n)),
      this.opacity
    );
  }
}));
var Rn = (t) => () => t;
function Fa(t, e) {
  return function(r) {
    return t + r * e;
  };
}
function Eh(t, e, r) {
  return t = Math.pow(t, r), e = Math.pow(e, r) - t, r = 1 / r, function(n) {
    return Math.pow(t + n * e, r);
  };
}
function Ch(t, e) {
  var r = e - t;
  return r ? Fa(t, r > 180 || r < -180 ? r - 360 * Math.round(r / 360) : r) : Rn(isNaN(t) ? e : t);
}
function Rh(t) {
  return (t = +t) == 1 ? mt : function(e, r) {
    return r - e ? Eh(e, r, t) : Rn(isNaN(e) ? r : e);
  };
}
function mt(t, e) {
  var r = e - t;
  return r ? Fa(t, r) : Rn(isNaN(t) ? e : t);
}
(function t(e) {
  var r = Rh(e);
  function n(i, a) {
    var s = r((i = ce(i)).r, (a = ce(a)).r), o = r(i.g, a.g), l = r(i.b, a.b), u = mt(i.opacity, a.opacity);
    return function(f) {
      return i.r = s(f), i.g = o(f), i.b = l(f), i.opacity = u(f), i + "";
    };
  }
  return n.gamma = t, n;
})(1);
var Dh = 1e-12;
function Li(t) {
  return ((t = Math.exp(t)) + 1 / t) / 2;
}
function Fh(t) {
  return ((t = Math.exp(t)) - 1 / t) / 2;
}
function jh(t) {
  return ((t = Math.exp(2 * t)) - 1) / (t + 1);
}
(function t(e, r, n) {
  function i(a, s) {
    var o = a[0], l = a[1], u = a[2], f = s[0], h = s[1], c = s[2], p = f - o, y = h - l, g = p * p + y * y, v, b;
    if (g < Dh)
      b = Math.log(c / u) / e, v = function(z) {
        return [
          o + z * p,
          l + z * y,
          u * Math.exp(e * z * b)
        ];
      };
    else {
      var x = Math.sqrt(g), P = (c * c - u * u + n * g) / (2 * u * r * x), m = (c * c - u * u - n * g) / (2 * c * r * x), d = Math.log(Math.sqrt(P * P + 1) - P), R = Math.log(Math.sqrt(m * m + 1) - m);
      b = (R - d) / e, v = function(z) {
        var L = z * b, $ = Li(d), D = u / (r * x) * ($ * jh(e * L + d) - Fh(d));
        return [
          o + D * p,
          l + D * y,
          u * $ / Li(e * L + d)
        ];
      };
    }
    return v.duration = Math.abs(b) * 1e3 * e / Math.SQRT2, v;
  }
  return i.rho = function(a) {
    var s = Math.max(1e-3, +a), o = s * s, l = o * o;
    return t(s, o, l);
  }, i;
})(Math.SQRT2, 2, 4);
function Nh(t, e) {
  var r = mt((t = pn(t)).l, (e = pn(e)).l), n = mt(t.a, e.a), i = mt(t.b, e.b), a = mt(t.opacity, e.opacity);
  return function(s) {
    return t.l = r(s), t.a = n(s), t.b = i(s), t.opacity = a(s), t + "";
  };
}
function ja(t) {
  return function e(r) {
    r = +r;
    function n(i, a) {
      var s = t((i = gn(i)).h, (a = gn(a)).h), o = mt(i.s, a.s), l = mt(i.l, a.l), u = mt(i.opacity, a.opacity);
      return function(f) {
        return i.h = s(f), i.s = o(f), i.l = l(Math.pow(f, r)), i.opacity = u(f), i + "";
      };
    }
    return n.gamma = e, n;
  }(1);
}
ja(Ch);
ja(mt);
function Vi(t, e) {
  var r = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(t);
    e && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(t, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Lh(t) {
  for (var e = 1; e < arguments.length; e++) {
    var r = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Vi(Object(r), !0).forEach(function(n) {
      Vh(t, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r)) : Vi(Object(r)).forEach(function(n) {
      Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return t;
}
function Re(t) {
  "@babel/helpers - typeof";
  return typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? Re = function(e) {
    return typeof e;
  } : Re = function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Re(t);
}
function Vh(t, e, r) {
  return e in t ? Object.defineProperty(t, e, {
    value: r,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : t[e] = r, t;
}
function xr() {
  return xr = Object.assign || function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = arguments[e];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n]);
    }
    return t;
  }, xr.apply(this, arguments);
}
function zh(t, e) {
  if (t) {
    if (typeof t == "string") return zi(t, e);
    var r = Object.prototype.toString.call(t).slice(8, -1);
    if (r === "Object" && t.constructor && (r = t.constructor.name), r === "Map" || r === "Set") return Array.from(t);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return zi(t, e);
  }
}
function zi(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var r = 0, n = new Array(e); r < e; r++) n[r] = t[r];
  return n;
}
function Na(t, e) {
  var r = typeof Symbol < "u" && t[Symbol.iterator] || t["@@iterator"];
  if (!r) {
    if (Array.isArray(t) || (r = zh(t)) || e) {
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
  var a = !0, s = !1, o;
  return {
    s: function() {
      r = r.call(t);
    },
    n: function() {
      var l = r.next();
      return a = l.done, l;
    },
    e: function(l) {
      s = !0, o = l;
    },
    f: function() {
      try {
        !a && r.return != null && r.return();
      } finally {
        if (s) throw o;
      }
    }
  };
}
function Bh(t, e) {
  var r = [], n = [];
  function i(a, s) {
    if (a.length === 1)
      r.push(a[0]), n.push(a[0]);
    else {
      for (var o = Array(a.length - 1), l = 0; l < o.length; l++)
        l === 0 && r.push(a[0]), l === o.length - 1 && n.push(a[l + 1]), o[l] = [(1 - s) * a[l][0] + s * a[l + 1][0], (1 - s) * a[l][1] + s * a[l + 1][1]];
      i(o, s);
    }
  }
  return t.length && i(t, e), {
    left: r,
    right: n.reverse()
  };
}
function Wh(t) {
  var e = {};
  return t.length === 4 && (e.x2 = t[2][0], e.y2 = t[2][1]), t.length >= 3 && (e.x1 = t[1][0], e.y1 = t[1][1]), e.x = t[t.length - 1][0], e.y = t[t.length - 1][1], t.length === 4 ? e.type = "C" : t.length === 3 ? e.type = "Q" : e.type = "L", e;
}
function Xh(t, e) {
  e = e || 2;
  for (var r = [], n = t, i = 1 / e, a = 0; a < e - 1; a++) {
    var s = i / (1 - i * a), o = Bh(n, s);
    r.push(o.left), n = o.right;
  }
  return r.push(n), r;
}
function Yh(t, e, r) {
  var n = [[t.x, t.y]];
  return e.x1 != null && n.push([e.x1, e.y1]), e.x2 != null && n.push([e.x2, e.y2]), n.push([e.x, e.y]), Xh(n, r).map(Wh);
}
var Hh = /[MLCSTQAHVZmlcstqahv]|-?[\d.e+-]+/g, de = {
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
Object.keys(de).forEach(function(t) {
  de[t.toLowerCase()] = de[t];
});
function yn(t, e) {
  for (var r = Array(t), n = 0; n < t; n++)
    r[n] = e;
  return r;
}
function Uh(t) {
  return "".concat(t.type).concat(de[t.type].map(function(e) {
    return t[e];
  }).join(","));
}
function qh(t, e) {
  var r = {
    x1: "x",
    y1: "y",
    x2: "x",
    y2: "y"
  }, n = ["xAxisRotation", "largeArcFlag", "sweepFlag"];
  if (t.type !== e.type && e.type.toUpperCase() !== "M") {
    var i = {};
    Object.keys(e).forEach(function(a) {
      var s = e[a], o = t[a];
      o === void 0 && (n.includes(a) ? o = s : (o === void 0 && r[a] && (o = t[r[a]]), o === void 0 && (o = 0))), i[a] = o;
    }), i.type = e.type, t = i;
  }
  return t;
}
function Gh(t, e, r) {
  var n = [];
  if (e.type === "L" || e.type === "Q" || e.type === "C")
    n = n.concat(Yh(t, e, r));
  else {
    var i = xr({}, t);
    i.type === "M" && (i.type = "L"), n = n.concat(yn(r - 1).map(function() {
      return i;
    })), n.push(e);
  }
  return n;
}
function Bi(t, e, r) {
  var n = t.length - 1, i = e.length - 1, a = n / i, s = yn(i).reduce(function(l, u, f) {
    var h = Math.floor(a * f);
    if (r && h < t.length - 1 && r(t[h], t[h + 1])) {
      var c = a * f % 1 < 0.5;
      l[h] && (c ? h > 0 ? h -= 1 : h < t.length - 1 && (h += 1) : h < t.length - 1 ? h += 1 : h > 0 && (h -= 1));
    }
    return l[h] = (l[h] || 0) + 1, l;
  }, []), o = s.reduce(function(l, u, f) {
    if (f === t.length - 1) {
      var h = yn(u, xr({}, t[t.length - 1]));
      return h[0].type === "M" && h.forEach(function(c) {
        c.type = "L";
      }), l.concat(h);
    }
    return l.concat(Gh(t[f], t[f + 1], u));
  }, []);
  return o.unshift(t[0]), o;
}
function Wi(t) {
  for (var e = (t || "").match(Hh) || [], r = [], n, i, a = 0; a < e.length; ++a)
    if (n = de[e[a]], n) {
      i = {
        type: e[a]
      };
      for (var s = 0; s < n.length; ++s)
        i[n[s]] = +e[a + s + 1];
      a += n.length, r.push(i);
    }
  return r;
}
function Kh(t, e, r) {
  var n = t == null ? [] : t.slice(), i = e == null ? [] : e.slice(), a = Re(r) === "object" ? r : {
    excludeSegment: r,
    snapEndsToInput: !0
  }, s = a.excludeSegment, o = a.snapEndsToInput;
  if (!n.length && !i.length)
    return function() {
      return [];
    };
  var l = (n.length === 0 || n[n.length - 1].type === "Z") && (i.length === 0 || i[i.length - 1].type === "Z");
  n.length > 0 && n[n.length - 1].type === "Z" && n.pop(), i.length > 0 && i[i.length - 1].type === "Z" && i.pop(), n.length ? i.length || i.push(n[0]) : n.push(i[0]);
  var u = Math.abs(i.length - n.length);
  u !== 0 && (i.length > n.length ? n = Bi(n, i, s) : i.length < n.length && (i = Bi(i, n, s))), n = n.map(function(h, c) {
    return qh(h, i[c]);
  });
  var f = n.map(function(h) {
    return Lh({}, h);
  });
  return l && (f.push({
    type: "Z"
  }), n.push({
    type: "Z"
  })), function(c) {
    if (c === 1 && o)
      return e ?? [];
    if (c === 0)
      return n;
    for (var p = 0; p < f.length; ++p) {
      var y = n[p], g = i[p], v = f[p], b = Na(de[v.type]), x;
      try {
        for (b.s(); !(x = b.n()).done; ) {
          var P = x.value;
          v[P] = (1 - c) * y[P] + c * g[P], (P === "largeArcFlag" || P === "sweepFlag") && (v[P] = Math.round(v[P]));
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
function Zh(t, e, r) {
  var n = Wi(t), i = Wi(e), a = Re(r) === "object" ? r : {
    excludeSegment: r,
    snapEndsToInput: !0
  }, s = a.excludeSegment, o = a.snapEndsToInput;
  if (!n.length && !i.length)
    return function() {
      return "";
    };
  var l = Kh(n, i, {
    excludeSegment: s,
    snapEndsToInput: o
  });
  return function(f) {
    if (f === 1 && o)
      return e ?? "";
    var h = l(f), c = "", p = Na(h), y;
    try {
      for (p.s(); !(y = p.n()).done; ) {
        var g = y.value;
        c += Uh(g);
      }
    } catch (v) {
      p.e(v);
    } finally {
      p.f();
    }
    return c;
  };
}
function Qh(t) {
  return --t * t * t + 1;
}
var Dn = 3;
(function t(e) {
  e = +e;
  function r(n) {
    return Math.pow(n, e);
  }
  return r.exponent = t, r;
})(Dn);
(function t(e) {
  e = +e;
  function r(n) {
    return 1 - Math.pow(1 - n, e);
  }
  return r.exponent = t, r;
})(Dn);
(function t(e) {
  e = +e;
  function r(n) {
    return ((n *= 2) <= 1 ? Math.pow(n, e) : 2 - Math.pow(2 - n, e)) / 2;
  }
  return r.exponent = t, r;
})(Dn);
function vr(t) {
  return (Math.pow(2, -10 * t) - 9765625e-10) * 1.0009775171065494;
}
var Fn = 1.70158;
(function t(e) {
  e = +e;
  function r(n) {
    return (n = +n) * n * (e * (n - 1) + n);
  }
  return r.overshoot = t, r;
})(Fn);
(function t(e) {
  e = +e;
  function r(n) {
    return --n * n * ((n + 1) * e + n) + 1;
  }
  return r.overshoot = t, r;
})(Fn);
(function t(e) {
  e = +e;
  function r(n) {
    return ((n *= 2) < 1 ? n * n * ((e + 1) * n - e) : (n -= 2) * n * ((e + 1) * n + e) + 2) / 2;
  }
  return r.overshoot = t, r;
})(Fn);
var be = 2 * Math.PI, jn = 1, Nn = 0.3;
(function t(e, r) {
  var n = Math.asin(1 / (e = Math.max(1, e))) * (r /= be);
  function i(a) {
    return e * vr(- --a) * Math.sin((n - a) / r);
  }
  return i.amplitude = function(a) {
    return t(a, r * be);
  }, i.period = function(a) {
    return t(e, a);
  }, i;
})(jn, Nn);
var Jh = function t(e, r) {
  var n = Math.asin(1 / (e = Math.max(1, e))) * (r /= be);
  function i(a) {
    return 1 - e * vr(a = +a) * Math.sin((a + n) / r);
  }
  return i.amplitude = function(a) {
    return t(a, r * be);
  }, i.period = function(a) {
    return t(e, a);
  }, i;
}(jn, Nn);
(function t(e, r) {
  var n = Math.asin(1 / (e = Math.max(1, e))) * (r /= be);
  function i(a) {
    return ((a = a * 2 - 1) < 0 ? e * vr(-a) * Math.sin((n - a) / r) : 2 - e * vr(a) * Math.sin((n + a) / r)) / 2;
  }
  return i.amplitude = function(a) {
    return t(a, r * be);
  }, i.period = function(a) {
    return t(e, a);
  }, i;
})(jn, Nn);
var Rr = Mn({}), xe = class extends Error {
  constructor(e, r) {
    super(e);
    O(this, "jsx");
    this.name = "ErrorWithJSX", this.jsx = r;
  }
}, tc = class extends ds {
  constructor() {
    super(...arguments);
    O(this, "state", { hasError: !1, error: null, errorInfo: null, copied: !1 });
    O(this, "jsxRef", ps());
    O(this, "copiedTimeout", null);
    O(this, "copy", async () => {
      let e = this.errorAsText();
      try {
        await navigator.clipboard.writeText(e);
      } catch {
        let r = document.createElement("textarea");
        r.value = e, document.body.appendChild(r), r.select(), document.execCommand("copy"), r.remove();
      }
      this.setState({ copied: !0 }), this.copiedTimeout && clearTimeout(this.copiedTimeout), this.copiedTimeout = setTimeout(() => this.setState({ copied: !1 }), 1500);
    });
    O(this, "reset", () => {
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
      let e = this.state.error, r = e instanceof xe;
      return Y("div", { style: { border: "1px solid rgb(252, 165, 165)", background: "rgb(254, 242, 242)", borderRadius: 6, padding: 16, margin: 16, userSelect: "text", alignSelf: "flex-start", minWidth: 0 }, children: [Y("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 8 }, children: [Y("div", { style: { fontWeight: 600, color: "rgb(153, 27, 27)", fontSize: "1.125rem" }, children: ["Error: ", e.message] }), Y("div", { style: { display: "flex", gap: 8, flexShrink: 0 }, children: [S("button", { onClick: this.copy, title: "Copy the whole error as plain text", style: { padding: "4px 12px", background: "white", color: "rgb(153, 27, 27)", borderRadius: 6, fontSize: "0.875rem", fontWeight: 500, border: "1px solid rgb(252, 165, 165)", cursor: "pointer", minWidth: 72 }, children: this.state.copied ? "Copied!" : "Copy" }), S("button", { onClick: this.reset, style: { padding: "4px 12px", background: "rgb(220, 38, 38)", color: "white", borderRadius: 6, fontSize: "0.875rem", fontWeight: 500, border: "none", cursor: "pointer" }, children: "Reset" })] })] }), r && S("div", { ref: this.jsxRef, style: { marginTop: 12, marginBottom: 12 }, children: e.jsx }), e.stack && Y("details", { style: { marginTop: 12 }, children: [S("summary", { style: { cursor: "pointer", color: "rgb(185, 28, 28)", fontWeight: 500, marginBottom: 4 }, children: "Stack Trace" }), S("pre", { style: { fontSize: "0.75rem", background: "rgb(254, 226, 226)", padding: 12, borderRadius: 6, overflowX: "auto", color: "rgb(127, 29, 29)", marginTop: 8 }, children: e.stack })] }), this.state.errorInfo?.componentStack && Y("details", { style: { marginTop: 12 }, children: [S("summary", { style: { cursor: "pointer", color: "rgb(185, 28, 28)", fontWeight: 500, marginBottom: 4 }, children: "Component Stack" }), S("pre", { style: { fontSize: "0.75rem", background: "rgb(254, 226, 226)", padding: 12, borderRadius: 6, overflowX: "auto", color: "rgb(127, 29, 29)", marginTop: 8 }, children: this.state.errorInfo.componentStack })] })] });
    }
    return this.props.children;
  }
};
function Xi(t, e, r) {
  return t + e + r - Math.max(t, e, r) - Math.min(t, e, r);
}
function Dr(t, e) {
  throw Error(`Reached unreachable code: unexpected value ${t}`);
}
function U(t, e) {
  if (!t) throw typeof e == "function" ? (console.group("Assertion failed; debug info:"), e(), console.groupEnd(), Error("Assertion failed")) : Error(e ?? "Assertion failed");
}
function La(t, e) {
  if (t == null) throw Error("Assertion failed: value is undefined or null");
  return t;
}
function ec(t, e) {
  t || console.warn("Warning assertion failed:", e);
}
function V(...t) {
  let [e, r] = t;
  if (typeof e == "number") return r === void 0 ? new Ee(e, e) : new Ee(e, r);
  if (nc(e)) return e;
  if (typeof e == "object" && "x" in e && "y" in e) return new Ee(e.x, e.y);
  if (rc(e)) return new Ee(e[0], e[1]);
  Dr(e);
}
(function(t) {
  function e(n, i) {
    return V(n, 0).rotateRad(i);
  }
  t.polarRad = e;
  function r(n, i) {
    return V(n, 0).rotateDeg(i);
  }
  t.polarDeg = r;
})(V || (V = {}));
function rc(t) {
  return Array.isArray(t) && t.length === 2 && typeof t[0] == "number" && typeof t[1] == "number";
}
function nc(t) {
  return t instanceof Ee;
}
var Ee = class {
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
    return t = V(t), this.x === t.x && this.y === t.y;
  }
  add(...t) {
    let e = this;
    for (let r of t) {
      let n = V(r);
      e = V(e.x + n.x, e.y + n.y);
    }
    return e;
  }
  sub(t) {
    return t = V(t), V(this.x - t.x, this.y - t.y);
  }
  mul(t) {
    return V(this.x * t, this.y * t);
  }
  div(t) {
    return V(this.x / t, this.y / t);
  }
  scale(t) {
    return t = V(t), V(this.x * t.x, this.y * t.y);
  }
  dot(t) {
    return t = V(t), this.x * t.x + this.y * t.y;
  }
  cross(t) {
    return t = V(t), this.x * t.y - this.y * t.x;
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
    return Yi(this.angleRad());
  }
  angleToRad(t) {
    return t = V(t), Math.atan2(t.y - this.y, t.x - this.x);
  }
  angleToDeg(t) {
    return Yi(this.angleToRad(t));
  }
  dist2(t) {
    return t = V(t), this.sub(t).len2();
  }
  dist(t) {
    return t = V(t), this.sub(t).len();
  }
  lerp(t, e) {
    return t = V(t), V(J(this.x, t.x, e), J(this.y, t.y, e));
  }
  mid(t) {
    return this.lerp(t, 0.5);
  }
  projOnto(t) {
    let e = V(t), r = this.dot(e) / e.len2();
    return e.mul(r);
  }
  towards(t, e) {
    let r = V(t);
    return this.add(r.sub(this).norm().mul(e));
  }
  perp() {
    return V(-this.y, this.x);
  }
  rotateRad(t) {
    let e = Math.cos(t), r = Math.sin(t);
    return V(this.x * e - this.y * r, this.x * r + this.y * e);
  }
  rotateDeg(t) {
    return this.rotateRad(ic(t));
  }
  round() {
    return V(Math.round(this.x), Math.round(this.y));
  }
  clamp(t, e) {
    return t = V(t), e = V(e), V(Xi(t.x, e.x, this.x), Xi(t.y, e.y, this.y));
  }
};
function J(t, e, r) {
  return t + (e - t) * r;
}
function ic(t) {
  return t * Math.PI / 180;
}
function Yi(t) {
  return t * 180 / Math.PI;
}
function wr(t) {
  if (!t || t.trim() === "") return [];
  let e = [], r = /(\w+)\s*\(([^)]+)\)/g, n;
  for (; (n = r.exec(t)) !== null; ) {
    let i = n[1], a = n[2].split(/[\s,]+/).map((s) => parseFloat(s.trim()));
    switch (i) {
      case "translate":
        e.push({ type: "translate", x: a[0] || 0, y: a[1] || 0 });
        break;
      case "rotate":
        e.push({ type: "rotate", degrees: a[0] || 0, cx: a[1] || 0, cy: a[2] || 0 });
        break;
      case "scale":
        e.push({ type: "scale", x: a[0] ?? 1, y: a[1] ?? a[0] ?? 1 });
        break;
    }
  }
  return e;
}
var Va = (t) => Array.isArray(t) ? t : wr(t);
function re(t, e) {
  let r = Va(t), n = V(e);
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
function ac(t, e) {
  let r = Va(t), n = V(e);
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
function Ln(t, e) {
  return !t && !e ? "" : t ? e ? t + " " + e : t : e;
}
function jt(t) {
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
function ur(t, e, r) {
  if (t = _r(t), e = _r(e), t.length !== e.length) throw new xe(`Cannot lerp transforms with different lengths: ${t.length} vs ${e.length}`, [t.map((i) => [jt([i]), qt("br")]), "vs", qt("br"), e.map((i) => [jt([i]), qt("br")])]);
  let n = [];
  for (let i = 0; i < t.length; i++) {
    let a = t[i], s = e[i];
    if (a.type !== s.type) throw new xe(`Cannot lerp transforms with different types at index ${i}: ${a.type} vs ${s.type}`, [`a: ${jt(t)}`, qt("br"), `b: ${jt(e)}`]);
    switch (a.type) {
      case "translate":
        U(s.type === "translate"), n.push({ type: "translate", x: J(a.x, s.x, r), y: J(a.y, s.y, r) });
        break;
      case "rotate":
        U(s.type === "rotate"), n.push({ type: "rotate", degrees: sc(a.degrees, s.degrees, r), cx: J(a.cx, s.cx, r), cy: J(a.cy, s.cy, r) });
        break;
      case "scale":
        U(s.type === "scale"), n.push({ type: "scale", x: J(a.x, s.x, r), y: J(a.y, s.y, r) });
        break;
    }
  }
  return n;
}
function sc(t, e, r) {
  return t + (((e - t) % 360 + 540) % 360 - 180) * r;
}
function _r(t) {
  let e = [];
  for (let r of t) {
    let n = e[e.length - 1];
    r.type === "translate" && n?.type === "translate" ? e[e.length - 1] = { type: "translate", x: n.x + r.x, y: n.y + r.y } : e.push(r);
  }
  return e;
}
function oc(t, e, r) {
  if (!t && !e) return "";
  let n = wr(t), i = wr(e);
  if (n.length === 0 && i.every((o) => o.type === "translate")) return jt(ur([{ type: "translate", x: 0, y: 0 }], i, r));
  if (i.length === 0 && n.every((o) => o.type === "translate")) return jt(ur(n, [{ type: "translate", x: 0, y: 0 }], r));
  let a = n.some((o) => o.type === "scale"), s = i.some((o) => o.type === "scale");
  if (a || s) {
    let o = _r(n), l = _r(i), u = o.some((h) => h.type === "translate"), f = l.some((h) => h.type === "translate");
    return u && !f ? l = [{ type: "translate", x: 0, y: 0 }, ...l] : f && !u && (o = [{ type: "translate", x: 0, y: 0 }, ...o]), a || (o = [...o, { type: "scale", x: 1, y: 1 }]), s || (l = [...l, { type: "scale", x: 1, y: 1 }]), jt(ur(o, l, r));
  }
  return t ? e ? jt(ur(n, i, r)) : t : e;
}
function oe(t) {
  return X.isValidElement(t);
}
function Vt(t) {
  return typeof t.type != "string" && t.type !== X.Fragment;
}
function lc(t) {
  if (Vt(t) && t.props.dragologyKey !== void 0) throw Error(`<${ve(t)}> has a dragologyKey, which only works on intrinsic elements. Wrap it in a <g dragologyKey=…> instead.`);
}
function uc(t) {
  if (t.type === "foreignObject") for (let e of X.Children.toArray(t.props.children)) {
    if (X.isValidElement(e) && Vt(e)) continue;
    let r = X.isValidElement(e) ? `<${ve(e)}>` : JSON.stringify(e);
    throw Error(`<foreignObject> contains ${r}, but it may only contain component elements. Move the HTML into a component.`);
  }
}
function ve(t) {
  let e = t.type;
  return typeof e == "string" ? e : e.displayName ?? e.name;
}
function Ue(t) {
  return !Vt(t) && t.type !== "defs" && !t.props.dragologyOpaque;
}
function mn(t) {
  let e = [], r = (n, i) => {
    if (Array.isArray(n)) n.forEach((a, s) => r(a, i === "" ? `.${s}` : `${i}:${s}`));
    else {
      if (n == null || typeof n == "boolean") return;
      if (X.isValidElement(n) && n.key == null) e.push(X.cloneElement(n, { key: i || ".0" }));
      else {
        if (X.isValidElement(n) && !n.key.startsWith(".")) throw Error(`<${ve(n)}> has a key prop (${n.key}). Draggables match elements by id or dragologyKey, not key.`);
        e.push(n);
      }
    }
  };
  return r(t, ""), e;
}
function Vn(t, e, r) {
  let { children: n } = t.props;
  if (e && n && Ue(t)) {
    let s = mn(n), o = !1, l = s.map((u, f) => {
      if (X.isValidElement(u)) {
        let h = e(u, f);
        return h !== u && (o = !0), h;
      } else return u;
    });
    o && (r = { ...r, children: l });
  }
  if (!r) return t;
  let i = { ...t.props, ...r }, a = {};
  for (let [s, o] of Object.entries(i)) o !== void 0 && (a[s] = o);
  return t.key != null && (a.key = t.key), X.createElement(t.type, a);
}
function Oe(t, e, r = "", n = []) {
  let i = Ln(r, t.props.transform || "");
  if (e(t)) return { element: t, accumulatedTransform: i, ancestors: n };
  let a = [...n, t];
  if (Ue(t)) {
    let s = X.Children.toArray(t.props.children);
    for (let o of s) if (X.isValidElement(o)) {
      let l = Oe(o, e, i, a);
      if (l) return l;
    }
  }
  return null;
}
function Fr(t, e) {
  return Vn(t, (r) => Fr(r, e), e(t));
}
function Zt(t) {
  return Object.keys(t);
}
function hc(t) {
  return Array.isArray(t);
}
var za = "data-path";
function qe(t) {
  return t.props[za];
}
function Ba(t) {
  return Wa(t, "/");
}
function Wa(t, e) {
  let r = Vt(t) ? void 0 : t.props.id;
  U(!r || !r.includes("/"), `Element id "${r}" contains a slash, which is not allowed.`);
  let n = r ? r + "/" : e;
  U(!(typeof t.key == "string" && !t.key.startsWith(".")), `Element with path "${n}" has a key prop (${t.key}), which is not allowed.`), uc(t);
  let i = /* @__PURE__ */ new Set(), a = 0;
  return Vn(t, (s) => {
    lc(s);
    let o, { dragologyKey: l } = s.props;
    return l === void 0 ? (o = String(a), a++) : (U(!l.includes("/"), `Element dragologyKey "${l}" contains a slash, which is not allowed.`), o = l), U(!i.has(o), `Duplicate path step "${o}" among siblings of path "${n}" (can happen when a dragologyKey collides with an unkeyed sibling's index).`), i.add(o), Wa(s, n + o + "/");
  }, { [za]: n });
}
function Ge(t, e) {
  return Oe(e, (r) => qe(r) === t);
}
function jr(t) {
  let e = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), n = Xa(t, e, r, null, "", 1, []);
  return n && (e = new Map([["", { element: n, stackingPath: [] }], ...e])), { byId: e, descendents: r };
}
function cc(t) {
  return U(/^\/(-?\d+)$/.test(t), `Invalid absolute dragologyZIndex "${t}". Expected format: "/<integer>" (e.g. "/5", "/-3").`), parseInt(t.slice(1), 10);
}
function Xa(t, e, r, n, i, a, s) {
  let o = t.props;
  if (o.dragologyZIndex !== void 0 && !o.id) throw Error(`dragologyZIndex can only be set on elements with an id attribute. Found dragologyZIndex="${o.dragologyZIndex}" on <${t.type}> without id.`);
  let l = Vt(t) ? void 0 : o.id, u = l || n, f = Ln(i, o.transform || ""), h = a * (o.opacity === void 0 ? 1 : Number(o.opacity)), c = s;
  if (l) {
    let y = o.dragologyZIndex;
    c = typeof y == "string" ? [cc(y)] : [...s, y || 0];
  }
  let p = Vn(t, (y) => Xa(y, e, r, u, f, h, c));
  if (l) {
    if (U(!e.has(l), `Duplicate id "${l}" found in SVG tree. Each element must have a unique id.`), n && (r.has(n) || r.set(n, /* @__PURE__ */ new Set()), r.get(n).add(l), r.has(l))) for (let g of r.get(l)) r.get(n).add(g);
    let y = lt(p, { key: l, transform: f || void 0, opacity: h === 1 ? void 0 : h });
    return e.set(l, { element: y, stackingPath: c }), null;
  } else return p;
}
function fc(t, e) {
  let r = Math.min(t.length, e.length);
  for (let n = 0; n < r; n++) if (t[n] !== e[n]) return t[n] - e[n];
  return t.length === e.length ? 0 : t.length > e.length ? t[r] >= 0 ? 1 : -1 : e[r] >= 0 ? -1 : 1;
}
function Ke(t) {
  return S(Tr, { children: Array.from(t.byId.entries()).sort(([e, r], [n, i]) => fc(r.stackingPath, i.stackingPath)).map(([e, r]) => S(Jn, { children: Fr(r.element, (n) => {
    U(n.type !== Jn, "Please use <g> rather than <Fragment> / <> in draggables.");
    let i = {};
    for (let a of Zt(n.props)) a.startsWith("dragology") && (i[a] = void 0);
    return i;
  }) }, e)) });
}
function Hi(t, e) {
  if (U(t.descendents !== null, "layered.descendents is null"), !t.byId.has(e)) throw new xe(`Layered SVG does not contain id "${e}"`, Y("p", { children: ["Available ids: ", S("code", { children: [...t.byId.keys()].join(", ") })] }));
  let r = /* @__PURE__ */ new Set([e]);
  if (t.descendents.has(e)) for (let o of t.descendents.get(e)) r.add(o);
  let n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  for (let [o, l] of t.byId.entries()) r.has(o) ? n.set(o, l) : i.set(o, l);
  let a = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  for (let [o, l] of t.descendents.entries()) {
    let u = r.has(o), f = /* @__PURE__ */ new Set();
    for (let h of l) u === r.has(h) && f.add(h);
    f.size > 0 && (u ? a.set(o, f) : s.set(o, f));
  }
  return { remaining: { byId: i, descendents: s }, extracted: { byId: n, descendents: a } };
}
function Pr(t, e) {
  let r = new Map(t.byId);
  for (let [n, i] of e.byId.entries()) U(!r.has(n), `Cannot merge LayeredSvgx: duplicate id "${n}" found`), r.set(n, i);
  return { byId: r, descendents: null };
}
function an(t, e) {
  let r = /* @__PURE__ */ new Map();
  for (let [n, i] of t.byId.entries()) {
    let a = Ln(e, i.element.props.transform || ""), s = lt(i.element, { transform: a || void 0 });
    r.set(n, { ...i, element: s });
  }
  return { byId: r, descendents: t.descendents };
}
function Ya(t, e) {
  let r = /* @__PURE__ */ new Map();
  for (let [n, i] of t.byId.entries()) {
    let a = e + n, s = lt(i.element, { id: a, "data-path": a + "/" });
    r.set(a, { ...i, element: s });
  }
  return { byId: r, descendents: null };
}
function Ha(t, e) {
  let r = /* @__PURE__ */ new Map();
  for (let [n, i] of t.byId.entries()) r.set(n, { ...i, stackingPath: [e, ...i.stackingPath] });
  return { ...t, byId: r };
}
function Ui(t, e) {
  let r = /* @__PURE__ */ new Map();
  for (let [n, i] of t.byId.entries()) r.set(n, { ...i, element: lt(i.element, e) });
  return { ...t, byId: r };
}
function Ua(t, e) {
  for (let r of e.byId.values()) {
    let n = Ge(t, r.element);
    if (n) return n;
  }
  return null;
}
var dc = Mn(null);
function Nr() {
  let t = Pe(dc);
  return U(t !== null, "TreeViewContext not initialized"), t;
}
var pc = "rgba(250, 204, 21, 0.25)", ze = "rgb(250, 204, 21)", gc = "rgba(148, 163, 184, 0.08)", yc = "rgb(203, 213, 225)";
function mc({ op: t, path: e }) {
  let { activePath: r, colorMap: n } = Nr(), i = e + t.name;
  return t.treeView({ path: e, childPath: i + "/", active: r === i || r.startsWith(i + "/"), color: n?.get(i) });
}
function zn({ renderedStates: t, closestIndex: e }) {
  let { svgWidth: r, svgHeight: n, thumbArea: i } = Nr();
  if (r === 0 || n === 0) return null;
  let a = r / n, s = Math.round(Math.sqrt(i / a)), o = Math.round(s * a);
  return S("div", { style: { display: "flex", flexDirection: "row", gap: 3, flexWrap: "wrap", marginTop: 2 }, children: t.map((l, u) => S("svg", { width: o, height: s, viewBox: `0 0 ${r} ${n}`, style: { border: "1px solid rgb(203, 213, 225)", borderRadius: 3, background: "white", transition: "width 150ms ease, height 150ms ease", ...e === u ? { outline: `2px solid ${ze}`, outlineOffset: -1 } : {} }, children: Ke(l.layered) }, u)) });
}
function we({ outputPreview: t, active: e }) {
  let { svgWidth: r, svgHeight: n, thumbArea: i } = Nr();
  if (r === 0 || n === 0) return null;
  let a = r / n, s = Math.round(Math.sqrt(i / a));
  return S("div", { style: { marginTop: 2, marginBottom: 4 }, children: Y("svg", { width: Math.round(s * a), height: s, viewBox: `0 0 ${r} ${n}`, style: { border: "1px solid rgb(203, 213, 225)", borderRadius: 3, background: "white", transition: "width 150ms ease, height 150ms ease", ...e ? { outline: `2px solid ${ze}`, outlineOffset: -1 } : {} }, children: [e && S("rect", { width: r, height: n, fill: ze, opacity: 0.15 }), Ke(t)] }) });
}
function ut({ label: t, active: e, color: r, path: n, children: i }) {
  let { nodeProps: a } = Nr(), { tightFixed: s } = Pe(Rr), o = n === void 0 ? void 0 : a?.[n], l = r ? bc(r, 0.15) : e ? pc : gc, u = r || (e ? ze : yc);
  return Y("div", { style: { width: o?.width ?? "fit-content", height: o?.height, background: l, border: `1px solid ${u}`, borderRadius: 6, padding: "4px 6px", transition: "background 150ms, border-color 150ms", ...e ? r ? { outline: "2px solid black", outlineOffset: 1 } : { outline: `2px solid ${ze}`, outlineOffset: -1 } : {} }, children: [S("div", { style: { color: e && !r ? "rgb(161, 98, 7)" : "rgb(100, 116, 139)", fontWeight: e ? 600 : 400, marginBottom: i ? 3 : 0, fontSize: s ? 15 : 10 }, children: t }), i] });
}
function bn({ label: t, children: e }) {
  return Y("div", { style: { display: "flex", flexDirection: "column", gap: 1 }, children: [S("div", { style: { fontSize: 9, color: "rgb(148, 163, 184)", paddingLeft: 2 }, children: t }), e] });
}
function qa(t) {
  return t ? `${typeof t.easing == "function" ? "fn" : t.easing} ${t.duration}ms` : "none";
}
function Ga(t, e) {
  return t.length <= e ? t : t.slice(0, e - 1) + "…";
}
function bc(t, e) {
  let r = t.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  return r ? `rgba(${r[1]}, ${r[2]}, ${r[3]}, ${e})` : t;
}
var Ka = class extends Error {
  constructor(t, e) {
    super(`Coincident points at indices ${t} and ${e}`), this.indexA = t, this.indexB = e, this.name = "CoincidentPointsError";
  }
}, xc = class {
  constructor(t) {
    O(this, "_inner");
    this._inner = An.from(t.map((i) => V(i).arr()));
    let e = this._inner.inedges, r = this._inner.points, n = r.length / 2;
    for (let i = 0; i < n; i++) if (e[i] === -1) {
      for (let a = 0; a < n; a++) if (a !== i && r[2 * i] === r[2 * a] && r[2 * i + 1] === r[2 * a + 1]) throw new Ka(Math.min(i, a), Math.max(i, a));
      throw Error(`Point ${i} was excluded from triangulation for unknown reasons`);
    }
  }
  get d3() {
    return this._inner;
  }
  point(t) {
    return V(this._inner.points[2 * t], this._inner.points[2 * t + 1]);
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
    return this.numPoints() < 2 ? [] : $a(this.numTriangles()).map((t) => this.triangle(t));
  }
  findTriangle(t, { edge: e = 0, limit: r = 1 / 0 } = {}) {
    if (this.numPoints() < 3 || isNaN(e)) return -1;
    let { triangles: n, halfedges: i, points: a } = this._inner, s = (h) => h % 3 == 0 ? h + 2 : h - 1, o = (h) => h % 3 == 2 ? h - 2 : h + 1, l = e, u = l, f = 0;
    for (; ; ) {
      if (r-- <= 0) return -1;
      let h = o(l), c = n[l] * 2, p = n[h] * 2;
      if (vc(a[c], a[c + 1], a[p], a[p + 1], t.x, t.y) >= 0) {
        if (u === (l = h)) break;
      } else {
        if ((l = i[l]) === -1) break;
        u = l = ++f % 2 ? o(l) : s(l);
      }
    }
    return l > -1 ? Math.floor(l / 3) : -1;
  }
  projectOntoConvexHull(t) {
    if (this.numPoints() === 1) {
      let x = V(this._inner.points[0], this._inner.points[1]);
      return { type: "vertex", ptIdx: 0, projectedPt: x, dist: t.dist(x) };
    }
    let e = (x) => V(this._inner.points[2 * x], this._inner.points[2 * x + 1]), r = this.findTriangle(t);
    if (r !== -1 && !qi(this._inner)) {
      let x = this._inner.triangles[3 * r + 0], P = this._inner.triangles[3 * r + 1], m = this._inner.triangles[3 * r + 2], d = /* @__PURE__ */ new Set([x, P, m]);
      if (U(d.size >= 2), d.size === 2) {
        let [R, z] = Array.from(d), L = e(R), $ = e(z).sub(L), D = $.len2();
        U(D > 0);
        let C = t.sub(L).dot($) / D;
        return ec(C >= 0 && C <= 1, "t out of range in projectOntoConvexHull"), { type: "edge", ptIdx0: R, ptIdx1: z, t: C, projectedPt: t, dist: 0 };
      } else return { type: "triangle", ptIdx0: x, ptIdx1: P, ptIdx2: m, barycentric: wc(t, e(x), e(P), e(m)), projectedPt: t, dist: 0 };
    }
    let n = qi(this._inner), i = n ? [...n, ...Ku(n.slice(1, n.length - 1))] : this._inner.hull, a = this._inner.points, s = t.x, o = t.y, l = 1 / 0, u = "vertex", f = 0, h = 0, c = 0, p = 0, y = 0, g = 0;
    for (let x = 0; x < i.length; x++) {
      let P = i[x], m = i[(x + 1) % i.length], d = a[2 * P], R = a[2 * P + 1], z = a[2 * m], L = a[2 * m + 1], $ = z - d, D = L - R, C = $ * $ + D * D;
      if (C < 1e-10) {
        let M = (s - d) * (s - d) + (o - R) * (o - R);
        M < l && (l = M, u = "vertex", f = P, y = d, g = R);
        continue;
      }
      let I = Math.max(0, Math.min(1, ((s - d) * $ + (o - R) * D) / C)), N = d + I * $, w = R + I * D, E = (s - N) * (s - N) + (o - w) * (o - w);
      E < l && (l = E, y = N, g = w, I < 1e-6 ? (u = "vertex", f = P) : I > 0.999999 ? (u = "vertex", f = m) : (u = "edge", h = P, c = m, p = I));
    }
    let v = Math.sqrt(l), b = V(y, g);
    return u === "vertex" ? { type: "vertex", ptIdx: f, projectedPt: b, dist: v } : { type: "edge", ptIdx0: h, ptIdx1: c, t: p, projectedPt: b, dist: v };
  }
};
function vc(t, e, r, n, i, a) {
  return Math.sign((i - r) * (n - e) - (a - n) * (r - t));
}
function wc(t, e, r, n) {
  let i = t.x, a = t.y, s = e.x, o = e.y, l = r.x, u = r.y, f = n.x, h = n.y, c = (u - h) * (s - f) + (f - l) * (o - h), p = ((u - h) * (i - f) + (f - l) * (a - h)) / c, y = ((h - o) * (i - f) + (s - f) * (a - h)) / c;
  return { l0: p, l1: y, l2: 1 - p - y };
}
function qi(t) {
  return t.collinear;
}
function Ut(t) {
  return t % 3 == 2 ? t - 2 : t + 1;
}
function _c(t, e, r) {
  let n = r?.coincidenceTolerance2 ?? 1e-20, i = t.d3, a = i.points, { triangles: s, halfedges: o } = i, l = e.x, u = e.y, f = i.find(l, u), h = a[2 * f] - l, c = a[2 * f + 1] - u;
  if (h * h + c * c < n) {
    let w = /* @__PURE__ */ new Map();
    return w.set(f, 1), { weights: w, barycentricDeviation: 0 };
  }
  let p = Pc(a, i.hull, l, u);
  if (p !== null) return $c(a, p, l, u);
  let y = t.findTriangle(V(l, u));
  if (y === -1) {
    let w = t.projectOntoConvexHull(V(l, u));
    if (w.type === "vertex") {
      let E = /* @__PURE__ */ new Map();
      return E.set(w.ptIdx, 1), { weights: E, barycentricDeviation: 0 };
    }
    if (w.type === "edge") {
      let E = /* @__PURE__ */ new Map();
      return E.set(w.ptIdx0, 1 - w.t), E.set(w.ptIdx1, w.t), { weights: E, barycentricDeviation: 0 };
    }
    return null;
  }
  let g = s.length / 3, v = new Uint8Array(g), b = [y];
  for (v[y] = 1; b.length > 0; ) {
    let w = b.pop();
    for (let E = 0; E < 3; E++) {
      let M = o[3 * w + E];
      if (M === -1) continue;
      let k = Math.floor(M / 3);
      v[k] || Sc(a, s, k, l, u) && (v[k] = 1, b.push(k));
    }
  }
  let x = [];
  for (let w = 0; w < g; w++) if (v[w]) for (let E = 0; E < 3; E++) {
    let M = 3 * w + E, k = o[M];
    (k === -1 || !v[Math.floor(k / 3)]) && x.push(M);
  }
  if (x.length < 3) return null;
  let P = Mc(x, s);
  if (P === null) return null;
  let m = P.length, d = Array(m), R = Array(m), z = Array(m);
  for (let w = 0; w < m; w++) {
    let E = s[P[w]];
    d[w] = E, R[w] = a[2 * E] - l, z[w] = a[2 * E + 1] - u;
  }
  let L = new Float64Array(m), $ = 0, D = null;
  for (let w = 0; w < m; w++) {
    let E = (w + 1) % m, M = (E + 1) % m, k = R[w], B = z[w], j = R[E], H = z[E], A = R[M], T = z[M], _ = (k + j) / 2, tt = (B + H) / 2, F = (j + A) / 2, dt = (H + T) / 2, K = D ?? xn(k, B, j, H, 0, 0), W = xn(j, H, A, T, 0, 0);
    D = W;
    let st = _ * K.y - K.x * tt + (K.x * W.y - W.x * K.y) + (W.x * dt - F * W.y), ht = P[w], ot = P[E], G = Ut(ht), Q = hr(a, s, G, l, u), rt = _ * Q.y - Q.x * tt, gt = 0;
    for (; G !== ot && gt < 1e3; ) {
      gt++;
      let zt = o[G];
      if (zt === -1) {
        let Bt = s[G], wt = s[Ut(G)], Wt = a[2 * wt] - a[2 * Bt], Xt = a[2 * wt + 1] - a[2 * Bt + 1], Te = Math.sqrt(Wt * Wt + Xt * Xt), Yt = 1e8, Rt = (a[2 * Bt] + a[2 * wt]) / 2 - l, Ie = (a[2 * Bt + 1] + a[2 * wt + 1]) / 2 - u, Ht = { x: Rt + Xt / Te * Yt, y: Ie + -Wt / Te * Yt };
        rt += Q.x * Ht.y - Ht.x * Q.y, Q = Ht;
        let nt = Ut(ot), ct = hr(a, s, nt, l, u), yt = 0, ie = 0;
        for (; ie < 1e3; ) {
          ie++;
          let Gn = o[nt];
          if (Gn === -1) {
            let rr = s[nt], nr = s[Ut(nt)], Yr = a[2 * nr] - a[2 * rr], Hr = a[2 * nr + 1] - a[2 * rr + 1], Kn = Math.sqrt(Yr * Yr + Hr * Hr), Zn = { x: (a[2 * rr] + a[2 * nr]) / 2 - l + Hr / Kn * Yt, y: (a[2 * rr + 1] + a[2 * nr + 1]) / 2 - u + -Yr / Kn * Yt };
            rt += Q.x * Zn.y - Zn.x * Q.y, Q = ct;
            break;
          }
          nt = Ut(Gn);
          let Xr = hr(a, s, nt, l, u);
          yt += ct.x * Xr.y - Xr.x * ct.y, ct = Xr;
        }
        rt += yt;
        break;
      }
      G = Ut(zt);
      let Ct = hr(a, s, G, l, u);
      rt += Q.x * Ct.y - Ct.x * Q.y, Q = Ct;
    }
    rt += Q.x * dt - F * Q.y;
    let Et = st - rt;
    $ += Et, L[E] += Et;
  }
  if (Math.abs($) < 1e-30) return null;
  let C = /* @__PURE__ */ new Map();
  for (let w = 0; w < m; w++) C.set(d[w], L[w] / $);
  let I = 0, N = 0;
  for (let w = 0; w < m; w++) {
    let E = L[w] / $;
    I += E * R[w], N += E * z[w];
  }
  return { weights: C, barycentricDeviation: Math.sqrt(I * I + N * N) };
}
function Pc(t, e, r, n, i = 1e-10) {
  for (let a = 0; a < e.length; a++) {
    let s = e[a], o = e[(a + 1) % e.length], l = t[2 * s], u = t[2 * s + 1], f = t[2 * o], h = t[2 * o + 1], c = f - l, p = h - u, y = c * c + p * p;
    if (y < 1e-30) continue;
    let g = ((r - l) * c + (n - u) * p) / y;
    if (g < -i || g > 1 + i) continue;
    let v = (r - l) * p - (n - u) * c;
    if (v * v / y < i * i * y) return [s, o];
  }
  return null;
}
function $c(t, [e, r], n, i) {
  let a = t[2 * e], s = t[2 * e + 1], o = t[2 * r], l = t[2 * r + 1], u = o - a, f = l - s, h = u * u + f * f, c = h > 0 ? ((n - a) * u + (i - s) * f) / h : 0.5, p = /* @__PURE__ */ new Map();
  return p.set(e, 1 - c), p.set(r, c), { weights: p, barycentricDeviation: 0 };
}
function Mc(t, e) {
  if (t.length === 0) return null;
  let r = (s) => e[Ut(s)], n = /* @__PURE__ */ new Map();
  for (let s of t) n.set(e[s], s);
  let i = [], a = t[0];
  for (let s = 0; s < t.length; s++) {
    i.push(a);
    let o = r(a), l = n.get(o);
    if (l === void 0) return null;
    a = l;
  }
  return r(i[i.length - 1]) === e[i[0]] ? i : null;
}
function Sc(t, e, r, n, i) {
  let a = e[3 * r], s = e[3 * r + 1], o = e[3 * r + 2], l = t[2 * a] - n, u = t[2 * a + 1] - i, f = t[2 * s] - n, h = t[2 * s + 1] - i, c = t[2 * o] - n, p = t[2 * o + 1] - i, y = (l * l + u * u) * (f * p - c * h) + (f * f + h * h) * (c * u - l * p) + (c * c + p * p) * (l * h - f * u);
  return ((f - l) * (p - u) - (h - u) * (c - l)) * y > 0;
}
function xn(t, e, r, n, i, a) {
  let s = 2 * (t * (n - a) + r * (a - e) + i * (e - n));
  if (Math.abs(s) < 1e-30) return { x: (t + r + i) / 3, y: (e + n + a) / 3 };
  let o = t * t + e * e, l = r * r + n * n, u = i * i + a * a;
  return { x: (o * (n - a) + l * (a - e) + u * (e - n)) / s, y: (o * (i - r) + l * (t - i) + u * (r - t)) / s };
}
function hr(t, e, r, n, i) {
  let a = Math.floor(r / 3), s = e[3 * a], o = e[3 * a + 1], l = e[3 * a + 2];
  return xn(t[2 * s] - n, t[2 * s + 1] - i, t[2 * o] - n, t[2 * o + 1] - i, t[2 * l] - n, t[2 * l + 1] - i);
}
function Ot({ op: t, active: e = !0 }) {
  let { overlayFullOpacity: r } = Pe(Rr), n = r ? 1 : e ? 0.8 : 0.2;
  return t.overlayVis({ active: e, opacity: n });
}
function Ze({ from: t, to: e, distance: r }) {
  let { overlayHideDistances: n } = Pe(Rr), [i, a] = r === 1 / 0 ? ["∞", 24] : [`${Math.round(r)}px`, 11];
  return Y("g", { children: [S("line", { ...t.xy1(), ...e.xy2(), stroke: "white", strokeWidth: 5, strokeLinecap: "round" }), S("line", { ...t.xy1(), ...e.xy2(), stroke: "magenta", strokeWidth: 1.5, strokeDasharray: "4 3" }), !n && S("text", { ...t.lerp(e, 0.5).xy(), fill: "magenta", stroke: "white", strokeWidth: 3, paintOrder: "stroke", fontSize: a, fontFamily: "monospace", textAnchor: "middle", dominantBaseline: "central", children: i })] });
}
var vt = class {
  constructor(t) {
    O(this, "children", []);
    O(this, "frames", 0);
    O(this, "lastFrame");
    this.ctx = t;
  }
  child(t, e, r = this.ctx) {
    let n = new Oc(t, e, r), i = this.children.findIndex((a) => a.key === t);
    return i === -1 ? this.children.push(n) : this.children[i] = n, n;
  }
}, ft = class extends vt {
  constructor(e, r, n = e) {
    super(e);
    O(this, "inner");
    this.inner = this.child(null, r, n);
  }
  treeView(e) {
    return this.wrapperView(e);
  }
  overlayVis({ active: e }) {
    return S(Ot, { op: this.inner.op, active: e });
  }
  wrapperView(e, r) {
    return S(ut, { label: r ? `${this.name} (${r})` : this.name, path: e.path, children: this.inner.treeView(e) });
  }
}, Oc = class {
  constructor(t, e, r) {
    O(this, "op");
    O(this, "behavior");
    this.key = t, this.op = new e.opClass(r, ...e.args), this.behavior = Za(this.op);
  }
  run(t) {
    let { op: e, activePath: r, ...n } = this.behavior(t);
    return { ...n, activePath: Bn(this.key, r) };
  }
  treeView({ childPath: t }) {
    return S(mc, { op: this.op, path: this.key === null ? t : `${t}${this.key}/` }, this.key);
  }
};
function Za(t) {
  return (e) => {
    let { activePath: r, ...n } = t.frame(e);
    return t.frames++, t.lastFrame = e, { ...n, activePath: Bn(t.name, r), op: t };
  };
}
function Bn(...t) {
  return t.filter((e) => e != null).join("/");
}
var ue = { empty: !0 };
function Tc(t, e) {
  return e.empty ? !1 : t.x >= e.minX && t.x <= e.maxX && t.y >= e.minY && t.y <= e.maxY;
}
function vn(t, e) {
  return t.empty ? e : e.empty ? t : { empty: !1, minX: Math.min(t.minX, e.minX), minY: Math.min(t.minY, e.minY), maxX: Math.max(t.maxX, e.maxX), maxY: Math.max(t.maxY, e.maxY) };
}
function Qa(t, e) {
  if (t.empty) return t;
  let r = wr(e);
  if (r.length === 0) return t;
  let n = [V(t.minX, t.minY), V(t.maxX, t.minY), V(t.maxX, t.maxY), V(t.minX, t.maxY)].map((i) => re(r, i));
  return { empty: !1, minX: Math.min(...n.map((i) => i.x)), minY: Math.min(...n.map((i) => i.y)), maxX: Math.max(...n.map((i) => i.x)), maxY: Math.max(...n.map((i) => i.y)) };
}
function Wn(t, e) {
  let r = Xn(t);
  return e ? Qa(r, e) : r;
}
function Xn(t) {
  let e = t.props, r = t.type;
  if (r === "rect" || r === "foreignObject" || r === "image") {
    let a = Number(e.x) || 0, s = Number(e.y) || 0, o = Number(e.width) || 0, l = Number(e.height) || 0;
    return { empty: !1, minX: a, minY: s, maxX: a + o, maxY: s + l };
  }
  if (r === "circle") {
    let a = Number(e.cx) || 0, s = Number(e.cy) || 0, o = Number(e.r) || 0;
    return { empty: !1, minX: a - o, minY: s - o, maxX: a + o, maxY: s + o };
  }
  if (r === "ellipse") {
    let a = Number(e.cx) || 0, s = Number(e.cy) || 0, o = Number(e.rx) || 0, l = Number(e.ry) || 0;
    return { empty: !1, minX: a - o, minY: s - l, maxX: a + o, maxY: s + l };
  }
  if (r === "line") {
    let a = Number(e.x1) || 0, s = Number(e.y1) || 0, o = Number(e.x2) || 0, l = Number(e.y2) || 0;
    return { empty: !1, minX: Math.min(a, o), minY: Math.min(s, l), maxX: Math.max(a, o), maxY: Math.max(s, l) };
  }
  if (r === "polygon" || r === "polyline") {
    let a = String(e.points ?? "").trim().split(/[\s,]+/).filter((o) => o !== "").map(Number), s = ue;
    for (let o = 0; o + 1 < a.length; o += 2) {
      let [l, u] = [a[o], a[o + 1]];
      !Number.isFinite(l) || !Number.isFinite(u) || (s = vn(s, { empty: !1, minX: l, minY: u, maxX: l, maxY: u }));
    }
    return s;
  }
  if (!Ue(t)) return ue;
  let n = e.children;
  if (n == null) return ue;
  let i = ue;
  for (let a of X.Children.toArray(n)) {
    if (!X.isValidElement(a)) continue;
    let s = Xn(a), o = a.props.transform, l = o ? Qa(s, o) : s;
    i = vn(i, l);
  }
  return i;
}
function wn(t) {
  return V((t.minX + t.maxX) / 2, (t.minY + t.maxY) / 2);
}
function Ft(...t) {
  let { x: e, y: r } = V(...t);
  return `translate(${e},${r}) `;
}
function Ic(...t) {
  return t.map((e) => typeof e == "string" ? e : typeof e == "number" ? e.toString() : V(e).str()).join(" ");
}
function Ac(t) {
  return [...t.byId.values()].reduce((e, { element: r }) => vn(e, Wn(r, r.props.transform ?? "")), ue);
}
function kc(t) {
  return S("pre", { style: { margin: 0, fontSize: "11px", whiteSpace: "pre-wrap", wordBreak: "break-word" }, children: t.kind === "state" ? Yn(t.value) : Ja(t.value) });
}
var Ec = Mn(kc);
function _n(t) {
  return S(Pe(Ec), { ...t });
}
function Yn(t) {
  let e = [];
  try {
    return JSON.stringify(t, function(r, n) {
      for (; e.length > 0 && e.at(-1) !== this; ) e.pop();
      if (typeof n == "object" && n) {
        if (e.includes(n)) return "[Circular]";
        e.push(n);
      }
      return Cc(n);
    }, 2) ?? String(t);
  } catch {
    return String(t);
  }
}
function Cc(t) {
  return typeof t == "number" && !Number.isInteger(t) ? Math.round(t * 100) / 100 : typeof t == "function" ? `[Function ${t.name || "anonymous"}]` : typeof t == "bigint" ? `${t}n` : typeof t == "symbol" ? t.toString() : t instanceof Map ? Object.fromEntries(t) : t instanceof Set ? [...t] : t;
}
function Ja(t, e = "") {
  if (!X.isValidElement(t)) return e + (typeof t == "string" ? t : Yn(t));
  let r = t, n = ve(r) ?? "", { children: i, ...a } = r.props, s = Object.entries(a).filter(([, l]) => l !== void 0).map(([l, u]) => ` ${l}=${Rc(u)}`).join(""), o = X.Children.toArray(i);
  return o.length === 0 ? `${e}<${n}${s} />` : [`${e}<${n}${s}>`, ...o.map((l) => Ja(l, e + "  ")), `${e}</${n}>`].join(`
`);
}
function Rc(t) {
  return typeof t == "string" ? JSON.stringify(t) : typeof t == "function" ? "{ƒ}" : `{${Yn(t).replace(/\s*\n\s*/g, " ")}}`;
}
var Dc = /* @__PURE__ */ new Set(["fill", "stroke", "color", "stop-color", "flood-color", "lighting-color", "backgroundColor", "borderColor", "outlineColor"]), pr = Nh, Gi = /* @__PURE__ */ new Set(["pointerEvents", "cursor"]), Ki = { opacity: 1 };
function Zi(t) {
  let e = t.trim().split(/[\s,]+/).filter((n) => n.length > 0).map((n) => parseFloat(n)), r = [];
  for (let n = 0; n < e.length; n += 2) r.push([e[n], e[n + 1]]);
  return r;
}
function Fc(t) {
  return t.map((e) => `${e[0]},${e[1]}`).join(" ");
}
function jc(t, e, r) {
  let n = Zi(t), i = Zi(e);
  if (n.length !== i.length) throw Error(`Cannot lerp points: different point counts (${n.length} vs ${i.length})`);
  return Fc(n.map((a, s) => {
    let o = i[s];
    return [J(a[0], o[0], r), J(a[1], o[1], r)];
  }));
}
function Pn(t, e, r, n) {
  if (e === r || (e ?? (e = Ki[t]), r ?? (r = Ki[t]), e !== void 0 && r === void 0)) return e;
  if (e === void 0 && r !== void 0) return r;
  if (typeof e == "number" && typeof r == "number") return J(e, r, n);
  if (t === "points" && typeof e == "string" && typeof r == "string") return jc(e, r, n);
  if (t === "d" && typeof e == "string" && typeof r == "string") return Zh(e, r)(n);
  if (Dc.has(t) && typeof e == "string" && typeof r == "string") {
    let i = e === "none";
    if (i || r === "none") {
      let a = i ? r : e, s = ce(a);
      if (s === null) throw Error(`Cannot lerp prop "${t}": invalid color value (${a})`);
      let o = ce(s.r, s.g, s.b, 0), l = ce(s.r, s.g, s.b, 1);
      return (i ? pr(o.formatRgb(), l.formatRgb()) : pr(l.formatRgb(), o.formatRgb()))(n);
    }
    return pr(e, r)(n);
  } else if ((t === "filter" || t === "WebkitFilter") && typeof e == "string" && typeof r == "string") {
    let i = Wc(e, r, n);
    if (i) return i;
    throw Error(`Cannot lerp prop "${t}": unrecognized filter values (${e} vs ${r})`);
  } else if (typeof e == "string" && typeof r == "string") {
    let i = parseFloat(e), a = parseFloat(r);
    if (!isNaN(i) && !isNaN(a)) return String(J(i, a, n));
    throw Error(`Cannot lerp prop "${t}": different non-numeric values (${e} vs ${r})`);
  } else throw Error(`Cannot lerp prop "${t}": different non-numeric values (${e} vs ${r})`);
}
function $r(t, e) {
  if (Vt(t)) return e >= 0.5 ? t : null;
  let r = +(t.props.opacity ?? 1) * e;
  return r <= 1e-3 ? null : lt(t, { opacity: r });
}
function ts(t, e, r, n = "a") {
  if (t.type !== e.type) throw new xe(`Cannot lerp between different element types: ${String(t.type)} and ${String(e.type)}`, Y(Tr, { children: [S("p", { style: { marginBottom: 8 }, children: `During interpolation, I found elements of different types at the same path in the "before" and "after" SVG trees. I don't know how to interpolate between those, sorry.` }), t.props.id !== void 0 && t.props.id === e.props.id && Y("p", { style: { marginBottom: 8 }, children: ["(FYI: These elements share the ID", " ", S("span", { style: { fontFamily: "monospace" }, children: t.props.id }), ". I would guess that you are drawing this element in two different code paths, and they don't match up.)"] }), S(_n, { kind: "svg", value: t }), S("div", { style: { marginTop: 16, marginBottom: 16 }, children: "vs" }), S(_n, { kind: "svg", value: e })] }));
  if (Vt(t)) return Nc(t, e, r, n);
  let i = t.props, a = e.props, s = n === "b", o = oc(i.transform || "", a.transform || "", r), l = {}, u = /* @__PURE__ */ new Set([...Zt(i), ...Zt(a)]);
  for (let g of u) {
    if (g === "children" || g === "transform") continue;
    if (g.startsWith("data-") || g.startsWith("dragology") || /^on[A-Z]/.test(g) || Gi.has(g)) {
      s && (l[g] = a[g]);
      continue;
    }
    let v = i[g], b = a[g];
    if (g === "style" && typeof v == "object" && typeof b == "object") {
      let x = v || {}, P = b || {}, m = {}, d = /* @__PURE__ */ new Set([...Zt(x), ...Zt(P)]);
      for (let R of d) {
        if (Gi.has(R)) {
          m[R] = (s ? P : x)[R];
          continue;
        }
        m[R] = Pn(R, x[R], P[R], r);
      }
      l[g] = m;
    } else l[g] = Pn(g, v, b, r);
  }
  if (!Ue(t)) return X.cloneElement(t, { ...l, ...o ? { transform: o } : {}, children: (s ? a : i).children });
  let f = mn(i.children), h = mn(a.children), c = [], p = /* @__PURE__ */ new Map(), y = (g, v) => {
    let b = 0;
    for (let x of g) {
      let P = oe(x) ? x.props.dragologyKey : void 0, m = P === void 0 ? String(b++) : P, d = p.get(m) ?? {};
      d[v] = x, p.set(m, d);
    }
  };
  y(f, "a"), y(h, "b");
  for (let { a: g, b: v } of p.values()) if (g !== void 0 && v !== void 0) oe(g) && oe(v) ? c.push(ts(g, v, r, n)) : c.push(s ? v : g);
  else if (g !== void 0 && oe(g)) {
    let b = $r(g, 1 - r);
    b && c.push(b);
  } else if (v !== void 0 && oe(v)) {
    let b = $r(v, r);
    b && c.push(b);
  }
  return X.cloneElement(t, { ...l, ...o ? { transform: o } : {}, children: c.length === 0 ? void 0 : c });
}
function Nc(t, e, r, n) {
  let i = n === "b", a = i ? lt(e, { key: t.key ?? void 0 }) : t, { dragologyLerpProps: s } = a.props;
  if (!s) return a;
  let o = s === !0 ? /* @__PURE__ */ new Set([...Zt(t.props), ...Zt(e.props)]) : s;
  s !== !0 && Lc(o, t, e);
  let l = {};
  for (let u of o) u === "children" || u.startsWith("data-") || u.startsWith("dragology") || typeof t.props[u] == "function" || (l[u] = $n(u, t.props[u], e.props[u], r, i));
  return lt(a, l);
}
var Qi = /* @__PURE__ */ new Set();
function Lc(t, e, r) {
  for (let n of t) {
    if (n in e.props || n in r.props) continue;
    let i = `${ve(e)}.${n}`;
    Qi.has(i) || (Qi.add(i), console.warn(`dragologyLerpProps on <${ve(e)}> lists "${n}", but it has no prop by that name.`));
  }
}
function $n(t, e, r, n, i) {
  if (e === r) return e;
  let a = i ? r : e;
  if (Array.isArray(e) && Array.isArray(r)) return e.length === r.length ? e.map((s, o) => $n(t, s, r[o], n, i)) : a;
  if (Ji(e) && Ji(r)) {
    let s = Object.keys(e), o = Object.keys(r);
    return s.length !== o.length || !s.every((l) => Object.hasOwn(r, l)) ? a : Object.fromEntries(s.map((l) => [l, $n(l, e[l], r[l], n, i)]));
  }
  if (typeof e == "string" && typeof r == "string" && Le(e) && Le(r)) return pr(e, r)(n);
  try {
    return Pn(t, e, r, n);
  } catch {
    return a;
  }
}
function Ji(t) {
  if (typeof t != "object" || !t) return !1;
  let e = Object.getPrototypeOf(t);
  return e === Object.prototype || e === null;
}
var Vc = /^drop-shadow\(\s*([\d.+-]+)(?:px)?\s+([\d.+-]+)(?:px)?\s+([\d.+-]+)(?:px)?\s+rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)\s*\)$/;
function ta(t) {
  let e = t.match(Vc);
  return e ? { offsetX: parseFloat(e[1]), offsetY: parseFloat(e[2]), blur: parseFloat(e[3]), r: parseFloat(e[4]), g: parseFloat(e[5]), b: parseFloat(e[6]), a: parseFloat(e[7]) } : null;
}
function zc(t) {
  return `drop-shadow(${t.offsetX}px ${t.offsetY}px ${t.blur}px rgba(${t.r},${t.g},${t.b},${t.a}))`;
}
function Bc(t, e, r) {
  return zc({ offsetX: J(t.offsetX, e.offsetX, r), offsetY: J(t.offsetY, e.offsetY, r), blur: J(t.blur, e.blur, r), r: J(t.r, e.r, r), g: J(t.g, e.g, r), b: J(t.b, e.b, r), a: J(t.a, e.a, r) });
}
function Wc(t, e, r) {
  let n = ta(t), i = ta(e);
  return n && i ? Bc(n, i, r) : null;
}
function cr(t) {
  let e = X.Children.toArray(t.props.children), r = null, n = null, i = null;
  for (let a of e) if (X.isValidElement(a)) {
    if (a.type === "rect" && r === null) {
      let s = a.props;
      r = parseFloat(s.width), n = parseFloat(s.height);
    } else if (a.type === "text" && i === null) {
      let s = a.props;
      i = parseFloat(s.y);
    }
  }
  return r !== null && n !== null && !isNaN(r) && !isNaN(n) ? { rectWidth: r, rectHeight: n, textY: i !== null && !isNaN(i) ? i : null } : null;
}
function ea(t, e) {
  let r = t.props, n = X.Children.toArray(r.children), i = !1, a = !1;
  return lt(t, { children: n.map((s) => {
    if (X.isValidElement(s)) {
      if (!i && s.type === "rect") return i = !0, lt(s, { width: e.rectWidth, height: e.rectHeight });
      if (!a && s.type === "text" && e.textY !== null) return a = !0, lt(s, { y: e.textY });
    }
    return s;
  }) });
}
function Xc(t, e) {
  let r = e.props.transform || "", n = t.props.dragologyEmergeMode;
  if (n === "clone") {
    let i = cr(e), a = cr(t);
    return lt(i && a ? ea(t, i) : t, { transform: r || void 0 });
  }
  if (n !== "scale") {
    let i = cr(e), a = cr(t);
    if (i && a) return lt(ea(t, i), { transform: r || void 0, opacity: 0 });
  }
  return lt(t, { transform: r + " scale(0)", opacity: 0 });
}
function ra(t, e, r) {
  for (let [n, i] of e) if (!t.has(n)) {
    let a = i.element.props.dragologyEmergeFrom;
    if (a && typeof a == "string") {
      let s = r.get(a);
      s && t.set(n, { element: Xc(i.element, s.element), stackingPath: i.stackingPath });
    }
  }
}
function es(t, e, r, n) {
  let i = new Map(t.byId), a = new Map(e.byId);
  ra(i, e.byId, t.byId), ra(a, t.byId, e.byId);
  let s = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set([...i.keys(), ...a.keys()]);
  for (let u of o) {
    let f = i.get(u), h = a.get(u);
    if (f && h) s.set(u, { element: ts(f.element, h.element, r, n), stackingPath: (n === "b" ? h : f).stackingPath });
    else if (f) {
      let c = $r(f.element, 1 - r);
      c && s.set(u, { element: c, stackingPath: f.stackingPath });
    } else if (h) {
      let c = $r(h.element, r);
      c && s.set(u, { element: c, stackingPath: h.stackingPath });
    }
  }
  let l = null;
  if (t.descendents && e.descendents) {
    l = new Map(t.descendents);
    for (let [u, f] of e.descendents) {
      let h = l.get(u);
      if (h) for (let c of f) h.add(c);
      else l.set(u, new Set(f));
    }
  } else l = t.descendents ?? e.descendents;
  return { byId: s, descendents: l };
}
function Yc(t, e) {
  let r = [...e.entries()].filter(([, s]) => s > 1e-10).sort((s, o) => s[0] - o[0]);
  if (r.length === 0) return t[0];
  if (r.length === 1) return t[r[0][0]];
  let n = r.reduce((s, o) => o[1] > s[1] ? o : s)[0], i = t[r[0][0]], a = r[0][1];
  for (let s = 1; s < r.length; s++) {
    let [o, l] = r[s], u = l / (a + l);
    i = es(i, t[o], u, o === n ? "b" : "a"), a += l;
  }
  return i;
}
function Lr(t) {
  let e = [];
  function r(n) {
    n == null || n === !1 || (hc(n) ? n.forEach(r) : e.push(n));
  }
  return r(t), e;
}
function Vr(t, e) {
  return typeof t == "function" ? Vr(t(e), e) : t;
}
function fr(t, ...e) {
  let r = [];
  function n(i) {
    for (let a of Lr(i)) typeof a == "function" ? n(a(...e)) : r.push(a);
  }
  return n(t), r;
}
function rs(t) {
  return Z(ns)(t);
}
function Hc(t) {
  return t.opClass === ns ? t.args[0] : void 0;
}
var ns = class extends vt {
  constructor(e, r) {
    super(e);
    O(this, "name", "fixed");
    O(this, "position");
    O(this, "rendered");
    this.state = r, this.position = Wr(e, r);
  }
  get outputPreview() {
    return this.rendered ?? (this.rendered = Tt(this.ctx, this.state));
  }
  fuzzDropPositions() {
    return this.position ? [this.position] : [];
  }
  frame(e) {
    return { preview: () => this.outputPreview, dropState: this.state, gap: this.position ? e.pointer.dist(this.position) : 1 / 0, grabPos: this.position ?? void 0 };
  }
  treeView(e) {
    return S(Uc, { op: this, ...e });
  }
  overlayVis({ opacity: e }) {
    let r = this.position;
    if (!this.lastFrame || !r) return null;
    let { pointer: n } = this.lastFrame;
    return Y("g", { opacity: e, children: [S("circle", { cx: r.x, cy: r.y, r: 4, fill: "none", stroke: "magenta", strokeWidth: 1.5 }), S(Ze, { from: r, to: n, distance: n.dist(r) })] });
  }
};
function Uc({ op: t, path: e, active: r, color: n }) {
  let { tightFixed: i } = Pe(Rr), a = t.frames > 0;
  return i && a ? S(we, { outputPreview: t.outputPreview, active: r }) : S(ut, { label: "fixed", active: r, color: n, path: e, children: a && S(we, { outputPreview: t.outputPreview }) });
}
function qc(t, e) {
  let r = Lr(t).map(Br);
  return U(r.length > 0, "between requires at least one state"), Z(Gc)(r, e);
}
var Gc = class extends vt {
  constructor(e, r, n = {}) {
    super(e);
    O(this, "name", "between");
    O(this, "allFixed");
    O(this, "branches");
    O(this, "renderedStates", []);
    O(this, "delaunay");
    O(this, "projection");
    O(this, "weights", /* @__PURE__ */ new Map());
    O(this, "closestIndex", -1);
    O(this, "preview");
    this.specs = r, this.options = n;
    let i = r.map((a) => Hc(a));
    this.allFixed = i.every((a) => a !== void 0), this.allFixed ? (this.branches = [], this.renderedStates = i.map((a) => {
      U(a !== void 0);
      let s = Tt(e, a);
      return { state: a, layered: s, position: Sr(e, s) };
    }), this.delaunay = na(this.renderedStates, e)) : this.branches = r.map((a, s) => this.child(String(s), a));
  }
  frame(e) {
    this.allFixed || (this.renderedStates = this.branches.map((c) => {
      let p = c.run(e), y = p.preview(), g = Sr(this.ctx, y);
      return { state: p.dropState, layered: y, position: g };
    }), this.delaunay = na(this.renderedStates, this.ctx));
    let r = this.renderedStates, n = this.delaunay, i = n.projectOntoConvexHull(e.pointer), a = this.options.interpolation ?? "delaunay", s;
    a === "natural-neighbor" ? s = Zc(n, e, i) : a === "delaunay" ? s = is(i) : Dr(a);
    let { sharpness: o } = this.options;
    if (o !== void 0) {
      let c = 0;
      for (let [p, y] of s.entries()) {
        let g = y ** +o;
        s.set(p, g), c += g;
      }
      for (let [p, y] of s.entries()) s.set(p, y / c);
    }
    let l, u = () => l ?? (l = Yc(r.map((c) => c.layered), s)), f = Pa(r, (c) => c.position.dist(e.pointer));
    this.projection = i, this.weights = s, this.closestIndex = r.indexOf(f), this.preview = u;
    let h = V(0);
    for (let [c, p] of s.entries()) h = h.add(r[c].position.mul(p));
    return { preview: u, dropState: f.state, gap: i.dist, grabPos: h };
  }
  fuzzDropPositions() {
    return this.renderedStates.map((e) => e.position);
  }
  treeView(e) {
    let { path: r, active: n, color: i } = e, { interpolation: a } = this.options;
    return Y(ut, { label: `between [${this.specs.length}]${a ? ` (${a})` : ""}`, active: n, color: i, path: r, children: [this.preview && S(we, { outputPreview: this.preview() }), this.allFixed ? S(bn, { label: "states", children: S(zn, { renderedStates: this.renderedStates, closestIndex: this.closestIndex }) }) : this.branches.map((s) => s.treeView(e))] });
  }
  overlayVis({ active: e, opacity: r }) {
    let { projection: n, delaunay: i, lastFrame: a } = this;
    if (!n || !i || !a) return null;
    let { pointer: s } = a, o = s.dist(n.projectedPt);
    return Y("g", { children: [this.branches.map((l, u) => S(Ot, { op: l.op, active: !1 }, `sub-${u}`)), Y("g", { opacity: r, children: [i.triangles().map((l, u) => {
      let [f, h, c] = l;
      return S("path", { d: Ic("M", f.x, f.y, "L", h.x, h.y, "L", c.x, c.y, "Z"), stroke: "magenta", strokeWidth: 1, fill: "magenta", fillOpacity: 0.05 }, `tri-${u}`);
    }), this.renderedStates.map((l, u) => {
      let f = this.weights.get(u) ?? 0, h = Math.sqrt(f) * 8, c = u === this.closestIndex;
      return Y("g", { children: [S("circle", { ...l.position.cxy(), r: c ? 8 : 3, fill: "none", stroke: "magenta", strokeWidth: 1.5 }), e && h > 0.5 && S("circle", { ...l.position.cxy(), r: h, fill: "magenta" })] }, `pt-${u}`);
    }), S("circle", { ...n.projectedPt.cxy(), r: 5, stroke: "magenta", strokeWidth: 2, fill: "none" }), S(Ze, { from: s, to: n.projectedPt, distance: o })] })] });
  }
};
function na(t, e) {
  try {
    return new xc(t.map((r) => r.position));
  } catch (r) {
    if (r instanceof Ka) {
      let n = t[r.indexA], i = t[r.indexB];
      throw new xe("Coincident targets detected in d.between", Y(Tr, { children: [S("p", { style: { marginBottom: 8, fontStyle: "italic" }, children: "(Quick hint: are you reordering siblings without IDs?)" }), Y("p", { style: { marginBottom: 8 }, children: ["In order to use", " ", S("span", { style: { fontFamily: "monospace" }, children: "d.between" }), ", the dragged element must move to distinct locations in each rendered state."] }), Y("p", { style: { marginBottom: 8 }, children: ["Here, we are dragging element", " ", S("span", { style: { fontFamily: "monospace" }, children: e.draggedPath }), ". Two states put it at the point [", n.position.str(", "), "]:"] }), S("div", { style: { display: "flex", gap: 16, marginBottom: 8, overflow: "hidden" }, children: [n, i].map((a, s) => S(Kc, { layered: a.layered, draggedPath: e.draggedPath, state: a.state }, s)) }), S("p", { style: { marginBottom: 8 }, children: "(This is just the first pair of overlaps – other states may also cause overlap.)" }), S("p", { style: { marginBottom: 8 }, children: "If this isn't caused by reordering siblings without IDs, you may have a genuinely ambiguous drag behavior: multiple states bringing the dragged element to the same location. (Or maybe you just repeated a state?)" })] }));
    }
    throw Error(`Failed to create Delaunay triangulation: ${r}`);
  }
}
function Kc({ layered: t, draggedPath: e, state: r }) {
  let n = Ac(t), i = Ua(e, t), a = i ? Wn(i.element, i.accumulatedTransform) : ue, s = n.empty ? { minX: 0, minY: 0, maxX: 100, maxY: 100 } : n;
  return Y("div", { style: { flex: "1 1 0", minWidth: 0, overflow: "hidden", display: "flex", flexDirection: "column", gap: 8 }, children: [Y("svg", { viewBox: `${s.minX - 10} ${s.minY - 10} ${s.maxX - s.minX + 20} ${s.maxY - s.minY + 20}`, style: { width: "100%", maxWidth: 200, border: "1px solid #ccc", borderRadius: 4, background: "#fff" }, children: [Ke(t), !a.empty && S("rect", { x: a.minX - 3, y: a.minY - 3, width: a.maxX - a.minX + 6, height: a.maxY - a.minY + 6, fill: "none", stroke: "#ff0000", strokeWidth: 2, rx: 2 })] }), S("div", { style: { fontStyle: "italic" }, children: "from" }), S(_n, { kind: "state", value: r })] });
}
function Zc(t, e, r) {
  let n = _c(t, e.pointer, {});
  return n ? n.weights : is(r);
}
function is(t) {
  let e = /* @__PURE__ */ new Map();
  if (t.type === "vertex") e.set(t.ptIdx, 1);
  else if (t.type === "edge") e.set(t.ptIdx0, 1 - t.t), e.set(t.ptIdx1, t.t);
  else {
    let { l0: r, l1: n, l2: i } = t.barycentric;
    e.set(t.ptIdx0, r), e.set(t.ptIdx1, n), e.set(t.ptIdx2, i);
  }
  return e;
}
function Qc(t) {
  return Z(Jc)(this, t);
}
var Jc = class extends ft {
  constructor(e, r, n) {
    super(e, r);
    O(this, "name", "changeFrame");
    this.f = n;
  }
  frame(e) {
    return this.inner.run({ ...e, ...Vr(this.f, e) });
  }
};
function tf(t) {
  return Z(ef)(this, t);
}
var ef = class extends ft {
  constructor(e, r, n) {
    super(e, r);
    O(this, "name", "changeGap");
    this.f = n;
  }
  frame(e) {
    let r = this.inner.run(e);
    return { ...r, gap: this.f(r.gap) };
  }
};
function rf(t) {
  return Z(nf)(this, t);
}
var nf = class extends ft {
  constructor(e, r, n) {
    super(e, r);
    O(this, "name", "changeResult");
    this.f = n;
  }
  frame(e) {
    let r = this.inner.run(e), n = Vr(this.f, r), i = "preview" in n && !("grabPos" in n) ? void 0 : r.grabPos;
    return { ...r, grabPos: i, ...n };
  }
};
function af(t, e) {
  return Z(sf)(Lr(t).map(Br), e?.stickiness ?? 0, e?.lockPast);
}
var sf = class extends vt {
  constructor(e, r, n, i) {
    super(e);
    O(this, "name", "closest");
    O(this, "options");
    O(this, "lastBest", null);
    O(this, "lockedIndex", null);
    O(this, "ran", []);
    O(this, "home");
    if (this.stickiness = n, this.lockPast = i, this.options = r.map((a, s) => this.child(String(s), a)), i !== void 0) {
      let a = Wr(e, e.startState);
      U(a !== null, "closest: dragged element not found in start state"), this.home = a;
    }
  }
  isPastLock(e) {
    if (this.home === void 0 || this.lockPast === void 0) return !1;
    let r = e.grabPos ?? Un(this.ctx, e.preview());
    return r === null || r.dist(this.home) > this.lockPast;
  }
  frame(e) {
    if (this.options.length === 0) return { preview: () => Tt(this.ctx, this.ctx.startState), dropState: this.ctx.startState, gap: 1 / 0, activePath: "none" };
    let r = [], n = (a) => r[a] ?? (r[a] = this.options[a].run(e));
    this.lockedIndex !== null && !this.isPastLock(n(this.lockedIndex)) && (this.lockedIndex = null);
    let i = this.lockedIndex;
    return i === null && (i = Pa($a(this.options.length), (a) => n(a).gap - (a === this.lastBest ? this.stickiness : 0)), this.isPastLock(n(i)) && (this.lockedIndex = i)), this.lastBest = i, this.ran = this.options.map((a, s) => r[s] !== void 0), n(i);
  }
  treeView(e) {
    return S(ut, { label: "closest", path: e.path, children: S("div", { style: { display: "flex", flexDirection: "row", gap: 4, flexWrap: "wrap" }, children: this.options.map((r, n) => Y("div", { style: { display: "flex", flexDirection: "column", gap: 1 }, children: [S("div", { style: { fontSize: 9, color: "rgb(148, 163, 184)", paddingLeft: 2 }, children: n }), r.treeView(e)] }, n)) }) });
  }
  overlayVis({ active: e }) {
    return this.frames === 0 ? null : S("g", { children: this.options.map((r, n) => this.ran[n] && S(Ot, { op: r.op, active: e && n === this.lastBest }, n)) });
  }
};
function of(t) {
  return Z(lf)(t);
}
var lf = class extends vt {
  constructor(e, r) {
    super(e);
    O(this, "name", "custom");
    O(this, "behavior");
    this.fn = r, this.behavior = r(e);
  }
  frame(e) {
    return this.behavior(e);
  }
  treeView({ path: e }) {
    return S(ut, { label: "custom", path: e, children: "not supported yet" });
  }
  overlayVis() {
    return null;
  }
};
function uf(t, e, r) {
  return Z(hf)(t, e, r?.boundsState);
}
var hf = class extends vt {
  constructor(e, r, n, i) {
    super(e);
    O(this, "name", "dropTarget");
    O(this, "preview");
    O(this, "globalBounds");
    O(this, "inside", !1);
    this.targetId = r, this.state = n, this.boundsState = i, this.preview = Tt(e, n);
    let a = (i === void 0 ? this.preview : Tt(e, i)).byId.get(r);
    U(a !== void 0, `dropTarget: element with id "${r}" not found in rendered state`), this.globalBounds = Wn(a.element, a.element.props.transform ?? ""), U(!this.globalBounds.empty, `dropTarget: could not compute bounds for element "${r}"`);
  }
  frame(e) {
    return this.inside = Tc(e.pointer, this.globalBounds), { preview: () => this.preview, dropState: this.state, gap: this.inside ? 0 : 1 / 0 };
  }
  fuzzDropPositions() {
    return this.globalBounds.empty ? [] : [wn(this.globalBounds)];
  }
  treeView({ path: e, active: r, color: n }) {
    return S(ut, { label: `dropTarget → ${this.targetId}`, active: r, color: n, path: e, children: this.frames > 0 && S(zn, { renderedStates: [{ layered: this.preview, position: V(0) }] }) });
  }
  overlayVis({ opacity: e }) {
    let r = this.globalBounds;
    if (!this.lastFrame || r.empty) return null;
    let { pointer: n } = this.lastFrame;
    return Y("g", { opacity: e, children: [S("rect", { x: r.minX, y: r.minY, width: r.maxX - r.minX, height: r.maxY - r.minY, fill: "magenta", fillOpacity: 0.15, stroke: "magenta", strokeWidth: 1.5 }), S(Ze, { from: wn(r), to: n, distance: this.inside ? 0 : 1 / 0 })] });
  }
};
function cf(t) {
  return Z(ff)(this, t);
}
var ff = class extends ft {
  constructor(e, r, n) {
    super(e, r);
    O(this, "name", "during");
    O(this, "outputPreview");
    this.duringFn = n;
  }
  frame(e) {
    let r = this.inner.run(e), n = this.duringFn(r.dropState), i = Tt(this.ctx, n), a = Un(this.ctx, i);
    return this.outputPreview = i, { ...r, preview: () => i, dropState: n, gap: a ? e.pointer.dist(a) : 1 / 0, grabPos: a ?? void 0 };
  }
  treeView(e) {
    return Y(ut, { label: "during", path: e.path, children: [this.outputPreview && S(we, { outputPreview: this.outputPreview }), this.inner.treeView(e)] });
  }
};
function df(t) {
  return Z(pf)(this, t);
}
var pf = class extends ft {
  constructor(e, r, n) {
    super(e, r);
    O(this, "name", "onDrop");
    this.onDropState = n;
  }
  frame(e) {
    let r = this.inner.run(e);
    return { ...r, dropState: typeof this.onDropState == "function" ? this.onDropState(r.dropState) : this.onDropState };
  }
}, gf = class {
  reactTo(t, e) {
    return Z(yf)(t, e);
  }
}, yf = class extends vt {
  constructor(e, r, n) {
    super(e);
    O(this, "name", "reactTo");
    O(this, "currentValue", {});
    O(this, "changeCount", 0);
    O(this, "current");
    this.getter = r, this.callback = n;
  }
  frame(e) {
    let r = this.getter();
    return r !== this.currentValue && (this.currentValue = r, this.changeCount++, this.current = this.child(null, this.callback(r))), this.current.run(e);
  }
  treeView(e) {
    return S(ut, { label: "reactTo", path: e.path, children: this.current && Y(Tr, { children: [Y("div", { style: { fontSize: 9, color: "rgb(120, 113, 108)", background: "rgba(0,0,0,0.04)", borderRadius: 3, padding: "2px 4px", whiteSpace: "pre-wrap", wordBreak: "break-all" }, children: ["value: ", Ga(String(this.currentValue), 40), " · ", "changes: ", this.changeCount] }), this.current.treeView(e)] }) });
  }
  overlayVis({ active: e }) {
    return this.current ? S(Ot, { op: this.current.op, active: e }) : null;
  }
};
function Mr(t, e) {
  let r = t;
  for (let n of e) r = r[n];
  return r;
}
function _e(t, e, r) {
  let [n, ...i] = e;
  if (i.length === 0) {
    if (Array.isArray(t)) {
      let a = t.slice();
      return a[n] = r, a;
    }
    return ia(t, n, r);
  }
  if (Array.isArray(t)) {
    let a = t.slice();
    return a[n] = _e(t[n], i, r), a;
  }
  return ia(t, n, _e(t[n], i, r));
}
function ia(t, e, r) {
  let n = Object.assign(Object.create(Object.getPrototypeOf(t)), t);
  return n[e] = r, n;
}
var mf = class {
  substate(t, e, r) {
    let n = r(new os(Mr(t, e)));
    return Z(bf)(t, e, n);
  }
}, bf = class extends vt {
  constructor(e, r, n, i) {
    super(e);
    O(this, "name", "substate");
    O(this, "inner");
    this.state = r, this.path = n;
    let a = (s) => e.draggable(tr({ state: _e(r, n, s.state), draggedId: s.draggedId, setState: s.setState, isTracking: s.isTracking }));
    this.inner = this.child(null, i, { ...e, draggable: a });
  }
  frame(e) {
    let r = this.inner.run(e);
    return { ...r, dropState: _e(this.state, this.path, r.dropState) };
  }
  treeView(e) {
    return S(ut, { label: `substate [${this.path.join(", ")}]`, path: e.path, children: this.inner.treeView(e) });
  }
  overlayVis({ active: e }) {
    return S(Ot, { op: this.inner.op, active: e });
  }
};
function Hn(t, ...e) {
  return e.reduce((r, n) => n(r), t);
}
function Qe(t, e, r, n) {
  return Hn(t(tr({ state: e, draggedId: r, setState: () => {
    throw Error("This function should not have been called");
  }, isTracking: n })), Ba);
}
function zr(t, e, r, n) {
  return jr(Qe(t, e, r, n));
}
function xf(t, e, r) {
  return Z(wf)(t, e, r && Br(r));
}
function vf(t, e, r, n) {
  if (!n && r) {
    let i = Oe(Qe(t.draggable, e, r, !0), (s) => s.props.id === r);
    U(!!i, `switchToStateAndFollow: element "${r}" not found`);
    let a = er(i.element);
    U(!!a, `switchToStateAndFollow: no followSpec and no dragology on "${r}"`), n = a();
  }
  return U(!!n, "switchToStateAndFollow: no followSpec"), n;
}
var wf = class extends ft {
  constructor(e, r, n, i) {
    super(e, vf(e, r, n, i), { ...e, startState: r, draggedId: n, draggedPath: n + "/" });
    O(this, "name", "switchToStateAndFollow");
    this.state = r, this.draggedId = n;
  }
  frame(e) {
    return this.inner.run(e);
  }
  treeView(e) {
    return S(ut, { label: `switchToStateAndFollow → ${this.draggedId}`, color: e.color, path: e.path, children: this.inner.treeView(e) });
  }
}, _f = { arr: function(t) {
  return new Float64Array(t);
}, arr2: function(t, e) {
  for (var r = 0, n = Array(t); r < t; ) n[r] = this.arr(e), r++;
  return n;
}, arraycopy: function(t, e, r, n, i) {
  for (var a = 0; a < i; ) r[a + n] = t[a + e], a++;
}, lastNumberOfEvaluations: 0, GetLastNumberOfEvaluations: function() {
  return this.lastNumberOfEvaluations;
}, Normal: 0, MaxIterationsReached: 1, DivergingRoundingErrors: 2, FindMinimum: function(t, e, r, n, i, a, s, o, l) {
  var u = r + 2, f, h = this.arr(e + 1), c = this, p;
  return this.lastNumberOfEvaluations = 0, l && console.log("Experimental feature 'testForRoundingErrors' is activated."), h[0] = 0, this.arraycopy(n, 0, h, 1, e), p = function(y, g, v, b) {
    var x = c.arr(y), P, m;
    return c.lastNumberOfEvaluations += 1, c.arraycopy(v, 1, x, 0, y), P = c.arr(g), m = t(y, g, x, P), c.arraycopy(P, 0, b, 1, g), m;
  }, f = this.cobylb(p, e, r, u, h, i, a, s, o, l), this.arraycopy(h, 1, n, 0, e), f;
}, cobylb: function(t, e, r, n, i, a, s, o, l, u) {
  var f = -1, h = 0.25, c = 2.1, p = 0.5, y = 1.1, g = 0, v = 0, b, x = e + 1, P = r + 1, m = a, d = 0, R = !1, z = !1, L = 0, $ = 0, D = 0, C = this.arr(1 + n), I = this.arr2(1 + e, 1 + x), N = this.arr2(1 + e, 1 + e), w = this.arr2(1 + n, 1 + x), E = this.arr2(1 + e, 1 + P), M = this.arr(1 + e), k = this.arr(1 + e), B = this.arr(1 + e), j = this.arr(1 + e), H = this.arr(1 + e), A, T, _, tt, F, dt, K, W, st, ht, ot, G, Q, rt, gt, Et, zt, Ct, Bt, wt, Wt, Xt, Te, Yt, Rt, Ie, Ht, nt, ct, yt, ie = !0;
  for (o >= 2 && console.log("The initial value of RHO is " + m + " and PARMU is set to zero."), K = 0, F = 1 / m, A = 1; A <= e; ++A) I[A][x] = i[A], I[A][A] = m, N[A][A] = F;
  W = x, st = !1;
  t: do {
    if (K >= l && K > 0) {
      f = this.MaxIterationsReached;
      break t;
    }
    for (++K, g = t(e, r, i, C), v = 0, _ = 1; _ <= r; ++_) v = Math.max(v, -C[_]);
    if ((K === o - 1 || o === 3) && this.PrintIterationResult(K, g, v, i, e, o), C[P] = g, C[n] = v, ht = !0, !st) {
      for (ht = !1, A = 1; A <= n; ++A) w[A][W] = C[A];
      if (K <= x) {
        if (W <= e) if (w[P][x] <= g) i[W] = I[W][x];
        else {
          for (I[W][x] = i[W], _ = 1; _ <= n; ++_) w[_][W] = w[_][x], w[_][x] = C[_];
          for (_ = 1; _ <= W; ++_) {
            for (I[W][_] = -m, F = 0, A = _; A <= W; ++A) F -= N[A][_];
            N[W][_] = F;
          }
        }
        if (K <= e) {
          W = K, i[W] += m;
          continue t;
        }
      }
      st = !0;
    }
    e: do {
      r: do {
        if (!ht) {
          for (ot = w[P][x] + d * w[n][x], G = x, T = 1; T <= e; ++T) F = w[P][T] + d * w[n][T], F < ot ? (G = T, ot = F) : F === ot && d === 0 && w[n][T] < w[n][G] && (G = T);
          if (G <= e) {
            for (A = 1; A <= n; ++A) F = w[A][x], w[A][x] = w[A][G], w[A][G] = F;
            for (A = 1; A <= e; ++A) {
              for (F = I[A][G], I[A][G] = 0, I[A][x] += F, dt = 0, _ = 1; _ <= e; ++_) I[A][_] -= F, dt -= N[_][A];
              N[G][A] = dt;
            }
          }
          if (Q = 0, u) for (A = 1; A <= e; ++A) for (T = 1; T <= e; ++T) F = this.DOT_PRODUCT_ROW_COL(N, A, I, T, 1, e) - (A === T ? 1 : 0), Q = Math.max(Q, Math.abs(F));
          if (Q > 0.1) {
            f = this.DivergingRoundingErrors;
            break t;
          }
          for (_ = 1; _ <= P; ++_) {
            for (C[_] = -w[_][x], T = 1; T <= e; ++T) H[T] = w[_][T] + C[_];
            for (A = 1; A <= e; ++A) E[A][_] = (_ === P ? -1 : 1) * this.DOT_PRODUCT_ROW_COL(H, -1, N, A, 1, e);
          }
          for (R = !0, L = h * m, rt = c * m, T = 1; T <= e; ++T) {
            for (gt = 0, Et = 0, _ = 1; _ <= e; ++_) gt += N[T][_] * N[T][_], Et += I[_][T] * I[_][T];
            M[T] = 1 / Math.sqrt(gt), k[T] = Math.sqrt(Et), (M[T] < L || k[T] > rt) && (R = !1);
          }
          if (!st && !R) {
            for (W = 0, F = rt, T = 1; T <= e; ++T) k[T] > F && (W = T, F = k[T]);
            if (W === 0) for (T = 1; T <= e; ++T) M[T] < F && (W = T, F = M[T]);
            for (F = p * m * M[W], _ = 1; _ <= e; ++_) j[_] = F * N[W][_];
            for (zt = 0, Ct = 0, b = 0, _ = 1; _ <= P; ++_) b = this.DOT_PRODUCT_ROW_COL(j, -1, E, _, 1, e), _ < P && (F = w[_][x], zt = Math.max(zt, -b - F), Ct = Math.max(Ct, b - F));
            for (Bt = d * (zt - Ct) > 2 * b ? -1 : 1, F = 0, A = 1; A <= e; ++A) j[A] = Bt * j[A], I[A][W] = j[A], F += N[W][A] * j[A];
            for (_ = 1; _ <= e; ++_) N[W][_] /= F;
            for (T = 1; T <= e; ++T) {
              if (T !== W) for (F = this.DOT_PRODUCT_ROW_COL(N, T, j, -1, 1, e), _ = 1; _ <= e; ++_) N[T][_] -= F * N[W][_];
              i[T] = I[T][x] + j[T];
            }
            continue t;
          }
          if (z = this.trstlp(e, r, E, C, m, j), !z) {
            for (F = 0, _ = 1; _ <= e; ++_) F += j[_] * j[_];
            if (F < 0.25 * m * m) {
              st = !0;
              break r;
            }
          }
          for (b = 0, wt = 0, C[P] = 0, _ = 1; _ <= P; ++_) b = C[_] - this.DOT_PRODUCT_ROW_COL(j, -1, E, _, 1, e), _ < P && (wt = Math.max(wt, b));
          if ($ = w[n][x] - wt, Wt = $ > 0 ? b / $ : 0, d < 1.5 * Wt) {
            for (d = 2 * Wt, o >= 2 && console.log("Increase in PARMU to " + d), Xt = w[P][x] + d * w[n][x], T = 1; T <= e; ++T) if (F = w[P][T] + d * w[n][T], F < Xt || F === Xt && d === 0 && w[n][T] < w[n][x]) continue e;
          }
          for (D = d * $ - b, _ = 1; _ <= e; ++_) i[_] = I[_][x] + j[_];
          st = !0;
          continue t;
        }
        for (ht = !1, Te = w[P][x] + d * w[n][x], Yt = g + d * v, Rt = Te - Yt, d === 0 && g === w[P][x] && (D = $, Rt = w[n][x] - v), Ie = Rt <= 0 ? 1 : 0, W = 0, T = 1; T <= e; ++T) F = Math.abs(this.DOT_PRODUCT_ROW_COL(N, T, j, -1, 1, e)), F > Ie && (W = T, Ie = F), B[T] = F * M[T];
        for (Ht = y * m, tt = 0, T = 1; T <= e; ++T) if (B[T] >= L || B[T] >= M[T]) {
          if (F = k[T], Rt > 0) {
            for (F = 0, _ = 1; _ <= e; ++_) F += (j[_] - I[_][T]) ** 2;
            F = Math.sqrt(F);
          }
          F > Ht && (tt = T, Ht = F);
        }
        if (tt > 0 && (W = tt), W !== 0) {
          for (F = 0, A = 1; A <= e; ++A) I[A][W] = j[A], F += N[W][A] * j[A];
          for (_ = 1; _ <= e; ++_) N[W][_] /= F;
          for (T = 1; T <= e; ++T) if (T !== W) for (F = this.DOT_PRODUCT_ROW_COL(N, T, j, -1, 1, e), _ = 1; _ <= e; ++_) N[T][_] -= F * N[W][_];
          for (_ = 1; _ <= n; ++_) w[_][W] = C[_];
          if (Rt > 0 && Rt >= 0.1 * D) continue e;
        }
      } while (!ie);
      if (!R) {
        st = !1;
        continue e;
      }
      if (m <= s) {
        f = this.Normal;
        break t;
      }
      if (nt = 0, ct = 0, m *= 0.5, m <= 1.5 * s && (m = s), d > 0) {
        for (yt = 0, _ = 1; _ <= P; ++_) {
          for (nt = w[_][x], ct = nt, A = 1; A <= e; ++A) nt = Math.min(nt, w[_][A]), ct = Math.max(ct, w[_][A]);
          _ <= r && nt < 0.5 * ct && (F = Math.max(ct, 0) - nt, yt = yt <= 0 ? F : Math.min(yt, F));
        }
        yt === 0 ? d = 0 : ct - nt < d * yt && (d = (ct - nt) / yt);
      }
      o >= 2 && console.log("Reduction in RHO to " + m + "  and PARMU = " + d), o === 2 && this.PrintIterationResult(K, w[P][x], w[n][x], this.COL(I, x), e, o);
    } while (ie);
  } while (ie);
  switch (f) {
    case this.Normal:
      if (o >= 1 && console.log("%nNormal return from subroutine COBYLA%n"), z) return o >= 1 && this.PrintIterationResult(K, g, v, i, e, o), f;
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
}, trstlp: function(t, e, r, n, i, a) {
  var s = 0, o = 0, l = 0, u = this.arr2(1 + t, 1 + t), f = this.arr(2 + e), h = this.arr(2 + e), c = this.arr(1 + t), p = this.arr(1 + t), y = this.arr(2 + e), g = this.arr(2 + e), v = e, b = 0, x, P, m, d, R, z, L, $, D, C, I, N, w, E, M, k, B, j, H, A, T, _, tt, F, dt, K, W, st, ht, ot, G, Q, rt, gt, Et = !0;
  for (m = 1; m <= t; ++m) u[m][m] = 1, a[m] = 0;
  if (x = 0, P = 0, e >= 1) {
    for (d = 1; d <= e; ++d) n[d] > P && (P = n[d], x = d);
    for (d = 1; d <= e; ++d) g[d] = d, h[d] = P - n[d];
  }
  R = !0;
  do
    t: do {
      (!R || R && P === 0) && (v = e + 1, x = v, g[v] = v, h[v] = 0), R = !1, z = 0, L = 0, $ = 0, D = 0;
      e: do {
        if (C = v === e ? P : -this.DOT_PRODUCT_ROW_COL(a, -1, r, v, 1, t), L === 0 || C < z ? (z = C, o = b, L = 3) : b > o ? (o = b, L = 3) : --L, L === 0) break t;
        if (I = 0, x <= b) {
          if (x < b) {
            N = g[x], w = h[x], d = x;
            do {
              for (M = d + 1, k = g[M], B = this.DOT_PRODUCT(this.PART(this.COL(u, d), 1, t), this.PART(this.COL(r, k), 1, t)), s = Math.hypot(B, f[M]), j = f[M] / s, H = B / s, f[M] = j * f[d], f[d] = s, m = 1; m <= t; ++m) s = j * u[m][M] + H * u[m][d], u[m][M] = j * u[m][d] - H * u[m][M], u[m][d] = s;
              g[d] = k, h[d] = h[M], d = M;
            } while (d < b);
            g[d] = N, h[d] = w;
          }
          if (--b, v > e) for (s = 1 / f[b], d = 1; d <= t; ++d) c[d] = s * u[d][b];
          else for (s = this.DOT_PRODUCT_ROW_COL(c, -1, u, b + 1, 1, t), d = 1; d <= t; ++d) c[d] -= s * u[d][b + 1];
        } else {
          for (k = g[x], d = 1; d <= t; ++d) p[d] = r[d][k];
          for (A = 0, d = t; d > b; ) {
            for (B = 0, T = 0, m = 1; m <= t; ++m) s = u[m][d] * p[m], B += s, T += Math.abs(s);
            if (_ = T + 0.1 * Math.abs(B), tt = T + 0.2 * Math.abs(B), (T >= _ || _ >= tt) && (B = 0), A === 0) A = B;
            else for (M = d + 1, s = Math.hypot(B, A), j = B / s, H = A / s, A = s, m = 1; m <= t; ++m) s = j * u[m][d] + H * u[m][M], u[m][M] = j * u[m][M] - H * u[m][d], u[m][d] = s;
            --d;
          }
          if (A === 0) {
            I = -1, d = b;
            do {
              for (F = 0, dt = 0, m = 1; m <= t; ++m) s = u[m][d] * p[m], F += s, dt += Math.abs(s);
              if (_ = dt + 0.1 * Math.abs(F), tt = dt + 0.2 * Math.abs(F), dt < _ && _ < tt) {
                if (s = F / f[d], s > 0 && g[d] <= e && (gt = h[d] / s, (I < 0 || gt < I) && (I = gt)), d >= 2) for (K = g[d], m = 1; m <= t; ++m) p[m] -= s * r[m][K];
                y[d] = s;
              } else y[d] = 0;
            } while (--d > 0);
            if (I < 0) break t;
            for (d = 1; d <= b; ++d) h[d] = Math.max(0, h[d] - I * y[d]);
            if (x < b) {
              N = g[x], w = h[x], d = x;
              do {
                for (M = d + 1, K = g[M], B = this.DOT_PRODUCT(this.PART(this.COL(u, d), 1, t), this.PART(this.COL(r, K), 1, t)), s = Math.hypot(B, f[M]), j = f[M] / s, H = B / s, f[M] = j * f[d], f[d] = s, m = 1; m <= t; ++m) s = j * u[m][M] + H * u[m][d], u[m][M] = j * u[m][d] - H * u[m][M], u[m][d] = s;
                g[d] = K, h[d] = h[M], d = M;
              } while (d < b);
              g[d] = N, h[d] = w;
            }
            if (s = this.DOT_PRODUCT(this.PART(this.COL(u, b), 1, t), this.PART(this.COL(r, k), 1, t)), s === 0) break t;
            f[b] = s, h[x] = 0, h[b] = I;
          } else ++b, f[b] = A, h[x] = h[b], h[b] = 0;
          if (g[x] = g[b], g[b] = k, v > e && k !== v) {
            for (d = b - 1, B = this.DOT_PRODUCT(this.PART(this.COL(u, d), 1, t), this.PART(this.COL(r, k), 1, t)), s = Math.hypot(B, f[b]), j = f[b] / s, H = B / s, f[b] = j * f[d], f[d] = s, m = 1; m <= t; ++m) s = j * u[m][b] + H * u[m][d], u[m][b] = j * u[m][d] - H * u[m][b], u[m][d] = s;
            g[b] = g[d], g[d] = k, s = h[d], h[d] = h[b], h[b] = s;
          }
          if (v > e) for (s = 1 / f[b], d = 1; d <= t; ++d) c[d] = s * u[d][b];
          else for (k = g[b], s = (this.DOT_PRODUCT_ROW_COL(c, -1, r, k, 1, t) - 1) / f[b], d = 1; d <= t; ++d) c[d] -= s * u[d][b];
        }
        for (W = i * i, ht = 0, st = 0, m = 1; m <= t; ++m) Math.abs(a[m]) >= 1e-6 * i && (W -= a[m] * a[m]), ht += a[m] * c[m], st += c[m] * c[m];
        if (W <= 0) break t;
        if (s = Math.sqrt(st * W), Math.abs(ht) >= 1e-6 * s && (s = Math.sqrt(st * W + ht * ht)), D = W / (s + ht), $ = D, v === e) {
          if (_ = $ + 0.1 * P, tt = $ + 0.2 * P, $ >= _ || _ >= tt) break e;
          $ = Math.min($, P);
        }
        for (d = 1; d <= t; ++d) p[d] = a[d] + $ * c[d];
        if (v === e) for (l = P, P = 0, d = 1; d <= b; ++d) k = g[d], s = n[k] - this.DOT_PRODUCT_ROW_COL(p, -1, r, k, 1, t), P = Math.max(P, s);
        d = b;
        do {
          for (ot = 0, G = 0, m = 1; m <= t; ++m) s = u[m][d] * p[m], ot += s, G += Math.abs(s);
          if (_ = G + 0.1 * Math.abs(ot), tt = G + 0.2 * Math.abs(ot), (G >= _ || _ >= tt) && (ot = 0), y[d] = ot / f[d], d >= 2) for (k = g[d], m = 1; m <= t; ++m) p[m] -= y[d] * r[m][k];
        } while (d-- >= 2);
        for (v > e && (y[b] = Math.max(0, y[b])), d = 1; d <= t; ++d) p[d] = a[d] + $ * c[d];
        if (v > b) for (Q = b + 1, d = Q; d <= v; ++d) {
          for (k = g[d], E = P - n[k], rt = P + Math.abs(n[k]), m = 1; m <= t; ++m) s = r[m][k] * p[m], E += s, rt += Math.abs(s);
          _ = rt + 0.1 * Math.abs(E), tt = rt + 0.2 * Math.abs(E), (rt >= _ || _ >= tt) && (E = 0), y[d] = E;
        }
        for (I = 1, x = 0, d = 1; d <= v; ++d) y[d] < 0 && (s = h[d] / (h[d] - y[d]), s < I && (I = s, x = d));
        for (s = 1 - I, d = 1; d <= t; ++d) a[d] = s * a[d] + I * p[d];
        for (d = 1; d <= v; ++d) h[d] = Math.max(0, s * h[d] + I * y[d]);
        v === e && (P = l + I * (P - l));
      } while (x > 0);
      if ($ === D) return !0;
    } while (Et);
  while (v === e);
  return !1;
}, PrintIterationResult: function(t, e, r, n, i, a) {
  a > 1 && console.log("NFVALS = " + t + "  F = " + e + "  MAXCV = " + r), a > 1 && console.log("X = " + this.PART(n, 1, i));
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
}, DOT_PRODUCT_ROW_COL: function(t, e, r, n, i, a) {
  var s, o = 0;
  if (e === -1) for (s = i; s <= a; ++s) o += t[s] * r[s][n];
  else if (n === -1) for (s = i; s <= a; ++s) o += t[e][s] * r[s];
  else for (s = i; s <= a; ++s) o += t[e][s] * r[s][n];
  return o;
} };
function Pf(t, e, r, n, i, a, s, o) {
  return _f.FindMinimum(t, e, r, n, i, a, s, o);
}
var $f = class {
  constructor(t, e) {
    O(this, "curParams");
    O(this, "numConstraints");
    O(this, "scales");
    O(this, "exploredValues", []);
    O(this, "exploredPositions", []);
    this.curParams = t.slice(), this.numConstraints = e;
  }
  get params() {
    return this.curParams;
  }
  estimateScales(t, e) {
    let r = e.length, n = t(e), i = 1e-3, a = [];
    for (let s = 0; s < r; s++) {
      let o = e.slice();
      o[s] += i;
      let l = t(o).dist(n) / i;
      a[s] = Math.max(l, 0.01);
    }
    return a;
  }
  minimize(t, e, r) {
    let n = this.curParams.length;
    this.scales || (this.scales = this.estimateScales(e, this.curParams));
    let i = this.scales, a = (f) => f.map((h, c) => h * i[c]), s = (f) => f.map((h, c) => h / i[c]), o = a(this.curParams);
    o.every((f) => f === 0) && (o[0] = 1e-4);
    let l = Math.max(1, e(s(o)).dist(t)), u = r?.constraints;
    return this.exploredValues = [], this.exploredPositions = [], Pf((f, h, c, p) => {
      let y = [];
      for (let x = 0; x < n; x++) y[x] = c[x];
      let g = s(y);
      this.exploredValues.push(g.slice());
      let v = e(g);
      this.exploredPositions.push(v);
      let b = v.dist2(t);
      if (u) {
        let x = u(g);
        for (let P = 0; P < x.length; P++) p[P] = -x[P];
      }
      return b;
    }, n, this.numConstraints, o, l, 1e-3, 0, 200), this.curParams = s(o), this.curParams;
  }
}, Mf = class {
  vary(t, e, r) {
    let n = Lr(e).map(Zf);
    return Z(as)(n.map((i) => Mr(t, i)), (i) => {
      let a = t;
      for (let s = 0; s < n.length; s++) a = _e(a, n[s], i[s]);
      return a;
    }, r ?? {}, n);
  }
};
function Sf(t, e, r) {
  return Z(as)(t, e, r ?? {}, void 0);
}
var Of = 0.05, Tf = 0.3, as = class extends vt {
  constructor(e, r, n, i, a) {
    super(e);
    O(this, "name", "vary");
    O(this, "minimizer");
    O(this, "constraintsFn");
    O(this, "rendered");
    O(this, "currentParams", []);
    O(this, "exploredPositions");
    O(this, "varyVisLastSwitch", performance.now() / 1e3);
    O(this, "varyVisSampledParams", null);
    this.initParams = r, this.stateFromParams = n, this.options = i, this.paramPaths = a;
    let { constraint: s, pin: o } = i, l = n(r), u = o ? fr(o, l) : void 0, f = o ? [s, (h) => fr(o, h).map((c, p) => [c - u[p], u[p] - c])] : s;
    this.minimizer = new $f(r, f ? fr(f, l).length : 0), this.constraintsFn = f ? (h) => fr(f, n(h)) : void 0;
  }
  frame(e) {
    let { ctx: r, minimizer: n } = this;
    n.minimize(e.pointer, (u) => Wr(r, this.stateFromParams(u)) ?? V(1 / 0, 1 / 0), { constraints: this.constraintsFn });
    let i = n.params;
    if (r.debug.varyVisualizer && n.exploredValues.length > 0) {
      let u = performance.now() / 1e3;
      if (u - this.varyVisLastSwitch >= Of) {
        this.varyVisLastSwitch = u;
        let f = Math.floor(Math.random() * n.exploredValues.length * Tf);
        this.varyVisSampledParams = n.exploredValues[f];
      }
      i = this.varyVisSampledParams ?? n.exploredValues[0] ?? n.params;
    }
    let a = this.stateFromParams(i), s = Tt(r, a), o = Sr(r, s), l = o.dist(e.pointer);
    if (r.debug.varyVisualizer) {
      let u = n.exploredValues.map((f) => Tt(r, this.stateFromParams(f)));
      s = Pr(s, jr(S("g", { id: "vary-cloud", dragologyZIndex: "/-100", dragologyOpaque: !0, children: u.map((f, h) => S("g", { opacity: 0.15, children: Ke(f) }, `explored-${h}`)) })));
    }
    return this.rendered = { layered: s, position: o }, this.currentParams = i.slice(), this.exploredPositions = r.debug.varyVisualizer ? n.exploredPositions.slice() : void 0, { preview: () => s, dropState: a, gap: l, grabPos: o };
  }
  fuzzDropPositions() {
    return this.rendered ? [this.rendered.position] : [];
  }
  treeView({ path: e, active: r, color: n }) {
    let i = this.paramPaths ? `vary [${this.paramPaths.map((s) => s.join(".")).join(", ")}]` : `varyFunc [${this.initParams.length} params]`, a = this.options.constraint ? Ga(this.options.constraint.toString(), 60) : null;
    return Y(ut, { label: i, active: r, color: n, path: e, children: [a && Y("div", { style: { fontSize: 9, color: "rgb(120, 113, 108)", background: "rgba(0,0,0,0.04)", borderRadius: 3, padding: "2px 4px", whiteSpace: "pre-wrap", wordBreak: "break-all" }, children: ["constraint: ", a] }), this.rendered && S(zn, { renderedStates: [this.rendered] })] });
  }
  overlayVis({ opacity: e }) {
    if (!this.rendered || !this.lastFrame) return null;
    let { pointer: r } = this.lastFrame, n = this.rendered.position, i = r.dist(n);
    return Y("g", { opacity: e, children: [this.exploredPositions?.map((a, s) => S("line", { ...a.xy1(), ...r.xy2(), stroke: "magenta", strokeWidth: 0.5, opacity: 0.5 }, s)), this.exploredPositions?.map((a, s) => S("circle", { ...a.cxy(), r: 2, fill: "magenta", opacity: 0.5 }, `c${s}`)), S("circle", { ...n.cxy(), r: 5, fill: "magenta" }), S(Ze, { from: n, to: r, distance: i })] });
  }
};
function If(t, e = {}) {
  let r = e.gap ?? 50, n = e.gapIn ?? r, i = e.gapOut ?? r;
  return U(n <= i, `whenFar: gapIn (${n}) must be <= gapOut (${i}), otherwise the behavior oscillates`), Z(Af)(this, Br(t), n, i);
}
var Af = class extends vt {
  constructor(e, r, n, i, a) {
    super(e);
    O(this, "name", "whenFar");
    O(this, "foreground");
    O(this, "background");
    O(this, "inForeground", !0);
    this.gapIn = i, this.gapOut = a, this.foreground = this.child("fg", r), this.background = this.child("bg", n);
  }
  frame(e) {
    let r = this.foreground.run(e), n = this.inForeground ? this.gapOut : this.gapIn;
    return this.inForeground = r.gap <= n, this.inForeground ? r : this.background.run(e);
  }
  treeView(e) {
    return S(ut, { label: `whenFar (${this.gapIn === this.gapOut ? `gap=${this.gapIn}` : `gapIn=${this.gapIn} gapOut=${this.gapOut}`})`, path: e.path, children: Y("div", { style: { display: "flex", flexDirection: "row", gap: 4 }, children: [S(bn, { label: "fg", children: this.foreground.treeView(e) }), S(bn, { label: "bg", children: this.background.treeView(e) })] }) });
  }
  overlayVis({ active: e }) {
    if (this.frames === 0) return null;
    let r = S(Ot, { op: this.foreground.op, active: e && this.inForeground });
    return this.inForeground ? r : Y("g", { children: [r, S(Ot, { op: this.background.op, active: e })] });
  }
};
function kf({ easing: t, duration: e }, r) {
  return (typeof t == "function" ? t : t === "cubic-out" ? Qh : t === "elastic-out" ? Jh : Dr(t))(r / e);
}
function Je(t) {
  if (t === !1) return !1;
  if (typeof t == "object") return t;
  let e = { easing: "cubic-out", duration: 200 };
  return typeof t == "string" || typeof t == "function" ? e.easing = t : typeof t == "number" ? e.duration = t : t === !0 || t === void 0 || Dr(t), e;
}
function Ef(t) {
  return Z(Cf)(this, Je(t));
}
var Cf = class extends ft {
  constructor(e, r, n) {
    super(e, r);
    O(this, "name", "withBranchTransition");
    this.transition = n;
  }
  frame(e) {
    return { ...this.inner.run(e), activePathTransition: this.transition };
  }
  treeView(e) {
    return this.wrapperView(e, qa(this.transition));
  }
};
function Rf({ transition: t = !0, ...e } = {}) {
  return Z(Df)(this, { ...e, transition: Je(t) });
}
var Df = class extends ft {
  constructor(e, r, n) {
    super(e, r);
    O(this, "name", "withChaining");
    this.chaining = n;
  }
  frame(e) {
    let r = this.inner.run(e);
    return { ...r, chainNow: r.chainNow ?? this.chaining };
  }
};
function Ff(t) {
  return Z(jf)(this, Je(t));
}
var jf = class extends ft {
  constructor(e, r, n) {
    super(e, r);
    O(this, "name", "withDropTransition");
    this.transition = n;
  }
  frame(e) {
    return { ...this.inner.run(e), dropTransition: this.transition };
  }
  treeView(e) {
    return this.wrapperView(e, qa(this.transition));
  }
};
function Nf({ ghost: t, tether: e } = {}) {
  return Z(Lf)(this, t === !0 ? { opacity: 0.5 } : t, e);
}
var Lf = class extends ft {
  constructor(e, r, n, i) {
    super(e, r);
    O(this, "name", "withFloating");
    O(this, "draggedId");
    O(this, "cachedFloatAnchored", null);
    O(this, "computed");
    this.ghost = n, this.tether = i, U(e.draggedId !== null, "Floating drags require the dragged element to have an id"), this.draggedId = e.draggedId;
  }
  get outputPreview() {
    return this.computed?.().preview;
  }
  get elementPos() {
    return this.computed?.().elementPos;
  }
  frame(e) {
    let { ctx: r, draggedId: n } = this, i = this.inner.run(e), a = null, s = () => {
      if (a) return a;
      let o = i.preview(), l = o.byId.get(n), u = null, f, h;
      if (l) {
        u = re(l.element.props.transform, r.anchorPos);
        let { remaining: y, extracted: g } = Hi(o, n);
        f = an(g, Ft(u.mul(-1))), this.cachedFloatAnchored = f, h = this.ghost === void 0 ? y : Pr(y, Ui(Ya(g, "ghost-"), this.ghost));
      } else {
        if (this.cachedFloatAnchored === null) {
          let y = zr(r.draggable, r.startState, n, !1), { extracted: g } = Hi(y, n), v = y.byId.get(n);
          this.cachedFloatAnchored = an(g, Ft((v ? re(v.element.props.transform, r.anchorPos) : V(0)).mul(-1)));
        }
        f = this.cachedFloatAnchored, h = o;
      }
      let c = e.pointer;
      if (u && this.tether) {
        let y = e.pointer.sub(u), g = y.len();
        if (g > 1e-6) {
          let v = this.tether(g);
          c = u.add(y.mul(v / g));
        }
      }
      let p = an(f, Ft(c));
      return a = { preview: Pr(h, Hn(p, (y) => Ui(y, { dragologyTransition: !1 }), (y) => Ha(y, 1e6))), elementPos: u }, a;
    };
    return this.computed = s, { ...i, preview: () => s().preview, dropTransition: void 0, activePathTransition: void 0, chainNow: void 0, grabPos: this.tether ? void 0 : e.pointer };
  }
  treeView(e) {
    let r = this.outputPreview;
    return Y(ut, { label: "withFloating", color: e.color, path: e.path, children: [r && S(we, { outputPreview: r }), this.inner.treeView(e)] });
  }
  overlayVis({ active: e, opacity: r }) {
    if (!this.lastFrame) return null;
    let { pointer: n } = this.lastFrame, i = this.elementPos;
    return Y("g", { children: [S(Ot, { op: this.inner.op, active: e }), i && Y("g", { opacity: r, children: [S("circle", { cx: i.x, cy: i.y, r: 5, fill: "magenta" }), S(Ze, { from: i, to: n, distance: n.dist(i) })] })] });
  }
};
function Vf(t) {
  return Z(zf)(this, t);
}
var zf = class extends ft {
  constructor(e, r, n) {
    super(e, r, { ...e, ...Vr(n, e) });
    O(this, "name", "withInitContext");
    this.f = n;
  }
  frame(e) {
    return this.inner.run(e);
  }
}, Bf = 2e6, Wf = 0;
function Xf(t) {
  return Z(Yf)(this, t);
}
var Yf = class extends ft {
  constructor(e, r, n) {
    super(e, r);
    O(this, "name", "withOverlay");
    O(this, "layer");
    this.layer = Ha(Ya(jr(S("g", { children: n })), `overlay-${Wf++}-`), Bf);
  }
  frame(e) {
    let r = this.inner.run(e);
    return { ...r, preview: () => Pr(r.preview(), this.layer) };
  }
};
function Hf(t, { transition: e = !1, chain: r = !1 } = {}) {
  return Z(Uf)(this, t, Je(e), r);
}
var Uf = class extends ft {
  constructor(e, r, n, i, a) {
    super(e, r);
    O(this, "name", "withSnapRadius");
    O(this, "dropRendered", je((e) => Tt(this.ctx, e)));
    O(this, "dropGrabPos", je((e) => La(Wr(this.ctx, e))));
    O(this, "snapped", !1);
    O(this, "segment");
    O(this, "preview");
    this.radius = n, this.transition = i, this.chain = a;
  }
  get outputPreview() {
    return this.preview?.();
  }
  frame(e) {
    let r = this.inner.run(e), n = r.grabPos ?? Sr(this.ctx, r.preview()), i = this.dropGrabPos(r.dropState), a = i.dist2(n) <= this.radius ** 2, s = a ? () => this.dropRendered(r.dropState) : r.preview;
    return this.snapped = a, this.preview = s, this.segment = this.transition ? a ? "snapped" : "unsnapped" : void 0, { ...r, preview: s, grabPos: a ? i : n, activePath: Bn(this.segment, r.activePath), activePathTransition: this.transition || void 0, chainNow: this.chain && a ? { transition: this.transition } : void 0 };
  }
  treeView(e) {
    let { snapped: r, transition: n } = this, i = [n && "transition", this.chain && "chain"].filter(Boolean), a = `withSnapRadius (${this.radius}${i.length ? `, ${i.join(", ")}` : ""})`;
    return n && (a += r ? " [snapped]" : " [not snapped]"), Y(ut, { label: a, path: e.path, children: [this.outputPreview && S(we, { outputPreview: this.outputPreview }), this.inner.treeView({ ...e, childPath: this.segment ? `${e.childPath}${this.segment}/` : e.childPath })] });
  }
}, ss = class {
  get onDrop() {
    return df;
  }
  get whenFar() {
    return If;
  }
  get withSnapRadius() {
    return Hf;
  }
  get withDropTransition() {
    return Ff;
  }
  get withOverlay() {
    return Xf;
  }
  get withBranchTransition() {
    return Ef;
  }
  get changeFrame() {
    return Qc;
  }
  get changeResult() {
    return rf;
  }
  get changeGap() {
    return tf;
  }
  get withFloating() {
    return Nf;
  }
  get withChaining() {
    return Rf;
  }
  get during() {
    return cf;
  }
  get withInitContext() {
    return Vf;
  }
  with(t) {
    return t(this);
  }
};
function Z(t) {
  return (...e) => qf({ opClass: t, args: e });
}
function qf(t) {
  return Object.assign(Object.create(ss.prototype), t);
}
function Gf(t) {
  return typeof t == "object" && !!t && Object.getPrototypeOf(t) === ss.prototype;
}
function Br(t) {
  return Gf(t) ? t : rs(t);
}
var os = class {
  constructor(t) {
    O(this, "state");
    this.state = t;
  }
  get fixed() {
    return rs;
  }
  get between() {
    return qc;
  }
  get closest() {
    return af;
  }
  get vary() {
    return Mf.prototype.vary;
  }
  get varyFunc() {
    return Sf;
  }
  get custom() {
    return of;
  }
  get dropTarget() {
    return uf;
  }
  get substate() {
    return mf.prototype.substate;
  }
  get switchToStateAndFollow() {
    return xf;
  }
  get reactTo() {
    return gf.prototype.reactTo;
  }
}, Kf = Symbol("VaryPath");
function Zf(t) {
  return t[Kf];
}
function tr(t) {
  let e = { ...t, d: new os(t.state), embed(r, n) {
    return Qf(r, e, n);
  } };
  return e;
}
var ls = "dragologyOnDrag";
function er(t) {
  return t.props[ls] || void 0;
}
function Qf(t, e, r) {
  return Fr(t(tr({ state: Mr(e.state, r), draggedId: e.draggedId, setState: (n, i) => {
    e.setState((a) => {
      let s = Mr(a, r);
      return _e(a, r, typeof n == "function" ? n(s) : n);
    }, i);
  }, isTracking: e.isTracking })), (n) => {
    let i = er(n);
    if (i) return { [ls]: () => {
      let a = i();
      return e.d.substate(e.state, r, () => a);
    } };
  });
}
function Jf(t, e) {
  return Za(new t.opClass(e, ...t.args));
}
function Tt(t, e) {
  return zr(t.draggable, e, t.draggedId, !1);
}
function Wr(t, e) {
  if (t.draggedId) {
    let i = Oe(t.draggable(tr({ state: e, draggedId: t.draggedId, setState: () => {
      throw Error("This function should not have been called");
    }, isTracking: !0 })), (a) => a.props.id === t.draggedId);
    return i ? re(i.accumulatedTransform, t.anchorPos) : null;
  }
  let r = Qe(t.draggable, e, t.draggedId, !0), n = Ge(t.draggedPath, r);
  return n ? re(n.accumulatedTransform, t.anchorPos) : null;
}
function Un(t, e) {
  let r = Ua(t.draggedPath, e);
  return r ? re(r.accumulatedTransform, t.anchorPos) : null;
}
function Sr(t, e) {
  return La(Un(t, e));
}
var td = "http://www.w3.org/2000/svg", ed = class {
  constructor() {
    O(this, "containers", /* @__PURE__ */ new Map());
    O(this, "refCallbacks", /* @__PURE__ */ new Map());
    O(this, "retained", /* @__PURE__ */ new Map());
  }
  frame(t, e) {
    let r = /* @__PURE__ */ new Map(), n = new Map([...t.byId].map(([s, o]) => [s, { ...o, element: this.walk(o.element, !1, void 0, r) }])), i = e ? new Map([...this.retained, ...r]) : r;
    this.retained = i;
    for (let s of [...this.containers.keys()]) i.has(s) || (this.containers.delete(s), this.refCallbacks.delete(s));
    let a = [...i.values()].map((s) => S("g", { onPointerDown: s.grab, children: gs(rd(s.element), this.container(s)) }, s.key));
    return { layered: { ...t, byId: n }, portals: a };
  }
  container(t) {
    let e = this.containers.get(t.key);
    if (e && e.html === t.html) return e.el;
    let r;
    return t.html ? (r = document.createElement("div"), r.style.display = "contents") : r = document.createElementNS(td, "g"), this.containers.set(t.key, { el: r, html: t.html }), r;
  }
  refCallback(t) {
    let e = this.refCallbacks.get(t);
    return e || (e = (r) => {
      let n = this.containers.get(t)?.el;
      r && n && n.parentNode !== r && r.appendChild(n);
    }, this.refCallbacks.set(t, e)), e;
  }
  walk(t, e, r, n) {
    if (Vt(t)) {
      let c = qe(t);
      return c === void 0 ? t : (n.set(c, { key: c, element: t, html: e, grab: r }), e ? qt("div", { key: t.key, ref: this.refCallback(c), style: { display: "contents" } }) : qt("g", { key: t.key, ref: this.refCallback(c) }));
    }
    let { children: i, onPointerDown: a, dragologyOnDrag: s } = t.props;
    if (i === void 0 || !Ue(t)) return t;
    let o = s && a ? a : r, l = t.type === "foreignObject", u = !1, f = (c) => {
      if (Array.isArray(c)) {
        let y = c.map(f);
        return y.some((g, v) => g !== c[v]) ? y : c;
      }
      if (!oe(c)) return c;
      let p = this.walk(c, l, o, n);
      return p !== c && (u = !0), p;
    }, h = f(i);
    return u ? lt(t, void 0, h) : t;
  }
};
function rd(t) {
  let e = {};
  for (let [r, n] of Object.entries(t.props)) r === "data-path" || r.startsWith("dragology") || (e[r] = n);
  return qt(t.type, e);
}
function nd(t) {
  let e = _t(t);
  e.current = t, dr(() => {
    let r, n = () => {
      e.current(), r = requestAnimationFrame(n);
    };
    return r = requestAnimationFrame(n), () => {
      cancelAnimationFrame(r);
    };
  }, []);
}
function id() {
  let [t, e] = Or(null);
  if (t) throw t;
  return We((r) => {
    throw e(r), r;
  }, []);
}
function ad() {
  let t = id();
  return We(function(e) {
    return (...r) => {
      try {
        return e(...r);
      } catch (n) {
        return t(n);
      }
    };
  }, [t]);
}
function sd(t) {
  let [e, r] = Or(t), n = _t(e);
  return n.current = e, [e, We((i) => {
    let a = typeof i == "function" ? i(n.current) : i;
    n.current = a, r(a);
  }, []), n];
}
function Be(t, e) {
  let r = Je(t);
  return r === !1 ? null : { layered: e(), time: performance.now(), transition: r };
}
function od({ state: t, initialState: e, ...r }) {
  return U(!(t !== void 0 && e !== void 0), "DraggableRenderer: provide either 'state' or 'initialState', not both"), t === void 0 ? S(ld, { ...r, initialState: e }) : S(us, { ...r, state: t });
}
function ld({ initialState: t, onDropState: e, ...r }) {
  let [n, i] = Or(t), a = We((s) => {
    i(s), e?.(s);
  }, [e]);
  return S(us, { ...r, state: n, onDropState: a });
}
function us({ draggable: t, state: e, width: r, height: n, onDropState: i, onDragState: a, onDragStatus: s, showDebugOverlay: o, showVaryVisualizer: l, dragThreshold: u = 2, simulateDrag: f }) {
  let h = ad(), [c, p, y] = sd({ type: "idle", state: e, springOrigin: null });
  if (c.type === "idle" && c.state !== e) {
    let w = zr(t, c.state, null, !1), E = pe(c.springOrigin, w);
    p({ ...c, state: e, springOrigin: Be(!0, () => E) });
  }
  dr(() => {
    s?.(c);
  }, [c, s]);
  let g = _t(void 0);
  fs(() => {
    let w = c.type === "dragging" ? c.result.dropState : void 0;
    w !== void 0 && w !== g.current && a?.(w), g.current = w;
  }, [c, a]);
  let v = _t(void 0), b = _t(void 0), x = () => b.current ?? v.current, P = _t(i);
  P.current = i;
  let m = _t(a);
  m.current = a;
  let d = _t(!1), [R, z] = Or(null), L = We((w) => {
    U(!!R);
    let E = R.getBoundingClientRect(), M = R.width.baseVal.value === 0 ? 1 : E.width / R.width.baseVal.value, k = V((w.clientX - E.left) / M, (w.clientY - E.top) / M);
    return v.current = k, k;
  }, [R]);
  if (nd(h(() => {
    let w = ud(y.current, x(), performance.now());
    w && p(w);
  })), f && c.type === "idle" && !c.pendingDrag) {
    let w = f.id, E = f.offset ? V(f.offset) : V(0, 0), M = Oe(Qe(t, e, w, !0), (k) => k.props.id === w);
    if (M) {
      let k = Xn(M.element);
      if (!k.empty) {
        let B = wn(k), j = re(M.accumulatedTransform, B).add(E);
        b.current = j;
        let H = er(M.element)?.(), A = qe(M.element);
        H && A && p(qn(H, { draggable: t, draggedPath: A, draggedId: w, anchorPos: B, startState: e, debug: { varyVisualizer: !1 } }, e, { pointer: j }, null));
      }
    }
  }
  dr(() => {
    document.body.style.cursor = c.type === "dragging" ? "grabbing" : "default";
  }, [c.type]);
  let $ = !f && (c.type === "dragging" || c.type === "idle" && !!c.pendingDrag);
  dr(() => {
    if (!$) return;
    let w = h((M) => {
      let k = y.current;
      if (k.type === "idle" && k.pendingDrag) {
        let { pendingDrag: B } = k;
        V(M.clientX, M.clientY).sub(B.startClientPos).len2() > B.threshold * B.threshold && (L(M), p(B.status));
      } else L(M);
    }), E = h((M) => {
      let k = y.current;
      if (k.type === "idle" && k.pendingDrag) {
        p({ type: "idle", state: k.state, springOrigin: k.springOrigin });
        return;
      }
      if (k.type !== "dragging") return;
      d.current = !0;
      let B = { pointer: L(M) }, j = k.behavior(B), H = j.dropState;
      p({ type: "idle", state: H, springOrigin: Be(j.dropTransition, () => pe(k.springOrigin, j.preview())) }), P.current?.(H), m.current?.(H);
    });
    return document.addEventListener("pointermove", w), document.addEventListener("pointerup", E), () => {
      document.removeEventListener("pointermove", w), document.removeEventListener("pointerup", E);
    };
  }, [h, y, $, p, L]);
  let D = Qn(() => ({ draggable: t, catchToRenderError: h, setPointerFromEvent: L, setStatus: p, onDropState: i, dragThreshold: u, showVaryVisualizer: l ?? !1, showDebugOverlay: o ?? !1 }), [h, t, u, i, p, L, l, o]), C = _t(null);
  C.current ?? (C.current = new ed());
  let I = Qn(() => {
    let { layered: w, portals: E } = C.current.frame(c.type === "idle" ? dd(c, D) : pe(c.springOrigin, c.result.preview()), c.type === "dragging");
    return { layers: Ke(w), portals: E };
  }, [c, D]), N = x();
  return Y("svg", { ref: z, width: r, height: n, xmlns: "http://www.w3.org/2000/svg", style: { overflow: "visible", userSelect: "none", touchAction: "none", ...f ? { pointerEvents: "none" } : {} }, onPointerDownCapture: () => {
    d.current = !1;
  }, onClickCapture: (w) => {
    d.current && (d.current = !1, w.stopPropagation(), w.preventDefault());
  }, children: [I.layers, I.portals, c.type === "dragging" && o && N && S(tc, { children: S(Ot, { op: c.result.op }) }), f && b.current && S("circle", { cx: b.current.x, cy: b.current.y, r: 4, fill: "red", stroke: "white", strokeWidth: 1.5, opacity: 0.8 })] });
}
function pe(t, e) {
  if (!t) return e;
  let r = performance.now() - t.time, n = kf(t.transition, r), i = es(e, t.layered, 1 - n, "a");
  for (let [a, s] of i.byId.entries()) if (s.element.props.dragologyTransition === !1) {
    let o = e.byId.get(a);
    o && i.byId.set(a, o);
  }
  return i;
}
function ud(t, e, r) {
  if (t.type === "dragging") {
    if (!e) return null;
    let n = { pointer: e }, i = t.behavior(n), a = hd(t, n, i);
    if (a !== t) return a;
    let s = t.springOrigin;
    return i.activePath !== t.result.activePath && (s = Be(i.activePathTransition, () => pe(s, t.result.preview()))), s && r - s.time >= s.transition?.duration && (s = null), { ...t, result: i, springOrigin: s };
  }
  return t.type === "idle" && t.springOrigin ? r - t.springOrigin.time >= t.springOrigin.transition.duration ? { ...t, springOrigin: null } : { ...t } : null;
}
function hd(t, e, r) {
  if (!r.chainNow || zu(r.dropState, t.startState)) return t;
  let n = r.dropState, i = r.chainNow.draggedId ?? t.behaviorCtx.draggedId, a = Qe(t.behaviorCtx.draggable, n, i, !0), s = i ? Oe(a, (c) => c.props.id === i) : Ge(t.behaviorCtx.draggedPath, a);
  U(!!s, `Chained drag must have a valid dragged element; couldn't find element with id ${i}`);
  let o = r.chainNow.followSpec ?? er(s.element)?.();
  if (!o) return t;
  let l = r.chainNow.transition, u = Be(l, () => pe(t.springOrigin, t.result.preview())), f = qe(s.element);
  U(!!f, "Chained element must have a path");
  let h = t.behaviorCtx.anchorPos;
  return qn(o, { ...t.behaviorCtx, draggedPath: f, draggedId: i, anchorPos: h, startState: n }, n, e, u);
}
function qn(t, e, r, n, i) {
  let a = Jf(t, e);
  return { type: "dragging", startState: r, behavior: a, specForDropZoneVis: t, behaviorCtx: e, result: a(n), springOrigin: i };
}
function cd(t, e) {
  let r = Ge(e, t);
  return r ? [...r.ancestors, r.element].some((n) => n.props.onClick || n.props.onDoubleClick) : !1;
}
function fd(t, e, r) {
  let n = Ba(t);
  return Hn(n, (i) => Fr(i, (a) => {
    let s = er(a);
    if (s) return U(!a.props.onPointerDown, "Elements with dragology cannot have onPointerDown (it is overwritten)"), { style: { cursor: "grab", ...a.props.style || {} }, onPointerDown: r.catchToRenderError((o) => {
      o.stopPropagation();
      let l = r.setPointerFromEvent(o.nativeEvent), u = s(), f = a.props.id ?? null, h = qe(a);
      U(!!h, "Dragged element must have a path");
      let c = Ge(h, n);
      U(!!c, "Dragged element must be findable by path");
      let p = ac(c.accumulatedTransform, l), y = qn(u, { draggable: r.draggable, draggedPath: h, draggedId: f, anchorPos: p, startState: e, debug: { varyVisualizer: r.showVaryVisualizer } }, e, { pointer: l }, null), g = cd(n, h);
      r.dragThreshold <= 0 || !g ? r.setStatus(y) : r.setStatus({ type: "idle", state: e, springOrigin: null, pendingDrag: { startClientPos: V(o.clientX, o.clientY), threshold: r.dragThreshold, status: y } });
    }) };
  }), jr);
}
function dd(t, e) {
  let r = fd(e.draggable(tr({ state: t.state, draggedId: null, setState: e.catchToRenderError((n, { transition: i } = {}) => {
    let a = typeof n == "function" ? n(t.state) : n, s = { type: "idle", state: a, springOrigin: Be(i, () => zr(e.draggable, t.state, null, !1)) };
    e.setStatus(s), e.onDropState?.(a);
  }), isTracking: !1 })), t.state, e);
  return pe(t.springOrigin, r);
}
function aa(t) {
  return t.match(/.{1,23}(?:\s+|$)|.{1,23}/gu)?.map((e) => e.trim()) ?? [t];
}
const pd = ({ state: t, d: e, draggedId: r }) => {
  const { width: n, row: i, height: a, top: s } = ys, { points: o } = sa(t), l = !!t.lanes[0].station;
  return /* @__PURE__ */ X.createElement("g", { fontFamily: "system-ui, sans-serif", fill: "#18302d" }, t.lanes.flatMap((u, f) => (u.station?.next ?? []).map((h) => {
    const c = o[f], p = o[t.lanes.findIndex((d) => d.id === h)], y = n / 2 + 8, g = (s - 12) / 2 + 4, v = p.x - c.x, b = p.y - c.y, x = Math.min(v ? n / 2 / Math.abs(v) : 1 / 0, b ? (g - 4) / Math.abs(b) : 1 / 0), P = p.x + y - v * x, m = p.y + g - b * x;
    return /* @__PURE__ */ X.createElement("g", { dragologyKey: u.id + "-" + h }, /* @__PURE__ */ X.createElement("line", { x1: c.x + y, y1: c.y + g, x2: P, y2: m, stroke: "#506b61", strokeWidth: 3 }), /* @__PURE__ */ X.createElement("path", { d: "M0 0l-11 -5v10z", fill: "#315044", transform: `translate(${P} ${m}) rotate(${Math.atan2(b, v) * 180 / Math.PI})` }));
  })), t.lanes.map((u, f) => {
    const h = t.cards.filter((c) => c.laneId === u.id).length;
    return /* @__PURE__ */ X.createElement("g", { id: "heading-" + u.id, transform: Ft(8 + o[f].x, 4 + o[f].y) }, /* @__PURE__ */ X.createElement("rect", { width: n, height: s - 12, rx: l ? 2 : 9, fill: ms[f] }), aa(u.label).map((c, p) => /* @__PURE__ */ X.createElement("text", { dragologyKey: "line-" + p, transform: Ft(12, 16 + p * 15), fontSize: l ? 17 : 13, fontWeight: "bold" }, c)), /* @__PURE__ */ X.createElement("text", { transform: Ft(12, s - 23), fontSize: 12 }, u.station ? h ? "● Occupied" : "Open stop" : u.capacity ? `${h} of ${u.capacity} slots` : `${h} ${h === 1 ? "choice" : "choices"}`));
  }), t.cards.map((u) => {
    const f = t.lanes.findIndex((y) => y.id === u.laneId), h = t.cards.filter((y) => y.laneId === u.laneId).indexOf(u), c = sn(t, u), p = "choice-" + u.id;
    return /* @__PURE__ */ X.createElement(
      "g",
      {
        id: p,
        transform: Ft(8 + o[f].x, o[f].y + s + h * i),
        dragologyZIndex: r === p ? "/1" : !1,
        dragologyOnDrag: c.length > 1 ? () => e.closest(c.map((y) => on(t, u.id, y.id))).withFloating() : void 0
      },
      /* @__PURE__ */ X.createElement("rect", { width: n, height: a, fill: l ? "#ffe381" : "#fffdf6", stroke: "#78857d", rx: l ? 1 : 8 }),
      aa(u.label).map((y, g) => /* @__PURE__ */ X.createElement("text", { dragologyKey: "line-" + g, transform: Ft(12, 17 + g * 16), fontSize: 14 }, y))
    );
  }));
};
function vd({ value: t, onChange: e }) {
  const { width: r, height: n } = sa(t);
  return /* @__PURE__ */ X.createElement("section", { "aria-label": t.title }, /* @__PURE__ */ X.createElement("div", { style: { maxWidth: "100%", overflowX: "auto" } }, /* @__PURE__ */ X.createElement(
    od,
    {
      draggable: pd,
      state: t,
      onDropState: e,
      width: r,
      height: n
    }
  )), t.lanes[0].station && /* @__PURE__ */ X.createElement("div", { className: "workshop-outcomes", "aria-live": "polite" }, t.cards.map((i) => {
    const a = t.lanes.find((s) => s.id === i.laneId);
    return /* @__PURE__ */ X.createElement("div", { key: i.id }, /* @__PURE__ */ X.createElement("p", null, /* @__PURE__ */ X.createElement("strong", null, i.label, " · ", a.label), /* @__PURE__ */ X.createElement("br", null), a.station.outcome), sn(t, i).filter((s) => s.id !== i.laneId).map((s) => /* @__PURE__ */ X.createElement("button", { key: s.id, type: "button", onClick: () => e(on(t, i.id, s.id)) }, i.label, " → ", s.label)));
  })), /* @__PURE__ */ X.createElement("details", null, /* @__PURE__ */ X.createElement("summary", null, "Move a card by name"), t.cards.map((i) => /* @__PURE__ */ X.createElement("label", { key: i.id, style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBlock: 6 } }, i.label, /* @__PURE__ */ X.createElement(
    "select",
    {
      "aria-label": "Move " + i.label,
      value: i.laneId,
      onChange: (a) => e(on(t, i.id, a.currentTarget.value))
    },
    sn(t, i).map((a) => /* @__PURE__ */ X.createElement("option", { key: a.id, value: a.id }, a.label))
  )))));
}
export {
  vd as WorkshopBoard,
  sn as availableLanes,
  Pd as industrialWorkshop,
  ms as laneColors,
  on as moveWorkshopCard,
  $d as nightTransfer,
  Md as validateWorkshop,
  ys as workshopLayout,
  sa as workshopPositions,
  Sd as workshopToSlate
};
