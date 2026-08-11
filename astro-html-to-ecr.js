import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EXT_REGEX = /\.html$/;

export default function htmlToEcr(config) {
  return {
    name: "html-to-ecr",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        const buildPath = fileURLToPath(dir);
        const viewsPath = path.join(process.cwd(), config.views);
        const assetsPath = path.join(process.cwd(), config.assets);
        const files = fs.globSync("**/*.html", { cwd: buildPath });

        // Create views folder if not exists
        fs.mkdirSync(viewsPath, { recursive: true });

        files.forEach((file) => {
          const fromPath = path.join(buildPath, file);
          const renamedPath = path.join(viewsPath, file).replace(EXT_REGEX, ".ecr");

          // Ensure the destination directory exists
          const destDir = path.dirname(renamedPath);
          fs.mkdirSync(destDir, { recursive: true });

          // Remove if already exists
          if (fs.existsSync(renamedPath)) {
            fs.rmSync(renamedPath, { force: true });
          }
          fs.renameSync(fromPath, renamedPath);

          // Remove directory if empty
          const fromDir = path.dirname(fromPath) + path.sep;
          if (fromDir != buildPath && fs.existsSync(fromDir)) {
            try {
              fs.rmdirSync(fromDir);
              console.log(`\x1b[32m✓ Removed empty folder: ${path.relative(buildPath, fromDir)}`);
            } catch {
              // Not empty
            }
          }

          console.log(`\x1b[32m✓ ${file} → ${path.relative(buildPath, renamedPath)}`);
        });

        // remove old assets folder
        if (fs.existsSync(assetsPath)) {
          fs.rmSync(assetsPath, { recursive: true, force: true });
        }
        fs.mkdirSync(assetsPath, { recursive: true });

        // Moving all other files to assets
        const remain = fs.readdirSync(buildPath);

        remain.forEach((files) => {
          const fromPath = path.join(buildPath, files);
          const toPath = path.join(assetsPath, files);

          fs.renameSync(fromPath, toPath);
        });
      },
    },
  };
}
