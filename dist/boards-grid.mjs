var gt = Object.defineProperty;
var wt = (n, e, t) => e in n ? gt(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var P = (n, e, t) => wt(n, typeof e != "symbol" ? e + "" : e, t);
import { partNotes as mt, tint as K, w as pt, inside as J, registerBoardKit as yt } from "./boards.mjs";
import { createBoardLayer as Mt, applyWorkshopEdits as S, appearanceEditsBetween as bt, layerInk as X, H as xt } from "./workshop-model.mjs";
import { GRID_TRAY as b, defaultSpan as Q, spanOf as O, tileName as At, cellAt as tt, cellSize as H, printSize as kt, pageSize as W, gridPages as zt, gridCardText as Et, cellBox as et, gridCaption as $t } from "./workshop-grid.mjs";
import { gridNeeds as we, gridPrintProblems as me } from "./workshop-grid.mjs";
var E = /* @__PURE__ */ ((n) => (n[n.Border = -1] = "Border", n[n.Data = 0] = "Data", n[n.Function = 1] = "Function", n[n.Position = 2] = "Position", n[n.Timing = 3] = "Timing", n[n.Alignment = 4] = "Alignment", n))(E || {});
const Pt = [0, 1], nt = [1, 0], it = [2, 3], ot = [3, 2], St = {
  L: Pt,
  M: nt,
  Q: it,
  H: ot
}, vt = /^\d*$/, It = /^[A-Z0-9 $%*+./:-]*$/, R = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:", Y = 1, U = 40, G = 3, _t = 3, I = 40, Bt = 10, st = [
  // Version: (note that index 0 is for padding, and is set to an illegal value)
  // 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40    Error correction level
  [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  // Low
  [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
  // Medium
  [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  // Quartile
  [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
  // High
], rt = [
  // Version: (note that index 0 is for padding, and is set to an illegal value)
  // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40    Error correction level
  [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
  // Low
  [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
  // Medium
  [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
  // Quartile
  [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81]
  // High
];
class Ct {
  /* -- Constructor (low level) and fields -- */
  // Creates a new QR Code with the given version number,
  // error correction level, data codeword bytes, and mask number.
  // This is a low-level API that most users should not use directly.
  // A mid-level API is the encodeSegments() function.
  constructor(e, t, i, o) {
    /* -- Fields -- */
    // The width and height of this QR Code, measured in modules, between
    // 21 and 177 (inclusive). This is equal to version * 4 + 17.
    P(this, "size");
    // The index of the mask pattern used in this QR Code, which is between 0 and 7 (inclusive).
    // Even if a QR Code is created with automatic masking requested (mask = -1),
    // the resulting object still has a mask value between 0 and 7.
    P(this, "mask");
    // The modules of this QR Code (false = light, true = dark).
    // Immutable after constructor finishes. Accessed through getModule().
    P(this, "modules", []);
    P(this, "types", []);
    if (this.version = e, this.ecc = t, e < Y || e > U)
      throw new RangeError("Version value out of range");
    if (o < -1 || o > 7)
      throw new RangeError("Mask value out of range");
    this.size = e * 4 + 17;
    const s = Array.from({ length: this.size }).fill(!1);
    for (let l = 0; l < this.size; l++)
      this.modules.push(s.slice()), this.types.push(s.map(() => 0));
    this.drawFunctionPatterns();
    const r = this.addEccAndInterleave(i);
    if (this.drawCodewords(r), o === -1) {
      let l = 1e9;
      for (let a = 0; a < 8; a++) {
        this.applyMask(a), this.drawFormatBits(a);
        const c = this.getPenaltyScore();
        c < l && (o = a, l = c), this.applyMask(a);
      }
    }
    this.mask = o, this.applyMask(o), this.drawFormatBits(o);
  }
  /* -- Accessor methods -- */
  // Returns the color of the module (pixel) at the given coordinates, which is false
  // for light or true for dark. The top left corner has the coordinates (x=0, y=0).
  // If the given coordinates are out of bounds, then false (light) is returned.
  getModule(e, t) {
    return e >= 0 && e < this.size && t >= 0 && t < this.size && this.modules[t][e];
  }
  /* -- Private helper methods for constructor: Drawing function modules -- */
  // Reads this object's version field, and draws and marks all function modules.
  drawFunctionPatterns() {
    for (let i = 0; i < this.size; i++)
      this.setFunctionModule(6, i, i % 2 === 0, E.Timing), this.setFunctionModule(i, 6, i % 2 === 0, E.Timing);
    this.drawFinderPattern(3, 3), this.drawFinderPattern(this.size - 4, 3), this.drawFinderPattern(3, this.size - 4);
    const e = this.getAlignmentPatternPositions(), t = e.length;
    for (let i = 0; i < t; i++)
      for (let o = 0; o < t; o++)
        i === 0 && o === 0 || i === 0 && o === t - 1 || i === t - 1 && o === 0 || this.drawAlignmentPattern(e[i], e[o]);
    this.drawFormatBits(0), this.drawVersion();
  }
  // Draws two copies of the format bits (with its own error correction code)
  // based on the given mask and this object's error correction level field.
  drawFormatBits(e) {
    const t = this.ecc[1] << 3 | e;
    let i = t;
    for (let s = 0; s < 10; s++)
      i = i << 1 ^ (i >>> 9) * 1335;
    const o = (t << 10 | i) ^ 21522;
    for (let s = 0; s <= 5; s++)
      this.setFunctionModule(8, s, A(o, s));
    this.setFunctionModule(8, 7, A(o, 6)), this.setFunctionModule(8, 8, A(o, 7)), this.setFunctionModule(7, 8, A(o, 8));
    for (let s = 9; s < 15; s++)
      this.setFunctionModule(14 - s, 8, A(o, s));
    for (let s = 0; s < 8; s++)
      this.setFunctionModule(this.size - 1 - s, 8, A(o, s));
    for (let s = 8; s < 15; s++)
      this.setFunctionModule(8, this.size - 15 + s, A(o, s));
    this.setFunctionModule(8, this.size - 8, !0);
  }
  // Draws two copies of the version bits (with its own error correction code),
  // based on this object's version field, iff 7 <= version <= 40.
  drawVersion() {
    if (this.version < 7)
      return;
    let e = this.version;
    for (let i = 0; i < 12; i++)
      e = e << 1 ^ (e >>> 11) * 7973;
    const t = this.version << 12 | e;
    for (let i = 0; i < 18; i++) {
      const o = A(t, i), s = this.size - 11 + i % 3, r = Math.floor(i / 3);
      this.setFunctionModule(s, r, o), this.setFunctionModule(r, s, o);
    }
  }
  // Draws a 9*9 finder pattern including the border separator,
  // with the center module at (x, y). Modules can be out of bounds.
  drawFinderPattern(e, t) {
    for (let i = -4; i <= 4; i++)
      for (let o = -4; o <= 4; o++) {
        const s = Math.max(Math.abs(o), Math.abs(i)), r = e + o, l = t + i;
        r >= 0 && r < this.size && l >= 0 && l < this.size && this.setFunctionModule(r, l, s !== 2 && s !== 4, E.Position);
      }
  }
  // Draws a 5*5 alignment pattern, with the center module
  // at (x, y). All modules must be in bounds.
  drawAlignmentPattern(e, t) {
    for (let i = -2; i <= 2; i++)
      for (let o = -2; o <= 2; o++)
        this.setFunctionModule(
          e + o,
          t + i,
          Math.max(Math.abs(o), Math.abs(i)) !== 1,
          E.Alignment
        );
  }
  // Sets the color of a module and marks it as a function module.
  // Only used by the constructor. Coordinates must be in bounds.
  setFunctionModule(e, t, i, o = E.Function) {
    this.modules[t][e] = i, this.types[t][e] = o;
  }
  /* -- Private helper methods for constructor: Codewords and masking -- */
  // Returns a new byte string representing the given data with the appropriate error correction
  // codewords appended to it, based on this object's version and error correction level.
  addEccAndInterleave(e) {
    const t = this.version, i = this.ecc;
    if (e.length !== B(t, i))
      throw new RangeError("Invalid argument");
    const o = rt[i[0]][t], s = st[i[0]][t], r = Math.floor(L(t) / 8), l = o - r % o, a = Math.floor(r / o), c = [], g = Ht(s);
    for (let d = 0, m = 0; d < o; d++) {
      const w = e.slice(m, m + a - s + (d < l ? 0 : 1));
      m += w.length;
      const h = Yt(w, g);
      d < l && w.push(0), c.push(w.concat(h));
    }
    const u = [];
    for (let d = 0; d < c[0].length; d++)
      c.forEach((m, w) => {
        (d !== a - s || w >= l) && u.push(m[d]);
      });
    return u;
  }
  // Draws the given sequence of 8-bit codewords (data and error correction) onto the entire
  // data area of this QR Code. Function modules need to be marked off before this is called.
  drawCodewords(e) {
    if (e.length !== Math.floor(L(this.version) / 8))
      throw new RangeError("Invalid argument");
    let t = 0;
    for (let i = this.size - 1; i >= 1; i -= 2) {
      i === 6 && (i = 5);
      for (let o = 0; o < this.size; o++)
        for (let s = 0; s < 2; s++) {
          const r = i - s, a = (i + 1 & 2) === 0 ? this.size - 1 - o : o;
          !this.types[a][r] && t < e.length * 8 && (this.modules[a][r] = A(e[t >>> 3], 7 - (t & 7)), t++);
        }
    }
  }
  // XORs the codeword modules in this QR Code with the given mask pattern.
  // The function modules must be marked and the codeword bits must be drawn
  // before masking. Due to the arithmetic of XOR, calling applyMask() with
  // the same mask value a second time will undo the mask. A final well-formed
  // QR Code needs exactly one (not zero, two, etc.) mask applied.
  applyMask(e) {
    if (e < 0 || e > 7)
      throw new RangeError("Mask value out of range");
    for (let t = 0; t < this.size; t++)
      for (let i = 0; i < this.size; i++) {
        let o;
        switch (e) {
          case 0:
            o = (i + t) % 2 === 0;
            break;
          case 1:
            o = t % 2 === 0;
            break;
          case 2:
            o = i % 3 === 0;
            break;
          case 3:
            o = (i + t) % 3 === 0;
            break;
          case 4:
            o = (Math.floor(i / 3) + Math.floor(t / 2)) % 2 === 0;
            break;
          case 5:
            o = i * t % 2 + i * t % 3 === 0;
            break;
          case 6:
            o = (i * t % 2 + i * t % 3) % 2 === 0;
            break;
          case 7:
            o = ((i + t) % 2 + i * t % 3) % 2 === 0;
            break;
          default:
            throw new Error("Unreachable");
        }
        !this.types[t][i] && o && (this.modules[t][i] = !this.modules[t][i]);
      }
  }
  // Calculates and returns the penalty score based on state of this QR Code's current modules.
  // This is used by the automatic mask choice algorithm to find the mask pattern that yields the lowest score.
  getPenaltyScore() {
    let e = 0;
    for (let s = 0; s < this.size; s++) {
      let r = !1, l = 0;
      const a = [0, 0, 0, 0, 0, 0, 0];
      for (let c = 0; c < this.size; c++)
        this.modules[s][c] === r ? (l++, l === 5 ? e += G : l > 5 && e++) : (this.finderPenaltyAddHistory(l, a), r || (e += this.finderPenaltyCountPatterns(a) * I), r = this.modules[s][c], l = 1);
      e += this.finderPenaltyTerminateAndCount(r, l, a) * I;
    }
    for (let s = 0; s < this.size; s++) {
      let r = !1, l = 0;
      const a = [0, 0, 0, 0, 0, 0, 0];
      for (let c = 0; c < this.size; c++)
        this.modules[c][s] === r ? (l++, l === 5 ? e += G : l > 5 && e++) : (this.finderPenaltyAddHistory(l, a), r || (e += this.finderPenaltyCountPatterns(a) * I), r = this.modules[c][s], l = 1);
      e += this.finderPenaltyTerminateAndCount(r, l, a) * I;
    }
    for (let s = 0; s < this.size - 1; s++)
      for (let r = 0; r < this.size - 1; r++) {
        const l = this.modules[s][r];
        l === this.modules[s][r + 1] && l === this.modules[s + 1][r] && l === this.modules[s + 1][r + 1] && (e += _t);
      }
    let t = 0;
    for (const s of this.modules)
      t = s.reduce((r, l) => r + (l ? 1 : 0), t);
    const i = this.size * this.size, o = Math.ceil(Math.abs(t * 20 - i * 10) / i) - 1;
    return e += o * Bt, e;
  }
  /* -- Private helper functions -- */
  // Returns an ascending list of positions of alignment patterns for this version number.
  // Each position is in the range [0,177), and are used on both the x and y axes.
  // This could be implemented as lookup table of 40 variable-length lists of integers.
  getAlignmentPatternPositions() {
    if (this.version === 1)
      return [];
    {
      const e = Math.floor(this.version / 7) + 2, t = this.version === 32 ? 26 : Math.ceil((this.version * 4 + 4) / (e * 2 - 2)) * 2, i = [6];
      for (let o = this.size - 7; i.length < e; o -= t)
        i.splice(1, 0, o);
      return i;
    }
  }
  // Can only be called immediately after a light run is added, and
  // returns either 0, 1, or 2. A helper function for getPenaltyScore().
  finderPenaltyCountPatterns(e) {
    const t = e[1], i = t > 0 && e[2] === t && e[3] === t * 3 && e[4] === t && e[5] === t;
    return (i && e[0] >= t * 4 && e[6] >= t ? 1 : 0) + (i && e[6] >= t * 4 && e[0] >= t ? 1 : 0);
  }
  // Must be called at the end of a line (row or column) of modules. A helper function for getPenaltyScore().
  finderPenaltyTerminateAndCount(e, t, i) {
    return e && (this.finderPenaltyAddHistory(t, i), t = 0), t += this.size, this.finderPenaltyAddHistory(t, i), this.finderPenaltyCountPatterns(i);
  }
  // Pushes the given value to the front and drops the last value. A helper function for getPenaltyScore().
  finderPenaltyAddHistory(e, t) {
    t[0] === 0 && (e += this.size), t.pop(), t.unshift(e);
  }
}
function k(n, e, t) {
  if (e < 0 || e > 31 || n >>> e)
    throw new RangeError("Value out of range");
  for (let i = e - 1; i >= 0; i--)
    t.push(n >>> i & 1);
}
function A(n, e) {
  return (n >>> e & 1) !== 0;
}
class V {
  // Creates a new QR Code segment with the given attributes and data.
  // The character count (numChars) must agree with the mode and the bit buffer length,
  // but the constraint isn't checked. The given bit buffer is cloned and stored.
  constructor(e, t, i) {
    if (this.mode = e, this.numChars = t, this.bitData = i, t < 0)
      throw new RangeError("Invalid argument");
    this.bitData = i.slice();
  }
  /* -- Methods -- */
  // Returns a new copy of the data bits of this segment.
  getData() {
    return this.bitData.slice();
  }
}
const Nt = [1, 10, 12, 14], Rt = [2, 9, 11, 13], Ft = [4, 8, 16, 16];
function lt(n, e) {
  return n[Math.floor((e + 7) / 17) + 1];
}
function at(n) {
  const e = [];
  for (const t of n)
    k(t, 8, e);
  return new V(Ft, n.length, e);
}
function Ot(n) {
  if (!ct(n))
    throw new RangeError("String contains non-numeric characters");
  const e = [];
  for (let t = 0; t < n.length; ) {
    const i = Math.min(n.length - t, 3);
    k(Number.parseInt(n.substring(t, t + i), 10), i * 3 + 1, e), t += i;
  }
  return new V(Nt, n.length, e);
}
function Wt(n) {
  if (!dt(n))
    throw new RangeError("String contains unencodable characters in alphanumeric mode");
  const e = [];
  let t;
  for (t = 0; t + 2 <= n.length; t += 2) {
    let i = R.indexOf(n.charAt(t)) * 45;
    i += R.indexOf(n.charAt(t + 1)), k(i, 11, e);
  }
  return t < n.length && k(R.indexOf(n.charAt(t)), 6, e), new V(Rt, n.length, e);
}
function Lt(n) {
  return n === "" ? [] : ct(n) ? [Ot(n)] : dt(n) ? [Wt(n)] : [at(Dt(n))];
}
function ct(n) {
  return vt.test(n);
}
function dt(n) {
  return It.test(n);
}
function Tt(n, e) {
  let t = 0;
  for (const i of n) {
    const o = lt(i.mode, e);
    if (i.numChars >= 1 << o)
      return Number.POSITIVE_INFINITY;
    t += 4 + o + i.bitData.length;
  }
  return t;
}
function Dt(n) {
  n = encodeURI(n);
  const e = [];
  for (let t = 0; t < n.length; t++)
    n.charAt(t) !== "%" ? e.push(n.charCodeAt(t)) : (e.push(Number.parseInt(n.substring(t + 1, t + 3), 16)), t += 2);
  return e;
}
function L(n) {
  if (n < Y || n > U)
    throw new RangeError("Version number out of range");
  let e = (16 * n + 128) * n + 64;
  if (n >= 2) {
    const t = Math.floor(n / 7) + 2;
    e -= (25 * t - 10) * t - 55, n >= 7 && (e -= 36);
  }
  return e;
}
function B(n, e) {
  return Math.floor(L(n) / 8) - st[e[0]][n] * rt[e[0]][n];
}
function Ht(n) {
  if (n < 1 || n > 255)
    throw new RangeError("Degree out of range");
  const e = [];
  for (let i = 0; i < n - 1; i++)
    e.push(0);
  e.push(1);
  let t = 1;
  for (let i = 0; i < n; i++) {
    for (let o = 0; o < e.length; o++)
      e[o] = T(e[o], t), o + 1 < e.length && (e[o] ^= e[o + 1]);
    t = T(t, 2);
  }
  return e;
}
function Yt(n, e) {
  const t = e.map((i) => 0);
  for (const i of n) {
    const o = i ^ t.shift();
    t.push(0), e.forEach((s, r) => t[r] ^= T(s, o));
  }
  return t;
}
function T(n, e) {
  if (n >>> 8 || e >>> 8)
    throw new RangeError("Byte out of range");
  let t = 0;
  for (let i = 7; i >= 0; i--)
    t = t << 1 ^ (t >>> 7) * 285, t ^= (e >>> i & 1) * n;
  return t;
}
function Ut(n, e, t = 1, i = 40, o = -1, s = !0) {
  if (!(Y <= t && t <= i && i <= U) || o < -1 || o > 7)
    throw new RangeError("Invalid value");
  let r, l;
  for (r = t; ; r++) {
    const u = B(r, e) * 8, d = Tt(n, r);
    if (d <= u) {
      l = d;
      break;
    }
    if (r >= i)
      throw new RangeError("Data too long");
  }
  for (const u of [nt, it, ot])
    s && l <= B(r, u) * 8 && (e = u);
  const a = [];
  for (const u of n) {
    k(u.mode[0], 4, a), k(u.numChars, lt(u.mode, r), a);
    for (const d of u.getData())
      a.push(d);
  }
  const c = B(r, e) * 8;
  k(0, Math.min(4, c - a.length), a), k(0, (8 - a.length % 8) % 8, a);
  for (let u = 236; a.length < c; u ^= 253)
    k(u, 8, a);
  const g = Array.from({ length: Math.ceil(a.length / 8) }, () => 0);
  return a.forEach((u, d) => g[d >>> 3] |= u << 7 - (d & 7)), new Ct(r, e, g, o);
}
function Vt(n, e) {
  const {
    ecc: t = "L",
    boostEcc: i = !1,
    minVersion: o = 1,
    maxVersion: s = 40,
    maskPattern: r = -1,
    border: l = 1
  } = e || {}, a = typeof n == "string" ? Lt(n) : Array.isArray(n) ? [at(n)] : void 0;
  if (!a)
    throw new Error(`uqr only supports encoding string and binary data, but got: ${typeof n}`);
  const c = Ut(
    a,
    St[t],
    o,
    s,
    r,
    i
  ), g = Kt({
    version: c.version,
    maskPattern: c.mask,
    size: c.size,
    data: c.modules,
    types: c.types
  }, l);
  return e?.invert && (g.data = g.data.map((u) => u.map((d) => !d))), e?.onEncoded?.(g), g;
}
function Kt(n, e = 1) {
  if (!e)
    return n;
  const { size: t } = n, i = t + e * 2;
  n.size = i, n.data.forEach((s) => {
    for (let r = 0; r < e; r++)
      s.unshift(!1), s.push(!1);
  });
  for (let s = 0; s < e; s++)
    n.data.unshift(Array.from({ length: i }, (r) => !1)), n.data.push(Array.from({ length: i }, (r) => !1));
  const o = E.Border;
  n.types.forEach((s) => {
    for (let r = 0; r < e; r++)
      s.unshift(o), s.push(o);
  });
  for (let s = 0; s < e; s++)
    n.types.unshift(Array.from({ length: i }, (r) => o)), n.types.push(Array.from({ length: i }, (r) => o));
  return n;
}
function Z(n) {
  return n.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Xt(n, e = {}) {
  const t = Vt(n, e), {
    pixelSize: i = 10,
    whiteColor: o = "white",
    blackColor: s = "black"
  } = e, r = t.size * i, l = t.size * i;
  let a = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${l} ${r}">`;
  const c = [];
  for (let g = 0; g < t.size; g++)
    for (let u = 0; u < t.size; u++) {
      const d = u * i, m = g * i;
      t.data[g][u] && c.push(`M${d},${m}h${i}v${i}h-${i}z`);
    }
  return a += `<rect fill="${Z(o)}" width="${l}" height="${r}"/>`, a += `<path fill="${Z(s)}" d="${c.join("")}"/>`, a += "</svg>", a;
}
const _ = /* @__PURE__ */ new Map();
function Gt(n) {
  return typeof btoa == "function" ? btoa(n) : globalThis.Buffer.from(n).toString("base64");
}
function Zt(n) {
  if (!n) return null;
  const e = _.get(n);
  if (e) return e;
  let t;
  try {
    t = Xt(n, { ecc: "M", border: 2, pixelSize: 8 });
  } catch {
    return null;
  }
  const i = "data:image/svg+xml;base64," + Gt(t);
  return _.size > 200 && _.clear(), _.set(n, i), i;
}
const F = 220, $ = 84, jt = 48, qt = 8, x = (n) => Math.round(n * 100) / 100;
function C(n, e = {}) {
  const t = n.grid, i = W(t), o = !!e.narrow, s = o ? Math.min(1, Math.max(280, (e.width ?? 358) - 16) / i.width) : 1, r = x(i.width * s), l = x(i.height * s), a = zt(n).map((m, w) => o ? { id: m.id, x: 8, y: $ + w * (l + $), width: r, height: l } : { id: m.id, x: F + 24 + w * (r + jt), y: $, width: r, height: l }), c = H(t), g = o ? r : F - 16, u = { width: x(Math.min(g, c.width)), height: x(Math.min(g, c.width) * c.height / c.width) }, d = o ? a.at(-1).y + l + 24 : 0;
  return { scale: s, pages: a, tile: u, narrow: o, tray: o ? { x: 2, y: d, width: r + 12 } : { x: 2, y: 0, width: F - 4 } };
}
function ht(n, e, t, i) {
  const o = et(n.grid, i);
  return { x: x(e.x + o.x * t), y: x(e.y + o.y * t), width: x(o.width * t), height: x(o.height * t) };
}
const Jt = (n, e, t) => `M ${t} 0 H ${n - t} Q ${n} 0 ${n} ${t} V ${e - t} Q ${n} ${e} ${n - t} ${e} H ${t} Q 0 ${e} 0 ${e - t} V ${t} Q 0 0 ${t} 0 Z`, Qt = (n, e) => {
  const t = Math.min(18, n / 4, e / 4), i = Math.max(t * 2, e - 16), o = Math.min(n / 3, 40);
  return `M ${t} 0 H ${n - t} Q ${n} 0 ${n} ${t} V ${i - t} Q ${n} ${i} ${n - t} ${i} H ${o + 18} L ${o} ${e} L ${o + 4} ${i} H ${t} Q 0 ${i} 0 ${i - t} V ${t} Q 0 0 ${t} 0 Z`;
}, te = (n, e, t, i) => {
  const o = (e - i - 8) / Math.max(1, t);
  let s = `M 0 0 H ${n} V ${e} H 0 Z`;
  for (let r = 1; r <= t; r++) s += ` M 10 ${x(i + o * r)} H ${x(n - 10)}`;
  return s;
}, ee = (n) => Math.max(1, Math.min(20, Number.parseInt(n.tile?.body ?? "", 10) || 3));
function j(n, e, t, i = 1) {
  const o = e.tile, s = pt(Et(n, e), e), r = (a) => Math.max(8, Math.round(a * i)), l = { fill: "#ffffff", ink: "#1b2421", line: "#3b4643" };
  switch (o.type) {
    case "heading":
      return { ...l, text: s, weight: "bold", fontSize: r(28), lineWidth: 0 };
    case "text":
      return { ...l, text: s, fontSize: r(15), lineWidth: 0, textXAlign: "left", textYAlign: "top" };
    case "question":
      return { ...l, text: s, fontSize: r(15), lineWidth: 0, textXAlign: "left", textYAlign: "top" };
    case "answer-lines":
      return {
        ...l,
        text: s,
        fontSize: r(13),
        line: "#8a948f",
        lineWidth: 1,
        textXAlign: "left",
        textYAlign: "top",
        vectorPath: te(t.width, t.height, ee(e), Math.min(t.height / 3, r(13) * 1.6 + 8))
      };
    case "word-bank":
      return { ...l, text: s, fontSize: r(15), lineWidth: 2 };
    case "image":
    case "diagram":
      return o.image?.src ? { ...l, text: "", lineWidth: 0, image: o.image.src } : { fill: "#f7f8f6", ink: "#5b6662", line: "#8a948f", lineWidth: 1.5, borderStyle: "dashed", text: s, fontSize: r(14) };
    case "qr": {
      const a = Zt(o.link);
      return a ? { ...l, text: e.label, fontSize: r(12), lineWidth: 0, image: a, textYAlign: "bottom" } : { fill: "#f7f8f6", ink: "#5b6662", line: "#8a948f", lineWidth: 1.5, borderStyle: "dashed", text: e.label + `
No web address yet`, fontSize: r(13) };
    }
    case "panel":
      return { ...l, text: s, fontSize: r(14), lineWidth: 3, line: "#1b2421", textYAlign: "bottom", ...o.image?.src && { image: o.image.src } };
    case "speech":
      return { ...l, text: s, fontSize: r(15), lineWidth: 1.5, vectorPath: Qt(t.width, t.height) };
    case "term":
      return { ...l, text: s, fontSize: r(20), lineWidth: 1 };
    case "sticker":
      return {
        fill: "#fde68a",
        ink: "#5b3407",
        line: "#b45309",
        lineWidth: 2,
        text: s,
        fontSize: r(16),
        weight: "bold",
        vectorPath: Jt(t.width, t.height, Math.min(24, t.width / 4, t.height / 4)),
        ...o.image?.src && { image: o.image.src, textYAlign: "bottom" }
      };
  }
}
function D(n, e = {}) {
  const t = C(n, e), i = [], o = (d, m, w, h) => {
    i.push({ name: "lane-" + d, x: m, y: w, width: h - xt, height: 40, text: n.lanes.find((p) => p.id === d).label, fill: d === b ? "#e9e5da" : "#d5e9e3", fontSize: 16 }), i.push({ name: "caption-" + d, x: m, y: w + 44, width: h, height: 26, text: $t(n, d), fill: "transparent", lineWidth: 0, fontSize: 14 });
  };
  for (const d of t.pages) {
    o(d.id, d.x, d.y - $ + 6, Math.min(d.width, 640)), i.push({ name: "column-" + d.id, x: d.x, y: d.y, width: d.width, height: d.height, fill: "#ffffff", line: "#b8bfb6", lineWidth: 1 });
    for (const m of n.cards.filter((w) => w.laneId === d.id && w.cell)) {
      const w = ht(n, d, t.scale, m.cell);
      i.push({ name: "card-" + m.id, ...w, ...j(n, m, w, t.scale) });
    }
  }
  const s = t.tray.y;
  o(b, 8, s + 6, t.tray.width - 12);
  const r = n.cards.filter((d) => d.laneId === b).sort((d, m) => +!!m.tile?.stamp - +!!d.tile?.stamp);
  let l = s + $;
  for (const d of r) {
    const m = { x: 8, y: l, width: t.tile.width, height: t.tile.height };
    i.push({ name: "card-" + d.id, ...m, ...j(n, d, m, t.tile.width / H(n.grid).width) }), l += t.tile.height + qt;
  }
  const a = t.pages.at(-1), c = t.narrow ? a.width + 16 : a.x + a.width + 16, g = l + t.tile.height + 24 - s, u = t.narrow ? s + g : Math.max($ + a.height + 24, g);
  return i.unshift({ name: "column-" + b, x: t.tray.x, y: s, width: t.tray.width, height: t.narrow ? g : u, fill: K("#e9e5da", 0.5), line: K("#e9e5da", 0.1) }), { parts: i, width: x(c), height: x(u) };
}
function ne(n, e) {
  const t = C(n, e.layout), i = n.grid, o = [];
  for (const s of t.pages) {
    const r = i.page.margin * 96 * t.scale;
    o.push({ t: "path", d: `M ${s.x + r} ${s.y + r} H ${s.x + s.width - r} V ${s.y + s.height - r} H ${s.x + r} Z`, color: X.week, width: 1, dash: "6 4", role: "grid-margin" });
    for (let l = 0; l < i.cells.rows; l++) for (let a = 0; a < i.cells.cols; a++) {
      const c = ht(n, s, t.scale, { row: l, col: a });
      o.push({ t: "rect", x: c.x, y: c.y, w: c.width, h: c.height, color: X.faint, opacity: 0.35, role: "grid-cell" });
    }
  }
  return o;
}
function ft(n, e, t, i = 24) {
  const o = C(n, t);
  return { f: o, page: o.pages.find((s) => J(s, e, i)) ?? null };
}
function ie(n, e, t) {
  return e.laneId === t && e.cell ? O(e.cell) : Q(n, e.tile.type);
}
function ut(n, e, t, i, o) {
  const s = n.cards.find((f) => f.id === e);
  if (!s?.tile) return null;
  const { f: r, page: l } = ft(n, i, o);
  if (!l) {
    const f = D(n, o).parts.find((M) => M.name === "column-" + b);
    if (s.laneId === b || !J(f, i)) return null;
    const y = S(n, [{ kind: "place_tile", card: { id: e }, page: { id: b }, row: 1, col: 1 }]);
    return "refused" in y ? null : { board: y.workshop };
  }
  const a = n.grid, c = ie(n, s, l.id), g = H(a), u = { x: (i.x - t.x - l.x) / r.scale, y: (i.y - t.y - l.y) / r.scale }, d = tt(a, { x: Math.min(W(a).width, Math.max(0, u.x + g.width / 2)), y: Math.min(W(a).height, Math.max(0, u.y + g.height / 2)) });
  if (!d) return null;
  const m = (f, y, M = !1) => S(n, [{
    kind: "place_tile",
    card: { id: e },
    page: { id: l.id },
    row: f + 1,
    col: y + 1,
    ...c.rows > 1 && { rows: c.rows },
    ...c.cols > 1 && { cols: c.cols },
    ...M && { override: !0 }
  }]), w = m(d.row, d.col);
  if (!("refused" in w)) return { board: w.workshop };
  if (w.refused.overridable)
    return { refused: w.refused.reason, laneId: l.id, override: { edit: {
      kind: "place_tile",
      card: { id: e },
      page: { id: l.id },
      row: d.row + 1,
      col: d.col + 1,
      ...c.rows > 1 && { rows: c.rows },
      ...c.cols > 1 && { cols: c.cols },
      override: !0
    }, to: "to " + n.lanes.find((f) => f.id === l.id).label + ", row " + (d.row + 1) + ", column " + (d.col + 1) } };
  const h = { x: u.x + g.width * c.cols / 2, y: u.y + g.height * c.rows / 2 }, p = [];
  for (let f = -1; f <= 1; f++) for (let y = -1; y <= 1; y++) {
    const M = d.row + f, N = d.col + y;
    if (!f && !y || M < 0 || N < 0) continue;
    const v = et(a, { row: M, col: N, rows: c.rows, cols: c.cols });
    p.push({ row: M, col: N, d: Math.hypot(v.x + v.width / 2 - h.x, v.y + v.height / 2 - h.y) });
  }
  for (const f of p.sort((y, M) => y.d - M.d)) {
    const y = m(f.row, f.col);
    if (!("refused" in y)) return { board: y.workshop };
  }
  return { refused: w.refused.reason, laneId: l.id };
}
function oe(n, e, t, i) {
  const o = /* @__PURE__ */ new Map();
  return (s) => {
    const r = Math.round(s.x) + ":" + Math.round(s.y);
    if (!o.has(r)) {
      const l = ut(n, e, t, s, i);
      o.size > 400 && o.clear(), o.set(r, l && "board" in l ? l.board : n);
    }
    return o.get(r);
  };
}
const q = (n) => n.cell ? { row: n.cell.row + 1, col: n.cell.col + 1, ...n.cell.rows && { rows: n.cell.rows }, ...n.cell.cols && { cols: n.cell.cols } } : null, z = (n, e) => JSON.stringify(n) === JSON.stringify(e);
function se(n, e) {
  const t = [], i = n.grid, o = e.grid;
  z(i.page, o.page) || t.push({
    kind: "set_page",
    ...i.page.size !== o.page.size && { size: o.page.size },
    ...i.page.orientation !== o.page.orientation && { orientation: o.page.orientation },
    ...i.page.margin !== o.page.margin && { margin: o.page.margin }
  }), z(i.cells, o.cells) || t.push({
    kind: "set_grid",
    ...i.cells.rows !== o.cells.rows && { rows: o.cells.rows },
    ...i.cells.cols !== o.cells.cols && { cols: o.cells.cols },
    ...i.cells.gutter !== o.cells.gutter && { gutter: o.cells.gutter }
  });
  const s = (h, p) => {
    if (!p.length) return h;
    const f = S(h, p);
    return "refused" in f ? h : f.workshop;
  }, r = s(n, t), l = [];
  for (const h of e.lanes) r.lanes.some((p) => p.id === h.id) || l.push({ kind: "add_page", label: h.label });
  for (const h of r.lanes) e.lanes.some((p) => p.id === h.id) || l.push({ kind: "remove_lane", lane: { id: h.id } });
  const a = new Map(r.cards.map((h) => [h.id, h]));
  for (const h of r.cards) !e.cards.some((p) => p.id === h.id) && e.lanes.some((p) => p.id === h.laneId) && l.push({ kind: "remove_card", card: { id: h.id } });
  const c = [], g = [], u = [];
  for (const h of e.cards) {
    const p = a.get(h.id), f = h.tile;
    if (!p) {
      const M = q(h);
      g.push({
        kind: "add_tile",
        type: f.type,
        label: h.label,
        ...f.body && { body: f.body },
        ...f.words && { words: f.words },
        ...f.image && (f.image.src ? { image: { src: f.image.src, alt: f.image.alt } } : { alt: f.image.alt }),
        ...f.link && { link: f.link },
        ...f.stamp && { stamp: !0 },
        page: { id: h.laneId },
        ...M ?? {}
      });
      continue;
    }
    if (h.laneId === b && p.laneId !== b) c.push({ kind: "place_tile", card: { id: h.id }, page: { id: b }, row: 1, col: 1 });
    else if (h.laneId !== b && (p.laneId !== h.laneId || !z(p.cell, h.cell))) {
      const M = q(h);
      g.push({
        kind: "place_tile",
        card: { id: h.id },
        page: { id: h.laneId },
        row: M.row,
        col: M.col,
        rows: M.rows ?? 1,
        cols: M.cols ?? 1,
        ...h.override && !z(h.override, p.override) && { override: !0 }
      });
    }
    p.label !== h.label && u.push({ kind: "rename_card", card: { id: h.id }, label: h.label });
    const y = p.tile;
    z(y, f) || u.push({
      kind: "set_tile",
      card: { id: h.id },
      ...y.type !== f.type && { type: f.type },
      ...y.body !== f.body && { body: f.body ?? "" },
      ...!z(y.words, f.words) && f.words && { words: f.words },
      ...!z(y.image, f.image) && (f.image ? f.image.src ? { image: { src: f.image.src, alt: f.image.alt } } : { alt: f.image.alt } : { image: null }),
      ...y.link !== f.link && { link: f.link ?? "" }
    });
  }
  let d = s(r, [...l, ...c]);
  const m = [];
  let w = [...g];
  for (; w.length; ) {
    const h = w.find((p) => !("refused" in S(d, [p])));
    if (!h) {
      m.push(...w);
      break;
    }
    d = s(d, [h]), m.push(h), w = w.filter((p) => p !== h);
  }
  for (const h of e.lanes) {
    const p = r.lanes.find((f) => f.id === h.id);
    p && p.label !== h.label && u.push({ kind: "rename_lane", lane: { id: h.id }, label: h.label });
  }
  return n.title !== e.title && u.push({ kind: "rename_workshop", title: e.title }), [...t, ...l, ...c, ...m, ...u, ...bt(n, e)];
}
function fe(n, e = {}, t = { x: 0, y: 0 }, i) {
  const o = C(n, e), s = kt(n.grid);
  return o.pages.filter((r) => !i || i.includes(r.id)).map((r) => ({
    pageId: r.id,
    label: n.lanes.find((l) => l.id === r.id).label,
    frame: { x: x(t.x + r.x), y: x(t.y + r.y), width: r.width, height: r.height },
    nodeIds: ["column-" + r.id, ...n.cards.filter((l) => l.laneId === r.id).map((l) => "card-" + l.id)],
    size: s
  }));
}
function re(n, e, t) {
  const { f: i, page: o } = ft(n, e, t, 0);
  if (!o) return null;
  const s = tt(n.grid, { x: (e.x - o.x) / i.scale, y: (e.y - o.y) / i.scale });
  return s ? { row: s.row + 1, col: s.col + 1 } : null;
}
const le = {
  laneCues: !1,
  places: (n, e) => D(n, e),
  notes: (n, e, t, i) => mt(D(n, e).parts, n, t, i),
  editsBetween: se,
  layer: (n) => Mt(n, ne, { exportNever: !0 }),
  cardKeys: "Arrows move it a cell, Shift and an arrow make it bigger or smaller, Delete puts it back in the tray.",
  label(n, e) {
    const t = n.cards.find((r) => "card-" + r.id === e);
    if (!t?.tile) return null;
    const i = At(t.tile.type).toLowerCase();
    if (t.laneId === b) return t.label + ", " + i + (t.tile.stamp ? " stamp, in the tray: dropping it on a page makes a copy" : ", in the tray");
    const { rows: o, cols: s } = O(t.cell);
    return t.label + ", " + i + ", on " + n.lanes.find((r) => r.id === t.laneId).label + ", row " + (t.cell.row + 1) + ", column " + (t.cell.col + 1) + (o * s > 1 ? ", " + o + " by " + s : "");
  },
  chooser: (n, e, t, i = {}) => oe(n, e, t, i),
  refusalAt(n, e, t, i, o) {
    const s = ut(n, e, t, i, o);
    return s && "refused" in s ? { laneId: s.laneId, reason: s.refused, ...s.override && { override: s.override } } : null;
  },
  overrideWords(n, e) {
    return e.kind !== "place_tile" ? void 0 : "to " + (n.lanes.find((i) => typeof e.page == "object" && i.id === e.page.id)?.label ?? "the page") + ", row " + e.row + ", column " + e.col;
  },
  noteCell: re,
  keyEdit(n, e, t) {
    const i = n.cards.find((g) => "card-" + g.id === e);
    if (!i?.tile) return null;
    const o = { id: i.id };
    if (i.laneId === b) {
      if (t.key !== "ArrowRight" && t.key !== "Enter") return null;
      const g = n.lanes[1].id, u = Q(n, i.tile.type);
      for (const d of [u, { rows: 1, cols: 1 }])
        for (let m = 0; m < n.grid.cells.rows; m++) for (let w = 0; w < n.grid.cells.cols; w++) {
          const h = { kind: "place_tile", card: o, page: { id: g }, row: m + 1, col: w + 1, rows: d.rows, cols: d.cols };
          if (!("refused" in S(n, [h]))) return [h];
        }
      return null;
    }
    if (t.key === "Delete" || t.key === "Backspace") return [{ kind: "place_tile", card: o, page: { id: b }, row: 1, col: 1 }];
    const r = { ArrowRight: [0, 1], ArrowLeft: [0, -1], ArrowUp: [-1, 0], ArrowDown: [1, 0] }[t.key];
    if (!r || !i.cell) return null;
    const l = O(i.cell), a = { row: i.cell.row + 1, col: i.cell.col + 1 }, c = t.shiftKey ? { ...a, rows: Math.max(1, l.rows + r[0]), cols: Math.max(1, l.cols + r[1]) } : { row: a.row + r[0], col: a.col + r[1], rows: l.rows, cols: l.cols };
    return c.row < 1 || c.col < 1 || c.rows === l.rows && c.cols === l.cols && c.row === a.row && c.col === a.col ? null : [{ kind: "place_tile", card: o, page: { id: i.laneId }, ...c }];
  },
  handleDrag: () => null
};
yt("grid", le);
export {
  $t as gridCaption,
  se as gridEditsBetween,
  C as gridFrames,
  le as gridKit,
  D as gridLayout,
  we as gridNeeds,
  fe as gridPrintPages,
  me as gridPrintProblems,
  Zt as gridQrPicture,
  j as tileLook
};
