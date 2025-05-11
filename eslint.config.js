const {
    defineConfig,
} = require("eslint/config");

const globals = require("globals");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const simpleImportSort = require("eslint-plugin-simple-import-sort");
const unusedImports = require("eslint-plugin-unused-imports");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([
    ...compat.extends(
        "eslint:recommended",
        "next",
        "next/core-web-vitals",
        "plugin:@typescript-eslint/recommended",
        "prettier"
    ),
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                React: true,
                JSX: true,
            },
        },

        plugins: {
            "@typescript-eslint": typescriptEslint,
            "simple-import-sort": simpleImportSort,
            "unused-imports": unusedImports,
        },

        rules: {
            "no-unused-vars": "off",
            "no-console": "warn",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "react/no-unescaped-entities": "error",
            "react/display-name": "off",
            "jsx-a11y/alt-text": "off",

            "react/jsx-curly-brace-presence": ["warn", {
                props: "never",
                children: "never",
            }],

            "@typescript-eslint/no-unused-vars": "off",
            "unused-imports/no-unused-imports": "warn",
            "unused-imports/no-unused-vars": "off",

            "simple-import-sort/exports": "warn",

            "simple-import-sort/imports": ["warn", {
                groups: [
                    ["^@?\\w", "^\\u0000"],
                    ["^.+\\.s?css$"],
                    ["^@/lib", "^@/hooks"],
                    ["^@/data"],
                    ["^@/components", "^@/container"],
                    ["^@/store"],
                    ["^@/"],
                    [
                        "^\\./?$",
                        "^\\.(?!/?$)",
                        "^\\.\\./?$",
                        "^\\.\\.(?!/?$)",
                        "^\\.\\./\\.\\./?$",
                        "^\\.\\./\\.\\.(?!/?$)",
                        "^\\.\\./\\.\\./\\.\\./?$",
                        "^\\.\\./\\.\\./\\.\\.(?!/?$)",
                    ],
                    ["^@/types"],
                    ["^"],
                ],
            }],
        },
    }
]);
