import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { TextboxField, DatePickerField, MultiSelectField, PhoneNumberField, TimePickerField } from 'subrepos/forms-ngx';

import { languages } from '../services/settings-service';
import { commonBasicProfileFOrmDescriptor } from '../common-basic-profile-form';

@Component({
  selector: 'gtrack-user-basic-profile-form',
  templateUrl: './ui.pug',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class UserBasicProfileFormComponent implements OnInit {
  public formFields;

  ngOnInit() {
    this.formFields = {
      ...commonBasicProfileFOrmDescriptor,
      ...{
        firstName: new TextboxField({
          required: false
        }),
        lastName: new TextboxField({
          required: false
        }),
        birthDate: new DatePickerField({
          required: false,
          maxDate: new Date()
        }),
        phone: new PhoneNumberField({
          required: false
        }),
        languages: new MultiSelectField({
          required: false,
          selectOptions: languages
        })
      }
    };
  }
}
