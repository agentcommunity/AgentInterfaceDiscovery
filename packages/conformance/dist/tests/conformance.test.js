"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validators_1 = require("../src/validators");
const core_1 = require("@aid/core");
const fs_1 = require("fs");
const path_1 = require("path");
describe("validateManifest", () => {
    // Test against all the valid, symlinked examples
    const validFixturesDir = (0, path_1.join)(__dirname, "fixtures/valid");
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
            const content = (0, fs_1.readFileSync)((0, path_1.join)(validFixturesDir, fixture), "utf-8");
            const manifest = JSON.parse(content);
            const manifestToValidate = "serviceName" in manifest ? (0, core_1.buildManifest)(manifest) : manifest;
            const result = (0, validators_1.validateManifest)(manifestToValidate);
            expect(result.ok).toBe(true);
            expect(result.errors).toBeUndefined();
        });
    });
    // Test against a known-bad manifest and snapshot the errors
    it("should return errors for an invalid manifest and match snapshot", () => {
        const fixturePath = (0, path_1.join)(__dirname, "fixtures/invalid/bad-manifest.json");
        const content = (0, fs_1.readFileSync)(fixturePath, "utf-8");
        const json = JSON.parse(content);
        const result = (0, validators_1.validateManifest)(json);
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
        const result = (0, validators_1.validateTxt)(txt);
        expect(result.ok).toBe(true);
    });
    it("should return OK for a valid multi-string TXT record", () => {
        const txt = ["v=aid1;uri=https://example.com/api", ";proto=mcp"];
        const result = (0, validators_1.validateTxt)(txt);
        expect(result.ok).toBe(true);
    });
    it("should return an error if v=aid1 is missing", () => {
        const txt = "uri=https://example.com/api;proto=mcp";
        const result = (0, validators_1.validateTxt)(txt);
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
        const result = (0, validators_1.validateTxt)(txt);
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
        const fixturePath = (0, path_1.join)(__dirname, "fixtures/invalid/legacy-oauth.json");
        const content = (0, fs_1.readFileSync)(fixturePath, "utf-8");
        const json = JSON.parse(content);
        const result = (0, validators_1.validateManifest)(json);
        expect(result.ok).toBe(false);
        expect(result.errors).not.toBeUndefined();
        // Check for a more specific error message related to unrecognized keys in the oauth object
        const hasLegacyOauthError = result.errors?.some(e => e.message.includes("Unrecognized key(s) in object: 'deviceAuthorizationEndpoint'"));
        expect(hasLegacyOauthError).toBe(true);
    });
    it("should correctly validate a manifest with new capabilities fields", () => {
        const fixturePath = (0, path_1.join)(__dirname, "fixtures/valid/capabilities.json");
        const content = (0, fs_1.readFileSync)(fixturePath, "utf-8");
        const json = JSON.parse(content);
        const result = (0, validators_1.validateManifest)(json);
        expect(result.ok).toBe(true);
        expect(result.errors).toBeUndefined();
    });
});
//# sourceMappingURL=conformance.test.js.map