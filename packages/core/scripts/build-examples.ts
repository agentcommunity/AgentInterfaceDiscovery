import { promises as fs } from "fs";
import path from "path";
import { AidGeneratorConfig, ImplementationConfig, buildManifest, buildTxtRecord } from "../src/index";

const examplesDir = path.resolve(__dirname, "../../../packages/examples");
const CORE_EXAMPLES = ['simple', 'multi', 'edge-case', 'mixed'];

interface VercelRewrite {
  source: string;
  has: [{ type: "host"; value: string }];
  destination: string;
}

async function buildExamples() {
  const vercelRewrites: VercelRewrite[] = [];
  const processedConfigs = new Map<string, AidGeneratorConfig>();

  try {
    const exampleDirs = await fs.readdir(examplesDir, { withFileTypes: true });
    console.log(`Found ${exampleDirs.length} potential examples. Building...`);

    // First pass: process all configs and store them.
    for (const dirent of exampleDirs) {
      if (!dirent.isDirectory() || dirent.name === 'public' || dirent.name === 'node_modules') continue;

      const exampleName = dirent.name;
      const examplePath = path.join(examplesDir, exampleName);
      const configPath = path.join(examplePath, "config.json");

      try {
        await fs.access(configPath);
        const configContent = await fs.readFile(configPath, "utf-8");
        const config = JSON.parse(configContent) as AidGeneratorConfig;
        
        let newDomain: string;
        if (exampleName === "landing-mcp") {
          newDomain = "agentcommunity.org";
        } else {
          newDomain = `${exampleName}.aid.agentcommunity.org`;
        }
        
        const originalDomain = config.domain;
        config.domain = newDomain;

        if (config.implementations) {
          config.implementations = config.implementations.map((impl) => {
            if (impl.type === "remote" && impl.uri && originalDomain) {
              return { ...impl, uri: impl.uri.replace(originalDomain, newDomain) };
            }
            return impl;
          });
        }
        processedConfigs.set(exampleName, config);
      } catch (error: any) {
        if (error.code !== 'ENOENT') {
          console.error(`\n✗ Error reading config for example: ${exampleName}`);
          console.error(error);
        }
      }
    }

    // Second pass: generate artifacts and Vercel config
    for (const [exampleName, config] of processedConfigs.entries()) {
      console.log(`\nBuilding example: ${exampleName}`);
      
      let finalConfig = { ...config, implementations: [...config.implementations || []] };

      // If this is the landing page, aggregate the core examples.
      if (exampleName === 'landing-mcp') {
        const coreImplementations: ImplementationConfig[] = [];
        for (const coreName of CORE_EXAMPLES) {
          const coreConfig = processedConfigs.get(coreName);
          if (coreConfig?.implementations) {
            coreImplementations.push(...coreConfig.implementations);
          }
        }
        finalConfig.implementations.push(...coreImplementations);
      }

      const publicOutDir = path.join(examplesDir, "public", exampleName);
      const manifestOutDir = path.join(publicOutDir, ".well-known");
      
      const manifest = buildManifest(finalConfig);
      const txtRecord = buildTxtRecord(finalConfig);

      await fs.mkdir(manifestOutDir, { recursive: true });
      await fs.writeFile(path.join(manifestOutDir, "aid.json"), JSON.stringify(manifest, null, 2), "utf-8");
      await fs.writeFile(path.join(publicOutDir, "aid.txt"), txtRecord + "\n", "utf-8");

      console.log(`  ✓ Wrote manifest and TXT record for ${exampleName}`);

      // Add rewrite rule for Vercel, skipping the main landing page
      if (exampleName !== 'landing-mcp') {
        vercelRewrites.push({
          source: "/.well-known/aid.json",
          has: [{ type: "host", value: config.domain }],
          destination: `/${exampleName}/.well-known/aid.json`,
        });
      }
    }

    const vercelConfig = { rewrites: vercelRewrites };
    const vercelConfigPath = path.join(examplesDir, "vercel.json");
    await fs.writeFile(vercelConfigPath, JSON.stringify(vercelConfig, null, 2), "utf-8");
    console.log(`\n✓ Wrote vercel.json with ${vercelRewrites.length} rewrite rules.`);

    console.log("\n✅ All examples built successfully.");
  } catch (error) {
    console.error("Fatal error during example build process:", error);
    process.exit(1);
  }
}

buildExamples(); 