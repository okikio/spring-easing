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

