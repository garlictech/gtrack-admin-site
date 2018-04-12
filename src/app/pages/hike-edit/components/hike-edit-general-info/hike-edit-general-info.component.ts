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
import { ITextualDescription, ILocalizedItem } from 'subrepos/provider-client';
import { HikeSelectors, IHikeContextState } from 'subrepos/gtrack-common-ngx';
import { TextboxField, TextareaField, EmojiField, IFormDescriptor } from 'subrepos/forms-ngx';

import { selectDescriptions, dataPath as descriptionDataPath } from 'app/store/selectors/hike-program';

import * as HikeProgramActions from 'app/store/actions/hike-program';

import * as _ from 'lodash';

@Component({
  selector: 'gt-hike-edit-general-info',
  templateUrl: './hike-edit-general-info.component.pug',
  styleUrls: ['./hike-edit-general-info.component.scss']
})
export class HikeEditGeneralInfoComponent implements OnInit, OnDestroy {
  public descriptions$: Observable<ILocalizedItem<ITextualDescription>>;
  public languageKeys$: Observable<string[]>;
  public selectableLanguages$: Observable<{ label: string; value: string }[]>;
  public generalInfo$: Observable<IGeneralInfoState>;
  public isRoundTrip$: Observable<boolean>;
  public existingLangKeys: string[] = [];
  public langs = DESCRIPTION_LANGUAGES;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  public selectedLanguage;

  constructor(
    private _store: Store<State>,
    private _formBuilder: FormBuilder,
    private _hikeEditGeneralInfoSelectors: HikeEditGeneralInfoSelectors,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _hikeSelectors: HikeSelectors
  ) {}

  ngOnInit() {
    this.descriptions$ = this._store.select(selectDescriptions);
    this.languageKeys$ = this._store.select(selectDescriptions).map(desc => Object.keys(desc));
    this.selectableLanguages$ = this.languageKeys$.map(usedKeys =>
      DESCRIPTION_LANGUAGES.filter(lang => usedKeys.indexOf(lang.locale) === -1).map(lang => {
        return { label: lang.name, value: lang.locale };
      })
    );

    // Selectors
    this.generalInfo$ = this._store.select(this._hikeEditGeneralInfoSelectors.getGeneralInfo);
    this.isRoundTrip$ = this._store.select(this._hikeEditRoutePlannerSelectors.getIsRoundTrip);
  }

  getLanguageFormDescriptor(languageKey: string) {
    return {
      submit: {
        translatableLabel: 'form.submit',
        classList: ['btn', 'btn-sm', 'btn-fill', 'btn-success'],
        submitFv: (formGroup: FormGroup) => {
          this._store.dispatch(new HikeProgramActions.AddNewTranslatedDescription(languageKey, formGroup.value));
        }
      },
      fields: {
        title: new TextboxField({
          label: 'form.title',
          required: true
        }),
        summary: new TextareaField({
          label: 'form.summary',
          required: false,
          rows: 2
        }),
        description: new EmojiField({ label: 'form.description', required: false })
      }
    };
  }

  getLanguageFormDataPath(languageKey: string) {
    return Observable.of(`${descriptionDataPath}.description.${languageKey}`);
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

  public addTranslation() {
    if (this.selectedLanguage) {
      this._store.dispatch(
        new HikeProgramActions.AddNewTranslatedDescription(this.selectedLanguage.value, { title: 'A new hike' })
      );
    }
  }

  public deleteTranslation(lang) {
    this._store.dispatch(new HikeProgramActions.DeleteTranslatedDescription(this.selectedLanguage.value));
  }

  public getLangName(key) {
    return LanguageService.localeToName(key);
  }
}
