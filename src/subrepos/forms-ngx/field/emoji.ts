import { TextareaField, ITextareaField } from './textarea';

export class EmojiField extends TextareaField {
  public controlType = 'emoji';
  public disabled = false;
  public onKeyDown?: Function;

  constructor(options: ITextareaField) {
    super(options);

    this.disabled = !!options.disabled;

    if (options.onKeyDown) {
      this.onKeyDown = options.onKeyDown;
    }
  }
}
