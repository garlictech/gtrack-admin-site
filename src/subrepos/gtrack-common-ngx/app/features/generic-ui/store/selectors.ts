import { createSelector, createFeatureSelector } from '@ngrx/store';

import { IState, featureName } from './state';

const uiFeature = createFeatureSelector<IState>(featureName);

export const selectProgressSpinnerOn = createSelector(
  uiFeature,
  (state: IState) => state.progressSpinnerOn
);
export const selectProgressSpinnerText = createSelector(
  uiFeature,
  (state: IState) => state.progressSpinnerText
);
