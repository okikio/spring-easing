import glob from "fast-glob";
import { unified } from "unified";

import fs from "fs/promises";
import path from "path";

import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";

import { h, s } from "hastscript";

export function redirectURLs(url) {
    if (/^\/docs/.test(url.path)) {
        return url.path.replace(/^\/docs\//, "/").replace(/\.md$/, "");
    } else if (/\.md$/.test(url.path)) {
        return url.path.replace(/\.md$/, "");
    } else if (/LICENSE$/i.test(url.path)) {
        return "https://github.com/okikio/spring-easing/tree/main/LICENSE";
    }
}

async function importPlugin(p) {
    if (typeof p === "string") 
        return await import(p);

    return await p;
}

export function loadPlugins(items) {
    return items.map((p) => {
        return new Promise((resolve, reject) => {
            if (Array.isArray(p)) {
                const [plugin, opts] = p;
                return importPlugin(plugin)
                    .then((m) => resolve([m.default, opts]))
                    .catch((e) => reject(e));
            }

            return importPlugin(p)
                .then((m) => resolve([m.default]))
                .catch((e) => reject(e));
        });
    });
}

const __dirname = path.resolve(path.dirname(""));
(async () => {
    const plugins = [
        ["rehype-slug"],
        ["rehype-urls", redirectURLs],
        ["rehype-accessible-emojis"],
        ["rehype-external-links", {
            target: "_blank",
            rel: ["noopener"],
            content: [
                // Based on the external icon from https://www.gitpod.io/blog/workspace-networking
                h("span.external-icon", [
                    s("svg", {
                        preserveAspectRatio: "xMidYMid meet",
                        width: "1.2em",
                        height: "1.2em",
                        viewBox: "0 0 24 24",
                    }, [
                        s("path", {
                            d: "M10.75 3a.75.75 0 0 0 0 1.5h7.67L3.22 19.7a.764.764 0 1 0 1.081 1.081l15.2-15.2v7.669a.75.75 0 0 0 1.5 0v-9.5a.75.75 0 0 0-.75-.75h-9.5Z",
                        }),
                    ]),
                ]),
                // `<span><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M1 13L13 1m0 0H5m8 0v7" stroke="#1155cc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`
            ],
        }],
    ];

    let parser = unified()
        .use(rehypeParse)
        .use(rehypeStringify);

    const loadedRehypePlugins = await Promise.all(loadPlugins(plugins));
    loadedRehypePlugins.forEach(([plugin, opts]) => {
        parser.use(plugin, opts);
    });

    const paths = await glob("docs/**/*.html");
    let result;
    try {
        paths.forEach((p) => {
            (async () => {
                const currentPath = path.join(__dirname, p);
                const content = await fs.readFile(currentPath);
                const vfile = await parser
                    .process(content.toString());
                result = vfile.toString();
                await fs.writeFile(currentPath, result, "utf-8");
            })();
        });
    } catch (err) {
        throw err;
    }
})();
