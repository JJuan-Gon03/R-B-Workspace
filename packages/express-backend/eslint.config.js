import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([
  {
    ignores: ["**/*.test.js", "**/jest.config.js"],
    files: ["**/*.js"],
    extends: [js.configs.recommended],
    rules: {
      "no-unused-vars": ["warn", { ignoreRestSiblings: true }],
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]);
