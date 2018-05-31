import { ActionReducer, combineReducers, ActionReducerMap } from '@ngrx/store';

import { IAllHikeContextState, hikeContextStateAdapter, IHikeEntityState, IHikeState, hikeAdapter } from './state';

import { HikeProgramActionTypes, AllHikeActions } from './actions';
import { AllHikeProgramsLoaded } from 'subrepos/gtrack-common-ngx';

export const hikeContextReducerInitialState = hikeContextStateAdapter.getInitialState();
export const hikeReducerInitialState = hikeAdapter.getInitialState();

const contextReducer: ActionReducer<IAllHikeContextState> = (
  state: IAllHikeContextState = hikeContextReducerInitialState,
  action: AllHikeActions
): IAllHikeContextState => {
  switch (action.type) {
    case HikeProgramActionTypes.LOAD_HIKE_PROGRAM:
      return hikeContextStateAdapter.addOne(
        {
          id: action.context,
          loading: true,
          loaded: false
        },
        state
      );

    case HikeProgramActionTypes.HIKE_PROGRAM_LOADED:
      return hikeContextStateAdapter.updateOne(
        {
          id: action.context,
          changes: {
            loading: false,
            loaded: true
          }
        },
        state
      );

    case HikeProgramActionTypes.HIKE_PROGRAM_DELETED: {
      return hikeContextStateAdapter.removeOne(action.context, state);
    }

    default:
      return state;
  }
};

const reducer: ActionReducer<IHikeEntityState> = (
  state: IHikeEntityState = hikeReducerInitialState,
  action: AllHikeActions
): IHikeEntityState => {
  switch (action.type) {
    case HikeProgramActionTypes.HIKE_PROGRAM_LOADED:
      return hikeAdapter.upsertOne(
        {
          id: action.hikeProgram.id,
          changes: action.hikeProgram
        },
        state
      );

    case HikeProgramActionTypes.ALL_HIKE_PROGRAMS_LOADED:
      return hikeAdapter.upsertMany(
        action.hikePrograms.map(hikeProgram => {
          return {
            id: hikeProgram.id,
            changes: hikeProgram
          };
        }),
        state
      );

    case HikeProgramActionTypes.HIKE_PROGRAM_DELETED: {
      return hikeAdapter.removeOne(action.context, state);
    }

    default:
      return state;
  }
};

const reducerMap: ActionReducerMap<IHikeState> = {
  contexts: contextReducer,
  hikes: reducer
};

export const hikeReducer = combineReducers(reducerMap);
