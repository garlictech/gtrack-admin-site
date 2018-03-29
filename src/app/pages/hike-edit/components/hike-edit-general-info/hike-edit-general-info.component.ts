
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operators';
import { State, hikeEditGeneralInfoActions } from 'app/store';
import { HikeEditGeneralInfoSelectors, HikeEditRoutePlannerSelectors } from 'app/store/selectors';
import { IGeneralInfoState, IHikeEditRoutePlannerState } from 'app/store/state';
import { ITextualDescriptionItem } from 'app/shared/interfaces';
import { DESCRIPTION_LANGUAGES, LanguageService } from 'app/shared/services';
import { ITextualDescription } from 'subrepos/provider-client';

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
  public existingLangKeys$: Observable<string[] | number[]>;
  public hikeForm: FormGroup;
  public langs = DESCRIPTION_LANGUAGES;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _formBuilder: FormBuilder,
    private _hikeEditGeneralInfoSelectors: HikeEditGeneralInfoSelectors,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
  ) {}

  ngOnInit() {
    // Selectors
    this.existingLangKeys$ = this._store.select(
      this._hikeEditGeneralInfoSelectors.getAllLangKeys
    );
    this.textualDescriptions$ = this._store.select(
      this._hikeEditGeneralInfoSelectors.getAllDescriptions
    );
    this.generalInfo$ = this._store.select(this._hikeEditGeneralInfoSelectors.getGeneralInfo);
    this.isRoundTrip$ = this._store.select(this._hikeEditRoutePlannerSelectors.getIsRoundTrip);

    this.isRoundTrip$
      .subscribe((isRoundTrip: boolean) => {
        this._store.dispatch(new hikeEditGeneralInfoActions.SetIsRoundTrip({
          isRoundTrip: isRoundTrip
        }));
      });

    this._initFormSubscriptions();
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  public saveToStore() {
    /*
    this._store.dispatch(new hikeEditGeneralInfoActions.SetGeneralInfo({
      isRoundTrip: this.hikeForm.controls.isRoundTrip.value,
      difficulty: this.hikeForm.controls.difficulty.value
    }));
    */

    this._store.dispatch(new hikeEditGeneralInfoActions.SetDescriptions({
      descriptions: this.hikeForm.value.langs
    }));
  }

  private _initFormSubscriptions() {
    this.hikeForm = this._formBuilder.group({
      _selLang: new FormControl('', []),
      difficulty: 1,
      langs: this._formBuilder.array([])
    });

    this.generalInfo$
      // .filter(generalInfo => generalInfo)
      .take(1)
      // .takeUntil(this._destroy$)
      .subscribe((generalInfo) => {
        console.log('generalInfo for minit', generalInfo);
        this.hikeForm.patchValue({
          difficulty: generalInfo.difficulty
        })
      });

    this.textualDescriptions$
      .takeUntil(this._destroy$)
      .subscribe((descriptions) => {
        let _descriptionArray = <FormArray>this.hikeForm.controls.langs;

        for (let desc of descriptions) {
          let _langIdx = _.map(_descriptionArray.value, 'id').indexOf(desc.id);

          // Insert new language
          if (_langIdx < 0) {
            const formArrayItem = this._createDescriptionItem(desc);
            _descriptionArray.push(formArrayItem);
          // Update existing language
          } else {
            _descriptionArray.at(_langIdx).patchValue(desc);
          }
        }
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

  /*
  public removeTextualDescription(i: number) {
      const control = <FormArray>this.descriptionForm.controls.langs;
      control.removeAt(i);
  }
  */

  /**
   * Add new language to descriptions
   */
  public addTranslation() {
    if (this.hikeForm.controls._selLang.value) {
      this._store.dispatch(new hikeEditGeneralInfoActions.AddDescription({
        description: {
          id: this.hikeForm.controls._selLang.value,
          title: '',
          fullDescription: '',
          summary: ''
        }
      }));

      // Clear lang selector guide
      this.hikeForm.controls._selLang.setValue('');
    }
  }

  public getLangName(key) {
    return LanguageService.localeToName(key);
  }
}
