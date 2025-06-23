import { promises as fs } from "fs";
import path from "path";
import { AidGeneratorConfig, ImplementationConfig, buildManifest, buildTxtRecord } from "../src/index";

const examplesDir = path.resolve(__dirname, "../../../packages/examples");
const webSamplesDir = path.resolve(__dirname, "../../../packages/web/aid-generator/public/samples");
const CORE_EXAMPLES = ['simple', 'multi', 'edge-case', 'mixed'];
const REAL_WORLD_EXAMPLES = ['auth0', 'supabase'];

interface VercelRewrite {
  source: string;
  has: [{ type: "host"; value: string }];
  destination: string;
}

async function prepareWebDirs() {
  console.log(`\nPreparing web directories...`);
  await fs.rm(webSamplesDir, { recursive: true, force: true });
  await fs.mkdir(webSamplesDir, { recursive: true });
  console.log("  ✓ Cleared and recreated web directories.");

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

const CATEGORY_ORDER = [
  "Empty",
  "Basic Examples",
  "Fully Spec Compliant",
  "Real World Examples (by us)",
];

const KNOWN_EXAMPLE_CATEGORIES: { [key: string]: string } = {
  'empty': 'Empty',
  'simple': 'Basic Examples',
  'edge-case': 'Basic Examples',
  'mixed': 'Basic Examples',
  'multi': 'Basic Examples',
  'landing-mcp': 'Fully Spec Compliant',
  'auth0': 'Real World Examples (by us)',
  'supabase': 'Real World Examples (by us)',
};

const BASIC_EXAMPLE_ORDER = ['Simple', 'Mixed', 'Multi', 'Edge Case'];

async function writeSamplesIndex(sampleDir: string) {
  const files = await fs.readdir(sampleDir);
  const sampleIndex = files
    .filter(file => file.endsWith('.json') && file !== 'index.json')
    .map(file => {
      const fileName = path.basename(file, '.json');
      const name = fileName === 'landing-mcp' 
        ? 'Agentcommunity Landing'
        : fileName === 'empty'
        ? 'Empty Config'
        : fileName
          .replace(/-/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
      
      const category = KNOWN_EXAMPLE_CATEGORIES[fileName] || 'Real World Examples (by us)';

      return { name, path: file, category };
    });
  
  sampleIndex.sort((a, b) => {
    const categoryAIndex = CATEGORY_ORDER.indexOf(a.category);
    const categoryBIndex = CATEGORY_ORDER.indexOf(b.category);

    if (categoryAIndex !== categoryBIndex) {
      return categoryAIndex - categoryBIndex;
    }

    if (a.category === 'Basic Examples') {
      return BASIC_EXAMPLE_ORDER.indexOf(a.name) - BASIC_EXAMPLE_ORDER.indexOf(b.name);
    }

    return a.name.localeCompare(b.name);
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
    await prepareWebDirs();

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
        if (REAL_WORLD_EXAMPLES.includes(exampleName)) {
          newDomain = `${exampleName}.agentdomain.xyz`;
        } else if (exampleName === "landing-mcp") {
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

      // Also write the final manifest to a location the web proxy can access directly
      const webManifestPath = path.join(webSamplesDir, `${exampleName}.json`);
      await fs.writeFile(webManifestPath, JSON.stringify(manifest, null, 2), "utf-8");
      
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