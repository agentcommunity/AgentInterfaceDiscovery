import { AidGeneratorConfig, AidManifest } from "./types";
export declare function buildManifest(cfg: Partial<AidGeneratorConfig>): AidManifest;
export declare function buildTxtRecord(cfg: Partial<AidGeneratorConfig>, manifestPath?: string, ttl?: number): string;
