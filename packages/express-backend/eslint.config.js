import js from "@eslint/js";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["**/*.test.js", "**/jest.config.js"],
    files: ["**/*.js"],
    extends: [js.configs.recommended],
    rules: {
      "no-unused-vars": "warn",
    },
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
  },
]);
