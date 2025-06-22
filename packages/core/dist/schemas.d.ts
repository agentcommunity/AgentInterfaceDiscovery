import { z } from "zod";
import type { ImplementationConfig } from "./types";
export declare const aidGeneratorConfigSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<"1">;
    serviceName: z.ZodString;
    domain: z.ZodString;
    env: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodObject<{
        contentVersion: z.ZodOptional<z.ZodString>;
        documentation: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        revocationURL: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    }, "strip", z.ZodTypeAny, {
        contentVersion?: string | undefined;
        documentation?: string | undefined;
        revocationURL?: string | undefined;
    }, {
        contentVersion?: string | undefined;
        documentation?: string | undefined;
        revocationURL?: string | undefined;
    }>>;
    implementations: z.ZodArray<z.ZodType<ImplementationConfig, z.ZodTypeDef, ImplementationConfig>, "many">;
    signature: z.ZodOptional<z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    serviceName: string;
    domain: string;
    schemaVersion: "1";
    implementations: ImplementationConfig[];
    env?: string | undefined;
    metadata?: {
        contentVersion?: string | undefined;
        documentation?: string | undefined;
        revocationURL?: string | undefined;
    } | undefined;
    signature?: unknown;
}, {
    serviceName: string;
    domain: string;
    schemaVersion: "1";
    implementations: ImplementationConfig[];
    env?: string | undefined;
    metadata?: {
        contentVersion?: string | undefined;
        documentation?: string | undefined;
        revocationURL?: string | undefined;
    } | undefined;
    signature?: unknown;
}>;
