// packages/core/src/types.ts
// Canonical v1 TypeScript model for the AID generator & manifest.

/* ------------------------------------------------------------------ *
 * 0.  Top-level configuration object (what your generator consumes)   *
 * ------------------------------------------------------------------ */

export interface AidGeneratorConfig {
    /** MUST be "1". */
    schemaVersion: "1";
  
    /** Human-readable service name – becomes `name` in the manifest. */
    serviceName: string;
  
    /** Primary domain – used for _agent.<domain> TXT record generation. */
    domain: string;
  
    /** Extra metadata exactly as in the spec. All are optional. */
    metadata?: {
      contentVersion?: string;
      documentation?: string;
      revocationUrl?: string;      // lower-case “l” – spec-accurate
    };
  
    /** At least one concrete implementation. */
    implementations: ImplementationConfig[];
  
    /** Detached JWS signature holder – ignore until you need signing. */
    signature?: unknown;
  }
  
  /* ------------------------------------------------------------------ *
   * 1.  Implementation union (remote | local)                           *
   * ------------------------------------------------------------------ */
  
  export type ImplementationConfig =
    | RemoteImplementationConfig
    | LocalImplementationConfig;
  
  /** Shared keys between remote and local implementations. */
  interface BaseImplementationConfig {
    name: string;
    type: "remote" | "local";
    protocol: string;                         // e.g. "mcp", "a2a"
    tags?: string[];
    status?: "active" | "deprecated";
    revocationUrl?: string;
  
    /** Optional per-platform overrides (non-spec helper). */
    platformOverrides?: Record<string, ExecutionConfig>;
  
    authentication: AuthConfig;
    certificate?: CertificateConfig;          // when scheme === "mtls"
    configuration?: UserConfigurableItem[];
    requiredPaths?: RequiredPathItem[];
  }
  
  /* -- Remote -------------------------------------------------------- */
  
  export interface RemoteImplementationConfig extends BaseImplementationConfig {
    type: "remote";
    uri: string;                              // HTTPS endpoint
  }
  
  /* -- Local --------------------------------------------------------- */
  
  export interface LocalImplementationConfig extends BaseImplementationConfig {
    type: "local";
    package: {
      manager: string;                        // docker | npx | pip | …
      identifier: string;                     // image / module name
      digest?: string;                        // sha256:…
    };
    execution: ExecutionConfig;
  }
  
  /* ------------------------------------------------------------------ *
   * 2.  Execution template                                              *
   * ------------------------------------------------------------------ */
  
  export interface ExecutionConfig {
    command: string;                          // e.g. "docker"
    args: string[];                           // supports ${…} subs
    platformOverrides?: Record<string, ExecutionConfig>;
  }
  
  /* ------------------------------------------------------------------ *
   * 3.  Authentication registry                                         *
   * ------------------------------------------------------------------ */
  
  export type AuthConfig =
    | { scheme: "none" }
    | TokenAuth<"pat">
    | TokenAuth<"apikey">
    | BasicAuth
    | OAuthAuth<"oauth2_device">
    | OAuthAuth<"oauth2_code">
    | OAuthAuth<"oauth2_service">
    | { scheme: "mtls"; description: string }
    | { scheme: "custom"; description: string };
  
  /* -- Simple token styles ------------------------------------------ */
  
  interface TokenAuth<T extends "pat" | "apikey"> {
    scheme: T;
    description: string;
    tokenUrl?: string;
    credentials?: CredentialItem[];
    placement: AuthPlacement;
  }
  
  /* -- HTTP Basic --------------------------------------------------- */
  
  interface BasicAuth {
    scheme: "basic";
    description: string;
    credentials?: CredentialItem[];
    placement: AuthPlacement;
  }
  
  /* -- OAuth family ------------------------------------------------- */
  
  interface OAuthAuth<
    T extends "oauth2_device" | "oauth2_code" | "oauth2_service"
  > {
    scheme: T;
    description: string;
    oauth: {
      authorizationEndpoint?: string;
      deviceAuthorizationEndpoint?: string;
      tokenEndpoint: string;
      scopes?: string[];
      clientId?: string;
    };
    credentials?: CredentialItem[];
    placement?: AuthPlacement;
  }
  
  /* -- Auth helpers ------------------------------------------------- */
  
  export interface AuthPlacement {
    in: "header" | "query" | "cli_arg";
    key: string;
    format?: string;                           // default "{token}"
  }
  
  export interface CredentialItem {
    key: string;
    description: string;
  }
  
  export interface CertificateConfig {
    source: "file" | "enrollment";
    enrollmentEndpoint?: string;
  }
  
  /* ------------------------------------------------------------------ *
   * 4.  User config & required paths                                    *
   * ------------------------------------------------------------------ */
  
  export interface UserConfigurableItem {
    key: string;
    description: string;
    type: "string" | "boolean" | "integer";
    defaultValue?: string | boolean | number;
    secret?: boolean;
  }
  
  export interface RequiredPathItem {
    key: string;
    description: string;
    type?: "file" | "directory";
  }
  
  /* ------------------------------------------------------------------ *
   * 5.  Pure manifest type (what ends up in aid.json)                   *
   * ------------------------------------------------------------------ */
  
  export type AidManifest = Omit<
    AidGeneratorConfig,
    "serviceName" | "domain"
  > & {
    /** `serviceName` is emitted as `name` in the manifest. */
    name: string;
  };
  