import SpringEasing, { SpringFrame, SpringOutFrame, SpringInFrame } from "./src/index";
import { interpolateColor } from "./tests/utils/interpolate-color";

// let [keyframes] = SpringEasing(["red", "black"], {
//   easing: "spring",
//   numPoints: 100,
//   decimal: 2
// }, interpolateColor);

let [keyframes] = SpringEasing(["red", "blue", "#4f4", "rgb(0, 0, 0)"], {
  // Enforce a linear easing frame function
  // Not really necessary but it show what you can do if you really need other kinds of easings 
  easing: [(t) => t],
  numPoints: 8,
  decimal: 2
}, interpolateColor);

console.log(keyframes)