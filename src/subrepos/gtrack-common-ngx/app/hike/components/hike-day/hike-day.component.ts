import { Component } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';

import { DatePickerField } from 'subrepos/forms-ngx';
import { IFormDescriptor } from 'subrepos/forms-ngx';

import * as actions from 'app/settings/store/actions';

@Component({
  selector: 'gtrack-common-hike-day',
  template: ''
})
export class HikeDayComponent {
  public handledFormDescriptor: IFormDescriptor;

  public formDataPath = 'settings.hikeProgramSettings';
  public formDataPath$ = new ReplaySubject<string>(1);

  constructor(private _store: Store<any>) {
    this.formDataPath$.next(this.formDataPath);

    this.handledFormDescriptor = {
      submit: {
        submitFv: (formGroup: FormGroup) =>
          this._store.dispatch(new actions.ChangeHikeProgramStartDate(formGroup.value.hikeDate))

      },
      fields: {
        hikeDate: new DatePickerField({
          submitOnChange: true,
          showTime: true,
          minDate: new Date()
        })
      }
    };
  }
}
