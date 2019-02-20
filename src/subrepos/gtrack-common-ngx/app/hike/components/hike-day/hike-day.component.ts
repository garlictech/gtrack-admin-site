import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';

import { DatePickerField, FormDescriptor, SliderField } from '@features/common/forms';

import * as actions from '@features/common/settings/store/actions';
import * as fromSelectors from '@features/common/settings/store/selectors';

@Component({
  selector: 'gtrack-common-hike-day',
  template: ''
})
export class HikeDayComponent {
  handledFormDescriptor: FormDescriptor;

  constructor(private readonly _store: Store<any>) {
    this.handledFormDescriptor = {
      formDataSelector: fromSelectors.selectHikeProgramSettingsFeature,
      submit: {
        submitFv: (formGroup: FormGroup) => {
          this._store.dispatch(new actions.ChangeHikeProgramStartDate(formGroup.value.hikeDate));
          this._store.dispatch(new actions.ChangeHikeProgramSpeed(formGroup.value.speed));
        }
      },
      fields: {
        hikeDate: new DatePickerField({
          submitOnChange: true,
          showTime: true,
          minDate: new Date()
        }),
        speed: new SliderField({
          submitOnChange: true,
          min: 1,
          max: 10
        })
      }
    };
  }
}
