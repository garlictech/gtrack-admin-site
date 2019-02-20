// tslint:disable:only-arrow-functions no-small-switch
import _cloneDeep from 'lodash-es/cloneDeep';
import _omit from 'lodash-es/omit';
import { EObjectState, ETextualDescriptionType } from 'subrepos/provider-client';

import { editedGTrackPoiActions } from '../actions';
import { EditedGTrackPoiState } from '../state';

export const initialEditedGTrackPoiState: EditedGTrackPoiState = {
  data: {
    id: '',
    timestamp: 0,
    elevation: 0,
    lat: 0,
    lon: 0,
    description: {
      en_US: {
        title: 'A new poi',
        type: ETextualDescriptionType.markdown
      }
    },
    backgroundImages: [],
    types: [],
    state: EObjectState.draft
  },
  dirty: false,
  working: undefined,
  failed: undefined
};

export function editedGTrackPoiReducer(
  state = initialEditedGTrackPoiState,
  action: editedGTrackPoiActions.AllEditedGTrackPoiActions
): EditedGTrackPoiState {
  const newState = _cloneDeep(state);

  switch (action.type) {
    case editedGTrackPoiActions.ADD_NEW_TRANSLATED_POI_DESCRIPTION: {
      newState.data.description[action.languageKey] = action.content;
      newState.dirty = true;

      return newState;
    }

    case editedGTrackPoiActions.DELETE_TRANSLATED_POI_DESCRIPTION: {
      newState.data.description = _omit(newState.data.description, action.languageKey);
      newState.dirty = true;

      return newState;
    }

    case editedGTrackPoiActions.SAVE_POI: {
      newState.working = 'saving...';
      newState.failed = undefined;

      return newState;
    }

    case editedGTrackPoiActions.POI_SAVE_SUCCESS: {
      newState.working = undefined;
      newState.failed = undefined;
      newState.dirty = false;

      return newState;
    }

    case editedGTrackPoiActions.POI_SAVE_FAILED: {
      newState.working = undefined;
      newState.failed = action.error;

      return newState;
    }

    case editedGTrackPoiActions.LOAD_POI: {
      newState.working = undefined;
      newState.failed = undefined;
      newState.dirty = false;
      newState.data = action.data;

      return newState;
    }

    case editedGTrackPoiActions.ADD_POI_BACKGROUND_IMAGE: {
      newState.dirty = true;
      newState.data.backgroundImages = [...((state.data.backgroundImages as any) || []), action.imageData];

      return newState;
    }

    case editedGTrackPoiActions.REMOVE_POI_BACKGROUND_IMAGE: {
      newState.dirty = true;
      newState.data.backgroundImages = ((newState.data.backgroundImages as any) || []).filter(
        img => img.original.url !== action.origUrl
      );

      return newState;
    }

    default:
      return state;
  }
}
