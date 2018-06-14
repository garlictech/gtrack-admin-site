import { phoneNumberValidators } from '../validators';

import { TextboxField, ITextboxField } from './textbox';
import { IField } from './field';

export class PhoneNumberField extends TextboxField {
  constructor(options: ITextboxField) {
    super(options);
    this.validators = this.validators.concat(phoneNumberValidators);
  }
}
