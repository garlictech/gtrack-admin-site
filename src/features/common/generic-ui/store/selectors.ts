import { createFeatureSelector, createSelector } from '@ngrx/store';

import { featureName, State } from './state';

export const selectFeature = createFeatureSelector<State>(featureName);

export const selectProgressSpinnerOn = createSelector(
  selectFeature,
  (state: State) => state.progressSpinnerOn
);
export const selectProgressSpinnerText = createSelector(
  selectFeature,
  (state: State) => state.progressSpinnerText
);
