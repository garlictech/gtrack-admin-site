import { Field, FieldOptions } from './field';
import { SelectOption } from './select';

export interface MultiSelectFieldOptions extends FieldOptions<Array<string>> {
  selectOptions: Array<SelectOption>;
}

export class MultiSelectField extends Field<Array<string>> implements MultiSelectFieldOptions {
  selectOptions: Array<SelectOption>;

  constructor(options: MultiSelectFieldOptions) {
    super(options);
    this.selectOptions = options.selectOptions || [];
    this.controlType = 'multi-select';
  }
}
