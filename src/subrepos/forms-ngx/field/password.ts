<<<<<<< HEAD
=======

>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
import { TextboxField, ITextboxField } from './textbox';

export class PasswordField extends TextboxField {
  controlType = 'textbox';
  type: string;

  constructor(options: ITextboxField) {
    super(options);
    this.type = 'password';
  }
}
