import { AidManifest, AuthConfig, UserConfigurableItem, AuthPlacement, CertificateConfig, RequiredPathItem } from './types';
export type ResolutionStep = {
    type: 'dns_query';
    data: {
        recordName: string;
    };
} | {
    type: 'dns_error';
    error: string;
} | {
    type: 'dns_success';
    data: {
        txtRecord: string;
    };
} | {
    type: 'inline_profile';
    message: string;
} | {
    type: 'manifest_fetch';
    data: {
        manifestUrl: string;
    };
} | {
    type: 'manifest_success';
    data: {
        manifestContent: string;
    };
} | {
    type: 'manifest_error';
    error: string;
} | {
    type: 'validation_start';
} | {
    type: 'validation_success';
    data: {
        manifest: AidManifest;
    };
} | {
    type: 'validation_error';
    error: string;
} | {
    type: 'actionable_profile';
    data: {
        implementations: ActionableImplementation[];
        domain: string;
    };
};
/**
 * A simplified, developer-friendly representation of a single service implementation.
 * This structure translates the manifest's configuration into a direct, actionable
 * set of instructions for a client application.
 */
export interface ActionableImplementation {
    /** The human-readable name of the implementation, e.g., "Cloud API (Prod)". */
    name: string;
    /** The type of implementation, determining how the client executes it. */
    type: 'remote' | 'local';
    /** The application-level protocol, e.g., "mcp", "a2a". */
    protocol: string;
    /** Optional tags for categorization. */
    tags?: string[];
    /** Details on how to run the implementation. */
    execution: {
        /** For 'remote' implementations: the HTTPS endpoint URI. */
        uri?: string;
        /** For 'local' implementations: the command to execute (e.g., "npx"). */
        command?: string;
        /** For 'local' implementations: the arguments for the command. */
        args?: string[];
    };
    /** Instructions on how the client should handle authentication. */
    auth: {
        /** The authentication scheme, e.g., "pat", "oauth2_device". */
        scheme: AuthConfig['scheme'];
        /** A human-friendly description of the authentication method. */
        description: string;
        /**
         * A list of keys for secrets the client application must acquire from the user.
         * For example: `['API_KEY']` or `['CLIENT_ID', 'CLIENT_SECRET']`.
         */
        requiredSecrets: string[];
        /**
         * For token-based schemes, describes how the acquired token should be applied to requests.
         */
        placement?: AuthPlacement;
    };
    /** A list of user-configurable variables that the client needs to resolve. */
    requiredConfig?: UserConfigurableItem[];
    /** For mTLS, details about the required client certificate. */
    certificate?: CertificateConfig;
    /** A list of local file system paths the implementation requires. */
    requiredPaths?: RequiredPathItem[];
}
/**
 * The primary function for resolving a domain's AID profile.
 * It handles the entire discovery chain, from DNS TXT lookup to manifest fetching and validation.
 * This is an async generator, yielding each step of the process for real-time UI updates.
 *
 * @example
 * ```typescript
 * for await (const step of resolveDomain("example.com")) {
 *   // update UI based on step
 *   if (step.type === 'validation_success') {
 *     const implementations = getImplementations(step.data.manifest);
 *     // use implementations
 *   }
 * }
 * ```
 * @param domain The domain to resolve (e.g., "agentcommunity.org").
 * @returns An async generator that yields `ResolutionStep` objects.
 */
export declare function resolveDomain(domain: string): AsyncGenerator<ResolutionStep>;
/**
 * Translates a valid `AidManifest` into an array of `ActionableImplementation` objects.
 * This function simplifies the manifest into a direct to-do list for a client application,
 * making it easy to determine what inputs are needed from the user (secrets, config) and
 * how to execute each available implementation.
 *
 * @param manifest The valid `AidManifest` object returned from a successful resolution.
 * @returns An array of `ActionableImplementation` objects.
 */
export declare function getImplementations(manifest: AidManifest): ActionableImplementation[];
