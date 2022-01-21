/**
 * Limit a number to a minimum of `min` and a maximum of `max`
 * @param value number to limit
 * @param min minimum limit
 * @param max maximum limit
 * @returns limited/constrained number
 */
export declare const limit: (value: number, min: number, max: number) => number;
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
export declare type TypeFrameFunction = (
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
export declare const SpringFrame: TypeFrameFunction;
/**
 * Cache the durations at set easing parameters
 */
export declare const EasingDurationCache: Map<string, number>;
/**
 * The threshold for an infinite loop
 */
export declare const INTINITE_LOOP_LIMIT = 100000;
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
export declare const getSpringDuration: ([mass, stiffness, damping, velocity]?: number[]) => number;
/**
 * Creates a new frame function where each frame follows an `out` pattern
 *
 * @param frame frame function (see {@link TypeFrameFunction}, to learn more about frame functions)
 * @returns A new frame function that represents the ease-out version of the frame function given as an argument
 *
 * Based off of another library, but I can't remember which. If any devs are able to find
 * the source, I'll gladily place a link to the original source here
 */
export declare const EaseOut: (frame: TypeFrameFunction) => TypeFrameFunction;
/**
 * Creates a new frame function where each frame follows an `in-out` pattern
 *
 * @param frame frame function (see {@link TypeFrameFunction}, to learn more about frame functions)
 * @returns A new frame function that represents the ease-in-out version of the frame function given as an argument
 *
 * Based off of another library, but I can't remember which. If any devs are able to find
 * the source, I'll gladily place a link to the original source here
 */
export declare const EaseInOut: (frame: TypeFrameFunction) => TypeFrameFunction;
/**
 * Creates a new frame function where each frame follows an `out-in` pattern
 *
 * @param frame frame function (see {@link TypeFrameFunction}, to learn more about frame functions)
 * @returns A new frame function that represents the ease-in-out version of the frame function given as an argument
 *
 * Based off of another library, but I can't remember which. If any devs are able to find
 * the source, I'll gladily place a link to the original source here
 */
export declare const EaseOutIn: (frame: TypeFrameFunction) => TypeFrameFunction;
/**
 * Alias of {@link SpringFrame},
 * e.g. "spring in" frame function
 */
export declare const SpringInFrame: TypeFrameFunction;
/**
 * "spring-out" frame function where each {@link SpringFrame} follows an ease `out` pattern
 *
 * _**Note**: Be very careful of only setting some of the spring parameters, it can cause errors if you are not careful_
 */
export declare const SpringOutFrame: TypeFrameFunction;
/**
 * "spring-in-out" frame function where each {@link SpringFrame} follows an ease `in-out` pattern
 *
 * _**Note**: Be very careful of only setting some of the spring parameters, it can cause errors if you are not careful_
 */
export declare const SpringInOutFrame: TypeFrameFunction;
/**
 * "spring-out-in" frame function where each {@link SpringFrame} follows an ease `out-in` pattern
 *
 * _**Note**: Be very careful of only setting some of the spring parameters, it can cause errors if you are not careful_
 */
export declare const SpringOutInFrame: TypeFrameFunction;
/** map `t` from 0 to 1, to `start` to `end` */
export declare const scale: (t: number, start: number, end: number) => number;
/** Rounds numbers to a fixed decimal place */
export declare const toFixed: (value: number, decimal: number) => number;
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
export declare const interpolateNumber: (t: number, values: number[], decimal?: number) => number;
/**
 * The array frame function format for easings,
 * @example
 * `[SpringFrame, mass, stiffness, damping, velocity]`
 */
export declare type TypeArrayFrameFunctionFormat = [TypeFrameFunction, ...number[]];
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
export declare type TypeEasings = `${keyof typeof EasingFunctions}(${string})` | TypeArrayFrameFunctionFormat;
/**
 * Spring Easing has 3 properties they are `easing` (all spring frame functions are supported), `numPoints` (the size of the Array the frmae function should create), and `decimal` (the number of decimal places of the values within said Array).
 *
 * | Properties  | Default Value           |
 * | ----------- | ----------------------- |
 * | `easing`    | `spring(1, 100, 10, 0)` |
 * | `numPoints` | `50`                    |
 * | `decimal`   | `3`                     |
 */
export declare type TypeEasingOptions = {
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
export declare const EasingFunctions: {
    spring: TypeFrameFunction;
    "spring-in": TypeFrameFunction;
    "spring-out": TypeFrameFunction;
    "spring-in-out": TypeFrameFunction;
    "spring-out-in": TypeFrameFunction;
};
/**
 * Convert easing parameters to Array of numbers, e.g. "spring(2, 500)" to [2, 500]
 *
 * Based off of [animejs](https://github.com/juliangarnier/anime/blob/3ebfd913a04f7dc59cc3d52e38275272a5a12ae6/src/index.js#L69)
 */
export declare const parseEasingParameters: (str: string) => (string | number)[];
/**
 * Returns a {@link TypeEasingOptions} object from a easing "string", or frame function array
 *
 * _**Note**: Be very careful of only setting some of the spring parameters, it can cause errors if you are not careful_
 */
export declare const EasingOptions: (options?: TypeEasingOptions | TypeEasingOptions["easing"]) => {
    easing: TypeArrayFrameFunctionFormat;
    numPoints: number;
    decimal: number;
};
/**
  Cache generated frame points for commonly used easing functions
*/
export declare const FramePtsCache: Map<any, any>;
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
 * Based on https://github.com/w3c/csswg-drafts/issues/229#issuecomment-861415901
 */
export declare const GenerateSpringFrames: (options?: TypeEasingOptions) => [number[], number];
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
 * | :--------- | :----------------- | :------------- | :-------------------- | :-------------------- |      |
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
 */
export declare const SpringEasing: (
    values: number[],
    options?: TypeEasingOptions | TypeEasingOptions["easing"],
) => [number[], number];
export default SpringEasing;
