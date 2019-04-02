// tslint:disable:only-arrow-functions
import { ActionReducer, ActionReducerMap, combineReducers } from '@ngrx/store';
import { AllHikeActions, HikeProgramActionTypes } from './actions';
import { AllHikeContextState, hikeAdapter, hikeContextStateAdapter, HikeEntityState, HikeState } from './state';

export const hikeContextReducerInitialState = hikeContextStateAdapter.getInitialState();
export const hikeReducerInitialState = hikeAdapter.getInitialState();

const contextReducer: ActionReducer<AllHikeContextState> = (
  state: AllHikeContextState = hikeContextReducerInitialState,
  action: AllHikeActions
): AllHikeContextState => {
  switch (action.type) {
    case HikeProgramActionTypes.LOAD_HIKE_PROGRAM:
      return hikeContextStateAdapter.upsertOne(
        {
          id: action.context,
          loading: true,
          loaded: false
        },
        state
      );

    case HikeProgramActionTypes.HIKE_PROGRAM_LOADED:
      return hikeContextStateAdapter.upsertOne(
        {
          id: action.context,
          loading: false,
          loaded: true
        },
        state
      );

    default:
      return state;
  }
};

const reducer: ActionReducer<HikeEntityState> = (
  state: HikeEntityState = hikeReducerInitialState,
  action: AllHikeActions
): HikeEntityState => {
  switch (action.type) {
    case HikeProgramActionTypes.HIKE_PROGRAM_LOADED:
      return hikeAdapter.upsertOne(action.hikeProgram, state);

    case HikeProgramActionTypes.HIKE_PROGRAM_REVERSED:
      return hikeAdapter.updateOne(
        {
          id: action.context,
          changes: action.hikeProgram
        },
        state
      );

    case HikeProgramActionTypes.ALL_HIKE_PROGRAMS_LOADED:
      return hikeAdapter.upsertMany(action.hikePrograms, state);

    default:
      return state;
  }
};

const reducerMap: ActionReducerMap<HikeState> = {
  contexts: contextReducer,
  hikes: reducer
};

export const hikeReducer = combineReducers(reducerMap);
