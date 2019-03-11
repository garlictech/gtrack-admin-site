import { createFeatureSelector, createSelector } from '@ngrx/store';

import _get from 'lodash-es/get';

import { domain, LocalizationState } from './state';

const selectFeature = createFeatureSelector<LocalizationState>(domain);

export const currentLanguage = createSelector(
  selectFeature,
  state => _get(state, 'actualLanguage', undefined)
);
