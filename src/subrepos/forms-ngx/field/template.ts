import { TemplateRef } from '@angular/core';
import { Field, IField } from './field';

export interface ITemplateField extends IField<string> {
  templateRef: TemplateRef<any>;
}

export class TemplateField extends Field<string> {
  controlType = 'template';
  templateRef: TemplateRef<any>;

  constructor(options: ITemplateField) {
    super(options);
    this.templateRef = options.templateRef;
  }
}
