import { TextareaField, ITextareaField } from './textarea';

export class EmojiField extends TextareaField {
  controlType = 'emoji';

  constructor(options: ITextareaField) {
    super(options);
  }
}
