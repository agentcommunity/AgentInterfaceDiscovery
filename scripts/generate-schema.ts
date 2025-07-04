import { promises as fs } from "fs";
import path from "path";
import { zodToJsonSchema } from "zod-to-json-schema";
import { aidManifestSchema } from "../packages/aid-core/src/schemas";

const schemaName = "aid.schema.json";
const outDir = path.resolve(__dirname, "../packages/aid-schema");

async function generateJsonSchema() {
  console.log("Generating AID manifest JSON schema...");

  // Convert Zod schema to JSON schema
  const jsonSchema = zodToJsonSchema(aidManifestSchema, {
    name: "AidManifest",
    $refStrategy: "root",
  });

  // Enhance the schema with standard metadata
  const fullSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "AID Manifest",
    description: "Canonical JSON configuration manifest for an Agent Interface Discovery (AID) profile. Version 1.",
    ...jsonSchema,
  };

  await fs.mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, schemaName);
  await fs.writeFile(outPath, JSON.stringify(fullSchema, null, 2));

  console.log(`✓ Schema written to ${outPath}`);
}

generateJsonSchema().catch((err) => {
  console.error("Error generating schema:", err);
  process.exit(1);
}); 