/** 
 * Based on (color-rgba)[https://github.com/colorjs/color-rgba] by [Dima Yv.](https://github.com/dy) under an MIT License
 */
import { parse } from "./color-parse"
import { hsl_rgb } from "./color-space"

export const rgba = (color) => {
  // template literals
  // @ts-ignore
  if (Array.isArray(color) && color.raw) color = String.raw(...arguments)

  var values, i, l

  //attempt to parse non-array arguments
  var parsed = parse(color)

  if (!parsed.space) return []

  values = Array(3)
  values[0] = Math.min(Math.max(parsed.values[0], 0), 255)
  values[1] = Math.min(Math.max(parsed.values[1], 0), 255)
  values[2] = Math.min(Math.max(parsed.values[2], 0), 255)

  if (parsed.space[0] === 'h') {
    values = hsl_rgb(values)
  }

  values.push(Math.min(Math.max(parsed.alpha, 0), 1))

  return values
}

export default rgba;