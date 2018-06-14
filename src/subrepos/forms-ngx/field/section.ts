import { Field, IField } from './field';

export interface ISectionField extends IField<string> {
  embeddedForm: any;
}

export class SectionField extends Field<any> {
  controlType = 'section';
  embeddedForm: IField<any>[];

  constructor(options: ISectionField) {
    super(options);
    this.embeddedForm = { ...options.embeddedForm };
  }
}
