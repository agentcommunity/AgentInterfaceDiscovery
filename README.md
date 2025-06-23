# Agent Interface Discovery (AID) - Core Library

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
2.  **Canonical JSON Schema:** The [`schema/v1/aid.schema.json`](./schema/v1/aid.schema.json) file is programmatically generated from the Zod schemas. This file is the public, machine-readable contract for the AID v1 manifest.

This approach eliminates drift between validation, static types, and public documentation.

## Architecture

The project is a `pnpm` monorepo with the following key components:

```
.
├── .github/workflows/    # CI/CD automation
│   └── sync-schema.yml   # Action to sync the JSON schema to the docs repo
├── packages/
│   ├── core/             # The canonical library for all AID logic
│   │   ├── src/
│   │   │   ├── schemas.ts    # The single source of truth (Zod schemas)
│   │   │   ├── types.ts      # Inferred TypeScript types (auto-generated)
│   │   │   ├── common.ts     # Browser-safe generators (manifest, TXT)
│   │   │   ├── generator.ts  # Node.js file writers for manifests
│   │   │   └── resolver.ts   # Logic for resolving an AID profile
│   │   └── scripts/
│   │       ├── generate-schema.ts # Generates the canonical JSON schema
│   │       └── build-examples.ts  # Builds examples & syncs them to the web UI
│   ├── examples/           # A collection of canonical example configs
│   └── web/
│       └── aid-generator/  # Next.js web application for building manifests
└── schema/
    └── v1/
        └── aid.schema.json # The generated canonical JSON Schema artifact
```

A key design feature is the separation of browser-safe and Node.js-specific code. [`packages/core/src/common.ts`](./packages/core/src/common.ts) contains pure data transformation logic (`buildManifest`, `buildTxtRecord`) that can run in any JavaScript environment. [`packages/core/src/generator.ts`](./packages/core/src/generator.ts) contains file system operations (`writeManifest`) and is intended for Node.js environments only. This ensures the library is lightweight and versatile.

## Development Workflow

To make changes to the AID manifest structure, follow this workflow:

1.  **Modify the Schema:** Make your changes to the Zod schemas in [`packages/core/src/schemas.ts`](./packages/core/src/schemas.ts).
2.  **Update Types:** The TypeScript types in [`packages/core/src/types.ts`](./packages/core/src/types.ts) will update automatically as they are inferred from the schemas. You may need to adjust code that uses these types.
3.  **Regenerate the JSON Schema:** Run the generator script to create an updated `aid.schema.json`.
    ```bash
    pnpm -F @aid/core run schema:generate
    ```
4.  **Commit Changes:** Commit all modified files, including `schemas.ts`, `types.ts`, and the newly generated [`schema/v1/aid.schema.json`](./schema/v1/aid.schema.json).
5.  **Push to `main`:** Pushing to the `main` branch will trigger the `sync-schema.yml` GitHub Action, which automatically pushes the updated `aid.schema.json` to the public `agentcommunity/docs` repository.

## Key Scripts

-   `pnpm install`: Install all dependencies.
-   `pnpm build`: Build all packages in the monorepo.
-   `pnpm -F @aid/core run schema:generate`: Regenerate the canonical JSON schema.
-   `pnpm -F @aid/core run build:examples`: Generate the hosted example artifacts (`aid.json`, `aid.txt`) in `packages/examples/public/` using the configs from the web UI's samples directory as the source of truth.
-   `pnpm -F aid-generator dev`: Run the web UI in development mode.

The `build:examples` script is used to generate the publicly hosted manifests that are used for testing the resolver. It reads all configurations from `packages/web/aid-generator/public/samples`, resolves any template variables, and writes the final `aid.json` and `aid.txt` files to `packages/examples/public/`. This ensures our hosted examples are always in sync with the samples used in the web UI.

## Web UI (`packages/web/aid-generator`)

This project includes a powerful, user-friendly web application for generating and validating AID manifests in real-time. It's built with Next.js and provides a rich form-based interface that uses the `@aid/core` library as its single source of truth for generation logic.

Key features include:
- Live preview of the generated `aid.json` and DNS TXT record.
- Real-time validation with clear error feedback.
- A responsive interface optimized for both desktop and mobile use.
- Pre-built examples for common use cases.

For detailed information on its architecture, components, and development workflow, please see the [web UI's dedicated README](./packages/web/aid-generator/README.md).

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
  "implementations": [{
    "type": "remote",
    "name": "Production API",
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
  }]
}
```

### 2. Local Package with Configuration

```json
{
  "schemaVersion": "1", 
  "serviceName": "Database Tool",
  "domain": "dbtool.io",
  "implementations": [{
    "type": "local",
    "name": "CLI Tool",
    "protocol": "mcp",
    "package": {
      "manager": "npx",
      "identifier": "@company/db-mcp"
    },
    "execution": {
      "command": "npx",
      "args": ["-y", "@company/db-mcp", "--host", "${config.DB_HOST}"]
    },
    "authentication": { "scheme": "none" },
    "configuration": [{
      "key": "DB_HOST",
      "description": "Database hostname",
      "type": "string"
    }]
  }]
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
import { resolveDomain } from '@aid/core';

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

## License

[MIT](./LICENSE)
