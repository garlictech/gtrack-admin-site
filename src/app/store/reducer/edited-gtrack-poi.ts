import { Action, ActionReducer, ActionReducerMap, combineReducers } from '@ngrx/store';
import * as _ from 'lodash';

import { IEditedGtrackPoiState } from '../state/edited-gtrack-poi';

import * as EditedPoiActions from '../actions/edited-gtrack-poi';

export const initialState: IEditedGtrackPoiState = {
  data: {
    id: '',
    timestamp: 0,
    elevation: 0,
    lat: 0,
    lon: 0,
    description: { en_US: { title: 'A new poi' } },
    types: []
  },
  dirty: false,
  working: null,
  failed: null
};

export function editedGtrackPoiReducer(state = initialState, action: EditedPoiActions.Actions): IEditedGtrackPoiState {
  let newState = _.cloneDeep(state);
  switch (action.type) {
    case EditedPoiActions.ADD_NEW_TRANSLATED_DESCRIPTION: {
      newState.data.description[action.languageKey] = action.content;
      newState.dirty = true;
      return newState;
    }

    case EditedPoiActions.DELETE_TRANSLATED_DESCRIPTION: {
      newState.data.description = _.omit(newState.data.description, action.languageKey);
      newState.dirty = true;
      return newState;
    }

    case EditedPoiActions.SAVE: {
      newState.working = 'saving...';
      newState.failed = null;
      return newState;
    }

    case EditedPoiActions.SAVE_SUCCESS: {
      newState.working = null;
      newState.failed = null;
      newState.dirty = false;
      return newState;
    }

    case EditedPoiActions.SAVE_FAILED: {
      newState.working = null;
      newState.failed = action.error;
      return newState;
    }

    case EditedPoiActions.LOAD_POI: {
      newState.working = null;
      newState.failed = null;
      newState.dirty = false;
      newState.data = action.data;
      return newState;
    }

    default:
      return state;
  }
}
