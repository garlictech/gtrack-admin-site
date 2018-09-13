import { Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import { IHikeEditRoutePlannerState } from '../state/hike-edit-route-planner';
import { ISegment } from 'subrepos/gtrack-common-ngx';

import { point as turfPoint } from '@turf/helpers';
import turfDistance from '@turf/distance';

import _get from 'lodash-es/get';

@Injectable()
export class HikeEditRoutePlannerSelectors {
  private _featureSelector: MemoizedSelector<object, IHikeEditRoutePlannerState>;
  public getRoutePlanner: MemoizedSelector<object, IHikeEditRoutePlannerState>;
  public getRoute: MemoizedSelector<object, any>;
  public getPath: MemoizedSelector<object, any>;
  public getPathLength: MemoizedSelector<object, number>;
  public getSegments: MemoizedSelector<object, ISegment[]>;
  public getTotal: MemoizedSelector<object, any>;
  public getIsRoundTrip: MemoizedSelector<object, boolean>;
  public getIsRouting: MemoizedSelector<object, boolean>;
  public getIsPlanning: MemoizedSelector<object, boolean>;

  constructor() {
    this._featureSelector = createFeatureSelector<IHikeEditRoutePlannerState>('hikeEditRoutePlanner');

    this.getRoutePlanner = createSelector(this._featureSelector,
      (state: IHikeEditRoutePlannerState) => state
    );

    this.getRoute = createSelector(this._featureSelector,
      (state: IHikeEditRoutePlannerState) => state.route
    );

    this.getPath = createSelector(this._featureSelector,
      (state: IHikeEditRoutePlannerState) => state.route.features[0]
    );

    this.getPathLength = createSelector(this._featureSelector,
      (state: IHikeEditRoutePlannerState) => _get(state.route.features[0], 'geometry.coordinates', []).length
    );

    this.getSegments = createSelector(this._featureSelector,
      (state: IHikeEditRoutePlannerState) => state.segments
    );

    this.getTotal = createSelector(this._featureSelector,
      (state: IHikeEditRoutePlannerState) => state.total
    );

    this.getIsRoundTrip = createSelector(this._featureSelector,
      (state: IHikeEditRoutePlannerState) => {
        const _coords = _get(state.route, 'features[0].geometry.coordinates', null);

        if (_coords && _coords.length > 1) {
          const _dist = Math.round(1000 * turfDistance(
            turfPoint([_coords[0][1], _coords[0][0]]),
            turfPoint([_coords[_coords.length - 1][1], _coords[_coords.length - 1][0]]),
            {units: 'kilometers'}
          ));

          return _dist <= 5;
        } else {
          return false;
        }
      }
    );

    this.getIsPlanning = createSelector(this._featureSelector,
      (state: IHikeEditRoutePlannerState) => state.planning
    );

    this.getIsRouting = createSelector(this._featureSelector,
      (state: IHikeEditRoutePlannerState) => state.routing
    );
  }
}
