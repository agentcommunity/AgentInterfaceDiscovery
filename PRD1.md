# PRD 1 - AID Generator Web UI + Public API (Deep Dive)

### Objective

Ship a browser-based generator that lets any dev turn an **AidGeneratorConfig** JSON into a validated `aid.json` manifest and `aid.txt` DNS snippet in under a minute. The tool wraps the existing **types.ts** model and **generator.ts** functions.

---

## 1. Key personas

* **Agent integrator**: Front-end or back-end dev who wants to publish an AID record for a service. Minimal CLI or DNS knowledge.
* **Spec reviewer**: Needs a quick visual diff between config and output for docs or audits.

---

## 2. Core user stories

1. Paste or drop a JSON config, click *Generate*, and instantly download both files.
2. See inline validation errors while typing, with hover help for every field.
3. Select enum values from drop-downs instead of free text.
4. Copy a ready-made `dig` command or `curl` example.
5. Call a simple REST endpoint in CI to produce the same outputs.

---

## 3. Functional scope

### 3.1 Form wizard

Four collapsible sections that mirror **AidGeneratorConfig**:

| Section         | Fields                                                    | UI widgets (shadcn)                                     |
| --------------- | --------------------------------------------------------- | ------------------------------------------------------- |
| Service         | `serviceName`, `domain`, `schemaVersion` (hard-coded "1") | `Input`, `Input`, `Badge`                               |
| Metadata        | `contentVersion` (auto), `documentation`, `revocationURL` | `Input` + tooltip examples                              |
| Implementations | repeatable list                                           | `Accordion` per impl with `Select`, `Input`, `Textarea` |
| Signature       | hidden until future signing work                          | `Alert` placeholder                                     |

*Add Implementation* button opens a modal to choose **remote** or **local** then inserts the template.

### 3.2 Real-time validation

* JSON Schema generated from **types.ts** via `ts-json-schema-generator`.
* `ajv` validates on change.
  *Error messages appear beside the field and in a sticky error summary.*

### 3.3 Output panel

* Tabs: **Manifest JSON**, **DNS TXT**, **Preview dig / curl**.
* Copy-to-clipboard icons (`Button variant="ghost"`).
* *Download all* uses `Blob` + `FileSaver` to zip both files.

### 3.4 Public API

```
POST /generate
Body: AidGeneratorConfig JSON
Returns: { manifest: string, txt: string }
Errors: 422 { errors: [ { path, message } ] }
```

Open CORS for GET/OPTIONS, JSON only, 64 KB body limit.

---

## 4. Non-functional requirements

* React + Next.js 15
* shadcn/ui components only, Tailwind for spacing
* Types shared via `@aid/core` package import, no duplicated models
* Build size under 200 KB gzipped
* Lighthouse performance score ≥ 90 on desktop
* CI: Vitest unit tests plus Cypress happy-path test on every PR
* Deployment: Vercel, Edge Functions for the API route

---

## 5. Detailed validation rules

* `domain` must match `^[a-z0-9.-]+$` and not include protocol.
* `implementations` length ≥ 1.
* If `type` is **remote**: require `uri`.
* If `type` is **local**: require `package.manager` and `package.identifier`.
* If `authentication.scheme` is `mtls`: require `certificate`.
* Auto-fill `metadata.contentVersion` with `YYYY-MM-DD` when absent (mirrors **generator.ts** logic).

---

## 6. Example data helpers

* *Load sample* drop-down with presets: “Hello world”, “Auth0 MCP”, “Mixed profile”.
* Each preset bundled as JSON in `/public/samples/`.

---

## 7. Component breakdown (shadcn)

* **Form**: `<form className="space-y-6">`
* **Input**: `<Input />`
* **Select** with searchable list
* **Accordion** for each implementation
* **Tooltip** for field explanations
* **Tabs** for output
* **Toast** for success and copy actions
* **Alert** banner for JSON parse errors

---

## 8. State management

`react-hook-form` + `zodResolver` (runtime schema derived from JSON Schema) keeps form state and validation unified. Output panel subscribes to form context.

---

## 9. Error handling UX

* Field errors: red border, message underneath.
* Global errors (invalid JSON paste): toast + highlight JSON editor.
* API 5xx: modal with request ID and link to GitHub issues.

---

## 10. Analytics & logging

* Simple page-view and generate-click events via Vercel Analytics.
* No PII stored; configs never logged server-side unless validation fails (then trimmed to first 1 KB in logs).

---

## 11. Acceptance criteria

* Entering the **demo config** from **generator.ts** outputs manifest matching `buildManifest` byte-for-byte.
* The TXT matches `buildTxtRecord`.
* Invalid `domain` immediately blocks submission.
* Enum fields cannot be free-typed.
* REST API round-trip under 300 ms p95.

---

## 12. Out of scope

* Styling polish or brand assets
* Auth, quotas, persistence
* JWS signing support

---

## 13. Future enhancements

* Hover doc cards replaced with inline MDN-style popovers.
* Authenticated mode to save config presets in Supabase.
* Dark theme toggle.

---

Deliver this PRD to the Cursor agent along with **types.ts** and **generator.ts**. It contains every spec the agent needs to scaffold the UI, wire the API, and pass CI on first merge.
