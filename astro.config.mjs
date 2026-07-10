import tailwindcss from "@tailwindcss/vite";
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
    htmlToEcr({
      views: "../../crystal/streamiau/src/streamiau/views/",
      assets: "../../crystal/streamiau/public",
    }),
  ],
});
