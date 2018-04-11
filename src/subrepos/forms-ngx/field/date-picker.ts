import { Field, IField } from './field';

export interface IDatePickerField extends IField<Date> {
  maxDate?: Date;
}

export class DatePickerField extends Field<Date> implements IDatePickerField {
  controlType = 'date';
  maxDate: Date | undefined;

  constructor(options: IDatePickerField) {
    super(options);
    this.maxDate = options.maxDate;
    this.defaultValue = options.defaultValue || new Date();
  }
}
