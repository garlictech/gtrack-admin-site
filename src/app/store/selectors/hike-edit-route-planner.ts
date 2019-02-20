import _get from 'lodash-es/get';

import { createFeatureSelector, createSelector } from '@ngrx/store';
import turfDistance from '@turf/distance';
import { point as turfPoint } from '@turf/helpers';

import { HikeEditRoutePlannerState } from '../state/hike-edit-route-planner';

const featureSelector = createFeatureSelector<HikeEditRoutePlannerState>('hikeEditRoutePlanner');

export const getRoutePlanner = createSelector(
  featureSelector,
  (state: HikeEditRoutePlannerState) => state
);
export const getRoute = createSelector(
  featureSelector,
  (state: HikeEditRoutePlannerState) => state.route
);
export const getPath = createSelector(
  featureSelector,
  (state: HikeEditRoutePlannerState) => state.route.features[0]
);
export const getPathLength = createSelector(
  featureSelector,
  (state: HikeEditRoutePlannerState) => _get(state.route.features[0], 'geometry.coordinates', []).length
);
export const getSegments = createSelector(
  featureSelector,
  (state: HikeEditRoutePlannerState) => state.segments
);
export const getTotal = createSelector(
  featureSelector,
  (state: HikeEditRoutePlannerState) => state.total
);
export const getIsPlanning = createSelector(
  featureSelector,
  (state: HikeEditRoutePlannerState) => state.planning
);
export const getIsRouting = createSelector(
  featureSelector,
  (state: HikeEditRoutePlannerState) => state.routing
);
export const getIsRoundTrip = createSelector(
  featureSelector,
  (state: HikeEditRoutePlannerState) => {
    const _coords = _get(state.route, 'features[0].geometry.coordinates', undefined);

    if (_coords && _coords.length > 1) {
      const _dist = Math.round(
        1000 *
          turfDistance(
            turfPoint([_coords[0][1], _coords[0][0]]),
            turfPoint([_coords[_coords.length - 1][1], _coords[_coords.length - 1][0]]),
            { units: 'kilometers' }
          )
      );

      return _dist <= 10;
    } else {
      return false;
    }
  }
);
