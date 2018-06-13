import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import * as _ from 'lodash';

import { log, DebugLog } from '../log';
import { IGroupField } from '../field';

@Component({
  selector: 'app-form-group',
  template: ''
})
export class DynamicFormGroupComponent implements OnInit {
  @Input() public controlGroup: FormArray;
  @Input() public fields: IGroupField;

  public formFields: any[] = [];

  ngOnInit() {
    _.forEach(this.fields.embeddedForm, (field: any, key) => {
      this.formFields.push({ ...field, key: key });
    });
  }

  @DebugLog
  addItem() {
    let group: any = {};

    _.forEach(this.fields.embeddedForm, (field: any, key) => {
      group[key] = new FormControl(field.defaultValue, field.validators);
    });

    this.controlGroup.insert(0, new FormGroup(group));
  }

  removeItem(index) {
    this.controlGroup.removeAt(index);
  }
}
