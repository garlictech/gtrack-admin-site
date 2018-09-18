import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Store, createFeatureSelector, createSelector, select } from '@ngrx/store';
import _get from 'lodash-es/get';
import { Observable } from 'rxjs';

import { ILocalizationState } from 'subrepos/localize-ngx';

const selectFeature = createFeatureSelector<ILocalizationState>('language');

export const currentLanguage = createSelector(selectFeature, state => _get(state, 'actualLanguage', null));

export const descriptionLanguageList = createSelector(selectFeature, state =>
  _get(state, 'descriptionLanguageList', [])
);

// The various property selectors. Consider using the reselect package.
@Injectable()
export class LocalizeSelectors {
  constructor(private _store: Store<any>) {
    /* EMPTY */
  }

  getCurrentLanguage(): Observable<string> {
    return this._store.pipe(select(currentLanguage));
  }

  getDescriptionLanguageList(): Observable<string[]> {
    return this._store.pipe(select(descriptionLanguageList));
  }

  getLanguageSettings(): Observable<ILocalizationState> {
    return this._store.pipe(
      select(selectFeature),
      map(state => ({
        actualLanguage: _get(state, 'language', 'en_US'),
        descriptionLanguageList: _get(state, 'descriptionLanguageList', [])
      }))
    );
  }
}
