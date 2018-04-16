import { Action, ActionReducer, ActionReducerMap, combineReducers } from '@ngrx/store';
import * as _ from 'lodash';

import { IEditedHikeProgramState } from '../state/edited-hike-program';

import * as HikeProgramActions from '../actions/edited-hike-program';

export const initialState: IEditedHikeProgramState = {
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

export function editedHikeProgramReducer(
  state = initialState,
  action: HikeProgramActions.Actions
): IEditedHikeProgramState {
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

    case HikeProgramActions.ADD_DETAILS: {
      newState.dirty = true;
      newState.data = _.assign(newState.data, action.details);
      return newState;
    }

    default:
      return state;
  }
}
