# AID Specification Update Proposals (v1)

This document outlines proposed changes to the v1 Agent Interface Discovery specification to enhance clarity and practicality.

---

### 1. Formalize `clientId` in OAuth Configuration

**Rationale:**

The `clientId` is a fundamental component of most OAuth 2.0 flows, including `oauth2_device` and `oauth2_code`. While clients can sometimes proceed without it, many identity providers require it. Its omission from the spec was an oversight that hinders practical implementation. This change formalizes its inclusion.

**Proposed Change:**

Update the **OAuth Object Schema (`oauth`)** table to include `clientId`.

**New Schema Definition:**

| Field | Type | Required? | Description |
| --- | --- | --- | --- |
| **`authorizationEndpoint`** | String | For `oauth2_code` | The URL for the authorization code grant flow. |
| **`deviceAuthorizationEndpoint`** | String | For `oauth2_device` | The URL for the device authorization flow. |
| **`tokenEndpoint`** | String | Yes | The URL to exchange a code or credentials for an access token. |
| **`scopes`** | Array of Strings | No | An optional list of required OAuth scopes. |
| **`clientId`** | String | No | The public identifier for the client application, if required by the provider. |

---

### 2. Simplify `platformOverrides`

**Rationale:**

The initial specification was ambiguous, listing `platformOverrides` in two different locations (`Implementation` and `Execution` objects). This creates confusion. For v1, we will simplify this to cover the most common use case: specifying different commands for different operating systems. This simplifies the spec and implementation, while leaving room to introduce more complex architecture-based overrides in a future version.

**Proposed Change:**

1.  **Remove** the `platformOverrides` field from the top-level **Implementation Object Schema**.
2.  Clarify the purpose of the `platformOverrides` field within the **Execution Object Schema** to be OS-specific.

**Updated Implementation Object Schema (remove row):**

| Field | Type | Required? | Description |
| --- | --- | --- | --- |
| ... | ... | ... | ... |
| `revocationURL` | String | No | Overrides global `revocationURL` for this implementation only. |
| ~~`platformOverrides`~~ | ~~Object~~ | ~~No~~ | ~~Keys MAY include arch-specific labels...~~ |
| `certificate` | Object | If `authentication.scheme` = `mtls` | `{ "source":"file"\|"enrollment", ... }` |


**Updated Execution Object Schema (clarify description and keys):**

| Field | Type | Required? | Description |
| --- | --- | --- | --- |
| **`command`** | String | Yes | The executable to run. Ex: `"docker"`. |
| **`args`** | Array of Strings | Yes | An array of arguments passed to the command. Supports variable substitution. |
| **`platformOverrides`**| Object | No | An object to specify a different `command` or `args` based on client OS. Valid keys are `"windows"`, `"linux"`, and `"macos"`. |

--- 