import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
<<<<<<< HEAD

import _forEach from 'lodash-es/forEach';
=======
import * as _ from 'lodash';
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661

import { ISectionField } from '../field';

@Component({
  selector: 'app-form-section',
  template: ''
})
export class DynamicFormSectionComponent implements OnInit {
  @Input()
  public controlGroup: FormGroup;
  @Input()
  public fields: ISectionField;

  public formFields: any[] = [];

  ngOnInit() {
    _forEach(this.fields.embeddedForm, (field: any, key) => {
      this.formFields.push({ ...field, key: key });
    });
  }
}
