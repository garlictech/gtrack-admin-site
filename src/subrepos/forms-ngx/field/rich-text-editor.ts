import { ITextareaField, TextareaField } from './textarea';

export class RichTextEditorField extends TextareaField implements ITextareaField {
  controlType = 'richtext';

  constructor(options: ITextareaField) {
    super(options);
  }
}
