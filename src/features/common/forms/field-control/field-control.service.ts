import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import * as _ from 'lodash';

export interface FormInstance {
  form: FormGroup;
  fields: Array<any>;
}

@Injectable()
export class FieldControlService {
  toFormGroup(fields: any, data: any): FormInstance {
    const group: any = {};
    const formFields: Array<any> = [];
    _.forEach(fields, (field: any, key) => {
      if (field.controlType === 'group') {
        const embeddedForm: Array<FormInstance> = _.map(data[key], arrayValue =>
          this.toFormGroup(field.embeddedForm, arrayValue)
        );
        group[key] = new FormArray(embeddedForm.map(form => form.form));
      } else if (field.controlType === 'section') {
        const embeddedForm: FormInstance = this.toFormGroup(field.embeddedForm, data[key] || {});
        group[key] = embeddedForm.form;
      } else {
        group[key] = new FormControl(data[key] || field.defaultValue, field.validators);
      }

      if ((field.disabled || field.disableOnTrue) && data[key]) {
        field.disabled = true;
      }

      formFields.push({ ...field, key });
    });

    return { form: new FormGroup(group), fields: formFields };
  }
}
