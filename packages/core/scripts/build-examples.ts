import { promises as fs } from "fs";
import path from "path";
import { AidGeneratorConfig } from "../src/types";
import { writeManifest, writeTxtSnippet } from "../src/generator";

const examplesDir = path.resolve(__dirname, "../../../packages/examples");

async function buildExamples() {
  try {
    const exampleDirs = await fs.readdir(examplesDir, { withFileTypes: true });
    console.log(`Found ${exampleDirs.length} potential examples. Building...`);

    for (const dirent of exampleDirs) {
      if (dirent.isDirectory()) {
        const examplePath = path.join(examplesDir, dirent.name);
        const configPath = path.join(examplePath, "config.json");

        try {
          await fs.access(configPath);
          console.log(`\nBuilding example: ${dirent.name}`);
          
          const configContent = await fs.readFile(configPath, "utf-8");
          const config = JSON.parse(configContent) as AidGeneratorConfig;

          // The manifest goes into a Vercel/Next.js-friendly public directory
          const manifestOutDir = path.join(examplePath, "public", ".well-known");
          const packageJsonPath = path.join(examplePath, "package.json");
          
          const packageJsonContent = {
            name: `aid-example-${dirent.name}`,
            private: true,
          };

          const [manifestPath, txtPath] = await Promise.all([
            writeManifest(config, manifestOutDir),
            writeTxtSnippet(config, examplePath),
            fs.writeFile(packageJsonPath, JSON.stringify(packageJsonContent, null, 2), "utf-8"),
          ]);

          console.log(`  ✓ Wrote manifest to ${path.relative(examplePath, manifestPath)}`);
          console.log(`  ✓ Wrote TXT record to ${path.relative(examplePath, txtPath)}`);

        } catch (error: any) {
          if (error.code === 'ENOENT') {
            // This is expected if a directory doesn't have a config.json
          } else {
            console.error(`\n✗ Error building example: ${dirent.name}`);
            console.error(error);
          }
        }
      }
    }
    console.log("\n✅ All examples built successfully.");
  } catch (error) {
    console.error("Fatal error during example build process:", error);
    process.exit(1);
  }
}

buildExamples(); 