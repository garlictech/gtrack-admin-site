import { Injectable } from '@angular/core';
import { Store, createFeatureSelector, MemoizedSelector, createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

import { ILocalizationState } from 'subrepos/localize-ngx';

const selectFeature = createFeatureSelector<ILocalizationState>('language');

export const currentLanguage = createSelector(selectFeature, state => _.get(state, 'actualLanguage', null));

export const descriptionLanguageList = createSelector(selectFeature, state =>
  _.get(state, 'descriptionLanguageList', [])
);

// The various property selectors. Consider using the reselect package.
@Injectable()
export class LocalizeSelectors {
  constructor(private _store: Store<any>) {
    /* EMPTY */
  }

  getCurrentLanguage(): Observable<string> {
    return this._store.select(currentLanguage);
  }

  getDescriptionLanguageList(): Observable<string[]> {
    return this._store.select(descriptionLanguageList);
  }

  getLanguageSettings(): Observable<ILocalizationState> {
    return this._store.select(selectFeature).map(state => ({
      actualLanguage: _.get(state, 'language', 'en_US'),
      descriptionLanguageList: _.get(state, 'descriptionLanguageList', [])
    }));
  }
}