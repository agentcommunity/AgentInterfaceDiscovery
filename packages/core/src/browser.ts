import { AidGeneratorConfig, ImplementationConfig } from "./types";

/* --------------------------------------------------------------- *
 * 1. Convert dev-friendly config => strict manifest                *
 * --------------------------------------------------------------- */
export function buildManifest(cfg: AidGeneratorConfig) {
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
  ) as (Extract<(typeof cfg.implementations)[0], { type: "remote" }> | undefined);

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