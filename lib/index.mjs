function F(e) {
  const n = parseFloat(e);
  return typeof n == "number" && !Number.isNaN(n);
}
function m(e, n, t) {
  return Math.min(Math.max(e, n), t);
}
function S(e, n, t) {
  return n + (t - n) * e;
}
function M(e, n) {
  return Math.round(e * 10 ** n) / 10 ** n;
}
function E(e) {
  const n = parseFloat(e);
  return e.toString().replace(n.toString(), "");
}
function U(e) {
  return function(n, t, r) {
    return n.map((i) => e(i, t, r));
  };
}
const f = (e, [n = 1, t = 100, r = 10, i = 0] = [], s) => {
  if (e === 0 || e === 1)
    return e;
  n = m(n, 0.1, 1e3), t = m(t, 0.1, 1e3), r = m(r, 0.1, 1e3), i = m(i, 0.1, 1e3);
  const o = Math.sqrt(t / n), a = r / (2 * Math.sqrt(t * n)), c = a < 1 ? o * Math.sqrt(1 - a * a) : 0, u = 1, l = a < 1 ? (a * o + -i) / c : -i + o;
  let g = s ? s * e / 1e3 : e;
  return a < 1 ? g = Math.exp(-g * a * o) * (u * Math.cos(c * g) + l * Math.sin(c * g)) : g = (u + l * g) * Math.exp(-g * o), 1 - g;
}, y = /* @__PURE__ */ new Map(), N = 1e5;
function k([e, n, t, r] = []) {
  let i = [e, n, t, r], s = `${i}`;
  if (y.has(s))
    return y.get(s);
  const o = 1 / 6;
  let a = 0, c = 0, u = 0;
  for (; ++u < N; )
    if (a += o, f(a, i, null) === 1) {
      if (c++, c >= 16)
        break;
    } else
      c = 0;
  const l = a * o * 1e3;
  return y.set(s, l), l;
}
function I(e) {
  return (n, t = [], r) => 1 - e(1 - n, t, r);
}
function x(e) {
  return function(n, t = [], r) {
    return n < 0.5 ? e(n * 2, t, r) / 2 : 1 - e(n * -2 + 2, t, r) / 2;
  };
}
function j(e) {
  return function(n, t = [], r) {
    return n < 0.5 ? (1 - e(1 - n * 2, t, r)) / 2 : (e(n * 2 - 1, t, r) + 1) / 2;
  };
}
const A = f, L = I(f), $ = x(f), q = j(f);
function b(e, n, t = 3) {
  const r = n.length - 1, i = m(Math.floor(e * r), 0, r - 1), s = n[i], o = n[i + 1], a = (e - i / r) * r;
  return M(S(a, s, o), t);
}
function d(e, n) {
  const t = n.length - 1;
  e = m(e, 0, 1);
  const r = Math.round(e * t);
  return n[r];
}
const _ = d;
function P(e, n, t = 3) {
  let r = "";
  return F(n[0]) && (r = E(n[0])), b(
    e,
    n.map((i) => typeof i == "number" ? i : parseFloat(i)),
    t
  ) + r;
}
function T(e, n, t = 3) {
  return n.every((s) => typeof s == "number") ? b(e, n, t) : n.every((s) => F(s)) ? P(e, n, t) : d(e, n);
}
let p = {
  spring: f,
  "spring-in": A,
  "spring-out": L,
  "spring-in-out": $,
  "spring-out-in": q
}, O = Object.keys(p);
function z(e, n) {
  p = { ...p, [e]: n }, O = Object.keys(p);
}
function B(e) {
  p = { ...p, ...e }, O = Object.keys(p);
}
function C(e) {
  const n = /(\(|\s)([^)]+)\)?/.exec(e.toString());
  return n ? n[2].split(",").map((t) => {
    let r = parseFloat(t);
    return Number.isNaN(r) ? t.trim() : r;
  }) : [];
}
function w(e = {}) {
  const n = typeof e == "string" || Array.isArray(e) && typeof e[0] == "function";
  let {
    easing: t = [f, 1, 100, 10, 0],
    numPoints: r = 100,
    decimal: i = 3
  } = n ? { easing: e } : e;
  if (typeof t == "string") {
    const s = p[t.replace(/(\(|\s).+/, "").toLowerCase().trim()], o = C(t);
    t = [s, ...o];
  }
  return { easing: t, numPoints: r, decimal: i };
}
const h = /* @__PURE__ */ new Map();
function D(e = {}) {
  let {
    easing: n,
    numPoints: t
  } = w(e);
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
  const s = `${i},${t}`;
  if (h.has(s)) {
    let u = h.get(s);
    if (u.has(r))
      return u.get(r);
  }
  const o = [], a = k(i);
  for (let u = 0; u < t; u++)
    o[u] = r(u / (t - 1), i, a);
  const c = h.has(s) ? h.get(s) : /* @__PURE__ */ new WeakMap();
  return c.set(r, [o, a]), h.set(s, c), [o, a];
}
function G(e, n = {}, t = T) {
  const r = w(n), [i, s] = D(r);
  return [
    i.map((o) => t(o, e, r.decimal)),
    s
  ];
}
export {
  x as EaseInOut,
  I as EaseOut,
  j as EaseOutIn,
  y as EasingDurationCache,
  O as EasingFunctionKeys,
  p as EasingFunctions,
  w as EasingOptions,
  h as FramePtsCache,
  D as GenerateSpringFrames,
  N as INFINITE_LOOP_LIMIT,
  G as SpringEasing,
  f as SpringFrame,
  A as SpringInFrame,
  $ as SpringInOutFrame,
  L as SpringOutFrame,
  q as SpringOutInFrame,
  G as default,
  k as getSpringDuration,
  E as getUnit,
  T as interpolateComplex,
  b as interpolateNumber,
  d as interpolateSequence,
  P as interpolateString,
  _ as interpolateUsingIndex,
  F as isNumberLike,
  m as limit,
  C as parseEasingParameters,
  z as registerEasingFunction,
  B as registerEasingFunctions,
  S as scale,
  U as toAnimationFrames,
  M as toFixed
};
