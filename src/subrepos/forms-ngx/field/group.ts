import { Field, IField } from './field';

export interface IGroupField extends IField<string> {
  embeddedForm: any;
  removeButtonTitle?: string;
  addButtonTitle?: string;
}

export class GroupField extends Field<any> {
  controlType = 'group';
  embeddedForm: IField<any>[];
  removeButtonTitle: string;
  addButtonTitle: string;

  constructor(options: IGroupField) {
    super(options);
    this.embeddedForm = { ...options.embeddedForm };
    this.removeButtonTitle = options.removeButtonTitle || 'form.removeButtonTitle';
    this.addButtonTitle = options.addButtonTitle || 'form.addButtonTitle';
  }
}
