import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';
import { State, hikeEditGeneralInfoActions } from 'app/store';
import { HikeEditGeneralInfoSelectors, HikeEditRoutePlannerSelectors } from 'app/store/selectors';
import { IGeneralInfoState, IHikeEditRoutePlannerState, IHikeEditGeneralInfoState } from 'app/store/state';
import { HikeSelectors, IHikeContextState } from 'subrepos/gtrack-common-ngx';

import { selectDescriptions, dataPath as descriptionDataPath } from 'app/store/selectors/hike-program';

import * as HikeProgramActions from 'app/store/actions/hike-program';

@Component({
  selector: 'gt-hike-edit-general-info',
  templateUrl: './hike-edit-general-info.component.pug',
  styleUrls: ['./hike-edit-general-info.component.scss']
})
export class HikeEditGeneralInfoComponent implements OnInit, OnDestroy {
  public generalInfo$: Observable<IGeneralInfoState>;
  public isRoundTrip$: Observable<boolean>;

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
    // Selectors
    this.generalInfo$ = this._store.select(this._hikeEditGeneralInfoSelectors.getGeneralInfo);
    this.isRoundTrip$ = this._store.select(this._hikeEditRoutePlannerSelectors.getIsRoundTrip);
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  /**
   * Initialize form and configure saving
   */
  private _initForm() {
    this.hikeForm = this._formBuilder.group({
      _selLang: new FormControl('', []),
      difficulty: 1,
      langs: this._formBuilder.array([])
    });

    this.hikeForm.valueChanges.takeUntil(this._destroy$).subscribe(value => {
      this.existingLangKeys = value.langs.map(lang => lang.id);
    });

    // Fill the form on the 1st time

    this._store
      .select(this._hikeEditGeneralInfoSelectors.getInitialized)
      .filter(initialized => initialized)
      // .takeUntil(this._destroy$)
      .take(1)
      .subscribe((initialized: boolean) => {
        this.generalInfo$.take(1).subscribe(generalInfo => {
          this.hikeForm.patchValue({
            difficulty: generalInfo.difficulty
          });
        });

        this.textualDescriptions$.take(1).subscribe(descriptions => {
          let _descriptionArray = <FormArray>this.hikeForm.controls.langs;

          for (let desc of descriptions) {
            let _langIdx = _.map(_descriptionArray.value, 'id').indexOf(desc.id);

            // Insert new language
            if (_langIdx < 0) {
              _descriptionArray.push(this._createDescriptionItem(desc));
              // Update existing language
            } else {
              _descriptionArray.at(_langIdx).patchValue(desc);
            }
          }
        });

        // Save to store
        this.hikeForm.valueChanges
          .debounceTime(1000)
          .takeUntil(this._destroy$)
          .subscribe(value => {
            this._saveToStore();
          });
      });
  }

  private _createDescriptionItem(desc) {
    return this._formBuilder.group({
      id: [desc.id || ''],
      title: [desc.title || ''],
      fullDescription: [desc.fullDescription || ''],
      summary: [desc.summary || '']
    });
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
