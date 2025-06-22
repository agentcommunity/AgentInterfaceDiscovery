# Agent Interface Discovery (AID)

A TypeScript implementation for generating Agent Interface Discovery manifests and DNS records, enabling standardized agent-to-agent communication discovery.

## Overview

Agent Interface Discovery (AID) is a protocol that allows AI agents to discover and connect to each other through standardized manifest files and DNS TXT records. This repository provides:

- **Type-safe TypeScript definitions** for AID v1 spec
- **Generator utilities** to convert human-friendly configs into spec-compliant manifests
- **DNS TXT record generation** for agent discovery
- **CLI tool** for easy integration into build processes
- **Web UI** for interactively creating and validating configurations

## Architecture

The project is a `pnpm` monorepo with three main packages:

```
packages/
├── core/               # The canonical library for all AID logic
│   ├── src/
│   │   ├── types.ts      # TypeScript definitions for AID v1 spec
│   │   ├── common.ts     # Browser-safe generators (manifest, TXT)
│   │   ├── generator.ts  # Node.js file writers
│   │   └── resolver.ts   # Logic for resolving an AID profile
│   └── scripts/
│       └── build-examples.ts # Builds examples & syncs them to the web UI
├── examples/             # A collection of canonical example configs
└── web/
    └── aid-generator/    # Next.js web application
```

## Type System (`packages/core/src/types.ts`)

The type system provides complete TypeScript definitions for the AID v1 specification:

### Core Configuration Interface

```typescript
export interface AidGeneratorConfig {
  schemaVersion: "1";           // MUST be "1"
  serviceName: string;          // Human-readable service name
  domain: string;               // Primary domain for DNS records
  metadata?: {
    contentVersion?: string;
    documentation?: string;
    revocationURL?: string;
  };
  implementations: ImplementationConfig[];
  signature?: unknown;          // For future JWS signing
}
```

### Implementation Types

The system supports two implementation types:

**Remote Implementations** - HTTPS endpoints:
```typescript
export interface RemoteImplementationConfig {
  type: "remote";
  uri: string;                  // HTTPS endpoint
  // ...shared fields
}
```

**Local Implementations** - Locally executable packages:
```typescript
export interface LocalImplementationConfig {
  type: "local";
  package: {
    manager: string;            // docker | npx | pip | etc.
    identifier: string;         // image/module name
    digest?: string;            // sha256 hash
  };
  execution: ExecutionConfig;   // Command + args with ${...} substitution
  // ...shared fields
}
```

### Authentication System

Comprehensive auth support including:
- `none` - No authentication
- `pat` / `apikey` - Token-based auth
- `basic` - HTTP Basic auth
- `oauth2_device` / `oauth2_code` / `oauth2_service` - OAuth2 flows
- `mtls` - Mutual TLS
- `custom` - Custom schemes

## Generator (`packages/core/src/common.ts`)

The generator, located in `packages/core/src/common.ts`, converts developer-friendly configurations into spec-compliant manifests and DNS records. It is browser-safe and used by both the core library and the web UI.

### Key Functions

#### `buildManifest(cfg: AidGeneratorConfig): AidManifest`
Converts configuration to final manifest:
- Renames `serviceName` → `name`
- Removes `domain` (used only for DNS generation)
- Auto-fills `contentVersion` if not provided
- Validates structure against types

#### `buildTxtRecord(cfg, manifestPath?, ttl?): string`
Generates DNS TXT records with intelligent format selection:

**Simple inline format** (when possible):
```
_agent.domain.com. 3600 IN TXT "v=aid1;p=mcp;uri=https://api.example.com;auth=pat"
```

**Extended format** (complex configurations):
```
_agent.domain.com. 3600 IN TXT "v=aid1;u=https://domain.com/.well-known/aid.json"
```

The generator automatically chooses the simple format only when the configuration contains exactly one "remote" implementation with no complex properties (like `configuration` or `requiredPaths`).

#### File Writers (`packages/core/src/generator.ts`)
Node.js-specific functions for writing the generated files to disk.
- `writeManifest(cfg, outDir)` - Writes `aid.json`
- `writeTxtSnippet(cfg, outDir)` - Writes `aid.txt`

## Web UI & Example Automation

The repository includes a Next.js-based web application in `packages/web/aid-generator` that serves as a live editor and validator for AID profiles.

A key feature of the build process is the automation of examples:
- The `packages/core/scripts/build-examples.ts` script acts as the single source of truth.
- When run via `pnpm -F @aid/core build:examples`, it reads all configurations from `packages/examples`.
- It validates and cleans each configuration. This includes:
  - Removing non-standard properties (like a top-level `name`).
  - Correcting common mistakes, such as converting full URLs in the `domain` field to a bare domain.
- The cleaned configs are copied to the `packages/web/aid-generator/public/samples` directory for use in the UI.
- It also generates an `index.json`, which the UI's "Load Sample" dropdown uses to dynamically populate its list.
- This ensures the web UI is always synchronized with the canonical examples.

## CLI Tool (`packages/core/bin/aid-gen.ts`)

A simple command-line interface for generating AID files from a configuration file. The `pnpm -F @aid/core exec` command runs from within the `packages/core` directory, so paths should be relative to it.

```bash
# Generate from a config file (e.g., from the examples)
# This will place the output in a new `output` directory in the project root.
pnpm -F @aid/core exec ts-node bin/aid-gen.ts ../examples/auth0/config.json ../../output
```

The CLI:
1. Reads JSON configuration file
2. Generates both `aid.json` manifest and `aid.txt` DNS record
3. Outputs file paths on success

## Auth0 Example

The `packages/examples/auth0/` directory demonstrates a complete real-world implementation for an Auth0 MCP Server.

### Configuration (`config.json`)

```json
{
  "serviceName": "Auth0 MCP Server",
  "schemaVersion": "1", 
  "domain": "auth0.agentcommunity.org",
  "metadata": {
    "documentation": "https://github.com/auth0/auth0-mcp-server",
    "contentVersion": "2025-06-18"
  },
  "implementations": [
    {
      "type": "local",
      "name": "Auth0 MCP (run)",
      "protocol": "mcp",
      "package": {
        "manager": "npx",
        "identifier": "@auth0/auth0-mcp-server"
      },
      "execution": {
        "command": "npx",
        "args": ["-y", "@auth0/auth0-mcp-server", "run", "${config.TOOLS_FLAG}", "${config.READ_ONLY_FLAG}"]
      },
      "authentication": {
        "scheme": "oauth2_device",
        "description": "Device flow starts on first run",
        "oauth": {
          "deviceAuthorizationEndpoint": "https://auth0.com/oauth/device/code",
          "tokenEndpoint": "https://auth0.com/oauth/token",
          "scopes": ["${config.AUTH0_MCP_SCOPES}"]
        }
      },
      "configuration": [
        {
          "key": "AUTH0_MCP_SCOPES",
          "description": "Scopes to request during init", 
          "type": "string",
          "defaultValue": "read:*"
        }
        // ...more config options
      ]
    }
  ]
}
```

### Generated Manifest (`aid.json`)

The generator transforms the config into a spec-compliant manifest:
- `serviceName` becomes `name`
- `domain` is removed (used only for DNS)
- Structure matches AID v1 specification exactly

### Generated DNS Record (`aid.txt`)

```
_agent.auth0.agentcommunity.org. 3600 IN TXT "v=aid1;u=https://auth0.agentcommunity.org/.well-known/aid.json"
```

Since this example has:
- Multiple implementations (run + init)
- User configuration options
- Complex execution patterns

The generator uses the **extended format** pointing to the hosted manifest rather than trying to inline everything.

### Regenerating Example Artifacts

To regenerate the `aid.json` and `aid.txt` for this (or any) example, run the build script:
```bash
pnpm -F @aid/core build:examples
```

## Usage Patterns

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

```json
{
  "implementations": [{
    "type": "local",
    "execution": {
      "command": "python",
      "args": ["-m", "mypackage"],
      "platformOverrides": {
        "win32": {
          "command": "python.exe",
          "args": ["-m", "mypackage"]
        }
      }
    }
  }]
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run the example build script (updates web samples)
# This is the single source of truth for all example artifacts.
pnpm -F @aid/core build:examples

# Run the CLI generator on the Auth0 example
pnpm -F @aid/core exec ts-node bin/aid-gen.ts ../examples/auth0/config.json ../../output

# Run the web UI in development mode
pnpm -F aid-generator dev
```

### Local Development Server & Proxy

The example domains (e.g., `auth0.aid.agentcommunity.org`) are configured with rewrite rules on Vercel to serve their corresponding manifest files from the `/public/samples` directory. These domains will not resolve on a local machine.

To enable seamless local development, the Next.js application includes a proxy at `packages/web/aid-generator/app/api/proxy/route.ts`. In a development environment, this proxy intercepts requests for the known example domains and serves the correct local JSON file, simulating the Vercel rewrites and preventing DNS errors.

## Integration

### As a Library

```typescript
import { AidGeneratorConfig, buildManifest, buildTxtRecord } from '@aid/core/browser';

const config: AidGeneratorConfig = {
  // your configuration
};

const manifest = buildManifest(config);
const dnsRecord = buildTxtRecord(config);
```

### In Build Process

```json
{
  "scripts": {
    "build": "pnpm -F @aid/core build:examples && next build"
  }
}
```

### DNS Deployment

1.  Run the `build:examples` script or use the generator to create your `aid.json` and `aid.txt` files.
2.  Add the content of the `aid.txt` record to your DNS zone.
3.  Host the `aid.json` manifest at the corresponding URL (e.g., `https://yourdomain.com/.well-known/aid.json`).
4.  Agents can now discover your service via a `TXT` lookup on `_agent.yourdomain.com`.

## Specification Compliance

This implementation follows the AID v1 specification:
- ✅ Schema version validation
- ✅ All authentication schemes supported
- ✅ Local and remote implementation types
- ✅ DNS TXT record formats (simple + extended)
- ✅ Configuration templates with variable substitution
- ✅ Platform-specific execution overrides
- ✅ Metadata and versioning support

## License


