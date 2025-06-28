# @aid/schema

This package distributes the canonical **AID v1 JSON Schema** so that non-TypeScript ecosystems can validate manifests without pulling in the full `@aid/core` library.

It contains a single file, `aid.schema.json`, generated automatically from the source-of-truth Zod schemas in `@aid/core`.

## Updating

Run:

```bash
pnpm -F @aid/core run schema:generate
```

This regenerates the schema directly inside this package. Commit the updated file plus a Changeset and the release workflow will publish a new version. 