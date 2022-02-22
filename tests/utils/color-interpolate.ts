import { interpolateNumber, toFixed } from "../../src";
import rgba from "color-rgba";
/**
 * Returns browser objects that can be used on the server
 * @returns An object with the following properties: `{ document, CSS }`, this so `@okikio/animate` can be used in both the browser and the server
 */
export const getBrowserObject = () => {
    return {
        document: (("document" in globalThis) ? globalThis.document : {}) as Document,
        CSS: (("CSS" in globalThis) ? globalThis.CSS : {}) as typeof CSS,
    };
}

/**
 * Returns the browser's `document` object, except if it's a server, in which case it returns an empty object
 * @returns The browser document object, but allows it to be used both in the browser and the server
 */
export const getDocument = () => {
    return getBrowserObject().document;
}

/**
 * The browser's `CSS` object, except if it's a server, in which case it returns an empty object
 * @returns The browser CSS object, except if it's a server, in which case it returns an empty object
 */
export const getCSS = () => {
    return getBrowserObject().CSS;
}

/** Determines if an object is empty */
export const isEmpty = (obj: any) => {
    for (let _ in obj) {
        return false;
    }

    return true;
};

/** 
 * Cache previously converted CSS values to avoid lots of Layout, Style, and Paint computations when computing CSS values
*/
export const CSS_CACHE = new Map<string, any | any[]>();

/** 
 * Convert colors to an [r, g, b, a] Array
*/
export const toRGBAArr = (color = "transparent") => {
    let result: number[];

    color = color.trim();
    if (CSS_CACHE.has(color)) return CSS_CACHE.get(color);
    if (isEmpty(getCSS())) {
        result = rgba(color);
    }

    if (!isEmpty(getDocument())) {
        if (!getCSS()?.supports("background-color", color)) return color;

        let el = getDocument()?.createElement("div");
        el.style.backgroundColor = color;

        let parent = getDocument()?.body;
        parent.appendChild(el);

        let { backgroundColor } = globalThis?.getComputedStyle?.(el);
        el.remove();

        let computedColor = /\(([^)]+)\)?/.exec(backgroundColor)?.[1].split(",");
        result = (computedColor.length == 3 ? [...computedColor, "1"] : computedColor).map(v => parseFloat(v));
    }

    CSS_CACHE.set(color, result);
    return result;
};

/** 
  Convert value to string, then trim any extra white space and line terminator characters from the string. 
*/
export const trim = (str: string) => (str).toString().trim();

/**
 * Convert the input to an array
 * For strings if type == "split", split the string at spaces, if type == "wrap" wrap the string in an array
 * For array do nothing
 * For everything else wrap the input in an array
 */
export const toArr = (input: any): any[] => {
    if (Array.isArray(input) || typeof input == "string") {
        if (typeof input == "string") input = input.split(/\s+/);
        return input;
    }

    return [input];
};

/**
 * Checks if a value is valid/truthy; it counts empty arrays and strings as falsey,
 * as well as null, undefined, and NaN, everything else is valid
 *
 * _**Note:** 0 counts as valid_
 *
 * @param value - anything
 * @returns true or false
 */
export const isValid = (value: any) => {
    if (Array.isArray(value) || typeof value == "string")
        return Boolean(value.length);
    return value != null && value != undefined && !Number.isNaN(value);
};

/**
 * Flips the rows and columns of 2-dimensional arrays
 *
 * Read more on [underscorejs.org](https://underscorejs.org/#zip) & [lodash.com](https://lodash.com/docs/4.17.15#zip)
 *
 * @example
 * ```ts
 * transpose(
 *      ['moe', 'larry', 'curly'],
 *      [30, 40, 50],
 *      [true, false, false]
 * );
 * // [
 * //     ["moe", 30, true],
 * //     ["larry", 40, false],
 * //     ["curly", 50, false]
 * // ]
 * ```
 * @param [...args] - the arrays to process as a set of arguments
 * @returns
 * returns the new array of grouped elements
 */
// (TypeCSSGenericPropertyKeyframes | TypeCSSGenericPropertyKeyframes[])[]
export const transpose = (...args: (any | any[])[]) => {
    let largestArrLen = 0;
    args = args.map((arr) => {
        // Convert all values in arrays to an array
        // This ensures that `arrays` is an array of arrays
        let result = toArr(arr);

        // Finds the largest array
        let len = result.length;
        if (len > largestArrLen) largestArrLen = len;
        return result;
    });

    // Flip the rows and columns of arrays
    let result = [];
    let len = args.length;
    for (let col = 0; col < largestArrLen; col++) {
        result[col] = [];

        for (let row = 0; row < len; row++) {
            let val = args[row][col];
            if (isValid(val)) result[col][row] = val;
        }
    }

    return result;
};

/** 
  Use the `color-rgba` npm package, to convert all color formats to an Array of rgba values, 
  e.g. `[red, green, blue, alpha]`. Then, use the {@link interpolateNumber} functions to interpolate over the array
  
  _**Note**: the red, green, and blue colors are rounded to intergers with no decimal places, 
  while the alpha color gets rounded to a specific decimal place_
  Make sure to read {@link interpolateNumber}.
*/
export const interpolateColor = (t: number, values: string[], decimal = 3) => {
    return `rgba(${
        transpose(...values.map((v) => toRGBAArr(v))).map(
            (colors: number[], i) => {
                let result = interpolateNumber(t, colors);
                return i < 3 ? Math.round(result) : toFixed(result, decimal);
            }
        )
    })`;
};
