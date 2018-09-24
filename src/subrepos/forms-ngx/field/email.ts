import { Validators, ValidatorFn } from '@angular/forms';

import { TextboxField, ITextboxField } from './textbox';

export class EmailField extends TextboxField {
  controlType = 'textbox';
  type: string;

  constructor(options: ITextboxField) {
    super(options);
    this.type = 'email';
    (<ValidatorFn[]>this.validators).push(Validators.email);
  }
}
