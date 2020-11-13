const riot = require('rollup-plugin-riot');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const multiInput = require("rollup-plugin-multi-input").default;
const nodeResolve = require("@rollup/plugin-node-resolve").default;

export default [
    {
        input: ["src/**/!(*.d.ts)"],
        external: [ "riot", "history-manager" ],
        plugins: [
            multiInput(),
            nodeResolve(),
            commonjs(),
            typescript(),
            riot()
        ],
        output: {
            dir: "dist/amd",
            format: "amd"
        }
    },
    {
        input: ["src/**/!(*.d.ts)"],
        external: [ "riot", "history-manager" ],
        plugins: [
            multiInput(),
            nodeResolve(),
            commonjs(),
            typescript(),
            riot()
        ],
        output: {
            dir: "dist/cjs",
            format: "cjs",
            exports: "auto"
        }
    },
    {
        input: ["src/**/!(*.d.ts)"],
        external: [ "riot", "history-manager" ],
        plugins: [
            multiInput(),
            nodeResolve(),
            commonjs(),
            typescript(),
            riot()
        ],
        output: {
            dir: "dist/es",
            format: "es"
        }
    },
    {
        input: "src/index.ts",
        plugins: [
            nodeResolve(),
            commonjs(),
            typescript(),
            riot()
        ],
        output: {
            file: "dist/amd+libs.js",
            format: "amd"
        }
    },
    {
        input: "src/index.ts",
        external: [ "riot", "history-manager" ],
        plugins: [
            nodeResolve(),
            commonjs(),
            typescript(),
            riot()
        ],
        output: {
            file: "dist/amd.js",
            format: "amd"
        }
    },
    {
        input: "src/index.ts",
        external: [ "riot", "history-manager" ],
        plugins: [
            nodeResolve(),
            commonjs(),
            typescript(),
            riot()
        ],
        output: {
            file: "dist/umd.js",
            format: "umd",
            globals: {
                "riot": "riot",
                "history-manager": "historyManager"
            }
        }
    },
    {
        input: "src/index.ts",
        plugins: [
            nodeResolve(),
            commonjs(),
            typescript(),
            riot()
        ],
        output: {
            file: "dist/umd+libs.js",
            format: "umd"
        }
    },
    {
        input: "test/src/index.js",
        plugins: [
            nodeResolve(),
            commonjs(),
            typescript(),
            riot()
        ],
        output: {
            dir: "test/scripts",
            format: "amd"
        }
    }
];