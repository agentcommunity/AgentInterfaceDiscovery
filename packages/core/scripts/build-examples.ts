import { promises as fs } from "fs";
import path from "path";
import { AidGeneratorConfig, ImplementationConfig, buildManifest, buildTxtRecord } from "../src/index";

const examplesDir = path.resolve(__dirname, "../../../packages/examples");
const webSamplesDir = path.resolve(__dirname, "../../../packages/web/aid-generator/public/samples");
const CORE_EXAMPLES = ['simple', 'multi', 'edge-case', 'mixed'];

interface VercelRewrite {
  source: string;
  has: [{ type: "host"; value: string }];
  destination: string;
}

async function prepareWebSamplesDir() {
  console.log(`\nPreparing web samples directory: ${webSamplesDir}`);
  await fs.rm(webSamplesDir, { recursive: true, force: true });
  await fs.mkdir(webSamplesDir, { recursive: true });
  console.log("  ✓ Cleared and recreated web samples directory.");

  // Create the "Empty" template
  const emptyTemplate = {
    schemaVersion: "1",
    serviceName: "",
    domain: "",
    metadata: {},
    implementations: []
  };
  await fs.writeFile(
    path.join(webSamplesDir, "empty.json"),
    JSON.stringify(emptyTemplate, null, 2),
    "utf-8"
  );
  console.log("  ✓ Created empty.json template.");
}

async function writeSamplesIndex(sampleDir: string) {
  const files = await fs.readdir(sampleDir);
  const sampleIndex = files
    .filter(file => file.endsWith('.json') && file !== 'index.json')
    .map(file => {
      // Create a more friendly name from the filename
      const name = path.basename(file, '.json')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      return { name, path: file };
    });
  
  await fs.writeFile(
    path.join(sampleDir, "index.json"),
    JSON.stringify(sampleIndex, null, 2),
    "utf-8"
  );
  console.log("  ✓ Created samples index.json.");
}

async function buildExamples() {
  const vercelRewrites: VercelRewrite[] = [];
  const processedConfigs = new Map<string, AidGeneratorConfig>();

  try {
    await prepareWebSamplesDir();

    const exampleDirs = await fs.readdir(examplesDir, { withFileTypes: true });
    console.log(`\nFound ${exampleDirs.length} potential examples. Building...`);

    // First pass: process all configs and store them.
    for (const dirent of exampleDirs) {
      if (!dirent.isDirectory() || dirent.name === 'public' || dirent.name === 'node_modules') continue;

      const exampleName = dirent.name;
      const examplePath = path.join(examplesDir, exampleName);
      const configPath = path.join(examplePath, "config.json");

      try {
        await fs.access(configPath);
        const configContent = await fs.readFile(configPath, "utf-8");
        const config = JSON.parse(configContent) as AidGeneratorConfig & { name?: string };
        
        // --- Start: Correction and Validation Logic ---
        
        // 1. Remove non-standard top-level 'name' property
        if ('name' in config) {
          delete config.name;
        }

        // 2. Ensure domain is a bare domain
        if (config.domain && (config.domain.startsWith('http://') || config.domain.startsWith('https://'))) {
          console.warn(`  ! Correcting domain for ${exampleName}: from ${config.domain} to bare domain.`);
          config.domain = config.domain.replace(/^(https?:\/\/)/, '');
        }
        
        // --- End: Correction and Validation Logic ---

        // Write the cleaned config to the web samples directory
        const webSamplePath = path.join(webSamplesDir, `${exampleName}.json`);
        await fs.writeFile(webSamplePath, JSON.stringify(config, null, 2), "utf-8");
        console.log(`  ✓ Wrote cleaned sample to ${webSamplePath}`);
        
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

    // After all samples are processed, write the index file
    await writeSamplesIndex(webSamplesDir);

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