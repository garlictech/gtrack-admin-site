import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { DatePickerField, MultiSelectField, PhoneNumberField, TextboxField } from '@features/common/forms';

import { commonBasicProfileFOrmDescriptor } from '../common-basic-profile-form';
import { languages } from '../services/settings-service';

@Component({
  selector: 'gtrack-user-basic-profile-form',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserBasicProfileFormComponent implements OnInit {
  formFields;

  ngOnInit(): void {
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
