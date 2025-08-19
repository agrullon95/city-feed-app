import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js },
    extends: ["js/recommended", "plugin:prettier/recommended"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
  {
    files: ["frontend/web/**/*.{js,jsx}"],
    plugins: { react: pluginReact },
    extends: ["plugin:react/recommended", "next/core-web-vitals"],
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
  },
]);