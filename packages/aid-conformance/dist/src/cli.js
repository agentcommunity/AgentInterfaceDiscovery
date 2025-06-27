#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const fs_1 = require("fs");
const validators_1 = require("./validators");
(0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .command("manifest <files...>", "Validate one or more AID manifest files (e.g., aid.json)", {
    files: {
        describe: "Paths to the manifest files to validate",
        type: "string",
        demandOption: true
    },
}, (argv) => {
    let overallSuccess = true;
    const results = {};
    for (const file of argv.files) {
        console.log(`\nValidating manifest: ${file}`);
        try {
            const content = (0, fs_1.readFileSync)(file, "utf-8");
            const json = JSON.parse(content);
            const result = (0, validators_1.validateManifest)(json);
            results[file] = result;
            if (result.ok) {
                console.log("✅ OK");
            }
            else {
                overallSuccess = false;
                console.log("❌ FAILED");
                result.errors?.forEach((err) => {
                    console.log(`  - Path: ${err.path?.join(".") || "N/A"}, Error: ${err.message}`);
                });
            }
        }
        catch (e) {
            overallSuccess = false;
            results[file] = { ok: false, errors: [{ message: e.message }] };
            console.log(`❌ ERROR: ${e.message}`);
        }
    }
    if (argv.output === "json") {
        console.log(JSON.stringify(results, null, 2));
    }
    process.exit(overallSuccess ? 0 : 1);
})
    .command("txt <records...>", "Validate one or more DNS TXT records", {
    records: {
        describe: "The TXT record strings to validate",
        type: "string",
        demandOption: true
    }
}, (argv) => {
    const result = (0, validators_1.validateTxt)(argv.records);
    if (result.ok) {
        console.log("✅ OK");
        process.exit(0);
    }
    else {
        console.log("❌ FAILED");
        result.errors?.forEach((err) => {
            console.log(`  - ${err.message}`);
        });
        process.exit(1);
    }
})
    .command("pair <configFile> <manifestFile>", "Compare a generator config and a manifest for equivalence", {
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
}, (argv) => {
    try {
        const configContent = (0, fs_1.readFileSync)(argv.configFile, "utf-8");
        const manifestContent = (0, fs_1.readFileSync)(argv.manifestFile, "utf-8");
        const config = JSON.parse(configContent);
        const manifest = JSON.parse(manifestContent);
        const result = (0, validators_1.validatePair)(config, manifest, { strict: argv.strict });
        if (result.ok) {
            console.log("✅ OK: Config and manifest are equivalent.");
            process.exit(0);
        }
        else {
            console.log("❌ FAILED: Config and manifest are not equivalent.");
            result.errors?.forEach((err) => {
                console.log(`  - ${err.message}`);
            });
            process.exit(1);
        }
    }
    catch (e) {
        console.error(`❌ ERROR: ${e.message}`);
        process.exit(2);
    }
})
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
//# sourceMappingURL=cli.js.map