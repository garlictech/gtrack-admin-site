import { Field, IField } from './field';
import { Validators, ValidatorFn } from '@angular/forms';

type _OnChangeType = () => void;

export interface ISwitchField extends IField<boolean> {
  readonly onChange?: _OnChangeType;
}

export class SwitchField extends Field<boolean> {
  controlType = 'switch';
  private onChange: _OnChangeType | undefined;

  constructor(options: ISwitchField) {
    super(options);
    this.onChange = options.onChange;
  }
}
