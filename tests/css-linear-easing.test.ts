import { describe, it, expect } from "vitest";
import { CSSSpringEasing, SpringFrame, SpringInOutFrame, SpringOutFrame, SpringOutInFrame, registerEasingFunction, registerEasingFunctions } from "../src/mod";

describe("CSS Easing", () => {
  it('With default values', () => {
    expect(CSSSpringEasing())
      .toEqual([
        '0, 0.057, 0.199 5.4%, 0.761 13.5%, 0.914, 1.029, 1.107, 1.149, 1.163, 1.155, 1.132 32.4%, 1.016 43.2%, 0.996 45.9%, 0.976, 0.975 56.8%, 1.003 75.7%, 1',
        1333.3333333333333
      ]);

  })

  it('Easing using Array Frame Format (only the frame function is specified) [SpringOutFrame]', () => {
    let [frames, duration] = CSSSpringEasing([SpringOutFrame]);
    expect([frames, duration])
      .toEqual([
        '0, -0.003 24.3%, 0.025 43.2%, 0.024, 0.004 54.1%, -0.016 56.8%, -0.132 67.6%, -0.155, -0.163, -0.149, -0.107, -0.029, 0.086, 0.239 86.5%, 0.801 94.6%, 0.943, 1',
        1333.3333333333333
      ]);
  })

  // Even though I'd prefer if people didn't only set some of the spring parameters
  // I predict people will, so, `spring-easing` will warn about doing things like this
  it('Easing using string format (partially filled spring parameters) `spring-out(1, 100)`', () => {
    let [frames, duration] = CSSSpringEasing(`spring-out(1, 100)`);
    expect([frames, duration])
      .toEqual([
        '0, -0.003 24.3%, 0.025 43.2%, 0.024, 0.004 54.1%, -0.016 56.8%, -0.132 67.6%, -0.155, -0.163, -0.149, -0.107, -0.029, 0.086, 0.239 86.5%, 0.801 94.6%, 0.943, 1',
        1333.3333333333333
      ]);
  })

  // Even though I'd prefer if people didn't only set some of the spring parameters
  // I predict people will, so, `spring-easing` will warn about doing things like this
  it('Easing using string format (completely filled spring parameters) `spring-out(1, 100, 10, 0)`', () => {
    let [frames, duration] = CSSSpringEasing(`spring-out(1, 100, 10, 0)`);
    expect([frames, duration])
      .toEqual([
        '0, -0.003 24.3%, 0.025 43.2%, 0.024, 0.004 54.1%, -0.016 56.8%, -0.132 67.6%, -0.155, -0.163, -0.149, -0.107, -0.029, 0.086, 0.239 86.5%, 0.801 94.6%, 0.943, 1',
        1333.3333333333333
      ]);
  })

  it('Easing using Array Frame format (partially & completely filled spring parameters)', () => {
    let solution = [
      '0, 0.099 2.7%, 0.457 8.1%, 0.553, 0.581, 0.566 16.2%, 0.508 21.6%, 0.492, 0.487 27%, 0.502 40.5%, 0.499 62.2%, 0.513 73%, 0.508, 0.492 78.4%, 0.434 83.8%, 0.419, 0.447, 0.543 91.9%, 0.901 97.3%, 1',
      1333.3333333333333
    ];

    // Partial
    let partial = CSSSpringEasing([SpringInOutFrame, 1, 100]);
    expect(partial)
      .toEqual(solution);

    // Complete
    let complete = CSSSpringEasing([SpringInOutFrame, 1, 100, 10, 0]);
    expect(complete)
      .toEqual(solution);
  })

  it('Easing using both formats (maximums & minimums spring parameters)', () => {
    let solutionMin = [
      '0, 0.093 2.7%, 0.441 8.1%, 0.544, 0.58, 0.572 16.2%, 0.515 21.6%, 0.496, 0.487 27%, 0.502 40.5%, 0.498 59.5%, 0.513 73%, 0.504, 0.485 78.4%, 0.428 83.8%, 0.42, 0.456, 0.559 91.9%, 0.907 97.3%, 1',
      12833.333333333321
    ];

    let solutionMax = [
      '0, 262.711, 66.026, -41.397, -24.507, 3.568, 6.82, 1.395, -0.681 21.6%, 0.639 27%, 0.644, 0.505, 0.469 35.1%, 0.505 40.5%, 0.495 59.5%, 0.531 64.9%, 0.495, 0.356, 0.361 73%, 1.681 78.4%, -0.395, -5.82, -2.568, 25.507, 42.397, -65.026, -261.711, 1',
      27833.333333333394
    ];

    // Minimums for Spring Parameter
    let minimum = CSSSpringEasing([SpringInOutFrame, -5000, -5000, -5000, -5000]);
    expect(minimum)
      .toEqual(solutionMin);

    // Maximums for Spring Parameter
    let maximum = CSSSpringEasing([SpringInOutFrame, 5000, 5000, 5000, 5000]);
    expect(maximum)
      .toEqual(solutionMax);

    // Minimums for Spring Parameter (string format)
    let minimumStr = CSSSpringEasing(`spring-in-out(-5000, -5000, -5000, -5000)`);
    expect(minimumStr)
      .toEqual(solutionMin);

    // Maximums for Spring Parameter (string format)
    let maximumStr = CSSSpringEasing(`spring-in-out(5000, 5000, 5000, 5000)`);
    expect(maximumStr)
      .toEqual(solutionMax);
  })

  it('Other easing options', () => {
    let solutionMin = [
      '0, 0.0213858, 0.0760052 2.40481%, 0.4660091 8.61723%, 0.5389152, 0.5746306 12.62525%, 0.5814869, 0.5774941 15.43086%, 0.5063437 22.64529%, 0.4871971 27.25451%, 0.5015188 39.67936%, 0.4980748 59.31864%, 0.5125414 70.34068%, 0.5116291 73.54709%, 0.4920844 77.55511%, 0.425114 84.16834%, 0.4187121 85.57114%, 0.4208612 86.77355%, 0.4511391, 0.5249359 91.18236%, 0.9348226 97.79559%, 0.9848663 98.998%, 1',
      12833.333333333321
    ];

    let solutionMax = [
      '0, 272.6, 171.44, 20.42, -41.88, -32.5, -6.6, 6.64, 6.63, 2.38, -0.29, -0.6 22%, 0.58 27%, 0.69 29%, 0.5 33%, 0.47 35%, 0.5 39% 61%, 0.53 65%, 0.5, 0.31 71%, 0.42 73%, 1.6 78%, 1.29, -1.38, -5.63, -5.64, 7.6, 33.5, 42.88, -19.42, -170.44, -271.6, 1',
      27833.333333333394
    ];

    // Minimums for Spring Parameter
    let minimum = CSSSpringEasing({
      easing: [SpringInOutFrame, -5000, -5000, -5000, -5000],
      numPoints: 500,
      decimal: 7
    });
    expect(minimum)
      .toEqual(solutionMin);

    // Maximums for Spring Parameter
    let maximum = CSSSpringEasing({
      easing: `spring-in-out(5000, 5000, 5000, 5000)`,
      numPoints: 50,
      decimal: 2
    });
    expect(maximum)
      .toEqual(solutionMax);
  })

  it('All frames function', () => {
    let easeIn = CSSSpringEasing({
      easing: [SpringFrame, 1, 100, 10, 0],
      numPoints: 50,
      decimal: 2
    });
    expect(easeIn)
      .toEqual([
        '0, 0.03, 0.12 4%, 0.68 12%, 0.92, 1.08 20%, 1.12, 1.15, 1.16, 1.16, 1.15 31%, 1.02 43%, 0.99, 0.98 51%, 0.97 57%, 1 69% 100%',
        1333.3333333333333
      ]);

    let easeOut = CSSSpringEasing({
      easing: [SpringOutFrame, 1, 100, 10, 0],
      numPoints: 50,
      decimal: 2
    });
    expect(easeOut)
      .toEqual([
        '0 0% 31%, 0.03 43%, 0.02 49%, 0.01, -0.02 57%, -0.15 69%, -0.16, -0.16, -0.15, -0.12, -0.08 80%, 0.08, 0.32 88%, 0.88 96%, 0.97, 1',
        1333.3333333333333
      ]);

    let easeInOut = CSSSpringEasing({
      easing: [SpringInOutFrame, 1, 100, 10, 0],
      numPoints: 50,
      decimal: 2
    });
    expect(easeInOut)
      .toEqual([
        '0, 0.06 2%, 0.46 8%, 0.54, 0.58 12% 14%, 0.5 22%, 0.49 27%, 0.5 39% 61%, 0.51 71% 76%, 0.48 80%, 0.42 86% 88%, 0.46, 0.54 92%, 0.94 98%, 1',
        1333.3333333333333
      ]);

    let easeOutIn = CSSSpringEasing({
      easing: [SpringOutInFrame, 1, 100, 10, 0],
      numPoints: 50,
      decimal: 2
    });
    expect(easeOutIn)
      .toEqual([
        '0, 0, 0.01 24%, -0.01, -0.07 35%, -0.08, -0.06, -0, 0.1, 0.38 47%, 0.48, 0.52 51%, 0.9 57%, 1, 1.06, 1.08, 1.07 65%, 1.01, 0.99 76%, 1, 1',
        1333.3333333333333
      ]);
  })

  it('Different quality settings', () => {
    const results: string[] = [
      /* quality = 0 */ '0, 0.91 16%, 1.15 24% 30%, 0.98 51%, 1',
      /* quality = 0.2 */ '0, 0.91 16%, 1.15 24% 30%, 1.02 43%, 0.98 51%, 1',
      /* quality = 0.3 */ '0, 0.2 5%, 0.91 16%, 1.15 24% 30%, 1.02 43%, 0.98 51%, 1',
      /* quality = 0.35555 */ '0, 0.2 5%, 0.91 16%, 1.15 24% 30%, 1.02 43%, 0.98 51%, 1',
      /* quality = 0.6 */ '0, 0.06, 0.2 5%, 0.91 16%, 1.03 19%, 1.15, 1.16, 1.15 30%, 1.02 43%, 0.98 51%, 1, 1',
      /* quality = -0.3 */ '0, 0.91 16%, 1.15 24% 30%, 0.98 51%, 1',
      /* quality = 0.9 */ '0, 0.06, 0.2 5%, 0.76 14%, 0.91, 1.03, 1.11, 1.15, 1.16, 1.15, 1.13 32%, 1.04 41%, 1.02, 1, 0.98 49% 51%, 0.97 57%, 1 70% 100%',
      // (default) quality
      /* quality = 0.85 */ '0, 0.06, 0.2 5%, 0.76 14%, 0.91, 1.03, 1.11, 1.15, 1.16, 1.15, 1.13 32%, 1.02 43%, 1, 0.98, 0.97 57%, 1 76%, 1',
      /* quality = 1 */ '0, 0.06, 0.2, 0.38, 0.58, 0.76, 0.91, 1.03, 1.11, 1.15, 1.16, 1.15, 1.13, 1.1, 1.07, 1.04, 1.02, 1, 0.98, 0.98, 0.97, 0.97, 0.98, 0.98, 0.99, 0.99, 1 70% 100%',
      /* quality = 1.2 */ '0, 0.06, 0.2, 0.38, 0.58, 0.76, 0.91, 1.03, 1.11, 1.15, 1.16, 1.15, 1.13, 1.1, 1.07, 1.04, 1.02, 1, 0.98, 0.98, 0.97, 0.97, 0.98, 0.98, 0.99, 0.99, 1 70% 100%',
      /* quality = 1000 */ '0, 0.06, 0.2, 0.38, 0.58, 0.76, 0.91, 1.03, 1.11, 1.15, 1.16, 1.15, 1.13, 1.1, 1.07, 1.04, 1.02, 1, 0.98, 0.98, 0.97, 0.97, 0.98, 0.98, 0.99, 0.99, 1 70% 100%',
      /* quality = 90 */ '0, 0.06, 0.2, 0.38, 0.58, 0.76, 0.91, 1.03, 1.11, 1.15, 1.16, 1.15, 1.13, 1.1, 1.07, 1.04, 1.02, 1, 0.98, 0.98, 0.97, 0.97, 0.98, 0.98, 0.99, 0.99, 1 70% 100%',
      /* quality = '64' */ '0, 0.06, 0.2, 0.38, 0.58, 0.76, 0.91, 1.03, 1.11, 1.15, 1.16, 1.15, 1.13, 1.1, 1.07, 1.04, 1.02, 1, 0.98, 0.98, 0.97, 0.97, 0.98, 0.98, 0.99, 0.99, 1 70% 100%',
      /* quality = NaN */ '0, 1',
      /* quality = null */ '0, 0.06, 0.2 5%, 0.76 14%, 0.91, 1.03, 1.11, 1.15, 1.16, 1.15, 1.13 32%, 1.02 43%, 1, 0.98, 0.97 57%, 1 76%, 1',
      /* quality = undefined */ '0, 0.06, 0.2 5%, 0.76 14%, 0.91, 1.03, 1.11, 1.15, 1.16, 1.15, 1.13 32%, 1.02 43%, 1, 0.98, 0.97 57%, 1 76%, 1',
      /* quality = true */ '0, 0.06, 0.2, 0.38, 0.58, 0.76, 0.91, 1.03, 1.11, 1.15, 1.16, 1.15, 1.13, 1.1, 1.07, 1.04, 1.02, 1, 0.98, 0.98, 0.97, 0.97, 0.98, 0.98, 0.99, 0.99, 1 70% 100%',
      /* quality = false */ '0, 0.91 16%, 1.15 24% 30%, 0.98 51%, 1',
    ]
    // string interpolation
    expect([0, 0.2, 0.3, 0.35555, 0.6, -0.3, 0.9, 0.85, 1, 1.2, 1000, 90, '64', NaN, null, undefined, true, false].map(q => CSSSpringEasing({
      easing: "spring",
      decimal: 2,
      quality: q as number
    })[0])).toEqual(results)
  })

  it('Register custom easing functions', () => {
    registerEasingFunction("linear", (t) => t);
    registerEasingFunctions({
      quad: (t) => Math.pow(t, 2),
      cubic: (t) => Math.pow(t, 3),
    });

    let [easings] = CSSSpringEasing({
      easing: "linear",
      numPoints: 100,
      decimal: 2
    });

    expect(easings).toEqual('0, 1')

    let [easings2] = CSSSpringEasing({
      easing: "quad",
      numPoints: 100,
      decimal: 2
    });
    expect(easings2).toEqual('0, 0.01, 0.06, 0.13, 0.24, 0.38, 0.56, 0.77, 1')

    let [easings3] = CSSSpringEasing({
      easing: "quad",
      numPoints: 100,
      decimal: 2
    });
    expect(easings3).toEqual('0, 0.01, 0.06, 0.13, 0.24, 0.38, 0.56, 0.77, 1')
  })
});


describe('CSSSpringEasing 2', () => {
  it('should return an easing string and a duration with default parameters', () => {
    const result = CSSSpringEasing({});
    expect(typeof result[0]).toBe('string');
    expect(typeof result[1]).toBe('number');
  });

  it('should handle larger numPoints correctly', () => {
    const result = CSSSpringEasing({ numPoints: 100 });
    const easingString = result[0];
    const keyframes = easingString.split(', ');

    // Test that the number of x-value,y-value pairs is equal to numPoints
    expect(keyframes.length / 2).toEqual(17 / 2);
  });

  it('should format values to correct number of decimal places', () => {
    const result = CSSSpringEasing({ decimal: 2 });
    const easingString = result[0];
    const keyframes = easingString.split(', ');

    // Check that values are formatted to 2 decimal places
    keyframes.forEach((keyframe) => {
      const yValue = keyframe.split(" ");
      const decimalPlaces = yValue[0].split('.')[1]?.length || 0;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });
  });

  it('should correctly use the quality parameter', () => {
    const highQualityResult = CSSSpringEasing({ quality: 1 });
    const lowQualityResult = CSSSpringEasing({ quality: 0 });

    // High quality result should have more keyframes than low quality result
    const highQualityKeyframes = highQualityResult[0].split(', ');
    const lowQualityKeyframes = lowQualityResult[0].split(', ');
    expect(highQualityKeyframes.length).toBeGreaterThan(lowQualityKeyframes.length);
  });

  it('should accept a custom easing function and use it correctly', () => {
    const customEasing = 'spring-out-in(2, 200, 20, 0)';
    const result = CSSSpringEasing({ easing: customEasing });
    const easingString = result[0];

    // Due to the nature of the function, it's hard to test the exact output.
    // We can, however, test that the output is different from the default easing.
    const defaultResult = CSSSpringEasing({});
    const defaultEasingString = defaultResult[0];

    expect(easingString).not.toEqual(defaultEasingString);
  });

  it('should throw an error if an invalid easing function is provided', () => {
    const invalidEasing = 'not-a-real-easing-function()';
    expect(() => CSSSpringEasing({ easing: invalidEasing })).toThrow();
  });
});
