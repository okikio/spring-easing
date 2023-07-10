import { SpringFrame, TypeFrameFunction } from "./mod";

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
 * Spring easing function.
 *
 * @param t - The current time (or position) of the animation, from 0 to 1.
 * @param spring-parameters
 *  - dampingRatio = This is a dimensionless measure of damping in the system. It is the ratio of the damping coefficient in the system to the critical damping coefficient. It defines how oscillations in the system decay after a disturbance:
 *    - dampingRatio < 1: the system is underdamped, it oscillates and slowly returns to equilibrium.
 *    - dampingRatio = 1: the system is critically damped, it returns to equilibrium as quickly as possible without oscillating.
 *    - dampingRatio > 1: the system is overdamped, it returns to equilibrium without oscillating but slower than the critically damped case.
 *  - response = - This is the time taken for the system to cover a significant portion of the total distance to the new state (without taking into account any oscillation that may happen). Essentially, it controls the speed of the animation.
 *  - velocity = initial velocity of spring
 *  - mass = mass of object
 *
 * @returns The eased value.
 */
export function fromNaturalParams([dampingRatio = 0.5, response = 0.1, velocity = 0, mass = 1]: number[] = []) {
  // Calculate `stiffness` from `response`
  const stiffness = 1 / Math.pow(response, 2) * mass;

  // Calculate `damping` from `dampingRatio` and `stiffness`
  const damping = dampingRatio * 2 * Math.sqrt(stiffness * mass);

  return [mass, stiffness, damping, velocity];
}