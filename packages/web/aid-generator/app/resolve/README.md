# AID Resolver Playground: Reference Implementation

This directory contains a complete, best-practices reference implementation for an **Agent Interface Discovery (AID) Client**. It is built on top of the canonical `@aid/core` library to provide a polished, interactive, and developer-friendly UI for exploring AID-enabled domains.

## Architecture

The implementation is broken into two key parts: the **core resolver engine** (which lives in `@aid/core`) and a suite of **React UI components** in this directory that render the resolution process.

### 1. The Core Resolver Engine (`@aid/core/resolver.ts`)

This is the heart of any AID client. It's a framework-agnostic module that could be used in any TypeScript environment.

-   **`resolveDomain(domain, options)`**: An `async generator` that yields each step of the discovery process (`dns_query`, `manifest_fetch`, etc.). For use in a browser environment, you **must** provide a `manifestProxy` in the `options` object. This is a URL to a server-side proxy that bypasses CORS restrictions when fetching the `aid.json` manifest. The proxy should accept a `url` query parameter. Example: `resolveDomain("example.com", { manifestProxy: "/api/proxy" })`.
-   **`ActionableImplementation` Interface**: A critical bridge that translates the raw `aid.json` manifest into a simplified, developer-friendly "to-do list" for a client application.
-   **`getImplementations(manifest)`**: A function that transforms a valid manifest into an array of `ActionableImplementation` objects.

### 2. The React UI (`page.tsx` & Components)

The UI is designed to be a highly interactive and clear representation of the data provided by the core resolver engine. It calls `resolveDomain` and consumes the stream of events to render a conversational history of the process and a detailed, multi-format final profile.

-   **`page.tsx`**: The main page orchestrates the UI. It manages state, calls the `resolveDomain` generator, and dynamically builds a chat history by rendering a new `ChatMessage` for each step yielded by the resolver.
-   **`ChatMessage.tsx`**: A flexible component that can render either simple markdown strings or complex React components (like a `Codeblock`), allowing for a rich, mixed-media chat log.
-   **`Codeblock.tsx`**: A dedicated component for displaying formatted code, TXT records, or JSON. It includes a header and a one-click copy button.
-   **`ActionableProfile.tsx`**: This component acts as a container for the final results. It uses a `ViewToggle` to allow the user to switch between a user-friendly "Preview" and the raw `aid.json` manifest.
-   **`ImplementationCard.tsx`**: In "Preview" mode, one of these cards is rendered for each implementation found. It clearly displays the execution command/URI, authentication details, and any required configuration or paths in a structured, easy-to-digest format.

**Note on Example Domains (Local vs. Production):**

This resolver is a reference implementation designed to perform live, spec-compliant discovery for any public domain.

-   **For any external domain you provide (e.g., `your-domain.com`)**, the resolver will perform a live DNS lookup and manifest fetch via the `/api/proxy`. This works in all environments.

-   **For the included example domains (e.g., `simple.aid.agentcommunity.org`)**, the behavior differs by environment:
    -   **Local Development:** To enable UI testing without live DNS, the `/api/proxy` route intercepts requests for these specific domains and serves their configuration from local files in `/public/samples`.
    -   **Production (Vercel):** On the deployed Vercel site, the resolver will attempt a live fetch for the example domains. **This is expected to fail.** This happens because a Vercel serverless function cannot `fetch` a URL that resolves back to the same project (a "hairpinning" limitation). This is a known issue demonstrating a common platform constraint. The primary purpose—resolving external domains—remains fully functional.

## Implementation Guide for Your Own Client

To build your own AID client, you should depend directly on the `@aid/core` package.

1.  **Use the Resolver Engine**: Import and use `resolveDomain` from `@aid/core/resolver` to handle the discovery logic.
2.  **Render the Process**: Iterate through the yielded steps from `resolveDomain` to provide real-time feedback to the user.
3.  **Get the Actionable Profile**: On a `validation_success` or `actionable_profile` step, use `getImplementations` to generate an `ActionableImplementation[]` array.
4.  **Build Your UI Dynamically**: Loop through the `ActionableImplementation[]` array and inspect its properties (`type`, `execution`, `auth`, `requiredConfig`) to dynamically render the appropriate UI controls for the user. This reference implementation provides a robust example (`ImplementationCard.tsx`) of how to accomplish this. 