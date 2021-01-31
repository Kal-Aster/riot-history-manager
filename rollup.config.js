const riot = require('rollup-plugin-riot');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const nodeResolve = require("@rollup/plugin-node-resolve").default;

const basicGlobals = {
    "riot": "riot"
};
const basicExternal = Object.keys(basicGlobals);
const globals = {
    ...basicGlobals,
    "history-manager": "historyManager"
};
const external = Object.keys(globals);

export default [
    {
        input: "src/index.ts",
        external,
        plugins: [
            nodeResolve(),
            typescript(),
            commonjs(),
            riot()
        ],
        output: [
            {
                name: "riotHistoryManager",
                file: "dist/index.js",
                format: "umd",
                globals
            },
            {
                file: "dist/index.es.js",
                format: "es"
            }
        ]
    },
    {
        input: "src/index.ts",
        external: basicExternal,
        plugins: [
            nodeResolve(),
            typescript(),
            commonjs(),
            riot()
        ],
        output: [
            {
                name: "riotHistoryManager",
                file: "dist/index+libs.js",
                format: "umd",
                globals: basicGlobals
            },
            {
                file: "dist/index.es+libs.js",
                format: "es"
            }
        ]
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