import { createFeatureSelector, createSelector } from '@ngrx/store';

import _get from 'lodash-es/get';

import { ILocalizationState } from 'subrepos/localize-ngx';
import { domain } from './state';

const selectFeature = createFeatureSelector<ILocalizationState>(domain);

export const currentLanguage = createSelector(selectFeature, state => _get(state, 'actualLanguage', null));
