import { AidGeneratorConfig, AidManifest } from "@aid/core/browser";
export type ValidationResult = {
    ok: boolean;
    errors?: {
        path?: (string | number)[];
        message: string;
    }[];
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
export declare function validateManifest(raw: unknown): ValidationResult;
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
export declare function validateTxt(txt: string | string[]): ValidationResult;
/**
 * Compares a generator configuration with a manifest to ensure they are equivalent.
 *
 * By default, it performs a strict comparison. If `strict` is false, it allows
 * for vendor-specific extensions (extra keys) in the manifest that are not
 * @returns A `ValidationResult` object indicating whether the two are in sync.
 */
export declare function validatePair(cfg: AidGeneratorConfig, manifest: AidManifest, opts?: {
    strict?: boolean;
}): ValidationResult;
