import { ITextareaField, TextareaField } from './textarea';

export class MarkdownField extends TextareaField implements ITextareaField {
  controlType = 'markdown';

  constructor(options: ITextareaField) {
    super(options);
  }
}
