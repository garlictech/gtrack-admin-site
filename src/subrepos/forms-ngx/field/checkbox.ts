import { Field, IField } from './field';

type _OnChangeType = () => void

export interface ICheckboxField extends IField<boolean> {
  readonly onChange?: _OnChangeType
  disableOnTrue?: boolean
  disabled?: boolean;
}

export class CheckboxField extends Field<boolean> {
  controlType = 'checkbox';
  disableOnTrue?: boolean;
  disabled?: boolean;
  private onChange: _OnChangeType | undefined

  constructor(options: ICheckboxField) {
    super(options);

    this.disableOnTrue = options.disableOnTrue;
    this.onChange = options.onChange
  }
}
