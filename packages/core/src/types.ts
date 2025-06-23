// packages/core/src/types.ts
// Canonical v1 TypeScript model for the AID generator & manifest.
// These types are generated from the Zod schemas in `schemas.ts`.

import { z } from "zod";
import {
  aidGeneratorConfigSchema,
  baseImplementationSchema,
  authConfigSchema,
  authPlacementSchema,
  credentialItemSchema,
  certificateConfigSchema,
  userConfigurableItemSchema,
  requiredPathItemSchema,
  aidManifestSchema,
  implementationConfigSchema,
} from "./schemas";

/* ------------------------------------------------------------------ *
 *    Primary Configuration and Manifest Types                      *
 * ------------------------------------------------------------------ */

export type AidGeneratorConfig = z.infer<typeof aidGeneratorConfigSchema>;
export type AidManifest = z.infer<typeof aidManifestSchema>;

/* ------------------------------------------------------------------ *
 *    Implementation-level Types                                    *
 * ------------------------------------------------------------------ */

// Manually define a platform-specific override type
export interface ExecutionPlatformOverride {
  command?: string;
  args?: string[];
}

// Manually define ExecutionConfig to solve circular dependency with its own schema
export interface ExecutionConfig {
  command: string;
  args: string[];
  platformOverrides?: {
    windows?: ExecutionPlatformOverride;
    linux?: ExecutionPlatformOverride;
    macos?: ExecutionPlatformOverride;
  };
}

// Derive the base type from its schema
type BaseImplementation = z.infer<typeof baseImplementationSchema>;

// Manually construct the final union type
export type ImplementationConfig =
  | (BaseImplementation & {
      type: "remote";
      uri: string;
    })
  | (BaseImplementation & {
      type: "local";
      package: {
        manager: string;
        identifier: string;
        digest?: string;
      };
      execution: ExecutionConfig;
    });

export type LocalImplementationConfig = Extract<
  ImplementationConfig,
  { type: "local" }
>;
export type RemoteImplementationConfig = Extract<
  ImplementationConfig,
  { type: "remote" }
>;

/* ------------------------------------------------------------------ *
 *    Component Part Types (Auth, Config, etc.)                     *
 * ------------------------------------------------------------------ */

export type AuthConfig = z.infer<typeof authConfigSchema>;
export type AuthPlacement = z.infer<typeof authPlacementSchema>;
export type CredentialItem = z.infer<typeof credentialItemSchema>;
export type CertificateConfig = z.infer<typeof certificateConfigSchema>;
export type UserConfigurableItem = z.infer<typeof userConfigurableItemSchema>;
export type RequiredPathItem = z.infer<typeof requiredPathItemSchema>;

// Export individual OAuth types for convenience
export type OAuth2DeviceAuth = Extract<AuthConfig, { scheme: "oauth2_device" }>;
export type OAuth2CodeAuth = Extract<AuthConfig, { scheme: "oauth2_code" }>;
export type OAuth2ServiceAuth = Extract<AuthConfig, { scheme: "oauth2_service" }>;
  