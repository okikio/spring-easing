// Adapted from https://github.com/okikio/native/blob/beta/packages/animate/src/custom-easing.ts, which is licensed under the MIT license.
// If the above file is removed or modified, you can access the original state in the following GitHub Gist: https://gist.github.com/okikio/bed53ed621cb7f60e9a8b1ef92897471

/**
 * Limit a number to a minimum of `min` and a maximum of `max`
 * @param value number to limit
 * @param min minimum limit
 * @param max maximum limit
 * @returns limited/constrained number
 */
export const limit = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/**
 * The format to use when defining custom frame functions
 * An example of a frame function is {@link SpringFrame}
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

    if (t === 0 || t === 1) return t;
    return 1 - progress;
};

/**
 * Cache the durations at set easing parameters
 */
export const EasingDurationCache: Map<
    string,
    number
> = new Map();

/**
 * The threshold for an infinite loop
 */
export const INFINITE_LOOP_LIMIT = 100_000;

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
export const getSpringDuration = ([mass, stiffness, damping, velocity]: number[] = []) => {
    let params = [mass, stiffness, damping, velocity];
    let easing = `${params}`;
    if (EasingDurationCache.has(easing)) return EasingDurationCache.get(easing);

    const frame = 1 / 6;
    let elapsed = 0;
    let rest = 0;
    let count = 0;

    // Add a loop limit, to avoid situations with infinite loops
    while (++count < INFINITE_LOOP_LIMIT) {
        elapsed += frame;
        if (SpringFrame(elapsed, params, null) === 1) {
            rest++;
            if (rest >= 16) break;
        } else {
            rest = 0;
        }
    }

    const duration = elapsed * frame * 1000;
    EasingDurationCache.set(easing, duration);
    return duration;
};

/**
 * Creates a new frame function where each frame follows an `out` pattern
 *
 * @param frame frame function (see {@link TypeFrameFunction}, to learn more about frame functions)
 * @returns A new frame function that represents the ease-out version of the frame function given as an argument
 *
 * Based off of another library, but I can't remember which. If any devs are able to find
 * the source, I'll gladily place a link to the original source here
 */
export const EaseOut = (frame: TypeFrameFunction): TypeFrameFunction => {
    return (t, params = [], duration) => 1 - frame(1 - t, params, duration);
};

/**
 * Creates a new frame function where each frame follows an `in-out` pattern
 *
 * @param frame frame function (see {@link TypeFrameFunction}, to learn more about frame functions)
 * @returns A new frame function that represents the ease-in-out version of the frame function given as an argument
 *
 * Based off of another library, but I can't remember which. If any devs are able to find
 * the source, I'll gladily place a link to the original source here
 */
export const EaseInOut = (frame: TypeFrameFunction): TypeFrameFunction => {
    return (t, params = [], duration) =>
        t < 0.5
            ? frame(t * 2, params, duration) / 2
            : 1 - frame(t * -2 + 2, params, duration) / 2;
};

/**
 * Creates a new frame function where each frame follows an `out-in` pattern
 *
 * @param frame frame function (see {@link TypeFrameFunction}, to learn more about frame functions)
 * @returns A new frame function that represents the ease-in-out version of the frame function given as an argument
 *
 * Based off of another library, but I can't remember which. If any devs are able to find
 * the source, I'll gladily place a link to the original source here
 */
export const EaseOutIn = (frame: TypeFrameFunction): TypeFrameFunction => {
    return (t, params = [], duration) => {
        return t < 0.5
            ? (1 - frame(1 - t * 2, params, duration)) / 2
            : (frame(t * 2 - 1, params, duration) + 1) / 2;
    };
};

/**
 * Alias of {@link SpringFrame},
 * e.g. "spring in" frame function
 */
export const SpringInFrame = SpringFrame;

/**
 * "spring-out" frame function where each {@link SpringFrame} follows an ease `out` pattern
 *
 * _**Note**: Be very careful of only setting some of the spring parameters, it can cause errors if you are not careful_
 */
export const SpringOutFrame = EaseOut(SpringFrame);

/**
 * "spring-in-out" frame function where each {@link SpringFrame} follows an ease `in-out` pattern
 *
 * _**Note**: Be very careful of only setting some of the spring parameters, it can cause errors if you are not careful_
 */
export const SpringInOutFrame = EaseInOut(SpringFrame);

/**
 * "spring-out-in" frame function where each {@link SpringFrame} follows an ease `out-in` pattern
 *
 * _**Note**: Be very careful of only setting some of the spring parameters, it can cause errors if you are not careful_
 */
export const SpringOutInFrame = EaseOutIn(SpringFrame);

/** map `t` from 0 to 1, to `start` to `end` */
export const scale = (t: number, start: number, end: number) => start + (end - start) * t;

/** Rounds numbers to a fixed decimal place */
export const toFixed = (value: number, decimal: number) => Math.round(value * 10 ** decimal) / 10 ** decimal;

/**
  Given an Array of numbers, estimate the resulting number, at a `t` value between 0 to 1

  Basic interpolation works by scaling `t` from 0 - 1, to some start number and end number, in this case lets use
  0 as our start number and 100 as our end number, so, basic interpolation would interpolate between 0 to 100.

  If we use a `t` of 0.5, the interpolated value between 0 to 100, is 50.
  {@link interpolateNumber} takes it further, by allowing you to interpolate with more than 2 values,
  it allows for multiple values.
  E.g. Given an Array of values [0, 100, 0], and a `t` of 0.5, the interpolated value would become 100.

  Based on d3.interpolateBasis [https://github.com/d3/d3-interpolate#interpolateBasis],
  check out the link above for more detail.
*/
export const interpolateNumber = (t: number, values: number[], decimal = 3) => {
    // nth index
    let n = values.length - 1;

    // The current index given t
    let i = limit(Math.floor(t * n), 0, n - 1);

    let start = values[i];
    let end = values[i + 1];
    let progress = (t - i / n) * n;

    return toFixed(scale(progress, start, end), decimal);
};

/** If a value can be converted to a valid number, then it's most likely a number */
export const isNumberLike = (num: string | number) => {
    let value = parseFloat(num as string);
    return typeof value == "number" && !Number.isNaN(value);
};

/** 
  Given an Array of values, find a value using `t` (`t` goes from 0 to 1), by
  using `t` to estimate the index of said value in the array of `values` 

  This is meant for interploating strings that aren't number-like
*/
export const interpolateUsingIndex = (
    t: number,
    values: (string | number)[]
) => {
    // limit `t`, to a min of 0 and a max of 1
    t = limit(t, 0, 1);

    // nth index
    let n = values.length - 1;

    // The current index given t
    let i = Math.round(t * n);
    return values[i];
};

/**
 * Returns the unit of a string, it does this by removing the number in the string
 */
export const getUnit = (str: string | number) => {
    let num = parseFloat(str as string);
    return (str.toString()).replace(num.toString(), "");
};

/** 
  Functions the same way {@link interpolateNumber} works.
  Convert strings to numbers, and then interpolates the numbers,
  at the end if there are units on the first value in the `values` array,
  it will use that unit for the interpolated result.
  Make sure to read {@link interpolateNumber}.
*/
export const interpolateString = (
    t: number,
    values: (string | number)[],
    decimal = 3
) => {
    let units = "";

    // If the first value looks like a number with a unit
    if (isNumberLike(values[0])) units = getUnit(values[0]);
    return (
        interpolateNumber(
            t,
            values.map((v) => (typeof v == "number" ? v : parseFloat(v))),
            decimal
        ) + units
    );
};

/**
  Interpolates all types of values including number, string, color, and complex values. 
  Complex values are values like "10px solid red", that border, and other CSS Properties use.
  Make sure to read {@link interpolateNumber}, and {@link interpolateString}.
*/
export const interpolateComplex = (
    t: number,
    values: (string | number)[],
    decimal = 3
) => {
    // Interpolate numbers
    let isNumber = values.every((v) => typeof v == "number");
    if (isNumber) return interpolateNumber(t, values as number[], decimal);

    // Interpolate strings with numbers, e.g. "5px"
    let isLikeNumber = values.every((v) => isNumberLike(v as string));
    if (isLikeNumber) 
        return interpolateString(t, values as (number | string)[], decimal);

    // Interpolate pure strings, e.g. "inherit", "solid", etc...
    return interpolateUsingIndex(t, values as string[]);
};

/**
 * The array frame function format for easings,
 * @example
 * `[SpringFrame, mass, stiffness, damping, velocity]`
 */
export type TypeArrayFrameFunctionFormat = [TypeFrameFunction, ...number[]];

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
export type TypeEasings = `${keyof typeof EasingFunctions}` | `${keyof typeof EasingFunctions}(${string})` | TypeArrayFrameFunctionFormat;

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
};

/**
 * The list of spring easing functions
 */
export const EasingFunctions = {
    spring: SpringFrame,
    "spring-in": SpringInFrame,
    "spring-out": SpringOutFrame,
    "spring-in-out": SpringInOutFrame,
    "spring-out-in": SpringOutInFrame,
};

/**
 * Convert easing parameters to Array of numbers, e.g. "spring(2, 500)" to [2, 500]
 *
 * Based off of [animejs](https://github.com/juliangarnier/anime/blob/3ebfd913a04f7dc59cc3d52e38275272a5a12ae6/src/index.js#L69)
 */
export const parseEasingParameters = (str: string) => {
    const match = /(\(|\s)([^)]+)\)?/.exec(str.toString());
    return match
        ? match[2].split(",").map((value) => {
            let num = parseFloat(value);
            return !Number.isNaN(num) ? num : value.trim();
        })
        : [];
};

/**
 * Returns a {@link TypeEasingOptions} object from a easing "string", or frame function array
 *
 * _**Note**: Be very careful of only setting some of the spring parameters, it can cause errors if you are not careful_
 */
export const EasingOptions = (
    options: TypeEasingOptions | TypeEasingOptions["easing"] = {},
) => {
    let isEasing = typeof options == "string" || (Array.isArray(options) && typeof options[0] == "function");
    let {
        easing = [SpringFrame, 1, 100, 10, 0],
        numPoints = 100,
        decimal = 3,
    } = (isEasing ? { easing: options } : options) as TypeEasingOptions;

    if (typeof easing == "string") {
        let frameFunction = EasingFunctions[
            easing.replace(/(\(|\s).+/, "") // Remove the function brackets and parameters
                .toLowerCase()
                .trim()
        ];

        let params = parseEasingParameters(easing);
        easing = [frameFunction, ...params] as TypeArrayFrameFunctionFormat;
    }

    return { easing, numPoints, decimal };
};

/**
  Cache generated frame points for commonly used easing functions
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
export const GenerateSpringFrames = (options: TypeEasingOptions = {}): [number[], number] => {
    let {
        easing,
        numPoints,
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
                `[spring-easing] You entered ${
                    5 - easing.length
                } more spring parameter(s) than necessary. The easing needs to be in the format: \n* "spring-out(mass, stiffness, damping, velocity)" or \n* [SpringOutFrame, mass, stiffness, damping, velocity].`,
            );
        }
    } else {
        throw new Error(
            `[spring-easing] The easing needs to be in the format:  \n* "spring-out(mass, stiffness, damping, velocity)" or \n* [SpringOutFrame, mass, stiffness, damping, velocity], the easing recieved is "${easing}", [spring-easing] doesn't really know what to do with that.`,
        );
    }

    let [frameFunction, ...params] = easing as TypeArrayFrameFunctionFormat;
    const key = `${params},${numPoints}`;

    if (FramePtsCache.has(key)) {
        let tempObj = FramePtsCache.get(key);
        if (tempObj.has(frameFunction))
            return tempObj.get(frameFunction);
    }

    const pts: number[] = [];
    let duration = getSpringDuration(params);
    for (let i = 0; i < numPoints; i++) {
        pts[i] = frameFunction(i / (numPoints - 1), params, duration);
    }

    let tempObj = FramePtsCache.has(key) ? FramePtsCache.get(key) : new WeakMap();
    tempObj.set(frameFunction, [pts, duration]);
    FramePtsCache.set(key, tempObj);
    return [pts, duration];
};

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
 * @param options Accepts {@link TypeEasingOptions EasingOptions} or {@link TypeEasingOptions.easing array frame functions}
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
export const SpringEasing = (
    values: (string | number)[],
    options: TypeEasingOptions | TypeEasingOptions["easing"] = {},
    customInterpolate: (t: number, values: any[], decimal?: number) => string | number | any = interpolateComplex
): [(string | number | any)[], number] => {
    let optionsObj = EasingOptions(options);
    let [frames, duration] = GenerateSpringFrames(optionsObj);

    return [
        frames.map((t) => customInterpolate(t, values, optionsObj.decimal)),
        duration
    ];
};

export default SpringEasing;
