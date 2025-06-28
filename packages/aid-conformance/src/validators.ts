import { aidManifestSchema, buildManifest, AidGeneratorConfig, AidManifest } from "@aid/core/browser";
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
  /**
   * Accept either a bare TXT value (e.g. `v=aid1;proto=mcp`) **or** a full
   * RFC 1035 zone-file line such as:
   *   _agent.example.com. 3600 IN TXT "v=aid1;proto=mcp"
   *   _agent.example.com. 3600 IN TXT ( "v=aid1;proto=mcp" ";uri=https://…" )
   *
   * If the input does not start with `v=aid1`, we treat it as a zone-file
   * representation and try to extract the quoted string(s). This makes the
   * validator more forgiving and allows people to copy-paste the generator's
   * full output directly.
   */

  let prepared: string | string[] = txt;

  if (typeof txt === "string" && !txt.trimStart().startsWith("v=aid1")) {
    // Look for one or more quoted segments. If we find them, we use them as
    // the actual TXT value(s). Otherwise we leave the original string intact
    // so that the original "startsWith" check will still fail and report the
    // correct error message.
    const matches = [...txt.matchAll(/"([^"\\]*(?:\\.[^"\\]*)*)"/g)].map(
      (m) => m[1],
    );
    if (matches.length === 1) prepared = matches[0];
    if (matches.length > 1) prepared = matches;
  }

  const fullTxt = Array.isArray(prepared) ? prepared.join("") : prepared;
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

// In packages/aid-conformance/src/validators.ts

/**
 * Compares a generator configuration with a manifest to ensure they are equivalent.
 *
 * By default, it performs a strict comparison. If `strict` is false, it allows
 * for vendor-specific extensions (extra keys) in the manifest as long as the
 * core schema is valid.
 *
 * @returns A `ValidationResult` object indicating whether the two are in sync.
 */
export function validatePair(
  cfg: AidGeneratorConfig,
  manifest: AidManifest,
  opts: { strict?: boolean } = { strict: true }
): ValidationResult {
  const generatedManifest = buildManifest(cfg);

  if (opts.strict) {
    // STRICT MODE: Generate and do an exact comparison.
    if (JSON.stringify(generatedManifest) === JSON.stringify(manifest)) {
      return { ok: true };
    }
    return {
      ok: false,
      errors: [
        {
          message:
            "Strict mode failure: Manifest does not exactly match the one generated from the provided config.",
        },
      ],
    };
  } else {
    // NON-STRICT MODE: We only care if the provided manifest is valid against the base schema.
    // We use .passthrough() to create a non-strict version of the schema for this check.
    const nonStrictSchema = aidManifestSchema.passthrough();
    const parseResult = nonStrictSchema.safeParse(manifest);

    if (parseResult.success) {
      // If the manifest, including extra keys, conforms to the base schema, it's a pass.
      return { ok: true };
    }
    
    // If it fails to parse even with passthrough, it's a real error.
    return {
      ok: false,
      errors: [
        {
          message: "Provided manifest is invalid even in non-strict mode.",
          path: ["manifest"],
        },
        ...parseResult.error.issues.map((issue: ZodIssue) => ({
          path: issue.path,
          message: issue.message,
        })),
      ],
    };
  }
}