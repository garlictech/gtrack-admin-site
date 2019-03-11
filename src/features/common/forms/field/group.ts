import { Field, FieldOptions } from './field';

export interface GroupFieldOptions extends FieldOptions<string> {
  embeddedForm: any;
  removeButtonTitle?: string;
  addButtonTitle?: string;
}

export class GroupField extends Field<any> {
  embeddedForm: Array<FieldOptions<any>>;
  removeButtonTitle: string;
  addButtonTitle: string;

  constructor(options: GroupFieldOptions) {
    super(options);
    this.controlType = 'group';
    this.embeddedForm = { ...options.embeddedForm };
    this.removeButtonTitle = options.removeButtonTitle || 'form.removeButtonTitle';
    this.addButtonTitle = options.addButtonTitle || 'form.addButtonTitle';
  }
}
