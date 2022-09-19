import { interpolateNumber } from "../../src/index";
import { toFixed } from "../../src/utils";
import { parse } from "./color-parse";

import rgba from "./color-rgba";
import colors from "./colors";

/** 
 * Convert value to string, then trim any extra white space and line terminator characters from the string. 
 */
export function trim<T>(str: T) { return (`` + str).trim() }

/** 
 * Determines if an object is empty 
 */
export function isEmpty(obj: any) {
  for (let _ in obj) return false;
  return true;
}

/**
 * Checks if a value is valid/truthy; it counts empty arrays and strings as falsey,
 * as well as null, undefined, and NaN, everything else is valid
 *
 * _**Note:** 0 counts as valid_
 *
 * @param value - anything
 * @returns true or false
 */
export function isValid<T>(value: T) {
  if (Array.isArray(value) || typeof value == "string")
    return Boolean(value.length);
  return value != null && value != undefined && !Number.isNaN(value);
}

/**
 * Check if input value is a valid color
 */
export function isColor<T>(value: T): boolean {
  if (typeof value == "string") {
    const input = trim(value).toLowerCase();
    if (input == "transparent") return true;
    if (input in colors) return true;
    if (/^#[A-Fa-f0-9]+$/.test(input)) 
      return rgba(input).length > 0;
    if (/^((?:rgb|hs[lvb]|hwb|cmyk?|xy[zy]|gray|lab|lchu?v?|[ly]uv|lms)a?)\s*\(([^\)]*)\)/.exec(input)) 
      return rgba(input).length > 0;
  } 

  const parsed = parse(value)
  if (!parsed.space) return false;

  return false;
}

/**
 * Convert the input to an array
 * For strings if type == "split", split the string at spaces, if type == "wrap" wrap the string in an array
 * For array do nothing
 * For everything else wrap the input in an array
 */
export function toArr<T>(input: T) {
  if (Array.isArray(input) || typeof input == "string") {
    if (typeof input == "string") return input.split(/\s+/);
    return input;
  }

  return [input] as const;
}

// (TypeCSSGenericPropertyKeyframes | TypeCSSGenericPropertyKeyframes[])[]
/**
 * Flips the rows and columns of 2-dimensional arrays
 *
 * Read more on [underscorejs.org](https://underscorejs.org/#zip) & [lodash.com](https://lodash.com/docs/4.17.15#zip)
 *
 * @example
 * ```ts
 * transpose(
 *      ['moe', 'larry', 'curly'],
 *      [30, 40, 50],
 *      [true, false, false]
 * );
 * // [
 * //     ["moe", 30, true],
 * //     ["larry", 40, false],
 * //     ["curly", 50, false]
 * // ]
 * ```
 * @param [...args] - the arrays to process as a set of arguments
 * @returns
 * returns the new array of grouped elements
 */
export function transpose<T>(...args: (T | T[])[]) {
  let largestArrLen = 0;
  const newargs = args.map((arr) => {
    // Convert all values in arrays to an array
    // This ensures that `arrays` is an array of arrays
    const result = toArr(arr);

    // Finds the largest array
    const len = result.length;
    if (len > largestArrLen)
      largestArrLen = len;
    return result;
  });

  // Flip the rows and columns of arrays
  let result: T[][] = [];
  const len = newargs.length;
  for (let col = 0; col < largestArrLen; col++) {
    result[col] = [];

    for (let row = 0; row < len; row++) {
      const val = newargs[row][col];
      if (isValid(val)) result[col][row] = val;
    }
  }

  return result;
}

/** 
 * Use the `color-rgba` npm package, to convert all color formats to an Array of rgba values, 
 * e.g. `[red, green, blue, alpha]`. Then, use the {@link interpolateNumber} functions to interpolate over the array
 * 
 * _**Note**: the red, green, and blue colors are rounded to intergers with no decimal places, 
 * while the alpha color gets rounded to a specific decimal place_
 * Make sure to read {@link interpolateNumber}.
*/
export function interpolateColor(t: number, values: string[], decimal = 3) {
  const color = transpose(...values.map((v) => rgba(v)))
    .map((colors: number[], i) => {
      const result = interpolateNumber(t, colors);
      return i < 3 ? Math.round(result) : toFixed(result, decimal);
    });

  return `rgba(${color.join()})`;
}
