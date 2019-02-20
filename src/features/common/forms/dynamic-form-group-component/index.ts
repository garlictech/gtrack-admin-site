import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { GroupFieldOptions } from '../field';
import { DebugLog } from '../log';

@Component({
  selector: 'app-native-form-group',
  template: ''
})
export class DynamicFormGroupComponent implements OnInit {
  @Input() controlGroup: FormArray;
  @Input() fields: GroupFieldOptions;
  formFields: Array<any>;

  constructor() {
    this.formFields = [];
  }

  ngOnInit(): void {
    _.forEach(this.fields.embeddedForm, (field: any, key) => {
      this.formFields.push({ ...field, key });
    });
  }

  @DebugLog addItem(): void {
    const group: any = {};

    _.forEach(this.fields.embeddedForm, (field: any, key) => {
      group[key] = new FormControl(field.defaultValue, field.validators);
    });

    this.controlGroup.insert(0, new FormGroup(group));
  }

  removeItem(index): void {
    this.controlGroup.removeAt(index);
  }
}
