import { expectType } from 'tsd';
import { ValidationResult } from './validators';

declare const res: ValidationResult;
expectType<ValidationResult>(res); 