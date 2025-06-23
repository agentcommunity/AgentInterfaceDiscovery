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
        description: zod_1.z.string().min(1, "Description isrequired"),
        tokenUrl: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
        credentials: zod_1.z.array(exports.credentialItemSchema).optional(),
        placement: exports.authPlacementSchema.optional(),
    }),
    zod_1.z.object({
        scheme: zod_1.z.literal("basic"),
        description: zod_1.z.string().min(1, "Description is required"),
        credentials: zod_1.z.array(exports.credentialItemSchema).optional(),
        placement: exports.authPlacementSchema.optional(),
    }),
    baseOAuthSchema.extend({
        scheme: zod_1.z.literal("oauth2_device"),
        oauth: zod_1.z.object({
            deviceAuthorizationEndpoint: zod_1.z.string().url("Must be a valid URL"),
            tokenEndpoint: zod_1.z.string().url("Must be a valid URL"),
            scopes: zod_1.z.array(zod_1.z.string()).optional(),
            clientId: zod_1.z.string().optional(),
        }),
    }),
    baseOAuthSchema.extend({
        scheme: zod_1.z.literal("oauth2_code"),
        oauth: zod_1.z.object({
            authorizationEndpoint: zod_1.z.string().url("Must be a valid URL"),
            tokenEndpoint: zod_1.z.string().url("Must be a valid URL"),
            scopes: zod_1.z.array(zod_1.z.string()).optional(),
            clientId: zod_1.z.string().optional(),
        }),
    }),
    baseOAuthSchema.extend({
        scheme: zod_1.z.literal("oauth2_service"),
        oauth: zod_1.z.object({
            tokenEndpoint: zod_1.z.string().url("Must be a valid URL"),
            scopes: zod_1.z.array(zod_1.z.string()).optional(),
            clientId: zod_1.z.string().optional(),
        }),
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
    name: zod_1.z.string().min(1, "Name is required"),
    protocol: zod_1.z.string().min(1, "Protocol is required"),
    type: zod_1.z.enum(["remote", "local"]),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    status: zod_1.z.enum(["active", "deprecated"]).optional(),
    revocationURL: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
    authentication: exports.authConfigSchema,
    certificate: exports.certificateConfigSchema,
    configuration: zod_1.z.array(exports.userConfigurableItemSchema).optional(),
    requiredPaths: zod_1.z.array(exports.requiredPathItemSchema).optional(),
});
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
    .refine((data) => {
    if (data.authentication.scheme === "mtls") {
        return data.certificate !== undefined && data.certificate !== null;
    }
    return true;
}, {
    message: "A 'certificate' object is required when authentication.scheme is 'mtls'.",
    path: ["certificate"],
});
exports.aidGeneratorConfigSchema = zod_1.z.object({
    schemaVersion: zod_1.z.literal("1"),
    serviceName: zod_1.z.string().min(1, "Service name is required"),
    domain: zod_1.z
        .string()
        .min(1, "Domain is required")
        .regex(/^(https?:\/\/)?[a-z0-9.-]+$/i, "Domain must be a bare domain or start with http(s):// and contain only letters, numbers, dots, and hyphens"),
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
});
exports.aidManifestSchema = exports.aidGeneratorConfigSchema.omit({ serviceName: true, domain: true, env: true }).extend({
    name: zod_1.z.string().min(1, "Name is required"),
});
