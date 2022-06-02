const limit = (value, min, max) => Math.min(Math.max(value, min), max);
const SpringFrame = (t, [mass = 1, stiffness = 100, damping = 10, velocity = 0] = [], duration) => {
  if (t === 0 || t === 1)
    return t;
  mass = limit(mass, 0.1, 1e3);
  stiffness = limit(stiffness, 0.1, 1e3);
  damping = limit(damping, 0.1, 1e3);
  velocity = limit(velocity, 0.1, 1e3);
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  const wd = zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0;
  const a = 1;
  const b = zeta < 1 ? (zeta * w0 + -velocity) / wd : -velocity + w0;
  let progress = duration ? duration * t / 1e3 : t;
  if (zeta < 1) {
    progress = Math.exp(-progress * zeta * w0) * (a * Math.cos(wd * progress) + b * Math.sin(wd * progress));
  } else {
    progress = (a + b * progress) * Math.exp(-progress * w0);
  }
  return 1 - progress;
};
const EasingDurationCache = /* @__PURE__ */ new Map();
const INFINITE_LOOP_LIMIT = 1e5;
const getSpringDuration = ([mass, stiffness, damping, velocity] = []) => {
  let params = [mass, stiffness, damping, velocity];
  let easing = `${params}`;
  if (EasingDurationCache.has(easing))
    return EasingDurationCache.get(easing);
  const frame = 1 / 6;
  let elapsed = 0;
  let rest = 0;
  let count = 0;
  while (++count < INFINITE_LOOP_LIMIT) {
    elapsed += frame;
    if (SpringFrame(elapsed, params, null) === 1) {
      rest++;
      if (rest >= 16)
        break;
    } else {
      rest = 0;
    }
  }
  const duration = elapsed * frame * 1e3;
  EasingDurationCache.set(easing, duration);
  return duration;
};
const EaseOut = (frame) => {
  return (t, params = [], duration) => 1 - frame(1 - t, params, duration);
};
const EaseInOut = (frame) => {
  return (t, params = [], duration) => t < 0.5 ? frame(t * 2, params, duration) / 2 : 1 - frame(t * -2 + 2, params, duration) / 2;
};
const EaseOutIn = (frame) => {
  return (t, params = [], duration) => {
    return t < 0.5 ? (1 - frame(1 - t * 2, params, duration)) / 2 : (frame(t * 2 - 1, params, duration) + 1) / 2;
  };
};
const SpringInFrame = SpringFrame;
const SpringOutFrame = EaseOut(SpringFrame);
const SpringInOutFrame = EaseInOut(SpringFrame);
const SpringOutInFrame = EaseOutIn(SpringFrame);
const scale = (t, start, end) => start + (end - start) * t;
const toFixed = (value, decimal) => Math.round(value * 10 ** decimal) / 10 ** decimal;
const interpolateNumber = (t, values, decimal = 3) => {
  let n = values.length - 1;
  let i = limit(Math.floor(t * n), 0, n - 1);
  let start = values[i];
  let end = values[i + 1];
  let progress = (t - i / n) * n;
  return toFixed(scale(progress, start, end), decimal);
};
const isNumberLike = (num) => {
  let value = parseFloat(num);
  return typeof value == "number" && !Number.isNaN(value);
};
const interpolateUsingIndex = (t, values) => {
  t = limit(t, 0, 1);
  let n = values.length - 1;
  let i = Math.round(t * n);
  return values[i];
};
const getUnit = (str) => {
  let num = parseFloat(str);
  return str.toString().replace(num.toString(), "");
};
const interpolateString = (t, values, decimal = 3) => {
  let units = "";
  if (isNumberLike(values[0]))
    units = getUnit(values[0]);
  return interpolateNumber(t, values.map((v) => typeof v == "number" ? v : parseFloat(v)), decimal) + units;
};
const interpolateComplex = (t, values, decimal = 3) => {
  let isNumber = values.every((v) => typeof v == "number");
  if (isNumber)
    return interpolateNumber(t, values, decimal);
  let isLikeNumber = values.every((v) => isNumberLike(v));
  if (isLikeNumber) {
    if (isLikeNumber) {
      if (isLikeNumber)
        return interpolateString(t, values, decimal);
    }
  }
  return interpolateUsingIndex(t, values);
};
const EasingFunctions = {
  spring: SpringFrame,
  "spring-in": SpringInFrame,
  "spring-out": SpringOutFrame,
  "spring-in-out": SpringInOutFrame,
  "spring-out-in": SpringOutInFrame
};
const parseEasingParameters = (str) => {
  const match = /(\(|\s)([^)]+)\)?/.exec(str.toString());
  return match ? match[2].split(",").map((value) => {
    let num = parseFloat(value);
    return !Number.isNaN(num) ? num : value.trim();
  }) : [];
};
const EasingOptions = (options = {}) => {
  let isEasing = typeof options == "string" || Array.isArray(options) && typeof options[0] == "function";
  let {
    easing = [SpringFrame, 1, 100, 10, 0],
    numPoints = 100,
    decimal = 3
  } = isEasing ? { easing: options } : options;
  if (typeof easing == "string") {
    let frameFunction = EasingFunctions[easing.replace(/(\(|\s).+/, "").toLowerCase().trim()];
    let params = parseEasingParameters(easing);
    easing = [frameFunction, ...params];
  }
  return { easing, numPoints, decimal };
};
const FramePtsCache = /* @__PURE__ */ new Map();
const GenerateSpringFrames = (options = {}) => {
  let {
    easing,
    numPoints
  } = EasingOptions(options);
  if (Array.isArray(easing)) {
    if (typeof easing[0] != "function") {
      throw new Error("[spring-easing] A frame function is required as the first element in the easing array, e.g. [SpringFrame, ...]");
    }
    if (easing.length > 1 && easing.length < 5)
      console.warn(`[spring-easing] Be careful of only setting some of the spring parameters, you've only set ${5 - easing.length} spring parameter(s). The easing works best in the format: 
* "spring-out(mass, stiffness, damping, velocity)" or 
* [SpringOutFrame, mass, stiffness, damping, velocity].`);
    if (easing.length > 5) {
      console.warn(`[spring-easing] You entered ${5 - easing.length} more spring parameter(s) than necessary. The easing needs to be in the format: 
* "spring-out(mass, stiffness, damping, velocity)" or 
* [SpringOutFrame, mass, stiffness, damping, velocity].`);
    }
  } else {
    throw new Error(`[spring-easing] The easing needs to be in the format:  
* "spring-out(mass, stiffness, damping, velocity)" or 
* [SpringOutFrame, mass, stiffness, damping, velocity], the easing recieved is "${easing}", [spring-easing] doesn't really know what to do with that.`);
  }
  let [frameFunction, ...params] = easing;
  const key = `${params},${numPoints}`;
  if (FramePtsCache.has(key)) {
    let tempObj2 = FramePtsCache.get(key);
    if (tempObj2.has(frameFunction))
      return tempObj2.get(frameFunction);
  }
  const pts = [];
  let duration = getSpringDuration(params);
  for (let i = 0; i < numPoints; i++) {
    pts[i] = frameFunction(i / (numPoints - 1), params, duration);
  }
  let tempObj = FramePtsCache.has(key) ? FramePtsCache.get(key) : /* @__PURE__ */ new WeakMap();
  tempObj.set(frameFunction, [pts, duration]);
  FramePtsCache.set(key, tempObj);
  return [pts, duration];
};
const SpringEasing = (values, options = {}, customInterpolate = interpolateComplex) => {
  let optionsObj = EasingOptions(options);
  let [frames, duration] = GenerateSpringFrames(optionsObj);
  return [
    frames.map((t) => customInterpolate(t, values, optionsObj.decimal)),
    duration
  ];
};
export { EaseInOut, EaseOut, EaseOutIn, EasingDurationCache, EasingFunctions, EasingOptions, FramePtsCache, GenerateSpringFrames, INFINITE_LOOP_LIMIT, SpringEasing, SpringFrame, SpringInFrame, SpringInOutFrame, SpringOutFrame, SpringOutInFrame, SpringEasing as default, getSpringDuration, getUnit, interpolateComplex, interpolateNumber, interpolateString, interpolateUsingIndex, isNumberLike, limit, parseEasingParameters, scale, toFixed };
