import { Action, ActionReducer, ActionReducerMap, combineReducers } from '@ngrx/store';
import { IEditedHikeProgramState } from '../state';
import { editedHikeProgramActions } from '../index';

import * as _ from 'lodash';

export const initialEditedHikeProgramState: IEditedHikeProgramState = {
  data: {
    id: '',
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
    stops: [],
    timestamp: 0
  },
  dirty: false,
  working: null,
  failed: null
};

export const editedHikeProgramReducer: ActionReducer<IEditedHikeProgramState> = (
  state = initialEditedHikeProgramState,
  action: editedHikeProgramActions.AllEditedHikeProgramActions
): IEditedHikeProgramState => {
  let newState = _.cloneDeep(state);
  switch (action.type) {
    case editedHikeProgramActions.RESET_HIKE_PROGRAM: {
      return initialEditedHikeProgramState;
    }

    case editedHikeProgramActions.ADD_NEW_TRANSLATED_HIKE_DESCRIPTION: {
      newState.data.description[action.languageKey] = action.content;
      newState.dirty = true;
      return newState;
    }

    case editedHikeProgramActions.DELETE_TRANSLATED_HIKE_DESCRIPTION: {
      newState.data.description = _.omit(newState.data.description, action.languageKey);
      newState.dirty = true;
      return newState;
    }

    case editedHikeProgramActions.SAVE_HIKE_PROGRAM: {
      newState.working = 'saving...';
      newState.failed = null;
      return newState;
    }

    case editedHikeProgramActions.HIKE_PROGRAM_SAVE_SUCCESS: {
      newState.working = null;
      newState.failed = null;
      newState.dirty = false;
      return newState;
    }

    case editedHikeProgramActions.HIKE_PROGRAM_SAVE_FAILED: {
      newState.working = null;
      newState.failed = action.error;
      return newState;
    }

    case editedHikeProgramActions.ADD_HIKE_PROGRAM_DETAILS: {
      newState.data = _.assign(newState.data, action.details);
      if (action.setDirty) {
        newState.dirty = true;
      }

      return newState;
    }

    case editedHikeProgramActions.ADD_STOP: {
      newState.dirty = true;
      newState.data.stops = _.union(state.data.stops, [action.stop])
      return newState;
    }

    case editedHikeProgramActions.SET_STOPS: {
      newState.dirty = true;
      newState.data.stops = _.cloneDeep(action.stops)
      return newState;
    }

    case editedHikeProgramActions.REMOVE_STOP_BY_POI_ID: {
      newState.dirty = true;
      newState.data.stops = newState.data.stops.filter(s => action.poiIds.indexOf(s.poiId) < 0)
      return newState;
    }

    default:
      return state;
  }
}
