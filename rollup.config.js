import { terser } from "rollup-plugin-terser";
import { nodeResolve } from '@rollup/plugin-node-resolve';

import commonjs from "@rollup/plugin-commonjs";
import esbuild from "rollup-plugin-esbuild";

import bundleSize from "rollup-plugin-bundle-size";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import pkg from './package.json';

export default {
    input: "src/index.ts",
    output: [
        {
            file: path.join(__dirname, pkg.module),
            exports: "named",
            format: "es"
        },
        {
            file: path.join(__dirname, pkg.main),
            exports: "named",
            format: "cjs"
        },
        {
            file: path.join(__dirname, pkg.legacy),
            exports: "named",
            name: pkg.umd,
            format: "umd",
        },
    ],
    plugins: [
        esbuild({
            target: "es2021", // default, or 'es20XX', 'esnext'
            logLevel: "info",

            color: true,
            bundle: true,
            minify: true,
            treeShaking: true,

            sourcemap: true,
            platform: "browser",
            tsconfig: "./tsconfig.json",
        }),
        nodeResolve(),
        commonjs(),
        bundleSize(),
        terser({
            ecma: 2021,
            compress: true, mangle: true
        })
    ],
}