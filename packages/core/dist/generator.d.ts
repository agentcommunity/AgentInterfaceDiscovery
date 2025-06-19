import { AidGeneratorConfig, AidManifest } from "./types";
export declare function buildManifest(cfg: AidGeneratorConfig): AidManifest;
export declare function buildTxtRecord(cfg: AidGeneratorConfig, manifestPath?: string, ttl?: number): string;
export declare function writeManifest(cfg: AidGeneratorConfig, outDir: string): Promise<string>;
export declare function writeTxtSnippet(cfg: AidGeneratorConfig, outDir: string, manifestPath?: string): Promise<string>;
