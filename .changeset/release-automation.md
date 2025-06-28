---
"@aid/core": patch
"@aid/conformance": patch
"@aid/schema": minor
---

### ✨ Release automation & new `@aid/schema` package

This release introduces automated publishing via Changesets/GitHub Actions and debuts the stand-alone `@aid/schema` package containing the canonical AID v1 JSON Schema.

• All packages now declare a rich `author` object and are marked `"publishConfig": { "access": "public" }`.
• `@aid/schema` is generated directly from the Zod source and published to npm/CDN.
• Workflows: `release.yml` (automated version + publish) and updated `sync-schema.yml`.
• Root build script now regenerates the schema before building other packages.

No breaking API changes – just packaging & infrastructure improvements. 