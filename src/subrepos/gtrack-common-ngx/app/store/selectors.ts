import { createSelector, createFeatureSelector } from '@ngrx/store';

import { CommonState } from './state';
import { IBackgroundGeolocationState } from './reducers/background-geolocation';

// Geolocation selectors
let geolocationBaseFeature = createFeatureSelector<IBackgroundGeolocationState>('geolocation');

export const selectCurrentLocation = createSelector(
  geolocationBaseFeature,
  (state: IBackgroundGeolocationState) => state.currentLocation
);

export const selectTracking = createSelector(
  geolocationBaseFeature,
  (state: IBackgroundGeolocationState) => state.tracking
);
