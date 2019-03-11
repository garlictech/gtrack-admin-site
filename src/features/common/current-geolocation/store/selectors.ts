import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CurrentGeolocationState, featureName } from './state';

export const selectFeature = createFeatureSelector<CurrentGeolocationState>(featureName);

export const selectTracking = createSelector(
  selectFeature,
  (state: CurrentGeolocationState) => state.tracking
);

export const selectCurrentLocation = createSelector(
  selectFeature,
  (state: CurrentGeolocationState) => state.currentLocation
);
