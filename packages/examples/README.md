# AID Reference Examples & Hosting

This directory contains canonical examples of `AidGeneratorConfig` files and serves as a standalone Vercel project for hosting their generated `aid.json` manifests.

Each subdirectory represents a distinct AID profile. The `aid.json` and `aid.txt` artifacts within them are **generated automatically** from a `config.json` file.

## Hosting Architecture

This directory is designed as a single Vercel project that serves multiple `*.aid.agentcommunity.org` subdomains. This is achieved without any application code, relying instead on Vercel's routing rules.

The `vercel.json` file in this directory contains `rewrite` rules that inspect the `Host` header of an incoming request and serve the appropriate `aid.json` file from the corresponding example's `public` directory.

## Generating Artifacts

To regenerate all `aid.json` and `aid.txt` files after changing a `config.json` or updating the core generator, run the following command from the root of the monorepo:

```bash
pnpm --filter @aid/core build:examples
```

This command executes the `packages/core/scripts/build-examples.ts` script, which finds and processes all `config.json` files, ensuring all examples are up-to-date.

## Deployment and Adding New Examples

Follow these steps to deploy the project and add new examples in the future.

### Step 1: Deploy to Vercel

1.  Create a new project in your Vercel dashboard.
2.  Connect it to your forked Git repository.
3.  During setup, set the **Root Directory** to `packages/examples`. Vercel will automatically detect the `vercel.json` and `package.json` and configure the project accordingly.
4.  Deploy the project.

### Step 2: Configure Domains

1.  In the Vercel project's settings, go to the **Domains** tab.
2.  Add the custom domains for each example you want to host (e.g., `simple.aid.agentcommunity.org`, `auth0.aid.agentcommunity.org`, etc.).
3.  Follow the instructions to configure the necessary DNS records with your domain registrar.

### Step 3: Adding a New Example

Adding a new example is simple:

1.  **Create a New Directory**: Add a new directory inside `packages/examples` (e.g., `new-example`).
2.  **Add Configuration**: Create a `config.json` file inside the new directory with the profile's configuration.
3.  **Run the Generator**: From the monorepo root, run `pnpm --filter @aid/core build:examples`. This will create the `public/.well-known/aid.json` and `aid.txt` files for your new example.
4.  **Update Routing**: Add a new rewrite rule to the `packages/examples/vercel.json` file. Copy an existing rule and update the `host` value and `destination` path for your new example.
5.  **Add the Domain**: Add the new subdomain (e.g., `new-example.aid.agentcommunity.org`) to your Vercel project's domain list and configure its DNS.
6.  **Commit and Push**: Commit the new files (`config.json`, the generated artifacts, and the updated `vercel.json`) and push them to your repository. Vercel will automatically deploy the changes. 