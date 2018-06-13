import { Validators, ValidatorFn } from '@angular/forms';

import { TextboxField, ITextboxField } from './textbox';
import { IField } from './field';

export class PasswordField extends TextboxField {
  controlType = 'textbox';
  type: string;

  constructor(options: ITextboxField) {
    super(options);
    this.type = 'password';
  }
}