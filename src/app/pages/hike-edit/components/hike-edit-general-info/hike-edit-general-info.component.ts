import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store, MemoizedSelector } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { State, hikeEditGeneralInfoActions, editedHikeProgramActions } from 'app/store';
import {
  HikeEditGeneralInfoSelectors, HikeEditRoutePlannerSelectors, EditedHikeProgramSelectors
} from 'app/store/selectors';
import { IGeneralInfoState, IHikeEditRoutePlannerState, IHikeEditGeneralInfoState } from 'app/store/state';

import { HikeSelectors, IHikeContextState } from 'subrepos/gtrack-common-ngx';
import { IFormDescriptor, SliderField, TextboxField } from 'subrepos/forms-ngx';
import { ILocalizedItem, ITextualDescription } from 'subrepos/provider-client';

import * as _ from 'lodash';

@Component({
  selector: 'gt-hike-edit-general-info',
  templateUrl: './hike-edit-general-info.component.html',
  styleUrls: ['./hike-edit-general-info.component.scss']
})
export class HikeEditGeneralInfoComponent implements OnInit, OnDestroy {
  public generalInfo$: Observable<IGeneralInfoState>;
  public isRoundTrip$: Observable<boolean>;
  public remoteError$: Observable<any>;

  public generalInfoFormDescriptor: IFormDescriptor;

  public storeDataPath: string;
  public descriptionSelector: MemoizedSelector<object, ILocalizedItem<ITextualDescription>>;

  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _hikeEditGeneralInfoSelectors: HikeEditGeneralInfoSelectors,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _editedHikeProgramSelectors: EditedHikeProgramSelectors,
    private _hikeSelectors: HikeSelectors
  ) {
    this.descriptionSelector = this._editedHikeProgramSelectors.getDescriptions;
    this.storeDataPath = `${this._editedHikeProgramSelectors.dataPath}.description`;
  }

  ngOnInit() {
    this.generalInfoFormDescriptor = {
      submit: {
        translatableLabel: 'form.submit',
        classList: ['btn', 'btn-sm', 'btn-fill', 'btn-success'],
        submitFv: (formGroup: FormGroup) => {
          return this._store.dispatch(new editedHikeProgramActions.AddHikeProgramDetails(formGroup.value));
        }
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
    this.generalInfo$ = this._store
      .select(this._hikeEditGeneralInfoSelectors.getGeneralInfo)
      .takeUntil(this._destroy$);

    this.isRoundTrip$ = this._store
      .select(this._hikeEditRoutePlannerSelectors.getIsRoundTrip)
      .takeUntil(this._destroy$);

    this.remoteError$ = this._store
      .select(this._editedHikeProgramSelectors.getError)
      .takeUntil(this._destroy$);
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

  public submitDescription = (langKey: string, data: any) => {
    this._store.dispatch(new editedHikeProgramActions.AddNewTranslatedHikeProgramDescription(langKey, data));
  };

  public deleteDescription = lang => {
    this._store.dispatch(new editedHikeProgramActions.DeleteTranslatedHikeProgramDescription(lang));
  };
}
