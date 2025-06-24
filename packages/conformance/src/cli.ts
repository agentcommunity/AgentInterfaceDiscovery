#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { readFileSync } from "fs";
import { validateManifest, validateTxt, validatePair } from "./validators";
import { AidGeneratorConfig, AidManifest } from "@aid/core";

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
        try {
          const content = readFileSync(file, "utf-8");
          const json = JSON.parse(content);
          const result = validateManifest(json);
          results[file] = result;

          if (result.ok) {
            console.log("✅ OK");
          } else {
            overallSuccess = false;
            console.log("❌ FAILED");
            result.errors?.forEach((err) => {
              console.log(`  - Path: ${err.path?.join(".") || "N/A"}, Error: ${err.message}`);
            });
          }
        } catch (e: any) {
          overallSuccess = false;
          results[file] = { ok: false, errors: [{ message: e.message }] };
          console.log(`❌ ERROR: ${e.message}`);
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
            console.log("✅ OK");
            process.exit(0);
        } else {
            console.log("❌ FAILED");
            result.errors?.forEach((err) => {
                console.log(`  - ${err.message}`);
            });
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
                console.log("✅ OK: Config and manifest are equivalent.");
                process.exit(0);
            } else {
                console.log("❌ FAILED: Config and manifest are not equivalent.");
                result.errors?.forEach((err) => {
                    console.log(`  - ${err.message}`);
                });
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