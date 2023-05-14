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
//# sourceMappingURL=utils.d.ts.map