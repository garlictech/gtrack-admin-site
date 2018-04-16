import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import * as _ from 'lodash';

import { ISectionField } from '../field';

import { log, DebugLog } from '../../log';

@Component({
  selector: 'app-dynamic-form-section',
  templateUrl: './ui.pug',
  styleUrls: ['./style.scss']
})
export class DynamicFormSectionComponent implements OnInit {
  @Input() public controlGroup: FormGroup;
  @Input() public fields: ISectionField;

  public formFields: any[] = [];

  ngOnInit() {
    _.forEach(this.fields.embeddedForm, (field: any, key) => {
      this.formFields.push({ ...field, key: key });
    });
  }
}
