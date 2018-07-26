import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as _ from 'lodash';

import { ILocalizationState } from 'subrepos/localize-ngx';
import { domain } from './state';

const selectFeature = createFeatureSelector<ILocalizationState>(domain);

export const currentLanguage = createSelector(selectFeature, state => _.get(state, 'actualLanguage', null));
