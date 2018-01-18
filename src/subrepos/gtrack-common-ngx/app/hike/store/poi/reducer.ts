import { ActionReducer, combineReducers, ActionReducerMap } from '@ngrx/store';
import * as _ from 'lodash';

import {
  IAllPoiContextState,
  poiContextStateAdapter,
  IPoiEntityState,
  IPoiState,
  poiAdapter
} from './state';

import {
  PoiActionTypes,
  AllPoiActions
} from './actions';

const contextReducer: ActionReducer<IAllPoiContextState> = (
  state: IAllPoiContextState = poiContextStateAdapter.getInitialState(),
  action: AllPoiActions
): IAllPoiContextState => {
  switch (action.type) {
    case PoiActionTypes.LOAD_POI:
      return poiContextStateAdapter.addOne({
        id: action.context,
        loading: true,
        loaded: false
      }, state);

    case PoiActionTypes.LOAD_POIS:
      return poiContextStateAdapter.addMany(action.contexts.map(context => {
        return {
          id: context,
          loading: true,
          loaded: false
        };
      }), state);

    case PoiActionTypes.POI_LOADED:
      return poiContextStateAdapter.updateOne({
        id: action.context,
        changes: {
          loading: false,
          loaded: true
        }
      }, state);

    case PoiActionTypes.ALL_POI_LOADED:
      return poiContextStateAdapter.updateMany(action.contexts.map(context => {
        return {
          id: context,
          changes: {
            loading: false,
            loaded: true
          }
        };
      }), state);

    default:
      return state;
  }
};

const reducer: ActionReducer<IPoiEntityState> = (
  state: IPoiEntityState = poiAdapter.getInitialState(),
  action: AllPoiActions
): IPoiEntityState => {
  switch (action.type) {
    case PoiActionTypes.POI_LOADED:
      return poiAdapter.addOne(action.poi, state);

    case PoiActionTypes.ALL_POI_LOADED:
    return poiAdapter.addMany(action.pois, state);

    default:
      return state;
  }
}

const reducerMap: ActionReducerMap<IPoiState> = {
  contexts: contextReducer,
  pois: reducer
};

export const poiReducer = combineReducers(reducerMap);
