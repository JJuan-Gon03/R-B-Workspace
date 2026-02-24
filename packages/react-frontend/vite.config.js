import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "R-B-Workspace",
  test: {
    environment: "jsdom",
    setupFiles: "./tests/setupTests.js",
    globals: true,
  },
});
