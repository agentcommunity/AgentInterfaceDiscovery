import { AidGeneratorConfig, AidManifest } from "./types";
export declare function buildManifest(cfg: AidGeneratorConfig): AidManifest;
export declare function buildTxtRecord(cfg: AidGeneratorConfig, manifestPath?: string, ttl?: number): string;
