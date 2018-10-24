import { Field, IField } from './field';
import { ISelectOption } from './select';

export interface IMultiSelectField extends IField<string[]> {
  selectOptions: ISelectOption[];
  defaultLabel?: string;
}

export class MultiSelectField extends Field<string[]> implements IMultiSelectField {
  controlType = 'multi-select';
  selectOptions: ISelectOption[];
  defaultLabel: string;

  constructor(options: IMultiSelectField) {
    super(options);
    this.selectOptions = options.selectOptions || [];
    this.defaultLabel = options.defaultLabel || 'form.multiSelect.choose';
  }
}
