import fs from "node:fs/promises"
import path from "node:path"
import { writeManifest, writeTxtSnippet } from "../src/generator"
import type { AidGeneratorConfig } from "../src/types"

const examplesDir = path.resolve(__dirname, "../../examples")
const publicDir = path.resolve(examplesDir, "public")
const samplesDir = path.resolve(__dirname, "../../../web/aid-generator/public/samples")

interface VercelRewrite {
  source: string
  has: {
    type: string
    value: string
  }[]
  destination: string
}

/**
 * This script automates the generation of all AID example artifacts.
 * It serves as the single source of truth, converting `config.json` files
 * into deployable manifests, DNS records, and Vercel routing rules.
 *
 * It performs the following functions:
 *
 * 1.  **Generates Hosting Artifacts**: For each example with a `config.json`, it generates:
 *     - `public/[example-name]/aid.txt`: The DNS TXT record snippet.
 *     - `public/[example-name]/.well-known/aid.json`: The full AID manifest.
 *
 * 2.  **Generates Vercel Routing Rules**: It creates `packages/examples/vercel.json`
 *     with rewrite rules for each example, routing requests based on the `domain`
 *     specified in the `config.json`.
 *
 * 3.  **Syncs Samples to Web UI**: It copies the raw `config.json` files to the
 *     web UI's public samples directory and generates an `index.json` to populate
 *     the UI's "Load Sample" feature.
 */
async function buildExamples() {
  console.log("🔍 Finding and building examples...")

  try {
    // Clean and prepare output directories
    await fs.rm(publicDir, { recursive: true, force: true })
    await fs.rm(samplesDir, { recursive: true, force: true })
    await fs.mkdir(publicDir, { recursive: true })
    await fs.mkdir(samplesDir, { recursive: true })

    const exampleFolders = await fs.readdir(examplesDir, { withFileTypes: true })
    const sampleIndex: { name: string; file: string }[] = []
    const vercelRewrites: VercelRewrite[] = []

    for (const dirent of exampleFolders) {
      if (dirent.isDirectory() && dirent.name !== "public") {
        const exampleName = dirent.name
        const configPath = path.join(examplesDir, exampleName, "config.json")

        try {
          // 1. Read the source config.json
          await fs.access(configPath)
          const configContent = await fs.readFile(configPath, "utf-8")
          const config: AidGeneratorConfig = JSON.parse(configContent)

          // 2. Generate hosting artifacts (TXT and JSON manifest)
          const examplePublicDir = path.join(publicDir, exampleName)
          const wellKnownDir = path.join(examplePublicDir, ".well-known")

          await writeTxtSnippet(config, examplePublicDir)
          await writeManifest(config, wellKnownDir)
          console.log(`✅ Generated manifest and TXT for ${exampleName}`)

          // 3. Generate Vercel rewrite rule for this example
          if (config.domain) {
            vercelRewrites.push({
              source: "/.well-known/aid.json",
              has: [{ type: "host", value: config.domain }],
              destination: `/${exampleName}/.well-known/aid.json`,
            })
          }

          // 4. Sync config to web UI samples
          const destFileName = `${exampleName}.json`
          const destPath = path.join(samplesDir, destFileName)
          await fs.copyFile(configPath, destPath)
          sampleIndex.push({
            name: exampleName.charAt(0).toUpperCase() + exampleName.slice(1).replace(/-/g, " "),
            file: destFileName,
          })
          console.log(`✅ Copied ${exampleName} config to web UI samples`)
        } catch (error) {
          if (error && typeof error === "object" && "code" in error && error.code !== "ENOENT") {
            console.warn(`⚠️ Could not process example "${exampleName}":`, error)
          }
        }
      }
    }

    // 5. Write the aggregate vercel.json file
    const vercelConfig = { rewrites: vercelRewrites }
    const vercelPath = path.join(examplesDir, "vercel.json")
    await fs.writeFile(vercelPath, JSON.stringify(vercelConfig, null, 2))
    console.log(`✅ Wrote vercel.json with ${vercelRewrites.length} rules.`)

    // 6. Write the final sample index file for the web UI
    const emptyConfig = { schemaVersion: "1", serviceName: "", domain: "", implementations: [] }
    const emptyPath = path.join(samplesDir, "empty.json")
    await fs.writeFile(emptyPath, JSON.stringify(emptyConfig, null, 2))
    sampleIndex.unshift({ name: "Empty", file: "empty.json" })
    
    const indexPath = path.join(samplesDir, "index.json")
    await fs.writeFile(indexPath, JSON.stringify(sampleIndex, null, 2))
    console.log(`✅ Wrote sample index to ${indexPath}`)

    console.log("🎉 Examples built successfully!")
  } catch (error) {
    console.error("❌ Failed to build examples:", error)
    process.exit(1)
  }
}

buildExamples() 