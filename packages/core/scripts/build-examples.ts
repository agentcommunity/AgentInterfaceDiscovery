import fs from "node:fs/promises"
import path from "node:path"

const examplesDir = path.resolve(__dirname, "../../examples")
const outputDir = path.resolve(__dirname, "../../web/aid-generator/public/samples")

/**
 * This script is the critical link between the canonical examples
 * and the web UI. It performs two main functions:
 *
 * 1.  Copies Raw Configs: It finds all `config.json` files in the `packages/examples`
 *     directory and copies them directly to `packages/web/aid-generator/public/samples`.
 *     This ensures the web UI's "Load Sample" feature uses the exact, unaltered
 *     source configuration, which is essential for the new refactored architecture.
 *
 * 2.  Generates an Index: It creates an `index.json` file that lists all the
 *     discovered samples. The web UI's `SampleLoader` component fetches this index
 *     to dynamically populate its dropdown menu.
 */
async function buildSamples() {
  console.log("🔍 Finding and building examples...")

  try {
    // Ensure the output directory exists
    await fs.mkdir(outputDir, { recursive: true })

    const exampleFolders = await fs.readdir(examplesDir, { withFileTypes: true })
    const sampleIndex: { name: string; file: string }[] = []

    for (const dirent of exampleFolders) {
      if (dirent.isDirectory()) {
        const exampleName = dirent.name
        const configFile = "config.json"
        const configPath = path.join(examplesDir, exampleName, configFile)

        try {
          // Check if config.json exists
          await fs.access(configPath)

          const destFileName = `${exampleName}.json`
          const destPath = path.join(outputDir, destFileName)

          // Copy the raw config file
          await fs.copyFile(configPath, destPath)
          console.log(`✅ Copied ${exampleName} config to ${destPath}`)

          // Add to the index
          sampleIndex.push({
            name: exampleName.charAt(0).toUpperCase() + exampleName.slice(1).replace(/-/g, " "),
            file: destFileName,
          })
        } catch (error) {
          // config.json doesn't exist for this folder, which is fine (e.g., 'public' folder)
          // We safely check the error code to ensure we only ignore "File Not Found" errors.
          if (error && typeof error === "object" && "code" in error && error.code !== "ENOENT") {
            console.warn(`⚠️ Could not process example "${exampleName}":`, error)
          }
        }
      }
    }

    // Add an empty config to the list for resetting the form
    const emptyConfig = {
      schemaVersion: "1",
      serviceName: "",
      domain: "",
      implementations: [],
    }
    const emptyPath = path.join(outputDir, "empty.json")
    await fs.writeFile(emptyPath, JSON.stringify(emptyConfig, null, 2))
    sampleIndex.unshift({ name: "Empty", file: "empty.json" })


    // Write the final index file
    const indexPath = path.join(outputDir, "index.json")
    await fs.writeFile(indexPath, JSON.stringify(sampleIndex, null, 2))
    console.log(`✅ Wrote sample index to ${indexPath}`)

    console.log("🎉 Examples built successfully!")
  } catch (error) {
    console.error("❌ Failed to build examples:", error)
    process.exit(1)
  }
}

buildSamples() 