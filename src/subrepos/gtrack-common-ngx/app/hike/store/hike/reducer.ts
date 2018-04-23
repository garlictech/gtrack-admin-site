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
          loaded: false,
          saved: false
        },
        state
      );

    case HikeProgramActionTypes.HIKE_PROGRAM_LOADED:
      return hikeContextStateAdapter.updateOne(
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

    case HikeProgramActionTypes.HIKE_PROGRAM_SAVED:
      return hikeContextStateAdapter.updateOne(
        {
          id: action.context,
          changes: {
            saved: true
          }
        },
        state
      );

    case HikeProgramActionTypes.HIKE_PROGRAM_MODIFIED:
      return hikeContextStateAdapter.upsertOne(
        {
          id: action.context,
          changes: {
            saved: false
          }
        },
        state
      );

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
      return hikeAdapter.upsertOne({
        id: action.hikeProgram.id,
        changes: action.hikeProgram
      }, state);

    case HikeProgramActionTypes.ALL_HIKE_PROGRAMS_LOADED:
      return hikeAdapter.upsertMany(action.hikePrograms.map(hikeProgram => {
        return {
          id: hikeProgram.id,
          changes: hikeProgram
        }
      }), state);

    default:
      return state;
  }
};

const reducerMap: ActionReducerMap<IHikeState> = {
  contexts: contextReducer,
  hikes: reducer
};

export const hikeReducer = combineReducers(reducerMap);
