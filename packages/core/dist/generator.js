"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeManifest = writeManifest;
exports.writeTxtSnippet = writeTxtSnippet;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const common_1 = require("./common");
/* --------------------------------------------------------------- *
 * File writers (manifest + DNS snippet)                            *
 * --------------------------------------------------------------- */
async function writeManifest(cfg, outDir) {
    const manifest = (0, common_1.buildManifest)(cfg);
    const json = JSON.stringify(manifest, null, 2);
    const outPath = path_1.default.join(outDir, "aid.json");
    await fs_1.promises.mkdir(outDir, { recursive: true });
    await fs_1.promises.writeFile(outPath, json, "utf-8");
    return outPath;
}
async function writeTxtSnippet(cfg, outDir, manifestPath = "/.well-known/aid.json") {
    const txt = (0, common_1.buildTxtRecord)(cfg, manifestPath);
    const outPath = path_1.default.join(outDir, "aid.txt");
    await fs_1.promises.mkdir(outDir, { recursive: true });
    await fs_1.promises.writeFile(outPath, txt + "\n", "utf-8");
    return outPath;
}
/* --------------------------------------------------------------- *
 * Demo (runs when you `pnpm exec ts-node …/generator.ts`)          *
 * --------------------------------------------------------------- */
if (require.main === module) {
    const demo = {
        schemaVersion: "1",
        serviceName: "Supabase",
        domain: "supabase.com",
        metadata: {
            documentation: "https://supabase.com/docs/guides/ai",
            // contentVersion is auto-filled if omitted
        },
        implementations: [
            {
                type: "remote",
                name: "Cloud API (Prod)",
                protocol: "mcp",
                uri: "https://api.supabase.com/v1",
                authentication: {
                    scheme: "pat",
                    description: "Create one in the dashboard",
                    placement: {
                        in: "header",
                        key: "Authorization",
                        format: "Bearer {token}",
                    },
                },
            },
        ],
    };
    const outDir = path_1.default.resolve(__dirname);
    Promise.all([writeManifest(demo, outDir), writeTxtSnippet(demo, outDir)])
        .then(([manifestPath, txtPath]) => {
        console.log("✓ wrote", manifestPath);
        console.log("✓ wrote", txtPath);
    })
        .catch((err) => {
        console.error(err);
        process.exit(1);
    });
}
