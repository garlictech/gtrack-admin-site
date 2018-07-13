import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Store, createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { ILocalizedItem, ITextualDescription } from '../../../../provider-client';
import { State } from 'app/store/state';
import { Selectors as LanguageSelectors } from 'app/language';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ILocalizationState } from '../../../../localize-ngx';

import * as _ from 'lodash';

import 'rxjs/add/operator/take';

@Pipe({
  name: 'localizeDescription',
  pure: false
})
export class LocalizeDescriptionPipe implements PipeTransform, OnDestroy {
  private _selectLangFeature: MemoizedSelector<object, ILocalizationState>;
  private _selectActualLang: MemoizedSelector<object, string>;
  private _actualLang$: Observable<string>;
  private _langChange: Subscription;
  private _language = 'en_US';
  private _value: ITextualDescription;

  constructor(private _store: Store<State>, private _selectors: LanguageSelectors, private _ref: ChangeDetectorRef) {
    this._selectLangFeature = createFeatureSelector<ILocalizationState>('language');
    this._selectActualLang = createSelector(this._selectLangFeature, (state: ILocalizationState) => state.actualLanguage);
    this._actualLang$ = this._store.select(this._selectActualLang);
  }

  transform(value: ILocalizedItem<ITextualDescription>): ITextualDescription {
    this._dispose();
    console.log(value);

    if (!this._langChange) {
      this._langChange = this._actualLang$
        .subscribe(language => {
          this._language = language;
          this._updateValue(value);
        });
    }

    return this._value;
  }

  ngOnDestroy() {
    this._dispose();
  }

  private _updateValue(value: ILocalizedItem<ITextualDescription>): void {
    this._actualLang$
      .take(1)
      .subscribe(language => {
        const fallback = _.get(value, 'en_US', {
          title: ''
        });

        const defaults: ITextualDescription = {
          title: '',
          fullDescription: '',
          summary: ''
        };

        const transformed = _.get(value, language, fallback);
        const merged: ITextualDescription = _.merge({}, defaults, transformed);
        console.log(merged);

        this._value = merged;
        this._ref.markForCheck();
      });
  }

  private _dispose(): void {
    if (typeof this._langChange !== 'undefined') {
      this._langChange.unsubscribe();
      this._langChange = undefined;
    }
  }
}
