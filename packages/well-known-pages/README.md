# Well Known Pages

This package hosts `aid.txt` and `.well-known/aid.json` files for various services. It's designed to be deployed to Vercel and uses hostname-based routing to serve the correct files for each service's subdomain.

## Deployment to Vercel

1.  **Create a new Vercel Project:**
    - Go to your Vercel dashboard and create a new project.
    - Connect your Git repository.
    - When prompted for the **Root Directory**, select `packages/well-known-pages`. Vercel should detect that there is no framework and that it should use the `public` directory.

2.  **Configure Domains:**
    - In your Vercel project's settings, go to the "Domains" section.
    - Add the subdomains for each service you want to host. For the existing configuration, you would add:
      - `auth0.agentdomain.xyz`
      - `supabase.agentdomain.xyz`
    - **Important:** Make sure to replace `agentdomain.xyz` with your actual domain name in `packages/well-known-pages/vercel.json` if it's different.

3.  **Configure DNS:**
    - Follow Vercel's instructions to configure the DNS records for your domains. You'll need to add `CNAME` or `A` records pointing to Vercel.
    - You will also need to set up the `TXT` record for `_agent` on each subdomain, as defined in the respective `aid.txt` files. For example, for `auth0`, you'll need a `TXT` record for `_agent.auth0` on your domain `agentdomain.xyz`. The content of the `aid.txt` files shows what the record should look like.

## How it Works

The `vercel.json` in this package contains a rewrite rule that uses the subdomain of the incoming request to find the correct files in the `public` directory.

For example, a request to `https://auth0.agentdomain.xyz/aid.txt` is internally rewritten to `/auth0/aid.txt`, which serves `public/auth0/aid.txt`.

## Adding a New Service

To add a new service (e.g., `new-service`):

1.  Create a new directory inside `public`: `public/new-service`.
2.  Add your `aid.txt` file to `public/new-service/aid.txt`.
3.  Add your `aid.json` file to `public/new-service/.well-known/aid.json`.
4.  Add the new subdomain `new-service.agentdomain.xyz` to your Vercel project's domains.
5.  Update your DNS provider with the `_agent` TXT record for the new service.

No changes are needed in `vercel.json` as it's configured to handle new subdomains automatically.

## Workspace Configuration

Remember to add this new package to your `pnpm-workspace.yaml` file:

```yaml
packages:
  - 'packages/*'
  # ... any other package globs
```

If your `pnpm-workspace.yaml` already contains `'packages/*'`, you don't need to change anything. 