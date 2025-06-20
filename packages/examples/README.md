# AID Reference Examples

This directory contains canonical examples of `AidGeneratorConfig` files used to generate reference `aid.json` manifests and `aid.txt` DNS records. These examples serve as a baseline for testing, documentation, and the live resolver playground.

## Available Profiles

-   **/auth0**: A complex `local` implementation for the Auth0 MCP server, featuring multiple execution targets (`run`, `init`) and user-configurable variables.
-   **/simple-remote**: A "hello world" example of a single remote API with PAT-based authentication.
-   **/multi-remote**: Demonstrates a service with two remote implementations, useful for geo-redundancy or versioning.
-   **/mixed-mode**: A service that offers both a primary remote API and a companion local CLI tool.
-   **/edge-case**: A profile designed to test advanced features of the specification, including `mTLS` auth, per-implementation `revocationURL`, `deprecated` status, and platform-specific execution overrides.

## Generating Artifacts

All `aid.json` and `aid.txt` files in these directories are **generated automatically** from their respective `config.json` file.

To regenerate all artifacts after making a change to a `config.json` file or updating the core generator logic, run the following command from the root of the monorepo:

```bash
pnpm --filter @aid/core build:examples
```

This command executes the `packages/core/scripts/build-examples.ts` script, which finds all `config.json` files and processes them, ensuring all examples are consistent and up-to-date with the canonical `@aid/core` package. 