# spring-easing

[![Open Bundle](https://bundle.js.org/badge-light.svg)](https://bundle.js.org/?q=spring-easing&bundle)

[NPM](https://www.npmjs.com/package/spring-easing) <span style="padding-inline: 1rem">|</span> [Github](https://github.com/okikio/spring-easing#readme) <span style="padding-inline: 1rem">|</span> [Docs](https://spring-easing.okikio.dev) <span style="padding-inline: 1rem">|</span> [Licence](./LICENSE)  


Quick and easy spring easing's. Works with other animation libraries ([animejs](https://animejs.com/), [@okikio/animate](http://npmjs.com/@okikio/animate), [motion one](https://motion.dev/), [framer motion](https://www.framer.com/docs/animation/), etc...)  or the Web Animation API (WAAPI).

`spring-easing` works by generating Arrays of `frames`  which when placed in linear order create a smooth spring like animation.

> `frames` represent a single frame of an animation 

> _**Note**: the `spring-easing` package also supports 4 extra varients of [`spring`](https://spring-easing.okikio.dev/modules.html#SpringFrame), namely [`spring-in`](https://spring-easing.okikio.dev/modules.html#SpringInFrame), [`spring-out`](https://spring-easing.okikio.dev/modules.html#SpringOutFrame), [`spring-out-in`](https://spring-easing.okikio.dev/modules.html#SpringOutInFrame), and [`spring-in-out`](https://spring-easing.okikio.dev/modules.html#SpringInOutFrame), you can use these easing to create some really unique spring like animations._

e.g. 
```ts
import { SpringEasing, SpringOutFrame } from "spring-easing";
import anime from "animejs";

// Note: this is the return value of {@link SpringEasing} and {@link GenerateSpringFrames}, you don't need the object to get this format
let [translateX, duration] = SpringEasing([0, 250], {
    easing: "spring-out-in(1, 100, 10, 0)",
    // You can change the size of Array for the SpringEasing function to generate
    numPoints: 200,
    // The number of decimal places to round, final values in the generated Array
    // This option doesn't exist on {@link GenerateSpringFrames}
    decimal: 5,
});

anime({
  targets: "div",
  
  // Using spring easing animate from [0 to 250] using `spring-out-in`
  translateX,
  // You can set the easing without an object
  rotate: SpringEasing(["0turn", 1, 0, 0.5], [SpringOutFrame, 1, 100, 10, 0])[0],
  // TIP... Use linear easing for the proper effect
  easing: "linear",
  
  // The optimal duration for this specific spring
  duration
});
```


> _**Note**: make sure to read the comments above they are valuable resources for understanding what is happening._

> Check out this demo on [Codepen →](https://codepen.io/okikio/pen/MWEdzNg)

> You can also read the [blog post](https://blog.okikio.dev/spring-easing), created for it's launch. 

## Installation
```bash
npm install spring-easing
```

<details>
    <summary>Others</summary>

```bash
yarn add spring-easing
```

or 

```bash
pnpm install spring-easing
```
</details>

## Usage

```ts
import { SpringEasing } from "spring-easing";
// or 
import SpringEasing from "spring-easing";
```

You can also use it directly through a script tag:
```html
<script src="https://unpkg.com/spring-easing" type="module"></script>
<script type="module">
    // You can then use it like this
    const { SpringEasing } = window.SpringEasing; 
</script>
```

You can also use it via a CDN, e.g.
```ts
import SpringEasing from "https://cdn.skypack.dev/spring-easing";
// or 
import SpringEasing from "https://cdn.jsdelivr.net/npm/spring-easing";
// or any number of other CDN's
```

### Use with Animation Libraries

> _**Note:** not every supporting animation library works, for example, if the animation library in question doesn't take multiple array values for animating through e.g. gsap._

> _GSAP doesn't support using arrays to define animation keyframes._ 

The libraries that have been confirmed to work/not work are:

| Animation Library         | Support                                                                                                         | Demo    |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- | ------- |
| GSAP                      | ⛔ No                                                                                                            | No Demo |
| animejs                   | ✅ Yes - [Array Keyframes](https://animejs.com/documentation/#animationKeyframes)                                | Codepen |
| Framer Motion             | ✅ Yes - [Array Keyframes](https://www.framer.com/docs/animation/##keyframes)                                    | Codepen |
| Motion One                | ✅ Yes - [Array Keyframes](https://motion.dev/dom/animate#keyframes)                                             | Codepen |
| @okikio/animate           | ✅ Yes - [Array Keyframes](https://okikio.github.io/native/packages/animate/#animations)                         | Codepen |
| Web Animation API (WAAPI) | ✅ Yes - [Array Keyframes](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats) | Codepen |


## Showcase

A couple sites that use `spring-easing`:
* Your site/project here...

## API

The API of `spring-easing` is pretty straight forward.

The `SpringEasing` function generates an array of values using frame functions which in turn create the effect of spring easing.

To use this properly make sure to set the easing animation option to "linear".
Check out a demo of SpringEasing at <https://codepen.io/okikio/pen/MWEdzNg>

SpringEasing has 3 properties they are `easing` (all the easings from [EasingFunctions](https://spring-easing.okikio.dev/modules.html#EasingOptions) are supported on top of frame functions like SpringFrame, SpringFrameOut, etc..), `numPoints` (the size of the Array the frame function should create), and `decimal` (the number of decimal places of the values within said Array).

| Properties  | Default Value           |
| ----------- | ----------------------- |
| `easing`    | `spring(1, 100, 10, 0)` |
| `numPoints` | `50`                    |
| `decimal`   | `3`                     |

By default, Spring Easing support easings in the form,

| constant | accelerate | decelerate | accelerate-decelerate | decelerate-accelerate |
| :------- | :--------- | :--------- | :-------------------- | :-------------------- ||
|            | spring / spring-in | spring-out     | spring-in-out         | spring-out-in         |

All **Spring** easing's can be configured using theses parameters,

`spring-*(mass, stiffness, damping, velocity)`

Each parameter comes with these defaults

| Parameter | Default Value |
| --------- | ------------- |
| mass      | `1`           |
| stiffness | `100`         |
| damping   | `10`          |
| velocity  | `0`           |

> _**Note:** the return value of the `SpringEasing` function is actually `[Array of frames, duration]`, in that order._ 

Check out the [API site](https://spring-easing.okikio.dev) for detailed API documentation.

## Browser Support

| Chrome | Edge | Firefox | Safari | IE  |
| ------ | ---- | ------- | ------ | --- |
| 4+     | 12+  | 4+      | 4+     | 10+ |

Native support for is great as it doesn't use any browser specific or nodejs specific API's.


## Contributing

I encourage you to use [pnpm](https://pnpm.io/configuring) to contribute to this repo, but you can also use [yarn](https://classic.yarnpkg.com/lang/en/) or [npm](https://npmjs.com) if you prefer.

Install all necessary packages
```bash
npm install
```

Then run tests (WIP)
```bash
npm test
```

Build project 
```bash
npm run build
```

Preview API Docs
```bash
npm run typedoc && npm run preview
```

> _**Note**: this project uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard for commits, so, please format your commits using the rules it sets out._

## Licence
See the [LICENSE](./LICENSE) file for license rights and limitations (MIT).

