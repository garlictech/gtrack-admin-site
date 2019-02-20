import { Field, FieldOptions } from './field';

export interface ChipsFieldOptions extends FieldOptions<Array<string>> {}

export class ChipsField extends Field<Array<string>> {
  constructor(options: ChipsFieldOptions) {
    super(options);
    this.controlType = 'chips';
  }
}
