import { Field, FieldOptions } from './field';

type _OnChangeType = () => void;

export interface CheckboxFieldOptions extends FieldOptions<boolean> {
  readonly onChange?: _OnChangeType;
  disableOnTrue?: boolean;
  disabled?: boolean;
}

export class CheckboxField extends Field<boolean> {
  disableOnTrue?: boolean;
  disabled?: boolean;

  constructor(options: CheckboxFieldOptions) {
    super(options);
    this.controlType = 'checkbox';
    this.disableOnTrue = options.disableOnTrue;
  }
}
