import { ITextareaField, TextareaField } from './textarea';

export interface IMarkdownField extends ITextareaField {}

export class MarkdownField extends TextareaField implements IMarkdownField {
  controlType = 'markdown';

  constructor(options: IMarkdownField) {
    super(options);
  }
}
