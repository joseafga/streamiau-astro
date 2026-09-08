import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import htmlToEcr from "./astro-html-to-ecr.js";

// https://astro.build/config
export default defineConfig({
  trailingSlash: "never",
  output: "static",
  outDir: "./dist",
  build: {
    format: "file",
    assets: "assets",
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    react(),
    htmlToEcr({
      views: "../streamiau/src/streamiau/views/",
      assets: "../streamiau/public",
    }),
  ],
});
