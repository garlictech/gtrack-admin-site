import { Component, OnInit } from '@angular/core';
import { commonSettingsForm } from '../common-settings-form';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { State } from 'app/store';
import { Selectors } from '../store';

import { EProfileGroup } from '../interfaces';
import { TimePickerField, SliderField } from 'subrepos/forms-ngx';

@Component({
  selector: 'gtrack-user-settings-form',
  templateUrl: './ui.pug',
  styleUrls: ['./style.scss']
})
export class UserSettingsFormComponent implements OnInit {
  public formFields;

  constructor(private _store: Store<State>) {}

  ngOnInit() {
    this.formFields = {
      ...commonSettingsForm,
      startTime: new TimePickerField({
        required: false,
        submitOnChange: true
      }),
      speed: new SliderField({
        required: false,
        submitOnChange: true,
        min: 1,
        max: 10
      })
    };
  }
}
