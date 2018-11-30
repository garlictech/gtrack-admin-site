import { createSelector, createFeatureSelector } from '@ngrx/store';

import { IState, featureName } from './state';

export const selectFeature = createFeatureSelector<IState>(featureName);

export const selectProgressSpinnerOn = createSelector(
  selectFeature,
  (state: IState) => state.progressSpinnerOn
);
export const selectProgressSpinnerText = createSelector(
  selectFeature,
  (state: IState) => state.progressSpinnerText
);
