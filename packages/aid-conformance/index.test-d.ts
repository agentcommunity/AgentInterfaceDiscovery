import { expectType } from 'tsd';
import { ValidationResult } from './src/validators';

// Ensure ValidationResult has expected shape
expectType<ValidationResult>({ ok: true }); 