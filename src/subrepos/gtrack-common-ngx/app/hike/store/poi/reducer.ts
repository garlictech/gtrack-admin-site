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
      return poiContextStateAdapter.addOne(
        {
          id: action.context,
          loading: true,
          loaded: false,
          saved: false
        },
        state
      );

    case PoiActionTypes.LOAD_POIS:
      return poiContextStateAdapter.addMany(
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
          changes: {
            loading: false,
            loaded: true,
            saved: false
          }
        },
        state
      );

    case PoiActionTypes.ALL_POI_LOADED:
      return poiContextStateAdapter.upsertMany(
        action.contexts.map(context => {
          return {
            id: context,
            changes: {
              loading: false,
              loaded: true,
              saved: false
            }
          };
        }),
        state
      );

    case PoiActionTypes.POI_SAVED:
      return poiContextStateAdapter.upsertOne(
        {
          id: action.context,
          changes: {
            saved: true
          }
        },
        state
      );

    case PoiActionTypes.POI_MODIFIED:
      return poiContextStateAdapter.upsertOne(
        {
          id: action.context,
          changes: {
            saved: false
          }
        },
        state
      );

    case PoiActionTypes.POI_DELETED: {
      return poiContextStateAdapter.removeOne(action.context, state);
    }

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
      return poiAdapter.upsertOne(
        {
          id: action.poi.id,
          changes: action.poi
        },
        state
      );

    case PoiActionTypes.ALL_POI_LOADED:
      return poiAdapter.upsertMany(
        action.pois.map(poi => {
          return {
            id: poi.id,
            changes: poi
          };
        }),
        state
      );

    case PoiActionTypes.POI_DELETED: {
      return poiAdapter.removeOne(action.context, state);
    }

    default:
      return state;
  }
};

const reducerMap: ActionReducerMap<IPoiState> = {
  contexts: contextReducer,
  pois: reducer
};

export const poiReducer = combineReducers(reducerMap);
