function F(t) {
  let n = parseFloat(t);
  return typeof n == "number" && !Number.isNaN(n);
}
function m(t, n, e) {
  return Math.min(Math.max(t, n), e);
}
function w(t, n, e) {
  return n + (e - n) * t;
}
function M(t, n) {
  return Math.round(t * 10 ** n) / 10 ** n;
}
function S(t) {
  const n = parseFloat(t);
  return t.toString().replace(n.toString(), "");
}
function U(t) {
  return function(n, e, r) {
    return n.map((i) => t(i, e, r));
  };
}
const f = (t, [n = 1, e = 100, r = 10, i = 0] = [], s) => {
  if (t === 0 || t === 1)
    return t;
  n = m(n, 0.1, 1e3), e = m(e, 0.1, 1e3), r = m(r, 0.1, 1e3), i = m(i, 0.1, 1e3);
  const a = Math.sqrt(e / n), o = r / (2 * Math.sqrt(e * n)), u = o < 1 ? a * Math.sqrt(1 - o * o) : 0, c = 1, l = o < 1 ? (o * a + -i) / u : -i + a;
  let g = s ? s * t / 1e3 : t;
  return o < 1 ? g = Math.exp(-g * o * a) * (c * Math.cos(u * g) + l * Math.sin(u * g)) : g = (c + l * g) * Math.exp(-g * a), 1 - g;
}, y = /* @__PURE__ */ new Map(), E = 1e5;
function N([t, n, e, r] = []) {
  let i = [t, n, e, r], s = `${i}`;
  if (y.has(s))
    return y.get(s);
  const a = 1 / 6;
  let o = 0, u = 0, c = 0;
  for (; ++c < E; )
    if (o += a, f(o, i, null) === 1) {
      if (u++, u >= 16)
        break;
    } else
      u = 0;
  const l = o * a * 1e3;
  return y.set(s, l), l;
}
function k(t) {
  return (n, e = [], r) => 1 - t(1 - n, e, r);
}
function I(t) {
  return function(n, e = [], r) {
    return n < 0.5 ? t(n * 2, e, r) / 2 : 1 - t(n * -2 + 2, e, r) / 2;
  };
}
function x(t) {
  return function(n, e = [], r) {
    return n < 0.5 ? (1 - t(1 - n * 2, e, r)) / 2 : (t(n * 2 - 1, e, r) + 1) / 2;
  };
}
const j = f, A = k(f), L = I(f), $ = x(f);
function b(t, n, e = 3) {
  const r = n.length - 1;
  return t.map((i) => {
    const s = m(Math.floor(i * r), 0, r - 1), a = n[s], o = n[s + 1], u = (i - s / r) * r;
    return M(w(u, a, o), e);
  });
}
function P(t, n) {
  const e = n.length - 1;
  return t.map((r) => {
    r = m(r, 0, 1);
    const i = Math.round(r * e);
    return n[i];
  });
}
function T(t, n, e = 3) {
  let r = "";
  return F(n[0]) && (r = S(n[0])), b(
    t,
    n.map((i) => typeof i == "number" ? i : parseFloat(i)),
    e
  ).map((i) => i + r);
}
function q(t, n, e = 3) {
  return n.every((s) => typeof s == "number") ? b(t, n, e) : n.every((s) => F(s)) ? T(t, n, e) : P(t, n);
}
let p = {
  spring: f,
  "spring-in": j,
  "spring-out": A,
  "spring-in-out": L,
  "spring-out-in": $
}, d = Object.keys(p);
function _(t, n) {
  p = { ...p, [t]: n }, d = Object.keys(p);
}
function z(t) {
  p = { ...p, ...t }, d = Object.keys(p);
}
function C(t) {
  const n = /(\(|\s)([^)]+)\)?/.exec(t.toString());
  return n ? n[2].split(",").map((e) => {
    let r = parseFloat(e);
    return Number.isNaN(r) ? e.trim() : r;
  }) : [];
}
function O(t = {}) {
  const n = typeof t == "string" || Array.isArray(t) && typeof t[0] == "function";
  let {
    easing: e = [f, 1, 100, 10, 0],
    numPoints: r = 100,
    decimal: i = 3
  } = n ? { easing: t } : t;
  if (typeof e == "string") {
    const s = p[e.replace(/(\(|\s).+/, "").toLowerCase().trim()], a = C(e);
    e = [s, ...a];
  }
  return { easing: e, numPoints: r, decimal: i };
}
const h = /* @__PURE__ */ new Map();
function D(t = {}) {
  let {
    easing: n,
    numPoints: e
  } = O(t);
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
  if (h.has(s)) {
    let c = h.get(s);
    if (c.has(r))
      return c.get(r);
  }
  const a = [], o = N(i);
  for (let c = 0; c < e; c++)
    a[c] = r(c / (e - 1), i, o);
  const u = h.has(s) ? h.get(s) : /* @__PURE__ */ new WeakMap();
  return u.set(r, [a, o]), h.set(s, u), [a, o];
}
function B(t, n = {}, e = q) {
  const r = O(n), [i, s] = D(r);
  return [
    e(i, t, r.decimal),
    s
  ];
}
export {
  I as EaseInOut,
  k as EaseOut,
  x as EaseOutIn,
  y as EasingDurationCache,
  d as EasingFunctionKeys,
  p as EasingFunctions,
  O as EasingOptions,
  h as FramePtsCache,
  D as GenerateSpringFrames,
  E as INFINITE_LOOP_LIMIT,
  B as SpringEasing,
  f as SpringFrame,
  j as SpringInFrame,
  L as SpringInOutFrame,
  A as SpringOutFrame,
  $ as SpringOutInFrame,
  B as default,
  N as getSpringDuration,
  S as getUnit,
  q as interpolateComplex,
  b as interpolateNumber,
  T as interpolateString,
  P as interpolateUsingIndex,
  F as isNumberLike,
  m as limit,
  C as parseEasingParameters,
  _ as registerEasingFunction,
  z as registerEasingFunctions,
  w as scale,
  U as toAnimationFrames,
  M as toFixed
};
