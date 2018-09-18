import { Field, IField } from './field';
import { ISelectOption } from './select';

export interface IMultiSelectField extends IField<string[]> {
  selectOptions: ISelectOption[];
}

export class MultiSelectField extends Field<string[]> implements IMultiSelectField {
  controlType = 'multi-select';
  selectOptions: ISelectOption[];

  constructor(options: IMultiSelectField) {
    super(options);
    this.selectOptions = options.selectOptions || [];
  }
}
