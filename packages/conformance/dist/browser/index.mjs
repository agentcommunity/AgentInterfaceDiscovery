// src/validators.ts
import { aidManifestSchema, buildManifest } from "@aid/core/browser";
function validateManifest(raw) {
  const result = aidManifestSchema.strict().safeParse(raw);
  if (result.success) {
    return { ok: true };
  }
  return {
    ok: false,
    errors: result.error.issues.map((issue) => ({
      path: issue.path,
      message: issue.message
    }))
  };
}
function validateTxt(txt) {
  const fullTxt = Array.isArray(txt) ? txt.join("") : txt;
  const errors = [];
  const keys = /* @__PURE__ */ new Set();
  if (!fullTxt.startsWith("v=aid1")) {
    errors.push({
      message: 'TXT record must start with "v=aid1".'
    });
  }
  const parts = fullTxt.split(";");
  for (const part of parts) {
    const [key] = part.split("=");
    if (keys.has(key)) {
      errors.push({
        message: `Duplicate key found in TXT record: "${key}".`
      });
    }
    keys.add(key);
  }
  if (errors.length > 0) {
    return { ok: false, errors };
  }
  return { ok: true };
}
function validatePair(cfg, manifest, opts = { strict: true }) {
  const generatedManifest = buildManifest(cfg);
  const a = generatedManifest;
  let b = manifest;
  if (!opts.strict) {
    const parseResult = aidManifestSchema.safeParse(manifest);
    if (!parseResult.success) {
      return {
        ok: false,
        errors: [
          {
            message: "Provided manifest is invalid, cannot perform comparison.",
            path: ["manifest"]
          },
          ...parseResult.error.issues.map((issue) => ({
            path: issue.path,
            message: issue.message
          }))
        ]
      };
    }
    b = parseResult.data;
  }
  if (JSON.stringify(a) === JSON.stringify(b)) {
    return { ok: true };
  }
  return {
    ok: false,
    errors: [
      {
        message: "Manifest does not match the one generated from the provided config."
      }
    ]
  };
}
export {
  validateManifest,
  validatePair,
  validateTxt
};
//# sourceMappingURL=index.mjs.map