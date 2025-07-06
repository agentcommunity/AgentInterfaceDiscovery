# @aid/conformance

## 1.0.2

### Patch Changes

- 7f440e4: chore: Deprecate packages

  This release marks all packages as deprecated. Please migrate to the new official resources. See the root README.md for more details.

- Updated dependencies [7f440e4]
  - @agentcommunity/aid-core@1.0.2

## 1.0.1

### Patch Changes

- dabfdd7: feat: Initial public release with corrected `@agentcommunity/aid-*` package names. Aligns package names and prepares for unified 1.0.x release.
- Updated dependencies [3edb419]
  - @agentcommunity/aid-core@1.0.1

## 1.0.0

### Major Changes

- 559b233: feat: Initial public release under the @agentcommunity scope. Aligns all packages to v1.0.0 and includes a complete validation toolkit, CLI, and official JSON Schema.

### Patch Changes

- 0adbc6f: ### ✨ Release automation & new `@agentcommunity/aid-schema` package

  This release introduces automated publishing via Changesets/GitHub Actions and debuts the stand-alone `@agentcommunity/aid-schema` package containing the canonical AID v1 JSON Schema.

  • All packages now declare a rich `author` object and are marked `"publishConfig": { "access": "public" }`.
  • `@agentcommunity/aid-schema` is generated directly from the Zod source and published to npm/CDN.
  • Workflows: `release.yml` (automated version + publish) and updated `sync-schema.yml`.
  • Root build script now regenerates the schema before building other packages.

  No breaking API changes – just packaging & infrastructure improvements.

- Updated dependencies [559b233]
- Updated dependencies [0adbc6f]
- Updated dependencies [0e1755d]
  - @aid/core@1.0.1
