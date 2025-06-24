import { expectType } from 'tsd';
import { ValidationResult } from './dist/src/validators';

// Ensure ValidationResult has expected shape
expectType<ValidationResult>({ ok: true }); 