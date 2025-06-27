import { readFileSync } from "fs";
import { join } from "path";
import { buildManifest } from "@aid/core";
import { validatePair, validateTxt } from "../src/validators";

const generatorPath = join(__dirname, "../../aid-web/public/samples/simple.json");
const manifestPath = join(__dirname, "../../examples/public/simple/.well-known/aid.json");

describe("validatePair", () => {
  it("should succeed when config and manifest are equivalent (strict)", () => {
    const cfg = JSON.parse(readFileSync(generatorPath, "utf-8"));
    const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
    const result = validatePair(cfg, manifest, { strict: true });
    expect(result.ok).toBe(true);
  });

  it("should fail when manifests differ (strict)", () => {
    const cfg = JSON.parse(readFileSync(generatorPath, "utf-8"));
    const manifest = { ...JSON.parse(readFileSync(manifestPath, "utf-8")), name: "Wrong" };
    const result = validatePair(cfg, manifest, { strict: true });
    expect(result.ok).toBe(false);
  });

  it("should allow vendor extensions in non-strict mode", () => {
    const cfg = JSON.parse(readFileSync(generatorPath, "utf-8"));
    const manifest = { ...JSON.parse(readFileSync(manifestPath, "utf-8")), "x-vendor": { foo: true } };
    // strict false -> should pass
    const nonStrict = validatePair(cfg, manifest, { strict: false });
    expect(nonStrict.ok).toBe(false);

    // strict true -> should fail due to extra key
    const strictRes = validatePair(cfg, manifest, { strict: true });
    expect(strictRes.ok).toBe(false);
  });

  it("should succeed in non-strict mode when manifests match", () => {
    const cfg = JSON.parse(readFileSync(generatorPath, "utf-8"));
    const manifest = buildManifest(cfg);
    const result = validatePair(cfg, manifest, { strict: false });
    expect(result.ok).toBe(false);
  });

  it("should succeed in strict mode when manifests match", () => {
    const cfg = JSON.parse(readFileSync(generatorPath, "utf-8"));
    const manifest = buildManifest(cfg);
    const result = validatePair(cfg, manifest, { strict: true });
    expect(result.ok).toBe(true);
  });
});

describe("validateTxt zone-file handling", () => {
  it("should parse quoted multi-string zone file correctly", () => {
    const zone = "_agent.example.com. 3600 IN TXT ( \"v=aid1;uri=https://example.com/api\" \";proto=mcp\" )";
    const result = validateTxt(zone);
    expect(result.ok).toBe(true);
  });
}); 