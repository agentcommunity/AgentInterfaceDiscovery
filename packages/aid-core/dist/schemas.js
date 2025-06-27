"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aidManifestSchema = exports.aidGeneratorConfigSchema = exports.implementationConfigSchema = exports.baseImplementationSchema = exports.requiredPathItemSchema = exports.userConfigurableItemSchema = exports.certificateConfigSchema = exports.executionConfigSchema = exports.authConfigSchema = exports.credentialItemSchema = exports.authPlacementSchema = void 0;
const zod_1 = require("zod");
exports.authPlacementSchema = zod_1.z.object({
    in: zod_1.z.enum(["header", "query", "cli_arg"]),
    key: zod_1.z.string().min(1, "Key is required for placement"),
    format: zod_1.z.string().optional(),
});
exports.credentialItemSchema = zod_1.z.object({
    key: zod_1.z.string().min(1, "Key is required for credential"),
    description: zod_1.z.string().min(1, "Description is required for credential"),
});
const baseOAuthSchema = zod_1.z.object({
    description: zod_1.z.string().min(1, "Description is required"),
    credentials: zod_1.z.array(exports.credentialItemSchema).optional(),
    placement: exports.authPlacementSchema.optional(),
});
const oAuthDetailsSchema = zod_1.z.object({
    scopes: zod_1.z.array(zod_1.z.string()).optional(),
    clientId: zod_1.z.string().optional(),
    dynamicClientRegistration: zod_1.z
        .boolean()
        .optional()
        .describe("If true, signals support for RFC 7591 Dynamic Client Registration."),
}).strict();
exports.authConfigSchema = zod_1.z.discriminatedUnion("scheme", [
    zod_1.z.object({ scheme: zod_1.z.literal("none") }),
    zod_1.z.object({
        scheme: zod_1.z.literal("pat"),
        description: zod_1.z.string().min(1, "Description is required"),
        tokenUrl: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
        credentials: zod_1.z.array(exports.credentialItemSchema).optional(),
        placement: exports.authPlacementSchema.optional(),
    }),
    zod_1.z.object({
        scheme: zod_1.z.literal("apikey"),
        description: zod_1.z.string().min(1, "Description is required"),
        tokenUrl: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
        credentials: zod_1.z.array(exports.credentialItemSchema).optional(),
        placement: exports.authPlacementSchema.optional(),
    }),
    zod_1.z.object({
        scheme: zod_1.z.literal("basic"),
        description: zod_1.z.string().min(1, "Description is required"),
        credentials: zod_1.z.array(exports.credentialItemSchema)
            .nonempty({
            message: "Username and password credentials are required for basic auth.",
        }),
        placement: exports.authPlacementSchema.optional(),
    }),
    baseOAuthSchema.extend({
        scheme: zod_1.z.literal("oauth2_device"),
        oauth: oAuthDetailsSchema,
    }),
    baseOAuthSchema.extend({
        scheme: zod_1.z.literal("oauth2_code"),
        oauth: oAuthDetailsSchema,
    }),
    baseOAuthSchema.extend({
        scheme: zod_1.z.literal("oauth2_service"),
        oauth: oAuthDetailsSchema,
    }),
    zod_1.z.object({
        scheme: zod_1.z.literal("mtls"),
        description: zod_1.z.string().min(1, "Description is required"),
    }),
    zod_1.z.object({
        scheme: zod_1.z.literal("custom"),
        description: zod_1.z.string().min(1, "Description is required"),
    }),
]);
// A non-recursive version for use in platformOverrides
const osExecutionSchema = zod_1.z.object({
    command: zod_1.z.string().min(1, "Command is required").optional(),
    args: zod_1.z.array(zod_1.z.string()).optional(),
    digest: zod_1.z.string().optional().describe("An optional content digest for a platform-specific package."),
});
exports.executionConfigSchema = zod_1.z.object({
    command: zod_1.z.string().min(1, "Command is required"),
    args: zod_1.z.array(zod_1.z.string()),
    platformOverrides: zod_1.z.object({
        windows: osExecutionSchema.optional(),
        linux: osExecutionSchema.optional(),
        macos: osExecutionSchema.optional(),
    }).optional(),
});
exports.certificateConfigSchema = zod_1.z
    .object({
    source: zod_1.z.enum(["file", "enrollment"]),
    enrollmentEndpoint: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
})
    .optional();
exports.userConfigurableItemSchema = zod_1.z.object({
    key: zod_1.z.string().min(1, "Key is required"),
    description: zod_1.z.string().min(1, "Description is required"),
    type: zod_1.z.enum(["string", "boolean", "integer"]),
    defaultValue: zod_1.z.union([zod_1.z.string(), zod_1.z.boolean(), zod_1.z.number()]).optional(),
    secret: zod_1.z.boolean().optional(),
});
exports.requiredPathItemSchema = zod_1.z.object({
    key: zod_1.z.string().min(1, "Key is required"),
    description: zod_1.z.string().min(1, "Description is required"),
    type: zod_1.z.enum(["file", "directory"]).optional(),
});
exports.baseImplementationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "A machine-friendly identifier is required, unique within the manifest."),
    title: zod_1.z.string().min(1, "A human-readable title is required."),
    protocol: zod_1.z.string().min(1, "Protocol is required"),
    type: zod_1.z.enum(["remote", "local"]),
    mcpVersion: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "MCP Version must be in YYYY-MM-DD format.")
        .optional()
        .describe("A non-binding hint of the MCP version supported, e.g. '2025-06-18'"),
    capabilities: zod_1.z
        .object({
        structuredOutput: zod_1.z.object({}).optional(),
        resourceLinks: zod_1.z.object({}).optional(),
    })
        .optional()
        .describe("A hint about supported MCP capabilities."),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    status: zod_1.z.enum(["active", "deprecated"]).optional(),
    revocationURL: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
    authentication: exports.authConfigSchema,
    certificate: exports.certificateConfigSchema,
    requiredConfig: zod_1.z.array(exports.userConfigurableItemSchema).optional(),
    requiredPaths: zod_1.z.array(exports.requiredPathItemSchema).optional(),
}).strict();
exports.implementationConfigSchema = zod_1.z
    .discriminatedUnion("type", [
    exports.baseImplementationSchema.extend({
        type: zod_1.z.literal("remote"),
        uri: zod_1.z.string().url("Must be a valid HTTPS URL"),
    }),
    exports.baseImplementationSchema.extend({
        type: zod_1.z.literal("local"),
        package: zod_1.z.object({
            manager: zod_1.z.string().min(1, "Package manager is required"),
            identifier: zod_1.z.string().min(1, "Package identifier is required"),
            digest: zod_1.z.string().optional(),
        }),
        execution: exports.executionConfigSchema,
    }),
])
    .refine((data) => {
    if (data.type === "remote") {
        const needsPlacement = [
            "pat",
            "apikey",
            "basic",
            "oauth2_device",
            "oauth2_code",
            "oauth2_service",
        ].includes(data.authentication.scheme);
        if (needsPlacement) {
            return "placement" in data.authentication && data.authentication.placement !== undefined;
        }
    }
    return true;
}, {
    message: "Authentication Placement is required for this remote authentication scheme",
    path: ["authentication", "placement"],
})
    .refine((impl) => {
    // rule applies only when scheme == mtls
    if (impl.authentication.scheme !== "mtls")
        return true;
    // certificate object must exist *and* contain at least one key
    return (impl.certificate != null &&
        (impl.certificate.source !== undefined ||
            impl.certificate.enrollmentEndpoint !== undefined));
}, {
    message: "For 'mtls' authentication, the 'certificate' object is required and must contain either a 'source' or an 'enrollmentEndpoint'.",
    path: ["certificate"],
});
exports.aidGeneratorConfigSchema = zod_1.z.object({
    schemaVersion: zod_1.z.literal("1"),
    serviceName: zod_1.z.string().min(1, "Service name is required"),
    domain: zod_1.z
        .string()
        .min(1, "Domain is required")
        .regex(/^(https?:\/\/)?[a-z0-9.-]+$/i, "Domain must be a bare domain or start with http(s):// and contain only letters, numbers, dots, and hyphens")
        .describe("The bare domain (e.g., 'example.com') where the agent's `_agent` TXT record is published. This is used to construct the well-known URL for the manifest and as a default for other domain-related fields."),
    env: zod_1.z.string().optional(),
    metadata: zod_1.z
        .object({
        contentVersion: zod_1.z.string().optional(),
        documentation: zod_1.z.string().url({ message: "Documentation must be a valid URL" }).optional().or(zod_1.z.literal("")),
        revocationURL: zod_1.z.string().url({ message: "Revocation URL must be a valid URL" }).optional().or(zod_1.z.literal("")),
    })
        .optional(),
    implementations: zod_1.z.array(exports.implementationConfigSchema).min(1, "At least one implementation is required"),
    signature: zod_1.z.unknown().optional(),
}).strict();
exports.aidManifestSchema = exports.aidGeneratorConfigSchema.omit({ serviceName: true, domain: true, env: true }).extend({
    name: zod_1.z.string().min(1, "Name is required"),
});
//# sourceMappingURL=schemas.js.map