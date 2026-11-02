import js from "@eslint/js";
import globals from "globals";
import hooks from "eslint-plugin-react-hooks";
import react from "eslint-plugin-react";
export default [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "test-results/**",
      "playwright-report/**",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,mjs}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { "react-hooks": hooks, react },
    rules: {
      ...hooks.configs.recommended.rules,
      "react/jsx-uses-vars": "error",
      "react/jsx-key": "error",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
];
