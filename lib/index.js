!function(e, t) {
    "object" == typeof exports && "undefined" != typeof module
        ? t(exports)
        : "function" == typeof define && define.amd
        ? define(["exports"], t)
        : t((e = "undefined" != typeof globalThis ? globalThis : e || self).SpringEasing = {});
}(this, function(e) {
    "use strict";
    const t = (e, t, n) => Math.min(Math.max(e, t), n),
        n = (e, [n = 1, r = 100, i = 10, s = 0] = [], a) => {
            n = t(n, .1, 1e3), r = t(r, .1, 1e3), i = t(i, .1, 1e3), s = t(s, .1, 1e3);
            const o = Math.sqrt(r / n),
                g = i / (2 * Math.sqrt(r * n)),
                p = g < 1 ? o * Math.sqrt(1 - g * g) : 0,
                u = g < 1 ? (g * o - s) / p : -s + o;
            let f = a ? a * e / 1e3 : e;
            return f = g < 1
                ? Math.exp(-f * g * o) * (1 * Math.cos(p * f) + u * Math.sin(p * f))
                : (1 + u * f) * Math.exp(-f * o),
                0 === e || 1 === e ? e : 1 - f;
        },
        r = new Map(),
        i = 1e5,
        s = ([e, t, s, a] = []) => {
            let o = [e, t, s, a], g = `${o}`;
            if (r.has(g)) return r.get(g);
            const p = 1 / 6;
            let u = 0, f = 0, l = 0;
            for (; ++l < i;) {
                if (u += p, 1 === n(u, o, null)) if (f++, f >= 16) break;
                else f = 0;
            }
            const m = u * p * 1e3;
            return r.set(g, m), m;
        },
        a = e => (t, n = [], r) => 1 - e(1 - t, n, r),
        o = e => (t, n = [], r) => t < .5 ? e(2 * t, n, r) / 2 : 1 - e(-2 * t + 2, n, r) / 2,
        g = e => (t, n = [], r) => t < .5 ? (1 - e(1 - 2 * t, n, r)) / 2 : (e(2 * t - 1, n, r) + 1) / 2,
        p = n,
        u = a(n),
        f = o(n),
        l = g(n),
        m = (e, t, n) => t + (n - t) * e,
        h = (e, t) => Math.round(e * 10 ** t) / 10 ** t,
        c = (e, n, r = 3) => {
            let i = n.length - 1, s = t(Math.floor(e * i), 0, i - 1), a = n[s], o = n[s + 1];
            return h(m((e - s / i) * i, a, o), r);
        },
        d = { spring: n, "spring-in": p, "spring-out": u, "spring-in-out": f, "spring-out-in": l },
        y = e => {
            const t = /(\(|\s)([^)]+)\)?/.exec(e.toString());
            return t
                ? t[2].split(",").map(e => {
                    let t = parseFloat(e);
                    return Number.isNaN(t) ? e.trim() : t;
                })
                : [];
        },
        M = (e = {}) => {
            let t = "string" == typeof e || Array.isArray(e) && "function" == typeof e,
                { easing: r = [n, 1, 100, 10, 0], numPoints: i = 100, decimal: s = 3 } = t ? { easing: e } : e;
            if ("string" == typeof r) {
                let e = d[r.replace(/(\(|\s).+/, "").toLowerCase().trim()];
                r = [e, ...y(r)];
            }
            if (!Array.isArray(r)) {
                throw new Error(
                    `[spring-easing] The easing needs to be in the format:  \n* "spring-out(mass, stiffness, damping, velocity)" or \n* [SpringOutFrame, mass, stiffness, damping, velocity], the easing recieved is "${r}", [spring-easing] doesn't really know what to do with that.`,
                );
            }
            if ("function" != typeof r[0]) {
                throw new Error(
                    "[spring-easing] A frame function is required as the first element in the easing array, e.g. [SpringFrame, ...]",
                );
            }
            return r.length > 5
                && console.warn(
                    `[spring-easing] You entered ${
                        5 - r.length
                    } more spring parameter(s) than necessary. The easing needs to be in the format: \n* "spring-out(mass, stiffness, damping, velocity)" or \n* [SpringOutFrame, mass, stiffness, damping, velocity].`,
                ),
                { easing: r, numPoints: i, decimal: s };
        },
        F = new Map(),
        S = (e = {}) => {
            let { easing: t, numPoints: n } = M(e);
            const r = `${t}${n}`;
            if (F.has(r)) return F.get(r);
            const i = [];
            let [a, ...o] = t, g = s(o);
            for (let e = 0; e < n; e++) i[e] = a(e / (n - 1), o, g);
            return F.set(r, i), [i, g];
        },
        E = (e, t = {}) => {
            let n = M(t), [r, i] = S(n);
            return [r.map(t => c(t, e, n.decimal)), i];
        };
    e.EaseInOut = o,
        e.EaseOut = a,
        e.EaseOutIn = g,
        e.EasingDurationCache = r,
        e.EasingFunctions = d,
        e.EasingOptions = M,
        e.FramePtsCache = F,
        e.GenerateSpringFrames = S,
        e.INTINITE_LOOP_LIMIT = i,
        e.SpringEasing = E,
        e.SpringFrame = n,
        e.SpringInFrame = p,
        e.SpringInOutFrame = f,
        e.SpringOutFrame = u,
        e.SpringOutInFrame = l,
        e.default = E,
        e.getSpringDuration = s,
        e.interpolateNumber = c,
        e.limit = t,
        e.parseEasingParameters = y,
        e.scale = m,
        e.toFixed = h,
        Object.defineProperty(e, "__esModule", { value: !0 });
});
