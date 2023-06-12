import type { 
  TypeArrayFrameFunctionFormat, 
  TypeEasingOptions, 
  TypeInterpolationFunction, 
} from "./mod.ts";

import { 
  FramePtsCache,
  EaseInOut, 
  EaseOut, 
  EaseOutIn, 
  EasingFunctions, 
  interpolateComplex, 
  parseEasingParameters 
} from "./mod.ts";

import { INFINITE_LOOP_LIMIT, EasingDurationCache, SpringFrame } from "./mod.ts";

/**
 * The format to use when defining simple custom frame functions
 * An example of a frame function is {@link SimpleSpringFrame}
 *
 * @source Source code of `TypeFrameFunction`
 *
 * @param t time value between 0 & 1
 * @param spring-parameters
 *  - bounce = number between -1 & 1 representing bounciness of the spring
 *  - velocity = initial velocity of spring
 * @param duration (optional) the maximum duration (in milliseconds) required for a spring (with its specified spring parameters) to reach a resting position. It's used to ensure the progress of all spring frames put together are smooth
 * @returns a single frame of the frame function at the time specified
 *
 * _**Note**: Be very careful of only setting some of the spring parameters, it can cause errors if you are not careful_
 */
export type TypeSimpleFrameFunction = (
  t: number,
  [bounce, velocity]?: number[],
  duration?: number,
) => number;

/**
 
mass = 1

stiffness = (2π ÷ duration)^2

damping = 1 - 4π × bounce ÷ duration, bounce ≥ 0
          4π ÷ (duration + 4π × bounce), bounce < 0

 */
/**
 * Generates a single frame of the spring easing at a specific time between (0 to 1) with the spring parameters given [bounce, velocity]
 *
 * @param t time value between 0 & 1
 * @param spring-parameters (limit of -1 to 1)
 *  - bounce = number between -1 & 1 representing bounciness of the spring
 *  - velocity = initial velocity of spring
 * @param duration (optional) the maximum duration (in milliseconds) required for a spring (with its specified spring parameters) to reach a resting position. It's used to ensure the progress of all spring frames put together are smooth
 * @returns a single frame of the spring easing at the time specified
 *
 * _**Note**: Be very careful of only setting some of the spring parameters, it can cause errors if you are not careful_
 *
 * Based on [animejs](https://github.com/juliangarnier/anime/blob/3ebfd913a04f7dc59cc3d52e38275272a5a12ae6/src/index.js#L76)
 */
export const SimpleSpringFrame: TypeSimpleFrameFunction = (
  t,
  [bounce = 0.15, velocity = 0] = [],
  duration,
) => {
  const durationMs = duration // (duration / 1000);// duration ? (duration * t) / 1000 : t;

  // const w0 = Math.sqrt(stiffness / mass);
  // const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  // const wd = zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0;
  // const b = zeta < 1 ? (zeta * w0 + -velocity) / wd : -velocity + w0;

  // let position = duration ? (duration * t) / 1000 : t;
  // if (zeta < 1) {
  //   position = Math.exp(-position * zeta * w0)
  //     * (Math.cos(wd * position) + b * Math.sin(wd * position));
  // } else {
  //   position = (1 + b * position) * Math.exp(-position * w0);
  // }
  // if (bounce ≥ 0) 1 - 4π × bounce ÷ duration = 10
  // if (bounce < 0) 4π ÷ (duration + 4π × bounce)
  // 

  const mass = 1;
  const stiffness = Math.pow((Math.PI * 2) / durationMs, 2);
  const damping = bounce >= 0 ? 
    1 - ((4 * Math.PI) * bounce / durationMs) :
    (4 * Math.PI) / (durationMs + (4 * Math.PI) * bounce);

  return SpringFrame(t, [mass, stiffness, damping, velocity], durationMs);
}

/**
 * The spring easing function will only look smooth at certain durations, with certain parameters.
 * This functions returns the optimal duration to create a smooth springy animation based on physics

 * @param spring-parameters
 *  - bounce = number between -1 & 1 representing bounciness of the spring
 *  - velocity = initial velocity of spring
 * @return [
 *  `duration` = optimal duration for spring easings, 
 *  `numPoints` = optimal num. of points to represent the spring easing
 * ]
 *
 * _**Note**: Be very careful of only setting some of the spring parameters, it can cause errors if you are not careful_
 *
 * Based on a function of the same name in [animejs](https://github.com/juliangarnier/anime/blob/3ebfd913a04f7dc59cc3d52e38275272a5a12ae6/src/index.js#L100)
 * Thanks [@jakearchibald](https://gist.github.com/jakearchibald/9718d1b81fe62d1c9655de65df1a55a4) for the help optimizing this
 */
export function getSimpleSpringDuration([bounce, velocity]: number[] = []) {
  let params = [bounce, velocity];
  let easing = `simple-spring-${params}`;
  if (EasingDurationCache.has(easing))
    return EasingDurationCache.get(easing)!;

  const step = 1 / 6;
  let time = 0;

  // The ideal num of pts. required to create a smooth spring-easing
  let numPoints = 0;

  /** 
   * Add a loop limit, to avoid situations with infinite loops 
   * though infinite loops shouldn't occur it's theoretically possible
   * 
   * The goal is to cap the amount of bouncing for spring-easing 
   * to human percivable levels, while determining the ideal 
   * duration of the spring
  */
  while (++numPoints < INFINITE_LOOP_LIMIT) {
    if (Math.abs(1 - SimpleSpringFrame(time, params)) < 0.001) {

      let restStart = time;
      let restSteps = 1;

      while (++numPoints < INFINITE_LOOP_LIMIT) {
        time += step;

        if (Math.abs(1 - SimpleSpringFrame(time, params)) >= 0.001) break;
        restSteps++;

        // Stop the animation once human eyes can no longer percieve the motion
        // it's the same reason `restStart` is used instead of time
        if (restSteps === 16) {
          const duration = restStart * 1000;
          EasingDurationCache.set(easing, [duration, numPoints]);
          return [duration, numPoints];
        }
      }
    }

    time += step;
  }

  const duration = time * 1000;
  EasingDurationCache.set(easing, [duration, numPoints]);
  return [duration, numPoints];
}

/**
 * Alias of {@link SimpleSpringFrame},
 * e.g. "spring in" frame function
 */
export const SimpleSpringInFrame: TypeSimpleFrameFunction = SimpleSpringFrame;

/**
 * "simple-spring-out" frame function where each {@link SimpleSpringFrame} follows an ease `out` pattern
 *
 * _**Note**: Be very careful of only setting some of the spring parameters, it can cause errors if you are not careful_
 *
 * @source Source code of `SimpleSpringOutFrame` 
 */
export const SimpleSpringOutFrame: TypeSimpleFrameFunction = EaseOut(SimpleSpringFrame);

/**
 * "simple-spring-in-out" frame function where each {@link SimpleSpringFrame} follows an ease `in-out` pattern
 *
 * _**Note**: Be very careful of only setting some of the spring parameters, it can cause errors if you are not careful_
 *
 * @source Source code of `SimpleSpringInOutFrame` 
 */
export const SimpleSpringInOutFrame: TypeSimpleFrameFunction = EaseInOut(SimpleSpringFrame);

/**
 * "simple-spring-out-in" frame function where each {@link SimpleSpringFrame} follows an ease `out-in` pattern
 *
 * _**Note**: Be very careful of only setting some of the spring parameters, it can cause errors if you are not careful_
 *
 * @source Source code of `SimpleSpringOutInFrame` 
 */
export const SimpleSpringOutInFrame: TypeSimpleFrameFunction = EaseOutIn(SimpleSpringFrame);

/**
 * Returns a {@link TypeEasingOptions} object from a easing "string", or frame function array
 *
 * _**Note**: Be very careful of only setting some of the spring parameters, it can cause errors if you are not careful_
 */
export function SimpleEasingOptions<T extends TypeEasingOptions>(
  options: T | TypeEasingOptions["easing"] = {} as T,
) {
  const isEasing = typeof options === "string" || (Array.isArray(options) && typeof options[0] === "function");
  let {
    easing = [SimpleSpringFrame, 0.15, 0],
    numPoints = 38,
    decimal = 3,
    ...rest
  } = (isEasing ? { easing: options } : options) as T;

  if (typeof easing === "string") {
    const frameFunction = EasingFunctions[
      easing.replace(/(\(|\s).+/, "") // Remove the function brackets and parameters
        .toLowerCase()
      .trim() as keyof typeof EasingFunctions
    ];

    const params = parseEasingParameters(easing);
    easing = [frameFunction, ...params] as TypeArrayFrameFunctionFormat;
  }

  return { easing, numPoints, decimal, ...rest };
}

/**
 * Create an Array of frames using the easing specified.
 * The array size `numPoints` large, which is by default 100.
 * Easing can be use custom defined frame functions, so, instead of string you can use,
 * e.g.
 * ```ts
 * GenerateSimpleSpringFrames({
 *  easing: [SimpleSpringOutInFrame, 0.15, 0],
 *  numPoints: 100
 * })
 * ```
 *
 * _**Note**: Be very careful of only setting some of the spring parameters, it can cause errors if you are not careful_
 *
 * @param options Accepts {@link TypeEasingOptions EasingOptions}
 * 
 * Based on https://github.com/w3c/csswg-drafts/issues/229#issuecomment-861415901
 */
export function GenerateSimpleSpringFrames(options: TypeEasingOptions = {}): [number[], number] {
  let {
    easing,
    numPoints,
  } = SimpleEasingOptions(options);

  if (Array.isArray(easing)) {
    if (typeof easing[0] != "function") {
      throw new Error(
        "[spring-easing] A frame function is required as the first element in the easing array, e.g. [SimpleSpringFrame, ...]",
      );
    }
  } else {
    throw new Error(
      `[spring-easing] The easing needs to be in the format:  \n* "simple-spring-out(bounce, velocity)" or \n* [SimpleSpringOutFrame, bounce, velocity], the easing recieved is "${easing}", [spring-easing] doesn't really know what to do with that.`,
    );
  }

  let [frameFunction, ...params] = easing as TypeArrayFrameFunctionFormat;
  const [idealDuration, idealNumPoints = 38] = getSimpleSpringDuration(params);
  if (!numPoints) numPoints = idealNumPoints;

  const key = `simple-${params},${numPoints}`;
  if (FramePtsCache.has(key)) {
    let tempObj = FramePtsCache.get(key)!;
    if (tempObj.has(frameFunction))
      return tempObj.get(frameFunction)!;
  }

  const points: number[] = [];
  for (let i = 0; i < numPoints; i++) {
    points[i] = frameFunction(i / (numPoints - 1), params, idealDuration);
  }

  const tempObj = FramePtsCache.has(key) ? FramePtsCache.get(key)! : new WeakMap();
  tempObj.set(frameFunction, [points, idealDuration]);
  FramePtsCache.set(key, tempObj);
  return [points, idealDuration];
}

/**
 * Generates an Array of values using frame functions which in turn create the effect of spring easing.
 * To use this properly make sure to set the easing animation option to "linear".
 * Check out a demo of SpringEasing at <https://codepen.io/okikio/pen/MWEdzNg>
 *
 * SpringEasing has 3 properties they are `easing` (all the easings from {@link EasingFunctions} are supported on top of frame functions like SpringFrame, SpringFrameOut, etc..), `numPoints` (the size of the Array the frame function should create), and `decimal` (the number of decimal places of the values within said Array).
 *
 * | Properties  | Default Value           |
 * | ----------- | ----------------------- |
 * | `easing`    | `spring(1, 100, 10, 0)` |
 * | `numPoints` | `50`                    |
 * | `decimal`   | `3`                     |
 *
 * By default, Spring Easing support easings in the form,
 *
 * | constant   | accelerate         | decelerate     | accelerate-decelerate | decelerate-accelerate |
 * | :--------- | :----------------- | :------------- | :-------------------- | :-------------------- |      
 * |            | spring / spring-in | spring-out     | spring-in-out         | spring-out-in         |
 *
 * All **Spring** easing's can be configured using theses parameters,
 *
 * `spring-*(mass, stiffness, damping, velocity)`
 *
 * Each parameter comes with these defaults
 *
 * | Parameter | Default Value |
 * | --------- | ------------- |
 * | mass      | `1`           |
 * | stiffness | `100`         |
 * | damping   | `10`          |
 * | velocity  | `0`           |
 *
 *  e.g.
 *  ```ts
 *  import { SimpleSpringEasing, SimpleSpringOutFrame } from "spring-easing";
 *  import anime from "animejs";
 *
 *  // Note: this is the return value of {@link SimpleSpringEasing} and {@link SimpleGenerateSpringFrames}, you don't need the object to get this format
 *  let [translateX, duration] = SimpleSpringEasing([0, 250], {
 *    easing: "simple-spring-out-in(1, 100, 10, 0)",
 *
 *    // You can change the size of Array for the SpringEasing function to generate
 *    numPoints: 200,
 *
 *    // The number of decimal places to round, final values in the generated Array
 *    // This option doesn't exist on {@link SimpleGenerateSpringFrames}
 *    decimal: 5,
 *  });
 *
 *  anime({
 *    targets: "div",
 *
 *    // Using spring easing animate from [0 to 250] using `simple-spring-out-in`
 *    translateX,
 *
 *    // You can set the easing without an object
 *    rotate: SimpleSpringEasing(["0turn", 1, 0, 0.5], [SimpleSpringOutFrame, 0.15, 0])[0],
 *
 *    // TIP... Use linear easing for the proper effect
 *    easing: "linear",
 *
 *    // The optimal duration for this specific spring
 *    duration
 *  })
 *  ```
 * 
 * @param values Values to animate between, e.g. `["50px", 60]`
 * > _**Note**: You can interpolate with more than 2 values, but it's very confusing, so, it's best to choose 2_
 * @param options Accepts {@link TypeEasingOptions EasingOptions} or {@link TypeEasingOptions["easing"] array frame functions}
 * @param interpolationFunction If you wish to use your own interpolation functions you may
 * @return 
 * ```ts
 * // An array of keyframes that represent said spring animation and
 * // Total duration (in milliseconds) required to create a smooth spring animation
 * [
 *   [50, 55, 60, 70, 80, ...], 
 *   3500 
 * ]
 * ```
 */
export function SimpleSpringEasing<T>(
  values: T[],
  options: TypeEasingOptions | TypeEasingOptions["easing"] = {},
  customInterpolate: TypeInterpolationFunction = interpolateComplex
) {
  const optionsObj = SimpleEasingOptions(options);
  const [frames, duration] = GenerateSimpleSpringFrames(optionsObj);

  return [
    frames.map(t => customInterpolate(t, values, optionsObj.decimal)),
    duration
  ] as const;
}

export default SimpleSpringEasing;
