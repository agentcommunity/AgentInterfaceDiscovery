import fs from "node:fs/promises"
import path from "node:path"
import { writeManifest, writeTxtSnippet } from "../packages/aid-core/src/generator"
import type { AidGeneratorConfig, ImplementationConfig } from "../packages/aid-core/src/types"

const rootDir = path.resolve(__dirname, "..")
const examplesDir = path.resolve(rootDir, "packages/examples")
const publicDir = path.resolve(examplesDir, "public")
const samplesDir = path.resolve(rootDir, "packages/aid-web/public/samples")

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
 * It uses the JSON files in `packages/aid-web/public/samples`
 * as the single source of truth.
 *
 * It performs the following functions:
 *
 * 1.  **Generates Hosting Artifacts**: For each example config found in the
 *     web UI's samples directory, it generates:
 *     - `packages/examples/public/[example-name]/aid.txt`: The DNS TXT record snippet.
 *     - `packages/examples/public/[example-name]/.well-known/aid.json`: The full AID manifest.
 *
 * 2.  **Generates Vercel Routing Rules**: It creates `packages/examples/vercel.json`
 *     with rewrite rules for each example, routing requests based on the `domain`
 *     specified in the config.
 */
async function buildExamples() {
  console.log("🚀 Building examples from single source of truth: /aid-web/public/samples")

  try {
    // 1. Clean and prepare output directories
    await fs.rm(publicDir, { recursive: true, force: true })
    await fs.mkdir(publicDir, { recursive: true })

    // 2. Read the sample index to discover all example configurations
    const sampleIndexContent = await fs.readFile(path.join(samplesDir, "index.json"), "utf-8")
    const sampleIndex: { name: string; file: string }[] = JSON.parse(sampleIndexContent)

    const vercelRewrites: VercelRewrite[] = []

    for (const sample of sampleIndex) {
      // The "Empty" config is a UI placeholder and doesn't need to be hosted.
      if (sample.name === "Empty") {
        continue
      }

      const exampleName = sample.file.replace(".json", "")
      const configPath = path.join(samplesDir, sample.file)

      try {
        // 3. Read the source config from the samples directory
        const configContent = await fs.readFile(configPath, "utf-8")
        const config: AidGeneratorConfig = JSON.parse(configContent)

        // 4. Create a version of the config with placeholders resolved for hosting.
        // This prevents invalid JSON from being generated due to unescaped quotes in placeholders.
        const hostedConfig = JSON.parse(JSON.stringify(config)) as AidGeneratorConfig
        for (const impl of hostedConfig.implementations) {
          if (!(impl as any).requiredConfig) {
            continue
          }

          const configMap = new Map<string, any>()
          for (const item of (impl as any).requiredConfig) {
            configMap.set(item.key, item.defaultValue)
          }

          const resolveValue = (placeholder: string): string => {
            const match = placeholder.match(/^\${requiredConfig\.([A-Z_0-9]+)}$/)
            if (match) {
              const key = match[1]
              const value = configMap.get(key)
              return value !== undefined ? String(value) : ""
            }
            return placeholder
          }

          if (impl.type === "local" && impl.execution?.args) {
            impl.execution.args = impl.execution.args.map(resolveValue).filter((arg) => arg !== "")
          }

          if ("oauth" in impl.authentication && impl.authentication.oauth?.scopes) {
            impl.authentication.oauth.scopes = impl.authentication.oauth.scopes
              .map(resolveValue)
              .filter((scope) => scope !== "")
          }
        }

        // 5. Generate hosting artifacts (TXT and JSON manifest) using the resolved config
        const examplePublicDir = path.join(publicDir, exampleName)
        const wellKnownDir = path.join(examplePublicDir, ".well-known")
        await fs.mkdir(wellKnownDir, { recursive: true })

        await writeTxtSnippet(hostedConfig, examplePublicDir)
        await writeManifest(hostedConfig, wellKnownDir)
        console.log(`✅ Generated manifest and TXT for ${exampleName}`)

        // 6. Generate Vercel rewrite rule for this example
        if (config.domain) {
          vercelRewrites.push({
            source: "/.well-known/aid.json",
            has: [{ type: "host", value: config.domain }],
            destination: `/${exampleName}/.well-known/aid.json`,
          })
        }
      } catch (error) {
        if (error && typeof error === "object" && "code" in error && error.code !== "ENOENT") {
          console.warn(`⚠️ Could not process example "${exampleName}":`, error)
        }
      }
    }

    // 7. Write the aggregate vercel.json file
    const vercelConfig = { rewrites: vercelRewrites }
    const vercelPath = path.join(examplesDir, "vercel.json")
    await fs.writeFile(vercelPath, JSON.stringify(vercelConfig, null, 2))
    console.log(`✅ Wrote vercel.json with ${vercelRewrites.length} rules.`)

    console.log("🎉 Examples built successfully!")
  } catch (error) {
    console.error("❌ Failed to build examples:", error)
    process.exit(1)
  }
}

buildExamples() 