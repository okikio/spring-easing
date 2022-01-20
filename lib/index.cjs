"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 });
const e = (e, t, r) => Math.min(Math.max(e, t), r),
    t = (t, [r = 1, s = 100, n = 10, i = 0] = [], a) => {
        r = e(r, .1, 1e3), s = e(s, .1, 1e3), n = e(n, .1, 1e3), i = e(i, .1, 1e3);
        const o = Math.sqrt(s / r),
            p = n / (2 * Math.sqrt(s * r)),
            g = p < 1 ? o * Math.sqrt(1 - p * p) : 0,
            u = p < 1 ? (p * o - i) / g : -i + o;
        let m = a ? a * t / 1e3 : t;
        return m = p < 1
            ? Math.exp(-m * p * o) * (1 * Math.cos(g * m) + u * Math.sin(g * m))
            : (1 + u * m) * Math.exp(-m * o),
            0 === t || 1 === t ? t : 1 - m;
    },
    r = new Map(),
    s = 1e5,
    n = ([e, n, i, a] = []) => {
        let o = [e, n, i, a], p = `${o}`;
        if (r.has(p)) return r.get(p);
        const g = 1 / 6;
        let u = 0, m = 0, l = 0;
        for (; ++l < s;) {
            if (u += g, 1 === t(u, o, null)) if (m++, m >= 16) break;
            else m = 0;
        }
        const f = u * g * 1e3;
        return r.set(p, f), f;
    },
    i = e => (t, r = [], s) => 1 - e(1 - t, r, s),
    a = e => (t, r = [], s) => t < .5 ? e(2 * t, r, s) / 2 : 1 - e(-2 * t + 2, r, s) / 2,
    o = e => (t, r = [], s) => t < .5 ? (1 - e(1 - 2 * t, r, s)) / 2 : (e(2 * t - 1, r, s) + 1) / 2,
    p = t,
    g = i(t),
    u = a(t),
    m = o(t),
    l = (e, t, r) => t + (r - t) * e,
    f = (e, t) => Math.round(e * 10 ** t) / 10 ** t,
    h = (t, r, s = 3) => {
        let n = r.length - 1, i = e(Math.floor(t * n), 0, n - 1), a = r[i], o = r[i + 1];
        return f(l((t - i / n) * n, a, o), s);
    },
    c = { spring: t, "spring-in": p, "spring-out": g, "spring-in-out": u, "spring-out-in": m },
    x = e => {
        const t = /(\(|\s)([^)]+)\)?/.exec(e.toString());
        return t
            ? t[2].split(",").map(e => {
                let t = parseFloat(e);
                return Number.isNaN(t) ? e.trim() : t;
            })
            : [];
    },
    d = (e = {}) => {
        let r = "string" == typeof e || Array.isArray(e) && "function" == typeof e,
            { easing: s = [t, 1, 100, 10, 0], numPoints: n = 100, decimal: i = 3 } = r ? { easing: e } : e;
        if ("string" == typeof s) {
            let e = c[s.replace(/(\(|\s).+/, "").toLowerCase().trim()];
            s = [e, ...x(s)];
        }
        if (!Array.isArray(s)) {
            throw new Error(
                `[spring-easing] The easing needs to be in the format:  \n* "spring-out(mass, stiffness, damping, velocity)" or \n* [SpringOutFrame, mass, stiffness, damping, velocity], the easing recieved is "${s}", [spring-easing] doesn't really know what to do with that.`,
            );
        }
        if ("function" != typeof s[0]) {
            throw new Error(
                "[spring-easing] A frame function is required as the first element in the easing array, e.g. [SpringFrame, ...]",
            );
        }
        return s.length > 5
            && console.warn(
                `[spring-easing] You entered ${
                    5 - s.length
                } more spring parameter(s) than necessary. The easing needs to be in the format: \n* "spring-out(mass, stiffness, damping, velocity)" or \n* [SpringOutFrame, mass, stiffness, damping, velocity].`,
            ),
            { easing: s, numPoints: n, decimal: i };
    },
    y = new Map(),
    M = (e = {}) => {
        let { easing: t, numPoints: r } = d(e);
        const s = `${t}${r}`;
        if (y.has(s)) return y.get(s);
        const i = [];
        let [a, ...o] = t, p = n(o);
        for (let e = 0; e < r; e++) i[e] = a(e / (r - 1), o, p);
        return y.set(s, i), [i, p];
    },
    F = (e, t = {}) => {
        let r = d(t), [s, n] = M(r);
        return [s.map(t => h(t, e, r.decimal)), n];
    };
exports.EaseInOut = a,
    exports.EaseOut = i,
    exports.EaseOutIn = o,
    exports.EasingDurationCache = r,
    exports.EasingFunctions = c,
    exports.EasingOptions = d,
    exports.FramePtsCache = y,
    exports.GenerateSpringFrames = M,
    exports.INTINITE_LOOP_LIMIT = s,
    exports.SpringEasing = F,
    exports.SpringFrame = t,
    exports.SpringInFrame = p,
    exports.SpringInOutFrame = u,
    exports.SpringOutFrame = g,
    exports.SpringOutInFrame = m,
    exports.default = F,
    exports.getSpringDuration = n,
    exports.interpolateNumber = h,
    exports.limit = e,
    exports.parseEasingParameters = x,
    exports.scale = l,
    exports.toFixed = f;
