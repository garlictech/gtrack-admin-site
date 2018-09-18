import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import _forEach from 'lodash-es/forEach';

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
