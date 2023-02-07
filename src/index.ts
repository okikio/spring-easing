// Adapted from https://github.com/okikio/native/blob/726b26bc3f7a84d2750aa2ffc13572a2a4de905c/packages/animate/src/custom-easing.ts, which is licensed under the MIT license.
// If the above file is removed or modified, you can access the original state in the following GitHub Gist: https://gist.github.com/okikio/bed53ed621cb7f60e9a8b1ef92897471
import type { TypeEasingOptions } from "./easing";
import type { IGenericInterpolationFn } from "./interpolate/index";

import { EasingOptions, getSpringDuration } from "./easing";
import { interpolateNumber } from "./interpolate/index";

export * from "./interpolate/index";
export * from "./utils";

/**
 * Cache generated frame points for commonly used easing functions
 */
export const FramePtsCache = new Map<string, WeakMap<Function, [number[], number]>>();

/**
 * Create an Array of frames using the easing specified.
 * The array size `numPoints` large, which is by default 100.
 * Easing can be use custom defined frame functions, so, instead of string you can use,
 * e.g.
 * ```ts
 * GenerateSpringFrames({
 *     easing: [SpringOutInFrame, 1, 100, 10, 0],
 *     numPoints: 100
 * })
 * ```
 *
 * _**Note**: Be very careful of only setting some of the spring parameters, it can cause errors if you are not careful_
 *
 * @param options Accepts {@link TypeEasingOptions EasingOptions}
 * 
 * Based on https://github.com/w3c/csswg-drafts/issues/229#issuecomment-861415901
 */
export function GenerateSpringFrames(options: TypeEasingOptions = {}): [number[], number] {
  let {
    easing,
    numPoints,
    frameRate
  } = EasingOptions(options);

  if (Array.isArray(easing)) {
    if (typeof easing[0] != "function") {
      throw new Error(
        "[spring-easing] A frame function is required as the first element in the easing array, e.g. [SpringFrame, ...]",
      );
    }

    // Be careful of only setting some of the spring parameters
    if (easing.length > 1 && easing.length < 5)
      console.warn(`[spring-easing] Be careful of only setting some of the spring parameters, you've only set ${5 - easing.length} spring parameter(s). The easing works best in the format: \n* "spring-out(mass, stiffness, damping, velocity)" or \n* [SpringOutFrame, mass, stiffness, damping, velocity].`);

    if (easing.length > 5) {
      console.warn(
        `[spring-easing] You entered ${5 - easing.length
        } more spring parameter(s) than necessary. The easing needs to be in the format: \n* "spring-out(mass, stiffness, damping, velocity)" or \n* [SpringOutFrame, mass, stiffness, damping, velocity].`,
      );
    }
  } else {
    throw new Error(
      `[spring-easing] The easing needs to be in the format:  \n* "spring-out(mass, stiffness, damping, velocity)" or \n* [SpringOutFrame, mass, stiffness, damping, velocity], the easing recieved is "${easing}", [spring-easing] doesn't really know what to do with that.`,
    );
  }

  const [frameFunction, ...params] = easing;
  const key = `${params},${numPoints}`;

  if (FramePtsCache.has(key)) {
    let tempObj = FramePtsCache.get(key);
    if (tempObj.has(frameFunction))
      return tempObj.get(frameFunction);
  }

  const pts: number[] = [];
  const duration = getSpringDuration(params, frameRate);
  
  let i = 0;
  for (; i < numPoints; i++) {
    pts[i] = frameFunction(i / (numPoints - 1), params, duration);
  }

  const tempObj = FramePtsCache.has(key) ? FramePtsCache.get(key) : new WeakMap();
  tempObj.set(frameFunction, [pts, duration]);
  FramePtsCache.set(key, tempObj);
  return [pts, duration];
}

/**
 * Create an Array of frames using the easing specified.
 * The array size `numPoints` large, which is by default 100.
 * Easing can be use custom defined frame functions, so, instead of string you can use,
 * e.g.
 * ```ts
 * GenerateCustomFrames({
 *     easing: [SpringOutInFrame, 1, 100, 10, 0],
 *     numPoints: 100
 * })
 * ```
 *
 * _**Note**: Be very careful of only setting some of the spring parameters, it can cause errors if you are not careful_
 *
 * @param options Accepts {@link TypeEasingOptions EasingOptions}
 * 
 * Based on https://github.com/w3c/csswg-drafts/issues/229#issuecomment-861415901
 */
export function GenerateCustomFrames(options: TypeEasingOptions = {}): [number[], number] {
  let {
    easing,
    numPoints,
    frameRate
  } = EasingOptions(options);

  if (Array.isArray(easing)) {
    if (typeof easing[0] != "function") {
      throw new Error(
        "[spring-easing] A frame function is required as the first element in the easing array, e.g. [SpringFrame, ...]",
      );
    }

    // Be careful of only setting some of the spring parameters
    if (easing.length > 1 && easing.length < 5)
      console.warn(`[spring-easing] Be careful of only setting some of the spring parameters, you've only set ${5 - easing.length} spring parameter(s). The easing works best in the format: \n* "spring-out(mass, stiffness, damping, velocity)" or \n* [SpringOutFrame, mass, stiffness, damping, velocity].`);

    if (easing.length > 5) {
      console.warn(
        `[spring-easing] You entered ${5 - easing.length
        } more spring parameter(s) than necessary. The easing needs to be in the format: \n* "spring-out(mass, stiffness, damping, velocity)" or \n* [SpringOutFrame, mass, stiffness, damping, velocity].`,
      );
    }
  } else {
    throw new Error(
      `[spring-easing] The easing needs to be in the format:  \n* "spring-out(mass, stiffness, damping, velocity)" or \n* [SpringOutFrame, mass, stiffness, damping, velocity], the easing recieved is "${easing}", [spring-easing] doesn't really know what to do with that.`,
    );
  }

  const [frameFunction, ...params] = easing;
  const key = `${params},${numPoints}`;

  if (FramePtsCache.has(key)) {
    let tempObj = FramePtsCache.get(key);
    if (tempObj.has(frameFunction))
      return tempObj.get(frameFunction);
  }

  const pts: number[] = [];
  const duration = getSpringDuration(params, frameRate);

  let i = 0;
  for (; i < numPoints; i++) {
    pts[i] = frameFunction(i / (numPoints - 1), params, duration);
  }

  const tempObj = FramePtsCache.has(key) ? FramePtsCache.get(key) : new WeakMap();
  tempObj.set(frameFunction, [pts, duration]);
  FramePtsCache.set(key, tempObj);
  return [pts, duration];
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
 *  import { SpringEasing, SpringOutFrame } from "spring-easing";
 *  import anime from "animejs";
 *
 *  // Note: this is the return value of {@link SpringEasing} and {@link GenerateSpringFrames}, you don't need the object to get this format
 *  let [translateX, duration] = SpringEasing([0, 250], {
 *      easing: "spring-out-in(1, 100, 10, 0)",
 *
 *      // You can change the size of Array for the SpringEasing function to generate
 *      numPoints: 200,
 *
 *      // The number of decimal places to round, final values in the generated Array
 *      // This option doesn't exist on {@link GenerateSpringFrames}
 *      decimal: 5,
 *  });
 *
 *  anime({
 *    targets: "div",
 *
 *    // Using spring easing animate from [0 to 250] using `spring-out-in`
 *    translateX,
 *
 *    // You can set the easing without an object
 *    rotate: SpringEasing(["0turn", 1, 0, 0.5], [SpringOutFrame, 1, 100, 10, 0])[0],
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
export function SpringEasing<T, TInterpolationFn>(
  values: T[],
  options: TypeEasingOptions | TypeEasingOptions["easing"] = {},
  customInterpolate: IGenericInterpolationFn<number> = interpolateNumber
) {
  const optionsObj = EasingOptions(options);
  const [frames, duration] = GenerateSpringFrames(optionsObj);

  return [
    frames.map(t => customInterpolate(t, values, optionsObj.decimal)),
    duration
  ] as const;
}

export default SpringEasing;
