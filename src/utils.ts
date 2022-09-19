/** 
 * If a value can be converted to a valid number, then it's most likely a number 
 *
 * @source Source code of `isNumberLike`
 */
export function isNumberLike(num: string | number) {
  const value = parseFloat(num as string);
  return typeof value == "number" && !Number.isNaN(value);
}

/**
 * Limit a number to a minimum of `min` and a maximum of `max`
 *
 * @source Source code of `limit`
 * 
 * @param value number to limit
 * @param min minimum limit
 * @param max maximum limit
 * @returns limited/constrained number
 */
export function limit(value: number, min: number, max: number) { 
  return Math.min(Math.max(value, min), max);
}

/** 
 * map `t` from 0 to 1, to `start` to `end`
 *
 * @source Source code of `scale` 
 */
export function scale(t: number, start: number, end: number) { 
  return start + (end - start) * t;
}

/** 
 * Rounds numbers to a fixed decimal place 
 *
 * @source Source code of `toFixed`
 */
export function toFixed(value: number, decimal: number) { 
  return Math.round(value * 10 ** decimal) / 10 ** decimal;
}

/**
 * Returns the unit of a string, it does this by removing the number in the string
 * 
 * @source Source code of `getUnit`
 */
export function getUnit(str: string | number) {
  const num = parseFloat(str as string);
  return (str.toString()).replace(num.toString(), "");
}

/**
 * The type for interpolation functions which at an instant in the animation, generate the corresponding interpolated frame
 */
export type TypeInterpolationFunction = (t: number, values: any[], decimal?: number) => string | number | any;

/**
 * Converts old interpolation syntax (the instantaneous interpolation function, e.g. `(t, values, decimal) => { ... }`) 
 * to complete animation frames
 * 
 * You use it like so, 
 * ```ts
 * import { SpringEasing, toAnimationFrames, toFixed, scale, limit } from "spring-easing";
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
 * SpringEasing(
 *   [0, 250], 
 *   'spring', 
 *   toAnimationFrames(interpolatePixels)
 * );
 * ```
 * @ignore
 */
export function toAnimationFrames(customInterpolate: TypeInterpolationFunction) {
  return function (frames, values, decimal) {
    return frames.map(t => customInterpolate(t, values, decimal));
  }
}