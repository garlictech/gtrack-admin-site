
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operators';
import { State, hikeEditGeneralInfoActions } from 'app/store';
import { HikeEditGeneralInfoSelectors, HikeEditRoutePlannerSelectors } from 'app/store/selectors';
import { IGeneralInfoState, IHikeEditRoutePlannerState, IHikeEditGeneralInfoState } from 'app/store/state';
import { ITextualDescriptionItem } from 'app/shared/interfaces';
import { DESCRIPTION_LANGUAGES, LanguageService } from 'app/shared/services';
import { ITextualDescription } from 'subrepos/provider-client';
import { HikeSelectors, IHikeContextState } from 'subrepos/gtrack-common-ngx';

import * as _ from 'lodash';

@Component({
  selector: 'gt-hike-edit-general-info',
  templateUrl: './hike-edit-general-info.component.html',
  styleUrls: ['./hike-edit-general-info.component.scss']
})
export class HikeEditGeneralInfoComponent implements OnInit, OnDestroy {
  public textualDescriptions$: Observable<ITextualDescriptionItem[]>;
  public generalInfo$: Observable<IGeneralInfoState>;
  public isRoundTrip$: Observable<boolean>;
  public existingLangKeys: string[] = [];
  public hikeForm: FormGroup;
  public langs = DESCRIPTION_LANGUAGES;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _formBuilder: FormBuilder,
    private _hikeEditGeneralInfoSelectors: HikeEditGeneralInfoSelectors,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _hikeSelectors: HikeSelectors,
  ) {}

  ngOnInit() {
    // Selectors
    this.textualDescriptions$ = this._store.select(
      this._hikeEditGeneralInfoSelectors.getAllDescriptions
    );
    this.generalInfo$ = this._store.select(this._hikeEditGeneralInfoSelectors.getGeneralInfo);
    this.isRoundTrip$ = this._store.select(this._hikeEditRoutePlannerSelectors.getIsRoundTrip);

    // Init forms from the store
    this._initForm();
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

    this.hikeForm.valueChanges
      .takeUntil(this._destroy$)
      .subscribe((value) => {
        this.existingLangKeys = value.langs.map(lang => lang.id);
      });

    // Fill the form on the 1st time
    this._store
      .select(this._hikeEditGeneralInfoSelectors.getInitialized)
      .skipWhile(initialized => !initialized)
      .take(1)
      .subscribe((initialized: boolean) => {
        this.generalInfo$
          .take(1)
          .subscribe((generalInfo) => {
            this.hikeForm.patchValue({
              difficulty: generalInfo.difficulty
            });
          });

        this.textualDescriptions$
          .take(1)
          .subscribe((descriptions) => {
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
          .subscribe((value) => {
            this._saveToStore();
          });
      });
  }

  private _createDescriptionItem(desc) {
    return this._formBuilder.group({
        id: [desc.id || ''],
        title: [desc.title || ''],
        fullDescription: [desc.fullDescription || ''],
        summary: [desc.summary || ''],
    });
  }

  private _saveToStore() {
    this._store.dispatch(new hikeEditGeneralInfoActions.SetDifficulty({
      difficulty: this.hikeForm.controls.difficulty.value
    }));

    this._store.dispatch(new hikeEditGeneralInfoActions.SetDescriptions({
      descriptions: this.hikeForm.value.langs
    }));
  }

  public addTranslation() {
    if (this.hikeForm.controls._selLang.value) {
      (<FormArray>this.hikeForm.controls.langs).push(
        this._createDescriptionItem({
          id: this.hikeForm.controls._selLang.value,
          title: '',
          fullDescription: '',
          summary: ''
        })
      );

      // Clear lang selector guide
      this.hikeForm.controls._selLang.setValue('');
    }
  }

  public deleteTranslation(lang) {
    (<FormArray>this.hikeForm.controls.langs).removeAt(
      (<FormArray>this.hikeForm.controls.langs).value.findIndex(translation => translation.id === lang)
    );
  }

  public getLangName(key) {
    return LanguageService.localeToName(key);
  }
}
