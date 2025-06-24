import { expectType } from 'tsd';
import { ValidationResult } from './validators';

expectType<ValidationResult>({ ok: true }); 