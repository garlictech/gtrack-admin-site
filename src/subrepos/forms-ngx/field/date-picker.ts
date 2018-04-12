import { Field, IField } from './field';

export interface IDatePickerField extends IField<Date> {
  maxDate?: Date;
  defaultDate?: Date;
}

export class DatePickerField extends Field<Date> implements IDatePickerField {
  controlType = 'date';
  maxDate: Date | undefined;
  defaultDate?: Date;

  constructor(options: IDatePickerField) {
    super(options);
    this.maxDate = options.maxDate;
    this.defaultDate = options.defaultDate || new Date();
  }
}
