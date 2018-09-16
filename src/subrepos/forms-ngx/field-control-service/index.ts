import { Injectable } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import * as _ from 'lodash';

export interface IFormInstance {
  form: FormGroup;
  fields: any[];
}

@Injectable()
export class FieldControlService {
  toFormGroup(fields: any, data: any): IFormInstance {
    const group: any = {};
    const formFields: any[] = [];
    _.forEach(fields, (field: any, key) => {
      if (field.controlType === 'group') {
        const embeddedForm: IFormInstance[] = _.map(data[key], arrayValue =>
          this.toFormGroup(field.embeddedForm, arrayValue)
        );
        group[key] = new FormArray(embeddedForm.map(form => form.form));
      } else if (field.controlType === 'section') {
        const embeddedForm: IFormInstance = this.toFormGroup(field.embeddedForm, data[key] || {});
        group[key] = embeddedForm.form;
      } else {
        group[key] = new FormControl(data[key] || field.defaultValue, field.validators);
      }

      if (field.disableOnTrue && data[key]) {
        field.disabled = true;
      }

      formFields.push({ ...field, key: key });
    });

    return { form: new FormGroup(group), fields: formFields };
  }
}
