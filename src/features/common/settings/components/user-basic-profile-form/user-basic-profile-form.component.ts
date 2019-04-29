import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  DatePickerField,
  MultiSelectField,
  PhoneNumberField,
  TextboxField
} from '@bit/garlictech.angular-features.common.forms';

import { commonBasicProfileFormDescriptor } from '../../const';
import { languages } from '../../services/settings-service/settings.service';

@Component({
  selector: 'gtrack-user-basic-profile-form',
  templateUrl: './user-basic-profile-form.component.html',
  styleUrls: ['./user-basic-profile-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserBasicProfileFormComponent implements OnInit {
  formFields;

  ngOnInit(): void {
    this.formFields = {
      ...commonBasicProfileFormDescriptor,
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
