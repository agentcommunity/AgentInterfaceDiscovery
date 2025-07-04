import * as fs from "node:fs/promises";
import * as path from "node:path";
import { quicktype, InputData, JSONSchemaInput, FetchingJSONSchemaStore } from "quicktype-core";

/**
 * SDK Generator Script (scaffold)
 * --------------------------------
 * This script will eventually generate thin façade SDKs for multiple
 * languages (Python, Go, …) from the canonical `aid.schema.json`.
 *
 * The high-level workflow (see TODO.md §2) is:
 *  1. Ensure schema is up-to-date.
 *  2. Run quicktype in Docker for each target language.
 *  3. Post-process generated code: add validators + CLI wrappers.
 *  4. Copy artefacts into their respective workspace packages.
 *  5. Execute the language-specific test suites.
 *
 * For now we scaffold the structure and perform step #1 so the script
 * can be wired into CI early even before code-gen is implemented.
 */

const ROOT = path.resolve(__dirname, "..");
const SCHEMA_PATH = path.join(ROOT, "packages/aid-schema/aid.schema.json");

async function assertSchemaExists() {
  try {
    await fs.access(SCHEMA_PATH);
  } catch (err) {
    console.error(
      "❌ Canonical JSON Schema not found. Please run `pnpm -F @agentcommunity/aid-core run schema:generate` first."
    );
    process.exit(1);
  }
}

async function run() {
  await assertSchemaExists();

  // Python SDK
  await generateForLang("python", {
    rendererOptions: {
      pythonVersion: "3.9",
      features: "pydantic2",
    },
    outPath: path.join(ROOT, "packages/aid-core-py", "aid_core_py", "models.py"),
  });

  // Copy schema into Python package for runtime validation
  await copySchema(path.join(ROOT, "packages/aid-core-py", "aid_core_py", "aid.schema.json"));

  // Go SDK
  await generateForLang("golang", {
    rendererOptions: {
      package: "aidcore",
    },
    outPath: path.join(ROOT, "packages/aid-core-go", "aidcore", "models.go"),
  });

  // Copy schema into Go package (will be embedded)
  await copySchema(path.join(ROOT, "packages/aid-core-go", "aidcore", "aid.schema.json"));

  console.log("✅ SDK models generated. Next steps: add validation adapters and CLI wrappers.");
}

interface GenerateOpts {
  rendererOptions?: Record<string, string>;
  outPath: string;
}

async function generateForLang(lang: string, opts: GenerateOpts) {
  console.log(`🛠️  Generating ${lang} models…`);

  const schemaString = await fs.readFile(SCHEMA_PATH, "utf-8");

  const schemaInput = new JSONSchemaInput(new FetchingJSONSchemaStore());
  await schemaInput.addSource({ name: "AidManifest", schema: schemaString });

  const inputData = new InputData();
  inputData.addInput(schemaInput);

  const qt = await quicktype({
    inputData,
    lang: lang as any,
    rendererOptions: opts.rendererOptions ?? {},
  });

  await fs.mkdir(path.dirname(opts.outPath), { recursive: true });
  await fs.writeFile(opts.outPath, qt.lines.join("\n"), "utf-8");
}

async function copySchema(destination: string) {
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.copyFile(SCHEMA_PATH, destination);
}

run().catch((err) => {
  console.error("❌ SDK generation failed:", err);
  process.exit(1);
}); 