# AID Monorepo Sunsetting & Archival Plan

This document outlines the step-by-step process for gracefully freezing the Agent Interface Discovery (AID) monorepo. The project is being deprecated in favor of a simpler, DNS-first specification located in a new repository.

The goal is to transition this repository into a read-only, informative archive that preserves the research and development efforts while clearly directing all users to the new, official v1 standard.

---

## Phase 1: Freeze Development & Communicate Deprecation

This phase marks the end of active development and communicates the change in status across the project's key documentation and UIs. This will be done in a single PR.

**Tasks:**

1.  **Create a `deprecate-project` branch** from the latest `main`.

2.  **Add Web UI Deprecation Banner**:
    *   **Action**: Add a prominent, non-dismissible banner to the top of the web application in `packages/aid-web/app/layout.tsx`.
    *   **Banner Content**: "This project is deprecated and has been archived. The official AID v1 specification has moved to a new, simpler standard. Visit [aid.agentcommunity.org](https://aid.agentcommunity.org) for the latest version."
    *   **Styling**: The banner should be clearly visible (e.g., a yellow or gray background) but not disruptive to the existing UI.

3.  **Update Root `README.md`**:
    *   Add a prominent **DEPRECATION NOTICE** at the very top of the root `README.md`.
    *   **Content for the notice:**
        > **DEPRECATION NOTICE**
        >
        > This repository and all associated packages are deprecated and no longer maintained. This project served as the initial research and development phase for the Agent Interface Discovery (AID) specification.
        >
        > The official v1 standard is now a simpler, DNS-based protocol. All new development has moved to the new repository.
        >
        > **Please migrate to the new official resources:**
        > *   **New Repository:** [https://github.com/agentcommunity/agent-interface-discovery](https://github.com/agentcommunity/agent-interface-discovery)
        > *   **NPM Package:** `@agentcommunity/aid`

4.  **Update Specification Docs**:
    *   Prepend the same deprecation notice to the top of `docs/aid/v1/specification.md`.

5.  **Update Package READMEs**:
    *   For each public package, prepend a similar deprecation notice to its `README.md` file.
    *   **Target Packages**: `aid-core`, `aid-conformance`, `aid-schema`, `aid-core-py`, `aid-core-go`, `aid-web`.

6.  **Archive the Roadmap**:
    *   Add a notice at the top of `TODO.md` stating that the roadmap is now obsolete.

---

## Phase 2: Final Release & Package Deprecation

This phase involves publishing the final versions of all packages with the deprecation notices and then officially marking them as deprecated on their respective registries.

**Tasks:**

1.  **Create and Merge the Deprecation PR**:
    *   Open a Pull Request with all changes from Phase 1.
    *   Title: `feat: Deprecate project and all packages`.
    *   After review, merge it into `main`.

2.  **Trigger the Final NPM Release**:
    *   Run `pnpm changeset add` to create a final changeset.
    *   The existing `release.yml` workflow will create a "Version Packages" PR. Merge it to tag a final release.
    *   The `publish.yml` workflow will automatically publish the final versions of the NPM packages.

3.  **Mark NPM Packages as Deprecated**:
    *   Immediately after publishing, run the `npm deprecate` command for each package (`@agentcommunity/aid-core`, `@agentcommunity/aid-conformance`, `@agentcommunity/aid-schema`) with the appropriate message.

4.  **Handle Language-Specific Packages**:
    *   **Python**: No action needed for PyPI as the package was never published.
    *   **Go**: Add a `retract` directive to `packages/aid-core-go/go.mod` to indicate that all previous versions should not be used. Commit this change and push it to `main`.

5.  **Lock the `main` Branch**:
    *   **Action**: In the repository settings under `Branches` -> `Branch protection rules`, add a rule for `main`.
    *   **Settings**: Enable "Lock branch". This makes the branch read-only for everyone, including administrators, guaranteeing its immutability.

---

## Phase 3: Preserve Resolver & Example Infrastructure

This phase ensures the Vercel-hosted examples and `_agent` TXT record resolutions remain functional as a live archive.

**Goal**: The example domains (e.g., `simple.agentcommunity.org`) must continue to resolve correctly via the `vercel.json` rewrite rules.

**Tasks:**

1.  **Vercel Project Configuration**:
    *   The Vercel project for this repository will be repurposed as the legacy archive host (e.g., `aid-legacy.agentcommunity.org`).
    *   **Crucially, all existing example domains (`agentcommunity.org`, `supabase.agentdomain.xyz`, etc.) must remain assigned to this single Vercel project.** The `has` conditions in `packages/examples/vercel.json` rely on the host header to function correctly.

2.  **DNS `TXT` Record Integrity**:
    *   The `_agent` TXT records for the example domains **must not be changed**. They must continue to point to the `config` URLs served by this legacy Vercel project.

3.  **Deployment Immutability**:
    *   After merging the final deprecation PR, the Vercel project's "Production Branch" setting **must be locked to the final commit hash on the `main` branch**. This freezes the live examples in their final state and prevents accidental builds from breaking the archive.

4.  **Domain Handover**:
    *   **Action**: On the day of the new v1.0.0 launch, the `aid.agentcommunity.org` domain will be **removed** from this Vercel project and **assigned** to the new Vercel project connected to the new repository.
    *   **Action**: The primary domain for this legacy project will be set to `aid-legacy.agentcommunity.org`.

---

## Phase 4: Repository Archival

The final step is to make the repository read-only and update its metadata on GitHub.

**Tasks:**

1.  **Archive the Repository**:
    *   In the GitHub repository settings, under the "Danger Zone", click "Archive this repository".

2.  **Update Repository Details**:
    *   Change the repository description to start with `[ARCHIVED]`.
    *   Update the repository's website link to point to the new repository/documentation site.

3.  **Disable GitHub Actions**:
    *   **Action**: In the repository settings under `Actions` -> `General`, disable all actions for this repository. This prevents any stray triggers from running and wasting resources.

4.  **Clear Repository Topics**:
    *   **Action**: Review the repository "Topics" on the main page and remove any that might imply it's an active project (e.g., `production-ready`). Add `archived`, `legacy`, `deprecated`.
