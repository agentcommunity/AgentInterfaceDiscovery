# AID Generator Web UI

A Next.js web application for generating validated Agent Interface Discovery (AID) manifests and DNS records in real-time. This tool provides an intuitive form-based interface for creating AID configurations that comply with the AID specification.

## 🎯 Overview

The AID Generator helps developers and service providers create properly formatted AID manifests and corresponding DNS TXT records. It features real-time validation, live preview, and supports both remote and local implementation types with comprehensive authentication schemes.

### Key Features

- **Real-time Generation**: Live preview updates as you type
- **Comprehensive Validation**: Field-level and section-level validation with visual feedback
- **Multiple Auth Schemes**: Support for OAuth2, API keys, basic auth, and more
- **Smart URL Handling**: Auto-HTTPS detection with security indicators
- **Sample Templates**: Pre-built examples for common use cases
- **Export Options**: Download manifest JSON and DNS TXT records

## 🏗️ Architecture

The web UI is part of a pnpm monorepo that includes the canonical `@aid/core` library. This ensures the UI always uses the authoritative types and generation logic.

### Project Structure

```
├── app/
│   ├── api/generate/route.ts     # API endpoint (uses @aid/core)
│   ├── page.tsx                  # Main application page
│   └── layout.tsx                # Root layout
├── components/
│   ├── config-form.tsx           # Main configuration form
│   └── ...                       # Other UI components
├── lib/
│   ├── schemas.ts                # Zod validation schemas (aligned with @aid/core)
│   ├── generator.ts              # Client-safe generator for live preview
│   └── validation.ts             # UI-specific validation logic
└── ...
```

## 🔧 Core Components

### 1. Type System (`@aid/core`)

The web UI **imports all types directly from the `@aid/core` package**. This is the single source of truth for the AID data model, ensuring spec compliance and preventing type drift between the core logic and the UI.

- **`AidGeneratorConfig`**: Main configuration interface
- **`ImplementationConfig`**: Union type for remote/local implementations
- **`AuthConfig`**: Discriminated union for all authentication schemes

### 2. Schema Validation (`lib/schemas.ts`)

Uses Zod for runtime validation. The schemas are **manually aligned** with the types from `@aid/core` to provide a robust validation layer.

```typescript
// All types are imported from '@aid/core'
import type { AidGeneratorConfig } from "@aid/core";
import { z } from "zod";

export const aidGeneratorConfigSchema: z.ZodType<AidGeneratorConfig> = z.object({
  schemaVersion: z.literal("1"),
  serviceName: z.string().min(1, "Service name is required"),
  // ... validation rules strictly match the core types
});
```

### 3. Generator Logic

The project uses two generators for different purposes:

#### a. Canonical Generator (`@aid/core`)
- Used by the server-side API endpoint (`/api/generate`).
- Guarantees that all final, downloadable artifacts are created using the spec-compliant logic from the core library.

#### b. Live Preview Generator (`lib/generator.ts`)
- A simplified, client-safe version of the generator.
- Used exclusively for providing the real-time preview in the UI as the user types.

### POST `/api/generate`

Generates the final AID manifest and DNS record by calling the canonical functions from `@aid/core`.

**Request Body:** A valid `AidGeneratorConfig` object.

**Response:**
```json
{
  "manifest": "{...}",
  "txt": "_agent.example.com. ..."
}
```

## 🔌 API Endpoints

### POST `/api/generate`

Generates AID manifest and DNS record from configuration.

**Request Body:**
\`\`\`json
{
  "schemaVersion": "1",
  "serviceName": "My Service",
  "domain": "example.com",
  "implementations": [...]
}
\`\`\`

**Response:**
\`\`\`json
{
  "manifest": "{\n  \"name\": \"My Service\",\n  ...\n}",
  "txt": "_agent.example.com. 3600 IN TXT \"v=aid1;u=https://example.com/.well-known/aid.json\""
}
\`\`\`

**Error Response:**
\`\`\`json
{
  "error": "Validation failed",
  "errors": [
    {
      "path": "serviceName",
      "message": "Service name is required"
    }
  ]
}
\`\`\`

## 📝 Form Sections

### Service Section
- **Service Name**: Human-readable service identifier
- **Domain**: Primary domain (without protocol)
- **Schema Version**: Fixed to "1"

### Metadata Section (Optional)
- **Content Version**: Configuration version (auto-generated if empty)
- **Documentation URL**: Link to service documentation
- **Revocation URL**: URL for access revocation

### Implementations Section
Multiple implementation types supported:

#### Remote Implementation
- **Name**: Implementation identifier
- **Protocol**: Communication protocol (mcp, a2a, none, custom)
- **URI**: HTTPS endpoint
- **Tags**: Optional categorization labels
- **Authentication**: Auth scheme configuration

#### Local Implementation
- **Package Configuration**:
  - Manager: Package manager (docker, npx, pip, npm)
  - Identifier: Package name/image
  - Digest: SHA256 verification (optional)
- **Execution Configuration**:
  - Command: Base execution command
  - Args: Command arguments with variable substitution
- **Authentication**: Auth scheme configuration

### Authentication Schemes

Supported authentication methods:

1. **None**: No authentication required
2. **Personal Access Token (PAT)**: Token-based auth
3. **API Key**: API key authentication
4. **HTTP Basic**: Username/password authentication
5. **OAuth2 Device Flow**: Device authorization flow
6. **OAuth2 Authorization Code**: Standard OAuth2 flow
7. **OAuth2 Service-to-Service**: Client credentials flow
8. **Mutual TLS**: Certificate-based authentication
9. **Custom**: Custom authentication scheme

#### OAuth2 Configuration
- **Token Endpoint**: OAuth token exchange endpoint
- **Device Authorization Endpoint**: Device flow endpoint (device flow only)
- **Scopes**: Requested OAuth scopes
- **Client ID**: OAuth client identifier (optional)

### Configuration Variables

User-configurable variables for dynamic substitution:

\`\`\`typescript
{
  key: "AUTH0_MCP_SCOPES",
  description: "Scopes to request during init",
  type: "string",
  defaultValue: "read:*",
  secret: false
}
\`\`\`

**Variable Substitution:**
- Use `${config.VARIABLE_NAME}` in execution args and OAuth scopes
- Use `${package.identifier}` for package references

## 🎨 UI Components

### Smart URL Input (`components/ui/url-input.tsx`)

Enhanced URL input with security indicators:

- **Auto-HTTPS**: Automatically prepends `https://` when typing domains
- **Security Badges**: 
  - 🟢 HTTPS badge for secure URLs
  - ⚫ HTTP badge for insecure URLs
- **Editable**: Full editing capability while maintaining smart features

### Form Validation

Visual validation feedback:
- **Field-level**: Red borders and error messages for invalid fields
- **Section-level**: Red section titles when sections contain errors
- **Real-time**: Validation updates as user types
- **Summary**: Validation status badge in output panel

## 📋 Sample Configurations

Pre-built examples in `public/samples/`:

### Hello World (`hello-world.json`)
Simple remote implementation with no authentication.

### Auth0 MCP (`auth0-mcp.json`)
Complex local implementation with:
- NPX package manager
- OAuth2 device flow authentication
- Configuration variables
- Variable substitution in args and scopes

### Mixed Profile (`mixed-profile.json`)
Multiple implementations:
- Remote API with PAT authentication
- Local Docker container

## 🚀 Development

### Setup

\`\`\`bash
npm install

# Install required shadcn/ui components
npx shadcn@latest add \
  button card input label form select textarea \
  checkbox badge separator tabs dropdown-menu tooltip \
  alert sonner

npm run dev
\`\`\`

### Key Dependencies

- **Next.js 14**: React framework with App Router
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **Tailwind CSS**: Styling
- **shadcn/ui**: UI component library
- **Sonner**: Modern toast notifications
- **Lucide React**: Icons

### Development Workflow

1.  **Type Changes**: All changes to the data model must be made in the `@aid/core` package.
2.  **Build Core**: After changing `core` types, run `pnpm --filter @aid/core build` to compile the changes and make them available to the web UI.
3.  **Validation**: Update Zod schemas in `lib/schemas.ts` to reflect any changes in the `core` types.
4.  **UI**: Add/modify components in `components/`. The UI will automatically pick up the updated types from `@aid/core`.

### Adding New Authentication Schemes

1.  Add the new scheme to the `AuthConfig` union in `@aid/core/src/types.ts`.
2.  Run `pnpm --filter @aid/core build`.
3.  Update the `authConfigSchema` in `web/lib/schemas.ts` to include validation for the new scheme.
4.  Add the necessary form fields in `components/implementation-form.tsx`.
5.  Update UI validation logic in `lib/validation.ts` if needed.

### Adding New Implementation Types

1. Extend `ImplementationConfig` in `@aid/core/src/types.ts`
2. Update `implementationConfigSchema` in `lib/schemas.ts`
3. Add form handling in `components/implementation-form.tsx`
4. Update generation logic in `lib/generator.ts`

## 🔍 Validation Rules

### Required Fields
- Service name
- Domain
- At least one implementation
- Implementation name and protocol
- Remote: URI
- Local: Package manager, identifier, execution command and args
- Authentication scheme

### Format Validation
- Domain: Letters, numbers, dots, hyphens only (no protocols)
- URLs: Must be valid HTTPS URLs
- OAuth endpoints: Must be valid URLs when provided

### Business Logic
- Inline DNS format only for simple remote implementations
- Extended DNS format for complex configurations
- Auto-generated content version if not provided
- Clean up empty arrays and undefined values in output

## 📖 AID Specification Compliance

This generator creates manifests compliant with the Agent Interface Discovery specification:

- **Schema Version**: Currently supports version "1"
- **Manifest Structure**: Proper key ordering and field validation
- **DNS Discovery**: Supports both inline and extended TXT record formats
- **Authentication**: Comprehensive auth scheme support
- **Variable Substitution**: Dynamic configuration support

## 🤝 Contributing

1. Follow existing code patterns and TypeScript types
2. Update validation schemas when adding new fields
3. Add sample configurations for new features
4. Test form validation and generation logic
5. Update this README for significant changes

## 🔄 Migration Notes

When migrating from v0 or older versions, please see [CHANGES.md](./CHANGES.md) for detailed information about:
- TypeScript fixes and type system improvements
- Updated toast notification system (migrated to Sonner)
- New required shadcn/ui components
- Breaking changes and their solutions

## 📄 License

[Add your license information here]
