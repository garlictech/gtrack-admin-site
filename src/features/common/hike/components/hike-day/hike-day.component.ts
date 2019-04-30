import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DatePickerField, FormDescriptor, SliderField } from '@bit/garlictech.angular-features.common.forms';
import * as actions from '@bit/garlictech.angular-features.common.settings/store/actions';
import * as fromSelectors from '@bit/garlictech.angular-features.common.settings/store/selectors';
import { Store } from '@ngrx/store';

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
          minDate: new Date(),
          containerCls: 'mb-6'
        }),
        speed: new SliderField({
          submitOnChange: true,
          min: 1,
          max: 10,
          containerCls: 'mb-6'
        })
      }
    };
  }
}
