import { AbstractControl, ValidatorFn } from '@angular/forms';
// tslint:disable no-var-requires no-require-imports
const passwordValidator = require('password-validator');

const schema = new passwordValidator();

schema
  .is()
  .min(12)
  .has()
  .digits()
  .has()
  .not()
  .spaces()
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .symbols();

const validatePasswordContent = (): ValidatorFn => (control: AbstractControl) =>
  !schema.validate(control.value || String('')) ? { validPassword: { value: control.value } } : undefined;

export const formPasswordValidators = [validatePasswordContent()];
export { schema as passwordValidatorSchema };
