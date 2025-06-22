import { AidGeneratorConfig, AidManifest } from "./types";

/* --------------------------------------------------------------- *
 * 1. Convert dev-friendly config => strict manifest                *
 * --------------------------------------------------------------- */
export function buildManifest(cfg: Partial<AidGeneratorConfig>): AidManifest {
  const { serviceName, domain, metadata = {}, implementations, schemaVersion, ...rest } = cfg;

  const metaWithVersion = {
    contentVersion: metadata.contentVersion ?? new Date().toISOString().slice(0, 10),
    ...metadata,
  };

  // Filter out undefined values from the metadata object if it was initially empty
  // and only contains the generated contentVersion.
  const finalMetadata =
    Object.keys(metaWithVersion).length > 1 || metadata.contentVersion
      ? metaWithVersion
      : undefined;

  // Explicitly construct the manifest to control key order.
  const manifest: AidManifest = {
    name: serviceName ?? "",
    schemaVersion: schemaVersion ?? "1",
    implementations: implementations ?? [],
    ...rest, // Add any other top-level properties that might exist
  };

  // Add metadata only if it's defined to avoid a `metadata: undefined` entry.
  if (finalMetadata) {
    manifest.metadata = finalMetadata;
  }
  
  // Reorder keys for consistent output. The order below is the desired final order.
  const orderedManifest: AidManifest = {
    name: manifest.name,
    metadata: manifest.metadata,
    schemaVersion: manifest.schemaVersion,
    implementations: manifest.implementations,
  };

  // Clean away any undefined keys before returning
  Object.keys(orderedManifest).forEach(key => {
    if ((orderedManifest as any)[key] === undefined) {
      delete (orderedManifest as any)[key];
    }
  });

  return orderedManifest;
}

/* --------------------------------------------------------------- *
 * 2. Build the DNS TXT record                                      *
 * --------------------------------------------------------------- */
export function buildTxtRecord(
  cfg: Partial<AidGeneratorConfig>,
  manifestPath = "/.well-known/aid.json",
  ttl = 3600
): string {
  const domain = (cfg.domain ?? "").replace(/\.$/, ""); // strip trailing dot
  const recordName = `_agent.${domain}.`;

  const parts = ["v=aid1"];
  if (cfg.env) {
    parts.push(`env=${cfg.env}`);
  }

  const implementations = cfg.implementations ?? [];

  // Find a primary remote implementation to use for TXT hints.
  // The spec says `uri` and `proto` are required if *any* remote implementation exists.
  // We'll pick the first one.
  const primaryRemote = implementations.find(
    (impl) => impl.type === "remote"
  ) as (Extract<typeof implementations[0], { type: "remote" }> | undefined);

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
    implementations.length > 1 ||
    (implementations.length === 1 && implementations[0].type === "local") ||
    (primaryRemote &&
      (primaryRemote.configuration ||
        primaryRemote.requiredPaths ||
        primaryRemote.certificate ||
        primaryRemote.platformOverrides));

  if (needsManifest && domain) {
    const manifestUrl = `https://${domain}${manifestPath}`;
    parts.push(`config=${manifestUrl}`);
  }

  const recordValue = parts.join(";");
  return `${recordName} ${ttl} IN TXT "${recordValue}"`;
} 