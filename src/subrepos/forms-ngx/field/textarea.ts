import { ITextboxField, TextboxField } from './textbox';

export interface ITextareaField extends ITextboxField {
  rows?: number;
}

export class TextareaField extends TextboxField implements ITextareaField {
  controlType = 'textarea';
  rows: number;

  constructor(options: ITextareaField) {
    super(options);
    this.rows = options.rows || 6;
  }
}
