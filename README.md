# Agent Interface Discovery (AID)

A TypeScript implementation for generating Agent Interface Discovery manifests and DNS records, enabling standardized agent-to-agent communication discovery.

## Overview

Agent Interface Discovery (AID) is a protocol that allows AI agents to discover and connect to each other through standardized manifest files and DNS TXT records. This repository provides:

- **Type-safe TypeScript definitions** for AID v1 spec
- **Generator utilities** to convert human-friendly configs into spec-compliant manifests
- **DNS TXT record generation** for agent discovery
- **CLI tool** for easy integration into build processes

## Architecture

### Core Components

```
packages/
├── core/
│   ├── src/
│   │   ├── types.ts      # TypeScript definitions for AID v1 spec
│   │   └── generator.ts  # Config → Manifest conversion logic
│   └── bin/
│       └── aid-gen.ts    # CLI tool for generating AID files
└── examples/
    └── auth0/            # Complete Auth0 MCP Server example
        ├── config.json   # Human-friendly configuration
        ├── aid.json      # Generated AID manifest
        └── aid.txt       # Generated DNS TXT record
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
    revocationUrl?: string;
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

## Generator (`packages/core/src/generator.ts`)

The generator converts developer-friendly configurations into spec-compliant manifests and DNS records.

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

The generator automatically chooses simple format only when:
- Exactly one implementation
- Implementation is "remote" type
- No configuration/paths/certificates/platform overrides

#### File Writers
- `writeManifest(cfg, outDir)` - Writes `aid.json`
- `writeTxtSnippet(cfg, outDir)` - Writes `aid.txt`

## CLI Tool (`packages/core/bin/aid-gen.ts`)

Simple command-line interface for generating AID files:

```bash
# Generate from config file
npx aid-gen config.json [outputDir]

# Example
npx aid-gen packages/examples/auth0/config.json ./output
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

# Build packages
pnpm build

# Run generator on Auth0 example
pnpm exec ts-node packages/core/bin/aid-gen.ts packages/examples/auth0/config.json

# Run tests
pnpm test
```

## Integration

### As a Library

```typescript
import { AidGeneratorConfig, buildManifest, buildTxtRecord } from '@aid/core';

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
    "build:aid": "aid-gen config/aid-config.json dist/"
  }
}
```

### DNS Deployment

1. Generate `aid.txt` with your configuration
2. Add the TXT record to your DNS zone
3. Host the `aid.json` manifest at `https://yourdomain.com/.well-known/aid.json`
4. Agents can now discover your service via `_agent.yourdomain.com` TXT lookup

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


