import { AidGeneratorConfig, AidManifest } from "./types";

/* --------------------------------------------------------------- *
 * 1. Convert dev-friendly config => strict manifest                *
 * --------------------------------------------------------------- */
export function buildManifest(cfg: Partial<AidGeneratorConfig>): AidManifest {
  const { serviceName, metadata = {}, implementations, schemaVersion, ...rest } = cfg;

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

  // Recursively clean the object to remove empty/null values
  const cleanedManifest = removeEmptyKeys(orderedManifest) as AidManifest | undefined;

  return cleanedManifest ?? orderedManifest;
}

/**
 * Recursively removes keys from an object if their value is null, undefined,
 * an empty string, or an empty array.
 * @param obj The object to clean.
 * @returns A new object with empty keys removed.
 */
function removeEmptyKeys<T>(obj: T): T | undefined {
  if (obj === null || obj === undefined) {
    return undefined;
  }

  if (Array.isArray(obj)) {
    const newArr = (obj as unknown[])
      .map((item) => removeEmptyKeys(item))
      .filter((item): item is NonNullable<typeof item> => item !== undefined);
    return (newArr.length > 0 ? (newArr as unknown as T) : undefined);
  }

  if (typeof obj === 'object') {
    const newObj: Record<string, unknown> = {};
    for (const key in obj as Record<string, unknown>) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const cleanedValue = removeEmptyKeys((obj as Record<string, unknown>)[key]);

        const isEmptyArray = Array.isArray(cleanedValue) && cleanedValue.length === 0;
        const isEmptyString = typeof cleanedValue === 'string' && cleanedValue.trim() === '';
        
        if (cleanedValue !== undefined && !isEmptyArray && !isEmptyString) {
          newObj[key] = cleanedValue;
        }
      }
    }
    return (Object.keys(newObj).length > 0 ? (newObj as unknown as T) : undefined);
  }

  return obj;
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

  // An extended profile is needed if there's more than one implementation,
  // or if the single implementation is complex (local, or remote with extra config).
  const isComplex = implementations.some((impl) => {
    if (implementations.length > 1) return true; // multi-implementation manifest

    if (impl.type === "local") return true;

    // Remote implementation with extra config hints
    return (
      'requiredConfig' in impl && !!impl.requiredConfig?.length ||
      'requiredPaths' in impl && !!impl.requiredPaths?.length ||
      'certificate' in impl && impl.certificate !== undefined
    );
  });

  // Find a primary remote implementation to use for TXT hints.
  const primaryRemote = implementations.find(
    (impl) => impl.type === "remote"
  );

  if (primaryRemote) {
    parts.push(`uri=${primaryRemote.uri}`);
    parts.push(`proto=${primaryRemote.protocol}`);
    if (primaryRemote.authentication.scheme !== "none") {
      parts.push(`auth=${primaryRemote.authentication.scheme}`);
    }
  }

  if (isComplex && domain) {
    const manifestUrl = `https://${domain}${manifestPath}`;
    parts.push(`config=${manifestUrl}`);
  }

  const recordValue = parts.join(";");
  return `${recordName} ${ttl} IN TXT "${recordValue}"`;
} 