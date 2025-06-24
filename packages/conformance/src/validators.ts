import { aidManifestSchema, buildManifest, AidGeneratorConfig, AidManifest } from "@aid/core";
import { z, ZodIssue } from "zod";

export type ValidationResult = {
  ok: boolean;
  errors?: { path?: (string | number)[]; message: string }[];
};

/**
 * Validates a raw JavaScript object against the canonical AID manifest schema.
 *
 * This function performs a strict validation, meaning it will flag any
 * properties that are not explicitly defined in the schema. This is crucial
 * for ensuring that manifests do not contain unknown or potentially
 * dangerous properties.
 *
 * @returns A `ValidationResult` object.
 */
export function validateManifest(raw: unknown): ValidationResult {
  // Use .strict() to ensure no unknown keys are present at the top level.
  const result = aidManifestSchema.strict().safeParse(raw);

  if (result.success) {
    // The schema already validates schemaVersion is "1" via z.literal("1")
    return { ok: true };
  }

  return {
    ok: false,
    errors: result.error.issues.map((issue: ZodIssue) => ({
      path: issue.path,
      message: issue.message,
    })),
  };
}

/**
 * Validates a DNS TXT record for AID conformance.
 *
 * It checks for:
 * - A valid "v=aid1" version identifier.
 * - For single-string TXT records, it parses the key-value pairs.
 * - For multi-string TXT records (an array of strings), it concatenates them
 *   before parsing, as per RFC 1035.
 * - Ensures no duplicate keys are present.
 *
 * @param txt The TXT record content, either as a single string or an array of strings.
 * @returns A `ValidationResult` object.
 */
export function validateTxt(txt: string | string[]): ValidationResult {
  const fullTxt = Array.isArray(txt) ? txt.join("") : txt;
  const errors: { message: string }[] = [];
  const keys = new Set<string>();

  if (!fullTxt.startsWith("v=aid1")) {
    errors.push({
      message: 'TXT record must start with "v=aid1".',
    });
  }

  const parts = fullTxt.split(";");
  for (const part of parts) {
    const [key] = part.split("=");
    if (keys.has(key)) {
      errors.push({
        message: `Duplicate key found in TXT record: "${key}".`,
      });
    }
    keys.add(key);
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true };
}

/**
 * Compares a generator configuration with a manifest to ensure they are equivalent.
 *
 * By default, it performs a strict comparison. If `strict` is false, it allows
 * for vendor-specific extensions (extra keys) in the manifest that are not
 * @returns A `ValidationResult` object indicating whether the two are in sync.
 */
export function validatePair(
  cfg: AidGeneratorConfig,
  manifest: AidManifest,
  opts: { strict?: boolean } = { strict: true }
): ValidationResult {
  const generatedManifest = buildManifest(cfg);

  // For non-strict checks, we can attempt to strip unknown keys from the
  // provided manifest before comparison, but a simple deep equal is often
  // sufficient if we assume the generated one is the source of truth.
  // A proper deep-diff library would be better for rich error reporting.
  const a = generatedManifest;
  let b = manifest;

  if (!opts.strict) {
    // In non-strict mode, we parse the user's manifest to strip any keys
    // not in the schema. This allows vendors to add their own metadata.
    const parseResult = aidManifestSchema.safeParse(manifest);
    if (!parseResult.success) {
      return {
        ok: false,
        errors: [
          {
            message: "Provided manifest is invalid, cannot perform comparison.",
            path: ["manifest"],
          },
          ...parseResult.error.issues.map((issue: ZodIssue) => ({
            path: issue.path,
            message: issue.message,
          })),
        ],
      };
    }
    b = parseResult.data;
  }

  // A simple JSON.stringify comparison is a good first pass.
  if (JSON.stringify(a) === JSON.stringify(b)) {
    return { ok: true };
  }

  // TODO: Implement a deep-diff for better error messages.
  return {
    ok: false,
    errors: [
      {
        message:
          "Manifest does not match the one generated from the provided config.",
      },
    ],
  };
} 