// packages/core/src/generator.ts
import { promises as fs } from "fs";
import path from "path";
import { AidGeneratorConfig, AidManifest } from "./types";

/* --------------------------------------------------------------- *
 * 1. Convert dev-friendly config => strict manifest                *
 * --------------------------------------------------------------- */
export function buildManifest(cfg: AidGeneratorConfig): AidManifest {
  const {
    serviceName: name,
    domain: _domain, // not emitted
    metadata = {},
    ...rest
  } = cfg;

  // Default contentVersion if not supplied
  const metaWithVersion = {
    contentVersion:
      metadata.contentVersion ?? new Date().toISOString().slice(0, 10),
    ...metadata,
  };

  return {
    name,
    metadata: Object.keys(metaWithVersion).length ? metaWithVersion : undefined,
    ...rest,
  };
}

/* --------------------------------------------------------------- *
 * 2. Build the DNS TXT record                                      *
 * --------------------------------------------------------------- */
export function buildTxtRecord(
  cfg: AidGeneratorConfig,
  manifestPath = "/.well-known/aid.json",
  ttl = 3600
): string {
  const domain = cfg.domain.replace(/\.$/, ""); // strip trailing dot
  const recordName = `_agent.${domain}.`;
  const manifestUrl = `https://${domain}${manifestPath}`;

  // Simple inline form only if ALL of these hold:
  //  * exactly one implementation
  //  * it’s "remote"
  //  * no per-platform overrides / config / paths / cert
  // Otherwise fall back to extended (u=…)
  const impls = cfg.implementations;
  const maybeSimple =
    impls.length === 1 &&
    impls[0].type === "remote" &&
    !impls[0].configuration &&
    !impls[0].requiredPaths &&
    !impls[0].certificate &&
    !impls[0].platformOverrides;

  if (maybeSimple) {
    const r = impls[0] as typeof impls[0] & { type: "remote" };
    const inline = [
      "v=aid1",
      `p=${r.protocol}`,
      `uri=${r.uri}`,
      `auth=${r.authentication.scheme}`,
    ].join(";");
    return `${recordName} ${ttl} IN TXT "${inline}"`;
  }

  // Extended profile (manifest hosted at well-known path)
  return `${recordName} ${ttl} IN TXT "v=aid1;u=${manifestUrl}"`;
}

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
