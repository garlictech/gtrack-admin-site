import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IHikeEditRoutePlannerState } from '../state/hike-edit-route-planner';
import { point as turfPoint } from '@turf/helpers';
import turfDistance from '@turf/distance';

import _get from 'lodash-es/get';

const featureSelector = createFeatureSelector<IHikeEditRoutePlannerState>('hikeEditRoutePlanner');

export const getRoutePlanner = createSelector(featureSelector, (state: IHikeEditRoutePlannerState) => state);
export const getRoute = createSelector(featureSelector, (state: IHikeEditRoutePlannerState) => state.route);
export const getPath = createSelector(featureSelector, (state: IHikeEditRoutePlannerState) =>
  state.route.features[0]
);
export const getPathLength = createSelector(featureSelector, (state: IHikeEditRoutePlannerState) =>
  _get(state.route.features[0], 'geometry.coordinates', []).length
);
export const getSegments = createSelector(featureSelector, (state: IHikeEditRoutePlannerState) => state.segments);
export const getTotal = createSelector(featureSelector, (state: IHikeEditRoutePlannerState) => state.total);
export const getIsPlanning = createSelector(featureSelector, (state: IHikeEditRoutePlannerState) => state.planning);
export const getIsRouting = createSelector(featureSelector, (state: IHikeEditRoutePlannerState) => state.routing);
export const getIsRoundTrip = createSelector(featureSelector, (state: IHikeEditRoutePlannerState) => {
  const _coords = _get(state.route, 'features[0].geometry.coordinates', null);

  if (_coords && _coords.length > 1) {
    const _dist = Math.round(
      1000 * turfDistance(
        turfPoint([_coords[0][1], _coords[0][0]]),
        turfPoint([_coords[_coords.length - 1][1], _coords[_coords.length - 1][0]]),
        { units: 'kilometers' }
    ));

    return _dist <= 10;
  } else {
    return false;
  }
});
