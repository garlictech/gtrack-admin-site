import { Action, ActionReducer, ActionReducerMap, combineReducers } from '@ngrx/store';
import * as _ from 'lodash';

import { IHikeProgramState } from '../state/hike-program';

import * as HikeProgramActions from '../actions/hike-program';

export const initialState: IHikeProgramState = {
  data: {
    distance: 0,
    isRoundTrip: false,
    uphill: 0,
    downhill: 0,
    time: 0,
    score: 0,
    location: '',
    difficulty: 1,
    backgroundImageUrls: [],
    routeId: '',
    description: { en_US: { title: 'a new hike' } },
    pois: [],
    stops: []
  },
  dirty: false,
  working: null,
  failed: null
};

export function hikeProgramReducer(state = initialState, action: HikeProgramActions.Actions): IHikeProgramState {
  let newState = _.cloneDeep(state);
  switch (action.type) {
    case HikeProgramActions.ADD_NEW_TRANSLATED_DESCRIPTION: {
      newState.data.description[action.languageKey] = action.content;
      newState.dirty = true;
      return newState;
    }

    case HikeProgramActions.DELETE_TRANSLATED_DESCRIPTION: {
      newState.data.description = _.omit(newState.data.description, action.languageKey);
      newState.dirty = true;
      return newState;
    }

    case HikeProgramActions.SAVE: {
      newState.working = 'saving...';
      newState.failed = null;
      return newState;
    }

    case HikeProgramActions.SAVE_SUCCESS: {
      newState.working = null;
      newState.failed = null;
      newState.dirty = false;
      return newState;
    }

    case HikeProgramActions.SAVE_FAILED: {
      newState.working = null;
      newState.failed = action.error;
      return newState;
    }

    default:
      return state;
  }
}
