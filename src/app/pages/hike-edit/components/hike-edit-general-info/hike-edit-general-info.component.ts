import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';
import { State, hikeEditGeneralInfoActions } from 'app/store';
import { HikeEditGeneralInfoSelectors, HikeEditRoutePlannerSelectors } from 'app/store/selectors';
import { IGeneralInfoState, IHikeEditRoutePlannerState, IHikeEditGeneralInfoState } from 'app/store/state';
import { HikeSelectors, IHikeContextState } from 'subrepos/gtrack-common-ngx';

import {
  selectDescriptions,
  dataPath as descriptionDataPath,
  selectError
} from 'app/store/selectors/edited-hike-program';

import * as HikeProgramActions from 'app/store/actions/edited-hike-program';
import { IFormDescriptor, SliderField, TextboxField } from 'subrepos/forms-ngx';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'gt-hike-edit-general-info',
  templateUrl: './hike-edit-general-info.component.pug',
  styleUrls: ['./hike-edit-general-info.component.scss']
})
export class HikeEditGeneralInfoComponent implements OnInit, OnDestroy {
  public generalInfo$: Observable<IGeneralInfoState>;
  public isRoundTrip$: Observable<boolean>;
  public remoteError$: Observable<any>;

  public generalInfoFormDescriptor: IFormDescriptor;

  public submitDescription = (langKey: string, data: any) => {
    this._store.dispatch(new HikeProgramActions.AddNewTranslatedDescription(langKey, data));
  };

  public deleteDescription = lang => {
    this._store.dispatch(new HikeProgramActions.DeleteTranslatedDescription(lang));
  };
  public descriptionDataPath = `${descriptionDataPath}.description`;
  public descriptionSelector = selectDescriptions;

  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _hikeEditGeneralInfoSelectors: HikeEditGeneralInfoSelectors,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _hikeSelectors: HikeSelectors
  ) {}

  ngOnInit() {
    this.generalInfoFormDescriptor = {
      submit: {
        translatableLabel: 'form.submit',
        classList: ['btn', 'btn-sm', 'btn-fill', 'btn-success'],
        submitFv: (formGroup: FormGroup) => this._store.dispatch(new HikeProgramActions.AddDetails(formGroup.value))
      },
      fields: {
        difficulty: new SliderField({
          label: 'form.difficulty',
          required: true,
          min: 0,
          max: 10
        })
      }
    };

    // Selectors
    this.generalInfo$ = this._store.select(this._hikeEditGeneralInfoSelectors.getGeneralInfo);

    this.isRoundTrip$ = this._store.select(this._hikeEditRoutePlannerSelectors.getIsRoundTrip);

    this.remoteError$ = this._store.select(selectError);
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  private _saveToStore() {
    // this._store.dispatch(
    //   new hikeEditGeneralInfoActions.SetDifficulty({
    //     difficulty: this.hikeForm.controls.difficulty.value
    //   })
    // );
    // this._store.dispatch(
    //   new hikeEditGeneralInfoActions.SetDescriptions({
    //     descriptions: this.hikeForm.value.langs
    //   })
    // );
  }
}
