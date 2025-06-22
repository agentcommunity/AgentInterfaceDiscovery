# AID Resolver Playground: Reference Implementation

This directory contains a complete, best-practices reference implementation for an **Agent Interface Discovery (AID) Client**. It is built on top of the canonical `@aid/core` library.

## Architecture

The implementation is broken into two key parts: the **core resolver engine** (which lives in `@aid/core`) and the **React UI components** in this directory (`components/resolver/` and `app/resolve/page.tsx`).

The `lib/resolver.ts` and `lib/generator.ts` files in this application are now simple pass-throughs, re-exporting the canonical functions from `@aid/core/browser`. This ensures the UI is always using the spec-compliant, authoritative logic.

### 1. The Core Resolver Engine (`@aid/core/resolver.ts`)

This is the heart of any AID client. It's a framework-agnostic module that could be used in any TypeScript environment.

-   **`resolveDomain(domain, options)`**: An `async generator` that yields each step of the discovery process (`dns_query`, `manifest_fetch`, etc.). For use in a browser environment, you **must** provide a `manifestProxy` in the `options` object. This is a URL to a server-side proxy that bypasses CORS restrictions when fetching the `aid.json` manifest. The proxy should accept a `url` query parameter. Example: `resolveDomain("example.com", { manifestProxy: "/api/proxy" })`.
-   **`ActionableImplementation` Interface**: A critical bridge that translates the raw `aid.json` manifest into a simplified, developer-friendly "to-do list" for a client application.
-   **`getImplementations(manifest)`**: A function that transforms a valid manifest into an array of `ActionableImplementation` objects.

### 2. The React UI (`page.tsx` & Components)

The UI is built to be a direct reflection of the data provided by the core resolver engine. It calls `resolveDomain` (imported via the local `lib` file, which re-exports from `@aid/core`) and consumes the stream of events to render the chat history and the final `ActionableProfile`.

## Implementation Guide for Your Own Client

To build your own AID client, you should depend directly on the `@aid/core` package.

1.  **Use the Resolver Engine**: Import and use `resolveDomain` from `@aid/core/resolver` to handle the discovery logic.
2.  **Get the Actionable Profile**: On a `validation_success` step, use `getImplementations` to generate an `ActionableImplementation[]` array.
3.  **Build Your UI Dynamically**: Loop through the `ActionableImplementation[]` array and inspect its properties (`type`, `execution`, `auth`, `requiredConfig`) to dynamically render the appropriate UI controls for the user.

This directory serves as a live, working example of these principles. 