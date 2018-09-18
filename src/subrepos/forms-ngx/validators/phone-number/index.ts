<<<<<<< HEAD
import { ValidatorFn, Validators } from '@angular/forms';
import { PhoneValidators } from 'ngx-phone-validators';
=======
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { PhoneNumberUtil, PhoneNumber } from 'google-libphonenumber';
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661

function ValidatePhoneNumber(): ValidatorFn {
  return Validators.compose([PhoneValidators.isPhoneNumber('HU')]);
}

export const phoneNumberValidators = [ValidatePhoneNumber()];
