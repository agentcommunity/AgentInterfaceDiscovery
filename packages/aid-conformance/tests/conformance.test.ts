import { validateManifest, validateTxt } from "../src/validators";
import { buildManifest } from "@aid/core"
import { readFileSync, existsSync } from "fs";
import { join } from "path";

describe("validateManifest", () => {
  // Test against all the valid, symlinked examples
  const validFixturesDir = join(__dirname, "fixtures/valid");
  const validFixtures = [
    "simple.json",
    "auth0.json",
    "edge-case.json",
    "landing-mcp.json",
    "mixed.json",
    "multi.json",
    "supabase.json",
    "capabilities.json",
  ];

  validFixtures.forEach((fixture) => {
    it(`should return OK for valid fixture: ${fixture}`, () => {
      // Resolve the fixture path. In the repo layout, most of these files are
      // symlinks pointing to the canonical examples under
      // `packages/examples/public/**/.well-known/aid.json`.  When running
      // inside certain test environments (or when the symlink target is not
      // packaged), those links may be unresolved. To make the tests resilient
      // we fallback to the real examples directory if the local file is
      // missing.

      const localPath = join(validFixturesDir, fixture);
      const examplesPath = join(
        __dirname,
        "../../examples/public",
        fixture.replace(/\.json$/, ""),
        ".well-known",
        "aid.json",
      );

      const targetPath = existsSync(localPath) ? localPath : examplesPath;

      const content = readFileSync(targetPath, "utf-8");
      const manifest = JSON.parse(content);
      const manifestToValidate = "serviceName" in manifest ? buildManifest(manifest) : manifest;
      const result = validateManifest(manifestToValidate);
      expect(result.ok).toBe(true);
      expect(result.errors).toBeUndefined();
    });
  });

  // Test against a known-bad manifest and snapshot the errors
  it("should return errors for an invalid manifest and match snapshot", () => {
    const fixturePath = join(__dirname, "fixtures/invalid/bad-manifest.json");
    const content = readFileSync(fixturePath, "utf-8");
    const json = JSON.parse(content);
    const result = validateManifest(json);
    expect(result.ok).toBe(false);
    expect(result.errors).toMatchInlineSnapshot(`
[
  {
    "message": "Invalid literal value, expected "1"",
    "path": [
      "schemaVersion",
    ],
  },
  {
    "message": "At least one implementation is required",
    "path": [
      "implementations",
    ],
  },
  {
    "message": "Unrecognized key(s) in object: 'extraUnknownField'",
    "path": [],
  },
]
`);
  });
});

describe("validateTxt", () => {
    it("should return OK for a valid simple TXT record", () => {
        const txt = "v=aid1;uri=https://example.com/api;proto=mcp";
        const result = validateTxt(txt);
        expect(result.ok).toBe(true);
    });

    it("should return OK for a valid multi-string TXT record", () => {
        const txt = ["v=aid1;uri=https://example.com/api", ";proto=mcp"];
        const result = validateTxt(txt);
        expect(result.ok).toBe(true);
    });

    it("should return an error if v=aid1 is missing", () => {
        const txt = "uri=https://example.com/api;proto=mcp";
        const result = validateTxt(txt);
        expect(result.ok).toBe(false);
        expect(result.errors).toMatchInlineSnapshot(`
[
  {
    "message": "TXT record must start with "v=aid1".",
  },
]
`);
    });

    it("should return an error for duplicate keys", () => {
        const txt = "v=aid1;proto=mcp;uri=https://example.com/api;proto=a2a";
        const result = validateTxt(txt);
        expect(result.ok).toBe(false);
        expect(result.errors).toMatchInlineSnapshot(`
[
  {
    "message": "Duplicate key found in TXT record: "proto".",
  },
]
`);
    });
});

describe("Advanced Schema Validation", () => {
  it("should reject a manifest with legacy static OAuth endpoints", () => {
    const fixturePath = join(__dirname, "fixtures/invalid/legacy-oauth.json");
    const content = readFileSync(fixturePath, "utf-8");
    const json = JSON.parse(content);
    const result = validateManifest(json);
    expect(result.ok).toBe(false);
    expect(result.errors).not.toBeUndefined();
    // Check for a more specific error message related to unrecognized keys in the oauth object
    const hasLegacyOauthError = result.errors?.some(e => e.message.includes("Unrecognized key(s) in object: 'deviceAuthorizationEndpoint'"));
    expect(hasLegacyOauthError).toBe(true);
  });

  it("should correctly validate a manifest with new capabilities fields", () => {
    const fixturePath = join(__dirname, "fixtures/valid/capabilities.json");
    const content = readFileSync(fixturePath, "utf-8");
    const json = JSON.parse(content);
    const result = validateManifest(json);
    expect(result.ok).toBe(true);
    expect(result.errors).toBeUndefined();
  });
}); 