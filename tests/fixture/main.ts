import { SpringFrame, SpringInFrame, SpringOutFrame, SpringInOutFrame, SpringOutInFrame } from "../../src/index";
import { SpringEasing } from "../../src/index";

const frameFunctions = [
  ["SpringFrame", SpringFrame], 
  ["SpringInFrame", SpringInFrame], 
  ["SpringOutFrame", SpringOutFrame], 
  ["SpringInOutFrame", SpringInOutFrame], 
  ["SpringOutInFrame", SpringOutInFrame]
] as const;

const div = document.createElement("div");
div.classList.add("div");

frameFunctions.forEach(([name], i) => {
  const newDiv = div.cloneNode() as HTMLElement;
  newDiv.classList.add(`div${i + 1}`);
  newDiv.textContent = name;
  document.body.append(newDiv);
})

frameFunctions.forEach(([_, frameFn], i) => {
  const el: HTMLElement = document.querySelector(`.div${i + 1}`)!;
  console.log({
    el
  })

  let [translateX, duration] = SpringEasing([25, 250], {
    easing: [frameFn, 1, 100, 7, 4],
    decimal: 3
  });

  el.animate({
    translate: translateX.map(x => `${x}px`) // ["25px", "250px"],
  }, {
    duration,
    iterations: Infinity,
    direction: "alternate",
    easing: "linear"
  })
});