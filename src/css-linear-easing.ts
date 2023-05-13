import { EasingOptions, GenerateSpringFrames } from "./mod.ts";
import { getOptimizedPoints } from "./optimize.ts";
import { limit, scale } from "./utils.ts";

import type { TypeEasingOptions } from "./mod.ts";

/*!
 * Based off of https://github.com/jakearchibald/linear-easing-generator
 * 
 * Changes:
 * - Added comments and docs top explain logic
 * - Switched to iterative approach for the `ramerDouglasPeucker` algorithim
 * - Renamed functions, parameters and variables to improve readability and to better match a library usecase 
 * 
 * Copyright 2023 Jake Archibald [@jakearchibald](https://github.com/jakearchibald)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Converts a given set of points into an array of strings in this format `["value percent%", ...]` e.g. `["0", "0.25 13.8%", "0.6 45.6%", "0.1", "0.4 60%", ...]`.
 * 
 * @param points - The array of points to be converted. Each point is represented as a pair of numbers: [pos, val].
 * @param round - The number of decimal places to which point values should be rounded.
 * 
 * @returns The formatted points as an array of strings, or an empty array if the input was null.
 * 
 * The function first checks if the input points are null. If they are, it returns an empty array.
 * If they are not null, the function does the following:
 * 
 * - It creates a NumberFormat object for formatting the x and y values of the points to the specified number of decimal places.
 *   The x values are formatted with 2 fewer decimal places than the y values.
 * 
 * - It iterates over the points to find those for which the x value does not need to be stated explicitly.
 *   The x value of a point does not need to be stated if it is 0 for the first point, 1 for the last point (provided the x value of the point before it is not greater than 1),
 *   or the average of the x values of the previous and next points.
 * 
 * - It groups the points into subarrays such that all points in a subarray have the same y value.
 * 
 * - It iterates over the groups and, for each group, formats the y value and the x values of the points that need to be stated explicitly.
 *   The formatted values are concatenated into a string, with the x values followed by the y value and separated by commas.
 *   If a group contains more than one point, the function also creates a string in which the y value is followed 
 *   by the x values of the first and last points of the group, separated by a space.
 *   This string is used if its length is shorter than the length of the string with all the x values.
 * 
 * - The function returns the array of formatted strings.
 * 
 * This function makes use of the Intl.NumberFormat object for formatting the numbers. This not only rounds the numbers to the specified 
 * number of decimal places but also formats them according to the en-US locale. This means that the numbers will be formatted with a period 
 * as the decimal separator and without thousands separators.
 * 
 * This function also optimizes the representation of the points by omitting the x values where they are not needed and by grouping points with 
 * the same y value. This can significantly reduce the length of the output strings when many points have the same y value or when the x values 
 * are close to their expected values based on their position in the array.
 */
export function getLinearSyntax(
  points: [x: number, y: number][] | null,
  round: number,
): string[] {
  if (!points) return [];

  // Prepare the number formatters with the required number of fractional digits.
  const xFormat = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: Math.max(round - 2, 0),
  });
  const yFormat = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: round,
  });

  const pointsValue = points;
  const valuesWithRedundantX = new Set<[number, number]>();
  const maxDelta = 1 / 10 ** round;

  // Determine which points don't need an explicit x value.
  for (const [i, value] of pointsValue.entries()) {
    const [x] = value;
    // If the first item's position is 0, then we don't need to state the position
    if (i === 0) {
      if (x === 0) valuesWithRedundantX.add(value);
      continue;
    }
    // If the last entry's position is 1, and the item before it is less than 1, then we don't need to state the position
    if (i === pointsValue.length - 1) {
      const previous = pointsValue[i - 1][0];
      if (x === 1 && previous <= 1) valuesWithRedundantX.add(value);
      continue;
    }

    // If the position is the average of the previous and next positions, then we don't need to state the position
    const previous = pointsValue[i - 1][0];
    const next = pointsValue[i + 1][0];

    const averagePos = (next - previous) / 2 + previous;
    const delta = Math.abs(x - averagePos);

    if (delta < maxDelta) valuesWithRedundantX.add(value);
  }

  // Group points with the same y value.
  const groupedValues: [x: number, y: number][][] = [[pointsValue[0]]];

  for (const value of pointsValue.slice(1)) {
    if (value[1] === groupedValues.at(-1)![0][1]) {
      groupedValues.at(-1)!.push(value);
    } else {
      groupedValues.push([value]);
    }
  }

  // Convert each group to a formatted string.
  const outputValues = groupedValues.map((group) => {
    const yValue = yFormat.format(group[0][1]);

    const regularValue = group
      .map((value) => {
        const [x] = value;
        let output = yValue;

        if (!valuesWithRedundantX.has(value)) {
          output += ' ' + xFormat.format(x * 100) + '%';
        }

        return output;
      })
      .join(', ');

    if (group.length === 1) return regularValue;

    // Check if it's shorter to omit some x values.
    const xVals = [group[0][0], group.at(-1)![0]];
    const positionalValues = xVals
      .map((x) => xFormat.format(x * 100) + '%')
      .join(' ');

    const skipValue = `${yValue} ${positionalValues}`;

    return skipValue.length > regularValue.length ? regularValue : skipValue;
  });

  return outputValues;
}

/**
 * CSS Spring Easing has 4 properties they are `easing` (all spring frame functions are supported), `numPoints` (the size of the Array the frmae function should create), `decimal` (the number of decimal places of the values within said Array) and `quality` (how detailed/smooth the spring easing should be).
 *
 * | Properties  | Default Value           |
 * | ----------- | ----------------------- |
 * | `easing`    | `spring(1, 100, 10, 0)` |
 * | `numPoints` | `50`                    |
 * | `decimal`   | `3`                     |
 * | `quality`   | `0.85`                  |
 */
export type TypeCSSEasingOptions = {
  /**
   * Indicates how detailed/smooth the CSS `linear-easing()` function should be, it ranges between 0 - 1
   * 
   * - 0 means it should basically not even bother
   * - 1 means it should be a detailed as possible such that human eyes are no longer able to distinguish 
   */
  quality?: number
} & TypeEasingOptions;

/**
 * Generates a string that represents a set of values used with the linear-easing function to replicate spring animations, 
 * you can check out the linear-easing playground here https://linear-easing-generator.netlify.app/ 
 * Or check out a demo on Codepen https://codepen.io/okikio/pen/vYVaEXM
 * 
 * CSS Spring Easing has 4 properties they are `easing` (all spring frame functions are supported), `numPoints` (the size of the Array the frmae function should create), `decimal` (the number of decimal places of the values within said Array) and `quality` (how detailed/smooth the spring easing should be)..
 *
 * | Properties  | Default Value           |
 * | ----------- | ----------------------- |
 * | `easing`    | `spring(1, 100, 10, 0)` |
 * | `numPoints` | `50`                    |
 * | `decimal`   | `3`                     |
 * | `quality`   | `0.85`                  |
 *
 * By default, CSS Spring Easing support easings in the form,
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
 *  import { CSSSpringEasing } from "spring-easing";
 *
 *  // Note: this is the return value of {@link CSSSpringEasing}, you don't need the object to get this format
 *  let [easing, duration] = CSSSpringEasing({
 *      easing: "spring-out-in(1, 100, 10, 0)",
 *
 *      // You can change the size of Array for the SpringEasing function to generate
 *      numPoints: 200,
 *
 *      // The number of decimal places to round, final values in the generated Array
 *      // This option doesn't exist on {@link GenerateSpringFrames}
 *      decimal: 5,
 * 
 *      // How detailed/smooth the spring easing should be 
 *      // 0 means not smooth at all (shorter easing string)
 *      // 1 means as smooth as possible (this means the resulting easing will be a longer string)
 *      quality: 0.85
 *  });
 *
 *  document.querySelector("div").animate({
 *    translate: ["0px", "250px"],
 *    rotate: ["0turn", "1turn", "0turn", "0.5turn"],
 * }, {
 *    easing: `linear(${easing})`,
 *
 *    // The optimal duration for this specific spring
 *    duration
 *  })
 *  ```
 * 
 * > **Note**: You can also use custom easings if you so wish e.g.
 * ```ts
 * import { CSSSpringEasing, limit, registerEasingFunctions } from "spring-easing";
 * 
 * registerEasingFunctions({
 *   bounce: t => {
 *     let pow2: number, b = 4;
 *     while (t < ((pow2 = Math.pow(2, --b)) - 1) / 11) { }
 *     return 1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - t, 2);
 *   },
 *   elastic: (t, params: number[] = []) => {
 *     let [amplitude = 1, period = 0.5] = params;
 *     const a = limit(amplitude, 1, 10);
 *     const p = limit(period, 0.1, 2);
 *     if (t === 0 || t === 1) return t;
 *     return -a *
 *         Math.pow(2, 10 * (t - 1)) *
 *         Math.sin(
 *             ((t - 1 - (p / (Math.PI * 2)) * Math.asin(1 / a)) * (Math.PI * 2)) / p
 *         );
 *   }
 * });
 * 
 * CSSSpringEasing("bounce") // ["0, 0.013, 0.015, 0.006 8.1%, 0.046 13.5%, 0.06, 0.062, 0.054, 0.034, 0.003 27%, 0.122, 0.206 37.8%, 0.232, 0.246, 0.25, 0.242, 0.224, 0.194, 0.153 56.8%, 0.039 62.2%, 0.066 64.9%, 0.448 73%, 0.646, 0.801 83.8%, 0.862 86.5%, 0.95 91.9%, 0.978, 0.994, 1", ...]
 * CSSSpringEasing("elastic(1, 0.5)") // ["0, -0.005 32.4%, 0.006 40.5%, 0.034 51.4%, 0.033 56.8%, 0.022, 0.003, -0.026 64.9%, -0.185 75.7%, -0.204, -0.195, -0.146, -0.05, 0.1 89.2%, 1", ...]
 * ```
 * 
 * @param options Accepts {@link TypeCSSEasingOptions EasingOptions} or {@link TypeCSSEasingOptions["easing"] array frame functions}
 * @return 
 * ```ts
 * // A string with the values that represent said spring animation using the linear-easing function
 * // Total duration (in milliseconds) required to create a smooth spring animation
 * [
 *   "0, 0.583 5.4%, 0.669, 0.601, 0.502, 0.451, 0.457 18.9%, 0.512 24.3%, 0.516 27%, ...0.417 94.6%, 1", 
 *   3500 
 * ]
 * ```
 */
export function CSSSpringEasing(
  options: TypeCSSEasingOptions | TypeCSSEasingOptions["easing"] = {}
) {
  const optionsObj = EasingOptions(options);
  const [frames, duration] = GenerateSpringFrames(optionsObj);

  const quality = limit((optionsObj.quality ?? 0.85), 0, 1);
  const simplify = scale(1 - quality, 0, 0.025);

  const len = frames.length;
  const pts = frames.map((x, i) => [i / (len - 1), x]) as [x: number, y: number][];
  const optimizedPoints = getOptimizedPoints(pts, simplify, optionsObj.decimal);
  
  return [
    getLinearSyntax(optimizedPoints, optionsObj.decimal).join(", "),
    duration
  ] as const;
}