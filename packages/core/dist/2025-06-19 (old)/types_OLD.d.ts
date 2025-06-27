import { z } from "zod";
import { aidGeneratorConfigSchema, baseImplementationSchema, authConfigSchema, authPlacementSchema, credentialItemSchema, certificateConfigSchema, userConfigurableItemSchema, requiredPathItemSchema, aidManifestSchema } from "./schemas_OLD";
export type AidGeneratorConfig = z.infer<typeof aidGeneratorConfigSchema>;
export type AidManifest = z.infer<typeof aidManifestSchema>;
export interface ExecutionPlatformOverride {
    command?: string;
    args?: string[];
}
export interface ExecutionConfig {
    command: string;
    args: string[];
    platformOverrides?: {
        windows?: ExecutionPlatformOverride;
        linux?: ExecutionPlatformOverride;
        macos?: ExecutionPlatformOverride;
    };
}
type BaseImplementation = z.infer<typeof baseImplementationSchema>;
export type ImplementationConfig = (BaseImplementation & {
    type: "remote";
    uri: string;
}) | (BaseImplementation & {
    type: "local";
    package: {
        manager: string;
        identifier: string;
        digest?: string;
    };
    execution: ExecutionConfig;
});
export type LocalImplementationConfig = Extract<ImplementationConfig, {
    type: "local";
}>;
export type RemoteImplementationConfig = Extract<ImplementationConfig, {
    type: "remote";
}>;
export type AuthConfig = z.infer<typeof authConfigSchema>;
export type AuthPlacement = z.infer<typeof authPlacementSchema>;
export type CredentialItem = z.infer<typeof credentialItemSchema>;
export type CertificateConfig = z.infer<typeof certificateConfigSchema>;
export type UserConfigurableItem = z.infer<typeof userConfigurableItemSchema>;
export type RequiredPathItem = z.infer<typeof requiredPathItemSchema>;
export type OAuth2DeviceAuth = Extract<AuthConfig, {
    scheme: "oauth2_device";
}>;
export type OAuth2CodeAuth = Extract<AuthConfig, {
    scheme: "oauth2_code";
}>;
export type OAuth2ServiceAuth = Extract<AuthConfig, {
    scheme: "oauth2_service";
}>;
export {};
