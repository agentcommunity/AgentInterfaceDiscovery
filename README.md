# Agent Interface Discovery (AID) - Core Library

[![CI](https://github.com/agentcommunity/AgentInterfaceDiscovery/actions/workflows/conformance.yml/badge.svg)](https://github.com/agentcommunity/AgentInterfaceDiscovery/actions/workflows/conformance.yml)

This repository contains the reference TypeScript implementation for the [Agent Interface Discovery (AID) v1 specification](https://docs.agentcommunity.org/specs/aid/spec-v1/). It provides a robust set of tools for generating and resolving AID profiles, enabling standardized agent-to-agent communication.

As the ecosystem of AI agents and agentic services expands, a fundamental interoperability challenge emerges: *How can a client application or another agent discover the endpoint and configuration for a service, given only its domain name?* Current methods rely on manual configuration, proprietary client-specific files, and fragmented documentation. This hinders scalability and creates a poor user experience.

This document proposes **Agent Interface Discovery (AID)**, a simple, decentralized discovery protocol built on existing Internet standards. AID uses a DNS TXT record to enable a client to discover an agent's service information with a single query.

The protocol features a dual-mode design to balance ease-of-use with expressive power:

- **Simple Profile:** For basic, remotely-hosted agents, the DNS record itself contains enough information (URI, protocol, auth hint) for immediate connection with no additional steps.
- **Extended Profile:** For more complex agents—including those that may run locally via packages (Docker, NPX, etc.) or have multiple endpoints—the DNS record can optionally point to a standardized **AID Manifest** (a JSON configuration file). This manifest provides a rich, unambiguous description of multiple implementations, detailed authentication requirements, and configuration options.

AID is pragmatic, protocol-agnostic (supporting MCP, A2A, etc.), and immediately deployable. It provides a robust foundation for a truly interoperable agentic web by leveraging infrastructure that is already ubiquitous (DNS and HTTPS).

## Official Specification

- [**Introduction**](https://docs.agentcommunity.org/specs/aid/introduction/): Learn the what and why of AID.
- [**Design Rationale**](https://docs.agentcommunity.org/specs/aid/rationale/): Understand the design decisions behind the protocol.
- [**Full Specification (v1)**](https://docs.agentcommunity.org/specs/aid/spec-v1/): Read the complete technical specification.

## Core Concept: A Single Source of Truth

This library is built around a "single source of truth" model to ensure that its types, validation logic, and the public-facing JSON schema are always perfectly synchronized.

The entire system is driven by the Zod schemas defined in **[`packages/core/src/schemas.ts`](./packages/core/src/schemas.ts)**.

This source of truth generates:
1.  **TypeScript Types:** All static types in [`packages/core/src/types.ts`](./packages/core/src/types.ts) are automatically inferred from the Zod schemas using `z.infer<T>`. This means the types you code against are guaranteed to match the validation logic.
2.  **Canonical JSON Schema:** The [`packages/aid-schema/aid.schema.json`](./packages/aid-schema/aid.schema.json) file is programmatically generated from the Zod schemas.

This approach eliminates drift between validation, static types, and public documentation.

## Architecture

The project is a `pnpm` monorepo with the following key components:

```
.
├── .github/workflows/      # CI/CD automation
├── packages/
│   ├── aid-core/           # Canonical TypeScript/JS SDK
│   ├── aid-core-py/        # Canonical Python SDK
│   ├── aid-core-go/        # Canonical Go SDK
│   ├── aid-conformance/    # Validation CLI and test suite
│   ├── aid-schema/         # The generated canonical JSON Schema
│   └── aid-web/            # Next.js web application for building manifests
└── scripts/                # Generation and build scripts
```

A key design feature is the separation of browser-safe and Node.js-specific code. [`packages/core/src/common.ts`](./packages/core/src/common.ts) contains pure data transformation logic (`buildManifest`, `buildTxtRecord`) that can run in any JavaScript environment. [`packages/core/src/generator.ts`](./packages/core/src/generator.ts) contains file system operations (`writeManifest`) and is intended for Node.js environments only. This ensures the library is lightweight and versatile.

## Development Workflow

To make changes to the AID manifest structure, follow this workflow:

1.  **Modify the Schema:** Make your changes to the Zod schemas in [`packages/core/src/schemas.ts`](./packages/core/src/schemas.ts).
2.  **Update Types:** The TypeScript types in [`packages/core/src/types.ts`](./packages/core/src/types.ts) will update automatically as they are inferred from the schemas. You may need to adjust code that uses these types.
3.  **Regenerate the JSON Schema:** Run the generator script to create an updated `aid.schema.json`.
    ```bash
    pnpm -F @agentcommunity/aid-core run schema:generate
    ```
4.  **Commit Changes:** Commit all modified files, including `schemas.ts`, `types.ts`, and the newly generated [`packages/aid-schema/aid.schema.json`](./packages/aid-schema/aid.schema.json).
5.  **Push to `main`:** Pushing to the `main` branch will trigger the `sync-schema.yml` GitHub Action, which automatically pushes the updated `aid.schema.json` to the public `agentcommunity/docs` repository.

## Key Scripts

-   `pnpm install`: Install all dependencies.
-   `pnpm build`: Build all packages in the monorepo.
-   `pnpm -F @agentcommunity/aid-core run schema:generate`: Regenerate the canonical JSON schema.
-   `pnpm -F @agentcommunity/aid-core run build:examples`: Generate the hosted example artifacts (`aid.json`, `aid.txt`) in `packages/examples/public/` using the configs from the web UI's samples directory as the source of truth.
-   `pnpm -F @agentcommunity/aid-web dev`: Run the web UI in development mode.

This script is used to generate the publicly hosted manifests that are used for testing the resolver. It reads all configurations from `packages/aid-web/public/samples`, resolves any template variables, and writes the final `aid.json` and `aid.txt` files to `packages/examples/public/`. This ensures our hosted examples are always in sync with the samples used in the web UI.

## Web UI (`packages/aid-web`)

This project includes a powerful, user-friendly web application for generating and validating AID manifests in real-time. It's built with Next.js and provides a rich form-based interface that uses the `@agentcommunity/aid-core` library as its single source of truth for generation logic.

Key features include:
- Live preview of the generated `aid.json` and DNS TXT record.
- Real-time validation with clear error feedback.
- A responsive interface optimized for both desktop and mobile use.
- Pre-built examples for common use cases.

For detailed information on its architecture, components, and development workflow, please see the [web UI's dedicated README](./packages/aid-web/README.md).

## Generator ([`packages/core/src/common.ts`](./packages/core/src/common.ts))

The generator converts developer-friendly configurations into spec-compliant manifests and DNS records.

### `buildManifest(cfg: AidGeneratorConfig): AidManifest`

-   Converts `serviceName` to `name`.
-   Removes the `domain` property (only used for DNS generation).
-   Auto-fills `metadata.contentVersion` with the current date if not provided.

### `buildTxtRecord(cfg: AidGeneratorConfig): string`

Generates DNS TXT records with intelligent format selection.

**Simple Profile** (for a single, simple remote implementation):
```
_agent.domain.com. 3600 IN TXT "v=aid1;proto=mcp;uri=https://api.example.com;auth=pat"
```

**Extended Profile** (for complex configurations):
```
_agent.domain.com. 3600 IN TXT "v=aid1;config=https://domain.com/.well-known/aid.json"
```

## Usage Examples

### 1. Basic Remote Service

```json
{
  "schemaVersion": "1",
  "serviceName": "My API",
  "domain": "myapi.com",
  "implementations": [
    {
      "type": "remote",
      "name": "prod-api",
      "title": "Production API",
      "protocol": "mcp",
      "uri": "https://api.myapi.com/v1",
      "authentication": {
        "scheme": "pat",
        "description": "Get token from dashboard",
        "placement": {
          "in": "header", 
          "key": "Authorization",
          "format": "Bearer {token}"
        }
      }
    }
  ]
}
```

### 2. Local Package with Configuration

```json
{
  "schemaVersion": "1", 
  "serviceName": "Database Tool",
  "domain": "dbtool.io",
  "implementations": [
    {
      "type": "local",
      "name": "cli-tool",
      "title": "CLI Tool",
      "protocol": "mcp",
      "package": {
        "manager": "npx",
        "identifier": "@company/db-mcp"
      },
      "execution": {
        "command": "npx",
        "args": ["-y", "@company/db-mcp", "--host", "${requiredConfig.DB_HOST}"]
      },
      "authentication": { "scheme": "none" },
      "requiredConfig": [{
        "key": "DB_HOST",
        "description": "Database hostname",
        "type": "string"
      }]
    }
  ]
}
```

### 3. Multi-Platform Support

Note how the `platformOverrides` keys are `windows`, `linux`, and `macos` as per the spec. Partial overrides are supported; for instance, you can override just the `command` for one OS while inheriting the `args`.

```json
{
  "implementations": [{
    "type": "local",
    "execution": {
      "command": "python3",
      "args": ["-m", "mypackage"],
      "platformOverrides": {
        "windows": {
          "command": "python.exe"
        }
      }
    }
  }]
}
```

## Resolver ([`packages/core/src/resolver.ts`](./packages/core/src/resolver.ts))

The resolver is an async generator that consumes a domain and yields the steps of the AID discovery process, from DNS lookup to manifest validation. This is ideal for building UIs that show the discovery process in real-time.

```typescript
import { resolveDomain } from '@agentcommunity/aid-core';

async function main() {
  const domain = "agentcommunity.org";
  for await (const step of resolveDomain(domain)) {
    console.log(step);

    if (step.type === 'validation_success') {
      // The manifest is valid, now you can get actionable implementations
      const implementations = getImplementations(step.data.manifest);
      console.log(implementations);
    }
    
    if (step.type === 'validation_error' && step.data?.manifestContent) {
        console.error("Validation failed. Invalid manifest content:");
        console.error(step.data.manifestContent);
    }
  }
}
```

## Specification Compliance

This implementation strictly follows the [AID v1 specification](https://docs.agentcommunity.org/specs/aid/spec-v1/).

- ✅ All validation is driven by Zod schemas that match the spec. ([`packages/core/src/schemas.ts`](./packages/core/src/schemas.ts))
- ✅ All authentication schemes are supported.
- ✅ Local and remote implementation types are supported.
- ✅ DNS TXT record formats (Simple and Extended Profiles) are correctly generated.
- ✅ Configuration templates with `${...}` variable substitution are supported.
- ✅ OS-specific execution overrides are supported (`windows`, `linux`, `macos`).
- ✅ The generated JSON Schema is automatically synced to the public documentation repository.

## Multi-language Support & SDKs

This project provides official, auto-generated SDKs for multiple languages, ensuring consistent and compliant AID manifest handling across different ecosystems. All SDKs are generated from the single-source-of-truth [JSON Schema](./packages/aid-schema/aid.schema.json).

### TypeScript / JavaScript

The canonical implementation is written in TypeScript and is the source from which all other SDKs and schemas are derived.

- **Package:** [`@agentcommunity/aid-core`](./packages/aid-core/)
- **Installation:** `npm install @agentcommunity/aid-core`
- **Usage:**
  ```typescript
  import { resolveDomain, getImplementations } from '@agentcommunity/aid-core';

  for await (const step of resolveDomain("agentcommunity.org")) {
    if (step.type === 'validation_success') {
      const implementations = getImplementations(step.data.manifest);
      console.log(implementations);
    }
  }
  ```

### Python

The Python SDK provides Pydantic V2 models and validation helpers.

- **Package:** [`aid-core-py`](./packages/aid-core-py/)
- **Installation:** `pip install aid-core-py`
- **Usage:**
  ```python
  import json
  from aid_core_py import validate_manifest
  from aid_core_py.models import AidManifest

  with open("path/to/your/aid.json", "r") as f:
      manifest_dict = json.load(f)

  is_valid, error = validate_manifest(manifest_dict)
  if is_valid:
      manifest = AidManifest.model_validate(manifest_dict)
      print(f"Validated manifest for '{manifest.service_name}'")
  ```

### Go

The Go SDK provides canonical structs and validation helpers.

- **Package:** [`aid-core-go`](./packages/aid-core-go/)
- **Installation:** `go get github.com/agentcommunity/AgentInterfaceDiscovery/packages/aid-core-go/aidcore`
- **Usage:**
  ```go
  import "github.com/agentcommunity/AgentInterfaceDiscovery/packages/aid-core-go/aidcore"

  manifestBytes, _ := os.ReadFile("path/to/your/aid.json")
  isValid, err := aidcore.ValidateManifest(manifestBytes)
  if isValid {
	  fmt.Println("Manifest is valid!")
  }
  ```

## Conformance Testing (`@agentcommunity/aid-conformance`)

To ensure the stability of the AID ecosystem, this repository includes a dedicated conformance testing suite in the [`packages/aid-conformance`](./packages/aid-conformance/) directory. This suite provides a command-line tool, `aid-validate`, for validating manifests, DNS records, and generator configurations against the canonical specification.

This allows vendors and developers to:
-   Instantly check if their AID artifacts are spec-compliant.
-   Prevent regressions by integrating validation into their own CI/CD pipelines.
-   Badge their projects as "AID v1 Compliant."

For more details on its usage and test strategies, please see the [conformance package's dedicated README](./packages/aid-conformance/README.md).

## Quick-start for the conformance CLI

1. Build workspace (only needed after code changes):

```bash
pnpm -F @agentcommunity/aid-conformance build
```

2. After a build, make sure the binary is linked (workspace root does this automatically because `@agentcommunity/aid-conformance` is now a dev dependency):

```bash
pnpm install
```

3. Validate an **AID manifest** (not the generator config) via path:

```bash
pnpm exec aid-validate manifest path/to/aid.json
```

4. Convert a generator config to a manifest and validate the pair in one step:

```bash
pnpm exec aid-validate pair path/to/generator.json path/to/aid.json
```

Hint: the example files under `packages/examples/public/**/aid.txt` are DNS TXT samples; for them use the `txt` sub-command.

## License

[MIT](./LICENSE)

## Validation

The new /validate page provides a way to validate AID manifests against the canonical specification. This is useful for ensuring that your AID artifacts are compliant with the AID v1 specification.

To use the validation feature, you can use the `aid-validate` command-line tool. This tool allows you to validate either an AID manifest or a pair of a generator configuration and an AID manifest.

For more details on how to use the validation feature and the conformance CLI, please see the [conformance package's dedicated README](./packages/aid-conformance/README.md).

🚨 **June 2025 Schema Bump Highlights**

•   Each implementation now has both a **`name`** (machine-friendly ID) *and* a human-readable **`title`**.
•   `configuration` → `requiredConfig` – clearer semantics, same structure.
•   OAuth2 details are now discovered dynamically. Static endpoint fields were removed and replaced with a boolean flag **`dynamicClientRegistration`**.
•   Optional capability hints – `mcpVersion`, `capabilities.structuredOutput`, `capabilities.resourceLinks` – help clients choose the best implementation.

All docs, types, and the JSON schema have been updated accordingly.

## Release Automation

This repository uses [Changesets](https://github.com/changesets/changesets) with **two dedicated GitHub workflows** that keep versioning and publishing completely separate.

1. **`release.yml`** – runs on every push to `main`.
   * If any unapplied Changesets are found, it opens (or updates) an *Upcoming Release: Version Packages* PR that bumps every affected package and updates the changelogs.
   * If no Changesets exist, the workflow exits quickly.
2. **`publish.yml`** – runs **only when a Git tag that matches `v*.*.*` is pushed**. That tag is created automatically by Changesets once the Version-Packages PR is merged. The workflow:
   * installs dependencies,
   * runs `pnpm changeset publish`, and
   * publishes all public `@agentcommunity/*` packages for that version to npm using the organisation-wide `NPM_TOKEN`.

The full release cycle therefore looks like this:

```text
(commit with changeset) ─▶ push to main
        │
        ▼
 release.yml opens Version-Packages PR
        │
        ▼
 maintainer merges the PR (new tag `vX.Y.Z`)
        │
        ▼
   publish.yml runs on the tag and publishes to npm
```

Workflow locations:
* [`release.yml`](./.github/workflows/release.yml)
* [`publish.yml`](./.github/workflows/publish.yml)

## Stand-alone JSON Schema (`@agentcommunity/aid-schema`)

If you only need the canonical JSON Schema (for example to validate manifests in another programming language), install just:

```bash
npm install @agentcommunity/aid-schema
```

A copy of the schema is also published to the CDN at:

```
https://unpkg.com/@agentcommunity/aid-schema/aid.schema.json
```

This file is generated automatically from the Zod definitions in `@agentcommunity/aid-core` every time the schema changes.
