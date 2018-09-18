
import { TextboxField, ITextboxField } from './textbox';

export class PasswordField extends TextboxField {
  controlType = 'textbox';
  type: string;

  constructor(options: ITextboxField) {
    super(options);
    this.type = 'password';
  }
}
