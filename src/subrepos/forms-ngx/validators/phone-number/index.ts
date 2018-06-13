import { Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { PhoneNumberUtil, PhoneNumber } from 'google-libphonenumber';

function ValidatePhoneNumber(): ValidatorFn {
  const phoneUtil = PhoneNumberUtil.getInstance();

  return (control: AbstractControl) => {
    try {
      const phoneNumber: PhoneNumber = phoneUtil.parse(control.value || '', 'HU');
      return !phoneUtil.isValidNumber(phoneNumber) ? { phoneNumber: { value: control.value } } : null;
    } catch (err) {
      return { phoneNumber: { value: control.value } };
    }
  };
}

export const phoneNumberValidators = [ValidatePhoneNumber()];
