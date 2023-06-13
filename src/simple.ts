import type { 
  TypeArrayFrameFunctionFormat, 
  TypeEasingOptions, 
  TypeInterpolationFunction, 
} from "./mod.ts";

import { 
  EaseInOut, 
  EaseOut, 
  EaseOutIn, 
  EasingFunctions, 
  SpringFrame,
} from "./mod.ts";

import {
  FramePtsCache,
  interpolateComplex,
  parseEasingParameters,
} from "./mod.ts";

import { INFINITE_LOOP_LIMIT, EasingDurationCache } from "./mod.ts";

/**
 * The format to use when defining simple custom frame functions
 * An example of a frame function is {@link SimpleSpringFrame}
 *
 * _**Note**: Be very careful of only setting some of the spring parameters, it can cause errors if you are not careful_
 *
 * @source Source code of `TypeFrameFunction`
 *
 * @param t time value between 0 & 1
 * @param spring-parameters
 *  - dampingRatio = This is a dimensionless measure of damping in the system. It is the ratio of the damping coefficient in the system to the critical damping coefficient. It defines how oscillations in the system decay after a disturbance:
 *    - dampingRatio < 1: the system is underdamped, it oscillates and slowly returns to equilibrium.
 *    - dampingRatio = 1: the system is critically damped, it returns to equilibrium as quickly as possible without oscillating.
 *    - dampingRatio > 1: the system is overdamped, it returns to equilibrium without oscillating but slower than the critically damped case.
 *  - response = - This is the time taken for the system to cover a significant portion of the total distance to the new state (without taking into account any oscillation that may happen). Essentially, it controls the speed of the animation.
 *  - velocity = initial velocity of spring
 *  - mass = mass of object
 * 
 * @returns a single frame of the frame function at the time specified
 */
export type TypeSimpleFrameFunction = (
  t: number,
  [dampingRatio, response, velocity, mass]?: number[],
  _?: number
) => number;

/**
 * Spring easing function.
 *
 * @param t - The current time (or position) of the animation, from 0 to 1.
 * @param spring-parameters
 *  - dampingRatio = This is a dimensionless measure of damping in the system. It is the ratio of the damping coefficient in the system to the critical damping coefficient. It defines how oscillations in the system decay after a disturbance:
 *    - dampingRatio < 1: the system is underdamped, it oscillates and slowly returns to equilibrium.
 *    - dampingRatio = 1: the system is critically damped, it returns to equilibrium as quickly as possible without oscillating.
 *    - dampingRatio > 1: the system is overdamped, it returns to equilibrium without oscillating but slower than the critically damped case.
 *  - response = - This is the time taken for the system to cover a significant portion of the total distance to the new state (without taking into account any oscillation that may happen). Essentially, it controls the speed of the animation.
 *  - velocity = initial velocity of spring
 *  - mass = mass of object
 *
 * @returns The eased value.
 */
export const SimpleSpringFrame: TypeSimpleFrameFunction = (
  t,
  [dampingRatio = 0.5, response = 0.1, velocity = 0, mass = 1] = [],
) => {  
  // Calculate stiffness from response
  const stiffness = 1 / Math.pow(response, 2) * mass;

  // Calculate damping from dampingRatio and stiffness
  const damping = dampingRatio * 2 * Math.sqrt(stiffness * mass);

  return SpringFrame(t, [mass, stiffness, damping, velocity]); // , response * 1000
}

/**
 * The spring easing function will only look smooth at certain durations, with certain parameters.
 * This functions returns the optimal duration to create a smooth springy animation based on physics

 * @param spring-parameters
 *  - dampingRatio = This is a dimensionless measure of damping in the system. It is the ratio of the damping coefficient in the system to the critical damping coefficient. It defines how oscillations in the system decay after a disturbance:
 *    - dampingRatio < 1: the system is underdamped, it oscillates and slowly returns to equilibrium.
 *    - dampingRatio = 1: the system is critically damped, it returns to equilibrium as quickly as possible without oscillating.
 *    - dampingRatio > 1: the system is overdamped, it returns to equilibrium without oscillating but slower than the critically damped case.
 *  - response = - This is the time taken for the system to cover a significant portion of the total distance to the new state (without taking into account any oscillation that may happen). Essentially, it controls the speed of the animation.
 *  - velocity = initial velocity of spring
 *  - mass = mass of object
 * 
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
export function getSimpleSpringDuration([dampingRatio = 0.5, response = 0.1, velocity = 0, mass = 1]: number[] = []): number[] {
  // Calculate stiffness from response
  const stiffness = 1 / Math.pow(response, 2) * mass;

  // Calculate damping from dampingRatio and stiffness
  const damping = dampingRatio * 2 * Math.sqrt(stiffness * mass);

  let params = [mass, stiffness, damping, velocity];
  let easing = `${params}`;
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
    if (Math.abs(1 - SpringFrame(time, params)) < 0.001) {

      let restStart = time;
      let restSteps = 1;

      while (++numPoints < INFINITE_LOOP_LIMIT) {
        time += step;

        if (Math.abs(1 - SpringFrame(time, params)) >= 0.001) break;
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
    easing = [SimpleSpringFrame, 0.5, 0.1, 0, 1],
    numPoints,
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
 *  easing: [SimpleSpringOutInFrame, 0.5, 0.1, 0, 1],
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
export function GenerateSimpleSpringFrames(options: TypeEasingOptions = {}) {
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

  const points: number[] = new Array(numPoints);
  for (let i = 0; i < numPoints; i++) {
    points[i] = frameFunction(i / (numPoints - 1), params, idealDuration);
  }

  const tempObj = FramePtsCache.has(key) ? FramePtsCache.get(key)! : new WeakMap();
  tempObj.set(frameFunction, [points, idealDuration]);
  FramePtsCache.set(key, tempObj);
  return [points, idealDuration] as const;
}

/**
 * Generates an Array of values using frame functions which in turn create the effect of spring easing.
 * To use this properly make sure to set the easing animation option to "linear".
 * Check out a demo of SpringEasing at <https://codepen.io/okikio/pen/MWEdzNg>
 *
 * SimpleSpringEasing has 3 properties they are `easing` (all the easings from {@link EasingFunctions} are supported on top of frame functions like SpringFrame, SpringFrameOut, etc..), `numPoints` (the size of the Array the frame function should create), and `decimal` (the number of decimal places of the values within said Array).
 *
 * | Properties  | Default Value                                              |
 * | ----------- | ---------------------------------------------------------- |
 * | `easing`    | `simple-spring(0.5, 0.1, 0, 1)`                            |
 * | `numPoints` | `50`                                                       |
 * | `decimal`   | `3`                                                        |
 *
 * By default, Spring Easing support easings in the form,
 *
 * | constant | accelerate                       | decelerate        | accelerate-decelerate | decelerate-accelerate |
 * | :------- | :------------------------------- | :---------------- | :-------------------- | :-------------------- |
 * |          | simple-spring / simple-spring-in | simple-spring-out | simple-spring-in-out  | simple-spring-out-in  |
 *
 * All **Spring** easing's can be configured using theses parameters,
 *
 * `"simple-spring-*(dampingRatio, response, velocity, mass)"` or
 * `[SimpleSpringOutFrame, dampingRatio, response, velocity, mass]`
 *
 * Each parameter comes with these defaults
 *
 * | Parameter.      | Default Value |
 * | --------------- | ------------- |
 * | dampingRatio    | `0.5`         |
 * | response        | `0.1`         |
 * | velocity        | `0`           |
 * | mass            | `1`           |
 *
 *  e.g.
 *  ```ts
 *  import { SimpleSpringEasing, SimpleSpringOutFrame } from "spring-easing";
 *  import anime from "animejs";
 *
 *  // Note: this is the return value of {@link SimpleSpringEasing} and {@link SimpleGenerateSpringFrames}, you don't need the object to get this format
 *  let [translateX, duration] = SimpleSpringEasing([0, 250], {
 *    easing: "simple-spring-out-in(0.5, 0.1, 0, 1)",
 *
 *    // You can change the size of Array for the SimpleSpringEasing function to generate
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
 *    rotate: SimpleSpringEasing(["0turn", 1, 0, 0.5], [SimpleSpringOutFrame, 0.5, 0.1, 0, 1])[0],
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
