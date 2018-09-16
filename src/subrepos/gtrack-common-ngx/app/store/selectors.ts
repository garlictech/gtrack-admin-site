import { createSelector, createFeatureSelector } from '@ngrx/store';

import { IBackgroundGeolocationState } from './reducers/background-geolocation';

// Geolocation selectors
const geolocationBaseFeature = createFeatureSelector<IBackgroundGeolocationState>('geolocation');

export const selectCurrentLocation = createSelector(
  geolocationBaseFeature,
  (state: IBackgroundGeolocationState) => state.currentLocation
);

export const selectTracking = createSelector(
  geolocationBaseFeature,
  (state: IBackgroundGeolocationState) => state.tracking
);
