import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { SectionFieldOptions } from '../field/section';

@Component({
  selector: 'app-native-form-section',
  template: ''
})
export class DynamicFormSectionComponent implements OnInit {
  @Input() controlGroup: FormGroup;
  @Input() fields: SectionFieldOptions;
  formFields: Array<any>;

  constructor() {
    this.formFields = [];
  }

  ngOnInit(): void {
    _.forEach(this.fields.embeddedForm, (field: any, key) => {
      this.formFields.push({ ...field, key });
    });
  }
}
