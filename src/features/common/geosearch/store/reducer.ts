// tslint:disable:only-arrow-functions no-small-switch
import { ActionReducer, ActionReducerMap, combineReducers } from '@ngrx/store';

import { AllGeoSearchActions, GeoSearchActionTypes } from './actions';
import {
  AllGeoSearchContextState,
  geoSearchAdapter,
  geoSearchContextStateAdapter,
  GeoSearchEntityState,
  GeoSearchState
} from './state';

export const geoSearchContextReducerInitialState = geoSearchContextStateAdapter.getInitialState();
export const geoSearchReducerInitialState = geoSearchAdapter.getInitialState();

const contextReducer: ActionReducer<AllGeoSearchContextState> = (
  state: AllGeoSearchContextState = geoSearchContextReducerInitialState,
  action: AllGeoSearchActions
): AllGeoSearchContextState => {
  switch (action.type) {
    case GeoSearchActionTypes.SEARCH_IN_BOX:
    case GeoSearchActionTypes.SEARCH_IN_CIRCLE:
      return geoSearchContextStateAdapter.upsertOne(
        {
          id: action.context,
          working: true
        },
        state
      );

    case GeoSearchActionTypes.GEOSEARCH_COMPLETE:
      return geoSearchContextStateAdapter.updateOne(
        {
          id: action.context,
          changes: {
            working: false
          }
        },
        state
      );

    default:
      return state;
  }
};

const reducer: ActionReducer<GeoSearchEntityState> = (
  state: GeoSearchEntityState = geoSearchReducerInitialState,
  action: AllGeoSearchActions
): GeoSearchEntityState => {
  switch (action.type) {
    case GeoSearchActionTypes.GEOSEARCH_COMPLETE:
      return geoSearchAdapter.upsertOne(
        {
          id: action.context,
          results: action.results
        },
        state
      );

    default:
      return state;
  }
};

const reducerMap: ActionReducerMap<GeoSearchState> = {
  contexts: contextReducer,
  geoSearches: reducer
};

export const geoSearchReducer = combineReducers(reducerMap);
