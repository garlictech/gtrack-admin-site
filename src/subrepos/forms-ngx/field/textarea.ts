import { ITextboxField, TextboxField } from './textbox';

export interface ITextareaField extends ITextboxField {
  rows?: number;
  disabled?: boolean;
  onKeyDown?: Function;
  autoFocus?: boolean;
}

export class TextareaField extends TextboxField implements ITextareaField {
  controlType = 'textarea';
  rows: number;
  autoFocus: boolean;

  constructor(options: ITextareaField) {
    super(options);
    this.rows = options.rows || 6;
    this.autoFocus = !!options.autoFocus;
  }
}
