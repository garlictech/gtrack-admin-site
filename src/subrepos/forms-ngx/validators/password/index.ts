import { AbstractControl, ValidatorFn } from '@angular/forms';
/* tslint:disable no-var-requires */
const passwordValidator = require('password-validator');
/* tslint:enable no-var-requires */

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
  .letters()
  .has()
  .symbols();

function ValidatePasswordContent(): ValidatorFn {
  return (control: AbstractControl) => {
    return !schema.validate(control.value || '') ? { validPassword: { value: control.value } } : null;
  };
}

export const passwordValidators = [ValidatePasswordContent()];
