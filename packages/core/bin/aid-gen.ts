#!/usr/bin/env node
import { readFileSync } from "fs";
import path from "path";
import { AidGeneratorConfig } from "../src/types";
import { writeManifest, writeTxtSnippet } from "../src/node";

function usage() {
  console.error(`Usage: aid-gen <config.json> [outDir]`);
  process.exit(1);
}

const [configPath, outDir = process.cwd()] = process.argv.slice(2);
if (!configPath) usage();

const cfg = JSON.parse(readFileSync(configPath, "utf8")) as AidGeneratorConfig;

Promise.all([
  writeManifest(cfg, outDir),
  writeTxtSnippet(cfg, outDir, "/.well-known/aid.json"),
]).then(([jsonP, txtP]) => {
  console.log("✓ wrote", jsonP);
  console.log("✓ wrote", txtP);
});
