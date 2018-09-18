import { Injectable } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
<<<<<<< HEAD

import _forEach from 'lodash-es/forEach';
import _map from 'lodash-es/map';

=======
import * as _ from 'lodash';

>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
export interface IFormInstance {
  form: FormGroup;
  fields: any[];
}

@Injectable()
export class FieldControlService {
  toFormGroup(fields: any, data: any): IFormInstance {
    const group: any = {};
    const formFields: any[] = [];
    _forEach(fields, (field: any, key) => {
      if (field.controlType === 'group') {
        const embeddedForm: IFormInstance[] = _map(data[key], arrayValue =>
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
