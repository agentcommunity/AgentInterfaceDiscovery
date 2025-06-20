# AID Resolver Playground: Reference Implementation

This directory contains a complete, best-practices reference implementation for an **Agent Interface Discovery (AID) Client**. Its purpose is to serve as a practical, open-source guide for developers who want to build applications that can dynamically discover and interact with agent services based on the AID specification.

## High-Level Goal

The resolver playground is a web-based tool that takes a domain name (e.g., `auth0.agentcommunity.org`) and performs the full AID discovery process in real-time. It visualizes each step, from the initial DNS query to fetching and validating the `aid.json` manifest.

The final output is a user-friendly, "actionable profile" that not only displays the raw information from the manifest but also renders interactive UI components based on the manifest's contents. For example, it will show password inputs for `pat` authentication, list OAuth scopes, and provide form fields for any user-configurable variables.

---

## How It Works

The implementation is broken into two key parts: the **resolver engine** (`lib/resolver.ts`) and the **React UI components** (`components/resolver/` and `app/resolve/page.tsx`).

### 1. The Resolver Engine (`lib/resolver.ts`)

This is the core of the client. It's a framework-agnostic module that could be used in any TypeScript environment (web, Node.js, etc.).

-   **`resolveDomain(domain)`**: This is an `async generator` function that yields each step of the discovery process. Using a generator is ideal for streaming results to a UI in real-time. It yields objects of type `ResolutionStep`, which represent events like `dns_query`, `manifest_fetch`, and `validation_success`.

-   **`ActionableImplementation` Interface**: This is the most critical interface in the engine. It acts as a bridge, translating the raw, sometimes complex, `aid.json` manifest into a simplified, developer-friendly "to-do list" for a client application. It flattens the manifest's structure, making it trivial to see what is required for each implementation (e.g., what secrets are needed, what command to run, what URI to call).

-   **`getImplementations(manifest)`**: This function takes a valid manifest and transforms its `implementations` array into an array of `ActionableImplementation` objects.

### 2. The React UI (`page.tsx` & Components)

The UI is built to be a direct reflection of the data provided by the resolver engine.

-   **`page.tsx`**: This is the main container component. It manages the application state (`chatHistory`, `isStreaming`, `finalImplementations`, etc.) and orchestrates the child components. It calls `resolveDomain` and consumes the stream of `ResolutionStep` events to update the chat history. Once a final profile is resolved, it passes the `ActionableImplementation[]` array to the `ActionableProfile` component.

-   **`ActionableProfile.tsx`**: This is the centerpiece of the UI. It receives the `ActionableImplementation[]` array and is responsible for rendering the rich, dynamic interface. **It contains the client-side logic that interprets the `ActionableImplementation` object.**

---

## Implementation Guide for Your Own Client

To build your own AID client, you can follow the pattern established here.

1.  **Use the Resolver Engine**: Import and use `resolveDomain` from `lib/resolver.ts` to handle the discovery logic.

2.  **Consume the Stream**: Await each `ResolutionStep` from the `resolveDomain` generator to get real-time feedback.

3.  **Get the Actionable Profile**: On a `validation_success` or `actionable_profile` step, use the resulting data to generate an `ActionableImplementation[]` array.

4.  **Build Your UI Dynamically**: Loop through the `ActionableImplementation[]` array. For each `impl` in the array, inspect its properties to decide what UI to render. This is the core logic:

    ```typescript
    // Pseudocode for your UI component
    
    function renderImplementations(implementations: ActionableImplementation[]) {
      for (const impl of implementations) {
        // Render a card or section for the implementation
        renderTitle(impl.name);
        renderExecutionDetails(impl.type, impl.execution);
    
        // Display tags
        if (impl.tags) {
          renderTags(impl.tags);
        }

        // Dynamically render auth UI
        const authScheme = impl.auth.scheme;
        if (authScheme === 'pat' || authScheme === 'apikey') {
          // Show a text input for the token.
          // Use `impl.auth.description` as the label.
          renderSecretInput(impl.auth.description);
        } else if (authScheme === 'oauth2_device') {
          // Display the endpoints and scopes.
          renderOAuthDetails(impl.auth.oauth);
        } // ... and so on for other schemes
    
        // Render configuration inputs
        if (impl.requiredConfig) {
          for (const configVar of impl.requiredConfig) {
            // If configVar.type is 'boolean', show a checkbox.
            // If it's 'string', show a text input.
            renderConfigInput(configVar);
          }
        }
      }
    }
    ```

### Reference Example

This directory serves as a live, working example of these principles. By examining how `page.tsx` uses `ActionableProfile.tsx`, and how `ActionableProfile.tsx` in turn uses the `ActionableImplementation` object, you can see a clear, practical model for building a robust AID-compatible client. 