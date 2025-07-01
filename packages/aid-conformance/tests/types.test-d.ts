import { expectType, expectAssignable } from 'tsd';
import { AidManifest, aidManifestSchema } from '@agentcommunity/aid-core';
import { z } from 'zod';

type InferredManifest = z.infer<typeof aidManifestSchema>;

// This ensures the manually-defined type and the inferred type are identical.
// If they diverge, this will cause a compile-time error when running `test:types`.
expectType<AidManifest>({} as InferredManifest);
expectType<InferredManifest>({} as AidManifest); 