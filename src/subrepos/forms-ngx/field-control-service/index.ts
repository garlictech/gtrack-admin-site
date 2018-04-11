import { Injectable } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import * as _ from 'lodash';

import { Field } from '../field';

export interface IFormInstance {
  form: FormGroup;
  fields: any[];
}

@Injectable()
export class FieldControlService {
  toFormGroup(fields: any, data: any): IFormInstance {
    let group: any = {};
    let formFields: any[] = [];
    _.forEach(fields, (field: any, key) => {
      if (field.controlType === 'group') {
        let embeddedForm: IFormInstance[] = _.map(data[key], arrayValue =>
          this.toFormGroup(field.embeddedForm, arrayValue)
        );
        group[key] = new FormArray(embeddedForm.map(form => form.form));
      } else if (field.controlType === 'section') {
        let embeddedForm: IFormInstance = this.toFormGroup(field.embeddedForm, data[key] || {});
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
