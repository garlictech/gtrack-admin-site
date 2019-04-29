import { Component, OnInit } from '@angular/core';
import { SliderField, TimePickerField } from '@features/common/forms';

import { commonSettingsForm } from '../../const';

@Component({
  selector: 'gtrack-user-settings-form',
  templateUrl: './user-settings-form.component.html',
  styleUrls: ['./user-settings-form.component.scss']
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
