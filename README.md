# spring-easing

[![Open Bundle](https://bundle.js.org/badge-light.svg)](https://bundle.js.org/?q=spring-easing&bundle "Check the total bundle size of spring-easing with whichever animation library you choose.")

[NPM](https://www.npmjs.com/package/spring-easing) <span style="padding-inline: 1rem">|</span> [Github](https://github.com/okikio/spring-easing#readme) <span style="padding-inline: 1rem">|</span> [Docs](https://spring-easing.okikio.dev) <span style="padding-inline: 1rem">|</span> [Licence](./LICENSE)

Quick and easy spring animations. Works with other animation libraries ([gsap](https://greensock.com/), [animejs](https://animejs.com/), [@okikio/animate](http://npmjs.com/@okikio/animate), [motion one](https://motion.dev/), [framer motion](https://www.framer.com/docs/animation/), etc...) or the [Web Animation API (WAAPI)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API), you can learn more in the [Usage](#use-with-animation-libraries) section.

`spring-easing` works by generating arrays of `frame`'s which when placed in linear order creates a smooth spring like animation.

> A `frame` represent a single frame of an animation

> _**Note**: the `spring-easing` package also supports 4 extra variants of [`spring`](https://spring-easing.okikio.dev/modules.html#SpringFrame), namely [`spring-in`](https://spring-easing.okikio.dev/modules.html#SpringInFrame), [`spring-out`](https://spring-easing.okikio.dev/modules.html#SpringOutFrame), [`spring-out-in`](https://spring-easing.okikio.dev/modules.html#SpringOutInFrame), and [`spring-in-out`](https://spring-easing.okikio.dev/modules.html#SpringInOutFrame), you can use these easing to create some really unique spring like animations._

<!-- > You can also read the [blog post](https://blog.okikio.dev/spring-easing), created for it's launch. -->

You can create animation's like this with `spring-easing`,

<img src="assets/spring-easing-demo-video.gif" width="1920" loading="lazy" alt="A demo of the various spring-easings available" align="center" style="border-radius: 1rem; 
    aspect-ratio: auto 1920 / 899;" />

> _Check out the spring easing variants on [Codepen](https://codepen.io/okikio/pen/MWEMEgJ)._

> _**Attention**: This entire library is a lightweight version of the [`CustomEasing`](https://native.okikio.dev/animate/api/custom-easing/) implemented in [`@okikio/animate`](https://native.okikio.dev/animate), which supports only string and number interpolation. If you'd like the complete `CustomEasing` with color interpolation, complex value interpolation, and more, go through the source code as a [Github Gist](https://gist.github.com/okikio/bed53ed621cb7f60e9a8b1ef92897471#file-custom-easing-ts), which is licensed under the MIT license._
<br>
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

> _**Note:** I cannot guarantee that every animation library works with `spring-easing`, for example, if an animation library doesn't support array values as keyframes, it won't work well with `spring-easing`._

The libraries that have been tested are:

| Animation Library                                                                                | Support                                                                                                                                                       | Demo                                             |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| [GSAP](https://greensock.com/)                                                                   | ✅ Yes - [Wrap Method](<https://greensock.com/docs/v3/GSAP/UtilityMethods/wrap()>)                                                                            | [Codepen](https://codepen.io/okikio/pen/MWEMEgJ) |
| [animejs](https://animejs.com)                                                                   | ✅ Yes - [Array Keyframes](https://animejs.com/documentation/#animationKeyframes)                                                                             | [Codepen](https://codepen.io/okikio/pen/MWEMEgJ) |
| [Framer Motion](https://www.framer.com/motion/)                                                  | ✅ Yes - [Array Keyframes](https://www.framer.com/docs/animation/##keyframes)                                                                                 | [Codepen](https://codepen.io/okikio/pen/MWEMEgJ) |
| [Motion One](https://motion.dev)                                                                 | ✅ Yes - [Array Keyframes](https://motion.dev/dom/animate#keyframes)                                                                                          | [Codepen](https://codepen.io/okikio/pen/MWEMEgJ) |
| [@okikio/animate](https://okikio.github.io/native/packages/animate)                              | ✅ Yes - [Array Keyframes](https://okikio.github.io/native/packages/animate/#animations)                                                                      | [Codepen](https://codepen.io/okikio/pen/MWEMEgJ) |
| [Web Animation API (WAAPI)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) | ✅ Yes - [Array Keyframes](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats#:~:text=An-,object,-containing%20key%2Dvalue) | [Codepen](https://codepen.io/okikio/pen/MWEMEgJ) |

e.g.

```ts
import anime from "animejs";
import { SpringEasing, SpringOutFrame } from "spring-easing";

// Note: this is the return value of `SpringEasing` and `GenerateSpringFrames`
let [translateX, duration] = SpringEasing([0, 250], {
    easing: "spring-out-in(1, 100, 10, 0)",
    // You can change the size of Array for the SpringEasing function to generate
    numPoints: 200,
    // The number of decimal places to round, final values in the generated Array
    // This option doesn't exist on `GenerateSpringFrames`
    decimal: 5,
});

anime({
    targets: "div",

    // Using spring easing animate from [0 to 250] using `spring-out-in`
    translateX,

    // You can interpolate between strings
    // You can set the easing without an easing options object
    // You can interpolate between more than 2 values
    // Remember the `0` index of `SpringEasing` is an array of spring animation keyframes
    rotate: SpringEasing(
        ["0turn", 1, 0, 0.5],
        [SpringOutFrame, 1, 100, 10, 0]
    )[0],

    // TIP... Use linear easing for the proper springy effect
    easing: "linear",

    // The optimal duration for this specific spring configuration, e.g. mass, velocity, damping, etc...
    duration,
});
```

> _**Note**: make sure to read the comments above, as they are valuable resources for understanding what is happening._

> Check out this demo on [Codepen](https://codepen.io/okikio/pen/MWEdzNg)

## Showcase

A couple sites/projects that use `spring-easing`:

-   Your site/project here...

## API



<details open>
<summary><strong><em>What's New...</em></strong></summary>

> **`NEW`** _SpringEasing now support interpolating between strings. It treats the units of the first value as the units for the rest of the values to interpolate bwtween._
> e.g.
>
> ```ts
> SpringEasing(["0turn", "1px", "18rem", "125deg", 25], ...)
> ```
>
> _**Important** All the values above get transformed to `["0turn", "1turn", "18turn", "125turn", "25turn"]`, before being interpolated._

> **`NEW`** _Custom interpolation functions are now supported. `interpolateStrings`, `interpolateUsingIndex`, and `interpolateComplex`, are now built-in, they allow for supporting string keyframes._
> e.g.
>
> ```ts
> import { interpolateNumber } from "spring-easing";
> // ...
> export const interpolateColor = (t, values, decimal) => {
>     return transpose(...values.map((v) => toRGBAArr(v))).map(
>         (colors, i) => {
>             let result = interpolateNumber(t, colors);
>             return i < 3 ? Math.round(result) : toFixed(result, decimal);
>         }
>     );
> };
> 
> SpringEasing(["red", "green", "#4f4"], "spring", interpolateColor)
> ```
> _**Important** The logic for color interpolation is defined in this [Github Gist](https://gist.github.com/okikio/bed53ed621cb7f60e9a8b1ef92897471#file-utils-ts)._

</details>

The API of `spring-easing` is pretty straight forward, the `SpringEasing` function generates an array of values using a frame functions, which in turn creates the effect of spring easing.

To use this properly make sure to set the easing animation option to "linear".
Check out a demo of `SpringEasing` at <https://codepen.io/okikio/pen/MWEdzNg>

`SpringEasing` has 3 properties they are `easing` (all the easings from [EasingFunctions](https://spring-easing.okikio.dev/modules.html#EasingOptions) are supported on top of frame functions like `SpringFrame`, `SpringFrameOut`, etc..), `numPoints` (the size of the Array the frame function should create), and `decimal` (the number of decimal places of the values within said Array).

| Properties  | Default Value           |
| ----------- | ----------------------- |
| `easing`    | `spring(1, 100, 10, 0)` |
| `numPoints` | `50`                    |
| `decimal`   | `3`                     |

By default, Spring Easing support easings in the form,

| constant | accelerate         | decelerate | accelerate-decelerate | decelerate-accelerate |
| :------- | :----------------- | :--------- | :-------------------- | :-------------------- |
|          | spring / spring-in | spring-out | spring-in-out         | spring-out-in         |

All **Spring** easing's can be configured using theses parameters,

`spring-*(mass, stiffness, damping, velocity)`

Each parameter comes with these defaults

| Parameter | Default Value |
| --------- | ------------- |
| mass      | `1`           |
| stiffness | `100`         |
| damping   | `10`          |
| velocity  | `0`           |

To understand what each of the parameters of `SpringEasing` mean and how they work I suggest looking through the [SpringEasing API Documentation](https://spring-easing.okikio.dev/modules.html#SpringEasing)

> _**Note:** the return value of the `SpringEasing` function is actually `[Array of keyframes , duration]`, in that order._

For a full understanding of what is happening in the library out the [API site](https://spring-easing.okikio.dev/modules.html) for detailed API documentation.

## Browser Support

| Chrome | Edge | Firefox | Safari | IE  |
| ------ | ---- | ------- | ------ | --- |
| 4+     | 12+  | 4+      | 4+     | 10+ |

Native support for `spring-easing` is great as it doesn't use any browser specific or nodejs specific API's, you should be good to use `spring-easing` in any environment.

## Contributing

I encourage you to use [pnpm](https://pnpm.io/configuring) to contribute to this repo, but you can also use [yarn](https://classic.yarnpkg.com/lang/en/) or [npm](https://npmjs.com) if you prefer.

Install all necessary packages

```bash
npm install
```

Then run tests

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
