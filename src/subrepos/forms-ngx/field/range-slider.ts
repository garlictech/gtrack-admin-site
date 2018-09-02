import { Field, IField } from './field';
import { Validators, ValidatorFn } from '@angular/forms';

type _OnChangeType = () => void;

export interface IRangeSliderField extends IField<[number, number]> {
  readonly onChange?: _OnChangeType;
  readonly min: number;
  readonly max: number;
}

export class RangeSliderField extends Field<[number, number]> {
  controlType = 'rangeSlider';
  min: number;
  max: number;

  private onChange: _OnChangeType | undefined;

  constructor(options: IRangeSliderField) {
    super(options);
    this.onChange = options.onChange;
    this.min = options.min;
    this.max = options.max;
  }
}
