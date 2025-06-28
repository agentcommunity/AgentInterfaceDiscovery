#!/usr/bin/env node
const { execSync } = require("node:child_process")

const run = (cmd) => execSync(cmd, { stdio: "inherit", shell: true })

try {
  console.log("🛠️  Building @aid/core ...")
  run("pnpm -F @aid/core run build")

  console.log("🔄 Regenerating schema ...")
  run("pnpm -F @aid/core run schema:generate")

  console.log("🔍 Checking for drift in generated schema ...")
  run("git diff --exit-code -- packages/aid-schema/aid.schema.json")

  console.log("✅ Schema is in sync. No drift detected.")
} catch (_err) {
  console.error("❌ Schema drift detected! Commit updated schema or set BREAKING_SCHEMA_CHANGE=true to bypass.")
  process.exit(1)
} 