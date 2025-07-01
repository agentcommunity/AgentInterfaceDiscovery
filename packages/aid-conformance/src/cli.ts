#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import chalk from "chalk";
import { readFileSync } from "fs";
import { validateManifest, validateTxt, validatePair } from "./validators";
import { AidGeneratorConfig, AidManifest, buildManifest } from "@agentcommunity/aid-core";
// @ts-ignore: No type definitions available for 'table'
import { table } from "table";

// -------------------------
// Utility helpers for pretty output
// -------------------------

function printManifestErrors(errors?: { path?: (string | number)[]; message: string }[]) {
  if (!errors || errors.length === 0) return;

  console.log();
  console.log(chalk.bold.red("Validation errors:"));

  for (const issue of errors) {
    const path = issue.path && issue.path.length ? issue.path.map(String).join(".") : "(root)";
    const line = `${chalk.yellow(path.padEnd(40))} ${chalk.red(issue.message)}`;
    console.log(`  • ${line}`);
  }
}

function printSimpleErrors(errors?: { message: string }[]) {
  if (!errors || errors.length === 0) return;

  console.log();
  console.log(chalk.bold.red("Validation errors:"));

  for (const issue of errors) {
    console.log(`  • ${chalk.red(issue.message)}`);
  }
}

// Quick heuristic helpers
function isManifest(obj: any): boolean {
  return obj && typeof obj === "object" && Array.isArray(obj.implementations);
}

function isConfig(obj: any): boolean {
  return obj && typeof obj === "object" && typeof obj.serviceName === "string";
}

function summarize(results: Record<string, { ok: boolean; errors?: any[] }>, quiet = false) {
  if (quiet) return;
  const rows = [[chalk.bold("File / Input"), chalk.bold("Status"), chalk.bold("Errors")]];
  for (const [key, r] of Object.entries(results)) {
    rows.push([
      key,
      r.ok ? chalk.green("✔ OK") : chalk.red("✖ Fail"),
      r.ok ? "-" : String(r.errors?.length ?? 0),
    ]);
  }
  console.log("\n" + table(rows));
}

yargs(hideBin(process.argv))
  .command(
    "manifest <files...>",
    "Validate one or more AID manifest files (e.g., aid.json)",
    {
      files: {
        describe: "Paths to the manifest files to validate",
        type: "string",
        demandOption: true
      },
    },
    (argv) => {
      let overallSuccess = true;
      const results: Record<string, any> = {};

      for (const file of argv.files) {
        console.log(`\nValidating manifest: ${file}`);
        console.log(chalk.bold(`\nValidating manifest: ${file}`));
        try {
          const content = readFileSync(file, "utf-8");
          const json = JSON.parse(content);
          const result = validateManifest(json);
          results[file] = result;

          if (result.ok) {
            console.log(chalk.green("✔ Valid"));
          } else {
            overallSuccess = false;
            console.log(chalk.red("✖ Invalid"));
            printManifestErrors(result.errors);
          }
        } catch (e: any) {
          overallSuccess = false;
          results[file] = { ok: false, errors: [{ message: e.message }] };
          console.log(chalk.red(`⚠ Error: ${e.message}`));
        }
      }

      if (argv.output === "json") {
        console.log(JSON.stringify(results, null, 2));
      }

      process.exit(overallSuccess ? 0 : 1);
    }
  )
  .command(
    "txt <records...>",
    "Validate one or more DNS TXT records",
    {
        records: {
            describe: "The TXT record strings to validate",
            type: "string",
            demandOption: true
        }
    },
    (argv) => {
        const result = validateTxt(argv.records);
        if (result.ok) {
            console.log(chalk.green("✔ Valid"));
            process.exit(0);
        } else {
            console.log(chalk.red("✖ Invalid"));
            printSimpleErrors(result.errors);
            process.exit(1);
        }
    }
  )
  .command(
    "pair <configFile> <manifestFile>",
    "Compare a generator config and a manifest for equivalence",
    {
        configFile: {
            describe: "Path to the AID generator config",
            type: "string",
            demandOption: true
        },
        manifestFile: {
            describe: "Path to the AID manifest",
            type: "string",
            demandOption: true
        },
    },
    (argv) => {
        try {
            const configContent = readFileSync(argv.configFile, "utf-8");
            const manifestContent = readFileSync(argv.manifestFile, "utf-8");
            const config = JSON.parse(configContent) as AidGeneratorConfig;
            const manifest = JSON.parse(manifestContent) as AidManifest;

            const result = validatePair(config, manifest, { strict: argv.strict as boolean });
            if (result.ok) {
                console.log(chalk.green("✔ Config and manifest are equivalent."));
                process.exit(0);
            } else {
                console.log(chalk.red("✖ Config and manifest are not equivalent."));
                printSimpleErrors(result.errors);
                process.exit(1);
            }

        } catch (e: any) {
            console.error(`❌ ERROR: ${e.message}`);
            process.exit(2);
        }
    }
  )
  .command(
    "auto <inputs...>",
    "Auto-detect artefact type(s) and validate appropriately",
    yargs => {
      yargs.positional("inputs", {
        describe: "Files or raw TXT records",
        type: "string",
      });
    },
    argv => {
      const quiet = argv.quiet as boolean;
      const inputs = argv.inputs as string[];
      const results: Record<string, any> = {};

      // If exactly two JSON files and look like config + manifest, treat as pair
      if (inputs.length === 2 && inputs.every(f => f.endsWith(".json"))) {
        try {
          const c1 = JSON.parse(readFileSync(inputs[0], "utf-8"));
          const c2 = JSON.parse(readFileSync(inputs[1], "utf-8"));
          let cfg, man, cfgPath, manPath;
          if (isConfig(c1) && isManifest(c2)) {
            cfg = c1;
            man = c2;
            cfgPath = inputs[0];
            manPath = inputs[1];
          } else if (isConfig(c2) && isManifest(c1)) {
            cfg = c2;
            man = c1;
            cfgPath = inputs[1];
            manPath = inputs[0];
          }
          if (cfg && man) {
            const res = validatePair(cfg as any, man as any);
            results[`${cfgPath} ↔ ${manPath}`] = res;
            summarize(results, quiet);
            process.exit(res.ok ? 0 : 1);
          }
        } catch {}
      }

      // Otherwise handle individually
      let exitCode = 0;
      for (const input of inputs) {
        if (!quiet) console.log(`\nValidating ${input}`);
        try {
          if (input.trim().startsWith("v=aid1")) {
            // raw TXT string
            const res = validateTxt([input]);
            results[input] = res;
            if (!res.ok) exitCode = 1;
            if (!quiet) printSimpleErrors(res.errors);
          } else if (input.endsWith(".txt")) {
            const content = readFileSync(input, "utf-8");
            const res = validateTxt([content]);
            results[input] = res;
            if (!res.ok) exitCode = 1;
            if (!quiet) printSimpleErrors(res.errors);
          } else if (input.endsWith(".json")) {
            const content = readFileSync(input, "utf-8");
            const json = JSON.parse(content);
            let res;
            if (isManifest(json)) {
              res = validateManifest(json);
              if (!quiet) printManifestErrors(res.errors);
            } else if (isConfig(json)) {
              res = validatePair(json, buildManifest(json as any));
              if (!quiet) printSimpleErrors(res.errors);
            } else {
              throw new Error("Could not determine JSON artefact type");
            }
            results[input] = res;
            if (!res.ok) exitCode = 1;
          } else {
            throw new Error("Unsupported input type");
          }
        } catch (e: any) {
          results[input] = { ok: false, errors: [{ message: e.message }] };
          if (!quiet) console.log(chalk.red(`Error: ${e.message}`));
          exitCode = 1;
        }
      }

      summarize(results, quiet);
      process.exit(exitCode);
    }
  )
  .option("output", {
    alias: "o",
    type: "string",
    description: "Output format (e.g., json)",
    choices: ["json"],
  })
  .option("quiet", {
    alias: "q",
    type: "boolean",
    description: "Suppress detailed output; use exit code only",
    default: false,
  })
  .option("strict", {
    type: "boolean",
    description: "Perform strict validation (disallow vendor extensions)",
    default: true,
  })
  .demandCommand(1, "You must provide a command to run.")
  .help()
  .alias("h", "help")
  .strict()
  .parse(); 