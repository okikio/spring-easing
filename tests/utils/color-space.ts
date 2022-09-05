/** 
 * Based on (color-space/hsl)[https://github.com/colorjs/color-space/blob/master/hsl.js] by [colorjs](https://github.com/colorjs) under an MIT License
*/

/**
 * @module color-space/hsl 
 */
export function hsl_rgb(hsl) {
  var h = hsl[0] / 360, s = hsl[1] / 100, l = hsl[2] / 100, t1, t2, t3, rgb, val, i = 0;

  if (s === 0) return val = l * 255, [val, val, val];

  t2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
  t1 = 2 * l - t2;

  rgb = [0, 0, 0];
  for (; i < 3;) {
    t3 = h + 1 / 3 * - (i - 1);
    t3 < 0 ? t3++ : t3 > 1 && t3--;
    val = 6 * t3 < 1 ? t1 + (t2 - t1) * 6 * t3 :
      2 * t3 < 1 ? t2 :
        3 * t3 < 2 ? t1 + (t2 - t1) * (2 / 3 - t3) * 6 :
          t1;
    rgb[i++] = val * 255;
  }

  return rgb;
}
