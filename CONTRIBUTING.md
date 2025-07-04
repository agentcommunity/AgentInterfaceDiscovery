# Contributing to Agent Community 🌐

Thank you for your interest in improving **Agent Interface Discovery** and the wider *agentcommunity* ecosystem!  This guide applies to this monorepo and all packages contained within it.

---

## 🗣️ Opening Issues & Discussions

### 1. 🐛 Bug reports & actionable items
* Open an **Issue** in the relevant package directory.
* Add clear labels such as `bug`, `spec`, `implementation`.

### 2. 💡 Design & proposal discussions
* Use **repository Discussions** when the topic is tightly scoped to that package.
* Use **org-level Discussions** for broad or cross-package topics (governance, new protocols, etc.).
* Always search existing threads to avoid duplicates.

---

## 🤝 Pull Requests

1. **Fork** → branch (`feature/…`, `fix/…`).
2. Follow the existing code style (ESLint & Prettier will enforce most rules).
3. **Write tests** for new or changed behaviour.
4. **Update docs / READMEs** as needed.
5. Link related Issues/Discussions in the PR body.
6. Request a review from maintainers or CODEOWNERS.

---

## ✅ Development Guidelines

### Code quality
* Prefer small, atomic commits – easier to review & revert.
* Validate inputs & handle errors clearly.
* Use `unknown` over `any`; add type-guards where necessary.

### Documentation
* Keep READMEs & example configs up-to-date.
* Inline code comments for non-obvious logic.

### Security
* Validate all untrusted inputs.
* Consider authn/authz implications for changes that touch network or file-system.

---

## 🚀 Getting started locally

```bash
pnpm install   # install all workspace deps
pnpm build     # build everything once
pnpm dev       # hot-reload web UI and packages that support watch mode
```

---

## 🧩 Adding a new language SDK

We generate official SDKs directly from the canonical JSON Schema (`packages/aid-schema/aid.schema.json`).  The workflow is:

1. **Add a generator** under `scripts/` that consumes the JSON Schema and writes code to `packages/aid-core-<lang>/`.
2. Provide unit tests under that package (see Go/Python SDKs for reference).
3. Register the package in `.github/workflows/sdk.yml` so CI builds & tests it.
4. Update this guide & the root README with installation instructions.

If your language has no good schema-to-code toolchain you can hand-write the models, but they **must** round-trip with the schema using the conformance suite.

---

## 🛡️ Code of Conduct

We follow the [Contributor Covenant](https://www.contributor-covenant.org).  Please be kind and respectful.

---

## 📄 License

All contributions are made under the MIT licence unless otherwise noted. 