import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store, MemoizedSelector } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { State, editedHikeProgramActions } from 'app/store';
import { HikeEditRoutePlannerSelectors, EditedHikeProgramSelectors } from 'app/store/selectors';
import { IHikeEditRoutePlannerState } from 'app/store/state';

import { HikeSelectors, IHikeContextState } from 'subrepos/gtrack-common-ngx';
import { IFormDescriptor, SliderField, TextboxField } from 'subrepos/forms-ngx';
import { ILocalizedItem, ITextualDescription, IHikeProgramStored } from 'subrepos/provider-client';

import * as _ from 'lodash';

@Component({
  selector: 'gt-hike-edit-general-info',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class HikeEditGeneralInfoComponent implements OnInit, OnDestroy, AfterViewInit {
  public hikeProgramData$: Observable<IHikeProgramStored>;
  public isRoundTrip$: Observable<boolean>;
  public remoteError$: Observable<any>;
  public formDataPath$ = Observable.of('editedHikeProgram.data');
  public generalInfoFormDescriptor: IFormDescriptor;

  public storeDataPath: string;
  public descriptionSelector: MemoizedSelector<object, ILocalizedItem<ITextualDescription>>;

  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _editedHikeProgramSelectors: EditedHikeProgramSelectors,
    private _hikeSelectors: HikeSelectors,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._initDescriptionFormConfig();

    // Selectors
    this.isRoundTrip$ = this._store
      .select(this._hikeEditRoutePlannerSelectors.getIsRoundTrip)
      .takeUntil(this._destroy$);

    this.hikeProgramData$ = this._store
      .select(this._editedHikeProgramSelectors.getData)
      .takeUntil(this._destroy$);

    this.remoteError$ = this._store
      .select(this._editedHikeProgramSelectors.getError)
      .takeUntil(this._destroy$);

    this.isRoundTrip$
      .takeUntil(this._destroy$)
      .subscribe((isRoundTrip: boolean) => {
        this._store.dispatch(new editedHikeProgramActions.AddHikeProgramDetails({
          isRoundTrip: isRoundTrip
        }, false));
      });
  }

  ngAfterViewInit() {
    this._changeDetectorRef.detectChanges();
  }

  private _initDescriptionFormConfig() {
    this.descriptionSelector = this._editedHikeProgramSelectors.getDescriptions;
    this.storeDataPath = `${this._editedHikeProgramSelectors.dataPath}.description`;

    this.generalInfoFormDescriptor = {
      submit: {
        translatableLabel: 'form.submit',
        classList: ['btn', 'btn-sm', 'btn-fill', 'btn-success'],
        submitFv: (formGroup: FormGroup) => {
          return this._store.dispatch(new editedHikeProgramActions.AddHikeProgramDetails(formGroup.value, true));
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
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  public submitDescription = (langKey: string, data: any) => {
    this._store.dispatch(new editedHikeProgramActions.AddNewTranslatedHikeProgramDescription(langKey, data));
  };

  public deleteDescription = lang => {
    this._store.dispatch(new editedHikeProgramActions.DeleteTranslatedHikeProgramDescription(lang));
  };
}
