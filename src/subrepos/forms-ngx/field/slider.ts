import { Field, IField } from './field';
import { Validators, ValidatorFn } from '@angular/forms';

type _OnChangeType = () => void;

export interface ISliderField extends IField<number> {
  readonly onChange?: _OnChangeType;
  readonly min: number;
  readonly max: number;
}

export class SliderField extends Field<number> {
  controlType = 'slider';
  min: number;
  max: number;

  private onChange: _OnChangeType | undefined;

  constructor(options: ISliderField) {
    super(options);
    this.onChange = options.onChange;
    this.min = options.min;
    this.max = options.max;
  }
}
