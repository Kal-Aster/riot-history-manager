const riot = require('rollup-plugin-riot');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const nodeResolve = require("@rollup/plugin-node-resolve").default;

const globals = {
    "riot": "riot",
    "history-manager": "historyManager"
};
const external = Object.keys(globals);

export default [
    {
        input: "src/index.ts",
        external,
        plugins: [
            nodeResolve(),
            commonjs(),
            typescript(),
            riot()
        ],
        output: {
            file: "dist/index.js",
            format: "cjs",
            exports: "auto"
        }
    },
    {
        input: "src/index.ts",
        external,
        plugins: [
            nodeResolve(),
            commonjs(),
            typescript(),
            riot()
        ],
        output: {
            file: "dist/index.es.js",
            format: "es"
        }
    },
    {
        input: "src/index.ts",
        external,
        plugins: [
            nodeResolve(),
            commonjs(),
            typescript(),
            riot()
        ],
        output: {
            file: "dist/index.amd.js",
            format: "amd"
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
            file: "dist/index.amd+libs.js",
            format: "amd"
        }
    },
    {
        input: "src/index.ts",
        external,
        plugins: [
            nodeResolve(),
            commonjs(),
            typescript(),
            riot()
        ],
        output: {
            name: "riotHistoryManager",
            file: "dist/index.umd.js",
            format: "umd",
            globals
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
            name: "riotHistoryManager",
            file: "dist/index.umd+libs.js",
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