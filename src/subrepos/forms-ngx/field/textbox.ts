import { Field, IField } from './field';
import { Validators, ValidatorFn } from '@angular/forms';

export interface ITextboxField extends IField<string> {
  type?: string;
  minLength?: number;
  maxLength?: number;
}

export class TextboxField extends Field<string> {
  controlType = 'textbox';
  type: string;

  minLength?: number;
  maxLength?: number;

  constructor(options: ITextboxField) {
    super(options);
    this.type = options.type || 'text';
    this.minLength = options.minLength;
    this.maxLength = options.maxLength;

    if (this.minLength) {
      (<ValidatorFn[]>this.validators).push(Validators.minLength(this.minLength));
    }

    if (this.maxLength) {
      (<ValidatorFn[]>this.validators).push(Validators.maxLength(this.maxLength));
    }
  }
}
