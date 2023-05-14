import type { TypeEasingOptions, TypeInterpolationFunction } from "./mod.ts";
/**
 * The type for interpolation functions which at an instant in the animation, generate the corresponding interpolated frame
 */
export interface IGenericBatchInterpolationFunction<T extends unknown[], TReturn extends unknown[] = T> {
    (arr_t: number[], values: T, decimal?: number): TReturn;
}
/**
 * Given an Array of numbers, estimate the resulting number, at a `t` value between 0 to 1

 * Basic interpolation works by scaling `t` from 0 - 1, to some start number and end number, in this case lets use
 * 0 as our start number and 100 as our end number, so, basic interpolation would interpolate between 0 to 100.

 * If we use a `t` of 0.5, the interpolated value between 0 to 100, is 50.
 * {@link batchInterpolateNumber} takes it further, by allowing you to interpolate with more than 2 values,
 * it allows for multiple values.
 * E.g. Given an Array of values [0, 100, 0], and a `t` of 0.5, the interpolated value would become 100.

 * Based on d3.interpolateBasis [https://github.com/d3/d3-interpolate#interpolateBasis],
 * check out the link above for more detail.
 *
 * Buliding on-top of {@link batchInterpolateNumber}, `interpolateNumberBatch` interpolates between numbers, but unlike {@link batchInterpolateNumber}
 * `interpolateNumberBatch` uses an Array of `t` instances to generate an array of interpolated values
 *
 * @param arr_t Array of numbers (between 0 to 1) which each represent an instant of the interpolation
 * @param values Array of numbers to interpolate between
 * @param decimal How many decimals should the interpolated value have
 * @return Array of interpolated numbers at different instances
 *
 * @source Source code of `interpolateNumberBatch`
*/
export declare function batchInterpolateNumber(arr_t: number[], values: number[], decimal?: number): number[];
/**
 * Given an Array of items, find an item using `t` (which goes from 0 to 1), by
 * using `t` to estimate the index of said value in the array of `values`,
 * then expand that to encompass multiple `t`'s in an Array,
 * which returns Array items which each follow the interpolated index value

 * This is meant for interplolating strings that aren't number-like

 * @param arr_t Array of numbers (between 0 to 1) which each represent an instance of the interpolation
 * @param values Array of items to choose from
 * @return Array of Interpolated input Array items at different instances

 * @source Source code of `interpolateSequenceBatch`
*/
export declare function batchInterpolateSequence<T>(arr_t: number[], values: T[]): T[];
/**
 * Alias of {@link batchInterpolateSequence}
 * @deprecated please use {@link batchInterpolateSequence}, it's the same functionality but different name
 */
export declare const batchInterpolateUsingIndex: typeof batchInterpolateSequence;
/**
 * Functions the same way {@link batchInterpolateNumber} works.
 * Convert strings to numbers, and then interpolates the numbers,
 * at the end if there are units on the first value in the `values` array,
 * it will use that unit for the interpolated result.
 * Make sure to read {@link batchInterpolateNumber}.
 *
 * @source Source code of `interpolateStringBatch`
*/
export declare function batchInterpolateString(arr_t: number[], values: (string | number)[], decimal?: number): string[];
/**
 * Interpolates all types of values including number, string, etc... values.
 * Make sure to read {@link batchInterpolateNumber}, {@link batchInterpolateString} and {@link batchInterpolateSequence},
 * as depending on the values given
 *
 * @source Source code of `interpolateComplexBatch`
*/
export declare function batchInterpolateComplex<T>(arr_t: number[], values: T[], decimal?: number): number[] | string[] | T[];
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
export declare function BatchSpringEasing<T extends unknown[] = number[], TReturn extends unknown[] = T>(values: T, options?: TypeEasingOptions | TypeEasingOptions["easing"], customInterpolate?: IGenericBatchInterpolationFunction<T, TReturn>): readonly [TReturn, number];
/**
 * Converts interpolation functions written in this style `(t, values, decimal) => { ... }`
 * to work in the `BatchSpringEasing`
 *
 * You use it like so,
 * ```ts
 * import { BatchSpringEasing, toAnimationFrames, toFixed, scale, limit } from "spring-easing";
 *
 * function interpolateNumber(t: number, values: number[], decimal = 3) {
 *   // nth index
 *   const n = values.length - 1;
 *
 *   // The current index given t
 *   const i = limit(Math.floor(t * n), 0, n - 1);
 *
 *   const start = values[i];
 *   const end = values[i + 1];
 *   const progress = (t - i / n) * n;
 *
 *   return toFixed(scale(progress, start, end), decimal);
 * }
 *
 * function interpolatePixels(t: number, values: number[], decimal = 3) {
 *   const result = interpolateNumber(t, values, decimal);
 *   return `${result}px`;
 * }
 *
 * BatchSpringEasing(
 *   [0, 250],
 *   'spring',
 *   toAnimationFrames(interpolatePixels)
 * );
 * ```
 */
export declare function toAnimationFrames(customInterpolate: TypeInterpolationFunction): <T extends unknown[] = number[], TReturn extends unknown[] = T>(arr_t: number[], values: T, decimal?: number) => TReturn;
//# sourceMappingURL=batch.d.ts.map