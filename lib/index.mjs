function y(t) {
  const n = parseFloat(t);
  return typeof n == "number" && !Number.isNaN(n);
}
function p(t, n, e) {
  return Math.min(Math.max(t, n), e);
}
function F(t, n, e) {
  return n + (e - n) * t;
}
function d(t, n) {
  return Math.round(t * 10 ** n) / 10 ** n;
}
function N(t) {
  const n = parseFloat(t);
  return t.toString().replace(n.toString(), "");
}
function G(t) {
  return function(n, e, r) {
    return n.map((i) => t(i, e, r));
  };
}
const m = (t, [n = 1, e = 100, r = 10, i = 0] = [], s) => {
  if (t === 0 || t === 1)
    return t;
  n = p(n, 0.1, 1e3), e = p(e, 0.1, 1e3), r = p(r, 0.1, 1e3), i = p(i, 0.1, 1e3);
  const a = Math.sqrt(e / n), o = r / (2 * Math.sqrt(e * n)), u = o < 1 ? a * Math.sqrt(1 - o * o) : 0, c = 1, h = o < 1 ? (o * a + -i) / u : -i + a;
  let g = s ? s * t / 1e3 : t;
  return o < 1 ? g = Math.exp(-g * o * a) * (c * Math.cos(u * g) + h * Math.sin(u * g)) : g = (c + h * g) * Math.exp(-g * a), 1 - g;
}, b = /* @__PURE__ */ new Map(), I = 1e5;
function x([t, n, e, r] = []) {
  let i = [t, n, e, r], s = `${i}`;
  if (b.has(s))
    return b.get(s);
  const a = 1 / 6;
  let o = 0, u = 0, c = 0;
  for (; ++c < I; )
    if (o += a, m(o, i, null) === 1) {
      if (u++, u >= 16)
        break;
    } else
      u = 0;
  const h = o * a * 1e3;
  return b.set(s, h), h;
}
function L(t) {
  return (n, e = [], r) => 1 - t(1 - n, e, r);
}
function j(t) {
  return function(n, e = [], r) {
    return n < 0.5 ? t(n * 2, e, r) / 2 : 1 - t(n * -2 + 2, e, r) / 2;
  };
}
function q(t) {
  return function(n, e = [], r) {
    return n < 0.5 ? (1 - t(1 - n * 2, e, r)) / 2 : (t(n * 2 - 1, e, r) + 1) / 2;
  };
}
const A = m, $ = L(m), C = j(m), P = q(m);
function S(t, n, e = 3) {
  const r = n.length - 1, i = p(Math.floor(t * r), 0, r - 1), s = n[i], a = n[i + 1], o = (t - i / r) * r;
  return d(F(o, s, a), e);
}
function M(t, n, e = 3) {
  const r = n.length - 1;
  return t.map((i) => {
    const s = p(Math.floor(i * r), 0, r - 1), a = n[s], o = n[s + 1], u = (i - s / r) * r;
    return d(F(u, a, o), e);
  });
}
function O(t, n) {
  const e = n.length - 1;
  t = p(t, 0, 1);
  const r = Math.round(t * e);
  return n[r];
}
function w(t, n) {
  const e = n.length - 1;
  return t.map((r) => {
    r = p(r, 0, 1);
    const i = Math.round(r * e);
    return n[i];
  });
}
const K = O, W = w;
function T(t, n, e = 3) {
  let r = "";
  return y(n[0]) && (r = N(n[0])), S(
    t,
    n.map((i) => typeof i == "number" ? i : parseFloat(i)),
    e
  ) + r;
}
function U(t, n, e = 3) {
  let r = "";
  return y(n[0]) && (r = N(n[0])), M(
    t,
    n.map((i) => typeof i == "number" ? i : parseFloat(i)),
    e
  ).map((i) => i + r);
}
function Y(t, n, e = 3) {
  return n.every((s) => typeof s == "number") ? S(t, n, e) : n.every((s) => y(s)) ? T(t, n, e) : O(t, n);
}
function D(t, n, e = 3) {
  return n.every((s) => typeof s == "number") ? M(t, n, e) : n.every((s) => y(s)) ? U(t, n, e) : w(t, n);
}
let f = {
  spring: m,
  "spring-in": A,
  "spring-out": $,
  "spring-in-out": C,
  "spring-out-in": P
}, E = Object.keys(f);
function H(t, n) {
  f = { ...f, [t]: n }, E = Object.keys(f);
}
function J(t) {
  f = { ...f, ...t }, E = Object.keys(f);
}
function z(t) {
  const n = /(\(|\s)([^)]+)\)?/.exec(t.toString());
  return n ? n[2].split(",").map((e) => {
    let r = parseFloat(e);
    return Number.isNaN(r) ? e.trim() : r;
  }) : [];
}
function k(t = {}) {
  const n = typeof t == "string" || Array.isArray(t) && typeof t[0] == "function";
  let {
    easing: e = [m, 1, 100, 10, 0],
    numPoints: r = 100,
    decimal: i = 3
  } = n ? { easing: t } : t;
  if (typeof e == "string") {
    const s = f[e.replace(/(\(|\s).+/, "").toLowerCase().trim()], a = z(e);
    e = [s, ...a];
  }
  return { easing: e, numPoints: r, decimal: i };
}
const l = /* @__PURE__ */ new Map();
function B(t = {}) {
  let {
    easing: n,
    numPoints: e
  } = k(t);
  if (Array.isArray(n)) {
    if (typeof n[0] != "function")
      throw new Error(
        "[spring-easing] A frame function is required as the first element in the easing array, e.g. [SpringFrame, ...]"
      );
    n.length > 1 && n.length < 5 && console.warn(`[spring-easing] Be careful of only setting some of the spring parameters, you've only set ${5 - n.length} spring parameter(s). The easing works best in the format: 
* "spring-out(mass, stiffness, damping, velocity)" or 
* [SpringOutFrame, mass, stiffness, damping, velocity].`), n.length > 5 && console.warn(
      `[spring-easing] You entered ${5 - n.length} more spring parameter(s) than necessary. The easing needs to be in the format: 
* "spring-out(mass, stiffness, damping, velocity)" or 
* [SpringOutFrame, mass, stiffness, damping, velocity].`
    );
  } else
    throw new Error(
      `[spring-easing] The easing needs to be in the format:  
* "spring-out(mass, stiffness, damping, velocity)" or 
* [SpringOutFrame, mass, stiffness, damping, velocity], the easing recieved is "${n}", [spring-easing] doesn't really know what to do with that.`
    );
  let [r, ...i] = n;
  const s = `${i},${e}`;
  if (l.has(s)) {
    let c = l.get(s);
    if (c.has(r))
      return c.get(r);
  }
  const a = [], o = x(i);
  for (let c = 0; c < e; c++)
    a[c] = r(c / (e - 1), i, o);
  const u = l.has(s) ? l.get(s) : /* @__PURE__ */ new WeakMap();
  return u.set(r, [a, o]), l.set(s, u), [a, o];
}
function Q(t, n = {}, e = D) {
  const r = k(n), [i, s] = B(r);
  return [
    e(i, t, r.decimal),
    s
  ];
}
export {
  j as EaseInOut,
  L as EaseOut,
  q as EaseOutIn,
  b as EasingDurationCache,
  E as EasingFunctionKeys,
  f as EasingFunctions,
  k as EasingOptions,
  l as FramePtsCache,
  B as GenerateSpringFrames,
  I as INFINITE_LOOP_LIMIT,
  Q as SpringEasing,
  m as SpringFrame,
  A as SpringInFrame,
  C as SpringInOutFrame,
  $ as SpringOutFrame,
  P as SpringOutInFrame,
  Q as default,
  x as getSpringDuration,
  N as getUnit,
  Y as instantComplex,
  S as instantNumber,
  O as instantSequence,
  T as instantString,
  K as instantUsingIndex,
  D as interpolateComplex,
  M as interpolateNumber,
  w as interpolateSequence,
  U as interpolateString,
  W as interpolateUsingIndex,
  y as isNumberLike,
  p as limit,
  z as parseEasingParameters,
  H as registerEasingFunction,
  J as registerEasingFunctions,
  F as scale,
  G as toAnimationFrames,
  d as toFixed
};
