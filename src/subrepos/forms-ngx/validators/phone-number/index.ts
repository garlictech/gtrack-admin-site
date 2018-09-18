import { ValidatorFn, Validators } from '@angular/forms';
import { PhoneValidators } from 'ngx-phone-validators';

function ValidatePhoneNumber(): ValidatorFn {
  return Validators.compose([PhoneValidators.isPhoneNumber('HU')])
}

export const phoneNumberValidators = [ValidatePhoneNumber()];
