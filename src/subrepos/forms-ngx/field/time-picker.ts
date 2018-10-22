import { Field, IField } from './field';

type _OnChangeType = () => void;

export interface ITimePickerField extends IField<Date> {
  readonly onChange?: _OnChangeType;
  defaultValue?: Date;
}

export class TimePickerField extends Field<Date> {
  controlType = 'time';
  defaultValue?: Date;

  protected onChange: _OnChangeType | undefined;

  constructor(options: ITimePickerField) {
    super(options);
    this.onChange = options.onChange;

    this.defaultValue = options.defaultValue || new Date();
  }
}
