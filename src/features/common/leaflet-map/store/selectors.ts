import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureName, State } from './state';

export const featureSelector = createFeatureSelector<State>(featureName);

export const getMapId = createSelector(
  featureSelector,
  (state: State) => state.mapId
);

export const selectFeatureId = createSelector(
  featureSelector,
  (state: State) => state.featureId
);
