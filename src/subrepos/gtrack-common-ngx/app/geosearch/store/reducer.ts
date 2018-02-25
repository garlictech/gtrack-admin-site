import { ActionReducer, combineReducers, ActionReducerMap } from '@ngrx/store';
import * as _ from 'lodash';

import {
  IAllGeoSearchContextState,
  IGeoSearchContextState,
  IGeoSearchEntityState,
  IGeoSearchState,
  geoSearchAdapter,
  geoSearchContextStateAdapter
} from './state';

import {
  AllGeoSearchActions,
  GeoSearchActionTypes
} from './actions';

export const geoSearchContextReducerInitialState = geoSearchContextStateAdapter.getInitialState();
export const geoSearchReducerInitialState = geoSearchAdapter.getInitialState();

const contextReducer: ActionReducer<IAllGeoSearchContextState> = (
  state: IAllGeoSearchContextState = geoSearchContextReducerInitialState,
  action: AllGeoSearchActions
): IAllGeoSearchContextState => {
  switch (action.type) {
    case GeoSearchActionTypes.SEARCH_IN_BOX:
    case GeoSearchActionTypes.SEARCH_IN_CIRCLE:
      return geoSearchContextStateAdapter.addOne({
        id: action.context,
        working: true
      }, state);

    case GeoSearchActionTypes.GEOSEARCH_COMPLETE:
      return geoSearchContextStateAdapter.updateOne({
        id: action.context,
        changes: {
          working: false,
        }
      }, state);

    default:
      return state;
  }
};

const reducer: ActionReducer<IGeoSearchEntityState> = (
  state: IGeoSearchEntityState = geoSearchReducerInitialState,
  action: AllGeoSearchActions
): IGeoSearchEntityState => {
  switch (action.type) {
    case GeoSearchActionTypes.GEOSEARCH_COMPLETE:
      return geoSearchAdapter.addOne({
        id: action.context,
        results: action.results
      }, state);

    default:
      return state;
  }
}

const reducerMap: ActionReducerMap<IGeoSearchState> = {
  contexts: contextReducer,
  geoSearches: reducer
};

export const geoSearchReducer = combineReducers(reducerMap);
