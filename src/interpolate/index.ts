import { getUnit, isNumberLike, limit, scale, toFixed } from "../utils";

/**
 * The type for interpolation functions which at an instant in the animation, generate the corresponding interpolated frame
 */
export interface IGenericInterpolationFn<T, TReturn = T> {
  (t: number, values: T[], decimal?: number): TReturn;
}

/**
 * Given an Array of numbers, estimate the resulting number, at a `t` value between 0 to 1

 * Basic interpolation works by scaling `t` from 0 - 1, to some start number and end number, in this case lets use
 * 0 as our start number and 100 as our end number, so, basic interpolation would interpolate between 0 to 100.

 * If we use a `t` of 0.5, the interpolated value between 0 to 100, is 50.
 * {@link interpolateNumber} takes it further, by allowing you to interpolate with more than 2 values,
 * it allows for multiple values.
 * E.g. Given an Array of values [0, 100, 0], and a `t` of 0.5, the interpolated value would become 100.

 * Based on d3.interpolateBasis [https://github.com/d3/d3-interpolate#interpolateBasis],
 * check out the link above for more detail.
 * 
 * @param t A number between 0 to 1
 * @param values Array of numbers to interpolate between
 * @param decimal How many decimals should the interpolated value have
 * @return Interpolated number at instant `t`
 *
 * @source Source code of `interpolateNumber`
*/
export function interpolateNumber(t: number, values: number[], decimal = 3) {
  // nth index
  const n = values.length - 1;

  // The current index given t
  const i = limit(Math.floor(t * n), 0, n - 1);

  const start = values[i];
  const end = values[i + 1];
  const progress = (t - i / n) * n;

  return toFixed(scale(progress, start, end), decimal);
}

/** 
 * Given an Array of values, find a value using `t` (which goes from 0 to 1), by
 * using `t` to estimate the index of said value in the array of `values` 

 * This is meant for interplolating strings that aren't number-like

 * @param t Progress as number between 0 to 1
 * @param values Array of numbers to interpolate between
 * @return Interpolated numbers at different instances

 * @source Source code of `interpolateSequence`
*/
export function interpolateSequence<T>(
  t: number,
  values: T[]
) {
  // nth index
  const n = values.length - 1;

  // limit `t`, to a min of 0 and a max of 1
  t = limit(t, 0, 1);

  // The current index given t
  const i = Math.round(t * n);
  return values[i];
}

/**
 * Alias of {@link interpolateSequence}
 * @deprecated please use {@link interpolateSequence}, it's the same functionality but different name
 */
export const interpolateUsingIndex = interpolateSequence;

/** 
 * Functions the same way {@link interpolateNumber} works.
 * Convert strings to numbers, and then interpolates the numbers,
 * at the end if there are units on the first value in the `values` array,
 * it will use that unit for the interpolated result.
 * Make sure to read {@link interpolateNumber}.
 * 
 * @source Source code of `interpolateString`
*/
export function interpolateString(
  t: number,
  values: (string | number)[],
  decimal = 3
) {
  let units = "";

  // If the first value looks like a number with a unit
  if (isNumberLike(values[0])) units = getUnit(values[0])[1];
  return (
    interpolateNumber(
      t,
      values.map((v) => (typeof v === "number" ? v : parseFloat(v))),
      decimal
    ) + units
  );
}

/**
 * Interpolates all types of values including number, and string values. 
 * Make sure to read {@link interpolateNumber}, {@link interpolateString} and {@link interpolateSequence}.
 * 
 * @source Source code of `interpolateComplex`
*/
export function interpolateComplex<T>(
  t: number,
  values: T[],
  decimal = 3
) {
  // Interpolate numbers
  const isNumber = values.every((v) => typeof v === "number");
  if (isNumber) return interpolateNumber(t, values as number[], decimal);

  // Interpolate strings with numbers, e.g. "5px"
  const isLikeNumber = values.every((v) => isNumberLike(v as string));
  if (isLikeNumber)
    return interpolateString(t, values as (number | string)[], decimal);

  // Interpolate pure strings and/or other type of values, e.g. "inherit", "solid", etc...
  return interpolateSequence<T>(t, values);
}