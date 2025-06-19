// packages/core/src/node.ts
import { promises as fs } from "fs";
import path from "path";
import { AidGeneratorConfig } from "./types";
import { buildManifest, buildTxtRecord } from "./browser";

/* --------------------------------------------------------------- *
 * 3. File writers (manifest + DNS snippet)                         *
 * --------------------------------------------------------------- */
export async function writeManifest(
  cfg: AidGeneratorConfig,
  outDir: string
): Promise<string> {
  const manifest = buildManifest(cfg);
  const json = JSON.stringify(manifest, null, 2);
  const outPath = path.join(outDir, "aid.json");
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(outPath, json, "utf-8");
  return outPath;
}

export async function writeTxtSnippet(
  cfg: AidGeneratorConfig,
  outDir: string,
  manifestPath = "/.well-known/aid.json"
): Promise<string> {
  const txt = buildTxtRecord(cfg, manifestPath);
  const outPath = path.join(outDir, "aid.txt");
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(outPath, txt + "\n", "utf-8");
  return outPath;
}

/* --------------------------------------------------------------- *
 * 4. Demo (runs when you `pnpm exec ts-node …/generator.ts`)       *
 * --------------------------------------------------------------- */

if (require.main === module) {
  const demo: AidGeneratorConfig = {
    schemaVersion: "1",
    serviceName: "Supabase",
    domain: "supabase.com",
    metadata: {
      documentation: "https://supabase.com/docs/guides/ai",
      // contentVersion is auto-filled if omitted
    },
    implementations: [
      {
        type: "remote",
        name: "Cloud API (Prod)",
        protocol: "mcp",
        uri: "https://api.supabase.com/v1",
        authentication: {
          scheme: "pat",
          description: "Create one in the dashboard",
          placement: {
            in: "header",
            key: "Authorization",
            format: "Bearer {token}",
          },
        },
      },
    ],
  };

  const outDir = path.resolve(__dirname);
  Promise.all([
    writeManifest(demo, outDir),
    writeTxtSnippet(demo, outDir),
  ])
    .then(([manifestPath, txtPath]) => {
      console.log("✓ wrote", manifestPath);
      console.log("✓ wrote", txtPath);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
