import { ActionReducer, combineReducers, ActionReducerMap } from '@ngrx/store';

import { IAllPoiContextState, poiContextStateAdapter, IPoiEntityState, IPoiState, poiAdapter } from './state';

import { PoiActionTypes, AllPoiActions } from './actions';

export const poiContextReducerInitialState = poiContextStateAdapter.getInitialState();
export const poiReducerInitialState = poiAdapter.getInitialState();

const contextReducer: ActionReducer<IAllPoiContextState> = (
  state: IAllPoiContextState = poiContextReducerInitialState,
  action: AllPoiActions
): IAllPoiContextState => {
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
        action.contexts.map(context => {
          return {
            id: context,
            loading: true,
            loaded: false,
            saved: false
          };
        }),
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
        action.contexts.map(context => {
          return {
            id: context,
            loading: false,
            loaded: true,
            saved: false
          };
        }),
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

const reducer: ActionReducer<IPoiEntityState> = (
  state: IPoiEntityState = poiReducerInitialState,
  action: AllPoiActions
): IPoiEntityState => {
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

const reducerMap: ActionReducerMap<IPoiState> = {
  contexts: contextReducer,
  pois: reducer
};

export const poiReducer = combineReducers(reducerMap);
