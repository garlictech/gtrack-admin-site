import { Action, ActionReducer, ActionReducerMap, combineReducers } from '@ngrx/store';
import { IEditedGTrackPoiState } from '../state';
import { editedGTrackPoiActions } from '../index';

import * as _ from 'lodash';

export const initialEditedGTrackPoiState: IEditedGTrackPoiState = {
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

export const editedGTrackPoiReducer: ActionReducer<IEditedGTrackPoiState> = (
  state = initialEditedGTrackPoiState,
  action: editedGTrackPoiActions.AllEditedGTrackPoiActions
): IEditedGTrackPoiState => {
  let newState = _.cloneDeep(state);

  switch (action.type) {
    case editedGTrackPoiActions.ADD_NEW_TRANSLATED_POI_DESCRIPTION: {
      newState.data.description[action.languageKey] = action.content;
      newState.dirty = true;
      return newState;
    }

    case editedGTrackPoiActions.DELETE_TRANSLATED_POI_DESCRIPTION: {
      newState.data.description = _.omit(newState.data.description, action.languageKey);
      newState.dirty = true;
      return newState;
    }

    case editedGTrackPoiActions.SAVE_POI: {
      newState.working = 'saving...';
      newState.failed = null;
      return newState;
    }

    case editedGTrackPoiActions.POI_SAVE_SUCCESS: {
      newState.working = null;
      newState.failed = null;
      newState.dirty = false;
      return newState;
    }

    case editedGTrackPoiActions.POI_SAVE_FAILED: {
      newState.working = null;
      newState.failed = action.error;
      return newState;
    }

    case editedGTrackPoiActions.LOAD_POI: {
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
