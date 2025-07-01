# @aid/core

## 1.0.1

### Patch Changes

- 559b233: feat: Initial public release under the @agentcommunity scope. Aligns all packages to v1.0.0 and includes a complete validation toolkit, CLI, and official JSON Schema.
- 0adbc6f: ### ✨ Release automation & new `@aid/schema` package

  This release introduces automated publishing via Changesets/GitHub Actions and debuts the stand-alone `@aid/schema` package containing the canonical AID v1 JSON Schema.

  • All packages now declare a rich `author` object and are marked `"publishConfig": { "access": "public" }`.
  • `@aid/schema` is generated directly from the Zod source and published to npm/CDN.
  • Workflows: `release.yml` (automated version + publish) and updated `sync-schema.yml`.
  • Root build script now regenerates the schema before building other packages.

  No breaking API changes – just packaging & infrastructure improvements.

- 0e1755d: fix: Re-running release after fixing CI permissions.
