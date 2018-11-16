import { Component } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';

import { DatePickerField, SliderField } from 'subrepos/forms-ngx';
import { IFormDescriptor } from 'subrepos/forms-ngx';

import * as actions from '@common.features/settings/store/actions';
import * as fromSelectors from '@common.features/settings/store/selectors';

@Component({
  selector: 'gtrack-common-hike-day',
  template: ''
})
export class HikeDayComponent {
  public handledFormDescriptor: IFormDescriptor;

  constructor(private _store: Store<any>) {
    this.handledFormDescriptor = {
      formDataSelector: fromSelectors.selectHikeProgramSettingsFeature,
      submit: {
        submitFv: (formGroup: FormGroup) => {
          this._store.dispatch(new actions.ChangeHikeProgramStartDate(formGroup.value.hikeDate)),
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
