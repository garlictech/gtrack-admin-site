import { Field, IField } from './field';

export enum ESelectTypes {
  dropdown = 'dropdown',
  radio = 'radio'
}

export interface ISelectOption {
  value: string;
  label: string;
}

export interface ISelectField extends IField<string> {
  type?: ESelectTypes;
  selectOptions: ISelectOption[];
}

export class SelectField extends Field<string> {
  controlType = 'select';
  type: ESelectTypes;
  selectOptions: ISelectOption[];

  constructor(options: ISelectField) {
    super(options);
    this.type = options.type || ESelectTypes.dropdown;
    this.selectOptions = options.selectOptions || [];
  }
}
