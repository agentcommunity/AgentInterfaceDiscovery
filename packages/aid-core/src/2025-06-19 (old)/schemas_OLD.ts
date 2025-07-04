//NOT TO BE REMOVED or CHANGED. 

import { z } from "zod"
import type { AidGeneratorConfig, ImplementationConfig, ExecutionConfig } from "./types_OLD"

export const authPlacementSchema = z.object({
  in: z.enum(["header", "query", "cli_arg"]),
  key: z.string().min(1, "Key is required for placement"),
  format: z.string().optional(),
})

export const credentialItemSchema = z.object({
  key: z.string().min(1, "Key is required for credential"),
  description: z.string().min(1, "Description is required for credential"),
})

const baseOAuthSchema = z.object({
  description: z.string().min(1, "Description is required"),
  credentials: z.array(credentialItemSchema).optional(),
  placement: authPlacementSchema.optional(),
})

export const authConfigSchema = z.discriminatedUnion("scheme", [
  z.object({ scheme: z.literal("none") }),
  z.object({
    scheme: z.literal("pat"),
    description: z.string().min(1, "Description is required"),
    tokenUrl: z.string().url().optional().or(z.literal("")),
    credentials: z.array(credentialItemSchema).optional(),
    placement: authPlacementSchema.optional(),
  }),
  z.object({
    scheme: z.literal("apikey"),
    description: z.string().min(1, "Description isrequired"),
    tokenUrl: z.string().url().optional().or(z.literal("")),
    credentials: z.array(credentialItemSchema).optional(),
    placement: authPlacementSchema.optional(),
  }),
  z.object({
    scheme: z.literal("basic"),
    description: z.string().min(1, "Description is required"),
    credentials: z.array(credentialItemSchema).optional(),
    placement: authPlacementSchema.optional(),
  }),
  baseOAuthSchema.extend({
    scheme: z.literal("oauth2_device"),
    oauth: z.object({
      deviceAuthorizationEndpoint: z.string().url("Must be a valid URL"),
      tokenEndpoint: z.string().url("Must be a valid URL"),
      scopes: z.array(z.string()).optional(),
      clientId: z.string().optional(),
    }),
  }),
  baseOAuthSchema.extend({
    scheme: z.literal("oauth2_code"),
    oauth: z.object({
      authorizationEndpoint: z.string().url("Must be a valid URL"),
      tokenEndpoint: z.string().url("Must be a valid URL"),
      scopes: z.array(z.string()).optional(),
      clientId: z.string().optional(),
    }),
  }),
  baseOAuthSchema.extend({
    scheme: z.literal("oauth2_service"),
    oauth: z.object({
      tokenEndpoint: z.string().url("Must be a valid URL"),
      scopes: z.array(z.string()).optional(),
      clientId: z.string().optional(),
    }),
  }),
  z.object({
    scheme: z.literal("mtls"),
    description: z.string().min(1, "Description is required"),
  }),
  z.object({
    scheme: z.literal("custom"),
    description: z.string().min(1, "Description is required"),
  }),
])

// A non-recursive version for use in platformOverrides
const osExecutionSchema = z.object({
  command: z.string().min(1, "Command is required").optional(),
  args: z.array(z.string()).optional(),
});

export const executionConfigSchema: z.ZodType<ExecutionConfig> = z.object({
  command: z.string().min(1, "Command is required"),
  args: z.array(z.string()),
  platformOverrides: z.object({
    windows: osExecutionSchema.optional(),
    linux: osExecutionSchema.optional(),
    macos: osExecutionSchema.optional(),
  }).optional(),
})

export const certificateConfigSchema = z
  .object({
    source: z.enum(["file", "enrollment"]),
    enrollmentEndpoint: z.string().url().optional().or(z.literal("")),
  })
  .optional();

export const userConfigurableItemSchema = z.object({
  key: z.string().min(1, "Key is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["string", "boolean", "integer"]),
  defaultValue: z.union([z.string(), z.boolean(), z.number()]).optional(),
  secret: z.boolean().optional(),
});

export const requiredPathItemSchema = z.object({
  key: z.string().min(1, "Key is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["file", "directory"]).optional(),
});

export const baseImplementationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  protocol: z.string().min(1, "Protocol is required"),
  type: z.enum(["remote", "local"]),
  tags: z.array(z.string()).optional(),
  status: z.enum(["active", "deprecated"]).optional(),
  revocationURL: z.string().url().optional().or(z.literal("")),
  authentication: authConfigSchema,
  certificate: certificateConfigSchema,
  configuration: z.array(userConfigurableItemSchema).optional(),
  requiredPaths: z.array(requiredPathItemSchema).optional(),
})

export const implementationConfigSchema: z.ZodType<ImplementationConfig> = z
  .discriminatedUnion("type", [
    baseImplementationSchema.extend({
      type: z.literal("remote"),
      uri: z.string().url("Must be a valid HTTPS URL"),
    }),
    baseImplementationSchema.extend({
      type: z.literal("local"),
      package: z.object({
        manager: z.string().min(1, "Package manager is required"),
        identifier: z.string().min(1, "Package identifier is required"),
        digest: z.string().optional(),
      }),
      execution: executionConfigSchema,
    }),
  ])
  .refine(
    (data: ImplementationConfig) => {
      if (data.type === "remote") {
        const needsPlacement = [
          "pat",
          "apikey",
          "basic",
          "oauth2_device",
          "oauth2_code",
          "oauth2_service",
        ].includes(data.authentication.scheme)
        if (needsPlacement) {
          return "placement" in data.authentication && data.authentication.placement !== undefined
        }
      }
      return true
    },
    {
      message: "Authentication Placement is required for this remote authentication scheme",
      path: ["authentication", "placement"],
    },
  )
  .refine(
    (data: ImplementationConfig) => {
      if (data.authentication.scheme === "mtls") {
        return data.certificate !== undefined && data.certificate !== null;
      }
      return true;
    },
    {
      message: "A 'certificate' object is required when authentication.scheme is 'mtls'.",
      path: ["certificate"],
    }
  )

export const aidGeneratorConfigSchema = z.object({
  schemaVersion: z.literal("1"),
  serviceName: z.string().min(1, "Service name is required"),
  domain: z
    .string()
    .min(1, "Domain is required")
    .regex(
      /^(https?:\/\/)?[a-z0-9.-]+$/i,
      "Domain must be a bare domain or start with http(s):// and contain only letters, numbers, dots, and hyphens",
    ),
  env: z.string().optional(),
  metadata: z
    .object({
      contentVersion: z.string().optional(),
      documentation: z.string().url({ message: "Documentation must be a valid URL" }).optional().or(z.literal("")),
      revocationURL: z.string().url({ message: "Revocation URL must be a valid URL" }).optional().or(z.literal("")),
    })
    .optional(),
  implementations: z.array(implementationConfigSchema).min(1, "At least one implementation is required"),
  signature: z.unknown().optional(),
})

export const aidManifestSchema = aidGeneratorConfigSchema.omit({ serviceName: true, domain: true, env: true }).extend({
  name: z.string().min(1, "Name is required"),
}); 