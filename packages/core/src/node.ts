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

  const parts = ["v=aid1"];
  if (cfg.env) {
    parts.push(`env=${cfg.env}`);
  }

  // Find a primary remote implementation to use for TXT hints.
  // The spec says `uri` and `proto` are required if *any* remote implementation exists.
  // We'll pick the first one.
  const primaryRemote = cfg.implementations.find(
    (impl) => impl.type === "remote"
  ) as (Extract<typeof cfg.implementations[0], { type: "remote" }> | undefined);

  if (primaryRemote) {
    parts.push(`uri=${primaryRemote.uri}`);
    parts.push(`proto=${primaryRemote.protocol}`);
    if (primaryRemote.authentication.scheme !== "none") {
      parts.push(`auth=${primaryRemote.authentication.scheme}`);
    }
  }

  // An extended profile is needed if there's more than one implementation,
  // or if the single implementation is complex (local, or remote with extra config).
  const needsManifest =
    cfg.implementations.length > 1 ||
    (cfg.implementations.length === 1 && cfg.implementations[0].type === "local") ||
    (primaryRemote &&
      (primaryRemote.configuration ||
        primaryRemote.requiredPaths ||
        primaryRemote.certificate ||
        primaryRemote.platformOverrides));

  if (needsManifest) {
    const manifestUrl = `https://${domain}${manifestPath}`;
    parts.push(`config=${manifestUrl}`);
  }

  const recordValue = parts.join(";");
  return `${recordName} ${ttl} IN TXT "${recordValue}"`;
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
