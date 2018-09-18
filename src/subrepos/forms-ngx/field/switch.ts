import { Field, IField } from './field';

type _OnChangeType = () => void;

export interface ISwitchField extends IField<boolean> {
  readonly onChange?: _OnChangeType;
}

export class SwitchField extends Field<boolean> {
  controlType = 'switch';
  protected onChange: _OnChangeType | undefined;

  constructor(options: ISwitchField) {
    super(options);
    this.onChange = options.onChange;

    if (this.defaultValue === undefined) {
      this.defaultValue = false;
    }
  }
}
