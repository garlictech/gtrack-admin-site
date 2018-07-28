import { ITextareaField, TextareaField } from './textarea';

export interface IRichTextEditorField extends ITextareaField {}

export class RichTextEditorField extends TextareaField implements IRichTextEditorField {
  controlType = 'richtext';

  constructor(options: IRichTextEditorField) {
    super(options);
  }
}
