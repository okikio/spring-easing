import { getUnit, isNumberLike, limit, scale, toFixed } from "./utils";

/**
 * The format to use when defining custom frame functions
 * An example of a frame function is {@link SpringFrame}
 *
 * @source Source code of `TypeFrameFunction`
 *
 * @param t time value between 0 & 1
 * @param spring-parameters
 *  - mass = mass of object
 *  - stiffness = stiffness of spring
 *  - damping = amount to dampen spring motion
 *  - velocity = initial velocity of spring
 * @param duration (optional) the maximum duration (in milliseconds) required for a spring (with its specified spring parameters) to reach a resting position. It's used to ensure the progress of all spring frames put together are smooth
 * @returns a single frame of the frame function at the time specified
 *
 * _**Note**: Be very careful of only setting some of the spring parameters, it can cause errors if you are not careful_
 */
export type TypeFrameFunction = (
  t: number,
  [mass, stiffness, damping, velocity]?: number[],
  duration?: number,
) => number;

/**
 * The threshold for an infinite loop
 *
 * @source Source code of `INFINITE_LOOP_LIMIT`
 */
export const INFINITE_LOOP_LIMIT = 100_000;

/**
 * Frame rate in milliseconds
 */
export const FPS_60 = 1000 / 60;

/**
 * Cache the durations at set easing parameters
 */
export const EasingDurationCache: Map<
  string,
  number
> = new Map();

/**
 * Generates a single frame of the spring easing at a specific time between (0 to 1) with the spring parameters given [mass, stiffness, damping, velocity]
 *
 * @param t time value between 0 & 1
 * @param spring-parameters
 *  - mass = mass of object
 *  - stiffness = stiffness of spring
 *  - damping = amount to dampen spring motion
 *  - velocity = initial velocity of spring
 * @param duration (optional) the maximum duration (in milliseconds) required for a spring (with its specified spring parameters) to reach a resting position. It's used to ensure the progress of all spring frames put together are smooth
 * @returns a single frame of the spring easing at the time specified
 *
 * _**Note**: Be very careful of only setting some of the spring parameters, it can cause errors if you are not careful_
 *
 * Based on [animejs](https://github.com/juliangarnier/anime/blob/3ebfd913a04f7dc59cc3d52e38275272a5a12ae6/src/index.js#L76)
 *
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
export const SpringFrame: TypeFrameFunction = (
  t,
  [mass = 1, stiffness = 100, damping = 10, velocity = 0] = [],
  duration,
) => {
  if (t === 0 || t === 1) return t;

  mass = limit(mass, 0.1, 1000);
  stiffness = limit(stiffness, 0.1, 1000);
  damping = limit(damping, 0.1, 1000);
  velocity = limit(velocity, 0.1, 1000);

  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  const wd = zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0;
  const a = 1;
  const b = zeta < 1 ? (zeta * w0 + -velocity) / wd : -velocity + w0;

  let progress = duration ? (duration * t) / 1000 : t;
  if (zeta < 1) {
    progress = Math.exp(-progress * zeta * w0)
      * (a * Math.cos(wd * progress) + b * Math.sin(wd * progress));
  } else {
    progress = (a + b * progress) * Math.exp(-progress * w0);
  }

  return 1 - progress;
}

/**
 * The spring easing function will only look smooth at certain durations, with certain parameters.
 * This functions returns the optimal duration to create a smooth springy animation based on physics

 * @param spring-parameters
 *  - mass = mass of object
 *  - stiffness = stiffness of spring
 *  - damping = amount to dampen spring motion
 *  - velocity = initial velocity of spring
 * @return (optional) optimal duration for spring easings
 *
 * _**Note**: Be very careful of only setting some of the spring parameters, it can cause errors if you are not careful_
 *
 * Based on a function of the same name in [animejs](https://github.com/juliangarnier/anime/blob/3ebfd913a04f7dc59cc3d52e38275272a5a12ae6/src/index.js#L100)
 */
export function getSpringDuration([mass, stiffness, damping, velocity]: number[] = [], frameRate = FPS_60) {
  const params = [mass, stiffness, damping, velocity];
  const easing = `${params}`;
  if (EasingDurationCache.has(easing))
    return EasingDurationCache.get(easing);

  // In seconds
  let elapsed = 0;

  let rest = 0;
  let count = 0;

  // Add a loop limit, to avoid situations with infinite loops
  while (++count < INFINITE_LOOP_LIMIT) {
    elapsed += frameRate / 1000;
    if (SpringFrame(elapsed, params, null) === 1) {
      rest++;
      if (rest >= 16) break;
    } else {
      rest = 0;
    }
  }

  const duration = elapsed * frameRate;
  EasingDurationCache.set(easing, duration);
  return duration;
}

/**
 * Creates a new frame function where each frame follows an `out` pattern
 *
 * @source Source code of `EaseOut` 
 *
 * @param frame frame function (see {@link TypeFrameFunction}, to learn more about frame functions)
 * @returns A new frame function that represents the ease-out version of the frame function given as an argument
 *
 * Based off of another library, but I can't remember which. If any devs are able to find
 * the source, I'll gladily place a link to the original source here
 */
export function EaseOut(frame: TypeFrameFunction): TypeFrameFunction {
  return (t, params = [], duration) => 1 - frame(1 - t, params, duration);
}

/**
 * Creates a new frame function where each frame follows an `in-out` pattern
 *
 * @param frame frame function (see {@link TypeFrameFunction}, to learn more about frame functions)
 * @returns A new frame function that represents the ease-in-out version of the frame function given as an argument
 *
 * Based off of another library, but I can't remember which. If any devs are able to find
 * the source, I'll gladily place a link to the original source here
 */
export function EaseInOut(frame: TypeFrameFunction): TypeFrameFunction {
  return function (t, params = [], duration) {
    return t < 0.5 ?
      frame(t * 2, params, duration) / 2 :
      1 - frame(t * -2 + 2, params, duration) / 2;
  }
}

/**
 * Creates a new frame function where each frame follows an `out-in` pattern
 *
 * @param frame frame function (see {@link TypeFrameFunction}, to learn more about frame functions)
 * @returns A new frame function that represents the ease-in-out version of the frame function given as an argument
 *
 * Based off of another library, but I can't remember which. If any devs are able to find
 * the source, I'll gladily place a link to the original source here
 */
export function EaseOutIn(frame: TypeFrameFunction): TypeFrameFunction {
  return function (t, params = [], duration) {
    return t < 0.5
      ? (1 - frame(1 - t * 2, params, duration)) / 2
      : (frame(t * 2 - 1, params, duration) + 1) / 2;
  }
}

/**
 * Alias of {@link SpringFrame},
 * e.g. "spring in" frame function
 */
export const SpringInFrame = SpringFrame;

/**
 * "spring-out" frame function where each {@link SpringFrame} follows an ease `out` pattern
 *
 * _**Note**: Be very careful of only setting some of the spring parameters, it can cause errors if you are not careful_
 *
 * @source Source code of `SpringOutFrame` 
 */
export const SpringOutFrame = EaseOut(SpringFrame);

/**
 * "spring-in-out" frame function where each {@link SpringFrame} follows an ease `in-out` pattern
 *
 * _**Note**: Be very careful of only setting some of the spring parameters, it can cause errors if you are not careful_
 *
 * @source Source code of `SpringInOutFrame` 
 */
export const SpringInOutFrame = EaseInOut(SpringFrame);

/**
 * "spring-out-in" frame function where each {@link SpringFrame} follows an ease `out-in` pattern
 *
 * _**Note**: Be very careful of only setting some of the spring parameters, it can cause errors if you are not careful_
 *
 * @source Source code of `SpringOutInFrame` 
 */
export const SpringOutInFrame = EaseOutIn(SpringFrame);

/**
 * The array frame function format for easings,
 * @example
 * `[SpringFrame, mass, stiffness, damping, velocity]`
 */
export type TypeArrayFrameFunctionFormat = [TypeFrameFunction, ...number[]];

/**
 * The list of spring easing functions
 */
export let EasingFunctions = {
  spring: SpringFrame,
  "spring-in": SpringInFrame,
  "spring-out": SpringOutFrame,
  "spring-in-out": SpringInOutFrame,
  "spring-out-in": SpringOutInFrame,
};

export let EasingFunctionKeys = Object.keys(EasingFunctions);

/**
 * Allows you to register new easing functions
 */
export function registerEasingFunction<T extends string>(key: T, fn?: TypeFrameFunction) {
  EasingFunctions = { ...EasingFunctions, [key]: fn };
  EasingFunctionKeys = Object.keys(EasingFunctions);
}

/**
 * Allows you to register multiple new easing functions
 */
export function registerEasingFunctions<T extends Record<string, TypeFrameFunction>>(obj: T) {
  EasingFunctions = { ...EasingFunctions, ...obj };
  EasingFunctionKeys = Object.keys(EasingFunctions);
}

/**
 * The formats supported for easings,
 * @example
 * * `"spring(mass, stiffness, damping, velocity)"`
 * * `"spring-in(mass, stiffness, damping, velocity)"`
 * * `"spring-out(mass, stiffness, damping, velocity)"`
 * * `"spring-in-out(mass, stiffness, damping, velocity)"`
 * * `"spring-out-in(mass, stiffness, damping, velocity)"`
 * `[SpringFrame, mass, stiffness, damping, velocity]`
 */
export type TypeEasings = `${keyof typeof EasingFunctions}` | `${keyof typeof EasingFunctions}(${string})` | (string & {}) | TypeArrayFrameFunctionFormat;

/**
 * Spring Easing has 3 properties they are `easing` (all spring frame functions are supported), `numPoints` (the size of the Array the frmae function should create), and `decimal` (the number of decimal places of the values within said Array).
 *
 * | Properties  | Default Value           |
 * | ----------- | ----------------------- |
 * | `easing`    | `spring(1, 100, 10, 0)` |
 * | `numPoints` | `50`                    |
 * | `decimal`   | `3`                     |
 */
export type TypeEasingOptions = {
  /**
   * By default, Spring Easing support easings in the form,
   *
   * | constant   | accelerate         | decelerate     | accelerate-decelerate | decelerate-accelerate |
   * | :--------- | :----------------- | :------------- | :-------------------- | :-------------------- |
   * |            | spring / spring-in | spring-out     | spring-in-out         | spring-out-in         |
   *
   * All **Spring** easing's can be configured using theses parameters,
   *
   * `"spring-*(mass, stiffness, damping, velocity)"` or
   * `[SpringOutFrame, mass, stiffness, damping, velocity]`
   *
   * Each parameter comes with these defaults
   *
   * | Parameter | Default Value |
   * | --------- | ------------- |
   * | mass      | `1`           |
   * | stiffness | `100`         |
   * | damping   | `10`          |
   * | velocity  | `0`           |
   */
  easing?: TypeEasings;
  numPoints?: number;
  decimal?: number;
  frameRate?: number;
};

/**
 * Convert easing parameters to Array of numbers, e.g. "spring(2, 500)" to [2, 500]
 *
 * Based off of [animejs](https://github.com/juliangarnier/anime/blob/3ebfd913a04f7dc59cc3d52e38275272a5a12ae6/src/index.js#L69)
 */
export function parseEasingParameters(str: string) {
  const match = /(\(|\s)([^)]+)\)?/.exec(str.toString());
  return match
    ? match[2].split(",").map((value) => {
      let num = parseFloat(value);
      return !Number.isNaN(num) ? num : value.trim();
    })
    : [];
}

/**
 * Returns a {@link TypeEasingOptions} object from a easing "string", or frame function array
 *
 * _**Note**: Be very careful of only setting some of the spring parameters, it can cause errors if you are not careful_
 */
export function EasingOptions(
  options: TypeEasingOptions | TypeEasingOptions["easing"] = {},
) {
  const isEasing = typeof options === "string" || (Array.isArray(options) && typeof options[0] === "function");
  let {
    easing = [SpringFrame, 1, 100, 10, 0],
    numPoints = 100,
    decimal = 3,
    frameRate = FPS_60,
  } = (isEasing ? { easing: options } : options) as TypeEasingOptions;

  if (typeof easing === "string") {
    const frameFunction = EasingFunctions[
      easing.replace(/(\(|\s).+/, "") // Remove the function brackets and parameters
        .toLowerCase()
        .trim()
    ];

    const params = parseEasingParameters(easing);
    easing = [frameFunction, ...params] as TypeArrayFrameFunctionFormat;
  }

  return { easing, numPoints, decimal, frameRate };
}