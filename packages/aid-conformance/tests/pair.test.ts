import { readFileSync } from "fs";
import { join } from "path";
import { buildManifest } from "@aid/core";
import { validatePair, validateTxt } from "../src/validators";

// Define paths once at the top
const generatorPath = join(__dirname, "../../aid-web/public/samples/simple.json");

describe("validatePair", () => {
  // Test for the perfect success case in strict mode
  it("should succeed when config and generated manifest are identical (strict)", () => {
    const cfg = JSON.parse(readFileSync(generatorPath, "utf-8"));
    // Freeze the dynamic version to ensure a predictable output
    cfg.metadata = { ...(cfg.metadata ?? {}), contentVersion: "2025-01-01" };
    const manifest = buildManifest(cfg); // Generate manifest from the config
    const result = validatePair(cfg, manifest, { strict: true });
    expect(result.ok).toBe(true);
  });

  // Test for the perfect success case in non-strict mode
  it("should succeed when config and generated manifest are identical (non-strict)", () => {
    const cfg = JSON.parse(readFileSync(generatorPath, "utf-8"));
    cfg.metadata = { ...(cfg.metadata ?? {}), contentVersion: "2025-01-01" };
    const manifest = buildManifest(cfg); // Generate manifest from the config
    const result = validatePair(cfg, manifest, { strict: false });
    expect(result.ok).toBe(true);
  });

  // Test that strict mode correctly fails on any difference
  it("should fail when manifests differ (strict)", () => {
    const cfg = JSON.parse(readFileSync(generatorPath, "utf-8"));
    const manifestWithDifference = { ...buildManifest(cfg), description: "A different description" };
    const result = validatePair(cfg, manifestWithDifference, { strict: true });
    expect(result.ok).toBe(false);
  });

  // Test that non-strict mode correctly IGNORES vendor extensions
  it("should SUCCEED when allowing vendor extensions in non-strict mode", () => {
    const cfg = JSON.parse(readFileSync(generatorPath, "utf-8"));
    const manifestWithVendorExt = { ...buildManifest(cfg), "x-vendor-data": "some-value" };
    
    // Non-strict should PASS because the core schema is valid
    const nonStrictResult = validatePair(cfg, manifestWithVendorExt, { strict: false });
    expect(nonStrictResult.ok).toBe(true); // <-- THIS IS THE CORRECTED EXPECTATION
  });

  // Test that non-strict mode still catches REAL validation errors
  it("should FAIL when manifest is invalid in non-strict mode", () => {
    const cfg = JSON.parse(readFileSync(generatorPath, "utf-8"));
    // Create a truly invalid manifest by breaking a required field
    const badManifest = { ...buildManifest(cfg), schemaVersion: 123 } as any; 
    const result = validatePair(cfg, badManifest, { strict: false });
    expect(result.ok).toBe(false);
    expect(result.errors?.length).toBeGreaterThan(0);
  });
});

describe("validateTxt zone-file handling", () => {
  it("should parse quoted multi-string zone file correctly", () => {
    const zone = '_agent.example.com. 3600 IN TXT ( "v=aid1;uri=https://example.com/api" \";proto=mcp\" )';
    const result = validateTxt(zone);
    expect(result.ok).toBe(true);
  });

  // This test covers the final missing branch in validateTxt
  it("should parse a single-quoted zone-file TXT record", () => {
    const zone = '_agent.example.com. 3600 IN TXT "v=aid1;uri=https://example.com/api;proto=mcp"';
    const result = validateTxt(zone);
    expect(result.ok).toBe(true);
  });
});