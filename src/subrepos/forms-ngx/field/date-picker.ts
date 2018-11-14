import { Field, IField } from './field';

export interface IDatePickerField extends IField<Date> {
  maxDate?: Date;
  minDate?: Date;
  defaultValue?: Date;
  showTime?: boolean;
}

export class DatePickerField extends Field<Date> implements IDatePickerField {
  controlType = 'date';
  maxDate: Date | undefined;
  minDate: Date | undefined;
  defaultValue?: Date;
  showTime: boolean;

  constructor(options: IDatePickerField) {
    super(options);
    this.maxDate = options.maxDate;
    this.minDate = options.minDate;
    this.defaultValue = options.defaultValue || new Date();
    this.showTime = options.showTime || false;
  }
}
