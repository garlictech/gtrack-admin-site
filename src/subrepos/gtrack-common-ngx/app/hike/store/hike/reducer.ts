import { ActionReducer, combineReducers, ActionReducerMap } from '@ngrx/store';
import * as _ from 'lodash';

import {
  IHikeContextEntityState,
  hikeContextStateAdapter,
  IHikeProgramEntityState,
  IHikeState,
  hikeAdapter
} from './state';

import {
  HikeProgramActionTypes,
  AllHikeActions
} from './actions';
import { AllHikeProgramsLoaded } from 'subrepos/gtrack-common-ngx';

const contextReducer: ActionReducer<IHikeContextEntityState> = (
  state: IHikeContextEntityState = hikeContextStateAdapter.getInitialState(),
  action: AllHikeActions
): IHikeContextEntityState => {
  switch (action.type) {
    case HikeProgramActionTypes.LOAD_HIKE_PROGRAM:
      return hikeContextStateAdapter.addOne({
        id: action.context,
        loading: true,
        loaded: false
      }, state);

    case HikeProgramActionTypes.HIKE_PROGRAM_LOADED:
      return hikeContextStateAdapter.updateOne({
        id: action.context,
        changes: {
          loading: false,
          loaded: true
        }
      }, state);

    default:
      return state;
  }
};

const reducer: ActionReducer<IHikeProgramEntityState> = (
  state: IHikeProgramEntityState = hikeAdapter.getInitialState(),
  action: AllHikeActions
): IHikeProgramEntityState => {
  switch (action.type) {
    case HikeProgramActionTypes.HIKE_PROGRAM_LOADED:
      return hikeAdapter.addOne(action.hikeProgram, state);

    case HikeProgramActionTypes.ALL_HIKE_PROGRAMS_LOADED:
      return hikeAdapter.addMany(action.hikePrograms, state);

    default:
      return state;
  }
}

const reducerMap: ActionReducerMap<IHikeState> = {
  contexts: contextReducer,
  hikes: reducer
};

export const hikeReducer = combineReducers(reducerMap);
