import { z } from "zod";
import type { ImplementationConfig, ExecutionConfig } from "./types_OLD";
export declare const authPlacementSchema: z.ZodObject<{
    in: z.ZodEnum<["header", "query", "cli_arg"]>;
    key: z.ZodString;
    format: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    in: "header" | "query" | "cli_arg";
    key: string;
    format?: string | undefined;
}, {
    in: "header" | "query" | "cli_arg";
    key: string;
    format?: string | undefined;
}>;
export declare const credentialItemSchema: z.ZodObject<{
    key: z.ZodString;
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    key: string;
    description: string;
}, {
    key: string;
    description: string;
}>;
export declare const authConfigSchema: z.ZodDiscriminatedUnion<"scheme", [z.ZodObject<{
    scheme: z.ZodLiteral<"none">;
}, "strip", z.ZodTypeAny, {
    scheme: "none";
}, {
    scheme: "none";
}>, z.ZodObject<{
    scheme: z.ZodLiteral<"pat">;
    description: z.ZodString;
    tokenUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    credentials: z.ZodOptional<z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        key: string;
        description: string;
    }, {
        key: string;
        description: string;
    }>, "many">>;
    placement: z.ZodOptional<z.ZodObject<{
        in: z.ZodEnum<["header", "query", "cli_arg"]>;
        key: z.ZodString;
        format: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        in: "header" | "query" | "cli_arg";
        key: string;
        format?: string | undefined;
    }, {
        in: "header" | "query" | "cli_arg";
        key: string;
        format?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    description: string;
    scheme: "pat";
    tokenUrl?: string | undefined;
    credentials?: {
        key: string;
        description: string;
    }[] | undefined;
    placement?: {
        in: "header" | "query" | "cli_arg";
        key: string;
        format?: string | undefined;
    } | undefined;
}, {
    description: string;
    scheme: "pat";
    tokenUrl?: string | undefined;
    credentials?: {
        key: string;
        description: string;
    }[] | undefined;
    placement?: {
        in: "header" | "query" | "cli_arg";
        key: string;
        format?: string | undefined;
    } | undefined;
}>, z.ZodObject<{
    scheme: z.ZodLiteral<"apikey">;
    description: z.ZodString;
    tokenUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    credentials: z.ZodOptional<z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        key: string;
        description: string;
    }, {
        key: string;
        description: string;
    }>, "many">>;
    placement: z.ZodOptional<z.ZodObject<{
        in: z.ZodEnum<["header", "query", "cli_arg"]>;
        key: z.ZodString;
        format: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        in: "header" | "query" | "cli_arg";
        key: string;
        format?: string | undefined;
    }, {
        in: "header" | "query" | "cli_arg";
        key: string;
        format?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    description: string;
    scheme: "apikey";
    tokenUrl?: string | undefined;
    credentials?: {
        key: string;
        description: string;
    }[] | undefined;
    placement?: {
        in: "header" | "query" | "cli_arg";
        key: string;
        format?: string | undefined;
    } | undefined;
}, {
    description: string;
    scheme: "apikey";
    tokenUrl?: string | undefined;
    credentials?: {
        key: string;
        description: string;
    }[] | undefined;
    placement?: {
        in: "header" | "query" | "cli_arg";
        key: string;
        format?: string | undefined;
    } | undefined;
}>, z.ZodObject<{
    scheme: z.ZodLiteral<"basic">;
    description: z.ZodString;
    credentials: z.ZodOptional<z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        key: string;
        description: string;
    }, {
        key: string;
        description: string;
    }>, "many">>;
    placement: z.ZodOptional<z.ZodObject<{
        in: z.ZodEnum<["header", "query", "cli_arg"]>;
        key: z.ZodString;
        format: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        in: "header" | "query" | "cli_arg";
        key: string;
        format?: string | undefined;
    }, {
        in: "header" | "query" | "cli_arg";
        key: string;
        format?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    description: string;
    scheme: "basic";
    credentials?: {
        key: string;
        description: string;
    }[] | undefined;
    placement?: {
        in: "header" | "query" | "cli_arg";
        key: string;
        format?: string | undefined;
    } | undefined;
}, {
    description: string;
    scheme: "basic";
    credentials?: {
        key: string;
        description: string;
    }[] | undefined;
    placement?: {
        in: "header" | "query" | "cli_arg";
        key: string;
        format?: string | undefined;
    } | undefined;
}>, z.ZodObject<{
    description: z.ZodString;
    credentials: z.ZodOptional<z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        key: string;
        description: string;
    }, {
        key: string;
        description: string;
    }>, "many">>;
    placement: z.ZodOptional<z.ZodObject<{
        in: z.ZodEnum<["header", "query", "cli_arg"]>;
        key: z.ZodString;
        format: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        in: "header" | "query" | "cli_arg";
        key: string;
        format?: string | undefined;
    }, {
        in: "header" | "query" | "cli_arg";
        key: string;
        format?: string | undefined;
    }>>;
} & {
    scheme: z.ZodLiteral<"oauth2_device">;
    oauth: z.ZodObject<{
        deviceAuthorizationEndpoint: z.ZodString;
        tokenEndpoint: z.ZodString;
        scopes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        clientId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        deviceAuthorizationEndpoint: string;
        tokenEndpoint: string;
        scopes?: string[] | undefined;
        clientId?: string | undefined;
    }, {
        deviceAuthorizationEndpoint: string;
        tokenEndpoint: string;
        scopes?: string[] | undefined;
        clientId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    description: string;
    scheme: "oauth2_device";
    oauth: {
        deviceAuthorizationEndpoint: string;
        tokenEndpoint: string;
        scopes?: string[] | undefined;
        clientId?: string | undefined;
    };
    credentials?: {
        key: string;
        description: string;
    }[] | undefined;
    placement?: {
        in: "header" | "query" | "cli_arg";
        key: string;
        format?: string | undefined;
    } | undefined;
}, {
    description: string;
    scheme: "oauth2_device";
    oauth: {
        deviceAuthorizationEndpoint: string;
        tokenEndpoint: string;
        scopes?: string[] | undefined;
        clientId?: string | undefined;
    };
    credentials?: {
        key: string;
        description: string;
    }[] | undefined;
    placement?: {
        in: "header" | "query" | "cli_arg";
        key: string;
        format?: string | undefined;
    } | undefined;
}>, z.ZodObject<{
    description: z.ZodString;
    credentials: z.ZodOptional<z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        key: string;
        description: string;
    }, {
        key: string;
        description: string;
    }>, "many">>;
    placement: z.ZodOptional<z.ZodObject<{
        in: z.ZodEnum<["header", "query", "cli_arg"]>;
        key: z.ZodString;
        format: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        in: "header" | "query" | "cli_arg";
        key: string;
        format?: string | undefined;
    }, {
        in: "header" | "query" | "cli_arg";
        key: string;
        format?: string | undefined;
    }>>;
} & {
    scheme: z.ZodLiteral<"oauth2_code">;
    oauth: z.ZodObject<{
        authorizationEndpoint: z.ZodString;
        tokenEndpoint: z.ZodString;
        scopes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        clientId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        tokenEndpoint: string;
        authorizationEndpoint: string;
        scopes?: string[] | undefined;
        clientId?: string | undefined;
    }, {
        tokenEndpoint: string;
        authorizationEndpoint: string;
        scopes?: string[] | undefined;
        clientId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    description: string;
    scheme: "oauth2_code";
    oauth: {
        tokenEndpoint: string;
        authorizationEndpoint: string;
        scopes?: string[] | undefined;
        clientId?: string | undefined;
    };
    credentials?: {
        key: string;
        description: string;
    }[] | undefined;
    placement?: {
        in: "header" | "query" | "cli_arg";
        key: string;
        format?: string | undefined;
    } | undefined;
}, {
    description: string;
    scheme: "oauth2_code";
    oauth: {
        tokenEndpoint: string;
        authorizationEndpoint: string;
        scopes?: string[] | undefined;
        clientId?: string | undefined;
    };
    credentials?: {
        key: string;
        description: string;
    }[] | undefined;
    placement?: {
        in: "header" | "query" | "cli_arg";
        key: string;
        format?: string | undefined;
    } | undefined;
}>, z.ZodObject<{
    description: z.ZodString;
    credentials: z.ZodOptional<z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        key: string;
        description: string;
    }, {
        key: string;
        description: string;
    }>, "many">>;
    placement: z.ZodOptional<z.ZodObject<{
        in: z.ZodEnum<["header", "query", "cli_arg"]>;
        key: z.ZodString;
        format: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        in: "header" | "query" | "cli_arg";
        key: string;
        format?: string | undefined;
    }, {
        in: "header" | "query" | "cli_arg";
        key: string;
        format?: string | undefined;
    }>>;
} & {
    scheme: z.ZodLiteral<"oauth2_service">;
    oauth: z.ZodObject<{
        tokenEndpoint: z.ZodString;
        scopes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        clientId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        tokenEndpoint: string;
        scopes?: string[] | undefined;
        clientId?: string | undefined;
    }, {
        tokenEndpoint: string;
        scopes?: string[] | undefined;
        clientId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    description: string;
    scheme: "oauth2_service";
    oauth: {
        tokenEndpoint: string;
        scopes?: string[] | undefined;
        clientId?: string | undefined;
    };
    credentials?: {
        key: string;
        description: string;
    }[] | undefined;
    placement?: {
        in: "header" | "query" | "cli_arg";
        key: string;
        format?: string | undefined;
    } | undefined;
}, {
    description: string;
    scheme: "oauth2_service";
    oauth: {
        tokenEndpoint: string;
        scopes?: string[] | undefined;
        clientId?: string | undefined;
    };
    credentials?: {
        key: string;
        description: string;
    }[] | undefined;
    placement?: {
        in: "header" | "query" | "cli_arg";
        key: string;
        format?: string | undefined;
    } | undefined;
}>, z.ZodObject<{
    scheme: z.ZodLiteral<"mtls">;
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    description: string;
    scheme: "mtls";
}, {
    description: string;
    scheme: "mtls";
}>, z.ZodObject<{
    scheme: z.ZodLiteral<"custom">;
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    description: string;
    scheme: "custom";
}, {
    description: string;
    scheme: "custom";
}>]>;
export declare const executionConfigSchema: z.ZodType<ExecutionConfig>;
export declare const certificateConfigSchema: z.ZodOptional<z.ZodObject<{
    source: z.ZodEnum<["file", "enrollment"]>;
    enrollmentEndpoint: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, "strip", z.ZodTypeAny, {
    source: "file" | "enrollment";
    enrollmentEndpoint?: string | undefined;
}, {
    source: "file" | "enrollment";
    enrollmentEndpoint?: string | undefined;
}>>;
export declare const userConfigurableItemSchema: z.ZodObject<{
    key: z.ZodString;
    description: z.ZodString;
    type: z.ZodEnum<["string", "boolean", "integer"]>;
    defaultValue: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodBoolean, z.ZodNumber]>>;
    secret: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "string" | "boolean" | "integer";
    key: string;
    description: string;
    defaultValue?: string | number | boolean | undefined;
    secret?: boolean | undefined;
}, {
    type: "string" | "boolean" | "integer";
    key: string;
    description: string;
    defaultValue?: string | number | boolean | undefined;
    secret?: boolean | undefined;
}>;
export declare const requiredPathItemSchema: z.ZodObject<{
    key: z.ZodString;
    description: z.ZodString;
    type: z.ZodOptional<z.ZodEnum<["file", "directory"]>>;
}, "strip", z.ZodTypeAny, {
    key: string;
    description: string;
    type?: "file" | "directory" | undefined;
}, {
    key: string;
    description: string;
    type?: "file" | "directory" | undefined;
}>;
export declare const baseImplementationSchema: z.ZodObject<{
    name: z.ZodString;
    protocol: z.ZodString;
    type: z.ZodEnum<["remote", "local"]>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    status: z.ZodOptional<z.ZodEnum<["active", "deprecated"]>>;
    revocationURL: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    authentication: z.ZodDiscriminatedUnion<"scheme", [z.ZodObject<{
        scheme: z.ZodLiteral<"none">;
    }, "strip", z.ZodTypeAny, {
        scheme: "none";
    }, {
        scheme: "none";
    }>, z.ZodObject<{
        scheme: z.ZodLiteral<"pat">;
        description: z.ZodString;
        tokenUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        credentials: z.ZodOptional<z.ZodArray<z.ZodObject<{
            key: z.ZodString;
            description: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            key: string;
            description: string;
        }, {
            key: string;
            description: string;
        }>, "many">>;
        placement: z.ZodOptional<z.ZodObject<{
            in: z.ZodEnum<["header", "query", "cli_arg"]>;
            key: z.ZodString;
            format: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        }, {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        scheme: "pat";
        tokenUrl?: string | undefined;
        credentials?: {
            key: string;
            description: string;
        }[] | undefined;
        placement?: {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        } | undefined;
    }, {
        description: string;
        scheme: "pat";
        tokenUrl?: string | undefined;
        credentials?: {
            key: string;
            description: string;
        }[] | undefined;
        placement?: {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        } | undefined;
    }>, z.ZodObject<{
        scheme: z.ZodLiteral<"apikey">;
        description: z.ZodString;
        tokenUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        credentials: z.ZodOptional<z.ZodArray<z.ZodObject<{
            key: z.ZodString;
            description: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            key: string;
            description: string;
        }, {
            key: string;
            description: string;
        }>, "many">>;
        placement: z.ZodOptional<z.ZodObject<{
            in: z.ZodEnum<["header", "query", "cli_arg"]>;
            key: z.ZodString;
            format: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        }, {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        scheme: "apikey";
        tokenUrl?: string | undefined;
        credentials?: {
            key: string;
            description: string;
        }[] | undefined;
        placement?: {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        } | undefined;
    }, {
        description: string;
        scheme: "apikey";
        tokenUrl?: string | undefined;
        credentials?: {
            key: string;
            description: string;
        }[] | undefined;
        placement?: {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        } | undefined;
    }>, z.ZodObject<{
        scheme: z.ZodLiteral<"basic">;
        description: z.ZodString;
        credentials: z.ZodOptional<z.ZodArray<z.ZodObject<{
            key: z.ZodString;
            description: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            key: string;
            description: string;
        }, {
            key: string;
            description: string;
        }>, "many">>;
        placement: z.ZodOptional<z.ZodObject<{
            in: z.ZodEnum<["header", "query", "cli_arg"]>;
            key: z.ZodString;
            format: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        }, {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        scheme: "basic";
        credentials?: {
            key: string;
            description: string;
        }[] | undefined;
        placement?: {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        } | undefined;
    }, {
        description: string;
        scheme: "basic";
        credentials?: {
            key: string;
            description: string;
        }[] | undefined;
        placement?: {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        } | undefined;
    }>, z.ZodObject<{
        description: z.ZodString;
        credentials: z.ZodOptional<z.ZodArray<z.ZodObject<{
            key: z.ZodString;
            description: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            key: string;
            description: string;
        }, {
            key: string;
            description: string;
        }>, "many">>;
        placement: z.ZodOptional<z.ZodObject<{
            in: z.ZodEnum<["header", "query", "cli_arg"]>;
            key: z.ZodString;
            format: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        }, {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        }>>;
    } & {
        scheme: z.ZodLiteral<"oauth2_device">;
        oauth: z.ZodObject<{
            deviceAuthorizationEndpoint: z.ZodString;
            tokenEndpoint: z.ZodString;
            scopes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            clientId: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            deviceAuthorizationEndpoint: string;
            tokenEndpoint: string;
            scopes?: string[] | undefined;
            clientId?: string | undefined;
        }, {
            deviceAuthorizationEndpoint: string;
            tokenEndpoint: string;
            scopes?: string[] | undefined;
            clientId?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        scheme: "oauth2_device";
        oauth: {
            deviceAuthorizationEndpoint: string;
            tokenEndpoint: string;
            scopes?: string[] | undefined;
            clientId?: string | undefined;
        };
        credentials?: {
            key: string;
            description: string;
        }[] | undefined;
        placement?: {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        } | undefined;
    }, {
        description: string;
        scheme: "oauth2_device";
        oauth: {
            deviceAuthorizationEndpoint: string;
            tokenEndpoint: string;
            scopes?: string[] | undefined;
            clientId?: string | undefined;
        };
        credentials?: {
            key: string;
            description: string;
        }[] | undefined;
        placement?: {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        } | undefined;
    }>, z.ZodObject<{
        description: z.ZodString;
        credentials: z.ZodOptional<z.ZodArray<z.ZodObject<{
            key: z.ZodString;
            description: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            key: string;
            description: string;
        }, {
            key: string;
            description: string;
        }>, "many">>;
        placement: z.ZodOptional<z.ZodObject<{
            in: z.ZodEnum<["header", "query", "cli_arg"]>;
            key: z.ZodString;
            format: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        }, {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        }>>;
    } & {
        scheme: z.ZodLiteral<"oauth2_code">;
        oauth: z.ZodObject<{
            authorizationEndpoint: z.ZodString;
            tokenEndpoint: z.ZodString;
            scopes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            clientId: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            tokenEndpoint: string;
            authorizationEndpoint: string;
            scopes?: string[] | undefined;
            clientId?: string | undefined;
        }, {
            tokenEndpoint: string;
            authorizationEndpoint: string;
            scopes?: string[] | undefined;
            clientId?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        scheme: "oauth2_code";
        oauth: {
            tokenEndpoint: string;
            authorizationEndpoint: string;
            scopes?: string[] | undefined;
            clientId?: string | undefined;
        };
        credentials?: {
            key: string;
            description: string;
        }[] | undefined;
        placement?: {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        } | undefined;
    }, {
        description: string;
        scheme: "oauth2_code";
        oauth: {
            tokenEndpoint: string;
            authorizationEndpoint: string;
            scopes?: string[] | undefined;
            clientId?: string | undefined;
        };
        credentials?: {
            key: string;
            description: string;
        }[] | undefined;
        placement?: {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        } | undefined;
    }>, z.ZodObject<{
        description: z.ZodString;
        credentials: z.ZodOptional<z.ZodArray<z.ZodObject<{
            key: z.ZodString;
            description: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            key: string;
            description: string;
        }, {
            key: string;
            description: string;
        }>, "many">>;
        placement: z.ZodOptional<z.ZodObject<{
            in: z.ZodEnum<["header", "query", "cli_arg"]>;
            key: z.ZodString;
            format: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        }, {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        }>>;
    } & {
        scheme: z.ZodLiteral<"oauth2_service">;
        oauth: z.ZodObject<{
            tokenEndpoint: z.ZodString;
            scopes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            clientId: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            tokenEndpoint: string;
            scopes?: string[] | undefined;
            clientId?: string | undefined;
        }, {
            tokenEndpoint: string;
            scopes?: string[] | undefined;
            clientId?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        scheme: "oauth2_service";
        oauth: {
            tokenEndpoint: string;
            scopes?: string[] | undefined;
            clientId?: string | undefined;
        };
        credentials?: {
            key: string;
            description: string;
        }[] | undefined;
        placement?: {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        } | undefined;
    }, {
        description: string;
        scheme: "oauth2_service";
        oauth: {
            tokenEndpoint: string;
            scopes?: string[] | undefined;
            clientId?: string | undefined;
        };
        credentials?: {
            key: string;
            description: string;
        }[] | undefined;
        placement?: {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        } | undefined;
    }>, z.ZodObject<{
        scheme: z.ZodLiteral<"mtls">;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        description: string;
        scheme: "mtls";
    }, {
        description: string;
        scheme: "mtls";
    }>, z.ZodObject<{
        scheme: z.ZodLiteral<"custom">;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        description: string;
        scheme: "custom";
    }, {
        description: string;
        scheme: "custom";
    }>]>;
    certificate: z.ZodOptional<z.ZodObject<{
        source: z.ZodEnum<["file", "enrollment"]>;
        enrollmentEndpoint: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    }, "strip", z.ZodTypeAny, {
        source: "file" | "enrollment";
        enrollmentEndpoint?: string | undefined;
    }, {
        source: "file" | "enrollment";
        enrollmentEndpoint?: string | undefined;
    }>>;
    configuration: z.ZodOptional<z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        description: z.ZodString;
        type: z.ZodEnum<["string", "boolean", "integer"]>;
        defaultValue: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodBoolean, z.ZodNumber]>>;
        secret: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        type: "string" | "boolean" | "integer";
        key: string;
        description: string;
        defaultValue?: string | number | boolean | undefined;
        secret?: boolean | undefined;
    }, {
        type: "string" | "boolean" | "integer";
        key: string;
        description: string;
        defaultValue?: string | number | boolean | undefined;
        secret?: boolean | undefined;
    }>, "many">>;
    requiredPaths: z.ZodOptional<z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        description: z.ZodString;
        type: z.ZodOptional<z.ZodEnum<["file", "directory"]>>;
    }, "strip", z.ZodTypeAny, {
        key: string;
        description: string;
        type?: "file" | "directory" | undefined;
    }, {
        key: string;
        description: string;
        type?: "file" | "directory" | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    type: "remote" | "local";
    name: string;
    protocol: string;
    authentication: {
        scheme: "none";
    } | {
        description: string;
        scheme: "pat";
        tokenUrl?: string | undefined;
        credentials?: {
            key: string;
            description: string;
        }[] | undefined;
        placement?: {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        } | undefined;
    } | {
        description: string;
        scheme: "apikey";
        tokenUrl?: string | undefined;
        credentials?: {
            key: string;
            description: string;
        }[] | undefined;
        placement?: {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        } | undefined;
    } | {
        description: string;
        scheme: "basic";
        credentials?: {
            key: string;
            description: string;
        }[] | undefined;
        placement?: {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        } | undefined;
    } | {
        description: string;
        scheme: "oauth2_device";
        oauth: {
            deviceAuthorizationEndpoint: string;
            tokenEndpoint: string;
            scopes?: string[] | undefined;
            clientId?: string | undefined;
        };
        credentials?: {
            key: string;
            description: string;
        }[] | undefined;
        placement?: {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        } | undefined;
    } | {
        description: string;
        scheme: "oauth2_code";
        oauth: {
            tokenEndpoint: string;
            authorizationEndpoint: string;
            scopes?: string[] | undefined;
            clientId?: string | undefined;
        };
        credentials?: {
            key: string;
            description: string;
        }[] | undefined;
        placement?: {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        } | undefined;
    } | {
        description: string;
        scheme: "oauth2_service";
        oauth: {
            tokenEndpoint: string;
            scopes?: string[] | undefined;
            clientId?: string | undefined;
        };
        credentials?: {
            key: string;
            description: string;
        }[] | undefined;
        placement?: {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        } | undefined;
    } | {
        description: string;
        scheme: "mtls";
    } | {
        description: string;
        scheme: "custom";
    };
    status?: "active" | "deprecated" | undefined;
    tags?: string[] | undefined;
    revocationURL?: string | undefined;
    certificate?: {
        source: "file" | "enrollment";
        enrollmentEndpoint?: string | undefined;
    } | undefined;
    requiredPaths?: {
        key: string;
        description: string;
        type?: "file" | "directory" | undefined;
    }[] | undefined;
    configuration?: {
        type: "string" | "boolean" | "integer";
        key: string;
        description: string;
        defaultValue?: string | number | boolean | undefined;
        secret?: boolean | undefined;
    }[] | undefined;
}, {
    type: "remote" | "local";
    name: string;
    protocol: string;
    authentication: {
        scheme: "none";
    } | {
        description: string;
        scheme: "pat";
        tokenUrl?: string | undefined;
        credentials?: {
            key: string;
            description: string;
        }[] | undefined;
        placement?: {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        } | undefined;
    } | {
        description: string;
        scheme: "apikey";
        tokenUrl?: string | undefined;
        credentials?: {
            key: string;
            description: string;
        }[] | undefined;
        placement?: {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        } | undefined;
    } | {
        description: string;
        scheme: "basic";
        credentials?: {
            key: string;
            description: string;
        }[] | undefined;
        placement?: {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        } | undefined;
    } | {
        description: string;
        scheme: "oauth2_device";
        oauth: {
            deviceAuthorizationEndpoint: string;
            tokenEndpoint: string;
            scopes?: string[] | undefined;
            clientId?: string | undefined;
        };
        credentials?: {
            key: string;
            description: string;
        }[] | undefined;
        placement?: {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        } | undefined;
    } | {
        description: string;
        scheme: "oauth2_code";
        oauth: {
            tokenEndpoint: string;
            authorizationEndpoint: string;
            scopes?: string[] | undefined;
            clientId?: string | undefined;
        };
        credentials?: {
            key: string;
            description: string;
        }[] | undefined;
        placement?: {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        } | undefined;
    } | {
        description: string;
        scheme: "oauth2_service";
        oauth: {
            tokenEndpoint: string;
            scopes?: string[] | undefined;
            clientId?: string | undefined;
        };
        credentials?: {
            key: string;
            description: string;
        }[] | undefined;
        placement?: {
            in: "header" | "query" | "cli_arg";
            key: string;
            format?: string | undefined;
        } | undefined;
    } | {
        description: string;
        scheme: "mtls";
    } | {
        description: string;
        scheme: "custom";
    };
    status?: "active" | "deprecated" | undefined;
    tags?: string[] | undefined;
    revocationURL?: string | undefined;
    certificate?: {
        source: "file" | "enrollment";
        enrollmentEndpoint?: string | undefined;
    } | undefined;
    requiredPaths?: {
        key: string;
        description: string;
        type?: "file" | "directory" | undefined;
    }[] | undefined;
    configuration?: {
        type: "string" | "boolean" | "integer";
        key: string;
        description: string;
        defaultValue?: string | number | boolean | undefined;
        secret?: boolean | undefined;
    }[] | undefined;
}>;
export declare const implementationConfigSchema: z.ZodType<ImplementationConfig>;
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
        revocationURL?: string | undefined;
        contentVersion?: string | undefined;
        documentation?: string | undefined;
    }, {
        revocationURL?: string | undefined;
        contentVersion?: string | undefined;
        documentation?: string | undefined;
    }>>;
    implementations: z.ZodArray<z.ZodType<ImplementationConfig, z.ZodTypeDef, ImplementationConfig>, "many">;
    signature: z.ZodOptional<z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    schemaVersion: "1";
    serviceName: string;
    domain: string;
    implementations: ImplementationConfig[];
    env?: string | undefined;
    metadata?: {
        revocationURL?: string | undefined;
        contentVersion?: string | undefined;
        documentation?: string | undefined;
    } | undefined;
    signature?: unknown;
}, {
    schemaVersion: "1";
    serviceName: string;
    domain: string;
    implementations: ImplementationConfig[];
    env?: string | undefined;
    metadata?: {
        revocationURL?: string | undefined;
        contentVersion?: string | undefined;
        documentation?: string | undefined;
    } | undefined;
    signature?: unknown;
}>;
export declare const aidManifestSchema: z.ZodObject<Omit<{
    schemaVersion: z.ZodLiteral<"1">;
    serviceName: z.ZodString;
    domain: z.ZodString;
    env: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodObject<{
        contentVersion: z.ZodOptional<z.ZodString>;
        documentation: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        revocationURL: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    }, "strip", z.ZodTypeAny, {
        revocationURL?: string | undefined;
        contentVersion?: string | undefined;
        documentation?: string | undefined;
    }, {
        revocationURL?: string | undefined;
        contentVersion?: string | undefined;
        documentation?: string | undefined;
    }>>;
    implementations: z.ZodArray<z.ZodType<ImplementationConfig, z.ZodTypeDef, ImplementationConfig>, "many">;
    signature: z.ZodOptional<z.ZodUnknown>;
}, "serviceName" | "domain" | "env"> & {
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    schemaVersion: "1";
    implementations: ImplementationConfig[];
    metadata?: {
        revocationURL?: string | undefined;
        contentVersion?: string | undefined;
        documentation?: string | undefined;
    } | undefined;
    signature?: unknown;
}, {
    name: string;
    schemaVersion: "1";
    implementations: ImplementationConfig[];
    metadata?: {
        revocationURL?: string | undefined;
        contentVersion?: string | undefined;
        documentation?: string | undefined;
    } | undefined;
    signature?: unknown;
}>;
