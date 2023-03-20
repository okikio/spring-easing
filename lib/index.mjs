function d(t) {
  const n = parseFloat(t);
  return typeof n == "number" && !Number.isNaN(n);
}
function m(t, n, e) {
  return Math.min(Math.max(t, n), e);
}
function E(t, n, e) {
  return n + (e - n) * t;
}
function N(t, n) {
  return Math.round(t * 10 ** n) / 10 ** n;
}
function k(t) {
  const n = parseFloat(t);
  return t.toString().replace(n.toString(), "");
}
function _(t) {
  return function(n, e, r) {
    return n.map((i) => t(i, e, r));
  };
}
/*!
 * Spring solver inspired by Webkit Copyright © 2016 Apple Inc. All rights reserved. https://webkit.org/demos/spring/spring.js
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. AND ITS CONTRIBUTORS ``AS IS''
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL APPLE INC. OR ITS CONTRIBUTORS
 * BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
 * THE POSSIBILITY OF SUCH DAMAGE.
*/
const f = (t, [n = 1, e = 100, r = 10, i = 0] = [], o) => {
  n = m(n, 1e-4, 1e3), e = m(e, 1e-4, 1e3), r = m(r, 1e-4, 1e3), i = m(i, 1e-4, 1e3);
  const u = Math.sqrt(e / n), s = r / (2 * Math.sqrt(e * n)), c = s < 1 ? u * Math.sqrt(1 - s * s) : 0, g = s < 1 ? (s * u + -i) / c : -i + u;
  let a = o ? o * t / 1e3 : t;
  return s < 1 ? a = Math.exp(-a * s * u) * (Math.cos(c * a) + g * Math.sin(c * a)) : a = (1 + g * a) * Math.exp(-a * u), 1 - a;
}, h = /* @__PURE__ */ new Map(), F = 1e5;
function I([t, n, e, r] = []) {
  let i = [t, n, e, r], o = `${i}`;
  if (h.has(o))
    return h.get(o);
  const u = 1 / 6;
  let s = 0, c = 0;
  for (; ++c < F; ) {
    if (Math.abs(1 - f(s, i)) < 1e-3) {
      let a = s, y = 1;
      for (; ++c < F && (s += u, !(Math.abs(1 - f(s, i)) >= 1e-3)); )
        if (y++, y === 16) {
          const b = a * 1e3;
          return h.set(o, [b, c]), [b, c];
        }
    }
    s += u;
  }
  const g = s * 1e3;
  return h.set(o, [g, c]), [g, c];
}
function x(t) {
  return (n, e = [], r) => 1 - t(1 - n, e, r);
}
function P(t) {
  return function(n, e = [], r) {
    return n < 0.5 ? t(n * 2, e, r) / 2 : 1 - t(n * -2 + 2, e, r) / 2;
  };
}
function j(t) {
  return function(n, e = [], r) {
    return n < 0.5 ? (1 - t(1 - n * 2, e, r)) / 2 : (t(n * 2 - 1, e, r) + 1) / 2;
  };
}
const A = f, L = x(f), $ = P(f), q = j(f);
function S(t, n, e = 3) {
  const r = n.length - 1, i = m(Math.floor(t * r), 0, r - 1), o = n[i], u = n[i + 1], s = (t - i / r) * r;
  return N(E(s, o, u), e);
}
function w(t, n) {
  const e = n.length - 1;
  t = m(t, 0, 1);
  const r = Math.round(t * e);
  return n[r];
}
const z = w;
function T(t, n, e = 3) {
  let r = "";
  return d(n[0]) && (r = k(n[0])), S(
    t,
    n.map((i) => typeof i == "number" ? i : parseFloat(i)),
    e
  ) + r;
}
function C(t, n, e = 3) {
  return n.every((o) => typeof o == "number") ? S(t, n, e) : n.every((o) => d(o)) ? T(t, n, e) : w(t, n);
}
let p = {
  spring: f,
  "spring-in": A,
  "spring-out": L,
  "spring-in-out": $,
  "spring-out-in": q
}, M = Object.keys(p);
function B(t, n) {
  p = { ...p, [t]: n }, M = Object.keys(p);
}
function G(t) {
  p = { ...p, ...t }, M = Object.keys(p);
}
function D(t) {
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
    numPoints: r = 38,
    decimal: i = 3
  } = n ? { easing: t } : t;
  if (typeof e == "string") {
    const o = p[e.replace(/(\(|\s).+/, "").toLowerCase().trim()], u = D(e);
    e = [o, ...u];
  }
  return { easing: e, numPoints: r, decimal: i };
}
const l = /* @__PURE__ */ new Map();
function U(t = {}) {
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
  const [o, u = 38] = I(i);
  e || (e = u);
  const s = `${i},${e}`;
  if (l.has(s)) {
    let a = l.get(s);
    if (a.has(r))
      return a.get(r);
  }
  const c = [];
  for (let a = 0; a < e; a++)
    c[a] = r(a / (e - 1), i, o);
  const g = l.has(s) ? l.get(s) : /* @__PURE__ */ new WeakMap();
  return g.set(r, [c, o]), l.set(s, g), [c, o];
}
function K(t, n = {}, e = C) {
  const r = O(n), [i, o] = U(r);
  return [
    i.map((u) => e(u, t, r.decimal)),
    o
  ];
}
export {
  P as EaseInOut,
  x as EaseOut,
  j as EaseOutIn,
  h as EasingDurationCache,
  M as EasingFunctionKeys,
  p as EasingFunctions,
  O as EasingOptions,
  l as FramePtsCache,
  U as GenerateSpringFrames,
  F as INFINITE_LOOP_LIMIT,
  K as SpringEasing,
  f as SpringFrame,
  A as SpringInFrame,
  $ as SpringInOutFrame,
  L as SpringOutFrame,
  q as SpringOutInFrame,
  K as default,
  I as getSpringDuration,
  k as getUnit,
  C as interpolateComplex,
  S as interpolateNumber,
  w as interpolateSequence,
  T as interpolateString,
  z as interpolateUsingIndex,
  d as isNumberLike,
  m as limit,
  D as parseEasingParameters,
  B as registerEasingFunction,
  G as registerEasingFunctions,
  E as scale,
  _ as toAnimationFrames,
  N as toFixed
};
