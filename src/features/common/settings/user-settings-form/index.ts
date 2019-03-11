import { SliderField, TimePickerField } from '@features/common/forms';

import { Component, OnInit } from '@angular/core';

import { commonSettingsForm } from '../common-settings-form';

@Component({
  selector: 'gtrack-user-settings-form',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class UserSettingsFormComponent implements OnInit {
  formFields;

  ngOnInit(): void {
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
