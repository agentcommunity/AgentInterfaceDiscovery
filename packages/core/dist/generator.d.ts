import { AidGeneratorConfig } from "./types";
export declare function writeManifest(cfg: AidGeneratorConfig, outDir: string): Promise<string>;
export declare function writeTxtSnippet(cfg: AidGeneratorConfig, outDir: string, manifestPath?: string): Promise<string>;
