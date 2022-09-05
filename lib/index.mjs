function b(e) {
  let n = parseFloat(e);
  return typeof n == "number" && !Number.isNaN(n);
}
function f(e, n, t) {
  return Math.min(Math.max(e, n), t);
}
function w(e, n, t) {
  return n + (t - n) * e;
}
function M(e, n) {
  return Math.round(e * 10 ** n) / 10 ** n;
}
function S(e) {
  const n = parseFloat(e);
  return e.toString().replace(n.toString(), "");
}
const p = (e, [n = 1, t = 100, r = 10, i = 0] = [], s) => {
  if (e === 0 || e === 1)
    return e;
  n = f(n, 0.1, 1e3), t = f(t, 0.1, 1e3), r = f(r, 0.1, 1e3), i = f(i, 0.1, 1e3);
  const a = Math.sqrt(t / n), o = r / (2 * Math.sqrt(t * n)), u = o < 1 ? a * Math.sqrt(1 - o * o) : 0, c = 1, l = o < 1 ? (o * a + -i) / u : -i + a;
  let g = s ? s * e / 1e3 : e;
  return o < 1 ? g = Math.exp(-g * o * a) * (c * Math.cos(u * g) + l * Math.sin(u * g)) : g = (c + l * g) * Math.exp(-g * a), 1 - g;
}, y = /* @__PURE__ */ new Map(), E = 1e5;
function N([e, n, t, r] = []) {
  let i = [e, n, t, r], s = `${i}`;
  if (y.has(s))
    return y.get(s);
  const a = 1 / 6;
  let o = 0, u = 0, c = 0;
  for (; ++c < E; )
    if (o += a, p(o, i, null) === 1) {
      if (u++, u >= 16)
        break;
    } else
      u = 0;
  const l = o * a * 1e3;
  return y.set(s, l), l;
}
function k(e) {
  return (n, t = [], r) => 1 - e(1 - n, t, r);
}
function I(e) {
  return function(n, t = [], r) {
    return n < 0.5 ? e(n * 2, t, r) / 2 : 1 - e(n * -2 + 2, t, r) / 2;
  };
}
function j(e) {
  return function(n, t = [], r) {
    return n < 0.5 ? (1 - e(1 - n * 2, t, r)) / 2 : (e(n * 2 - 1, t, r) + 1) / 2;
  };
}
const x = p, L = k(p), $ = I(p), A = j(p);
function F(e, n, t = 3) {
  const r = n.length - 1;
  return e.map((i) => {
    const s = f(Math.floor(i * r), 0, r - 1), a = n[s], o = n[s + 1], u = (i - s / r) * r;
    return M(w(u, a, o), t);
  });
}
function P(e, n) {
  const t = n.length - 1;
  return e.map((r) => {
    r = f(r, 0, 1);
    const i = Math.round(r * t);
    return n[i];
  });
}
function T(e, n, t = 3) {
  let r = "";
  return b(n[0]) && (r = S(n[0])), F(
    e,
    n.map((i) => typeof i == "number" ? i : parseFloat(i)),
    t
  ).map((i) => i + r);
}
function q(e, n, t = 3) {
  return n.every((s) => typeof s == "number") ? F(e, n, t) : n.every((s) => b(s)) ? T(e, n, t) : P(e, n);
}
const m = {
  spring: p,
  "spring-in": x,
  "spring-out": L,
  "spring-in-out": $,
  "spring-out-in": A
};
let O = Object.keys(m);
function U(e, n) {
  Object.assign(m, { [e]: n }), O = Object.keys(m);
}
function _(...e) {
  Object.assign(m, ...e), O = Object.keys(m);
}
function C(e) {
  const n = /(\(|\s)([^)]+)\)?/.exec(e.toString());
  return n ? n[2].split(",").map((t) => {
    let r = parseFloat(t);
    return Number.isNaN(r) ? t.trim() : r;
  }) : [];
}
function d(e = {}) {
  const n = typeof e == "string" || Array.isArray(e) && typeof e[0] == "function";
  let {
    easing: t = [p, 1, 100, 10, 0],
    numPoints: r = 100,
    decimal: i = 3
  } = n ? { easing: e } : e;
  if (typeof t == "string") {
    const s = m[t.replace(/(\(|\s).+/, "").toLowerCase().trim()], a = C(t);
    t = [s, ...a];
  }
  return { easing: t, numPoints: r, decimal: i };
}
const h = /* @__PURE__ */ new Map();
function D(e = {}) {
  let {
    easing: n,
    numPoints: t
  } = d(e);
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
    let c = h.get(s);
    if (c.has(r))
      return c.get(r);
  }
  const a = [], o = N(i);
  for (let c = 0; c < t; c++)
    a[c] = r(c / (t - 1), i, o);
  const u = h.has(s) ? h.get(s) : /* @__PURE__ */ new WeakMap();
  return u.set(r, [a, o]), h.set(s, u), [a, o];
}
function z(e, n = {}, t = q) {
  const r = d(n), [i, s] = D(r);
  return [
    t(i, e, r.decimal),
    s
  ];
}
export {
  I as EaseInOut,
  k as EaseOut,
  j as EaseOutIn,
  y as EasingDurationCache,
  O as EasingFunctionKeys,
  m as EasingFunctions,
  d as EasingOptions,
  h as FramePtsCache,
  D as GenerateSpringFrames,
  E as INFINITE_LOOP_LIMIT,
  z as SpringEasing,
  p as SpringFrame,
  x as SpringInFrame,
  $ as SpringInOutFrame,
  L as SpringOutFrame,
  A as SpringOutInFrame,
  z as default,
  N as getSpringDuration,
  S as getUnit,
  q as interpolateComplex,
  F as interpolateNumber,
  T as interpolateString,
  P as interpolateUsingIndex,
  b as isNumberLike,
  f as limit,
  C as parseEasingParameters,
  U as registerEasingFunction,
  _ as registerEasingFunctions,
  w as scale,
  M as toFixed
};
