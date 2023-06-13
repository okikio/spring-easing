import { 
  SimpleSpringFrame, 
  SimpleSpringInFrame, 
  SimpleSpringOutFrame, 
  SimpleSpringInOutFrame,
  SimpleSpringOutInFrame, 
} from "../../src/mod";

import {
  SpringFrame,
  SpringInFrame,
  SpringOutFrame,
  SpringInOutFrame,
  SpringOutInFrame,
} from "../../src/mod";

import { 
  SpringEasing,
  CSSSpringEasing, 
  SimpleSpringEasing,
  CSSSimpleSpringEasing, 
} from "../../src/mod";
import {
  registerEasingFunctions,
  limit,
} from "../../src/mod";

const frameFunctions = [
  ["SpringFrame", SpringFrame],
  ["SimpleSpringFrame", SimpleSpringFrame],

  ["SpringInFrame", SpringInFrame],
  ["SimpleSpringInFrame", SimpleSpringInFrame],

  ["SpringOutFrame", SpringOutFrame],
  ["SimpleSpringOutFrame", SimpleSpringOutFrame],

  ["SpringInOutFrame", SpringInOutFrame],
  ["SimpleSpringInOutFrame", SimpleSpringInOutFrame],

  ["SpringOutInFrame", SpringOutInFrame],
  ["SimpleSpringOutInFrame", SimpleSpringOutInFrame],
] as const;

const div = document.createElement("div");
div.classList.add("div");

frameFunctions.forEach(([name], i) => {
  const newDiv = div.cloneNode() as HTMLElement;
  newDiv.classList.add(`div${i + 1}`);
  newDiv.textContent = name;
  document.body.append(newDiv);

  const newLinearEasingDiv = div.cloneNode() as HTMLElement;
  newLinearEasingDiv.classList.add(`linear-easing-${i + 1}`);
  newLinearEasingDiv.textContent = `CSS Linear Easing - ${name}`;
  document.body.append(newLinearEasingDiv);
})

frameFunctions.forEach(([name, frameFn], i) => {
  const el: HTMLElement = document.querySelector(`.div${i + 1}`)!;
  console.log({
    el
  })

  let [translateX, duration] = /simple/i.test(name) ? 
    SimpleSpringEasing([25, 250], {
      easing: [frameFn, 0.35, 0.1, 4, 1],
      decimal: 3
    }) : 
    SpringEasing([25, 250], {
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

frameFunctions.forEach(([name, frameFn], i) => {
  const el: HTMLElement = document.querySelector(`.linear-easing-${i + 1}`)!;

  let [easing, duration] = /simple/i.test(name) ? 
    CSSSimpleSpringEasing({
      easing: [frameFn, 0.35, 0.1, 4, 1],
      decimal: 3
    }) : 
    CSSSpringEasing({
      easing: [frameFn, 1, 100, 7, 4],
      decimal: 3
    });

  console.log({
    linear: `linear(${easing})`,
    el,
    easing,
    duration
  })

  el.animate({
    translate: ["25px", "250px"],
  }, {
    duration,
    iterations: Infinity,
    direction: "alternate",
    easing: `linear(${easing})`
  })
});

registerEasingFunctions({
  bounce: t => {
    let pow2: number, b = 4;
    while (t < ((pow2 = Math.pow(2, --b)) - 1) / 11) { }
    return 1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - t, 2);
  },
  elastic: (t, params: number[] = []) => {
    let [amplitude = 1, period = 0.5] = params;
    const a = limit(amplitude, 1, 10);
    const p = limit(period, 0.1, 2);
    if (t === 0 || t === 1) return t;
    return -a *
      Math.pow(2, 10 * (t - 1)) *
      Math.sin(
        ((t - 1 - (p / (Math.PI * 2)) * Math.asin(1 / a)) * (Math.PI * 2)) / p
      );
  }
});

CSSSimpleSpringEasing("bounce") // 
CSSSimpleSpringEasing("elastic(1, 0.5)") // 

const customFrameFunctions = [
  ['Bounce', 'bounce'],
  ['Elastic', 'elastic(1, 0.5)']
];

customFrameFunctions.forEach(([name], i) => {
  const newDiv = div.cloneNode() as HTMLElement;
  newDiv.classList.add(`div${i + 1}`);
  newDiv.classList.add(`custom-easing${i + 1}`);
  newDiv.textContent = name;
  document.body.append(newDiv);

  const newLinearEasingDiv = div.cloneNode() as HTMLElement;
  newLinearEasingDiv.classList.add(`linear-easing-${i + 1}`);
  newLinearEasingDiv.classList.add(`linear-custom-easing${i + 1}`);
  newLinearEasingDiv.textContent = `CSS Linear Easing - ${name}`;
  document.body.append(newLinearEasingDiv);
})

customFrameFunctions.forEach(([_, frameFn], i) => {
  const el: HTMLElement = document.querySelector(`.custom-easing${i + 1}`)!;
  console.log({
    el
  })

  let [translateX] = SimpleSpringEasing([25, 250], {
    easing: frameFn,
    decimal: 3
  });

  el.animate({
    translate: translateX.map(x => `${x}px`) // ["25px", "250px"],
  }, {
    duration: 1330,
    iterations: Infinity,
    direction: "alternate",
    easing: "linear"
  })
});

customFrameFunctions.forEach(([_, frameFn], i) => {
  const el: HTMLElement = document.querySelector(`.linear-custom-easing${i + 1}`)!;

  let [easing] = CSSSimpleSpringEasing({
    easing: frameFn,
    decimal: 3
  });

  console.log({
    el,
    easing
  })

  el.animate({
    translate: ["25px", "250px"],
  }, {
    duration: 1330,
    iterations: Infinity,
    direction: "alternate",
    easing: `linear(${easing})`
  })
});