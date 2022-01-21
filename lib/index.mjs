const e = (e, t, n) => Math.min(Math.max(e, t), n),
    t = (t, [n = 1, s = 100, a = 10, r = 0] = [], i) => {
        n = e(n, .1, 1e3), s = e(s, .1, 1e3), a = e(a, .1, 1e3), r = e(r, .1, 1e3);
        const o = Math.sqrt(s / n),
            g = a / (2 * Math.sqrt(s * n)),
            p = g < 1 ? o * Math.sqrt(1 - g * g) : 0,
            m = g < 1 ? (g * o - r) / p : -r + o;
        let u = i ? i * t / 1e3 : t;
        return u = g < 1
            ? Math.exp(-u * g * o) * (1 * Math.cos(p * u) + m * Math.sin(p * u))
            : (1 + m * u) * Math.exp(-u * o),
            0 === t || 1 === t ? t : 1 - u;
    },
    n = new Map(),
    s = 1e5,
    a = ([e, a, r, i] = []) => {
        let o = [e, a, r, i], g = `${o}`;
        if (n.has(g)) return n.get(g);
        const p = 1 / 6;
        let m = 0, u = 0, l = 0;
        for (; ++l < s;) {
            if (m += p, 1 === t(m, o, null)) if (u++, u >= 16) break;
            else u = 0;
        }
        const h = m * p * 1e3;
        return n.set(g, h), h;
    },
    r = e => (t, n = [], s) => 1 - e(1 - t, n, s),
    i = e => (t, n = [], s) => t < .5 ? e(2 * t, n, s) / 2 : 1 - e(-2 * t + 2, n, s) / 2,
    o = e => (t, n = [], s) => t < .5 ? (1 - e(1 - 2 * t, n, s)) / 2 : (e(2 * t - 1, n, s) + 1) / 2,
    g = t,
    p = r(t),
    m = i(t),
    u = o(t),
    l = (e, t, n) => t + (n - t) * e,
    h = (e, t) => Math.round(e * 10 ** t) / 10 ** t,
    f = (t, n, s = 3) => {
        let a = n.length - 1, r = e(Math.floor(t * a), 0, a - 1), i = n[r], o = n[r + 1];
        return h(l((t - r / a) * a, i, o), s);
    },
    c = { spring: t, "spring-in": g, "spring-out": p, "spring-in-out": m, "spring-out-in": u },
    d = e => {
        const t = /(\(|\s)([^)]+)\)?/.exec(e.toString());
        return t
            ? t[2].split(",").map(e => {
                let t = parseFloat(e);
                return Number.isNaN(t) ? e.trim() : t;
            })
            : [];
    },
    y = (e = {}) => {
        let n = "string" == typeof e || Array.isArray(e) && "function" == typeof e,
            { easing: s = [t, 1, 100, 10, 0], numPoints: a = 100, decimal: r = 3 } = n ? { easing: e } : e;
        if ("string" == typeof s) {
            let e = c[s.replace(/(\(|\s).+/, "").toLowerCase().trim()];
            s = [e, ...d(s)];
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
            { easing: s, numPoints: a, decimal: r };
    },
    M = new Map(),
    F = (e = {}) => {
        let { easing: t, numPoints: n } = y(e);
        const s = `${t}${n}`;
        if (M.has(s)) return M.get(s);
        const r = [];
        let [i, ...o] = t, g = a(o);
        for (let e = 0; e < n; e++) r[e] = i(e / (n - 1), o, g);
        return M.set(s, r), [r, g];
    },
    S = (e, t = {}) => {
        let n = y(t), [s, a] = F(n);
        return [s.map(t => f(t, e, n.decimal)), a];
    };
export {
    a as getSpringDuration,
    c as EasingFunctions,
    d as parseEasingParameters,
    e as limit,
    F as GenerateSpringFrames,
    f as interpolateNumber,
    g as SpringInFrame,
    h as toFixed,
    i as EaseInOut,
    l as scale,
    M as FramePtsCache,
    m as SpringInOutFrame,
    n as EasingDurationCache,
    o as EaseOutIn,
    p as SpringOutFrame,
    r as EaseOut,
    S as default,
    S as SpringEasing,
    s as INTINITE_LOOP_LIMIT,
    t as SpringFrame,
    u as SpringOutInFrame,
    y as EasingOptions,
};
