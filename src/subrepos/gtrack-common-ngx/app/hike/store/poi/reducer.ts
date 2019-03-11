// tslint:disable:only-arrow-functions
import { ActionReducer, ActionReducerMap, combineReducers } from '@ngrx/store';
import { AllPoiActions, PoiActionTypes } from './actions';
import { AllPoiContextState, poiAdapter, poiContextStateAdapter, PoiEntityState, PoiState } from './state';

export const poiContextReducerInitialState = poiContextStateAdapter.getInitialState();
export const poiReducerInitialState = poiAdapter.getInitialState();

const contextReducer: ActionReducer<AllPoiContextState> = (
  state: AllPoiContextState = poiContextReducerInitialState,
  action: AllPoiActions
): AllPoiContextState => {
  switch (action.type) {
    case PoiActionTypes.LOAD_POI:
      return poiContextStateAdapter.upsertOne(
        {
          id: action.context,
          loading: true,
          loaded: false,
          saved: false
        },
        state
      );

    case PoiActionTypes.LOAD_POIS:
      return poiContextStateAdapter.upsertMany(
        action.contexts.map(context => ({
          id: context,
          loading: true,
          loaded: false,
          saved: false
        })),
        state
      );

    case PoiActionTypes.POI_LOADED:
      return poiContextStateAdapter.upsertOne(
        {
          id: action.context,
          loading: false,
          loaded: true,
          saved: false
        },
        state
      );

    case PoiActionTypes.ALL_POI_LOADED:
      return poiContextStateAdapter.upsertMany(
        action.contexts.map(context => ({
          id: context,
          loading: false,
          loaded: true,
          saved: false
        })),
        state
      );

    case PoiActionTypes.POI_SAVED:
      return poiContextStateAdapter.upsertOne(
        {
          id: action.context,
          saved: true,
          loading: false,
          loaded: true
        },
        state
      );

    case PoiActionTypes.POI_MODIFIED:
      return poiContextStateAdapter.upsertOne(
        {
          id: action.context,
          saved: false,
          loading: false,
          loaded: true
        },
        state
      );

    case PoiActionTypes.POI_MERGED_SUCCESSFULLY:
      return poiContextStateAdapter.removeMany(action.mergedIds, state);

    default:
      return state;
  }
};

const reducer: ActionReducer<PoiEntityState> = (
  state: PoiEntityState = poiReducerInitialState,
  action: AllPoiActions
): PoiEntityState => {
  switch (action.type) {
    case PoiActionTypes.POI_LOADED:
      return poiAdapter.upsertOne(action.poi, state);

    case PoiActionTypes.ALL_POI_LOADED:
      return poiAdapter.upsertMany(action.pois, state);

    case PoiActionTypes.POI_DELETED:
      return poiAdapter.removeOne(action.context, state);

    case PoiActionTypes.POI_MERGED_SUCCESSFULLY:
      return poiAdapter.removeMany(action.mergedIds, state);

    default:
      return state;
  }
};

const reducerMap: ActionReducerMap<PoiState> = {
  contexts: contextReducer,
  pois: reducer
};

export const poiReducer = combineReducers(reducerMap);
