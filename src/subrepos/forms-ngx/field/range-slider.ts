import { Field, IField } from './field';

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

  protected onChange: _OnChangeType | undefined;

  constructor(options: IRangeSliderField) {
    super(options);
    this.onChange = options.onChange;
    this.min = options.min;
    this.max = options.max;
  }
}
