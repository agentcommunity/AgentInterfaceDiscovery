import { AidGeneratorConfig, ImplementationConfig } from "./types";
export declare function buildManifest(cfg: AidGeneratorConfig): {
    schemaVersion: "1";
    env?: string;
    implementations: ImplementationConfig[];
    signature?: unknown;
    name: string;
    metadata: {
        contentVersion: string;
        documentation?: string;
        revocationURL?: string;
    } | undefined;
};
export declare function buildTxtRecord(cfg: AidGeneratorConfig, manifestPath?: string, ttl?: number): string;
