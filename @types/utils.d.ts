/**
 * If a value can be converted to a valid number, then it's most likely a number
 *
 * @source Source code of `isNumberLike`
 */
export declare function isNumberLike(num: string | number): boolean;
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
export declare function limit(value: number, min: number, max: number): number;
/**
 * map `t` from 0 to 1, to `start` to `end`
 *
 * @source Source code of `scale`
 */
export declare function scale(t: number, start: number, end: number): number;
/**
 * Rounds numbers to a fixed decimal place
 *
 * @source Source code of `toFixed`
 */
export declare function toFixed(value: number, decimal: number): number;
/**
 * Returns the unit of a string, it does this by removing the number in the string
 *
 * @source Source code of `getUnit`
 */
export declare function getUnit(str: string | number): string;
/**
 * The type for interpolation functions which at an instant in the animation, generate the corresponding interpolated frame
 */
export declare type TypeInterpolationFunction = (t: number, values: any[], decimal?: number) => string | number | any;
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
export declare function toAnimationFrames(customInterpolate: TypeInterpolationFunction): (frames: any, values: any, decimal: any) => any;
