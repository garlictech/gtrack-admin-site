import { Injectable } from '@angular/core';
import { createFeatureSelector, createSelector, select, Store } from '@ngrx/store';
import _get from 'lodash-es/get';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LocalizationState } from '@bit/garlictech.angular-features.common.localization';

const selectFeature = createFeatureSelector<LocalizationState>('language');

export const currentLanguage = createSelector(
  selectFeature,
  state => _get(state, 'actualLanguage', undefined)
);

export const descriptionLanguageList = createSelector(
  selectFeature,
  state => _get(state, 'descriptionLanguageList', [])
);

// The various property selectors. Consider using the reselect package.
@Injectable()
export class LocalizeSelectors {
  constructor(private readonly _store: Store<any>) {}

  getCurrentLanguage(): Observable<string> {
    return this._store.pipe(select(currentLanguage));
  }

  getDescriptionLanguageList(): Observable<Array<string>> {
    return this._store.pipe(select(descriptionLanguageList));
  }

  getLanguageSettings(): Observable<LocalizationState> {
    return this._store.pipe(
      select(selectFeature),
      map(state => ({
        actualLanguage: _get(state, 'language', 'en_US'),
        descriptionLanguageList: _get(state, 'descriptionLanguageList', [])
      }))
    );
  }
}
