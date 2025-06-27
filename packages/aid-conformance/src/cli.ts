#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import chalk from "chalk";
import { readFileSync } from "fs";
import { validateManifest, validateTxt, validatePair } from "./validators";
import { AidGeneratorConfig, AidManifest } from "@aid/core";

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
  .option("output", {
    alias: "o",
    type: "string",
    description: "Output format (e.g., json)",
    choices: ["json"],
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